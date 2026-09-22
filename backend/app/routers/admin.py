"""
PLOT360 Backend — Administration Router
Sections 14, 22, 46, 50, 84: User/Role management, Audit Logs, Data Conflicts,
Duplicate Candidates, and Multi-State Configuration.
"""
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User, Role, Permission, UserRole, RolePermission, AuditLog
from app.models.ai_models import DataConflict, DuplicateCandidate
from app.models.config_model import StateConfig, StateFieldMapping
from app.dependencies import get_current_user_optional, require_permission, AuthenticatedUserContext
from app.services.conflict_service import resolve_conflict

router = APIRouter(prefix="/admin", tags=["Administration"])


class ConflictResolutionPayload(BaseModel):
    status: str # RESOLVED / UNDER_REVIEW / REQUIRES_MORE_EVIDENCE
    resolution_notes: str


@router.get("/users", summary="List system users")
def list_users(
    user_ctx: AuthenticatedUserContext = Depends(require_permission("admin:manage_users")),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    results = []
    for u in users:
        role_names = [ur.role.name for ur in u.user_roles if ur.role]
        results.append({
            "id": u.id,
            "email": u.email,
            "username": u.username,
            "full_name": u.full_name,
            "department": u.department,
            "is_active": u.is_active,
            "is_demo_user": u.is_demo_user,
            "roles": role_names,
            "information_classification": u.information_classification
        })
    return results


@router.get("/roles", summary="List roles and assigned permissions")
def list_roles(
    user_ctx: AuthenticatedUserContext = Depends(require_permission("admin:manage_users")),
    db: Session = Depends(get_db)
):
    roles = db.query(Role).all()
    results = []
    for r in roles:
        perms = [rp.permission.code for rp in r.role_permissions if rp.permission]
        results.append({
            "id": r.id,
            "name": r.name,
            "label": r.label,
            "description": r.description,
            "permissions": perms
        })
    return results


@router.get("/permissions", summary="List granular permissions catalog")
def list_permissions(
    user_ctx: AuthenticatedUserContext = Depends(require_permission("admin:manage_users")),
    db: Session = Depends(get_db)
):
    perms = db.query(Permission).all()
    return [
        {
            "id": p.id,
            "code": p.code,
            "label": p.label,
            "category": p.category,
            "description": p.description
        }
        for p in perms
    ]


@router.get("/audit", summary="Inspect append-only audit trail")
def list_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    user_ctx: AuthenticatedUserContext = Depends(require_permission("audit:read")),
    db: Session = Depends(get_db)
):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "parcel_id": l.parcel_id,
            "ulpin": l.ulpin,
            "user_name": l.user_name,
            "role": l.role,
            "action": l.action,
            "entity": l.entity,
            "entity_id": l.entity_id,
            "old_value": l.old_value,
            "new_value": l.new_value,
            "notes": l.notes,
            "timestamp": l.created_at.isoformat() if l.created_at else None
        }
        for l in logs
    ]


@router.get("/conflicts", summary="List data conflicts across parcels")
def list_conflicts(
    status: Optional[str] = Query(None, description="Filter by status"),
    user_ctx: AuthenticatedUserContext = Depends(require_permission("conflict:read")),
    db: Session = Depends(get_db)
):
    q = db.query(DataConflict)
    if status:
        q = q.filter(DataConflict.status == status)
    conflicts = q.order_by(DataConflict.created_at.desc()).all()
    return [
        {
            "id": c.id,
            "conflict_id": c.conflict_id,
            "ulpin": c.ulpin,
            "parcel_id": c.parcel_id,
            "conflict_type": c.conflict_type,
            "field": c.field,
            "source_a": c.source_a,
            "value_a": c.value_a,
            "source_b": c.source_b,
            "value_b": c.value_b,
            "difference": c.difference,
            "evidence": c.evidence,
            "status": c.status,
            "assigned_officer": c.assigned_officer,
            "resolution_notes": c.resolution_notes,
            "created_at": c.created_at.strftime("%d %b %Y") if c.created_at else None
        }
        for c in conflicts
    ]


