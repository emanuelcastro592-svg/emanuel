const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'fitbooking',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // máximo de conexões no pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Testar conexão ao inicializar
pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente PostgreSQL:', err);
  process.exit(-1);
});

// Função para inicializar o banco de dados (criar tabelas)
const init = async () => {
  try {
    // Criar tabela de usuários (personal trainers e clientes)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK(role IN ('trainer', 'client')),
        phone VARCHAR(50),
        avatar TEXT,
        bio TEXT,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(50),
        zip_code VARCHAR(20),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Adicionar colunas que podem não existir (para bancos antigos)
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`);
    } catch (err) {
      if (!err.message.includes('duplicate column')) {
        console.error('Erro ao adicionar coluna is_active:', err.message);
      }
    }

    try {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP`);
    } catch (err) {
      if (!err.message.includes('duplicate column')) {
        console.error('Erro ao adicionar coluna last_login:', err.message);
      }
    }

    try {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
    } catch (err) {
      if (!err.message.includes('duplicate column')) {
        console.error('Erro ao adicionar coluna updated_at:', err.message);
      }
    }

    // Criar índices para users
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active)`);

    // Criar tabela de serviços oferecidos pelos personal trainers
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(255) PRIMARY KEY,
        trainer_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        image_url TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Criar índices para services
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_services_trainer ON services(trainer_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_services_active ON services(active)`);

    // Criar tabela de agendamentos específicos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(255) PRIMARY KEY,
        trainer_id VARCHAR(255) NOT NULL,
        client_id VARCHAR(255) NOT NULL,
        date_time TIMESTAMP NOT NULL,
        duration INTEGER NOT NULL,
        notes TEXT,
        location TEXT,
        status VARCHAR(50) DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        cancellation_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Criar índices para appointments
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_appointments_trainer ON appointments(trainer_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date_time)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)`);

    // Criar tabela de solicitações pontuais de serviços
    await pool.query(`
      CREATE TABLE IF NOT EXISTS service_requests (
        id VARCHAR(255) PRIMARY KEY,
        trainer_id VARCHAR(255) NOT NULL,
        client_id VARCHAR(255) NOT NULL,
        service_id VARCHAR(255) NOT NULL,
        requested_date_time TIMESTAMP,
        notes TEXT,
        location TEXT,
        status VARCHAR(50) DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
      )
    `);

    // Criar índices para service_requests
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_requests_trainer ON service_requests(trainer_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_requests_client ON service_requests(client_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_requests_service ON service_requests(service_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_requests_status ON service_requests(status)`);

    // Criar tabela de avaliações/ratings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id VARCHAR(255) PRIMARY KEY,
        trainer_id VARCHAR(255) NOT NULL,
        client_id VARCHAR(255) NOT NULL,
        appointment_id VARCHAR(255),
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
      )
    `);

    // Criar índices para ratings
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ratings_trainer ON ratings(trainer_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ratings_client ON ratings(client_id)`);

    // Criar tabela de notificações
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info' CHECK(type IN ('info', 'success', 'warning', 'error')),
        read BOOLEAN DEFAULT false,
        link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Criar índices para notifications
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read)`);

    console.log('✅ Banco de dados PostgreSQL inicializado com sucesso!');
    console.log('📊 Tabelas criadas: users, services, appointments, service_requests, ratings, notifications');
    console.log('🔍 Índices criados para otimização de consultas');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

// Função para executar queries com Promise
const query = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Erro na query:', error);
    throw error;
  }
};

// Função para executar uma única linha
const queryOne = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro na queryOne:', error);
    throw error;
  }
};

// Função para executar comandos (INSERT, UPDATE, DELETE)
const run = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return {
      lastID: null, // PostgreSQL não tem lastID, mas mantemos para compatibilidade
      changes: result.rowCount || 0,
      rows: result.rows
    };
  } catch (error) {
    console.error('Erro no run:', error);
    throw error;
  }
};

// Função para obter estatísticas do banco
const getStats = async () => {
  try {
    const stats = {
      users: await queryOne('SELECT COUNT(*) as count FROM users'),
      trainers: await queryOne('SELECT COUNT(*) as count FROM users WHERE role = $1', ['trainer']),
      clients: await queryOne('SELECT COUNT(*) as count FROM users WHERE role = $1', ['client']),
      services: await queryOne('SELECT COUNT(*) as count FROM services'),
      appointments: await queryOne('SELECT COUNT(*) as count FROM appointments'),
      requests: await queryOne('SELECT COUNT(*) as count FROM service_requests'),
      ratings: await queryOne('SELECT COUNT(*) as count FROM ratings'),
    };
    return stats;
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return null;
  }
};

// Função para fazer backup do banco (exportar dados)
const backup = async () => {
  try {
    const tables = ['users', 'services', 'appointments', 'service_requests', 'ratings', 'notifications'];
    const backup = {};
    
    for (const table of tables) {
      backup[table] = await query(`SELECT * FROM ${table}`);
    }
    
    return backup;
  } catch (error) {
    console.error('Erro ao fazer backup:', error);
    throw error;
  }
};

// Função para obter o pool (para compatibilidade com código antigo que usa getDb)
const getDb = () => {
  // Retornar um objeto compatível com a interface antiga
  return {
    get: (sql, params, callback) => {
      queryOne(sql, params)
        .then(row => callback(null, row))
        .catch(err => callback(err, null));
    },
    all: (sql, params, callback) => {
      query(sql, params)
        .then(rows => callback(null, rows))
        .catch(err => callback(err, null));
    },
    run: (sql, params, callback) => {
      run(sql, params)
        .then(result => {
          // Simular interface do sqlite3
          const mockThis = {
            lastID: result.rows && result.rows[0] ? result.rows[0].id : null,
            changes: result.changes
          };
          callback(null, mockThis);
        })
        .catch(err => callback(err, null));
    }
  };
};

// Fechar conexão graciosamente
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('✅ Conexão com banco de dados PostgreSQL fechada.');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao fechar banco de dados:', err);
    process.exit(1);
  }
});

module.exports = {
  init,
  getDb,
  query,
  queryOne,
  run,
  getStats,
  backup,
  pool // Exportar pool para uso direto se necessário
};
