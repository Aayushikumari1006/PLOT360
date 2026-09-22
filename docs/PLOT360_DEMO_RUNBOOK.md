# PLOT360 — DEMO EVALUATION RUNBOOK & JUDGING GUIDE

**Project:** PLOT360 — From Boundaries to Insights  
**Document:** Official SIH Demonstration Runbook  
**Target Parcel Anchor:** `P-1027` (`IN-PB-CHD-0001027`)  
**Target Jurisdiction:** Chandigarh (Union Territory context)  
**Evaluator Target Session:** Presentation Mode / Live Interactive Walkthrough  

---

## 1. Quick Start & Application Launch

1. **Verify Backend API is Running:**
   - URL: `http://localhost:8000`
   - Health Probe: `http://localhost:8000/api/v1/health` ➔ `{"status": "ok", "service": "PLOT360 Backend API", "version": "1.0.0"}`
   - OpenAPI Docs: `http://localhost:8000/api/docs`

2. **Verify Frontend UI is Running:**
   - Web Application URL: `http://localhost:5173`
   - Open in any modern web browser (Chrome, Edge, Firefox, Safari).

3. **Demo Accounts:**
   - **Administrator:** `admin@plot360.gov.in` / `Plot360Pass123!`
   - **Revenue Officer:** `revenue@plot360.gov.in` / `Plot360Pass123!`
   - **Citizen:** `citizen@plot360.gov.in` / `Plot360Pass123!`

---

## 2. The 15-Stage Evaluator Journey

The presentation mode systematically demonstrates the solution to the SIH Problem Statement across 15 automated steps:

### Stage 1: Executive Problem Framing
- **What the Judge Sees:** Overview card outlining India's fragmented land governance silos across 6 separate state departments.
- **Backend Endpoint:** `GET /api/v1/demo/steps` (Step 1)
- **Takeaway:** PLOT360 federates these systems around the cadastral parcel without destructive national database restructuring.

### Stage 2: GIS Cadastral Layer Loading
- **What the Judge Sees:** Interactive Google Maps basemap overlaid with georeferenced cadastral parcel boundaries in Sector 17 / Sector 22, Chandigarh.
- **Backend Endpoint:** `GET /api/v1/gis/layers?official_category=BASE`
- **Spatial Taxonomy:** BASE layer category (cadastral boundaries and ULPIN centroids).

### Stage 3: Parcel Boundary Selection
- **What the Judge Sees:** Cadastral polygon for parcel `P-1027` highlighted in gold/blue with vertex coordinates and centroid coordinates (30.7333° N, 76.7794° E).
- **Backend Endpoint:** `GET /api/v1/parcels/IN-PB-CHD-0001027`

### Stage 4: ULPIN Resolution (Bhu-Aadhaar)
- **What the Judge Sees:** Generation and resolution of canonical ULPIN `IN-PB-CHD-0001027` along with dual-representation of area:
  - Original Area: `0.31 Acre` (from Revenue Record)
  - Standardized Area: `1,248.50 m²` (with mathematical conversion audit)
- **Backend Endpoint:** `GET /api/v1/parcels/IN-PB-CHD-0001027/summary`

### Stage 5: Record of Rights (RoR / Jamabandi)
- **What the Judge Sees:** Jamabandi Record showing Khata No. 1027, Khewat No. 44, recorded owner *Gurpreet Singh*, cultivation remarks, and official revenue status.
- **Backend Endpoint:** `GET /api/v1/parcels/IN-PB-CHD-0001027/ror`

### Stage 6: Deed Registration & Chain of Title
- **What the Judge Sees:** Deed Registration record `REG-P-1027-2022` executed at SRO Chandigarh on 14 Sep 2022. Conveyance from former owner *Harbhajan Singh* to *Gurpreet Singh* with stamp duty paid (`₹ 4,55,000`).
- **Backend Endpoint:** `GET /api/v1/parcels/IN-PB-CHD-0001027/registration` & `/ownership`

### Stage 7: Master Plan & Permissible Zoning
- **What the Judge Sees:** Chandigarh Master Plan 2031 overlay designating zone `R-2` (Residential Urban), permissible FAR (1.5), maximum height, and 40% ground coverage rule.
- **Backend Endpoint:** `GET /api/v1/parcels/IN-PB-CHD-0001027/planning` & `/zoning`

### Stage 8: Building Permission Cross-Check
- **What the Judge Sees:** Sanctioned building permit `PJB/BP/2024/012` approved on 05 Mar 2024 for `G + 2` floors. Automated planning cross-check validates compliance between land use, zoning, and building permit.
- **Backend Endpoint:** `GET /api/v1/parcels/IN-PB-CHD-0001027/building` & `/planning-crosscheck`

