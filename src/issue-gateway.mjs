#!/usr/bin/env node
// Owner-gated issue label -> existing repository_dispatch TTS factory.
// No Gemini/Cloudinary secrets or untrusted code execution in this control plane.
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {validateMathBulkPlan,compileMathBulkGroup} from "./math-bulk-gateway.mjs";
import {validateEnglishliveCampaignPlan,compileEnglishliveCampaign} from "./englishlive-campaign-gateway.mjs";

const FACTORY="addvaluewithai-hub/gemini-tts";
const SOURCE="addvaluewithai-hub/learn-curriculums";
const OWNER="addvaluewithai-hub";
const MARKER="<!-- gemini-tts-gateway-claimed-v1 -->";
const sha=v=>createHash("sha256").update(v,"utf8").digest("hex");
const fail=m=>{throw Error(m);};

export function parseEvent(event) {
  if (event.action!=="opened" && (event.action!=="labeled" || event.label?.name!=="tts-run"))
    fail("Wrong issue event");
  if (event.repository?.full_name!==FACTORY) fail("Wrong factory repository");
  if (event.issue?.pull_request || event.issue?.state!=="open" ||
      !Number.isInteger(event.issue.number)) fail("Expected open GitHub Issue");
  if (event.issue.user?.login!==OWNER || event.sender?.login!==OWNER)
    fail("Only owner-created and owner-labeled issues may spend funds");
  const body=event.issue.body||"";
  if (body.length>24000) fail("Issue body too long");
  const m=body.match(/^\s*~~~json\s*\n([\s\S]+?)\n~~~\s*$/);
  if (!m) fail("Issue body must be fenced ~~~json only");
  const cfg=JSON.parse(m[1]);
  if (cfg.schemaVersion!==1 || !["tts.issue.batch","tts.issue.scene-range","tts.issue.audio-batch","tts.issue.math-bulk","tts.issue.campaign"].includes(cfg.command))
    fail("Unexpected command");
  if (!["dry-run","produce"].includes(cfg.mode)) fail("Unexpected mode");
  if ((cfg.command==="tts.issue.campaign" ? cfg.sourceRepo!==FACTORY : cfg.sourceRepo!==SOURCE) ||
      !/^[0-9a-f]{40}$/.test(cfg.sourceCommit))
    fail("Pinned 40-digit source revision required");
  if (cfg.command==="tts.issue.campaign") {
    validateEnglishliveCampaignPlan(cfg);
  } else if (cfg.command==="tts.issue.batch") {
    if (!Array.isArray(cfg.jobs) || !cfg.jobs.length || cfg.jobs.length>5)
      fail("Expected 1 to 5 jobs");
    const unique=new Set();
    for (const j of cfg.jobs) {
      if (!/^S[0-9]{2}$/.test(j.sceneId)) fail("Invalid scene ID");
      if (typeof j.path!=="string" || j.path.includes("..") ||
        !/^curricula\/[a-zA-Z0-9._-]+\/lessons\/[a-zA-Z0-9._-]+\/jobs\/[a-zA-Z0-9._-]+\.json$/.test(j.path))
        fail("Invalid job path");
      if (unique.has(j.path)) fail("Duplicate job path");
      unique.add(j.path);
    }
  } else if (cfg.command==="tts.issue.math-bulk") {
    validateMathBulkPlan(cfg);
  } else if (cfg.command==="tts.issue.audio-batch") {
    if (typeof cfg.job!=="string" ||
        !/^curricula\/engineering-math-1\/batches\/jobs\/[a-zA-Z0-9._-]+\.json$/.test(cfg.job))
      fail("Expected pinned Mathematics I batch-job path");
    if (!Array.isArray(cfg.clips) || cfg.clips.length<1 || cfg.clips.length>8)
      fail("Expected 1 to 8 original source clip references");
    const seen=new Set();
    for (const c of cfg.clips) {
      if (!c || typeof c.lessonId!=="string" ||
          !/^[a-zA-Z0-9._-]+$/.test(c.lessonId) ||
          !/^S[0-9]{2}$/.test(c.sceneId||"") ||
          !/^[NF][0-9]{2}$/.test(c.clipId||""))
        fail("Invalid source clip locator");
      const key=c.lessonId+"/"+c.clipId;
      if (seen.has(key)) fail("Duplicate original source clip");
      seen.add(key);
    }
    if (cfg.jobs!==undefined || cfg.courseId!==undefined)
      fail("Ambiguous Issue batch fields");
  } else {
    const lessons=["ems-y1-foundations-models","ems-y1-newton-gravity","ems-y1-units-conversions"];
    if (cfg.courseId!=="engineering-mechanics-statics-y1" ||
        !lessons.includes(cfg.lessonId)) fail("Scene-range scope must be existing B01 lesson");
    if (!Number.isInteger(cfg.startScene) || !Number.isInteger(cfg.endScene) ||
        cfg.startScene<1 || cfg.endScene>25 || cfg.endScene<cfg.startScene ||
        cfg.endScene-cfg.startScene>=5) fail("Scene range must contain 1 to 5 scenes");
    if (cfg.jobs!==undefined || cfg.excludeClipIds!==undefined)
      fail("Scene-range clips and prior pilot exclusions are determined by canonical source");
  }
  return {issueNumber:event.issue.number,...cfg};
}
async function sourceFile(plan,path) {
  const url="https://raw.githubusercontent.com/"+plan.sourceRepo+"/"+plan.sourceCommit+"/"+path;
  const r=await fetch(url);
  if (!r.ok) fail("Unable to fetch pinned source "+r.status+" "+path);
  const s=await r.text();
  if (s.length>24000) fail("Oversized source");
  return JSON.parse(s);
}
export function validatePayload(job,scene,payload) {
  const p=job.path.match(/^curricula\/([^/]+)\/lessons\/([^/]+)\/jobs\/([^/]+)\.json$/);
  if (!p || payload?.event_type!=="tts.generate") fail("Invalid source payload");
  const [unused,course,lesson,name]=p, id=payload.client_payload?.job_id,req=payload.client_payload?.request;
  if (id!==name || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,139}$/.test(id||""))
    fail("Unsafe job identity");
  if (scene.id!==job.sceneId) fail("Scene identity mismatch");
  const meta=req?.metadata||{};
  if (meta.curriculumId!==course || meta.lessonId!==lesson ||
    !/^[NF][0-9]{2}$/.test(meta.clipId||"")) fail("Clip metadata mismatch");
  const clip=meta.clipId.startsWith("F")?scene.question?.feedback:scene.narration;
  if (!clip || clip.id!==meta.clipId || clip.role!==meta.role) fail("Canonical clip mismatch");
  if (req.text!==clip.script || meta.scriptHash!==sha(clip.script)) fail("Stale/mismatched script");
  if (req.text.length<3 || req.text.length>7500) fail("Script size outside limits");
  const STYLE="Mature warm calm Egyptian private teacher. Natural medium pace, short pauses between ideas, clear English terms. Friendly and precise; no advertising performance.";
  if (req.voice!=="Gacrux" || req.style!==STYLE || req.routing!=="quality" ||
    req.format!=="wav" || req.sample_rate!==24000 ||
    !Array.isArray(req.transcript?.language_codes) ||
    req.transcript.language_codes.length!==0 || req.transcript.write_vtt!==true)
    fail("Unsupported pilot TTS settings");
  return {id,clipId:clip.id,lesson,request:req};
}
export async function compilePlan(plan,read=sourceFile) {
  const out=[];
  for (const job of plan.jobs) {
    const m=job.path.match(/^curricula\/([^/]+)\/lessons\/([^/]+)\/jobs\//);
    const scenePath="curricula/"+m[1]+"/lessons/"+m[2]+"/scenes/"+job.sceneId+".json";
    const [payload,scene]=await Promise.all([read(plan,job.path),read(plan,scenePath)]);
    out.push(validatePayload(job,scene,payload));
  }
  if (new Set(out.map(j=>j.id)).size!==out.length) fail("Duplicate job IDs");
  return out;
}
// B01-only bounded production from pinned canonical scenes. Historical five-clip
// pilot is never re-dispatched in the bulk pass (no Cloudinary overwrite).
const PREVIOUS_PILOT=Object.freeze({
  "ems-y1-foundations-models":["N02"],
  "ems-y1-newton-gravity":["N09","N13","F02"],
  "ems-y1-units-conversions":["N12"]
});
const B01_STYLE="Mature warm calm Egyptian private teacher. Natural medium pace, short pauses between ideas, clear English terms. Friendly and precise; no advertising performance.";

export async function compileSceneRange(plan,read=sourceFile) {
  if (plan.command!=="tts.issue.scene-range") fail("Not a bounded canonical scene-range request");
  const root="curricula/"+plan.courseId+"/lessons/"+plan.lessonId+"/";
  const lesson=await read(plan,root+"lesson.json");
  if (lesson.id!==plan.lessonId || !Array.isArray(lesson.scenes) ||
      plan.endScene>lesson.scenes.length) fail("Invalid lesson or out-of-bounds scene range");
  const selected=lesson.scenes.slice(plan.startScene-1,plan.endScene);
  const scenes=await Promise.all(selected.map(id=>read(plan,root+"scenes/"+id+".json")));
  const items=[];
  for (let i=0;i<selected.length;i++) {
    const scene=scenes[i];
    if (scene.id!==selected[i] || !/^S[0-9]{2}$/.test(scene.id))
      fail("Canonical scene identity mismatch");
    const clips=[scene.narration,...(scene.question?[scene.question.feedback]:[])];
    for (const clip of clips) {
      if (PREVIOUS_PILOT[plan.lessonId].includes(clip?.id)) continue;
      if (!clip || !/^[NF][0-9]{2}$/.test(clip.id) ||
          !["teaching","question","feedback"].includes(clip.role) ||
          typeof clip.script!=="string" || clip.script.length<3 || clip.script.length>7500)
        fail("Invalid canonical audio clip");
      const scriptHash=sha(clip.script);
      const jobId=plan.lessonId+"-"+clip.id+"-b01full-i"+plan.issueNumber+"-"+scriptHash.slice(0,16);
      if (jobId.length>139) fail("Generated job ID is too long");
      const request={
        text:clip.script,voice:"Gacrux",style:B01_STYLE,routing:"quality",format:"wav",
        sample_rate:24000,transcript:{language_codes:[],write_vtt:true},
        metadata:{curriculumId:plan.courseId,lessonId:plan.lessonId,clipId:clip.id,
          role:clip.role,scriptHash}
      };
      items.push({id:jobId,clipId:clip.id,lesson:plan.lessonId,sceneId:scene.id,
        request,scriptHash});
    }
  }
  if (!items.length || items.length>8 ||
      new Set(items.map(x=>x.id)).size!==items.length) fail("Expected 1 to 8 unique, non-pilot clips");
  return items;
}

// Source-verified Zephyr packing: one factory request, original N/F clip identities.
// Legacy owner-Gacrux commands remain unchanged.
export async function compileAudioBatch(plan,read=sourceFile) {
  if (plan.command!=="tts.issue.audio-batch") fail("Not a canonical audio batch Issue");
  const payload=await read(plan,plan.job);
  if (payload?.event_type!=="tts.generate") fail("Not a source-bound TTS job");
  const info=payload.client_payload||{},req=info.request||{},meta=req.metadata||{};
  const pathId=plan.job.split("/").at(-1).replace(/\.json$/,"");
  if (info.job_id!==pathId || meta.batchId!==pathId ||
      !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,139}$/.test(pathId) ||
      meta.batchVersion!==1 || meta.courseId!=="engineering-math-1")
    fail("Batch job id/version/course mismatch");
  const style="Mature warm calm Egyptian private teacher. Natural medium pace, short pauses between ideas, clear English terms. Friendly and precise; no advertising performance.";
  if (req.voice!=="Zephyr" || req.style!==style ||
      req.routing!=="explicit" || req.model!=="gemini-3.8-flash-tts" ||
      req.allow_model_fallback!==false || req.format!=="wav" ||
      req.sample_rate!==24000 || !Array.isArray(req.transcript?.language_codes) ||
      req.transcript.language_codes.length!==0 || req.transcript.write_vtt!==true)
    fail("Unexpected Zephyr math teacher voice/model/audio/transcript settings");
  const segments=meta.segments;
  if (!Array.isArray(segments) || segments.length!==plan.clips.length)
    fail("Canonical batch manifest / Issue references mismatch");
  const scripts=[],lessons=new Map();let totalWords=0;
  for (let i=0;i<plan.clips.length;i++) {
    const loc=plan.clips[i],seg=segments[i];
    if (seg?.courseId!=="engineering-math-1" ||
        seg.lessonId!==loc.lessonId || seg.clipId!==loc.clipId)
      fail("Pinned original clip does not match batch manifest");
    const prefix="curricula/engineering-math-1/lessons/"+loc.lessonId+"/";
    if (!lessons.has(loc.lessonId))
      lessons.set(loc.lessonId,await read(plan,prefix+"lesson.json"));
    const lesson=lessons.get(loc.lessonId);
    if (lesson.id!==loc.lessonId || !lesson.scenes?.includes(loc.sceneId))
      fail("Scene not issued in canonical lesson");
    const scene=await read(plan,prefix+"scenes/"+loc.sceneId+".json");
    if (scene.id!==loc.sceneId) fail("Scene identity mismatch");
    const clip=loc.clipId.startsWith("F")?scene.question?.feedback:scene.narration;
    if (!clip || clip.id!==loc.clipId || clip.role!==seg.role ||
        !["teaching","question","feedback"].includes(clip.role) ||
        typeof clip.script!=="string" || clip.script.length<3 ||
        clip.script.length>7500 || clip.script.includes("<short pause>"))
      fail("Invalid original source clip/role/script");
    if (sha(clip.script)!==seg.scriptHash)
      fail("Stale or altered canonical clip SHA-256");
    const words=clip.script.trim().split(/\s+/u).length;
    if (seg.wordCount!==words) fail("Mismatched source word count");
    totalWords+=words;scripts.push(clip.script.trim());
  }
  // This first Issue bridge intentionally excludes bulk audio until pilot QA.
  if (totalWords>200 || typeof req.text!=="string" ||
      req.text.length>7500 || totalWords<1) fail("Pilot batch exceeds bound");
  const expected=scripts.join(" <short pause> ");
  if (req.text!==expected || meta.batchScriptHash!==sha(expected))
    fail("Stale or modified combined source words");
  return [{id:info.job_id,request:req,lesson:"engineering-math-1",clipId:"batch"}];
}

