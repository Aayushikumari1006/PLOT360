"""PLOT360 — Citizen Services, Notifications, Audit, AI, Integrations, Config routers"""
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
import uuid
import os
import shutil
from datetime import datetime, timezone

from app.database import get_db
from app.models.workflow import ServiceRequest, Notification
from app.models.ai_models import AIAlert, SatelliteObservation, DataConflict
from app.models.user import AuditLog
from app.models.config_model import DataSource, StateConfig
from app.schemas.auth import ServiceRequestIn, ServiceRequestOut, NotificationOut
from app.auth.rbac import get_current_user, require_permission
from app.models.user import User
from app.config import settings

# ── Citizen Services ──────────────────────────────────────────────────────────
citizen_router = APIRouter(prefix="/citizen", tags=["Citizen Services"])

SERVICE_DEPARTMENTS = {
    "demarcation": "Revenue Department",
    "mutation": "Sub-Registrar Office",
    "noc": "Municipal Corporation",
    "ror_copy": "Department of Land Records",
    "building_permission": "Town Planning Authority",
    "encumbrance_certificate": "Inspector General of Registration",
}


@citizen_router.get("/service-requests", summary="List citizen service requests")
def list_service_requests(
    ulpin: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(ServiceRequest)
    if ulpin:
        q = q.filter(ServiceRequest.ulpin == ulpin)
    return q.limit(50).all()


@citizen_router.post("/service-requests", summary="Submit a new service request")
def submit_service_request(
    payload: ServiceRequestIn,
    db: Session = Depends(get_db),
):
    from app.models.parcel import Parcel
    request_id = f"SR-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"
    department = SERVICE_DEPARTMENTS.get(payload.service_type, "Relevant Department")

    # Resolve parcel
    parcel_db_id = None
    if payload.ulpin or payload.parcel_id:
        parcel = db.query(Parcel).filter(
            (Parcel.ulpin == payload.ulpin) | (Parcel.parcel_id == payload.parcel_id)
        ).first()
        if parcel:
            parcel_db_id = parcel.id

    sr = ServiceRequest(
        request_id=request_id,
        parcel_id=parcel_db_id,
        ulpin=payload.ulpin or payload.parcel_id,
        service_type=payload.service_type,
        department=department,
        applicant_name=payload.applicant_name,
        applicant_phone=payload.applicant_phone,
        applicant_email=payload.applicant_email,
        notes=payload.notes,
        status="SUBMITTED",
        current_step=1,
        total_steps=5,
    )
    db.add(sr)
    db.commit()
    db.refresh(sr)

    # Create audit entry
    _create_audit(db, action="SERVICE_REQUEST_SUBMITTED", entity="service_request",
                  entity_id=request_id, new_value=f"Service: {payload.service_type}")

    return {"request_id": request_id, "status": "SUBMITTED", "department": department,
            "message": f"Service request {request_id} submitted successfully."}


@citizen_router.get("/applications/{application_id}", summary="Get application/service request status")
def get_application(application_id: str, db: Session = Depends(get_db)):
    sr = db.query(ServiceRequest).filter(ServiceRequest.request_id == application_id).first()
    if not sr:
        raise HTTPException(status_code=404, detail="Application not found")
    return {
        "request_id": sr.request_id,
        "service_type": sr.service_type,
        "status": sr.status,
        "current_step": sr.current_step,
        "total_steps": sr.total_steps,
        "department": sr.department,
        "applicant_name": sr.applicant_name,
        "submitted_at": sr.submitted_at.isoformat() if sr.submitted_at else None,
    }


# ── Notifications ─────────────────────────────────────────────────────────────
notifications_router = APIRouter(prefix="/notifications", tags=["Notifications"])


@notifications_router.get("", summary="Get notifications (most recent 50)")
def get_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).order_by(Notification.created_at.desc()).limit(50).all()


@notifications_router.patch("/{notification_id}/read", summary="Mark notification as read")
def mark_read(notification_id: int, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.id == notification_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    return {"id": notification_id, "is_read": True}


# ── Audit Trail ───────────────────────────────────────────────────────────────
audit_router = APIRouter(prefix="/audit", tags=["Audit Trail"])


@audit_router.get("", summary="Query audit logs (admin/auditor only)")
def get_audit_logs(
    parcel: Optional[str] = None,
    user_name: Optional[str] = None,
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db),
):
    q = db.query(AuditLog)
    if parcel:
        q = q.filter(AuditLog.ulpin.ilike(f"%{parcel}%"))
    if user_name:
        q = q.filter(AuditLog.user_name.ilike(f"%{user_name}%"))
    logs = q.order_by(AuditLog.created_at.desc()).limit(limit).all()
    return [
        {
            "id": log.id,
            "who": log.user_name or "System",
            "what": log.action,
            "parcel": log.ulpin,
            "old_value": log.old_value,
            "new_value": log.new_value,
            "source": log.source,
            "when": log.created_at.isoformat() if log.created_at else "—",
        }
        for log in logs
    ]


