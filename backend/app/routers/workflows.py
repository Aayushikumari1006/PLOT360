"""
PLOT360 Backend — Workflows Router
Sections 43 & 44: Workflow progression, step transitions, and officer authorization checks.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.workflow import WorkflowInstance, WorkflowStep, WorkflowEvent
from app.dependencies import get_current_user, require_permission, AuthenticatedUserContext
from app.services.workflow_service import transition_workflow

router = APIRouter(prefix="/workflows", tags=["Workflows"])


class TransitionPayload(BaseModel):
    to_state: str
    comment: Optional[str] = None


@router.get("/{instance_id}", summary="Get workflow instance state and steps")
def get_workflow(
    instance_id: int = Path(..., description="Workflow instance ID"),
    db: Session = Depends(get_db)
):
    wf = db.query(WorkflowInstance).filter(WorkflowInstance.id == instance_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow instance not found")

    steps = db.query(WorkflowStep).filter(
        WorkflowStep.instance_id == wf.id
    ).order_by(WorkflowStep.step_order.asc()).all()

    return {
        "id": wf.id,
        "entity_type": wf.entity_type,
        "entity_id": wf.entity_id,
        "ulpin": wf.ulpin,
        "current_state": wf.current_state,
        "is_completed": wf.is_completed,
        "final_decision": wf.final_decision,
        "steps": [
            {
                "id": s.id,
                "step_name": s.step_name,
                "step_order": s.step_order,
                "required_role": s.required_role,
                "status": s.status,
                "completed_by": s.completed_by_name,
                "completed_at": s.completed_at.isoformat() if s.completed_at else None,
                "comments": s.comments
            }
            for s in steps
        ]
    }


@router.post("/{instance_id}/transition", summary="Advance workflow step (Officer authorization required)")
def transition_step(
    payload: TransitionPayload,
    instance_id: int = Path(..., description="Workflow instance ID"),
    user_ctx: AuthenticatedUserContext = Depends(require_permission("workflow:transition")),
    db: Session = Depends(get_db)
):
    """
    Section 44: Only authorized roles can advance department workflow steps.
    Citizens cannot advance officer steps.
    """
    wf = transition_workflow(
        instance_id=instance_id,
        to_state=payload.to_state,
        actor_id=user_ctx.id,
        actor_name=user_ctx.full_name or user_ctx.username,
        actor_role=user_ctx.roles[0] if user_ctx.roles else "officer",
        comment=payload.comment,
        db=db
    )
    return {
        "success": True,
        "workflow_id": wf.id,
        "current_state": wf.current_state,
        "is_completed": wf.is_completed
    }


@router.get("/{instance_id}/history", summary="Get audit event history for a workflow")
def get_workflow_history(
    instance_id: int = Path(..., description="Workflow instance ID"),
    db: Session = Depends(get_db)
):
    events = db.query(WorkflowEvent).filter(
        WorkflowEvent.instance_id == instance_id
    ).order_by(WorkflowEvent.created_at.asc()).all()

    return [
        {
            "id": e.id,
            "from_state": e.from_state,
            "to_state": e.to_state,
            "actor_name": e.actor_name,
            "actor_role": e.actor_role,
            "comment": e.comment,
            "timestamp": e.created_at.isoformat() if e.created_at else None
        }
        for e in events
    ]
