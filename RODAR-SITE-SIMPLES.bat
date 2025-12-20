@echo off
echo ========================================
echo   RODAR SITE EM BACKGROUND (SIMPLES)
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

REM Parar processos anteriores nas portas 5000 e 3000
echo Parando processos anteriores...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do taskkill /F /PID %%a >nul 2>&1

REM Criar scripts VBS para rodar em background (sem janelas)
echo Criando scripts para rodar em background...

REM Script VBS para backend
echo Set WshShell = CreateObject("WScript.Shell") > start_backend.vbs
echo WshShell.CurrentDirectory = "%CD%" >> start_backend.vbs
echo WshShell.Run "cmd /c node server/index.js", 0, False >> start_backend.vbs

REM Script VBS para frontend
echo Set WshShell = CreateObject("WScript.Shell") > start_frontend.vbs
echo WshShell.CurrentDirectory = "%CD%\client" >> start_frontend.vbs
echo WshShell.Run "cmd /c npm start", 0, False >> start_frontend.vbs

REM Iniciar backend em background
echo.
echo Iniciando backend (porta 5000) em background...
start /B wscript start_backend.vbs

REM Aguardar backend iniciar
echo Aguardando 5 segundos...
timeout /t 5 /nobreak >nul

REM Iniciar frontend em background
echo Iniciando frontend (porta 3000) em background...
start /B wscript start_frontend.vbs

REM Limpar scripts VBS temporarios apos iniciar
timeout /t 2 /nobreak >nul
del start_backend.vbs >nul 2>&1
del start_frontend.vbs >nul 2>&1

echo.
echo ========================================
echo   SITE INICIADO EM BACKGROUND!
echo ========================================
echo.
echo O site esta rodando sem mostrar janelas!
echo.
echo Aguarde 20-30 segundos e acesse:
echo   http://localhost:3000
echo.
echo O site vai continuar rodando mesmo se:
echo   - Fechar este terminal
echo   - Fechar o Cursor
echo   - Fechar qualquer programa
echo.
echo Para parar o site:
echo   Execute: PARAR-SITE-SIMPLES.bat
echo.
echo Para verificar se esta rodando:
echo   Abra o navegador e acesse: http://localhost:3000
echo.
pause

