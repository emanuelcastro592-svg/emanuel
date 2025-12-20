# 🚀 Início Rápido - Comandos Corretos

## ⚠️ IMPORTANTE: Você precisa estar no diretório correto!

O projeto está em: `C:\Users\User\Downloads\NEW APP`

## 📝 Passo a Passo no PowerShell

### 1. Navegar para o diretório do projeto:
```powershell
cd "C:\Users\User\Downloads\NEW APP"
```

### 2. Verificar se está no lugar certo:
```powershell
dir package.json
```
(Deve mostrar o arquivo package.json)

### 3. Instalar dependências (PRIMEIRA VEZ):
```powershell
npm run install-all
```
**Aguarde alguns minutos** - isso instala todas as dependências do backend e frontend.

### 4. Criar arquivo .env (se ainda não criou):
```powershell
New-Item -Path .env -ItemType File -Force
```
Depois edite o arquivo `.env` e adicione:
```
PORT=5000
JWT_SECRET=sua-chave-secreta-aqui
```

### 5. Iniciar o sistema:
```powershell
npm run dev
```

Isso iniciará:
- ✅ Backend na porta 5000
- ✅ Frontend na porta 3000

### 6. Acessar no navegador:
Abra: http://localhost:3000

---

## 🔧 Comandos Úteis

### Verificar se está no diretório correto:
```powershell
pwd
```
Deve mostrar: `C:\Users\User\Downloads\NEW APP`

### Ver arquivos do projeto:
```powershell
dir
```

### Parar o servidor:
Pressione `Ctrl + C` no terminal

---

## ❌ Erros Comuns

### Erro: "Could not read package.json"
**Causa:** Você está no diretório errado
**Solução:** Execute `cd "C:\Users\User\Downloads\NEW APP"` primeiro

### Erro: "npm não é reconhecido"
**Causa:** Node.js não está instalado
**Solução:** Instale Node.js de https://nodejs.org

### Erro: Porta já em uso
**Causa:** Outro processo está usando a porta 5000 ou 3000
**Solução:** Feche outros programas ou mude a porta no .env

---

## ✅ Checklist Antes de Iniciar

- [ ] Estou no diretório correto: `C:\Users\User\Downloads\NEW APP`
- [ ] Instalei as dependências: `npm run install-all`
- [ ] Criei o arquivo `.env` com as configurações
- [ ] Não há outros processos usando as portas 5000 e 3000

---

**Agora você pode seguir estes passos! 🎉**







