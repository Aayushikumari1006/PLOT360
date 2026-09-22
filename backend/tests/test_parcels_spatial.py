"""
PLOT360 Backend — Parcel & Spatial Endpoints Tests
Section 51: Parcel list, ULPIN lookup, geometry, GeoJSON, bbox, point-in-polygon.
"""
import pytest


def test_get_parcels_list(client, citizen_token):
    res = client.get("/api/v1/parcels", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Verify P-1027 is present
    ids = [p["parcel_id"] for p in data]
    assert "P-1027" in ids


def test_get_parcel_by_ulpin(client, citizen_token):
    res = client.get("/api/v1/parcels/P-1027", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["parcel_id"] == "P-1027"
    assert data["ulpin"] == "IN-PB-CHD-0001027"
    assert data["district"] == "Chandigarh"
    assert "original_area" in data
    assert "original_unit" in data
    assert "standardized_area" in data


def test_get_parcel_geometry(client, citizen_token):
    res = client.get("/api/v1/parcels/P-1027/geometry", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "Feature"
    assert "geometry" in data
    assert data["geometry"]["type"] == "Polygon"
    assert "coordinates" in data["geometry"]
    assert len(data["geometry"]["coordinates"][0]) >= 4


def test_get_parcel_summary(client, citizen_token):
    res = client.get("/api/v1/parcels/P-1027/summary", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["parcel_id"] == "P-1027"
    assert data["ulpin"] == "IN-PB-CHD-0001027"
    assert data["district"] == "Chandigarh"
    assert data["polygon"] is not None
    assert len(data["polygon"]) >= 4


def test_get_parcel_timeline(client, citizen_token):
    res = client.get("/api/v1/parcels/P-1027/timeline", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_parcels_filter_by_location(client, citizen_token):
    res = client.get("/api/v1/parcels?location=chandigarh", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    for p in data:
        assert "chandigarh" in p["location"].lower()


def test_parcels_point_in_polygon_search(client, citizen_token):
    res = client.get("/api/v1/parcels?bbox=76.77,30.73,76.80,30.76", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
