@echo off
cd /d "%~dp0"
echo ========================================
echo   InMoov Control Deck
echo ========================================

if not exist "models\inmoov\meshes\l_thumb5_1.stl" (
  echo Downloading official InMoov meshes from MyRobotLab/inmoov_ros...
  python scripts\download_inmoov_meshes.py
)
echo Downloading official InMoov legs + compiling full URDF...
python scripts\import_official_leg_stls.py
python scripts\compile_inmoov_ros_urdf.py

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