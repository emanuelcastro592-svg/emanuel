# 🔧 Solução: Servidor Caiu (ERR_CONNECTION_REFUSED)

## ❌ O que aconteceu?

O erro **"ERR_CONNECTION_REFUSED"** significa que o servidor não está rodando. Isso pode acontecer quando:

1. ✅ Você fechou o terminal
2. ✅ O processo foi encerrado
3. ✅ O computador foi reiniciado
4. ✅ O servidor travou

## ✅ Solução Rápida

### Passo 1: Abrir o Terminal
Abra o PowerShell ou Terminal

### Passo 2: Navegar para o Projeto
```powershell
cd "C:\Users\User\Downloads\NEW APP"
```

### Passo 3: Iniciar o Servidor
```powershell
npm run dev
```

### Passo 4: Aguardar
Aguarde alguns segundos até ver:
- ✅ "Servidor rodando na porta 5000"
- ✅ "Compiled successfully!"
- ✅ Navegador abrir automaticamente

---

## 🔍 Verificar se Está Rodando

### Ver processos Node.js:
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue
```

Se aparecer processos, o servidor pode estar rodando.

### Verificar portas:
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

Se aparecer algo, a porta está em uso.

---

## 🚨 Problemas Comuns

### Problema 1: Porta já em uso
**Erro:** "Port 3000 is already in use"

**Solução:**
1. Feche outros programas que possam estar usando a porta
2. Ou o sistema perguntará se quer usar outra porta - digite `Y`

### Problema 2: Erro ao iniciar
**Solução:**
```powershell
# Parar tudo
Ctrl + C

# Limpar e reinstalar
npm cache clean --force
npm run install-all

# Tentar novamente
npm run dev
```

### Problema 3: Backend não inicia
**Verificar:**
1. Arquivo `.env` existe?
2. Conteúdo do `.env` está correto?
3. Dependências instaladas?

---

## 💡 Dica: Manter Servidor Rodando

### Não feche o terminal!
- O servidor precisa do terminal aberto
- Se fechar, o servidor para
- Deixe o terminal minimizado se necessário

### Executar em Background (Windows):
Você pode usar o PowerShell para executar em background, mas é mais fácil apenas deixar o terminal aberto.

---

## 📋 Checklist Rápido

- [ ] Terminal está aberto?
- [ ] Estou no diretório correto? (`C:\Users\User\Downloads\NEW APP`)
- [ ] Executei `npm run dev`?
- [ ] Aguardei o servidor iniciar?
- [ ] Navegador abriu automaticamente?

---

## 🎯 Comandos Completos (Copiar e Colar)

```powershell
# 1. Navegar
cd "C:\Users\User\Downloads\NEW APP"

# 2. Verificar se está no lugar certo
pwd

# 3. Iniciar servidor
npm run dev
```

**Aguarde e acesse:** `http://localhost:3000`

---

**Agora você sabe como resolver quando o servidor cair! 🚀**





