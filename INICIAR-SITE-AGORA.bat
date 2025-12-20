@echo off
echo ========================================
echo   INICIAR SITE AGORA
echo ========================================
echo.

REM Navegar para o diretorio do script
cd /d "%~dp0"

REM Verificar se Node.js esta instalado
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js nao encontrado!
    echo Instale o Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar dependencias
if not exist "node_modules" (
    echo Instalando dependencias do backend...
    call npm install
)

if not exist "client\node_modules" (
    echo Instalando dependencias do frontend...
    cd client
    call npm install
    cd ..
)

echo.
echo ========================================
echo   INICIANDO SITE
echo ========================================
echo.

REM Iniciar backend em nova janela
echo Iniciando backend (porta 5000)...
start "Backend - Porta 5000" cmd /k "node server/index.js"

REM Aguardar backend iniciar
echo Aguardando 5 segundos para backend iniciar...
timeout /t 5 /nobreak >nul

REM Iniciar frontend em nova janela
echo Iniciando frontend (porta 3000)...
start "Frontend - Porta 3000" cmd /k "cd client && npm start"

echo.
echo ========================================
echo   SITE INICIADO!
echo ========================================
echo.
echo Duas janelas foram abertas:
echo   1. Backend (porta 5000)
echo   2. Frontend (porta 3000)
echo.
echo Aguarde alguns segundos e acesse:
echo   http://localhost:3000
echo.
echo IMPORTANTE: Nao feche as janelas do terminal!
echo Se fechar, o site para de funcionar.
echo.
echo Para parar, feche as duas janelas do terminal.
echo.
pause
