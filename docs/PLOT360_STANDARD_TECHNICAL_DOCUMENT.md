# PLOT360 — STANDARD TECHNICAL SPECIFICATION & ARCHITECTURAL REFERENCE

**Project:** PLOT360 — From Boundaries to Insights  
**Document Version:** 2.0.0-PROD  
**Specification Reference:** Land Stack Complete App Feature & UX Specification (Sections 1–93)  
**Problem Statement:** SIH — Land Governance in India  
**Date:** September 2026  
**Classification:** OFFICIAL / RESTRICTED TECHNICAL REFERENCE  

---

## 1. Executive Overview

PLOT360 is a parcel-centric digital Land Governance Operating Platform engineered in alignment with India's **Land Stack** paradigm. It establishes a unified, auditable, and geospatially verified digital core connecting cadastral boundaries, Unique Land Parcel Identification Numbers (ULPIN / Bhu-Aadhaar), Records of Rights (RoR), deed registrations, master plan zoning, building permissions, encumbrances, property taxation, utility linkages, and temporal satellite Earth observation (Sentinel-2 2020–2025).

The platform operates on an **authoritative single source of truth** pattern where the Cadastral Land Parcel serves as the master anchor for all cross-departmental records, transactions, citizen service deliveries, and AI-assisted governance intelligence.

---

## 2. API Standards & System Architecture

### 2.1 API Architectural Design
- **Protocol:** HTTP/1.1 and HTTP/2 over TLS 1.3.
- **Data Exchange Format:** JSON (`application/json`) with UTF-8 encoding. Geospatial features conform strictly to OGC GeoJSON RFC 7946 (`application/geo+json`).
- **Base URI:** `/api/v1`
- **Architectural Style:** Resource-oriented RESTful API with idempotent mutation operations, explicit status codes, and deterministic schema serialization via Pydantic v2.

### 2.2 Versioning Strategy
- Version prefix in URL path: `/api/v1/`.
- Minor backward-compatible modifications (e.g., non-breaking supplementary fields, aliases) do not bump URL major versions.
- Header-based API deprecation policies conform to RFC 8594 (`Deprecation` and `Sunset` headers).

### 2.3 Authentication Flow & Session Management
- **Authentication Scheme:** OAuth2 Bearer Token specification utilizing JSON Web Tokens (JWT) signed with HMAC-SHA256 (`HS256`).
- **Token Lifecycles:**
  - **Access Token:** Short-lived (30 minutes), carrying user identity (`sub`), assigned primary role, permissions array, and department scope.
  - **Refresh Token:** Long-lived (7 days), stored securely and revocable upon explicit logout.
- **Login Endpoint:** `POST /api/v1/auth/login` (accepts standard JSON payload `{"username": "...", "password": "..."}`).
- **Token Refresh Endpoint:** `POST /api/v1/auth/refresh`.
- **Identity Context:** `GET /api/v1/auth/me`.

### 2.4 Error Contract & Standardized Schemas
All client errors (4xx) and system exceptions (5xx) return a deterministic error schema:
```json
{
  "request_id": "req-9a8b7c6d5e4f",
  "code": "PERMISSION_DENIED",
  "message": "Citizen role is not authorized to transition official workflow instances.",
  "details": {
    "required_permission": "workflow:transition",
    "user_permissions": ["service:create", "service:read_own", "parcel:read"]
  }
}
```
**Standard Error Codes:**
- `AUTHENTICATION_ERROR` (401)
- `PERMISSION_DENIED` (403)
- `RESOURCE_NOT_FOUND` (404)
- `VALIDATION_ERROR` (422)
- `CONFLICT_ERROR` (409)
- `BACKEND_DATA_ERROR` (500)
- `INTEGRATION_ERROR` (502)
- `SUPERVISED_TRAINING_LABELS_UNAVAILABLE` (400)

---

## 3. Interoperability & Common Data Model

### 3.1 The Land Stack Paradigm
In accordance with the National Land Stack vision, PLOT360 federates disparate state and central government departmental silos without forcing destructive database restructuring. It models six core state institutional systems:
1. **Department of Revenue:** Authoritative Records of Rights (Jamabandi / Khasra-Khatauni), mutations, and land classifications.
2. **Department of Registration & Stamps:** Authoritative deed registrations, conveyance history, stamp duty records, and registered encumbrances.
3. **Town & Country Planning / Development Authority:** Master plans, zoning regulations, planning overlays, and environmental restriction buffers.
4. **Municipal Corporation / Urban Local Bodies:** Building plan approvals, completion certificates, and property tax assessments.
5. **Department of Finance / Fiscal Administration:** Property tax collection, valuation zone benchmarks (circle rates), and liability liens.
6. **Utility Providers (Power, Water, Gas, Telecom):** Service connections, infrastructure lines, and distribution networks.

