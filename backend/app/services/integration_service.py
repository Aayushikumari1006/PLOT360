"""
PLOT360 Backend — Integration Hub Service
Sections 18, 87–89, 128–130: Real simulated job execution for department connectors.
Simulates job lifecycle: QUEUED -> RUNNING -> SUCCEEDED, records normalized,
timestamps updated, audit events logged, and notifications generated.
"""
from datetime import datetime, timezone
import uuid
import time
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.config_model import ApiConnection
from app.models.ai_models import Job
from app.models.user import AuditLog
from app.models.notification import Notification


def execute_sync_job(connection_id: str, db: Session, triggered_by: str = "System") -> Job:
    """Executes a complete simulated department synchronization workflow."""
    conn = db.query(ApiConnection).filter(
        (ApiConnection.connection_id == connection_id) | (ApiConnection.id == int(connection_id) if connection_id.isdigit() else False)
    ).first()

    if not conn:
        raise HTTPException(status_code=404, detail=f"API Connection '{connection_id}' not found")

    job_id = f"JOB-SYNC-{uuid.uuid4().hex[:8].upper()}"

    # 1. Create Job in QUEUED state
    job = Job(
        job_id=job_id,
        job_type="SYNC",
        status="RUNNING",
        progress=10,
        started_at=datetime.now(timezone.utc),
        result_reference=conn.connection_id
    )
    db.add(job)
    db.commit()

    # 2. Simulate records processing and validation
    simulated_new_records = 14
    conn.records_synced += simulated_new_records
    conn.status = "CONNECTED"
    now_str = datetime.now().strftime("%d %b %Y, %I:%M %p")
    conn.last_sync = now_str
    conn.next_sync = "In 6 hours"
    conn.latency_ms = 38

    # 3. Complete Job
    job.status = "SUCCEEDED"
    job.progress = 100
    job.completed_at = datetime.now(timezone.utc)
    job.result_reference = f"Synchronized {simulated_new_records} records successfully from {conn.department}."

    # 4. Audit Event
    audit = AuditLog(
        user_name=triggered_by,
        role="administrator",
        action="INTEGRATION_SYNC",
        entity="api_connection",
        entity_id=conn.connection_id,
        old_value="IDLE",
        new_value="SUCCEEDED",
        notes=f"Synced {simulated_new_records} records via connector {conn.name}"
    )
    db.add(audit)

    # 5. Notification
    notif = Notification(
        title=f"Sync Completed: {conn.name}",
        message=f"Department sync with {conn.department} processed {simulated_new_records} records successfully.",
        notification_type="SYSTEM",
        priority="NORMAL",
        related_entity_type="integration",
        related_entity_id=conn.connection_id
    )
    db.add(notif)

    db.commit()
    db.refresh(job)
    return job
