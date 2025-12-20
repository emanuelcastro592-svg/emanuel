@echo off
echo ========================================
echo   PERMITIR ACESSO PELO CELULAR
echo ========================================
echo.
echo Este script vai configurar o firewall
echo para permitir acesso pelo celular.
echo.

REM Verificar se está executando como administrador
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Execute como Administrador!
    echo.
    echo Clique com botao direito no arquivo
    echo e escolha "Executar como administrador"
    echo.
    pause
    exit /b 1
)

echo Configurando firewall para permitir acesso nas portas 3000 e 5000...
echo.

REM Adicionar regras de firewall para as portas
netsh advfirewall firewall add rule name="Site Backend Port 5000" dir=in action=allow protocol=TCP localport=5000 >nul 2>&1
netsh advfirewall firewall add rule name="Site Frontend Port 3000" dir=in action=allow protocol=TCP localport=3000 >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✅ Firewall configurado com sucesso!
    echo.
    echo Agora você pode acessar pelo celular!
    echo.
    echo Execute: VER-MEU-IP.bat
    echo Para ver qual IP usar no celular.
    echo.
) else (
    echo ⚠️ Algum erro ao configurar firewall.
    echo Tente desativar temporariamente o firewall.
    echo.
)

pause
