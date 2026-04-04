import React from 'react'
import { Block } from '#client/components/ui'
import { cn } from '#client/utils'
import { recordSignal } from '#client/stores/intentionEngine'
import {
  playMoveSound, playRotateSound, playScoreSound, playDropSound,
  playShootSound, playEnemyHitSound, playGameOverSound, playSwitchSound,
  playLineClearSound,
} from '#client/utils/sovietGameSounds'

/**
 * MicroGameWidget — A 2×2 cm high-density monochromatic micro-screen
 * running one of 3 context-based pixel games.
 *
 * Games rotate based on time of day:
 *   Morning  (06–12) → Micro Tetris   (structure, building)
 *   Afternoon(12–18) → Pixel Invaders (focus, action)
 *   Evening  (18–06) → Dot Snake      (flow, calm)
 *
 * 64×64 pixel grid with nature background patterns.
 * All graphics are monochromatic (foreground vs background).
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Logical pixel grid: 64×64 cells rendered into ~76×76 CSS pixels (≈2cm @96dpi) */
const GRID = 64
const CELL = 1 // each logical cell = 1×1 canvas pixel (high density)
const SIZE = GRID * CELL // 64 canvas pixels
const CSS_SIZE = 76 // ≈ 2cm at 96 dpi
const TICK_MS = 150 // game tick speed

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

type Color = { fg: string; bg: string }

function getMonoColors(canvas: HTMLCanvasElement): Color {
  const style = getComputedStyle(canvas)
  const fg = style.getPropertyValue('color') || '#000'
  const bg = 'transparent'
  return { fg, bg }
}

function clearGrid(ctx: CanvasRenderingContext2D, _bg: string, w: number, h: number) {
  ctx.clearRect(0, 0, w, h)
}

function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, fg: string) {
  ctx.fillStyle = fg
  ctx.fillRect(x * CELL, y * CELL, CELL, CELL)
}

// ---------------------------------------------------------------------------
// Nature background patterns (subtle, drawn at low opacity)
// ---------------------------------------------------------------------------

function drawNatureBg(ctx: CanvasRenderingContext2D, gameId: GameId, fg: string) {
  ctx.globalAlpha = 0.08

  if (gameId === 'tetris') {
    // Morning: small trees / hills along bottom
    // Rolling hills
    for (let x = 0; x < GRID; x++) {
      const hillH = Math.floor(3 + 2 * Math.sin(x * 0.15) + Math.sin(x * 0.3))
      for (let y = GRID - hillH; y < GRID; y++) {
        drawCell(ctx, x, y, fg)
      }
    }
    // Small trees
    const trees = [8, 22, 38, 52]
    for (const tx of trees) {
      const base = GRID - Math.floor(3 + 2 * Math.sin(tx * 0.15) + Math.sin(tx * 0.3))
      // Trunk
      drawCell(ctx, tx, base - 1, fg)
      drawCell(ctx, tx, base - 2, fg)
      // Canopy
      drawCell(ctx, tx - 1, base - 3, fg)
      drawCell(ctx, tx, base - 3, fg)
      drawCell(ctx, tx + 1, base - 3, fg)
      drawCell(ctx, tx, base - 4, fg)
    }
  } else if (gameId === 'invaders') {
    // Afternoon: clouds and sun rays
    // Small clouds
    const clouds = [{ x: 5, y: 4 }, { x: 30, y: 7 }, { x: 50, y: 3 }]
    for (const c of clouds) {
      drawCell(ctx, c.x, c.y, fg)
      drawCell(ctx, c.x + 1, c.y, fg)
      drawCell(ctx, c.x + 2, c.y, fg)
      drawCell(ctx, c.x - 1, c.y, fg)
      drawCell(ctx, c.x, c.y - 1, fg)
      drawCell(ctx, c.x + 1, c.y - 1, fg)
    }
    // Sun in corner
    drawCell(ctx, 58, 4, fg)
    drawCell(ctx, 59, 4, fg)
    drawCell(ctx, 58, 5, fg)
    drawCell(ctx, 59, 5, fg)
    drawCell(ctx, 57, 4, fg)
    drawCell(ctx, 60, 5, fg)
    drawCell(ctx, 58, 3, fg)
    drawCell(ctx, 59, 6, fg)
  } else {
    // Evening: stars and moon
    // Scattered stars (seeded pattern)
    const stars = [
      3, 5, 10, 2, 18, 8, 25, 3, 33, 12, 40, 6, 47, 9,
      55, 4, 7, 15, 20, 18, 35, 7, 45, 14, 58, 11, 12, 22,
      50, 20, 28, 16, 42, 2, 60, 8, 15, 10, 38, 18
    ]
    for (let i = 0; i < stars.length - 1; i += 2) {
      drawCell(ctx, stars[i], stars[i + 1], fg)
    }
    // Crescent moon
    drawCell(ctx, 54, 6, fg)
    drawCell(ctx, 55, 5, fg)
    drawCell(ctx, 56, 5, fg)
    drawCell(ctx, 57, 6, fg)
    drawCell(ctx, 57, 7, fg)
    drawCell(ctx, 56, 8, fg)
    drawCell(ctx, 55, 8, fg)
    drawCell(ctx, 54, 7, fg)
  }

  ctx.globalAlpha = 1.0
}

