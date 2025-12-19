const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { queryOne, run } = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-key-aqui';

// Registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validações
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando: nome, email, senha e tipo de conta são necessários' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (role !== 'trainer' && role !== 'client') {
      return res.status(400).json({ error: 'Tipo de conta deve ser "trainer" ou "client"' });
    }

    // Verificar se o email já existe
    try {
      const existingUser = await queryOne('SELECT id FROM users WHERE email = $1', [email]);
      
      if (existingUser) {
        return res.status(400).json({ error: 'Este email já está cadastrado. Use outro email ou faça login.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuidv4();

      await run(
        'INSERT INTO users (id, name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5, $6)',
        [id, name, email, hashedPassword, role, phone || null]
      );

      const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        token,
        user: { id, name, email, role, phone: phone || null }
      });
    } catch (dbError) {
      console.error('Erro ao inserir usuário:', dbError);
      if (dbError.message && (dbError.message.includes('UNIQUE') || dbError.message.includes('duplicate key'))) {
        return res.status(400).json({ error: 'Este email já está cadastrado' });
      }
      return res.status(500).json({ error: 'Erro ao criar usuário no banco de dados' });
    }
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor. Tente novamente mais tarde.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    try {
      const user = await queryOne('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);

      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Atualizar último login
      try {
        await run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
      } catch (updateErr) {
        console.error('Erro ao atualizar last_login:', updateErr);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          bio: user.bio
        }
      });
    } catch (dbError) {
      console.error('Erro ao buscar usuário:', dbError);
      return res.status(500).json({ error: 'Erro ao buscar usuário no banco de dados' });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor. Tente novamente mais tarde.' });
  }
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

module.exports = router;
module.exports.authenticateToken = authenticateToken;
