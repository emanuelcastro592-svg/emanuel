const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, run } = require('../database/db');
const { authenticateToken } = require('./auth');

// Listar todos os serviços de um personal trainer
router.get('/trainer/:trainerId', async (req, res) => {
  try {
    const { trainerId } = req.params;
    const services = await query(
      'SELECT * FROM services WHERE trainer_id = $1 AND active = true ORDER BY created_at DESC',
      [trainerId]
    );
    res.json(services);
  } catch (err) {
    console.error('Erro ao buscar serviços:', err);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

// Criar novo serviço (apenas para personal trainers)
router.post('/', authenticateToken, (req, res) => {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({ error: 'Apenas personal trainers podem criar serviços' });
  }

  try {
    const { name, description, duration, price } = req.body;

    if (!name || !duration || !price) {
      return res.status(400).json({ error: 'Nome, duração e preço são obrigatórios' });
    }

    const db = getDb();
    const id = uuidv4();
    const trainerId = req.user.id;

    db.run(
      'INSERT INTO services (id, trainer_id, name, description, duration, price) VALUES (?, ?, ?, ?, ?, ?)',
      [id, trainerId, name, description || null, duration, price],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao criar serviço' });
        }

        db.get('SELECT * FROM services WHERE id = ?', [id], (err, service) => {
          if (err) {
            return res.status(500).json({ error: 'Erro ao buscar serviço criado' });
          }
          res.status(201).json(service);
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Atualizar serviço
router.put('/:serviceId', authenticateToken, (req, res) => {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({ error: 'Apenas personal trainers podem atualizar serviços' });
  }

  try {
    const { serviceId } = req.params;
    const { name, description, duration, price, active } = req.body;
    const db = getDb();

    // Verificar se o serviço pertence ao trainer
    db.get(
      'SELECT * FROM services WHERE id = ? AND trainer_id = ?',
      [serviceId, req.user.id],
      (err, service) => {
        if (err || !service) {
          return res.status(404).json({ error: 'Serviço não encontrado' });
        }

        const updates = [];
        const values = [];

        if (name !== undefined) {
          updates.push('name = ?');
          values.push(name);
        }
        if (description !== undefined) {
          updates.push('description = ?');
          values.push(description);
        }
        if (duration !== undefined) {
          updates.push('duration = ?');
          values.push(duration);
        }
        if (price !== undefined) {
          updates.push('price = ?');
          values.push(price);
        }
        if (active !== undefined) {
          updates.push('active = ?');
          values.push(active ? 1 : 0);
        }

        if (updates.length === 0) {
          return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        }

        values.push(serviceId);

        db.run(
          `UPDATE services SET ${updates.join(', ')} WHERE id = ?`,
          values,
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Erro ao atualizar serviço' });
            }

            db.get('SELECT * FROM services WHERE id = ?', [serviceId], (err, updatedService) => {
              if (err) {
                return res.status(500).json({ error: 'Erro ao buscar serviço atualizado' });
              }
              res.json(updatedService);
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Deletar serviço (desativar)
router.delete('/:serviceId', authenticateToken, (req, res) => {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({ error: 'Apenas personal trainers podem deletar serviços' });
  }

  try {
    const { serviceId } = req.params;
    const db = getDb();

    db.run(
      'UPDATE services SET active = 0 WHERE id = ? AND trainer_id = ?',
      [serviceId, req.user.id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao deletar serviço' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Serviço não encontrado' });
        }
        res.json({ message: 'Serviço deletado com sucesso' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Obter um serviço específico
router.get('/:serviceId', (req, res) => {
  const { serviceId } = req.params;
  const db = getDb();

  db.get(
    'SELECT * FROM services WHERE id = ?',
    [serviceId],
    (err, service) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar serviço' });
      }
      if (!service) {
        return res.status(404).json({ error: 'Serviço não encontrado' });
      }
      res.json(service);
    }
  );
});

module.exports = router;








