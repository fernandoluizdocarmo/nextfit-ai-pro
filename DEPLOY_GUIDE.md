# 🚀 Deploy Guide - treinox.ai

**Seu app em produção em <10 minutos**

---

## 📋 Pré-requisitos

- ✅ Código testado localmente
- ✅ Groq API Key obtida
- ✅ Conta em Render/Heroku/AWS
- ✅ Repositório Git atualizado

---

## 🎯 Opção 1: Deploy em Render (⭐ Recomendado)

### Passo 1: Conectar GitHub

1. Vá para https://dashboard.render.com
2. Clique em "New +" → "Web Service"
3. Clique em "Connect account" (GitHub)
4. Autorize o acesso
5. Selecione seu repositório `treinox-ai-pro`

### Passo 2: Configurar Build

```
Name:           treinox-ai (ou seu nome)
Environment:    Node
Build Command:  npm install
Start Command:  npm start
```

### Passo 3: Variáveis de Ambiente

Clique em "Advanced" → "Add Environment Variable"

```
GROQ_API_KEY = gsk_seu_valor_aqui
NODE_ENV     = production
```

### Passo 4: Deploy

Clique em "Create Web Service"

⏳ Aguarde 2-3 minutos...

✅ Seu app estará em: `https://seu-app.onrender.com`

### Passo 5: Setup Keep-Alive (Importante!)

Sem isso, app dorme após 15 minutos de inatividade.

1. Vá para https://cron-job.org
2. Clique em "Create cronjob"
3. Preencha:
   - **Title**: `treinox-ai keep-alive`
   - **URL**: `https://seu-app.onrender.com/ping`
   - **Execution Time**: Every 5 minutes

4. Clique em "Create"

✅ App nunca vai dormir agora!

---

## 🎯 Opção 2: Deploy em Heroku

### Passo 1: Install Heroku CLI

```bash
# Mac
brew install heroku

# Windows
# Download: https://devcenter.heroku.com/articles/heroku-cli
```

### Passo 2: Login

```bash
heroku login
```

### Passo 3: Criar App

```bash
cd seu-projeto
heroku create seu-app-name
```

### Passo 4: Configurar Variáveis

```bash
heroku config:set GROQ_API_KEY=gsk_seu_valor
heroku config:set NODE_ENV=production
```

### Passo 5: Deploy

```bash
git push heroku main
```

⏳ Aguarde...

✅ Seu app estará em: `https://seu-app-name.herokuapp.com`

---

## 🎯 Opção 3: Deploy em AWS (EB)

### Passo 1: Install EB CLI

```bash
pip install awsebcli --upgrade --user
```

### Passo 2: Initialize

```bash
cd seu-projeto
eb init -p node.js-18 treinox-ai --region us-east-1
```

### Passo 3: Create Environment

```bash
eb create treinox-ai-env
```

### Passo 4: Configure Env Variables

```bash
eb setenv GROQ_API_KEY=gsk_seu_valor NODE_ENV=production
```

### Passo 5: Deploy

```bash
eb deploy
```

✅ Seu app estará em: `treinox-ai-env.elasticbeanstalk.com`

---

## 🐳 Opção 4: Deploy com Docker

### Passo 1: Build Local

```bash
docker build -t treinox-ai .
docker run -p 3000:3000 -e GROQ_API_KEY=gsk_valor treinox-ai
```

### Passo 2: Push para Docker Hub

```bash
docker tag treinox-ai seu-usuario/treinox-ai:latest
docker push seu-usuario/treinox-ai:latest
```

### Passo 3: Deploy (DigitalOcean/AWS/etc)

Cada plataforma tem suas instruções, mas basicamente:

```bash
docker pull seu-usuario/treinox-ai:latest
docker run -p 80:3000 -e GROQ_API_KEY=gsk_valor seu-usuario/treinox-ai:latest
```

---

## ✅ Pós-Deploy Checklist

### 1. Verificar Status

```bash
# Render:
curl https://seu-app.onrender.com/ping
# Esperado: "OK"

# Heroku:
heroku logs -f
# Procurar por: "✅ treinox.ai server running"
```

### 2. Testar IA

1. Abra seu app em produção
2. Clique em "Criar Ficha"
3. Deixe IA gerar (10-15s)
4. ✅ Deve funcionar!

### 3. Testar Offline

```
DevTools → Network → Offline
App continua funcionando ✅
```

### 4. Verificar Logs

```bash
# Render:
# Dashboard → seu-app → Logs

# Heroku:
heroku logs -f --tail

# Procurar por erros vermelhos:
# ❌ Se houver, verificar GROQ_API_KEY
```

### 5. Verificar SSL

```
URL deve ser: https://seu-app.com
Cadeado 🔒 deve estar verde
```

---

## 🔄 Deploy Automático (CI/CD)

### GitHub Actions (Render)

Criar arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
        run: |
          curl -X POST "https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys" \
          -H "Authorization: Bearer $RENDER_API_KEY"
```

Pronto! A cada `git push`, app é deployado automaticamente.

---

## 🔐 Variáveis de Ambiente em Produção

### Render
Dashboard → Environment

### Heroku
```bash
heroku config:set VAR_NAME=value
```

### AWS
Systems Manager → Parameter Store

### Docker
```bash
docker run -e VAR_NAME=value
```

---

## 📊 Monitoramento

### Health Check

```bash
# Setup no seu servidor:
GET /ping
# Returns: "OK" com status 200
```

### Logs

- **Render**: Painel web integrado
- **Heroku**: `heroku logs -f`
- **AWS**: CloudWatch
- **Docker**: `docker logs container_id`

### Uptime Monitor

Use serviço gratuito:
- UptimeRobot: https://uptimerobot.com
- Updown: https://updown.io

---

## 🚨 Troubleshooting

### "Application failed to start"

```bash
# Verificar logs
heroku logs --tail

# Problema comum: GROQ_API_KEY não configurada
# Solução:
heroku config:set GROQ_API_KEY=seu_valor
```

### "Cannot find module 'express'"

```bash
# Problema: npm install não rodou
# Solução: Verificar package.json e Build Command
# Render:   npm install
# Heroku:   npm install (automático)
```

### "Port 3000 in use"

```bash
# Problema: Porta já está em uso
# Render: automático (outro port)
# Heroku: automático (environ var PORT)
```

### "Service Worker error"

```
DevTools → Application → Service Workers
Verificar status: "activated and running"
Se não: Delete cache e reload
```

---

## 💡 Best Practices

1. **Sempre use HTTPS** em produção
2. **Configure Keep-Alive** (se não automático)
3. **Monitor logs** regularmente
4. **Teste antes de deploy** localmente
5. **Use staging environment** para mudanças grandes
6. **Backup dados** regularmente
7. **Atualize dependências** periodicamente

---

## 📚 Documentação Oficial

- **Render**: https://docs.render.com
- **Heroku**: https://devcenter.heroku.com
- **AWS**: https://docs.aws.amazon.com/eb
- **Docker**: https://docs.docker.com

---

## 🎯 Resumo

| Platform | Tempo | Preço | Keep-Alive | Recomendação |
|----------|-------|-------|-----------|--------------|
| Render | 3 min | Free | Manual | ⭐⭐⭐ Melhor |
| Heroku | 5 min | Free | Automático | ⭐⭐ Bom |
| AWS EB | 10 min | Free | Automático | ⭐⭐ Bom |
| Docker | Variável | Variável | Manual | ⭐⭐ Flexível |

---

**✨ Seu app está pronto para o mundo! 🚀**

Para mais ajuda: [GUIA_SEGURANCA.md](GUIA_SEGURANCA.md)
