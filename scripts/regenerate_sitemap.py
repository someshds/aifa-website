#!/usr/bin/env python3
"""
Regenerate sitemap.xml from the repo's HTML file tree.

Run from repo root:
    python3 scripts/regenerate_sitemap.py

Excludes legacy/duplicate pages so Google only sees canonical URLs.
Update EXCLUDE_FILES / EXCLUDE_PATTERNS when adding/removing pages.
"""

from __future__ import annotations

import re
from pathlib import Path
from datetime import datetime

REPO_ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://tools.aifusionautomations.com"

# Exact filenames (relative to repo root) to skip — duplicates, legacy, drafts.
EXCLUDE_FILES = {
    "index.html.bak",
    "tools-index.html",            # legacy version of index.html
    "privacy-policy.html",         # superseded by privacy-policy-aifa.html
    "boxleaguepro-lite.html",      # superseded by boxleague-pro.html
    "roi-calculator.html",         # superseded by roi-calculator-v2.0.html
    "3d-demo-template.html",       # template, not a public page
    "ai-tools-cheat-sheet.html",   # not yet deployed (404 currently)
    "skill-pack-download.html",    # not yet deployed
}

# Files matching these regex patterns are excluded.
EXCLUDE_PATTERNS = [
    re.compile(r".*-v1\.0\.html$"),  # all -v1.0 legacy duplicates
]

# Priority by URL pattern (highest match wins). 1.0 = highest, 0.0 = lowest.
PRIORITY_RULES = [
    (re.compile(r"^/$"), 1.0, "weekly"),
    (re.compile(r"^/pricing\.html$"), 0.95, "monthly"),
    (re.compile(r"^/ai-operating-systems\.html$"), 0.9, "monthly"),
    (re.compile(r"^/ai-receptionist\.html$"), 0.9, "monthly"),
    (re.compile(r"^/products/$"), 0.9, "monthly"),
    (re.compile(r"^/products/.+\.html$"), 0.8, "monthly"),
    (re.compile(r"^/case-study-.+\.html$"), 0.85, "monthly"),
    (re.compile(r"^/about\.html$"), 0.7, "monthly"),
    (re.compile(r"^/blog/$"), 0.85, "weekly"),
    (re.compile(r"^/blog/.+\.html$"), 0.7, "monthly"),
    (re.compile(r"^/services/$"), 0.7, "weekly"),
    (re.compile(r"^/services/.+\.html$"), 0.6, "monthly"),
    (re.compile(r"^/videos/$"), 0.75, "monthly"),
    (re.compile(r"^/videos/.+/$"), 0.65, "monthly"),
    (re.compile(r"^/(idea-validator|roi-calculator-v2\.0|review-booster|analyser|league-scheduler)\.html$"), 0.75, "monthly"),
    (re.compile(r"^/boxleague-pro\.html$"), 0.7, "monthly"),
    (re.compile(r"^/(privacy-policy-aifa|terms|earnings-disclaimer)\.html$"), 0.3, "yearly"),
]
DEFAULT_PRIORITY = (0.5, "monthly")


def should_exclude(rel: str) -> bool:
    if rel in EXCLUDE_FILES:
        return True
    if any(p.match(rel) for p in EXCLUDE_PATTERNS):
        return True
    return False


def url_for(rel_path: str) -> str:
    if rel_path == "index.html":
        return f"{BASE_URL}/"
    if rel_path.endswith("/index.html"):
        return f"{BASE_URL}/{rel_path[:-len('index.html')]}"
    return f"{BASE_URL}/{rel_path}"


def priority_for(url: str) -> tuple[float, str]:
    path = url.replace(BASE_URL, "")
    for pattern, priority, changefreq in PRIORITY_RULES:
        if pattern.match(path):
            return priority, changefreq
    return DEFAULT_PRIORITY


def collect_pages() -> list[tuple[str, float, str]]:
    pages: list[tuple[str, float, str]] = []
    seen_urls: set[str] = set()
    for path in sorted(REPO_ROOT.rglob("*.html")):
        rel = path.relative_to(REPO_ROOT).as_posix()
        # Skip anything in node_modules, .git, scripts, etc.
        if rel.startswith((".git/", "node_modules/", "scripts/")):
            continue
        if should_exclude(rel):
            continue
        url = url_for(rel)
        if url in seen_urls:
            continue
        seen_urls.add(url)
        priority, changefreq = priority_for(url)
        pages.append((url, priority, changefreq))
    return pages


def render_sitemap(pages: list[tuple[str, float, str]]) -> str:
    today = datetime.utcnow().strftime("%Y-%m-%d")
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url, priority, changefreq in pages:
        lines.append(
            f"  <url><loc>{url}</loc>"
            f"<lastmod>{today}</lastmod>"
            f"<changefreq>{changefreq}</changefreq>"
            f"<priority>{priority:.1f}</priority></url>"
        )
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def main() -> None:
    pages = collect_pages()
    sitemap = render_sitemap(pages)
    out = REPO_ROOT / "sitemap.xml"
    out.write_text(sitemap)
    print(f"Wrote {out} with {len(pages)} URLs")


if __name__ == "__main__":
    main()
