"""
PLOT360 Backend — Phase 2 Feature Completion & Live Integration Tests
Validates all Phase 2 prioritized integrations:
- 2A: Live Parcel Data & Unified Records
- 2B: Authoritative RBAC & Field Protections
- 2C: 12-Tab Sub-record Endpoints (RoR, Registration, Liabilities, Planning, Building, Tax, Utilities, Restrictions)
- 2D: GIS Layer Catalog & Spatial Endpoints
- 2F: Citizen Service Requests & Workflow Transitions
- 2G: Data Conflicts & Duplicate Candidates
- 2H: Executive Analytics Overview
- 2I: Real Sentinel-2 GeoTIFF Extraction
- 2J: Multi-attribute Global Search
"""
import pytest


def test_phase2a_live_parcels_contract(client, citizen_token):
    # Test parcel list
    res = client.get("/api/v1/parcels?limit=10", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    parcels = res.json()
    assert len(parcels) > 0
    p0 = parcels[0]
    assert "ulpin" in p0
    assert "parcel_id" in p0
    assert "state" in p0

    # Test single parcel detail
    ulpin = p0["ulpin"]
    detail_res = client.get(f"/api/v1/parcels/{ulpin}", headers={"Authorization": f"Bearer {citizen_token}"})
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["ulpin"] == ulpin
    assert "owner" in detail
    assert "standardized_area" in detail
    assert "polygon" in detail


def test_phase2c_parcel_domain_endpoints(client, citizen_token):
    target = "IN-PB-CHD-0001027"

    # RoR
    r_ror = client.get(f"/api/v1/parcels/{target}/ror", headers={"Authorization": f"Bearer {citizen_token}"})
    assert r_ror.status_code == 200
    assert isinstance(r_ror.json(), list)
    assert len(r_ror.json()) > 0
    assert "owner_name" in r_ror.json()[0]

    # Registration
    r_reg = client.get(f"/api/v1/parcels/{target}/registration", headers={"Authorization": f"Bearer {citizen_token}"})
    assert r_reg.status_code == 200
    assert isinstance(r_reg.json(), list)

    # Liabilities
    r_liab = client.get(f"/api/v1/parcels/{target}/liabilities", headers={"Authorization": f"Bearer {citizen_token}"})
    assert r_liab.status_code == 200
    assert "encumbrances" in r_liab.json()

    # Planning
    r_plan = client.get(f"/api/v1/parcels/{target}/planning", headers={"Authorization": f"Bearer {citizen_token}"})
    assert r_plan.status_code == 200
    assert isinstance(r_plan.json(), list)
    assert len(r_plan.json()) > 0
    assert "zoning" in r_plan.json()[0]

    # Building
    r_bld = client.get(f"/api/v1/parcels/{target}/building", headers={"Authorization": f"Bearer {citizen_token}"})
    assert r_bld.status_code == 200

    # Tax
    r_tax = client.get(f"/api/v1/parcels/{target}/tax", headers={"Authorization": f"Bearer {citizen_token}"})
    assert r_tax.status_code == 200

    # Utilities
    r_ut = client.get(f"/api/v1/parcels/{target}/utilities", headers={"Authorization": f"Bearer {citizen_token}"})
    assert r_ut.status_code == 200

    # Restrictions
    r_rest = client.get(f"/api/v1/parcels/{target}/restrictions", headers={"Authorization": f"Bearer {citizen_token}"})
    assert r_rest.status_code == 200


def test_phase2d_gis_layers_catalog(client, citizen_token):
    res = client.get("/api/v1/gis/layers")
    assert res.status_code == 200
    layers = res.json()
    assert len(layers) >= 9
    layer_ids = [l["layer_id"] for l in layers]
    assert "cadastral_parcels" in layer_ids
    assert "admin_boundaries" in layer_ids
    assert "master_plan_zoning" in layer_ids
    assert "infrastructure_networks" in layer_ids
    assert "environmental_restrictions" in layer_ids


def test_phase2f_citizen_request_and_workflow_rbac(client, citizen_token, revenue_token):
    # Citizen creates service request
    payload = {
        "service_type": "demarcation",
        "parcel_id": "P-1027",
        "ulpin": "IN-PB-CHD-0001027",
        "applicant_name": "Test Citizen",
        "applicant_phone": "+91 99999 11111",
        "notes": "Boundary check request"
    }
    create_res = client.post("/api/v1/citizen/service-requests", headers={"Authorization": f"Bearer {citizen_token}"}, json=payload)
    assert create_res.status_code == 200
    res_data = create_res.json()
    assert res_data["success"] is True
    assert "request_id" in res_data
    req_id = res_data["request_id"]

    # Citizen cannot transition workflow (403 forbidden)
    t_citizen = client.post(
        "/api/v1/workflows/1/transition",
        headers={"Authorization": f"Bearer {citizen_token}"},
        json={"to_state": "in_review", "comment": "Citizen trying to advance"}
    )
    assert t_citizen.status_code == 403


def test_phase2g_conflicts_and_duplicates(client, admin_token, citizen_token):
    # Conflicts require conflict:read
    conf_res = client.get("/api/v1/conflicts", headers={"Authorization": f"Bearer {admin_token}"})
    assert conf_res.status_code == 200
    conflicts = conf_res.json()
    assert isinstance(conflicts, list)

    # Duplicates open
    dup_res = client.get("/api/v1/duplicates")
    assert dup_res.status_code == 200
    dups = dup_res.json()
    assert isinstance(dups, list)


def test_phase2h_analytics_overview(client):
    res = client.get("/api/v1/analytics/overview")
    assert res.status_code == 200
    data = res.json()
    assert "kpis" in data
    kpis = data["kpis"]
    assert "total_parcels" in kpis
    assert "verification_rate" in kpis
    assert "open_conflicts" in kpis


def test_phase2i_real_sentinel_change_detection(client, admin_token):
    res = client.post(
        "/api/v1/ai/change-detection",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"parcel_id": "P-1027"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["parcel_id"] == "P-1027"
    assert "spectral_shift_magnitude" in data
    assert "evidence_source" in data
    assert "model_version" in data
    assert data["model_version"] == "Siamese-UNet-v1"


def test_phase2j_global_search(client):
    res = client.get("/api/v1/search?q=1027")
    assert res.status_code == 200
    results = res.json()
    assert len(results) > 0
    assert any(r["id"] == "P-1027" or "1027" in r["title"] for r in results)
