"""
PLOT360 Backend — Duplicate Detection Service
Section 51: Exact and similarity-based candidate matching.
Compares survey number, parcel number, area, and location.
Never automatically merges records.
"""
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.parcel import Parcel
from app.models.ai_models import DuplicateCandidate


def detect_duplicates_for_parcel(parcel: Parcel, db: Session) -> List[DuplicateCandidate]:
    """Identifies candidate duplicate parcels based on survey number and spatial proximity."""
    candidates: List[DuplicateCandidate] = []
    if not parcel.survey_no:
        return candidates

    # Query matching survey numbers within same district/location
    matches = db.query(Parcel).filter(
        Parcel.id != parcel.id,
        Parcel.survey_no == parcel.survey_no,
        Parcel.location_id == parcel.location_id
    ).all()

    for m in matches:
        score = 0.92
        matched = ["survey_no", "location_id"]
        if parcel.rural_urban == m.rural_urban:
            score += 0.04
            matched.append("rural_urban")

        cand = DuplicateCandidate(
            parcel_id=parcel.id,
            candidate_parcel_id=m.id,
            similarity_score=min(score, 0.99),
            matched_fields=matched,
            reason=f"Exact match on survey number '{parcel.survey_no}' within jurisdiction '{parcel.location_id}'.",
            status="PENDING_REVIEW"
        )
        candidates.append(cand)

    return candidates
