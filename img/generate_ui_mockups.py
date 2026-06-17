#!/usr/bin/env python3
"""
Generate UI mockup images for AI Fusion Automations tools site.
Design system: dark navy bg, purple/cyan gradients, clean dashboard look.
Output: 1200x750 PNGs into /Users/someshdeswardt/Documents/Claude/aifa/tools-site/img/
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

OUT = "/Users/someshdeswardt/Documents/Claude/aifa/tools-site/img"
W, H = 1200, 750

# Design system
BG = (15, 15, 26)          # --bg
CARD = (26, 26, 46)        # --bg-card
CARD_LIGHT = (36, 36, 58)
BORDER = (45, 45, 74)
TEXT = (241, 245, 249)
MUTED = (176, 190, 197)
PRIMARY = (124, 58, 237)   # purple
PRIMARY_LIGHT = (167, 139, 250)
ACCENT = (6, 182, 212)     # cyan
ACCENT_LIGHT = (34, 211, 238)
SUCCESS = (16, 185, 129)
WARNING = (245, 158, 11)
DANGER = (239, 68, 68)

def get_font(size, bold=False):
    """Return a system font."""
    candidates_bold = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/HelveticaNeue.ttc",
    ]
    candidates_regular = [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/HelveticaNeue.ttc",
    ]
    for p in (candidates_bold if bold else candidates_regular):
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

def draw_icon(d, cx, cy, size, kind, color):
    """Draw a vector icon at (cx, cy) with given size. Replaces emoji."""
    s = size // 2
    if kind == "user":
        # Head + shoulders
        d.ellipse([cx-s*0.4, cy-s*0.6, cx+s*0.4, cy-s*0.1], fill=color)
        d.chord([cx-s*0.7, cy, cx+s*0.7, cy+s*1.2], 180, 360, fill=color)
    elif kind == "chat":
        d.rounded_rectangle([cx-s, cy-s*0.7, cx+s, cy+s*0.5], radius=size//5, fill=color)
        d.polygon([(cx-s*0.3, cy+s*0.5), (cx-s*0.1, cy+s*0.5), (cx-s*0.5, cy+s*0.9)], fill=color)
    elif kind == "calendar":
        d.rounded_rectangle([cx-s, cy-s*0.8, cx+s, cy+s], radius=size//8, fill=color)
        d.rectangle([cx-s, cy-s*0.4, cx+s, cy-s*0.2], fill=BG)
        d.rectangle([cx-s*0.7, cy-s*1.0, cx-s*0.5, cy-s*0.6], fill=color)
        d.rectangle([cx+s*0.5, cy-s*1.0, cx+s*0.7, cy-s*0.6], fill=color)
    elif kind == "chart":
        for i, bh in enumerate([0.4, 0.7, 0.5, 0.9]):
            bx = cx - s + i * s*0.5
            d.rectangle([bx, cy+s-s*bh, bx+s*0.35, cy+s], fill=color)
    elif kind == "mail":
        d.rounded_rectangle([cx-s, cy-s*0.6, cx+s, cy+s*0.6], radius=size//10, fill=color)
        d.polygon([(cx-s, cy-s*0.5), (cx, cy+s*0.1), (cx+s, cy-s*0.5)], fill=BG)
    elif kind == "star":
        pts = []
        import math
        for i in range(10):
            ang = math.pi/2 + i * math.pi/5
            r = s if i % 2 == 0 else s*0.45
            pts.append((cx + r*math.cos(ang), cy - r*math.sin(ang)))
        d.polygon(pts, fill=color)
    elif kind == "bolt":
        d.polygon([(cx-s*0.3, cy-s), (cx+s*0.4, cy-s*0.1),
                   (cx, cy-s*0.1), (cx+s*0.3, cy+s),
                   (cx-s*0.4, cy+s*0.1), (cx, cy+s*0.1)], fill=color)
    elif kind == "card":
        d.rounded_rectangle([cx-s, cy-s*0.6, cx+s, cy+s*0.6], radius=size//10, fill=color)
        d.rectangle([cx-s, cy-s*0.3, cx+s, cy-s*0.1], fill=BG)
    elif kind == "phone":
        d.rounded_rectangle([cx-s*0.5, cy-s, cx+s*0.5, cy+s], radius=size//6, fill=color)
        d.rounded_rectangle([cx-s*0.4, cy-s*0.85, cx+s*0.4, cy+s*0.7], radius=size//8, fill=BG)
        d.ellipse([cx-s*0.08, cy+s*0.78, cx+s*0.08, cy+s*0.95], fill=color)
    elif kind == "globe":
        d.ellipse([cx-s, cy-s, cx+s, cy+s], outline=color, width=2)
        d.line([cx-s, cy, cx+s, cy], fill=color, width=2)
        d.line([cx, cy-s, cx, cy+s], fill=color, width=2)
        d.arc([cx-s*0.6, cy-s, cx+s*0.6, cy+s], 0, 360, fill=color, width=2)
    elif kind == "mic":
        d.rounded_rectangle([cx-s*0.4, cy-s, cx+s*0.4, cy+s*0.2], radius=size//4, fill=color)
        d.arc([cx-s*0.7, cy-s*0.3, cx+s*0.7, cy+s*0.5], 0, 180, fill=color, width=2)
        d.line([cx, cy+s*0.3, cx, cy+s*0.7], fill=color, width=2)
    elif kind == "check":
        d.line([(cx-s*0.6, cy), (cx-s*0.15, cy+s*0.5)], fill=color, width=4)
        d.line([(cx-s*0.15, cy+s*0.5), (cx+s*0.65, cy-s*0.4)], fill=color, width=4)
    elif kind == "clock":
        d.ellipse([cx-s, cy-s, cx+s, cy+s], outline=color, width=3)
        d.line([cx, cy, cx, cy-s*0.6], fill=color, width=3)
        d.line([cx, cy, cx+s*0.4, cy+s*0.3], fill=color, width=3)
    elif kind == "target":
        for r in [s, s*0.66, s*0.33]:
            d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=color, width=2)
        d.ellipse([cx-3, cy-3, cx+3, cy+3], fill=color)
    elif kind == "split":
        d.line([(cx, cy-s), (cx, cy)], fill=color, width=3)
        d.line([(cx, cy), (cx-s*0.7, cy+s*0.7)], fill=color, width=3)
        d.line([(cx, cy), (cx+s*0.7, cy+s*0.7)], fill=color, width=3)
        for p in [(cx, cy-s), (cx-s*0.7, cy+s*0.7), (cx+s*0.7, cy+s*0.7)]:
            d.ellipse([p[0]-4, p[1]-4, p[0]+4, p[1]+4], fill=color)
    elif kind == "form":
        d.rounded_rectangle([cx-s, cy-s, cx+s, cy+s], radius=size//8, fill=color)
        d.rectangle([cx-s*0.6, cy-s*0.6, cx+s*0.6, cy-s*0.4], fill=BG)
        d.rectangle([cx-s*0.6, cy-s*0.2, cx+s*0.6, cy], fill=BG)
        d.rectangle([cx-s*0.6, cy+s*0.2, cx+s*0.4, cy+s*0.4], fill=BG)
    elif kind == "circle":
        d.ellipse([cx-s, cy-s, cx+s, cy+s], fill=color)

def make_bg():
    """Base dark navy with purple/cyan radial gradient glow."""
    img = Image.new("RGB", (W, H), BG)
    overlay = Image.new("RGBA", (W, H), (0,0,0,0))
    od = ImageDraw.Draw(overlay)
    # Purple glow top-left
    for r in range(400, 0, -20):
        a = int(80 * (1 - r/400))
        od.ellipse([240-r, 0-r, 240+r, 0+r], fill=(124,58,237,a))
    # Cyan glow bottom-right
    for r in range(350, 0, -20):
        a = int(50 * (1 - r/350))
        od.ellipse([960-r, 750-r, 960+r, 750+r], fill=(6,182,212,a))
    overlay = overlay.filter(ImageFilter.GaussianBlur(40))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    return img

def rounded_rect(draw, xy, radius, fill=None, outline=None, width=1):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def browser_chrome(draw, xy, radius=14):
    """Draw a macOS-style browser window chrome at xy=(x1,y1,x2,y2)."""
    x1, y1, x2, y2 = xy
    # Frame
    rounded_rect(draw, xy, radius, fill=CARD, outline=BORDER, width=1)
    # Title bar
    bar_h = 36
    draw.rounded_rectangle([x1, y1, x2, y1+bar_h], radius=radius, fill=CARD_LIGHT)
    draw.rectangle([x1, y1+bar_h-radius, x2, y1+bar_h], fill=CARD_LIGHT)
    # Traffic lights
    cx, cy = x1 + 20, y1 + 18
    for i, c in enumerate([(255,95,86), (255,189,46), (39,201,63)]):
        draw.ellipse([cx + i*18 - 6, cy - 6, cx + i*18 + 6, cy + 6], fill=c)
    # URL pill
    pill_x1 = x1 + 96
    pill_x2 = x2 - 20
    draw.rounded_rectangle([pill_x1, y1+10, pill_x2, y1+26], radius=8, fill=(20,20,36), outline=BORDER)

def gradient_bar(draw, xy, colors, steps=50):
    """Horizontal gradient bar."""
    x1, y1, x2, y2 = xy
    w = x2 - x1
    for i in range(steps):
        t = i / steps
        c1, c2 = colors
        r = int(c1[0] + (c2[0]-c1[0])*t)
        g = int(c1[1] + (c2[1]-c1[1])*t)
        b = int(c1[2] + (c2[2]-c1[2])*t)
        draw.rectangle([x1 + i*w/steps, y1, x1 + (i+1)*w/steps, y2], fill=(r,g,b))

def add_text(draw, xy, text, font, fill=TEXT, anchor="la"):
    draw.text(xy, text, font=font, fill=fill, anchor=anchor)

# =============================================================================
# HOMEPAGE HERO — Control tower dashboard
# =============================================================================
def gen_homepage_hero():
    img = make_bg()
    d = ImageDraw.Draw(img)
    f_lg = get_font(22, bold=True)
    f_md = get_font(15, bold=True)
    f_sm = get_font(12)
    f_xs = get_font(10)

    # Main dashboard frame
    browser_chrome(d, (80, 60, 1120, 700), radius=18)

    # Left sidebar
    sb_x1, sb_y1, sb_x2, sb_y2 = 100, 106, 290, 680
    rounded_rect(d, (sb_x1, sb_y1, sb_x2, sb_y2), 10, fill=(20,20,36))
    # Logo
    d.rounded_rectangle([sb_x1+14, sb_y1+14, sb_x1+42, sb_y1+42], radius=7, fill=PRIMARY)
    d.ellipse([sb_x1+22, sb_y1+22, sb_x1+34, sb_y1+34], fill=ACCENT)
    add_text(d, (sb_x1+54, sb_y1+22), "AIFA", f_md, fill=TEXT)
    # Menu items
    items = [("bolt", "Dashboard", True), ("user", "Contacts", False), ("chat", "Conversations", False),
             ("calendar", "Calendar", False), ("chart", "Pipeline", False), ("mail", "Campaigns", False),
             ("star", "Reviews", False), ("bolt", "Automations", False), ("card", "Payments", False)]
    ty = sb_y1 + 72
    for icon, name, active in items:
        if active:
            d.rounded_rectangle([sb_x1+8, ty-6, sb_x2-8, ty+26], radius=8, fill=CARD_LIGHT)
            d.rounded_rectangle([sb_x1+8, ty-6, sb_x1+12, ty+26], radius=2, fill=PRIMARY_LIGHT)
        draw_icon(d, sb_x1+28, ty+10, 18, icon, PRIMARY_LIGHT if active else MUTED)
        add_text(d, (sb_x1+46, ty+4), name, f_sm, fill=TEXT if active else MUTED)
        ty += 42

    # Top-right area: metrics row
    mx = 310
    metrics = [("£18,420", "Revenue MTD", "+23%", None),
               ("127", "Active leads", "+12", None),
               ("4.9", "Avg rating", None, "stars"),
               ("94%", "Response rate", "+5%", None)]
    for i, (val, lbl, delta, special) in enumerate(metrics):
        x1 = mx + i * 195
        x2 = x1 + 180
        d.rounded_rectangle([x1, 106, x2, 196], radius=12, fill=CARD, outline=BORDER)
        add_text(d, (x1+14, 120), lbl.upper(), f_xs, fill=MUTED)
        add_text(d, (x1+14, 138), val, f_lg, fill=TEXT)
        if special == "stars":
            for s in range(5):
                draw_icon(d, x1+18 + s*14, 178, 10, "star", WARNING)
        else:
            add_text(d, (x1+14, 170), delta, f_sm, fill=SUCCESS)

    # Pipeline chart area
    chart_x1, chart_y1, chart_x2, chart_y2 = 310, 216, 710, 456
    d.rounded_rectangle([chart_x1, chart_y1, chart_x2, chart_y2], radius=12, fill=CARD, outline=BORDER)
    add_text(d, (chart_x1+18, chart_y1+16), "REVENUE TREND", f_xs, fill=MUTED)
    add_text(d, (chart_x1+18, chart_y1+34), "Last 30 days", f_md, fill=TEXT)
    # Area chart
    pts = [(0, 120), (0.1, 100), (0.2, 115), (0.3, 90), (0.4, 85), (0.5, 70),
           (0.6, 75), (0.7, 55), (0.8, 60), (0.9, 40), (1.0, 30)]
    cx1, cy1, cx2, cy2 = chart_x1+20, chart_y1+76, chart_x2-20, chart_y2-20
    cw = cx2 - cx1
    ch = cy2 - cy1
    line_pts = [(cx1 + p[0]*cw, cy1 + p[1]*ch/150) for p in pts]
    # Fill area under line with gradient
    area_pts = line_pts + [(cx2, cy2), (cx1, cy2)]
    d.polygon(area_pts, fill=(124,58,237,60))
    # Draw actual polygon (PIL polygon doesn't do alpha blending directly on RGB)
    overlay = Image.new("RGBA", img.size, (0,0,0,0))
    od = ImageDraw.Draw(overlay)
    od.polygon(area_pts, fill=(124,58,237,100))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    d = ImageDraw.Draw(img)
    # Line
    for i in range(len(line_pts)-1):
        d.line([line_pts[i], line_pts[i+1]], fill=PRIMARY_LIGHT, width=3)
    # Points
    for p in line_pts:
        d.ellipse([p[0]-4, p[1]-4, p[0]+4, p[1]+4], fill=ACCENT_LIGHT)

    # Pipeline stages
    pipe_x1, pipe_y1, pipe_x2, pipe_y2 = 730, 216, 1100, 456
    d.rounded_rectangle([pipe_x1, pipe_y1, pipe_x2, pipe_y2], radius=12, fill=CARD, outline=BORDER)
    add_text(d, (pipe_x1+18, pipe_y1+16), "PIPELINE", f_xs, fill=MUTED)
    add_text(d, (pipe_x1+18, pipe_y1+34), "Deal stages", f_md, fill=TEXT)
    stages = [("New leads", 32, PRIMARY_LIGHT), ("Qualified", 18, ACCENT_LIGHT),
              ("Proposal", 9, WARNING), ("Won", 6, SUCCESS)]
    sy = pipe_y1 + 80
    max_n = 35
    for name, n, color in stages:
        add_text(d, (pipe_x1+18, sy), name, f_sm, fill=TEXT)
        add_text(d, (pipe_x2-18, sy), str(n), f_sm, fill=MUTED, anchor="ra")
        d.rounded_rectangle([pipe_x1+18, sy+20, pipe_x2-18, sy+28], radius=4, fill=(30,30,52))
        bar_w = int((pipe_x2-pipe_x1-36) * n / max_n)
        d.rounded_rectangle([pipe_x1+18, sy+20, pipe_x1+18+bar_w, sy+28], radius=4, fill=color)
        sy += 42

    # Conversations feed bottom
    conv_x1, conv_y1, conv_x2, conv_y2 = 310, 476, 1100, 680
    d.rounded_rectangle([conv_x1, conv_y1, conv_x2, conv_y2], radius=12, fill=CARD, outline=BORDER)
    add_text(d, (conv_x1+18, conv_y1+16), "CONVERSATIONS", f_xs, fill=MUTED)
    add_text(d, (conv_x1+18, conv_y1+34), "Live customer activity", f_md, fill=TEXT)
    convs = [
        ("JM", "James Mitchell", "Thanks — book me in for Tuesday", "2 min ago", SUCCESS, False),
        ("SP", "Sarah Patel", "Can you send me a quote for...", "8 min ago", PRIMARY_LIGHT, False),
        ("DK", "David Kim", "Left a 5-star review", "14 min ago", WARNING, True),
    ]
    cy = conv_y1 + 76
    for initials, name, msg, time, color, has_stars in convs:
        # Avatar
        d.ellipse([conv_x1+18, cy, conv_x1+50, cy+32], fill=color)
        add_text(d, (conv_x1+34, cy+16), initials, f_sm, fill=BG, anchor="mm")
        add_text(d, (conv_x1+62, cy+2), name, f_sm, fill=TEXT)
        add_text(d, (conv_x1+62, cy+20), msg, f_xs, fill=MUTED)
        if has_stars:
            # Compute approx text width then draw small stars after
            try:
                text_w = int(d.textlength(msg, font=f_xs))
            except Exception:
                text_w = 140
            sx = conv_x1 + 62 + text_w + 8
            for s in range(5):
                draw_icon(d, sx + s*10, cy+24, 8, "star", WARNING)
        add_text(d, (conv_x2-18, cy+10), time, f_xs, fill=MUTED, anchor="ra")
        cy += 44

    img.save(f"{OUT}/hero-dashboard.png", optimize=True)
    print("✓ hero-dashboard.png")

# =============================================================================
# PRODUCTS HUB HERO — Collage of 8 product tiles
# =============================================================================
def gen_products_hub_hero():
    img = make_bg()
    d = ImageDraw.Draw(img)
    f_lg = get_font(18, bold=True)
    f_md = get_font(14, bold=True)
    f_sm = get_font(11)
    f_xs = get_font(10)

    # Center hub circle with lightning
    cx, cy = W//2, H//2
    # Outer ring
    for r in range(180, 170, -1):
        d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(124,58,237,50), width=1)
    # Gradient center orb
    overlay = Image.new("RGBA", img.size, (0,0,0,0))
    od = ImageDraw.Draw(overlay)
    for r in range(120, 0, -2):
        a = int(200 * r/120)
        t = r/120
        cr = int(124*(1-t) + 6*t)
        cg = int(58*(1-t) + 182*t)
        cb = int(237*(1-t) + 212*t)
        od.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(cr,cg,cb,a))
    overlay = overlay.filter(ImageFilter.GaussianBlur(5))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    d = ImageDraw.Draw(img)
    # Lightning bolt icon in center
    draw_icon(d, cx, cy, 70, "bolt", TEXT)

    # 8 product tiles in circle
    products = [
        ("user", "CRM", 90),
        ("globe", "Funnels", 135),
        ("mail", "Email & SMS", 180),
        ("star", "Reviews", 225),
        ("phone", "Voice AI", 270),
        ("bolt", "Automations", 315),
        ("calendar", "Booking", 0),
        ("card", "Payments", 45),
    ]
    r_ring = 270
    for icon, name, angle in products:
        rad = math.radians(angle)
        tx = cx + r_ring * math.cos(rad)
        ty = cy + r_ring * math.sin(rad)
        # Connection line
        d.line([(cx + 180*math.cos(rad), cy + 180*math.sin(rad)),
                (tx - 45*math.cos(rad), ty - 45*math.sin(rad))],
               fill=(124,58,237,80), width=2)
        # Tile
        box_w, box_h = 170, 90
        bx1, by1 = tx - box_w//2, ty - box_h//2
        bx2, by2 = bx1 + box_w, by1 + box_h
        d.rounded_rectangle([bx1, by1, bx2, by2], radius=12, fill=CARD, outline=BORDER, width=1)
        d.rounded_rectangle([bx1, by1, bx2, by1+3], radius=2, fill=PRIMARY)
        draw_icon(d, bx1+30, by1+32, 24, icon, ACCENT_LIGHT)
        add_text(d, (bx1+56, by1+24), name, f_md, fill=TEXT)
        add_text(d, (bx1+56, by1+44), "Integrated", f_sm, fill=MUTED)

    img.save(f"{OUT}/products-hub-hero.png", optimize=True)
    print("✓ products-hub-hero.png")

# =============================================================================
# AI OPERATING SYSTEMS HERO — control tower with agents
# =============================================================================
def gen_ai_os_hero():
    img = make_bg()
    d = ImageDraw.Draw(img)
    f_lg = get_font(20, bold=True)
    f_md = get_font(14, bold=True)
    f_sm = get_font(11)
    f_xs = get_font(10)

    # Central control tower card
    ct_x1, ct_y1, ct_x2, ct_y2 = 420, 180, 780, 570
    d.rounded_rectangle([ct_x1, ct_y1, ct_x2, ct_y2], radius=18, fill=CARD, outline=PRIMARY, width=2)
    # Header
    d.rounded_rectangle([ct_x1, ct_y1, ct_x2, ct_y1+50], radius=18, fill=CARD_LIGHT)
    d.rectangle([ct_x1, ct_y1+32, ct_x2, ct_y1+50], fill=CARD_LIGHT)
    add_text(d, (ct_x1+20, ct_y1+26), "AI CONTROL TOWER", f_sm, fill=PRIMARY_LIGHT, anchor="lm")
    # Status dot
    d.ellipse([ct_x2-34, ct_y1+20, ct_x2-22, ct_y1+32], fill=SUCCESS)
    add_text(d, (ct_x2-40, ct_y1+26), "LIVE", f_xs, fill=SUCCESS, anchor="rm")

    # Agent status rows
    agents = [
        ("Voice Receptionist", "Answered 18 calls today", SUCCESS),
        ("Lead Qualifier", "Processing 3 new leads...", PRIMARY_LIGHT),
        ("Follow-up Bot", "Sent 24 messages", SUCCESS),
        ("Review Replier", "Drafted 6 replies", ACCENT_LIGHT),
        ("Calendar Agent", "Booked 4 appointments", SUCCESS),
        ("Pipeline Scorer", "Ranked 42 contacts", SUCCESS),
    ]
    ay = ct_y1 + 70
    for name, status, color in agents:
        d.rounded_rectangle([ct_x1+16, ay, ct_x2-16, ay+48], radius=8, fill=(24,24,42), outline=BORDER)
        d.ellipse([ct_x1+28, ay+18, ct_x1+42, ay+32], fill=color)
        add_text(d, (ct_x1+56, ay+12), name, f_md, fill=TEXT)
        add_text(d, (ct_x1+56, ay+30), status, f_xs, fill=MUTED)
        # Mini activity bars
        for i in range(8):
            bh = 4 + (i*3) % 14
            d.rounded_rectangle([ct_x2-100+i*10, ay+30-bh, ct_x2-92+i*10, ay+30], radius=1,
                                fill=color if i > 3 else BORDER)
        ay += 54

    # Left side: inputs flowing in
    inputs = [("phone", "Phone calls", 150), ("mail", "Emails", 230), ("chat", "Live chat", 310),
              ("form", "Forms", 390), ("calendar", "Bookings", 470)]
    for icon, name, iy in inputs:
        d.rounded_rectangle([90, iy, 300, iy+54], radius=10, fill=CARD, outline=BORDER)
        draw_icon(d, 118, iy+27, 22, icon, ACCENT_LIGHT)
        add_text(d, (150, iy+12), name, f_md, fill=TEXT)
        add_text(d, (150, iy+32), "to AI agent", f_xs, fill=MUTED)
        # Flow line to center
        d.line([(300, iy+27), (420, iy+27)], fill=(124,58,237,120), width=2)
        # Arrow head
        d.polygon([(420, iy+27), (410, iy+22), (410, iy+32)], fill=PRIMARY_LIGHT)

    # Right side: outputs
    outputs = [("chart", "Dashboard", 150), ("target", "CRM updates", 230), ("bolt", "Automations", 310),
               ("check", "Tasks done", 390), ("chat", "Replies sent", 470)]
    for icon, name, iy in outputs:
        d.rounded_rectangle([900, iy, 1110, iy+54], radius=10, fill=CARD, outline=BORDER)
        draw_icon(d, 928, iy+27, 22, icon, SUCCESS)
        add_text(d, (960, iy+12), name, f_md, fill=TEXT)
        add_text(d, (960, iy+32), "output", f_xs, fill=MUTED)
        # Flow line
        d.line([(780, iy+27), (900, iy+27)], fill=(6,182,212,120), width=2)
        d.polygon([(900, iy+27), (890, iy+22), (890, iy+32)], fill=ACCENT_LIGHT)

    img.save(f"{OUT}/ai-os-hero.png", optimize=True)
    print("✓ ai-os-hero.png")

# =============================================================================
# PRODUCT PAGE HEROES — one per product (800x500 compact)
# =============================================================================
def gen_product_hero(name, fname, draw_fn):
    w, h = 1000, 620
    img = Image.new("RGB", (w, h), BG)
    # Subtle gradient glow
    overlay = Image.new("RGBA", (w, h), (0,0,0,0))
    od = ImageDraw.Draw(overlay)
    for r in range(300, 0, -20):
        a = int(60 * (1 - r/300))
        od.ellipse([200-r, 100-r, 200+r, 100+r], fill=(124,58,237,a))
        od.ellipse([800-r, 500-r, 800+r, 500+r], fill=(6,182,212,a))
    overlay = overlay.filter(ImageFilter.GaussianBlur(30))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    d = ImageDraw.Draw(img)
    draw_fn(d, img, w, h)
    img.save(f"{OUT}/{fname}", optimize=True)
    print(f"✓ {fname}")

def draw_browser_card(d, xy, radius=14):
    """Reusable browser chrome."""
    x1, y1, x2, y2 = xy
    d.rounded_rectangle(xy, radius=radius, fill=CARD, outline=BORDER, width=1)
    bar_h = 30
    d.rounded_rectangle([x1, y1, x2, y1+bar_h], radius=radius, fill=CARD_LIGHT)
    d.rectangle([x1, y1+bar_h-radius, x2, y1+bar_h], fill=CARD_LIGHT)
    for i, c in enumerate([(255,95,86), (255,189,46), (39,201,63)]):
        d.ellipse([x1+14 + i*16 - 5, y1+15 - 5, x1+14 + i*16 + 5, y1+15 + 5], fill=c)

# --- CRM: pipeline kanban ---
def draw_crm(d, img, w, h):
    f_md = get_font(14, bold=True)
    f_sm = get_font(11)
    f_xs = get_font(10)
    draw_browser_card(d, (60, 40, 940, 580))
    add_text(d, (80, 90), "PIPELINE", f_xs, fill=MUTED)
    add_text(d, (80, 110), "Sales Board", get_font(18, bold=True), fill=TEXT)
    cols = [("New", [("James M.", "£2,400"), ("Sarah P.", "£1,800"), ("Tom R.", "£950")], PRIMARY_LIGHT),
            ("Qualified", [("David K.", "£4,200"), ("Lisa W.", "£3,100")], ACCENT_LIGHT),
            ("Proposal", [("Mark B.", "£7,800")], WARNING),
            ("Won", [("Jenny F.", "£5,600"), ("Rob T.", "£2,900")], SUCCESS)]
    cx = 80
    for title, deals, color in cols:
        d.rounded_rectangle([cx, 150, cx+190, 560], radius=10, fill=(20,20,36), outline=BORDER)
        d.rounded_rectangle([cx, 150, cx+190, 154], radius=2, fill=color)
        add_text(d, (cx+14, 170), title.upper(), f_xs, fill=MUTED)
        add_text(d, (cx+176, 170), str(len(deals)), f_xs, fill=color, anchor="ra")
        dy = 200
        for contact, val in deals:
            d.rounded_rectangle([cx+10, dy, cx+180, dy+54], radius=8, fill=CARD, outline=BORDER)
            d.ellipse([cx+18, dy+10, cx+38, dy+30], fill=color)
            add_text(d, (cx+46, dy+10), contact, f_sm, fill=TEXT)
            add_text(d, (cx+46, dy+28), val, f_xs, fill=SUCCESS)
            dy += 62
        cx += 210

# --- Funnels: builder canvas ---
def draw_funnels(d, img, w, h):
    f_md = get_font(14, bold=True)
    f_sm = get_font(11)
    f_xs = get_font(10)
    draw_browser_card(d, (60, 40, 940, 580))
    add_text(d, (80, 90), "FUNNEL BUILDER", f_xs, fill=MUTED)
    add_text(d, (80, 110), "High-Ticket Discovery Call", get_font(18, bold=True), fill=TEXT)
    # Funnel steps
    steps = [("Landing Page", "2,410 visits", PRIMARY_LIGHT),
             ("Opt-in Form", "842 signups", ACCENT_LIGHT),
             ("Thank You", "842 reached", ACCENT_LIGHT),
             ("Booking Page", "312 booked", WARNING),
             ("Confirmation", "298 confirmed", SUCCESS)]
    sx = 80
    sw = 165
    for i, (name, stat, color) in enumerate(steps):
        d.rounded_rectangle([sx, 180, sx+sw-20, 350], radius=12, fill=CARD, outline=BORDER)
        # Preview area
        d.rounded_rectangle([sx+14, 194, sx+sw-34, 280], radius=6, fill=(30,30,52))
        d.rounded_rectangle([sx+24, 208, sx+sw-44, 218], radius=2, fill=MUTED)
        d.rounded_rectangle([sx+24, 226, sx+sw-64, 232], radius=2, fill=BORDER)
        d.rounded_rectangle([sx+24, 244, sx+sw-54, 260], radius=4, fill=color)
        add_text(d, (sx+14, 294), name, f_md, fill=TEXT)
        add_text(d, (sx+14, 316), stat, f_sm, fill=color)
        if i < len(steps)-1:
            d.line([(sx+sw-20, 265), (sx+sw, 265)], fill=PRIMARY_LIGHT, width=2)
            d.polygon([(sx+sw, 265), (sx+sw-6, 261), (sx+sw-6, 269)], fill=PRIMARY_LIGHT)
        sx += sw
    # Conversion bar
    d.rounded_rectangle([80, 400, 890, 560], radius=12, fill=CARD, outline=BORDER)
    add_text(d, (96, 420), "CONVERSION RATE", f_xs, fill=MUTED)
    add_text(d, (96, 440), "12.4%", get_font(40, bold=True), fill=SUCCESS)
    add_text(d, (96, 500), "+3.2% vs last month", f_sm, fill=SUCCESS)
    # Bar chart
    bars = [72, 85, 64, 78, 92, 88, 96, 82, 90, 95, 100, 98]
    for i, v in enumerate(bars):
        bh = int(v * 100 / 100)
        bx = 440 + i * 36
        d.rounded_rectangle([bx, 540-bh, bx+24, 540], radius=3, fill=PRIMARY_LIGHT if i < 8 else ACCENT_LIGHT)

# --- Email & SMS: campaign dashboard ---
def draw_email(d, img, w, h):
    f_md = get_font(14, bold=True)
    f_sm = get_font(11)
    f_xs = get_font(10)
    draw_browser_card(d, (60, 40, 940, 580))
    add_text(d, (80, 90), "CAMPAIGNS", f_xs, fill=MUTED)
    add_text(d, (80, 110), "Active & Scheduled", get_font(18, bold=True), fill=TEXT)
    # Stats cards
    stats = [("24,190", "Sent", PRIMARY_LIGHT), ("42.8%", "Open rate", SUCCESS),
             ("12.3%", "Click rate", ACCENT_LIGHT), ("£6,420", "Revenue", WARNING)]
    for i, (v, l, c) in enumerate(stats):
        x1 = 80 + i * 210
        d.rounded_rectangle([x1, 150, x1+190, 230], radius=10, fill=CARD, outline=BORDER)
        add_text(d, (x1+14, 166), l.upper(), f_xs, fill=MUTED)
        add_text(d, (x1+14, 184), v, get_font(22, bold=True), fill=c)
    # Campaign rows
    camps = [("mail", "Spring promo", "Email - 4,200 sent", "48% open", SUCCESS),
             ("chat", "Booking reminder", "SMS - 820 sent", "96% delivered", SUCCESS),
             ("phone", "Review request", "WhatsApp - 312 sent", "72% replied", ACCENT_LIGHT),
             ("mail", "Newsletter #24", "Email - 8,400 sent", "41% open", PRIMARY_LIGHT)]
    cy = 260
    for icon, name, meta, stat, color in camps:
        d.rounded_rectangle([80, cy, 890, cy+64], radius=10, fill=CARD, outline=BORDER)
        d.rounded_rectangle([86, cy+12, 130, cy+52], radius=8, fill=(30,30,52))
        draw_icon(d, 108, cy+32, 20, icon, color)
        add_text(d, (146, cy+16), name, f_md, fill=TEXT)
        add_text(d, (146, cy+38), meta, f_sm, fill=MUTED)
        add_text(d, (880, cy+32), stat, f_sm, fill=color, anchor="rm")
        cy += 72

# --- Reputation: review stream ---
def draw_reputation(d, img, w, h):
    f_md = get_font(14, bold=True)
    f_sm = get_font(11)
    f_xs = get_font(10)
    draw_browser_card(d, (60, 40, 940, 580))
    add_text(d, (80, 90), "REPUTATION", f_xs, fill=MUTED)
    add_text(d, (80, 110), "5-Star Stream", get_font(18, bold=True), fill=TEXT)
    # Big rating card
    d.rounded_rectangle([80, 150, 360, 400], radius=12, fill=CARD, outline=BORDER)
    add_text(d, (100, 170), "OVERALL RATING", f_xs, fill=MUTED)
    add_text(d, (100, 200), "4.9", get_font(68, bold=True), fill=WARNING)
    # Draw 5 stars manually
    for i in range(5):
        draw_icon(d, 120 + i*42, 292, 28, "star", WARNING)
    add_text(d, (100, 318), "from 284 reviews", f_sm, fill=MUTED)
    # Mini bar distribution
    dist = [(5, 248), (4, 22), (3, 8), (2, 4), (1, 2)]
    dy = 350
    for stars, count in dist:
        add_text(d, (100, dy), f"{stars}", f_xs, fill=MUTED)
        draw_icon(d, 114, dy+6, 8, "star", MUTED)
        d.rounded_rectangle([130, dy+2, 330, dy+10], radius=2, fill=(30,30,52))
        w_bar = int(200 * count / 250)
        d.rounded_rectangle([130, dy+2, 130+w_bar, dy+10], radius=2, fill=WARNING)
        dy += 14

    # Recent reviews
    reviews = [("JM", "James M.", "Brilliant service, cleaned our chimney perfectly. Will book again!", "Google"),
               ("SP", "Sarah P.", "Professional, punctual, and friendly. Highly recommend.", "Facebook"),
               ("DK", "David K.", "Best experience I've had. The AI scheduling was so easy.", "Google")]
    ry = 150
    for init, name, text, src in reviews:
        d.rounded_rectangle([400, ry, 890, ry+130], radius=12, fill=CARD, outline=BORDER)
        d.ellipse([416, ry+16, 452, ry+52], fill=ACCENT_LIGHT)
        add_text(d, (434, ry+34), init, f_sm, fill=BG, anchor="mm")
        add_text(d, (466, ry+18), name, f_md, fill=TEXT)
        # 5 small stars under name
        for i in range(5):
            draw_icon(d, 474 + i*16, ry+44, 10, "star", WARNING)
        add_text(d, (880, ry+24), src, f_xs, fill=MUTED, anchor="ra")
        txt = text[:70] + ("..." if len(text) > 70 else "")
        add_text(d, (416, ry+70), txt, f_sm, fill=MUTED)
        add_text(d, (416, ry+96), "AI reply drafted", f_xs, fill=ACCENT_LIGHT)
        ry += 140

# --- Voice AI: call transcript ---
def draw_voice(d, img, w, h):
    f_md = get_font(14, bold=True)
    f_sm = get_font(11)
    f_xs = get_font(10)
    draw_browser_card(d, (60, 40, 940, 580))
    add_text(d, (80, 90), "VOICE AI", f_xs, fill=MUTED)
    add_text(d, (80, 110), "Live Call in Progress", get_font(18, bold=True), fill=TEXT)
    # Status
    d.ellipse([80, 148, 94, 162], fill=SUCCESS)
    add_text(d, (102, 155), "Connected · 2m 14s", f_sm, fill=SUCCESS, anchor="lm")
    # Caller card
    d.rounded_rectangle([80, 180, 360, 560], radius=12, fill=CARD, outline=BORDER)
    d.ellipse([150, 210, 290, 350], fill=PRIMARY)
    add_text(d, (220, 280), "SP", get_font(36, bold=True), fill=TEXT, anchor="mm")
    add_text(d, (220, 370), "Sarah Patel", f_md, fill=TEXT, anchor="mm")
    add_text(d, (220, 392), "+44 7782 445 221", f_sm, fill=MUTED, anchor="mm")
    # Waveform
    import random
    random.seed(7)
    for i in range(44):
        bh = random.randint(8, 50)
        bx = 98 + i*6
        d.rounded_rectangle([bx, 440-bh//2, bx+3, 440+bh//2], radius=1, fill=ACCENT_LIGHT)
    # Controls
    for i, (icon, bg_color, ic_color) in enumerate([("mic", CARD_LIGHT, TEXT), ("clock", CARD_LIGHT, TEXT), ("phone", DANGER, TEXT)]):
        cx_btn = 140 + i * 60
        d.ellipse([cx_btn, 490, cx_btn+40, 530], fill=bg_color, outline=BORDER)
        draw_icon(d, cx_btn+20, 510, 16, icon, ic_color)

    # Transcript
    d.rounded_rectangle([400, 180, 890, 560], radius=12, fill=CARD, outline=BORDER)
    add_text(d, (416, 200), "LIVE TRANSCRIPT", f_xs, fill=MUTED)
    lines = [
        ("AI", "Hello, thanks for calling Happy Chimney Sweep. How can I help?", PRIMARY_LIGHT),
        ("Sarah", "Hi, I'd like to book a chimney sweep for next week.", TEXT),
        ("AI", "I'd be happy to help. What's your postcode?", PRIMARY_LIGHT),
        ("Sarah", "RH18 5EL", TEXT),
        ("AI", "Great — I have Tuesday 22nd at 10am or Wednesday at 2pm. Which works?", PRIMARY_LIGHT),
        ("Sarah", "Tuesday 10am works perfectly.", TEXT),
        ("AI", "Booked! You'll receive a confirmation text in 30 seconds.", PRIMARY_LIGHT),
    ]
    ly = 228
    for who, msg, color in lines:
        add_text(d, (416, ly), who.upper(), f_xs, fill=color)
        # Wrap
        import textwrap
        wrapped = textwrap.wrap(msg, width=48)
        for lw in wrapped:
            ly += 16
            add_text(d, (416, ly), lw, f_sm, fill=MUTED if color == PRIMARY_LIGHT else TEXT)
        ly += 22

# --- Automations: workflow canvas ---
def draw_automations(d, img, w, h):
    f_md = get_font(14, bold=True)
    f_sm = get_font(11)
    f_xs = get_font(10)
    draw_browser_card(d, (60, 40, 940, 580))
    add_text(d, (80, 90), "WORKFLOW BUILDER", f_xs, fill=MUTED)
    add_text(d, (80, 110), "New lead · Auto nurture sequence", get_font(18, bold=True), fill=TEXT)
    # Flowchart nodes
    nodes = [
        (140, 180, "target", "Trigger", "New lead from funnel", PRIMARY_LIGHT),
        (140, 300, "clock", "Wait", "5 minutes", ACCENT_LIGHT),
        (140, 420, "mail", "Send email", "Welcome + offer", PRIMARY_LIGHT),
        (500, 420, "split", "If/else", "Opened email?", WARNING),
        (500, 300, "chat", "Send SMS", "Follow-up text", ACCENT_LIGHT),
        (860, 420, "check", "Tag contact", "Hot lead", SUCCESS),
        (860, 300, "phone", "Task", "Call in 24h", PRIMARY_LIGHT),
    ]
    for x, y, icon, title, sub, color in nodes:
        d.rounded_rectangle([x-80, y-40, x+80, y+40], radius=12, fill=CARD, outline=color, width=2)
        draw_icon(d, x-60, y-16, 18, icon, color)
        add_text(d, (x-36, y-24), title, f_md, fill=TEXT)
        add_text(d, (x-64, y+12), sub, f_xs, fill=MUTED)
    # Connecting lines
    conns = [((140, 220), (140, 260)),
             ((140, 340), (140, 380)),
             ((220, 420), (420, 420)),
             ((500, 380), (500, 340)),
             ((580, 300), (780, 300)),
             ((580, 420), (780, 420))]
    for p1, p2 in conns:
        d.line([p1, p2], fill=PRIMARY_LIGHT, width=2)
        # Arrowhead
        if p1[0] == p2[0]:  # vertical
            dy = 1 if p2[1] > p1[1] else -1
            d.polygon([(p2[0], p2[1]), (p2[0]-4, p2[1]-4*dy), (p2[0]+4, p2[1]-4*dy)], fill=PRIMARY_LIGHT)
        else:  # horizontal
            dx = 1 if p2[0] > p1[0] else -1
            d.polygon([(p2[0], p2[1]), (p2[0]-4*dx, p2[1]-4), (p2[0]-4*dx, p2[1]+4)], fill=PRIMARY_LIGHT)
    # Stats bar
    d.rounded_rectangle([80, 490, 890, 560], radius=12, fill=CARD, outline=BORDER)
    stats = [("324", "Active"), ("1,842", "Contacts in flow"), ("96%", "Success rate"), ("£12.4k", "Revenue attributed")]
    for i, (v, l) in enumerate(stats):
        x = 100 + i * 200
        add_text(d, (x, 508), l.upper(), f_xs, fill=MUTED)
        add_text(d, (x, 526), v, get_font(20, bold=True), fill=TEXT)

# --- Calendars: booking calendar ---
def draw_calendars(d, img, w, h):
    f_md = get_font(14, bold=True)
    f_sm = get_font(11)
    f_xs = get_font(10)
    draw_browser_card(d, (60, 40, 940, 580))
    add_text(d, (80, 90), "BOOKINGS", f_xs, fill=MUTED)
    add_text(d, (80, 110), "This Week · Chimney Sweep", get_font(18, bold=True), fill=TEXT)
    # Calendar grid
    days = ["MON", "TUE", "WED", "THU", "FRI", "SAT"]
    dates = ["21", "22", "23", "24", "25", "26"]
    col_w = 130
    grid_x = 80
    grid_y = 150
    for i, (day, dt) in enumerate(zip(days, dates)):
        x1 = grid_x + i * col_w
        x2 = x1 + col_w - 10
        # Header
        d.rounded_rectangle([x1, grid_y, x2, grid_y+50], radius=8, fill=CARD_LIGHT)
        add_text(d, (x1+col_w//2-5, grid_y+14), day, f_xs, fill=MUTED, anchor="mm")
        add_text(d, (x1+col_w//2-5, grid_y+34), dt, f_md, fill=TEXT if i < 3 else PRIMARY_LIGHT, anchor="mm")
    # Time slots
    slots = [
        (0, "9:00", "James Mitchell", "Sweep + CCTV", PRIMARY_LIGHT),
        (0, "14:00", "Sarah Patel", "Full clean", SUCCESS),
        (1, "10:00", "David Kim", "Sweep", ACCENT_LIGHT),
        (1, "15:30", "Mark Brown", "Install prep", WARNING),
        (2, "9:30", "Lisa Walker", "Sweep", PRIMARY_LIGHT),
        (3, "11:00", "Rob T.", "Service", SUCCESS),
        (3, "14:00", "Jenny F.", "Sweep + cert", ACCENT_LIGHT),
        (4, "10:00", "Tom R.", "CCTV", PRIMARY_LIGHT),
    ]
    for col, time, name, service, color in slots:
        x1 = grid_x + col * col_w + 4
        x2 = x1 + col_w - 18
        # Position based on time
        hr = int(time.split(":")[0])
        mins = int(time.split(":")[1])
        ty = grid_y + 70 + (hr - 9) * 50 + mins * 50 // 60
        d.rounded_rectangle([x1, ty, x2, ty+48], radius=6, fill=CARD, outline=color, width=1)
        d.rounded_rectangle([x1, ty, x1+3, ty+48], radius=1, fill=color)
        add_text(d, (x1+10, ty+8), time, f_xs, fill=color)
        add_text(d, (x1+10, ty+22), name[:14], f_xs, fill=TEXT)
        add_text(d, (x1+10, ty+36), service[:16], f_xs, fill=MUTED)
    # Summary bar
    d.rounded_rectangle([80, 500, 890, 560], radius=12, fill=CARD, outline=BORDER)
    stats = [("24", "Bookings"), ("18", "Confirmed"), ("£4,820", "Expected revenue"), ("3", "Waitlist")]
    for i, (v, l) in enumerate(stats):
        x = 100 + i * 200
        add_text(d, (x, 516), l.upper(), f_xs, fill=MUTED)
        add_text(d, (x, 532), v, get_font(18, bold=True), fill=TEXT)

# --- Payments: invoicing dashboard ---
def draw_payments(d, img, w, h):
    f_md = get_font(14, bold=True)
    f_sm = get_font(11)
    f_xs = get_font(10)
    draw_browser_card(d, (60, 40, 940, 580))
    add_text(d, (80, 90), "PAYMENTS", f_xs, fill=MUTED)
    add_text(d, (80, 110), "This Month", get_font(18, bold=True), fill=TEXT)
    # Big number
    d.rounded_rectangle([80, 150, 460, 310], radius=12, fill=CARD, outline=BORDER)
    add_text(d, (100, 170), "RECEIVED", f_xs, fill=MUTED)
    add_text(d, (100, 194), "£24,820", get_font(44, bold=True), fill=SUCCESS)
    add_text(d, (100, 260), "+£3,240 vs last month", f_sm, fill=SUCCESS)
    # Bar chart
    bars = [60, 78, 45, 82, 92, 68, 88, 95, 72, 84, 90, 98]
    bx = 260
    for i, v in enumerate(bars):
        bh = int(v * 40 / 100)
        d.rounded_rectangle([bx + i*15, 288-bh, bx + i*15 + 10, 288], radius=2, fill=PRIMARY_LIGHT if i < 8 else ACCENT_LIGHT)

    # Mini stats
    mini = [("PENDING", "£4,210", "12 invoices", WARNING),
            ("OVERDUE", "£820", "2 invoices", DANGER)]
    for i, (l, v, sub, color) in enumerate(mini):
        x1 = 480 + i * 215
        d.rounded_rectangle([x1, 150, x1+200, 230], radius=10, fill=CARD, outline=BORDER)
        add_text(d, (x1+14, 164), l, f_xs, fill=color)
        add_text(d, (x1+14, 182), v, get_font(22, bold=True), fill=TEXT)
        add_text(d, (x1+14, 208), sub, f_xs, fill=MUTED)
    d.rounded_rectangle([480, 240, 895, 310], radius=10, fill=CARD, outline=BORDER)
    add_text(d, (494, 256), "TEXT-2-PAY LINKS", f_xs, fill=MUTED)
    add_text(d, (494, 272), "42 sent · 38 paid", f_md, fill=TEXT)
    add_text(d, (494, 292), "90% conversion · £11,420 collected", f_xs, fill=SUCCESS)

    # Recent invoices
    invs = [("INV-2418", "James Mitchell", "£420", "Paid", SUCCESS),
            ("INV-2417", "Sarah Patel", "£1,240", "Paid", SUCCESS),
            ("INV-2416", "David Kim", "£680", "Pending", WARNING),
            ("INV-2415", "Mark Brown", "£2,100", "Paid", SUCCESS)]
    iy = 340
    for num, name, amt, status, color in invs:
        d.rounded_rectangle([80, iy, 890, iy+48], radius=8, fill=CARD, outline=BORDER)
        add_text(d, (94, iy+14), num, f_xs, fill=MUTED)
        add_text(d, (94, iy+30), name, f_sm, fill=TEXT)
        add_text(d, (600, iy+24), amt, f_md, fill=TEXT, anchor="rm")
        d.rounded_rectangle([720, iy+14, 810, iy+34], radius=10, fill=(30,30,52))
        add_text(d, (765, iy+24), status, f_xs, fill=color, anchor="mm")
        iy += 52

# ==============================================================================
# Integration logos strip
# ==============================================================================
def gen_integrations_strip():
    w, h = 1200, 180
    img = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(img)
    f_title = get_font(14, bold=True)
    f_lg = get_font(18, bold=True)
    add_text(d, (w//2, 30), "CONNECTS WITH 300+ TOOLS YOU ALREADY USE", f_title, fill=MUTED, anchor="mm")
    logos = [
        ("Stripe", (99, 91, 255)),
        ("Zapier", (255, 77, 0)),
        ("Google", (66, 133, 244)),
        ("Meta", (0, 129, 251)),
        ("WhatsApp", (37, 211, 102)),
        ("Slack", (74, 21, 75)),
        ("Mailchimp", (255, 225, 1)),
        ("Shopify", (149, 191, 71)),
        ("Xero", (19, 177, 207)),
        ("QuickBooks", (43, 200, 101)),
    ]
    spacing = w // (len(logos) + 1)
    for i, (name, color) in enumerate(logos):
        x = spacing * (i + 1)
        # Pill
        d.rounded_rectangle([x-54, 80, x+54, 130], radius=12, fill=CARD, outline=BORDER)
        # Color dot
        d.ellipse([x-40, 98, x-22, 116], fill=color)
        add_text(d, (x-14, 107), name, get_font(11, bold=True), fill=TEXT, anchor="lm")
    img.save(f"{OUT}/integrations-strip.png", optimize=True)
    print("✓ integrations-strip.png")

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    gen_homepage_hero()
    gen_products_hub_hero()
    gen_ai_os_hero()
    gen_product_hero("CRM", "product-crm-hero.png", draw_crm)
    gen_product_hero("Funnels", "product-funnels-hero.png", draw_funnels)
    gen_product_hero("Email", "product-email-hero.png", draw_email)
    gen_product_hero("Reputation", "product-reputation-hero.png", draw_reputation)
    gen_product_hero("Voice", "product-voice-hero.png", draw_voice)
    gen_product_hero("Automations", "product-automations-hero.png", draw_automations)
    gen_product_hero("Calendars", "product-calendars-hero.png", draw_calendars)
    gen_product_hero("Payments", "product-payments-hero.png", draw_payments)
    gen_integrations_strip()
    print("\nAll images generated at", OUT)
