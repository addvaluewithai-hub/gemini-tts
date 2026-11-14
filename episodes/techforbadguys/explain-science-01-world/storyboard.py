#!/usr/bin/env python3
# Generates storyboard.json for science part 1 (world picture) from the planner's script
# (../explain-science-01-ar/script.md). Words are the script's, unchanged; the check at the bottom proves it.
import json, re, os
HERE = os.path.dirname(os.path.abspath(__file__))
H=lambda say,**k: {"say":say,"shot":"host",**k}
C=lambda say,**k: {"say":say,"shot":"close",**k}
W=lambda say,**k: {"say":say,"shot":"wide",**k}
def B(say,board,step,side=None,**k):
    b={"say":say,"show":"board","board":board,"step":step,**k}
    if side: b["host"]=side
    return b
P="<short pause> "

scenes=[
 {"id":"intro","story":None,"style":"Opening of a field report. He states the new file at once, crisp and quick, then the strangest story he found.","beats":[
  C("يا فندم، تقرير ميداني رقم واحد في ملف جديد: ملف العلم.",emote="serious"),
  B("البشر عندهم حاجة اسمها العلم، بيصدّقوها أكتر من أي حاجة تانية.","sintro",0),
  B("بيركبوا طيارات علشانها، وبياخدوا دوا علشانها، وبيبنوا عمارات بعشرين دور علشانها.","sintro",1),
  B("وفي نفس الوقت، نص الكوكب بيسأل نفس السؤال: هو إحنا ليه نصدّق العلما دول؟ مش ممكن يكونوا بيضحكوا علينا؟","sintro",2,"right",emote="skeptical"),
  H("النهارده هشرح لكم العلم ده إيه أصلاً، وليه البشر واثقين فيه.",emote="neutral",gesture="present"),
  B("وهبدأ بأغرب حكاية لقيتها: سنة ألفين وحداشر، مجموعة علما وقفوا قدام العالم كله وقالوا: إحنا لقينا حاجة أسرع من الضوء.","sintro",3),
  B("وبعدها بكام شهر، طلع المتهم.. "+P+"كابل مش داخل كويس.","sintro",4,"left",emote="deadpan"),
 ]},
 {"id":"announce","story":{"n":1,"tag":"FASTER THAN LIGHT?","icon":"atom","size":54},"style":"A story told with growing disbelief, then admiration for an honest move, then a dry aside about his own bosses.","beats":[
  B("الحكاية يا فندم بدأت في أوروبا. فيه معمل كبير في جنيف اسمه CERN، بيضرب جزيئات صغيرة جداً اسمها نيوترينو، تحت الأرض، لحد معمل تاني في إيطاليا.","announce",0),
  B("المسافة حوالي سبعمية وتلاتين كيلو. وفريق اسمه OPERA كان بيقيس الرحلة دي بالساعة.","announce",1),
  B("سنة ألفين وحداشر، الأرقام طلعت غريبة: الجزيئات وصلت بدري. بدري بحوالي ستين جزء من مليار من الثانية.","announce",2),
  B("يعني أسرع من الضوء. "+P+"وده المفروض مستحيل.","announce",3,"right",emote="skeptical"),
  B("أينشتاين قال إن مفيش حاجة تسبق الضوء، وكل الفيزيا اللي البشر بنوها من مية سنة قايمة على الكلام ده.","announce",4),
  H("هنا البشر عندهم اختيارين يا فندم.",emote="sly",gesture="count"),
  B("يا يخبّوا النتيجة في الدرج. يا يعلنوها ويقولوا: إحنا مش مصدّقين نفسنا.","announce",5),
  B("وهم عملوا التانية. عملوا مؤتمر صحفي، وقالوا للعالم كله: دي أرقامنا، دوّروا لنا على الغلطة.","announce",6,"right",emote="neutral"),
  C("وأنا لما قريت ده يا فندم، قعدت ساكت شوية. "+P+"عندنا في القيادة، اللي يقول إنه غلطان بينقلوه قسم الأرشيف.",emote="deadpan"),
 ]},
 {"id":"workshop","story":{"n":2,"tag":"METHOD","icon":"gear"},"style":"Patient teacher correcting a common mistake, simple and firm.","beats":[
  B("أول حاجة لازم تفهموها: البشر فاكرين إن العلم كتاب كبير فيه الإجابات.","workshop",0),
  B("الأرض بتلف حوالين الشمس، المية بتغلي على مية درجة، وهكذا.","workshop",1),
  B("بس ده مش العلم يا فندم. ده اللي فاضل بعد العلم.","workshop",2,"right",emote="sly"),
  C("العلم نفسه طريقة. طريقة علشان البني آدم مايضحكش على نفسه.",emote="serious"),
  B("وهي بسيطة جداً: قول حاجة ممكن تتجرب. جرّبها. وبعدين حاول بكل قوتك تثبت إنها غلط.","workshop",3),
  B("لو صمدت، نصدّقها شوية. لو صمدت قدام ناس كتير مش بيحبوك.. نصدّقها أكتر.","workshop",4),
  B("يعني العلم مش مكتبة يا فندم. العلم ورشة. وكل حاجة في الورشة دي ممكن تتفك وتتركّب من أول وجديد، حتى أينشتاين نفسه.","workshop",5,"left",emote="proud"),
 ]},
 {"id":"shadow","story":{"n":3,"tag":"STICK & SHADOW","icon":"sun","size":54},"style":"Wonder at an old, simple idea, told step by step like a puzzle being solved.","beats":[
  B("وعلشان تعرفوا الطريقة دي قديمة قد إيه، روحت لحكاية من أكتر من ألفين ومتين سنة.","shadow",0),
  B("راجل اسمه Eratosthenes، كان مسؤول عن مكتبة إسكندرية.","shadow",1),
  B("سمع إن في مدينة في الجنوب اسمها أسوان، في يوم معين في الصيف، الضهر بالظبط، الشمس بتنور قاع البير. يعني مفيش ضل خالص.","shadow",2),
  B("فعمل حاجة بسيطة: في نفس اليوم، في نفس الساعة، غرز عصاية في الأرض في إسكندرية. ولقى لها ضل.","shadow",3),
  B("ضل صغير، زاويته حوالي سبع درجات. يعني جزء من خمسين من الدايرة.","shadow",4),
  B("فقال: لو الأرض مسطحة، الضلين المفروض يبقوا زي بعض.","shadow",5),
  B("بما إنهم مختلفين.. "+P+"يبقى الأرض مدوّرة.","shadow",6),
  B("وبما إن الفرق جزء من خمسين، يبقى المسافة بين المدينتين جزء من خمسين من لفّة الأرض كلها.","shadow",7),
  B("المسافة اتقاست بالخطوات، حوالي خمس آلاف استاديون. ضرب في خمسين، وطلع ميتين وخمسين ألف.","shadow",8),
  B("البشر لحد النهارده مختلفين الاستاديون ده طوله قد إيه بالظبط، بس على أغلب الحسابات، الرقم قريب جداً من الأربعين ألف كيلو الحقيقيين.","shadow",9,"right",emote="neutral"),
  B("من غير طيارة، ولا قمر صناعي، ولا إنترنت. عصاية، وضل، ودماغ.","shadow",10),
  H("وأهم حاجة في الحكاية مش الرقم يا فندم. أهم حاجة إن أي حد في الدنيا، معاه عصاية وصاحب في مدينة تانية، يقدر يعيدها النهارده ويشوف بنفسه.",emote="serious",gesture="present"),
  C("ومحتاجش يصدّق Eratosthenes. "+P+"يجرّب.",emote="proud"),
 ]},
 {"id":"dragon","story":{"n":4,"tag":"DRAGON","icon":"ghost"},"style":"A comic thought experiment, played straight, then the serious rule it proves.","beats":[
  H("طب إيه اللي يخلّي كلام يبقى علمي، وكلام تاني لأ؟",emote="skeptical",gesture="shrug"),
  B("تخيّل يا فندم واحد جه قال لك: عندي تنين في الجراج.","dragon",0),
  B("تقول له: وريني. يقول لك: ده تنين مش بيتشاف.","dragon",1),
  B("طب نرش دقيق على الأرض نشوف رجليه. يقول لك: ده بيطير.","dragon",2),
  B("طب نقيس حرارة النار اللي بيطلّعها. يقول لك: ناره باردة.","dragon",3),
  B("كل ما تجيب طريقة تختبر بيها، يجيب لك سبب.","dragon",4,"right",emote="bored"),
  C("الكلام ده ممكن يكون صح، وممكن يكون غلط، بس عمره ما هيبقى علم.",emote="serious"),
  H("ليه؟ لأن مفيش أي تجربة في الدنيا ممكن تثبت إنه غلط.",emote="neutral",gesture="count"),
  B("وده أهم شرط عند البشر في العلم: لازم الكلام يكون ممكن يغلط. لازم تقول: لو حصل كذا، أبقى أنا غلطان.","dragon",5),
  B("أينشتاين نفسه عمل كده. نظريته قالت إن ضوء النجوم اللي بيعدّي جنب الشمس لازم يتني بقدر معين. لو ما اتناش، تبقى النظرية غلط.","dragon",6),
  B("وسنة ألف تسعمية تسعتاشر، البشر استنوا كسوف الشمس، وراحوا قاسوا. "+P+"والضوء اتنى.","dragon",7,"right",emote="proud"),
 ]},
 {"id":"cable","story":{"n":5,"tag":"THE CABLE","icon":"cable"},"style":"Back to the mystery, now an investigation; quick and precise, then a quiet note about the team leader.","beats":[
  B("نرجع للجزيئات اللي أسرع من الضوء. بعد الإعلان، علما من كل حتة في العالم قعدوا يدوّروا.","cable",0),
  B("مش علشان يصدّقوا. علشان يكسروا النتيجة. وده بالظبط اللي المفروض يحصل.","cable",1,"right",emote="sly"),
  B("وبعد حوالي خمس شهور، الفريق نفسه لقى الغلطة.","cable",2),
  B("كابل ألياف ضوئية بيوصّل إشارة الوقت من جهاز الـ GPS للكمبيوتر.. ماكانش داخل للآخر.","cable",3),
  B("وكمان فيه ساعة في الجهاز كانت ماشية غلط.","cable",4),
  B("مشاكل صغيرة جداً، بس كفاية تغيّر النتيجة الستين جزء من مليار اللي كانوا فرحانين بيهم.","cable",5,"left",emote="deadpan"),
  B("وفي نفس الوقت، تجربة تانية في نفس المعمل الإيطالي، اسمها ICARUS، قاست سرعة نفس الجزيئات. ولقيتها ماشية بسرعة الضوء بالظبط. لا أسرع، ولا أبطأ.","cable",6),
  B("وبعد ما الفريق صلّح الكابل وعاد الحسابات، طلعت النتيجة: سرعة الضوء. أينشتاين كسب.","cable",7),
  C("ورئيس الفريق كان استقال قبلها.",emote="neutral"),
  B("ولاحظ يا فندم، مين اللي كشف الغلطة؟ مش صحفي، ولا حكومة. العلم نفسه. في أقل من سنة.","cable",8,"right",emote="serious"),
 ]},
 {"id":"theory","story":{"n":6,"tag":"THEORY","icon":"rules"},"style":"Clearing up a word everyone gets wrong, with a neighbourly joke and a dry one.","beats":[
  H("فيه كلمة البشر بيستخدموها غلط طول الوقت: نظرية.",emote="sly",gesture="present"),
  B("في الشارع، لما حد يقول عندي نظرية، يقصد عنده تخمين. يعني: أنا حاسس إن جاري هو اللي بياخد الجرنال.","theory",0),
  H("بس عند العلما، الكلمة دي معناها حاجة تانية خالص.",emote="neutral"),
  B("البداية بتبقى فرضية: تخمين ممكن يتجرب.","theory",1),
  B("لو اتجرّبت كتير، وصمدت، ونجحت تتنبأ بحاجات ماحدش شافها لسه.. ساعتها بس تبقى نظرية.","theory",2),
  B("يعني النظرية عندهم مش أول السلم يا فندم. دي آخره.","theory",3,"right",emote="serious"),
  B("نظرية الجاذبية مثلاً. محدش بيقول عليها: أي كلام.","theory",4),
  C("بدليل إن محدش بينط من الشباك علشان يجرّبها.",emote="deadpan"),
  B("ونظرية إن الأمراض بتيجي من كائنات صغيرة مابتتشافش بالعين، الجراثيم، دي كمان نظرية. وبسببها البشر بيغسلوا إيديهم.","theory",5),
  H("وده موضوع، صدّقني، ليه حكاية في تقرير جاي.",emote="sly"),
 ]},
 {"id":"halley","story":{"n":7,"tag":"HALLEY","icon":"comet"},"style":"A slow-building story with a quiet, moving end.","beats":[
  H("وفيه اختبار أصعب من إنك تشرح حاجة حصلت: إنك تقول حاجة هتحصل، قبل ما تحصل.",emote="serious",gesture="count"),
  B("سنة ألف سبعمية وخمسة، راجل إنجليزي اسمه Edmond Halley كان بيقرا تسجيلات قديمة لمذنّبات ظهرت في السما.","halley",0),
  B("لاحظ إن فيه مذنّب بيظهر كل حوالي ستة وسبعين سنة.","halley",1),
  B("فقال: ده مش تلات مذنبات. ده مذنب واحد بيرجع.","halley",2),
  B("وحسب بقوانين الجاذبية، وقال: هيرجع تاني حوالي سنة ألف سبعمية تمانية وخمسين.","halley",3),
  B("Halley مات قبلها بستاشر سنة.","halley",4),
  B("وفي ليلة الكريسماس سنة تمانية وخمسين.. "+P+"المذنّب ظهر.","halley",5),
  B("البشر سمّوه باسمه.","halley",6,"right",emote="neutral"),
  H("تخيّل يا فندم تحط اسمك على تنبؤ هتموت قبل ما تشوفه.",emote="serious"),
  C("ده يا مجنون، يا واثق في الطريقة اللي حسب بيها. "+P+"وهو ماكانش مجنون.",emote="proud"),
 ]},
 {"id":"trust","story":{"n":8,"tag":"WHY TRUST IT","icon":"shield","size":54},"style":"The answer to the episode's question: clear, warm, with one dry joke about scientists.","beats":[
  H("طيب. نرجع للسؤال الأصلي: ليه البشر يصدّقوا العلم؟",emote="neutral"),
  H("مش علشان العلما أذكى من باقي الناس. ولا علشان مابيغلطوش. ده هم بيغلطوا طول الوقت، زي ما شفنا.",emote="skeptical",gesture="shrug"),
  H("البشر بيصدّقوه علشان سببين.",emote="neutral",gesture="count"),
  B("الأول: هو الطريقة الوحيدة عندهم اللي مبنية علشان تدوّر على غلطها بنفسها.","trust",0),
  B("أي واحد يقدر يعيد التجربة. وأي عالم يثبت إن الكبار غلطانين.. بياخد جايزة، مش عقاب.","trust",1),
  C("ومش بنصدّق عالم واحد يا فندم. ده غلط برضه.",emote="serious"),
  B("اللي بنصدّقه هو لما فرق كتير، في بلاد مختلفة، مش بيحبوا بعض، ومنافسين على نفس الجايزة، يعيدوا نفس التجربة ويوصلوا لنفس النتيجة.","trust",2),
  B("ساعتها الكلام ده بيبقى صعب جداً يكون مؤامرة. لأن المؤامرة محتاجة الكل يتفق.","trust",3,"right",emote="sly"),
  C("والعلما يا فندم ماتفقوش على حاجة في حياتهم.. "+P+"غير على النتايج اللي اتكررت.",emote="deadpan"),
  B("والسبب التاني أبسط: إنها بتشتغل. الموبايل اللي في إيدك، والطيارة اللي فوق راسك، والكوبري اللي معدّي عليه.","trust",4),
  B("كل دول تنبؤات علمية، والبشر بيراهنوا بحياتهم عليها كل يوم. "+P+"والرهان بيكسب.","trust",5,"left",emote="proud"),
 ]},
 {"id":"dict","story":{"n":9,"tag":"WORDS","icon":"key"},"style":"A quick aside, like reading two entries from a field dictionary.","beats":[
  B("قاموس البشر. كلمتين النهارده. فرضية: تخمين ممكن يتجرب، ولسه ماحدش أثبته.","sdict",0),
  B("ونظرية: فرضية اتجرّبت ألف مرة وصمدت، مش تخمين زي ما الناس فاكرة.","sdict",1,"right"),
 ]},
 {"id":"recap","story":{"n":10,"tag":"RECAP","icon":"rules"},"style":"Summary, then one sincere line, the teaser, and the sign-off.","beats":[
  B("الخلاصة يا فندم. أولاً: العلم مش كتاب إجابات. العلم طريقة علشان ماتضحكش على نفسك.","srecap",0,"right"),
  B("ثانياً: الكلام العلمي لازم يكون ممكن يغلط، وإلا يبقى تنين في جراج.","srecap",1,"right"),
  B("ثالثاً: العلما بيغلطوا، بس الطريقة نفسها هي اللي بتكشف الغلط، زي الكابل اللي كان أسرع من الضوء.","srecap",2,"right"),
  C("ودي حاجة لازم أعترف بيها: البشر اخترعوا نادي، الوحيد على الكوكب، اللي بيدفع لك لو أثبتّ إنه غلطان.",emote="serious"),
  H("في التقرير الجاي: البحث العلمي بيتعمل إزاي؟ ومين بيراجعه قبل ما يوصل لك؟ وإزاي صحفي واحد ضحك على العالم كله بالشوكولاتة.",emote="sly",gesture="count"),
  W("ده كان تقرير الأرض. العميل Peek. انتهى الإرسال.",emote="proud",gesture="wave"),
 ]},
]

