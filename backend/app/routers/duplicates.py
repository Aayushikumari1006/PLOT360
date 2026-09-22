"""
PLOT360 Backend — Duplicates Router
Sections 50 & 129: Exact & probabilistic duplicate parcel candidate detection,
similarity matching factors, and human review status.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.ai_models import DuplicateCandidate
from app.models.user import AuditLog
from app.dependencies import get_current_user_optional, AuthenticatedUserContext

router = APIRouter(prefix="/duplicates", tags=["Duplicate Candidates"])


class DuplicateReviewPayload(BaseModel):
    status: str  # REVIEWED / MERGE_REJECTED / CONFIRMED_DUPLICATE / UNDER_REVIEW
    review_notes: Optional[str] = None


@router.get("", summary="List potential duplicate parcel candidates")
def list_duplicates(
    status: Optional[str] = Query(None, description="Filter by review status"),
    db: Session = Depends(get_db)
):
    """
    Section 50: Exact & probabilistic duplicate parcel candidates based on survey no,
    owner names, area, and spatial proximity. Never auto-merges records.
    """
    q = db.query(DuplicateCandidate)
    if status:
        q = q.filter(DuplicateCandidate.status == status.upper())
    cands = q.all()
    return [
        {
            "id": d.id,
            "parcel_id": d.parcel_id,
            "candidate_parcel_id": d.candidate_parcel_id,
            "similarity_score": d.similarity_score,
            "matched_fields": d.matched_fields,
            "reason": d.reason,
            "status": d.status
        }
        for d in cands
    ]


@router.get("/{candidate_id}", summary="Get candidate details and matching factor evidence")
def get_duplicate_candidate(
    candidate_id: int = Path(..., description="Duplicate candidate record ID"),
    db: Session = Depends(get_db)
):
    d = db.query(DuplicateCandidate).filter(DuplicateCandidate.id == candidate_id).first()
    if not d:
        raise HTTPException(status_code=404, detail=f"Duplicate candidate not found: '{candidate_id}'")

    return {
        "id": d.id,
        "parcel_id": d.parcel_id,
        "candidate_parcel_id": d.candidate_parcel_id,
        "similarity_score": d.similarity_score,
        "matched_fields": d.matched_fields,
        "reason": d.reason,
        "status": d.status
    }


@router.patch("/{candidate_id}", summary="Update duplicate candidate review status")
def review_duplicate_candidate(
    candidate_id: int = Path(..., description="Duplicate candidate record ID"),
    payload: DuplicateReviewPayload = None,
    user_ctx: Optional[AuthenticatedUserContext] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Section 50: Officer review decision for duplicate candidates. Never auto-merges.
    """
    d = db.query(DuplicateCandidate).filter(DuplicateCandidate.id == candidate_id).first()
    if not d:
        raise HTTPException(status_code=404, detail=f"Duplicate candidate not found: '{candidate_id}'")

    if not payload:
        raise HTTPException(status_code=400, detail="Must provide status and review notes")

    old_status = d.status
    d.status = payload.status.upper()

    officer_name = user_ctx.full_name or user_ctx.username if user_ctx else "Officer"
    officer_role = user_ctx.roles[0] if (user_ctx and user_ctx.roles) else "revenue_officer"

    # Audit log
    audit = AuditLog(
        parcel_id=None,
        ulpin=str(d.parcel_id),
        user_name=officer_name,
        role=officer_role,
        action="REVIEW_DUPLICATE_CANDIDATE",
        entity="duplicate_candidate",
        entity_id=str(d.id),
        old_value=old_status,
        new_value=d.status,
        notes=payload.review_notes or f"Marked duplicate candidate {d.id} as {d.status}"
    )
    db.add(audit)
    db.commit()
    db.refresh(d)

    return {
        "success": True,
        "id": d.id,
        "status": d.status,
        "notes": payload.review_notes
    }
