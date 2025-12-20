# 📊 Banco de Dados - FitBooking

## Estrutura do Banco de Dados

O sistema suporta **PostgreSQL** (recomendado) ou **SQLite** (desenvolvimento).

### PostgreSQL (Produção)
- Banco: Configurado via variáveis de ambiente (`.env`)
- Host: `DB_HOST` (padrão: localhost)
- Porta: `DB_PORT` (padrão: 5432)
- Nome: `DB_NAME` (padrão: fitbooking)

### SQLite (Desenvolvimento)
- Arquivo: `server/database/database.sqlite`
- Backup: `server/database/database_backup_*.sqlite`

## 📋 Tabelas

### 1. **users** - Usuários do Sistema
- `id` - Identificador único (UUID)
- `name` - Nome completo
- `email` - Email (único)
- `password` - Senha criptografada
- `role` - Tipo: 'trainer' ou 'client'
- `phone` - Telefone
- `avatar` - URL da foto de perfil
- `bio` - Biografia
- `address` - Endereço
- `city` - Cidade
- `state` - Estado
- `zip_code` - CEP
- `is_active` - Status ativo/inativo
- `last_login` - Último login
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### 2. **services** - Serviços dos Trainers
- `id` - Identificador único
- `trainer_id` - ID do personal trainer
- `name` - Nome do serviço
- `description` - Descrição
- `duration` - Duração em minutos
- `price` - Preço
- `category` - Categoria
- `image_url` - URL da imagem
- `active` - Ativo/Inativo
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### 3. **appointments** - Agendamentos
- `id` - Identificador único
- `trainer_id` - ID do trainer
- `client_id` - ID do cliente
- `date_time` - Data e hora
- `duration` - Duração em minutos
- `notes` - Observações
- `location` - Localização
- `status` - Status: pending, confirmed, completed, cancelled
- `cancellation_reason` - Motivo do cancelamento
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### 4. **service_requests** - Solicitações Pontuais
- `id` - Identificador único
- `trainer_id` - ID do trainer
- `client_id` - ID do cliente
- `service_id` - ID do serviço
- `requested_date_time` - Data/hora desejada
- `notes` - Observações
- `location` - Localização
- `status` - Status: pending, accepted, rejected, completed, cancelled
- `rejection_reason` - Motivo da rejeição
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### 5. **ratings** - Avaliações
- `id` - Identificador único
- `trainer_id` - ID do trainer
- `client_id` - ID do cliente
- `appointment_id` - ID do agendamento (opcional)
- `rating` - Nota (1-5)
- `comment` - Comentário
- `created_at` - Data de criação

### 6. **notifications** - Notificações
- `id` - Identificador único
- `user_id` - ID do usuário
- `title` - Título
- `message` - Mensagem
- `type` - Tipo: info, success, warning, error
- `read` - Lida/Não lida
- `link` - Link relacionado
- `created_at` - Data de criação

## 🔍 Índices Criados

Para otimização de consultas, foram criados índices nas seguintes colunas:

- `users`: email, role, is_active
- `services`: trainer_id, active
- `appointments`: trainer_id, client_id, date_time, status
- `service_requests`: trainer_id, client_id, service_id, status
- `ratings`: trainer_id, client_id
- `notifications`: user_id, read

## 🛠️ Funções Disponíveis

### query(sql, params)
Executa uma consulta SELECT e retorna todas as linhas.

**PostgreSQL:** Use `$1, $2, $3...` para parâmetros
**SQLite:** Use `?` para parâmetros

```javascript
// PostgreSQL
const users = await query('SELECT * FROM users WHERE role = $1', ['trainer']);

// SQLite (legado)
const users = await query('SELECT * FROM users WHERE role = ?', ['trainer']);
```

### queryOne(sql, params)
Executa uma consulta SELECT e retorna uma única linha.

```javascript
// PostgreSQL
const user = await queryOne('SELECT * FROM users WHERE id = $1', [userId]);
```

### run(sql, params)
Executa comandos INSERT, UPDATE ou DELETE.

```javascript
// PostgreSQL
const result = await run('INSERT INTO users (...) VALUES ($1, $2, ...)', [...]);
```

### getStats()
Retorna estatísticas do sistema.

```javascript
const stats = await getStats();
// { users: { count: 10 }, trainers: { count: 5 }, ... }
```

### backup()
Cria um backup do banco de dados.

```javascript
const backupPath = await backup();
```

## 🔄 Migrações

O sistema possui um sistema de migrações para adicionar novas colunas sem perder dados existentes.

As migrações são executadas automaticamente na inicialização do servidor.

## 📝 Exemplos de Uso

### Criar um usuário
```javascript
const { run } = require('./database/db');
const { v4: uuidv4 } = require('uuid');

await run(
  'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
  [uuidv4(), 'João Silva', 'joao@email.com', hashedPassword, 'trainer']
);
```

### Buscar agendamentos de um trainer
```javascript
const { query } = require('./database/db');

const appointments = await query(
  'SELECT * FROM appointments WHERE trainer_id = ? ORDER BY date_time DESC',
  [trainerId]
);
```

### Atualizar status de agendamento
```javascript
const { run } = require('./database/db');

await run(
  'UPDATE appointments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  ['confirmed', appointmentId]
);
```

## 🔒 Segurança

- Senhas são criptografadas com bcrypt
- Foreign keys habilitadas
- Validação de dados nas rotas
- Índices para performance

## 📊 Backup

Para fazer backup manual:

```javascript
const { backup } = require('./database/db');
const backupPath = await backup();
console.log('Backup criado em:', backupPath);
```

## 🚀 Performance

- Índices criados em colunas frequentemente consultadas
- Foreign keys para integridade referencial
- Queries otimizadas
- **PostgreSQL:** Pool de conexões para melhor performance
- **SQLite:** Rápido para aplicações de médio porte

## 🔄 Migração SQLite → PostgreSQL

Para migrar dados existentes do SQLite para PostgreSQL:

1. Configure o `.env` com credenciais do PostgreSQL
2. Execute: `node server/database/migrate-to-postgres.js`
3. O script migra todos os dados automaticamente

Veja `COMO_INSTALAR_POSTGRESQL.md` para mais detalhes.

---

**Banco de dados configurado e otimizado! 🎉**






