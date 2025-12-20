# 🌐 Configurar Domínio: personalsuper2.com.br

## 📋 O Que Você Precisa Saber

Para usar um domínio personalizado, você precisa:

1. ✅ **Ter o domínio registrado** (personalsuper2.com.br)
2. ✅ **Ter um servidor público** (não localhost)
3. ✅ **Configurar DNS** para apontar para seu servidor
4. ✅ **Configurar SSL/HTTPS** (certificado)

---

## 🎯 Opções de Hospedagem

### Opção 1: Servidor na Nuvem (Recomendado)
- **VPS/Cloud** (DigitalOcean, AWS, Azure, etc.)
- **Hospedagem compartilhada** com Node.js
- **Vantagem:** Acessível de qualquer lugar
- **Custo:** ~R$ 20-100/mês

### Opção 2: Servidor Local com IP Público
- Seu computador com IP público fixo
- **Vantagem:** Grátis (se já tiver IP fixo)
- **Desvantagem:** Precisa deixar PC ligado 24/7

---

## 📝 Passo a Passo

### 1. Registrar o Domínio

Se ainda não tem o domínio:
- Registre em: Registro.br, GoDaddy, Namecheap, etc.
- Custo: ~R$ 30-50/ano

### 2. Configurar DNS

No painel do seu domínio, configure:

**Registro A:**
```
personalsuper2.com.br    → IP_DO_SEU_SERVIDOR
www.personalsuper2.com.br → IP_DO_SEU_SERVIDOR
```

**Ou CNAME (se usar hospedagem):**
```
www → personalsuper2.com.br
```

### 3. Configurar o Servidor

Siga as instruções abaixo para configurar o código.

---

## ⚙️ Configuração do Código

### Arquivo: `.env` (raiz do projeto)

```env
PORT=5000
JWT_SECRET=seu-secret-key-super-seguro-aqui
NODE_ENV=production

# Domínio
DOMAIN=personalsuper2.com.br
API_URL=https://personalsuper2.com.br/api
CLIENT_URL=https://personalsuper2.com.br
```

### Arquivo: `client/.env` (pasta client)

```env
REACT_APP_API_URL=https://personalsuper2.com.br/api
```

---

## 🔒 Configurar SSL/HTTPS

### Opção 1: Let's Encrypt (Grátis)
```bash
# Instalar Certbot
# Gerar certificado
certbot certonly --standalone -d personalsuper2.com.br -d www.personalsuper2.com.br
```

### Opção 2: Nginx como Proxy Reverso
Configure Nginx para:
- Receber HTTPS na porta 443
- Redirecionar para seu app Node.js na porta 5000

---

## 🚀 Deploy em Servidor

### 1. Fazer Build do React
```bash
cd client
npm run build
```

### 2. Configurar Servidor para Servir Build
O servidor precisa servir os arquivos estáticos do build.

---

## 📞 Próximos Passos

**Me diga:**
1. Você já tem o domínio registrado?
2. Você tem um servidor na nuvem ou vai usar local?
3. Você tem IP público fixo?

Com essas informações, eu te ajudo a configurar tudo! 🚀

