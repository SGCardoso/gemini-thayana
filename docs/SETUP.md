# Setup do Bot Thayana

## Pré-requisitos
- Node.js 16+
- Conta Google Cloud com Gemini API habilitada
- Conta ManyChat (free tier é suficiente)

## Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
GEMINI_API_KEY=sua_chave_aqui
PORT=3000
NODE_ENV=development
MANYCHAT_VERIFY_TOKEN=token_do_manychat
```

### 3. Executar o servidor
```bash
# Desenvolvimento
npm run dev

# Produção  
npm start
```

## Configuração ManyChat

### 1. Criar External Request
- Vá em Automation > External Request
- URL: `https://seu-dominio.com/manychat/webhook`
- Method: POST
- Headers: `Content-Type: application/json`

### 2. Configurar Fluxo
1. Trigger: quando usuário envia mensagem
2. Action: External Request para webhook
3. Response: usar `{{response.content.messages.0.text}}`

## Endpoints Disponíveis

- `GET /` - Status da API
- `POST /manychat/webhook` - Webhook principal do ManyChat
- `GET /manychat/test?message=sua_mensagem` - Teste direto
- `POST /manychat/n8n` - Integração n8n
- `GET /health` - Health check

## Teste Local

```bash
# Testar Gemini diretamente
curl "http://localhost:3000/manychat/test?message=Como posso ajudar meu bebê a dormir melhor?"

# Simular webhook ManyChat
curl -X POST http://localhost:3000/manychat/webhook \
  -H "Content-Type: application/json" \
  -d '{"last_input_text":"Meu bebê está com cólicas","first_name":"Maria"}'
```

## Deploy
Para produção, recomendamos:
- Railway, Vercel ou Heroku para hosting
- Configurar HTTPS (obrigatório para webhooks ManyChat)
- Monitoramento com logs