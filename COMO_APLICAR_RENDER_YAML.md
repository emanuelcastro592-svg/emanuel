# 🚀 Aplicar render.yaml no Render

## ✅ O que foi feito

Atualizei o `render.yaml` para criar o banco PostgreSQL **automaticamente**!

---

## 📋 Como Aplicar

### Opção 1: Via Dashboard (Mais Fácil)

1. Vá em: https://dashboard.render.com
2. Clique em **"New +"** (canto superior direito)
3. Selecione **"Blueprint"** ou **"Infrastructure as Code"**
4. Cole o conteúdo do arquivo `render.yaml`
5. Clique em **"Apply"**
6. Aguarde criar tudo automaticamente!

---

### Opção 2: Manual (Se a Opção 1 não funcionar)

#### 1️⃣ Criar Banco PostgreSQL

1. Vá em: https://dashboard.render.com
2. Clique em **"New +"**
3. Selecione **"PostgreSQL"**
4. Configure:
   - **Name**: `personal-trainer-db`
   - **Database**: `fitbooking`
   - **User**: `fitbooking_user`
   - **Region**: Mesma do serviço web
   - **Plan**: **Free**
5. Clique em **"Create Database"**
6. Aguarde criar

#### 2️⃣ Conectar Banco ao Serviço Web

1. Volte para o serviço **"personal-trainer-api"**
2. Vá em **"Environment"** (menu lateral)
3. Clique em **"Link Database"** ou **"Add Database"**
4. Selecione o banco `personal-trainer-db`
5. O Render vai adicionar `DATABASE_URL` automaticamente!

---

## ✅ Depois de Aplicar

O Render vai:
- ✅ Criar o banco PostgreSQL automaticamente
- ✅ Conectar ao serviço web
- ✅ Adicionar `DATABASE_URL` automaticamente
- ✅ Fazer deploy com tudo configurado

---

## 🎯 Próximo Passo

Depois de aplicar, o deploy vai funcionar automaticamente!
