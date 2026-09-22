"""
PLOT360 Backend — Parcel ORM Model (Central Entity)
Sections 9 & 4: Parcel-Centric Land Stack Model with ULPIN linkage,
original/standard area preservation, and dual PostGIS/Shapely spatial support.
"""
from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.utils.geo import get_geometry_column


class Jurisdiction(Base):
    """Administrative jurisdiction entity."""
    __tablename__ = "jurisdictions"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    state = Column(String(100), nullable=False)
    authority = Column(String(200), nullable=True)
    is_active = Column(Boolean, default=True)


class Location(Base):
    """Geographic location / center context entity."""
    __tablename__ = "locations"

    id = Column(String(50), primary_key=True, index=True)  # e.g. "chandigarh", "jaipur"
    name = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    jurisdiction = Column(String(100), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    default_zoom = Column(Integer, default=16)
    default_parcel_id = Column(String(50), nullable=True)


class Parcel(Base):
    """Canonical Cadastral Parcel table — central anchor of PLOT360."""
    __tablename__ = "parcels"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(String(50), unique=True, nullable=False, index=True)
    ulpin = Column(String(50), unique=True, nullable=False, index=True)

    # Spatial geometry (EPSG:4326) & centroid
    geometry = get_geometry_column("POLYGON", 4326)
    centroid_lat = Column(Float, nullable=True)
    centroid_lng = Column(Float, nullable=True)

    # Administrative & Location Hierarchy
    location_id = Column(String(50), nullable=True, index=True)
    state = Column(String(100), nullable=True, index=True)
    district = Column(String(100), nullable=True, index=True)
    sub_district = Column(String(100), nullable=True)
    administrative_unit = Column(String(100), nullable=True)
    tehsil = Column(String(100), nullable=True)
    village = Column(String(100), nullable=True, index=True)
    town = Column(String(100), nullable=True)
    ward = Column(String(100), nullable=True, index=True)
    locality = Column(String(200), nullable=True)
    location = Column(String(200), nullable=True)
    rural_urban = Column(String(20), nullable=True, default="Urban")  # Rural / Urban

    # Cadastral Identifiers
    survey_no = Column(String(100), nullable=True, index=True)
    khasra_no = Column(String(100), nullable=True, index=True)
    plot_no = Column(String(100), nullable=True, index=True)
    khata_no = Column(String(100), nullable=True, index=True)

    # Area Preservation (CRITICAL: Never overwrite original source value)
    original_area = Column(Float, nullable=True)
    original_unit = Column(String(30), nullable=True)          # Acre, Bigha, Kanal, Guntha, sq_m
    standardized_area = Column(Float, nullable=True)          # Standardized metric (sq_m)
    standardized_unit = Column(String(20), default="m²")
    conversion_method = Column(String(100), nullable=True)
    area_display = Column(String(50), nullable=True)           # "1,248.50 m²"
    original_area_display = Column(String(50), nullable=True)    # "0.31 Acre"

    # Governance & Planning Classifications
    land_use = Column(String(100), nullable=True)
    zoning = Column(String(100), nullable=True)
    jurisdiction = Column(String(100), nullable=True)
    status = Column(String(50), default="Verified")            # Verified / Flagged / Protected / Pending
    sync_status = Column(String(30), default="Synced")
    data_freshness = Column(String(50), default="Current")     # Current / Stale / Verified

    # Security & Information Classification
    information_classification = Column(String(50), default="PUBLIC")  # PUBLIC / AUTHORIZED_DEPARTMENT / RESTRICTED / AUDIT_ADMIN

    # Provenance
    source = Column(String(100), default="DEMO_SAMPLE_DATA")
    source_record_id = Column(String(100), nullable=True)
    source_timestamp = Column(String(50), nullable=True)
    is_demo_data = Column(Boolean, default=True)
    state_extensions = Column(JSON, nullable=True)  # Section 21: Flexible state-specific field extensions

    last_updated = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Sub-domain Relationships
    ownership_records = relationship("Ownership", back_populates="parcel", cascade="all, delete-orphan")
    ror_records = relationship("RoRRecord", back_populates="parcel", cascade="all, delete-orphan")
    registrations = relationship("Registration", back_populates="parcel", cascade="all, delete-orphan")
    encumbrances = relationship("Encumbrance", back_populates="parcel", cascade="all, delete-orphan")
    mortgages = relationship("Mortgage", back_populates="parcel", cascade="all, delete-orphan")
    disputes = relationship("Dispute", back_populates="parcel", cascade="all, delete-orphan")
    planning_records = relationship("PlanningRecord", back_populates="parcel", cascade="all, delete-orphan")
    building_permissions = relationship("BuildingPermission", back_populates="parcel", cascade="all, delete-orphan")
    restrictions = relationship("Restriction", back_populates="parcel", cascade="all, delete-orphan")
    tax_records = relationship("PropertyTax", back_populates="parcel", cascade="all, delete-orphan")
    utility_records = relationship("UtilityRecord", back_populates="parcel", cascade="all, delete-orphan")
    ai_alerts = relationship("AIAlert", back_populates="parcel", cascade="all, delete-orphan")
    satellite_observations = relationship("SatelliteObservation", back_populates="parcel", cascade="all, delete-orphan")
    conflicts = relationship("DataConflict", back_populates="parcel", cascade="all, delete-orphan")
    service_requests = relationship("ServiceRequest", back_populates="parcel", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="parcel", cascade="all, delete-orphan")
    valuation_references = relationship("ValuationReference", back_populates="parcel", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="parcel", cascade="all, delete-orphan")
