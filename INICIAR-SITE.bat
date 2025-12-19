@echo off
echo ========================================
echo   Iniciando Servidor e Cliente
echo ========================================
echo.

REM Navegar para o diretório do script
cd /d "%~dp0"

REM Iniciar servidor em nova janela minimizada
start "Servidor" /MIN powershell -NoExit -Command "cd '%CD%'; npm run server"

REM Aguardar 2 segundos
timeout /t 2 /nobreak >nul

REM Iniciar cliente em nova janela minimizada
start "Cliente React" /MIN powershell -NoExit -Command "cd '%CD%\client'; npm start"

echo.
echo ========================================
echo   Servidor e Cliente iniciados!
echo ========================================
echo.
echo Servidor: http://localhost:5000
echo Cliente: http://localhost:3000
echo.
echo Para parar tudo, execute: PARAR-SITE.bat
echo Ou feche as janelas que foram abertas.
echo.
