// English (US) version of the bleach Short: the voice requests. One turn per beat, each with Peek's base description
// plus a direction for that line. Take A is played big (a correspondent who keeps losing his composure); take B is
// played dry (a clerk who has seen too much). The edit keeps, line by line, the take with more contrast that still
// matches the script. Recorded on the Vertex voice factory only.
//   node build-requests.mjs            writes techforbadguys-v2a-bleach-en-a1.json and -b1.json next to this file
import { writeFileSync } from "node:fs";

const BASE = "Peek, a small alien spy on Earth, filing a voice report on the humans, in natural, casual American English. Bright, higher-pitched, slightly nasal cartoon voice, never deep or gravelly. He is an outsider studying humans with a straight face, dry and slightly appalled, and never laughs at his own jokes. Pace: brisk and tight, clearly quicker than ordinary conversation, no long silences inside a sentence. ";

// [text, direction for take A, direction for take B]
export const LINES = [
  ["A toxic gas is being made in your bathroom.",
    "THIS LINE: the first line of the film, said straight to the viewer about their own home. Grave and urgent, like breaking news; hit 'toxic gas' hard, then 'in your bathroom' low and pointed. Clear, not slow.",
    "THIS LINE: the first line of the film, said straight to the viewer. A low, tense, confidential warning, as if leaking a secret about their own house; stress 'toxic gas'; every word clear."],
  ["<short pause> No. Not that one.",
    "THIS LINE: a complete change. Quick, flat, dry aside, lower and lighter, as if the listener just guessed something rude. Throwaway.",
    "THIS LINE: weary and flat, a patient correction of someone who always guesses the rude thing. Dry as dust, quick, low."],
  ["Saturday morning. The American mom declares war on the bathroom.",
    "THIS LINE: a war correspondent at the front. Energetic, fast, rising, punchy, big stress on 'declares war'.",
    "THIS LINE: a nature documentary narrator admiring a fearsome predator, awed, relishing 'declares war', moving along."],
  ["Her doctrine: one cleaner, clean. Two cleaners, cleaner. Three? <short pause> The toilet ascends.",
    "THIS LINE: counting on his fingers with growing excitement, fast, each step higher than the last; 'Three?' shoots up as a question; then 'The toilet ascends' drops to a hushed, awestruck revelation, like a miracle.",
    "THIS LINE: a lecturer reciting a doctrine he finds insane: flat quick steps one and two, a sceptical raised 'Three?', then 'The toilet ascends' with grand mock-religious reverence, slow and wide."],
  ["But bleach plus toilet bowl cleaner, or vinegar, or some glass cleaners... makes toxic gas.",
    "THIS LINE: the comedy stops. Lower and ominous, like a crime documentary, steady. Each product named clearly and separately. Heavy stress on 'toxic gas'.",
    "THIS LINE: serious and clear, a scientist giving evidence, each product distinct, the last two words cold and hard."],
  ["Coughing. Burning eyes. Chest pain.",
    "THIS LINE: three hammer blows. Clipped, worried, quick, each item its own short sentence, falling pitch.",
    "THIS LINE: a medic reading a chart, grim and fast, each item bitten off."],
  ["And Mom? <short pause> Proud. She thinks that's the smell of clean.",
    "THIS LINE: appalled disbelief. 'And Mom?' goes up, incredulous; 'Proud.' lands flat and stunned; the rest shaking his head.",
    "THIS LINE: bone-dry deadpan, quiet, almost admiring the absurdity. 'And Mom?' small and high, 'Proud.' very flat and low, the rest with a tired sigh in the voice."],
  ["<gasp> That's not clean. That's an ALARM!",
    "THIS LINE: sudden alarm! He loses his composure for the only time in the film: loud, high, urgent, almost shouting, fast. 'ALARM' is the peak, the highest note of the whole report.",
    "THIS LINE: sharp and forceful, a sergeant barking a warning. Loud, high, fast, hard consonants, 'ALARM' punched."],
  ["The rule: never mix bleach with any other cleaner. Ever. Rinse well between products. Open a window.",
    "THIS LINE: clipped and official, reading a standing order. Every word perfectly clear and firm, no humour at all, moving briskly. 'Ever.' alone, firm and final.",
    "THIS LINE: calm, firm and plain, a safety officer who needs every listener to remember this. Even and clear, 'Ever.' heavy, no dawdling."],
  ["If it happens: get to fresh air, fast. Trouble breathing? Call 911. Tell them what you mixed.",
    "THIS LINE: official, urgent and helpful. Fast and clear, stress on 'fresh air, fast' and 'Call 911' (said nine-one-one). No jokes.",
    "THIS LINE: brisk emergency instructions, clear and steady, stress on 'get to fresh air' and 'Call 911' (said nine-one-one)."],
  ["The toilet? Sparkles anyway. She'll gaze at it like it just made honor roll.",
    "THIS LINE: relaxed again, warm and amused, quick. 'The toilet?' light and curious; a shrug on 'Sparkles anyway'; then fond storytelling, and 'like it just made honor roll' announced with the swelling pride of a mom at a school awards night.",
    "THIS LINE: dry and fond. A shrug on 'Sparkles anyway', then deadpan, and 'like it just made honor roll' underplayed, quiet and perfectly serious, which is what makes it funny."],
  ["<sigh> The gas you're thinking of? That's another report.",
    "THIS LINE: a tired sigh first, then low, quick and conspiratorial, just between him and the viewer. Trailing down at the end.",
    "THIS LINE: a tired sigh first, then a confidential mutter, low, with a knowing little pause before 'That's another report'."],
  ["How many cleaners are in your bathroom right now? <short pause> Drop the number.",
    "THIS LINE: the last line of the film, a challenge thrown at the viewer. Pointed and playful, eyebrow raised, the question rising clearly on 'right now?'; then 'Drop the number.' short, dry and bossy, like an inspector with a clipboard.",
    "THIS LINE: the last line of the film. Suspicious and teasing, leaning in, slow on 'How many cleaners', the question rising on 'right now?'; then 'Drop the number.' quick and deadpan, an order."],
];

