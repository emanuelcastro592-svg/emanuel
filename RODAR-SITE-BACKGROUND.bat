@echo off
echo ========================================
echo   RODAR SITE EM BACKGROUND
echo ========================================
echo.
echo O site vai rodar sem mostrar janelas!
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
    echo Instalando PM2 (gerenciador de processos)...
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

REM Parar processos anteriores se existirem
echo Parando processos anteriores...
call pm2 stop all >nul 2>&1
call pm2 delete all >nul 2>&1

REM Iniciar com PM2 em background
echo.
echo Iniciando site em background (sem janelas)...
call pm2 start ecosystem.config.js

REM Salvar configuração do PM2
call pm2 save

echo.
echo ========================================
echo   SITE RODANDO EM BACKGROUND!
echo ========================================
echo.
echo O site esta rodando sem mostrar janelas!
echo.
echo Acesse: http://localhost:3000
echo.
echo O site vai continuar rodando mesmo se:
echo   - Fechar este terminal
echo   - Fechar o Cursor
echo   - Fechar qualquer programa
echo.
echo Para ver o status:
echo   pm2 status
echo.
echo Para ver os logs:
echo   pm2 logs
echo.
echo Para parar o site:
echo   Execute: PARAR-SITE-PM2.bat
echo.
echo Para configurar inicio automatico ao ligar o PC:
echo   Execute: CONFIGURAR-INICIO-AUTOMATICO.bat
echo.
pause

