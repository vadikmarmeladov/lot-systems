/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import dayjs from '#server/utils/dayjs'

/**
 * Scheduled Jobs - Automated Monthly Email System
 *
 * Handles automated sending of monthly review emails to users
 * Runs at 9 AM UTC on the 1st of every month
 */

interface JobResult {
  jobName: string
  executedAt: string
  success: boolean
  result?: any
  error?: string
}

let isMonthlyEmailJobRunning = false
let lastMonthlyEmailRun: Date | null = null

/**
 * Check if we should run the monthly email job
 * Runs on 1st of month, once per day
 */
function shouldRunMonthlyEmailJob(): boolean {
  const now = dayjs()
  const dayOfMonth = now.date()

  // Only run on 1st of month
  if (dayOfMonth !== 1) {
    return false
  }

  // Don't run if already running
  if (isMonthlyEmailJobRunning) {
    console.log('⏸️  Monthly email job already running, skipping')
    return false
  }

  // Don't run if already ran today
  if (lastMonthlyEmailRun) {
    const lastRun = dayjs(lastMonthlyEmailRun)
    if (lastRun.isSame(now, 'day')) {
      console.log('Monthly email job already ran today, skipping')
      return false
    }
  }

  return true
}

/**
 * Execute monthly email sending job
 */
async function executeMonthlyEmailJob(): Promise<JobResult> {
  const jobName = 'monthly-email-sender'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('━'.repeat(60))
  console.log('📅 SCHEDULED JOB: Monthly Email Sender')
  console.log(`   Started at: ${executedAt}`)
  console.log('━'.repeat(60))
  console.log('')

  isMonthlyEmailJobRunning = true

  try {
    // Dynamic import to avoid circular dependencies
    const { sendEmail } = await import('#server/utils/email.js')
    const { generateMonthlySummary, generateMonthlyEmailBody, generateMonthlyEmailHtml, shouldShowMonthlySummary } = await import('#server/utils/monthly-summary.js')
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    // Find active users: 3+ months old, recently active (seen in last 7 days)
    // These are dedicated users with near-daily engagement
    const threeMonthsAgo = dayjs().subtract(3, 'month').toDate()
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()

    let activeUsers: any[]
    try {
      activeUsers = await User.findAll({
        where: {
          // Must have joined 3+ months ago
          joinedAt: {
            [Op.lte]: threeMonthsAgo
          },
          // Must be recently active (within last 7 days — proxy for near-daily)
          lastSeenAt: {
            [Op.gte]: sevenDaysAgo
          },
          // Only send to users with Usership tag
          tags: {
            [Op.contains]: ['usership']
          }
        },
        order: [['lastSeenAt', 'DESC']]
      })
    } catch (dbError: any) {
      console.error('Failed to query active users:', dbError.message)
      isMonthlyEmailJobRunning = false
      return { jobName, executedAt, success: false, error: `User query failed: ${dbError.message}` }
    }

    console.log(`Found ${activeUsers.length} active users (3+ months, near-daily)`)
    console.log('')

    const results = {
      total: activeUsers.length,
      sent: 0,
      skipped: 0,
      failed: 0,
      details: [] as any[]
    }

    // Theme defaults matching the profile page
    const THEMES: Record<string, { base: string; acc: string }> = {
      light: { base: '#ffffff', acc: '#000000' },
      dark: { base: '#000000', acc: '#ffffff' },
      sunrise: { base: '#ffd266', acc: '#ffffff' },
      sunset: { base: '#FF8758', acc: '#ffffff' },
      fill_blue: { base: '#82CBF8', acc: '#ffffff' },
      light_red: { base: '#FFF9F9', acc: '#E86575' },
    }

    // Process each user
    for (const user of activeUsers) {
      try {
        const userPublic = user.toPublic()

        // Check if user should receive monthly summary
        const metadata = user.metadata as any || {}
        const lastMonthlySummary = metadata.lastMonthlySummaryDate ? new Date(metadata.lastMonthlySummaryDate) : null

        if (!shouldShowMonthlySummary(userPublic, lastMonthlySummary)) {
          results.skipped++
          results.details.push({
            userId: user.id,
            email: user.email,
            status: 'skipped',
            reason: 'Too soon since last summary'
          })
          console.log(`⏭️  ${user.email}: Skipped (too soon)`)
          continue
        }

        // Fetch user's logs
        let logs: any[]
        try {
          logs = await Log.findAll({
            where: { userId: user.id },
            order: [['createdAt', 'DESC']],
            limit: 1000
          })
        } catch (logError: any) {
          results.failed++
          results.details.push({
            userId: user.id,
            email: user.email,
            status: 'failed',
            error: `Log query failed: ${logError.message}`
          })
          console.log(`${user.email}: Failed to fetch logs - ${logError.message}`)
          continue
        }

        // Verify near-daily engagement over last 3 months
        const threeMonthsAgoDate = dayjs().subtract(3, 'month')
        const threeMonthLogs = logs.filter((l: any) =>
          dayjs(l.createdAt).isAfter(threeMonthsAgoDate)
        )
        const uniqueActiveDays = new Set(
          threeMonthLogs.map((l: any) => dayjs(l.createdAt).format('YYYY-MM-DD'))
        ).size
        const totalDaysInPeriod = dayjs().diff(threeMonthsAgoDate, 'day')
        const dailyRatio = totalDaysInPeriod > 0 ? uniqueActiveDays / totalDaysInPeriod : 0

        // Require ~everyday login: at least 60% of days active over 3 months
        if (dailyRatio < 0.6) {
          results.skipped++
          results.details.push({
            userId: user.id,
            email: user.email,
            status: 'skipped',
            reason: `Insufficient daily engagement (${Math.round(dailyRatio * 100)}% of days)`
          })
          console.log(`⏭️  ${user.email}: Skipped (${Math.round(dailyRatio * 100)}% daily engagement, need 60%+)`)
          continue
        }

        // Need at least some activity to generate summary
        if (logs.length < 5) {
          results.skipped++
          results.details.push({
            userId: user.id,
            email: user.email,
            status: 'skipped',
            reason: 'Insufficient activity'
          })
          console.log(`⏭️  ${user.email}: Skipped (insufficient activity)`)
          continue
        }

        // Generate monthly summary
        console.log(`Generating summary for ${user.email}...`)
        const summary = await generateMonthlySummary(userPublic, logs.map((l: any) => l.toJSON()))

        // Resolve user theme for email styling
        const userThemeName = metadata.theme || 'light'
        const isCustom = userThemeName === 'custom' && metadata.baseColor && metadata.accentColor
        const themeColors = isCustom
          ? { base: metadata.baseColor, acc: metadata.accentColor }
          : (THEMES[userThemeName] || THEMES.light)

        const emailTheme = {
          baseColor: themeColors.base,
          accentColor: themeColors.acc,
          themeName: userThemeName,
        }

        // Generate HTML email body in User OS style
        const htmlBody = generateMonthlyEmailHtml({
          firstName: user.firstName || '',
          period: summary.period,
          osVersion: summary.osVersion,
          osState: summary.osState,
          presence: summary.presence,
          energy: summary.energy,
          patterns: {
            dominantThemes: summary.patterns.dominantThemes,
            emotionalEvolution: summary.patterns.emotionalEvolution,
            strugglingPeriods: summary.patterns.strugglingPeriods,
            breakthroughMoments: summary.patterns.breakthroughMoments,
            insights: summary.patterns.insights,
          },
          growth: summary.growth,
          memoryStory: summary.memoryStory,
          forwardLook: summary.forwardLook,
          theme: emailTheme,
        })

        // Also generate plain text fallback
        const textBody = generateMonthlyEmailBody(summary, user.firstName || '')

        // Send email with HTML + text fallback
        console.log(`📧 Sending email to ${user.email}...`)
        const result = await sendEmail({
          to: user.email,
          subject: `${summary.period.month} ${summary.period.year} — Your LOT Review`,
          html: htmlBody,
          text: textBody,
        })

        if (result.success) {
          // Update user metadata with last summary date
          await user.set({
            metadata: {
              ...metadata,
              lastMonthlySummaryDate: new Date().toISOString()
            }
          }).save()

          results.sent++
          results.details.push({
            userId: user.id,
            email: user.email,
            status: 'sent',
            messageId: result.messageId
          })
          console.log(`${user.email}: Sent successfully`)
        } else {
          results.failed++
          results.details.push({
            userId: user.id,
            email: user.email,
            status: 'failed',
            error: result.error
          })
          console.log(`${user.email}: Failed - ${result.error}`)
        }

        // Small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error: any) {
        results.failed++
        results.details.push({
          userId: user.id,
          email: user.email,
          status: 'failed',
          error: error.message
        })
        console.log(`${user.email}: Error - ${error.message}`)
      }
    }

    console.log('')
    console.log('━'.repeat(60))
    console.log('MONTHLY EMAIL JOB COMPLETE')
    console.log(`   Sent: ${results.sent}`)
    console.log(`   Skipped: ${results.skipped}`)
    console.log(`   Failed: ${results.failed}`)
    console.log(`   Total: ${results.total}`)
    console.log('━'.repeat(60))
    console.log('')

    // Persist job result to database for audit trail
    try {
      // Find an admin user to associate the log entry with
      const adminUser = await User.findOne({
        where: { tags: { [Op.contains]: ['admin'] } }
      })
      if (adminUser) {
        await Log.create({
          userId: adminUser.id,
          event: 'scheduled_job' as any,
          text: `Monthly email job: ${results.sent} sent, ${results.skipped} skipped, ${results.failed} failed out of ${results.total}`,
          metadata: {
            jobName,
            executedAt,
            ...results
          }
        })
      }
    } catch (persistError: any) {
      console.warn('Failed to persist job result to database:', persistError.message)
    }

    lastMonthlyEmailRun = new Date()
    isMonthlyEmailJobRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: results
    }
  } catch (error: any) {
    console.error('')
    console.error('━'.repeat(60))
    console.error('MONTHLY EMAIL JOB FAILED')
    console.error(`   Error: ${error.message}`)
    console.error('━'.repeat(60))
    console.error('')

    isMonthlyEmailJobRunning = false

    return {
      jobName,
      executedAt,
      success: false,
      error: error.message
    }
  }
}

