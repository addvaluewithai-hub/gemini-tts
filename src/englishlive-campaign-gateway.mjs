// Fixed-scope, pinned-source gateway for Englotti's 24 B1 listening dialogues.
// Pure validation only: this module neither dispatches nor alters a TTS request.
import {createHash} from "node:crypto";

const SOURCE="addvaluewithai-hub/gemini-tts";
const PIN="a96a7b29dff919e294c7ca4ce5a185a79fb849d7";
const ROOT="campaigns/englishlive-b1-listening/";
const CAMPAIGN="englishlive-b1-listening";
const PILOT=[
  "b1-change-a-hotel-booking-dates",
  "b1-change-a-hotel-booking-extra-night",
  "b1-change-a-hotel-booking-friend",
  "b1-explain-a-mix-up-cafe",
  "b1-explain-a-mix-up-room"
];
const sha=s=>createHash("sha256").update(s,"utf8").digest("hex");
const fail=s=>{throw Error(s);};
const object=o=>o!==null&&typeof o==="object"&&!Array.isArray(o);
const slugOK=s=>typeof s==="string"&&/^b1-[a-z0-9-]+$/.test(s);
const STUDIO_VOICES=new Set(("Zephyr Puck Charon Kore Fenrir Leda Orus Aoede Callirrhoe "+
  "Autonoe Enceladus Iapetus Umbriel Algieba Despina Erinome Algenib Rasalgethi "+
  "Laomedeia Achernar Alnilam Schedar Gacrux Pulcherrima Achird Zubenelgenubi "+
  "Vindemiatrix Sadachbia Sadaltager Sulafat").split(" "));
const B1_STYLE_END=". American English accent. Clear, natural pace for B1 English learners, not rushed.";
const sameVoices=(actual,expected)=>object(actual)&&
  Object.keys(actual).sort().join(",")==="Learner,Partner"&&
  actual.Partner===expected.Partner&&actual.Learner===expected.Learner;

export function validateEnglishliveCampaignPlan(cfg) {
  if (cfg.command!=="tts.issue.campaign" || cfg.sourceRepo!==SOURCE ||
      cfg.sourceCommit!==PIN) fail("Expected the approved pinned Englotti B1 source commit");
  if (!Number.isInteger(cfg.group)||cfg.group<1||cfg.group>5)
    fail("Englotti campaign group must be 1 to 5");
  if (cfg.jobs!==undefined||cfg.slugs!==undefined||cfg.job!==undefined||
      cfg.clips!==undefined||cfg.courseId!==undefined||cfg.lessonId!==undefined)
    fail("Conflicting or unapproved Englotti campaign scope");
}

function validateManifest(manifest) {
  if (!object(manifest)||manifest.schemaVersion!==1||
      manifest.campaign!==CAMPAIGN||manifest.app!=="addvaluewithai-hub/englishlive"||
      !Array.isArray(manifest.jobs)||manifest.jobs.length!==24||
      !Array.isArray(manifest.issues)||manifest.issues.length!==5)
    fail("Unexpected Englotti campaign manifest");
  const jobs=new Map(),ids=new Set();let total=0;
  for (const entry of manifest.jobs) {
    if (!object(entry)||!slugOK(entry.slug)||jobs.has(entry.slug)||
        entry.path!=="jobs/"+entry.slug+".json"||
        !Number.isInteger(entry.words)||entry.words<1||
        !/^[a-f0-9]{64}$/.test(entry.sha256||"")||
        typeof entry.job_id!=="string"||
        !/^englishlive-b1-[a-z0-9-]+-r[0-9]+-[a-f0-9]{8}$/.test(entry.job_id)||
        ids.has(entry.job_id)||!object(entry.voices)||
        Object.keys(entry.voices).sort().join(",")!=="Learner,Partner"||
        !STUDIO_VOICES.has(entry.voices.Partner)||
        !STUDIO_VOICES.has(entry.voices.Learner)||
        entry.voices.Partner===entry.voices.Learner)
      fail("Untrusted Englotti job manifest entry");
    jobs.set(entry.slug,entry);ids.add(entry.job_id);total+=entry.words;
  }
  if (total!==manifest.totalWords) fail("Campaign total word count mismatch");
  const grouped=new Set();
  for (let i=0;i<manifest.issues.length;i++) {
    const group=manifest.issues[i];
    if (!Array.isArray(group)||group.length<1||group.length>5)
      fail("Campaign Issue must contain 1 to 5 slugs");
    if (i===0&&group.join("\n")!==PILOT.join("\n"))
      fail("Pilot Issue must contain the five approved hotel/cafe/room lessons");
    for (const slug of group) {
      if (!jobs.has(slug)||grouped.has(slug))
        fail("Duplicate or unlisted campaign Issue slug");
      grouped.add(slug);
    }
  }
  if (grouped.size!==jobs.size) fail("Campaign Issue groups must cover all 24 jobs");
  return jobs;
}

