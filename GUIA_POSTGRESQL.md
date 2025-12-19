# 🐘 Guia Rápido: PostgreSQL no FitBooking

## ✅ Checklist de Instalação

- [ ] PostgreSQL instalado no Windows
- [ ] Banco de dados `fitbooking` criado
- [ ] Arquivo `.env` configurado com credenciais
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor testado e funcionando

---

## 🚀 Início Rápido

### 1. Instalar PostgreSQL

Siga o guia completo: `COMO_INSTALAR_POSTGRESQL.md`

**Resumo rápido:**
- Baixe de: https://www.postgresql.org/download/windows/
- Instale com senha do usuário `postgres`
- Anote a senha!

### 2. Criar Banco de Dados

```powershell
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco
CREATE DATABASE fitbooking;
\q
```

### 3. Configurar .env

Edite o arquivo `.env`:

```env
PORT=5000
JWT_SECRET=sua-chave-secreta-aqui

DB_HOST=localhost
DB_PORT=5432
DB_NAME=fitbooking
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI
DB_SSL=false
```

### 4. Instalar Dependências

```powershell
cd "C:\Users\User\Downloads\NEW APP"
npm install
```

### 5. Iniciar Servidor

```powershell
npm run server
```

**Se aparecer "✅ Conectado ao PostgreSQL"**, está funcionando! 🎉

---

## 🔄 Migrar Dados do SQLite (Opcional)

Se você já tem dados no SQLite:

```powershell
node server/database/migrate-to-postgres.js
```

---

## 📊 Verificar se Está Funcionando

### Via pgAdmin:
1. Abra pgAdmin 4
2. Conecte ao servidor
3. Expanda "Databases" → "fitbooking" → "Schemas" → "public" → "Tables"
4. Você deve ver as tabelas: users, services, appointments, etc.

### Via Código:
O servidor deve mostrar:
```
✅ Conectado ao PostgreSQL
✅ Banco de dados PostgreSQL inicializado com sucesso!
📊 Tabelas criadas: users, services, appointments, service_requests, ratings, notifications
```

---

## ❓ Problemas?

### Erro: "password authentication failed"
→ Verifique a senha no `.env`

### Erro: "database does not exist"
→ Crie o banco: `CREATE DATABASE fitbooking;`

### Erro: "connection refused"
→ Verifique se o PostgreSQL está rodando (Serviços do Windows)

---

## 📚 Documentação Completa

- **Instalação detalhada:** `COMO_INSTALAR_POSTGRESQL.md`
- **Configuração do .env:** `COMO_EDITAR_ENV.md`

---

**Pronto! Seu banco PostgreSQL está configurado! 🎉**



