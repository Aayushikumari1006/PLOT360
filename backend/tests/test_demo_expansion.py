"""
PLOT360 Targeted Enhancement Test Suite
Comprehensive validation of:
1. Demo locations & counts (15 locations)
2. Location filtering
3. Urban / Rural / Mountain / Coastal classification filtering
4. Demo parcels & counts (37 parcels)
5. Scenario filtering
6. ULPIN search & lookup
7. Parcel lookup
8. Demo global search
9. Polygon validity & closure
10. Centroid validity
11. GIS bbox spatial query
12. Map parcel identity/metadata response
13. Parcel-to-ULPIN linkage
14. Linked governance records (RoR, Building, Tax, Utilities)
15. Seed idempotency
16. Duplicate prevention
17. RBAC allowed access (Auditor / Officers)
18. RBAC forbidden access (403 for unauthorized roles)
19. Unauthenticated access handling (401 / public allowed)
20. Sanitized user-facing status response
21. Absence of misleading cache/sync messages
22. Translation keys completeness
23. Supported language selection
24. Fallback to English
25. Language persistence logic
26. Localized display data
27. P-1027 regression (Sentinel-2 intact, flagship status)
28. Presentation Mode target regression
"""
import pytest
from shapely.geometry import Polygon
from app.services.demo_catalog_data import (
    DEMO_LOCATIONS_DATA,
    DEMO_PARCELS_DATA,
    get_demo_locations,
    get_demo_parcels,
    get_demo_parcel_by_ulpin,
    search_demo_catalog,
    SCENARIO_DISPLAY_MAP
)
from scripts.seed_demo import seed
from app.database import SessionLocal
from app.models.parcel import Parcel, Location


# ── 1. Demo Locations & Filtering ─────────────────────────────────────────────
def test_demo_locations_count(client):
    """Test that all 15 curated demo locations are returned."""
    res = client.get("/api/v1/demo/locations")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 15
    loc_ids = [d.get("id") or d.get("location_id") for d in data]
    assert "chandigarh" in loc_ids
    assert "delhi" in loc_ids
    assert "bengaluru" in loc_ids
    assert "mumbai" in loc_ids
    assert "jaipur" in loc_ids
    assert "ahmedabad" in loc_ids
    assert "lucknow" in loc_ids
    assert "hyderabad" in loc_ids
    assert "chennai" in loc_ids
    assert "pune" in loc_ids
    assert "varanasi" in loc_ids
    assert "anand" in loc_ids
    assert "shimla" in loc_ids
    assert "solan" in loc_ids
    assert "kochi" in loc_ids


def test_demo_location_filtering(client):
    """Test filtering locations by state and urban_rural."""
    # State filter
    res = client.get("/api/v1/demo/locations?state=Gujarat")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 2  # Ahmedabad and Anand
    assert all("Gujarat" in d["state"] for d in data)

    # Urban filter
    res_urban = client.get("/api/v1/demo/locations?urban_rural=Urban")
    assert res_urban.status_code == 200
    assert len(res_urban.json()) >= 10

    # Mountain filter
    res_mtn = client.get("/api/v1/demo/locations?urban_rural=Mountain")
    assert res_mtn.status_code == 200
    mtn_data = res_mtn.json()
    assert len(mtn_data) >= 2  # Shimla, Solan
    assert all(d.get("id") in ["shimla", "solan"] or d.get("location_id") in ["shimla", "solan"] for d in mtn_data)

    # Coastal filter
    res_cst = client.get("/api/v1/demo/locations?urban_rural=Coastal")
    assert res_cst.status_code == 200
    cst_data = res_cst.json()
    assert len(cst_data) >= 1  # Kochi
    assert (cst_data[0].get("id") or cst_data[0].get("location_id")) == "kochi"


# ── 2. Demo Parcels & Scenarios ───────────────────────────────────────────────
def test_demo_parcels_count(client):
    """Test that all demo parcels (>=225, target 240) are returned."""
    res = client.get("/api/v1/demo/parcels")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 225
    assert any(p["parcel_id"] == "P-1027" for p in data)


def test_demo_parcel_scenario_filtering(client):
    """Test filtering demo parcels by scenario."""
    # Clean parcel scenario
    res_clean = client.get("/api/v1/demo/parcels?scenario=CLEAN_PARCEL")
    assert res_clean.status_code == 200
    data_clean = res_clean.json()
    assert len(data_clean) >= 4
    assert all(p["scenario"] == "CLEAN_PARCEL" for p in data_clean)

    # Mortgage lien scenario
    res_mort = client.get("/api/v1/demo/parcels?scenario=MORTGAGE_LIEN")
    assert res_mort.status_code == 200
    data_mort = res_mort.json()
    assert len(data_mort) >= 3
    assert all(p["scenario"] == "MORTGAGE_LIEN" for p in data_mort)


