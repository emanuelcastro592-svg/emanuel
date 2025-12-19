const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar CORS para aceitar o domínio
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.CLIENT_URL,
  `https://${process.env.DOMAIN}`,
  `http://${process.env.DOMAIN}`,
  `https://www.${process.env.DOMAIN}`,
  `http://www.${process.env.DOMAIN}`
].filter(Boolean);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rotas
const authRoutes = require('./routes/auth');
const trainerRoutes = require('./routes/trainers');
const serviceRoutes = require('./routes/services');
const appointmentRoutes = require('./routes/appointments');
const requestRoutes = require('./routes/requests');
const statsRoutes = require('./routes/stats');
const ratingsRoutes = require('./routes/ratings');
const notificationsRoutes = require('./routes/notifications');
const usersRoutes = require('./routes/users');

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/users', usersRoutes);

// Inicializar banco de dados
const db = require('./database/db');
const { runMigrations } = require('./database/migrations');

// Inicializar banco e aguardar antes de executar migrações
db.init();
// Executar migrações após inicialização (com delay maior para garantir que tabelas foram criadas)
setTimeout(() => {
  runMigrations().catch(err => {
    console.error('Erro ao executar migrações:', err);
  });
}, 2000);

// Servir arquivos estáticos do React em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Todas as rotas que não são API, servir o React
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    }
  });
}

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando!',
    domain: process.env.DOMAIN || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  if (process.env.DOMAIN) {
    console.log(`Domínio configurado: ${process.env.DOMAIN}`);
  }
});



