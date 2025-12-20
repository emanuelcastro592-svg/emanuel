@echo off
echo ========================================
echo   Remover Inicio Automatico
echo ========================================
echo.

REM Remover tarefa agendada
schtasks /Delete /TN "IniciarSitePM2" /F >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo Tarefa removida com sucesso!
) else (
    echo Tarefa nao encontrada ou ja foi removida.
)

echo.
pause