// ---------------------------------------------------------------------------
// Game 1 — Micro Tetris
// ---------------------------------------------------------------------------

const TETRO_SHAPES = [
  [[1, 1, 1, 1]],                        // I
  [[1, 1], [1, 1]],                       // O
  [[0, 1, 0], [1, 1, 1]],                // T
  [[1, 0], [1, 0], [1, 1]],              // L
  [[0, 1], [0, 1], [1, 1]],              // J
  [[0, 1, 1], [1, 1, 0]],                // S
  [[1, 1, 0], [0, 1, 1]],                // Z
]

type TetrisState = {
  board: number[][]
  piece: number[][]
  px: number
  py: number
  score: number
  over: boolean
}

function initTetris(): TetrisState {
  const board = Array.from({ length: GRID }, () => Array(GRID).fill(0))
  const piece = TETRO_SHAPES[Math.floor(Math.random() * TETRO_SHAPES.length)]
  return { board, piece, px: Math.floor((GRID - piece[0].length) / 2), py: 0, score: 0, over: false }
}

function rotatePiece(p: number[][]): number[][] {
  const rows = p.length, cols = p[0].length
  const r: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++)
      r[x][rows - 1 - y] = p[y][x]
  return r
}

function collides(board: number[][], piece: number[][], px: number, py: number): boolean {
  for (let y = 0; y < piece.length; y++)
    for (let x = 0; x < piece[y].length; x++)
      if (piece[y][x]) {
        const bx = px + x, by = py + y
        if (bx < 0 || bx >= GRID || by >= GRID) return true
        if (by >= 0 && board[by][bx]) return true
      }
  return false
}

function lockPiece(s: TetrisState): TetrisState {
  const board = s.board.map(r => [...r])
  for (let y = 0; y < s.piece.length; y++)
    for (let x = 0; x < s.piece[y].length; x++)
      if (s.piece[y][x]) {
        const by = s.py + y
        if (by >= 0) board[by][s.px + x] = 1
      }
  // Clear full rows
  let cleared = 0
  for (let y = GRID - 1; y >= 0; y--) {
    if (board[y].every(c => c)) {
      board.splice(y, 1)
      board.unshift(Array(GRID).fill(0))
      cleared++
      y++ // recheck row
    }
  }
  const newPiece = TETRO_SHAPES[Math.floor(Math.random() * TETRO_SHAPES.length)]
  const px = Math.floor((GRID - newPiece[0].length) / 2)
  const over = collides(board, newPiece, px, 0)
  return { board, piece: newPiece, px, py: 0, score: s.score + cleared, over }
}

function tickTetris(s: TetrisState): TetrisState {
  if (s.over) return initTetris()
  if (!collides(s.board, s.piece, s.px, s.py + 1)) {
    return { ...s, py: s.py + 1 }
  }
  return lockPiece(s)
}

function moveTetris(s: TetrisState, dir: 'left' | 'right' | 'rotate' | 'drop'): TetrisState {
  if (s.over) return s
  if (dir === 'left' && !collides(s.board, s.piece, s.px - 1, s.py))
    return { ...s, px: s.px - 1 }
  if (dir === 'right' && !collides(s.board, s.piece, s.px + 1, s.py))
    return { ...s, px: s.px + 1 }
  if (dir === 'rotate') {
    const r = rotatePiece(s.piece)
    if (!collides(s.board, r, s.px, s.py)) return { ...s, piece: r }
  }
  if (dir === 'drop') {
    let ny = s.py
    while (!collides(s.board, s.piece, s.px, ny + 1)) ny++
    return lockPiece({ ...s, py: ny })
  }
  return s
}

