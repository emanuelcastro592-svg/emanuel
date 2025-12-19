@echo off
echo ========================================
echo   Parando Site (PM2)
echo ========================================
echo.

REM Verificar se PM2 está instalado
where pm2 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo PM2 nao encontrado!
    echo.
    pause
    exit /b 1
)

REM Parar todos os processos PM2
echo Parando processos...
call pm2 stop all
call pm2 delete all

echo.
echo ========================================
echo   Site parado!
echo ========================================
echo.
pause

