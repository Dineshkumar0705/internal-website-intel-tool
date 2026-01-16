import re
from urllib.parse import urlparse


EMAIL_REGEX = re.compile(
    r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
)

PHONE_REGEX = re.compile(
    r"(\+?\d[\d\s().-]{7,}\d)"
)

SOCIAL_DOMAINS = {
    "linkedin.com": "LinkedIn",
    "twitter.com": "Twitter",
    "x.com": "Twitter",
    "facebook.com": "Facebook",
    "instagram.com": "Instagram",
    "github.com": "GitHub",
}


def extract_emails(text: str) -> list[str]:
    return list(set(EMAIL_REGEX.findall(text)))


def extract_phone_numbers(text: str) -> list[str]:
    return list(set(PHONE_REGEX.findall(text)))


def extract_social_links(text: str) -> list[dict]:
    socials = []

    for domain, platform in SOCIAL_DOMAINS.items():
        if domain in text:
            socials.append({
                "platform": platform,
                "url": f"https://{domain}"
            })

    return socials