const plain = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const [take, idx] of [["a1", 1], ["b1", 2]]) {
    const id = `techforbadguys-v2a-bleach-en-${take}`;
    const body = { voice: "Puck", routing: "quality", format: "wav", sample_rate: 24000, temperature: 1,
      transcript: { language_codes: ["en-US"], write_vtt: true },
      turns: LINES.map((l) => ({ style: BASE + l[idx], text: l[0] })),
      metadata: { channel: "techforbadguys", job_id: id, language: "en-US", title: `Shorts lab v2 bleach, studio A, English (US), take ${take}` } };
    writeFileSync(new URL(`./${id}.json`, import.meta.url), JSON.stringify(body, null, 1) + "\n");
    console.log(id, body.turns.length, "turns", LINES.map((l) => plain(l[0])).join(" ").split(" ").length, "words");
  }
}

// Round 2. Round 1 (a1, b1) had the words right but ran 66-67 s for 139 words (1.5-3.3 words a second) and its line
// medians sat in a narrow band (8-12 semitones): the alarm was not the top of the film and the aside not the bottom.
// Same lines, faster, with the extremes pushed: the dry aside low and flat, the alarm a squeaky shout.
const FAST = "Speak FAST, about three words a second, like a rapid field dispatch; pauses only where the text has a tag. ";
const PUSH = {
  1: ["THIS LINE: a grave, low, urgent news flash, fast; punch 'toxic gas'; drop low and pointed on 'in your bathroom'.", "THIS LINE: a tense whisper-close warning, fast, every word clear, 'toxic gas' hissed."],
  2: ["THIS LINE: the LOWEST, flattest line of the whole report: a quick, deep-for-him, bored mutter, almost under his breath. Throwaway.", "THIS LINE: very low, monotone and deadpan, a tired mumble, as flat as possible. Quick."],
  4: ["THIS LINE: rapid-fire counting, each step jumping higher; 'Three?' squeaks up high; then 'The toilet ascends.' hushed and awestruck but not slow.", "THIS LINE: flat, quick, bored steps one and two; 'Three?' a sceptical high squeak; then 'The toilet ascends.' grand and reverent, still moving."],
  7: ["THIS LINE: 'And Mom?' high and incredulous; 'Proud.' very low and flat; the rest quick, shaking his head.", "THIS LINE: 'And Mom?' small and high; 'Proud.' the flattest, lowest word; the rest a quick tired sigh of a sentence."],
  8: ["THIS LINE: PANIC. The loudest and HIGHEST line of the whole film, a squeaky, cracking shout, fast; 'ALARM' screamed at the very top of his range.", "THIS LINE: a shrill, high, furious shout, fast; 'ALARM' at the very top of his voice."],
  12: ["THIS LINE: a tired sigh, then very low, quiet and quick, a conspiratorial mutter, trailing down.", "THIS LINE: a tired sigh, then a low, secretive murmur, quick, sinking at the end."],
};
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const [take, idx] of [["a2", 1], ["b2", 2]]) {
    const id = `techforbadguys-v2a-bleach-en-${take}`;
    const body = { voice: "Puck", routing: "quality", format: "wav", sample_rate: 24000, temperature: 1,
      transcript: { language_codes: ["en-US"], write_vtt: true },
      turns: LINES.map((l, i) => ({ style: BASE + FAST + (PUSH[i + 1] ? PUSH[i + 1][idx - 1] : l[idx]), text: l[0] })),
      metadata: { channel: "techforbadguys", job_id: id, language: "en-US", title: `Shorts lab v2 bleach, studio A, English (US), take ${take} (faster, wider)` } };
    writeFileSync(new URL(`./${id}.json`, import.meta.url), JSON.stringify(body, null, 1) + "\n");
    console.log(id, body.turns.length, "turns");
  }
}
