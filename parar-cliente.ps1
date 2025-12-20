# Script para parar o cliente
Write-Host "Parando cliente..." -ForegroundColor Yellow

# Parar processos na porta 3000 (cliente)
$portProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($portProcess) {
    foreach ($pid in $portProcess) {
        try {
            $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Host "Encerrando processo na porta 3000 (PID: $pid - $($proc.ProcessName))" -ForegroundColor Yellow
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        } catch {
            # Processo já foi encerrado
        }
    }
    Write-Host "Cliente parado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Nenhum cliente em execução encontrado na porta 3000." -ForegroundColor Yellow
}

# Parar processos react-scripts que possam estar rodando
$reactProcesses = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    try {
        $cmdLine = (Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine
        $cmdLine -like "*react-scripts*"
    } catch {
        $false
    }
}

if ($reactProcesses) {
    foreach ($process in $reactProcesses) {
        Write-Host "Encerrando processo react-scripts (PID: $($process.Id))" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    }
}



