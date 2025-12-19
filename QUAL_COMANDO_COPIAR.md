# 📋 Qual Comando Copiar?

## 🎯 O Comando Que Vai Aparecer

Quando você executar `CONFIGURAR-INICIO-AUTOMATICO.bat`, o PM2 vai mostrar um comando na tela.

### Comando Mais Comum:

```
pm2 startup
```

### Ou Pode Aparecer:

```
pm2 startup windows
```

### Ou Pode Aparecer Algo Mais Longo Tipo:

```
pm2 startup windows -u User --hp C:\Users\User
```

---

## 📝 Como Vai Aparecer na Tela

A janela vai mostrar algo assim:

```
Configurando PM2 para iniciar no boot do Windows...
[PM2] Init System found: windows
[PM2] To setup the Startup Script, copy/paste the following command:

pm2 startup windows -u User --hp C:\Users\User
     ↑
     COPIE ESTE COMANDO INTEIRO!
```

---

## ✅ O Que Você Faz

1. **Selecione TODO o comando** que aparecer
   - Pode ser só `pm2 startup`
   - Ou pode ser mais longo como `pm2 startup windows -u User --hp C:\Users\User`
   
2. **Copie** (Ctrl + C)

3. **Cole na mesma janela** (Ctrl + V)

4. **Aperte Enter**

---

## 🔍 Exemplo Prático

### Se Aparecer:
```
pm2 startup
```
→ Copie `pm2 startup` e cole

### Se Aparecer:
```
pm2 startup windows -u User --hp C:\Users\User
```
→ Copie TUDO isso e cole

---

## ⚠️ Importante

**NÃO digite manualmente!**

Sempre **COPIE e COLE** o comando que aparecer na tela, porque:
- Pode ter espaços especiais
- Pode ter seu nome de usuário
- Pode ter caminhos específicos do seu PC

**Sempre copie exatamente como aparece!**

---

## ✅ Resumo

**O comando geralmente é:** `pm2 startup` ou uma versão mais longa

**Mas sempre copie o que aparecer na tela!** Não tente adivinhar! 😊

