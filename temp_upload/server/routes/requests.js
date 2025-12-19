const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/db');
const { authenticateToken } = require('./auth');

// Criar solicitação pontual de serviço
router.post('/', authenticateToken, (req, res) => {
  try {
    const { trainerId, serviceId, requestedDateTime, notes } = req.body;

    if (!trainerId || !serviceId) {
      return res.status(400).json({ error: 'Trainer ID e Service ID são obrigatórios' });
    }

    const db = getDb();
    const id = uuidv4();
    const clientId = req.user.id;

    // Verificar se o serviço existe e pertence ao trainer
    db.get(
      'SELECT * FROM services WHERE id = ? AND trainer_id = ? AND active = 1',
      [serviceId, trainerId],
      (err, service) => {
        if (err || !service) {
          return res.status(404).json({ error: 'Serviço não encontrado ou inativo' });
        }

        db.run(
          'INSERT INTO service_requests (id, trainer_id, client_id, service_id, requested_date_time, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [id, trainerId, clientId, serviceId, requestedDateTime || null, notes || null, 'pending'],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Erro ao criar solicitação' });
            }

            db.get('SELECT * FROM service_requests WHERE id = ?', [id], (err, request) => {
              if (err) {
                return res.status(500).json({ error: 'Erro ao buscar solicitação criada' });
              }

              // Buscar informações do serviço, trainer e cliente
              db.get('SELECT * FROM services WHERE id = ?', [serviceId], (err, serviceInfo) => {
                if (err) {
                  return res.status(500).json({ error: 'Erro ao buscar informações do serviço' });
                }

                db.get('SELECT id, name, email, phone FROM users WHERE id = ?', [trainerId], (err, trainerInfo) => {
                  if (err) {
                    return res.status(500).json({ error: 'Erro ao buscar informações do trainer' });
                  }

                  db.get('SELECT id, name, email, phone FROM users WHERE id = ?', [clientId], (err, clientInfo) => {
                    if (err) {
                      return res.status(500).json({ error: 'Erro ao buscar informações do cliente' });
                    }

                    res.status(201).json({
                      ...request,
                      service: serviceInfo,
                      trainer: trainerInfo,
                      client: clientInfo
                    });
                  });
                });
              });
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Listar solicitações do cliente
router.get('/client/my-requests', authenticateToken, (req, res) => {
  const db = getDb();

  db.all(
    `SELECT sr.*, 
            s.name as service_name, s.description as service_description, s.duration as service_duration, s.price as service_price,
            u1.name as trainer_name, u1.email as trainer_email, u1.phone as trainer_phone
     FROM service_requests sr
     JOIN services s ON sr.service_id = s.id
     JOIN users u1 ON sr.trainer_id = u1.id
     WHERE sr.client_id = ?
     ORDER BY sr.created_at DESC`,
    [req.user.id],
    (err, requests) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar solicitações' });
      }
      res.json(requests);
    }
  );
});

// Listar solicitações do personal trainer
router.get('/trainer/my-requests', authenticateToken, (req, res) => {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({ error: 'Apenas personal trainers podem acessar esta rota' });
  }

  const db = getDb();

  db.all(
    `SELECT sr.*, 
            s.name as service_name, s.description as service_description, s.duration as service_duration, s.price as service_price,
            u1.name as client_name, u1.email as client_email, u1.phone as client_phone
     FROM service_requests sr
     JOIN services s ON sr.service_id = s.id
     JOIN users u1 ON sr.client_id = u1.id
     WHERE sr.trainer_id = ?
     ORDER BY sr.created_at DESC`,
    [req.user.id],
    (err, requests) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar solicitações' });
      }
      res.json(requests);
    }
  );
});

// Atualizar status da solicitação (aceitar/rejeitar)
router.patch('/:requestId/status', authenticateToken, (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const db = getDb();

    // Verificar se a solicitação existe e se o usuário tem permissão
    db.get('SELECT * FROM service_requests WHERE id = ?', [requestId], (err, request) => {
      if (err || !request) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }

      // Cliente só pode cancelar suas próprias solicitações
      // Trainer pode aceitar, rejeitar ou completar solicitações
      if (req.user.role === 'client' && request.client_id !== req.user.id) {
        return res.status(403).json({ error: 'Sem permissão para atualizar esta solicitação' });
      }

      if (req.user.role === 'trainer' && request.trainer_id !== req.user.id) {
        return res.status(403).json({ error: 'Sem permissão para atualizar esta solicitação' });
      }

      // Cliente não pode aceitar/rejeitar
      if (req.user.role === 'client' && (status === 'accepted' || status === 'rejected')) {
        return res.status(403).json({ error: 'Cliente não pode aceitar ou rejeitar solicitações' });
      }

      db.run(
        'UPDATE service_requests SET status = ? WHERE id = ?',
        [status, requestId],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar solicitação' });
          }

          db.get('SELECT * FROM service_requests WHERE id = ?', [requestId], (err, updatedRequest) => {
            if (err) {
              return res.status(500).json({ error: 'Erro ao buscar solicitação atualizada' });
            }
            res.json(updatedRequest);
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Obter uma solicitação específica
router.get('/:requestId', authenticateToken, (req, res) => {
  const { requestId } = req.params;
  const db = getDb();

  db.get('SELECT * FROM service_requests WHERE id = ?', [requestId], (err, request) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar solicitação' });
    }
    if (!request) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    // Verificar permissão
    if (req.user.role === 'client' && request.client_id !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão para acessar esta solicitação' });
    }
    if (req.user.role === 'trainer' && request.trainer_id !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão para acessar esta solicitação' });
    }

    res.json(request);
  });
});

module.exports = router;