### 3.2 Connector Abstraction & Simulation Fidelity
External systems connect through an abstracted connector protocol (`app/models/config_model.py` and `app/routers/integrations.py`).
- Connectors support configuration parameters, authentication schemes (API Key, OAuth2, Mutual TLS), health monitoring, and asynchronous sync triggers.
- **Simulation Transparency:** Connectors running against mock or sandboxed upstream systems are explicitly tagged as `SIMULATED`. The platform strictly forbids labeling simulated feeds as `LIVE`.

### 3.3 State Schema Heterogeneity & Flexible Extensions
Indian States and Union Territories exhibit substantial variance in terminology, units of measurement, and record schemas:
- **Canonical Schema:** Fixed standardized fields common to all Indian land systems (ULPIN, survey number, standardized area in square meters, centroid coordinates, WGS84 geometry, land use classification).
- **State-Specific Extensions (`state_extensions` JSONB):** Controlled, versioned extension dictionary preserving state-specific data (e.g., Punjab *Hadbast* numbers, Haryana *Murabba*, Maharashtra *CTS/Gat* numbers, Tamil Nadu *Patta/Chitta* identifiers).
- **Mapping Versioning (`StateFieldMapping`):** Every mapping from a state raw feed to the canonical schema maintains `mapping_id`, `version`, `effective_from`, `effective_to`, and `created_by` audit fields to guarantee historical data reproducability.

---

## 4. Complete Data Schemas

### 4.1 Master Anchor: Parcel & ULPIN
- **ULPIN (Bhu-Aadhaar):** A 14-to-18 character unique alphanumeric code generated from the geographic centroid and cadastral hierarchy (e.g., `IN-PB-CHD-0001027`).
- **Area Dual-Representation:**
  - `original_area`: Preserves the authentic numeric value from the source record (e.g., `2.5`).
  - `original_unit`: Preserves the local traditional unit (e.g., `acre`, `bigha`, `kanal`, `guntha`, `cent`).
  - `standardized_area`: System-wide SI normalized value in square meters (`m²`) calculated via verified mathematical constants (e.g., `10117.14`).
  - `standardized_unit`: Fixed as `sq_meters`.
  - `conversion_method`: Explicit formula metadata string (e.g., `1 acre = 4046.8564224 m²`).

### 4.2 Governance & Records
- **RoRRecord:** Khata number, Khasra number, Jamabandi year, cultivator/tenant remarks, mortgage remarks, revenue village code, and verification status (`PENDING`, `VERIFIED`, `REQUIRES_REVIEW`).
- **Ownership & OwnershipHistory:** Current owners with Aadhaar/PAN tokenized references, fractional shares (e.g., `1/2`), tenure type (`Freehold`, `Leasehold`), encumbrance flags, and chronological chain-of-title tracking mutations and inheritance transfers.
- **Registration:** Deed registration number, book/volume/page, execution date, presentation date, stamp duty paid, market value assessed, registrar office code.
- **Encumbrance & Mortgage:** Bank/institution name, loan account identifier, charge amount, charge type (`Lien`, `Simple Mortgage`, `Court Attachment`), creation date, discharge status.
- **Dispute:** Case number, court/forum (`Revenue Court`, `Civil Court`, `High Court`), petitioner, respondent, dispute nature (`Boundary`, `Title`, `Inheritance`), stay order status, date filed.
- **Aggregated Liabilities Dossier (`/parcels/{ulpin}/liabilities`):** Aggregates encumbrances, registered mortgages, active court disputes, and delinquent tax records into a unified risk posture.

### 4.3 Planning & Development
- **PlanningRecord:** Master plan reference (e.g., *Chandigarh Master Plan 2031*), designated land use category (`Residential`, `Commercial`, `Industrial`, `Agricultural`, `Public Utility`), zoning code, FAR (Floor Area Ratio) allowable, maximum height, ground coverage rules.
- **BuildingPermission:** Sanction application number, approval date, permitted floors, sanctioned built-up area, validity expiry, occupancy certificate status (`Pending`, `Issued`, `Revoked`).
- **Restriction:** Statutory buffer zones (`Eco-Sensitive Zone`, `Forest Reserve Buffer`, `Heritage Zone`, `Airport Funnel`, `Defense Clearance Zone`), restriction severity (`Absolute Prohibitive`, `Conditional Clearance Required`).

