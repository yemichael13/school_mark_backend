// Database setup script
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🗄️ Setting up database...');
    
    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || ''
    });

    // Read and execute migration file
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'sql', 'migration.sql'), 'utf8');
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        // Use query instead of execute for DDL statements
        await connection.query(statement);
      }
    }
    
    console.log('✅ Database and tables created successfully');
    
    // Close connection and reconnect to the new database
    await connection.end();
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'school_mark_db'
    });

    // Read and execute seed file
    const seedSQL = fs.readFileSync(path.join(__dirname, 'sql', 'seed.sql'), 'utf8');
    const seedStatements = seedSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of seedStatements) {
      if (statement.trim()) {
        // Use query instead of execute for DDL statements
        await connection.query(statement);
      }
    }
    
    console.log('✅ Sample data inserted successfully');
    console.log('\n📋 Test credentials:');
    console.log('Admin: admin@school.com / admin123');
    console.log('Teacher: alice@school.com / teacher123');
    console.log('Teacher: bob@school.com / teacher123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
