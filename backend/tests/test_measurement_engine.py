"""
PLOT360 Backend — Measurement Engine & State-Specific Conversion Tests
Section 7 & PS-Req 21:
Validates preservation of original area value + unit + standardized metric,
state/location specific conversions (e.g. HP Bigha vs Punjab Bigha),
unsupported units, missing conversion configuration, decimal precision,
zero and negative invalid values.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# 1. Same source unit (m² / sq_m)
def test_same_source_unit_conversion():
    payload = {"value": 1248.5, "unit": "m²"}
    r = client.post("/api/v1/localization/convert-unit", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["original_value"] == 1248.5
    assert data["original_unit"] == "m²"
    assert data["standardized_value"] == 1248.5
    assert data["standardized_unit"] == "sq_m"
    assert data["conversion_factor"] == 1.0


# 2. Supported national conversions (Acre, Kanal, Marla, sq ft)
@pytest.mark.parametrize("unit, value, expected_min, expected_max", [
    ("acre", 1.0, 4046.8, 4046.9),
    ("kanal", 2.0, 1011.7, 1011.8),
    ("marla", 10.0, 252.9, 253.0),
    ("sq ft", 1000.0, 92.8, 93.0),
    ("sqft", 1000.0, 92.8, 93.0),
    ("hectare", 1.0, 10000.0, 10000.0),
])
def test_supported_national_conversions(unit, value, expected_min, expected_max):
    r = client.post("/api/v1/localization/convert-unit", json={"value": value, "unit": unit})
    assert r.status_code == 200
    data = r.json()
    assert data["original_value"] == value
    assert data["original_unit"] == unit
    assert expected_min <= data["standardized_value"] <= expected_max
    assert data["standardized_unit"] == "sq_m"


# 3. State-specific conversion (Himachal Pradesh Bigha vs Punjab/Chandigarh Pucca Bigha)
def test_state_specific_conversion_hp_vs_punjab():
    # In Himachal Pradesh (e.g. location 'shimla' or state 'himachal_pradesh'), 1 Bigha = 809.37 m²
    r_hp = client.post(
        "/api/v1/localization/convert-unit",
        json={"value": 1.0, "unit": "bigha", "state_or_location": "himachal_pradesh"}
    )
    assert r_hp.status_code == 200
    hp_data = r_hp.json()
    assert hp_data["standardized_value"] == 809.37
    assert hp_data["is_state_specific"] is True
    assert "Himachal Pradesh" in hp_data["method"]

    # In Punjab / Chandigarh, 1 Pucca Bigha = 2529.285 m²
    r_pb = client.post(
        "/api/v1/localization/convert-unit",
        json={"value": 1.0, "unit": "bigha", "state_or_location": "punjab"}
    )
    assert r_pb.status_code == 200
    pb_data = r_pb.json()
    assert pb_data["standardized_value"] == 2529.285
    assert pb_data["is_state_specific"] is True
    assert "Punjab" in pb_data["method"]

    # Using city location e.g. 'shimla'
    r_shimla = client.post(
        "/api/v1/localization/convert-unit",
        json={"value": 2.0, "unit": "bigha", "state_or_location": "shimla"}
    )
    assert r_shimla.status_code == 200
    assert r_shimla.json()["standardized_value"] == 1618.74


# 4. Unsupported unit handling
def test_unsupported_unit():
    r = client.post(
        "/api/v1/localization/convert-unit",
        json={"value": 100.0, "unit": "furlong_unknown_unit"}
    )
    assert r.status_code == 422
    data = r.json()
    msg = data.get("message") or str(data.get("detail", ""))
    assert "Unsupported land measurement unit" in msg


# 5. Missing state conversion configuration (falls back to national baseline honestly)
def test_missing_state_conversion_falls_back_honestly():
    # If state has no specific override for a unit (e.g. Acre in Kerala), uses national standard factor
    r = client.post(
        "/api/v1/localization/convert-unit",
        json={"value": 1.0, "unit": "acre", "state_or_location": "kerala"}
    )
    assert r.status_code == 200
    data = r.json()
    assert data["standardized_value"] == 4046.8564
    assert data["is_state_specific"] is False
    assert "National Geodetic Standards" in data["method"]


# 6. Decimal precision
def test_decimal_precision_preservation():
    r = client.post(
        "/api/v1/localization/convert-unit",
        json={"value": 0.123456, "unit": "acre"}
    )
    assert r.status_code == 200
    data = r.json()
    # 0.123456 * 4046.8564224 = 499.6087
    assert data["original_value"] == 0.123456
    assert data["standardized_value"] == round(0.123456 * 4046.8564224, 4)


# 7. Zero value handling
def test_zero_value():
    r = client.post(
        "/api/v1/localization/convert-unit",
        json={"value": 0.0, "unit": "kanal"}
    )
    assert r.status_code == 200
    data = r.json()
    assert data["original_value"] == 0.0
    assert data["standardized_value"] == 0.0


# 8. Negative invalid value handling
def test_negative_invalid_value():
    r = client.post(
        "/api/v1/localization/convert-unit",
        json={"value": -15.5, "unit": "bigha"}
    )
    assert r.status_code == 422
    data = r.json()
    msg = data.get("message") or str(data.get("detail", ""))
    assert "cannot be negative" in msg