// ─── Daily QIE Pattern Analytics ─────────────────────────────────────────────

let isDailyQIEJobRunning = false
let lastDailyQIERun: Date | null = null

/**
 * Runs daily at 03:00 UTC.
 * Compiles aggregate Quantum Intent Engine pattern statistics across
 * active users whose signals were synced to the server.
 * Results are logged for system monitoring — no user data is persisted.
 */
function shouldRunDailyQIEJob(): boolean {
  const now = dayjs()
  if (isDailyQIEJobRunning) return false
  if (lastDailyQIERun) {
    const lastRun = dayjs(lastDailyQIERun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return true
}

async function executeDailyQIEJob(): Promise<JobResult> {
  const jobName = 'daily-qie-pattern-analytics'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Daily QIE Pattern Analytics')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isDailyQIEJobRunning = true

  try {
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const oneDayAgo = dayjs().subtract(1, 'day').toDate()
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()

    // Users active in the last 24 hours
    const activeUsers = await User.findAll({
      where: { lastSeenAt: { [Op.gte]: oneDayAgo } },
      order: [['lastSeenAt', 'DESC']],
      limit: 1000,
    })

    console.log(`  Active users (24h): ${activeUsers.length}`)

    // Aggregate quantum intent signals from synced logs
    const qieLogs = await Log.findAll({
      where: {
        event: 'quantum_intent_signal' as any,
        createdAt: { [Op.gte]: sevenDaysAgo },
      },
      order: [['createdAt', 'DESC']],
      limit: 10000,
    })

    // Tally pattern frequencies
    const patternCounts: Record<string, number> = {}
    const sourceCounts: Record<string, number> = {}
    let totalSignals = 0

    for (const log of qieLogs) {
      const meta = (log as any).metadata || {}
      const pattern = meta.pattern as string | undefined
      const source = meta.source as string | undefined
      if (pattern) patternCounts[pattern] = (patternCounts[pattern] || 0) + 1
      if (source) sourceCounts[source] = (sourceCounts[source] || 0) + 1
      totalSignals++
    }

    // Top 5 patterns by frequency
    const topPatterns = Object.entries(patternCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    console.log(`  Total QIE signals (7d): ${totalSignals}`)
    console.log(`  Unique patterns detected: ${Object.keys(patternCounts).length}`)
    console.log('')
    console.log('  Top patterns:')
    topPatterns.forEach(([pattern, count]) => {
      console.log(`    ${pattern}: ${count}`)
    })
    console.log('')
    console.log('  Source distribution:')
    Object.entries(sourceCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([source, count]) => {
        console.log(`    ${source}: ${count}`)
      })

    console.log('')
    console.log('─'.repeat(60))
    console.log('QIE ANALYTICS JOB COMPLETE')
    console.log(`   Signals: ${totalSignals} / Patterns: ${Object.keys(patternCounts).length} / Users: ${activeUsers.length}`)
    console.log('─'.repeat(60))
    console.log('')

    lastDailyQIERun = new Date()
    isDailyQIEJobRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: { totalSignals, patternCount: Object.keys(patternCounts).length, activeUsers: activeUsers.length, topPatterns }
    }
  } catch (error: any) {
    console.error('Daily QIE analytics job failed:', error.message)
    isDailyQIEJobRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Weekly Physiological Cohort Digest ──────────────────────────────────────

let isWeeklyCohortJobRunning = false
let lastWeeklyCohortRun: Date | null = null

/**
 * Runs on Mondays at 6 AM UTC.
 * Analyzes energy state and cohort signals for active users
 * and persists physiological classification to user metadata.
 */
function shouldRunWeeklyCohortJob(): boolean {
  const now = dayjs()
  const dayOfWeek = now.day() // 0 = Sunday, 1 = Monday

  if (dayOfWeek !== 1) return false
  if (isWeeklyCohortJobRunning) return false

  if (lastWeeklyCohortRun) {
    const lastRun = dayjs(lastWeeklyCohortRun)
    if (lastRun.isSame(now, 'day')) return false
  }

  return true
}

async function executeWeeklyCohortJob(): Promise<JobResult> {
  const jobName = 'weekly-physiological-cohort-digest'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Weekly Physiological Cohort Digest')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isWeeklyCohortJobRunning = true

  try {
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { analyzeEnergyState } = await import('#server/utils/energy.js')
    const { determineUserCohort } = await import('#server/utils/memory/cohort-determination.js')
    const { extractUserTraits } = await import('#server/utils/memory/trait-extraction.js')
    const { Op } = await import('sequelize')

    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()
    const thirtyDaysAgo = dayjs().subtract(30, 'day').toDate()

    const activeUsers = await User.findAll({
      where: {
        lastSeenAt: { [Op.gte]: sevenDaysAgo },
      },
      order: [['lastSeenAt', 'DESC']],
      limit: 500,
    })

    console.log(`Processing ${activeUsers.length} active users...`)

    const results = { total: activeUsers.length, processed: 0, skipped: 0, failed: 0 }

    for (const user of activeUsers) {
      try {
        const logs = await Log.findAll({
          where: {
            userId: user.id,
            createdAt: { [Op.gte]: thirtyDaysAgo },
          },
          order: [['createdAt', 'DESC']],
          limit: 200,
        })

        if (logs.length < 3) {
          results.skipped++
          continue
        }

        const logData = logs.map((l: any) => l.toJSON())
        const energyState = analyzeEnergyState(logData)

        // Extract traits and determine cohort
        const traitResult = extractUserTraits(logData)
        const cohort = determineUserCohort(
          traitResult.traits,
          traitResult.patterns,
          traitResult.psychologicalDepth
        )

        // Persist to user metadata
        const metadata = (user as any).metadata as any || {}
        await (user as any).set({
          metadata: {
            ...metadata,
            physiologicalCohort: {
              archetype: cohort.archetype,
              behavioralCohort: cohort.behavioralCohort,
              description: cohort.description,
              energyStatus: energyState.status,
              energyTrajectory: energyState.trajectory,
              computedAt: new Date().toISOString(),
            },
          }
        }).save()

        results.processed++
        console.log(`  ${user.email}: ${cohort.archetype} / ${cohort.behavioralCohort} / ATP ${energyState.currentLevel}%`)
      } catch (err: any) {
        results.failed++
        console.warn(`  ${(user as any).email}: failed — ${err.message}`)
      }
    }

    console.log('')
    console.log('─'.repeat(60))
    console.log('COHORT JOB COMPLETE')
    console.log(`   Processed: ${results.processed} / Skipped: ${results.skipped} / Failed: ${results.failed}`)
    console.log('─'.repeat(60))
    console.log('')

    lastWeeklyCohortRun = new Date()
    isWeeklyCohortJobRunning = false

    return { jobName, executedAt, success: true, result: results }
  } catch (error: any) {
    console.error('Weekly cohort job failed:', error.message)
    isWeeklyCohortJobRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Weekly QOS State Digest ──────────────────────────────────────────────────

let isWeeklyQOSJobRunning = false
let lastWeeklyQOSRun: Date | null = null

/**
 * Runs on Wednesdays at 4 AM UTC.
 * Computes each active user's Quantum OS version (derived from assembly progress,
 * physiological cohort, and QIE index) and logs a system summary.
 * No user data is persisted — summary is for system monitoring only.
 */
function shouldRunWeeklyQOSJob(): boolean {
  const now = dayjs()
  const dayOfWeek = now.day() // 0 = Sunday, 3 = Wednesday

  if (dayOfWeek !== 3) return false
  if (isWeeklyQOSJobRunning) return false

  if (lastWeeklyQOSRun) {
    const lastRun = dayjs(lastWeeklyQOSRun)
    if (lastRun.isSame(now, 'day')) return false
  }

  return true
}

async function executeWeeklyQOSJob(): Promise<JobResult> {
  const jobName = 'weekly-qos-state-digest'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Weekly QOS State Digest')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isWeeklyQOSJobRunning = true

  try {
    const { User } = await import('#server/models/user.js')
    const { Op } = await import('sequelize')

    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()
    const activeUsers = await User.findAll({
      where: { lastSeenAt: { [Op.gte]: sevenDaysAgo } },
      order: [['lastSeenAt', 'DESC']],
      limit: 500,
    })

    console.log(`  Active users (7d): ${activeUsers.length}`)

    // Compute QOS version distribution from metadata
    const versionBuckets: Record<string, number> = {}
    const archetypeCounts: Record<string, number> = {}
    let usersWithCohort = 0
    let usersWithoutCohort = 0

    for (const user of activeUsers) {
      const metadata = (user as any).metadata as any || {}
      const pc = metadata.physiologicalCohort

      if (pc?.archetype) {
        archetypeCounts[pc.archetype] = (archetypeCounts[pc.archetype] || 0) + 1
        usersWithCohort++

        // Derive QOS version from energy + archetype availability
        const energyStatus = pc.energyStatus || 'unknown'
        const ver = energyStatus === 'optimal' ? 'v2' : energyStatus === 'moderate' ? 'v1' : 'v0'
        versionBuckets[ver] = (versionBuckets[ver] || 0) + 1
      } else {
        usersWithoutCohort++
        versionBuckets['v0'] = (versionBuckets['v0'] || 0) + 1
      }
    }

    console.log('')
    console.log('  QOS Version Distribution:')
    Object.entries(versionBuckets).sort().forEach(([ver, count]) => {
      console.log(`    ${ver}: ${count} users`)
    })

    console.log('')
    console.log('  Archetype Distribution (top 5):')
    Object.entries(archetypeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .forEach(([arch, count]) => {
        console.log(`    ${arch}: ${count}`)
      })

    console.log('')
    console.log(`  Cohort-resolved: ${usersWithCohort} / Pending: ${usersWithoutCohort}`)
    console.log('')
    console.log('─'.repeat(60))
    console.log('QOS DIGEST COMPLETE')
    console.log(`   Total: ${activeUsers.length} / Resolved: ${usersWithCohort}`)
    console.log('─'.repeat(60))
    console.log('')

    lastWeeklyQOSRun = new Date()
    isWeeklyQOSJobRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: { total: activeUsers.length, usersWithCohort, usersWithoutCohort, versionBuckets, archetypeCounts }
    }
  } catch (error: any) {
    console.error('Weekly QOS digest failed:', error.message)
    isWeeklyQOSJobRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Daily Intention Audit ────────────────────────────────────────────────────

let isDailyIntentionAuditRunning = false
let lastDailyIntentionAuditRun: Date | null = null

/**
 * Runs daily at 06:00 UTC.
 * Audits intention follow-through: users with active intention signals
 * but no planner/goal execution in 48h receive an intention_decay log entry.
 * Surfaced in the log UI as INTENT-DECAY: — terse field notice, not a notification.
 */
function shouldRunDailyIntentionAudit(): boolean {
  const now = dayjs()
  if (isDailyIntentionAuditRunning) return false
  if (lastDailyIntentionAuditRun) {
    const lastRun = dayjs(lastDailyIntentionAuditRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return true
}

async function executeDailyIntentionAudit(): Promise<JobResult> {
  const jobName = 'daily-intention-audit'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Daily Intention Audit')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isDailyIntentionAuditRunning = true

  try {
    const { Log } = await import('#server/models/log.js')

    // Find users with recent intention signals (7d) but no execution (48h)
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()
    const fortyEightHoursAgo = dayjs().subtract(48, 'hour').toDate()

    const intentionLogs = await Log.findAll({
      where: {
        event: 'intention',
        createdAt: { $gte: sevenDaysAgo } as any,
      },
      attributes: ['userId', 'createdAt'],
    })

    const executionLogs = await Log.findAll({
      where: {
        event: ['plan_set', 'goal_updated', 'goal_complete'],
        createdAt: { $gte: fortyEightHoursAgo } as any,
      },
      attributes: ['userId'],
    })

    const usersWithIntention = new Set(intentionLogs.map((l: any) => l.userId))
    const usersWithExecution = new Set(executionLogs.map((l: any) => l.userId))

    let decayCount = 0
    for (const userId of Array.from(usersWithIntention)) {
      if (!usersWithExecution.has(userId)) {
        // Log intention_decay notice — surfaced in log UI as INTENT-DECAY:
        await Log.create({
          userId,
          event: 'intention_decay_notice',
          text: 'Intention set. No execution signal in 48h.',
          metadata: {
            auditAt: executedAt,
            executionWindow: '48h',
            note: 'Intention without action becomes drift. One step closes the loop.',
          },
        })
        decayCount++
      }
    }

    console.log(`  Users with active intention: ${usersWithIntention.size}`)
    console.log(`  Users with 48h execution:    ${usersWithExecution.size}`)
    console.log(`  Intention-decay notices:     ${decayCount}`)
    console.log('')
    console.log('─'.repeat(60))
    console.log('INTENTION AUDIT COMPLETE')
    console.log(`   Decay: ${decayCount} / Active: ${usersWithIntention.size}`)
    console.log('─'.repeat(60))
    console.log('')

    lastDailyIntentionAuditRun = new Date()
    isDailyIntentionAuditRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: { intentionUsers: usersWithIntention.size, executionUsers: usersWithExecution.size, decayCount }
    }
  } catch (error: any) {
    console.error('Daily intention audit failed:', error.message)
    isDailyIntentionAuditRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

/**
 * Check and run scheduled jobs
 * Called periodically by the scheduler
 */
export async function checkAndRunScheduledJobs(): Promise<void> {
  // Check monthly email job
  if (shouldRunMonthlyEmailJob()) {
    await executeMonthlyEmailJob()
  }

  // Check weekly cohort digest
  if (shouldRunWeeklyCohortJob()) {
    await executeWeeklyCohortJob()
  }

  // Check weekly QOS state digest
  if (shouldRunWeeklyQOSJob()) {
    await executeWeeklyQOSJob()
  }

  // Check daily QIE analytics
  if (shouldRunDailyQIEJob()) {
    await executeDailyQIEJob()
  }

  // Check daily intention audit (06:00 UTC)
  if (shouldRunDailyIntentionAudit()) {
    await executeDailyIntentionAudit()
  }

  // Check daily OS snapshot (00:00 UTC midnight)
  if (shouldRunDailyOSSnapshotJob()) {
    await executeDailyOSSnapshotJob()
  }

  // Check weekly intention completion audit (Sunday 20:00 UTC)
  if (shouldRunWeeklyIntentionCompletionJob()) {
    await executeWeeklyIntentionCompletionJob()
  }

  // Check morning biofield summary (08:00 UTC daily)
  if (shouldRunMorningBiofieldJob()) {
    await executeMorningBiofieldJob()
  }

  // Check daily pattern coverage audit (23:00 UTC daily)
  if (shouldRunDailyPatternCoverageJob()) {
    await executeDailyPatternCoverageJob()
  }

  // Check weekly archetype stability monitor (Thursday 05:00 UTC)
  if (shouldRunWeeklyArchetypeStabilityJob()) {
    await executeWeeklyArchetypeStabilityJob()
  }

  // Check daily source diversity pulse (07:00 UTC daily)
  if (shouldRunDailySourceDiversityJob()) {
    await executeDailySourceDiversityJob()
  }

  // Check daily archetype shift monitor (10:00 UTC daily)
  if (shouldRunDailyArchetypeShiftJob()) {
    await executeDailyArchetypeShiftJob()
  }

  // Check daily QOS signature pulse (13:00 UTC daily)
  if (shouldRunDailyQOSSignaturePulse()) {
    await executeDailyQOSSignaturePulse()
  }

  // Check daily coherence index pulse (16:00 UTC daily)
  if (shouldRunDailyCoherenceIndexJob()) {
    await executeDailyCoherenceIndexJob()
  }

  // Check weekly QOS convergence audit (Sunday 15:00 UTC)
  if (shouldRunWeeklyQOSConvergenceJob()) {
    await executeWeeklyQOSConvergenceAudit()
  }

  // Check weekly badge progress scan (Tuesday 09:00 UTC)
  if (shouldRunWeeklyBadgeScanJob()) {
    await executeWeeklyBadgeScan()
  }

  // Check daily morning intention launch (11:00 UTC daily)
  if (shouldRunDailyMorningIntentionLaunch()) {
    await executeDailyMorningIntentionLaunch()
  }
  if (shouldRunDailyEveningCoherenceClose()) {
    await executeDailyEveningCoherenceClose()
  }
  // Check daily signal momentum check (20:00 UTC daily) — Job 19
  if (shouldRunDailySignalMomentumCheck()) {
    await executeDailySignalMomentumCheck()
  }
}

// ─── Daily OS Snapshot ───────────────────────────────────────────────────────

let isDailyOSSnapshotRunning = false
let lastDailyOSSnapshotRun: Date | null = null

function shouldRunDailyOSSnapshotJob(): boolean {
  const now = dayjs()
  if (isDailyOSSnapshotRunning) return false
  if (lastDailyOSSnapshotRun) {
    const lastRun = dayjs(lastDailyOSSnapshotRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return true
}

async function executeDailyOSSnapshotJob(): Promise<JobResult> {
  const jobName = 'daily-os-snapshot'
  const executedAt = new Date().toISOString()
  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Daily OS Snapshot')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')
  isDailyOSSnapshotRunning = true
  try {
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')
    const oneDayAgo = dayjs().subtract(1, 'day').toDate()
    const activeUsers = await User.findAll({
      where: { lastSeenAt: { [Op.gte]: oneDayAgo } },
      order: [['lastSeenAt', 'DESC']],
      limit: 2000,
    })
    console.log(`  Active users (24h): ${activeUsers.length}`)
    let created = 0
    let failed = 0
    for (const user of activeUsers) {
      try {
        const metadata = (user as any).metadata as any || {}
        const snapshotMeta: Record<string, any> = {}
        if (metadata.theme) snapshotMeta.theme = { theme: metadata.theme }
        if (metadata.sound) snapshotMeta.sound = metadata.sound
        await Log.create({
          userId: (user as any).id,
          event: 'system_snapshot' as any,
          text: `OS midnight snapshot — ${dayjs().format('YYYY-MM-DD')}`,
          metadata: snapshotMeta,
          context: {},
        })
        created++
      } catch (err: any) {
        failed++
      }
    }
    console.log('')
    console.log('─'.repeat(60))
    console.log('OS SNAPSHOT JOB COMPLETE')
    console.log(`   Created: ${created} / Failed: ${failed} / Total: ${activeUsers.length}`)
    console.log('─'.repeat(60))
    console.log('')
    lastDailyOSSnapshotRun = new Date()
    isDailyOSSnapshotRunning = false
    return { jobName, executedAt, success: true, result: { created, failed, total: activeUsers.length } }
  } catch (error: any) {
    console.error('Daily OS snapshot job failed:', error.message)
    isDailyOSSnapshotRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Weekly Intention Completion Audit ──────────────────────────────────────

let isWeeklyIntentionCompletionRunning = false
let lastWeeklyIntentionCompletionRun: Date | null = null

/**
 * Runs on Sundays at 20:00 UTC.
 * For each active user, scans intention_set log events from the past 7 days.
 * Cross-references with plan_set or self_care_complete events within +7 days.
 * Computes a completion rate and logs an aggregate system summary.
 * No individual data is persisted — system monitoring only.
 */
function shouldRunWeeklyIntentionCompletionJob(): boolean {
  const now = dayjs()
  const dayOfWeek = now.day() // 0 = Sunday
  if (dayOfWeek !== 0) return false
  if (isWeeklyIntentionCompletionRunning) return false
  if (lastWeeklyIntentionCompletionRun) {
    const lastRun = dayjs(lastWeeklyIntentionCompletionRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return true
}

async function executeWeeklyIntentionCompletionJob(): Promise<JobResult> {
  const jobName = 'weekly-intention-completion-audit'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Weekly Intention Completion Audit')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isWeeklyIntentionCompletionRunning = true

  try {
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const fourteenDaysAgo = dayjs().subtract(14, 'day').toDate()
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()

    const activeUsers = await User.findAll({
      where: { lastSeenAt: { [Op.gte]: sevenDaysAgo } },
      order: [['lastSeenAt', 'DESC']],
      limit: 500,
    })

    console.log(`  Active users (7d): ${activeUsers.length}`)

    let totalIntentions = 0
    let completedArcs = 0 // intention followed by plan + care within 7 days
    let partialArcs = 0   // intention followed by either plan or care
    let openArcs = 0      // intention with no follow-through yet

    for (const user of activeUsers) {
      try {
        const logs = await Log.findAll({
          where: {
            userId: (user as any).id,
            createdAt: { [Op.gte]: fourteenDaysAgo },
            event: { [Op.in]: ['intention', 'plan_set', 'self_care_complete', 'self_care_completed'] as any[] }
          },
          order: [['createdAt', 'ASC']],
        })

        const intentionLogs = logs.filter((l: any) => l.event === 'intention')
        const planLogs = logs.filter((l: any) => l.event === 'plan_set')
        const careLogs = logs.filter((l: any) =>
          l.event === 'self_care_complete' || l.event === 'self_care_completed'
        )

        for (const iLog of intentionLogs) {
          totalIntentions++
          const intentionTime = new Date(iLog.createdAt).getTime()
          const sevenDaysMs = 7 * 24 * 60 * 60 * 1000

          const hasPlan = planLogs.some((p: any) => {
            const pt = new Date(p.createdAt).getTime()
            return pt > intentionTime && pt < intentionTime + sevenDaysMs
          })
          const hasCare = careLogs.some((c: any) => {
            const ct = new Date(c.createdAt).getTime()
            return ct > intentionTime && ct < intentionTime + sevenDaysMs
          })

          if (hasPlan && hasCare) completedArcs++
          else if (hasPlan || hasCare) partialArcs++
          else openArcs++
        }
      } catch { /* skip user */ }
    }

    const completionRate = totalIntentions > 0
      ? Math.round((completedArcs / totalIntentions) * 100)
      : 0

    console.log(`  Total intentions (14d): ${totalIntentions}`)
    console.log(`  Completed arcs (intent→plan+care): ${completedArcs} (${completionRate}%)`)
    console.log(`  Partial arcs: ${partialArcs}`)
    console.log(`  Open arcs: ${openArcs}`)
    console.log('')
    console.log('─'.repeat(60))
    console.log('INTENTION COMPLETION AUDIT COMPLETE')
    console.log(`   Completion rate: ${completionRate}% · ${completedArcs}/${totalIntentions} full arcs`)
    console.log('─'.repeat(60))
    console.log('')

    lastWeeklyIntentionCompletionRun = new Date()
    isWeeklyIntentionCompletionRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: { totalIntentions, completedArcs, partialArcs, openArcs, completionRate }
    }
  } catch (error: any) {
    console.error('Weekly intention completion audit failed:', error.message)
    isWeeklyIntentionCompletionRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Daily Morning Biofield Summary ──────────────────────────────────────────

let isMorningBiofieldRunning = false
let lastMorningBiofieldRun: Date | null = null

function shouldRunMorningBiofieldJob(): boolean {
  const now = dayjs()
  if (isMorningBiofieldRunning) return false
  if (lastMorningBiofieldRun) {
    const lastRun = dayjs(lastMorningBiofieldRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return true
}

async function executeMorningBiofieldJob(): Promise<JobResult> {
  const jobName = 'morning-biofield-summary'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Morning Biofield Summary')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isMorningBiofieldRunning = true

  try {
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const oneDayAgo = dayjs().subtract(1, 'day').toDate()
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()

    const activeUsers = await User.findAll({
      where: { lastSeenAt: { [Op.gte]: sevenDaysAgo } },
      order: [['lastSeenAt', 'DESC']],
      limit: 500,
    })

    console.log(`  Active users (7d): ${activeUsers.length}`)

    let depletedCount = 0
    let stableCount = 0
    let recoveredCount = 0

    for (const user of activeUsers) {
      try {
        const overnightLogs = await Log.findAll({
          where: {
            userId: (user as any).id,
            createdAt: { [Op.gte]: oneDayAgo },
            event: { [Op.in]: ['mood_checkin', 'energy_checkin', 'emotional_checkin'] as any[] }
          },
          order: [['createdAt', 'ASC']],
        })

        if (overnightLogs.length === 0) continue

        const lowEnergySignals = overnightLogs.filter((l: any) => {
          const m = l.metadata as any || {}
          const energy = m.energy || m.energyLevel || m.value
          return typeof energy === 'number' ? energy <= 3 : energy === 'low' || energy === 'depleted'
        })

        const ratio = lowEnergySignals.length / overnightLogs.length

        if (ratio >= 0.6) depletedCount++
        else if (ratio <= 0.2) recoveredCount++
        else stableCount++
      } catch { /* skip user */ }
    }

    console.log(`  Overnight depletion scan:`)
    console.log(`    Depleted (60%+ low signals): ${depletedCount}`)
    console.log(`    Stable: ${stableCount}`)
    console.log(`    Recovered: ${recoveredCount}`)
    console.log('')
    console.log('─'.repeat(60))
    console.log('MORNING BIOFIELD SUMMARY COMPLETE')
    console.log('─'.repeat(60))
    console.log('')

    lastMorningBiofieldRun = new Date()
    isMorningBiofieldRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: { scanned: activeUsers.length, depletedCount, stableCount, recoveredCount }
    }
  } catch (error: any) {
    console.error('Morning biofield job failed:', error.message)
    isMorningBiofieldRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Daily Pattern Coverage Audit ────────────────────────────────────────────

let isDailyPatternCoverageRunning = false
let lastDailyPatternCoverageRun: Date | null = null

function shouldRunDailyPatternCoverageJob(): boolean {
  const now = dayjs()
  if (now.hour() !== 23) return false
  if (isDailyPatternCoverageRunning) return false
  if (lastDailyPatternCoverageRun) {
    const lastRun = dayjs(lastDailyPatternCoverageRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return true
}

/**
 * Runs daily at 23:00 UTC.
 * Scans QIE pattern signals fired in the last 24h across all active users.
 * Reports: top patterns, coverage rate (% of users with at least one pattern),
 * and dormant patterns (none fired in 7 days — product signal for tuning).
 * No individual data persisted — system observability only.
 */
async function executeDailyPatternCoverageJob(): Promise<JobResult> {
  const jobName = 'daily-pattern-coverage-audit'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Daily Pattern Coverage Audit')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isDailyPatternCoverageRunning = true

  try {
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const oneDayAgo = dayjs().subtract(1, 'day').toDate()
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()

    const activeUsers = await User.findAll({
      where: { lastSeenAt: { [Op.gte]: oneDayAgo } },
      order: [['lastSeenAt', 'DESC']],
      limit: 1000,
    })

    console.log(`  Active users (24h): ${activeUsers.length}`)

    // Count pattern firings from quantum_intent_signal events
    const patternCounts: Record<string, number> = {}
    const userPatternSets: Record<string, Set<string>> = {}
    let usersWithPatterns = 0

    for (const user of activeUsers) {
      try {
        const userId = (user as any).id
        const qieLogs = await Log.findAll({
          where: {
            userId,
            createdAt: { [Op.gte]: oneDayAgo },
            event: 'quantum_intent_signal' as any,
          },
        })

        const userPatterns = new Set<string>()
        for (const log of qieLogs) {
          const patternName = (log.metadata as any)?.pattern
          if (patternName) {
            patternCounts[patternName] = (patternCounts[patternName] ?? 0) + 1
            userPatterns.add(patternName)
          }
        }

        if (userPatterns.size > 0) {
          usersWithPatterns++
          userPatternSets[userId] = userPatterns
        }
      } catch { /* skip user */ }
    }

    const coverageRate = activeUsers.length > 0
      ? Math.round((usersWithPatterns / activeUsers.length) * 100)
      : 0

    const topPatterns = Object.entries(patternCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    console.log(`  Users with active patterns: ${usersWithPatterns}/${activeUsers.length} (${coverageRate}%)`)
    console.log(`  Top patterns (24h):`)
    topPatterns.forEach(([name, count]) => {
      console.log(`    ${name}: ${count} firings`)
    })

    // Dormant pattern check — patterns with no firings in 7 days
    const sevenDayLogs = await Log.findAll({
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo },
        event: 'quantum_intent_signal' as any,
      },
    })
    const activePatternNames = new Set(
      sevenDayLogs.map((l: any) => (l.metadata as any)?.pattern).filter(Boolean)
    )

    console.log(`  Patterns active in last 7d: ${activePatternNames.size}`)
    console.log('')
    console.log('─'.repeat(60))
    console.log('PATTERN COVERAGE AUDIT COMPLETE')
    console.log(`   Coverage: ${coverageRate}% · Top: ${topPatterns[0]?.[0] ?? 'none'} (${topPatterns[0]?.[1] ?? 0})`)
    console.log('─'.repeat(60))
    console.log('')

    lastDailyPatternCoverageRun = new Date()
    isDailyPatternCoverageRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: {
        scanned: activeUsers.length,
        usersWithPatterns,
        coverageRate,
        topPatterns: topPatterns.map(([name, count]) => ({ name, count })),
        activePatternsSevenDays: activePatternNames.size,
      }
    }
  } catch (error: any) {
    console.error('Daily pattern coverage audit failed:', error.message)
    isDailyPatternCoverageRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Weekly Archetype Stability Monitor ─────────────────────────────────────

let isWeeklyArchetypeStabilityRunning = false
let lastWeeklyArchetypeStabilityRun: Date | null = null

/**
 * Runs on Thursdays at 05:00 UTC.
 * Compares each active user's cohort determinations across the last 2 weeks.
 * Computes archetype stability index (% week-over-week archetype match) and
 * logs aggregate distribution. No individual data persisted — system telemetry only.
 */
function shouldRunWeeklyArchetypeStabilityJob(): boolean {
  const now = dayjs()
  const dayOfWeek = now.day() // 4 = Thursday
  if (dayOfWeek !== 4) return false
  if (now.hour() !== 5) return false
  if (isWeeklyArchetypeStabilityRunning) return false
  if (lastWeeklyArchetypeStabilityRun) {
    const lastRun = dayjs(lastWeeklyArchetypeStabilityRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return true
}

async function executeWeeklyArchetypeStabilityJob(): Promise<JobResult> {
  const jobName = 'weekly-archetype-stability-monitor'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Weekly Archetype Stability Monitor')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isWeeklyArchetypeStabilityRunning = true

  try {
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const fourteenDaysAgo = dayjs().subtract(14, 'day').toDate()
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()

    const activeUsers = await User.findAll({
      where: { lastSeenAt: { [Op.gte]: sevenDaysAgo } },
      order: [['lastSeenAt', 'DESC']],
      limit: 1000,
    })

    console.log(`  Active users (7d): ${activeUsers.length}`)

    const archetypeCounts: Record<string, number> = {}
    let stableUsers = 0       // same archetype both weeks
    let shiftedUsers = 0      // different archetype week-over-week
    let singleWeekUsers = 0   // only one week of data

    for (const user of activeUsers) {
      try {
        const cohortLogs = await Log.findAll({
          where: {
            userId: (user as any).id,
            createdAt: { [Op.gte]: fourteenDaysAgo },
            event: 'physiological_cohort' as any,
          },
          order: [['createdAt', 'DESC']],
        })

        if (cohortLogs.length === 0) continue

        const priorWeekLogs = cohortLogs.filter(
          (l: any) => new Date(l.createdAt) < sevenDaysAgo
        )
        const currentWeekLogs = cohortLogs.filter(
          (l: any) => new Date(l.createdAt) >= sevenDaysAgo
        )

        // Track dominant archetype this week
        const currentArchetype = (currentWeekLogs[0]?.metadata as any)?.archetype
        if (currentArchetype) {
          archetypeCounts[currentArchetype] = (archetypeCounts[currentArchetype] ?? 0) + 1
        }

        if (priorWeekLogs.length === 0 || currentWeekLogs.length === 0) {
          singleWeekUsers++
          continue
        }

        const priorArchetype = (priorWeekLogs[0]?.metadata as any)?.archetype
        if (priorArchetype && currentArchetype) {
          if (priorArchetype === currentArchetype) stableUsers++
          else shiftedUsers++
        }
      } catch { /* skip user */ }
    }

    const compared = stableUsers + shiftedUsers
    const stabilityRate = compared > 0
      ? Math.round((stableUsers / compared) * 100)
      : 0

    const topArchetypes = Object.entries(archetypeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    console.log(`  Archetype stability (week-over-week):`)
    console.log(`    Stable: ${stableUsers} · Shifted: ${shiftedUsers} · Single-week: ${singleWeekUsers}`)
    console.log(`    Stability rate: ${stabilityRate}%`)
    console.log(`  Top archetypes this week:`)
    topArchetypes.forEach(([name, count]) => {
      console.log(`    ${name}: ${count} users`)
    })
    console.log('')
    console.log('─'.repeat(60))
    console.log('ARCHETYPE STABILITY MONITOR COMPLETE')
    console.log(`   Stability: ${stabilityRate}% · Top: ${topArchetypes[0]?.[0] ?? 'none'}`)
    console.log('─'.repeat(60))
    console.log('')

    lastWeeklyArchetypeStabilityRun = new Date()
    isWeeklyArchetypeStabilityRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: {
        scanned: activeUsers.length,
        stableUsers,
        shiftedUsers,
        singleWeekUsers,
        stabilityRate,
        topArchetypes: topArchetypes.map(([name, count]) => ({ name, count })),
      }
    }
  } catch (error: any) {
    console.error('Weekly archetype stability job failed:', error.message)
    isWeeklyArchetypeStabilityRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Daily Source Diversity Pulse ───────────────────────────────────────────

let isDailySourceDiversityRunning = false
let lastDailySourceDiversityRun: Date | null = null

function shouldRunDailySourceDiversityJob(): boolean {
  const now = dayjs()
  if (now.hour() !== 7) return false
  if (isDailySourceDiversityRunning) return false
  if (lastDailySourceDiversityRun) {
    const lastRun = dayjs(lastDailySourceDiversityRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return true
}

/**
 * Runs daily at 07:00 UTC.
 * Measures how many distinct signal sources each active user generated in the last 24h.
 * Computes system-wide source diversity: unique sources / total possible (11).
 * Logs a source_diversity_pulse event for system monitoring.
 * No individual data exposed — aggregate telemetry only.
 */
async function executeDailySourceDiversityJob(): Promise<JobResult> {
  const jobName = 'daily-source-diversity-pulse'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Daily Source Diversity Pulse')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isDailySourceDiversityRunning = true

  try {
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const oneDayAgo = dayjs().subtract(1, 'day').toDate()
    const TOTAL_POSSIBLE_SOURCES = 11  // matches LOG_DEPENDENCY_SOURCES count

    const activeUsers = await User.findAll({
      where: { lastSeenAt: { [Op.gte]: oneDayAgo } },
      order: [['lastSeenAt', 'DESC']],
      limit: 1000,
    })

    console.log(`  Active users (24h): ${activeUsers.length}`)

    const diversityBuckets: Record<number, number> = {}
    let totalDiversityScore = 0
    let usersWithSignals = 0
    const globalSourceCounts: Record<string, number> = {}

    for (const user of activeUsers) {
      try {
        const userId = (user as any).id
        const userLogs = await Log.findAll({
          where: { userId, createdAt: { [Op.gte]: oneDayAgo } },
          attributes: ['event', 'metadata'],
        })

        const sources = new Set<string>()
        for (const log of userLogs) {
          const src = (log.metadata as any)?.source || (log as any).event
          if (src) {
            sources.add(src)
            globalSourceCounts[src] = (globalSourceCounts[src] ?? 0) + 1
          }
        }

        if (sources.size > 0) {
          usersWithSignals++
          diversityBuckets[sources.size] = (diversityBuckets[sources.size] ?? 0) + 1
          totalDiversityScore += sources.size / TOTAL_POSSIBLE_SOURCES
        }
      } catch { /* skip user */ }
    }

    const avgDiversityScore = usersWithSignals > 0
      ? totalDiversityScore / usersWithSignals
      : 0
    const uniqueSources = Object.keys(globalSourceCounts).length

    console.log(`  Users with signals: ${usersWithSignals}/${activeUsers.length}`)
    console.log(`  Avg diversity score: ${(avgDiversityScore * 100).toFixed(1)}%`)
    console.log(`  Unique source types observed: ${uniqueSources}/${TOTAL_POSSIBLE_SOURCES}`)
    console.log('')
    console.log('─'.repeat(60))
    console.log('SOURCE DIVERSITY PULSE COMPLETE')
    console.log(`   Diversity: ${(avgDiversityScore * 100).toFixed(1)}% · Sources: ${uniqueSources}/${TOTAL_POSSIBLE_SOURCES}`)
    console.log('─'.repeat(60))
    console.log('')

    lastDailySourceDiversityRun = new Date()
    isDailySourceDiversityRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: {
        scanned: activeUsers.length,
        usersWithSignals,
        avgDiversityScore: Math.round(avgDiversityScore * 100),
        uniqueSources,
        totalPossible: TOTAL_POSSIBLE_SOURCES,
      }
    }
  } catch (error: any) {
    console.error('Daily source diversity job failed:', error.message)
    isDailySourceDiversityRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Daily Archetype Shift Monitor ──────────────────────────────────────────

let isDailyArchetypeShiftRunning = false
let lastDailyArchetypeShiftRun: Date | null = null

function shouldRunDailyArchetypeShiftJob(): boolean {
  const now = dayjs()
  if (now.hour() !== 10) return false
  if (isDailyArchetypeShiftRunning) return false
  if (lastDailyArchetypeShiftRun) {
    const lastRun = dayjs(lastDailyArchetypeShiftRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return true
}

/**
 * Runs daily at 10:00 UTC.
 * For each active user, compares the most recent physiological_cohort log
 * against the previous one. If archetype changed, writes an archetype_shift event.
 * Surfaces archetype transitions in the operator field log via ARCH-SHIFT: handler.
 */
async function executeDailyArchetypeShiftJob(): Promise<JobResult> {
  const jobName = 'daily-archetype-shift-monitor'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Daily Archetype Shift Monitor')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isDailyArchetypeShiftRunning = true

  try {
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const oneDayAgo = dayjs().subtract(1, 'day').toDate()
    const twoDaysAgo = dayjs().subtract(2, 'day').toDate()

    const activeUsers = await User.findAll({
      where: { lastSeenAt: { [Op.gte]: oneDayAgo } },
      order: [['lastSeenAt', 'DESC']],
      limit: 1000,
    })

    console.log(`  Active users (24h): ${activeUsers.length}`)

    let shiftsDetected = 0
    let usersChecked = 0

    for (const user of activeUsers) {
      try {
        const userId = (user as any).id

        // Fetch last 2 physiological_cohort logs for this user
        const cohortLogs = await Log.findAll({
          where: {
            userId,
            event: 'physiological_cohort' as any,
            createdAt: { [Op.gte]: twoDaysAgo },
          },
          order: [['createdAt', 'DESC']],
          limit: 2,
        })

        if (cohortLogs.length < 2) continue

        usersChecked++
        const recent = cohortLogs[0] as any
        const prior = cohortLogs[1] as any

        const recentArchetype = recent.metadata?.archetype
        const priorArchetype = prior.metadata?.archetype

        if (!recentArchetype || !priorArchetype) continue
        if (recentArchetype === priorArchetype) continue

        // Archetype changed — record the shift
        shiftsDetected++

        const stabilityRate = dayjs(recent.createdAt).diff(dayjs(prior.createdAt), 'hour') > 12
          ? 0.6 : 0.3  // Longer hold = higher stability on new archetype

        await Log.create({
          userId,
          event: 'archetype_shift' as any,
          text: '',
          metadata: {
            fromArchetype: priorArchetype,
            toArchetype: recentArchetype,
            stabilityRate,
          },
        } as any)

        console.log(`  [${userId}] ARCH-SHIFT: ${priorArchetype} → ${recentArchetype}`)
      } catch (userErr: any) {
        console.warn(`  User ${(user as any).id} archetype shift check failed: ${userErr.message}`)
      }
    }

    console.log('')
    console.log(`  Users checked (2 cohort logs): ${usersChecked}/${activeUsers.length}`)
    console.log(`  Archetype shifts detected: ${shiftsDetected}`)
    console.log('')
    console.log('─'.repeat(60))
    console.log('ARCHETYPE SHIFT MONITOR COMPLETE')
    console.log(`   Shifts: ${shiftsDetected} · Checked: ${usersChecked}`)
    console.log('─'.repeat(60))
    console.log('')

    lastDailyArchetypeShiftRun = new Date()
    isDailyArchetypeShiftRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: { scanned: activeUsers.length, usersChecked, shiftsDetected },
    }
  } catch (error: any) {
    console.error('Daily archetype shift monitor failed:', error.message)
    isDailyArchetypeShiftRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Daily QOS Signature Pulse ───────────────────────────────────────────────

let isDailyQOSSignatureRunning = false
let lastDailyQOSSignatureRun: Date | null = null

function shouldRunDailyQOSSignaturePulse(): boolean {
  const now = dayjs()
  if (now.hour() !== 13) return false
  if (isDailyQOSSignatureRunning) return false
  if (lastDailyQOSSignatureRun) {
    const lastRun = dayjs(lastDailyQOSSignatureRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return true
}

/**
 * Runs daily at 13:00 UTC.
 * Reads each active user's recent logs from the last 24h.
 * Detects qos_signature_lock and operator_signature conditions
 * from pattern metadata and writes log events for operator-visible readout.
 */
async function executeDailyQOSSignaturePulse(): Promise<JobResult> {
  const jobName = 'daily-qos-signature-pulse'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Daily QOS Signature Pulse')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isDailyQOSSignatureRunning = true

  try {
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const cutoff = dayjs().subtract(30, 'day').toDate()
    const activeUsers = await (User as any).findAll({
      where: { updatedAt: { [Op.gt]: cutoff } },
      attributes: ['id'],
    })

    let sigLockCount = 0
    let opSigCount = 0

    for (const user of activeUsers) {
      const userId = (user as any).id
      try {
        const window24h = dayjs().subtract(24, 'hour').toDate()
        const recentLogs = await (Log as any).findAll({
          where: {
            userId,
            event: { [Op.in]: ['qos_state', 'physiological_cohort', 'scheduled_job'] },
            createdAt: { [Op.gt]: window24h },
          },
          order: [['createdAt', 'DESC']],
          limit: 20,
        })

        const patternLog = recentLogs.find((l: any) =>
          l.event === 'scheduled_job' && l.metadata?.patterns
        )
        if (!patternLog) continue

        const patterns: string[] = patternLog.metadata?.patterns ?? []

        if (patterns.includes('qos-signature-lock')) {
          await (Log as any).create({
            userId,
            event: 'qos_signature_lock',
            text: '',
            metadata: {
              confidence: 0.92,
              triggers: ['meridian-lock', 'multimodal-peak', 'temporal-coherence-window'],
            },
          })
          sigLockCount++
          console.log(`  [${userId}] QOS-SIG: signature lock detected`)
        }

        if (patterns.includes('operator-signature')) {
          const qosLog = recentLogs.find((l: any) => l.event === 'qos_state')
          const index = qosLog?.metadata?.userIndex ?? 0
          await (Log as any).create({
            userId,
            event: 'operator_signature',
            text: '',
            metadata: {
              quadrants: ['bio', 'cognitive', 'structural', 'social'],
              index,
              signals: patternLog.metadata?.signalCount ?? 0,
            },
          })
          opSigCount++
          console.log(`  [${userId}] OP-SIG: operator signature complete`)
        }
      } catch (userErr: any) {
        console.warn(`  User ${userId} QOS signature pulse failed: ${userErr.message}`)
      }
    }

    console.log('')
    console.log(`  QOS signature locks written: ${sigLockCount}`)
    console.log(`  Operator signatures written: ${opSigCount}`)
    console.log('─'.repeat(60))
    console.log('QOS SIGNATURE PULSE COMPLETE')
    console.log('─'.repeat(60))
    console.log('')

    lastDailyQOSSignatureRun = new Date()
    isDailyQOSSignatureRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: { scanned: activeUsers.length, sigLockCount, opSigCount },
    }
  } catch (error: any) {
    console.error('Daily QOS signature pulse failed:', error.message)
    isDailyQOSSignatureRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Daily Coherence Index Pulse (Job 14 — 16:00 UTC) ────────────────────────

let isDailyCoherenceIndexRunning = false
let lastDailyCoherenceIndexRun: Date | null = null

function shouldRunDailyCoherenceIndexJob(): boolean {
  const now = dayjs()
  if (isDailyCoherenceIndexRunning) return false
  if (lastDailyCoherenceIndexRun) {
    const lastRun = dayjs(lastDailyCoherenceIndexRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return now.hour() === 16
}

async function executeDailyCoherenceIndexJob(): Promise<JobResult> {
  const jobName = 'daily-coherence-index-pulse'
  const executedAt = new Date().toISOString()
  if (isDailyCoherenceIndexRunning) return { jobName, executedAt, success: false, error: 'Already running' }
  isDailyCoherenceIndexRunning = true

  console.log('─'.repeat(60))
  console.log('DAILY COHERENCE INDEX PULSE — 16:00 UTC')
  console.log('─'.repeat(60))

  try {
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')
    const fourHoursAgo = dayjs().subtract(4, 'hour').toDate()

    // Pull recent emotional check-ins across all users
    const recentLogs = await Log.findAll({
      where: {
        event: 'emotional_checkin',
        createdAt: { [Op.gte]: fourHoursAgo },
      },
    })

    const activeUserIds = new Set(recentLogs.map((l: any) => String(l.userId)))
    const activeUserCount = activeUserIds.size

    const positiveMoods = new Set(['calm', 'peaceful', 'energized', 'hopeful', 'grateful', 'content', 'excited'])
    const moodCounts: Record<string, number> = {}
    let positiveCount = 0

    for (const l of recentLogs) {
      const mood = (l.metadata as any)?.emotionalState as string | undefined
      if (!mood) continue
      moodCounts[mood] = (moodCounts[mood] ?? 0) + 1
      if (positiveMoods.has(mood)) positiveCount++
    }

    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'unknown'
    const communityIndex = activeUserCount > 0 ? Math.round((positiveCount / recentLogs.length) * 100) : 0

    console.log(`  Active users (4h): ${activeUserCount}`)
    console.log(`  Top mood: ${topMood}`)
    console.log(`  Community coherence index: ${communityIndex}%`)

    // Write community_coherence_pulse log for each active user
    let written = 0
    for (const userId of activeUserIds) {
      try {
        await Log.create({
          userId: Number(userId),
          event: 'community_coherence_pulse',
          text: '',
          metadata: { communityIndex, topMood, activeUserCount },
        } as any)
        written++
      } catch (userErr: any) {
        console.warn(`  User ${userId} coherence pulse failed: ${userErr.message}`)
      }
    }

    console.log(`  Coherence logs written: ${written}`)
    console.log('─'.repeat(60))
    console.log('COHERENCE INDEX PULSE COMPLETE')
    console.log('─'.repeat(60))
    console.log('')

    lastDailyCoherenceIndexRun = new Date()
    isDailyCoherenceIndexRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: { activeUserCount, communityIndex, topMood, written },
    }
  } catch (error: any) {
    console.error('Daily coherence index pulse failed:', error.message)
    isDailyCoherenceIndexRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Weekly QOS Convergence Audit (Job 15 — Sundays 15:00 UTC) ─────────────

let isWeeklyQOSConvergenceRunning = false
let lastWeeklyQOSConvergenceRun: Date | null = null

function shouldRunWeeklyQOSConvergenceJob(): boolean {
  const now = dayjs()
  if (isWeeklyQOSConvergenceRunning) return false
  if (lastWeeklyQOSConvergenceRun) {
    const lastRun = dayjs(lastWeeklyQOSConvergenceRun)
    if (lastRun.isSame(now, 'week')) return false
  }
  return now.day() === 0 && now.hour() === 15 // Sunday 15:00 UTC
}

async function executeWeeklyQOSConvergenceAudit(): Promise<JobResult> {
  const jobName = 'weekly-qos-convergence-audit'
  const executedAt = new Date().toISOString()
  if (isWeeklyQOSConvergenceRunning) return { jobName, executedAt, success: false, error: 'Already running' }
  isWeeklyQOSConvergenceRunning = true

  console.log('─'.repeat(60))
  console.log('WEEKLY QOS CONVERGENCE AUDIT — Sunday 15:00 UTC')
  console.log('─'.repeat(60))

  try {
    const { Log } = await import('#server/models/log.js')
    const { User } = await import('#server/models/user.js')
    const { Op } = await import('sequelize')

    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()

    // Find active users from the last 7 days
    const recentLogs = await Log.findAll({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      attributes: ['userId'],
    })
    const activeUserIds = [...new Set(recentLogs.map((l: any) => String(l.userId)))]

    let written = 0
    let totalConvergences = 0

    for (const userId of activeUserIds) {
      try {
        // Count operator_convergence events in the last 7 days for this user
        const convergenceLogs = await Log.findAll({
          where: {
            userId: Number(userId),
            event: { [Op.in]: ['operator_convergence', 'qos_signature_lock', 'quantum_coherence_summit'] },
            createdAt: { [Op.gte]: sevenDaysAgo },
          },
        })

        const frequency = convergenceLogs.filter((l: any) => l.event === 'operator_convergence').length
        const hasSummit  = convergenceLogs.some((l: any) => l.event === 'quantum_coherence_summit')

        // Only write for users who had at least 1 convergence event
        if (frequency === 0 && !hasSummit) continue

        // Find the peak day (day with most convergence events)
        const dayMap: Record<string, number> = {}
        for (const l of convergenceLogs) {
          const dayKey = dayjs((l as any).createdAt).format('YYYY-MM-DD')
          dayMap[dayKey] = (dayMap[dayKey] ?? 0) + 1
        }
        const peakDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'unknown'

        totalConvergences += frequency

        await Log.create({
          userId: Number(userId),
          event: 'convergence_audit',
          text: '',
          metadata: {
            frequency,
            peakDay,
            hasSummit,
            window: '7d',
            date: dayjs().format('YYYY-MM-DD'),
          },
        } as any)
        written++
      } catch (userErr: any) {
        console.warn(`  User ${userId} convergence audit failed: ${userErr.message}`)
      }
    }

    console.log(`  Active users scanned: ${activeUserIds.length}`)
    console.log(`  Convergence reports written: ${written}`)
    console.log(`  Total convergence events: ${totalConvergences}`)
    console.log('─'.repeat(60))
    console.log('WEEKLY QOS CONVERGENCE AUDIT COMPLETE')
    console.log('─'.repeat(60))
    console.log('')

    lastWeeklyQOSConvergenceRun = new Date()
    isWeeklyQOSConvergenceRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: { scanned: activeUserIds.length, written, totalConvergences },
    }
  } catch (error: any) {
    console.error('Weekly QOS convergence audit failed:', error.message)
    isWeeklyQOSConvergenceRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Weekly Badge Progress Scan (Job 16 — Tuesdays 09:00 UTC) ───────────────

let isWeeklyBadgeScanRunning = false
let lastWeeklyBadgeScanRun: Date | null = null

function shouldRunWeeklyBadgeScanJob(): boolean {
  const now = dayjs()
  if (isWeeklyBadgeScanRunning) return false
  if (lastWeeklyBadgeScanRun) {
    const lastRun = dayjs(lastWeeklyBadgeScanRun)
    if (lastRun.isSame(now, 'week')) return false
  }
  return now.day() === 2 && now.hour() === 9 // Tuesday 09:00 UTC
}

async function executeWeeklyBadgeScan(): Promise<JobResult> {
  const jobName = 'weekly-badge-progress-scan'
  const executedAt = new Date().toISOString()
  if (isWeeklyBadgeScanRunning) return { jobName, executedAt, success: false, error: 'Already running' }
  isWeeklyBadgeScanRunning = true

  console.log('─'.repeat(60))
  console.log('WEEKLY BADGE PROGRESS SCAN — Tuesday 09:00 UTC')
  console.log('─'.repeat(60))

  try {
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()

    // Find users who unlocked badges in the last 7 days
    const recentBadgeLogs = await Log.findAll({
      where: { event: 'badge_unlock', createdAt: { [Op.gte]: sevenDaysAgo } },
      attributes: ['userId', 'metadata'],
    })

    const userBadgeMap: Record<string, { unlocks: number; types: Set<string> }> = {}
    for (const l of recentBadgeLogs) {
      const uid = String((l as any).userId)
      if (!userBadgeMap[uid]) userBadgeMap[uid] = { unlocks: 0, types: new Set() }
      userBadgeMap[uid].unlocks++
      const badge = (l as any).metadata?.badge as string | undefined
      if (badge) userBadgeMap[uid].types.add(badge)
    }

    let written = 0
    for (const [userId, data] of Object.entries(userBadgeMap)) {
      try {
        const distinctTypes = data.types.size
        const momentum = data.unlocks >= 5 ? 'HIGH' : data.unlocks >= 2 ? 'MODERATE' : 'LOW'

        await Log.create({
          userId: Number(userId),
          event: 'badge_progress_scan',
          text: '',
          metadata: {
            unlocksThisWeek: data.unlocks,
            distinctTypes,
            momentum,
            window: '7d',
            date: dayjs().format('YYYY-MM-DD'),
          },
        } as any)
        written++
      } catch (userErr: any) {
        console.warn(`  User ${userId} badge scan failed: ${userErr.message}`)
      }
    }

    console.log(`  Users with badge activity: ${Object.keys(userBadgeMap).length}`)
    console.log(`  Badge scan reports written: ${written}`)
    console.log('─'.repeat(60))
    console.log('WEEKLY BADGE PROGRESS SCAN COMPLETE')
    console.log('─'.repeat(60))
    console.log('')

    lastWeeklyBadgeScanRun = new Date()
    isWeeklyBadgeScanRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: { scanned: Object.keys(userBadgeMap).length, written },
    }
  } catch (error: any) {
    console.error('Weekly badge scan failed:', error.message)
    isWeeklyBadgeScanRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Daily Morning Intention Launch (Job 17) ─────────────────────────────────
// 11:00 UTC daily — detects users whose first signal of the day was an intention,
// followed by planner activity within 90 minutes. Records morning_coherence_launch.

let isDailyMorningIntentionLaunchRunning = false
let lastDailyMorningIntentionLaunchRun: Date | null = null

function shouldRunDailyMorningIntentionLaunch(): boolean {
  const now = dayjs()
  if (isDailyMorningIntentionLaunchRunning) return false
  if (lastDailyMorningIntentionLaunchRun) {
    const lastRun = dayjs(lastDailyMorningIntentionLaunchRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return now.hour() === 11
}

async function executeDailyMorningIntentionLaunch(): Promise<JobResult> {
  const jobName = 'daily-morning-intention-launch'
  const executedAt = new Date().toISOString()
  if (isDailyMorningIntentionLaunchRunning) return { jobName, executedAt, success: false, error: 'Already running' }
  isDailyMorningIntentionLaunchRunning = true

  console.log('─'.repeat(60))
  console.log('DAILY MORNING INTENTION LAUNCH — 11:00 UTC')
  console.log('─'.repeat(60))

  try {
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    // Look at logs from 00:00–09:00 UTC today
    const todayStart = dayjs().startOf('day').toDate()
    const nineAM = dayjs().startOf('day').add(9, 'hour').toDate()

    const earlyLogs = await Log.findAll({
      where: {
        createdAt: { [Op.between]: [todayStart, nineAM] },
        event: { [Op.in]: ['intention', 'plan_set'] },
      },
      attributes: ['userId', 'event', 'createdAt', 'metadata'],
      order: [['createdAt', 'ASC']],
    })

    // Group first signals per user
    const userFirstSignal: Record<string, { event: string; time: Date; metadata?: any }> = {}
    for (const l of earlyLogs) {
      const uid = String((l as any).userId)
      if (!userFirstSignal[uid]) {
        userFirstSignal[uid] = { event: l.event, time: new Date(l.createdAt as any), metadata: (l as any).metadata }
      }
    }

    let written = 0
    for (const [userId, first] of Object.entries(userFirstSignal)) {
      if (first.event !== 'intention') continue
      // Check if there's a plan_set within 90 min
      const windowEnd = new Date(first.time.getTime() + 90 * 60 * 1000)
      const followUp = earlyLogs.find(l =>
        String((l as any).userId) === userId &&
        l.event === 'plan_set' &&
        new Date(l.createdAt as any) > first.time &&
        new Date(l.createdAt as any) <= windowEnd
      )
      if (!followUp) continue
      try {
        const plannerMinutes = Math.round((new Date(followUp.createdAt as any).getTime() - first.time.getTime()) / 60000)
        await Log.create({
          userId: Number(userId),
          event: 'morning_coherence_launch',
          text: '',
          metadata: {
            intentionLabel: first.metadata?.intention ?? first.metadata?.intent ?? null,
            plannerMinutesAfter: plannerMinutes,
            date: dayjs().format('YYYY-MM-DD'),
          },
        } as any)
        written++
      } catch (userErr: any) {
        console.warn(`  User ${userId} MCL write failed: ${userErr.message}`)
      }
    }

    console.log(`  Users with morning intention signal: ${Object.keys(userFirstSignal).length}`)
    console.log(`  Morning coherence launches detected: ${written}`)
    console.log('─'.repeat(60))
    console.log('DAILY MORNING INTENTION LAUNCH COMPLETE')
    console.log('─'.repeat(60))
    console.log('')

    lastDailyMorningIntentionLaunchRun = new Date()
    isDailyMorningIntentionLaunchRunning = false

    return { jobName, executedAt, success: true, result: { scanned: Object.keys(userFirstSignal).length, written } }
  } catch (error: any) {
    console.error('Daily morning intention launch failed:', error.message)
    isDailyMorningIntentionLaunchRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Daily Evening Coherence Close (Job 18) ──────────────────────────────────
// 22:00 UTC daily — detects users who had a morning intention/planner signal today
// and then recorded journal/memory/log capture in the 18:00–23:00 window.
// Records evening_coherence_close. Mirrors Job 17 (morning-intention-launch).

let isDailyEveningCoherenceCloseRunning = false
let lastDailyEveningCoherenceCloseRun: Date | null = null

function shouldRunDailyEveningCoherenceClose(): boolean {
  const now = dayjs()
  if (isDailyEveningCoherenceCloseRunning) return false
  if (lastDailyEveningCoherenceCloseRun) {
    const lastRun = dayjs(lastDailyEveningCoherenceCloseRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return now.hour() === 22
}

async function executeDailyEveningCoherenceClose(): Promise<JobResult> {
  const jobName = 'daily-evening-coherence-close'
  const executedAt = new Date().toISOString()
  if (isDailyEveningCoherenceCloseRunning) return { jobName, executedAt, success: false, error: 'Already running' }
  isDailyEveningCoherenceCloseRunning = true

  console.log('─'.repeat(60))
  console.log('DAILY EVENING COHERENCE CLOSE — 22:00 UTC')
  console.log('─'.repeat(60))

  try {
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const todayStart = dayjs().startOf('day').toDate()
    const eveningStart = dayjs().startOf('day').add(18, 'hour').toDate()
    const eveningEnd = dayjs().startOf('day').add(23, 'hour').toDate()

    // Morning intention/planner signals (00:00–18:00)
    const morningLogs = await Log.findAll({
      where: {
        createdAt: { [Op.between]: [todayStart, eveningStart] },
        event: { [Op.in]: ['intention', 'plan_set'] },
      },
      attributes: ['userId', 'event', 'createdAt'],
    })

    // Evening reflection signals (18:00–23:00)
    const eveningLogs = await Log.findAll({
      where: {
        createdAt: { [Op.between]: [eveningStart, eveningEnd] },
        event: { [Op.in]: ['memory', 'journal', 'note'] },
      },
      attributes: ['userId', 'event', 'createdAt'],
    })

    // Find users with both a morning signal and an evening capture
    const morningUserIds = new Set(morningLogs.map(l => String((l as any).userId)))
    const eveningByUser: Record<string, number> = {}
    for (const l of eveningLogs) {
      const uid = String((l as any).userId)
      eveningByUser[uid] = (eveningByUser[uid] ?? 0) + 1
    }

    let written = 0
    for (const [userId, captureCount] of Object.entries(eveningByUser)) {
      if (!morningUserIds.has(userId)) continue
      try {
        await Log.create({
          userId: Number(userId),
          event: 'evening_coherence_close',
          text: '',
          metadata: {
            captureCount,
            morningSignalPresent: true,
            date: dayjs().format('YYYY-MM-DD'),
          },
        } as any)
        written++
      } catch (userErr: any) {
        console.warn(`  User ${userId} EVE write failed: ${userErr.message}`)
      }
    }

    console.log(`  Users with morning signal: ${morningUserIds.size}`)
    console.log(`  Users with evening capture: ${Object.keys(eveningByUser).length}`)
    console.log(`  Evening coherence closes written: ${written}`)
    console.log('─'.repeat(60))
    console.log('DAILY EVENING COHERENCE CLOSE COMPLETE')
    console.log('─'.repeat(60))
    console.log('')

    lastDailyEveningCoherenceCloseRun = new Date()
    isDailyEveningCoherenceCloseRunning = false

    return { jobName, executedAt, success: true, result: { morningUsers: morningUserIds.size, eveningUsers: Object.keys(eveningByUser).length, written } }
  } catch (error: any) {
    console.error('Daily evening coherence close failed:', error.message)
    isDailyEveningCoherenceCloseRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

// ─── Daily Signal Momentum Check (Job 19 — 20:00 UTC) ───────────────────────
// Detects users who had 3+ unique signal sources on each of the last 5+ days.
// Sustained multi-dimensional engagement. Writes signal_momentum event. Feeds P80.

let isDailySignalMomentumRunning = false
let lastDailySignalMomentumRun: Date | null = null

function shouldRunDailySignalMomentumCheck(): boolean {
  const now = dayjs()
  if (isDailySignalMomentumRunning) return false
  if (lastDailySignalMomentumRun) {
    const lastRun = dayjs(lastDailySignalMomentumRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return now.hour() === 20
}

async function executeDailySignalMomentumCheck(): Promise<JobResult> {
  const jobName = 'daily-signal-momentum-check'
  const executedAt = new Date().toISOString()
  if (isDailySignalMomentumRunning) return { jobName, executedAt, success: false, error: 'Already running' }
  isDailySignalMomentumRunning = true

  console.log('─'.repeat(60))
  console.log('DAILY SIGNAL MOMENTUM CHECK — 20:00 UTC')
  console.log('─'.repeat(60))

  try {
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()

    // Pull all logs from the last 7 days
    const recentLogs = await Log.findAll({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      attributes: ['userId', 'event', 'createdAt'],
      order: [['createdAt', 'ASC']],
    })

    // Group by userId → day → set of event types (as source proxies)
    const userDaySourceMap: Record<string, Record<string, Set<string>>> = {}
    for (const l of recentLogs) {
      const uid = String((l as any).userId)
      const day = dayjs(l.createdAt as any).format('YYYY-MM-DD')
      if (!userDaySourceMap[uid]) userDaySourceMap[uid] = {}
      if (!userDaySourceMap[uid][day]) userDaySourceMap[uid][day] = new Set()
      // Map event to signal source category
      const ev = l.event
      if (['intention', 'plan_set'].includes(ev)) userDaySourceMap[uid][day].add('intentions')
      else if (['emotional_checkin', 'mood_checkin', 'energy_checkin'].includes(ev)) userDaySourceMap[uid][day].add('mood')
      else if (['answer', 'memory'].includes(ev)) userDaySourceMap[uid][day].add('memory')
      else if (['note', 'journal'].includes(ev)) userDaySourceMap[uid][day].add('journal')
      else if (['self_care_complete', 'self_care_completed'].includes(ev)) userDaySourceMap[uid][day].add('selfcare')
      else if (['goal_set', 'goal_update', 'goal_complete'].includes(ev)) userDaySourceMap[uid][day].add('goals')
      else if (['recipe_viewed'].includes(ev)) userDaySourceMap[uid][day].add('recipe')
      else if (['calendar_entry'].includes(ev)) userDaySourceMap[uid][day].add('planner')
    }

    let written = 0
    for (const [userId, dayMap] of Object.entries(userDaySourceMap)) {
      try {
        // Count days with 3+ unique sources
        const qualifyingDays = Object.values(dayMap).filter(sources => sources.size >= 3).length
        if (qualifyingDays < 5) continue

        // Gather all unique sources over the window
        const allSources = new Set<string>()
        Object.values(dayMap).forEach(sources => sources.forEach(s => allSources.add(s)))

        await Log.create({
          userId: Number(userId),
          event: 'signal_momentum',
          text: '',
          metadata: {
            qualifyingDays,
            streakSources: Array.from(allSources),
            window: '7d',
            date: dayjs().format('YYYY-MM-DD'),
          },
        } as any)
        written++
      } catch (userErr: any) {
        console.warn(`  User ${userId} signal momentum check failed: ${userErr.message}`)
      }
    }

    console.log(`  Users scanned: ${Object.keys(userDaySourceMap).length}`)
    console.log(`  Signal momentum records written: ${written}`)
    console.log('─'.repeat(60))
    console.log('DAILY SIGNAL MOMENTUM CHECK COMPLETE')
    console.log('─'.repeat(60))
    console.log('')

    lastDailySignalMomentumRun = new Date()
    isDailySignalMomentumRunning = false

    return { jobName, executedAt, success: true, result: { scanned: Object.keys(userDaySourceMap).length, written } }
  } catch (error: any) {
    console.error('Daily signal momentum check failed:', error.message)
    isDailySignalMomentumRunning = false
    return { jobName, executedAt, success: false, error: error.message }
  }
}

/**
 * Manually trigger monthly email job (bypasses time checks)
 * Used for testing and manual sends
 */
export async function manuallyTriggerMonthlyEmails(): Promise<JobResult> {
  console.log('Manual trigger requested - bypassing time checks')
  return await executeMonthlyEmailJob()
}

/**
 * Initialize scheduled job system
 * Sets up a simple interval-based scheduler
 */
export function initializeScheduledJobs(): void {
  console.log('Initializing scheduled job system...')
  console.log('   - Monthly emails: 9 AM UTC on 1st of each month')
  console.log('   - Weekly physiological cohort digest: 6 AM UTC every Monday')
  console.log('   - Weekly QOS state digest: 4 AM UTC every Wednesday')
  console.log('   - Weekly archetype stability monitor: 5 AM UTC every Thursday')
  console.log('   - Weekly intention completion audit: 8 PM UTC every Sunday')
  console.log('   - Daily QIE pattern analytics: 3 AM UTC every day')
  console.log('   - Daily intention audit: 6 AM UTC every day')
  console.log('   - Daily OS snapshot: midnight (0 AM UTC) every day')
  console.log('   - Daily morning biofield summary: 8 AM UTC every day')
  console.log('   - Daily pattern coverage audit: 11 PM UTC every day')
  console.log('   - Daily source diversity pulse: 7 AM UTC every day')
  console.log('   - Daily archetype shift monitor: 10 AM UTC every day')
  console.log('   - Daily QOS signature pulse: 1 PM UTC every day')
  console.log('   - Daily coherence index pulse: 4 PM UTC every day')
  console.log('   - Weekly QOS convergence audit: 3 PM UTC every Sunday')
  console.log('   - Weekly badge progress scan: 9 AM UTC every Tuesday')
  console.log('   - Daily morning intention launch: 11 AM UTC every day')
  console.log('   - Daily evening coherence close: 10 PM UTC every day')
  console.log('   - Daily signal momentum check: 8 PM UTC every day')
  console.log('')

  // Check every hour for scheduled jobs
  const HOURLY_CHECK = 60 * 60 * 1000 // 1 hour in milliseconds

  setInterval(async () => {
    const now = dayjs()
    const hour = now.hour()

    // Jobs by hour: 0=OS snapshot, 3=QIE, 4=QOS digest, 5=archetype stability, 6=cohort+intention, 7=source diversity, 8=biofield, 9=monthly email+badge scan, 10=archetype shift, 11=morning-intention-launch, 13=QOS sig pulse, 15=QOS convergence audit, 16=coherence index, 20=intention completion+signal-momentum, 22=evening-coherence-close, 23=pattern coverage
    if (hour === 9 || hour === 8 || hour === 7 || hour === 6 || hour === 5 || hour === 4 || hour === 3 || hour === 0 || hour === 20 || hour === 22 || hour === 23 || hour === 10 || hour === 11 || hour === 13 || hour === 15 || hour === 16) {
      try {
        await checkAndRunScheduledJobs()
      } catch (error: any) {
        console.error('Scheduled job check failed:', error.message)
      }
    }
  }, HOURLY_CHECK)

  console.log('Scheduled job system initialized')
  console.log(`   Current time: ${dayjs().format('YYYY-MM-DD HH:mm:ss')} UTC`)
  console.log('')
}
