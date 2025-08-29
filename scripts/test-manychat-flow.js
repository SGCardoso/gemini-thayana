#!/usr/bin/env node
const axios = require('axios');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m', 
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, url, data = null) {
  try {
    log('blue', `\n🔍 Testando: ${name}`);
    log('yellow', `URL: ${url}`);
    
    const response = data ? 
      await axios.post(url, data) : 
      await axios.get(url);
    
    log('green', `✅ Status: ${response.status}`);
    
    if (typeof response.data === 'string') {
      log('blue', `📝 Response: ${response.data.substring(0, 200)}...`);
    } else {
      log('blue', `📝 Response: ${JSON.stringify(response.data, null, 2)}`);
    }
    
    return { success: true, data: response.data };
    
  } catch (error) {
    log('red', `❌ Erro: ${error.message}`);
    if (error.response) {
      log('red', `Status: ${error.response.status}`);
      log('red', `Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return { success: false, error: error.message };
  }
}

async function simulateManyChatFlow() {
  log('bold', '🚀 SIMULANDO FLUXO COMPLETO MANYCHAT → THAYANA');
  
  // Cenários de teste
  const testCases = [
    {
      name: 'Cólicas do bebê',
      payload: {
        last_input_text: 'Meu bebê de 2 meses está com cólicas terríveis, o que posso fazer?',
        first_name: 'Ana',
        user_id: 'user_123',
        custom_fields: {
          phone: '+5511999999999'
        }
      }
    },
    {
      name: 'Problemas de sono', 
      payload: {
        last_input_text: 'Como fazer meu bebê dormir a noite toda?',
        first_name: 'Maria',
        user_id: 'user_456',
        custom_fields: {}
      }
    },
    {
      name: 'Urgência médica',
      payload: {
        last_input_text: 'Socorro! Meu bebê está com febre alta de 39.5°C e vomitando muito',
        first_name: 'Carla',
        user_id: 'user_789'
      }
    },
    {
      name: 'Amamentação',
      payload: {
        last_input_text: 'Tenho pouco leite, meu bebê está sempre com fome',
        first_name: 'Paula',
        user_id: 'user_101'
      }
    },
    {
      name: 'Desenvolvimento',
      payload: {
        last_input_text: 'Meu bebê de 6 meses ainda não senta sozinho, é normal?',
        first_name: 'Lucia',
        user_id: 'user_202'
      }
    }
  ];

  let totalTests = 0;
  let passedTests = 0;

  // 1. Teste de saúde
  const healthCheck = await testEndpoint(
    'Health Check',
    `${BASE_URL}/health`
  );
  
  if (healthCheck.success) passedTests++;
  totalTests++;

  // 2. Teste direto
  const directTest = await testEndpoint(
    'Teste Direto Gemini',
    `${BASE_URL}/manychat/test?message=Olá, como você pode me ajudar?`
  );
  
  if (directTest.success) passedTests++;
  totalTests++;

  // 3. Testes simulando ManyChat
  for (const testCase of testCases) {
    const result = await testEndpoint(
      `ManyChat Webhook - ${testCase.name}`,
      `${BASE_URL}/manychat/webhook`,
      testCase.payload
    );
    
    if (result.success) {
      // Verificar estrutura da resposta
      const data = result.data;
      if (data.version === 'v1' && 
          data.content && 
          data.content.messages && 
          data.content.messages[0] && 
          data.content.messages[0].text) {
        
        log('green', '✅ Estrutura ManyChat válida');
        
        // Verificar se tem análise de urgência
        if (testCase.name.includes('Urgência') && 
            data.content.actions && 
            data.content.actions.some(a => a.tag_name === 'URGENTE_SUPORTE_HUMANO')) {
          log('green', '✅ Tag de urgência aplicada corretamente');
        }
        
        passedTests++;
      } else {
        log('red', '❌ Estrutura de resposta inválida para ManyChat');
      }
    }
    totalTests++;
    
    // Pausa entre testes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 4. Teste rota n8n
  const n8nTest = await testEndpoint(
    'Rota n8n',
    `${BASE_URL}/manychat/n8n`,
    {
      message: 'Teste via n8n - meu bebê não quer mamar',
      context: { source: 'n8n_automation' }
    }
  );
  
  if (n8nTest.success) passedTests++;
  totalTests++;

  // Resumo final
  log('bold', '\n📊 RESUMO DOS TESTES');
  log('blue', `Total de testes: ${totalTests}`);
  log('green', `Testes aprovados: ${passedTests}`);
  log('red', `Testes falhou: ${totalTests - passedTests}`);
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  if (successRate >= 90) {
    log('green', `🎉 Taxa de sucesso: ${successRate}% - EXCELENTE!`);
  } else if (successRate >= 70) {
    log('yellow', `⚠️  Taxa de sucesso: ${successRate}% - PRECISA MELHORAR`);
  } else {
    log('red', `💥 Taxa de sucesso: ${successRate}% - CRÍTICO!`);
  }

  return { totalTests, passedTests, successRate };
}

// Executar se chamado diretamente
if (require.main === module) {
  console.log(`${colors.bold}${colors.blue}🤖 BOT THAYANA - TESTE DE INTEGRAÇÃO MANYCHAT${colors.reset}\n`);
  
  simulateManyChatFlow()
    .then(results => {
      process.exit(results.successRate >= 90 ? 0 : 1);
    })
    .catch(error => {
      console.error('Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { simulateManyChatFlow };