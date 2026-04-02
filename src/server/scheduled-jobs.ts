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

    const activeUsers = await User.findAll({
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

    console.log(`👥 Found ${activeUsers.length} active users (3+ months, near-daily)`)
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
        const logs = await Log.findAll({
          where: { userId: user.id },
          order: [['createdAt', 'DESC']],
          limit: 1000
        })

        // Verify near-daily engagement over last 3 months
        const threeMonthLogs = logs.filter((l: any) =>
          dayjs(l.createdAt).isAfter(dayjs().subtract(3, 'month'))
        )
        const uniqueActiveDays = new Set(
          threeMonthLogs.map((l: any) => dayjs(l.createdAt).format('YYYY-MM-DD'))
        ).size
        const totalDaysInPeriod = 90
        const dailyRatio = uniqueActiveDays / totalDaysInPeriod

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

/**
 * Check and run scheduled jobs
 * Called periodically by the scheduler
 */
export async function checkAndRunScheduledJobs(): Promise<void> {
  // Check monthly email job
  if (shouldRunMonthlyEmailJob()) {
    await executeMonthlyEmailJob()
  }
}

/**
 * Manually trigger monthly email job (bypasses time checks)
 * Used for testing and manual sends
 */
export async function manuallyTriggerMonthlyEmails(): Promise<JobResult> {
  console.log('🔧 Manual trigger requested - bypassing time checks')
  return await executeMonthlyEmailJob()
}

/**
 * Initialize scheduled job system
 * Sets up a simple interval-based scheduler
 */
export function initializeScheduledJobs(): void {
  console.log('⏰ Initializing scheduled job system...')
  console.log('   - Monthly emails: 9 AM UTC on 1st of each month')
  console.log('')

  // Check every hour for scheduled jobs
  const HOURLY_CHECK = 60 * 60 * 1000 // 1 hour in milliseconds

  setInterval(async () => {
    const now = dayjs()
    const hour = now.hour()

    // Only run at 9 AM UTC
    if (hour === 9) {
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
