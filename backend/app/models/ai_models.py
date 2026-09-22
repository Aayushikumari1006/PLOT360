"""
PLOT360 Backend — AI Change Detection, Datasets, Models, Conflicts, Duplicates, and Jobs
Sections 10, 24–36, 48–51, 54, 65, 67, 72–77, 80:
Satellite observations, Siamese U-Net models, explainable change detection,
human review persistence, data conflicts, and duplicate candidates.
"""
from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.utils.geo import get_geometry_column


class AIDataset(Base):
    """AI Training and Evaluation Dataset registry (Section 54)."""
    __tablename__ = "ai_datasets"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(String(50), unique=True, nullable=False, index=True) # e.g. "DS-SENTINEL2-INDIA-V1"
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    version = Column(String(50), default="sentinel2-temporal-v1")
    dataset_version = Column(String(50), default="sentinel2-temporal-v1", index=True)
    manifest_path = Column(String(500), nullable=True)
    dataset_fingerprint = Column(String(100), nullable=True)
    source_root = Column(String(500), nullable=True)
    source_file_count = Column(Integer, default=0)
    raster_count = Column(Integer, default=0)
    valid_count = Column(Integer, default=0)
    invalid_count = Column(Integer, default=0)
    pair_count = Column(Integer, default=0)
    total_locations = Column(Integer, default=0)
    supervised_mask_count = Column(Integer, default=0)
    has_masks = Column(Boolean, default=False)
    has_supervised_masks = Column(Boolean, default=False)
    supervised_training_status = Column(String(50), default="LABEL_BLOCKED") # AVAILABLE / LABEL_BLOCKED
    status = Column(String(50), default="REGISTERED") # REGISTERED / VALIDATED / PARTIAL / INVALID
    meta = Column(JSON, nullable=True)
    created_by = Column(String(100), default="System")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    items = relationship("AIDatasetItem", back_populates="dataset", cascade="all, delete-orphan")
    pairs = relationship("TemporalPair", back_populates="dataset", cascade="all, delete-orphan")


