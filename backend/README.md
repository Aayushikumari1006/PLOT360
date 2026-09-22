# PLOT360 — Backend & Spatial AI Land Stack Engine

A parcel-centric Land Governance Operating Platform based on India's Land Stack concept, connecting cadastral parcels and ULPIN with ownership, RoR, deed registrations, planning, zoning, building sanctions, restrictions, property taxation, utilities, valuation references, workflows, citizen services, departmental integrations, immutable audit/provenance, GIS, temporal satellite analysis, and explainable AI-assisted decision support.

---

## 1. Core Architecture

- **Runtime Framework:** Python 3.11+ / 3.13, FastAPI (Asynchronous REST API under `/api/v1`)
- **Authoritative Production Database:** PostgreSQL 16 + PostGIS 3.4 (with GiST spatial indexes & GeoAlchemy2)
- **Local Development Fallback:** SQLite + Shapely (activated automatically when PostgreSQL/PostGIS is unreachable; accurately marked as development fallback, never falsely claiming native PostGIS GiST execution)
- **ORM & Migrations:** SQLAlchemy 2.0 (declarative relational mappings) & Alembic
- **Machine Learning & Vision:** PyTorch (Siamese Temporal U-Net change detection architecture with shared encoders, temporal fusion, and BCEDiceLoss), Rasterio, PyProj, Shapely
- **Security & Authorization:** Relational RBAC (`users`, `roles`, `permissions`, `user_roles`, `role_permissions`), JWT (OAuth2-compatible Bearer tokens), direct bcrypt password hashing

---

## 2. Directory Structure

```
PLOT360/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application entrypoint & middleware
│   │   ├── config.py                   # Pydantic BaseSettings & environment loader
│   │   ├── database.py                 # Dual PostGIS / SQLite-fallback engine
│   │   ├── dependencies.py             # Auth verification & RBAC permission guards
│   │   ├── storage.py                  # Local filesystem storage abstraction
│   │   ├── auth/                       # Password hashing, JWT issuance & RBAC
│   │   ├── models/                     # 13 domain ORM models (parcel, governance, planning...)
│   │   ├── schemas/                    # Pydantic v2 validation contracts
│   │   ├── routers/                    # 14 REST API routers (/api/v1/*)
│   │   ├── services/                   # Business logic (parcels, conflicts, AI, sync)
│   │   ├── ml/                         # Siamese U-Net, dataset validation & inference
│   │   └── utils/                      # Geo utilities, UTM projection, structured logging
│   ├── data/
│   │   ├── imagery/raw/                # 23 regions x 2 temporal years = 46 GeoTIFFs
│   │   └── models/                     # PyTorch model weights & configurations
│   ├── scripts/
│   │   ├── build_dataset.py            # Generates the 46 Sentinel-2 GeoTIFFs
│   │   ├── validate_dataset.py         # Metadata inspector & mask verifier
│   │   ├── train_change_model.py       # Siamese U-Net training pipeline
│   │   └── seed_demo.py                # Idempotent database seeder
│   └── tests/                          # 39 Pytest automated unit & integration tests
```

---

## 3. Environment Variables

Create `.env` in `backend/` based on `.env.example`:

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | Production PostgreSQL connection URL | `postgresql://plot360:plot360secure@localhost:5432/plot360` |
| `FALLBACK_SQLITE_URL` | Development SQLite database URL | `sqlite:///./plot360_dev.db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Strong 256-bit secret |
| `JWT_ACCESS_TOKEN_EXPIRE` | Access token lifespan in minutes | `480` (8 hours) |
| `JWT_REFRESH_TOKEN_EXPIRE` | Refresh token lifespan in days | `7` |
| `CORS_ORIGINS` | Allowed client origins | `["http://localhost:5173", "http://127.0.0.1:5173"]` |
| `STORAGE_PATH` | Base directory for documents & imagery | `./data` |

*Note: Google Maps API key (`VITE_GOOGLE_MAPS_API_KEY`) is strictly maintained on the client-side in Vite and is never handled or logged by the backend.*

---

## 4. Setup & Running

### Step 1: Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Database Setup & Seed
If Docker is available, start PostgreSQL/PostGIS:
```bash
docker-compose up -d postgres
```
If PostgreSQL is offline, the backend automatically utilizes `plot360_dev.db` with Shapely. Run the idempotent database seeder:
```bash
python scripts/seed_demo.py
```

### Step 3: Start FastAPI Server
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

---

## 5. Satellite Dataset Validation & AI Change Detection

### Satellite Dataset (Section 24)
- **Platform:** Google Earth Engine
- **Satellite:** Sentinel-2 Surface Reflectance Harmonized
- **Temporal Epochs:** 2020 (Baseline) & 2025 (Monitoring)
- **Coverage:** 23 geographic locations across 8 landscape categories (Urban, Agricultural, Industrial, Arid, Coastal, Mountainous, Forest, Rural).
- **Files:** 46 GeoTIFF rasters in `data/imagery/raw/` with 6 bands (B2 Blue, B3 Green, B4 Red, B8 NIR, B11 SWIR-1, B12 SWIR-2).

### Validate Dataset (Truthful Validation CLI)
```bash
python scripts/validate_dataset.py
```
*Reports verified raster dimensions, band counts, CRS, and ground-truth mask availability. Accurately reports that supervised model training is blocked until official mask annotations are provided.*

### Siamese Temporal U-Net (Section 28)
Implements a Siamese Temporal U-Net in PyTorch with:
1. Shared twin encoder extracting multi-scale feature hierarchies from T1 and T2 rasters.
2. Temporal fusion module (feature concatenation + absolute difference).
3. Decoder with skip connections producing pixel-wise change probabilities.
4. Cadastral intersection and explainable advisory alert generation:
   `"POTENTIAL CHANGE DETECTED — VERIFICATION REQUIRED"`

---

## 6. Truthfulness & Regulatory Guardrails

1. **No False Claims Rule (Section 58):**
   - The system never claims supervised training was performed without verified ground-truth masks.
   - External department connectors are truthfully labeled as `CONNECTED` or `SIMULATED`.
   - SQLite development fallback accurately reports engine type without claiming native PostGIS GiST operations.
2. **Advisory Language:**
   - AI predictions are strictly advisory and never automatically declare "illegal construction" or alter official government records. Administrative decisions are strictly reserved for human field verification officers.
3. **Persistent Field Verification:**
   - On-site verification decisions submitted by authorized officers persist permanently in the database across browser restarts and reloads.

---

## 7. Testing

Run the comprehensive 39-test test suite:
```bash
pytest backend/tests -v
```
All 39 tests cover Authentication, Relational RBAC, Spatial GeoJSON, Governance, Planning Cross-Checks, Tax & Utilities, Citizen Workflows, Data Conflicts, Duplicate Candidates, AI Pipeline, Integrations Hub, and System Health.