async function gh(path,token,method="GET",body) {
  if (!token) fail("Missing GitHub issue-write token");
  const r=await fetch("https://api.github.com/repos/"+FACTORY+path,{
    method,headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json",
      "X-GitHub-Api-Version":"2022-11-28",...(body?{"Content-Type":"application/json"}:{})},
    ...(body?{body:JSON.stringify(body)}:{})
  });
  if (!r.ok) fail("GitHub API "+r.status+" "+path+" "+(await r.text()).slice(0,180));
  const s=await r.text();return s?JSON.parse(s):{};
}
export async function claim(issue,token,api=gh) {
  const existing=await api("/issues/"+issue+"/comments?per_page=100",token);
  if (!Array.isArray(existing)) fail("Cannot review claims");
  if (existing.some(c=>typeof c.body==="string"&&c.body.includes(MARKER)))
    fail("Issue already claimed; reconcile actual factory jobs, do not retry");
  await api("/issues/"+issue+"/comments",token,"POST",{body:MARKER+
    "\nBatch claimed. Do not re-label or retry without checking factory job outcomes."});
}
export async function send(plan,items,token,api=gh) {
  if (plan.mode!=="produce") fail("Dry-run cannot send");
  const accepted=[];
  try {
    for (const item of items) {
      await api("/dispatches",token,"POST",
        {event_type:"tts.generate",client_payload:{job_id:item.id,request:item.request}});
      accepted.push(item.id);
      await api("/issues/"+plan.issueNumber+"/comments",token,"POST",
        {body:"Dispatch accepted (audio not yet delivered): "+item.id});
    }
    await api("/issues/"+plan.issueNumber+"/comments",token,"POST",
      {body:"Accepted "+accepted.length+" factory requests. Review matching TTS Actions results and Cloudinary/word transcripts."});
  } catch(e) {
    await api("/issues/"+plan.issueNumber+"/comments",token,"POST",
      {body:"Stopped after "+accepted.length+" dispatches. Reconcile outcomes before any retry."}).catch(()=>{});
    throw e;
  }
  return accepted;
}
async function main() {
  const event=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH||"event.json","utf8"));
  const plan=parseEvent(event);
  const requests=plan.command==="tts.issue.scene-range"
    ? await compileSceneRange(plan)
    : plan.command==="tts.issue.audio-batch"
      ? await compileAudioBatch(plan)
      : plan.command==="tts.issue.math-bulk"
        ? await compileMathBulkGroup(plan,sourceFile)
        : plan.command==="tts.issue.campaign"
          ? await compileEnglishliveCampaign(plan,sourceFile)
          : await compilePlan(plan);
  console.log("Verified "+requests.length+" canonical requests; mode="+plan.mode);
  if (plan.mode==="dry-run") return console.log("DRY RUN: no dispatch or billing");
  if (!process.argv.includes("--send")) fail("Missing explicit --send");
  await claim(plan.issueNumber,process.env.GITHUB_TOKEN);
  await send(plan,requests,process.env.GITHUB_TOKEN);
}
if (process.argv[1]?.endsWith("issue-gateway.mjs")) {
  main().catch(e=>{console.error("ISSUE GATEWAY ERROR:",e.message);process.exitCode=1;});
}
