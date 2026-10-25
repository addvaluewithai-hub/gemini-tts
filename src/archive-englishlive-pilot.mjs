#!/usr/bin/env node
// Archive exact GitHub Actions artifact bytes for the owner-approved Englotti r3 pilot.
// Scope is fixed to one Issue, five previously accepted factory IDs/runs and one branch.
// This does not generate speech, change a prepared request, or need Gemini/Cloudinary keys.
import {readFile,writeFile,mkdtemp,access,mkdir} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {execFileSync} from "node:child_process";
import {compileEnglishliveCampaign} from "./englishlive-campaign-gateway.mjs";

const REPO="addvaluewithai-hub/gemini-tts";
const PIN="a96a7b29dff919e294c7ca4ce5a185a79fb849d7";
const BRANCH="campaign/englishlive-b1-listening";
const ISSUE=50,COMMENT="archive-englishlive-b1-r3-pilot";
const ROOT="campaigns/englishlive-b1-listening/results";
const RUNS=new Map([
  ["englishlive-b1-change-a-hotel-booking-dates-r3-d62929d5",40187492255],
  ["englishlive-b1-change-a-hotel-booking-extra-night-r3-82f52e3c",40187493107],
  ["englishlive-b1-change-a-hotel-booking-friend-r3-2787b635",40187494016],
  ["englishlive-b1-explain-a-mix-up-cafe-r3-fccf4a41",40187494118],
  ["englishlive-b1-explain-a-mix-up-room-r3-80887ebb",40187495628]
]);
const fail=msg=>{throw Error(msg);};
const auth=process.env.GITHUB_TOKEN;
function assertOwnerEvent(event) {
  if (process.env.GITHUB_REPOSITORY!==REPO ||process.env.GITHUB_ACTOR!=="addvaluewithai-hub" ||
      event.action!=="created"||event.repository?.full_name!==REPO||
      event.issue?.number!==ISSUE||event.issue?.user?.login!=="addvaluewithai-hub"||
      event.comment?.user?.login!=="addvaluewithai-hub"||event.comment?.body?.trim()!==COMMENT)
    fail("Archive can run only from the owner comment on the approved pilot Issue");
}
async function api(path,binary=false) {
  if (!auth) fail("Missing workflow token");
  const r=await fetch("https://api.github.com/repos/"+REPO+path,{
    headers:{Authorization:"Bearer "+auth,Accept:"application/vnd.github+json",
      "X-GitHub-Api-Version":"2022-11-28"}});
  if (!r.ok) fail("GitHub API "+r.status+" "+path);
  return binary?Buffer.from(await r.arrayBuffer()):await r.json();
}
async function pinnedJson(_plan,path) {
  if (!/^campaigns\/englishlive-b1-listening\/(?:campaign\.json|jobs\/b1-[a-z0-9-]+\.json)$/.test(path))
    fail("Out-of-scope pinned Englotti path");
  const r=await fetch("https://raw.githubusercontent.com/"+REPO+"/"+PIN+"/"+path);
  if(!r.ok)fail("Unable to fetch pinned source "+path);
  return await r.json();
}
const isCloudinary=u=>typeof u==="string"&&u.startsWith("https://res.cloudinary.com/");
async function run() {
  const event=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH||"event.json","utf8"));
  assertOwnerEvent(event);
  const plan={schemaVersion:1,command:"tts.issue.campaign",mode:"dry-run",
    sourceRepo:REPO,sourceCommit:PIN,group:1};
  const items=await compileEnglishliveCampaign(plan,pinnedJson);
  if(items.length!==5||items.some(x=>!RUNS.has(x.id)))fail("Pilot job map has drifted");
  const output=resolve(process.env.CAMPAIGN_CHECKOUT||"campaign",ROOT);
  const temp=await mkdtemp(join(tmpdir(),"englotti-b1-archive-"));
  const files=[];
  for (const job of items) {
    const runId=RUNS.get(job.id);
    const run=await api("/actions/runs/"+runId);
    if (run.status!=="completed"||run.conclusion!=="success"||
        run.event!=="repository_dispatch"||run.name!=="Gemini TTS Factory"||
        run.repository?.full_name!==REPO)
      fail("Factory run is not the expected completed TTS workflow: "+runId);
    const listing=await api("/actions/runs/"+runId+"/artifacts?per_page=100");
    const artifacts=(listing.artifacts||[]).filter(x=>x.name==="tts-"+job.id&&!x.expired);
    if(artifacts.length!==1)fail("Expected one unexpired factory artifact for "+job.id);
    const zip=join(temp,job.id+".zip");
    await writeFile(zip,await api("/actions/artifacts/"+artifacts[0].id+"/zip",true));
    const entry=name=>execFileSync("unzip",["-p",zip,name],{maxBuffer:32*1024*1024});
    const resultBytes=entry("result.json");
    const transcriptBytes=entry("out/"+job.id+".transcript.json");
    const result=JSON.parse(resultBytes.toString("utf8"));
    const transcript=JSON.parse(transcriptBytes.toString("utf8"));
    if(result.id!==job.id||result.status!=="completed"||
        result.model!=="gemini-3.8-flash-tts"||result.format!=="wav"||
        result.sample_rate!==24000||result.transcript?.status!=="completed"||
        !isCloudinary(result.audio_url)||!isCloudinary(result.transcript_url)||
        !isCloudinary(result.vtt_url)||
        result.metadata?.sha256!==job.request.metadata.sha256||
        transcript.type!=="word_timestamps" && transcript.alignment_mode!=="word"||
        !Array.isArray(transcript.words) || transcript.words.length===0)
      fail("Factory result or transcript contract mismatch "+job.id);
    // We must save the original factory bytes, regardless of speaking-speed or coverage warnings.
    const expected=job.request.turns.map(x=>x.text).join(" ");
    if(transcript.source_text!==expected)
      fail("Transcript source does not match the immutable job turns: "+job.id);
    const duration=result.cloudinary?.duration;
    const words=job.request.turns.reduce((n,x)=>n+x.text.trim().split(/\s+/u).length,0);
    const wpm=words/(duration/60);
    if(!Number.isFinite(wpm)||wpm<=0)fail("Missing audio duration "+job.id);
    console.log(job.id+" "+duration+"s, "+wpm.toFixed(1)+" source WPM"+
      (wpm>160?" — OVER B1 PACE TARGET":""));
    files.push([join(output,job.id+".json"),resultBytes],
      [join(output,job.id+".transcript.json"),transcriptBytes]);
  }
  // Do not modify an existing archived file, including earlier -r2 pilot results.
  await mkdir(output,{recursive:true});
  for(const [dest] of files){
    try{await access(dest);fail("Archive destination already exists; no overwrite: "+dest);}
    catch(e){if(e.code!=="ENOENT")throw e;}
  }
  for(const [dest,bytes] of files)await writeFile(dest,bytes,{flag:"wx"});
  console.log("Archived exact factory result and transcript bytes for "+items.length+
    " completed pilot jobs to "+BRANCH+" (ten new files).");
}
if(process.argv[1]?.endsWith("archive-englishlive-pilot.mjs"))
  run().catch(e=>{console.error("PILOT ARCHIVE ERROR:",e.message);process.exitCode=1;});
