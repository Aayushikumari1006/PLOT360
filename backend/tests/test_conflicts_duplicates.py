"""
PLOT360 Backend — Data Conflicts & Duplicate Detection Tests
Section 51: Conflicts list, conflict resolution with audit logging, duplicate candidates.
"""
import pytest


def test_list_data_conflicts(client, admin_token):
    res = client.get("/api/v1/admin/conflicts", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first = data[0]
    assert "conflict_id" in first
    assert "source_a" in first
    assert "source_b" in first


def test_resolve_conflict(client, admin_token):
    # Resolve conflict ID 1
    res = client.patch(
        "/api/v1/admin/conflicts/1",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "status": "RESOLVED",
            "resolution_notes": "Ground verification confirmed Area mismatch rectified via fresh cadastral survey"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["status"] == "RESOLVED"

    # Verify audit log recorded this resolution
    audit_res = client.get("/api/v1/admin/audit", headers={"Authorization": f"Bearer {admin_token}"})
    assert audit_res.status_code == 200
    audit_data = audit_res.json()
    actions = [a["action"] for a in audit_data]
    assert "RESOLVE_DATA_CONFLICT" in actions


def test_list_duplicate_candidates(client, admin_token):
    res = client.get("/api/v1/admin/duplicates", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    cand = data[0]
    assert "similarity_score" in cand
    assert "parcel_id" in cand
    assert "candidate_parcel_id" in cand
