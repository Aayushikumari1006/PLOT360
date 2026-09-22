"""
PLOT360 Backend — Demo / Presentation Schemas
Section 66 & 94: Pydantic models for demo session initialization, progression, and state context.
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class DemoTargetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    location_id: str
    location_name: str
    ulpin: str
    parcel_id: str
    narrative: str
    key_features: List[str]


class DemoStepOut(BaseModel):
    step_number: int
    step_name: str
    title: str
    domain: str
    description: str
    guidance: str
    data_endpoint: str
    key_takeaway: str


class DemoSessionCreate(BaseModel):
    target_ulpin: Optional[str] = "IN-PB-CHD-0001027"
    location_id: Optional[str] = "chandigarh"


class DemoSessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    session_id: str
    target_ulpin: str
    target_parcel_id: Optional[str]
    location_id: str
    location_name: str
    current_step: int
    total_steps: int
    status: str
    is_completed: bool
    current_step_details: Optional[DemoStepOut] = None
    all_steps: List[DemoStepOut] = []
    suggested_targets: List[DemoTargetOut] = []
    context_data: Optional[Dict[str, Any]] = None


class StudyAreaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    study_area_id: str
    display_name: str
    state_or_ut: str
    district: Optional[str] = None
    urban_rural_type: str
    latitude: float
    longitude: float
    bounding_box: List[float]  # [minx, miny, maxx, maxy]
    sentinel_coverage: bool
    sentinel_roi_id: Optional[str] = None
    satellite_evidence_status: str
    number_of_demo_plots: int
    available_modules: List[str]
    demo_status: str
    data_type: str = "DEMO/SAMPLE"


class SampleUlpinOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sample_ulpin: str
    parcel_id: str
    display_location: str
    state_or_ut: str
    study_area: str
    study_area_id: str
    parcel_type: str
    urban_rural: str
    available_modules: List[str]
    satellite_availability: bool
    satellite_status: str
    demo_scenario: str
    study_status: str  # FULLY_STUDIED / PARTIALLY_STUDIED
    demo_flag: bool = True


class DemoPlotOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    parcel_id: str
    ulpin: str
    study_area_id: str
    location_name: str
    state_or_ut: str
    urban_rural: str
    area_display: str
    land_use: str
    zoning: str
    centroid_lat: float
    centroid_lng: float
    polygon: List[Dict[str, float]]
    demo_scenario: str
    study_status: str
    satellite_availability: bool
    satellite_status: str
    available_modules: List[str]
    is_demo_data: bool = True


class DemoLocationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    location_id: str
    id: Optional[str] = None
    name: str
    state: str
    jurisdiction: str
    lat: float
    lng: float
    urban_rural: str
    parcel_count: int
    sample_ulpins: List[str]
    description: str
    is_demo: bool = True
    sentinel_available: bool = False


class DemoParcelDetailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    parcel_id: str
    ulpin: str
    location: str
    location_id: str
    state: str
    district: Optional[str] = None
    tehsil: Optional[str] = None
    urban_rural: str
    original_area: Optional[str] = None
    standardized_area: Optional[str] = None
    land_use: Optional[str] = None
    zoning: Optional[str] = None
    scenario: str
    scenario_display: str
    source_status: str = "Source Verified"
    sync_status: str = "Source Verified"
    verification_status: str
    last_updated: Optional[str] = None
    sentinel_status: str
    sentinel_available: bool = False
    centroid_lat: float
    centroid_lng: float
    polygon: List[Dict[str, float]]
    owner: Optional[Dict[str, Any]] = None
    building_permission: Optional[Dict[str, Any]] = None
    encumbrance: Optional[Dict[str, Any]] = None
    property_tax: Optional[Dict[str, Any]] = None
    utilities: Optional[Dict[str, Any]] = None
    restrictions: Optional[Dict[str, Any]] = None
    ai_alert: Optional[Dict[str, Any]] = None
    is_demo_data: bool = True
    audit_notes: Optional[str] = None


class DemoSearchResultOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    type: str = "Demo Parcel"
    parcel_id: str
    ulpin: str
    location: str
    state: str
    urban_rural: str
    scenario: str
    scenario_display: str
    description: str
    is_demo: bool = True


