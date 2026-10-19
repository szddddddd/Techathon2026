"""Export the three submission documents. Requires ReportLab and Microsoft YaHei."""
from pathlib import Path
import html
import re
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Flowable, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
TARGETS = ['TECHNICAL-ARCHITECTURE', 'THIRD-PARTY-RESOURCES', 'PROJECT-OVERVIEW']
pdfmetrics.registerFont(TTFont('YaHei', 'C:/Windows/Fonts/msyh.ttc', subfontIndex=0))
pdfmetrics.registerFont(TTFont('YaHeiBold', 'C:/Windows/Fonts/msyhbd.ttc', subfontIndex=0))
pdfmetrics.registerFontFamily('YaHei', normal='YaHei', bold='YaHeiBold', italic='YaHei', boldItalic='YaHeiBold')
INK = colors.HexColor('#202B38')
BLUE = colors.HexColor('#246A91')
W = 487
STYLES = {
    'body': ParagraphStyle('body', fontName='YaHei', fontSize=9, leading=15.5, textColor=INK, wordWrap='CJK', spaceAfter=7),
    'cell': ParagraphStyle('cell', fontName='YaHei', fontSize=8, leading=13, textColor=INK, wordWrap='CJK'),
    'code': ParagraphStyle('code', fontName='YaHei', fontSize=8, leading=13, textColor=INK, wordWrap='CJK', leftIndent=10, backColor=colors.HexColor('#F4F6F8'), spaceAfter=8),
    'h1': ParagraphStyle('h1', fontName='YaHeiBold', fontSize=22, leading=31, textColor=INK, spaceAfter=16, keepWithNext=True),
    'h2': ParagraphStyle('h2', fontName='YaHeiBold', fontSize=13, leading=21, textColor=BLUE, spaceBefore=13, spaceAfter=8, keepWithNext=True),
    'h3': ParagraphStyle('h3', fontName='YaHeiBold', fontSize=10.5, leading=18, textColor=INK, spaceBefore=8, spaceAfter=5, keepWithNext=True),
}

def inline(text):
    text = html.escape(text)
    text = re.sub(r'&lt;br\s*/?&gt;', '<br/>', text)
    def link(m):
        label, url = m.groups()
        if not re.match(r'https?://', url):
            url = 'https://github.com/szddddddd/Techathon2026/blob/main/docs/' + url
        return '<a href="' + url.replace('&amp;', '&') + '" color="#246A91">' + label + '</a>'
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, text)
    text = re.sub(r'`([^`]+)`', r'<font color="#475B70">\1</font>', text)
    return re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)

def para(text, style='body'):
    return Paragraph(inline(text), STYLES[style])

class Architecture(Flowable):
    """Vector overview of the Mermaid graph; all source components are retained."""
    def __init__(self):
        super().__init__()
        self.width = W
        self.height = 450
    def draw(self):
        c = self.canv
        def box(x, y, w, h, label, fill='#F3F7FA'):
            c.setFillColor(colors.HexColor(fill)); c.setStrokeColor(colors.HexColor('#CCD8E0'))
            c.roundRect(x, y, w, h, 6, fill=1, stroke=1)
            p = Paragraph(label, ParagraphStyle('diagram', fontName='YaHei', fontSize=8, leading=12, alignment=TA_CENTER, textColor=INK, wordWrap='CJK'))
            _, ph = p.wrap(w-12, h); p.drawOn(c, x+6, y+(h-ph)/2)
        def arrow(x1,y1,x2,y2):
            c.setStrokeColor(colors.HexColor('#7994A6')); c.setLineWidth(.7)
            c.line(x1,y1,x2,y2)
            import math
            a = math.atan2(y2-y1,x2-x1)
            for d in [-.45,.45]: c.line(x2,y2,x2-5*math.cos(a+d),y2-5*math.sin(a+d))
        box(0,393,155,45,'浏览器主应用<br/>Three.js / WebGL 2')
        box(166,393,155,45,'Electron 主窗口与桌宠')
        box(332,393,155,45,'Android APK<br/>WebViewAssetLoader')
        for x in [77,243,409]: arrow(x,393,243,367)
        box(0,307,W,60,'共享前端 · src/<br/>场景 / 角色 / 交互 / UI<br/>好友、群聊、动态、设置 · Universal Inbox · Mods')
        arrow(105,307,105,282); arrow(380,307,380,282)
        box(0,205,232,77,'本地数据<br/>IndexedDB：社交 / Inbox Demo / Mods<br/>场景模型、图片、音频和视频')
        box(255,205,232,77,'桌面可信执行端<br/>隔离 Preload / 窄 IPC → 邮箱服务 / 桌宠桥接<br/>系统密钥保护 + AES-GCM 邮箱仓库')
        arrow(370,205,370,176)
        box(255,126,232,50,'邮箱平台 · 只读 IMAP<br/>QQ 邮箱 / 网易 163 邮箱')
        arrow(110,205,110,176)
        box(0,126,232,50,'主动上传头像<br/>OpenAI 图像生成 / 编辑 API')
        arrow(110,126,110,105)
        box(0,55,232,50,'参考图 → Hyper3D Rodin REST<br/>生成 GLB → 本地场景资产')
        p=para('注：图形按源码中的系统结构重排；桌面邮箱 Agent 的授权和模型数据流见“运行与数据流”章节。','cell')
        p.wrap(W,45);p.drawOn(c,0,10)

