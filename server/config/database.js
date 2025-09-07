/**
 * Configuração do Banco de Dados MySQL (XAMPP)
 * Sistema de Inteligência Operacional Especial - NIOE
 * 
 * @author NIOE Team - T35
 * @version 2.0.0
 */

const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// Configurações do banco MySQL (XAMPP)
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'nioe_intelligence',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// Importar modelos
const User = require('../models/User')(sequelize, Sequelize.DataTypes);
const Collaborator = require('../models/Collaborator')(sequelize, Sequelize.DataTypes);
const IntelligenceDocument = require('../models/IntelligenceDocument')(sequelize, Sequelize.DataTypes);
const Activity = require('../models/Activity')(sequelize, Sequelize.DataTypes);
const NewsCategory = require('../models/NewsCategory')(sequelize, Sequelize.DataTypes);
const Keyword = require('../models/Keyword')(sequelize, Sequelize.DataTypes);
const NewsArticle = require('../models/NewsArticle')(sequelize, Sequelize.DataTypes);
const WeatherData = require('../models/WeatherData')(sequelize, Sequelize.DataTypes);
const FireIncident = require('../models/FireIncident')(sequelize, Sequelize.DataTypes);
const Occurrence = require('../models/Occurrence')(sequelize, Sequelize.DataTypes);
const SystemLog = require('../models/SystemLog')(sequelize, Sequelize.DataTypes);
const DocumentSharing = require('../models/DocumentSharing')(sequelize, Sequelize.DataTypes);
const OSINTData = require('../models/OSINTData')(sequelize, Sequelize.DataTypes);
const RiskAssessment = require('../models/RiskAssessment')(sequelize, Sequelize.DataTypes);
const IntelligenceReport = require('../models/IntelligenceReport')(sequelize, Sequelize.DataTypes);
const ThreatIntelligence = require('../models/ThreatIntelligence')(sequelize, Sequelize.DataTypes);

// Definir associações
const defineAssociations = () => {
  // User associations
  User.hasMany(Collaborator, { foreignKey: 'created_by', as: 'collaborators' });
  User.hasMany(IntelligenceDocument, { foreignKey: 'created_by', as: 'documents' });
  User.hasMany(Activity, { foreignKey: 'created_by', as: 'activities' });
  User.hasMany(Activity, { foreignKey: 'assigned_to', as: 'assignedActivities' });
  User.hasMany(NewsArticle, { foreignKey: 'created_by', as: 'newsArticles' });
  User.hasMany(FireIncident, { foreignKey: 'created_by', as: 'fireIncidents' });
  User.hasMany(Occurrence, { foreignKey: 'created_by', as: 'occurrences' });
  User.hasMany(SystemLog, { foreignKey: 'user_id', as: 'logs' });
  User.hasMany(OSINTData, { foreignKey: 'created_by', as: 'osintData' });
  User.hasMany(RiskAssessment, { foreignKey: 'created_by', as: 'riskAssessments' });
  User.hasMany(IntelligenceReport, { foreignKey: 'created_by', as: 'intelligenceReports' });

  // Collaborator associations
  Collaborator.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  Collaborator.hasMany(IntelligenceDocument, { foreignKey: 'collaborator_id', as: 'documents' });
  Collaborator.hasMany(Occurrence, { foreignKey: 'collaborator_id', as: 'occurrences' });

  // IntelligenceDocument associations
  IntelligenceDocument.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  IntelligenceDocument.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });
  IntelligenceDocument.belongsTo(Collaborator, { foreignKey: 'collaborator_id', as: 'collaborator' });

  // Activity associations
  Activity.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  Activity.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

  // NewsArticle associations
  NewsArticle.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  NewsArticle.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
  NewsArticle.belongsTo(NewsCategory, { foreignKey: 'category_id', as: 'category' });

  // FireIncident associations
  FireIncident.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  FireIncident.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

  // Occurrence associations
  Occurrence.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  Occurrence.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
  Occurrence.belongsTo(Collaborator, { foreignKey: 'collaborator_id', as: 'collaborator' });

  // SystemLog associations
  SystemLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // DocumentSharing associations
  DocumentSharing.belongsTo(IntelligenceDocument, { foreignKey: 'document_id', as: 'document' });
  DocumentSharing.belongsTo(User, { foreignKey: 'shared_by', as: 'sharer' });
  DocumentSharing.belongsTo(User, { foreignKey: 'shared_with', as: 'recipient' });

  // OSINTData associations
  OSINTData.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

  // RiskAssessment associations
  RiskAssessment.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

  // IntelligenceReport associations
  IntelligenceReport.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

  // ThreatIntelligence associations
  ThreatIntelligence.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
};

