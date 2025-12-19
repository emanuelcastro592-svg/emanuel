# 🚀 Deploy da API no Render (Grátis)

## 📋 Passo a Passo

### 1. Criar Conta no Render
1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Use GitHub para login

### 2. Criar Novo Web Service
1. No dashboard, clique em "New +"
2. Escolha "Web Service"
3. Conecte seu repositório Git

### 3. Configurar Serviço
- **Name:** personal-trainer-api
- **Environment:** Node
- **Build Command:** `npm install && cd client && npm install && cd .. && npm run build`
- **Start Command:** `node server/index.js`
- **Plan:** Free

### 4. Variáveis de Ambiente
Adicione no Render:
```
PORT=5000
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-super-segura
DOMAIN=seu-site.onrender.com
CLIENT_URL=https://seu-site.vercel.app
API_URL=https://seu-api.onrender.com/api
```

### 5. Banco de Dados (Opcional)
1. No Render, clique em "New +"
2. Escolha "PostgreSQL"
3. Plan: Free
4. Copie a connection string
5. Adicione como variável de ambiente no Web Service

### 6. Deploy!
Clique em "Create Web Service" e aguarde!

---

## ✅ Resultado

Sua API estará em:
- `seu-api.onrender.com`
- Com SSL/HTTPS automático
- Grátis (pode "dormir" após 15min de inatividade)

---

## ⚠️ Importante

O serviço grátis do Render "dorme" após 15 minutos sem uso.
- Primeira requisição pode demorar ~30 segundos
- Depois funciona normalmente

Para evitar isso, use Railway ou pague o plano do Render.
