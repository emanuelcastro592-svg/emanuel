# Guia de Instalação e Uso

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

1. **Instalar dependências do backend e frontend:**

```bash
npm run install-all
```

Ou manualmente:

```bash
# Instalar dependências do backend
npm install

# Instalar dependências do frontend
cd client
npm install
cd ..
```

2. **Configurar variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com:

```
PORT=5000
JWT_SECRET=seu-secret-key-super-seguro-aqui-mude-em-producao
```

## Executando a Aplicação

### Opção 1: Executar tudo junto (recomendado)

```bash
npm run dev
```

Isso iniciará:
- Backend na porta 5000
- Frontend na porta 3000

### Opção 2: Executar separadamente

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Uso

1. Acesse `http://localhost:3000` no navegador
2. Registre-se como Personal Trainer ou Cliente
3. Se for Personal Trainer:
   - Acesse "Meus Serviços" para cadastrar os serviços que você oferece
   - Visualize agendamentos e solicitações na respectiva seção
4. Se for Cliente:
   - Acesse "Personal Trainers" para ver trainers disponíveis
   - Escolha um trainer e veja seus serviços
   - Faça um agendamento específico ou solicite um serviço pontual

## Funcionalidades

### Para Personal Trainers:
- ✅ Cadastrar e gerenciar serviços oferecidos
- ✅ Visualizar agendamentos específicos
- ✅ Aceitar/rejeitar solicitações pontuais de serviços
- ✅ Confirmar e gerenciar status dos agendamentos

### Para Clientes:
- ✅ Visualizar personal trainers disponíveis
- ✅ Ver serviços oferecidos por cada trainer
- ✅ Fazer agendamentos específicos com data/hora
- ✅ Solicitar serviços pontuais
- ✅ Visualizar histórico de agendamentos e solicitações

## Estrutura do Banco de Dados

O banco de dados SQLite é criado automaticamente na primeira execução em `server/database/database.sqlite`.

### Tabelas:
- **users**: Usuários (trainers e clientes)
- **services**: Serviços oferecidos pelos trainers
- **appointments**: Agendamentos específicos
- **service_requests**: Solicitações pontuais de serviços

## API

A API está disponível em `http://localhost:5000/api`

Consulte o `README.md` para documentação completa dos endpoints.








