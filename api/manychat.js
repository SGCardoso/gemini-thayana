const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function generateResponse(userMessage, context = {}) {
  try {
    const systemPrompt = `Você é Thayana, uma assistente virtual especializada em orientar mães sobre desenvolvimento infantil, amamentação, nutrição e cuidados com bebês e crianças.

Características:
- Seja empática, acolhedora e prestativa
- Use linguagem carinhosa mas profissional
- Dê respostas práticas e baseadas em evidências
- Sempre incentive a consulta com pediatra quando necessário
- Mantenha as respostas concisas para WhatsApp

Contexto do usuário: ${JSON.stringify(context)}

Mensagem da mãe: ${userMessage}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao gerar resposta Gemini:', error);
    return 'Desculpe, tive um problema técnico. Pode repetir sua pergunta? 😊';
  }
}

async function analyzeMessage(message) {
  try {
    const prompt = `Analise esta mensagem de uma mãe e extraia informações relevantes:
    
Mensagem: "${message}"

Retorne um JSON com:
- urgency: "low", "medium", "high"
- topic: categoria principal (amamentacao, desenvolvimento, saude, etc)
- needsHumanSupport: boolean
- keyWords: array de palavras-chave

Responda apenas com o JSON válido.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    try {
      return JSON.parse(response.text());
    } catch {
      return {
        urgency: 'medium',
        topic: 'geral',
        needsHumanSupport: false,
        keyWords: []
      };
    }
  } catch (error) {
    console.error('Erro na análise da mensagem:', error);
    return {
      urgency: 'medium',
      topic: 'geral', 
      needsHumanSupport: false,
      keyWords: []
    };
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Endpoint de teste
    const testMessage = req.query.message || 'Olá, como posso ajudar com meu bebê?';
    
    try {
      const response = await generateResponse(testMessage, {
        name: 'Mamãe Teste'
      });
      
      return res.status(200).json({
        message: 'Teste do Gemini AI',
        input: testMessage,
        output: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro no teste:', error);
      return res.status(500).json({ 
        error: 'Erro no teste',
        message: error.message 
      });
    }
  }

  if (req.method === 'POST') {
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

      const analysis = await analyzeMessage(last_input_text);
      console.log('🔍 Análise da mensagem:', analysis);

      const response = await generateResponse(last_input_text, userContext);
      
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
      
      return res.status(200).json(manychatResponse);
      
    } catch (error) {
      console.error('❌ Erro no webhook:', error);
      
      return res.status(500).json({
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
  }

  return res.status(405).json({ error: 'Method not allowed' });
}