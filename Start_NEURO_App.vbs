Set WshShell = CreateObject("WScript.Shell")
strPath = "d:\Code paradox\Code\Antigravity\Nuro"

' 1. Start Python Backend Server silently on Port 8000
WshShell.Run "cmd /c cd /d """ & strPath & "\backend"" && python -m uvicorn main:app --port 8000", 0, False

' 2. Start Frontend Vite Server silently on Port 5173
WshShell.Run "cmd /c cd /d """ & strPath & """ && npm run dev", 0, False

' 3. Wait 3.5 seconds for Vite server to boot up, then open browser
WScript.Sleep 3500
WshShell.Run "http://localhost:5173"
