const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb, run, queryOne } = require('../database/db');
const { authenticateToken } = require('./auth');
const { createNotification } = require('./notifications');

// Criar agendamento específico
router.post('/', authenticateToken, (req, res) => {
  try {
    const { trainerId, dateTime, duration, notes } = req.body;

    if (!trainerId || !dateTime || !duration) {
      return res.status(400).json({ error: 'Trainer ID, data/hora e duração são obrigatórios' });
    }

    const db = getDb();
    const id = uuidv4();
    const clientId = req.user.id;

    // Verificar se o trainer existe
    db.get('SELECT * FROM users WHERE id = ? AND role = ?', [trainerId, 'trainer'], (err, trainer) => {
      if (err || !trainer) {
        return res.status(404).json({ error: 'Personal trainer não encontrado' });
      }

      // Verificar conflitos de horário
      db.all(
        `SELECT * FROM appointments 
         WHERE trainer_id = ? 
         AND status IN ('pending', 'confirmed')
         AND datetime(date_time) <= datetime(?, '+' || duration || ' minutes')
         AND datetime(date_time, '+' || duration || ' minutes') >= datetime(?)`,
        [trainerId, dateTime, dateTime],
        (err, conflicts) => {
          if (err) {
            return res.status(500).json({ error: 'Erro ao verificar conflitos' });
          }

          if (conflicts.length > 0) {
            return res.status(400).json({ error: 'Horário já está ocupado' });
          }

          db.run(
            'INSERT INTO appointments (id, trainer_id, client_id, date_time, duration, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, trainerId, clientId, dateTime, duration, notes || null, 'pending'],
            async function(err) {
              if (err) {
                return res.status(500).json({ error: 'Erro ao criar agendamento' });
              }

              // Criar notificação para o trainer
              try {
                const clientInfo = await queryOne('SELECT name FROM users WHERE id = ?', [clientId]);
                await createNotification(
                  trainerId,
                  'Novo Agendamento',
                  `${clientInfo.name} agendou uma sessão com você`,
                  'info',
                  `/trainer/appointments`
                );
              } catch (notifError) {
                console.error('Erro ao criar notificação:', notifError);
              }

              db.get('SELECT * FROM appointments WHERE id = ?', [id], (err, appointment) => {
                if (err) {
                  return res.status(500).json({ error: 'Erro ao buscar agendamento criado' });
                }

                // Buscar informações do trainer e cliente
                db.get('SELECT id, name, email, phone FROM users WHERE id = ?', [trainerId], (err, trainerInfo) => {
                  if (err) {
                    return res.status(500).json({ error: 'Erro ao buscar informações do trainer' });
                  }

                  db.get('SELECT id, name, email, phone FROM users WHERE id = ?', [clientId], (err, clientInfo) => {
                    if (err) {
                      return res.status(500).json({ error: 'Erro ao buscar informações do cliente' });
                    }

                    res.status(201).json({
                      ...appointment,
                      trainer: trainerInfo,
                      client: clientInfo
                    });
                  });
                });
              });
            }
          );
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Listar agendamentos do cliente
router.get('/client/my-appointments', authenticateToken, (req, res) => {
  const db = getDb();

  db.all(
    `SELECT a.*, 
            u1.name as trainer_name, u1.email as trainer_email, u1.phone as trainer_phone
     FROM appointments a
     JOIN users u1 ON a.trainer_id = u1.id
     WHERE a.client_id = ?
     ORDER BY a.date_time DESC`,
    [req.user.id],
    (err, appointments) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
      }
      res.json(appointments);
    }
  );
});

// Listar agendamentos do personal trainer
router.get('/trainer/my-appointments', authenticateToken, (req, res) => {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({ error: 'Apenas personal trainers podem acessar esta rota' });
  }

  const db = getDb();

  db.all(
    `SELECT a.*, 
            u1.name as client_name, u1.email as client_email, u1.phone as client_phone
     FROM appointments a
     JOIN users u1 ON a.client_id = u1.id
     WHERE a.trainer_id = ?
     ORDER BY a.date_time DESC`,
    [req.user.id],
    (err, appointments) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
      }
      res.json(appointments);
    }
  );
});

// Atualizar status do agendamento
router.patch('/:appointmentId/status', authenticateToken, (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const db = getDb();

    // Verificar se o agendamento existe e se o usuário tem permissão
    db.get('SELECT * FROM appointments WHERE id = ?', [appointmentId], (err, appointment) => {
      if (err || !appointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      // Cliente só pode cancelar seus próprios agendamentos
      // Trainer pode confirmar, completar ou cancelar seus agendamentos
      if (req.user.role === 'client' && appointment.client_id !== req.user.id) {
        return res.status(403).json({ error: 'Sem permissão para atualizar este agendamento' });
      }

      if (req.user.role === 'trainer' && appointment.trainer_id !== req.user.id) {
        return res.status(403).json({ error: 'Sem permissão para atualizar este agendamento' });
      }

      db.run(
        'UPDATE appointments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, appointmentId],
        async function(err) {
          if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar agendamento' });
          }

              // Criar notificação
              try {
                const notifyUserId = req.user.role === 'trainer' ? appointment.client_id : appointment.trainer_id;
                const userInfo = await queryOne('SELECT name FROM users WHERE id = ?', [req.user.id]);
                const userName = userInfo ? userInfo.name : 'Usuário';
            
            const statusMessages = {
              confirmed: 'confirmou',
              completed: 'marcou como concluído',
              cancelled: 'cancelou'
            };

            await createNotification(
              notifyUserId,
              'Agendamento Atualizado',
              `${userName} ${statusMessages[status] || 'atualizou'} o agendamento`,
              status === 'confirmed' ? 'success' : status === 'cancelled' ? 'warning' : 'info',
              req.user.role === 'trainer' ? '/client/appointments' : '/trainer/appointments'
            );
          } catch (notifError) {
            console.error('Erro ao criar notificação:', notifError);
          }

          db.get('SELECT * FROM appointments WHERE id = ?', [appointmentId], (err, updatedAppointment) => {
            if (err) {
              return res.status(500).json({ error: 'Erro ao buscar agendamento atualizado' });
            }
            res.json(updatedAppointment);
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Obter um agendamento específico
router.get('/:appointmentId', authenticateToken, (req, res) => {
  const { appointmentId } = req.params;
  const db = getDb();

  db.get('SELECT * FROM appointments WHERE id = ?', [appointmentId], (err, appointment) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar agendamento' });
    }
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Verificar permissão
    if (req.user.role === 'client' && appointment.client_id !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão para acessar este agendamento' });
    }
    if (req.user.role === 'trainer' && appointment.trainer_id !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão para acessar este agendamento' });
    }

    res.json(appointment);
  });
});

module.exports = router;



