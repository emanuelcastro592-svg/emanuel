@echo off
echo ========================================
echo   Enviando TUDO para GitHub Automaticamente
echo ========================================
echo.

REM Navegar para o diretório do projeto
cd /d "%~dp0"

REM Verificar se Git está instalado
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Git nao encontrado!
    echo.
    echo Tentando instalar Git automaticamente...
    echo.
    
    REM Tentar instalar via winget
    winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements 2>nul
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Nao foi possivel instalar Git automaticamente.
        echo.
        echo Por favor, instale manualmente:
        echo 1. Baixe: https://git-scm.com/download/win
        echo 2. Instale (deixe tudo padrao)
        echo 3. Execute este script novamente
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo Git instalado! Reiniciando script...
    echo.
    timeout /t 3 >nul
    
    REM Recarregar PATH
    call refreshenv >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Por favor, feche e abra o CMD/PowerShell novamente,
        echo ou reinicie o computador para o Git funcionar.
        echo.
        pause
        exit /b 1
    )
)

echo Inicializando Git...
call git init

echo.
echo Adicionando TODOS os arquivos...
call git add .

echo.
echo Fazendo commit...
call git commit -m "Initial commit - all files" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Nenhuma mudanca para commitar ou erro no commit.
    echo Continuando...
)

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
    echo   Arquivos enviados com SUCESSO!
    echo ========================================
    echo.
    echo Agora:
    echo 1. Va no Render.com
    echo 2. Clique em "Manual Deploy"
    echo 3. Selecione "Deploy latest commit"
    echo.
) else (
    echo   ERRO ao enviar!
    echo ========================================
    echo.
    echo Possiveis causas:
    echo 1. Git nao esta instalado corretamente
    echo 2. Voce nao tem acesso ao repositorio
    echo 3. Senha/usuario incorreto
    echo.
    echo Se pedir senha, use um Personal Access Token:
    echo https://github.com/settings/tokens
    echo.
    echo Ou faca o upload manual no GitHub.
    echo.
)

pause
