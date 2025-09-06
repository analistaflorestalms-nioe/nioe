// Placeholder para o arquivo principal do backend
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rota placeholder
app.get('/', (req, res) => {
  res.json({ 
    message: 'NIOE Backend API',
    status: 'running',
    version: '1.0.0'
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
