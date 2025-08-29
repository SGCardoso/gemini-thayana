# 🧪 TESTES VERCEL

Substitua `https://gemini-thayana.vercel.app` pela SUA URL do Vercel:

## 1. Teste GET (deve funcionar)
```bash
curl "https://SUA-URL.vercel.app/api/manychat?message=Olá teste"
```

## 2. Teste POST simples
```bash
curl -X POST https://SUA-URL.vercel.app/api/manychat \
  -H "Content-Type: application/json" \
  -d '{"user_id":"123","message":"Tenho 36 semanas, como aliviar dor lombar?"}'
```

## 3. Teste POST ManyChat
```bash
curl -X POST https://SUA-URL.vercel.app/api/manychat \
  -H "Content-Type: application/json" \
  -d '{"last_input_text":"Meu bebê tem cólicas","first_name":"Maria","user_id":"test123"}'
```

## Respostas Esperadas:

### Teste 1 (GET):
```json
{
  "message": "Teste do Gemini AI",
  "input": "Olá teste", 
  "output": "resposta da Thayana...",
  "timestamp": "..."
}
```

### Teste 2 (POST simples):
```json
{
  "reply": "resposta da Thayana..."
}
```

### Teste 3 (POST ManyChat):
```json
{
  "version": "v1",
  "content": {
    "messages": [{"type": "text", "text": "resposta..."}],
    "actions": [{"action": "set_field", "field_name": "ultimo_topico", "value": "geral"}]
  }
}
```

## Se der erro 500:
1. Vá no Vercel → Functions → Runtime Logs
2. Veja o erro específico  
3. Geralmente é variável GEMINI_API_KEY não configurada