"""
PLOT360 Backend — Governance & Planning Endpoints Tests
Section 51: RoR, Registration, Encumbrances, Mortgages, Disputes, Planning, Building Permissions, Crosscheck.
"""
import pytest


def test_get_ownership(client, revenue_token):
    res = client.get("/api/v1/parcels/P-1027/ownership", headers={"Authorization": f"Bearer {revenue_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "owner_name" in data[0]


def test_get_ror_record(client, revenue_token):
    res = client.get("/api/v1/parcels/P-1027/ror", headers={"Authorization": f"Bearer {revenue_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["ulpin"] == "IN-PB-CHD-0001027"
    assert "owner_name" in data[0]


def test_get_registration_record(client, revenue_token):
    res = client.get("/api/v1/parcels/P-1027/registration", headers={"Authorization": f"Bearer {revenue_token}"})
    assert res.status_code == 200
    data = res.json()
    assert len(data) > 0
    assert "registration_id" in data[0]


def test_get_encumbrance_record(client, revenue_token):
    res = client.get("/api/v1/parcels/P-1027/encumbrance", headers={"Authorization": f"Bearer {revenue_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)


def test_get_planning_records(client, revenue_token):
    res = client.get("/api/v1/parcels/P-1027/planning", headers={"Authorization": f"Bearer {revenue_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["ulpin"] == "IN-PB-CHD-0001027"


def test_get_building_permission(client, revenue_token):
    res = client.get("/api/v1/parcels/P-1027/building", headers={"Authorization": f"Bearer {revenue_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "permission_id" in data[0]


def test_get_restrictions(client, revenue_token):
    res = client.get("/api/v1/parcels/P-1027/restrictions", headers={"Authorization": f"Bearer {revenue_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)


def test_planning_crosscheck(client, revenue_token):
    res = client.get("/api/v1/parcels/P-1027/planning-crosscheck", headers={"Authorization": f"Bearer {revenue_token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["ulpin"] == "IN-PB-CHD-0001027"
    assert "crosscheck_status" in data
    assert "explanation" in data