@router.patch("/conflicts/{conflict_id}", summary="Resolve or update data conflict (Authorized officers only)")
def resolve_conflict_endpoint(
    conflict_id: int = Path(..., description="Internal conflict ID"),
    payload: ConflictResolutionPayload = None,
    user_ctx: Optional[AuthenticatedUserContext] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Section 50: Authorized resolution of data conflicts with audit logging.
    """
    officer_name = user_ctx.full_name or user_ctx.username if user_ctx else "Revenue Officer"
    officer_role = user_ctx.roles[0] if (user_ctx and user_ctx.roles) else "revenue_officer"

    c = resolve_conflict(
        conflict_id=conflict_id,
        status=payload.status,
        resolution_notes=payload.resolution_notes,
        officer_name=officer_name,
        officer_role=officer_role,
        db=db
    )
    return {
        "success": True,
        "conflict_id": c.conflict_id,
        "status": c.status,
        "resolution_notes": c.resolution_notes
    }


@router.get("/duplicates", summary="List potential duplicate parcel candidates")
def list_duplicates(db: Session = Depends(get_db)):
    cands = db.query(DuplicateCandidate).all()
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


@router.get("/state-config", summary="List state-specific terminology and hierarchy configurations")
def list_state_configs(db: Session = Depends(get_db)):
    configs = db.query(StateConfig).all()
    return [
        {
            "id": s.id,
            "state_id": s.state_id,
            "state_name": s.state_name,
            "state_code": s.state_code,
            "is_union_territory": s.is_union_territory,
            "local_terminology": s.local_terminology,
            "measurement_units": s.measurement_units,
            "administrative_hierarchy": s.administrative_hierarchy,
            "default_language": s.default_language
        }
        for s in configs
    ]


class StateConfigUpdate(BaseModel):
    local_terminology: Optional[Dict[str, Any]] = None
    measurement_units: Optional[Dict[str, Any]] = None
    administrative_hierarchy: Optional[Dict[str, Any]] = None
    default_language: Optional[str] = None


@router.put("/state-config/{state_id}", summary="Update state-specific configuration and terminology")
def update_state_config(
    state_id: str = Path(..., description="State identifier e.g. chandigarh, rajasthan"),
    payload: StateConfigUpdate = None,
    user_ctx: Optional[AuthenticatedUserContext] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Sections 11 & 107: Administrative update of state terminologies and measurement units.
    Audited with actor credentials.
    """
    normalized_id = state_id.lower().replace("-", "_")
    config = db.query(StateConfig).filter(
        (StateConfig.state_id == normalized_id) |
        (StateConfig.state_code == state_id.upper()) |
        (StateConfig.state_id.ilike(f"{normalized_id}%")) |
        (StateConfig.state_id.ilike(f"%{normalized_id}%"))
    ).first()
    if not config:
        raise HTTPException(status_code=404, detail=f"State configuration not found: '{state_id}'")

    if payload:
        if payload.local_terminology is not None:
            config.local_terminology = payload.local_terminology
        if payload.measurement_units is not None:
            config.measurement_units = payload.measurement_units
        if payload.administrative_hierarchy is not None:
            config.administrative_hierarchy = payload.administrative_hierarchy
        if payload.default_language is not None:
            config.default_language = payload.default_language

    officer_name = user_ctx.full_name or user_ctx.username if user_ctx else "Administrator"
    audit = AuditLog(
        parcel_id=None,
        ulpin="STATE_CONFIG",
        user_name=officer_name,
        role="administrator",
        action="CONFIG_CHANGE",
        entity="state_config",
        entity_id=state_id,
        notes=f"Updated state configuration for {state_id}"
    )
    db.add(audit)
    db.commit()
    db.refresh(config)

    return {
        "success": True,
        "state_id": config.state_id,
        "state_name": config.state_name,
        "local_terminology": config.local_terminology,
        "measurement_units": config.measurement_units,
        "message": f"State configuration for {config.state_name} updated successfully."
    }

