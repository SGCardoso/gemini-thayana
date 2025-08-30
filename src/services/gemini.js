import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY não configurada no .env');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateResponse(userMessage, context = {}) {
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

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Erro ao gerar resposta Gemini:', error);
      return 'Desculpe, tive um problema técnico. Pode repetir sua pergunta? 😊';
    }
  }

  async analyzeMessage(message) {
    try {
      const prompt = `Analise esta mensagem de uma mãe e extraia informações relevantes:
      
Mensagem: "${message}"

Retorne um JSON com:
- urgency: "low", "medium", "high"
- topic: categoria principal (amamentacao, desenvolvimento, saude, etc)
- needsHumanSupport: boolean
- keyWords: array de palavras-chave

Responda apenas com o JSON válido.`;

      const result = await this.model.generateContent(prompt);
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
}

export default new GeminiService();