### 4.4 Fiscal & Utilities
- **PropertyTax:** Municipal Property Assessment Number (UPIC), fiscal year, assessed annual rateable value, gross tax levied, rebates, penalties, outstanding arrears, payment receipt number, verification status.
- **ValuationReference:** Circle rate / Guideline rate per square meter, road-facing factor, commercial potential multiplier, valuation notification year.
- **UtilityRecord & Infrastructure:** Consumer connection IDs for Power (DISCOM), Water Supply, Sewerage, Piped Natural Gas (PNG), and Telecom/Fiber; proximity to trunk road networks, substations, and storm-water drains.

---

## 5. GIS Standards & Spatial Engine

### 5.1 Official SIH 3-Layer Spatial Taxonomy
PLOT360 strictly classifies all geospatial datasets into the three official categories mandated by the Smart India Hackathon specification:
1. **CATEGORY 1 — BASE LAYER:**
   - Georeferenced cadastral boundaries.
   - High-precision parcel polygon geometry (`Polygon` / `MultiPolygon`).
   - Unique Land Parcel Identification Number (ULPIN) point centroids.
2. **CATEGORY 2 — ESSENTIAL / CORE GOVERNANCE LAYERS:**
   - Cadastral ownership & Record of Rights (RoR) overlays.
   - Deed registration boundaries.
   - Master plan zoning overlays.
   - Building permission footprints.
   - Encumbrance, mortgage, and dispute flag georeferences.
   - Official land use classification layers.
3. **CATEGORY 3 — ADDITIONAL / USE-CASE LAYERS:**
   - Power, water, gas, and sewer distribution networks.
   - Municipal property tax assessment zones.
   - State circle rate / valuation benchmark polygons.
   - Trunk road and mobility infrastructure networks.
   - Environmental restriction buffer zones (Forests, water bodies, coastal regulation zones).

### 5.2 Coordinate Reference Systems & Projections
- **Cadastral & Web Interchange:** EPSG:4326 (WGS84 ellipsoidal latitude/longitude coordinates) represented as standard GeoJSON RFC 7946.
- **Sentinel-2 Satellite Imagery:** Projected native raster coordinates in UTM Zone 43N (EPSG:32643) with high-precision affine geo-transforms.
- **Spatial Operators:** Point-in-polygon (`ST_Contains`), bounding-box clipping (`ST_Intersects` with bounding box filter), and centroid extraction (`ST_Centroid`).

### 5.3 Strict Data Separation Principle
- **Google Maps JS API:** Basemap presentation layer (Roadmap, Satellite, Terrain, Hybrid).
- **Cadastral Map:** Authoritative vector geometry defining property legal boundaries.
- **Sentinel-2 Earth Observation:** Dual-temporal raster evidence for monitoring environmental surface change.
- **Rule:** Raster boundary artifacts are NEVER converted into or confused with cadastral legal property boundaries.

---

## 6. Sentinel-2 Satellite Ingestion & AI Pipeline

### 6.1 Canonical Dataset Architecture
- **Source Location:** `PLOT360_Sentinel2_2020_2025/` at the project root.
- **Source Immutability:** Strictly read-only. Zero modifications, zero in-place mask creations, zero arbitrary copies.
- **Inventory:** 46 canonical GeoTIFF rasters organized into 23 temporal pairs:
  - 23 T1 observations (Baseline: 2020).
  - 23 T2 observations (Current: 2025).
- **Spectral Bands:** B02 (Blue), B03 (Green), B04 (Red), B08 (NIR), B11 (SWIR-1), B12 (SWIR-2) at 10m/20m spatial resolution.
- **Integrity Validation:** Automated streaming SHA-256 checksum computation, GDAL raster header inspection, and deterministic dataset fingerprinting (`dataset_fingerprint`).

### 6.2 Temporal Analysis & Supervised AI Boundary
- **Supervised Architecture:** Siamese Temporal U-Net with ResNet-34 feature backbone.
- **Supervised Training Safeguard (`LABEL_BLOCKED`):** Because the canonical 2020/2025 Sentinel dataset does not include verified ground-truth training masks, the model training endpoint is strictly locked to `LABEL_BLOCKED`. Under no circumstances are fake ground-truth masks synthesized.
- **Operational Analysis:** Dual-temporal raster differencing utilizing Normalized Difference Built-up Index (NDBI), Normalized Difference Vegetation Index (NDVI), and spectral Euclidean distance change indicators.
- **Evidence Dossier:** Every satellite insight produces a verifiable dossier linking T1/T2 observation IDs, checksums, CRS, resolution, change candidate geometry, cadastral parcel intersection, and human review status.
- **Terminology Rule:** All satellite-derived events are labelled:  
  *`"POTENTIAL CHANGE DETECTED — VERIFICATION REQUIRED"`*  
  The platform strictly forbids automated conclusions of "illegal construction" or "fraud" based on satellite evidence alone.

