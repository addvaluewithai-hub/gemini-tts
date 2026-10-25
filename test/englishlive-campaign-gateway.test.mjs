import {test} from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {parseEvent,send} from "../src/issue-gateway.mjs";
import {validateEnglishliveCampaignPlan,compileEnglishliveCampaign} from "../src/englishlive-campaign-gateway.mjs";

const PIN="8150af60d71eaa2eb56b5213b7cba6af9f008bbe";
const ROOT="campaigns/englishlive-b1-listening/";
const pilot=[
  "b1-change-a-hotel-booking-dates",
  "b1-change-a-hotel-booking-extra-night",
  "b1-change-a-hotel-booking-friend",
  "b1-explain-a-mix-up-cafe",
  "b1-explain-a-mix-up-room"
];
const slugs=[...pilot,"b1-keep-a-conversation-going-lunch",
  ...Array.from({length:18},(_,i)=>"b1-test-"+String(i+1).padStart(2,"0"))];
const sha=s=>createHash("sha256").update(s,"utf8").digest("hex");
const words=t=>t.trim().split(/\s+/u).length;
const ending=". American English accent. Clear, natural pace for B1 English learners, not rushed.";
const plan={schemaVersion:1,command:"tts.issue.campaign",mode:"dry-run",
  sourceRepo:"addvaluewithai-hub/gemini-tts",sourceCommit:PIN,group:1,slugs:pilot.slice(0,2)};
const issueEvent=cfg=>({action:"opened",repository:{full_name:"addvaluewithai-hub/gemini-tts"},
  issue:{number:321,state:"open",user:{login:"addvaluewithai-hub"},
    body:"~~~json\n"+JSON.stringify(cfg)+"\n~~~"},sender:{login:"addvaluewithai-hub"}});

function fixture() {
  const files={},entries=[];
  for (const slug of slugs) {
    const turns=[
      {speaker:"Partner",text:"Hello, can you help me with a booking?",style:"warm and helpful"+ending},
      {speaker:"Learner",text:"Yes, please. Tell me what needs changing.",style:"friendly and clear"+ending}
    ];
    if (slug==="b1-explain-a-mix-up-room")
      for(const t of turns)t.style+=" Make thirteen and thirty clearly different: thir-TEEN, THIR-ty.";
    const digest=sha(turns.map(t=>t.speaker+": "+t.text).join("\n"));
    const w=turns.reduce((n,t)=>n+words(t.text),0);
    const voices=slug==="b1-keep-a-conversation-going-lunch"
      ? {Partner:"Autonoe",Learner:"Iapetus"} : {Partner:"Charon",Learner:"Aoede"};
    const job_id="englishlive-"+slug+"-r3-"+digest.slice(0,8);
    const entry={slug,job_id,path:"jobs/"+slug+".json",words:w,sha256:digest,voices};
    entries.push(entry);
    files[ROOT+entry.path]={job_id,lesson:{slug,revision:3,sha256:digest,words:w,turns:2},
      request:{turns,speakers:{...voices},routing:"explicit",model:"gemini-3.8-flash-tts",
        allow_model_fallback:false,format:"wav",sample_rate:24000,temperature:1,
        transcript:{language_codes:["en-US"],write_vtt:true},
        metadata:{app:"englishlive",campaign:"englishlive-b1-listening",
          slug,revision:3,sha256:digest}}};
  }
  const manifest={schemaVersion:1,campaign:"englishlive-b1-listening",
    app:"addvaluewithai-hub/englishlive",
    totalWords:entries.reduce((n,x)=>n+x.words,0),jobs:entries,
    issues:[slugs.slice(0,5),slugs.slice(5,10),slugs.slice(10,15),
      slugs.slice(15,20),slugs.slice(20)]};
  files[ROOT+"campaign.json"]=manifest;
  return {files,manifest,entries,read:async(_plan,path)=>{
    if (!Object.hasOwn(files,path)) throw Error("unexpected source path "+path);
    return files[path];
  }};
}

test("only the owner and the immutable Englotti group are allowed",()=>{
  assert.equal(parseEvent(issueEvent(plan)).group,1);
  assert.throws(()=>parseEvent({...issueEvent(plan),sender:{login:"someone-else"}}),/Only owner/);
  assert.throws(()=>validateEnglishliveCampaignPlan({...plan,sourceRepo:"other/repo"}),/pinned/);
  assert.throws(()=>validateEnglishliveCampaignPlan({...plan,sourceCommit:"a".repeat(40)}),/pinned/);
  assert.throws(()=>validateEnglishliveCampaignPlan({...plan,group:6}),/1 to 5/);
  assert.throws(()=>validateEnglishliveCampaignPlan({...plan,group:1,jobs:[]}),/scope/);
});