function validateJob(entry,job) {
  if (!object(job)||job.job_id!==entry.job_id||
      !object(job.lesson)||!object(job.request))
    fail("Pinned Englotti job ID/payload mismatch");
  const {lesson,request:req}=job;
  if (lesson.slug!==entry.slug||!Number.isInteger(lesson.revision)||
      lesson.revision<1||lesson.sha256!==entry.sha256||
      lesson.words!==entry.words||!Number.isInteger(lesson.turns)||
      !Array.isArray(req.turns)||lesson.turns!==req.turns.length||
      req.turns.length<2||req.turns.length>50)
    fail("Pinned lesson identity, script count or SHA-256 mismatch");
  const expectedId="englishlive-"+entry.slug+"-r"+lesson.revision+"-"+entry.sha256.slice(0,8);
  if (job.job_id!==expectedId) fail("Englotti job ID does not bind revision and script hash");
  if (!sameVoices(req.speakers,entry.voices)||
      req.routing!=="explicit"||req.model!=="gemini-3.8-flash-tts"||
      req.allow_model_fallback!==false||req.format!=="wav"||
      req.sample_rate!==24000||req.temperature!==1||
      Object.hasOwn(req,"voice")||
      !object(req.transcript)||req.transcript.write_vtt!==true||
      req.transcript.diarization===false||
      !Array.isArray(req.transcript.language_codes)||
      req.transcript.language_codes.length!==1||
      req.transcript.language_codes[0]!=="en-US")
    fail("Unexpected Englotti two-voice/model/WAV 24kHz/transcript/VTT settings");
  const lines=[];let words=0;
  for (const turn of req.turns) {
    if (!object(turn)||!["Partner","Learner"].includes(turn.speaker)||
        typeof turn.text!=="string"||!turn.text.trim()||
        typeof turn.style!=="string"||turn.style.indexOf(B1_STYLE_END)<=0||
        (turn.style.slice(turn.style.indexOf(B1_STYLE_END)+B1_STYLE_END.length)!=="" &&
         !turn.style.endsWith("Make thirteen and thirty clearly different: thir-TEEN, THIR-ty."))||
        Object.hasOwn(turn,"voice"))
      fail("Invalid or overridden Englotti dialogue turn");
    lines.push(turn.speaker+": "+turn.text);
    words+=turn.text.trim().split(/\s+/u).length;
  }
  if (sha(lines.join("\n"))!==entry.sha256||
      words!==entry.words||lesson.words!==words)
    fail("Englotti dialogue SHA-256 or word count mismatch");
  const meta=req.metadata;
  if (!object(meta)||meta.app!=="englishlive"||
      meta.campaign!==CAMPAIGN||meta.slug!==entry.slug||
      meta.revision!==lesson.revision||meta.sha256!==entry.sha256)
    fail("Englotti source metadata mismatch");
  return {id:job.job_id,request:req,lesson:entry.slug,clipId:"conversation"};
}

export async function compileEnglishliveCampaign(plan,read) {
  validateEnglishliveCampaignPlan(plan);
  const manifest=await read(plan,ROOT+"campaign.json");
  const entries=validateManifest(manifest);
  const group=manifest.issues[plan.group-1],out=[];
  for (const slug of group) {
    const entry=entries.get(slug);
    const job=await read(plan,ROOT+entry.path);
    out.push(validateJob(entry,job));
  }
  if (new Set(out.map(x=>x.id)).size!==out.length)
    fail("Duplicate Englotti factory job IDs");
  return out; // Preserve the prepared request objects verbatim; never reconstruct them.
}
