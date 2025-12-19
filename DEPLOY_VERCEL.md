# 🚀 Deploy no Vercel (Grátis)

## 📋 Passo a Passo

### 1. Criar Conta no Vercel
1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Use GitHub, GitLab ou email

### 2. Conectar Repositório
1. No Vercel, clique em "Add New Project"
2. Conecte seu repositório Git
3. Ou faça upload do código

### 3. Configurar Build
- **Framework Preset:** Create React App
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `build`

### 4. Variáveis de Ambiente
Adicione no Vercel:
```
REACT_APP_API_URL=https://seu-api.onrender.com/api
```

### 5. Deploy!
Clique em "Deploy" e aguarde!

---

## ✅ Resultado

Seu site estará em:
- `seu-projeto.vercel.app`
- Com SSL/HTTPS automático
- Grátis para sempre!

---

## 🔗 Próximo: Deploy da API

Depois faça o deploy da API no Render (veja DEPLOY_RENDER.md)
