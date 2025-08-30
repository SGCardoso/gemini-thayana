// URL final: https://SEU_APP.vercel.app/api/manychat
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
Você é a Thayana, enfermeira obstetra e doula. Fale com acolhimento, clareza e objetividade.
- Não faça diagnóstico; oriente procurar profissional quando necessário.
- Se a dúvida for técnica sobre plataforma/curso, responda direto (passo a passo).
- Responda em PT-BR.
`;

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
    console.log('🧪 GET Test:', { message: testMessage });
    
    try {
      const prompt = [
        SYSTEM_PROMPT,
        `Usuária (teste): ${testMessage}`,
        "Responda em até 4-6 frases quando possível."
      ].filter(Boolean).join("\n\n");

      const result = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });

      let text;
      if (typeof result?.text === "function") text = result.text();
      else if (typeof result?.response?.text === "function") text = result.response.text();
      else if (typeof result?.text === "string") text = result.text;
      else if (typeof result?.candidates?.[0]?.content?.parts?.[0]?.text === "string")
        text = result.candidates[0].content.parts[0].text;
      else text = "Desculpe, não consegui gerar uma resposta agora. Tente novamente em instantes.";
      
      return res.status(200).json({
        message: 'Teste do Gemini AI',
        input: testMessage,
        output: text,
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

  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    // Suporte para ManyChat e formato genérico
    const { 
      message = "", 
      last_input_text = "",
      topic = "", 
      user_id = "",
      first_name = "Mamãe"
    } = req.body || {};
    
    const userMessage = message || last_input_text;
    console.log('📨 POST Request:', { user_id, message: userMessage, topic, first_name });
    
    if (!userMessage) return res.status(400).json({ error: "message ou last_input_text vazio" });

    const prompt = [
      SYSTEM_PROMPT,
      topic ? `Contexto do tópico: ${topic}` : "",
      `Usuária ${first_name} (${user_id || "desconhecida"}): ${userMessage}`,
      "Responda em até 4-6 frases quando possível."
    ].filter(Boolean).join("\n\n");

    const result = await client.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: prompt
    });

    let text;
    if (typeof result?.text === "function") text = result.text();
    else if (typeof result?.response?.text === "function") text = result.response.text();
    else if (typeof result?.text === "string") text = result.text;
    else if (typeof result?.candidates?.[0]?.content?.parts?.[0]?.text === "string")
      text = result.candidates[0].content.parts[0].text;
    else text = "Desculpe, não consegui gerar uma resposta agora. Tente novamente em instantes.";

    console.log('✅ Response Generated:', { user_id, reply: text.substring(0, 100) + '...' });

    // Formato ManyChat se veio last_input_text
    if (last_input_text) {
      return res.status(200).json({
        version: 'v1',
        content: {
          messages: [{
            type: 'text',
            text: text
          }],
          actions: [{
            action: 'set_field',
            field_name: 'ultimo_topico',
            value: topic || 'geral'
          }],
          quick_replies: []
        }
      });
    }

    // Formato simples
    return res.status(200).json({ reply: text });
    
  } catch (err) {
    console.error("Erro /api/manychat:", err?.message || err);
    return res.status(500).json({ error: "Falha ao gerar resposta" });
  }
}