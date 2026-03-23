import { Sequelize } from 'sequelize'
import config from '#server/config'

if (!config || !config.db) {
  throw new Error('Database configuration is missing!')
}

console.log('Initializing database connection to:', config.db.host)

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.username,
  password: config.db.password,
  dialectOptions: {
    ssl: {
      require: true,
      // In production, enable certificate verification for MITM protection.
      // Set to true once you have the DigitalOcean CA certificate installed.
      rejectUnauthorized: config.env === 'production',
    },
    // Connection timeout to prevent hanging
    connectionTimeoutMillis: 10000,
    // Statement timeout to prevent long-running queries
    statement_timeout: 30000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    // Validate connections before use
    evict: 1000,
  },
  // Never log SQL queries containing user data in production
  logging: config.env === 'development' ? console.log : false,
  protocol: 'postgres',
})

async function initializeDatabase() {
  try {
    await sequelize.authenticate()
    console.log('Database connection established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', (error as Error).message)
  }
}

initializeDatabase()

export { sequelize }
