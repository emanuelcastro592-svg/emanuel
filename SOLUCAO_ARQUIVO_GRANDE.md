# ⚠️ Arquivo Muito Grande - Solução

## 🎯 Problema

O GitHub não aceita arquivos maiores que 25MB via upload web.

## ✅ Solução: Usar Git (Sem Limite!)

### Opção 1: Script Automático (Mais Fácil)

1. **Instalar Git (se não tiver):**
   - Baixe: https://git-scm.com/download/win
   - Instale (deixe tudo padrão)

2. **Execute o script:**
   - Dê duplo clique em: `ENVIAR_COM_GIT.bat`
   - Siga as instruções na tela

3. **Pronto!** ✅

---

### Opção 2: Manual (Se o Script Não Funcionar)

1. **Instalar Git:**
   - https://git-scm.com/download/win

2. **Abrir PowerShell na pasta do projeto:**
   ```powershell
   cd "c:\Users\User\Downloads\NEW APP"
   ```

3. **Executar comandos:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/emanuelcastro592-svg/emanuel.git
   git branch -M main
   git push -u origin main
   ```

4. **Quando pedir:**
   - Usuário: seu usuário do GitHub
   - Senha: use um **Personal Access Token** (não a senha normal)
   - Como criar token: https://github.com/settings/tokens

---

### Opção 3: Excluir Arquivos Grandes

Se ainda quiser usar upload web, exclua:

- `node_modules/` (se existir)
- `client/node_modules/` (se existir)
- `client/build/` (já foi criado, pode excluir)
- Qualquer arquivo `.zip`

Depois tente fazer ZIP novamente.

---

## 🚀 Recomendação

**Use a Opção 1 (script)** - é mais fácil e não tem limite de tamanho!

**O Git não tem limite de 25MB!** ✅