# ---- the words are the script's: compare every section with the planner's text ----
src = open(os.path.join(HERE, "../explain-science-01-ar/script.md"), encoding="utf8").read().split("## Script", 1)[1]
parts = re.split(r"^### (.+)$", src, flags=re.M)[1:]
script = {parts[i].strip(): parts[i + 1].strip() for i in range(0, len(parts), 2)}
order = list(script.values())
plain = lambda t: re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t)).strip()
assert len(order) == len(scenes), (len(order), len(scenes))
for sc, want in zip(scenes, order):
    got = plain(" ".join(b["say"] for b in sc["beats"]))
    assert got == plain(want), f"scene {sc['id']} differs from the script:\n{got}\n---\n{plain(want)}"

boards = {k: {"kind": k} for k in ["sintro", "announce", "workshop", "shadow", "dragon", "cable", "theory", "halley", "trust", "sdict", "srecap"]}
# keep ends written by sets/beats.cjs --write
out = os.path.join(HERE, "storyboard.json")
old = json.load(open(out, encoding="utf8")) if os.path.exists(out) else {}
for k, v in (old.get("boards") or {}).items():
    if k in boards and "ends" in v: boards[k]["ends"] = v["ends"]

STYLE = "A small alien spy on Earth filing a field report to his commanders back home about something he has observed among humans, in Egyptian Arabic, Cairo street dialect, not Modern Standard Arabic. He calls them يا فندم now and then. He explains what he found clearly and simply, a little amused. Brisk pace, noticeably quicker than ordinary conversation, and no dead air: he goes straight from one sentence into the next. Bright, higher-pitched, slightly nasal voice, never deep or gravelly. Dry, deadpan Egyptian sarcasm; he never laughs at his own jokes. English names are said the English way."
sb = {
 "title": "تقرير الأرض: العلم 1 (world picture)",
 "recorded_for": "2026-11-24",
 "layout": "explain", "date": "", "language": "ar-EG", "rtl": True, "voice": "Puck", "face": "pear",
 "notes": [
  "World-language picture (one video, several audio tracks), drawn in the sets style of explain-crypto-01-world: no Arabic on screen, no burned-in captions, every board beat a wordless illustrated shot (video/sets/sci-*.js). Script: ../explain-science-01-ar/script.md, words unchanged.",
  "Earth Report field file: Science, part 1 of 4. What science is: a method for not fooling yourself; Eratosthenes measuring the planet with a stick and a shadow; why a claim that cannot fail is not science (the dragon in the garage); the 2011 OPERA 'faster than light' neutrinos and the loose cable; what 'theory' means to scientists; Halley's prediction; why the method earns trust.",
  "Facts (sources in ../explain-science-01-ar/plan.md): OPERA announced in September 2011 neutrinos arriving about 60 billionths of a second early over about 730 km from CERN (Geneva) to Gran Sasso (Italy), and asked other physicists to check; in February 2012 a loose fibre-optic cable on the GPS timing and a clock problem were found; ICARUS measured light speed; in June 2012 the revised OPERA result agreed with light speed; the OPERA leader stepped down in March 2012. Eratosthenes, about 240 BC: no shadow at noon on the summer solstice in Syene (Aswan), about 7 degrees (1/50 of a circle) in Alexandria, about 5,000 stadia apart, so 250,000 stadia; the stadion's length is uncertain, so 'very close' to 40,000 km.",
  "General knowledge, not re-checked: the dragon-in-the-garage idea; Eratosthenes ran the Library of Alexandria; the 1919 eclipse measurement of starlight bending; Halley predicted (1705) the return around 1758, died 1742, the comet was seen on Christmas night 1758. No medical or religious claims.",
 ],
 "style": STYLE,
 "settings": {"lead": 0.3, "tail": 13, "tempo": 1.06, "tighten": {"max": 0.32, "keep": 0.22}, "captionChunk": 4, "bpm": 100, "musicGain": 0.45, "sfxGain": 0.25, "voiceGain": 1.35, "captions": False, "whooshGain": 0, "shots": {"host": {"s": 1.18, "y": 470}, "close": {"s": 1.42, "y": 410}}, "letterbox": False},
 "ending": {"card": {"kind": "endnext", "title": "NEXT", "next": "2 / 4", "icons": ["file", "eye", "rules"], "note": ""}},
 "brand": {"a": "Earth ", "b": "Report", "c": "", "tagline": ""},
 "theme": "day",
 "boards": boards,
 "scenes": scenes,
}
if old.get("youtube"): sb["youtube"] = old["youtube"]
json.dump(sb, open(out, "w", encoding="utf8"), ensure_ascii=False, indent=1)
open(out, "a").write("\n")
words = sum(len(plain(b["say"]).split()) for s in scenes for b in s["beats"])
nb = sum(1 for s in scenes for b in s["beats"]); nh = sum(1 for s in scenes for b in s["beats"] if "shot" in b)
print(f"scenes {len(scenes)}, beats {nb} (host {nh}), words {words}")
