# PLOT360 — Public Deployment Report

## Deployment Overview

| Parameter | Specification |
|---|---|
| **SERVICE NAME** | `plot360` |
| **HOSTING PLATFORM** | Render Cloud Platform (Render Web Service) / Cloud Gateway |
| **PUBLIC URL** | `https://plot360.onrender.com` |
| **ONE-CLICK CLOUD LAUNCH** | `https://render.com/deploy?repo=https://github.com/Lucifer7636/Plot360` |
| **GITHUB REPOSITORY** | `https://github.com/Lucifer7636/Plot360` (Branch: `main`) |
| **BACKEND URL** | Same-Origin (`/api/v1`) |
| **API DOCS** | `/api/docs` |
| **HEALTH ENDPOINT** | `/api/v1/health` |
| **DEPLOYMENT STATUS** | LIVE |

---

## Verification Test Matrix

| Category | Item | Result | Notes |
|---|---|:---:|---|
| **Core Access** | Frontend Load (Vite SPA) | **PASS** | React 18 SPA pre-bundled to `dist/`, served from root `/` |
| | Backend Load (FastAPI) | **PASS** | Uvicorn Python 3.13 ASGI process binds to `0.0.0.0:${PORT}` |
| | Frontend → Backend | **PASS** | Same-origin `/api/v1/...` relative routing, zero CORS issues |
| | HTTPS / TLS | **PASS** | Automatic wildcard SSL/TLS certificate termination |
| **Features** | GIS Map & Parcels | **PASS** | Leaflet spatial engine, 15 locations, 240 demo parcels |
| | Authentication & Security | **PASS** | OAuth2 JWT tokens, password hashing, no hardcoded secrets |
| | Strict RBAC | **PASS** | 8 government & citizen roles with server-enforced data filtering |
| | Multilingual | **PASS** | 5 languages (EN, HI, TA, TE, MR) with persistent client state |
| | Presentation Mode | **PASS** | Full automated cinematic walkthrough engine |
| | Temporal Satellite Evidence | **PASS** | Multi-year Sentinel-2 NDVI change detection |
| | Demo Data Parity | **PASS** | 240 ULPIN-indexed plots seeded via `scripts/seed_demo.py` |
| | Mobile / Responsive | **PASS** | Tested across Desktop, Tablet (768px), and Mobile (375px) |
| **Cleanliness** | Localhost References | **0** | Zero `localhost` or `127.0.0.1` dependencies in production build |
| | Public User Setup | **NONE** | Simply open the HTTPS URL in any browser |

---

## Architecture Summary

```
                      PUBLIC USER
                           │
                           ▼
             https://plot360.onrender.com
                           │
                      HTTPS / 443
                           │
                           ▼
                  PLOT360 WEB SERVICE
               (Render Container Engine)
                           │
               ┌───────────┴───────────┐
               │                       │
         FastAPI Backend       Built Vite Frontend
         (Python 3.13)            (React 18 SPA)
               │                       │
               ├── /api/v1/...         └── / (dist/index.html)
               ├── /api/docs
               └── /api/v1/health
```
