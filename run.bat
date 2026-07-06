@echo off
cd /d "%~dp0"
echo ========================================
echo   InMoov Control Deck
echo ========================================

if not exist "frontend\node_modules\" (
  echo Installing frontend dependencies...
  cd frontend
  call npm install
  cd ..
)

echo Building React UI...
cd frontend
call npm run build
if errorlevel 1 (
  echo Build failed. Fix errors above and retry.
  cd ..
  pause
  exit /b 1
)
cd ..

echo.
echo Starting Flask backend...
echo Open http://localhost:5000 in your browser
echo.
python app.py