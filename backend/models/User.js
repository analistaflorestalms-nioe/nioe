/**
 * Modelo User - NIOE
 * Usuários do sistema com autenticação e controle de acesso
 */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'analista'),
      allowNull: false,
      defaultValue: 'analista'
    },
    filial: {
      type: DataTypes.ENUM('SP', 'PORTO-SP', 'MS', 'BA'),
      allowNull: false
    },
    cargo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    tentativas_login: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bloqueado_ate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: true
  });

  return User;
};