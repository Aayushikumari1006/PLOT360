"""
PLOT360 Backend — Workflow Engine Service
Sections 43 & 44: State progression, transition validation, notification creation, and audit logging.
"""
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.workflow import (
    WorkflowInstance, WorkflowStep, WorkflowEvent, ServiceRequest
)
from app.models.notification import Notification
from app.models.user import AuditLog

DEFAULT_WORKFLOW_STEPS = [
    {"order": 1, "name": "SUBMITTED", "role": "citizen"},
    {"order": 2, "name": "DOCUMENTS_RECEIVED", "role": "revenue_officer"},
    {"order": 3, "name": "VERIFICATION", "role": "revenue_officer"},
    {"order": 4, "name": "DEPARTMENT_REVIEW", "role": "revenue_officer"},
    {"order": 5, "name": "FINAL_PROCESSING", "role": "revenue_officer"},
    {"order": 6, "name": "DECISION", "role": "revenue_officer"},
]


def init_workflow_for_request(sr: ServiceRequest, db: Session) -> WorkflowInstance:
    """Initializes workflow instance with all sequential steps."""
    wf = WorkflowInstance(
        entity_type="service_request",
        entity_id=sr.request_id,
        parcel_id=sr.parcel_id,
        ulpin=sr.ulpin,
        current_state="SUBMITTED",
        is_completed=False,
    )
    db.add(wf)
    db.flush()

    for s in DEFAULT_WORKFLOW_STEPS:
        step = WorkflowStep(
            instance_id=wf.id,
            step_name=s["name"],
            step_order=s["order"],
            required_role=s["role"],
            status="COMPLETED" if s["order"] == 1 else "PENDING",
            completed_at=datetime.now(timezone.utc) if s["order"] == 1 else None,
            comments="Initial submission" if s["order"] == 1 else None
        )
        db.add(step)

    # Initial Event
    evt = WorkflowEvent(
        instance_id=wf.id,
        from_state="NONE",
        to_state="SUBMITTED",
        actor_name=sr.applicant_name,
        actor_role="citizen",
        comment="Citizen submitted request"
    )
    db.add(evt)
    db.flush()
    return wf


def transition_workflow(
    instance_id: int,
    to_state: str,
    actor_id: Optional[int],
    actor_name: str,
    actor_role: str,
    comment: Optional[str],
    db: Session
) -> WorkflowInstance:
    """Executes validated state transition."""
    wf = db.query(WorkflowInstance).filter(WorkflowInstance.id == instance_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow instance not found")

    from_state = wf.current_state
    wf.current_state = to_state

    if to_state in ["DECISION", "APPROVED", "REJECTED"]:
        wf.is_completed = True
        wf.final_decision = to_state

    # Update step record
    step = db.query(WorkflowStep).filter(
        WorkflowStep.instance_id == wf.id,
        WorkflowStep.step_name == to_state
    ).first()
    if step:
        step.status = "COMPLETED"
        step.completed_by_id = actor_id
        step.completed_by_name = actor_name
        step.completed_at = datetime.now(timezone.utc)
        step.comments = comment

    # Log event
    evt = WorkflowEvent(
        instance_id=wf.id,
        from_state=from_state,
        to_state=to_state,
        actor_id=actor_id,
        actor_name=actor_name,
        actor_role=actor_role,
        comment=comment or f"State transitioned to {to_state}"
    )
    db.add(evt)

    # Update ServiceRequest if entity_type is service_request
    if wf.entity_type == "service_request":
        sr = db.query(ServiceRequest).filter(ServiceRequest.request_id == wf.entity_id).first()
        if sr:
            sr.status = to_state

            # Step order calculation
            for idx, s in enumerate(DEFAULT_WORKFLOW_STEPS, 1):
                if s["name"] == to_state:
                    sr.current_step = idx
                    break

            # Create notification
            notif = Notification(
                user_id=sr.citizen_id,
                title=f"Service Request Status Updated: {to_state}",
                message=f"Your request {sr.request_id} for parcel {sr.ulpin or 'record'} has moved to {to_state}.",
                notification_type="WORKFLOW",
                priority="NORMAL",
                related_ulpin=sr.ulpin,
                related_entity_type="service_request",
                related_entity_id=sr.request_id
            )
            db.add(notif)

    # Create audit entry
    audit = AuditLog(
        parcel_id=wf.parcel_id,
        ulpin=wf.ulpin,
        user_id=actor_id,
        user_name=actor_name,
        role=actor_role,
        action="WORKFLOW_TRANSITION",
        entity="workflow_instance",
        entity_id=str(wf.id),
        old_value=from_state,
        new_value=to_state,
        notes=comment
    )
    db.add(audit)
    db.commit()
    db.refresh(wf)
    return wf
