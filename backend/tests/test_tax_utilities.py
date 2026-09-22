"""
PLOT360 Backend — Tax & Utilities Endpoints Tests
Section 51: Tax records, assessments, dues, utility records, connections.
"""
import pytest


def test_get_tax_records(client, revenue_token):
    res = client.get("/api/v1/parcels/P-1027/tax", headers={"Authorization": f"Bearer {revenue_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["ulpin"] == "IN-PB-CHD-0001027"
    assert "status" in data[0]


def test_get_utility_records(client, revenue_token):
    res = client.get("/api/v1/parcels/P-1027/utilities", headers={"Authorization": f"Bearer {revenue_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["electricity"] is not None
