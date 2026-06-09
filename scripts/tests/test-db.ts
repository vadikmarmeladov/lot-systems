import { Sequelize } from 'sequelize'

async function testDatabase() {
  console.log('Testing database connection...')
  
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || '25060'),
    database: process.env.DB_NAME || 'defaultdb',
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })

  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  } finally {
    await sequelize.close()
  }
}

testDatabase()
