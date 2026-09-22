"""
PLOT360 Backend — Localization Router
Sections 69, 84 & 129: Multi-state terminology mappings, language configs,
and standardized unit conversion endpoints.
"""
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query
from pydantic import BaseModel

from app.services.multilingual import (
    SUPPORTED_LANGUAGES,
    STATE_TERMINOLOGY_MAP,
    UNIT_CONVERSION_FACTORS,
    convert_to_standard_sq_m,
    get_state_terminology
)

router = APIRouter(prefix="/localization", tags=["Localization & Terminology"])


class UnitConversionRequest(BaseModel):
    value: float
    unit: str


@router.get("/config", summary="Get supported languages and regional jurisdiction configs")
def get_localization_config():
    """
    Section 69: Lists supported languages, default language, and active jurisdiction mappings.
    """
    return {
        "supported_languages": SUPPORTED_LANGUAGES,
        "default_language": "en",
        "jurisdictions_supported": list(STATE_TERMINOLOGY_MAP.keys()),
        "supported_units": list(UNIT_CONVERSION_FACTORS.keys())
    }


@router.get("/terminology", summary="Get state-specific revenue and land administration terminology")
def get_terminology(
    location_id: Optional[str] = Query("chandigarh", description="Location ID e.g. chandigarh, jaipur, pune, varanasi, kochi")
):
    """
    Section 85: Returns localized terms (e.g. Jamabandi vs 7/12 vs Khatauni; Bigha vs Kanal vs Guntha).
    """
    return get_state_terminology(location_id)


@router.post("/convert-unit", summary="Convert land measurement to standardized square meters")
def convert_unit_endpoint(payload: UnitConversionRequest):
    """
    Section 10: Standardized SI area conversion without overwriting original measurement.
    """
    return convert_to_standard_sq_m(payload.value, payload.unit)
