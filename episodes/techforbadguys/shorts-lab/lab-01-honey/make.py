# Shorts lab 01 honey (producer D): the writer's script (branch shorts-writer, shorts-lab/01-honey/script.md, 1f4de73), words unchanged.
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, ".."))
from lab import B, P, build, part
L = [
 "يا فندم، البشر عندهم أكل مالوش تاريخ صلاحية.. " + P + "العسل.",
 "فيه حكاية مشهورة عندهم: علما آثار فتحوا مقبرة مصرية قديمة، لقوا جرّة عسل عمرها آلاف السنين، وداقوها.. ولسه حلوة.",
 "الحكاية دي بتتقال كتير يا فندم، بس أنا دوّرت.. ومالقيتش عليها دليل مؤكد.",
 "الغريب بقى إن العلم بيقول إنها ممكنة.",
 "العسل فيه مية قليلة جداً، أقل من الخُمس، والباقي تقريباً كله سكر.",
 "والسكر ده كتير لدرجة إن أغلب الميكروبات ماتعرفش تعيش فيه.",
 "وكمان العسل حمضي، والنحل بيحط فيه إنزيم بيطلّع مادة مطهّرة.",
 "يعني النحل اخترع حفظ الأكل قبل ما البشر يخترعوا التلاجة.",
 "بس بشرط واحد: البرطمان يفضل مقفول، لإن العسل بيشرب مية من الهوا.. وساعتها يبوظ.",
 "الخلاصة يا فندم: على الكوكب ده.. البرطمان المقفول ممكن يعيش أكتر من اللي قفله.",
 "Peek.. انتهى التقرير يا فندم.",
]
beats = [B(t, "honey", i) for i, t in enumerate(L[:-1])] + [B(L[-1], "signoff", 0)]
if "part" in sys.argv: part(HERE)
else: build(HERE, "تقرير الأرض: عسل الفراعنة (shorts lab 01)", beats, {"honey": {"kind": "honey"}},
           "A field report to the commander: curious, a little amused, sure of the science; the tomb story told as a story, not a fact.",
           sources=["Sources: https://en.wikipedia.org/wiki/Honey (water 15.5-18%, sugar, acidity, glucose oxidase, absorbs moisture; no edible honey proven from Egyptian tombs)."])
