"""
PLOT360 Backend — AI Change Detection, Evidence, Dataset, and Field Verification Schemas
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class AIAlertOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    alert_id: Optional[str] = None
    ulpin: str
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    confidence: Optional[str] = None
    flagged_date: Optional[str] = None
    review_status: str
    recommended_step: Optional[str] = None
    notes: Optional[str] = None
    date1_label: Optional[str] = "2020"
    date2_label: Optional[str] = "2025"


class FieldVerificationSubmit(BaseModel):
    status: str # "VERIFIED" / "UNDER_REVIEW" / "REQUIRES_MORE_EVIDENCE"
    notes: str
    evidence_reference: Optional[str] = None


class AIEvidenceOut(BaseModel):
    """
    Evidence viewer contract.
    Section 78: Full explainable response with T1/T2 metadata, cadastral polygon,
    change polygon, planning crosscheck, and persistent review status.
    """
    model_config = ConfigDict(from_attributes=True)

    alert_id: Optional[str] = None
    parcel_id: str
    ulpin: str
    t1_date: str = "2020"
    t2_date: str = "2025"
    t1_source: str = "Sentinel-2 Surface Reflectance (Harmonized)"
    t2_source: str = "Sentinel-2 Surface Reflectance (Harmonized)"
    t1_file: Optional[str] = None
    t2_file: Optional[str] = None
    t1_image_url: Optional[str] = None
    t2_image_url: Optional[str] = None
    cadastral_geometry: Optional[Dict[str, Any]] = None
    change_geometry: Optional[Dict[str, Any]] = None
    change_area_m2: Optional[float] = None
    confidence: str = "High (89%)"
    ai_explanation: str = (
        "POTENTIAL CHANGE DETECTED — VERIFICATION REQUIRED: "
        "Significant spectral difference and structural texture identified between 2020 and 2025 observations. "
        "Spatial intersection shows candidate footprint on agricultural parcel."
    )
    planning_crosscheck: Dict[str, Any] = {}
    review_status: str = "UNDER_REVIEW"
    review_notes: Optional[str] = None
    reviewer: Optional[str] = None
    model_version: str = "Siamese-UNet-v1"
    dataset_version: Optional[str] = "sentinel2-temporal-v1"
    dataset_fingerprint: Optional[str] = None
    region_id: Optional[str] = None
    bands: Optional[List[str]] = None
    raster_resolution: Optional[str] = "10m"
    evidence_provenance: Optional[Dict[str, Any]] = None


class DatasetValidationResult(BaseModel):
    """Dataset validation report (Section 69)."""
    dataset_name: str
    total_locations: int
    valid_pairs: int
    incomplete_pairs: int
    missing_masks: int
    crs_distribution: Dict[str, int]
    bands: List[str]
    has_supervised_masks: bool
    status: str
    recommendations: List[str]


class TemporalPairOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    pair_id: str
    region_id: str
    location_name: Optional[str] = None
    t1_year: int = 2020
    t2_year: int = 2025
    t1_file: Optional[str] = None
    t2_file: Optional[str] = None
    source: str = "Google Earth Engine"
    satellite: str = "Sentinel-2"
    collection: str = "Sentinel-2 Surface Reflectance Harmonized"
    crs: Optional[str] = None
    validation_status: str = "COMPLETE"
    has_mask: bool = False
    dataset_version: str = "sentinel2-temporal-v1"


class SatelliteObservationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    observation_id: Optional[str] = None
    region_id: Optional[str] = None
    location_name: Optional[str] = None
    year: Optional[int] = None
    source: str = "Sentinel-2"
    satellite: str = "Sentinel-2"
    collection: str = "Sentinel-2 Surface Reflectance Harmonized"
    source_relative_path: Optional[str] = None
    checksum_sha256: Optional[str] = None
    file_size: Optional[int] = None
    band_count: int = 6
    band_metadata: Optional[List[str]] = None
    crs: Optional[str] = None
    resolution_m: Optional[float] = 10.0
    pixel_size: Optional[List[Optional[float]]] = None
    width: Optional[int] = None
    height: Optional[int] = None
    validation_status: str = "VALID"
    dataset_version: str = "sentinel2-temporal-v1"
    classification: str = "PRODUCTION"


class AIDatasetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    dataset_id: str
    name: str
    description: Optional[str] = None
    version: str
    dataset_version: Optional[str] = None
    dataset_fingerprint: Optional[str] = None
    status: str
    source_file_count: Optional[int] = 0
    raster_count: Optional[int] = 0
    pair_count: Optional[int] = 0
    total_locations: Optional[int] = 0
    has_masks: bool = False
    has_supervised_masks: bool = False
    supervised_training_status: str = "LABEL_BLOCKED"

