# PLOT360 — From Boundaries to Insights

**A Unified Parcel-Centric Land Governance Operating Platform for India**

*Built for Smart India Hackathon (SIH) — Problem Statement: "Land Governance in India"*  
*Designed in strict alignment with the National Land Stack Architecture (Sections 1–93)*  

---

## LIVE APPLICATION URLS (VERIFIED RUNTIME)

The application has been launched and actively verified:

- **Frontend Web Application:** [http://localhost:5173](http://localhost:5173)
- **Backend REST API:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive OpenAPI Docs (Swagger UI):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) (also mirrored at `/api/docs`)
- **Alternative ReDoc Docs:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **System Health Endpoint:** [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

---

## 1. Overview
PLOT360 is an enterprise-grade digital land governance operating system designed to bridge India's fragmented land administrative silos into a single, cohesive, parcel-centric platform. By anchoring all records to the Unique Land Parcel Identification Number (ULPIN / Bhu-Aadhaar), PLOT360 federates cadastral survey maps, deed registrations, records of rights, urban planning, property taxation, municipal utility linkages, and temporal satellite Earth observation into an authoritative single source of truth.

## 2. SIH Problem Alignment
In India, land administration is historically divided across six distinct administrative departments:
1. **Department of Revenue & Land Records:** Records of Rights (RoR), Jamabandi, mutations.
2. **Department of Registration & Stamps:** Property deeds, conveyances, encumbrances.
3. **Town & Country Planning / Development Authorities:** Master plans, permissible FAR, zoning overlays.
4. **Urban Local Bodies / Municipal Corporations:** Building permissions, property tax assessments.
5. **Department of Finance:** Guideline values, circle rate benchmarks.
6. **Utility Providers:** Electricity, water, sewer, and gas connections.

PLOT360 solves this fragmentation by delivering a unified digital window, georeferenced GIS visualization, cross-department conflict detection, automated workflow orchestration, and AI-assisted change detection.

## 3. Core Product Principle
**The Cadastral Land Parcel is the Master Anchor.**  
Every legal right, deed transaction, tax assessment, utility connection, building sanction, and satellite observation links directly to the parcel's unique identity (ULPIN). No subsystem uses isolated, disconnected identifiers.

## 4. Multi-Location Demo Dataset & Multi-Plot GIS
> **IMPORTANT NOTICE:**  
> Demo parcel records and geometries are **illustrative sample data**, not official government parcel records. They are provided solely for demonstrating PLOT360's multi-departmental federation, spatial mapping, and decision support capabilities.

The dataset includes **240 curated demo study parcels** distributed evenly across **15 Indian locations** (exactly 16 parcels per location):

| # | Location | State / UT | Context | Parcels | Default Parcel | Sample ULPIN |
|---|----------|------------|---------|---------|----------------|--------------|
| 1 | **Chandigarh** | Punjab / UT | Urban UT | 16 | P-1027 | `IN-PB-CHD-0001027` |
| 2 | **Delhi** | Delhi (NCT) | Metropolitan Urban | 16 | P-1101 | `IN-DL-DEL-0001101` |
| 3 | **Bengaluru** | Karnataka | IT / Urban | 16 | P-1201 | `IN-KA-BLR-0001201` |
| 4 | **Mumbai** | Maharashtra | Coastal Mega-City | 16 | P-1301 | `IN-MH-MUM-0001301` |
| 5 | **Jaipur** | Rajasthan | Heritage Urban | 16 | P-2001 | `IN-RJ-JPR-0002001` |
| 6 | **Ahmedabad** | Gujarat | Commercial Urban | 16 | P-1401 | `IN-GJ-AHM-0001401` |
| 7 | **Lucknow** | Uttar Pradesh | State Capital Urban | 16 | P-1501 | `IN-UP-LKO-0001501` |
| 8 | **Hyderabad** | Telangana | IT / Urban | 16 | P-1601 | `IN-TG-HYD-0001601` |
| 9 | **Chennai** | Tamil Nadu | Coastal Urban | 16 | P-1701 | `IN-TN-CHN-0001701` |
| 10 | **Pune** | Maharashtra | Industrial / Urban | 16 | P-4001 | `IN-MH-PUN-0004001` |
| 11 | **Varanasi** | Uttar Pradesh | Riverine / Rural | 16 | P-3001 | `IN-UP-VNS-0003001` |
| 12 | **Anand** | Gujarat | Rural / Agricultural | 16 | P-1901 | `IN-GJ-AND-0001901` |
| 13 | **Shimla** | Himachal Pradesh | Mountain / Hill Slope | 16 | P-1801 | `IN-HP-SML-0001801` |
| 14 | **Solan** | Himachal Pradesh | Mountain / Corridor | 16 | P-1803 | `IN-HP-SOL-0001803` |
| 15 | **Kochi** | Kerala | Coastal / Wetland | 16 | P-5001 | `IN-KL-KOC-0005001` |

Every plot on the GIS map has valid closed coordinates, bounding box indexing, and interactive selection opening the unified parcel details panel.

## 5. Every Existing Topbar Control is Fully Functional
The topbar delivers 10 functional controls:
1. **Platform Dropdown:** Opens the Integrated Land Governance Platform architecture overview modal detailing connected sub-systems.
2. **Jurisdiction Selector:** Dynamic state selector filtering valid locations, re-centering the GIS map, and reloading jurisdiction-specific terminology.
3. **Location Selector:** Quick switcher across all 15 study locations; immediately pans GIS camera and loads the corresponding 16 demo parcels.
4. **Global Search:** Backend-driven search supporting 14-digit ULPIN, parcel ID, city/location, and scenario.
5. **Language Selector:** Real-time multi-lingual switcher across English (`en`), Hindi (`hi`), Punjabi (`pa`), and Marathi (`mr`).
6. **Notifications:** Live unread badge count, role-authorized notifications feed, and "Mark all as read" capability.
7. **Help Control:** Opens interactive Help modal with SIH problem statement guide, ULPIN specification, GIS navigation, and RBAC matrix.
8. **Device Controls:** Switches responsive viewport layout preview across Desktop, Tablet, and Mobile modes.
9. **Theme Control:** Toggles Light and Dark modes with high-contrast readable tokens.
10. **Role Selector (RBAC):** Authenticates securely with backend JWT to switch between all 8 authorized roles (`citizen`, `revenue_officer`, `registration_officer`, `planning_officer`, `municipal_officer`, `tax_officer`, `administrator`, `auditor`).

## 6. Strict Server-Side RBAC & Field-Level Filtering
- **Zero Client-Side Trust:** Permissions and information access are enforced server-side.
- **Role Isolation:** Citizens receive only public verified title records. Confidential loan amounts, mortgage references, tax collection arrears IDs, and internal officer AI inspection notes are completely stripped from HTTP API responses.
- **Role Switching:** Switching roles invalidates local caches and immediately re-fetches role-authorized data from the backend.
- **Privilege Escalation Resistance:** Parameter tampering, custom headers, and client state modifications are blocked with 403 Forbidden.

## 7. Real Satellite Temporal Evidence (Sentinel-2)
- **Canonical Sentinel-2 Source:** Flagship parcel P-1027 connects directly to the canonical Copernicus Sentinel-2 Level-2A dataset (`PLOT360_Sentinel2_2020_2025/`, 46 GeoTIFFs across 6 spectral bands: B2, B3, B4, B8, B11, B12).
- **Draggable Split Slider:** Interactive temporal comparison slider revealing real 2020 vs 2025 surface reflectance changes on P-1027.
- **Truthful NOT_AVAILABLE Behavior:** For demo parcels without genuine satellite observations, the system explicitly displays: `SATELLITE EVIDENCE NOT AVAILABLE FOR THIS DEMO PARCEL`.
- **Zero Fabrication:** Zero synthetic satellite imagery, zero modified TIFFs, and zero duplicated rasters. Supervised AI training remains truthfully `LABEL_BLOCKED` where genuine ground-truth masks do not exist.

## 8. Cinematic Presentation Mode
Presentation Mode executes an automated, API-backed guided tour of the REAL application:
- **Comprehensive Controls:** Play, Pause, Resume, Next, Previous, Restart, Exit, and Speed adjustments (`1x`, `1.5x`, `2x`).
- **20 Architecture Stages:** Walks through the entire SIH problem statement, ULPIN model, GIS cadastral overlay, RoR Jamabandi, registration deeds, zoning, building compliance, encumbrances, taxation, utilities, restrictions, satellite temporal evidence, AI human-in-the-loop review, cross-department conflicts, citizen services, workflows, analytics, legacy integrations, multi-state jurisdictions, and nationwide scalability.
- **Role & Language Aware:** Adapts explanations to the active user role and renders narration in the selected language.

## 9. Simulated Integrations
> **SIMULATED CONNECTOR NOTICE:**  
> The departmental connectors (e.g. Bhulekh, Bhoomi, AnyRoR, CERSAI, State DISCOM) represent **simulated demonstration adapters** built to OpenAPI 3.1 specifications. They illustrate how legacy state databases interface with PLOT360 without fabricating live government connections.

## 10. Running the Application

### Backend Startup:
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Frontend Startup:
```bash
npm run dev
```

### Run Automated Test Suite:
```bash
python -m pytest backend/tests -v
```

### Build Production Bundle:
```bash
npm run build
```
