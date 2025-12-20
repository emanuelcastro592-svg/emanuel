const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, run } = require('../database/db');
const { authenticateToken } = require('./auth');

// Criar avaliação
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { trainerId, appointmentId, rating, comment } = req.body;
    const clientId = req.user.id;

    if (!trainerId || !rating) {
      return res.status(400).json({ error: 'Trainer ID e rating são obrigatórios' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating deve ser entre 1 e 5' });
    }

    // Verificar se já existe avaliação para este agendamento
    if (appointmentId) {
      const existing = await queryOne(
        'SELECT * FROM ratings WHERE appointment_id = ?',
        [appointmentId]
      );
      if (existing) {
        return res.status(400).json({ error: 'Este agendamento já foi avaliado' });
      }
    }

    const id = uuidv4();
    await run(
      'INSERT INTO ratings (id, trainer_id, client_id, appointment_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [id, trainerId, clientId, appointmentId || null, rating, comment || null]
    );

    const newRating = await queryOne('SELECT * FROM ratings WHERE id = ?', [id]);
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
});

// Listar avaliações de um trainer
router.get('/trainer/:trainerId', async (req, res) => {
  try {
    const { trainerId } = req.params;
    const ratings = await query(
      `SELECT r.*, u.name as client_name, u.avatar as client_avatar
       FROM ratings r
       JOIN users u ON r.client_id = u.id
       WHERE r.trainer_id = ?
       ORDER BY r.created_at DESC`,
      [trainerId]
    );

    // Calcular média
    const avgResult = await queryOne(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM ratings WHERE trainer_id = ?',
      [trainerId]
    );

    res.json({
      ratings,
      average: avgResult.avg_rating || 0,
      total: avgResult.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
});

// Listar avaliações do cliente
router.get('/client/my-ratings', authenticateToken, async (req, res) => {
  try {
    const ratings = await query(
      `SELECT r.*, u.name as trainer_name, u.avatar as trainer_avatar
       FROM ratings r
       JOIN users u ON r.trainer_id = u.id
       WHERE r.client_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
});

// Obter uma avaliação específica
router.get('/:ratingId', async (req, res) => {
  try {
    const { ratingId } = req.params;
    const rating = await queryOne('SELECT * FROM ratings WHERE id = ?', [ratingId]);
    
    if (!rating) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }
    
    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avaliação' });
  }
});

// Atualizar avaliação (apenas o próprio cliente)
router.put('/:ratingId', authenticateToken, async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { rating, comment } = req.body;

    const existing = await queryOne('SELECT * FROM ratings WHERE id = ?', [ratingId]);
    if (!existing) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    if (existing.client_id !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão para editar esta avaliação' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating deve ser entre 1 e 5' });
    }

    const updates = [];
    const values = [];

    if (rating !== undefined) {
      updates.push('rating = ?');
      values.push(rating);
    }
    if (comment !== undefined) {
      updates.push('comment = ?');
      values.push(comment);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    values.push(ratingId);
    await run(
      `UPDATE ratings SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updated = await queryOne('SELECT * FROM ratings WHERE id = ?', [ratingId]);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar avaliação' });
  }
});

// Deletar avaliação
router.delete('/:ratingId', authenticateToken, async (req, res) => {
  try {
    const { ratingId } = req.params;
    const rating = await queryOne('SELECT * FROM ratings WHERE id = ?', [ratingId]);
    
    if (!rating) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    if (rating.client_id !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão para deletar esta avaliação' });
    }

    await run('DELETE FROM ratings WHERE id = ?', [ratingId]);
    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar avaliação' });
  }
});

module.exports = router;






