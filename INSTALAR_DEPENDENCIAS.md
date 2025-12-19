# 📦 Instalar Dependências do PostgreSQL

## 🎯 Passo a Passo

### 1. Abrir PowerShell

Pressione `Win + X` e escolha "Windows PowerShell" ou "Terminal"

### 2. Navegar até o Projeto

```powershell
cd "C:\Users\User\Downloads\NEW APP"
```

### 3. Instalar Dependências

```powershell
npm install
```

Isso vai instalar:
- ✅ `pg` - Cliente PostgreSQL para Node.js
- ✅ `pg-hstore` - Serialização de dados
- ✅ Todas as outras dependências

### 4. Verificar Instalação

```powershell
npm list pg
```

Se mostrar a versão do `pg`, está instalado! ✅

---

## ⚠️ Se Der Erro

### Erro: "npm não é reconhecido"

**Solução:** Instale o Node.js primeiro:
- Baixe de: https://nodejs.org/
- Instale a versão LTS
- Reinicie o PowerShell

### Erro: "permission denied"

**Solução:** Execute como Administrador:
1. Clique com botão direito no PowerShell
2. Escolha "Executar como administrador"
3. Execute `npm install` novamente

### Erro: "network timeout"

**Solução:** 
- Verifique sua conexão com internet
- Tente novamente: `npm install`

---

## ✅ Próximos Passos

Depois de instalar as dependências:

1. **Configure o PostgreSQL** (veja `COMO_INSTALAR_POSTGRESQL.md`)
2. **Configure o `.env`** (veja `COMO_EDITAR_ENV.md`)
3. **Inicie o servidor:** `npm run server`

---

**Dependências instaladas! 🎉**



