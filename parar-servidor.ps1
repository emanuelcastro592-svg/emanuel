# Script para parar o servidor
Write-Host "Parando servidor..." -ForegroundColor Yellow

# Parar processos na porta 5000 (servidor)
$portProcess = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($portProcess) {
    foreach ($pid in $portProcess) {
        try {
            $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Host "Encerrando processo na porta 5000 (PID: $pid - $($proc.ProcessName))" -ForegroundColor Yellow
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        } catch {
            # Processo já foi encerrado
        }
    }
    Write-Host "Servidor parado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Nenhum servidor em execução encontrado na porta 5000." -ForegroundColor Yellow
}

# Parar processos nodemon que possam estar rodando
$nodemonProcesses = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    try {
        $cmdLine = (Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine
        $cmdLine -like "*nodemon*" -or $cmdLine -like "*server/index.js*"
    } catch {
        $false
    }
}

if ($nodemonProcesses) {
    foreach ($process in $nodemonProcesses) {
        Write-Host "Encerrando processo nodemon (PID: $($process.Id))" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    }
}




