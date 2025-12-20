@echo off
echo ========================================
echo   VER LOGS DO SITE
echo ========================================
echo.

if exist "backend.log" (
    echo === LOGS DO BACKEND ===
    type backend.log
    echo.
) else (
    echo Nenhum log do backend encontrado.
    echo.
)

if exist "frontend.log" (
    echo === LOGS DO FRONTEND ===
    type frontend.log
    echo.
) else (
    echo Nenhum log do frontend encontrado.
    echo.
)

pause