### Stage 9: Aggregated Liabilities & Encumbrances
- **What the Judge Sees:** Aggregated liabilities dossier displaying active bank lien (`State Bank of India`, loan `₹ 45,00,000`), active registered mortgage (`MORT-P-1027-2022`), and revenue court dispute (`DISP-CHD-2023-044`).
- **Backend Endpoint:** `GET /api/v1/parcels/IN-PB-CHD-0001027/liabilities`

### Stage 10: Property Tax Assessment & Municipal Status
- **What the Judge Sees:** Property Tax UPIC `PT-CHD-2024-8901`, annual rateable valuation, paid status receipt `RCP-9921`, and statutory circle rate benchmark (`₹ 48,500/m²`).
- **Backend Endpoint:** `GET /api/v1/parcels/IN-PB-CHD-0001027/tax` & `/valuation`

### Stage 11: Multi-Departmental Conflict Detection
- **What the Judge Sees:** Data Conflict Engine flagging `CONF-CHD-001` (Area Mismatch: `1,248.50 m²` in Cadastral RoR vs `1,310.00 m²` in Municipal Property Tax). Assigned to Revenue Officer for field review.
- **Backend Endpoint:** `GET /api/v1/conflicts`

### Stage 12: Sentinel-2 Temporal Satellite AI Evidence
- **What the Judge Sees:** Real dual-temporal satellite evidence comparing baseline observation T1 (2020) and observation T2 (2025) from the canonical Sentinel-2 46-raster repository.
  - Spectral Bands: 6 bands (B2, B3, B4, B8, B11, B12 at 10m/20m).
  - Alert: `POTENTIAL CHANGE DETECTED — VERIFICATION REQUIRED` (+385.4 m² change footprint).
  - Supervised AI Status: Truthfully disclosed as `LABEL_BLOCKED` due to absence of verified ground-truth training masks.
- **Backend Endpoint:** `GET /api/v1/ai/datasets`, `GET /api/v1/ai/change-events/EVT-CHD-2024-001/evidence`

### Stage 13: Citizen Service Delivery Flow
- **What the Judge Sees:** Submission of Demarcation Request resulting in unique, persistent tracking code `SR-2026-001027`, prerequisite document verification, and in-app citizen notification.
- **Backend Endpoint:** `POST /api/v1/citizen/service-requests`, `GET /api/v1/citizen/transactions/SR-2026-001027`

### Stage 14: Departmental Workflow Orchestration
- **What the Judge Sees:** Revenue Officer reviews the demarcation application, verifies prerequisites, transitions state from `SUBMITTED` ➔ `DOCUMENTS_RECEIVED` ➔ `VERIFICATION`, creating immutable audit log entries.
- **Backend Endpoint:** `POST /api/v1/workflows/{id}/transition`

### Stage 15: Interoperability Hub & National Scalability
- **What the Judge Sees:** Interoperability Hub showing 6 active departmental connectors (`Revenue`, `Registration`, `Planning`, `Municipality`, `Tax`, `Utilities`), recent synchronization jobs, and flexible state schema extensions supporting multi-state heterogeneity without hardcoded schemas.
- **Backend Endpoint:** `GET /api/v1/integrations`, `GET /api/v1/integrations/jobs`, `GET /api/v1/localization/config`

---

## 3. Truth-in-Implementation Disclosures for Evaluators

1. **Simulated Connectors:** Upstream state departmental APIs are clearly tagged as `SIMULATED`. They are not falsely labeled as live production feeds to state servers.
2. **Supervised Satellite ML:** The 46 Sentinel-2 rasters are authentic multispectral GeoTIFFs. Because ground-truth segmentation masks do not exist, supervised training is locked to `LABEL_BLOCKED`. Real exploratory temporal differencing and NDBI/NDVI spectral differencing are operational.
3. **Database Mode:** Tested and operational on local SQLite development database with PostGIS-compatible GeoJSON spatial operators; production environment targets PostgreSQL 16+ with PostGIS 3.4+.

---

## 4. Reset & Restart Instructions

If the demonstration needs to be restarted from the beginning:
1. Navigate to Presentation Mode in the top-right toolbar.
2. Click **Reset Demo** or execute via API:
   ```bash
   curl -X POST http://localhost:8000/api/v1/demo/session/reset
   ```
3. To restore initial demo database state:
   ```bash
   python backend/scripts/seed_demo.py
   ```
