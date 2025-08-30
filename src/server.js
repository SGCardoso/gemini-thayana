import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import manychatRoutes from './routes/manychat.js';
import geminiService from './services/gemini.js';

const app = express();

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

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
