"""
PLOT360 Backend — AI Pipeline & Evidence Tests
Section 51: Dataset validation, change detection, evidence viewer, field verification persistence.
"""
import pytest


def test_validate_dataset_endpoint(client, admin_token):
    res = client.post("/api/v1/ai/datasets/validate", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert "total_locations" in data
    assert "valid_pairs" in data
    assert data["valid_pairs"] == 23
    assert data["has_supervised_masks"] is False


def test_list_ai_models(client, citizen_token):
    res = client.get("/api/v1/ai/models", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert len(data) > 0
    assert any("Siamese" in m.get("architecture", "") or "Siamese" in m.get("model_version", "") for m in data)


def test_get_ai_evidence(client, citizen_token):
    # Retrieve evidence for P-1027
    res = client.get("/api/v1/ai/change-events/P-1027/evidence", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["parcel_id"] == "P-1027"
    assert data["ulpin"] == "IN-PB-CHD-0001027"
    assert "2020" in data["t1_date"]
    assert "2025" in data["t2_date"]
    assert "POTENTIAL CHANGE DETECTED — VERIFICATION REQUIRED" in data["ai_explanation"]
    assert "planning_crosscheck" in data
    assert data["model_version"] == "Siamese-UNet-v1"


def test_submit_field_verification_and_persistence(client, revenue_token, citizen_token):
    # Revenue officer submits field verification decision
    verification_payload = {
        "status": "VERIFIED",
        "notes": "Field Officer Sh. V. K. Sharma conducted on-site visit on 14-Aug-2025. Boundary matches approved sanction.",
        "evidence_reference": "DOC-VERIF-2025-091"
    }
    submit_res = client.post(
        "/api/v1/ai/change-events/P-1027/field-verification",
        headers={"Authorization": f"Bearer {revenue_token}"},
        json=verification_payload
    )
    assert submit_res.status_code == 200, submit_res.text
    submit_data = submit_res.json()
    assert submit_data["status"] == "VERIFIED"

    # Query evidence again to ensure persistence
    evidence_res = client.get("/api/v1/ai/change-events/P-1027/evidence", headers={"Authorization": f"Bearer {citizen_token}"})
    assert evidence_res.status_code == 200
    evidence_data = evidence_res.json()
    assert evidence_data["review_status"] == "VERIFIED"
    assert "Field Officer" in evidence_data["review_notes"]
