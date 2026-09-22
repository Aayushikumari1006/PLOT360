"""
PLOT360 Backend — Planning, Building Sanctions & Restrictions Schemas
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class PlanningOut(BaseModel):
    id: int
    ulpin: str
    master_plan_year: Optional[str] = None
    land_use: Optional[str] = None
    zoning: Optional[str] = None
    zoning_code: Optional[str] = None
    floor_area_ratio: Optional[float] = None
    ground_coverage: Optional[float] = None
    max_height_m: Optional[float] = None
    development_status: Optional[str] = None
    department: Optional[str] = None
    last_updated: Optional[str] = None

    class Config:
        from_attributes = True


class BuildingPermissionOut(BaseModel):
    id: int
    ulpin: str
    permission_id: Optional[str] = None
    status: str
    approval_date: Optional[str] = None
    floors: Optional[str] = None
    number_of_floors: Optional[int] = None
    approved_area: Optional[str] = None
    building_information: Optional[str] = None
    source: Optional[str] = None

    class Config:
        from_attributes = True


class RestrictionOut(BaseModel):
    id: int
    ulpin: str
    restriction_type: str
    title: Optional[str] = None
    description: Optional[str] = None
    authority: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True


class PlanningCrossCheckOut(BaseModel):
    """
    Planning Cross-Check result.
    Section 32: Compares parcel land_use vs zoning vs building_permission vs restrictions.
    """
    parcel_id: str
    ulpin: str
    land_use: Optional[str] = None
    zoning: Optional[str] = None
    building_permission_status: Optional[str] = None
    building_permission_id: Optional[str] = None
    active_restrictions: List[str] = []
    crosscheck_status: str  # "COMPLIANT" / "POTENTIAL_MISMATCH" / "UNDER_REVIEW"
    status: Optional[str] = None  # Compatibility alias matching crosscheck_status
    explanation: str
