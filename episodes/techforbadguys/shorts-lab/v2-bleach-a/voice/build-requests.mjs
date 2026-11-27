// Builds the voice requests: one turn per beat, each with Peek's base description plus a direction for that line.
// Take A is played big (a correspondent who keeps losing his composure); take B is played dry (a clerk who has seen
// too much). The edit keeps, line by line, the take with more contrast that still matches the script.
import { writeFileSync } from "node:fs";

const BASE = "Peek, a small alien spy on Earth, filing a voice report to his commander back home, in Egyptian Arabic, Cairo street dialect, never Modern Standard Arabic. Bright, higher-pitched, slightly nasal cartoon voice, never deep or gravelly. He is an outsider studying humans with a straight face and never laughs at his own jokes. English names are said the English way. ";

const LINES = [
  ["يا فندم.. البشر بيصنّعوا غاز سام في الحمّام.",
    "THIS LINE: mock-solemn and grave, like breaking a state secret on the evening news. Slow, low, weighty, with a dramatic stress on «غاز سام».",
    "THIS LINE: a hushed, urgent whisper into a hidden microphone, as if the humans might hear him. Tense and secretive."],
  ["<short pause> لأ يا فندم.. مش اللي في بالك.",
    "THIS LINE: a complete change. Quick, flat, slightly embarrassed aside, higher and lighter, as if the commander just guessed something rude. Throwaway.",
    "THIS LINE: normal voice again, weary and flat, a patient correction to a boss who always guesses the rude thing. Dry as dust."],
  ["كل جمعة، الأم المصرية بتعلن الحرب على الحمّام.",
    "THIS LINE: a war correspondent at the front. Energetic, rising, punchy, stress on «الحرب».",
    "THIS LINE: a nature documentary narrator admiring a fearsome predator. Awed, measured, relishing «بتعلن الحرب»."],
  ["وعقيدتها بسيطة: منظف ينضّف.. اتنين ينضّفوا أكتر.. تلاتة؟ <short pause> الحمّام يتولد من جديد.",
    "THIS LINE: counting on his fingers with growing excitement, each step higher and faster; «تلاتة؟» shoots up as a question; then the last phrase drops to a slow, hushed, awestruck revelation, like a miracle.",
    "THIS LINE: a bored lecturer reciting a doctrine he finds insane: flat, even steps one and two, a sceptical raised «تلاتة؟», then the last phrase with grand mock-religious reverence, slow and wide."],
  ["بس الكلور مع منظف التواليت، أو الخل، أو بعض منظفات الإزاز.. بيطلّع غاز سام.",
    "THIS LINE: the comedy stops. Lower, slower, ominous, like a crime documentary. Each product named clearly and separately. Heavy stress on «غاز سام».",
    "THIS LINE: serious and clear, a scientist giving evidence. Unhurried, each product separated by a small pause, the last two words slow and cold."],
  ["كحة. <short pause> عين بتحرق. <short pause> صدر بيوجع.",
    "THIS LINE: three hammer blows. Clipped, worried, each item its own short sentence, falling pitch.",
    "THIS LINE: a medic reading a chart, grim and fast, each item bitten off."],
  ["وهي؟ <short pause> فخورة. فاكراها ريحة النضافة.",
    "THIS LINE: appalled disbelief. «وهي؟» goes up, incredulous; «فخورة» lands flat and stunned; the rest slow, shaking his head.",
    "THIS LINE: bone-dry deadpan, quiet, almost admiring the absurdity. «وهي؟» small and high, «فخورة» very flat, the rest with a tired sigh in the voice."],
  ["<gasp> دي مش ريحة نضافة.. ده إنذار!",
    "THIS LINE: sudden alarm! He loses his composure for the only time: loud, high, urgent, almost shouting, fast. «إنذار» is the peak.",
    "THIS LINE: sharp and forceful, a sergeant barking a warning. Loud, hard consonants, «إنذار» punched."],
  ["القاعدة: الكلور ما يتخلطش بأي منظف تاني. <short pause> أبداً. واشطف كويس بين كل منظف والتاني، وافتح الشباك.",
    "THIS LINE: clipped and official, reading a standing order. Slower than the rest, every word separated and perfectly clear, no humour at all. «أبداً» alone, firm and final.",
    "THIS LINE: calm, firm and plain, a safety officer who needs every listener to remember this. Slow and even, a full stop after each instruction, «أبداً» heavy."],
  ["ولو حصل: اخرج فوراً لهوا نضيف. ولو النَفَس صعب، اتصل بالإسعاف وقول لهم خلطت إيه.",
    "THIS LINE: still official but urgent and helpful. Clear, steady, stress on «فوراً» and «الإسعاف». No jokes.",
    "THIS LINE: brisk emergency instructions, clear and steady, a little faster, stress on «اخرج فوراً» and «اتصل بالإسعاف»."],
  ["والتواليت؟ <short pause> هيلمع برضه. وهتقف تتفرّج عليه.. كإنه دخل كلية الطب.",
    "THIS LINE: relaxed again, warm and amused. «والتواليت؟» light and curious; then fond storytelling; the last phrase «كإنه دخل كلية الطب» announced with the swelling pride of an Egyptian mother.",
    "THIS LINE: dry and fond. A shrug on «هيلمع برضه», then slow deadpan, and the last phrase underplayed, quiet and perfectly serious, which is what makes it funny."],
  ["<sigh> أما الغاز اللي في بالك.. فده تقرير تاني.",
    "THIS LINE: a tired sigh first, then low, quick and conspiratorial, between him and the commander only. Trailing down at the end.",
    "THIS LINE: a tired sigh first, then a confidential mutter, slower, with a knowing pause before «فده تقرير تاني»."],
  ["Peek.. انتهى التقرير يا فندم.",
    "THIS LINE: crisp military sign-off. Short, bright, final.",
    "THIS LINE: crisp military sign-off. Short, bright, final."],
];

