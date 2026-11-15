# Science part 2 (world picture): scenes and beats, the planner's words unchanged (storyboard.py checks them).
H=lambda say,**k: {"say":say,"shot":"host",**k}
C=lambda say,**k: {"say":say,"shot":"close",**k}
W=lambda say,**k: {"say":say,"shot":"wide",**k}
def B(say,board,step,side=None,**k):
    b={"say":say,"show":"board","board":board,"step":step,**k}
    if side: b["host"]=side
    return b
P="<short pause> "

NOTES = [
 "World-language picture (one video, several audio tracks), drawn in the notebook look of explain-science-01-world: no Arabic on screen, no burned-in captions, every board beat a wordless illustrated shot. Script: ../explain-science-02-ar/script.md, words unchanged.",
 "Earth Report field file: Science, part 2 of 4. How a study is made and checked: the research paper; the fair test (control group, placebo, blind and double blind); James Lind's twelve sailors (1747); sample size; the 2015 chocolate diet hoax; peer review and pay-to-publish journals; replication and the file drawer; six questions for any science headline.",
 "Facts (sources in ../explain-science-01-ar/plan.md): about three million research articles a year; the chocolate study, 2015: John Bohannon with a German TV team, about 15 people in three groups for 21 days, 18 measurements, accepted by a fee-taking journal (about 600 euros) without real review, reported widely, then revealed. James Lind, HMS Salisbury, 1747: twelve sailors with scurvy in six pairs, the citrus pair recovered (one fit for duty after six days); the Royal Navy adopted citrus in 1795.",
 "General knowledge, not re-checked: how peer review works; placebo, blind and double-blind trials; many early results come from mice; predatory journals; the file drawer, pre-registration, relative versus absolute risk (the 1-in-10,000 example is illustrative). No food or drug is recommended or warned against.",
]

