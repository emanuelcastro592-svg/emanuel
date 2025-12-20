# Script para iniciar o cliente em background
Write-Host "Iniciando cliente React..." -ForegroundColor Green

# Navegar para o diretório do projeto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Verificar se o cliente já está rodando
$existingProcess = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*react-scripts*" }
if ($existingProcess) {
    Write-Host "Cliente já está rodando na porta 3000" -ForegroundColor Yellow
    exit
}

# Iniciar cliente em background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\client'; npm start" -WindowStyle Minimized

Write-Host "Cliente iniciado em background!" -ForegroundColor Green
Write-Host "Para parar o cliente, execute: .\parar-cliente.ps1" -ForegroundColor Cyan
Write-Host "Ou feche a janela do PowerShell que foi aberta." -ForegroundColor Cyan




