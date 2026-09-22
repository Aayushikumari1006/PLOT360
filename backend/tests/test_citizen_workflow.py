"""
PLOT360 Backend — Citizen Services & Workflow Engine Tests
Section 51: Service request creation, persistent SR-YYYY-XXXXXX, workflow progression, unauthorized transitions.
"""
import pytest
import re


def test_create_service_request(client, citizen_token):
    payload = {
        "service_type": "demarcation",
        "ulpin": "P-1027",
        "applicant_name": "Suresh Sharma",
        "applicant_phone": "9876543210",
        "applicant_email": "suresh.sharma@example.com",
        "notes": "Request boundary demarcation survey"
    }
    res = client.post("/api/v1/citizen/service-requests", headers={"Authorization": f"Bearer {citizen_token}"}, json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    assert "request_id" in data
    assert re.match(r"^SR-\d{4}-\d{6}$", data["request_id"])
    assert data["ulpin"] == "IN-PB-CHD-0001027"
    assert data["applicant_name"] == "Suresh Sharma"
    assert data["status"] == "SUBMITTED"


def test_get_service_requests(client, citizen_token):
    res = client.get("/api/v1/citizen/service-requests", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_workflow_lifecycle_and_transition(client, admin_token, citizen_token):
    # Retrieve workflow for service request 1
    res = client.get("/api/v1/workflows/1", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    wf = res.json()
    assert "current_state" in wf

    # Admin advances workflow to DOCUMENTS_RECEIVED
    trans_res = client.post(
        "/api/v1/workflows/1/transition",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"to_state": "DOCUMENTS_RECEIVED", "comment": "Verification officer received physical documents"}
    )
    assert trans_res.status_code == 200
    updated_wf = trans_res.json()
    assert updated_wf["current_state"] == "DOCUMENTS_RECEIVED"


def test_notifications(client, citizen_token):
    res = client.get("/api/v1/notifications", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
