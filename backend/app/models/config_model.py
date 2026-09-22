"""
PLOT360 Backend — State Configuration, Field Mappings, and Integration Sources
Sections 19, 84–89: Configurable state metadata, UT support (Chandigarh),
field mapping engine, and Integration Hub connectors.
"""
from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, ForeignKey, Text, JSON
from sqlalchemy.sql import func
from app.database import Base


class StateConfig(Base):
    """
    Multi-state configuration model.
    Section 84: Configures terminology, units, hierarchy, workflows without hardcoding.
    """
    __tablename__ = "state_configs"

    id = Column(Integer, primary_key=True, index=True)
    state_id = Column(String(50), unique=True, nullable=False, index=True) # "punjab", "chandigarh_ut", "rajasthan", "kerala"
    state_name = Column(String(100), nullable=False)
    state_code = Column(String(10), nullable=False)
    is_union_territory = Column(Boolean, default=False)
    capital = Column(String(100), nullable=True)

    # Configurable Terminology e.g. { "ror": "Jamabandi", "sub_district": "Tehsil", "plot": "Khasra" }
    local_terminology = Column(JSON, nullable=True)
    # Configurable Units e.g. ["Acre", "Kanal", "Marla", "Bigha", "sq_m"]
    measurement_units = Column(JSON, nullable=True)
    # Administrative Hierarchy e.g. ["State", "Division", "District", "Sub-Division", "Tehsil", "Village"]
    administrative_hierarchy = Column(JSON, nullable=True)
    # Default Language
    default_language = Column(String(10), default="en")
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class StateFieldMapping(Base):
    """
    Field transformation mapping from department schema to Common Land Model.
    Section 85: STATE DATA -> STATE MAPPING -> COMMON LAND MODEL -> PLOT360.
    """
    __tablename__ = "state_field_mappings"

    id = Column(Integer, primary_key=True, index=True)
    mapping_id = Column(String(100), nullable=True, index=True)  # Section 22: Persistent mapping identifier
    state = Column(String(100), nullable=False, index=True)
    source_department = Column(String(200), nullable=False)
    source_field = Column(String(100), nullable=False)
    common_field = Column(String(100), nullable=False)
    field_type = Column(String(50), nullable=True, default="String")
    meaning = Column(String(255), nullable=True)
    transformation = Column(String(200), nullable=True) # Direct, Multiply, ParseDate, Lookup
    validation_rule = Column(String(200), nullable=True)
    version = Column(String(20), default="1.0")
    effective_from = Column(String(50), nullable=True, default="2020-01-01")
    effective_to = Column(String(50), nullable=True, default="9999-12-31")
    created_by = Column(String(100), nullable=True, default="System Administrator")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class DataSource(Base):
    """Dataset metadata and freshness inventory (Section 86)."""
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)
    dataset_name = Column(String(200), nullable=False)
    source_department = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)      # Cadastral, RoR, Registration, Spatial, Satellite
    coverage = Column(String(200), nullable=True)
    format = Column(String(50), nullable=True)          # PostGIS, REST API, WFS, GeoTIFF
    version = Column(String(50), default="1.0")
    crs = Column(String(50), default="EPSG:4326")
    quality_status = Column(String(50), default="VERIFIED") # VERIFIED / STALE / CONFLICT / MISSING
    records_count = Column(Integer, default=0)
    last_updated = Column(String(50), nullable=True)
    last_sync = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ApiConnection(Base):
    """
    Department integration connectors for Integration Hub.
    Sections 87–89: Tracks sync status, records synced, errors, latency, and simulated status.
    """
    __tablename__ = "api_connections"

    id = Column(Integer, primary_key=True, index=True)
    connection_id = Column(String(50), unique=True, nullable=False, index=True) # e.g. "REV-01", "REG-01"
    name = Column(String(200), nullable=False)
    department = Column(String(200), nullable=False)
    version = Column(String(20), default="v2.4")
    status = Column(String(50), default="CONNECTED")    # CONNECTED / SIMULATED / WARNING / ERROR
    is_simulated = Column(Boolean, default=True)        # Clearly marked as simulated
    last_sync = Column(String(50), nullable=True)
    next_sync = Column(String(50), nullable=True)
    records_synced = Column(Integer, default=0)
    errors_count = Column(Integer, default=0)
    auth_status = Column(String(50), default="AUTHENTICATED")
    latency_ms = Column(Integer, default=45)
    endpoint_url = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
