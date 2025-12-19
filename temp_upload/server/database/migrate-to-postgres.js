/**
 * Script de Migração de Dados: SQLite → PostgreSQL
 * 
 * Este script migra todos os dados do banco SQLite para PostgreSQL
 * 
 * Uso:
 * 1. Certifique-se de que o PostgreSQL está rodando
 * 2. Configure as variáveis de ambiente no .env
 * 3. Execute: node server/database/migrate-to-postgres.js
 */

const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

// Configuração SQLite
const sqlitePath = path.join(__dirname, 'database.sqlite');
const sqliteDb = new sqlite3.Database(sqlitePath);

// Configuração PostgreSQL
const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'fitbooking',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Função auxiliar para query SQLite com Promise
const sqliteQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Função para migrar uma tabela
const migrateTable = async (tableName, transformRow = null) => {
  try {
    console.log(`\n📦 Migrando tabela: ${tableName}...`);
    
    // Ler dados do SQLite
    const rows = await sqliteQuery(`SELECT * FROM ${tableName}`);
    console.log(`   Encontrados ${rows.length} registros`);
    
    if (rows.length === 0) {
      console.log(`   ✅ Tabela ${tableName} está vazia, pulando...`);
      return;
    }

    // Inserir no PostgreSQL
    let inserted = 0;
    for (const row of rows) {
      try {
        // Transformar dados se necessário
        const transformedRow = transformRow ? transformRow(row) : row;
        
        // Construir query de inserção dinâmica
        const columns = Object.keys(transformedRow).filter(key => transformedRow[key] !== undefined);
        const values = columns.map((_, index) => `$${index + 1}`).join(', ');
        const columnNames = columns.join(', ');
        const params = columns.map(col => transformedRow[col]);
        
        const insertSql = `INSERT INTO ${tableName} (${columnNames}) VALUES (${values}) ON CONFLICT (id) DO NOTHING`;
        
        await pgPool.query(insertSql, params);
        inserted++;
      } catch (err) {
        if (err.message && err.message.includes('duplicate key')) {
          console.log(`   ⚠️  Registro ${row.id} já existe, pulando...`);
        } else {
          console.error(`   ❌ Erro ao inserir registro ${row.id}:`, err.message);
        }
      }
    }
    
    console.log(`   ✅ ${inserted} registros migrados com sucesso`);
  } catch (error) {
    console.error(`   ❌ Erro ao migrar tabela ${tableName}:`, error.message);
    throw error;
  }
};

// Função principal de migração
const migrate = async () => {
  console.log('🚀 Iniciando migração de SQLite para PostgreSQL...\n');
  
  try {
    // Testar conexão PostgreSQL
    await pgPool.query('SELECT 1');
    console.log('✅ Conectado ao PostgreSQL');
    
    // Verificar se as tabelas existem no PostgreSQL
    const tablesCheck = await pgPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'services', 'appointments', 'service_requests', 'ratings', 'notifications')
    `);
    
    if (tablesCheck.rows.length === 0) {
      console.log('⚠️  Tabelas não encontradas no PostgreSQL. Execute db.init() primeiro!');
      process.exit(1);
    }
    
    console.log(`✅ ${tablesCheck.rows.length} tabelas encontradas no PostgreSQL\n`);
    
    // Transformadores de dados (converter tipos SQLite → PostgreSQL)
    const transformUser = (row) => ({
      ...row,
      is_active: row.is_active === 1 || row.is_active === true ? true : false
    });
    
    const transformService = (row) => ({
      ...row,
      active: row.active === 1 || row.active === true ? true : false,
      price: parseFloat(row.price) || 0
    });
    
    const transformNotification = (row) => ({
      ...row,
      read: row.read === 1 || row.read === true ? true : false
    });
    
    // Migrar tabelas na ordem correta (respeitando foreign keys)
    await migrateTable('users', transformUser);
    await migrateTable('services', transformService);
    await migrateTable('appointments');
    await migrateTable('service_requests');
    await migrateTable('ratings');
    await migrateTable('notifications', transformNotification);
    
    console.log('\n✅ Migração concluída com sucesso!');
    console.log('\n📊 Resumo:');
    
    // Contar registros migrados
    const counts = await Promise.all([
      pgPool.query('SELECT COUNT(*) as count FROM users'),
      pgPool.query('SELECT COUNT(*) as count FROM services'),
      pgPool.query('SELECT COUNT(*) as count FROM appointments'),
      pgPool.query('SELECT COUNT(*) as count FROM service_requests'),
      pgPool.query('SELECT COUNT(*) as count FROM ratings'),
      pgPool.query('SELECT COUNT(*) as count FROM notifications'),
    ]);
    
    console.log(`   Users: ${counts[0].rows[0].count}`);
    console.log(`   Services: ${counts[1].rows[0].count}`);
    console.log(`   Appointments: ${counts[2].rows[0].count}`);
    console.log(`   Service Requests: ${counts[3].rows[0].count}`);
    console.log(`   Ratings: ${counts[4].rows[0].count}`);
    console.log(`   Notifications: ${counts[5].rows[0].count}`);
    
  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    sqliteDb.close();
    await pgPool.end();
    console.log('\n✅ Conexões fechadas');
  }
};

// Executar migração
if (require.main === module) {
  migrate();
}

module.exports = { migrate };