function drawTetris(ctx: CanvasRenderingContext2D, s: TetrisState, fg: string) {
  // Board
  for (let y = 0; y < GRID; y++)
    for (let x = 0; x < GRID; x++)
      if (s.board[y][x]) drawCell(ctx, x, y, fg)
  // Active piece
  for (let y = 0; y < s.piece.length; y++)
    for (let x = 0; x < s.piece[y].length; x++)
      if (s.piece[y][x] && s.py + y >= 0)
        drawCell(ctx, s.px + x, s.py + y, fg)
}

// ---------------------------------------------------------------------------
// Game 2 — Pixel Invaders
// ---------------------------------------------------------------------------

type Invader = { x: number; y: number; alive: boolean }
type Bullet = { x: number; y: number }

type InvadersState = {
  player: number
  invaders: Invader[]
  bullets: Bullet[]
  enemyBullets: Bullet[]
  dir: number
  score: number
  over: boolean
  tick: number
}

function initInvaders(): InvadersState {
  const invaders: Invader[] = []
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 8; col++)
      invaders.push({ x: 6 + col * 7, y: 4 + row * 6, alive: true })
  return { player: Math.floor(GRID / 2), invaders, bullets: [], enemyBullets: [], dir: 1, score: 0, over: false, tick: 0 }
}

function tickInvaders(s: InvadersState): InvadersState {
  if (s.over) return initInvaders()
  let { invaders, bullets, enemyBullets, dir, player, score, tick } = s
  invaders = invaders.map(i => ({ ...i }))
  tick++

  // Move bullets
  bullets = bullets.map(b => ({ ...b, y: b.y - 1 })).filter(b => b.y >= 0)
  enemyBullets = enemyBullets.map(b => ({ ...b, y: b.y + 1 })).filter(b => b.y < GRID)

  // Bullet-invader collision
  bullets = bullets.filter(b => {
    const hit = invaders.find(i => i.alive && Math.abs(i.x - b.x) < 3 && Math.abs(i.y - b.y) < 3)
    if (hit) { hit.alive = false; score++; return false }
    return true
  })

  // Enemy bullet-player collision
  const playerHit = enemyBullets.some(b => Math.abs(b.x - player) < 3 && b.y >= GRID - 3)
  if (playerHit) return { ...s, over: true }

  // Move invaders every 3 ticks
  if (tick % 3 === 0) {
    let shift = false
    for (const i of invaders) {
      if (i.alive && ((i.x + dir > GRID - 2) || (i.x + dir < 1))) { shift = true; break }
    }
    if (shift) {
      dir = -dir
      for (const i of invaders) if (i.alive) i.y += 1
    } else {
      for (const i of invaders) if (i.alive) i.x += dir
    }
  }

  // Enemy shoots randomly
  const alive = invaders.filter(i => i.alive)
  if (alive.length > 0 && tick % 5 === 0) {
    const shooter = alive[Math.floor(Math.random() * alive.length)]
    enemyBullets.push({ x: shooter.x, y: shooter.y + 1 })
  }

  // Invaders reached bottom?
  if (alive.some(i => i.y >= GRID - 5)) return { ...s, over: true }

  // All dead → reset with score kept
  if (alive.length === 0) {
    const fresh = initInvaders()
    return { ...fresh, score }
  }

  return { invaders, bullets, enemyBullets, dir, player, score, over: false, tick }
}

function moveInvaders(s: InvadersState, dir: 'left' | 'right' | 'shoot'): InvadersState {
  if (s.over) return s
  if (dir === 'left') return { ...s, player: Math.max(2, s.player - 3) }
  if (dir === 'right') return { ...s, player: Math.min(GRID - 3, s.player + 3) }
  if (dir === 'shoot') return { ...s, bullets: [...s.bullets, { x: s.player, y: GRID - 5 }] }
  return s
}