class AIDatasetItem(Base):
    """Individual geographic location pair within a dataset (Section 54)."""
    __tablename__ = "ai_dataset_items"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("ai_datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    location_id = Column(String(100), nullable=False, index=True) # e.g. "chandigarh", "bengaluru_urb03"
    t1_uri = Column(String(500), nullable=False)
    t2_uri = Column(String(500), nullable=False)
    mask_uri = Column(String(500), nullable=True)
    t1_date = Column(String(50), nullable=True)
    t2_date = Column(String(50), nullable=True)
    crs = Column(String(50), nullable=True)
    resolution = Column(Float, nullable=True)
    bands = Column(Integer, nullable=True)
    split = Column(String(20), default="train") # "train" / "val" / "test" (Geographic location split)
    meta = Column(JSON, nullable=True)
    validation_status = Column(String(50), default="VALID") # VALID / MISSING_MASK / CRS_MISMATCH / INVALID

    dataset = relationship("AIDataset", back_populates="items")


class TemporalPair(Base):
    """
    Temporal Pair (T1 2020 and T2 2025) for a geographic region/location.
    Sections 14, 15, 34: Connects T1/T2 observations with metadata and mask status.
    """
    __tablename__ = "temporal_pairs"

    id = Column(Integer, primary_key=True, index=True)
    pair_id = Column(String(100), unique=True, nullable=False, index=True) # e.g. "PAIR_AGR_01"
    dataset_id = Column(Integer, ForeignKey("ai_datasets.id", ondelete="CASCADE"), nullable=True, index=True)
    region_id = Column(String(100), nullable=False, index=True)            # e.g. "AGR_01"
    location_name = Column(String(200), nullable=True)                     # e.g. "Agricultural Region 01"
    t1_observation_id = Column(Integer, ForeignKey("satellite_observations.id", ondelete="SET NULL"), nullable=True)
    t2_observation_id = Column(Integer, ForeignKey("satellite_observations.id", ondelete="SET NULL"), nullable=True)
    t1_year = Column(Integer, default=2020)
    t2_year = Column(Integer, default=2025)
    t1_file = Column(String(500), nullable=True)
    t2_file = Column(String(500), nullable=True)
    source = Column(String(100), default="Google Earth Engine")
    satellite = Column(String(100), default="Sentinel-2")
    collection = Column(String(150), default="Sentinel-2 Surface Reflectance Harmonized")
    crs = Column(String(50), nullable=True)
    validation_status = Column(String(50), default="COMPLETE") # COMPLETE / MISSING_T1 / MISSING_T2 / AMBIGUOUS
    has_mask = Column(Boolean, default=False)
    mask_file = Column(String(500), nullable=True)
    dataset_version = Column(String(50), default="sentinel2-temporal-v1")
    meta = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    dataset = relationship("AIDataset", back_populates="pairs")
    t1_observation = relationship("SatelliteObservation", foreign_keys=[t1_observation_id])
    t2_observation = relationship("SatelliteObservation", foreign_keys=[t2_observation_id])


class AIModel(Base):
    """
    AI Model Registry (Section 65).
    Tracks versions, architectures (Siamese Temporal U-Net), metrics, and active deployment.
    """
    __tablename__ = "ai_models"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(String(50), unique=True, nullable=False, index=True) # e.g. "MOD-SIAMESE-V1"
    model_version = Column(String(50), nullable=False, index=True)
    architecture = Column(String(100), default="Siamese Temporal U-Net")
    dataset_version = Column(String(50), nullable=True)
    training_date = Column(String(50), nullable=True)
    input_bands = Column(Integer, default=6) # 3 (RGB T1) + 3 (RGB T2) or multispectral
    input_resolution = Column(Float, default=10.0)
    patch_size = Column(Integer, default=256)
    metrics = Column(JSON, nullable=True) # { "precision": ..., "recall": ..., "f1": ..., "iou": ... }
    weights_uri = Column(String(500), nullable=True)
    status = Column(String(50), default="TRAINED") # DRAFT / TRAINED / VALIDATED / ACTIVE / RETIRED
    active = Column(Boolean, default=False, index=True) # Only ONE model is ACTIVE
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SatelliteObservation(Base):
    """Raster satellite observation metadata for temporal analysis."""
    __tablename__ = "satellite_observations"

    id = Column(Integer, primary_key=True, index=True)
    observation_id = Column(String(100), unique=True, nullable=True, index=True) # e.g. "OBS_AGR_01_2020"
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="SET NULL"), nullable=True, index=True)
    ulpin = Column(String(50), nullable=True, index=True)
    region_id = Column(String(100), nullable=True, index=True) # e.g. "AGR_01"
    location_name = Column(String(200), nullable=True)

    observation_date = Column(String(50), nullable=False) # e.g. "2020-01-01"
    year = Column(Integer, nullable=True)                  # 2020, 2025
    source = Column(String(100), default="Sentinel-2")
    satellite = Column(String(100), default="Sentinel-2")
    collection = Column(String(150), default="Sentinel-2 Surface Reflectance Harmonized")
    source_path = Column(String(500), nullable=True)
    source_relative_path = Column(String(500), nullable=True)
    file_path = Column(String(500), nullable=True)
    storage_uri = Column(String(500), nullable=True)
    checksum_sha256 = Column(String(100), nullable=True)
    file_size = Column(Integer, nullable=True)

    band_count = Column(Integer, default=6)
    bands = Column(Integer, default=6)
    band_metadata = Column(JSON, nullable=True)
    crs = Column(String(50), default="EPSG:4326")
    resolution_m = Column(Float, default=10.0)
    pixel_size = Column(JSON, nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    nodata_value = Column(Float, nullable=True)
    dtype = Column(String(50), nullable=True)
    transform = Column(JSON, nullable=True)
    bounds = Column(JSON, nullable=True)
    validation_status = Column(String(50), default="VALID")
    validation_messages = Column(JSON, nullable=True)
    processing_version = Column(String(50), default="raw-v1")
    dataset_version = Column(String(50), default="sentinel2-temporal-v1")
    classification = Column(String(50), default="PRODUCTION") # PRODUCTION / TEST / UNRESOLVED
    meta = Column(JSON, nullable=True)
    upload_status = Column(String(30), default="PROCESSED")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    parcel = relationship("Parcel", back_populates="satellite_observations")
    change_events_t1 = relationship("ChangeEvent", foreign_keys="ChangeEvent.observation_a_id", back_populates="observation_t1")
    change_events_t2 = relationship("ChangeEvent", foreign_keys="ChangeEvent.observation_b_id", back_populates="observation_t2")


class ChangeEvent(Base):
    """
    Detected change between two temporal observations.
    Section 72 & 73: Stores change type, polygon geometry, and model version.
    """
    __tablename__ = "change_events"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="SET NULL"), nullable=True, index=True)
    ulpin = Column(String(50), nullable=True, index=True)

    observation_a_id = Column(Integer, ForeignKey("satellite_observations.id", ondelete="SET NULL"), nullable=True)
    observation_b_id = Column(Integer, ForeignKey("satellite_observations.id", ondelete="SET NULL"), nullable=True)

    change_type = Column(String(100), default="POTENTIAL_NEW_CONSTRUCTION") # POTENTIAL_NEW_CONSTRUCTION / POTENTIAL_LAND_USE_CHANGE / OTHER_CONFIGURED_SPATIAL_CHANGE
    confidence = Column(Float, default=0.85)
    change_area_m2 = Column(Float, nullable=True)
    change_percent = Column(Float, nullable=True)
    geometry = get_geometry_column("POLYGON", 4326)
    model_version = Column(String(50), default="Siamese-UNet-v1")
    status = Column(String(50), default="DETECTED") # DETECTED / UNDER_REVIEW / VERIFIED / DISMISSED

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    observation_t1 = relationship("SatelliteObservation", foreign_keys=[observation_a_id], back_populates="change_events_t1")
    observation_t2 = relationship("SatelliteObservation", foreign_keys=[observation_b_id], back_populates="change_events_t2")
    ai_alerts = relationship("AIAlert", back_populates="change_event", cascade="all, delete-orphan")
    reviews = relationship("AIReview", back_populates="change_event", cascade="all, delete-orphan")


