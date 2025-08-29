const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const manychatRoutes = require('./routes/manychat');
const geminiService = require('./services/gemini');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/manychat', manychatRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Gemini Thayana Bot API',
    status: 'running',
    endpoints: {
      'POST /manychat/webhook': 'Recebe mensagens do ManyChat',
      'GET /manychat/test': 'Endpoint de teste',
      'POST /manychat/n8n': 'Integração via n8n'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🤖 Servidor rodando na porta ${PORT}`);
  console.log(`📱 ManyChat webhook: http://localhost:${PORT}/manychat/webhook`);
});