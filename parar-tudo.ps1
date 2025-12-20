# Script para parar servidor e cliente
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Parando Servidor e Cliente" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Parar servidor (porta 5000)
Write-Host "Parando servidor (porta 5000)..." -ForegroundColor Yellow
$serverProcess = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($serverProcess) {
    foreach ($pid in $serverProcess) {
        Write-Host "Encerrando processo servidor (PID: $pid)" -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Servidor parado!" -ForegroundColor Green
} else {
    Write-Host "Servidor não estava em execução." -ForegroundColor Gray
}

# Parar cliente (porta 3000)
Write-Host "Parando cliente (porta 3000)..." -ForegroundColor Yellow
$clientProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($clientProcess) {
    foreach ($pid in $clientProcess) {
        Write-Host "Encerrando processo cliente (PID: $pid)" -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Cliente parado!" -ForegroundColor Green
} else {
    Write-Host "Cliente não estava em execução." -ForegroundColor Gray
}

# Parar processos Node.js relacionados
Write-Host "Limpando processos Node.js relacionados..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    foreach ($process in $nodeProcesses) {
        try {
            $commandLine = (Get-CimInstance Win32_Process -Filter "ProcessId = $($process.Id)").CommandLine
            if ($commandLine -like "*server/index.js*" -or $commandLine -like "*react-scripts*" -or $commandLine -like "*nodemon*") {
                Write-Host "Encerrando processo Node.js (PID: $($process.Id))" -ForegroundColor Yellow
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
        } catch {
            # Ignorar erros ao obter command line
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Todos os processos foram parados!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green




