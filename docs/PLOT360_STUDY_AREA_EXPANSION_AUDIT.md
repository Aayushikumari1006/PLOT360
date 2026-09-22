# PLOT360 — Study Area Expansion & Demo Data Audit

**Date:** 2026-09-22  
**Status:** AUDIT COMPLETE  
**Scope Mode:** Controlled Demo-Data + Study-Area Enhancement Only (Freeze on All Unrelated Features)

---

## 1. Executive Summary

This audit establishes the baseline architecture, existing assets, and exact boundary of changes for the PLOT360 Multi-Location Study Expansion and Targeted Metadata Cleanup.

The goal is to expand demo study locations across diverse Indian geographies, add 3–5 genuinely integrated demo plots per location linked through the existing parcel-centric data stack, provide easy-to-discover sample ULPINs, and suppress exactly two unwanted verbose UI status messages without degrading underlying cryptographic, audit, or integration capabilities.

---

## 2. Audit of Existing System State

### 2.1 Existing Study Areas & Locations
- **Locations in Backend (`Location` model):**
  - `chandigarh` (Sector 17, Punjab / UT, Lat: 30.7398, Lng: 76.7794)
  - `jaipur` (Rajasthan, Lat: 26.9124, Lng: 75.7873)
  - `varanasi` (Uttar Pradesh, Lat: 25.3176, Lng: 82.9739)
  - `pune` (Maharashtra, Lat: 18.5204, Lng: 73.8567)
  - `kochi` (Kerala, Lat: 9.9312, Lng: 76.2673)
- **Locations in Frontend (`mockData.js` / `DEMO_LOCATIONS`):**
  - `chandigarh`, `mohali`, `panchkula`, `patiala`, `ludhiana`, `amritsar`.

### 2.2 Existing Demo ULPINs & Seeded Plots
- Primary verified plot: `P-1027` / `IN-PB-CHD-0001027` (Sector 17, Chandigarh, Residential R-2)
- Secondary plots in Chandigarh: `P-1025` (`IN-PB-CHD-0001025`), `P-1026` (`IN-PB-CHD-0001026`), `P-1028`, `P-1029`, `P-1030`
- Satellite Mohali plot: `P-2041` (`IN-PB-SAS-0002041`)
- Satellite Panchkula plot: `P-3082` (`IN-HR-PKL-0003082`)

### 2.3 Existing Sentinel-2 Covered ROIs (`PLOT360_Sentinel2_2020_2025/`)
The canonical Sentinel-2 dataset contains **23 temporal pairs** (46 rasters, 2020 T1 and 2025 T2) across 8 distinct Indian land zones:
1. **Agricultural Zones:** `AGR_01`, `AGR_02`, `AGR_03` (Punjab / Haryana plain)
2. **Arid Zones:** `ARD_01`, `ARD_02`, `ARD_03` (Rajasthan Thar / semi-arid)
3. **Coastal Zones:** `CST_01`, `CST_02`, `CST_03` (Kerala / Maharashtra / Tamil Nadu)
4. **Forest Zones:** `FOR_01`, `FOR_02`, `FOR_03` (Western Ghats / Central India)
5. **Industrial Corridors:** `IND_01`, `IND_02`, `IND_03` (Gujarat / Maharashtra industrial)
6. **Mountain / Hill Terrain:** `MTN_01`, `MTN_02` (Himachal Pradesh / Shivalik)
7. **Rural Settlements:** `RUR_01`, `RUR_02` (Indo-Gangetic rural village clusters)
8. **Urban Metropolitan:** `URB_01` (Chandigarh), `URB_02` (Delhi NCR), `URB_03` (Bengaluru Urban), `URB_04` (Jaipur Urban)

*Rule:* Study areas matching these ROIs have `sentinel_coverage = true`. All other demo locations have `sentinel_coverage = false` (`SATELLITE_EVIDENCE_STATUS = NOT_AVAILABLE_FOR_THIS_DEMO_LOCATION`). No TIFFs will be touched, copied, or modified.

### 2.4 Existing APIs
- `GET /api/v1/parcels` — Multi-attribute & spatial bbox parcel querying
- `GET /api/v1/parcels/{ulpin}` — Full unified parcel profile & modules
- `GET /api/v1/gis/layers` — GIS layer catalog with 3-layer SIH taxonomy
- `GET /api/v1/gis/parcels/bbox` — Spatial bbox query with GeoJSON polygons and simplification
- `GET /api/v1/search` — Unified multi-attribute search
- `GET /api/v1/demo/targets` — Presentation Mode 10 targets
- `GET /api/v1/demo/steps` — Presentation sequence steps

