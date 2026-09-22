"""
PLOT360 Backend — Integrations Hub & System Health Tests
Section 51: Department connectors, simulated sync jobs, health endpoints.
"""
import pytest


def test_health_endpoints(client):
    # Liveness check
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

    # Detailed health report
    res_det = client.get("/api/v1/health/detailed")
    assert res_det.status_code == 200
    det = res_det.json()
    assert det["status"] in ["healthy", "operational"]
    assert "database" in det
    assert "integrations" in det
    assert "ai_service" in det


def test_list_integrations(client, citizen_token):
    res = client.get("/api/v1/integrations", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    dept_names = [c["department"] for c in data]
    assert any("Revenue" in d for d in dept_names)
    assert any("Registration" in d for d in dept_names)


def test_trigger_integration_sync(client, admin_token):
    # Trigger sync for REV-01
    res = client.post("/api/v1/integrations/REV-01/sync", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "job_id" in data
    assert data["status"] in ["SUCCEEDED", "RUNNING"]

    # Verify audit trail recorded sync
    audit_res = client.get("/api/v1/admin/audit", headers={"Authorization": f"Bearer {admin_token}"})
    assert audit_res.status_code == 200
    audit_data = audit_res.json()
    actions = [a["action"] for a in audit_data]
    assert "INTEGRATION_SYNC" in actions
