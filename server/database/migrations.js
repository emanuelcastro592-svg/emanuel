// Script de migração para adicionar novas colunas sem perder dados
const { getDb, run } = require('./db');

// Função auxiliar para verificar se erro é de coluna já existente
const isColumnExistsError = (error) => {
  if (!error) return false;
  const errorMsg = (error.message || '').toLowerCase();
  const errorCode = error.code;
  
  // PostgreSQL retorna código 42701 para coluna duplicada
  if (errorCode === '42701') return true;
  
  // Verificar mensagens comuns
  if (errorMsg.includes('duplicate column')) return true;
  if (errorMsg.includes('already exists') && errorMsg.includes('column')) return true;
  if (errorMsg.includes('column') && errorMsg.includes('of relation') && errorMsg.includes('already exists')) return true;
  
  return false;
};

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
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna avatar já existe, pulando...');
        } else {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN bio TEXT`);
        console.log('✅ Coluna bio adicionada');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna bio já existe, pulando...');
        } else {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN address TEXT`);
        console.log('✅ Coluna address adicionada');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna address já existe, pulando...');
        } else {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN city TEXT`);
        console.log('✅ Coluna city adicionada');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna city já existe, pulando...');
        } else {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN state TEXT`);
        console.log('✅ Coluna state adicionada');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna state já existe, pulando...');
        } else {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN zip_code TEXT`);
        console.log('✅ Coluna zip_code adicionada');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna zip_code já existe, pulando...');
        } else {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1`);
        console.log('✅ Coluna is_active adicionada');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna is_active já existe, pulando...');
        } else {
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN last_login TIMESTAMP`);
        console.log('✅ Coluna last_login adicionada');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna last_login já existe, pulando...');
        } else {
          console.error('❌ Erro ao adicionar last_login:', e.message);
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
        console.log('✅ Coluna updated_at adicionada');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna updated_at já existe, pulando...');
        } else {
          console.error('❌ Erro ao adicionar updated_at:', e.message);
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
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna category já existe em services, pulando...');
        } else {
          console.error('❌ Erro ao adicionar category em services:', e.message);
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE services ADD COLUMN image_url TEXT`);
        console.log('✅ Coluna image_url adicionada em services');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna image_url já existe em services, pulando...');
        } else {
          console.error('❌ Erro ao adicionar image_url em services:', e.message);
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE services ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
        console.log('✅ Coluna updated_at adicionada em services');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna updated_at já existe em services, pulando...');
        } else {
          console.error('❌ Erro ao adicionar updated_at em services:', e.message);
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
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna location já existe em appointments, pulando...');
        } else {
          console.error('❌ Erro ao adicionar location em appointments:', e.message);
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE appointments ADD COLUMN cancellation_reason TEXT`);
        console.log('✅ Coluna cancellation_reason adicionada em appointments');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna cancellation_reason já existe em appointments, pulando...');
        } else {
          console.error('❌ Erro ao adicionar cancellation_reason em appointments:', e.message);
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE appointments ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
        console.log('✅ Coluna updated_at adicionada em appointments');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna updated_at já existe em appointments, pulando...');
        } else {
          console.error('❌ Erro ao adicionar updated_at em appointments:', e.message);
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
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna location já existe em service_requests, pulando...');
        } else {
          console.error('❌ Erro ao adicionar location em service_requests:', e.message);
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE service_requests ADD COLUMN rejection_reason TEXT`);
        console.log('✅ Coluna rejection_reason adicionada em service_requests');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna rejection_reason já existe em service_requests, pulando...');
        } else {
          console.error('❌ Erro ao adicionar rejection_reason em service_requests:', e.message);
          throw e;
        }
      }

      try {
        await run(`ALTER TABLE service_requests ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
        console.log('✅ Coluna updated_at adicionada em service_requests');
      } catch (e) {
        if (isColumnExistsError(e)) {
          console.log('ℹ️ Coluna updated_at já existe em service_requests, pulando...');
        } else {
          console.error('❌ Erro ao adicionar updated_at em service_requests:', e.message);
          throw e;
        }
      }
    }
  }
];

const runMigrations = async () => {
  console.log('🔄 Executando migrações...');
  let hasErrors = false;
  
  for (const migration of migrations) {
    try {
      await migration.up();
      console.log(`✅ Migração ${migration.name} concluída`);
    } catch (error) {
      // Se for erro de coluna já existente, não é crítico
      if (isColumnExistsError(error)) {
        console.log(`ℹ️ Migração ${migration.name}: algumas colunas já existem, continuando...`);
      } else {
        console.error(`❌ Erro na migração ${migration.name}:`, error.message);
        hasErrors = true;
        // Não parar o processo, apenas logar o erro
      }
    }
  }
  
  if (hasErrors) {
    console.warn('⚠️ Algumas migrações tiveram erros, mas o processo continuou');
  } else {
    console.log('✅ Todas as migrações concluídas sem erros críticos!');
  }
};

module.exports = { runMigrations };






