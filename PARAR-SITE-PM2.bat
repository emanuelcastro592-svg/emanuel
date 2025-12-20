@echo off
echo ========================================
echo   PARAR SITE PERMANENTE
echo ========================================
echo.

REM Parar PM2
where pm2 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Parando processos PM2...
    call pm2 stop all
    call pm2 delete all
    echo PM2 parado!
) else (
    echo PM2 nao encontrado. Parando processos manualmente...
)

REM Parar processos Node.js nas portas
echo Parando processos nas portas 5000 e 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Parar processos wscript (VBS)
taskkill /F /IM wscript.exe >nul 2>&1

REM Limpar arquivos VBS temporarios
if exist "start_backend.vbs" del start_backend.vbs
if exist "start_frontend.vbs" del start_frontend.vbs

echo.
echo ========================================
echo   SITE PARADO!
echo ========================================
echo.
pause

