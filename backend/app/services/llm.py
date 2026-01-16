# app/services/llm.py

from openai import OpenAI
from app.core.config import settings

_client = None


def get_client():
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.openai_api_key)
    return _client


def generate_structured_company_data(prompt: str) -> str:
    client = get_client()

    system_prompt = """
You are a STRICT JSON generator.

Rules you MUST follow:
- Output ONLY valid JSON (no markdown, no explanations)
- Always return ALL required keys
- Never invent emails, phone numbers, or social links
- If data is not found, use:
  - null for strings
  - [] for arrays
- socials must be REAL company profile URLs only
  (ignore generic links like facebook.com, twitter.com)
- phone_numbers must look like real phone numbers
- emails must look like real email addresses
- summary must be factual and concise (1–3 lines)

Required JSON keys:
company_name, website, summary,
emails, phone_numbers, socials,
sources, notes
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": system_prompt.strip()},
            {"role": "user", "content": prompt},
        ],
        temperature=0,
    )

    return response.choices[0].message.content.strip()