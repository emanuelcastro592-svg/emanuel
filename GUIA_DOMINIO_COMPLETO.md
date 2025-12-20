# 🌐 Guia Completo: Configurar personalsuper2.com.br

## 📋 Checklist

- [ ] Domínio registrado (personalsuper2.com.br)
- [ ] Servidor na nuvem ou IP público
- [ ] DNS configurado
- [ ] SSL/HTTPS configurado
- [ ] Código atualizado

---

## 🚀 Passo 1: Preparar o Código

### 1.1. Configurar Variáveis de Ambiente

**Arquivo: `.env` (raiz do projeto)**
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=seu-secret-key-super-seguro-aqui

DOMAIN=personalsuper2.com.br
CLIENT_URL=https://personalsuper2.com.br
API_URL=https://personalsuper2.com.br/api
```

**Arquivo: `client/.env` (pasta client)**
```env
REACT_APP_API_URL=https://personalsuper2.com.br/api
```

### 1.2. Fazer Build do React

```bash
cd client
npm run build
```

Isso cria a pasta `client/build` com os arquivos otimizados.

---

## 🌍 Passo 2: Configurar DNS

No painel do seu domínio (Registro.br, GoDaddy, etc.):

### Registro A:
```
Nome: @
Tipo: A
Valor: IP_DO_SEU_SERVIDOR
TTL: 3600
```

### Registro A (www):
```
Nome: www
Tipo: A
Valor: IP_DO_SEU_SERVIDOR
TTL: 3600
```

**Ou CNAME:**
```
Nome: www
Tipo: CNAME
Valor: personalsuper2.com.br
TTL: 3600
```

---

## 🔒 Passo 3: Configurar SSL/HTTPS

### Opção A: Let's Encrypt (Grátis)

1. **Instalar Certbot:**
```bash
# Windows (usando WSL ou servidor Linux)
sudo apt-get update
sudo apt-get install certbot
```

2. **Gerar Certificado:**
```bash
sudo certbot certonly --standalone -d personalsuper2.com.br -d www.personalsuper2.com.br
```

3. **Renovação Automática:**
```bash
sudo certbot renew --dry-run
```

### Opção B: Nginx como Proxy Reverso

**Configuração Nginx (`/etc/nginx/sites-available/personalsuper2.com.br`):**

```nginx
server {
    listen 80;
    server_name personalsuper2.com.br www.personalsuper2.com.br;
    
    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name personalsuper2.com.br www.personalsuper2.com.br;

    ssl_certificate /etc/letsencrypt/live/personalsuper2.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/personalsuper2.com.br/privkey.pem;

    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Proxy para API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Servir arquivos estáticos do React
    location / {
        root /caminho/para/seu/projeto/client/build;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🖥️ Passo 4: Deploy no Servidor

### 4.1. Enviar Código para o Servidor

```bash
# Usando Git
git clone seu-repositorio
cd NEW-APP

# Ou usando SCP/FTP
scp -r . usuario@seu-servidor:/caminho/do/projeto
```

### 4.2. Instalar Dependências

```bash
npm install
cd client
npm install
cd ..
npm run build
```

### 4.3. Configurar PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Configurar início automático
```

---

## ✅ Passo 5: Testar

1. **Aguardar propagação DNS** (pode levar até 48h, geralmente 1-2h)
2. **Testar acesso:**
   - https://personalsuper2.com.br
   - https://www.personalsuper2.com.br
3. **Verificar SSL:**
   - https://www.ssllabs.com/ssltest/

---

## 🔧 Troubleshooting

### DNS não está funcionando?
- Aguarde até 48h para propagação completa
- Verifique se os registros estão corretos
- Use: `nslookup personalsuper2.com.br`

### Erro de CORS?
- Verifique se o domínio está em `allowedOrigins` no servidor
- Verifique se `CLIENT_URL` está correto no `.env`

### Certificado SSL não funciona?
- Verifique se as portas 80 e 443 estão abertas no firewall
- Verifique se o certificado está no caminho correto
- Verifique se o Nginx está configurado corretamente

---

## 📞 Próximos Passos

**Me informe:**
1. ✅ Você já tem o domínio registrado?
2. ✅ Você tem um servidor na nuvem?
3. ✅ Qual é o IP do seu servidor?

Com essas informações, posso ajudar com a configuração específica! 🚀