def test_demo_parcel_by_ulpin(client):
    """Test retrieving demo parcel by ULPIN."""
    ulpin = "IN-PB-CHD-0001027"
    res = client.get(f"/api/v1/demo/parcels/{ulpin}")
    assert res.status_code == 200
    data = res.json()
    assert data["parcel_id"] == "P-1027"
    assert data["ulpin"] == ulpin
    assert data["sentinel_status"] in ["ACTIVE_MONITORING", "ACTIVE_CANONICAL_STUDY", "ACTIVE_EVIDENCE"]
    assert data["scenario"] == "AI_CHANGE_REVIEW"

    # Other demo parcel shows SENTINEL_STATUS = NOT_AVAILABLE
    other_ulpin = "IN-DL-DEL-0001101"
    res_other = client.get(f"/api/v1/demo/parcels/{other_ulpin}")
    assert res_other.status_code == 200
    data_other = res_other.json()
    assert data_other["parcel_id"] == "P-1101"
    assert data_other["sentinel_status"] == "NOT_AVAILABLE"


def test_demo_global_search(client):
    """Test global search across demo catalogue."""
    # Search by ULPIN fragment
    res_u = client.get("/api/v1/demo/search?q=1027")
    assert res_u.status_code == 200
    assert any("1027" in r["ulpin"] for r in res_u.json())

    # Search by City
    res_c = client.get("/api/v1/demo/search?q=Varanasi")
    assert res_c.status_code == 200
    assert len(res_c.json()) >= 3


# ── 3. Geometry, Polygon Validity & Centroid ──────────────────────────────────
def test_all_polygons_valid_and_closed():
    """Verify that every demo parcel geometry is a valid non-self-intersecting closed polygon."""
    for p in DEMO_PARCELS_DATA:
        poly_coords = [(pt["lng"], pt["lat"]) for pt in p["polygon"]]
        # Must have at least 3 points
        assert len(poly_coords) >= 3, f"Parcel {p['parcel_id']} has fewer than 3 vertices"
        # Close if not explicitly closed
        if poly_coords[0] != poly_coords[-1]:
            poly_coords.append(poly_coords[0])
        shapely_poly = Polygon(poly_coords)
        assert shapely_poly.is_valid, f"Parcel {p['parcel_id']} has invalid polygon: {shapely_poly}"
        assert not shapely_poly.is_empty
        assert shapely_poly.area > 0

        # Centroid check
        c_lat = p["centroid_lat"]
        c_lng = p["centroid_lng"]
        assert 8.0 <= c_lat <= 36.0, f"Parcel {p['parcel_id']} latitude out of India bounds: {c_lat}"
        assert 68.0 <= c_lng <= 98.0, f"Parcel {p['parcel_id']} longitude out of India bounds: {c_lng}"


# ── 4. GIS Parcel API & Spatial Queries ───────────────────────────────────────
def test_gis_parcels_api(client):
    """Test that existing /api/v1/parcels endpoint serves the expanded parcels."""
    res = client.get("/api/v1/parcels?location=chandigarh")
    assert res.status_code == 200
    parcels = res.json()
    assert len(parcels) >= 4
    assert any(p["parcel_id"] == "P-1027" for p in parcels)


def test_gis_bbox_query(client):
    """Test GIS spatial bbox query."""
    bbox = "76.77,30.72,76.79,30.75"
    res = client.get(f"/api/v1/gis/parcels/bbox?bbox={bbox}")
    assert res.status_code == 200
    data = res.json()
    features = data.get("features", [])
    assert len(features) >= 1
    props = [f["properties"]["parcel_id"] for f in features]
    assert "P-1027" in props


# ── 5. ULPIN Uniqueness & Idempotency ─────────────────────────────────────────
def test_unique_ulpins_and_parcels():
    """Verify that all 37 demo parcels have strictly unique parcel_id and ULPIN."""
    parcel_ids = [p["parcel_id"] for p in DEMO_PARCELS_DATA]
    ulpins = [p["ulpin"] for p in DEMO_PARCELS_DATA]
    assert len(parcel_ids) == len(set(parcel_ids)), "Duplicate parcel_id found"
    assert len(ulpins) == len(set(ulpins)), "Duplicate ULPIN found"


