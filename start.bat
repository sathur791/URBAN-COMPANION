@echo off
echo ============================================
echo   Urban Companion - Starting Services
echo ============================================
echo.

set "NODE_DIR=C:\Users\varun\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
if exist "%NODE_DIR%" (
    set "PATH=%NODE_DIR%;%PATH%"
)

REM Start Backend
echo [1/2] Starting Backend API on port 8000...
start "UrbanBackend" cmd /k "cd /d "%~dp0backend" && .venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

REM Wait for backend
ping 127.0.0.1 -n 4 >nul

REM Start Frontend
echo [2/2] Starting Frontend on port 5173...
start "UrbanFrontend" cmd /k "cd /d "%~dp0frontend" && "%NODE_DIR%\node.exe" node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173"

REM Wait for frontend
ping 127.0.0.1 -n 4 >nul

echo.
echo ============================================
echo   ALL SERVICES RUNNING
echo ============================================
echo.
echo   Dashboard:  http://localhost:5173
echo   Backend:    http://localhost:8000
echo   API Docs:   http://localhost:8000/docs
echo.
echo   Press Ctrl+C or close the windows to stop.
echo ============================================
