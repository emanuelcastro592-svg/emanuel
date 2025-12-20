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

// Função para inicializar tudo antes de iniciar o servidor
const startServer = async () => {
  try {
    console.log('🔄 Inicializando banco de dados...');
    await db.init();
    console.log('✅ Banco de dados inicializado!');
    
    console.log('🔄 Executando migrações...');
    await runMigrations();
    console.log('✅ Migrações concluídas!');
    
    // Servir arquivos estáticos do React em produção
    if (process.env.NODE_ENV === 'production') {
      const buildPath = path.join(__dirname, '../client/build');
      const indexPath = path.join(buildPath, 'index.html');
      
      // Verificar se o build existe
      const fs = require('fs');
      if (fs.existsSync(buildPath) && fs.existsSync(indexPath)) {
        app.use(express.static(buildPath));
        
        // Todas as rotas que não são API, servir o React
        app.get('*', (req, res) => {
          if (!req.path.startsWith('/api')) {
            res.sendFile(indexPath);
          }
        });
        console.log('✅ Frontend React servido de:', buildPath);
      } else {
        console.warn('⚠️ Frontend build não encontrado em:', buildPath);
        console.warn('⚠️ Servindo apenas API. Frontend não disponível.');
      }
    }

    // Rota de teste
    app.get('/api/test', (req, res) => {
      res.json({ 
        message: 'API funcionando!',
        domain: process.env.DOMAIN || 'localhost',
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Iniciar servidor apenas após tudo estar pronto
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      if (process.env.DOMAIN) {
        console.log(`🌐 Domínio configurado: ${process.env.DOMAIN}`);
      }
      console.log('🚀 Aplicação pronta para receber requisições!');
    });
  } catch (error) {
    console.error('❌ Erro fatal ao inicializar aplicação:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Iniciar tudo
startServer();