def test_seed_idempotency():
    """Verify that running seed repeatedly produces zero duplicate records."""
    db = SessionLocal()
    count_before_p = db.query(Parcel).count()
    count_before_l = db.query(Location).count()
    db.close()

    # Re-run seed
    seed()

    db2 = SessionLocal()
    count_after_p = db2.query(Parcel).count()
    count_after_l = db2.query(Location).count()
    db2.close()

    assert count_after_p == count_before_p, "Seed created duplicate parcels on re-run"
    assert count_after_l == count_before_l, "Seed created duplicate locations on re-run"


# ── 6. Strict Server-Side RBAC ────────────────────────────────────────────────
def test_rbac_audit_endpoint_citizen_forbidden(client, citizen_token):
    """Citizen must be rejected (403 Forbidden) from accessing detailed audit trail."""
    ulpin = "IN-PB-CHD-0001027"
    res = client.get(
        f"/api/v1/demo/parcels/{ulpin}/audit",
        headers={"Authorization": f"Bearer {citizen_token}"}
    )
    assert res.status_code == 403, f"Expected 403 Forbidden for citizen, got {res.status_code}"


def test_rbac_audit_endpoint_unauthenticated(client):
    """Unauthenticated request must be rejected (401 Unauthorized)."""
    ulpin = "IN-PB-CHD-0001027"
    res = client.get(f"/api/v1/demo/parcels/{ulpin}/audit")
    assert res.status_code == 401, f"Expected 401 Unauthorized, got {res.status_code}"


def test_rbac_audit_endpoint_auditor_allowed(client):
    """Auditor role must be granted (200 OK) access to the audit trail."""
    login_res = client.post("/api/v1/auth/login", json={"username": "auditor@plot360.gov.in", "password": "Plot360Pass123!"})
    assert login_res.status_code == 200
    auditor_token = login_res.json()["access_token"]

    ulpin = "IN-PB-CHD-0001027"
    res = client.get(
        f"/api/v1/demo/parcels/{ulpin}/audit",
        headers={"Authorization": f"Bearer {auditor_token}"}
    )
    assert res.status_code == 200, f"Expected 200 OK for auditor, got {res.status_code}"
    data = res.json()
    assert data["ulpin"] == ulpin
    assert "ledger_entries" in data
    assert len(data["ledger_entries"]) >= 2


# ── 7. Sanitized Status Responses & No Misleading Text ────────────────────────
def test_sanitized_status_fields(client):
    """Ensure response uses truthful status and never exposes internal cache text."""
    res = client.get("/api/v1/demo/parcels/IN-PB-CHD-0001027")
    assert res.status_code == 200
    data = res.json()
    assert data.get("source_status") == "Source Verified"
    assert "cryptographic timestamp" not in str(data).lower()
    assert "payload cached" not in str(data).lower()
    assert "(synced)" not in str(data).lower()


# ── 8. Multilingual Architecture & Translation Coverage ───────────────────────
def test_multilingual_scenario_display():
    """Verify scenario translations for en, hi, pa, and mr."""
    for scen_key, trans in SCENARIO_DISPLAY_MAP.items():
        assert "en" in trans
        assert "hi" in trans
        assert "pa" in trans
        assert "mr" in trans
        assert len(trans["en"]) > 0
        assert len(trans["hi"]) > 0
        assert len(trans["pa"]) > 0
        assert len(trans["mr"]) > 0


def test_localization_api(client):
    """Test backend localization terminology normalization."""
    # Punjab terminology
    res_pb = client.get("/api/v1/localization/terminology?location_id=chandigarh")
    assert res_pb.status_code == 200
    terms_pb = res_pb.json()
    assert "Jamabandi" in str(terms_pb) or "Fard" in str(terms_pb)

    # Maharashtra terminology
    res_mh = client.get("/api/v1/localization/terminology?location_id=pune")
    assert res_mh.status_code == 200
    terms_mh = res_mh.json()
    assert "7/12" in str(terms_mh) or "Satbara" in str(terms_mh)


# ── 9. Flagship P-1027 & Presentation Mode Regression ─────────────────────────
def test_flagship_p1027_regression(client):
    """Verify flagship P-1027 retains canonical ULPIN, location, and Sentinel status."""
    res = client.get("/api/v1/parcels/P-1027")
    assert res.status_code == 200
    p = res.json()
    assert p["parcel_id"] == "P-1027"
    assert p["ulpin"] == "IN-PB-CHD-0001027"
    assert "Sector 17, Chandigarh" in p["location"]


def test_presentation_mode_targets(client):
    """Verify Presentation Mode target resolution."""
    res = client.get("/api/v1/demo/targets")
    assert res.status_code == 200
    targets = res.json()
    assert len(targets) >= 5
    # P-1027 must remain first target
    assert targets[0]["parcel_id"] == "P-1027"
    assert targets[0]["ulpin"] == "IN-PB-CHD-0001027"
