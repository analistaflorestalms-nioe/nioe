/**
 * Rotas de Ocorrências - NIOE
 */

const express = require('express');
const { Op } = require('sequelize');
const { Ocorrencia, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// GET /api/ocorrencias
router.get('/', async (req, res) => {
  try {
    const {
      filial,
      status,
      prioridade,
      tipo,
      search,
      dataInicio,
      dataFim,
      page = 1,
      limit = 20
    } = req.query;

    const where = {};
    
    // Filtros
    if (filial) where.filial = filial;
    if (status) where.status = status;
    if (prioridade) where.prioridade = prioridade;
    if (tipo) where.tipo = tipo;
    
    // Busca textual
    if (search) {
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${search}%` } },
        { descricao: { [Op.iLike]: `%${search}%` } },
        { local: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Filtro de data
    if (dataInicio || dataFim) {
      where.data_ocorrencia = {};
      if (dataInicio) where.data_ocorrencia[Op.gte] = new Date(dataInicio);
      if (dataFim) where.data_ocorrencia[Op.lte] = new Date(dataFim);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Ocorrencia.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'criador',
        attributes: ['id', 'nome', 'email']
      }],
      order: [['data_ocorrencia', 'DESC']],
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
    console.error('Erro ao buscar ocorrências:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/ocorrencias/:id
router.get('/:id', async (req, res) => {
  try {
    const ocorrencia = await Ocorrencia.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'criador',
        attributes: ['id', 'nome', 'email']
      }]
    });

    if (!ocorrencia) {
      return res.status(404).json({
        success: false,
        message: 'Ocorrência não encontrada'
      });
    }

    res.json({
      success: true,
      data: ocorrencia
    });

  } catch (error) {
    console.error('Erro ao buscar ocorrência:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/ocorrencias
router.post('/', async (req, res) => {
  try {
    const ocorrenciaData = {
      ...req.body,
      criado_por: req.user.id
    };

    const ocorrencia = await Ocorrencia.create(ocorrenciaData);

    const ocorrenciaCompleta = await Ocorrencia.findByPk(ocorrencia.id, {
      include: [{
        model: User,
        as: 'criador',
        attributes: ['id', 'nome', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      data: ocorrenciaCompleta,
      message: 'Ocorrência criada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar ocorrência:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/ocorrencias/:id
router.put('/:id', async (req, res) => {
  try {
    const ocorrencia = await Ocorrencia.findByPk(req.params.id);

    if (!ocorrencia) {
      return res.status(404).json({
        success: false,
        message: 'Ocorrência não encontrada'
      });
    }

    await ocorrencia.update(req.body);

    const ocorrenciaAtualizada = await Ocorrencia.findByPk(ocorrencia.id, {
      include: [{
        model: User,
        as: 'criador',
        attributes: ['id', 'nome', 'email']
      }]
    });

    res.json({
      success: true,
      data: ocorrenciaAtualizada,
      message: 'Ocorrência atualizada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar ocorrência:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/ocorrencias/:id
router.delete('/:id', async (req, res) => {
  try {
    const ocorrencia = await Ocorrencia.findByPk(req.params.id);

    if (!ocorrencia) {
      return res.status(404).json({
        success: false,
        message: 'Ocorrência não encontrada'
      });
    }

    await ocorrencia.destroy();

    res.json({
      success: true,
      message: 'Ocorrência removida com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover ocorrência:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;