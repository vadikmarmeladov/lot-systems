import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

async function monitorPool() {
  const sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })

  try {
    const queries = [
      'SELECT count(*) as connections FROM pg_stat_activity',
      'SELECT pid, state, query, age(clock_timestamp(), query_start) as query_time FROM pg_stat_activity 
WHERE state != \'idle\'',
      'SELECT datname, numbackends, xact_commit, xact_rollback FROM pg_stat_database'
    ]

    console.clear()
    console.log('\n=== Connection Pool Statistics ===')
    console.log('Timestamp:', new Date().toISOString())

    for (const query of queries) {
      const [result] = await sequelize.query(query)
      console.log('\nQuery:', query)
      console.log('Result:', JSON.stringify(result, null, 2))
    }

  } catch (error) {
    console.error('Pool monitoring error:', error)
  } finally {
    await sequelize.close()
  }
}

// Run pool monitoring every 10 seconds
setInterval(monitorPool, 10000)
monitorPool() // Initial check
