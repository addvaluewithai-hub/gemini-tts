#!/usr/bin/env node
// Exact-byte archive of final pinned Englotti B1 issue-gated TTS artifacts.
// Never generates audio, overwrites results, or accesses Gemini/Cloudinary credentials.
import {readFile,writeFile,mkdtemp,access,mkdir} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {execFileSync} from "node:child_process";
import {compileEnglishliveCampaign} from "./englishlive-campaign-gateway.mjs";

const REPO="addvaluewithai-hub/gemini-tts";
const PIN="8150af60d71eaa2eb56b5213b7cba6af9f008bbe";
const COMMENT="archive-englishlive-final";
const ROOT="campaigns/englishlive-b1-listening/results";
const fail=m=>{throw Error(m);};
const auth=process.env.GITHUB_TOKEN;
const isCloudinary=u=>typeof u==="string"&&/^https:\/\/res\.cloudinary\.com\//.test(u);
async function api(path,binary=false) {
  if(!auth)fail("Missing GitHub token");
  const r=await fetch("https://api.github.com/repos/"+REPO+path,{
    headers:{Authorization:"Bearer "+auth,Accept:"application/vnd.github+json",
      "X-GitHub-Api-Version":"2022-11-28"}});
  if(!r.ok)fail("GitHub API "+r.status+" "+path);
  return binary?Buffer.from(await r.arrayBuffer()):await r.json();
}
async function pinnedJson(_plan,path) {
  if(!/^campaigns\/englishlive-b1-listening\/(?:campaign\.json|jobs\/b1-[a-z0-9-]+\.json)$/.test(path))
    fail("Out-of-scope pinned source");
  const r=await fetch("https://raw.githubusercontent.com/"+REPO+"/"+PIN+"/"+path);
  if(!r.ok)fail("Pinned source unavailable "+path);
  return await r.json();
}
function authorize(event) {
  if(process.env.GITHUB_REPOSITORY!==REPO||process.env.GITHUB_ACTOR!=="addvaluewithai-hub"||
     event.action!=="created"||event.repository?.full_name!==REPO||
     event.issue?.user?.login!=="addvaluewithai-hub"||
     event.comment?.user?.login!=="addvaluewithai-hub"||
     event.comment?.body?.trim()!==COMMENT||
     !Number.isInteger(event.issue?.number)||event.issue.number<=50)
    fail("Only the owner may archive a newer approved B1 production Issue");
  const match=(event.issue.body||"").match(/^\s*~~~json\s*\n([\s\S]+?)\n~~~\s*$/);
  if(!match)fail("Invalid production Issue envelope");
  const cfg=JSON.parse(match[1]);
  if(cfg.schemaVersion!==1||cfg.command!=="tts.issue.campaign"||
     cfg.sourceRepo!==REPO||cfg.sourceCommit!==PIN||cfg.mode!=="produce")
    fail("Not a final pinned B1 production Issue");
  return cfg;
}
async function run() {
  const event=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH||"event.json","utf8"));
  const plan=authorize(event);
  const items=await compileEnglishliveCampaign(plan,pinnedJson);
  if(items.length<1||items.length>5)fail("Expected one bounded Issue group");
  const comments=await api("/issues/"+event.issue.number+"/comments?per_page=100");
  const claim="<!-- gemini-tts-gateway-claimed-v1 -->";
  if(!Array.isArray(comments)||!comments.some(c=>c.body?.includes(claim)))
    fail("Issue has no paid-production claim");
  const accepted=comments.filter(c=>c.body?.startsWith("Dispatch accepted (audio not yet delivered): "))
    .map(c=>c.body.slice("Dispatch accepted (audio not yet delivered): ".length).trim());
  if(accepted.length!==items.length||accepted.some((id,i)=>id!==items[i].id))
    fail("Issue's exact accepted job IDs do not match pinned source");
  // Search all recent dispatch runs; match by *unique artifact name*, never by sequence/time alone.
  const listed=await api("/actions/runs?event=repository_dispatch&per_page=100");
  if(!Array.isArray(listed.workflow_runs))fail("Unable to enumerate factory workflow runs");
  const since=Date.parse(event.issue.created_at);
  if(!Number.isFinite(since))fail("Missing Issue timestamp");
  const runs=listed.workflow_runs.filter(r=>r.event==="repository_dispatch"&&
    r.name==="Gemini TTS Factory"&&Date.parse(r.created_at)>=since);
  const needed=new Set(items.map(x=>"tts-"+x.id));
  const matched=new Map();
  for(const row of runs) {
    if(!needed.size)break;
    const detail=await api("/actions/runs/"+row.id+"/artifacts?per_page=100");
    for(const artifact of detail.artifacts||[]) {
      if(!needed.has(artifact.name))continue;
      if(matched.has(artifact.name))fail("Multiple factory artifacts for "+artifact.name);
      if(row.status!=="completed"||row.conclusion!=="success"||artifact.expired)
        fail("Factory run failed/unfinished/artifact expired for "+artifact.name);
      matched.set(artifact.name,{run:row,artifact});
      needed.delete(artifact.name);
    }
  }
  if(needed.size)fail("Missing factory artifact(s): "+[...needed].join(", "));
  const temp=await mkdtemp(join(tmpdir(),"englotti-final-b1-"));
  const output=resolve(process.env.CAMPAIGN_CHECKOUT||"campaign",ROOT),files=[];
  for(const item of items) {
    const a=matched.get("tts-"+item.id);
    const zip=join(temp,item.id+".zip");
    await writeFile(zip,await api("/actions/artifacts/"+a.artifact.id+"/zip",true));
    const entry=name=>execFileSync("unzip",["-p",zip,name],{maxBuffer:32*1024*1024});
    const resultBytes=entry("result.json");
    const transcriptBytes=entry("out/"+item.id+".transcript.json");
    const result=JSON.parse(resultBytes.toString("utf8"));
    const transcript=JSON.parse(transcriptBytes.toString("utf8"));
    if(result.id!==item.id||result.status!=="completed"||
       result.model!=="gemini-3.8-flash-tts"||result.format!=="wav"||
       result.sample_rate!==24000||result.transcript?.status!=="completed"||
       result.metadata?.sha256!==item.request.metadata.sha256||
       !isCloudinary(result.audio_url)||!isCloudinary(result.transcript_url)||
       !isCloudinary(result.vtt_url)||
       !Array.isArray(transcript.words)||!transcript.words.length)
      fail("Invalid factory deliverable "+item.id);
    const expected=item.request.turns.map(t=>t.text).join(" ");
    if(transcript.source_text!==expected)
      fail("Transcript source differs from pinned dialogue: "+item.id);
    const seconds=result.cloudinary?.duration;
    const words=item.request.turns.reduce((n,t)=>n+t.text.trim().split(/\s+/u).length,0);
    if(!Number.isFinite(seconds)||seconds<=0)fail("Missing duration "+item.id);
    const wpm=(60*words/seconds);
    console.log(item.id+" | "+seconds+"s | "+wpm.toFixed(1)+" source WPM"+(wpm>160?" | FAST":""));
    files.push([join(output,item.id+".json"),resultBytes],
      [join(output,item.id+".transcript.json"),transcriptBytes]);
  }
  await mkdir(output,{recursive:true});
  for(const [dest] of files) {
    try{await access(dest);fail("Existing result: refuse overwrite "+dest);}
    catch(e){if(e.code!=="ENOENT")throw e;}
  }
  for(const [dest,bytes] of files)await writeFile(dest,bytes,{flag:"wx"});
  console.log("Archived "+items.length+" exact factory result/transcript pairs; existing files unchanged.");
}
if(process.argv[1]?.endsWith("archive-englishlive-final.mjs"))
  run().catch(e=>{console.error("ENGLISH B1 FINAL ARCHIVE ERROR:",e.message);process.exitCode=1;});
