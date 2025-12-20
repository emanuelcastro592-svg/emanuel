@echo off
echo ========================================
echo   Enviar Codigo para GitHub com Git
echo ========================================
echo.

REM Verificar se Git está instalado
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Git nao encontrado!
    echo.
    echo Baixe e instale o Git:
    echo https://git-scm.com/download/win
    echo.
    echo Depois execute este script novamente.
    echo.
    pause
    exit /b 1
)

REM Navegar para o diretório do projeto
cd /d "%~dp0"

echo Inicializando Git...
call git init

echo.
echo Adicionando arquivos...
call git add .

echo.
echo Fazendo commit...
call git commit -m "Initial commit"

echo.
echo Conectando ao GitHub...
call git remote remove origin >nul 2>&1
call git remote add origin https://github.com/emanuelcastro592-svg/emanuel.git

echo.
echo Enviando para GitHub...
echo (Pode pedir seu usuario e senha do GitHub)
call git branch -M main
call git push -u origin main

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo   Codigo enviado com sucesso!
    echo ========================================
    echo.
    echo Agora volte no Render e clique em:
    echo "Manual Deploy" -^> "Deploy latest commit"
    echo.
) else (
    echo   ERRO ao enviar!
    echo ========================================
    echo.
    echo Verifique:
    echo 1. Se o Git esta instalado
    echo 2. Se voce tem acesso ao repositorio
    echo 3. Se sua senha/usuario esta correto
    echo.
)

pause


