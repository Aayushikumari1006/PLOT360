"""
PLOT360 Backend — Auth & RBAC Security Tests
Section 51: Login, token handling, refresh, permissions, citizen restrictions, officer permissions.
"""
import pytest


def test_login_success(client):
    res = client.post("/api/v1/auth/login", json={"username": "admin@plot360.gov.in", "password": "Plot360Pass123!"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["email"] == "admin@plot360.gov.in"
    assert "administrator" in data["user"]["roles"]


def test_login_invalid_password(client):
    res = client.post("/api/v1/auth/login", json={"username": "admin@plot360.gov.in", "password": "WrongPassword"})
    assert res.status_code == 401
    assert res.json()["error"] == "AUTHENTICATION_ERROR"


def test_token_refresh(client):
    res = client.post("/api/v1/auth/login", json={"username": "revenue@plot360.gov.in", "password": "Plot360Pass123!"})
    assert res.status_code == 200
    refresh_token = res.json()["refresh_token"]

    refresh_res = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_res.status_code == 200
    assert "access_token" in refresh_res.json()


def test_get_me_endpoint(client, revenue_token):
    res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {revenue_token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "revenue@plot360.gov.in"
    assert "revenue_officer" in data["roles"]
    assert "ror:read" in data["permissions"]


def test_citizen_cannot_perform_officer_workflow_transition(client, citizen_token):
    # Citizen attempts to advance workflow
    res = client.post(
        "/api/v1/workflows/1/transition",
        headers={"Authorization": f"Bearer {citizen_token}"},
        json={"to_state": "DECISION", "comment": "Citizen trying to approve own request"}
    )
    assert res.status_code == 403
    assert res.json()["error"] == "PERMISSION_DENIED"
