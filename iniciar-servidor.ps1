# Script para iniciar o servidor em background
Write-Host "Iniciando servidor..." -ForegroundColor Green

# Navegar para o diretório do projeto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Verificar se o servidor já está rodando
$existingProcess = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*server/index.js*" }
if ($existingProcess) {
    Write-Host "Servidor já está rodando na porta 5000" -ForegroundColor Yellow
    exit
}

# Iniciar servidor em background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath'; npm run server" -WindowStyle Minimized

Write-Host "Servidor iniciado em background!" -ForegroundColor Green
Write-Host "Para parar o servidor, execute: .\parar-servidor.ps1" -ForegroundColor Cyan
Write-Host "Ou feche a janela do PowerShell que foi aberta." -ForegroundColor Cyan



