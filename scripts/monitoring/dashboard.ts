import { checkHealth } from './health-check'
import { monitorPool } from './pool-monitor'
import blessed from 'blessed'
import { create as createScreen } from 'blessed-contrib'

const screen = blessed.screen()
const grid = createScreen({
  rows: 12,
  cols: 12,
  screen: screen
})

// Create dashboard widgets
const healthBox = grid.set(0, 0, 6, 6, blessed.box, {
  label: 'Health Status',
  content: 'Loading...',
  border: { type: 'line' }
})

const poolBox = grid.set(0, 6, 6, 6, blessed.box, {
  label: 'Connection Pool',
  content: 'Loading...',
  border: { type: 'line' }
})

const logBox = grid.set(6, 0, 6, 12, blessed.log, {
  label: 'Log',
  border: { type: 'line' }
})

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

async function updateDashboard() {
  try {
    const health = await checkHealth()
    const pool = await monitorPool()

    healthBox.setContent(JSON.stringify(health, null, 2))
    poolBox.setContent(JSON.stringify(pool, null, 2))
    logBox.log(`Updated at ${new Date().toISOString()}`)

    screen.render()
  } catch (error) {
    logBox.log(`Error: ${error}`)
  }
}

// Update every 5 seconds
setInterval(updateDashboard, 5000)
updateDashboard() // Initial update
