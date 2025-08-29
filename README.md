# 🤱 Bot Thayana - Assistente Virtual para Mães

Bot inteligente integrado ao ManyChat que utiliza Gemini AI para fornecer orientações sobre cuidados infantis, amamentação, desenvolvimento e saúde de bebês.

## ✨ Funcionalidades

- 🤖 **Respostas inteligentes** via Gemini 1.5 Flash
- 📱 **Integração completa** com ManyChat (webhook + actions)
- 🏷️ **Tags automáticas** para segmentação e escalação
- 🔍 **Análise de urgência** para casos que precisam atenção médica
- 📊 **Campos customizados** para personalização
- 🚀 **3 rotas de integração**: Direta, n8n e teste

## 🚀 Quick Start

### 1. Instalação
```bash
git clone [repo-url]
cd gemini-thayana
npm install
```

### 2. Configuração
```bash
cp .env.example .env
# Editar .env com sua GEMINI_API_KEY
```

### 3. Execução
```bash
npm run dev  # Desenvolvimento
npm start    # Produção
```

### 4. Teste
```bash
node scripts/test-manychat-flow.js
```

## 📡 API Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Status da API |
| `/health` | GET | Health check |
| `/manychat/webhook` | POST | Webhook principal ManyChat |
| `/manychat/test` | GET | Teste direto Gemini |
| `/manychat/n8n` | POST | Integração n8n |

## 🔧 Deploy

### Railway (Recomendado)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway variables set GEMINI_API_KEY=sua_chave
```

### Outros
- [Vercel](./docs/DEPLOY.md#vercel)
- [Heroku](./docs/DEPLOY.md#heroku)

## 📚 Documentação

- [📖 Setup Completo](./docs/SETUP.md)
- [🚀 Guia de Deploy](./docs/DEPLOY.md)
- [🤖 Configuração ManyChat](./docs/MANYCHAT_SETUP.md)
- [📋 Exemplo de Fluxos](./docs/FLUXO_EXEMPLO.md)

## 🧪 Testes Realizados

✅ **100% de Taxa de Sucesso** nos testes automatizados:
- Health check
- Integração Gemini
- Webhooks ManyChat (5 cenários diferentes)
- Rota n8n

Cenários testados:
- Cólicas do bebê
- Problemas de sono  
- Urgências médicas (com tag automática)
- Amamentação
- Desenvolvimento infantil

## 📊 Exemplo de Resposta ManyChat

```json
{
  "version": "v1",
  "content": {
    "messages": [{
      "type": "text",
      "text": "Oi Ana! Que dó do seu bebê com cólicas..."
    }],
    "actions": [{
      "action": "set_field",
      "field_name": "ultimo_topico", 
      "value": "colicas"
    }],
    "quick_replies": []
  }
}
```

## 🏷️ Tags Automáticas

- `URGENTE_SUPORTE_HUMANO` - Casos médicos urgentes
- `TOPICO_AMAMENTACAO` - Dúvidas sobre amamentação
- `TOPICO_DESENVOLVIMENTO` - Desenvolvimento infantil
- `TOPICO_SONO` - Problemas de sono

## 🛡️ Recursos de Segurança

- ✅ Helmet.js para headers de segurança
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Rate limiting (recomendado para produção)
- ✅ Variáveis de ambiente para secrets

## 📈 Monitoramento

- Health check endpoint: `/health`
- Logs detalhados de todas as interações
- Análise automática de sentimento e urgência
- Métricas de resposta e engagement

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch
3. Commit suas mudanças  
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- 📧 Email: [seu-email]
- 📱 WhatsApp: [seu-whatsapp]
- 🐛 Issues: [GitHub Issues](issues)
