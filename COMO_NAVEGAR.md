# 📂 Como Navegar para o Diretório do Projeto

## 🎯 Método 1: Copiar e Colar (Mais Fácil)

### No PowerShell:

1. **Digite este comando:**
```powershell
cd "C:\Users\User\Downloads\NEW APP"
```

2. **Pressione Enter**

3. **Verifique se está no lugar certo:**
```powershell
pwd
```
Deve mostrar: `C:\Users\User\Downloads\NEW APP`

---

## 🎯 Método 2: Navegação Passo a Passo

Se preferir navegar passo a passo:

```powershell
# 1. Ir para a pasta do usuário
cd C:\Users\User

# 2. Ir para Downloads
cd Downloads

# 3. Ir para NEW APP
cd "NEW APP"
```

---

## 🎯 Método 3: Usar o Explorador de Arquivos

1. Abra o **Explorador de Arquivos** do Windows
2. Navegue até: `C:\Users\User\Downloads\NEW APP`
3. Clique na barra de endereço e copie o caminho
4. No PowerShell, digite:
```powershell
cd 
```
5. Cole o caminho (Ctrl+V) e pressione Enter

---

## 🎯 Método 4: Arrastar e Soltar (Mais Rápido!)

1. Abra o **Explorador de Arquivos**
2. Navegue até a pasta `NEW APP`
3. No PowerShell, digite: `cd ` (com espaço no final)
4. **Arraste a pasta** do Explorador para o PowerShell
5. O caminho será colado automaticamente!
6. Pressione Enter

---

## ✅ Verificar se Está no Diretório Correto

Após navegar, verifique se está no lugar certo:

```powershell
# Ver o caminho atual
pwd

# Ver os arquivos (deve mostrar package.json)
dir

# Ou ver apenas package.json
dir package.json
```

Se aparecer o arquivo `package.json`, você está no lugar certo! ✅

---

## 🚀 Depois de Navegar, Execute:

```powershell
# 1. Instalar dependências (se ainda não instalou)
npm run install-all

# 2. Iniciar o sistema
npm run dev
```

---

## 💡 Dica: Criar um Atalho

Para não precisar navegar toda vez, você pode:

1. Abrir o PowerShell
2. Navegar até o diretório uma vez
3. Clicar com botão direito na barra de título do PowerShell
4. Ir em "Propriedades" → "Iniciar em"
5. Colar: `C:\Users\User\Downloads\NEW APP`

Assim, toda vez que abrir o PowerShell, já estará no diretório do projeto!

---

## 📝 Comandos Úteis

```powershell
# Ver onde estou
pwd

# Ver arquivos e pastas
dir
# ou
ls

# Voltar uma pasta
cd ..

# Ir para a pasta home do usuário
cd ~
# ou
cd $HOME

# Limpar a tela
cls
```

---

**Agora você sabe como navegar! 🎉**





