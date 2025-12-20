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

// Rota de teste (antes das outras rotas)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando!',
    domain: process.env.DOMAIN || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  });
});

// IMPORTANTE: Rotas da API DEVEM estar ANTES do static files
// Rotas da API
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
    console.log('🚀 Iniciando aplicação...');
    console.log('📋 Variáveis de ambiente:');
    console.log('   - NODE_ENV:', process.env.NODE_ENV || 'não definido');
    console.log('   - PORT:', process.env.PORT || '5000');
    console.log('   - DATABASE_URL:', process.env.DATABASE_URL ? '✅ definido' : '❌ não definido');
    console.log('   - JWT_SECRET:', process.env.JWT_SECRET ? '✅ definido' : '❌ não definido');
    
    console.log('🔄 Inicializando banco de dados...');
    await db.init();
    console.log('✅ Banco de dados inicializado!');
    
    console.log('🔄 Executando migrações...');
    await runMigrations();
    console.log('✅ Migrações concluídas!');
    
    // Servir arquivos estáticos do React em produção
    const fs = require('fs');
    
    // Caminho do build - Render usa /opt/render/project/src como raiz
    const basePath = process.cwd();
    const buildPath = path.join(basePath, 'client', 'build');
    const indexPath = path.join(buildPath, 'index.html');
    
    console.log('🔍 Procurando build do React...');
    console.log('📁 Base path:', basePath);
    console.log('📁 Build path:', buildPath);
    console.log('📁 Index path:', indexPath);
    console.log('📁 __dirname:', __dirname);
    
    // Listar diretório raiz para debug
    try {
      const rootFiles = fs.readdirSync(basePath);
      console.log('📂 Arquivos na raiz:', rootFiles.join(', '));
    } catch (e) {
      console.warn('⚠️ Não foi possível listar raiz:', e.message);
    }
    
    // Listar diretório client se existir
    const clientPath = path.join(basePath, 'client');
    if (fs.existsSync(clientPath)) {
      try {
        const clientFiles = fs.readdirSync(clientPath);
        console.log('📂 Arquivos em client/:', clientFiles.join(', '));
      } catch (e) {
        console.warn('⚠️ Não foi possível listar client/:', e.message);
      }
    } else {
      console.warn('⚠️ Diretório client/ não encontrado em:', clientPath);
    }
    
    // Verificar se build existe
    const buildExists = fs.existsSync(buildPath);
    const indexExists = fs.existsSync(indexPath);
    
    console.log('📁 Build existe?', buildExists);
    console.log('📁 Index existe?', indexExists);
    
    if (buildExists && indexExists) {
      try {
        const buildFiles = fs.readdirSync(buildPath);
        console.log('📂 Arquivos em build/:', buildFiles.join(', '));
      } catch (e) {
        console.warn('⚠️ Não foi possível listar build/:', e.message);
      }
    }
    
    if (buildExists && indexExists) {
      console.log('📁 Servindo de:', buildPath);
      
      // Servir arquivos estáticos do React
      app.use(express.static(buildPath, {
        maxAge: '1y',
        etag: false
      }));
      
      // Rota catch-all para SPA - DEVE ser registrada DEPOIS de tudo
      // Esta função será chamada no final
      const setupSPARoute = () => {
        app.get('*', (req, res, next) => {
          // Ignorar requisições de API
          if (req.path.startsWith('/api')) {
            return next();
          }
          // Servir index.html para todas as outras rotas (SPA routing)
          res.sendFile(path.resolve(indexPath), (err) => {
            if (err) {
              console.error('Erro ao servir index.html:', err);
              next(err);
            }
          });
        });
      };
      
      // Configurar rota SPA
      setupSPARoute();
      
      console.log('✅ Frontend React configurado e servindo!');
    } else {
      console.warn('⚠️ Frontend build não encontrado!');
      console.warn('📁 Caminho testado:', buildPath);
      console.warn('📁 Base path:', basePath);
      console.warn('📁 __dirname:', __dirname);
      
      // Criar uma página HTML simples como fallback
      const fallbackHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Personal Trainer API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
    }
    .container {
      background: rgba(255, 255, 255, 0.1);
      padding: 40px;
      border-radius: 10px;
      backdrop-filter: blur(10px);
    }
    h1 { margin-top: 0; }
    .status { 
      background: rgba(76, 175, 80, 0.3);
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .endpoint {
      background: rgba(0, 0, 0, 0.2);
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      font-family: monospace;
    }
    a {
      color: #fff;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Personal Trainer API</h1>
    <div class="status">
      <strong>✅ Status: Online</strong>
    </div>
    <p>A API está funcionando corretamente!</p>
    <h2>Endpoints disponíveis:</h2>
    <div class="endpoint">
      <a href="/api/test">GET /api/test</a> - Testar API
    </div>
    <div class="endpoint">
      POST /api/auth/register - Registrar usuário
    </div>
    <div class="endpoint">
      POST /api/auth/login - Fazer login
    </div>
    <div class="endpoint">
      <a href="/api/trainers">GET /api/trainers</a> - Listar trainers
    </div>
    <p><strong>Nota:</strong> O frontend React não está disponível. Verifique os logs do build.</p>
  </div>
</body>
</html>`;
      
      // Rota de fallback para a raiz
      app.get('/', (req, res) => {
        res.send(fallbackHTML);
      });
      
      console.warn('⚠️ Servindo página de fallback na raiz.');
    }


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



