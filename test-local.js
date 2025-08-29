import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
Você é a Thayana, enfermeira obstetra e doula. Fale com acolhimento, clareza e objetividade.
- Não faça diagnóstico; oriente procurar profissional quando necessário.  
- Se a dúvida for técnica sobre plataforma/curso, responda direto (passo a passo).
- Responda em PT-BR.
`;

async function testAPI() {
  try {
    console.log('🧪 Testando API Thayana...\n');
    
    const testMessage = "Meu bebê está com cólicas, o que posso fazer?";
    
    const prompt = [
      SYSTEM_PROMPT,
      `Usuária (teste): ${testMessage}`,
      "Responda em até 4-6 frases quando possível."
    ].filter(Boolean).join("\n\n");

    console.log('📤 Enviando para Gemini...');
    
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

    console.log('✅ SUCESSO! Resposta da Thayana:\n');
    console.log(`"${text}"\n`);
    
    // Teste formato ManyChat
    const manychatResponse = {
      version: 'v1',
      content: {
        messages: [{
          type: 'text',
          text: text
        }],
        actions: [{
          action: 'set_field',
          field_name: 'ultimo_topico',
          value: 'geral'
        }],
        quick_replies: []
      }
    };
    
    console.log('📱 Formato ManyChat:');
    console.log(JSON.stringify(manychatResponse, null, 2));
    
    console.log('\n🎉 TESTE PASSOU! API funcionando corretamente.');
    
  } catch (error) {
    console.error('❌ ERRO no teste:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAPI();