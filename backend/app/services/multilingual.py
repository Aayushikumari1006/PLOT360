"""
PLOT360 Backend — Multilingual & Multi-State Terminology Engine
Sections 69, 84 & 85: Multi-state terminology aliases, localized strings (English, Hindi, Punjabi,
Rajasthani, Marathi, Malayalam), unit conversion formulas, and Bhashini provider boundary.
"""
from typing import Dict, Any, List, Optional

# Supported System Languages
SUPPORTED_LANGUAGES = [
    {"code": "en", "name": "English", "is_default": True},
    {"code": "hi", "name": "Hindi (हिंदी)", "is_default": False},
    {"code": "pa", "name": "Punjabi (ਪੰਜਾਬੀ)", "is_default": False},
    {"code": "raj", "name": "Rajasthani (राजस्थानी)", "is_default": False},
    {"code": "mr", "name": "Marathi (मराठी)", "is_default": False},
    {"code": "ml", "name": "Malayalam (മലയാളം)", "is_default": False}
]

# Canonical Terminology Mappings by State / UT Context
STATE_TERMINOLOGY_MAP = {
    "chandigarh": {
        "jurisdiction_type": "Union Territory",
        "state_name": "Chandigarh",
        "ror_name": "Jamabandi (Record of Rights)",
        "survey_identifier": "Plot / Sector Number",
        "cadastral_term": "Sector Cadastre",
        "sub_district_term": "Sub-Division",
        "village_ward_term": "Sector / Urban Village",
        "owner_term": "Allottee / Owner",
        "mutation_term": "Transfer of Ownership",
        "preferred_unit": "sq_m",
        "local_units": ["sq_m", "sq_yards", "kanal", "marla"]
    },
    "punjab": {
        "jurisdiction_type": "State",
        "state_name": "Punjab",
        "ror_name": "Jamabandi",
        "survey_identifier": "Khasra Number",
        "cadastral_term": "Hadbast Cadastre",
        "sub_district_term": "Tehsil",
        "village_ward_term": "Mauza / Pind",
        "owner_term": "Khewatar / Malik",
        "mutation_term": "Intiqal",
        "preferred_unit": "kanal",
        "local_units": ["kanal", "marla", "acre", "bigha"]
    },
    "rajasthan": {
        "jurisdiction_type": "State",
        "state_name": "Rajasthan",
        "ror_name": "Jamabandi (Apna Khata)",
        "survey_identifier": "Khasra Number",
        "cadastral_term": "Rajasthani Revenue Map",
        "sub_district_term": "Tehsil",
        "village_ward_term": "Gram / Revenue Village",
        "owner_term": "Khatedar",
        "mutation_term": "Namantaran",
        "preferred_unit": "bigha",
        "local_units": ["bigha", "biswa", "sq_m"]
    },
    "uttar_pradesh": {
        "jurisdiction_type": "State",
        "state_name": "Uttar Pradesh",
        "ror_name": "Khatauni (Bhulekh)",
        "survey_identifier": "Gata / Khasra Number",
        "cadastral_term": "Shajra Map",
        "sub_district_term": "Tehsil",
        "village_ward_term": "Gram Panchayat",
        "owner_term": "Bhumidhar",
        "mutation_term": "Dakhil Kharij",
        "preferred_unit": "bigha",
        "local_units": ["bigha", "biswa", "acre", "sq_m"]
    },
    "maharashtra": {
        "jurisdiction_type": "State",
        "state_name": "Maharashtra",
        "ror_name": "7/12 Extract (Saat-Baara) & 8-A",
        "survey_identifier": "Gat / Survey Number",
        "cadastral_term": "Village Cadastral Map",
        "sub_district_term": "Taluka",
        "village_ward_term": "Gaon / Ward",
        "owner_term": "Bhogwatadar / Kabjedar",
        "mutation_term": "Ferfar (Hakka Nond)",
        "preferred_unit": "guntha",
        "local_units": ["guntha", "acre", "hectare", "sq_m"]
    },
    "kerala": {
        "jurisdiction_type": "State",
        "state_name": "Kerala",
        "ror_name": "Thandaper Extract & BTR",
        "survey_identifier": "Re-survey Number",
        "cadastral_term": "Village FMB (Field Measurement Book)",
        "sub_district_term": "Taluk",
        "village_ward_term": "Desom / Village",
        "owner_term": "Pattadar",
        "mutation_term": "Pokkuvaravu",
        "preferred_unit": "cent",
        "local_units": ["cent", "are", "hectare", "sq_m"]
    },
    "delhi": {
        "jurisdiction_type": "National Capital Territory",
        "state_name": "Delhi",
        "ror_name": "Khasra Girdawari / Jamabandi",
        "survey_identifier": "Khasra / Plot Number",
        "cadastral_term": "Revenue / DDA Layout Plan",
        "sub_district_term": "Sub-Division",
        "village_ward_term": "Revenue Village / Urban Ward",
        "owner_term": "Bhumidhar / Allottee",
        "mutation_term": "Dakhil Kharij / Mutation",
        "preferred_unit": "sq_m",
        "local_units": ["sq_m", "sq_yards", "bigha", "biswa"]
    },
    "karnataka": {
        "jurisdiction_type": "State",
        "state_name": "Karnataka",
        "ror_name": "RTC (Record of Rights, Tenancy and Crops / Pahani)",
        "survey_identifier": "Survey / Hissa Number",
        "cadastral_term": "Bhoomi Cadastral Map",
        "sub_district_term": "Taluk",
        "village_ward_term": "Hobli / Village",
        "owner_term": "Khatedar",
        "mutation_term": "Mutation (Namantaran)",
        "preferred_unit": "acre",
        "local_units": ["acre", "guntha", "sq_m", "sq_feet"]
    },
    "gujarat": {
        "jurisdiction_type": "State",
        "state_name": "Gujarat",
        "ror_name": "AnyRoR 7/12 & 8-A Extract",
        "survey_identifier": "Survey / Re-survey Number",
        "cadastral_term": "Village Cadastral Shajra",
        "sub_district_term": "Taluka",
        "village_ward_term": "Gaon / Seem",
        "owner_term": "Khatedar / Account Holder",
        "mutation_term": "Hakka Nond (Ferfar)",
        "preferred_unit": "bigha",
        "local_units": ["bigha", "guntha", "sq_m", "acre"]
    },
    "tamil_nadu": {
        "jurisdiction_type": "State",
        "state_name": "Tamil Nadu",
        "ror_name": "Patta / Chitta Extract",
        "survey_identifier": "Survey / Sub-division Number",
        "cadastral_term": "Town Survey / FMB Map",
        "sub_district_term": "Taluk",
        "village_ward_term": "Revenue Village / Town Ward",
        "owner_term": "Pattadar",
        "mutation_term": "Patta Transfer",
        "preferred_unit": "sq_feet",
        "local_units": ["sq_feet", "cent", "ground", "acre"]
    },
    "telangana": {
        "jurisdiction_type": "State",
        "state_name": "Telangana",
        "ror_name": "Dharani Pattadar Passbook & Pahani",
        "survey_identifier": "Survey / Khasra Number",
        "cadastral_term": "Village Cadastral TiPPAN",
        "sub_district_term": "Mandal",
        "village_ward_term": "Gram / Revenue Village",
        "owner_term": "Pattadar",
        "mutation_term": "Dharani Mutation",
        "preferred_unit": "acre",
        "local_units": ["acre", "guntas", "sq_yards", "sq_m"]
    },
    "himachal_pradesh": {
        "jurisdiction_type": "State",
        "state_name": "Himachal Pradesh",
        "ror_name": "Jamabandi (HimBhoomi)",
        "survey_identifier": "Khasra Number",
        "cadastral_term": "Latha / Shajra Kishtwar",
        "sub_district_term": "Tehsil",
        "village_ward_term": "Mohal / Revenue Village",
        "owner_term": "Malik / Kashtkar",
        "mutation_term": "Intiqal",
        "preferred_unit": "bigha",
        "local_units": ["bigha", "biswa", "biswansi", "kanal"]
    }
}

# Canonical aliases for land measurement units
CANONICAL_UNIT_ALIASES = {
    "sq_m": "sq_m",
    "sqm": "sq_m",
    "m²": "sq_m",
    "m2": "sq_m",
    "square_meter": "sq_m",
    "square_meters": "sq_m",
    "sq_meter": "sq_m",
    "sq_yards": "sq_yards",
    "sq_yard": "sq_yards",
    "sqyards": "sq_yards",
    "yard": "sq_yards",
    "yards": "sq_yards",
    "sq_feet": "sq_feet",
    "sq_foot": "sq_feet",
    "sq_ft": "sq_feet",
    "sqft": "sq_feet",
    "sq feet": "sq_feet",
    "square_foot": "sq_feet",
    "square_feet": "sq_feet",
    "sq. ft.": "sq_feet",
    "sq.ft": "sq_feet",
    "acre": "acre",
    "acres": "acre",
    "hectare": "hectare",
    "hectares": "hectare",
    "bigha": "bigha",
    "bighas": "bigha",
    "biswa": "biswa",
    "biswas": "biswa",
    "kanal": "kanal",
    "kanals": "kanal",
    "marla": "marla",
    "marlas": "marla",
    "guntha": "guntha",
    "gunthas": "guntha",
    "gunta": "guntha",
    "guntas": "guntha",
    "cent": "cent",
    "cents": "cent"
}

# Standard National Baseline Unit Conversion Factors to Square Meters (sq_m)
UNIT_CONVERSION_FACTORS = {
    "sq_m": 1.0,
    "m²": 1.0,
    "square_meter": 1.0,
    "sq_yards": 0.836127,
    "sq_feet": 0.092903,
    "acre": 4046.8564224,
    "hectare": 10000.0,
    "bigha": 2529.285,          # Standard Pucca Bigha (Punjab/Haryana/UP baseline)
    "biswa": 126.464,           # 1/20th of a Bigha
    "kanal": 505.857,           # Standard Kanal (Punjab/Haryana/HP/J&K: 1/8th of an acre)
    "marla": 25.29285,          # 1/20th of a Kanal
    "guntha": 101.1714,         # Maharashtra/Karnataka/Gujarat: 1/40th of an acre
    "cent": 40.4686             # South India (Kerala/TN): 1/100th of an acre
}

# State-Specific Land Revenue Unit Overrides
STATE_SPECIFIC_UNIT_FACTORS = {
    "himachal_pradesh": {
        "bigha": (809.37, "Himachal Pradesh Land Revenue Manual (1 Bigha = 809.37 m² / 4 Kanals)"),
        "biswa": (40.4685, "Himachal Pradesh Land Revenue Manual (1 Biswa = 40.4685 m²)")
    },
    "punjab": {
        "bigha": (2529.285, "Punjab Land Administration Manual (1 Pucca Bigha = 2529.285 m²)"),
        "kanal": (505.857, "Punjab Standard Revenue Measure (1 Kanal = 505.857 m² / 20 Marlas)"),
        "marla": (25.29285, "Punjab Standard Revenue Measure (1 Marla = 25.29285 m²)")
    },
    "chandigarh": {
        "bigha": (2529.285, "Chandigarh Administration Revenue Rule (1 Pucca Bigha = 2529.285 m²)"),
        "kanal": (505.857, "Chandigarh Administration Revenue Rule (1 Kanal = 505.857 m²)"),
        "marla": (25.29285, "Chandigarh Administration Revenue Rule (1 Marla = 25.29285 m²)")
    },
    "haryana": {
        "bigha": (2529.285, "Haryana Land Records Manual (1 Pucca Bigha = 2529.285 m²)"),
        "kanal": (505.857, "Haryana Standard Revenue Measure (1 Kanal = 505.857 m²)"),
        "marla": (25.29285, "Haryana Standard Revenue Measure (1 Marla = 25.29285 m²)")
    },
    "rajasthan": {
        "bigha": (2529.285, "Rajasthan Land Revenue Code (Pucca Bigha = 2529.285 m²)"),
        "biswa": (126.464, "Rajasthan Land Revenue Code (1 Biswa = 126.464 m²)")
    },
    "uttar_pradesh": {
        "bigha": (2529.285, "UP Revenue Code (Standard Pucca Bigha = 2529.285 m²)"),
        "biswa": (126.464, "UP Revenue Code (1 Biswa = 126.464 m²)")
    },
    "maharashtra": {
        "guntha": (101.1714, "Maharashtra Land Revenue Code (1 Guntha = 101.1714 m² / 1089 sq ft)"),
        "bigha": (2529.285, "Standard Pucca Bigha Baseline")
    },
    "karnataka": {
        "guntha": (101.1714, "Karnataka Land Revenue Act (1 Guntha = 101.1714 m²)"),
        "cent": (40.4686, "Karnataka Standard Cent (1 Cent = 40.4686 m²)")
    },
    "tamil_nadu": {
        "cent": (40.4686, "Tamil Nadu Revenue Standards (1 Cent = 40.4686 m² / 435.6 sq ft)")
    },
    "kerala": {
        "cent": (40.4686, "Kerala Land Revenue Standards (1 Cent = 40.4686 m²)")
    }
}


