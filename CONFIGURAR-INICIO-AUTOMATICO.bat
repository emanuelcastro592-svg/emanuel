@echo off
echo ========================================
echo   Configurar Inicio Automatico
echo ========================================
echo.
echo Este script configura o site para iniciar
echo automaticamente quando o Windows iniciar.
echo.
echo IMPORTANTE: Execute como Administrador!
echo.
pause

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

REM Navegar para o diretório do script
cd /d "%~dp0"

REM Configurar PM2 para iniciar no boot
echo Configurando PM2 para iniciar no boot do Windows...
call pm2 startup

echo.
echo ========================================
echo   Configuracao Concluida!
echo ========================================
echo.
echo O site agora iniciara automaticamente
echo quando voce reiniciar o computador.
echo.
echo Certifique-se de que o site esta rodando:
echo Execute: INICIAR-SITE-PM2.bat
echo.
pause




