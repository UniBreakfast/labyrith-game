const drawStepDuration = 10
const palette = {
  wall: 'green',
  floor: '#531',
  player: 'orange',
}
const config = {
  tileSize: 32,
  rowCount: 10,
  // columnCount: 10,
}
const tileCoding = {
  0: 'floor',
  1: 'wall',
}
const moveShifts = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}
const keyMapping = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
}
const gameState = {
  map: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  player: { x: 4, y: 7 },
}
const bodyPadding = parseInt(getComputedStyle(body).padding)
const { canvas, ctx } = prepareCanvas()

render()

onkeydown = handleKeyDown

function prepareCanvas() {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  setTimeout(updateCanvasSize)
  body.append(canvas)

  onresize = updateCanvasSize

  return { canvas, ctx }
}

function updateCanvasSize() {
  const minSide = Math.min(innerWidth, innerHeight) - 2 * bodyPadding

  canvas.width = minSide
  canvas.height = minSide

  config.tileSize = minSide / config.rowCount

  render()
}

async function render() {
  await darkenScreen()
  await drawMap()
  await drawPlayer()
}

async function darkenScreen() {
  await pause(drawStepDuration)
  
  ctx.fillStyle = '#0004'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

async function drawMap() {
  const { map } = gameState
  const { rowCount } = config

  for (let y = 0; y < rowCount; y++) {
    const row = map[y]

    for (let x = 0; x < rowCount; x++) {
      const tileCode = row[x]

      await drawTile(tileCode, x, y)
    }
  }
}

async function drawTile(code, x, y) {
  const { tileSize } = config
  const tileType = tileCoding[code]
  const color = palette[tileType]

  await pause(drawStepDuration)
  
  ctx.fillStyle = color
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
}

async function drawPlayer() {
  const { x, y } = gameState.player
  const color = palette.player

  await drawSpot(x, y, color)
}

async function drawSpot(x, y, color) {
  const { tileSize } = config
  const radius = tileSize / 2
  const cx = x * tileSize + radius
  const cy = y * tileSize + radius

  await pause(drawStepDuration)
  
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI)
  ctx.fill()
}

function pause(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

function handleKeyDown(e) {
  const { key } = e
  const command = keyMapping[key]

  if (!command) return

  move(command)
  render()
}

function move(direction) {
  const { player} = gameState
  const shift = moveShifts[direction]
  const x = player.x + shift.x
  const y = player.y + shift.y

  if (!canMove(x, y)) return
  
  player.x = x
  player.y = y
}

function canMove(x, y) {
  return gameState.map[y][x] === 0
}
