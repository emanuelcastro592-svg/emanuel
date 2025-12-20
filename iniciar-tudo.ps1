# Script para iniciar servidor e cliente em background
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Servidor e Cliente" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Iniciar servidor
Write-Host "Iniciando servidor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath'; npm run server" -WindowStyle Minimized
Start-Sleep -Seconds 2

# Iniciar cliente
Write-Host "Iniciando cliente..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\client'; npm start" -WindowStyle Minimized

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servidor e Cliente iniciados!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Servidor: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Cliente: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para parar tudo, execute: .\parar-tudo.ps1" -ForegroundColor Yellow
Write-Host "Ou feche as janelas do PowerShell que foram abertas." -ForegroundColor Yellow




