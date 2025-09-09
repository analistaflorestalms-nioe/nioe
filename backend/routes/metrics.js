/**
 * Rotas de Dashboard e Métricas - NIOE
 */

const express = require('express');
const { Op } = require('sequelize');
const { Ocorrencia, Colaborador, Noticia, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// GET /api/metrics/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const hoje = new Date();
    const umMesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());

    // Contadores gerais
    const totalOcorrencias = await Ocorrencia.count();
    const ocorrenciasAbertas = await Ocorrencia.count({ where: { status: 'aberta' } });
    const ocorrenciasCriticas = await Ocorrencia.count({ where: { prioridade: 'critica' } });
    
    const totalColaboradores = await Colaborador.count();
    const colaboradoresPendentes = await Colaborador.count({ where: { status: 'pendente' } });
    
    const totalNoticias = await Noticia.count();
    const noticiasRelevantes = await Noticia.count({ where: { relevancia: 'alta' } });

    // Ocorrências por tipo
    const ocorrenciasPorTipo = await Ocorrencia.findAll({
      attributes: [
        'tipo',
        [Ocorrencia.sequelize.fn('COUNT', Ocorrencia.sequelize.col('id')), 'total']
      ],
      group: ['tipo'],
      raw: true
    });

    // Ocorrências por status
    const ocorrenciasPorStatus = await Ocorrencia.findAll({
      attributes: [
        'status',
        [Ocorrencia.sequelize.fn('COUNT', Ocorrencia.sequelize.col('id')), 'total']
      ],
      group: ['status'],
      raw: true
    });

    // Ocorrências por filial
    const ocorrenciasPorFilial = await Ocorrencia.findAll({
      attributes: [
        'filial',
        [Ocorrencia.sequelize.fn('COUNT', Ocorrencia.sequelize.col('id')), 'total']
      ],
      group: ['filial'],
      raw: true
    });

    // Colaboradores por filial
    const colaboradoresPorFilial = await Colaborador.findAll({
      attributes: [
        'filial',
        [Colaborador.sequelize.fn('COUNT', Colaborador.sequelize.col('id')), 'total']
      ],
      group: ['filial'],
      raw: true
    });

    // Ocorrências recentes (últimos 30 dias)
    const ocorrenciasRecentes = await Ocorrencia.findAll({
      where: {
        data_ocorrencia: {
          [Op.gte]: umMesAtras
        }
      },
      attributes: [
        [Ocorrencia.sequelize.fn('DATE', Ocorrencia.sequelize.col('data_ocorrencia')), 'data'],
        [Ocorrencia.sequelize.fn('COUNT', Ocorrencia.sequelize.col('id')), 'total']
      ],
      group: [Ocorrencia.sequelize.fn('DATE', Ocorrencia.sequelize.col('data_ocorrencia'))],
      order: [[Ocorrencia.sequelize.fn('DATE', Ocorrencia.sequelize.col('data_ocorrencia')), 'ASC']],
      raw: true
    });

    // Notícias por categoria
    const noticiasPorCategoria = await Noticia.findAll({
      attributes: [
        'categoria',
        [Noticia.sequelize.fn('COUNT', Noticia.sequelize.col('id')), 'total']
      ],
      group: ['categoria'],
      raw: true
    });

    // Última atualização
    const ultimaOcorrencia = await Ocorrencia.findOne({
      order: [['created_at', 'DESC']],
      attributes: ['created_at']
    });

    const ultimaNoticia = await Noticia.findOne({
      order: [['created_at', 'DESC']],
      attributes: ['created_at']
    });

    const response = {
      success: true,
      data: {
        // Contadores gerais
        contadores: {
          totalOcorrencias,
          ocorrenciasAbertas,
          ocorrenciasCriticas,
          totalColaboradores,
          colaboradoresPendentes,
          totalNoticias,
          noticiasRelevantes
        },
        
        // Distribuições
        distribuicoes: {
          ocorrenciasPorTipo,
          ocorrenciasPorStatus,
          ocorrenciasPorFilial,
          colaboradoresPorFilial,
          noticiasPorCategoria
        },
        
        // Tendências
        tendencias: {
          ocorrenciasRecentes
        },
        
        // Metadados
        metadata: {
          ultimaAtualizacao: new Date(),
          ultimaOcorrencia: ultimaOcorrencia?.created_at,
          ultimaNoticia: ultimaNoticia?.created_at
        }
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Erro ao buscar métricas do dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/metrics/ocorrencias
router.get('/ocorrencias', async (req, res) => {
  try {
    const { periodo = '30' } = req.query;
    
    const diasAtras = new Date();
    diasAtras.setDate(diasAtras.getDate() - parseInt(periodo));

    const metricas = await Ocorrencia.findAll({
      where: {
        data_ocorrencia: {
          [Op.gte]: diasAtras
        }
      },
      attributes: [
        'tipo',
        'prioridade',
        'status',
        'filial',
        [Ocorrencia.sequelize.fn('COUNT', Ocorrencia.sequelize.col('id')), 'total']
      ],
      group: ['tipo', 'prioridade', 'status', 'filial'],
      raw: true
    });

    res.json({
      success: true,
      data: metricas
    });

  } catch (error) {
    console.error('Erro ao buscar métricas de ocorrências:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;