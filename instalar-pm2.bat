@echo off
echo ========================================
echo   Instalando PM2 Globalmente
echo ========================================
echo.
echo O PM2 e um gerenciador de processos profissional
echo que mantem seu site rodando continuamente.
echo.
pause

REM Instalar PM2 globalmente
echo Instalando PM2...
call npm install -g pm2

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   PM2 instalado com sucesso!
    echo ========================================
    echo.
    echo Agora voce pode:
    echo 1. Executar: INICIAR-SITE-PM2.bat
    echo 2. Executar: CONFIGURAR-INICIO-AUTOMATICO.bat
    echo.
) else (
    echo.
    echo ========================================
    echo   ERRO ao instalar PM2
    echo ========================================
    echo.
    echo Tente executar como Administrador:
    echo Clique com botao direito no arquivo e
    echo selecione "Executar como administrador"
    echo.
)

pause


