@echo off
setlocal
cd /d "%~dp0"
if not exist "node_modules\electron\dist\electron.exe" (
  echo Electron is missing. Run npm ci first.
  pause
  exit /b 1
)
node scripts\build.mjs
if errorlevel 1 (
  pause
  exit /b 1
)
start "WeRoam Desktop Pet" "node_modules\electron\dist\electron.exe" "%~dp0." --pet-only
