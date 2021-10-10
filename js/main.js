import BLOCKS from './blocks.js'

// DOM
const playground = document.querySelector('.playground > ul')

// Setting
const GAME_ROWS = 20
const GAME_COLS = 10

// variables
let score = 0
let duration = 500
let downInterval
let tempMovinngItem

const movingItem = {
  type: 'elRight',
  direction: 0,
  top: 0,
  left: 0,
}

// functions
const init = () => {
  tempMovinngItem = { ...movingItem }

  for (let i = 0; i < GAME_ROWS; i++) {
    prependNewLine()
  }
  renderBlocks()
}

const prependNewLine = () => {
  const li = document.createElement('li')
  const ul = document.createElement('ul')
  for (let j = 0; j < GAME_COLS; j++) {
    const matrix = document.createElement('li')
    ul.prepend(matrix)
  }
  li.prepend(ul)
  playground.prepend(li)
}

const renderBlocks = (moveType = '') => {
  const { type, direction, top, left } = tempMovinngItem
  const movingBlocks = document.querySelectorAll('.moving')
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, 'moving')
  })
  BLOCKS[type][direction].some((block) => {
    const x = block[0] + left
    const y = block[1] + top
    const target = playground.childNodes[y]
      ? playground.childNodes[y].childNodes[0].childNodes[x]
      : null
    const isAvailable = checkEmpty(target)
    if (isAvailable) {
      target.classList.add(type, 'moving')
    } else {
      tempMovinngItem = { ...movingItem }
      setTimeout(() => {
        renderBlocks()
        if (moveType === 'top') {
          seizeBlock()
        }
      }, 0)
      return true
    }
  })
  movingItem.left = left
  movingItem.top = top
  movingItem.direction = direction
}

const seizeBlock = () => {
  const movingBlocks = document.querySelectorAll('.moving')
  movingBlocks.forEach((moving) => {
    moving.classList.remove('moving')
    moving.classList.add('seized')
  })
  generateNewBlock()
}

const generateNewBlock = () => {
  const blockArray = Object.entries(BLOCKS)
  const randomIndex = Math.floor(Math.random() * blockArray.length)
  movingItem.type = blockArray[randomIndex][0]
  movingItem.top = 0
  movingItem.left = 3
  movingItem.direction = 0
  tempMovinngItem = { ...movingItem }
  renderBlocks()
}

const checkEmpty = (target) => {
  if (!target || target.classList.contains('seized')) {
    return false
  }
  return true
}

const moveBlock = (moveType, amount) => {
  tempMovinngItem[moveType] += amount
  renderBlocks(moveType)
}

const chageDirection = () => {
  const direction = tempMovinngItem.direction
  direction === 3
    ? (tempMovinngItem.direction = 0)
    : (tempMovinngItem.direction += 1)
  renderBlocks()
}

// event handling
document.addEventListener('keydown', (e) => {
  switch (e.keyCode) {
    case 39:
      moveBlock('left', 1)
      break
    case 37:
      moveBlock('left', -1)
      break
    case 40:
      moveBlock('top', 1)
      break
    case 38:
      chageDirection()
      break
    default:
      break
  }
  console.log(e.keyCode)
})

init()