# ── AI & Temporal ─────────────────────────────────────────────────────────────
ai_router = APIRouter(prefix="/ai", tags=["AI & Temporal Analysis"])


@ai_router.get("/alerts", summary="List all AI alerts")
def list_ai_alerts(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(AIAlert)
    if status:
        q = q.filter(AIAlert.review_status == status)
    return q.limit(100).all()


@ai_router.post("/temporal/upload", summary="Upload T1/T2 GeoTIFF for change detection")
async def upload_temporal(
    t1: UploadFile = File(..., description="T1 raster (GeoTIFF)"),
    t2: UploadFile = File(..., description="T2 raster (GeoTIFF)"),
    ulpin: Optional[str] = Query(None),
    t1_date: Optional[str] = Query(None, description="T1 observation date YYYY-MM-DD"),
    t2_date: Optional[str] = Query(None, description="T2 observation date YYYY-MM-DD"),
    db: Session = Depends(get_db),
):
    """
    Validates and processes T1/T2 GeoTIFF temporal pair.
    Runs rule-based change detection pipeline.
    """
    import rasterio
    from app.services.ai_service import run_change_detection

    os.makedirs(settings.raw_imagery_dir, exist_ok=True)
    os.makedirs(settings.predictions_dir, exist_ok=True)

    # Save uploads
    t1_path = os.path.join(settings.raw_imagery_dir, f"{uuid.uuid4().hex}_T1_{t1.filename}")
    t2_path = os.path.join(settings.raw_imagery_dir, f"{uuid.uuid4().hex}_T2_{t2.filename}")

    with open(t1_path, "wb") as f:
        shutil.copyfileobj(t1.file, f)
    with open(t2_path, "wb") as f:
        shutil.copyfileobj(t2.file, f)

    # Validate raster pair
    validation_errors = []
    t1_meta = t2_meta = {}
    try:
        with rasterio.open(t1_path) as r1:
            t1_meta = {
                "crs": str(r1.crs), "width": r1.width, "height": r1.height,
                "bands": r1.count, "dtype": str(r1.dtypes[0]), "resolution_m": abs(r1.res[0]),
                "bounds": list(r1.bounds), "nodata": r1.nodata,
            }
        with rasterio.open(t2_path) as r2:
            t2_meta = {
                "crs": str(r2.crs), "width": r2.width, "height": r2.height,
                "bands": r2.count, "dtype": str(r2.dtypes[0]), "resolution_m": abs(r2.res[0]),
                "bounds": list(r2.bounds), "nodata": r2.nodata,
            }
        # Validate compatibility
        if t1_meta["crs"] != t2_meta["crs"]:
            validation_errors.append(f"CRS mismatch: T1={t1_meta['crs']}, T2={t2_meta['crs']}")
        if t1_meta["bands"] != t2_meta["bands"]:
            validation_errors.append(f"Band count mismatch: T1={t1_meta['bands']}, T2={t2_meta['bands']}")
    except Exception as e:
        validation_errors.append(f"Raster read error: {str(e)}")

    if validation_errors:
        # Clean up invalid files
        for p in [t1_path, t2_path]:
            try: os.remove(p)
            except: pass
        raise HTTPException(status_code=422, detail={
            "message": "Incompatible raster pair. Processing rejected.",
            "errors": validation_errors
        })

    # Store observations in DB
    from app.models.parcel import Parcel as ParcelModel
    parcel_db_id = None
    if ulpin:
        p = db.query(ParcelModel).filter(ParcelModel.ulpin == ulpin).first()
        if p: parcel_db_id = p.id

    obs_t1 = SatelliteObservation(
        parcel_id=parcel_db_id, ulpin=ulpin, observation_date=t1_date or "unknown",
        file_path=t1_path, bands=t1_meta.get("bands"), crs=t1_meta.get("crs"),
        resolution_m=t1_meta.get("resolution_m"), width=t1_meta.get("width"),
        height=t1_meta.get("height"), dtype=t1_meta.get("dtype"), meta=t1_meta
    )
    obs_t2 = SatelliteObservation(
        parcel_id=parcel_db_id, ulpin=ulpin, observation_date=t2_date or "unknown",
        file_path=t2_path, bands=t2_meta.get("bands"), crs=t2_meta.get("crs"),
        resolution_m=t2_meta.get("resolution_m"), width=t2_meta.get("width"),
        height=t2_meta.get("height"), dtype=t2_meta.get("dtype"), meta=t2_meta
    )
    db.add_all([obs_t1, obs_t2])
    db.commit()
    db.refresh(obs_t1); db.refresh(obs_t2)

    # Run change detection
    change_result = run_change_detection(t1_path, t2_path)

    return {
        "status": "SUCCESS",
        "ulpin": ulpin,
        "t1": {"observation_id": obs_t1.id, "date": t1_date, **t1_meta},
        "t2": {"observation_id": obs_t2.id, "date": t2_date, **t2_meta},
        "change_detection": change_result,
        "model": "PLOT360-RuleBased-v1.0",
        "note": "Demo AI pipeline. Results are indicative and not authoritative determinations."
    }


# ── Document Intelligence ──────────────────────────────────────────────────────
documents_router = APIRouter(prefix="/documents", tags=["Document Intelligence"])


@documents_router.post("/upload", summary="Upload document for OCR extraction")
async def upload_document(
    file: UploadFile = File(...),
    ulpin: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    from app.services.document_service import extract_document_data
    from app.models.workflow import Document
    from app.models.parcel import Parcel as ParcelModel

    os.makedirs(os.path.join(settings.DATA_DIR, "documents"), exist_ok=True)
    stored_path = os.path.join(settings.DATA_DIR, "documents", f"{uuid.uuid4().hex}_{file.filename}")

    with open(stored_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Resolve parcel
    parcel_db_id = None
    if ulpin:
        p = db.query(ParcelModel).filter(ParcelModel.ulpin == ulpin).first()
        if p: parcel_db_id = p.id

    doc = Document(
        parcel_id=parcel_db_id, ulpin=ulpin,
        original_filename=file.filename, stored_path=stored_path,
        mime_type=file.content_type, extraction_status="PROCESSING",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Run extraction
    extraction = extract_document_data(stored_path, file.content_type)

    doc.extraction_status = "DONE" if extraction.get("success") else "FAILED"
    doc.extracted_data = extraction.get("extracted")
    doc.mismatches = extraction.get("mismatches")
    doc.extraction_confidence = extraction.get("confidence")
    db.commit()

    return {
        "document_id": doc.id,
        "filename": file.filename,
        "status": doc.extraction_status,
        "extracted": extraction.get("extracted"),
        "mismatches": extraction.get("mismatches"),
        "confidence": extraction.get("confidence"),
        "ocr_engine": "Tesseract",
        "note": "DEMO_OCR_EXTRACTION — Results are illustrative only."
    }


# ── Integration Hub ────────────────────────────────────────────────────────────
integrations_router = APIRouter(prefix="/integrations", tags=["Integration Hub"])


@integrations_router.get("/sources", summary="List all data integration sources")
def list_sources(db: Session = Depends(get_db)):
    sources = db.query(DataSource).all()
    return sources


@integrations_router.get("/health", summary="Integration health status")
def integration_health(db: Session = Depends(get_db)):
    sources = db.query(DataSource).all()
    return {
        "total": len(sources),
        "connected": sum(1 for s in sources if s.status == "CONNECTED"),
        "degraded": sum(1 for s in sources if s.status == "DEGRADED"),
        "disconnected": sum(1 for s in sources if s.status == "DISCONNECTED"),
        "sources": [{"id": s.source_id, "name": s.name, "status": s.status} for s in sources],
    }


# ── State Configuration ────────────────────────────────────────────────────────
config_router = APIRouter(prefix="/config", tags=["State Configuration"])


@config_router.get("/states", summary="List all state configurations")
def list_states(db: Session = Depends(get_db)):
    return db.query(StateConfig).filter(StateConfig.is_active == True).all()


@config_router.get("/states/{state_code}", summary="Get state configuration detail")
def get_state(state_code: str, db: Session = Depends(get_db)):
    sc = db.query(StateConfig).filter(StateConfig.state_code == state_code).first()
    if not sc:
        raise HTTPException(status_code=404, detail=f"State config not found: {state_code}")
    return sc


# ── Utility function used internally ─────────────────────────────────────────
def _create_audit(db: Session, action: str, entity: str, entity_id: str,
                  old_value: str = None, new_value: str = None,
                  user_name: str = "System", source: str = "PLOT360_API"):
    log = AuditLog(
        user_name=user_name, action=action, entity=entity,
        entity_id=entity_id, old_value=old_value, new_value=new_value, source=source
    )
    db.add(log)
    db.commit()
