@echo off
echo =====================================
echo Portfolio Admin Panel - Quick Start
echo =====================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo Step 2: Installing Frontend Dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo =====================================
echo Installation Complete!
echo =====================================
echo.
echo IMPORTANT: Before running the application:
echo 1. Make sure MongoDB is running
echo 2. Update backend/.env with your Supabase credentials
echo.
echo To start the application:
echo   - Backend: cd backend ^&^& npm run dev
echo   - Frontend: cd frontend ^&^& npm start
echo.
pause
