# 🚀 Deploy Automático no Render - Passo a Passo

## ⚡ Método Mais Rápido (5 minutos)

### Passo 1: Criar Conta
1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Faça login com GitHub (mais fácil)

### Passo 2: Conectar Repositório
1. No dashboard do Render, clique em "New +"
2. Escolha "Web Service"
3. Conecte seu repositório GitHub
4. Selecione o repositório do projeto

### Passo 3: Configurar (Render detecta automaticamente!)
O Render vai detectar que é Node.js e sugerir configurações.

**Você só precisa ajustar:**

**Name:** `personal-trainer-api`

**Build Command:**
```
npm install && cd client && npm install && cd ..
```

**Start Command:**
```
node server/index.js
```

**Plan:** Free

### Passo 4: Variáveis de Ambiente
Clique em "Advanced" e adicione:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=coloque-uma-chave-secreta-super-segura-aqui
```

*(As outras variáveis você adiciona depois quando tiver o URL do frontend)*

### Passo 5: Deploy!
Clique em "Create Web Service"

**Aguarde 5-10 minutos** enquanto o Render:
- Instala dependências
- Faz build
- Inicia o servidor

### Passo 6: Copiar URL
Quando terminar, você verá:
- ✅ **URL da API:** `https://personal-trainer-api.onrender.com`

**Copie esse URL!** Você vai precisar para o frontend.

---

## ✅ Pronto!

Sua API estará rodando em:
- `https://personal-trainer-api.onrender.com`
- Com SSL/HTTPS automático
- Grátis!

---

## 🔄 Depois de Fazer Deploy do Frontend

Volte no Render e adicione estas variáveis:

```
CLIENT_URL=https://seu-frontend.vercel.app
API_URL=https://personal-trainer-api.onrender.com/api
DOMAIN=personal-trainer-api.onrender.com
```

Depois clique em "Manual Deploy" → "Deploy latest commit"

---

## ⚠️ Importante

O plano grátis do Render pode "dormir" após 15 minutos sem uso.
- Primeira requisição pode demorar ~30 segundos
- Depois funciona normalmente

**Para evitar isso:** Use Railway ($5 grátis/mês) ou pague Render ($7/mês)

---

## 📞 Próximo Passo

Depois que a API estiver no ar, faça o deploy do frontend no Vercel!
