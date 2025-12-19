# 📝 Como Executar o Comando do PM2

## 🎯 O Que Acontece Quando Você Executa o Script

Quando você executa `CONFIGURAR-INICIO-AUTOMATICO.bat` como administrador:

1. Uma janela preta (PowerShell/CMD) vai abrir
2. O PM2 vai mostrar um **comando** na tela
3. Você precisa **copiar e colar** esse comando na mesma janela
4. Pressionar Enter

---

## 📋 Passo a Passo Detalhado

### Passo 1: Executar o Script
- Clique com botão direito em `CONFIGURAR-INICIO-AUTOMATICO.bat`
- Escolha "Executar como administrador"
- Uma janela preta vai abrir

### Passo 2: O Que Você Vai Ver

A janela vai mostrar algo assim:

```
========================================
  Configurar Inicio Automatico
========================================

Este script configura o site para iniciar
automaticamente quando o Windows iniciar.

IMPORTANTE: Execute como Administrador!

Pressione qualquer tecla para continuar...
```

**Aperte qualquer tecla** (Enter, Espaço, etc.)

### Passo 3: O Comando Aparecerá

Depois de pressionar, você verá algo como:

```
Configurando PM2 para iniciar no boot do Windows...
[PM2] Init System found: windows
[PM2] To setup the Startup Script, copy/paste the following command:
pm2 startup
```

**OU** pode aparecer um comando mais longo, tipo:

```
[PM2] To setup the Startup Script, copy/paste the following command:
pm2 startup
```

### Passo 4: Copiar o Comando

1. **Selecione o comando** que apareceu na tela
   - Clique e arraste o mouse sobre o texto do comando
   - Ou clique três vezes para selecionar a linha inteira

2. **Copie** (Ctrl + C)

### Passo 5: Colar e Executar

1. **Clique dentro da janela preta** (na área onde você digita)
2. **Cole o comando** (Ctrl + V)
3. **Pressione Enter**

### Passo 6: Pronto!

Se tudo der certo, você verá uma mensagem de sucesso e a janela pode fechar ou mostrar "Configuração Concluída!"

---

## 🖼️ Exemplo Visual

```
┌─────────────────────────────────────────┐
│  Janela do PowerShell/CMD               │
│                                         │
│  [PM2] To setup the Startup Script,    │
│  copy/paste the following command:      │
│                                         │
│  pm2 startup                           │  ← COPIE ESTE COMANDO
│                                         │
│  (ou pode aparecer um comando mais     │
│   longo, tipo:)                         │
│                                         │
│  pm2 startup windows                    │
│                                         │
└─────────────────────────────────────────┘
```

**Você faz:**
1. Seleciona o comando (pm2 startup)
2. Copia (Ctrl + C)
3. Cola na mesma janela (Ctrl + V)
4. Pressiona Enter

---

## ⚠️ Importante

### Você NÃO Precisa:
- ❌ Abrir uma nova janela do CMD
- ❌ Digitar o comando manualmente
- ❌ Fazer nada complicado

### Você SÓ Precisa:
- ✅ Copiar o comando que aparece na tela
- ✅ Colar na mesma janela
- ✅ Pressionar Enter

---

## 🔍 Se Não Aparecer Nenhum Comando?

Se o script executar e não mostrar nenhum comando para copiar, pode ser que:

1. **Já está configurado** - O PM2 pode já estar configurado
2. **Erro** - Pode ter dado algum erro

Nesse caso, você pode tentar executar manualmente no PowerShell (como administrador):

```powershell
pm2 startup
```

Depois execute:
```powershell
pm2 save
```

---

## ✅ Resumo Rápido

1. Execute `CONFIGURAR-INICIO-AUTOMATICO.bat` como administrador
2. Uma janela preta abre
3. **Copie o comando** que aparecer na tela
4. **Cole na mesma janela** e pressione Enter
5. Pronto! ✅

**É só isso!** Não precisa abrir outra janela do CMD. Tudo acontece na mesma janela que abriu! 🎉

