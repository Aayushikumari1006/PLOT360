"""
PLOT360 Backend — Common Pydantic Schemas
Standardized API error contract (Section 39 & 106) and spatial GeoJSON responses.
"""
from typing import Optional, Any, Dict, List
from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """Standardized API error contract across all endpoints."""
    error: str = Field(..., description="Error classification code")
    message: str = Field(..., description="Human-readable error description")
    request_id: Optional[str] = Field(None, description="Unique trace request ID")
    details: Optional[Any] = Field(None, description="Optional diagnostic details")


class GeoJSONGeometry(BaseModel):
    type: str = "Polygon"
    coordinates: List[Any]


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: Optional[Dict[str, Any]] = None
    properties: Dict[str, Any] = Field(default_factory=dict)


class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature] = Field(default_factory=list)
