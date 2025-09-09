/**
 * Models Index - NIOE
 * Centraliza importação e configuração de todos os modelos
 */

const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Import model definitions
const UserModel = require('./User');
const OcorrenciaModel = require('./Ocorrencia');
const ColaboradorModel = require('./Colaborador');
const NoticiaModel = require('./Noticia');

// Initialize models
const User = UserModel(config.sequelize, Sequelize.DataTypes);
const Ocorrencia = OcorrenciaModel(config.sequelize, Sequelize.DataTypes);
const Colaborador = ColaboradorModel(config.sequelize, Sequelize.DataTypes);
const Noticia = NoticiaModel(config.sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Ocorrencia, { foreignKey: 'criado_por', as: 'ocorrencias' });
User.hasMany(Colaborador, { foreignKey: 'criado_por', as: 'colaboradores_criados' });
User.hasMany(Colaborador, { foreignKey: 'aprovado_por', as: 'colaboradores_aprovados' });

Ocorrencia.belongsTo(User, { foreignKey: 'criado_por', as: 'criador' });
Colaborador.belongsTo(User, { foreignKey: 'criado_por', as: 'criador' });
Colaborador.belongsTo(User, { foreignKey: 'aprovado_por', as: 'aprovador' });

module.exports = {
  sequelize: config.sequelize,
  User,
  Ocorrencia,
  Colaborador,
  Noticia
};