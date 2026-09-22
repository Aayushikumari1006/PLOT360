"""
PLOT360 Backend — Pytest Test Configuration & Shared Fixtures
"""
import sys
import os
import pytest
from starlette.testclient import TestClient

# Ensure backend root is on path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database import engine, Base, SessionLocal, create_tables
from app.models.user import User, Role, Permission, UserRole, RolePermission
from scripts.seed_demo import seed


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Seed the database once for test session."""
    seed()


@pytest.fixture
def client():
    """Provides a TestClient for making API requests."""
    return TestClient(app)


@pytest.fixture
def admin_token(client):
    """Obtains a valid JWT token for administrator."""
    res = client.post("/api/v1/auth/login", json={"username": "admin@plot360.gov.in", "password": "Plot360Pass123!"})
    assert res.status_code == 200, res.text
    return res.json()["access_token"]


@pytest.fixture
def citizen_token(client):
    """Obtains a valid JWT token for citizen."""
    res = client.post("/api/v1/auth/login", json={"username": "citizen@plot360.gov.in", "password": "Plot360Pass123!"})
    assert res.status_code == 200, res.text
    return res.json()["access_token"]


@pytest.fixture
def revenue_token(client):
    """Obtains a valid JWT token for revenue_officer."""
    res = client.post("/api/v1/auth/login", json={"username": "revenue@plot360.gov.in", "password": "Plot360Pass123!"})
    assert res.status_code == 200, res.text
    return res.json()["access_token"]
