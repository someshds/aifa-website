#!/usr/bin/env python3
"""Regenerate every AIFA news image in the canonical editorial-card style."""

from __future__ import annotations

import html
import hashlib
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
NEWS = ROOT / "news"
IMAGE_DIR = NEWS / "img"
SOURCE_DIR = IMAGE_DIR / "editorial-source"
FONT_REGULAR_CANDIDATES = (
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
)
FONT_BOLD_CANDIDATES = (
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
)
FONT_REGULAR = next(path for path in FONT_REGULAR_CANDIDATES if Path(path).exists())
FONT_BOLD = next(path for path in FONT_BOLD_CANDIDATES if Path(path).exists())

PALETTE = {
    "paper": "#f7f6f0",
    "ink": "#111111",
    "muted": "#55575f",
    "line": "#7c7f86",
    "brand": "#111a42",
    "accent": "#3b6ef5",
    "white": "#ffffff",
}

CATEGORY_RULES = [
    ("security", ("security", "cyber", "malware", "breach", "incident", "salesbleed", "closedquorum", "okta", "trust", "provenance")),
    ("government", ("government", "parliament", "senate", "regulation", "act-", "cma", "white-house", "executive-order", "geneva", "california", "ferc", "drcf", "register", "standards", "transparency")),
    ("devices", ("device", "glasses", "adobe", "apple", "realtime", "slack", "copilot", "search", "content", "siri", "iphone")),
    ("hardware", ("chip", "trainium", "nvidia", "hardware", "semiconductor", "silicon", "local-ai-pc")),
    ("infrastructure", ("infrastructure", "energy", "grid", "aws", "spacex", "data-cent", "compute")),
    ("research", ("research", "lab", "oxford", "ucl", "anthropic", "openai", "enzyme", "gemini", "gpt", "claude", "model", "kindle", "fable")),
    ("finance", ("investment", "valuation", "ipo", "market", "billing", "productivity", "jobs", "talent", "econom")),
]


def metadata_by_image() -> dict[str, tuple[str, str]]:
    result: dict[str, tuple[str, str]] = {}
    for page in NEWS.glob("*.html"):
        text = page.read_text(encoding="utf-8")
        title_match = re.search(r'<meta\s+property="og:title"\s+content="([^"]+)', text, re.I)
        if not title_match:
            title_match = re.search(r"<title>(.*?)</title>", text, re.I | re.S)
        description_match = re.search(r'<meta\s+(?:name="description"|property="og:description")\s+content="([^"]+)', text, re.I)
        title = html.unescape(re.sub(r"\s+", " ", title_match.group(1))).strip() if title_match else page.stem.replace("-", " ").title()
        title = re.sub(r"\s*[|–—]\s*AI Fusion.*$", "", title, flags=re.I)
        description = html.unescape(re.sub(r"\s+", " ", description_match.group(1))).strip() if description_match else "Practical AI news and analysis for business leaders."
        for image_name in re.findall(r"/news/img/([^?\"']+)", text):
            result.setdefault(Path(image_name).name, (title, description))
    return result


def category_for(name: str, title: str) -> str:
    haystack = f"{name} {title}".lower()
    for category, words in CATEGORY_RULES:
        if any(word in haystack for word in words):
            return category
    return "workplace"


def fit_crop(image: Image.Image, size: tuple[int, int], variant: int = 0) -> Image.Image:
    target_ratio = size[0] / size[1]
    ratio = image.width / image.height
    if ratio > target_ratio:
        width = round(image.height * target_ratio)
        positions = (0.28, 0.5, 0.72)
        left = round((image.width - width) * positions[variant % len(positions)])
        image = image.crop((left, 0, left + width, image.height))
    else:
        height = round(image.width / target_ratio)
        positions = (0.25, 0.5, 0.75)
        top = round((image.height - height) * positions[variant % len(positions)])
        image = image.crop((0, top, image.width, top + height))
    if variant % 2:
        image = image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    return image.resize(size, Image.Resampling.LANCZOS)


def wrapped_lines(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int, max_lines: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=font) <= max_width:
            current = candidate
            continue
        if current:
            lines.append(current)
        current = word
        if len(lines) == max_lines - 1:
            break
    if current and len(lines) < max_lines:
        remaining = " ".join(words[sum(len(line.split()) for line in lines):])
        current = remaining
        while draw.textlength(current, font=font) > max_width and " " in current:
            current = current.rsplit(" ", 1)[0]
        if current != remaining:
            current = current.rstrip(".,;:") + "…"
        lines.append(current)
    return lines


