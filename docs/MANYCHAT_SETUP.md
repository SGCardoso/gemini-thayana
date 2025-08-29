# Configuração ManyChat - Bot Thayana

## Pré-requisitos
- Conta ManyChat (free ou pro)
- URL pública da aplicação (após deploy)

## Passo a Passo

### 1. Fazer Deploy da Aplicação

**Opção A: Railway (Recomendado)**
1. Acesse https://railway.app
2. Login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione o repositório `gemini-thayana`
5. Aguarde o deploy automático
6. Configure as variáveis de ambiente:
   - `GEMINI_API_KEY` = `AIzaSyDB-5PpOlT1-mowC6OIwCSXKpubZdPxtdo`
   - `NODE_ENV` = `production`
7. Anote a URL gerada (ex: `https://gemini-thayana-production.up.railway.app`)

**Opção B: Railway CLI**
```bash
railway login
railway init
railway up
railway variables set GEMINI_API_KEY=AIzaSyDB-5PpOlT1-mowC6OIwCSXKpubZdPxtdo
railway variables set NODE_ENV=production
```

### 2. Configurar ManyChat

#### 2.1 Criar Flow Principal
1. Acesse ManyChat → Automation → Flows
2. Criar novo flow: "Atendimento Thayana"

#### 2.2 Configurar Trigger
1. Trigger: "User Input" → "Any text input"
2. Condition: "não contém" → "menu, inicio, começar"

#### 2.3 Adicionar External Request
1. Action: "External Request"
2. Configurações:
   - **Request URL**: `https://SUA-URL.com/manychat/webhook`
   - **Request Type**: `POST`
   - **Request Body**: `JSON`
   - **Headers**: 
     ```
     Content-Type: application/json
     ```

#### 2.4 Configurar Request Body
```json
{
  "last_input_text": "{{last_input_text}}",
  "first_name": "{{first_name}}",
  "last_name": "{{last_name}}",
  "user_id": "{{user_id}}",
  "custom_fields": {
    "phone": "{{phone}}",
    "email": "{{email}}"
  }
}
```

#### 2.5 Usar Response na Mensagem
1. Adicionar "Send Message" após External Request
2. Text: `{{external_request.content.messages.0.text}}`

#### 2.6 Configurar Actions (Opcional)
Para tags automáticas, adicionar "Set Tag" após a mensagem:
- Condition: `{{external_request.content.actions.0.action}}` equals "add_tag"
- Tag: `{{external_request.content.actions.0.tag_name}}`

### 3. Configurar Menu Principal (Opcional)
1. Criar flow "Menu Principal"
2. Trigger: "User Input" → contains "menu, inicio, começar"
3. Quick Replies:
   - 🤱 "Amamentação"
   - 👶 "Desenvolvimento"
   - 🍼 "Alimentação" 
   - 😴 "Sono"
   - 🩺 "Saúde"
   - 🤖 "Falar com Thayana"

### 4. Testar Integração

#### 4.1 Teste Manual ManyChat
1. Preview do flow no ManyChat
2. Enviar mensagem teste: "Meu bebê não dorme"
3. Verificar resposta da Thayana

#### 4.2 Teste via API
```bash
curl -X POST https://SUA-URL.com/manychat/webhook \
-H "Content-Type: application/json" \
-d '{"last_input_text":"Teste de cólicas","first_name":"Maria"}'
```

#### 4.3 Monitorar Logs
- Railway: Dashboard → Deploy logs
- Heroku: `heroku logs --tail`

### 5. Configurações Avançadas

#### 5.1 Campos Customizados
No ManyChat, criar campos:
- `ultimo_topico` (Last Topic)
- `urgencia_nivel` (Urgency Level)  
- `precisa_suporte` (Needs Support)

#### 5.2 Tags Automáticas
- `URGENTE_SUPORTE_HUMANO`
- `TOPICO_AMAMENTACAO`
- `TOPICO_DESENVOLVIMENTO`
- `TOPICO_SAUDE`

#### 5.3 Segmentação
Usar campos customizados para:
- Campanhas segmentadas por tópico
- Escalação automática para suporte humano
- Relatórios de engajamento

### 6. Troubleshooting

#### Webhook não responde:
- Verificar se URL está acessível: `curl https://SUA-URL.com/health`
- Verificar logs da aplicação
- Testar endpoint isoladamente

#### Resposta vazia ou erro:
- Verificar se GEMINI_API_KEY está configurada
- Testar: `curl "https://SUA-URL.com/manychat/test?message=teste"`

#### ManyChat não recebe resposta:
- Verificar formato JSON da resposta
- Confirmar que `version: "v1"` está presente
- Verificar structure: `content.messages[0].text`

## URLs Importantes
- Health Check: `https://SUA-URL.com/health`
- Teste Direto: `https://SUA-URL.com/manychat/test?message=SUA_MENSAGEM`
- Webhook: `https://SUA-URL.com/manychat/webhook`
- Status: `https://SUA-URL.com/`