### 2.5 Audit of Unwanted UI Metadata Messages
- **Source Found:** `src/components/parcel/UnifiedParcelModal.jsx` lines 390–397:
  ```jsx
  {activeTab !== 'overview' && activeTab !== 'ownership' && ... && (
    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
      Detailed department metadata synchronized for <strong>{activeTab.toUpperCase()}</strong>.
      <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--status-success)' }}>
        ✓ Official API payload cached and verified with cryptographic timestamp.
      </div>
    </div>
  )}
  ```
- **Preservation Assurance:** The underlying backend cryptographic verification, API connection synchronization, audit logs (`AuditLog`), and department metadata fields remain 100% active and untouched. Only this unpolished fallback text in the modal is removed/cleaned up to present actual structured parcel tab data.

---

## 3. Scope Boundary: Exact Files That Must Change vs. NOT Change

### 3.1 Files That MUST Change
1. `src/components/parcel/UnifiedParcelModal.jsx`
   - **Reason:** Remove ONLY the two specified verbose metadata strings; render real structured department records (planning, building, tax, utilities, liabilities) already loaded from `activeParcel`.
2. `src/data/mockData.js`
   - **Reason:** Add the expanded study locations and sample demo parcels with valid polygons to ensure offline/mock fallback matches backend seed exactly.
3. `src/components/layout/Topbar.jsx`
   - **Reason:** Add easy-to-discover sample ULPIN picker / location selector pill to allow immediate testing by judges/users without memorizing ULPINs.
4. `backend/app/routers/demo.py`
   - **Reason:** Add safe discovery endpoints: `/study-areas`, `/study-areas/{study_area_id}`, `/plots`, `/plots/{ulpin}`, `/sample-ulpins`, `/search`.
5. `backend/app/schemas/demo.py`
   - **Reason:** Pydantic schemas for study areas, sample ULPINs, and demo plots.
6. `backend/scripts/seed_demo.py`
   - **Reason:** Idempotently seed study areas and 3–5 fully integrated demo plots per location across Profiles A through H.
7. `backend/tests/test_study_expansion.py`
   - **Reason:** New automated test suite validating study areas, sample ULPINs, GIS geometry validity, RBAC, and absence of the two unwanted strings.

### 3.2 Files That MUST NOT Change
- `PLOT360_Sentinel2_2020_2025/*` (STRICTLY READ-ONLY, 0 modifications, 0 copies)
- `backend/app/ml/*` (AI model architectures, inference pipelines)
- `backend/app/auth/*` (RBAC rules, password hashing, JWT)
- `backend/app/routers/parcels.py`, `gis.py`, `services.py`, `workflows.py`, `taxation.py`, `governance.py`, etc.
- `src/components/gis/*` (Map engine, layer controls, styling)
- `src/components/ai/*` (AI modules, evidence viewer)
- `src/components/modules/*` (Governance, Planning, Citizen Services, Analytics, Admin, Health, Integration Hub)
- `src/index.css` (Colors, typography, layout, CSS variables)

---

## 4. Execution Plan
- **Phase 14 & 15:** Remove the two unwanted metadata strings from `UnifiedParcelModal.jsx` and render clean domain records.
- **Phase 2 & 5:** Define diverse study locations and parcel profiles (A–H) covering urban, peri-urban, rural, arid, and mountain settings.
- **Phase 3, 4, 9, 10, 11, 20:** Update `backend/scripts/seed_demo.py` with valid polygon geometries, linked ownership, RoR, registration, planning, tax, and utility records.
- **Phase 6 & 7:** Implement `/api/v1/demo/study-areas` and `/api/v1/demo/sample-ulpins` in `demo.py`.
- **Phase 8 & 16:** Add sample discovery entry point in Topbar and ensure global search can find new parcels and locations.
- **Phase 12, 13, 21, 24:** Run automated tests (pytest), build checks (`npm run build`), and verify RBAC enforcement.
- **Documentation:** Generate `PLOT360_STUDY_AREA_COVERAGE.md`, `PLOT360_SCOPE_CHANGE_AUDIT.md`, and `PLOT360_MULTI_LOCATION_FINAL_REPORT.md`.
