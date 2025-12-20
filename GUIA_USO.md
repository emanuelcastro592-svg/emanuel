# Guia Detalhado de Uso - Sistema de Agendamento Personal Trainer

## 📋 Índice
1. [Primeiros Passos](#primeiros-passos)
2. [Para Personal Trainers](#para-personal-trainers)
3. [Para Clientes](#para-clientes)
4. [Fluxos Completos de Uso](#fluxos-completos-de-uso)
5. [Dúvidas Frequentes](#dúvidas-frequentes)

---

## 🚀 Primeiros Passos

### 1. Instalação Inicial

#### Passo 1: Instalar Dependências
Abra o terminal na pasta do projeto e execute:

```bash
npm run install-all
```

Este comando instala todas as dependências do backend e frontend automaticamente.

#### Passo 2: Configurar Variáveis de Ambiente
Crie um arquivo chamado `.env` na raiz do projeto (mesma pasta onde está o `package.json`) com o seguinte conteúdo:

```
PORT=5000
JWT_SECRET=seu-secret-key-super-seguro-aqui-mude-em-producao
```

**Importante:** Em produção, use uma chave secreta mais segura e complexa.

#### Passo 3: Iniciar o Sistema
Execute o comando:

```bash
npm run dev
```

Isso iniciará:
- ✅ Backend na porta 5000
- ✅ Frontend na porta 3000

Aguarde alguns segundos até ver as mensagens de sucesso. O navegador deve abrir automaticamente em `http://localhost:3000`.

---

## 👨‍💼 Para Personal Trainers

### 1. Registro e Login

#### Criar Conta como Personal Trainer

1. Acesse `http://localhost:3000`
2. Clique em **"Registre-se"** ou acesse `/register`
3. Preencha o formulário:
   - **Nome:** Seu nome completo
   - **Email:** Seu email (será usado para login)
   - **Senha:** Mínimo 6 caracteres
   - **Tipo de Conta:** Selecione **"Personal Trainer"**
   - **Telefone:** (Opcional)
4. Clique em **"Registrar"**

Após o registro, você será redirecionado automaticamente para o dashboard.

#### Fazer Login

1. Acesse `http://localhost:3000`
2. Digite seu **email** e **senha**
3. Clique em **"Entrar"**

---

### 2. Gerenciar Serviços Oferecidos

Esta é a funcionalidade principal para personal trainers! Você precisa cadastrar os serviços que oferece antes que clientes possam solicitar.

#### Criar um Novo Serviço

1. No dashboard, clique em **"📋 Meus Serviços"**
2. Clique no botão **"+ Novo Serviço"**
3. Preencha o formulário:
   - **Nome do Serviço:** Ex: "Treino Funcional", "Avaliação Física", "Consulta Nutricional"
   - **Descrição:** (Opcional) Detalhes sobre o serviço
   - **Duração (minutos):** Ex: 60, 90, 120
   - **Preço (R$):** Ex: 100.00, 150.50
4. Clique em **"Criar"**

**Exemplo de Serviços:**
- **Treino Personalizado** - 60 min - R$ 120,00
- **Avaliação Física Completa** - 90 min - R$ 200,00
- **Consulta Online** - 30 min - R$ 80,00
- **Plano de Treino Mensal** - 0 min - R$ 300,00

#### Editar um Serviço Existente

1. Na lista de serviços, encontre o serviço que deseja editar
2. Clique no botão **"Editar"**
3. Modifique os campos desejados
4. Clique em **"Atualizar"**

#### Desativar/Deletar um Serviço

1. Na lista de serviços, encontre o serviço
2. Clique no botão **"Deletar"**
3. Confirme a ação

**Nota:** O serviço será desativado (não aparecerá mais para clientes), mas os dados permanecem no banco.

---

### 3. Gerenciar Agendamentos

#### Visualizar Agendamentos

1. No dashboard, clique em **"📅 Agendamentos"**
2. Você verá uma lista de todos os agendamentos feitos por clientes

#### Status dos Agendamentos

- **Pendente (Amarelo):** Cliente criou, aguardando sua confirmação
- **Confirmado (Verde):** Você confirmou o agendamento
- **Concluído (Azul):** Agendamento foi realizado
- **Cancelado (Vermelho):** Agendamento foi cancelado

#### Ações Disponíveis

**Para Agendamentos Pendentes:**
- **Confirmar:** Clique em **"Confirmar"** para aceitar o agendamento
- **Rejeitar:** Clique em **"Rejeitar"** para cancelar

**Para Agendamentos Confirmados:**
- **Marcar como Concluído:** Após realizar o atendimento, clique em **"Marcar como Concluído"**

#### Informações Exibidas

Cada agendamento mostra:
- Nome e email do cliente
- Data e hora do agendamento
- Duração
- Observações (se houver)

---

### 4. Gerenciar Solicitações Pontuais

Solicitações pontuais são quando clientes pedem um serviço específico que você oferece, mas sem data/hora definida ou com data/hora sugerida.

#### Visualizar Solicitações

1. No dashboard, clique em **"🔔 Solicitações"**
2. Você verá todas as solicitações de serviços

#### Status das Solicitações

- **Pendente (Amarelo):** Aguardando sua resposta
- **Aceita (Verde):** Você aceitou a solicitação
- **Rejeitada (Vermelho):** Você rejeitou
- **Concluída (Azul):** Serviço foi realizado
- **Cancelada (Cinza):** Cliente cancelou

#### Responder a Solicitações

**Para Solicitações Pendentes:**
1. Veja os detalhes do serviço solicitado
2. Veja a data/hora desejada (se o cliente especificou)
3. Leia as observações do cliente
4. Escolha:
   - **Aceitar:** Clique em **"Aceitar"** se pode atender
   - **Rejeitar:** Clique em **"Rejeitar"** se não pode atender

**Para Solicitações Aceitas:**
- Após realizar o serviço, clique em **"Marcar como Concluída"**

#### Informações Exibidas

Cada solicitação mostra:
- Nome e email do cliente
- Serviço solicitado (nome, descrição, duração, preço)
- Data/hora desejada (se especificada)
- Observações do cliente
- Data de criação da solicitação

---

## 👤 Para Clientes

### 1. Registro e Login

#### Criar Conta como Cliente

1. Acesse `http://localhost:3000`
2. Clique em **"Registre-se"** ou acesse `/register`
3. Preencha o formulário:
   - **Nome:** Seu nome completo
   - **Email:** Seu email
   - **Senha:** Mínimo 6 caracteres
   - **Tipo de Conta:** Selecione **"Cliente"**
   - **Telefone:** (Opcional)
4. Clique em **"Registrar"**

#### Fazer Login

1. Acesse `http://localhost:3000`
2. Digite seu **email** e **senha**
3. Clique em **"Entrar"**

---

### 2. Encontrar Personal Trainers

#### Ver Lista de Trainers

1. No dashboard, clique em **"👥 Personal Trainers"**
2. Você verá uma lista de todos os personal trainers cadastrados
3. Cada card mostra:
   - Nome do trainer
   - Email
   - Telefone (se disponível)

#### Ver Serviços de um Trainer

1. Na lista de trainers, clique em **"Ver Serviços"** no trainer desejado
2. Você verá todos os serviços que aquele trainer oferece
3. Cada serviço mostra:
   - Nome
   - Descrição
   - Duração
   - Preço

---

### 3. Fazer Agendamento Específico

Use esta opção quando você já sabe exatamente quando quer ser atendido.

#### Passo a Passo

1. Acesse **"👥 Personal Trainers"**
2. Clique em **"Ver Serviços"** no trainer desejado
3. Clique em **"Fazer Agendamento Específico"**
4. Preencha o formulário:
   - **Data e Hora:** Selecione quando deseja ser atendido
     - Formato: DD/MM/AAAA HH:MM
   - **Duração (minutos):** Quanto tempo você precisa
     - Ex: 60, 90, 120
   - **Observações:** (Opcional) Informações adicionais
     - Ex: "Primeira consulta", "Foco em perda de peso"
5. Clique em **"Criar Agendamento"**

#### O Que Acontece Depois

- O agendamento fica com status **"Pendente"**
- O personal trainer recebe uma notificação (visualiza na seção de agendamentos)
- O trainer pode **Confirmar** ou **Rejeitar**
- Você será notificado quando o status mudar

#### Ver Meus Agendamentos

1. No dashboard, clique em **"📅 Meus Agendamentos"**
2. Veja todos os seus agendamentos e seus status
3. Você pode **Cancelar** agendamentos pendentes

---

### 4. Solicitar Serviço Pontual

Use esta opção quando você quer solicitar um serviço específico que o trainer oferece, mas não tem certeza da data/hora ou quer que o trainer sugira.

#### Passo a Passo

1. Acesse **"👥 Personal Trainers"**
2. Clique em **"Ver Serviços"** no trainer desejado
3. Veja os serviços disponíveis
4. Clique em **"Solicitar Serviço Pontual"**
5. Preencha o formulário:
   - **Serviço:** Selecione qual serviço você quer
     - Ex: "Treino Funcional", "Avaliação Física"
   - **Data e Hora Desejada:** (Opcional)
     - Se você tem preferência, informe
     - Se não tem, deixe em branco
   - **Observações:** (Opcional)
     - Ex: "Preciso de treino para corrida", "Disponível apenas manhãs"
6. Clique em **"Enviar Solicitação"**

#### O Que Acontece Depois

- A solicitação fica com status **"Pendente"**
- O personal trainer recebe a solicitação
- O trainer pode **Aceitar** ou **Rejeitar**
- Se aceita, você pode combinar os detalhes
- Após o serviço, o trainer marca como **"Concluída"**

#### Ver Minhas Solicitações

1. No dashboard, clique em **"🔔 Minhas Solicitações"**
2. Veja todas as suas solicitações e seus status
3. Você pode **Cancelar** solicitações pendentes

---

## 🔄 Fluxos Completos de Uso

### Fluxo 1: Cliente faz agendamento específico

1. **Cliente:** Registra-se e faz login
2. **Cliente:** Acessa "Personal Trainers" e escolhe um trainer
3. **Cliente:** Clica em "Fazer Agendamento Específico"
4. **Cliente:** Preenche data/hora e cria o agendamento
5. **Trainer:** Recebe notificação (vê na seção de agendamentos)
6. **Trainer:** Confirma ou rejeita o agendamento
7. **Cliente:** Vê o status atualizado em "Meus Agendamentos"
8. **Trainer:** Após o atendimento, marca como "Concluído"

### Fluxo 2: Cliente solicita serviço pontual

1. **Cliente:** Registra-se e faz login
2. **Cliente:** Acessa "Personal Trainers" e escolhe um trainer
3. **Cliente:** Vê os serviços disponíveis
4. **Cliente:** Clica em "Solicitar Serviço Pontual"
5. **Cliente:** Seleciona o serviço e envia a solicitação
6. **Trainer:** Recebe a solicitação na seção "Solicitações"
7. **Trainer:** Aceita ou rejeita a solicitação
8. **Cliente:** Vê o status atualizado
9. **Trainer:** Após realizar o serviço, marca como "Concluída"

### Fluxo 3: Trainer cadastra serviços

1. **Trainer:** Registra-se e faz login
2. **Trainer:** Acessa "Meus Serviços"
3. **Trainer:** Cria vários serviços (ex: Treino Funcional, Avaliação Física)
4. **Trainer:** Define preços e durações
5. **Cliente:** Agora pode ver esses serviços ao acessar o trainer

---

## ❓ Dúvidas Frequentes

### Como Personal Trainer

**P: Preciso cadastrar serviços antes de receber agendamentos?**
R: Não é obrigatório, mas é altamente recomendado! Clientes podem fazer agendamentos gerais, mas para solicitações pontuais, você precisa ter serviços cadastrados.

**P: Posso editar um serviço depois de criado?**
R: Sim! Clique em "Editar" no serviço e modifique o que precisar.

**P: O que acontece se eu deletar um serviço?**
R: O serviço fica desativado e não aparece mais para clientes, mas solicitações já feitas permanecem.

**P: Como sei quando recebo um novo agendamento?**
R: Acesse a seção "Agendamentos" e veja os itens com status "Pendente".

**P: Posso rejeitar um agendamento?**
R: Sim, você pode rejeitar agendamentos pendentes clicando em "Rejeitar".

### Como Cliente

**P: Qual a diferença entre agendamento específico e solicitação pontual?**
R: 
- **Agendamento específico:** Você define data/hora exata, o trainer apenas confirma
- **Solicitação pontual:** Você solicita um serviço, o trainer decide se aceita e quando pode atender

**P: Posso cancelar um agendamento?**
R: Sim, você pode cancelar agendamentos com status "Pendente" ou "Confirmado".

**P: Como vejo se meu agendamento foi confirmado?**
R: Acesse "Meus Agendamentos" e veja o status. Verde = Confirmado.

**P: Posso solicitar um serviço sem especificar data/hora?**
R: Sim! Deixe o campo "Data e Hora Desejada" em branco ao criar a solicitação.

**P: O que fazer se meu agendamento foi rejeitado?**
R: Você pode tentar criar um novo agendamento em outra data/hora ou escolher outro trainer.

### Gerais

**P: Os dados são salvos permanentemente?**
R: Sim, todos os dados são salvos no banco de dados SQLite (`server/database/database.sqlite`).

**P: Posso ter múltiplas contas?**
R: Sim, você pode criar quantas contas quiser com emails diferentes.

**P: Como faço logout?**
R: Clique no botão "Sair" no canto superior direito do dashboard.

**P: O sistema funciona offline?**
R: Não, você precisa estar com o servidor rodando (`npm run dev`).

**P: Posso usar em produção?**
R: Sim, mas lembre-se de:
- Mudar o JWT_SECRET para algo mais seguro
- Configurar um banco de dados mais robusto (PostgreSQL, MySQL)
- Configurar HTTPS
- Adicionar validações adicionais de segurança

---

## 🎯 Dicas de Uso

### Para Personal Trainers:
- ✅ Cadastre todos os serviços que oferece logo no início
- ✅ Seja claro nas descrições dos serviços
- ✅ Responda agendamentos e solicitações rapidamente
- ✅ Use as observações para comunicar melhor com clientes

### Para Clientes:
- ✅ Veja os serviços disponíveis antes de fazer agendamento
- ✅ Use observações para informar suas necessidades
- ✅ Seja específico na data/hora para agendamentos
- ✅ Verifique regularmente o status de seus agendamentos

---

## 🆘 Problemas Comuns

### Erro ao iniciar o servidor
- Verifique se a porta 5000 não está em uso
- Certifique-se de ter instalado as dependências (`npm run install-all`)

### Erro ao acessar o frontend
- Verifique se a porta 3000 não está em uso
- Certifique-se de que o comando `npm run dev` está rodando

### Erro de autenticação
- Verifique se você está usando o email e senha corretos
- Tente criar uma nova conta

### Dados não aparecem
- Recarregue a página (F5)
- Verifique se o servidor backend está rodando
- Verifique o console do navegador para erros

---

**Pronto! Agora você está pronto para usar o sistema completamente! 🎉**

Se tiver mais dúvidas, consulte o código ou entre em contato com o suporte.






