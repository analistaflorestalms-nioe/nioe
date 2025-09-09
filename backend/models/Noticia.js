/**
 * Modelo Noticia - NIOE
 * Notícias coletadas via RSS com análise de relevância
 */

module.exports = (sequelize, DataTypes) => {
  const Noticia = sequelize.define('Noticia', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    resumo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      unique: true
    },
    fonte: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    autor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    data_publicacao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    categoria: {
      type: DataTypes.ENUM(
        'incendio', 'seguranca', 'ambiental', 'logistica', 
        'economia', 'tecnologia', 'geral'
      ),
      allowNull: false,
      defaultValue: 'geral'
    },
    relevancia: {
      type: DataTypes.ENUM('baixa', 'media', 'alta'),
      allowNull: false,
      defaultValue: 'baixa'
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    processada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'noticias',
    timestamps: true,
    underscored: true,
    paranoid: true
  });

  return Noticia;
};