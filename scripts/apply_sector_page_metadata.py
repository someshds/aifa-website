#!/usr/bin/env python3
"""Apply unique titles and descriptions to sector service pages.

There is no HTML generator for services/ai-automation-for-*.html — the pages
were stamped from a shared template. This script is the source of truth for
their <title>, meta description, og:title and og:description.

Run from repo root:
    python3 scripts/apply_sector_page_metadata.py
"""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SERVICES = ROOT / "services"

# Title pattern: "AI Automation for [Sector] | AI Fusion"
# Descriptions are unique to each page's audience, pains and use cases.
# Target: titles 45–60 characters, descriptions 120–155 characters.
PAGES: dict[str, tuple[str, str]] = {
    "ai-automation-for-accountants.html": (
        "AI Automation for Accounting Firms | AI Fusion",
        "Accounting practices lose senior time chasing year-end records and deadlines. Assess reminder, onboarding and referral workflows before choosing a tool.",
    ),
    "ai-automation-for-architects.html": (
        "AI Automation for Architecture Firms | AI Fusion",
        "Architecture firms lose time when clients wait for updates and consultations. Assess milestone messages, booking and planning notifications first.",
    ),
    "ai-automation-for-bakeries.html": (
        "AI Automation for Bakeries & Patisseries | AI Fusion",
        "Bakeries miss custom-order and wedding-cake enquiries in a busy inbox. Assess order workflows, regular-order reminders and post-event reviews first.",
    ),
    "ai-automation-for-beauty-salons.html": (
        "AI Automation for Beauty Salons & Spas | AI Fusion",
        "Beauty salons lose bookings to last-minute cancellations and quiet Instagram DMs. Assess reminders, rebooking and fill-in sequences before buying a tool.",
    ),
    "ai-automation-for-builders.html": (
        "AI Automation for Construction Firms | AI Fusion",
        "Building firms miss calls on site and lose jobs to slow quotes. Assess missed-call follow-up, quote chases and invoice reminders first.",
    ),
    "ai-automation-for-care-homes.html": (
        "AI Automation for Residential Care | AI Fusion",
        "Care homes need faster answers on urgent placements and family updates. Assess enquiry handling, family messages and compliance reminders first.",
    ),
    "ai-automation-for-caterers.html": (
        "AI Automation for Catering Businesses | AI Fusion",
        "Caterers juggle event briefs, dietary notes and slow corporate replies. Assess enquiry follow-up, preference collection and post-event reviews first.",
    ),
    "ai-automation-for-chiropractors.html": (
        "AI Automation for Chiropractic Clinics | AI Fusion",
        "Chiropractic clinics lose patients after the first visit. Assess intake, treatment-plan reminders and maintenance recalls before choosing a tool.",
    ),
    "ai-automation-for-cleaning-companies.html": (
        "AI Automation for Cleaning Businesses | AI Fusion",
        "Cleaning businesses stall on recurring schedules, invoice chases and slow quotes. Assess booking, payment follow-up and seasonal upsells first.",
    ),
    "ai-automation-for-dentists.html": (
        "AI Automation for Dental Practices | AI Fusion",
        "Dental practices lose diary time to no-shows and mixed NHS and private enquiries. Assess reminders, new-patient intake and check-up recalls first.",
    ),
    "ai-automation-for-dog-groomers.html": (
        "AI Automation for Dog Grooming Firms | AI Fusion",
        "Dog groomers lose slots to late cancellations and forgotten rebooks. Assess reminders, waitlists and welcome sequences before choosing a tool.",
    ),
    "ai-automation-for-driving-instructors.html": (
        "AI Automation for Driving Schools | AI Fusion",
        "Driving schools lose paid hours to cancellations and unpaid lesson blocks. Assess slot-fill, payment reminders and test-prep nudges first.",
    ),
    "ai-automation-for-electrician-contractors.html": (
        "AI Automation for Electrical Contractors | AI Fusion",
        "Electrical contractors juggle multi-site diaries, certificates and slow invoices. Assess scheduling, expiry reminders and payment follow-up first.",
    ),
    "ai-automation-for-electricians.html": (
        "AI Automation for Electrical Trades | AI Fusion",
        "Electricians miss calls on site and chase inspections and invoices by hand. Assess booking, EICR reminders and emergency routing first.",
    ),
    "ai-automation-for-estate-agents.html": (
        "AI Automation for Estate Agencies | AI Fusion",
        "Estate agencies lose Rightmove and Zoopla leads after hours. Assess instant response, valuation booking and vendor updates first.",
    ),
    "ai-automation-for-event-planners.html": (
        "AI Automation for Event Planning Firms | AI Fusion",
        "Event planners drown in vendor threads and missing post-event feedback. Assess enquiry qualification, checklists and review requests first.",
    ),
    "ai-automation-for-financial-advisors.html": (
        "AI Automation for Financial Advisers | AI Fusion",
        "Financial advisers spend too long qualifying enquiries and booking annual reviews. Assess lead qualification, review booking and referral workflows first.",
    ),
    "ai-automation-for-florists.html": (
        "AI Automation for Florist Businesses | AI Fusion",
        "Florists miss wedding enquiries and recurring occasion orders. Assess reminder campaigns, wedding follow-up and delivery confirmations first.",
    ),
    "ai-automation-for-gardeners.html": (
        "AI Automation for Gardening Firms | AI Fusion",
        "Gardening firms lose work in seasonal gaps and slow quotes. Assess recurring visits, seasonal campaigns and quote follow-up first.",
    ),
    "ai-automation-for-gyms.html": (
        "AI Automation for Gyms and Fitness | AI Fusion",
        "Gyms and studios lose members after sign-up and reply slowly to ad leads. Assess trial booking, class reminders and lapsed-member follow-up first.",
    ),
    "ai-automation-for-heating-engineers.html": (
        "AI Automation for Heating Engineers | AI Fusion",
        "Heating engineers miss out-of-hours boiler calls and annual service rebooks. Assess emergency triage, service reminders and certificate renewals first.",
    ),
    "ai-automation-for-insurance-brokers.html": (
        "AI Automation for Insurance Brokers | AI Fusion",
        "Insurance brokers lose renewals and comparison-site quotes in the admin pile. Assess renewal reminders, quote response and cross-sell workflows first.",
    ),
    "ai-automation-for-it-support.html": (
        "AI Automation for IT Support Firms | AI Fusion",
        "IT support firms drown in tickets and unstructured onboarding. Assess triage, SLA alerts and new-client sequences before choosing a tool.",
    ),
    "ai-automation-for-lawyers.html": (
        "AI Automation for Legal Practices | AI Fusion",
        "Law practices lose new-case enquiries and signed documents in the inbox. Assess intake, billing reminders and document follow-up first.",
    ),
    "ai-automation-for-locksmiths.html": (
        "AI Automation for Locksmith Firms | AI Fusion",
        "Locksmiths take emergency calls at all hours and rarely collect reviews. Assess triage, quote follow-up and post-job review requests first.",
    ),
    "ai-automation-for-mobile-mechanics.html": (
        "AI Automation for Mobile Mechanics | AI Fusion",
        "Mobile mechanics miss calls under the bonnet and forget service reminders. Assess missed-call follow-up, quote chases and review requests first.",
    ),
    "ai-automation-for-mortgage-brokers.html": (
        "AI Automation for Mortgage Brokers | AI Fusion",
        "Mortgage brokers lose comparison-site leads while chasing documents. Assess instant response, document requests and long-cycle nurture first.",
    ),
    "ai-automation-for-music-teachers.html": (
        "AI Automation for Music School Teachers | AI Fusion",
        "Music teachers juggle lesson diaries, term fees and holiday drop-off. Assess reminders, fee sequences and exam-prep nudges first.",
    ),
    "ai-automation-for-nurseries.html": (
        "AI Automation for Nurseries & Childcare | AI Fusion",
        "Nurseries lose parent enquiries in waiting-list admin and Ofsted paperwork. Assess parent messages, enquiry response and reminder workflows first.",
    ),
    "ai-automation-for-opticians.html": (
        "AI Automation for Optical Practices | AI Fusion",
        "Optical practices miss eye-test recalls and contact-lens reorders. Assess recall campaigns, reorder reminders and new-patient welcome sequences first.",
    ),
    "ai-automation-for-osteopaths.html": (
        "AI Automation for Osteopathy Clinics | AI Fusion",
        "Osteopathy clinics lose follow-up appointments and self-referrals. Assess reminders, digital intake and reactivation of past patients first.",
    ),
    "ai-automation-for-personal-trainers.html": (
        "AI Automation for Personal Trainers | AI Fusion",
        "Personal trainers lose clients between programmes and chase session fees. Assess check-ins, payment reminders and programme renewals first.",
    ),
    "ai-automation-for-pest-control.html": (
        "AI Automation for Pest Control Firms | AI Fusion",
        "Pest control firms get seasonal spikes and forget annual contract renewals. Assess emergency response, treatment follow-up and renewal reminders first.",
    ),
    "ai-automation-for-photographers.html": (
        "AI Automation for Photography Firms | AI Fusion",
        "Photography businesses lose bookings to slow replies and unpaid invoices. Assess enquiry response, selection reminders and payment follow-up first.",
    ),
    "ai-automation-for-physios.html": (
        "AI Automation for Physiotherapy Clinics | AI Fusion",
        "Physio clinics lose first appointments to no-shows and slow self-referrals. Assess reminders, discharge follow-up and exercise check-ins first.",
    ),
    "ai-automation-for-physiotherapy-clinics.html": (
        "AI Automation for Rehabilitation Centres | AI Fusion",
        "Rehab centres lose first appointments and struggle with GP referral admin. Assess confirmations, exercise check-ins and discharge follow-up first.",
    ),
    "ai-automation-for-plumbers.html": (
        "AI Automation for Plumbing Businesses | AI Fusion",
        "Plumbing businesses miss emergency calls and unpaid invoices while on the job. Assess call triage, quote follow-up and review requests first.",
    ),
    "ai-automation-for-recruitment-agencies.html": (
        "AI Automation for Recruitment Agencies | AI Fusion",
        "Recruitment agencies lose candidates after interviews and wait on client feedback. Assess nurture, interview reminders and job-alert workflows first.",
    ),
    "ai-automation-for-removals-companies.html": (
        "AI Automation for Removals Companies | AI Fusion",
        "Removals firms lose urgent-move quotes and forget post-move follow-up. Assess instant quotes, pre-move checklists and review requests first.",
    ),
    "ai-automation-for-restaurants.html": (
        "AI Automation for Restaurants & Cafes | AI Fusion",
        "Restaurants and cafes lose covers to no-shows and split reservation inboxes. Assess confirmations, menu questions and post-visit reviews first.",
    ),
    "ai-automation-for-roofers.html": (
        "AI Automation for Roofing Businesses | AI Fusion",
        "Roofing businesses miss calls at height and lose seasonal quotes. Assess missed-call follow-up, quote sequences and referral requests first.",
    ),
    "ai-automation-for-solicitors.html": (
        "AI Automation for Solicitor Firms | AI Fusion",
        "Law firms lose new clients to slow intake and missing documents. Assess client intake, document requests and matter updates first.",
    ),
    "ai-automation-for-taxis.html": (
        "AI Automation for Taxi & Private Hire | AI Fusion",
        "Taxi and private-hire firms still take bookings by phone and skip reviews. Assess booking confirmations, loyalty workflows and post-ride reviews first.",
    ),
    "ai-automation-for-travel-agents.html": (
        "AI Automation for Travel Agencies | AI Fusion",
        "Travel agencies lose browsers who are not ready to book. Assess long-cycle nurture, pre-trip sequences and post-trip reviews first.",
    ),
    "ai-automation-for-tutors.html": (
        "AI Automation for Tutors & Tuition | AI Fusion",
        "Tutors lose students between exam seasons and chase monthly fees. Assess parent updates, fee reminders and re-enrolment campaigns first.",
    ),
    "ai-automation-for-vets.html": (
        "AI Automation for Veterinary Practices | AI Fusion",
        "Veterinary practices forget booster reminders and post-visit checks. Assess vaccination campaigns, urgent triage and health-check booking first.",
    ),
    "ai-automation-for-web-designers.html": (
        "AI Automation for Web Design Agencies | AI Fusion",
        "Web design agencies stall when clients sit on assets and forms go unanswered. Assess content collection, qualification and project updates first.",
    ),
    "ai-automation-for-wedding-photographers.html": (
        "AI Automation for Wedding Photographers | AI Fusion",
        "Wedding photographers lose couples who enquire months ahead. Assess long-cycle nurture, contract reminders and post-event reviews first.",
    ),
    "ai-automation-for-yoga-studios.html": (
        "AI Automation for Yoga & Pilates Studios | AI Fusion",
        "Yoga and Pilates studios lose intro members and booked classes that stay empty. Assess reminders, intro conversion and lapsed-member follow-up first.",
    ),
}


