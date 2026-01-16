import re
from urllib.parse import urlparse
from bs4 import BeautifulSoup


# -------------------------------------------------
# SOCIAL LINKS CLEANER
# -------------------------------------------------
def clean_social_links(socials: list[dict]) -> list[dict]:
    """
    Removes generic social homepages and keeps only
    company/user-specific profile URLs.
    """
    cleaned = []
    seen = set()

    for s in socials:
        platform = (s.get("platform") or "").lower()
        url = s.get("url", "").strip()

        if not url:
            continue

        parsed = urlparse(url)

        # Must have meaningful path
        if not parsed.path or parsed.path in ("/", ""):
            continue

        # Platform-specific validation
        if "linkedin" in parsed.netloc and not (
            "/company/" in parsed.path or "/in/" in parsed.path
        ):
            continue

        if "github" in parsed.netloc and parsed.path.count("/") < 2:
            continue

        if "twitter" in parsed.netloc or "x.com" in parsed.netloc:
            if parsed.path in ("/home", "/explore"):
                continue

        if "instagram" in parsed.netloc and parsed.path.count("/") < 2:
            continue

        key = (platform, url)
        if key not in seen:
            seen.add(key)
            cleaned.append(
                {
                    "platform": s.get("platform", platform.title()),
                    "url": url,
                }
            )

    return cleaned


# -------------------------------------------------
# PHONE NUMBER CLEANER
# -------------------------------------------------
def clean_phone_numbers(numbers: list[str]) -> list[str]:
    """
    Removes years, date ranges, and invalid phone numbers.
    Keeps only realistic phone numbers.
    """
    cleaned = set()

    for num in numbers:
        if not num:
            continue

        # Remove non-numeric except + and -
        raw = re.sub(r"[^\d+]", "", num)

        # Reject years / short garbage
        if len(raw) < 8:
            continue

        # Reject year ranges like 2017-2024
        if re.fullmatch(r"(19|20)\d{2}", raw):
            continue

        cleaned.add(num.strip())

    return list(cleaned)


# -------------------------------------------------
# COMPANY NAME INFERENCE (CRITICAL FIX)
# -------------------------------------------------
def infer_company_name(html: str, url: str) -> str:
    """
    Smart fallback to infer company name:
    1. HTML <title>
    2. Domain name
    """
    if html:
        try:
            soup = BeautifulSoup(html, "html.parser")
            title = soup.title.string if soup.title else None
            if title:
                title = title.split("|")[0].split("-")[0].strip()
                if len(title) > 2:
                    return title
        except Exception:
            pass

    # Fallback: domain name
    parsed = urlparse(url)
    domain = parsed.netloc.replace("www.", "")
    return domain.split(".")[0].title()