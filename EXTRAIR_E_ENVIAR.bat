@echo off
echo ========================================
echo   Extrair ZIP e Enviar para GitHub
echo ========================================
echo.

REM Navegar para o diretório do projeto
cd /d "%~dp0"

REM Verificar se o ZIP existe
if not exist "NEW-APP-LIGHT.zip" (
    echo ERRO: Arquivo NEW-APP-LIGHT.zip nao encontrado!
    echo.
    echo Execute primeiro: REDUZIR_TAMANHO.bat
    echo.
    pause
    exit /b 1
)

echo Extraindo ZIP...
if exist "temp_extract" rmdir /s /q "temp_extract"
mkdir "temp_extract"

powershell -Command "Expand-Archive -Path 'NEW-APP-LIGHT.zip' -DestinationPath 'temp_extract' -Force"

echo.
echo Copiando arquivos extraidos para a raiz...
xcopy /E /I /Y "temp_extract\*" "." >nul

echo.
echo Limpando arquivos temporarios...
rmdir /s /q "temp_extract"

echo.
echo ========================================
echo   Arquivos Extraidos!
echo ========================================
echo.
echo Agora vamos enviar para o GitHub...
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

echo Inicializando Git...
call git init

echo.
echo Adicionando arquivos...
call git add .

echo.
echo Fazendo commit...
call git commit -m "Deploy files extracted from ZIP"

echo.
echo Conectando ao GitHub...
call git remote remove origin >nul 2>&1
call git remote add origin https://github.com/emanuelcastro592-svg/emanuel.git

echo.
echo Enviando para GitHub...
echo (Pode pedir seu usuario e senha do GitHub)
call git branch -M main
call git push -u origin main --force

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo   Arquivos enviados com sucesso!
    echo ========================================
    echo.
    echo Agora:
    echo 1. Vá no Render.com
    echo 2. Clique em "Manual Deploy"
    echo 3. Selecione "Deploy latest commit"
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
    echo Se pedir senha, use um Personal Access Token:
    echo https://github.com/settings/tokens
    echo.
)

pause

