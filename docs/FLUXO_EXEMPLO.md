# Exemplo de Fluxo ManyChat - Bot Thayana

## Fluxo Básico Recomendado

### 1. Mensagem de Boas-vindas
```
🤱 Olá! Eu sou a Thayana, sua assistente para cuidados com bebês!

Como posso te ajudar hoje?

👶 Dúvidas sobre desenvolvimento
🍼 Alimentação e amamentação  
😴 Problemas de sono
🤒 Questões de saúde
💬 Conversar livremente
```

### 2. Configuração do External Request

**Trigger**: User Input (qualquer texto)

**External Request**:
- URL: `https://sua-url.railway.app/manychat/webhook`
- Method: POST
- Content-Type: application/json

**Body**:
```json
{
  "last_input_text": "{{last_input_text}}",
  "first_name": "{{first_name}}",
  "user_id": "{{user_id}}",
  "phone": "{{phone}}",
  "custom_fields": {
    "last_topic": "{{cf_ultimo_topico}}",
    "interaction_count": "{{cf_contador_interacoes}}"
  }
}
```

### 3. Resposta Dinâmica

**Send Message**:
```
{{external_request.content.messages.0.text}}
```

### 4. Actions Automáticas

**Set Field** (sempre executar):
- Field: `ultimo_topico`
- Value: `{{external_request.content.actions.0.value}}`

**Add Tag** (condicional):
- Condition: `{{external_request.content.actions.0.action}}` equals "add_tag"
- Tag: `{{external_request.content.actions.0.tag_name}}`

**Set Field - Contador** (sempre):
- Field: `contador_interacoes`
- Value: `{{cf_contador_interacoes+1}}`

### 5. Quick Replies (Opcional)

Adicionar após resposta da Thayana:
```json
{
  "quick_replies": [
    {
      "type": "text",
      "caption": "🤱 Mais sobre amamentação",
      "payload": "quero saber mais sobre amamentacao"
    },
    {
      "type": "text", 
      "caption": "👶 Desenvolvimento infantil",
      "payload": "desenvolvimento bebe"
    },
    {
      "type": "text",
      "caption": "💬 Outra pergunta", 
      "payload": "tenho outra duvida"
    },
    {
      "type": "text",
      "caption": "🏠 Menu principal",
      "payload": "menu"
    }
  ]
}
```

## Exemplos de Conversas

### Exemplo 1: Cólicas
**Usuária**: "Meu bebê está com muitas cólicas"

**Thayana**: "Oi [Nome]! Que difícil essa fase das cólicas! 😔 Algumas dicas que podem ajudar:

🤲 Massagem na barriguinha (movimentos circulares)
🚴‍♀️ Exercício da bicicleta com as perninhas
🔥 Compressa morna (nunca quente!)
🤱 Posição de colo em 'C'
🤱 Amamentação frequente

Se as cólicas forem muito intensas ou com outros sintomas, consulte o pediatra! 

Qual dessas técnicas quer que eu explique melhor?"

### Exemplo 2: Sono
**Usuária**: "Como fazer meu bebê dormir a noite toda?"

**Thayana**: "Oi [Nome]! Dormir a noite toda é o sonho de toda mamãe! 😴

Algumas estratégias:

🌙 Rotina noturna consistente
🛁 Banho morno antes de dormir
📱 Ambiente escuro e silencioso
🍼 Última mamada bem completa
⏰ Horários regulares

Lembre-se: cada bebê tem seu ritmo! Paciência é fundamental.

Seu bebê tem quantos meses?"

### Exemplo 3: Urgência Alta
**Usuária**: "Meu bebê está com febre alta e vomitando"

**Thayana**: "⚠️ [Nome], febre alta + vômito precisam de atenção médica URGENTE!

🏥 Procure o pediatra ou emergência AGORA
🌡️ Monitore a temperatura
💧 Mantenha hidratação se conseguir
📱 Ligue para o pediatra antes de sair

Não é hora de dicas caseiras - é caso médico! Vá ao hospital! 🚨"

**Sistema**: Automaticamente adiciona tag `URGENTE_SUPORTE_HUMANO`

## Configurações Recomendadas

### Custom Fields
- `ultimo_topico`: Last topic discussed
- `contador_interacoes`: Interaction counter  
- `urgencia_nivel`: low/medium/high
- `precisa_suporte`: true/false

### Tags para Segmentação
- `TOPICO_AMAMENTACAO`
- `TOPICO_DESENVOLVIMENTO`
- `TOPICO_SONO`
- `TOPICO_ALIMENTACAO`
- `TOPICO_SAUDE`
- `URGENTE_SUPORTE_HUMANO`
- `USUARIO_ATIVO` (mais de 5 interações)

### Automações Avançadas
1. **Seguimento automático**: Mensagem 24h após consulta sobre saúde
2. **Dicas semanais**: Broadcast segmentado por tópico de interesse
3. **Escalação humana**: Transferir para atendente quando tag `URGENTE_SUPORTE_HUMANO`

## Métricas para Acompanhar
- Taxa de resposta da API (uptime)
- Tempo médio de resposta
- Tópicos mais perguntados
- Casos que precisaram suporte humano
- Satisfação (via quick reply com estrelas)