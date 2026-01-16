from datetime import datetime
from typing import Dict, Any
from pydantic import BaseModel


class HistoryItem(BaseModel):
    id: int
    website: str
    data: Dict[str, Any]   # 🔥 REQUIRED FOR HISTORY LIST
    created_at: datetime

    class Config:
        from_attributes = True


class HistoryDetail(BaseModel):
    id: int
    website: str
    data: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True