@echo off
echo ========================================
echo   Parando Servidor e Cliente
echo ========================================
echo.

REM Parar processos na porta 5000 (servidor)
echo Parando servidor (porta 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo Encerrando processo PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

REM Parar processos na porta 3000 (cliente)
echo Parando cliente (porta 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Encerrando processo PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ========================================
echo   Processos parados!
echo ========================================
echo.
pause



