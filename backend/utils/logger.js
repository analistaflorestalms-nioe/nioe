/**
 * Sistema de Logging Avançado - NIOE
 * 
 * Sistema completo de logs para auditoria e monitoramento
 * com diferentes níveis e destinos
 * 
 * @author NIOE Team - T35
 * @version 2.0.0
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Criar diretório de logs se não existir
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configuração de formatos
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
      metaStr = '\n' + JSON.stringify(meta, null, 2);
    }
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'nioe-intelligence',
    version: '2.0.0'
  },
  transports: [
    // Log de erros
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Log geral
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Log de auditoria
    new winston.transports.File({
      filename: path.join(logDir, 'audit.log'),
      level: 'info',
      maxsize: 10485760, // 10MB
      maxFiles: 10
    }),
    
    // Log de segurança
    new winston.transports.File({
      filename: path.join(logDir, 'security.log'),
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Adicionar console em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Métodos específicos para diferentes tipos de logs
logger.audit = (message, meta = {}) => {
  logger.info(message, {
    ...meta,
    type: 'audit',
    timestamp: new Date().toISOString()
  });
};

logger.security = (message, meta = {}) => {
  logger.warn(message, {
    ...meta,
    type: 'security',
    timestamp: new Date().toISOString()
  });
};

logger.intelligence = (message, meta = {}) => {
  logger.info(message, {
    ...meta,
    type: 'intelligence',
    timestamp: new Date().toISOString()
  });
};

logger.osint = (message, meta = {}) => {
  logger.info(message, {
    ...meta,
    type: 'osint',
    timestamp: new Date().toISOString()
  });
};

logger.risk = (message, meta = {}) => {
  logger.warn(message, {
    ...meta,
    type: 'risk',
    timestamp: new Date().toISOString()
  });
};

logger.api = (message, meta = {}) => {
  logger.info(message, {
    ...meta,
    type: 'api',
    timestamp: new Date().toISOString()
  });
};

logger.database = (message, meta = {}) => {
  logger.info(message, {
    ...meta,
    type: 'database',
    timestamp: new Date().toISOString()
  });
};

logger.performance = (message, meta = {}) => {
  logger.info(message, {
    ...meta,
    type: 'performance',
    timestamp: new Date().toISOString()
  });
};

// Função para log de atividades do usuário
logger.userActivity = (userId, action, details = {}) => {
  logger.audit(`User Activity: ${action}`, {
    userId,
    action,
    details,
    ip: details.ip || 'unknown',
    userAgent: details.userAgent || 'unknown'
  });
};

// Função para log de segurança
logger.securityEvent = (event, details = {}) => {
  logger.security(`Security Event: ${event}`, {
    event,
    details,
    severity: details.severity || 'medium',
    ip: details.ip || 'unknown',
    userAgent: details.userAgent || 'unknown'
  });
};

// Função para log de inteligência
logger.intelligenceEvent = (event, details = {}) => {
  logger.intelligence(`Intelligence Event: ${event}`, {
    event,
    details,
    classification: details.classification || 'unclassified',
    source: details.source || 'unknown'
  });
};

// Função para log de OSINT
logger.osintEvent = (source, data, details = {}) => {
  logger.osint(`OSINT Data: ${source}`, {
    source,
    data,
    details,
    confidence: details.confidence || 'medium'
  });
};

// Função para log de risco
logger.riskEvent = (risk, details = {}) => {
  logger.risk(`Risk Assessment: ${risk}`, {
    risk,
    details,
    level: details.level || 'medium',
    probability: details.probability || 'unknown',
    impact: details.impact || 'unknown'
  });
};

// Função para log de performance
logger.performanceEvent = (operation, duration, details = {}) => {
  logger.performance(`Performance: ${operation}`, {
    operation,
    duration,
    details,
    threshold: details.threshold || 1000 // 1 segundo
  });
};

module.exports = logger;
