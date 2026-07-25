@echo off
echo ============================================
echo   Urban Companion - Starting Services
echo ============================================
echo.

REM Start Backend
echo [1/2] Starting Backend API on port 8000...
start "UrbanBackend" cmd /c "cd /d "%~dp0backend" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

REM Wait for backend
timeout /t 4 /nobreak >nul

REM Start Frontend
echo [2/2] Starting Frontend on port 5173...
start "UrbanFrontend" cmd /c "cd /d "%~dp0frontend" && npx vite --host 0.0.0.0 --port 5173"

REM Wait for frontend
timeout /t 5 /nobreak >nul

echo.
echo ============================================
echo   ALL SERVICES RUNNING
echo ============================================
echo.
echo   Dashboard:  http://localhost:5173
echo   Backend:    http://localhost:8000
echo   API Docs:   http://localhost:8000/docs
echo.
echo   Press any key to stop all services...
pause >nul

taskkill /FI "WINDOWTITLE eq UrbanBackend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq UrbanFrontend*" /F >nul 2>&1
echo Services stopped.
