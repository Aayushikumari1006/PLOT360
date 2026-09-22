# PLOT360 — Production Deployment Guide

## 1. Architecture Overview

PLOT360 uses a **unified single-origin full-stack architecture**:
- **Frontend**: React 18 + Vite SPA built to `dist/`.
- **Backend**: FastAPI (Python 3.13) serving all REST endpoints under `/api/v1` and static assets from `dist/` at the root `/`.
- **Database**: SQLite authoritative demo engine with PostgreSQL + PostGIS production compatibility.
- **Port**: Binds dynamically to `0.0.0.0:${PORT}` provided by the cloud hosting environment.

---

## 2. Cloud Hosting Target: Render

- **Platform**: Render Web Service
- **Service Name**: `plot360` (or `plot360-platform`)
- **Environment**: Docker or Native Python 3.13
- **Region**: Oregon (US West) or Frankfurt (EU)
- **Repository**: `https://github.com/Lucifer7636/Plot360`
- **Branch**: `main`

---

## 3. Build & Runtime Configuration

### Option A: Native Python (Fastest & Free Tier Compatible)
- **Build Command**: `pip install -r backend/requirements.txt` (Frontend is pre-compiled in `dist/`)
- **Start Command**: `cd backend && python scripts/seed_demo.py && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Option B: Docker Web Service (`Dockerfile`)
- **Dockerfile Path**: `./Dockerfile`
- **Docker Context**: `.`
- **Multi-Stage**: Node 20 builds Vite frontend; Python 3.13 slim runs FastAPI.

---

## 4. Environment Variables

| Variable | Recommended Value | Purpose |
|---|---|---|
| `APP_ENV` | `production` | Enables production security & logging |
| `HOST` | `0.0.0.0` | Binds to all network interfaces |
| `PORT` | Set automatically by Render (`10000` / `$PORT`) | Web service port |
| `JWT_SECRET` | Auto-generated secure 32+ char hex string | Signs auth tokens |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `480` | Token lifetime (8 hours) |
| `VITE_API_BASE_URL` | `/api/v1` | Relative same-origin API path |
| `DATABASE_URL` | Optional (defaults to `sqlite:///./data/plot360.db`) | External PostgreSQL/PostGIS connection |

---

## 5. One-Click Blueprint Deployment (`render.yaml`)

The repository includes a ready-to-use `render.yaml` manifest.

To deploy automatically:
1. Navigate to: **`https://render.com/deploy?repo=https://github.com/Lucifer7636/Plot360`**
2. Click **Apply**.
3. Render automatically provisions the web service, mounts the static assets, and exposes the public URL.

---

## 6. Health & Diagnostic Endpoints

- **Public Health Check**: `https://<service-name>.onrender.com/api/v1/health`
- **Interactive OpenAPI Docs**: `https://<service-name>.onrender.com/api/docs`
- **Root SPA Application**: `https://<service-name>.onrender.com/`

---

## 7. Troubleshooting & Redeployment

- **Build Timeouts**: Ensure dependencies in `backend/requirements.txt` are pinned without heavy CUDA wheels. CPU wheels (`torch==2.5.1+cpu`) are used for lightweight cloud environments.
- **Port Binding**: Ensure the start command references `$PORT` rather than hardcoding `8000`.
- **Redeployment**: Any `git push origin main` triggers an automatic continuous deployment on Render.
