@echo off
echo =====================================
echo Starting Admin Panel Only
echo =====================================
echo.

echo Starting Backend Server...
start "Portfolio Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo Starting Admin Frontend...
start "Admin Frontend" cmd /k "cd admin-frontend && npm start"

echo.
echo =====================================
echo Servers are starting...
echo =====================================
echo Backend: http://localhost:5000
echo Admin Panel: http://localhost:3001
echo.
echo Two new terminal windows have opened.
echo Close them to stop the servers.
echo.
