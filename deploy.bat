@echo off
title PLOT360 Unified Production Deployment
echo ======================================================================
echo PLOT360 — Launching Unified Production Deployment
echo ======================================================================

echo [1/3] Building production frontend bundle (React + Vite)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend build failed!
    exit /b %ERRORLEVEL%
)

echo [2/3] Seeding demo database (240 parcels across 15 locations)...
cd backend
python scripts\seed_demo.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Database seeding failed!
    cd ..
    exit /b %ERRORLEVEL%
)

echo [3/3] Starting Unified Production Server on http://localhost:8000 ...
echo - Web Application: http://localhost:8000/
echo - Interactive OpenAPI Docs: http://localhost:8000/docs
echo - REST API: http://localhost:8000/api/v1/
echo ======================================================================
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
cd ..