def parse(source):
    lines=source.splitlines(); story=[]; i=0
    while i<len(lines):
        line=lines[i].strip()
        if not line: i+=1;continue
        if line.startswith('```'):
            lang=line[3:]; block=[];i+=1
            while i<len(lines) and not lines[i].startswith('```'): block.append(lines[i]);i+=1
            story.append(Architecture() if lang=='mermaid' else para('<br/>'.join(block),'code'))
            i+=1;continue
        if line.startswith('|'):
            rows=[]
            while i<len(lines) and lines[i].strip().startswith('|'):
                cells=[x.strip() for x in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?',x.replace(' ','')) for x in cells): rows.append([para(x,'cell') for x in cells])
                i+=1
            n=len(rows[0]); ratios={2:[.27,.73],3:[.20,.32,.48],4:[.20,.23,.25,.32]}.get(n,[1/n]*n)
            if n==3 and '序号' in rows[0][0].getPlainText():ratios=[.11,.19,.70]
            table=Table(rows,colWidths=[W*x for x in ratios],repeatRows=1,hAlign='LEFT',splitByRow=1)
            table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#EAF1F6')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,0),(-1,-1),.35,colors.HexColor('#D7E0E7')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#FAFBFC')])]))
            story.extend([table,Spacer(1,10)]);continue
        match=re.match(r'^(#{1,3})\s+(.*)',line)
        if match:story.append(para(match[2],'h'+str(len(match[1]))));i+=1;continue
        if re.match(r'^(- |\d+\. )',line):
            line=re.sub(r'^- ','• ',line);story.append(para(line));i+=1;continue
        block=[line];i+=1
        while i<len(lines) and lines[i].strip() and not re.match(r'^(#|\||```|- |\d+\. )',lines[i]):block.append(lines[i].strip());i+=1
        story.append(para(' '.join(block)))
    return story

class NumberedCanvas(canvas.Canvas):
    def __init__(self,*a,**kw):super().__init__(*a,**kw);self.states=[]
    def showPage(self):self.states.append(dict(self.__dict__));self._startPage()
    def save(self):
        total=len(self.states)
        for state in self.states:
            self.__dict__.update(state)
            self.setStrokeColor(colors.HexColor('#D7E0E7'));self.setLineWidth(.5);self.line(54,44,541,44)
            self.setFont('YaHei',8);self.setFillColor(colors.HexColor('#6A7785'))
            self.drawString(54,30,'WeRoam · v0.1 beta');self.drawRightString(541,30,f'{self._pageNumber} / {total}')
            super().showPage()
        super().save()

def main():
    output=ROOT/'output/pdf';output.mkdir(parents=True,exist_ok=True)
    for stem in TARGETS:
        source=(ROOT/'docs'/f'{stem}.md').read_text(encoding='utf-8')
        path=output/f'{stem}.pdf'
        doc=SimpleDocTemplate(str(path),pagesize=(595.276,841.89),rightMargin=54,leftMargin=54,topMargin=48,bottomMargin=58,title=source.splitlines()[0].lstrip('# '),author='WeRoam')
        story = parse(source)
        if stem == 'PROJECT-OVERVIEW':
            for i, item in enumerate(story[:-1]):
                if isinstance(item, Paragraph) and item.getPlainText().startswith('本声明仅用于'):
                    story[i:i+2] = [KeepTogether(story[i:i+2])]
                    break
        doc.build(story,canvasmaker=NumberedCanvas)
        print(path.relative_to(ROOT))

if __name__=='__main__':main()