SCENES=[
 {"id":"intro","story":None,"style":"Opening of a field report: the chocolate headline with mock delight, then the question.","beats":[
  C("يا فندم، تقرير ميداني رقم اتنين في ملف العلم.",emote="serious"),
  B("سنة ألفين خمستاشر، الجرايد في بلاد كتير كتبت نفس الخبر: دراسة علمية بتقول إن الشوكولاتة بتخسّس.","s2intro",0),
  B("الناس فرحت. المحلات فرحت.","s2intro",1),
  C("وأنا كمان، بصراحة، فرحت.",emote="sly"),
  B("بعدها بكام أسبوع، الراجل اللي عمل الدراسة طلع وقال: أنا عملتها مخصوص علشان أوريكم قد إيه سهل تضحكوا على العالم.","s2intro",2,"right",emote="skeptical"),
  H("فالنهارده هقول لكم البحث العلمي بيتعمل إزاي، مين بيراجعه قبل ما يوصل لكم، وإزاي الشوكولاتة عدّت من كل ده.",emote="neutral",gesture="count"),
  B("والسؤال المهم: لما تقرا كلمة \"دراسة بتقول\"، تصدّق ولا لأ؟","s2intro",3,"left",emote="skeptical"),
 ]},
 {"id":"s2paper","story":{"n":1,"tag":"THE PAPER","icon":"file"},"style":"Clear explanation of how humans publish, with a dry sense of scale.","beats":[
  B("أول حاجة: البشر مابيعلنوش اكتشافاتهم في الشارع. بيكتبوها في حاجة اسمها ورقة علمية.","s2paper",0),
  B("ورقة بتقول: كان عندنا سؤال كذا، عملنا كذا بالظبط، ولقينا كذا.","s2paper",1),
  B("وأهم جزء فيها مش النتيجة يا فندم. أهم جزء هو \"عملنا إيه بالظبط\". علشان أي حد تاني يقدر يعمل نفس الحاجة ويشوف هيوصل لنفس الكلام ولا لأ.","s2paper",2,"right",emote="serious"),
  B("والبشر بينشروا من الورق ده حوالي تلاتة مليون ورقة في السنة. تلاتة مليون.","s2paper",3),
  B("يعني لو عالم واحد قرا ورقة كل يوم، هيخلّص ورق سنة واحدة بس بعد حوالي تمن آلاف سنة.","s2paper",4),
  C("وعلشان كده، في كل يوم، فيه ورقة في مكان ما بتقول حاجة غريبة. "+P+"والجرايد بتحب الغريب.",emote="deadpan"),
 ]},
 {"id":"fair","story":{"n":2,"tag":"A FAIR TEST","icon":"eye"},"style":"A kitchen analogy, patient and a little amused; the blindfold line lands dry.","beats":[
  H("طب إزاي تعرف إن حاجة معينة هي اللي عملت الفرق؟ خلّيني أشرحها بالمطبخ.",emote="neutral",gesture="present"),
  B("عندك حلّتين شوربة. واحدة حطيت فيها بهار جديد، والتانية لأ.","fairtest",0),
  B("لو الأولى طلعت أحلى، يبقى البهار هو السبب؟ مش أكيد.","fairtest",1),
  B("لازم الحلّتين يكونوا زي بعض في كل حاجة تانية: نفس المية، نفس النار، نفس الوقت.","fairtest",2),
  B("الحلّة اللي من غير البهار دي اسمها المجموعة الضابطة. هي المقياس اللي بتقارن بيه. ومن غيرها، أي نتيجة ملهاش معنى.","fairtest",3,"right",emote="serious"),
  B("والبشر عندهم مشكلة غريبة يا فندم: لو قلت لبني آدم إنك إديته حاجة هتفيده، ساعات بيحس بتحسن فعلاً، حتى لو اللي إديته له مية بسكر. بيسمّوها البلاسيبو.","fairtest",4),
  B("فعلشان كده، في التجارب الجد، المجموعتين بياخدوا حاجة شكلها واحد بالظبط، وماحدش فيهم عارف هو في أنهي مجموعة. ودي اسمها تجربة عمياء.","fairtest",5),
  B("وفي التجارب الأجد، حتى اللي بيدّي الحاجة نفسه مايعرفش. علشان مايبانش عليه. ودي اسمها عمياء من الناحيتين.","fairtest",6,"left",emote="neutral"),
  C("يعني البشر لازم يغمّوا عينين الكل، "+P+"علشان يشوفوا الحقيقة.",emote="deadpan"),
 ]},
 {"id":"lind","story":{"n":3,"tag":"12 SAILORS","icon":"ship"},"style":"A sea story told with growing respect, then a dry sting about waiting.","beats":[
  B("وأول مرة البشر عملوا الحكاية دي بشكل قريب من كده، كانت على مركب. سنة ألف سبعمية سبعة وأربعين، في البحرية البريطانية.","lind",0),
  B("البحّارة كانوا بيموتوا من مرض اسمه الإسقربوط: اللثة بتنزف، والسنان بتقع، والجسم بيتهد.","lind",1,calm=True),
  B("وكل واحد عنده علاج: خل، مية بحر، سيدر التفاح.","lind",2),
  B("دكتور على المركب اسمه James Lind، بدل ما يصدّق حد، جاب اتناشر بحّار عيانين، وقسمهم ست اتنينات. كل اتنين خدوا علاج مختلف، وكلهم نفس الأكل ونفس المكان.","lind",3),
  B("بعد أيام، الاتنين اللي خدوا برتقان وليمون قاموا، وواحد منهم رجع الشغل بعد ست أيام. الباقيين لأ.","lind",4),
  B("اتناشر بحّار يا فندم، وعرفنا حاجة الإمبراطورية كلها ماعرفتهاش.","lind",5,"right",emote="proud"),
  B("والجزء اللي يكسف: البحرية ماعملتش بيها غير بعد حوالي خمسين سنة.","lind",6),
  C("يعني المشكلة عند البشر ساعات مش إنهم مايعرفوش.. "+P+"المشكلة إنهم يعرفوا، ويستنّوا.",emote="deadpan"),
 ]},
 {"id":"sample","story":{"n":4,"tag":"SAMPLE SIZE","icon":"coin"},"style":"Coin flips and chance, brisk and clear, ending on a sharp line.","beats":[
  H("الحاجة التانية: عدد الناس اللي اتجرّب عليهم.",emote="neutral",gesture="count"),
  B("لو رميت عملة تلات مرات، وجت كتابة التلاتة، تقدر تقول إن العملة مضروبة؟","sample",0),
  B("لأ يا فندم. ده بيحصل بالصدفة كل شوية.","sample",1,"right",emote="skeptical"),
  B("بس لو رميتها ألف مرة، وجت كتابة تسعمية مرة.. هنا نتكلم.","sample",2),
  B("التجارب على البشر نفس الحكاية. خمستاشر واحد خسّوا؟ ممكن صدفة. ممكن واحد فيهم كان عيّان. ممكن تلاتة منهم بطّلوا عشا علشان مسافرين.","sample",3),
  B("كل ما العدد يكبر، كل ما الصدفة تصغر. والعدد ده عندهم اسمه العينة.","sample",4),
  C("واللي يقول لك \"دراسة على عشر أشخاص أثبتت\".. هو قال لك حاجة. "+P+"بس ماثبتش حاجة.",emote="deadpan"),
 ]},
 {"id":"choco","story":{"n":5,"tag":"CHOCOLATE","icon":"heart"},"style":"The heist explained step by step, amused, then a fair, serious note on the ethics.","beats":[
  B("نرجع للشوكولاتة. الصحفي اسمه John Bohannon، ومعاه فريق من التلفزيون الألماني.","choco",0),
  B("جابوا حوالي خمستاشر واحد، وقسموهم تلات مجموعات. مجموعة على ريجيم قليل النشويات. مجموعة على نفس الريجيم، ومعاه قطعة شوكولاتة سودا كل يوم. ومجموعة ماغيرتش حاجة. واحد وعشرين يوم.","choco",1),
  H("لحد هنا، شكلها تجربة محترمة، صح؟ بس هنا الحيلة يا فندم.",emote="sly",gesture="present"),
  B("هم ماقاسوش حاجة واحدة. قاسوا تمنتاشر حاجة: الوزن، الكوليسترول، النوم، المزاج، وغيرهم.","choco",2),
  B("ومع عدد صغير وقياسات كتير، أكيد حاجة منهم هتطلع مختلفة بالصدفة. زي ما ترمي تمنتاشر سهم على حيطة، وبعدين ترسم الدايرة حوالين السهم اللي لزق.","choco",3),
  B("واللي طلع بالصدفة المرة دي.. الوزن. مجموعة الشوكولاتة خسّت أسرع.","choco",4),
  B("فكتبوا الورقة، وبعتوها لمجلة. والمجلة قبلتها بسرعة، بعد ما دفعوا رسوم حوالي ستمية يورو. ومن غير ما حد يسألهم سؤال جد.","choco",5),
  B("وبعدين بعتوا خبر صحفي. والجرايد عملت الباقي: ولا جرنال اتصل بعالم يسأله العينة كام واحد. نقلوا العنوان زي ما هو، وزوّدوا عليه صورة شوكولاتة.","choco",6,"right",emote="bored"),
  H("ولما Bohannon طلع وقال إنها لعبة، ناس كتير زعلوا منه هو، وقالوا إن اللي عمله ماكانش أخلاقي، لأنه ضحك على المشتركين كمان. ويمكن عندهم حق.",emote="serious",calm=True),
  C("بس الرسالة وصلت: الطريق من المعمل للجرنال ممكن يبقى من غير ولا حارس.",emote="serious"),
 ]},
 {"id":"review","story":{"n":6,"tag":"PEER REVIEW","icon":"shield"},"style":"How the guards work, fair about strengths and limits; the cashier line is deadpan.","beats":[
  H("طب فين الحراس؟",emote="skeptical",gesture="shrug"),
  B("عند البشر نظام اسمه مراجعة الأقران. العالم يبعت ورقته لمجلة. المجلة تبعتها لاتنين أو تلاتة علما في نفس التخصص. غالباً من غير ما يعرفوا مين كاتبها، ومن غير فلوس.","review",0),
  B("يقروها، ويسألوا: العينة صغيرة ليه؟ فين المجموعة الضابطة؟ قِست كام حاجة؟ وساعات يرفضوها.","review",1),
  B("والنظام ده بيمسك غلطات كتير يا فندم. بس فيه حاجتين لازم تعرفوهم.","review",2,"right",emote="neutral"),
  B("الأولانية: المراجعين بيقروا بس، مابيعيدوش التجربة. لو حد كتب أرقام مزوّرة بذكاء، ممكن تعدّي.","review",3),
  B("والتانية: مش كل اللي اسمه مجلة يبقى مجلة. فيه مجلات بتقبل أي حاجة، طالما دفعت.","review",4),
  B("شكلها مجلة، واسمها مجلة، وجواها.. "+P+"كاشير. وده اللي الشوكولاتة عدّت منه.","review",5,"left",emote="deadpan"),
 ]},
 {"id":"repeat","story":{"n":7,"tag":"DO IT AGAIN","icon":"dup"},"style":"Why repeating matters, then the hidden drawer problem, then a teaser.","beats":[
  H("طب إيه اللي يخلّي البشر يصدّقوا نتيجة بجد؟ إن حد تاني يعيدها.",emote="serious",gesture="present"),
  B("فريق تاني، في بلد تانية، بناس تانيين، يعمل نفس الخطوات اللي في الورقة.. ويوصل لنفس الحاجة. ساعتها بس النتيجة بتبدأ تبقى حقيقة.","repeat",0),
  B("لو ماحدش قدر يعيدها، تفضل نتيجة واحدة. ممكن صح، وممكن صدفة، "+P+"وممكن كابل مش داخل كويس.","repeat",1,"right",emote="sly"),
  B("وفيه مشكلة تانية أخبث يا فندم. تخيّل عشرين معمل في العالم جرّبوا نفس الفكرة.","repeat",2),
  B("تسعتاشر منهم مالقوش حاجة، فقالوا: خلاص، مفيش حاجة نكتبها، وحطوا النتيجة في الدرج. وواحد بس، بالصدفة، لقى فرق.","repeat",3),
  B("مين اللي هيتنشر؟ الواحد ده بس. فاللي بيقرا من بره، شايف بحث واحد بيقول \"لقينا\"، ومش شايف التسعتاشر اللي في الدرج. البشر بيسمّوها مشكلة الدرج.","repeat",4),
  B("وعلشان كده، علما كتير دلوقتي بيكتبوا خطة التجربة ويسجّلوها قبل ما يبدأوا، علشان مايقدروش بعدين يقولوا: إحنا أصلاً كنا بندوّر على الوزن.","repeat",5),
  H("وهنا فيه مفاجأة يا فندم، هحكيها لكم في تقرير جاي: لما البشر قعدوا يعيدوا أبحاث قديمة كتير، اكتشفوا حاجة مش مريحة خالص.",emote="worried"),
 ]},
 {"id":"headline","story":{"n":8,"tag":"6 QUESTIONS","icon":"eye"},"style":"A practical checklist read briskly, with the mice joke and the doubling trick.","beats":[
  H("فجمعت لكم شوية أسئلة، تسألوها لأي خبر بيبدأ بـ\"دراسة بتقول\".",emote="neutral",gesture="count"),
  B("أولاً: الدراسة على كام واحد؟ عشرة ولا عشرة آلاف؟","headline",0),
  B("ثانياً: كان فيه مجموعة يقارنوا بيها، ولا لأ؟","headline",1),
  B("ثالثاً: الدراسة على بشر، ولا على فيران؟ أصل نص الأخبار العظيمة يا فندم بتبقى على فيران.","headline",2),
  C("والفار ده يتشكر، "+P+"بس هو مش أنا ولا انت.",emote="deadpan"),
  B("رابعاً: حد تاني عمل نفس الدراسة ووصل لنفس النتيجة؟","headline",3),
  B("وخامساً: مين اللي دفع فلوسها؟ مش علشان أي حد دفع يبقى كذاب، بس علشان تبقى عارف.","headline",4,"right",emote="neutral"),
  B("وسادساً، ودي أحلى واحدة: الخطر زاد الضعف؟ ضعف كام؟","headline",5),
  B("أصل لو حاجة كانت بتحصل لواحد من كل عشر آلاف، وبقت بتحصل لاتنين من كل عشر آلاف.. ده «الضعف» بالظبط. العنوان هيكتب: الخطر اتضاعف!","headline",6),
  B("والحقيقة إن تسعة آلاف تسعمية تمانية وتسعين واحد ماحصلّهمش حاجة، زي الأول. الرقم صح، والإحساس اللي العنوان عايزك تحسه.. غلط.","headline",7,"right",emote="skeptical"),
  C("ولو الخبر عدّى من الست أسئلة دول.. صدّقه. "+P+"بس صدّقه شوية.",emote="sly"),
 ]},
 {"id":"dict","story":{"n":9,"tag":"WORDS","icon":"key"},"style":"A quick aside, like reading two entries from a field dictionary.","beats":[
  B("قاموس البشر. كلمتين النهارده. عينة: الناس اللي التجربة اتعملت عليهم فعلاً، وكل ما يكتروا، كل ما الصدفة تقل.","s2dict",0),
  B("ومراجعة الأقران: علما بيقروا البحث قبل ما يتنشر ويحاولوا يلاقوا فيه غلط، بس مابيعيدوش التجربة.","s2dict",1,"right"),
 ]},
 {"id":"recap","story":{"n":10,"tag":"RECAP","icon":"rules"},"style":"Summary, one sincere line, the teaser, and the sign-off.","beats":[
  B("الخلاصة يا فندم. أولاً: التجربة المحترمة محتاجة مجموعة تقارن بيها، وعدد كبير، وعيون متغمّية.","s2recap",0,"right"),
  B("ثانياً: قيس حاجات كتير في ناس قليلين، وهتلاقي \"اكتشاف\" بالصدفة، زي الشوكولاتة.","s2recap",1,"right"),
  B("ثالثاً: المراجعة بتمسك كتير بس مش كل حاجة، والحقيقة بتبان لما حد تاني يعيد التجربة.","s2recap",2,"right"),
  C("وبصراحة، الشوكولاتة ماكانتش هي المشكلة. المشكلة إن البشر بيحبوا يصدّقوا الخبر اللي على مزاجهم.",emote="serious"),
  H("في التقرير الجاي: ليه العلما بيغيروا كلامهم كل شوية؟ وحكاية دكتور قال لزمايله اغسلوا إيديكم.. فطردوه.",emote="sly",gesture="count"),
  W("ده كان تقرير الأرض. العميل Peek. انتهى الإرسال.",emote="proud",gesture="wave"),
 ]},
]
