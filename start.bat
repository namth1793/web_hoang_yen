@echo off
echo === Khoi dong ARTOCA Import Export Website ===
start "Backend :5031" cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 2 >nul
start "Frontend :5174" cmd /k "cd /d "%~dp0frontend" && npm run dev"
echo Backend:  http://localhost:5031
echo Frontend: http://localhost:5174
echo Admin:    http://localhost:5174/admin/login (admin/admin123)
