# Tutorial Passo a Passo - Exemplos Práticos

Este guia mostra exemplos práticos de uso do sistema com cenários reais.

---

## 🎬 Cenário 1: Personal Trainer se Cadastra e Oferece Serviços

### Passo 1: Cadastro
```
1. Abra http://localhost:3000
2. Clique em "Registre-se"
3. Preencha:
   Nome: João Silva
   Email: joao@trainer.com
   Senha: 123456
   Tipo: Personal Trainer
   Telefone: (11) 99999-9999
4. Clique em "Registrar"
```

### Passo 2: Cadastrar Primeiro Serviço
```
1. No dashboard, clique em "📋 Meus Serviços"
2. Clique em "+ Novo Serviço"
3. Preencha:
   Nome: Treino Funcional
   Descrição: Treino completo com exercícios funcionais
   Duração: 60
   Preço: 120.00
4. Clique em "Criar"
```

### Passo 3: Cadastrar Mais Serviços
```
Repita o processo para:
- Avaliação Física (90 min, R$ 200,00)
- Consulta Online (30 min, R$ 80,00)
- Plano de Treino Mensal (0 min, R$ 300,00)
```

**Resultado:** Agora você tem 4 serviços cadastrados que clientes podem ver e solicitar!

---

## 🎬 Cenário 2: Cliente Encontra Trainer e Faz Agendamento

### Passo 1: Cliente se Cadastra
```
1. Abra http://localhost:3000 (em outra aba ou navegador)
2. Clique em "Registre-se"
3. Preencha:
   Nome: Maria Santos
   Email: maria@cliente.com
   Senha: 123456
   Tipo: Cliente
4. Clique em "Registrar"
```

### Passo 2: Cliente Encontra o Trainer
```
1. No dashboard, clique em "👥 Personal Trainers"
2. Você verá "João Silva" na lista
3. Clique em "Ver Serviços"
4. Veja os 4 serviços disponíveis:
   - Treino Funcional (60 min, R$ 120,00)
   - Avaliação Física (90 min, R$ 200,00)
   - Consulta Online (30 min, R$ 80,00)
   - Plano de Treino Mensal (R$ 300,00)
```

### Passo 3: Cliente Faz Agendamento Específico
```
1. Clique em "Fazer Agendamento Específico"
2. Preencha:
   Data e Hora: 25/12/2024 14:00
   Duração: 60
   Observações: Primeira consulta, foco em perda de peso
3. Clique em "Criar Agendamento"
```

**O que acontece:**
- ✅ Agendamento criado com status "Pendente"
- ✅ Trainer recebe notificação (aparece na seção de agendamentos)

### Passo 4: Trainer Confirma o Agendamento
```
1. Volte para a conta do trainer (João)
2. Clique em "📅 Agendamentos"
3. Veja o agendamento de "Maria Santos"
4. Clique em "Confirmar"
```

**Resultado:** Status muda para "Confirmado" ✅

---

## 🎬 Cenário 3: Cliente Solicita Serviço Pontual

### Passo 1: Cliente Solicita um Serviço
```
1. Na conta do cliente (Maria)
2. Acesse "👥 Personal Trainers" → "Ver Serviços" do João
3. Clique em "Solicitar Serviço Pontual"
4. Preencha:
   Serviço: Avaliação Física
   Data/Hora Desejada: 30/12/2024 10:00 (opcional)
   Observações: Preciso de avaliação completa antes de começar
5. Clique em "Enviar Solicitação"
```

### Passo 2: Trainer Recebe e Aceita
```
1. Na conta do trainer (João)
2. Clique em "🔔 Solicitações"
3. Veja a solicitação de "Maria Santos" para "Avaliação Física"
4. Leia os detalhes:
   - Serviço: Avaliação Física
   - Duração: 90 minutos
   - Preço: R$ 200,00
   - Data desejada: 30/12/2024 10:00
   - Observações: Preciso de avaliação completa...
5. Clique em "Aceitar"
```

**Resultado:** Status muda para "Aceita" ✅

### Passo 3: Após o Atendimento
```
1. Trainer (João) acessa "🔔 Solicitações"
2. Encontra a solicitação aceita
3. Após realizar o serviço, clica em "Marcar como Concluída"
```

**Resultado:** Status muda para "Concluída" ✅

---

## 🎬 Cenário 4: Fluxo Completo de Múltiplos Serviços

### Situação:
Um trainer oferece vários serviços e recebe diferentes tipos de solicitações.

### Passo 1: Trainer Cadastra Variedade de Serviços
```
Serviços cadastrados:
1. Treino Funcional - 60 min - R$ 120,00
2. Treino de Força - 90 min - R$ 150,00
3. Avaliação Física - 90 min - R$ 200,00
4. Consulta Online - 30 min - R$ 80,00
5. Acompanhamento Semanal - 60 min - R$ 100,00
```

### Passo 2: Cliente 1 Faz Agendamento Específico
```
Cliente: Ana
Ação: Agendamento Específico
Data: 20/12/2024 15:00
Duração: 60 min
Status: Pendente → Trainer confirma → Confirmado
```

