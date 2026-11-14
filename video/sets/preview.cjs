#!/usr/bin/env node
// Still frames of a board at chosen moments, tiled into one sheet: the quick way to look at a set while drawing it.
//   node sets/preview.cjs <storyboard.json> <board id> <out.jpg> <step>:<age>[,<age>...] [<step>:<age>,...] [--cols 3] [--width 640]
// e.g. node sets/preview.cjs ../episodes/x/storyboard.json trail sheet.jpg 0:0.5,2,3.5,5 1:0.1,0.4,2,4
// An age under 0.2 s on a step after the first shows the hand-over out of the previous shot.
const fs = require("fs"), os = require("os"), path = require("path"), http = require("http"), { spawnSync } = require("child_process"), { chromium } = require("playwright");
const args = process.argv.slice(2), flag = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const cols = Number(flag("--cols", 3)), width = Number(flag("--width", 640)), [sbPath, id, out, ...specs] = args;
if (!out || !specs.length) { console.error("usage: node sets/preview.cjs <storyboard.json> <board id> <out.jpg> <step>:<age>[,<age>...] ..."); process.exit(2); }
const ROOT = path.resolve(__dirname, ".."), sb = JSON.parse(fs.readFileSync(sbPath, "utf8")), spec = sb.boards && sb.boards[id];
if (!spec) { console.error(`no board "${id}" in ${sbPath}`); process.exit(2); }
const shots = specs.flatMap((s) => { const [step, ages] = s.split(":"); return ages.split(",").map((a) => [Number(step), Number(a)]); });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2" };
const PAGE = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:"Anton";src:url("/node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2")}
@font-face{font-family:"Anton";src:url("/node_modules/@fontsource/lalezar/files/lalezar-arabic-400-normal.woff2");unicode-range:U+0600-06FF}
@font-face{font-family:"Elite";src:url("/node_modules/@fontsource/special-elite/files/special-elite-latin-400-normal.woff2")}
body{margin:0;background:#070919;width:1920px;height:1080px;overflow:hidden;position:relative}</style><div id=b></div>
<script type=module>import {board} from "/boards.js"; window.show=async(s,st,a,t,cfg)=>{document.getElementById("b").innerHTML=board(s,st,a,t,cfg);await document.fonts.load('40px "Anton"',"0");await document.fonts.ready}; window.__ready=true;</script>`;
const server = http.createServer((req, res) => { const u = decodeURIComponent(req.url.split("?")[0]); if (u === "/t.html") { res.writeHead(200, { "content-type": "text/html" }); return res.end(PAGE); }
  const f = path.join(ROOT, u); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res); });
server.listen(0, "127.0.0.1", async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "set-")), br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 1920, height: 1080 } });
  pg.on("pageerror", (e) => { console.error("PAGE ERROR", e.message); process.exitCode = 1; });
  await pg.goto(`http://127.0.0.1:${server.address().port}/t.html`); await pg.waitForFunction("window.__ready===true");
  let i = 0; for (const [step, age] of shots) { await pg.evaluate(([s, st, a, t, cfg]) => window.show(s, st, a, t, cfg), [spec, step, age, step * 5 + age, { theme: sb.theme }]); await pg.screenshot({ path: path.join(tmp, String(i++).padStart(3, "0") + ".jpg"), type: "jpeg", quality: 85 }); }
  await br.close(); server.close();
  const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-pattern_type", "glob", "-i", path.join(tmp, "*.jpg"), "-vf", `scale=${width}:-1,tile=${cols}x${Math.ceil(shots.length / cols)}`, "-frames:v", "1", out], { stdio: "inherit" });
  fs.rmSync(tmp, { recursive: true, force: true }); if (r.status !== 0) process.exit(1); console.log(`wrote ${out}: ${shots.length} frames`);
});
