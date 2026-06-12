import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

export interface PoolStatus {
  timestamp: string;
  totalConnections: number;
  activeQueries: Array<{
    pid: number;
    state: string;
    query: string;
    query_time: string;
  }>;
  databaseStats: Array<{
    datname: string;
    numbackends: number;
    xact_commit: number;
    xact_rollback: number;
  }>;
}

export async function monitorPool(): Promise<PoolStatus> {
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

  const status: PoolStatus = {
    timestamp: new Date().toISOString(),
    totalConnections: 0,
    activeQueries: [],
    databaseStats: []
  }

  try {
    const [connResult] = await sequelize.query(
      'SELECT count(*) as connections FROM pg_stat_activity'
    )
    status.totalConnections = Number((connResult as any)[0].connections)

    const [activeResult] = await sequelize.query(
      `SELECT pid, state, query, age(clock_timestamp(), query_start) as query_time
       FROM pg_stat_activity WHERE state != 'idle'`
    )
    status.activeQueries = activeResult as PoolStatus['activeQueries']

    const [dbResult] = await sequelize.query(
      'SELECT datname, numbackends, xact_commit, xact_rollback FROM pg_stat_database'
    )
    status.databaseStats = dbResult as PoolStatus['databaseStats']

  } catch (error) {
    console.error('Pool monitoring error:', error)
  } finally {
    await sequelize.close()
  }

  return status
}

async function runStandalone() {
  const status = await monitorPool()
  console.clear()
  console.log('\n=== Connection Pool Statistics ===')
  console.log('Timestamp:', status.timestamp)
  console.log('Total Connections:', status.totalConnections)
  console.log('Active Queries:', JSON.stringify(status.activeQueries, null, 2))
  console.log('Database Stats:', JSON.stringify(status.databaseStats, null, 2))
}

// Run pool monitoring every 10 seconds
setInterval(runStandalone, 10000)
runStandalone() // Initial check
