@echo off
echo ========================================
echo   VERIFICAR SE O SITE ESTA RODANDO
echo ========================================
echo.

echo Verificando processos nas portas 5000 e 3000...
echo.

echo PORTA 5000 (Backend):
netstat -aon | findstr ":5000"
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend esta rodando!
) else (
    echo ❌ Backend NAO esta rodando
)
echo.

echo PORTA 3000 (Frontend):
netstat -aon | findstr ":3000"
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend esta rodando!
) else (
    echo ❌ Frontend NAO esta rodando
)
echo.

echo ========================================
echo   TESTE NO NAVEGADOR:
echo ========================================
echo.
echo Abra o navegador e acesse:
echo   http://localhost:3000
echo.
echo Se abrir normalmente, o site esta funcionando!
echo.
pause

