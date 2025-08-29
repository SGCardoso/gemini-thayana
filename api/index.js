export default function handler(req, res) {
  res.status(200).json({
    message: 'Bot Thayana - Assistente Virtual para Mães',
    status: 'running',
    platform: 'Vercel Serverless',
    endpoints: {
      'POST /api/manychat': 'Webhook principal do ManyChat',
      'GET /api/manychat?message=sua_mensagem': 'Teste direto',
      'GET /api/health': 'Health check'
    },
    timestamp: new Date().toISOString()
  });
}