def render_card(target: Path, title: str, description: str, source: Image.Image) -> None:
    portrait = "-hub" in target.stem
    width, height = ((750, 1122) if portrait else (1376, 768))
    canvas = Image.new("RGB", (width, height), PALETTE["paper"])
    draw = ImageDraw.Draw(canvas)
    margin = 54 if portrait else 72
    rule_y = 52 if portrait else 46
    draw.line((margin, rule_y, width - margin, rule_y), fill=PALETTE["line"], width=2)

    max_title_lines = 4 if portrait else 3
    headline_size = 47 if portrait else 50
    while True:
        headline = ImageFont.truetype(FONT_BOLD, headline_size)
        title_lines = wrapped_lines(draw, title, headline, width - margin * 2, max_title_lines)
        if " ".join(line.rstrip("…") for line in title_lines) == title or headline_size <= (38 if portrait else 40):
            break
        headline_size -= 2
    subtitle = ImageFont.truetype(FONT_REGULAR, 27 if portrait else 25)
    badge_font = ImageFont.truetype(FONT_BOLD, 23 if portrait else 25)
    title_y = rule_y + 34
    line_height = round(headline_size * 1.08)
    for index, line in enumerate(title_lines):
        draw.text((margin, title_y + index * line_height), line, font=headline, fill=PALETTE["ink"])

    subtitle_y = title_y + len(title_lines) * line_height + 12
    short_description = description.split(".", 1)[0].strip()
    if len(short_description) > 145:
        candidates = [part.strip() for part in re.split(r"[;—]", short_description) if part.strip()]
        short_description = candidates[0] if candidates and len(candidates[0]) <= 145 else short_description[:145].rsplit(" ", 1)[0]
    short_description = short_description.rstrip(".,;:") + "." if short_description else "Practical AI news and analysis for business leaders."
    desc_lines = wrapped_lines(draw, short_description, subtitle, width - margin * 2, 2)
    for index, line in enumerate(desc_lines):
        draw.text((margin, subtitle_y + index * round(subtitle.size * 1.2)), line, font=subtitle, fill=PALETTE["muted"])

    text_bottom = subtitle_y + len(desc_lines) * round(subtitle.size * 1.2)
    photo_top = max(365 if portrait else 235, text_bottom + 22)
    photo_left = margin
    photo_width = width - margin * 2
    photo_height = height - photo_top - margin
    variant = int(hashlib.sha256(target.name.encode()).hexdigest()[:4], 16)
    photo = fit_crop(source, (photo_width, photo_height), variant)
    canvas.paste(photo, (photo_left, photo_top))

    badge_w, badge_h = (190, 86) if portrait else (210, 92)
    badge_x = photo_left + photo_width - badge_w
    badge_y = photo_top + photo_height - badge_h
    draw.rectangle((badge_x, badge_y, badge_x + badge_w, badge_y + badge_h), fill=PALETTE["brand"])
    draw.text((badge_x + 18, badge_y + 17), "AI FUSION", font=badge_font, fill=PALETTE["white"])
    small = ImageFont.truetype(FONT_BOLD, 15 if portrait else 16)
    draw.text((badge_x + 18, badge_y + 52), "NEWS + INSIGHT", font=small, fill="#bfcfff")

    quantized = canvas.quantize(colors=192, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    if target.suffix.lower() in {".jpg", ".jpeg"}:
        canvas.save(target, "JPEG", quality=88, optimize=True, progressive=True)
    else:
        quantized.save(target, "PNG", optimize=True)


def main() -> None:
    metadata = metadata_by_image()
    sources = {path.stem: Image.open(path).convert("RGB") for path in SOURCE_DIR.glob("*.png")}
    targets = [path for path in IMAGE_DIR.iterdir() if path.is_file() and path.suffix.lower() in {".png", ".jpg", ".jpeg"}]
    for target in sorted(targets):
        lookup = target.name
        if lookup not in metadata and "-hub" in target.stem:
            lookup = target.name.replace("-hub", "")
        title, description = metadata.get(lookup, (target.stem.replace("-hub", "").replace("-", " ").title(), "Practical AI news and analysis for business leaders."))
        category = category_for(target.name, title)
        render_card(target, title, description, sources[category])
    print(f"Regenerated {len(targets)} editorial images across {len(sources)} original visual categories.")


if __name__ == "__main__":
    main()