TITLE_RE = re.compile(r"(<title>)(.*?)(</title>)", re.I | re.S)
DESC_RE = re.compile(
    r'(<meta\s+name=["\']description["\']\s+content=")([^"]*)(")',
    re.I,
)
OG_TITLE_RE = re.compile(
    r'(<meta\s+property=["\']og:title["\']\s+content=")([^"]*)(")',
    re.I,
)
OG_DESC_RE = re.compile(
    r'(<meta\s+property=["\']og:description["\']\s+content=")([^"]*)(")',
    re.I,
)


def validate() -> list[str]:
    errors: list[str] = []
    titles: dict[str, str] = {}
    descs: dict[str, str] = {}
    disk = {p.name for p in SERVICES.glob("ai-automation-for-*.html")}
    mapped = set(PAGES)
    for missing in sorted(disk - mapped):
        errors.append(f"missing mapping: {missing}")
    for extra in sorted(mapped - disk):
        errors.append(f"mapping for missing file: {extra}")
    for name, (title, desc) in PAGES.items():
        if not (45 <= len(title) <= 60):
            errors.append(f"{name}: title length {len(title)} ({title!r})")
        if not (120 <= len(desc) <= 155):
            errors.append(f"{name}: description length {len(desc)}")
        if title in titles:
            errors.append(f"duplicate title: {title!r} ({titles[title]} and {name})")
        titles[title] = name
        if desc in descs:
            errors.append(f"duplicate description ({descs[desc]} and {name})")
        descs[desc] = name
        if "AI Fusion Automations" in title or "AI Fusion Automations" in desc:
            errors.append(f"{name}: brand form")
    return errors


