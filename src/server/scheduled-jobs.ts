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

  // Check weekly archetype resonance audit (Thursday 06:00 UTC)
  if (shouldRunWeeklyArchetypeAudit()) {
    await executeWeeklyArchetypeAudit()
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

// ─── Weekly Archetype Resonance Audit ────────────────────────────────────────

let isWeeklyArchetypeAuditRunning = false
let lastWeeklyArchetypeAuditRun: Date | null = null

/**
 * Runs on Thursdays at 06:00 UTC.
 * For each active user, reads archetype metadata from the last 4 weeks of logs.
 * Computes archetype stability — consistent vs. drifting cohort identity.
 * Surfaces resonance score: high stability = the system has found its person.
 */
function shouldRunWeeklyArchetypeAudit(): boolean {
  const now = dayjs()
  const dayOfWeek = now.day() // 4 = Thursday
  if (dayOfWeek !== 4) return false
  if (isWeeklyArchetypeAuditRunning) return false
  if (lastWeeklyArchetypeAuditRun) {
    const lastRun = dayjs(lastWeeklyArchetypeAuditRun)
    if (lastRun.isSame(now, 'day')) return false
  }
  return true
}

async function executeWeeklyArchetypeAudit(): Promise<JobResult> {
  const jobName = 'weekly-archetype-resonance-audit'
  const executedAt = new Date().toISOString()

  console.log('')
  console.log('─'.repeat(60))
  console.log('SCHEDULED JOB: Weekly Archetype Resonance Audit')
  console.log(`   Started: ${executedAt}`)
  console.log('─'.repeat(60))
  console.log('')

  isWeeklyArchetypeAuditRunning = true

  try {
    const { User } = await import('#server/models/user.js')
    const { Log } = await import('#server/models/log.js')
    const { Op } = await import('sequelize')

    const fourWeeksAgo = dayjs().subtract(28, 'day').toDate()
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate()

    const activeUsers = await User.findAll({
      where: { lastSeenAt: { [Op.gte]: sevenDaysAgo } },
      order: [['lastSeenAt', 'DESC']],
      limit: 500,
    })

    console.log(`  Active users (7d): ${activeUsers.length}`)

    let stableCount = 0     // same archetype for 3+ of 4 weeks
    let driftingCount = 0   // archetype changed week-over-week
    let emergingCount = 0   // archetype present but <3 weeks of data
    let unclassifiedCount = 0

    for (const user of activeUsers) {
      try {
        const archetypeLogs = await Log.findAll({
          where: {
            userId: (user as any).id,
            createdAt: { [Op.gte]: fourWeeksAgo },
            event: { [Op.in]: ['physiological_cohort', 'qos_state'] as any[] }
          },
          order: [['createdAt', 'ASC']],
        })

        if (archetypeLogs.length === 0) {
          unclassifiedCount++
          continue
        }

        const archetypesByWeek: Record<number, string[]> = {}
        for (const log of archetypeLogs) {
          const weeksAgo = Math.floor(
            (Date.now() - new Date(log.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000)
          )
          const weekBucket = Math.min(weeksAgo, 3)
          const archetype = (log.metadata as any)?.archetype as string | undefined
          if (archetype) {
            if (!archetypesByWeek[weekBucket]) archetypesByWeek[weekBucket] = []
            archetypesByWeek[weekBucket].push(archetype)
          }
        }

        const weekArchetypes = Object.values(archetypesByWeek).map(arr => {
          const counts: Record<string, number> = {}
          arr.forEach(a => { counts[a] = (counts[a] || 0) + 1 })
          return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
        }).filter(Boolean)

        if (weekArchetypes.length < 2) {
          emergingCount++
        } else {
          const dominant = weekArchetypes[0]
          const stableWeeks = weekArchetypes.filter(a => a === dominant).length
          if (stableWeeks >= 3) stableCount++
          else if (stableWeeks <= 1) driftingCount++
          else emergingCount++
        }
      } catch { /* skip user */ }
    }

    console.log('')
    console.log('  Archetype resonance results:')
    console.log(`    Stable (3+ weeks consistent): ${stableCount}`)
    console.log(`    Drifting (changing week-over-week): ${driftingCount}`)
    console.log(`    Emerging (insufficient history): ${emergingCount}`)
    console.log(`    Unclassified (no archetype logs): ${unclassifiedCount}`)
    console.log('')
    console.log('─'.repeat(60))
    console.log('ARCHETYPE RESONANCE AUDIT COMPLETE')
    console.log('─'.repeat(60))
    console.log('')

    lastWeeklyArchetypeAuditRun = new Date()
    isWeeklyArchetypeAuditRunning = false

    return {
      jobName,
      executedAt,
      success: true,
      result: { scanned: activeUsers.length, stableCount, driftingCount, emergingCount, unclassifiedCount }
    }
  } catch (error: any) {
    console.error('Weekly archetype resonance audit failed:', error.message)
    isWeeklyArchetypeAuditRunning = false
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
  console.log('   - Weekly intention completion audit: 8 PM UTC every Sunday')
  console.log('   - Daily QIE pattern analytics: 3 AM UTC every day')
  console.log('   - Daily intention audit: 6 AM UTC every day')
  console.log('   - Daily OS snapshot: midnight (0 AM UTC) every day')
  console.log('   - Daily morning biofield summary: 8 AM UTC every day')
  console.log('')

  // Check every hour for scheduled jobs
  const HOURLY_CHECK = 60 * 60 * 1000 // 1 hour in milliseconds

  setInterval(async () => {
    const now = dayjs()
    const hour = now.hour()

    // Monthly emails: 9 AM; cohort digest + intention audit: 6 AM; QOS: 4 AM; QIE: 3 AM; OS snapshot: 0 AM; intention completion: 20; morning biofield: 8 AM
    if (hour === 9 || hour === 8 || hour === 6 || hour === 4 || hour === 3 || hour === 0 || hour === 20) {
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
