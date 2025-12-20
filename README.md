# Sistema de Agendamento para Personal Trainer

Sistema completo para gerenciar agendamentos e solicitações de serviços com personal trainers.

## Funcionalidades

### Para Personal Trainers:
- Cadastro e autenticação
- Gerenciar serviços oferecidos (criar, editar, desativar)
- Visualizar agendamentos específicos
- Gerenciar solicitações pontuais de serviços (aceitar/rejeitar)

### Para Clientes:
- Cadastro e autenticação
- Visualizar personal trainers disponíveis
- Fazer agendamentos específicos com um personal trainer
- Solicitar serviços pontuais do personal trainer
- Visualizar histórico de agendamentos e solicitações

## Tecnologias

- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL (recomendado) ou SQLite
- **Autenticação**: JWT
- **Frontend**: React

## Instalação

1. Instalar dependências:
```bash
npm run install-all
```

2. Configurar variáveis de ambiente:
   - Copie `.env.example` para `.env`
   - Configure as variáveis do PostgreSQL (veja `COMO_EDITAR_ENV.md`)
   - Ou instale PostgreSQL seguindo `COMO_INSTALAR_POSTGRESQL.md`

3. Iniciar o servidor:
```bash
npm run server
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login

### Personal Trainers
- `GET /api/trainers` - Listar todos os trainers
- `GET /api/trainers/:trainerId` - Obter trainer específico

### Serviços
- `GET /api/services/trainer/:trainerId` - Listar serviços de um trainer
- `POST /api/services` - Criar serviço (trainer)
- `PUT /api/services/:serviceId` - Atualizar serviço (trainer)
- `DELETE /api/services/:serviceId` - Deletar serviço (trainer)
- `GET /api/services/:serviceId` - Obter serviço específico

### Agendamentos
- `POST /api/appointments` - Criar agendamento (cliente)
- `GET /api/appointments/client/my-appointments` - Meus agendamentos (cliente)
- `GET /api/appointments/trainer/my-appointments` - Meus agendamentos (trainer)
- `PATCH /api/appointments/:appointmentId/status` - Atualizar status
- `GET /api/appointments/:appointmentId` - Obter agendamento específico

### Solicitações Pontuais
- `POST /api/requests` - Criar solicitação (cliente)
- `GET /api/requests/client/my-requests` - Minhas solicitações (cliente)
- `GET /api/requests/trainer/my-requests` - Minhas solicitações (trainer)
- `PATCH /api/requests/:requestId/status` - Atualizar status
- `GET /api/requests/:requestId` - Obter solicitação específica

## Estrutura do Banco de Dados

- **users**: Usuários (trainers e clientes)
- **services**: Serviços oferecidos pelos trainers
- **appointments**: Agendamentos específicos
- **service_requests**: Solicitações pontuais de serviços








