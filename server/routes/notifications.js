const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, run } = require('../database/db');
const { authenticateToken } = require('./auth');

// Criar notificação
const createNotification = async (userId, title, message, type = 'info', link = null) => {
  const id = uuidv4();
  await run(
    'INSERT INTO notifications (id, user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?, ?)',
    [id, userId, title, message, type, link]
  );
  return id;
};

// Listar notificações do usuário
router.get('/my-notifications', authenticateToken, async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    let sql = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [req.user.id];

    if (unreadOnly === 'true') {
      sql += ' AND read = 0';
    }

    sql += ' ORDER BY created_at DESC LIMIT 50';

    const notifications = await query(sql, params);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
});

// Contar notificações não lidas
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const result = await queryOne(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0',
      [req.user.id]
    );
    res.json({ count: result.count || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao contar notificações' });
  }
});

// Marcar notificação como lida
router.patch('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await queryOne('SELECT * FROM notifications WHERE id = ?', [notificationId]);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    await run('UPDATE notifications SET read = 1 WHERE id = ?', [notificationId]);
    res.json({ message: 'Notificação marcada como lida' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar notificação' });
  }
});

// Marcar todas como lidas
router.patch('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    await run('UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0', [req.user.id]);
    res.json({ message: 'Todas as notificações foram marcadas como lidas' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar notificações' });
  }
});

// Deletar notificação
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await queryOne('SELECT * FROM notifications WHERE id = ?', [notificationId]);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    await run('DELETE FROM notifications WHERE id = ?', [notificationId]);
    res.json({ message: 'Notificação deletada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar notificação' });
  }
});

// Obter uma notificação específica
router.get('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await queryOne('SELECT * FROM notifications WHERE id = ?', [notificationId]);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notificação' });
  }
});

module.exports = router;
module.exports.createNotification = createNotification;





