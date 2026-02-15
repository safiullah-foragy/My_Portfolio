@echo off
echo =====================================
echo Starting Portfolio Only
echo =====================================
echo.

echo Starting Backend Server...
start "Portfolio Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo Starting Portfolio Frontend...
start "Portfolio Frontend" cmd /k "cd frontend && npm start"

echo.
echo =====================================
echo Servers are starting...
echo =====================================
echo Backend: http://localhost:5000
echo Portfolio: http://localhost:3000
echo.
echo Two new terminal windows have opened.
echo Close them to stop the servers.
echo.
