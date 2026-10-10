import {test} from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {parseEvent,validatePayload,compilePlan,compileSceneRange,claim,send} from "../src/issue-gateway.mjs";

const script="شرح مصري عن Statics.";
const hash=createHash("sha256").update(script).digest("hex");
const id="my-lesson-N01-t01-0123456789abcdef0123456789abcdef";
const path="curricula/my-course/lessons/my-lesson/jobs/"+id+".json";
const style="Mature warm calm Egyptian private teacher. Natural medium pace, short pauses between ideas, clear English terms. Friendly and precise; no advertising performance.";
const payload={event_type:"tts.generate",client_payload:{job_id:id,request:{text:script,voice:"Gacrux",style,
  routing:"quality",format:"wav",sample_rate:24000,
  transcript:{language_codes:[],write_vtt:true},
  metadata:{curriculumId:"my-course",lessonId:"my-lesson",clipId:"N01",role:"teaching",scriptHash:hash}}}};
const scene={id:"S01",narration:{id:"N01",role:"teaching",script}};
const cfg={schemaVersion:1,command:"tts.issue.batch",mode:"dry-run",
  sourceRepo:"addvaluewithai-hub/learn-curriculums",sourceCommit:"a".repeat(40),
  jobs:[{path,sceneId:"S01"}]};
const event={action:"labeled",label:{name:"tts-run"},repository:{full_name:"addvaluewithai-hub/gemini-tts"},
  issue:{number:77,state:"open",user:{login:"addvaluewithai-hub"},body:"~~~json\n"+JSON.stringify(cfg)+"\n~~~"},
  sender:{login:"addvaluewithai-hub"}};

test("reject untrusted labeler and bad source paths",()=>{
  assert.equal(parseEvent(event).mode,"dry-run");
  assert.equal(parseEvent({...event,action:"opened",label:undefined}).mode,"dry-run");
  assert.throws(()=>parseEvent({...event,sender:{login:"attacker"}}),/Only owner/);
  const bad={...cfg,jobs:[{path:"../../secret",sceneId:"S01"}]};
  assert.throws(()=>parseEvent({...event,issue:{...event.issue,body:"~~~json\n"+JSON.stringify(bad)+"\n~~~"}}),/Invalid job path/);
});
test("exact clip and hash binding",()=>{
  assert.equal(validatePayload(cfg.jobs[0],scene,payload).id,id);
  const copy=structuredClone(payload);copy.client_payload.request.metadata.scriptHash="wrong";
  assert.throws(()=>validatePayload(cfg.jobs[0],scene,copy),/Stale/);
});
test("dry-run refuses all dispatches",async()=>{
  const p=parseEvent(event),data=await compilePlan(p,async (_plan,f)=>f===path?payload:scene);
  assert.equal(data.length,1);
  await assert.rejects(send(p,data,"token",()=>{throw Error("must not call");}),/Dry-run/);
});
test("claim prevents duplicate paid attempts",async()=>{
  const api=async (p,t,m,b)=>p.includes("?per_page")?[{body:"<!-- gemini-tts-gateway-claimed-v1 -->"}]:{};
  await assert.rejects(claim(77,"token",api),/already claimed/);
});
test("a controlled produce action dispatches exactly one verified job",async()=>{
  const p={...parseEvent(event),mode:"produce"},data=await compilePlan(p,async (_plan,f)=>f===path?payload:scene);
  const calls=[];const api=async (endpoint,token,method,body)=>{calls.push({endpoint,method,body});return {};};
  await send(p,data,"token",api);
  assert.equal(calls[0].endpoint,"/dispatches");
  assert.equal(calls[0].body.client_payload.request.text,script);
  assert.equal(calls.length,3);
});

test("bounded canonical B01 scene range generates unique job payloads and skips pilot",async()=>{
  const input={schemaVersion:1,command:"tts.issue.scene-range",mode:"dry-run",
    sourceRepo:"addvaluewithai-hub/learn-curriculums",sourceCommit:"a".repeat(40),
    courseId:"engineering-mechanics-statics-y1",lessonId:"ems-y1-foundations-models",
    startScene:1,endScene:2};
  const e={...event,action:"opened",issue:{...event.issue,number:99,body:"~~~json\n"+JSON.stringify(input)+"\n~~~"}};
  const plan=parseEvent(e);
  const lesson={id:input.lessonId,scenes:["S01","S02"]};
  const map={
    "lesson.json":lesson,
    "S01.json":{id:"S01",narration:{id:"N01",role:"teaching",script:"شرح بالأول عن Mechanics."}},
    "S02.json":{id:"S02",narration:{id:"N02",role:"teaching",script:"Skip pilot."}}
  };
  const items=await compileSceneRange(plan,async (p,path)=>map[path.split("/").at(-1)]);
  assert.equal(items.length,1);
  assert.equal(items[0].clipId,"N01");
  assert.equal(items[0].request.metadata.scriptHash,
    createHash("sha256").update("شرح بالأول عن Mechanics.").digest("hex"));
  assert.equal(items[0].request.voice,"Gacrux");
  assert.equal(items[0].request.sample_rate,24000);
  assert.match(items[0].id,/-b01full-i99-/);
  await assert.rejects(()=>send(plan,items,"token",()=>{throw Error("paid");}),/Dry-run/);
  const tampered={...input,endScene:10};
  assert.throws(()=>parseEvent({...e,issue:{...e.issue,body:"~~~json\n"+JSON.stringify(tampered)+"\n~~~"}}),/1 to 5/);
});
