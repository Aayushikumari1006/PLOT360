"""
PLOT360 Backend — Integration Hub Router
Sections 87–89 & 128–130: Department connectors, synchronization triggers, and health monitoring.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.config_model import ApiConnection
from app.models.ai_models import Job
from app.schemas.integration import ApiConnectionOut
from app.services.integration_service import execute_sync_job
from app.dependencies import get_current_user_optional, AuthenticatedUserContext

router = APIRouter(prefix="/integrations", tags=["Integration Hub"])


@router.get("", response_model=List[ApiConnectionOut], summary="List all departmental API connections")
def list_connections(db: Session = Depends(get_db)):
    connections = db.query(ApiConnection).order_by(ApiConnection.id.asc()).all()
    return connections


@router.get("/sources", response_model=List[ApiConnectionOut], summary="Alias for listing connections")
def list_sources(db: Session = Depends(get_db)):
    return db.query(ApiConnection).order_by(ApiConnection.id.asc()).all()


@router.get("/jobs", summary="List integration sync jobs")
@router.get("/jobs/recent", summary="List recent integration sync jobs")
def list_recent_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.job_type == "SYNC").order_by(Job.created_at.desc()).limit(15).all()
    return [
        {
            "job_id": j.job_id,
            "status": j.status,
            "progress": j.progress,
            "created_at": j.created_at.isoformat() if j.created_at else None,
            "completed_at": j.completed_at.isoformat() if j.completed_at else None,
            "result": j.result_reference
        }
        for j in jobs
    ]


@router.get("/{connection_id}", response_model=ApiConnectionOut, summary="Get connector details")
def get_connection(
    connection_id: str = Path(..., description="Connection ID e.g. REV-01"),
    db: Session = Depends(get_db)
):
    conn = db.query(ApiConnection).filter(
        (ApiConnection.connection_id == connection_id) |
        (ApiConnection.id == int(connection_id) if connection_id.isdigit() else False)
    ).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    return conn


@router.post("/{connection_id}/sync", summary="Trigger synchronization job for a department connector")
def trigger_sync(
    connection_id: str = Path(..., description="Connection ID e.g. REV-01"),
    user_ctx: Optional[AuthenticatedUserContext] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Section 130: Simulated sync executes job lifecycle, updates records count,
    timestamps, creates audit log, and creates notification.
    """
    actor_name = user_ctx.full_name or user_ctx.username if user_ctx else "Officer (Manual)"
    job = execute_sync_job(connection_id, db, triggered_by=actor_name)
    return {
        "success": True,
        "job_id": job.job_id,
        "status": job.status,
        "message": job.result_reference
    }
