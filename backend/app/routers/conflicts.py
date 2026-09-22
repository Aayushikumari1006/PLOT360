"""
PLOT360 Backend — Conflicts Router
Sections 48, 49 & 129: Cross-system discrepancy detection, conflict center,
evidence inspection, and authorized officer resolution with audit logging.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.ai_models import DataConflict
from app.services.conflict_service import resolve_conflict
from app.dependencies import get_current_user_optional, require_permission, AuthenticatedUserContext

router = APIRouter(prefix="/conflicts", tags=["Data Conflicts"])


class ConflictResolutionPayload(BaseModel):
    status: str  # RESOLVED / UNDER_REVIEW / REQUIRES_MORE_EVIDENCE / DISMISSED
    resolution_notes: str


@router.get("", summary="List multi-departmental data conflicts across parcels")
def list_conflicts(
    status: Optional[str] = Query(None, description="Filter by status e.g. OPEN, RESOLVED"),
    ulpin: Optional[str] = Query(None, description="Filter by parcel ULPIN"),
    limit: int = Query(50, ge=1, le=100),
    user_ctx: AuthenticatedUserContext = Depends(require_permission("conflict:read")),
    db: Session = Depends(get_db)
):
    """
    Section 48: Lists discrepancies detected between RoR, Registration, Tax, and Planning.
    """
    q = db.query(DataConflict)
    if status:
        q = q.filter(DataConflict.status == status.upper())
    if ulpin:
        q = q.filter(DataConflict.ulpin == ulpin.strip())

    conflicts = q.order_by(DataConflict.created_at.desc()).limit(limit).all()
    return [
        {
            "id": c.id,
            "conflict_id": c.conflict_id,
            "ulpin": c.ulpin,
            "conflict_type": c.conflict_type,
            "field": c.field,
            "severity": getattr(c, "severity", "MEDIUM"),
            "source_a": c.source_a,
            "value_a": c.value_a,
            "source_b": c.source_b,
            "value_b": c.value_b,
            "difference": c.difference,
            "difference_summary": c.difference or c.evidence or "Field discrepancy",
            "evidence": c.evidence,
            "status": c.status,
            "resolution_notes": c.resolution_notes,
            "assigned_officer": c.assigned_officer,
            "created_at": c.created_at.isoformat() if c.created_at else None
        }
        for c in conflicts
    ]


@router.get("/{conflict_id}", summary="Get detailed conflict record and source evidence")
def get_conflict(
    conflict_id: str = Path(..., description="Conflict ID e.g. CONF-001 or database integer ID"),
    user_ctx: AuthenticatedUserContext = Depends(require_permission("conflict:read")),
    db: Session = Depends(get_db)
):
    """
    Section 49: Detailed discrepancy view showing competing source records and values.
    """
    c = db.query(DataConflict).filter(
        (DataConflict.conflict_id == conflict_id) |
        (DataConflict.id == int(conflict_id) if conflict_id.isdigit() else False)
    ).first()
    if not c:
        raise HTTPException(status_code=404, detail=f"Conflict not found: '{conflict_id}'")

    return {
        "id": c.id,
        "conflict_id": c.conflict_id,
        "ulpin": c.ulpin,
        "conflict_type": c.conflict_type,
        "field": c.field,
        "severity": getattr(c, "severity", "MEDIUM"),
        "source_a": c.source_a,
        "value_a": c.value_a,
        "source_b": c.source_b,
        "value_b": c.value_b,
        "difference": c.difference,
        "difference_summary": c.difference or c.evidence or "Field discrepancy",
        "evidence": c.evidence,
        "status": c.status,
        "assigned_officer": c.assigned_officer,
        "resolution_notes": c.resolution_notes,
        "resolved_at": getattr(c, "resolved_at", None).isoformat() if getattr(c, "resolved_at", None) else None,
        "created_at": c.created_at.isoformat() if c.created_at else None
    }


@router.patch("/{conflict_id}", summary="Resolve or update data conflict (Authorized officers)")
def resolve_conflict_top_level(
    conflict_id: str = Path(..., description="Conflict ID e.g. CONF-001 or database ID"),
    payload: ConflictResolutionPayload = None,
    user_ctx: AuthenticatedUserContext = Depends(require_permission("conflict:resolve")),
    db: Session = Depends(get_db)
):
    """
    Section 49: Authorized officer conflict resolution with immutable audit logging.
    """
    c = db.query(DataConflict).filter(
        (DataConflict.conflict_id == conflict_id) |
        (DataConflict.id == int(conflict_id) if conflict_id.isdigit() else False)
    ).first()
    if not c:
        raise HTTPException(status_code=404, detail=f"Conflict not found: '{conflict_id}'")

    if not payload:
        raise HTTPException(status_code=400, detail="Must provide resolution status and notes")

    officer_name = user_ctx.full_name or user_ctx.username if user_ctx else "Revenue Officer"
    officer_role = user_ctx.roles[0] if (user_ctx and user_ctx.roles) else "revenue_officer"

    updated = resolve_conflict(
        conflict_id=c.id,
        status=payload.status,
        resolution_notes=payload.resolution_notes,
        officer_name=officer_name,
        officer_role=officer_role,
        db=db
    )
    return {
        "success": True,
        "conflict_id": updated.conflict_id,
        "status": updated.status,
        "resolution_notes": updated.resolution_notes
    }
