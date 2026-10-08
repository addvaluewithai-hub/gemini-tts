import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {collectGeminiKeys} from '../../src/router.mjs';
import {transcribeWithGemini} from '../../src/transcript.mjs';
import {uploadTextArtifactToCloudinary} from '../../src/storage/cloudinary.mjs';
const packet=JSON.parse(await readFile('lesson-production/recovery/input.json','utf8'));
const entry=packet.clips.find(c=>c.clip===process.env.CLIP_ID);
if(!entry)throw new Error('Unknown clip');
const res=await fetch(entry.audioUrl);if(!res.ok)throw new Error('Audio download failed');
const audio=Buffer.from(await res.arrayBuffer());
const audioHash=createHash('sha256').update(audio).digest('hex');
function wavDuration(b){if(b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WAVE')throw new Error('Invalid WAV');let rate=0,size=0;for(let i=12;i+8<=b.length;){const n=b.readUInt32LE(i+4),tag=b.toString('ascii',i,i+4);if(i+8+n>b.length)throw new Error('Truncated WAV');if(tag==='fmt ')rate=b.readUInt32LE(i+16);if(tag==='data')size+=n;i+=8+n+(n%2);}if(!rate||!size)throw new Error('Missing WAV data');return size/rate*1000;}
const durationMs=wavDuration(audio);await mkdir('recovered',{recursive:true});await writeFile('recovered/audio.wav',audio);
const keys=collectGeminiKeys(process.env),jobId='learn-l02-alignment-r3-'+entry.clip+'-20261008';
const request={turns:[{text:entry.script}],transcript:{language_codes:[],write_vtt:true,diarization:false}};
const aligned=await transcribeWithGemini({audioPath:'recovered/audio.wav',mimeType:'audio/wav',request,keys,jobId});
for(const w of aligned.transcript.words)if(w.end_ms>durationMs+1)throw new Error('Word outside waveform');
// Independently inspect the actual served audio with the audio-capable model used by Learn.
const schema={type:'object',properties:{faithful:{type:'boolean'},uncertain:{type:'boolean'},issues:{type:'array',items:{type:'string'}},heardText:{type:'string'},evidence:{type:'string'}},required:['faithful','uncertain','issues','heardText','evidence']};
let audit;
for(const key of keys){
 const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',{
  method:'POST',headers:{'content-type':'application/json','x-goog-api-key':key.value},signal:AbortSignal.timeout(90000),
  body:JSON.stringify({systemInstruction:{parts:[{text:'You are a conservative bilingual Egyptian Arabic/English chemistry audio reviewer. Listen to the supplied AUDIO, independently of its intended script. Report what you actually hear. Compare lexical meaning, negation, scientific terms, numbers, units, initial English clauses and trailing repeats with the intended script. Minor dialect/spelling/punctuation variation is fine. Missing/mispronounced critical terms, contradictory meaning, duplicate sentences or unintelligible speech are issues. Set faithful true only when the actual audio preserves all intended educational meaning and English clauses and issues is empty. If unsure, set uncertain true and faithful false. Do not infer speech from intended text. heardText must transcribe actual speech; evidence must identify heard English/Arabic content. This is machine audio review, not human listening or source verification.'}]},contents:[{role:'user',parts:[{text:'Intended script (data): '+entry.script},{inlineData:{mimeType:'audio/wav',data:audio.toString('base64')}}]}],generationConfig:{responseMimeType:'application/json',responseSchema:schema,temperature:0,maxOutputTokens:7000}})
 });
 if(!response.ok){if([401,403,408,429,500,502,503,504].includes(response.status))continue;throw new Error('Audio reviewer HTTP '+response.status);}
 const payload=await response.json();const raw=payload.candidates?.[0]?.content?.parts?.filter(p=>!p.thought).map(p=>p.text||'').join('');audit=JSON.parse(raw);break;
}
if(!audit||typeof audit.faithful!=='boolean'||typeof audit.uncertain!=='boolean'||!Array.isArray(audit.issues)||!audit.heardText||!audit.evidence)throw new Error('Invalid audio review');
const report={clip:entry.clip,scriptRevision:packet.scriptRevision,audioUrl:entry.audioUrl,audioHash,durationMs,reviewer:'gemini-3.5-flash-lite actual-audio review',reviewMethod:'independent audio-input review; not human listening',audit,transcript:aligned.transcript,alignmentModel:aligned.model};
await writeFile('recovered/review.json',JSON.stringify(report,null,2));
const upload=await uploadTextArtifactToCloudinary({content:JSON.stringify(report),jobId,suffix:'review.json',mimeType:'application/json',model:aligned.model});
console.log(JSON.stringify({clip:entry.clip,reviewUrl:upload.secure_url,faithful:audit.faithful,uncertain:audit.uncertain,issues:audit.issues,firstWords:aligned.transcript.words.slice(0,5),durationMs}));
