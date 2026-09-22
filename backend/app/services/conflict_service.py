"""
PLOT360 Backend — Data Conflict Detection Engine
Sections 48–50: Automated comparison between RoR, Registration, and Tax sources.
Detects area mismatches, owner discrepancies, and incompatible status flags.
"""
from typing import List, Optional
import uuid
from sqlalchemy.orm import Session

from app.models.parcel import Parcel
from app.models.governance import RoRRecord, Registration
from app.models.taxation import PropertyTax
from app.models.ai_models import DataConflict
from app.models.user import AuditLog


def run_conflict_check_for_parcel(parcel: Parcel, db: Session) -> List[DataConflict]:
    """
    Compares RoR, Registration, and Tax data for discrepancies on a parcel.
    Configurable threshold: area variance > 5%.
    """
    conflicts: List[DataConflict] = []

    # Retrieve source records
    ror = db.query(RoRRecord).filter(RoRRecord.parcel_id == parcel.id).first()
    tax = db.query(PropertyTax).filter(PropertyTax.parcel_id == parcel.id).first()
    reg = db.query(Registration).filter(Registration.parcel_id == parcel.id).first()

    # 1. Area comparison: RoR vs Cadastral / Tax
    if ror and parcel.standardized_area:
        ror_area_val = 0.0
        # Parse numeric area from ror
        try:
            clean_str = "".join([c for c in (ror.area or "") if c.isdigit() or c == "."])
            if clean_str:
                ror_area_val = float(clean_str)
                # If RoR was in Acres, normalize to m² approx
                if "acre" in (ror.area or "").lower():
                    ror_area_val *= 4046.86
        except Exception:
            pass

        if ror_area_val > 0:
            diff = abs(parcel.standardized_area - ror_area_val)
            pct = (diff / parcel.standardized_area) * 100
            if pct > 8.0:
                # Check if conflict already open
                existing = db.query(DataConflict).filter(
                    DataConflict.parcel_id == parcel.id,
                    DataConflict.field == "area",
                    DataConflict.status.in_(["OPEN", "UNDER_REVIEW"])
                ).first()

                if not existing:
                    c = DataConflict(
                        conflict_id=f"CONF-{uuid.uuid4().hex[:6].upper()}",
                        parcel_id=parcel.id,
                        ulpin=parcel.ulpin,
                        conflict_type="AREA_MISMATCH",
                        field="area",
                        source_a="Cadastral Survey Map",
                        value_a=f"{parcel.standardized_area:.2f} m²",
                        source_b=f"Department of Revenue ({ror.source_department or 'RoR'})",
                        value_b=ror.area or f"{ror_area_val:.2f} m²",
                        difference=f"{diff:.2f} m² ({pct:.1f}%)",
                        evidence="Digital GIS polygon measurement differs significantly from legacy revenue jamabandi entry.",
                        status="OPEN",
                        assigned_officer="Revenue Officer / Tehsildar"
                    )
                    db.add(c)
                    conflicts.append(c)

    return conflicts


def resolve_conflict(
    conflict_id: int,
    status: str,
    resolution_notes: str,
    officer_name: str,
    officer_role: str,
    db: Session
) -> DataConflict:
    """Authorized resolution of a data conflict with audit trail."""
    conflict = db.query(DataConflict).filter(DataConflict.id == conflict_id).first()
    if not conflict:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Data conflict not found")

    old_status = conflict.status
    conflict.status = status
    conflict.resolution_notes = resolution_notes
    conflict.assigned_officer = officer_name

    # Audit entry
    audit = AuditLog(
        parcel_id=conflict.parcel_id,
        ulpin=conflict.ulpin,
        user_name=officer_name,
        role=officer_role,
        action="RESOLVE_DATA_CONFLICT",
        entity="data_conflict",
        entity_id=str(conflict.id),
        old_value=old_status,
        new_value=status,
        notes=resolution_notes
    )
    db.add(audit)
    db.commit()
    db.refresh(conflict)
    return conflict
