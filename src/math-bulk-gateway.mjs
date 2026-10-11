// Bounded, source-verified Mathematics I Zephyr campaign: up to five requests/Issue.
// No direct secrets, web POSTs, cut times or paid calls live in this pure compiler.
import {createHash} from "node:crypto";
const sha=s=>createHash("sha256").update(s,"utf8").digest("hex");
const fail=s=>{throw Error(s);};
const CAMPAIGN="zephyr-remaining-20261011";
const SOURCE="9d996530594a58e6088e29ef5e7677f62b9015fa";
const PIN="f6e5a5c9d5180228eb5762fa433cf45a4e4b4933";
const STYLE="Mature warm calm Egyptian private teacher. Natural medium pace, short pauses between ideas, clear English terms. Friendly and precise; no advertising performance.";
const NEVER=new Set(["em1-prelim-absolute-value/N02",
  "em1-limits-trigonometric/N05","em1-limits-trigonometric/F01"]);
const BASE="curricula/engineering-math-1/";
export const campaignSourceCommit=PIN;
export function validateMathBulkPlan(cfg) {
  if (cfg.sourceCommit!==PIN) fail("Wrong pinned complete Math I campaign commit");
  if (typeof cfg.group!=="string" ||
      !/^curricula\/engineering-math-1\/batches\/campaigns\/zephyr-remaining-20261011\/group-(0[1-9]|1[01])\.json$/.test(cfg.group))
    fail("Invalid approved mathematics group path");
  if (cfg.jobs!==undefined || cfg.clips!==undefined || cfg.lessonId!==undefined)
    fail("Conflicting job scope");
}
export async function compileMathBulkGroup(plan,read) {
  validateMathBulkPlan(plan);
  const group=await read(plan,plan.group);
  if (group?.schemaVersion!==1 || group.command!=="tts.issue.audio-batch-group" ||
      group.courseId!=="engineering-math-1" || group.voice!=="Zephyr" ||
      group.sourceRevision!==SOURCE || !Array.isArray(group.batches) ||
      group.batches.length<1 || group.batches.length>5)
    fail("Untrusted or over-broad campaign group");
  const issuedLessons=new Map(),seen=new Set(),out=[];
  for (let index=0;index<group.batches.length;index++) {
    const bucket=group.batches[index];
    if (!Array.isArray(bucket.clips) || bucket.clips.length<1 ||
        bucket.clips.length>10) fail("Bad per-request clip count");
    let words=0;const scripts=[],segments=[];
    for (const loc of bucket.clips) {
      if (!loc || typeof loc.lessonId!=="string" ||
          !/^em1-[a-z0-9-]+$/.test(loc.lessonId) ||
          !/^S[0-9]{2}$/.test(loc.sceneId||"") ||
          !/^[NF][0-9]{2}$/.test(loc.clipId||""))
        fail("Malformed canonical original clip locator");
      const key=loc.lessonId+"/"+loc.clipId;
      if (seen.has(key) || NEVER.has(key)) fail("Repeated or already paid pilot clip");
      seen.add(key);
      const prefix=BASE+"lessons/"+loc.lessonId+"/";
      if (!issuedLessons.has(loc.lessonId))
        issuedLessons.set(loc.lessonId,await read(plan,prefix+"lesson.json"));
      const lesson=issuedLessons.get(loc.lessonId);
      if (lesson?.id!==loc.lessonId || !lesson.scenes?.includes(loc.sceneId))
        fail("Clip references unissued source scene");
      const scene=await read(plan,prefix+"scenes/"+loc.sceneId+".json");
      if (scene?.id!==loc.sceneId) fail("Changed scene identity");
      const clip=loc.clipId.startsWith("F")?scene.question?.feedback:scene.narration;
      if (!clip || clip.id!==loc.clipId ||
          !["teaching","question","feedback"].includes(clip.role) ||
          typeof clip.script!=="string" || clip.script.length<3 ||
          clip.script.length>7500 || clip.script.includes("<short pause>"))
        fail("Changed or invalid canonical source clip");
      const count=clip.script.trim().split(/\s+/u).length;
      words+=count;scripts.push(clip.script.trim());
      segments.push({courseId:"engineering-math-1",lessonId:loc.lessonId,
        clipId:loc.clipId,role:clip.role,scriptHash:sha(clip.script),wordCount:count});
    }
    const estimated=words/1.9+Math.max(0,segments.length-1)+3;
    if (words<1 || words>200 || bucket.words!==words ||
        estimated>120 || Math.abs(bucket.estimatedSeconds-Math.round(estimated*10)/10)>0.01)
      fail("Campaign word/duration target or source words mismatch");
    const script=scripts.join(" <short pause> ");
    if (script.length>7500) fail("Combined source too large");
    const groupNumber=plan.group.match(/group-(\d{2})\.json$/)[1];
    const id="batch-zephyr-mathfull-g"+groupNumber+"-b"+
      String(index+1).padStart(2,"0")+"-"+sha(script).slice(0,16);
    const metadata={batchVersion:1,batchId:id,courseId:"engineering-math-1",
      campaign:CAMPAIGN,group:Number(groupNumber),segments,batchScriptHash:sha(script)};
    const request={text:script,voice:"Zephyr",style:STYLE,
      routing:"explicit",model:"gemini-3.8-flash-tts",allow_model_fallback:false,
      format:"wav",sample_rate:24000,
      transcript:{language_codes:[],write_vtt:true},metadata};
    out.push({id,request,lesson:"engineering-math-1",clipId:"batch"});
  }
  return out;
}