def convert_to_standard_sq_m(value: float, unit: str, state_or_location: Optional[str] = None) -> Dict[str, Any]:
    """
    Section 10 & PS-Req 21: Convert original measurements to standard SI square meters without destroying original value.
    Preserves original value, original unit, standardized value, and configured conversion basis.
    Supports state-specific revenue manuals (e.g. HP Bigha vs Punjab Pucca Bigha).
    """
    if value < 0:
        raise ValueError("Negative measurement value is invalid: land area cannot be negative.")

    normalized_input = unit.lower().strip()
    canonical_unit = CANONICAL_UNIT_ALIASES.get(normalized_input)
    if not canonical_unit:
        # Check if replacing space/hyphen works
        clean_key = normalized_input.replace(" ", "_").replace("-", "_")
        canonical_unit = CANONICAL_UNIT_ALIASES.get(clean_key)

    if not canonical_unit:
        supported = ", ".join(["m²", "acre", "kanal", "marla", "bigha", "sq ft", "guntha", "cent", "hectare"])
        raise ValueError(f"Unsupported land measurement unit '{unit}'. Configured units include: {supported}.")

    # Resolve state from location if provided
    state_key = None
    if state_or_location:
        clean_loc = state_or_location.lower().strip().replace(" ", "_")
        state_key = LOCATION_TO_STATE_KEY.get(clean_loc, clean_loc)

    # Check for state-specific override
    factor = None
    method = None
    is_state_specific = False

    if state_key and state_key in STATE_SPECIFIC_UNIT_FACTORS:
        overrides = STATE_SPECIFIC_UNIT_FACTORS[state_key]
        if canonical_unit in overrides:
            factor, method = overrides[canonical_unit]
            is_state_specific = True

    if factor is None:
        factor = UNIT_CONVERSION_FACTORS.get(canonical_unit, 1.0)
        if canonical_unit == "sq_m":
            method = "Identical metric base unit (1 m² = 1 m²)"
        else:
            method = f"Multiplied by national conversion constant {factor} per National Geodetic Standards"

    std_val = round(value * factor, 4)

    return {
        "original_value": value,
        "original_unit": unit,
        "standardized_value": std_val,
        "standardized_unit": "sq_m",
        "conversion_factor": factor,
        "method": method,
        "configured_state": state_key or "national_baseline",
        "is_state_specific": is_state_specific
    }


LOCATION_TO_STATE_KEY = {
    "chandigarh": "chandigarh",
    "delhi": "delhi",
    "bengaluru": "karnataka",
    "mumbai": "maharashtra",
    "pune": "maharashtra",
    "jaipur": "rajasthan",
    "ahmedabad": "gujarat",
    "anand": "gujarat",
    "lucknow": "uttar_pradesh",
    "varanasi": "uttar_pradesh",
    "hyderabad": "telangana",
    "chennai": "tamil_nadu",
    "shimla": "himachal_pradesh",
    "solan": "himachal_pradesh",
    "kochi": "kerala",
}

def get_state_terminology(location_id: Optional[str] = "chandigarh") -> Dict[str, Any]:
    """Retrieve terminology profile for state/UT."""
    clean_loc = (location_id or "chandigarh").lower().strip().replace(" ", "_")
    target_key = LOCATION_TO_STATE_KEY.get(clean_loc, clean_loc)
    return STATE_TERMINOLOGY_MAP.get(target_key, STATE_TERMINOLOGY_MAP.get(clean_loc, STATE_TERMINOLOGY_MAP["chandigarh"]))


# Bhashini Translation Provider Boundary (Future Integration Stub)
def translate_text_bhashini_boundary(
    text: str, source_lang: str = "en", target_lang: str = "hi"
) -> Dict[str, Any]:
    """
    Section 69: Bhashini API boundary stub.
    Provides deterministic local fallback without external API dependency.
    """
    return {
        "source_text": text,
        "source_language": source_lang,
        "target_language": target_lang,
        "translated_text": text,  # Fallback to source
        "provider": "BHASHINI_INTEGRATION_BOUNDARY",
        "status": "LOCAL_FALLBACK_ACTIVE",
        "is_simulated": True
    }