function drawInvaders(ctx: CanvasRenderingContext2D, s: InvadersState, fg: string) {
  // Player — wider ship
  for (let dx = -2; dx <= 2; dx++) drawCell(ctx, s.player + dx, GRID - 2, fg)
  drawCell(ctx, s.player, GRID - 3, fg)
  drawCell(ctx, s.player - 1, GRID - 3, fg)
  drawCell(ctx, s.player + 1, GRID - 3, fg)
  drawCell(ctx, s.player, GRID - 4, fg)
  // Invaders — 3×2 sprites
  for (const i of s.invaders)
    if (i.alive) {
      drawCell(ctx, i.x - 1, i.y, fg)
      drawCell(ctx, i.x, i.y, fg)
      drawCell(ctx, i.x + 1, i.y, fg)
      drawCell(ctx, i.x - 1, i.y + 1, fg)
      drawCell(ctx, i.x + 1, i.y + 1, fg)
    }
  // Bullets
  for (const b of s.bullets) {
    drawCell(ctx, b.x, b.y, fg)
    drawCell(ctx, b.x, b.y + 1, fg)
  }
  // Enemy bullets
  for (const b of s.enemyBullets) {
    drawCell(ctx, b.x, b.y, fg)
    drawCell(ctx, b.x, b.y - 1, fg)
  }
}

// ---------------------------------------------------------------------------
// Game 3 — Dot Snake
// ---------------------------------------------------------------------------

type Pos = { x: number; y: number }
type SnakeState = {
  body: Pos[]
  dir: Pos
  food: Pos
  score: number
  over: boolean
}

function randomPos(exclude: Pos[]): Pos {
  let p: Pos
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
  } while (exclude.some(e => e.x === p.x && e.y === p.y))
  return p
}

function initSnake(): SnakeState {
  const mid = Math.floor(GRID / 2)
  const body: Pos[] = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }]
  return { body, dir: { x: 1, y: 0 }, food: randomPos(body), score: 0, over: false }
}

function tickSnake(s: SnakeState): SnakeState {
  if (s.over) return initSnake()
  const head = { x: (s.body[0].x + s.dir.x + GRID) % GRID, y: (s.body[0].y + s.dir.y + GRID) % GRID }
  // Self collision
  if (s.body.some(p => p.x === head.x && p.y === head.y))
    return { ...s, over: true }
  const ate = head.x === s.food.x && head.y === s.food.y
  const body = [head, ...s.body]
  if (!ate) body.pop()
  const food = ate ? randomPos(body) : s.food
  return { body, dir: s.dir, food, score: s.score + (ate ? 1 : 0), over: false }
}

function moveSnake(s: SnakeState, dir: 'left' | 'right' | 'up' | 'down'): SnakeState {
  if (s.over) return s
  const map: Record<string, Pos> = { left: { x: -1, y: 0 }, right: { x: 1, y: 0 }, up: { x: 0, y: -1 }, down: { x: 0, y: 1 } }
  const d = map[dir]
  // Prevent 180° turns
  if (d.x === -s.dir.x && d.y === -s.dir.y) return s
  return { ...s, dir: d }
}

function drawSnake(ctx: CanvasRenderingContext2D, s: SnakeState, fg: string) {
  for (const p of s.body) drawCell(ctx, p.x, p.y, fg)
  // Food blinks
  if (Date.now() % 600 < 400) drawCell(ctx, s.food.x, s.food.y, fg)
}

// ---------------------------------------------------------------------------
// Game selector (context-based)
// ---------------------------------------------------------------------------

type GameId = 'tetris' | 'invaders' | 'snake'

function pickGame(): GameId {
  const h = new Date().getHours()
  if (h >= 6 && h < 12) return 'tetris'
  if (h >= 12 && h < 18) return 'invaders'
  return 'snake'
}

const GAME_LABELS: Record<GameId, string> = {
  tetris: 'Tetris',
  invaders: 'Invaders',
  snake: 'Snake',
}

// ---------------------------------------------------------------------------
// Widget
// ---------------------------------------------------------------------------

