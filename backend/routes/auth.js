/**
 * Rotas de Autenticação - NIOE
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se usuário está ativo
    if (!user.ativo) {
      return res.status(401).json({
        success: false,
        message: 'Usuário inativo'
      });
    }

    // Verificar se usuário está bloqueado
    if (user.bloqueado_ate && new Date() < user.bloqueado_ate) {
      return res.status(401).json({
        success: false,
        message: 'Usuário temporariamente bloqueado'
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);
    
    if (!senhaValida) {
      // Incrementar tentativas de login
      user.tentativas_login += 1;
      
      // Bloquear usuário após 5 tentativas
      if (user.tentativas_login >= 5) {
        user.bloqueado_ate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        logger.warn(`Usuário ${user.email} bloqueado por excesso de tentativas`);
      }
      
      await user.save();
      
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Resetar tentativas em caso de sucesso
    if (user.tentativas_login > 0) {
      user.tentativas_login = 0;
      user.bloqueado_ate = null;
      await user.save();
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Log de login bem-sucedido
    logger.info(`Login bem-sucedido: ${user.email}`);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        filial: user.filial,
        cargo: user.cargo
      }
    });

  } catch (error) {
    logger.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        filial: user.filial,
        cargo: user.cargo
      }
    });
  } catch (error) {
    logger.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Log de logout
    logger.info(`Logout: ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    logger.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;