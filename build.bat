@echo off
echo ================================
echo   Nav Accounting Build Process
echo ================================
echo.

echo [*] Starting build process...
cd client

echo [*]  Building the project...
call npm run build

echo [*] Preparing to commit changes...
git add .

echo [*] Committing changes...
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (
    set MM=%%a
    set DD=%%b
    set YYYY=%%c
)
git commit -m "Commit on %YYYY%-%MM%-%DD%"

echo.
echo ================================
echo [+] Build process completed!
echo ================================
