"""
PLOT360 Backend — Unified Global Search Router
Sections 14 & 40: Multi-entity search across ULPIN, parcel_id, survey/khasra/plot numbers,
owner names, locations, application numbers, and service requests.
"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.parcel import Parcel
from app.models.ownership import Ownership
from app.models.governance import Registration
from app.models.workflow import ServiceRequest, Application
from app.models.planning import BuildingPermission

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("", summary="Unified multi-attribute global search")
def search(
    q: str = Query(..., min_length=1, description="Search query string"),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    query_str = q.strip()
    pattern = f"%{query_str}%"
    results: List[Dict[str, Any]] = []

    # 1. Search Parcels (ULPIN, parcel_id, survey, khasra, plot, location)
    parcels = db.query(Parcel).filter(
        (Parcel.ulpin.ilike(pattern)) |
        (Parcel.parcel_id.ilike(pattern)) |
        (Parcel.survey_no.ilike(pattern)) |
        (Parcel.khasra_no.ilike(pattern)) |
        (Parcel.plot_no.ilike(pattern)) |
        (Parcel.khata_no.ilike(pattern)) |
        (Parcel.location.ilike(pattern)) |
        (Parcel.village.ilike(pattern)) |
        (Parcel.ward.ilike(pattern))
    ).limit(limit).all()

    for p in parcels:
        results.append({
            "type": "Parcel",
            "id": p.parcel_id,
            "title": f"Parcel {p.parcel_id} — {p.ulpin}",
            "subtitle": f"{p.location or p.district or 'Cadastral Parcel'} • Survey No: {p.survey_no or 'N/A'}",
            "ulpin": p.ulpin,
            "location": p.location,
            "status": p.status or "Verified",
            "metadata": {"rural_urban": p.rural_urban, "land_use": p.land_use}
        })

    # 2. Search Owners
    owners = db.query(Ownership).filter(
        Ownership.owner_name.ilike(pattern), Ownership.is_current == True
    ).limit(5).all()

    for o in owners:
        results.append({
            "type": "Person/Ownership",
            "id": f"OWN-{o.id}",
            "title": o.owner_name,
            "subtitle": f"Rights Holder ({o.share_percent or '100%'}) on {o.ulpin}",
            "ulpin": o.ulpin,
            "status": "Verified" if o.verified else "Unverified"
        })

    # 3. Search Service Requests
    srs = db.query(ServiceRequest).filter(
        (ServiceRequest.request_id.ilike(pattern)) |
        (ServiceRequest.applicant_name.ilike(pattern)) |
        (ServiceRequest.service_type.ilike(pattern))
    ).limit(5).all()

    for s in srs:
        results.append({
            "type": "Service Request",
            "id": s.request_id,
            "title": f"{s.request_id} — {s.service_type.replace('_', ' ').title()}",
            "subtitle": f"Applicant: {s.applicant_name} • Dept: {s.department}",
            "ulpin": s.ulpin,
            "status": s.status
        })

    # 4. Search Registrations
    regs = db.query(Registration).filter(
        Registration.registration_id.ilike(pattern)
    ).limit(5).all()

    for r in regs:
        results.append({
            "type": "Registration",
            "id": r.registration_id,
            "title": f"{r.transaction_type} ({r.registration_id})",
            "subtitle": f"Status: {r.status} • Parcel: {r.ulpin}",
            "ulpin": r.ulpin,
            "status": r.status
        })

    # 5. Search Building Permissions
    bps = db.query(BuildingPermission).filter(
        BuildingPermission.permission_id.ilike(pattern)
    ).limit(5).all()

    for b in bps:
        results.append({
            "type": "Planning",
            "id": b.permission_id,
            "title": f"Building Sanction {b.permission_id}",
            "subtitle": f"Status: {b.status} • Parcel: {b.ulpin}",
            "ulpin": b.ulpin,
            "status": b.status
        })

    return results[:limit]
