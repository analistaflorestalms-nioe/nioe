/**
 * Modelo Colaborador - NIOE
 * Colaboradores e análise de background
 */

module.exports = (sequelize, DataTypes) => {
  const Colaborador = sequelize.define('Colaborador', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true
    },
    rg: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    data_nascimento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    endereco: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cargo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tipo_contrato: {
      type: DataTypes.ENUM('organico', 'terceirizado'),
      allowNull: false
    },
    filial: {
      type: DataTypes.ENUM('SP', 'PORTO-SP', 'MS', 'BA'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pendente', 'em_analise', 'aprovado', 'rejeitado'),
      allowNull: false,
      defaultValue: 'pendente'
    },
    antecedentes_criminais: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    relacoes_politicas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vinculos_anteriores: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    referencias: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    criado_por: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    aprovado_por: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    data_aprovacao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    motivo_rejeicao: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'colaboradores',
    timestamps: true,
    underscored: true,
    paranoid: true
  });

  return Colaborador;
};