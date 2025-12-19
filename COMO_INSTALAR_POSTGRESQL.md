# 🐘 Como Instalar e Configurar PostgreSQL

## 📋 Pré-requisitos

Este guia mostra como instalar o PostgreSQL no Windows e configurá-lo para o projeto FitBooking.

---

## 🎯 Método 1: Instalação via Instalador Oficial (Recomendado)

### Passo 1: Baixar PostgreSQL

1. Acesse: https://www.postgresql.org/download/windows/
2. Clique em "Download the installer"
3. Baixe o instalador para Windows (versão mais recente)

### Passo 2: Instalar PostgreSQL

1. Execute o instalador baixado
2. Clique em "Next" nas telas iniciais
3. **Escolha o diretório de instalação** (ou deixe o padrão)
4. **Selecione os componentes:**
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (interface gráfica)
   - ✅ Command Line Tools
   - ✅ Stack Builder (opcional)

5. **Configure o diretório de dados** (ou deixe o padrão)
6. **Defina a senha do usuário `postgres`**:
   - ⚠️ **ANOTE ESTA SENHA!** Você vai precisar dela
   - Exemplo: `postgres123` (use algo mais seguro em produção)

7. **Configure a porta:**
   - Padrão: `5432` (deixe assim)

8. **Selecione o locale:**
   - Português (Brasil) ou deixe o padrão

9. Clique em "Next" e depois "Install"
10. Aguarde a instalação concluir
11. **Desmarque "Launch Stack Builder"** (não é necessário)
12. Clique em "Finish"

### Passo 3: Verificar Instalação

Abra o **PowerShell** e execute:

```powershell
psql --version
```

Se mostrar a versão, está instalado! ✅

---

## 🎯 Método 2: Instalação via Chocolatey (Mais Rápido)

Se você tem o Chocolatey instalado:

```powershell
choco install postgresql
```

---

## 🔧 Configuração Inicial

### 1. Criar o Banco de Dados

Abra o **pgAdmin 4** (instalado junto com PostgreSQL) ou use o PowerShell:

```powershell
# Conectar ao PostgreSQL
psql -U postgres

# Digite a senha que você definiu na instalação
```

Depois, execute:

```sql
CREATE DATABASE fitbooking;
\q
```

Ou pelo PowerShell diretamente:

```powershell
psql -U postgres -c "CREATE DATABASE fitbooking;"
```

### 2. Configurar o Arquivo .env

Edite o arquivo `.env` na raiz do projeto:

```env
# Configurações do Servidor
PORT=5000
JWT_SECRET=sua-chave-secreta-aqui-mude-em-producao

# Configurações do PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fitbooking
DB_USER=postgres
DB_PASSWORD=sua-senha-aqui
DB_SSL=false
```

**Substitua `sua-senha-aqui` pela senha que você definiu na instalação!**

---

## 🚀 Testar a Conexão

### Opção 1: Via Código

Execute o servidor:

```powershell
cd "C:\Users\User\Downloads\NEW APP"
npm run server
```

Se aparecer "✅ Conectado ao PostgreSQL", está funcionando! ✅

### Opção 2: Via pgAdmin

1. Abra o **pgAdmin 4**
2. Conecte ao servidor (senha do postgres)
3. Expanda "Databases"
4. Você deve ver o banco `fitbooking`

---

## 📝 Comandos Úteis do PostgreSQL

### Conectar ao banco:

```powershell
psql -U postgres -d fitbooking
```

### Listar tabelas:

```sql
\dt
```

### Ver estrutura de uma tabela:

```sql
\d users
```

### Sair:

```sql
\q
```

---

## 🔄 Migrar Dados do SQLite (Se Tiver Dados Existentes)

Se você já tem dados no SQLite e quer migrar:

1. **Certifique-se de que o PostgreSQL está rodando**
2. **Configure o .env com as credenciais do PostgreSQL**
3. **Execute o script de migração:**

```powershell
cd "C:\Users\User\Downloads\NEW APP"
node server/database/migrate-to-postgres.js
```

O script vai:
- ✅ Ler todos os dados do SQLite
- ✅ Converter tipos de dados
- ✅ Inserir no PostgreSQL
- ✅ Mostrar resumo da migração

---

## ❓ Problemas Comuns

### Erro: "password authentication failed"

**Solução:** Verifique se a senha no `.env` está correta.

### Erro: "database does not exist"

**Solução:** Crie o banco primeiro:
```powershell
psql -U postgres -c "CREATE DATABASE fitbooking;"
```

### Erro: "connection refused"

**Solução:** Verifique se o PostgreSQL está rodando:
- Windows: Serviços → PostgreSQL → Iniciar

### Erro: "port 5432 is already in use"

**Solução:** Outro PostgreSQL pode estar rodando. Use outra porta ou pare o serviço.

---

## 🎯 Próximos Passos

1. ✅ PostgreSQL instalado
2. ✅ Banco `fitbooking` criado
3. ✅ `.env` configurado
4. ✅ Testar conexão
5. ✅ Migrar dados (se necessário)
6. ✅ Iniciar o servidor!

---

## 📚 Recursos Adicionais

- **Documentação oficial:** https://www.postgresql.org/docs/
- **pgAdmin 4:** Interface gráfica para gerenciar o banco
- **DBeaver:** Outra opção de interface gráfica (gratuita)

---

**Agora você está pronto para usar PostgreSQL! 🎉**