test("strict scope rejects all accepted old pilot jobs and unauthorized group-2 subsets",()=>{
  assert.throws(()=>validateEnglishliveCampaignPlan({...plan,slugs:pilot}),/two revised/);
  assert.throws(()=>validateEnglishliveCampaignPlan({...plan,slugs:pilot.slice(1,3)}),/two revised/);
  assert.throws(()=>validateEnglishliveCampaignPlan({...plan,group:2,slugs:pilot.slice(0,2)}),/complete manifest/);
  assert.doesNotThrow(()=>validateEnglishliveCampaignPlan({...plan,group:2,slugs:undefined}));
});

test("only two revised hotel requests dispatch unchanged; no duplicate old pilot",async()=>{
  const x=fixture(),parsed=parseEvent(issueEvent(plan));
  const items=await compileEnglishliveCampaign(parsed,x.read);
  assert.equal(items.length,2);
  assert.deepEqual(items.map(j=>j.lesson),pilot.slice(0,2));
  assert.strictEqual(items[0].request,x.files[ROOT+"jobs/"+pilot[0]+".json"].request);
  await assert.rejects(send(parsed,items,"token",()=>{throw Error("paid call");}),/Dry-run/);
  const calls=[];
  await send({...parsed,mode:"produce"},items,"fake-token",
    async(endpoint,token,method,body)=>{calls.push({endpoint,body});return {};});
  const dispatches=calls.filter(c=>c.endpoint==="/dispatches");
  assert.equal(dispatches.length,2);
  for (let i=0;i<2;i++) {
    assert.equal(dispatches[i].body.client_payload.job_id,items[i].id);
    assert.strictEqual(dispatches[i].body.client_payload.request,items[i].request);
  }
});

test("Nadia lunch dialogue has its revised per-lesson voice cast",async()=>{
  const x=fixture();
  const items=await compileEnglishliveCampaign({...plan,group:2,slugs:undefined},x.read);
  const lunch=items.find(x=>x.lesson==="b1-keep-a-conversation-going-lunch");
  assert.ok(lunch);
  assert.deepEqual(lunch.request.speakers,{Partner:"Autonoe",Learner:"Iapetus"});
  x.files[ROOT+"jobs/b1-keep-a-conversation-going-lunch.json"].request.speakers.Partner="Puck";
  await assert.rejects(compileEnglishliveCampaign({...plan,group:2,slugs:undefined},x.read),/voice/);
});

test("special room pronunciation remains intact after learner-pace sentence",async()=>{
  const x=fixture(),items=await compileEnglishliveCampaign(plan,x.read);
  const room=items.find(j=>j.lesson==="b1-explain-a-mix-up-room");
  assert.ok(room);
  assert.ok(room.request.turns.every(t=>t.style.includes("thir-TEEN, THIR-ty.")));
  x.files[ROOT+"jobs/b1-explain-a-mix-up-room.json"].request.turns[0].style="fast";
  await assert.rejects(compileEnglishliveCampaign(plan,x.read),/Invalid or overridden/);
});

test("group 5 has four jobs and no overlap with pilot",async()=>{
  const x=fixture(),items=await compileEnglishliveCampaign({...plan,group:5,slugs:undefined},x.read);
  assert.equal(items.length,4);
  assert.ok(items.every(j=>!pilot.includes(j.lesson)));
});

test("tampered manifest group, totals, voices, paths and duplicate jobs fail closed",async()=>{
  for (const mutate of [
    x=>x.manifest.issues[0].reverse(),
    x=>x.manifest.issues[2].push(x.manifest.issues[0][0]),
    x=>x.manifest.totalWords++,
    x=>x.entries[0].path="../wrong.json",
    x=>x.entries[0].voices.Partner="Kore",
    x=>x.entries[0].voices.Partner="voice_custom",
    x=>x.entries[1].job_id=x.entries[0].job_id
  ]) {
    const x=fixture();mutate(x);
    await assert.rejects(compileEnglishliveCampaign(plan,x.read));
  }
});

test("tampered script, SHA, word count, settings, voice, identity or metadata fail closed",async()=>{
  const variants=[
    job=>{job.request.turns[0].text+=" extra";},
    job=>{job.lesson.sha256="0".repeat(64);},
    job=>{job.lesson.words++;},
    job=>{job.request.model="gemini-3.8-flash-lite-tts";},
    job=>{job.request.turns[0].style="quick and rushed";},
    job=>{job.request.allow_model_fallback=true;},
    job=>{job.request.speakers.Partner="Kore";},
    job=>{job.request.turns[0].voice="Kore";},
    job=>{job.request.format="mp3";},
    job=>{job.request.sample_rate=16000;},
    job=>{job.request.transcript.language_codes=["en-GB"];},
    job=>{job.request.transcript.write_vtt=false;},
    job=>{job.request.metadata.slug="b1-different";},
    job=>{job.job_id="some-other-job";},
    job=>{job.request.turns[1].speaker="Other";}
  ];
  for (const mutate of variants) {
    const x=fixture();mutate(x.files[ROOT+"jobs/"+pilot[0]+".json"]);
    await assert.rejects(compileEnglishliveCampaign(plan,x.read));
  }
});
