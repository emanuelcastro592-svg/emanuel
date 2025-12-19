# Script para configurar início automático usando Agendador de Tarefas do Windows
# Execute como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configurando Início Automático" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está rodando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERRO: Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Clique com botão direito no arquivo e selecione:" -ForegroundColor Yellow
    Write-Host "'Executar como administrador'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Caminho do projeto
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$scriptPath = Join-Path $projectPath "INICIAR-SITE-PM2.bat"

# Nome da tarefa
$taskName = "IniciarSitePM2"

# Verificar se a tarefa já existe
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($existingTask) {
    Write-Host "Removendo tarefa existente..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

Write-Host "Criando tarefa agendada..." -ForegroundColor Green

# Criar ação (executar o script)
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$scriptPath`""

# Criar trigger (ao iniciar o Windows)
$trigger = New-ScheduledTaskTrigger -AtStartup

# Criar configurações
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable:$false

# Criar principal (executar como usuário atual)
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Highest

# Registrar a tarefa
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Inicia o site automaticamente quando o Windows iniciar" | Out-Null

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Configuração Concluída!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "O site agora iniciará automaticamente quando você reiniciar o PC!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para verificar a tarefa:" -ForegroundColor Yellow
Write-Host "  - Abra o Agendador de Tarefas do Windows" -ForegroundColor Gray
Write-Host "  - Procure por: $taskName" -ForegroundColor Gray
Write-Host ""
Write-Host "Para remover a tarefa:" -ForegroundColor Yellow
Write-Host "  - Execute: REMOVER-INICIO-AUTOMATICO.bat" -ForegroundColor Gray
Write-Host ""
pause

