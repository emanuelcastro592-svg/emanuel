# 🔧 Configurar Render - Banco de Dados

## ⚠️ Problema Atual

O deploy está falhando porque a aplicação está tentando conectar ao banco em `localhost`, mas no Render você precisa de um banco PostgreSQL separado.

## ✅ Solução

### 1️⃣ Criar Banco PostgreSQL no Render

1. Vá em: https://dashboard.render.com
2. Clique em **"New +"** (canto superior direito)
3. Selecione **"PostgreSQL"**
4. Configure:
   - **Name**: `personal-trainer-db` (ou qualquer nome)
   - **Database**: Deixe padrão
   - **User**: Deixe padrão
   - **Region**: Escolha a mesma região do seu serviço web
   - **Plan**: **Free** (se disponível)
5. Clique em **"Create Database"**
6. Aguarde criar (pode demorar 1-2 minutos)

### 2️⃣ Copiar DATABASE_URL

1. Depois que o banco for criado, clique nele
2. Vá na aba **"Connections"** ou **"Info"**
3. Copie a **"Internal Database URL"** ou **"DATABASE_URL"**
   - Vai ser algo como: `postgresql://user:password@host:5432/database`

### 3️⃣ Configurar Variáveis de Ambiente no Serviço Web

1. Volte para o serviço **"personal-trainer-api"**
2. Vá em **"Environment"** (menu lateral)
3. Clique em **"Add Environment Variable"**
4. Adicione:

   **Nome**: `DATABASE_URL`  
   **Valor**: Cole a URL que você copiou

5. Clique em **"Save Changes"**

### 4️⃣ Fazer Novo Deploy

1. Vá em **"Manual Deploy"**
2. Selecione **"Deploy latest commit"**
3. Aguarde o deploy terminar

---

## 📝 Variáveis de Ambiente Necessárias

No Render, configure estas variáveis:

| Nome | Valor | Onde Encontrar |
|------|-------|----------------|
| `DATABASE_URL` | URL do banco PostgreSQL | Na página do banco criado |
| `NODE_ENV` | `production` | Já deve estar configurado |
| `PORT` | `5000` | Já deve estar configurado |
| `JWT_SECRET` | Qualquer string aleatória | Você pode gerar uma |
| `DOMAIN` | Seu domínio (opcional) | Se tiver domínio customizado |
| `CLIENT_URL` | URL do frontend (opcional) | Se frontend estiver separado |

---

## ✅ Depois de Configurar

O código foi atualizado para usar `DATABASE_URL` automaticamente quando disponível (padrão do Render).

Apenas adicione a variável `DATABASE_URL` e faça um novo deploy!
