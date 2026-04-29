import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

export interface PoolStatus {
  timestamp: string
  connections: number
  activeQueries: any[]
  databases: any[]
  error?: string
}

// Reuse a single connection instead of opening/closing each poll cycle
let sequelize: Sequelize | null = null

function getSequelize(): Sequelize {
  if (!sequelize) {
    sequelize = new Sequelize(process.env.DATABASE_URL!, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  }
  return sequelize
}

process.on('SIGINT', async () => {
  if (sequelize) await sequelize.close()
  process.exit(0)
})

export async function monitorPool(): Promise<PoolStatus> {
  const db = getSequelize()
  const timestamp = new Date().toISOString()

  try {
    const [connectionsResult, activeResult, dbResult] = await Promise.all([
      db.query('SELECT count(*) as connections FROM pg_stat_activity'),
      db.query("SELECT pid, state, query, age(clock_timestamp(), query_start) as query_time FROM pg_stat_activity WHERE state != 'idle'"),
      db.query('SELECT datname, numbackends, xact_commit, xact_rollback FROM pg_stat_database')
    ])

    return {
      timestamp,
      connections: Number((connectionsResult[0] as any)[0]?.connections ?? 0),
      activeQueries: activeResult[0] as any[],
      databases: dbResult[0] as any[],
    }
  } catch (error) {
    console.error('Pool monitoring error:', error)
    return {
      timestamp,
      connections: 0,
      activeQueries: [],
      databases: [],
      error: (error as Error).message,
    }
  }
}

// Standalone mode: log stats every 10 seconds
if (process.argv[1]?.endsWith('pool-monitor.ts') || process.argv[1]?.endsWith('pool-monitor.js')) {
  async function printStats() {
    const status = await monitorPool()
    console.log('\n=== Connection Pool Statistics ===')
    console.log('Timestamp:', status.timestamp)
    console.log('Total connections:', status.connections)
    console.log('Active queries:', JSON.stringify(status.activeQueries, null, 2))
    console.log('Databases:', JSON.stringify(status.databases, null, 2))
    if (status.error) console.error('Error:', status.error)
  }

  setInterval(printStats, 10000)
  printStats()
}
