# Script PowerShell para enviar arquivos para GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Enviando TUDO para GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
Set-Location $PSScriptRoot

# Verificar Git
$gitPath = "C:\Program Files\Git\bin\git.exe"
if (-not (Test-Path $gitPath)) {
    $gitPath = "C:\Program Files (x86)\Git\bin\git.exe"
}

if (-not (Test-Path $gitPath)) {
    Write-Host "Git nao encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "O Git foi instalado, mas precisa reiniciar o terminal."
    Write-Host ""
    Write-Host "Opcoes:"
    Write-Host "1. Feche e abra um NOVO PowerShell/CMD"
    Write-Host "2. Execute este script novamente"
    Write-Host ""
    Write-Host "OU faca o upload manual no GitHub (mais facil agora)."
    Write-Host ""
    pause
    exit
}

Write-Host "Git encontrado! Continuando..." -ForegroundColor Green
Write-Host ""

Write-Host "Inicializando Git..." -ForegroundColor Yellow
& $gitPath init

Write-Host ""
Write-Host "Adicionando TODOS os arquivos..." -ForegroundColor Yellow
& $gitPath add .

Write-Host ""
Write-Host "Fazendo commit..." -ForegroundColor Yellow
& $gitPath commit -m "Initial commit - all files" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nenhuma mudanca ou erro no commit. Continuando..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Conectando ao GitHub..." -ForegroundColor Yellow
& $gitPath remote remove origin 2>$null
& $gitPath remote add origin https://github.com/emanuelcastro592-svg/emanuel.git

Write-Host ""
Write-Host "Enviando para GitHub..." -ForegroundColor Yellow
Write-Host "(Pode pedir seu usuario e senha do GitHub)" -ForegroundColor Cyan
& $gitPath branch -M main
& $gitPath push -u origin main --force

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Arquivos enviados com SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Agora:"
    Write-Host "1. Va no Render.com"
    Write-Host "2. Clique em 'Manual Deploy'"
    Write-Host "3. Selecione 'Deploy latest commit'"
    Write-Host ""
} else {
    Write-Host "  ERRO ao enviar!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Possiveis causas:"
    Write-Host "1. Voce nao tem acesso ao repositorio"
    Write-Host "2. Senha/usuario incorreto"
    Write-Host ""
    Write-Host "Se pedir senha, use um Personal Access Token:"
    Write-Host "https://github.com/settings/tokens"
    Write-Host ""
    Write-Host "OU faca o upload manual no GitHub."
    Write-Host ""
}

pause