---

## 7. Workflow Automation & Citizen Service Delivery

### 7.1 Automated Multi-Departmental Orchestration
PLOT360 replaces superficial status flags with an orchestrated state machine (`app/models/workflow.py`):
1. **Service Submission:** Citizen or authorized agent submits request (e.g., Mutation, Demarcation, No Objection Certificate, Non-Encumbrance Certificate).
2. **Identifier Generation:** Permanent, unique request identifier formatted as `SR-YYYY-XXXXXX` (e.g., `SR-2026-001027`).
3. **Automated Department Dispatch:** Workflow routes to designated department (Revenue, Municipal, Planning, Registration).
4. **Prerequisite & Document Validation:** Automated validation of uploaded proof documents against state-mandated checklist.
5. **Cross-Domain Verification Checks:** Automated queries across RoR, court dispute registries, and encumbrance databases.
6. **Role-Based Task Assignment:** Field verification tasks assigned to designated jurisdictional officers.
7. **Transition Events & Audit:** Every state change records transition timestamp, actor ID, comments, and triggers citizen in-app notification.

### 7.2 Transaction Lifecycle States
`SUBMITTED` ➔ `DOCUMENTS_RECEIVED` ➔ `VERIFICATION` ➔ `DEPARTMENT_REVIEW` ➔ `FINAL_PROCESSING` ➔ `DECISION` (`APPROVED` / `REJECTED`).

---

## 8. Data Conflict, Duplicate Detection & Quality Engine

### 8.1 Multi-Source Discrepancy Detection
The Data Conflict Engine (`app/routers/conflicts.py`) cross-examines records between Revenue, Registration, and Municipal Tax databases for identical parcels:
- **Owner Name Variance:** Detects phonetic and lexical differences between registered owner and tax payer.
- **Area Discrepancies:** Flags differences exceeding configurable tolerance thresholds (e.g., > 2% variance between RoR area and deed area).
- **Status Contradictions:** Flags situations where a parcel is recorded as agricultural in Revenue records but commercial in Master Plan zoning.

### 8.2 Duplicate Parcel Detection
Identifies potential duplicate or overlapping parcel records using exact survey number matching and geographic proximity clustering.
- **Rule:** Candidate duplicates are marked `CANDIDATE` for officer adjudication; automated merging is strictly prohibited.

---

## 9. Decision-Support & Predictive Analytics

### 9.1 Transparent Analytical Indicators
In compliance with ethical AI principles, decision-support indicators (`/api/v1/analytics/decision-support`) provide deterministic, explainable metrics:
1. **Rapid Development Corridors:** Spatiotemporal clustering of building permissions and satellite change alerts identifying urban expansion frontiers.
2. **Record Inconsistency Hotspots:** Jurisdictional heatmaps identifying villages or urban wards exhibiting above-average conflict frequencies.
3. **Workflow Velocity & SLA Bottlenecks:** Time-to-resolution tracking across mutation and demarcation pipelines.
4. **Infrastructure Deficit Indices:** Proximity analysis identifying plotted parcels lacking formal access to trunk utility networks.

---

## 10. Security, RBAC & Information Governance

### 10.1 Role-Based Access Control (RBAC)
Server-side enforced RBAC spanning 8 distinct platform roles:
1. **Citizen (`citizen`):** Public search, Land Passport viewing, personal application tracking, service request initiation.
2. **Revenue Officer (`revenue_officer`):** Cadastral record management, RoR verification, mutation approvals, conflict adjudication.
3. **Registration Officer (`registration_officer`):** Deed registration verification, conveyance timeline inspection, encumbrance updates.
4. **Planning Officer (`planning_officer`):** Zoning review, master plan compliance, building permission issuance, satellite alert review.
5. **Municipal Officer (`municipal_officer`):** Urban property tax assessments, municipal service requests, utility linkage verification.
6. **Tax Officer (`tax_officer`):** Fiscal liability administration, circle rate updates, tax arrears recovery.
7. **Administrator (`administrator`):** User provisioning, connector configurations, state field mappings, workflow templates, system health monitoring.
8. **Auditor (`auditor`):** Read-only immutable access to system-wide audit logs, provenance trails, and security events.

