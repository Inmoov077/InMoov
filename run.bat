@echo off
cd /d "%~dp0"
echo ========================================
echo   InMoove Control Deck
echo ========================================

if not exist "shared\gestures.json" (
  if exist "shared\mrl_gestures.json" (
    echo Syncing gestures.json...
    copy /Y "shared\mrl_gestures.json" "shared\gestures.json" >nul
  )
)

if not exist "models\inmoov\meshes\l_thumb5_1.stl" (
  echo Downloading official InMoov meshes...
  python scripts\download_inmoov_meshes.py
)
if exist "scripts\import_official_leg_stls.py" (
  echo Compiling full URDF...
  python scripts\import_official_leg_stls.py
  python scripts\compile_inmoov_ros_urdf.py
)

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
echo Starting InMoove Core + Flask...
echo Open http://localhost:5000
echo Studio: http://localhost:5000/robot
echo.
python app.py