export function MicroGameWidget() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [gameId, setGameId] = React.useState<GameId>(pickGame)
  const [score, setScore] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  // Game state refs (avoid re-render per tick)
  const tetrisRef = React.useRef<TetrisState>(initTetris())
  const invadersRef = React.useRef<InvadersState>(initInvaders())
  const snakeRef = React.useRef<SnakeState>(initSnake())
  const pausedRef = React.useRef(false)
  pausedRef.current = paused

  // Reset on game switch
  const switchGame = React.useCallback(() => {
    const games: GameId[] = ['tetris', 'invaders', 'snake']
    const idx = (games.indexOf(gameId) + 1) % games.length
    const next = games[idx]
    tetrisRef.current = initTetris()
    invadersRef.current = initInvaders()
    snakeRef.current = initSnake()
    setGameId(next)
    setScore(0)
    playSwitchSound()
    recordSignal('micro_game', 'switch', { game: next })
  }, [gameId])

  // Main game loop
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const iv = setInterval(() => {
      if (pausedRef.current) return
      const { fg, bg } = getMonoColors(canvas)
      clearGrid(ctx, bg, SIZE, SIZE)

      // Nature background layer
      drawNatureBg(ctx, gameId, fg)

      if (gameId === 'tetris') {
        const prev = tetrisRef.current
        tetrisRef.current = tickTetris(prev)
        drawTetris(ctx, tetrisRef.current, fg)
        setScore(tetrisRef.current.score)
        if (tetrisRef.current.score > prev.score) playLineClearSound()
        if (tetrisRef.current.over && !prev.over) playGameOverSound()
      } else if (gameId === 'invaders') {
        const prev = invadersRef.current
        invadersRef.current = tickInvaders(prev)
        drawInvaders(ctx, invadersRef.current, fg)
        setScore(invadersRef.current.score)
        if (invadersRef.current.score > prev.score) playEnemyHitSound()
        if (invadersRef.current.over && !prev.over) playGameOverSound()
      } else {
        const prev = snakeRef.current
        snakeRef.current = tickSnake(prev)
        drawSnake(ctx, snakeRef.current, fg)
        setScore(snakeRef.current.score)
        if (snakeRef.current.score > prev.score) playScoreSound()
        if (snakeRef.current.over && !prev.over) playGameOverSound()
      }
    }, TICK_MS)

    return () => clearInterval(iv)
  }, [gameId])

  // Keyboard controls
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Only handle when widget area is likely in view
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (gameId === 'tetris') {
        if (e.key === 'ArrowLeft') { tetrisRef.current = moveTetris(tetrisRef.current, 'left'); playMoveSound() }
        else if (e.key === 'ArrowRight') { tetrisRef.current = moveTetris(tetrisRef.current, 'right'); playMoveSound() }
        else if (e.key === 'ArrowUp') { tetrisRef.current = moveTetris(tetrisRef.current, 'rotate'); playRotateSound() }
        else if (e.key === 'ArrowDown') { tetrisRef.current = moveTetris(tetrisRef.current, 'drop'); playDropSound() }
      } else if (gameId === 'invaders') {
        if (e.key === 'ArrowLeft') { invadersRef.current = moveInvaders(invadersRef.current, 'left'); playMoveSound() }
        else if (e.key === 'ArrowRight') { invadersRef.current = moveInvaders(invadersRef.current, 'right'); playMoveSound() }
        else if (e.key === ' ' || e.key === 'ArrowUp') { invadersRef.current = moveInvaders(invadersRef.current, 'shoot'); playShootSound() }
      } else {
        if (e.key === 'ArrowLeft') { snakeRef.current = moveSnake(snakeRef.current, 'left'); playMoveSound() }
        else if (e.key === 'ArrowRight') { snakeRef.current = moveSnake(snakeRef.current, 'right'); playMoveSound() }
        else if (e.key === 'ArrowUp') { snakeRef.current = moveSnake(snakeRef.current, 'up'); playMoveSound() }
        else if (e.key === 'ArrowDown') { snakeRef.current = moveSnake(snakeRef.current, 'down'); playMoveSound() }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [gameId])

  // Touch controls for mobile
  const touchRef = React.useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchRef.current.x
    const dy = t.clientY - touchRef.current.y
    touchRef.current = null

    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    if (absDx < 8 && absDy < 8) {
      // Tap → action (rotate / shoot)
      if (gameId === 'tetris') { tetrisRef.current = moveTetris(tetrisRef.current, 'rotate'); playRotateSound() }
      else if (gameId === 'invaders') { invadersRef.current = moveInvaders(invadersRef.current, 'shoot'); playShootSound() }
      return
    }

    if (absDx > absDy) {
      const dir = dx > 0 ? 'right' : 'left'
      if (gameId === 'tetris') tetrisRef.current = moveTetris(tetrisRef.current, dir)
      else if (gameId === 'invaders') invadersRef.current = moveInvaders(invadersRef.current, dir)
      else snakeRef.current = moveSnake(snakeRef.current, dir)
      playMoveSound()
    } else {
      const dir = dy > 0 ? 'down' : 'up'
      if (gameId === 'tetris') { tetrisRef.current = moveTetris(tetrisRef.current, dir === 'down' ? 'drop' : 'rotate'); dir === 'down' ? playDropSound() : playRotateSound() }
      else if (gameId === 'invaders') { invadersRef.current = moveInvaders(invadersRef.current, 'shoot'); playShootSound() }
      else { snakeRef.current = moveSnake(snakeRef.current, dir); playMoveSound() }
    }
  }

  // Controller action handlers
  const handleLeft = () => {
    if (gameId === 'tetris') tetrisRef.current = moveTetris(tetrisRef.current, 'left')
    else if (gameId === 'invaders') invadersRef.current = moveInvaders(invadersRef.current, 'left')
    else snakeRef.current = moveSnake(snakeRef.current, 'left')
    playMoveSound()
  }
  const handleRight = () => {
    if (gameId === 'tetris') tetrisRef.current = moveTetris(tetrisRef.current, 'right')
    else if (gameId === 'invaders') invadersRef.current = moveInvaders(invadersRef.current, 'right')
    else snakeRef.current = moveSnake(snakeRef.current, 'right')
    playMoveSound()
  }
  const handleUp = () => {
    if (gameId === 'tetris') { tetrisRef.current = moveTetris(tetrisRef.current, 'rotate'); playRotateSound() }
    else if (gameId === 'invaders') { invadersRef.current = moveInvaders(invadersRef.current, 'shoot'); playShootSound() }
    else { snakeRef.current = moveSnake(snakeRef.current, 'up'); playMoveSound() }
  }
  const handleDown = () => {
    if (gameId === 'tetris') { tetrisRef.current = moveTetris(tetrisRef.current, 'drop'); playDropSound() }
    else if (gameId === 'invaders') { invadersRef.current = moveInvaders(invadersRef.current, 'shoot'); playShootSound() }
    else { snakeRef.current = moveSnake(snakeRef.current, 'down'); playMoveSound() }
  }

  // ASCII controller button style
  const btnCls = 'cursor-pointer select-none text-acc opacity-50 hover:opacity-100 transition-opacity text-center leading-none'
  const btnSmCls = 'cursor-pointer select-none text-acc/60 hover:text-acc opacity-50 hover:opacity-100 transition-opacity text-xs'

  return (
    <Block label="Micro Game:" blockView onLabelClick={switchGame}>
      <div className="max-w-[200px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            className="cursor-pointer select-none opacity-50 hover:opacity-100 transition-opacity"
            onClick={switchGame}
          >
            {GAME_LABELS[gameId]}
          </button>
          <span className="tabular-nums opacity-40">{score}</span>
        </div>

        {/* Micro-screen */}
        <div
          className={cn(
            'border border-current/20 inline-flex items-center justify-center',
            'text-acc'
          )}
          style={{ width: CSS_SIZE, height: CSS_SIZE, imageRendering: 'pixelated' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className="text-acc"
            style={{
              width: CSS_SIZE - 2,
              height: CSS_SIZE - 2,
              imageRendering: 'pixelated',
            }}
          />
        </div>

        {/* ASCII Controller */}
        <div className="mt-6 flex flex-col gap-4">
          {/* D-pad + Action */}
          <div className="flex items-center justify-between">
            {/* D-pad — ASCII cross layout */}
            <div className="flex flex-col items-center gap-3" style={{ width: 'fit-content' }}>
              <button className={btnCls} onClick={handleUp}>^</button>
              <div className="flex items-center gap-6">
                <button className={btnCls} onClick={handleLeft}>&lt;</button>
                <button className={btnCls} onClick={handleRight}>&gt;</button>
              </div>
              <button className={btnCls} onClick={handleDown}>v</button>
            </div>

            {/* Action button */}
            <button
              className={btnCls}
              onClick={gameId === 'tetris' ? handleUp : gameId === 'invaders' ? handleDown : handleUp}
            >
              {gameId === 'tetris' ? 'o' : gameId === 'invaders' ? '*' : 'o'}
            </button>
          </div>

          {/* Utility row */}
          <div className="flex items-center justify-center gap-8">
            <button className={btnSmCls} onClick={switchGame}>
              &lt;&gt;
            </button>
            <button className={btnSmCls} onClick={() => setPaused(p => !p)}>
              {paused ? '|>' : '||'}
            </button>
          </div>
        </div>
      </div>
    </Block>
  )
}
