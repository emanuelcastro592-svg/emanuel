# 🚀 Guia: Deixar o Site no Ar com PM2

## 📋 O Que é PM2?

PM2 é um gerenciador de processos profissional para Node.js que:
- ✅ Mantém o site rodando continuamente
- ✅ Reinicia automaticamente se houver falhas
- ✅ Pode iniciar automaticamente quando o Windows iniciar
- ✅ Monitora o uso de memória e CPU
- ✅ Mantém logs organizados

---

## 🎯 Passo a Passo Completo

### Passo 1: Instalar PM2

1. **Dê duplo clique em:** `instalar-pm2.bat`
2. Aguarde a instalação terminar
3. Se aparecer erro, execute como **Administrador** (clique com botão direito → "Executar como administrador")

### Passo 2: Iniciar o Site com PM2

1. **Dê duplo clique em:** `INICIAR-SITE-PM2.bat`
2. O site será iniciado e ficará rodando continuamente
3. Acesse: **http://localhost:3000**

### Passo 3: Configurar Início Automático (Opcional)

Se você quer que o site inicie automaticamente quando o Windows iniciar:

1. **Clique com botão direito em:** `CONFIGURAR-INICIO-AUTOMATICO.bat`
2. Selecione: **"Executar como administrador"**
3. Siga as instruções na tela
4. Pronto! O site iniciará automaticamente após reiniciar o PC

---

## 📊 Verificar Status do Site

**Dê duplo clique em:** `VER-STATUS-PM2.bat`

Isso mostra:
- ✅ Se o servidor está rodando
- ✅ Se o cliente está rodando
- ✅ Uso de memória
- ✅ Tempo de execução

---

## 🛑 Parar o Site

**Dê duplo clique em:** `PARAR-SITE-PM2.bat`

Isso para todos os processos do site.

---

## 📝 Comandos Úteis (PowerShell)

Se você quiser usar comandos diretamente no PowerShell:

### Ver status
```powershell
pm2 status
```

### Ver logs em tempo real
```powershell
pm2 logs
```

### Ver logs apenas do servidor
```powershell
pm2 logs servidor-api
```

### Ver logs apenas do cliente
```powershell
pm2 logs cliente-react
```

### Reiniciar tudo
```powershell
pm2 restart all
```

### Reiniciar apenas o servidor
```powershell
pm2 restart servidor-api
```

### Reiniciar apenas o cliente
```powershell
pm2 restart cliente-react
```

### Parar tudo
```powershell
pm2 stop all
pm2 delete all
```

---

## 🔍 Onde Ficam os Logs?

Os logs são salvos na pasta `logs/`:
- `logs/servidor-out.log` - Logs do servidor
- `logs/servidor-error.log` - Erros do servidor
- `logs/cliente-out.log` - Logs do cliente
- `logs/cliente-error.log` - Erros do cliente

---

## ✅ Vantagens do PM2

### Antes (sem PM2):
- ❌ Se o processo cair, você precisa reiniciar manualmente
- ❌ Se reiniciar o PC, precisa iniciar o site novamente
- ❌ Não há monitoramento de memória/CPU
- ❌ Logs ficam espalhados

### Agora (com PM2):
- ✅ Se o processo cair, PM2 reinicia automaticamente
- ✅ Pode iniciar automaticamente com o Windows
- ✅ Monitora memória e CPU
- ✅ Logs organizados em uma pasta
- ✅ Fácil de verificar status e gerenciar

---

## 🔧 Solução de Problemas

### "PM2 não é reconhecido"
- Execute `instalar-pm2.bat` novamente
- Certifique-se de que o Node.js está instalado
- Reinicie o PowerShell após instalar

### "Erro ao iniciar"
1. Verifique se as portas 3000 e 5000 estão livres
2. Execute `PARAR-SITE-PM2.bat` primeiro
3. Tente novamente com `INICIAR-SITE-PM2.bat`

### "Site não inicia automaticamente"
1. Certifique-se de executar `CONFIGURAR-INICIO-AUTOMATICO.bat` como Administrador
2. Verifique se o PM2 está salvo: `pm2 save`
3. Reinicie o computador e verifique

### "Quero desabilitar início automático"
Execute no PowerShell:
```powershell
pm2 unstartup
pm2 save
```

---

## 📋 Resumo dos Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `instalar-pm2.bat` | Instala o PM2 globalmente |
| `INICIAR-SITE-PM2.bat` | Inicia o site com PM2 |
| `PARAR-SITE-PM2.bat` | Para o site |
| `VER-STATUS-PM2.bat` | Mostra status dos processos |
| `CONFIGURAR-INICIO-AUTOMATICO.bat` | Configura início automático |
| `ecosystem.config.js` | Configuração do PM2 |

---

## 🎉 Pronto!

Agora seu site está configurado para rodar continuamente! 

**O site ficará no ar:**
- ✅ Mesmo se você fechar o Cursor
- ✅ Mesmo se houver uma falha (PM2 reinicia automaticamente)
- ✅ Mesmo após reiniciar o PC (se configurou início automático)

**Para acessar:** http://localhost:3000



