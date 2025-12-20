@echo off
echo ========================================
echo   RODAR SITE SEMPRE - NUNCA PARA
echo ========================================
echo.
echo Este script inicia o site e mantem
echo rodando continuamente, mesmo se fechar
echo o terminal ou o Cursor.
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

REM Verificar se PM2 esta instalado
where pm2 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo PM2 nao encontrado. Instalando PM2...
    call npm install -g pm2
    if %ERRORLEVEL% NEQ 0 (
        echo ERRO ao instalar PM2!
        echo.
        echo Tentando metodo alternativo...
        goto :start_without_pm2
    )
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

REM Parar processos anteriores se existirem
echo Parando processos anteriores...
call pm2 stop all >nul 2>&1
call pm2 delete all >nul 2>&1

REM Iniciar com PM2
echo.
echo Iniciando site com PM2 (permanente)...
call pm2 start ecosystem.config.js

REM Salvar configuração do PM2
call pm2 save

REM Configurar PM2 para iniciar no boot (opcional)
echo.
echo Deseja que o site inicie automaticamente ao ligar o PC? (S/N)
set /p auto_start=
if /i "%auto_start%"=="S" (
    echo Configurando inicio automatico...
    call pm2 startup
)

echo.
echo ========================================
echo   SITE RODANDO PERMANENTEMENTE!
echo ========================================
echo.
echo O site esta rodando e NAO VAI PARAR!
echo.
echo Acesse: http://localhost:3000
echo.
echo Comandos uteis:
echo   pm2 status    - Ver status
echo   pm2 logs     - Ver logs
echo   pm2 restart all - Reiniciar
echo   pm2 stop all - Parar
echo.
echo Para parar completamente:
echo   Execute: PARAR-SITE-PM2.bat
echo.
pause
exit /b 0

:start_without_pm2
echo.
echo Iniciando sem PM2 (metodo alternativo)...
echo.

REM Criar script VBS para rodar em background
echo Set WshShell = CreateObject("WScript.Shell") > start_backend.vbs
echo WshShell.Run "cmd /c cd /d %~dp0 && node server/index.js", 0, False >> start_backend.vbs

echo Set WshShell = CreateObject("WScript.Shell") > start_frontend.vbs
echo WshShell.Run "cmd /c cd /d %~dp0\client && npm start", 0, False >> start_frontend.vbs

echo Iniciando backend...
start /B wscript start_backend.vbs

echo Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo Iniciando frontend...
start /B wscript start_frontend.vbs

echo.
echo ========================================
echo   SITE INICIADO!
echo ========================================
echo.
echo O site esta rodando em background!
echo.
echo Acesse: http://localhost:3000
echo.
echo Para parar, execute: PARAR-SITE.bat
echo.
pause

