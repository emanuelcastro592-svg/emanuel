@echo off
echo ========================================
echo   SEU IP LOCAL (PARA ACESSAR PELO CELULAR)
echo ========================================
echo.

echo Procurando seu IP local...
echo.

REM Obter IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    set IP=!IP: =!
    echo ========================================
    echo   SEU IP LOCAL:
    echo ========================================
    echo.
    echo   !IP!
    echo.
    echo ========================================
    echo   ACESSE PELO CELULAR:
    echo ========================================
    echo.
    echo   Backend:  http://!IP!:5000
    echo   Frontend: http://!IP!:3000
    echo.
    echo ========================================
    echo   IMPORTANTE:
    echo ========================================
    echo.
    echo 1. Celular e PC devem estar na MESMA rede WiFi
    echo.
    echo 2. Use o IP acima no navegador do celular
    echo.
    echo 3. Se nao funcionar, verifique o firewall do Windows
    echo.
    pause
    exit /b
)

echo ERRO: Nao foi possivel encontrar o IP local!
echo.
echo Tente executar manualmente:
echo   ipconfig
echo.
echo E procure por "IPv4"
echo.
pause
