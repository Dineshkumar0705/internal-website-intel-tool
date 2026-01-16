from pydantic import BaseModel
from typing import List, Optional


class Social(BaseModel):
    platform: str
    url: str


class CompanyStructuredOutput(BaseModel):
    company_name: Optional[str] = None
    website: str
    summary: Optional[str] = None

    emails: List[str] = []
    phone_numbers: List[str] = []
    socials: List[Social] = []

    sources: List[str] = []
    notes: Optional[str] = None