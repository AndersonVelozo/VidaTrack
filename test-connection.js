const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL);

async function test() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PostgreSQL estabelecida!');
    
    const [results] = await sequelize.query('SELECT current_database() as db, current_user as user');
    console.log('📊 Banco conectado:', results[0]);
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Falha na conexão:', error);
  }
}

test();