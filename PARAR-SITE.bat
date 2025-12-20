@echo off
echo ========================================
echo   PARAR SITE
echo ========================================
echo.

REM Parar processos Node.js na porta 5000 (backend)
echo Parando servidor backend (porta 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Parar processos Node.js na porta 3000 (frontend)
echo Parando frontend React (porta 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Parar todos os processos node.exe relacionados ao projeto
echo Parando processos Node.js do projeto...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *NEW APP*" >nul 2>&1

echo.
echo ========================================
echo   SITE PARADO!
echo ========================================
echo.
pause

