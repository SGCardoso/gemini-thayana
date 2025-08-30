import express from 'express';
const router = express.Router();
import geminiService from '../services/gemini.js';

router.post('/webhook', async (req, res) => {
  try {
    console.log('📨 Webhook recebido:', JSON.stringify(req.body, null, 2));
    
    const { 
      last_input_text, 
      first_name = 'Mamãe',
      user_id,
      custom_fields = {}
    } = req.body;

    if (!last_input_text) {
      return res.status(400).json({
        error: 'Mensagem não encontrada',
        version: 'v1'
      });
    }

    const userContext = {
      name: first_name,
      userId: user_id,
      customFields: custom_fields
    };

    const analysis = await geminiService.analyzeMessage(last_input_text);
    console.log('🔍 Análise da mensagem:', analysis);

    const response = await geminiService.generateResponse(last_input_text, userContext);
    
    const manychatResponse = {
      version: 'v1',
      content: {
        messages: [
          {
            type: 'text',
            text: response
          }
        ],
        actions: [],
        quick_replies: []
      }
    };

    if (analysis.needsHumanSupport || analysis.urgency === 'high') {
      manychatResponse.content.actions.push({
        action: 'add_tag',
        tag_name: 'URGENTE_SUPORTE_HUMANO'
      });
    }

    manychatResponse.content.actions.push({
      action: 'set_field',
      field_name: 'ultimo_topico',
      value: analysis.topic
    });

    console.log('✅ Resposta enviada:', JSON.stringify(manychatResponse, null, 2));
    
    res.json(manychatResponse);
    
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    
    res.status(500).json({
      version: 'v1',
      content: {
        messages: [
          {
            type: 'text', 
            text: 'Ops! Tive um probleminha técnico. Pode tentar novamente? 😊'
          }
        ]
      }
    });
  }
});

router.get('/test', async (req, res) => {
  try {
    const testMessage = req.query.message || 'Olá, como posso ajudar com meu bebê?';
    
    const response = await geminiService.generateResponse(testMessage, {
      name: 'Mamãe Teste'
    });
    
    res.json({
      message: 'Teste do Gemini AI',
      input: testMessage,
      output: response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro no teste:', error);
    res.status(500).json({ 
      error: 'Erro no teste',
      message: error.message 
    });
  }
});

router.post('/n8n', async (req, res) => {
  try {
    console.log('🔄 Requisição via n8n:', JSON.stringify(req.body, null, 2));
    
    const { message, context = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Campo message é obrigatório'
      });
    }

    const analysis = await geminiService.analyzeMessage(message);
    const response = await geminiService.generateResponse(message, context);
    
    res.json({
      response: response,
      analysis: analysis,
      timestamp: new Date().toISOString(),
      source: 'n8n'
    });
    
  } catch (error) {
    console.error('❌ Erro na rota n8n:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: error.message
    });
  }
});

export default router;