### 10.2 4-Tier Information Classification
- `PUBLIC`: Open citizen data (ULPIN, parcel boundary, land use category, public notice).
- `AUTHORIZED_DEPARTMENT`: Inter-departmental governance records (building sanctions, tax assessment breakdown, service requests).
- `RESTRICTED`: Sensitive citizen data (masked Aadhaar/PAN tokens, owner contact details, court litigation documents).
- `AUDIT_ADMIN`: System cryptographic keys, security audit events, database connection secrets.

### 10.3 Comprehensive Audit & Provenance
Every read of sensitive data and every state mutation creates an immutable record in `audit_logs`:
- `actor_id`, `actor_role`, `department`, `action` (`CREATE`, `UPDATE`, `TRANSITION`, `REVIEW`, `LOGIN`, `EXPORT`), `resource_type`, `resource_id`, `ulpin`, `ip_address`, `request_id`, `old_values`, `new_values`, and `timestamp`.

---

## 11. Presentation Mode Specification
To facilitate executive and technical evaluations without fabricating data, PLOT360 includes a backend-driven Presentation Mode (`/api/v1/demo`):
- **10 Curated Demo Targets:** Centered on Chandigarh jurisdiction (UT context) and representative parcels including flagship anchor `P-1027` (`IN-PB-CHD-0001027`).
- **Standard 15-Step Evaluation Sequence:**
  1. *Executive Problem Framing* ➔ 2. *GIS Cadastral Layer Loading* ➔ 3. *Parcel Boundary Selection* ➔ 4. *ULPIN Resolution* ➔ 5. *Record of Rights (RoR)* ➔ 6. *Deed Registration History* ➔ 7. *Master Plan & Zoning* ➔ 8. *Building Permission Cross-Check* ➔ 9. *Property Tax & Valuation* ➔ 10. *Multi-Source Data Conflict* ➔ 11. *Sentinel-2 Temporal Satellite Evidence* ➔ 12. *Citizen Service Request (SR-2026-001027)* ➔ 13. *Departmental Workflow Transition* ➔ 14. *Interoperability Hub Connectors* ➔ 15. *National Scalability & State Heterogeneity Architecture*.
- **Session Lifecycle:** `POST /session`, `GET /session/{id}`, `POST /session/{id}/next`, `POST /session/{id}/reset`.

---

## 12. Deployment, Containerization & Operational Readiness

### 12.1 12-Factor Stateless Application Pattern
- **Stateless Application Process:** FastAPI backend instances store zero local session state in memory; all session data resides in database sessions or signed JWT tokens.
- **Environment Parity:** Configured via `pydantic-settings` reading from `.env` or system environment variables (`PLOT360_ENV`, `DATABASE_URL`, `JWT_SECRET_KEY`, `SENTINEL_DATASET_PATH`).

### 12.2 Production vs Development Database Strategy
- **Authoritative Production Spatial Engine:** PostgreSQL 16+ with PostGIS 3.4+ spatial extension enabling enterprise geospatial indexing (`GIST`) and native geometry calculations.
- **Development & CI/CD Fallback:** SQLite with spatial JSON simulation (`plot360_dev.db`), enabling lightweight local validation and zero-dependency automated testing while preserving identical API contracts.

### 12.3 Automated Health & Diagnostic Probes
- `GET /health/live`: Liveness probe for Kubernetes pod lifecycle.
- `GET /health/ready`: Readiness probe verifying database connectivity and dataset availability.
- `GET /health/detailed`: Comprehensive diagnostics reporting database dialect, table counts, PostGIS status, active connectors, AI dataset integrity, and memory utilization.

---

## 13. Genuine Known Limitations & Honest Architectural Disclosure
In strict accordance with the PLOT360 Truth-in-Implementation principle:
1. **Satellite AI Supervised Masks:** The canonical Sentinel-2 dataset contains authentic multispectral rasters but lacks ground-truth segmentation masks. Supervised training is truthfully locked as `LABEL_BLOCKED` until genuine ground-truth masks are provided.
2. **Upstream Departmental Integrations:** External department connectors are simulated via high-fidelity mock adapters (`SIMULATED`). They are never represented as live connections to state production servers.
3. **Legal Status Disclaimer:** All Land Passport and aggregated liability dossiers provide decision-support and administrative transparency; they do not constitute statutory judicial title certification.
