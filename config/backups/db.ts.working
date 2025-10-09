import { Sequelize } from 'sequelize'
import config from '../config'

const getDatabaseConfig = () => ({
  dialect: 'postgres',
  logging: config.debug ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    timestamps: true
  },
  pool: {
    max: 20,
    min: 0,
    idle: 10000,
    acquire: 30000,
    evict: 1000
  },
  retry: {
    max: 3,
    timeout: 30000
  }
})

export const sequelize = new Sequelize(config.databaseUri, getDatabaseConfig())

export const checkDatabaseConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection error:', error)
    return false
  }
}
