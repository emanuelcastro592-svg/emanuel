// Script de migração para adicionar novas colunas sem perder dados
const { getDb, run } = require('./db');

const migrations = [
  {
    name: 'add_user_fields',
    up: async () => {
      const db = getDb();
      
      // Adicionar novas colunas se não existirem
      try {
        await run(`ALTER TABLE users ADD COLUMN avatar TEXT`);
        console.log('✅ Coluna avatar adicionada');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN bio TEXT`);
        console.log('✅ Coluna bio adicionada');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN address TEXT`);
        console.log('✅ Coluna address adicionada');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN city TEXT`);
        console.log('✅ Coluna city adicionada');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN state TEXT`);
        console.log('✅ Coluna state adicionada');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN zip_code TEXT`);
        console.log('✅ Coluna zip_code adicionada');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1`);
        console.log('✅ Coluna is_active adicionada');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN last_login DATETIME`);
        console.log('✅ Coluna last_login adicionada');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`);
        console.log('✅ Coluna updated_at adicionada');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }
    }
  },
  {
    name: 'add_service_fields',
    up: async () => {
      try {
        await run(`ALTER TABLE services ADD COLUMN category TEXT`);
        console.log('✅ Coluna category adicionada em services');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE services ADD COLUMN image_url TEXT`);
        console.log('✅ Coluna image_url adicionada em services');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE services ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`);
        console.log('✅ Coluna updated_at adicionada em services');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }
    }
  },
  {
    name: 'add_appointment_fields',
    up: async () => {
      try {
        await run(`ALTER TABLE appointments ADD COLUMN location TEXT`);
        console.log('✅ Coluna location adicionada em appointments');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE appointments ADD COLUMN cancellation_reason TEXT`);
        console.log('✅ Coluna cancellation_reason adicionada em appointments');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE appointments ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`);
        console.log('✅ Coluna updated_at adicionada em appointments');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }
    }
  },
  {
    name: 'add_request_fields',
    up: async () => {
      try {
        await run(`ALTER TABLE service_requests ADD COLUMN location TEXT`);
        console.log('✅ Coluna location adicionada em service_requests');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE service_requests ADD COLUMN rejection_reason TEXT`);
        console.log('✅ Coluna rejection_reason adicionada em service_requests');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE service_requests ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`);
        console.log('✅ Coluna updated_at adicionada em service_requests');
      } catch (e) {
        if (!e.message.includes('duplicate column')) {
          throw e;
        }
      }
    }
  }
];

const runMigrations = async () => {
  console.log('🔄 Executando migrações...');
  for (const migration of migrations) {
    try {
      await migration.up();
      console.log(`✅ Migração ${migration.name} concluída`);
    } catch (error) {
      console.error(`❌ Erro na migração ${migration.name}:`, error.message);
    }
  }
  console.log('✅ Todas as migrações concluídas!');
};

module.exports = { runMigrations };