function request(take, idx) {
  const id = `techforbadguys-v2a-bleach-${take}`;
  return [id, {
    voice: "Puck", routing: "quality", format: "wav", sample_rate: 24000, temperature: 1,
    transcript: { language_codes: ["ar-EG"], write_vtt: true },
    turns: LINES.map((l) => ({ style: BASE + l[idx], text: l[0] })),
    metadata: { channel: "techforbadguys", job_id: id, language: "ar-EG", title: `Shorts lab v2 bleach, studio A, take ${take}` },
  }];
}
// Round 2. Round 1 had the contrast (take a1: 12.8 semitones between the lowest and highest line, 12.5 dB between the
// quietest and loudest) but ran 73 s for 119 words. Same acting, at Peek's pace; the pauses now belong to the edit.
const BRISK = "Pace: fast and tight, clearly quicker than ordinary conversation, no long silences inside a sentence. Cairo pronunciation throughout: تاني not ثاني, اتنين not اثنين, نضيف not نظيف. ";
const ROUND2 = [
  ["يا فندم.. البشر بيصنّعوا غاز سام في الحمّام.",
    "THIS LINE: mock-solemn and grave, like breaking a state secret on the evening news. Low and weighty but not slow; hit «غاز سام» hard.",
    "THIS LINE: a tense, low murmur into a hidden microphone, as if the humans might hear him, every word still perfectly clear. Stress «غاز سام»."],
  ["لأ يا فندم.. مش اللي في بالك.",
    "THIS LINE: a complete change. Quick, flat, slightly embarrassed aside, higher and lighter, as if the commander just guessed something rude. Throwaway.",
    "THIS LINE: weary and flat, the patient correction of a boss who always guesses the rude thing. Dry as dust, quick."],
  ["كل جمعة، الأم المصرية بتعلن الحرب على الحمّام.",
    "THIS LINE: a war correspondent at the front. Energetic, fast, rising, punchy, stress on «الحرب».",
    "THIS LINE: a nature documentary narrator admiring a fearsome predator, awed, relishing «بتعلن الحرب», moving along."],
  ["وعقيدتها بسيطة: منظف ينضّف. اتنين ينضّفوا أكتر. تلاتة؟ <short pause> الحمّام يتولد من جديد.",
    "THIS LINE: counting on his fingers with growing excitement, fast, each step higher than the last; «تلاتة؟» shoots up as a question; then the last phrase drops to a hushed, awestruck revelation, like a miracle.",
    "THIS LINE: a lecturer reciting a doctrine he finds insane: flat quick steps one and two, a sceptical raised «تلاتة؟», then the last phrase with grand mock-religious reverence."],
  ["بس الكلور مع منظف التواليت، أو الخل، أو بعض منظفات الإزاز.. بيطلّع غاز سام.",
    "THIS LINE: the comedy stops. Lower and ominous, like a crime documentary, steady. Each product named clearly. Heavy stress on «غاز سام».",
    "THIS LINE: serious and clear, a scientist giving evidence, each product distinct, the last two words cold and hard."],
  ["كحة. عين بتحرق. صدر بيوجع.",
    "THIS LINE: three hammer blows. Clipped, worried, quick, each item its own short sentence, falling pitch.",
    "THIS LINE: a medic reading a chart, grim and fast, each item bitten off."],
  ["وهي؟ <short pause> فخورة. فاكراها ريحة النضافة.",
    "THIS LINE: appalled disbelief. «وهي؟» goes up, incredulous; «فخورة» lands flat and stunned; the rest shaking his head.",
    "THIS LINE: bone-dry deadpan, almost admiring the absurdity. «وهي؟» small and high, «فخورة» very flat, the rest with a tired sigh in the voice."],
  ["<gasp> دي مش ريحة نضافة.. ده إنذار!",
    "THIS LINE: sudden alarm! He loses his composure for the only time: loud, high, urgent, almost shouting, fast. «إنذار» is the peak.",
    "THIS LINE: sharp and forceful, a sergeant barking a warning. Loud, fast, hard consonants, «إنذار» punched."],
  ["القاعدة: الكلور ما يتخلطش بأي منظف تاني. أبداً. واشطف كويس بين كل منظف والتاني، وافتح الشباك.",
    "THIS LINE: clipped and official, reading a standing order. Every word perfectly clear and firm, no humour at all, moving briskly. «أبداً» alone, firm and final.",
    "THIS LINE: calm, firm and plain, a safety officer who needs every listener to remember this. Even and clear, «أبداً» heavy, no dawdling."],
  ["ولو حصل: اخرج فوراً لهوا نضيف. ولو النَفَس صعب، اتصل بالإسعاف وقول لهم خلطت إيه.",
    "THIS LINE: official, urgent and helpful. Fast and clear, stress on «فوراً» and «الإسعاف». No jokes.",
    "THIS LINE: brisk emergency instructions, clear and steady, stress on «اخرج فوراً» and «اتصل بالإسعاف»."],
  ["والتواليت؟ هيلمع برضه. وهتقف تتفرّج عليه.. كإنه دخل كلية الطب.",
    "THIS LINE: relaxed again, warm and amused, quick. «والتواليت؟» light and curious; then fond storytelling; the last phrase «كإنه دخل كلية الطب» announced with the swelling pride of an Egyptian mother.",
    "THIS LINE: dry and fond. A shrug on «هيلمع برضه», then deadpan, and the last phrase underplayed, quiet and perfectly serious, which is what makes it funny."],
  ["<sigh> أما الغاز اللي في بالك.. فده تقرير تاني.",
    "THIS LINE: a tired sigh first, then low, quick and conspiratorial, between him and the commander only. Trailing down at the end.",
    "THIS LINE: a tired sigh first, then a confidential mutter with a knowing little pause before «فده تقرير تاني»."],
  ["Peek.. انتهى التقرير يا فندم.",
    "THIS LINE: crisp military sign-off. Short, bright, final.",
    "THIS LINE: crisp military sign-off, a little cheerful, glad to be done. Short and final."],
];
function request2(take, idx) {
  const id = `techforbadguys-v2a-bleach-${take}`;
  return [id, {
    voice: "Puck", routing: "quality", format: "wav", sample_rate: 24000, temperature: 1,
    transcript: { language_codes: ["ar-EG"], write_vtt: true },
    turns: ROUND2.map((l) => ({ style: BASE + BRISK + l[idx], text: l[0] })),
    metadata: { channel: "techforbadguys", job_id: id, language: "ar-EG", title: `Shorts lab v2 bleach, studio A, take ${take}` },
  }];
}
for (const [take, idx, fn] of [["a1", 1, request], ["b1", 2, request], ["a2", 1, request2], ["b2", 2, request2]]) {
  const [id, body] = fn(take, idx);
  writeFileSync(new URL(`./${id}.json`, import.meta.url), JSON.stringify(body, null, 1) + "\n");
  console.log(id, body.turns.length, "turns", body.turns.map((t) => t.text).join(" ").replace(/<[^>]+>/g, "").trim().split(/\s+/).length, "words");
}