### Passo 3: Cliente 2 Solicita Serviço Pontual
```
Cliente: Carlos
Ação: Solicita "Avaliação Física"
Data desejada: 22/12/2024 09:00
Status: Pendente → Trainer aceita → Aceita → Concluída
```

### Passo 4: Cliente 3 Solicita Sem Data Específica
```
Cliente: Paula
Ação: Solicita "Consulta Online"
Data desejada: (deixou em branco)
Observações: "Disponível qualquer dia da semana"
Status: Pendente → Trainer aceita → Aceita
```

**Resultado:** Trainer gerencia múltiplos clientes e tipos de serviços de forma organizada!

---

## 📊 Exemplos de Dados para Teste

### Personal Trainers de Exemplo:
```
Trainer 1:
- Nome: João Silva
- Email: joao@trainer.com
- Serviços: Treino Funcional, Avaliação Física

Trainer 2:
- Nome: Ana Costa
- Email: ana@trainer.com
- Serviços: Yoga, Pilates, Meditação
```

### Clientes de Exemplo:
```
Cliente 1:
- Nome: Maria Santos
- Email: maria@cliente.com
- Objetivo: Perda de peso

Cliente 2:
- Nome: Carlos Oliveira
- Email: carlos@cliente.com
- Objetivo: Ganho de massa muscular
```

---

## 🔍 Verificando o Sistema

### Como Verificar se Está Funcionando:

1. **Backend está rodando?**
   - Terminal deve mostrar: "Servidor rodando na porta 5000"
   - Acesse: http://localhost:5000/api/test
   - Deve retornar: `{"message":"API funcionando!"}`

2. **Frontend está rodando?**
   - Navegador deve abrir em http://localhost:3000
   - Deve ver a tela de login

3. **Banco de dados foi criado?**
   - Verifique se existe: `server/database/database.sqlite`
   - Se não existir, será criado automaticamente na primeira execução

---

## 🎯 Dicas de Teste

### Teste Completo Recomendado:

1. ✅ Crie 2 contas de trainer
2. ✅ Cada trainer cadastra 3-5 serviços diferentes
3. ✅ Crie 3 contas de cliente
4. ✅ Cada cliente faz 1 agendamento específico
5. ✅ Cada cliente faz 1 solicitação pontual
6. ✅ Trainers confirmam/aceitam as solicitações
7. ✅ Marque alguns como concluídos
8. ✅ Teste cancelamentos

**Resultado:** Você terá um sistema completo com dados de exemplo!

---

## 🐛 Testando Erros Comuns

### Teste 1: Agendamento em Horário Ocupado
```
1. Cliente faz agendamento para 25/12/2024 14:00
2. Trainer confirma
3. Outro cliente tenta agendar no mesmo horário
4. Sistema deve mostrar erro: "Horário já está ocupado"
```

### Teste 2: Solicitar Serviço Inexistente
```
1. Trainer deleta um serviço
2. Cliente tenta solicitar esse serviço
3. Sistema deve mostrar erro ou não mostrar o serviço
```

### Teste 3: Ações Sem Permissão
```
1. Cliente tenta acessar página de gerenciar serviços
2. Sistema deve redirecionar ou mostrar erro de permissão
```

---

## 📱 Fluxo Visual Simplificado

```
┌─────────────────────────────────────────┐
│         TELA DE LOGIN/REGISTRO          │
└─────────────────────────────────────────┘
              │
              ├─ Trainer ────────────────┐
              │                           │
              └─ Cliente ─────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
   DASHBOARD TRAINER          DASHBOARD CLIENTE
        │                           │
        ├─ Meus Serviços            ├─ Personal Trainers
        ├─ Agendamentos             ├─ Meus Agendamentos
        └─ Solicitações             └─ Minhas Solicitações
```

---

## ✅ Checklist de Uso

Use este checklist para garantir que testou tudo:

### Como Trainer:
- [ ] Criar conta
- [ ] Fazer login
- [ ] Cadastrar pelo menos 3 serviços
- [ ] Editar um serviço
- [ ] Ver agendamentos recebidos
- [ ] Confirmar um agendamento
- [ ] Rejeitar um agendamento
- [ ] Ver solicitações recebidas
- [ ] Aceitar uma solicitação
- [ ] Rejeitar uma solicitação
- [ ] Marcar serviço como concluído

### Como Cliente:
- [ ] Criar conta
- [ ] Fazer login
- [ ] Ver lista de trainers
- [ ] Ver serviços de um trainer
- [ ] Fazer agendamento específico
- [ ] Solicitar serviço pontual
- [ ] Ver meus agendamentos
- [ ] Ver minhas solicitações
- [ ] Cancelar um agendamento
- [ ] Cancelar uma solicitação

---

**Agora você tem exemplos práticos de como usar o sistema! 🚀**

Experimente seguir estes cenários e você entenderá completamente como tudo funciona.







