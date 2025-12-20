@echo off
echo ========================================
echo   Status do Site (PM2)
echo ========================================
echo.

REM Verificar se PM2 está instalado
where pm2 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo PM2 nao encontrado!
    echo.
    echo Execute primeiro: instalar-pm2.bat
    echo.
    pause
    exit /b 1
)

REM Mostrar status
call pm2 status

echo.
echo ========================================
echo   Comandos Uteis:
echo ========================================
echo.
echo Ver logs em tempo real:
echo   pm2 logs
echo.
echo Ver logs do servidor:
echo   pm2 logs servidor-api
echo.
echo Ver logs do cliente:
echo   pm2 logs cliente-react
echo.
echo Reiniciar tudo:
echo   pm2 restart all
echo.
pause



