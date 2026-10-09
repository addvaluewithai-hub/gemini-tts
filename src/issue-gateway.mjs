#!/usr/bin/env node
// Owner-gated issue label -> existing repository_dispatch TTS factory.
// No Gemini/Cloudinary secrets or untrusted code execution in this control plane.
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";

const FACTORY="addvaluewithai-hub/gemini-tts";
const SOURCE="addvaluewithai-hub/learn-curriculums";
const OWNER="addvaluewithai-hub";
const MARKER="<!-- gemini-tts-gateway-claimed-v1 -->";
const sha=v=>createHash("sha256").update(v,"utf8").digest("hex");
const fail=m=>{throw Error(m);};

export function parseEvent(event) {
  if (event.action!=="labeled" || event.label?.name!=="tts-run") fail("Wrong label event");
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
  if (cfg.schemaVersion!==1 || cfg.command!=="tts.issue.batch") fail("Unexpected command");
  if (!["dry-run","produce"].includes(cfg.mode)) fail("Unexpected mode");
  if (cfg.sourceRepo!==SOURCE || !/^[0-9a-f]{40}$/.test(cfg.sourceCommit))
    fail("Pinned 40-digit source revision required");
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
  const requests=await compilePlan(plan);
  console.log("Verified "+requests.length+" canonical requests; mode="+plan.mode);
  if (plan.mode==="dry-run") return console.log("DRY RUN: no dispatch or billing");
  if (!process.argv.includes("--send")) fail("Missing explicit --send");
  await claim(plan.issueNumber,process.env.GITHUB_TOKEN);
  await send(plan,requests,process.env.GITHUB_TOKEN);
}
if (process.argv[1]?.endsWith("issue-gateway.mjs")) {
  main().catch(e=>{console.error("ISSUE GATEWAY ERROR:",e.message);process.exitCode=1;});
}
