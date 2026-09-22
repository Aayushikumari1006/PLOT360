"""
PLOT360 Backend — Planning, Zoning, Building Permissions, Restrictions ORM Models
Sections 27–32 & 36: Master plan, zoning, sanctioned building permissions, and spatial restrictions.
"""
from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.utils.geo import get_geometry_column


class PlanningRecord(Base):
    """Master plan, land use, and zoning metadata for a parcel."""
    __tablename__ = "planning_records"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    master_plan_year = Column(String(20), nullable=True)   # e.g. "Master Plan 2031"
    land_use = Column(String(100), nullable=True)          # Residential, Commercial, Agricultural, Industrial, Institutional, Mixed Use
    zoning = Column(String(100), nullable=True)            # Residential (R-2), Commercial (C-1)
    zoning_code = Column(String(20), nullable=True)
    floor_area_ratio = Column(Float, nullable=True)        # FAR / FSI
    ground_coverage = Column(Float, nullable=True)
    max_height_m = Column(Float, nullable=True)
    setback_front_m = Column(Float, nullable=True)
    setback_rear_m = Column(Float, nullable=True)
    setback_side_m = Column(Float, nullable=True)
    development_status = Column(String(100), default="Developed")
    notes = Column(Text, nullable=True)
    source = Column(String(100), default="DEMO_SAMPLE_DATA")
    department = Column(String(200), default="Town & Country Planning Department")
    last_updated = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    parcel = relationship("Parcel", back_populates="planning_records")


class BuildingPermission(Base):
    """
    Building sanction / approval record.
    Section 31: application_id, permission_id, status (NOT_APPLIED, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, QUERY_CORRECTION_REQUIRED), floors, source.
    """
    __tablename__ = "building_permissions"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    application_id = Column(String(100), nullable=True)
    permission_id = Column(String(100), nullable=True, unique=True, index=True)
    status = Column(String(50), default="APPROVED")        # NOT_APPLIED / SUBMITTED / UNDER_REVIEW / APPROVED / REJECTED / QUERY_CORRECTION_REQUIRED
    approval_date = Column(String(50), nullable=True)
    floors = Column(String(50), nullable=True)             # "G + 2"
    number_of_floors = Column(Integer, nullable=True, default=2)
    approved_area = Column(String(50), nullable=True)
    building_information = Column(Text, nullable=True)
    validity = Column(String(50), nullable=True)
    architect_ref = Column(String(200), nullable=True)
    source = Column(String(200), default="Municipal Corporation / Town Planning Authority")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    parcel = relationship("Parcel", back_populates="building_permissions")


class Restriction(Base):
    """
    Spatial restriction layers: environmental, flood-prone, heritage, defense/restricted.
    Section 36: Includes spatial geometry where applicable.
    """
    __tablename__ = "restrictions"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    restriction_type = Column(String(100), nullable=False) # Environmental / Protected / Flood / Heritage / Restricted
    title = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    authority = Column(String(200), nullable=True)
    geometry = get_geometry_column("POLYGON", 4326)
    is_active = Column(Boolean, default=True)
    source = Column(String(100), default="DEMO_SAMPLE_DATA")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    parcel = relationship("Parcel", back_populates="restrictions")
