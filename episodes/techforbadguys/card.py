from PIL import Image, ImageDraw, ImageFont
import glob, sys
W,H=1920,1080
def font(names, size):
    for n in names:
        hits=glob.glob(f"/usr/share/fonts/**/{n}", recursive=True)
        if hits: return ImageFont.truetype(hits[0], size)
    return ImageFont.load_default()
bold=lambda s: font(["InterDisplay-Black.otf","InterDisplay-Bold.otf","Inter-Bold.otf","DejaVuSans-Bold.ttf"], s)
mono=lambda s: font(["DejaVuSansMono-Bold.ttf","DejaVuSansMono.ttf"], s)
reg=lambda s: font(["Inter-Regular.otf","InterDisplay-Regular.otf","DejaVuSans.ttf"], s)
RED=(255,77,90); FG=(236,236,240); DIM=(140,145,160); MUTED=(110,115,130)

img=Image.new("RGB",(W,H),(11,12,16)); d=ImageDraw.Draw(img)
for x in range(0,W,80): d.line([(x,0),(x,H)],fill=(18,20,26),width=1)
for y in range(0,H,80): d.line([(0,y),(W,y)],fill=(18,20,26),width=1)

# header
x=96; y=64
for word,col in (("TECH",FG),("FOR",RED),("BADGUYS",FG)):
    d.text((x,y),word,font=bold(52),fill=col); x+=d.textlength(word,font=bold(52))+8
d.text((96,132),"A SARCASTIC BRIEFING FOR VILLAINS  //  EP. 001  //  31 OCT 2026",font=mono(24),fill=DIM)
d.rounded_rectangle([1580,64,1824,118],radius=10,fill=RED)
d.text((1702,91),"LIVE-ISH",font=mono(28),fill=(16,10,12),anchor="mm")

# title
d.text((96,230),"Patch Tuesday",font=bold(124),fill=FG)
d.text((96,358),"Is for Cowards",font=bold(124),fill=RED)

# stories
y=540
for s in ["PHP2Shell: one request, full server","Banks vs. the robots in your account","\"Department of Peace\" leaks 40,000 DHS staff","Lightning round: Capcom, Sony, Quest, OpenAI"]:
    d.rectangle([96,y+9,108,y+27],fill=RED)
    d.text((126,y),s,font=reg(31),fill=(190,195,210)); y+=46

# waveform strip (y 760-840) is drawn by ffmpeg; faint baseline + label
d.line([(96,800),(1824,800)],fill=(36,40,50),width=1)
d.text((1824,748),"AUDIO // ALGENIB // GEMINI 3.8",font=mono(18),fill=MUTED,anchor="ra")

# caption band (y 860-990) is used by burned-in captions
d.line([(96,1008),(1824,1008)],fill=(40,44,54),width=2)
d.text((96,1024),"NOTHING ON THIS SHOW IS ADVICE. IT IS COMMENTARY. PATCH YOUR STUFF.",font=mono(22),fill=MUTED)
out=sys.argv[1] if len(sys.argv)>1 else "card.png"
img.save(out); print(out, img.size)
