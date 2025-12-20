# 🆓 Deploy Completo Grátis - Guia Passo a Passo

## 🎯 Objetivo

Fazer deploy completo do site **GRÁTIS** usando:
- **Vercel** para o frontend (React)
- **Render** para o backend (API)
- **Domínios grátis** dos próprios serviços

---

## 📋 Checklist

- [ ] Conta no Vercel (grátis)
- [ ] Conta no Render (grátis)
- [ ] Repositório Git (GitHub, GitLab, etc.)
- [ ] Código atualizado

---

## 🚀 Passo 1: Preparar o Código

### 1.1. Criar Repositório Git

```bash
cd "c:\Users\User\Downloads\NEW APP"
git init
git add .
git commit -m "Initial commit"
```

### 1.2. Enviar para GitHub/GitLab

1. Crie um repositório no GitHub
2. Conecte e envie:
```bash
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

---

## 🌐 Passo 2: Deploy do Frontend (Vercel)

### 2.1. Criar Conta
1. Acesse: https://vercel.com
2. Faça login com GitHub

### 2.2. Novo Projeto
1. Clique em "Add New Project"
2. Selecione seu repositório
3. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### 2.3. Variáveis de Ambiente
Adicione:
```
REACT_APP_API_URL=https://seu-api.onrender.com/api
```
*(Substitua pelo URL real da API depois)*

### 2.4. Deploy
Clique em "Deploy"!

**Resultado:** `seu-projeto.vercel.app` ✅

---

## 🔧 Passo 3: Deploy do Backend (Render)

### 3.1. Criar Conta
1. Acesse: https://render.com
2. Faça login com GitHub

### 3.2. Novo Web Service
1. Clique em "New +" → "Web Service"
2. Conecte seu repositório
3. Configure:
   - **Name:** personal-trainer-api
   - **Environment:** Node
   - **Build Command:** `npm install && cd client && npm install && cd ..`
   - **Start Command:** `node server/index.js`
   - **Plan:** Free

### 3.3. Variáveis de Ambiente
Adicione:
```
PORT=5000
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-super-segura-aqui
DOMAIN=seu-api.onrender.com
CLIENT_URL=https://seu-projeto.vercel.app
API_URL=https://seu-api.onrender.com/api
```

### 3.4. Deploy
Clique em "Create Web Service"!

**Resultado:** `seu-api.onrender.com` ✅

---

## 🔄 Passo 4: Atualizar URLs

### 4.1. Atualizar Vercel
1. Vá em Settings → Environment Variables
2. Atualize:
```
REACT_APP_API_URL=https://seu-api.onrender.com/api
```
3. Faça novo deploy

### 4.2. Atualizar Render
1. Vá em Environment
2. Atualize:
```
CLIENT_URL=https://seu-projeto.vercel.app
```
3. Faça novo deploy

---

## ✅ Pronto!

Seu site estará acessível em:
- **Frontend:** https://seu-projeto.vercel.app
- **API:** https://seu-api.onrender.com

**Tudo grátis e com SSL/HTTPS automático!** 🎉

---

## 🔗 Domínio Personalizado (Opcional)

### Usar Freenom (Grátis)
1. Acesse: https://www.freenom.com
2. Registre um domínio .tk, .ml, .ga ou .cf
3. Configure DNS no Vercel/Render

### Ou Comprar Domínio
- Registro.br: ~R$ 30-50/ano
- GoDaddy: ~R$ 30-50/ano
- Namecheap: ~R$ 30-50/ano

---

## ⚠️ Limitações dos Planos Grátis

### Vercel
- ✅ Sem limitações significativas
- ✅ Sempre online

### Render
- ⚠️ Pode "dormir" após 15min sem uso
- ⚠️ Primeira requisição pode demorar ~30s
- ✅ Depois funciona normalmente

**Solução:** Use Railway ($5 grátis/mês) ou pague Render ($7/mês)

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas em algum passo, me avise! 🚀