def apply() -> int:
    errors = validate()
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    changed = 0
    for name, (title, desc) in sorted(PAGES.items()):
        path = SERVICES / name
        text = path.read_text(encoding="utf-8")
        escaped_title = html.escape(title, quote=True)
        escaped_desc = html.escape(desc, quote=True)
        new, n = TITLE_RE.subn(rf"\1{escaped_title}\3", text, count=1)
        if n != 1:
            print(f"{name}: title replace failed", file=sys.stderr)
            return 1
        new, n = DESC_RE.subn(rf"\1{escaped_desc}\3", new, count=1)
        if n != 1:
            print(f"{name}: description replace failed", file=sys.stderr)
            return 1
        new, n = OG_TITLE_RE.subn(rf"\1{escaped_title}\3", new, count=1)
        if n != 1:
            print(f"{name}: og:title replace failed", file=sys.stderr)
            return 1
        new, n = OG_DESC_RE.subn(rf"\1{escaped_desc}\3", new, count=1)
        if n != 1:
            print(f"{name}: og:description replace failed", file=sys.stderr)
            return 1
        if new != text:
            path.write_text(new, encoding="utf-8")
            changed += 1
            print(f"updated {name}  title={len(title)}  desc={len(desc)}")
        else:
            print(f"unchanged {name}")
    print(f"{changed} files written")
    return 0


if __name__ == "__main__":
    raise SystemExit(apply())
