/**
 * Rotas de Notícias RSS - NIOE
 */

const express = require('express');
const { Op } = require('sequelize');
const { Noticia } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// GET /api/noticias
router.get('/', async (req, res) => {
  try {
    const {
      categoria,
      relevancia,
      fonte,
      search,
      dataInicio,
      dataFim,
      page = 1,
      limit = 20
    } = req.query;

    const where = {};
    
    // Filtros
    if (categoria) where.categoria = categoria;
    if (relevancia) where.relevancia = relevancia;
    if (fonte) where.fonte = { [Op.iLike]: `%${fonte}%` };
    
    // Busca textual
    if (search) {
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${search}%` } },
        { resumo: { [Op.iLike]: `%${search}%` } },
        { conteudo: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Filtro de data
    if (dataInicio || dataFim) {
      where.data_publicacao = {};
      if (dataInicio) where.data_publicacao[Op.gte] = new Date(dataInicio);
      if (dataFim) where.data_publicacao[Op.lte] = new Date(dataFim);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Noticia.findAndCountAll({
      where,
      order: [['data_publicacao', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        perPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/noticias/:id
router.get('/:id', async (req, res) => {
  try {
    const noticia = await Noticia.findByPk(req.params.id);

    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: 'Notícia não encontrada'
      });
    }

    res.json({
      success: true,
      data: noticia
    });

  } catch (error) {
    console.error('Erro ao buscar notícia:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;