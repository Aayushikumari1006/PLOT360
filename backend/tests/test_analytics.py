"""
PLOT360 Backend — Analytics & Dashboard Aggregation Tests
Section 51: Overview KPIs, parcels distribution, AI metrics, data health.
"""
import pytest


def test_analytics_overview(client, citizen_token):
    res = client.get("/api/v1/analytics/overview", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert "kpis" in data
    kpis = data["kpis"]
    assert "total_parcels" in kpis
    assert "verification_rate" in kpis
    assert "active_ai_alerts" in kpis


def test_analytics_parcels(client, citizen_token):
    res = client.get("/api/v1/analytics/parcels", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert "land_use_distribution" in data
    assert "rural_urban_split" in data


def test_analytics_ai(client, citizen_token):
    res = client.get("/api/v1/analytics/ai", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert "active_model_version" in data
    assert "review_status_breakdown" in data
