@echo off
echo ========================================
echo   INICIAR SITE EM BACKGROUND
echo ========================================
echo.
echo Este script inicia o site em background
echo para funcionar sem o Cursor aberto.
echo.
echo O site ficara disponivel em:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.

REM Navegar para o diretorio do script
cd /d "%~dp0"

REM Verificar se Node.js esta instalado
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js nao encontrado!
    echo.
    echo Instale o Node.js primeiro:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verificar se as dependencias estao instaladas
if not exist "node_modules" (
    echo Instalando dependencias do backend...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERRO ao instalar dependencias do backend!
        pause
        exit /b 1
    )
)

if not exist "client\node_modules" (
    echo Instalando dependencias do frontend...
    cd client
    call npm install
    cd ..
    if %ERRORLEVEL% NEQ 0 (
        echo ERRO ao instalar dependencias do frontend!
        pause
        exit /b 1
    )
)

echo.
echo Iniciando servidor backend na porta 5000...
start /B cmd /c "node server/index.js" > backend.log 2>&1

echo Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo Iniciando frontend React na porta 3000...
start /B cmd /c "cd client && npm start" > frontend.log 2>&1

echo.
echo ========================================
echo   SITE INICIADO COM SUCESSO!
echo ========================================
echo.
echo O site esta rodando em background!
echo.
echo Acesse: http://localhost:3000
echo.
echo Para parar o site, execute:
echo   PARAR-SITE.bat
echo.
echo Para ver os logs:
echo   VER-LOGS.bat
echo.
pause