// Testar conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexão com MySQL (XAMPP) estabelecida com sucesso!');
    return true;
  } catch (error) {
    logger.error('❌ Erro ao conectar com MySQL:', error.message);
    return false;
  }
};

// Sincronizar banco de dados
const syncDatabase = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: true });
      logger.info('✅ Banco de dados sincronizado com sucesso!');
    } else {
      await sequelize.sync();
      logger.info('✅ Banco de dados sincronizado com sucesso!');
    }
    return true;
  } catch (error) {
    logger.error('❌ Erro ao sincronizar banco de dados:', error.message);
    return false;
  }
};

// Popular dados iniciais
const seedInitialData = async () => {
  try {
    // Verificar se já existem usuários
    const userCount = await User.count();
    if (userCount > 0) {
      logger.info('ℹ️ Dados já existem no banco de dados');
      return true;
    }

    logger.info('🌱 Populando dados iniciais...');

    // Criar usuários da equipe NIOE
    const users = [
      {
        username: 'admin',
        email: 'admin@nioe.com',
        password_hash: await bcrypt.hash('admin123', 12),
        full_name: 'Administrador NIOE',
        role: 'director',
        branch: 'SP',
        department: 'intelligence',
        is_active: true
      },
      {
        username: 'aleluia',
        email: 'aleluia@nioe.com',
        password_hash: await bcrypt.hash('nioe123', 12),
        full_name: 'Aleluia - Analista Industrial SP',
        role: 'analyst',
        branch: 'SP',
        department: 'industrial',
        is_active: true
      },
      {
        username: 'fabio',
        email: 'fabio@nioe.com',
        password_hash: await bcrypt.hash('nioe123', 12),
        full_name: 'Fábio - Analista Florestal SP',
        role: 'analyst',
        branch: 'SP',
        department: 'forest',
        is_active: true
      },
      {
        username: 'gsilva',
        email: 'gsilva@nioe.com',
        password_hash: await bcrypt.hash('nioe123', 12),
        full_name: 'G. Silva - Analista Florestal MS',
        role: 'analyst',
        branch: 'MS',
        department: 'forest',
        is_active: true
      },
      {
        username: 'keven',
        email: 'keven@nioe.com',
        password_hash: await bcrypt.hash('nioe123', 12),
        full_name: 'Keven - Analista Industrial BA',
        role: 'analyst',
        branch: 'BA',
        department: 'industrial',
        is_active: true
      },
      {
        username: 'geovana',
        email: 'geovana@nioe.com',
        password_hash: await bcrypt.hash('nioe123', 12),
        full_name: 'Geovana - Analista Portuária SP',
        role: 'analyst',
        branch: 'PORTO_SP',
        department: 'port',
        is_active: true
      },
      {
        username: 'gideonis',
        email: 'gideonis@nioe.com',
        password_hash: await bcrypt.hash('nioe123', 12),
        full_name: 'Gideonis - Supervisor Geral',
        role: 'supervisor',
        branch: 'SP',
        department: 'intelligence',
        is_active: true
      },
      {
        username: 'laio',
        email: 'laio@nioe.com',
        password_hash: await bcrypt.hash('nioe123', 12),
        full_name: 'Laio - Gerente Geral',
        role: 'manager',
        branch: 'SP',
        department: 'intelligence',
        is_active: true
      },
      {
        username: 'pithon',
        email: 'pithon@nioe.com',
        password_hash: await bcrypt.hash('nioe123', 12),
        full_name: 'Douglas Pithon - Diretor',
        role: 'director',
        branch: 'SP',
        department: 'intelligence',
        is_active: true
      }
    ];

    for (const userData of users) {
      await User.create(userData);
      logger.info(`✅ Usuário criado: ${userData.full_name}`);
    }

    // Criar categorias de notícias
    const categories = [
      { name: 'INDÚSTRIA DE CELULOSE', description: 'Notícias sobre a indústria de celulose' },
      { name: 'INDÚSTRIA NACIONAL', description: 'Notícias sobre indústria nacional' },
      { name: 'INDÚSTRIA DE TISSUE', description: 'Notícias sobre indústria de tissue' },
      { name: 'COMBUSTÍVEL', description: 'Notícias sobre combustível e energia' },
      { name: 'TRANSPORTE RODOVIÁRIO', description: 'Notícias sobre transporte rodoviário' },
      { name: 'INFRAESTRUTURA', description: 'Notícias sobre infraestrutura' },
      { name: 'SAÚDE PÚBLICA', description: 'Notícias sobre saúde pública' },
      { name: 'SEGURANÇA PÚBLICA', description: 'Notícias sobre segurança pública' },
      { name: 'DESENVOLVIMENTO LOCAL', description: 'Notícias sobre desenvolvimento local' },
      { name: 'POLÍTICA', description: 'Notícias políticas' },
      { name: 'LEGISLAÇÃO', description: 'Notícias sobre legislação' },
      { name: 'MOVIMENTOS SOCIAIS', description: 'Notícias sobre movimentos sociais' },
      { name: 'ECONOMIA', description: 'Notícias econômicas' },
      { name: 'POLÍTICA INTERNACIONAL', description: 'Notícias sobre política internacional' }
    ];

    for (const category of categories) {
      await NewsCategory.create(category);
      logger.info(`✅ Categoria criada: ${category.name}`);
    }

    // Criar palavras-chave
    const keywords = [
      { keyword: 'Bracell', category: 'empresa' },
      { keyword: 'MS Florestal', category: 'empresa' },
      { keyword: 'celulose', category: 'produto' },
      { keyword: 'tissue', category: 'produto' },
      { keyword: 'floresta', category: 'ambiente' },
      { keyword: 'incêndio', category: 'segurança' },
      { keyword: 'segurança', category: 'geral' },
      { keyword: 'sustentabilidade', category: 'ambiente' },
      { keyword: 'meio ambiente', category: 'ambiente' },
      { keyword: 'sindicato', category: 'social' },
      { keyword: 'greve', category: 'social' },
      { keyword: 'acidente', category: 'segurança' },
      { keyword: 'logística', category: 'transporte' },
      { keyword: 'porto', category: 'infraestrutura' },
      { keyword: 'rodovia', category: 'infraestrutura' }
    ];

    for (const keyword of keywords) {
      await Keyword.create(keyword);
      logger.info(`✅ Palavra-chave criada: ${keyword.keyword}`);
    }

    logger.info('🎉 Dados iniciais populados com sucesso!');
    return true;
  } catch (error) {
    logger.error('❌ Erro ao popular dados iniciais:', error.message);
    return false;
  }
};

// Inicializar banco de dados
const initializeDatabase = async () => {
  const connected = await testConnection();
  if (!connected) {
    return false;
  }
  
  defineAssociations();
  const synced = await syncDatabase();
  if (!synced) {
    return false;
  }
  
  const seeded = await seedInitialData();
  return seeded;
};

module.exports = {
  sequelize,
  User,
  Collaborator,
  IntelligenceDocument,
  Activity,
  NewsCategory,
  Keyword,
  NewsArticle,
  WeatherData,
  FireIncident,
  Occurrence,
  SystemLog,
  DocumentSharing,
  OSINTData,
  RiskAssessment,
  IntelligenceReport,
  ThreatIntelligence,
  initializeDatabase
};
