@echo off
echo ========================================
echo   PARAR SITE
echo ========================================
echo.

REM Parar processos Node.js nas portas 5000 e 3000
echo Parando processos do site...

REM Parar processos na porta 5000 (backend)
echo Parando backend (porta 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo Processo %%a encerrado
)

REM Parar processos na porta 3000 (frontend)
echo Parando frontend (porta 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo Processo %%a encerrado
)

REM Parar todos os processos node.exe relacionados
echo Parando processos Node.js...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ========================================
echo   SITE PARADO!
echo ========================================
echo.
echo Todos os processos foram encerrados.
echo.
pause

