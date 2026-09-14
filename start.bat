@echo off
title NURO Launcher
color 0A

echo.
echo  ¦¦¦+   ¦¦+¦¦+   ¦¦+¦¦¦¦¦¦+  ¦¦¦¦¦¦+
echo  ¦¦¦¦+  ¦¦¦¦¦¦   ¦¦¦¦¦+--¦¦+¦¦+---¦¦+
echo  ¦¦+¦¦+ ¦¦¦¦¦¦   ¦¦¦¦¦¦¦¦¦++¦¦¦   ¦¦¦
echo  ¦¦¦+¦¦+¦¦¦¦¦¦   ¦¦¦¦¦+--¦¦+¦¦¦   ¦¦¦
echo  ¦¦¦ +¦¦¦¦¦+¦¦¦¦¦¦++¦¦¦  ¦¦¦+¦¦¦¦¦¦++
echo  +-+  +---+ +-----+ +-+  +-+ +-----+
echo.
echo  Starting Nuro - Your Second Brain...
echo -----------------------------------------
echo.

:: --- Start Python Backend in a new window ---
echo  [1/2] Launching Python Backend (Port 8000)...
start "NURO Backend" cmd /k "cd /d "%~dp0backend" && pip install -r requirements.txt -q && python main.py"

timeout /t 3 /nobreak >nul

:: --- Start Vite Frontend in a new window ---
echo  [2/2] Launching React Frontend (Port 5173)...
start "NURO Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo -----------------------------------------
echo  ? Both servers are starting up!
echo.
echo  Frontend  ?  http://localhost:5173
echo  Backend   ?  http://localhost:8000
echo  API Docs  ?  http://localhost:8000/docs
echo -----------------------------------------
echo.
echo  Close the two terminal windows to stop Nuro.
echo.
pause
