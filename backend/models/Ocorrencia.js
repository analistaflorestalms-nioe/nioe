/**
 * Modelo Ocorrencia - NIOE
 * Ocorrências e incidentes operacionais
 */

module.exports = (sequelize, DataTypes) => {
  const Ocorrencia = sequelize.define('Ocorrencia', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM(
        'seguranca', 'acidente', 'incendio', 'furto', 
        'vandalismo', 'suspeita', 'ambiental', 'logistica'
      ),
      allowNull: false
    },
    prioridade: {
      type: DataTypes.ENUM('critica', 'alta', 'media', 'baixa'),
      allowNull: false,
      defaultValue: 'media'
    },
    status: {
      type: DataTypes.ENUM('aberta', 'em_andamento', 'resolvida', 'cancelada'),
      allowNull: false,
      defaultValue: 'aberta'
    },
    filial: {
      type: DataTypes.ENUM('SP', 'PORTO-SP', 'MS', 'BA'),
      allowNull: false
    },
    local: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    data_ocorrencia: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    criado_por: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    anexos: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    }
  }, {
    tableName: 'ocorrencias',
    timestamps: true,
    underscored: true,
    paranoid: true
  });

  return Ocorrencia;
};