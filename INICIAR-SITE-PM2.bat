@echo off
echo ========================================
echo   Iniciando Site com PM2
echo ========================================
echo.

REM Navegar para o diretório do script
cd /d "%~dp0"

REM Criar pasta de logs se não existir
if not exist "logs" mkdir logs

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

REM Parar processos existentes (se houver)
echo Parando processos existentes...
call pm2 delete all >nul 2>&1

REM Iniciar servidor e cliente com PM2
echo Iniciando servidor e cliente...
call pm2 start ecosystem.config.js

REM Salvar configuração do PM2
echo Salvando configuração...
call pm2 save

echo.
echo ========================================
echo   Site iniciado com PM2!
echo ========================================
echo.
echo Servidor: http://localhost:5000
echo Cliente: http://localhost:3000
echo.
echo Comandos uteis:
echo   - Ver status: pm2 status
echo   - Ver logs: pm2 logs
echo   - Parar tudo: PARAR-SITE-PM2.bat
echo.
echo O site agora esta rodando continuamente!
echo Ele reiniciara automaticamente se houver falhas.
echo.
pause


