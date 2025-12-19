# 📦 Guia Completo de Instalação

## 🎯 Pré-requisitos

Antes de começar, você precisa ter instalado:

### 1. Node.js
- **Download:** https://nodejs.org/
- **Versão recomendada:** 14.x ou superior
- **Como verificar se já tem:**
  ```powershell
  node --version
  npm --version
  ```
  Se aparecer números de versão, está instalado! ✅

### 2. npm (vem com Node.js)
- Geralmente já vem instalado com Node.js
- **Como verificar:**
  ```powershell
  npm --version
  ```

---

## 📋 Passo a Passo da Instalação

### PASSO 1: Navegar para o Diretório do Projeto

1. Abra o **PowerShell** (ou Terminal)
2. Execute o comando para navegar:
   ```powershell
   cd "C:\Users\User\Downloads\NEW APP"
   ```
3. Verifique se está no lugar certo:
   ```powershell
   pwd
   ```
   Deve mostrar: `C:\Users\User\Downloads\NEW APP`

**💡 Dica:** Se preferir, você pode:
- Abrir o Explorador de Arquivos
- Navegar até a pasta `NEW APP`
- Clicar com botão direito na pasta
- Selecionar "Abrir no Terminal" ou "Abrir no PowerShell"

---

### PASSO 2: Verificar Arquivos do Projeto

Certifique-se de que os arquivos estão presentes:

```powershell
dir
```

Você deve ver:
- ✅ `package.json`
- ✅ Pasta `server/`
- ✅ Pasta `client/`
- ✅ `README.md`

Se não ver esses arquivos, você pode estar no diretório errado!

---

### PASSO 3: Instalar Dependências do Backend e Frontend

Execute o comando que instala tudo de uma vez:

```powershell
npm run install-all
```

**⏱️ Tempo estimado:** 2-5 minutos

**O que acontece:**
1. Instala dependências do backend (Node.js)
2. Instala dependências do frontend (React)

**⚠️ Avisos normais:**
- Você pode ver avisos sobre pacotes "deprecated" - isso é normal
- Você pode ver avisos sobre vulnerabilidades - geralmente não é crítico para desenvolvimento

**✅ Quando terminar:**
- Deve aparecer: `added X packages`
- Não deve ter erros vermelhos críticos

---

### PASSO 4: Criar Arquivo de Configuração (.env)

1. **Criar o arquivo:**
   ```powershell
   New-Item -Path .env -ItemType File -Force
   ```

2. **Editar o arquivo .env:**
   
   Abra o arquivo `.env` com um editor de texto (Bloco de Notas, VS Code, etc.) e adicione:
   ```
   PORT=5000
   JWT_SECRET=sua-chave-secreta-super-segura-aqui-mude-em-producao
   ```

   **💡 Dica:** Você pode usar qualquer texto como JWT_SECRET, mas em produção use algo mais seguro.

3. **Salvar o arquivo**

**Alternativa (criar manualmente):**
- Crie um arquivo chamado `.env` na raiz do projeto
- Cole o conteúdo acima
- Salve

---

### PASSO 5: Verificar Instalação

Antes de iniciar, verifique se tudo está correto:

```powershell
# Verificar se node_modules existe
dir node_modules

# Verificar se client/node_modules existe
dir client\node_modules

# Verificar se .env existe
dir .env
```

Todos devem existir! ✅

---

### PASSO 6: Iniciar o Sistema

Execute o comando para iniciar backend e frontend:

```powershell
npm run dev
```

**O que acontece:**
1. Backend inicia na porta **5000**
2. Frontend inicia na porta **3000**
3. Navegador abre automaticamente em `http://localhost:3000`

**✅ Mensagens de sucesso:**
- Backend: `Servidor rodando na porta 5000`
- Frontend: `Compiled successfully!`
- Navegador abre automaticamente

**⏱️ Primeira vez pode demorar:** 30-60 segundos para compilar

---

## 🎉 Instalação Concluída!

Se tudo funcionou, você verá:
- ✅ Terminal mostrando que o servidor está rodando
- ✅ Navegador aberto em `http://localhost:3000`
- ✅ Tela de login/registro aparecendo

---

## 🔧 Comandos Úteis

### Iniciar o sistema:
```powershell
npm run dev
```

### Parar o sistema:
Pressione `Ctrl + C` no terminal

### Iniciar apenas o backend:
```powershell
npm run server
```

### Iniciar apenas o frontend:
```powershell
npm run client
```

### Reinstalar tudo (se der problema):
```powershell
# Deletar node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force client\node_modules

# Reinstalar
npm run install-all
```

---

## ❌ Problemas Comuns e Soluções

### Problema 1: "npm não é reconhecido"
**Causa:** Node.js não está instalado ou não está no PATH
**Solução:**
1. Instale Node.js de https://nodejs.org/
2. Reinicie o PowerShell após instalar
3. Verifique: `npm --version`

### Problema 2: "Could not read package.json"
**Causa:** Você não está no diretório correto
**Solução:**
```powershell
cd "C:\Users\User\Downloads\NEW APP"
pwd  # Verificar se está correto
```

### Problema 3: "Port 5000 already in use"
**Causa:** Outro programa está usando a porta 5000
**Solução:**
1. Feche outros programas que possam estar usando a porta
2. Ou mude a porta no arquivo `.env`:
   ```
   PORT=5001
   ```
3. E no arquivo `client/src/utils/api.js`, mude:
   ```javascript
   const API_URL = 'http://localhost:5001/api';
   ```

### Problema 4: "Port 3000 already in use"
**Causa:** Outro programa está usando a porta 3000
**Solução:**
1. Feche outros programas (como outro projeto React)
2. Ou o sistema perguntará se quer usar outra porta - digite `Y`

### Problema 5: Erros ao instalar dependências
**Solução:**
```powershell
# Limpar cache do npm
npm cache clean --force

# Reinstalar
npm run install-all
```

### Problema 6: Banco de dados não criado
**Causa:** Backend não iniciou corretamente
**Solução:**
1. Verifique se o arquivo `.env` existe e está correto
2. Inicie apenas o backend: `npm run server`
3. Verifique se aparece: `Banco de dados inicializado com sucesso!`
4. O arquivo `server/database/database.sqlite` será criado automaticamente

---

## 📊 Verificação Final

Execute estes comandos para verificar se tudo está OK:

```powershell
# 1. Verificar Node.js
node --version
npm --version

# 2. Verificar se está no diretório correto
pwd

# 3. Verificar arquivos principais
dir package.json
dir server\index.js
dir client\package.json

# 4. Verificar dependências instaladas
dir node_modules
dir client\node_modules

# 5. Verificar arquivo de configuração
dir .env
```

Todos devem existir! ✅

---

## 🚀 Próximos Passos

Após a instalação bem-sucedida:

1. ✅ Acesse `http://localhost:3000`
2. ✅ Registre-se como Personal Trainer ou Cliente
3. ✅ Comece a usar o sistema!

**Consulte os guias:**
- `GUIA_USO.md` - Como usar o sistema
- `TUTORIAL_PASSO_A_PASSO.md` - Exemplos práticos

---

## 📝 Resumo Rápido

```powershell
# 1. Navegar
cd "C:\Users\User\Downloads\NEW APP"

# 2. Instalar
npm run install-all

# 3. Criar .env (se não existir)
New-Item -Path .env -ItemType File -Force
# Editar .env e adicionar: PORT=5000 e JWT_SECRET=...

# 4. Iniciar
npm run dev

# 5. Acessar
# Abra: http://localhost:3000
```

---

**Pronto! Agora você tem um guia completo de instalação! 🎉**