class AIAlert(Base):
    """
    Explainable AI-detected alert for a parcel.
    Section 74 & 75: Strictly uses "POTENTIAL CHANGE DETECTED — VERIFICATION REQUIRED".
    """
    __tablename__ = "ai_alerts"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)
    change_event_id = Column(Integer, ForeignKey("change_events.id", ondelete="SET NULL"), nullable=True)

    alert_id = Column(String(50), unique=True, nullable=True, index=True)
    title = Column(String(200), default="Potential Change Detected — Verification Required")
    description = Column(Text, nullable=True)
    category = Column(String(100), default="Potential New Construction")
    confidence = Column(String(50), default="High (89%)")
    flagged_date = Column(String(50), nullable=True)
    review_status = Column(String(50), default="UNDER_REVIEW") # PENDING / UNDER_REVIEW / VERIFIED / REQUIRES_MORE_EVIDENCE
    recommended_step = Column(Text, default="Field officer site verification")
    notes = Column(Text, nullable=True)
    model_version = Column(String(50), default="Siamese-UNet-v1")
    evidence_reference = Column(String(200), nullable=True)

    # Date labels for frontend temporal slider
    date1_label = Column(String(50), default="2020")
    date2_label = Column(String(50), default="2025")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    parcel = relationship("Parcel", back_populates="ai_alerts")
    change_event = relationship("ChangeEvent", back_populates="ai_alerts")


class AIReview(Base):
    """
    Field verification / human review persistent record.
    Section 80 & 81: Closing and reopening the frontend must NOT reset verification status!
    """
    __tablename__ = "ai_reviews"

    id = Column(Integer, primary_key=True, index=True)
    change_event_id = Column(Integer, ForeignKey("change_events.id", ondelete="CASCADE"), nullable=False, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="SET NULL"), nullable=True, index=True)
    ulpin = Column(String(50), nullable=True, index=True)

    reviewer = Column(String(200), nullable=False)
    reviewer_role = Column(String(100), default="revenue_officer")
    status = Column(String(50), nullable=False) # PENDING / UNDER_REVIEW / VERIFIED / REQUIRES_MORE_EVIDENCE
    notes = Column(Text, nullable=True)
    evidence_reference = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    change_event = relationship("ChangeEvent", back_populates="reviews")


class DataConflict(Base):
    """
    Discrepancy detected between multiple department sources (RoR vs Registration vs Tax).
    Section 48–50: Persistent data conflict with difference, evidence, and resolution status.
    """
    __tablename__ = "data_conflicts"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    ulpin = Column(String(50), nullable=False, index=True)

    conflict_id = Column(String(50), unique=True, nullable=False, index=True)
    conflict_type = Column(String(100), nullable=False) # AREA_MISMATCH / OWNER_MISMATCH / DUPLICATE / STALE_RECORD
    field = Column(String(100), nullable=False)        # area / owner / status
    source_a = Column(String(200), nullable=False)     # "Department of Revenue (RoR)"
    value_a = Column(String(300), nullable=False)      # "500 m²"
    source_b = Column(String(200), nullable=False)     # "Municipal Property Tax"
    value_b = Column(String(300), nullable=False)      # "540 m²"
    difference = Column(String(200), nullable=True)    # "+40 m² (+8%)"
    evidence = Column(Text, nullable=True)
    status = Column(String(50), default="OPEN")        # OPEN / UNDER_REVIEW / RESOLVED / REQUIRES_MORE_EVIDENCE
    assigned_officer = Column(String(200), nullable=True)
    resolution_notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    parcel = relationship("Parcel", back_populates="conflicts")


class DuplicateCandidate(Base):
    """
    Candidate duplicate parcel records detected by matching engine (Section 51).
    Never automatically merged.
    """
    __tablename__ = "duplicate_candidates"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    candidate_parcel_id = Column(Integer, ForeignKey("parcels.id", ondelete="CASCADE"), nullable=False, index=True)
    similarity_score = Column(Float, nullable=False)   # 0.0 - 1.0 (e.g. 0.94)
    matched_fields = Column(JSON, nullable=True)       # ["survey_no", "owner_name", "area"]
    reason = Column(Text, nullable=True)
    status = Column(String(50), default="PENDING_REVIEW") # PENDING_REVIEW / CONFIRMED_DUPLICATE / DISMISSED
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Job(Base):
    """
    Asynchronous background job tracking (Section 36 & 67).
    Statuses: QUEUED / RUNNING / SUCCEEDED / FAILED / CANCELLED.
    """
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String(100), unique=True, nullable=False, index=True)
    job_type = Column(String(100), nullable=False) # TRAINING / INGESTION / SYNC / OCR / INFERENCE
    status = Column(String(50), default="QUEUED")  # QUEUED / RUNNING / SUCCEEDED / FAILED / CANCELLED
    progress = Column(Integer, default=0)          # 0 - 100
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error = Column(Text, nullable=True)
    result_reference = Column(String(500), nullable=True)
