/**
 * NIOE - Sistema de Inteligência Operacional Especial
 * Servidor Principal
 * 
 * Sistema completo de inteligência operacional com
 * dashboards em tempo real e ingestão automática de notícias
 * 
 * @author NIOE Team - T35
 * @version 2.0.0
 */

require('express-async-errors');
require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const path = require('path');

// Importar configurações
const { initializeDatabase } = require('./config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Importar rotas
const authRoutes = require('./routes/auth');
const ocorrenciasRoutes = require('./routes/ocorrencias');
const colaboradoresRoutes = require('./routes/colaboradores');
const noticiasRoutes = require('./routes/noticias');
const metricsRoutes = require('./routes/metrics');

// Importar serviços
const RSSIngestionService = require('./services/RSSIngestionService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

// Middleware de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Middleware de compressão
app.use(compression());

// Middleware de segurança
app.use(mongoSanitize());
app.use(xssClean());

// Middleware de logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.'
  }
});
app.use('/api/', limiter);

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Middleware para Socket.IO
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/ocorrencias', ocorrenciasRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);
app.use('/api/noticias', noticiasRoutes);
app.use('/api/metrics', metricsRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      database: 'Connected',
      rss_ingestion: 'Active'
    }
  });
});

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'NIOE - Sistema de Inteligência Operacional Especial',
    version: '2.0.0',
    status: 'Online',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      ocorrencias: '/api/ocorrencias',
      colaboradores: '/api/colaboradores',
      noticias: '/api/noticias',
      metrics: '/api/metrics'
    }
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Configuração do Socket.IO para tempo real
io.on('connection', (socket) => {
  logger.info(`Cliente conectado: ${socket.id}`);

  // Join em salas por filial
  socket.on('join-branch', (branch) => {
    socket.join(`branch-${branch}`);
    logger.info(`Cliente ${socket.id} entrou na filial ${branch}`);
  });

  // Join em sala de dashboard
  socket.on('join-dashboard', () => {
    socket.join('dashboard');
    logger.info(`Cliente ${socket.id} entrou no dashboard`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    logger.info(`Cliente desconectado: ${socket.id}`);
  });
});

// Inicialização do servidor
const startServer = async () => {
  try {
    // Inicializar banco de dados
    logger.info('🔄 Inicializando banco de dados...');
    const dbInitialized = await initializeDatabase();
    
    if (!dbInitialized) {
      logger.error('❌ Falha ao inicializar banco de dados');
      process.exit(1);
    }

    // Inicializar serviços
    logger.info('🔄 Inicializando serviços...');
    
    // RSS Ingestion Service
    const rssService = new RSSIngestionService();
    rssService.start();

    // Iniciar servidor
    server.listen(PORT, () => {
      logger.info(`🚀 Servidor NIOE iniciado na porta ${PORT}`);
      logger.info(`🌐 Acesse: http://localhost:${PORT}`);
      logger.info(`📊 API: http://localhost:${PORT}/api`);
      logger.info(`❤️  Health: http://localhost:${PORT}/api/health`);
    });

  } catch (error) {
    logger.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('❌ Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Promise rejeitada:', reason);
  process.exit(1);
});

// Iniciar servidor
startServer();

module.exports = { app, server, io };
