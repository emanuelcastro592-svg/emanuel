@echo off
echo ========================================
echo   INICIAR SITE COMO SERVIÇO
echo ========================================
echo.
echo Este script vai configurar o site para
echo rodar automaticamente em background,
echo sem mostrar janelas, como um site normal!
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

REM Verificar se PM2 esta instalado
where pm2 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Instalando PM2...
    call npm install -g pm2
    if %ERRORLEVEL% NEQ 0 (
        echo ERRO ao instalar PM2!
        pause
        exit /b 1
    )
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

REM Parar processos anteriores
echo Parando processos anteriores...
call pm2 stop all >nul 2>&1
call pm2 delete all >nul 2>&1

REM Iniciar com PM2
echo.
echo Iniciando site em background...
call pm2 start ecosystem.config.js

REM Salvar configuração
call pm2 save

REM Configurar inicio automatico
echo.
echo Configurando inicio automatico ao ligar o PC...
echo.
call pm2 startup

echo.
echo ========================================
echo   SITE CONFIGURADO COMO SERVIÇO!
echo ========================================
echo.
echo O site esta rodando em background!
echo.
echo Acesse: http://localhost:3000
echo.
echo O site vai:
echo   - Rodar sem mostrar janelas
echo   - Continuar rodando mesmo fechando tudo
echo   - Iniciar automaticamente ao ligar o PC
echo.
echo Para ver o status:
echo   pm2 status
echo.
echo Para parar:
echo   Execute: PARAR-SITE-PM2.bat
echo.
pause

