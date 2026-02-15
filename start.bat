@echo off
echo =====================================
echo Starting Portfolio Admin Panel
echo =====================================
echo.

echo Checking if MongoDB is running...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo WARNING: MongoDB doesn't appear to be running!
    echo Please start MongoDB before continuing.
    echo.
    pause
)

echo Starting Backend Server...
start "Portfolio Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo Starting Portfolio Frontend...
start "Portfolio Frontend" cmd /k "cd frontend && npm start"

echo Starting Admin Frontend...
start "Admin Frontend" cmd /k "cd admin-frontend && npm start"

echo.
echo =====================================
echo Servers are starting...
echo =====================================
echo Backend: http://localhost:5000
echo Portfolio: http://localhost:3000
echo Admin Panel: http://localhost:3001
echo.
echo Three new terminal windows have opened.
echo Close them to stop the servers.
echo.
