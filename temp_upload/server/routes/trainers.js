const express = require('express');
const router = express.Router();
const { getDb, query } = require('../database/db');

// Listar todos os personal trainers
router.get('/', async (req, res) => {
  try {
    const trainers = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.bio, u.city, u.state, u.created_at,
              COALESCE(AVG(r.rating), 0) as rating,
              COUNT(r.id) as rating_count
       FROM users u
       LEFT JOIN ratings r ON u.id = r.trainer_id
       WHERE u.role = 'trainer' AND u.is_active = true
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    res.json(trainers);
  } catch (err) {
    console.error('Erro ao buscar trainers:', err);
    res.status(500).json({ error: 'Erro ao buscar personal trainers' });
  }
});

// Obter um personal trainer específico
router.get('/:trainerId', async (req, res) => {
  try {
    const { trainerId } = req.params;
    const trainer = await query(
      `SELECT u.*,
              COALESCE(AVG(r.rating), 0) as rating,
              COUNT(r.id) as rating_count
       FROM users u
       LEFT JOIN ratings r ON u.id = r.trainer_id
       WHERE u.id = $1 AND u.role = 'trainer' AND u.is_active = true
       GROUP BY u.id`,
      [trainerId]
    );

    if (!trainer || trainer.length === 0) {
      return res.status(404).json({ error: 'Personal trainer não encontrado' });
    }
    res.json(trainer[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar personal trainer' });
  }
});

module.exports = router;



