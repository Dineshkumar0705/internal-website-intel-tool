from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.api.deps import get_current_user, get_db
from app.models.company_data import CompanyData
from app.schemas.history import HistoryItem, HistoryDetail

router = APIRouter(prefix="/history", tags=["history"])


# ------------------------------------------------------------------
# GET ALL HISTORY (List View)
# ------------------------------------------------------------------
@router.get("/", response_model=list[HistoryItem])
def read_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = (
        db.query(CompanyData)
        .order_by(CompanyData.created_at.desc())
        .all()
    )

    # ✅ Explicit JSON deserialization (CRITICAL FIX)
    return [
        {
            "id": record.id,
            "website": record.website,
            "data": json.loads(record.data),  # 👈 DB JSON → dict
            "created_at": record.created_at,
        }
        for record in records
    ]


# ------------------------------------------------------------------
# GET SINGLE HISTORY RECORD (Detail View)
# ------------------------------------------------------------------
@router.get("/{record_id}", response_model=HistoryDetail)
def read_history_detail(
    record_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = (
        db.query(CompanyData)
        .filter(CompanyData.id == record_id)
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="History record not found"
        )

    return {
        "id": record.id,
        "website": record.website,
        "data": json.loads(record.data),  # 👈 DB JSON → dict
        "created_at": record.created_at,
    }