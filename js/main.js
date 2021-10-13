import BLOCKS from './blocks.js'

// DOM
const playground = document.querySelector('.playground > ul')
const gametext = document.querySelector('.game-text')
const gamestoptext = document.querySelector('.game-stop-text')
const restartbutton = document.querySelector('.game-text > button')
const stopRestartButton = document.querySelector('.game-stop-text > button')
const scoreText = document.querySelector('.score')

// Setting
const GAME_ROWS = 20
const GAME_COLS = 10

// variables
let score = 0
let duration = 500
let downInterval
let tempMovinngItem

const movingItem = {
  type: '',
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
  generateNewBlock()
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
      if (moveType === 'retry') {
        clearInterval(downInterval)
        showGameOverText()
      }
      tempMovinngItem = { ...movingItem }
      setTimeout(() => {
        renderBlocks('retry')
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

const showGameOverText = () => {
  gametext.style.display = 'flex'
}

const seizeBlock = () => {
  const movingBlocks = document.querySelectorAll('.moving')
  movingBlocks.forEach((moving) => {
    moving.classList.remove('moving')
    moving.classList.add('seized')
  })
  checkMatch()
}

const checkMatch = () => {
  const childNodes = playground.childNodes
  childNodes.forEach((child) => {
    let matched = true
    child.childNodes[0].childNodes.forEach((li) => {
      if (!li.classList.contains('seized')) {
        matched = false
      }
    })
    if (matched) {
      child.remove()
      prependNewLine()
      chagneScore()
    }
  })
  generateNewBlock()
}

const chagneScore = () => {
  scoreText.innerHTML = score += 10
}

const generateNewBlock = () => {
  clearInterval(downInterval)
  downInterval = setInterval(() => {
    moveBlock('top', 1)
  }, duration)
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

const droplook = () => {
  clearInterval(downInterval)
  downInterval = setInterval(() => {
    moveBlock('top', 1)
  }, 10)
}

const gameStop = () => {
  clearInterval(downInterval)
  gamestoptext.style.display = 'flex'
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
    case 32:
      droplook()
      break
    default:
      break
  }
  console.log(e.keyCode)
})

init()

// event
restartbutton.addEventListener('click', () => {
  playground.innerHTML = ''
  gametext.style.display = 'none'
  init()
})
