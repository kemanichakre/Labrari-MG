@echo off
REM ============================================================
REM  Start.bat — Local Development Launch Script (Windows)
REM ============================================================
REM  This script starts both the backend API and the frontend
REM  React dev server for local development (without Docker).
REM
REM  Prerequisites:
REM    1. MySQL 8.0 running locally
REM    2. Database created (run database/schema.sql)
REM    3. Node.js v18+ installed
REM
REM  Usage:
REM    Double-click this file or run:  start.bat
REM ============================================================

echo ========================================
echo  Library Management System — Local Dev
echo ========================================
echo.

REM ---- Check for Node.js ----
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found: 
node --version

REM ---- Install backend dependencies ----
echo.
echo [1/4] Installing backend dependencies...
cd /d "%~dp0backend"
if not exist "node_modules" (
    call npm install
) else (
    echo       Dependencies already installed.
)

REM ---- Install frontend dependencies ----
echo.
echo [2/4] Installing frontend dependencies...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    call npm install
) else (
    echo       Dependencies already installed.
)

REM ---- Start backend server ----
echo.
echo [3/4] Starting backend API (port 5000)...
cd /d "%~dp0backend"
start "Library Backend" cmd /c "npm run dev"

REM ---- Start frontend server ----
echo.
echo [4/4] Starting frontend dev server (port 3000)...
cd /d "%~dp0frontend"
start "Library Frontend" cmd /c "npm start"

echo.
echo ========================================
echo  Both servers are starting up!
echo  Backend:  http://localhost:5000/api
echo  Frontend: http://localhost:3000
echo.
echo  Close this window to stop both servers.
echo ========================================
echo.

pause

