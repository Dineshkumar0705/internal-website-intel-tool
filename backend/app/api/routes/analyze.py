from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json

from app.api.deps import get_current_user, get_db
from app.services.scraper import (
    fetch_html,
    extract_visible_text,
    find_relevant_links,
)
from app.services.extractor import (
    extract_emails,
    extract_phone_numbers,
    extract_social_links,
)
from app.services.llm import generate_structured_company_data
from app.schemas.company import CompanyStructuredOutput
from app.models.company_data import CompanyData

# ✅ PHASE 2 CLEANERS
from app.services.cleaner import (
    clean_social_links,
    clean_phone_numbers,
    infer_company_name,
)

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("/", response_model=CompanyStructuredOutput)
def analyze_website(
    url: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # ---------------- SCRAPING (SAFE MODE) ----------------
    try:
        html = fetch_html(url)
        main_text = extract_visible_text(html)
    except Exception:
        html = ""
        main_text = ""

    emails = extract_emails(main_text) if main_text else []
    phone_numbers = extract_phone_numbers(main_text) if main_text else []
    socials = extract_social_links(html) if html else []

    pages_scraped = []

    try:
        relevant_links = find_relevant_links(url, html)
        for link in relevant_links[:5]:  # 🔒 LIMIT = performance + safety
            try:
                page_html = fetch_html(link)
                page_text = extract_visible_text(page_html)

                pages_scraped.append(link)
                emails.extend(extract_emails(page_text))
                phone_numbers.extend(extract_phone_numbers(page_text))
                socials.extend(extract_social_links(page_html))
            except Exception:
                continue
    except Exception:
        pass

    # ---------------- CLEAN & DEDUP (PHASE 2 CORE) ----------------
    emails = list(set(emails))
    phone_numbers = clean_phone_numbers(phone_numbers)
    socials = clean_social_links(
        [dict(t) for t in {tuple(s.items()) for s in socials}]
    )

    # ---------------- LLM PROMPT ----------------
    prompt = f"""
Website: {url}

Extracted emails:
{emails}

Extracted phone numbers:
{phone_numbers}

Extracted social links:
{socials}

Scraped website content (truncated):
{main_text[:2000]}

Additional pages discovered:
{pages_scraped}

TASK:
Return ONLY valid JSON with:
company_name, website, summary,
emails, phone_numbers, socials,
sources, notes(optional)
"""

    # ---------------- LLM SAFE PARSE ----------------
    try:
        llm_response = generate_structured_company_data(prompt)
        structured_output = CompanyStructuredOutput.model_validate_json(
            llm_response
        )
        structured_dict = structured_output.model_dump()
    except Exception:
        structured_dict = {
            "company_name": None,
            "website": url,
            "summary": "Unable to extract full details from this website.",
            "emails": [],
            "phone_numbers": [],
            "socials": [],
            "sources": [url],
            "notes": "Website blocked, empty, or AI extraction failed",
        }

    # ---------------- SMART COMPANY NAME (PHASE 2 FIX) ----------------
    if not structured_dict.get("company_name"):
        structured_dict["company_name"] = infer_company_name(html, url)

    # ---------------- FINAL NORMALIZATION ----------------
    structured_dict["emails"] = structured_dict.get("emails", [])
    structured_dict["phone_numbers"] = structured_dict.get("phone_numbers", [])
    structured_dict["socials"] = structured_dict.get("socials", [])
    structured_dict["sources"] = structured_dict.get("sources", [url])

    # ---------------- SAVE TO DB ----------------
    record = CompanyData(
        website=url,
        data=json.dumps(structured_dict),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return structured_dict