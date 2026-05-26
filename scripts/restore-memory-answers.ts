#!/usr/bin/env tsx
/**
 * Restore Memory Answer Events from Backup
 *
 * Restores deleted Memory answer events (event='answer') from a backup database
 * to the production database. Only restores records that don't already exist.
 */

import { Client } from 'pg'

// Backup database credentials (set via environment variables)
const BACKUP_DB = {
  user: process.env.BACKUP_DB_USER || '',
  password: process.env.BACKUP_DB_PASSWORD || '',
  host: process.env.BACKUP_DB_HOST || '',
  port: parseInt(process.env.BACKUP_DB_PORT || '25060'),
  database: process.env.BACKUP_DB_NAME || 'defaultdb',
  ssl: { rejectUnauthorized: false }
}

// Production database credentials (set via environment variables)
const PRODUCTION_DB = {
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || '',
  port: parseInt(process.env.DB_PORT || '25060'),
  database: process.env.DB_NAME || 'defaultdb',
  ssl: { rejectUnauthorized: false }
}

async function restoreMemoryAnswers() {
  console.log('Starting Memory Answer Restoration\n')

  // Connect to backup database
  console.log('📦 Connecting to backup database...')
  const backupClient = new Client(BACKUP_DB)
  await backupClient.connect()
  console.log('Connected to backup database\n')

  // Connect to production database
  console.log('🗄️  Connecting to production database...')
  const prodClient = new Client(PRODUCTION_DB)
  await prodClient.connect()
  console.log('Connected to production database\n')

  try {
    // Find deleted answer events (from past 4 days in backup, not in production)
    console.log('Finding deleted Memory answer events...')

    const fourDaysAgo = new Date()
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)

    // Get answer events from backup (past 4 days)
    const backupAnswers = await backupClient.query(`
      SELECT id, user_id, event, text, metadata, context, created_at, updated_at
      FROM logs
      WHERE event = 'answer'
        AND created_at >= $1
      ORDER BY created_at DESC
    `, [fourDaysAgo])

    console.log(`   Found ${backupAnswers.rows.length} answer events in backup\n`)

    // Get existing answer events from production
    const prodAnswers = await prodClient.query(`
      SELECT id FROM logs WHERE event = 'answer'
    `)

    const existingIds = new Set(prodAnswers.rows.map(r => r.id))
    console.log(`   Found ${existingIds.size} answer events in production\n`)

    // Find missing answers
    const missingAnswers = backupAnswers.rows.filter(row => !existingIds.has(row.id))

    console.log(`Analysis:`)
    console.log(`   Total in backup (past 4 days): ${backupAnswers.rows.length}`)
    console.log(`   Currently in production: ${existingIds.size}`)
    console.log(`   Missing (to restore): ${missingAnswers.length}\n`)

    if (missingAnswers.length === 0) {
      console.log('No missing answer events found. Database is complete!')
      return
    }

    // Show sample of what will be restored
    console.log('📝 Sample of missing answers:')
    missingAnswers.slice(0, 3).forEach((answer, i) => {
      const question = answer.metadata?.question || 'Unknown question'
      const userAnswer = answer.metadata?.answer || 'Unknown answer'
      console.log(`   ${i + 1}. Q: "${question.substring(0, 60)}..."`)
      console.log(`      A: "${userAnswer.substring(0, 60)}..."`)
      console.log(`      Date: ${new Date(answer.created_at).toLocaleString()}`)
    })
    console.log()

    // Ask for confirmation
    console.log(` Ready to restore ${missingAnswers.length} Memory answer events`)
    console.log('   This will insert the missing records into production database.\n')

    // In a real script, you'd want to add confirmation here
    // For now, we'll proceed automatically

    console.log('Starting restoration...')
    let restored = 0

    for (const answer of missingAnswers) {
      await prodClient.query(`
        INSERT INTO logs (id, user_id, event, text, metadata, context, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
      `, [
        answer.id,
        answer.user_id,
        answer.event,
        answer.text,
        answer.metadata,
        answer.context,
        answer.created_at,
        answer.updated_at
      ])
      restored++

      if (restored % 10 === 0) {
        console.log(`   Restored ${restored}/${missingAnswers.length} answers...`)
      }
    }

    console.log(`\nRestoration complete!`)
    console.log(`   Restored ${restored} Memory answer events`)
    console.log(`   No data was overwritten or lost\n`)

    // Verify restoration
    console.log('Verifying restoration...')
    const verifyResult = await prodClient.query(`
      SELECT COUNT(*) as count FROM logs WHERE event = 'answer'
    `)
    console.log(`   Total answer events in production: ${verifyResult.rows[0].count}`)
    console.log('Verification complete!\n')

  } catch (error: any) {
    console.error('Restoration failed:', error.message)
    throw error
  } finally {
    // Close connections
    await backupClient.end()
    await prodClient.end()
    console.log('🔌 Closed database connections')
  }
}

// Run restoration
restoreMemoryAnswers()
  .then(() => {
    console.log('\nMemory Answer restoration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
