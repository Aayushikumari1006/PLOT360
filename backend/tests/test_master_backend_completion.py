"""
PLOT360 Backend — Master Backend Completion & Functionalization Tests
Validates all newly completed platform endpoints, demo sessions, AI assistant intent routing,
GIS layers, conflicts, duplicates, localization, state config, and Chandigarh P-1027 end-to-end integrity.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ── 1. Presentation & Demo Mode Backend Tests ───────────────────────────────────

def test_demo_targets_and_steps():
    r_targets = client.get("/api/v1/demo/targets")
    assert r_targets.status_code == 200
    targets = r_targets.json()
    assert len(targets) == 10
    assert any(t["ulpin"] == "IN-PB-CHD-0001027" for t in targets)

    r_steps = client.get("/api/v1/demo/steps")
    assert r_steps.status_code == 200
    steps = r_steps.json()
    assert len(steps) == 15
    assert steps[0]["step_name"] == "Problem"
    assert steps[10]["step_name"] == "Satellite/AI"


def test_demo_session_lifecycle():
    # 1. Create session
    r_create = client.post("/api/v1/demo/session", json={
        "target_ulpin": "IN-PB-CHD-0001027",
        "location_id": "chandigarh"
    })
    assert r_create.status_code == 200
    data = r_create.json()
    session_id = data["session_id"]
    assert session_id.startswith("DEMO-")
    assert data["current_step"] == 1
    assert data["target_ulpin"] == "IN-PB-CHD-0001027"
    assert not data["is_completed"]

    # 2. Get session
    r_get = client.get(f"/api/v1/demo/session/{session_id}")
    assert r_get.status_code == 200
    assert r_get.json()["current_step"] == 1

    # 3. Advance session
    r_next = client.post(f"/api/v1/demo/session/{session_id}/next")
    assert r_next.status_code == 200
    assert r_next.json()["current_step"] == 2

    # 4. Reset session
    r_reset = client.post(f"/api/v1/demo/session/{session_id}/reset")
    assert r_reset.status_code == 200
    assert r_reset.json()["current_step"] == 1
    assert not r_reset.json()["is_completed"]


# ── 2. AI Assistant Intent Routing Tests ────────────────────────────────────────

def test_ai_assistant_intent_routing():
    queries_and_intents = [
        ("show me property tax dues for P-1027", "SHOW_TAX"),
        ("who is the legal owner of IN-PB-CHD-0001027?", "SHOW_OWNERSHIP"),
        ("what is the Jamabandi record for khasra 1027?", "SHOW_ROR"),
        ("check registered sale deeds for this parcel", "SHOW_REGISTRATION"),
        ("what is the permissible zoning and FAR setback?", "SHOW_ZONING"),
        ("is there a sanctioned building permission?", "SHOW_BUILDING"),
        ("what utility water and electricity connections are active?", "SHOW_UTILITIES"),
        ("are there any environmental or heritage restrictions?", "SHOW_RESTRICTIONS"),
        ("show me the complete timeline of changes", "SHOW_TIMELINE"),
        ("view Sentinel-2 satellite AI change alerts", "SHOW_AI_INSIGHTS"),
        ("are there any detected data conflicts between RoR and Tax?", "SHOW_CONFLICTS"),
        ("track citizen service request status", "SHOW_SERVICE_STATUS"),
        ("check system and integration health", "SHOW_DATA_HEALTH"),
        ("search for parcel in Sector 17", "SEARCH_PARCEL")
    ]

    for query_text, expected_intent in queries_and_intents:
        r = client.post("/api/v1/ai/assistant/intent", json={"query": query_text})
        assert r.status_code == 200
        res = r.json()
        assert res["intent"] == expected_intent, f"Query '{query_text}' mapped to {res['intent']}, expected {expected_intent}"
        assert res["action_endpoint"]
        assert res["is_deterministic"] is True


def test_ai_model_activation():
    r = client.post("/api/v1/ai/models/Siamese-UNet-v1/activate")
    assert r.status_code == 200
    res = r.json()
    assert res["success"] is True
    assert res["status"] == "ACTIVE"


# ── 3. GIS Layer Catalog & Spatial Operations Tests ─────────────────────────────

def test_gis_layers_catalog():
    r = client.get("/api/v1/gis/layers")
    assert r.status_code == 200
    layers = r.json()
    assert len(layers) >= 10
    categories = {l["category"] for l in layers}
    assert {"BASE", "GOVERNANCE", "PLANNING", "SERVICES", "RESTRICTIONS", "ANALYTICS"}.issubset(categories)

    # Filter by category
    r_plan = client.get("/api/v1/gis/layers?category=PLANNING")
    assert r_plan.status_code == 200
    assert all(l["category"] == "PLANNING" for l in r_plan.json())


def test_gis_parcels_bbox_and_point():
    # Bbox search
    r_bbox = client.get("/api/v1/gis/parcels/bbox?bbox=76.7,30.7,76.8,30.8")
    assert r_bbox.status_code == 200
    fc = r_bbox.json()
    assert fc["type"] == "FeatureCollection"
    assert "features" in fc

    # Point in polygon search
    r_pt = client.get("/api/v1/gis/parcels/point?lat=30.7333&lng=76.7794")
    assert r_pt.status_code == 200
    res = r_pt.json()
    assert "found" in res
    assert "parcel_id" in res or "nearest_parcel" in res


# ── 4. Planning & Governance Subresource Tests ─────────────────────────────────

def test_parcel_land_use_and_zoning():
    ulpin = "IN-PB-CHD-0001027"
    r_lu = client.get(f"/api/v1/parcels/{ulpin}/land-use")
    assert r_lu.status_code == 200
    lu = r_lu.json()
    assert "canonical_land_use" in lu
    assert lu["ulpin"] == ulpin

    r_zone = client.get(f"/api/v1/parcels/{ulpin}/zoning")
    assert r_zone.status_code == 200
    zone = r_zone.json()
    assert "zone_name" in zone
    assert "max_far" in zone


def test_parcel_valuation_and_infrastructure():
    ulpin = "IN-PB-CHD-0001027"
    r_val = client.get(f"/api/v1/parcels/{ulpin}/valuation")
    assert r_val.status_code == 200
    vals = r_val.json()
    assert len(vals) >= 1
    assert any(v["reference_type"] in ["STATUTORY_CIRCLE_RATE", "INDICATIVE_ANALYTICAL_ESTIMATE"] for v in vals)

    r_infra = client.get(f"/api/v1/parcels/{ulpin}/infrastructure")
    assert r_infra.status_code == 200
    infra = r_infra.json()
    assert len(infra) >= 1
    assert any(i["network_type"] in ["Road", "Drainage", "Electricity", "Water"] for i in infra)


# ── 5. Top-Level Conflicts & Duplicates Tests ────────────────────────────────────

def test_top_level_conflicts_crud():
    # Login as admin to obtain required conflict:read and conflict:resolve permissions
    res_login = client.post("/api/v1/auth/login", json={"username": "admin@plot360.gov.in", "password": "Plot360Pass123!"})
    token = res_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List conflicts
    r_list = client.get("/api/v1/conflicts", headers=headers)
    assert r_list.status_code == 200
    conflicts = r_list.json()
    assert len(conflicts) >= 1
    cid = conflicts[0]["conflict_id"]

    # Get single conflict
    r_get = client.get(f"/api/v1/conflicts/{cid}", headers=headers)
    assert r_get.status_code == 200
    assert r_get.json()["conflict_id"] == cid

    # Patch conflict resolution
    r_patch = client.patch(f"/api/v1/conflicts/{cid}", json={
        "status": "UNDER_REVIEW",
        "resolution_notes": "Revenue Inspector scheduled for joint site survey."
    }, headers=headers)
    assert r_patch.status_code == 200
    assert r_patch.json()["status"] == "UNDER_REVIEW"


def test_top_level_duplicates_crud():
    r_list = client.get("/api/v1/duplicates")
    assert r_list.status_code == 200
    cands = r_list.json()
    if cands:
        cand_id = cands[0]["id"]
        r_get = client.get(f"/api/v1/duplicates/{cand_id}")
        assert r_get.status_code == 200

        r_patch = client.patch(f"/api/v1/duplicates/{cand_id}", json={
            "status": "REVIEWED",
            "review_notes": "Confirmed non-duplicate after khasra inspection."
        })
        assert r_patch.status_code == 200
        assert r_patch.json()["status"] == "REVIEWED"


# ── 6. Citizen Applications & Transactions Tests ─────────────────────────────────

def test_top_level_application_and_transaction_tracking():
    # 1. Create a service request to track
    r_sub = client.post("/api/v1/citizen/service-requests", json={
        "ulpin": "IN-PB-CHD-0001027",
        "service_type": "demarcation",
        "applicant_name": "Test Applicant",
        "applicant_phone": "9876543210",
        "applicant_email": "applicant@example.com",
        "notes": "Demarcation inquiry test"
    })
    assert r_sub.status_code == 200
    sr_id = r_sub.json()["request_id"]

    # 2. Track transaction by request_id
    r_track = client.get(f"/api/v1/citizen/transactions/{sr_id}")
    assert r_track.status_code == 200
    track_data = r_track.json()
    assert track_data["transaction_id"] == sr_id
    assert track_data["stages"]
    assert len(track_data["stages"]) == 6

    # 3. Direct /api/v1/applications/{id}
    r_app = client.get(f"/api/v1/applications/{sr_id}")
    assert r_app.status_code == 200
    assert r_app.json()["application_id"] == sr_id


# ── 7. Document Versions Test ───────────────────────────────────────────────────

def test_document_versions():
    # Upload test document
    import io
    file_content = b"%PDF-1.4 test document content for versioning"
    r_up = client.post(
        "/api/v1/documents",
        files={"file": ("test_deed.pdf", io.BytesIO(file_content), "application/pdf")},
        data={"document_type": "Sale Deed", "ulpin": "IN-PB-CHD-0001027"}
    )
    assert r_up.status_code == 200
    doc_id = r_up.json()["document_id"]

    r_vers = client.get(f"/api/v1/documents/{doc_id}/versions")
    assert r_vers.status_code == 200
    vers = r_vers.json()
    assert len(vers) >= 1
    assert vers[0]["version_number"] == 1


# ── 8. Analytics & Data Quality Tests ───────────────────────────────────────────

def test_analytics_planning_and_data_quality():
    r_plan = client.get("/api/v1/analytics/planning")
    assert r_plan.status_code == 200
    assert "building_permissions_breakdown" in r_plan.json()

    r_dq = client.get("/api/v1/analytics/data-quality")
    assert r_dq.status_code == 200
    dq = r_dq.json()
    assert "data_trust_score" in dq
    assert "trust_factors" in dq
    assert dq["trust_factors"]["provenance_traceability"]


# ── 9. Localization & State Config Tests ────────────────────────────────────────

def test_localization_config_and_terminology():
    r_cfg = client.get("/api/v1/localization/config")
    assert r_cfg.status_code == 200
    assert len(r_cfg.json()["supported_languages"]) >= 4

    r_term = client.get("/api/v1/localization/terminology?location_id=chandigarh")
    assert r_term.status_code == 200
    term = r_term.json()
    assert term["state_name"] == "Chandigarh"
    assert term["jurisdiction_type"] == "Union Territory"

    # Test unit conversion
    r_conv = client.post("/api/v1/localization/convert-unit", json={"value": 1.0, "unit": "acre"})
    assert r_conv.status_code == 200
    res = r_conv.json()
    assert res["standardized_unit"] == "sq_m"
    assert round(res["standardized_value"], 1) == 4046.9


def test_admin_state_config_update():
    r = client.put("/api/v1/admin/state-config/chandigarh", json={
        "default_language": "en"
    })
    assert r.status_code == 200
    assert r.json()["success"] is True


# ── 10. Low-Bandwidth Mode & Geometry Simplification Tests ──────────────────────

def test_parcel_compact_mode_and_geometry_simplification():
    ulpin = "IN-PB-CHD-0001027"

    # Compact mode
    r_compact = client.get(f"/api/v1/parcels/{ulpin}?compact=true")
    assert r_compact.status_code == 200
    c_data = r_compact.json()
    assert "ulpin" in c_data
    assert "polygon" in c_data
    # In compact mode, subresource arrays are omitted to save bandwidth
    assert "ownership" not in c_data

    # Geometry simplification
    r_geom = client.get(f"/api/v1/parcels/{ulpin}/geometry?simplify=0.001")
    assert r_geom.status_code == 200
    geom_data = r_geom.json()
    assert geom_data["type"] == "Feature"
    assert geom_data["geometry"]["type"] == "Polygon"


# ── 11. End-to-End Acceptance Test for Chandigarh P-1027 (Section 131) ──────────

def test_chandigarh_p1027_full_stack_acceptance():
    ulpin = "IN-PB-CHD-0001027"

    # 1. Parcel Master
    r_p = client.get(f"/api/v1/parcels/{ulpin}")
    assert r_p.status_code == 200
    p = r_p.json()
    assert p["parcel_id"] == "P-1027"
    assert "Chandigarh" in p.get("jurisdiction", "") or p.get("district") == "Chandigarh"
    assert p.get("district") == "Chandigarh"

    # 2. Ownership & RoR
    r_own = client.get(f"/api/v1/parcels/{ulpin}/ownership")
    assert r_own.status_code == 200
    assert len(r_own.json()) >= 1

    r_ror = client.get(f"/api/v1/parcels/{ulpin}/ror")
    assert r_ror.status_code == 200
    assert len(r_ror.json()) >= 1

    # 3. Registration & Liens
    r_reg = client.get(f"/api/v1/parcels/{ulpin}/registration")
    assert r_reg.status_code == 200
    assert len(r_reg.json()) >= 1

    r_enc = client.get(f"/api/v1/parcels/{ulpin}/encumbrance")
    assert r_enc.status_code == 200

    # 4. Planning & Building
    r_plan = client.get(f"/api/v1/parcels/{ulpin}/planning")
    assert r_plan.status_code == 200

    r_bp = client.get(f"/api/v1/parcels/{ulpin}/building")
    assert r_bp.status_code == 200

    r_cross = client.get(f"/api/v1/parcels/{ulpin}/planning-crosscheck")
    assert r_cross.status_code == 200
    c_status = r_cross.json().get("status") or r_cross.json().get("crosscheck_status")
    assert c_status in ["COMPLIANT", "UNDER_REVIEW", "POTENTIAL_MISMATCH", "MATCH", "POTENTIAL_INCONSISTENCY", "REQUIRES_REVIEW"]

    # 5. Fiscal (Tax & Valuation)
    r_tax = client.get(f"/api/v1/parcels/{ulpin}/tax")
    assert r_tax.status_code == 200

    r_val = client.get(f"/api/v1/parcels/{ulpin}/valuation")
    assert r_val.status_code == 200

    # 6. Utilities & Infrastructure
    r_util = client.get(f"/api/v1/parcels/{ulpin}/utilities")
    assert r_util.status_code == 200

    r_infra = client.get(f"/api/v1/parcels/{ulpin}/infrastructure")
    assert r_infra.status_code == 200

    # 7. Timeline & Provenance
    r_time = client.get(f"/api/v1/parcels/{ulpin}/timeline")
    assert r_time.status_code == 200
    assert len(r_time.json()) >= 3

    r_prov = client.get(f"/api/v1/parcels/{ulpin}/provenance")
    assert r_prov.status_code == 200
    assert len(r_prov.json()) >= 1

    # 8. AI Evidence
    r_ai = client.get(f"/api/v1/ai/change-events/{ulpin}/evidence")
    assert r_ai.status_code == 200
    ai_ev = r_ai.json()
    assert ai_ev["ulpin"] == ulpin
    assert ai_ev["t1_source"] or ai_ev.get("t1_date")
    assert ai_ev["t2_source"] or ai_ev.get("t2_date")
    assert "POTENTIAL CHANGE DETECTED" in ai_ev["ai_explanation"]

    # 9. Aggregated Liabilities Dossier (Section 17)
    r_liab = client.get(f"/api/v1/parcels/{ulpin}/liabilities")
    assert r_liab.status_code == 200
    liab = r_liab.json()
    assert liab["ulpin"] == ulpin
    assert "liability_status" in liab
    assert "encumbrances" in liab
    assert "mortgages" in liab
    assert "disputes" in liab
    assert "legal_advisory" in liab


# ── 12. Official SIH 3-Layer GIS Taxonomy & Decision-Support Tests ───────────────

def test_official_sih_gis_layer_taxonomy():
    """Sections 13 & 88: Verify Base, Essential, Additional layer categorization."""
    # 1. Base Layer check
    r_base = client.get("/api/v1/gis/layers?official_category=BASE")
    assert r_base.status_code == 200
    base_layers = r_base.json()
    assert len(base_layers) >= 2
    assert all(l["official_layer_category"] == "BASE" for l in base_layers)
    assert any(l["layer_id"] == "cadastral_parcels" for l in base_layers)

    # 2. Essential Governance Layer check
    r_ess = client.get("/api/v1/gis/layers?official_category=ESSENTIAL")
    assert r_ess.status_code == 200
    ess_layers = r_ess.json()
    assert len(ess_layers) >= 3
    assert all(l["official_layer_category"] == "ESSENTIAL" for l in ess_layers)

    # 3. Additional Use-Case Layer check
    r_add = client.get("/api/v1/gis/layers?official_category=ADDITIONAL")
    assert r_add.status_code == 200
    add_layers = r_add.json()
    assert len(add_layers) >= 3
    assert all(l["official_layer_category"] == "ADDITIONAL" for l in add_layers)


def test_decision_support_and_predictive_analytics():
    """Sections 58 & 59: Decision-support indicators for rapid development and hotspots."""
    r_ds = client.get("/api/v1/analytics/decision-support")
    assert r_ds.status_code == 200
    ds = r_ds.json()
    assert "rapid_development_areas" in ds
    assert "record_inconsistency_hotspots" in ds
    assert "workflow_volume_trends" in ds
    assert "infrastructure_gaps" in ds
    assert "methodology" in ds
    assert "limitations" in ds

    # Also test /predictive alias
    r_pred = client.get("/api/v1/analytics/predictive")
    assert r_pred.status_code == 200
    assert r_pred.json()["report_id"] == ds["report_id"]


def test_integration_jobs_listing():
    """Sections 43 & 129: Verify integration jobs listing endpoints."""
    r_jobs = client.get("/api/v1/integrations/jobs")
    assert r_jobs.status_code == 200
    assert isinstance(r_jobs.json(), list)

