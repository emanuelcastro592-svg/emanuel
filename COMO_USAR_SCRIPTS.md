# Como Usar os Scripts para Rodar o Site Sem o Cursor

Este guia explica como iniciar e parar o servidor e cliente sem precisar do Cursor aberto.

## Opção 1: Usando Scripts Batch (Mais Fácil)

### Iniciar o Site
1. Clique duas vezes no arquivo **`INICIAR-SITE.bat`**
2. Duas janelas do PowerShell serão abertas (minimizadas) executando o servidor e o cliente
3. O site estará disponível em:
   - **Servidor**: http://localhost:5000
   - **Cliente**: http://localhost:3000

### Parar o Site
1. Clique duas vezes no arquivo **`PARAR-SITE.bat`**
2. Todos os processos serão encerrados

## Opção 2: Usando Scripts PowerShell (Mais Controle)

### Iniciar Tudo
Abra o PowerShell e execute:
```powershell
.\iniciar-tudo.ps1
```

### Iniciar Apenas o Servidor
```powershell
.\iniciar-servidor.ps1
```

### Iniciar Apenas o Cliente
```powershell
.\iniciar-cliente.ps1
```

### Parar Tudo
```powershell
.\parar-tudo.ps1
```

### Parar Apenas o Servidor
```powershell
.\parar-servidor.ps1
```

### Parar Apenas o Cliente
```powershell
.\parar-cliente.ps1
```

## Notas Importantes

1. **Primeira Execução**: Se for a primeira vez, certifique-se de ter instalado as dependências:
   ```bash
   npm run install-all
   ```

2. **Janelas Minimizadas**: Os scripts abrem janelas do PowerShell minimizadas. Você pode restaurá-las na barra de tarefas para ver os logs.

3. **Fechar Manualmente**: Você também pode fechar as janelas do PowerShell que foram abertas para parar os processos.

4. **Portas em Uso**: Se as portas 3000 ou 5000 estiverem em uso, os scripts tentarão parar os processos existentes antes de iniciar novos.

5. **Reiniciar o Computador**: Após reiniciar o computador, você precisará executar os scripts novamente para iniciar o site.

## Verificar se Está Rodando

Para verificar se o servidor e cliente estão rodando, você pode:

1. Abrir o navegador e acessar:
   - http://localhost:3000 (cliente)
   - http://localhost:5000/api/test (servidor - deve retornar uma mensagem JSON)

2. Verificar processos no Gerenciador de Tarefas:
   - Procure por processos "node.exe"
   - Deve haver pelo menos 2 processos rodando

## Solução de Problemas

### Erro: "npm não é reconhecido"
- Certifique-se de que o Node.js está instalado e no PATH do sistema
- Reinicie o PowerShell após instalar o Node.js

### Erro: "Porta já em uso"
- Execute `PARAR-SITE.bat` ou `.\parar-tudo.ps1` primeiro
- Aguarde alguns segundos e tente novamente

### O site não abre no navegador
- Verifique se os processos estão rodando no Gerenciador de Tarefas
- Verifique se as portas 3000 e 5000 não estão bloqueadas pelo firewall
- Tente acessar http://localhost:5000/api/test para verificar se o servidor está respondendo




