/**
 * Rotas de Colaboradores - NIOE
 */

const express = require('express');
const { Op } = require('sequelize');
const { Colaborador, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// GET /api/colaboradores
router.get('/', async (req, res) => {
  try {
    const {
      filial,
      status,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const where = {};
    
    // Filtros
    if (filial) where.filial = filial;
    if (status) where.status = status;
    
    // Busca textual
    if (search) {
      where[Op.or] = [
        { nome: { [Op.iLike]: `%${search}%` } },
        { cpf: { [Op.iLike]: `%${search}%` } },
        { cargo: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Colaborador.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'criador',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: User,
          as: 'aprovador',
          attributes: ['id', 'nome', 'email'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
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
    console.error('Erro ao buscar colaboradores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/colaboradores/:id
router.get('/:id', async (req, res) => {
  try {
    const colaborador = await Colaborador.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'criador',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: User,
          as: 'aprovador',
          attributes: ['id', 'nome', 'email'],
          required: false
        }
      ]
    });

    if (!colaborador) {
      return res.status(404).json({
        success: false,
        message: 'Colaborador não encontrado'
      });
    }

    res.json({
      success: true,
      data: colaborador
    });

  } catch (error) {
    console.error('Erro ao buscar colaborador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/colaboradores
router.post('/', async (req, res) => {
  try {
    const colaboradorData = {
      ...req.body,
      criado_por: req.user.id
    };

    const colaborador = await Colaborador.create(colaboradorData);

    const colaboradorCompleto = await Colaborador.findByPk(colaborador.id, {
      include: [
        {
          model: User,
          as: 'criador',
          attributes: ['id', 'nome', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: colaboradorCompleto,
      message: 'Colaborador criado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/colaboradores/:id
router.put('/:id', async (req, res) => {
  try {
    const colaborador = await Colaborador.findByPk(req.params.id);

    if (!colaborador) {
      return res.status(404).json({
        success: false,
        message: 'Colaborador não encontrado'
      });
    }

    await colaborador.update(req.body);

    const colaboradorAtualizado = await Colaborador.findByPk(colaborador.id, {
      include: [
        {
          model: User,
          as: 'criador',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: User,
          as: 'aprovador',
          attributes: ['id', 'nome', 'email'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: colaboradorAtualizado,
      message: 'Colaborador atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/colaboradores/:id
router.delete('/:id', async (req, res) => {
  try {
    const { motivo } = req.body;
    
    const colaborador = await Colaborador.findByPk(req.params.id);

    if (!colaborador) {
      return res.status(404).json({
        success: false,
        message: 'Colaborador não encontrado'
      });
    }

    // Atualizar motivo antes de fazer soft delete
    if (motivo) {
      await colaborador.update({ motivo_rejeicao: motivo });
    }

    await colaborador.destroy();

    res.json({
      success: true,
      message: 'Colaborador removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover colaborador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PATCH /api/colaboradores/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, motivo } = req.body;
    
    if (!['pendente', 'em_analise', 'aprovado', 'rejeitado'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    const colaborador = await Colaborador.findByPk(req.params.id);

    if (!colaborador) {
      return res.status(404).json({
        success: false,
        message: 'Colaborador não encontrado'
      });
    }

    const updateData = { status };
    
    if (status === 'aprovado') {
      updateData.aprovado_por = req.user.id;
      updateData.data_aprovacao = new Date();
    } else if (status === 'rejeitado' && motivo) {
      updateData.motivo_rejeicao = motivo;
    }

    await colaborador.update(updateData);

    const colaboradorAtualizado = await Colaborador.findByPk(colaborador.id, {
      include: [
        {
          model: User,
          as: 'criador',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: User,
          as: 'aprovador',
          attributes: ['id', 'nome', 'email'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: colaboradorAtualizado,
      message: 'Status do colaborador atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar status do colaborador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;