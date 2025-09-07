/**
 * NIOE - Sistema de Inteligência Operacional Especial
 * Servidor Principal
 * 
 * Sistema completo de inteligência, OSINT, contra-inteligência
 * e antecipação de riscos com dashboards em tempo real
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
const path = require('path');

// Importar configurações
const { initializeDatabase } = require('./config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Importar rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const collaboratorRoutes = require('./routes/collaborators');
const documentRoutes = require('./routes/documents');
const activityRoutes = require('./routes/activities');
const newsRoutes = require('./routes/news');
const fireRoutes = require('./routes/fire');
const occurrenceRoutes = require('./routes/occurrences');
const dashboardRoutes = require('./routes/dashboard');
const osintRoutes = require('./routes/osint');
const intelligenceRoutes = require('./routes/intelligence');
const riskRoutes = require('./routes/risk');
const reportRoutes = require('./routes/reports');

// Importar serviços
const NewsTrackerService = require('./services/NewsTrackerService');
const OSINTService = require('./services/OSINTService');
const RiskAssessmentService = require('./services/RiskAssessmentService');
const IntelligenceAnalysisService = require('./services/IntelligenceAnalysisService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

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
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Middleware de compressão
app.use(compression());

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
app.use('/api/users', userRoutes);
app.use('/api/collaborators', collaboratorRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/fire', fireRoutes);
app.use('/api/occurrences', occurrenceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/osint', osintRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/reports', reportRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      database: 'Connected',
      news_tracker: 'Active',
      osint: 'Active',
      risk_assessment: 'Active'
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
      dashboard: '/api/dashboard',
      osint: '/api/osint',
      intelligence: '/api/intelligence',
      risk: '/api/risk'
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
    
    // News Tracker Service
    const newsTracker = new NewsTrackerService(io);
    await newsTracker.start();
    
    // OSINT Service
    const osintService = new OSINTService(io);
    await osintService.start();
    
    // Risk Assessment Service
    const riskService = new RiskAssessmentService(io);
    await riskService.start();
    
    // Intelligence Analysis Service
    const intelligenceService = new IntelligenceAnalysisService(io);
    await intelligenceService.start();

    // Iniciar servidor
    server.listen(PORT, () => {
      logger.info(`🚀 Servidor NIOE iniciado na porta ${PORT}`);
      logger.info(`🌐 Acesse: http://localhost:${PORT}`);
      logger.info(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
      logger.info(`🔍 OSINT: http://localhost:${PORT}/osint`);
      logger.info(`⚠️  Risk Assessment: http://localhost:${PORT}/risk`);
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
