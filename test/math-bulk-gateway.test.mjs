import {test} from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {compileMathBulkGroup,validateMathBulkPlan,campaignSourceCommit}
  from "../src/math-bulk-gateway.mjs";
const sha=s=>createHash("sha256").update(s,"utf8").digest("hex");
const base="curricula/engineering-math-1/";
const path=base+"batches/campaigns/zephyr-remaining-20261011/group-01.json";
const a="بنفهم الفكرة الأولى عن النهايات.", b="In radians, find the limit.";
const refs=[{lessonId:"em1-functions-domain-range",sceneId:"S01",clipId:"N01"},
  {lessonId:"em1-functions-monotonicity",sceneId:"S02",clipId:"N02"}];
const words=[a,b].reduce((n,s)=>n+s.trim().split(/\s+/u).length,0);
const est=Math.round((words/1.9+1+3)*10)/10;
const group={schemaVersion:1,command:"tts.issue.audio-batch-group",
  courseId:"engineering-math-1",voice:"Zephyr",sourceRevision:
    "9d996530594a58e6088e29ef5e7677f62b9015fa",
  batches:[{words,estimatedSeconds:est,clips:refs}]};
const cfg={schemaVersion:1,command:"tts.issue.math-bulk",mode:"dry-run",
  sourceRepo:"addvaluewithai-hub/learn-curriculums",
  sourceCommit:campaignSourceCommit,group:path};
const files={
  [path]:group,
  [base+"lessons/em1-functions-domain-range/lesson.json"]:
    {id:refs[0].lessonId,scenes:["S01"]},
  [base+"lessons/em1-functions-domain-range/scenes/S01.json"]:
    {id:"S01",narration:{id:"N01",role:"teaching",script:a}},
  [base+"lessons/em1-functions-monotonicity/lesson.json"]:
    {id:refs[1].lessonId,scenes:["S02"]},
  [base+"lessons/em1-functions-monotonicity/scenes/S02.json"]:
    {id:"S02",narration:{id:"N02",role:"question",script:b}}
};
const reader=async(_cfg,path)=>{assert.ok(path in files,path);
  return structuredClone(files[path]);};
test("bounded campaign source and path are immutable",()=>{
  assert.doesNotThrow(()=>validateMathBulkPlan(cfg));
  assert.throws(()=>validateMathBulkPlan({...cfg,sourceCommit:"a".repeat(40)}),/pinned/);
  assert.throws(()=>validateMathBulkPlan({...cfg,group:path.replace("01","20")}),/path/);
});
test("one Zephyr factory request compiles canonical sources and SHA",async()=>{
  const jobs=await compileMathBulkGroup(cfg,reader);
  assert.equal(jobs.length,1);
  const j=jobs[0];
  assert.equal(j.request.text,a+" <short pause> "+b);
  assert.equal(j.request.voice,"Zephyr");
  assert.equal(j.request.metadata.batchScriptHash,sha(j.request.text));
  assert.equal(j.request.metadata.segments[0].scriptHash,sha(a));
  assert.equal(j.request.metadata.segments[1].scriptHash,sha(b));
  assert.equal(j.request.metadata.segments.length,2);
  assert.equal(j.request.allow_model_fallback,false);
  assert.equal(j.request.model,"gemini-3.8-flash-tts");
  assert.equal(j.request.metadata.group,1);
  assert.deepEqual(await compileMathBulkGroup(cfg,reader),jobs);
});
test("wrong words, duplicate, paid pilot or altered scenes fail closed",async()=>{
  const badWord=structuredClone(group);badWord.batches[0].words++;
  await assert.rejects(compileMathBulkGroup(cfg,async(p,loc)=>loc===path?badWord:reader(p,loc)),/source words mismatch/);
  const duplicate=structuredClone(group);duplicate.batches[0].clips.push({...refs[0]});
  await assert.rejects(compileMathBulkGroup(cfg,async(p,loc)=>loc===path?duplicate:reader(p,loc)),/Repeated/);
  const pilot=structuredClone(group);pilot.batches[0].clips[0]=
    {lessonId:"em1-prelim-absolute-value",sceneId:"S02",clipId:"N02"};
  await assert.rejects(compileMathBulkGroup(cfg,async(p,loc)=>loc===path?pilot:reader(p,loc)),/pilot/);
});

test("last real group can pack 12 short source clips without exceeding 200 words",async()=>{
  const lessonId="em1-functions-domain-range";
  const refs=Array.from({length:12},(_,i)=>({
    lessonId,sceneId:"S"+String(i+1).padStart(2,"0"),
    clipId:"N"+String(i+1).padStart(2,"0")
  }));
  const content="شرح بسيط";
  const count=refs.length*2;
  const seconds=Math.round((count/1.9+(refs.length-1)+3)*10)/10;
  const manifest={...group,batches:[{words:count,
    estimatedSeconds:seconds,clips:refs}]};
  const fake={
    [path]:manifest,
    [base+"lessons/"+lessonId+"/lesson.json"]:
      {id:lessonId,scenes:refs.map(x=>x.sceneId)}
  };
  for(const item of refs)fake[base+"lessons/"+lessonId+
    "/scenes/"+item.sceneId+".json"]=
    {id:item.sceneId,narration:{id:item.clipId,role:"teaching",script:content}};
  const load=async(_plan,p)=>{assert.ok(p in fake,p);return structuredClone(fake[p]);};
  const result=await compileMathBulkGroup(cfg,load);
  assert.equal(result.length,1);
  assert.equal(result[0].request.metadata.segments.length,12);
  const thirteen=structuredClone(manifest);
  thirteen.batches[0].clips.push({lessonId,sceneId:"S13",clipId:"N13"});
  await assert.rejects(compileMathBulkGroup(cfg,
    async (plan,p)=>p===path?thirteen:load(plan,p)),/Bad per-request clip count/);
});
