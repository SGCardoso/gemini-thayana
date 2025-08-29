# Deploy - Bot Thayana

## Opção 1: Railway (Recomendado) 🚀

### 1. Preparar repositório
```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### 2. Deploy no Railway
1. Acesse https://railway.app
2. Login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione este repositório
5. Configure variáveis de ambiente:
   - `GEMINI_API_KEY=AIzaSyDB-5PpOlT1-mowC6OIwCSXKpubZdPxtdo`
   - `NODE_ENV=production`
   - `MANYCHAT_VERIFY_TOKEN=seu_token_aqui`

### 3. Obter URL
Após o deploy, Railway fornece uma URL como:
`https://gemini-thayana-bot-production.up.railway.app`

## Opção 2: Vercel

### 1. Instalar Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
vercel
```

### 3. Configurar variáveis
```bash
vercel env add GEMINI_API_KEY
vercel env add NODE_ENV production
```

## Opção 3: Heroku

### 1. Instalar Heroku CLI
```bash
# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2. Login e criar app
```bash
heroku login
heroku create gemini-thayana-bot
```

### 3. Configurar variáveis
```bash
heroku config:set GEMINI_API_KEY=AIzaSyDB-5PpOlT1-mowC6OIwCSXKpubZdPxtdo
heroku config:set NODE_ENV=production
```

### 4. Deploy
```bash
git push heroku main
```

## Configuração ManyChat

Após o deploy, use a URL de produção:
- Webhook URL: `https://sua-url.com/manychat/webhook`
- Method: POST
- Headers: `Content-Type: application/json`

## Teste
```bash
curl "https://sua-url.com/health"
curl "https://sua-url.com/manychat/test?message=Olá"
```