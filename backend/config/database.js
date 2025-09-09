/**
 * Configuração do Banco de Dados PostgreSQL
 * Sistema de Inteligência Operacional Especial - NIOE
 * 
 * @author NIOE Team - T35
 * @version 2.0.0
 */

const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// Configurações do banco PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'nioe_db',
  username: process.env.DB_USER || 'nioe_user',
  password: process.env.DB_PASSWORD || 'nioe123',
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
    freezeTableName: true,
    paranoid: true
  }
});

// Importar modelos
const UserModel = require('../models/User');
const OcorrenciaModel = require('../models/Ocorrencia');
const ColaboradorModel = require('../models/Colaborador');
const NoticiaModel = require('../models/Noticia');

// Inicializar modelos
const User = UserModel(sequelize, Sequelize.DataTypes);
const Ocorrencia = OcorrenciaModel(sequelize, Sequelize.DataTypes);
const Colaborador = ColaboradorModel(sequelize, Sequelize.DataTypes);
const Noticia = NoticiaModel(sequelize, Sequelize.DataTypes);

// Definir associações
const defineAssociations = () => {
  // User associations
  User.hasMany(Ocorrencia, { foreignKey: 'criado_por', as: 'ocorrencias' });
  User.hasMany(Colaborador, { foreignKey: 'criado_por', as: 'colaboradores_criados' });
  User.hasMany(Colaborador, { foreignKey: 'aprovado_por', as: 'colaboradores_aprovados' });

  // Ocorrencia associations
  Ocorrencia.belongsTo(User, { foreignKey: 'criado_por', as: 'criador' });

  // Colaborador associations
  Colaborador.belongsTo(User, { foreignKey: 'criado_por', as: 'criador' });
  Colaborador.belongsTo(User, { foreignKey: 'aprovado_por', as: 'aprovador' });
};

// Testar conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexão com PostgreSQL estabelecida com sucesso!');
    return true;
  } catch (error) {
    logger.error('❌ Erro ao conectar com PostgreSQL:', error.message);
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

    // Criar usuário demo
    const users = [
      {
        nome: 'Administrador NIOE',
        email: 'admin@nioe.com',
        senha: await bcrypt.hash('nioe123', 12),
        role: 'admin',
        filial: 'SP',
        cargo: 'Administrador',
        ativo: true,
        tentativas_login: 0
      },
      {
        nome: 'G. Silva',
        email: 'g.silva@nioe.com',
        senha: await bcrypt.hash('nioe123', 12),
        role: 'analista',
        filial: 'MS',
        cargo: 'Analista Florestal',
        ativo: true,
        tentativas_login: 0
      }
    ];

    for (const userData of users) {
      await User.create(userData);
      logger.info(`✅ Usuário criado: ${userData.nome}`);
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
  Ocorrencia,
  Colaborador,
  Noticia,
  initializeDatabase
};
