@echo off
echo ========================================
echo   Configurar Inicio Automatico
echo   (Usando Agendador de Tarefas)
echo ========================================
echo.
echo IMPORTANTE: Execute como Administrador!
echo.
pause

REM Executar script PowerShell como administrador
powershell -ExecutionPolicy Bypass -File "%~dp0configurar-inicio-automatico-windows.ps1"

pause


