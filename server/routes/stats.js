const express = require('express');
const router = express.Router();
const { getStats } = require('../database/db');
const { authenticateToken } = require('./auth');

// Obter estatísticas do sistema (apenas para admins ou usuários autenticados)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const stats = await getStats();
    if (stats) {
      res.json(stats);
    } else {
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;





