# ======================================================================
# PLOT360 — Unified Production Deployment Runner (PowerShell)
# ======================================================================
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "PLOT360 — Launching Unified Production Deployment" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

Write-Host "`n[1/3] Building production frontend bundle (React + Vite)..." -ForegroundColor Yellow
cmd.exe /c "npm run build"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Frontend build failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n[2/3] Seeding demo database (240 parcels across 15 locations)..." -ForegroundColor Yellow
Push-Location backend
python scripts/seed_demo.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Database seeding failed!" -ForegroundColor Red
    Pop-Location
    exit $LASTEXITCODE
}

Write-Host "`n[3/3] Starting Unified Production Server on http://localhost:8000 ..." -ForegroundColor Green
Write-Host " - Web Application: http://localhost:8000/" -ForegroundColor Cyan
Write-Host " - Interactive OpenAPI Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host " - REST API: http://localhost:8000/api/v1/" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Green
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
Pop-Location
