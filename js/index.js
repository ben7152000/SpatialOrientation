/**
 * 常數
 */
const FLEX = 'flex'
const NONE = 'none'
const GYRONORTH = 'north'
const GYROEAST = 'east'
const GYROSOUTH = 'south'
const GYROWEST = 'west'
const NORTH = 0
const NORTHEAST = 45
const EAST = 90
const SOUTHEAST = 135
const SOUTH = 180
const SOUTHWEST = 225
const WEST = 270
const NORTHWEST = 315

/**
 * Dom
 */
const mainInfo = document.querySelector('.main-info')
const gameInfo = document.querySelector('.game-info')
const resultInfo = document.querySelector('.result-info')
const start = document.querySelector('.start')
const restart = document.querySelector('.restart')
const time = document.querySelector('.time')
const timerBar = document.querySelector('.timer-bar')
const aircraft1 = document.querySelector('#aircraft-1')
const aircraft2 = document.querySelector('#aircraft-2')
const aircraft3 = document.querySelector('#aircraft-3')
const aircraft4 = document.querySelector('#aircraft-4')
const checkTrue = document.querySelector('#check-true')
const checkFail = document.querySelector('#check-fail')
const instrumentGyro = document.querySelector('#instrument-gyro')
const instrumentRbi = document.querySelector('#instrument-rbi')
const correctResult = document.querySelector('#correct')
const incorrectResult = document.querySelector('#incorrect')
const performance = document.querySelector('#performance')

/**
 * 變數
 */
const directions = [GYRONORTH, GYROEAST, GYROSOUTH, GYROWEST]
const rbis = [NORTH, NORTHEAST, EAST, SOUTHEAST, SOUTH, SOUTHWEST, WEST, NORTHWEST]
let correct = 0
let incorrect = 0
let performanceRate = 0
const gameTime = 3 // 分鐘
const delayCheckTime = 1 // 秒
let currentDrag = null
let resultNumber = 0
const imgGyro = document.createElement("img")
const imgRbi = document.createElement("img")
const answerParams = {
  direction: '',
  rbi: 0,
  number: 0
}

/**
 * 監聽
 */
start.addEventListener('click', startClickHandler)
restart.addEventListener('click', restartClickHandler)

/**
 * 進到介紹介面
 */
function goToInstructionPage() {
  resultInfo.style.display = NONE
  mainInfo.style.display = FLEX
}

/**
 * 進到遊戲介面
 */
function goToGamePage() {
  mainInfo.style.display = NONE
  gameInfo.style.display = FLEX
}

/**
 * 進到結果介面
 */
function goToResultPage() {
  gameInfo.style.display = NONE
  resultInfo.style.display = FLEX
}

/**
    重新開始
 */
function restartClickHandler() {
  goToInstructionPage()
  resetResult()
}

/**
 * 輸出結果
 */
function outputResult() {
  performanceRate = correct * 2
  correctResult.innerHTML = `${correct.toString()}`
  incorrectResult.innerHTML = `${incorrect.toString()}`
  performance.innerHTML = `${performanceRate.toString()}%`
}

/**
    重置結果數據
 */
function resetResult() {
  correct = 0
  incorrect = 0
  performanceRate = 0
  timerBar.style.width = '0'
}

/**
 * 開始遊戲
 */
function startClickHandler() {
  goToGamePage()
  startCountdown(gameTime)
  randomDirection()
  randomRbi()
  getCorrectPosition()
  if (Math.floor(gameTime) === 1) {
    time.innerHTML = `${Math.floor(gameTime)} minute to go`
  } else {
    time.innerHTML = `${Math.floor(gameTime)} minutes to go`
  }
}

/**
 * 隨機取值
 */
function randomSymbol(array) {
  return Math.floor(Math.random() * array.length)
}

/**
 * 拖曳物件
 */
function objectMove(object, left, top) {
  object.onmousedown = function(e) {
    let shiftX = e.clientX - object.getBoundingClientRect().left
    let shiftY = e.clientY - object.getBoundingClientRect().top

    document.body.append(object)

    function moveAt(pageX, pageY) {
      object.style.left = pageX - shiftX + 'px'
      object.style.top = pageY - shiftY + 'px'
    }

    moveAt(e.pageX, e.pageY)

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY)

      object.hidden = true
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      object.hidden = false

      if (!elemBelow) return

      let droppableOne = elemBelow.closest('.one');
      let droppableTwo = elemBelow.closest('.two');
      let droppableThree = elemBelow.closest('.three');
      let droppableFour = elemBelow.closest('.four');
      let droppableFive = elemBelow.closest('.five');
      let droppableSix = elemBelow.closest('.six');
      let droppableSeven = elemBelow.closest('.seven');
      let droppableEight = elemBelow.closest('.eight');
      const droppableBelows = [droppableOne, droppableTwo, droppableThree, droppableFour, droppableFive, droppableSix, droppableSeven, droppableEight]
      const filterDroppableBelow = droppableBelows.filter(Boolean)
      if (filterDroppableBelow.includes(currentDrag)) return
      // if (currentDrag) {
        // leaveDroppable(currentDrag)
      // }

      currentDrag = filterDroppableBelow[0]
      // if (currentDrag) {
        // enterDroppable(currentDrag)
      // }
    }

    document.addEventListener('mousemove', onMouseMove)

    object.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove)
      object.onmouseup = null

      if (!currentDrag) return
      const checkPosition = checkClassName(currentDrag.className)
      object.style.left = checkPosition.left + 'px'
      object.style.top = checkPosition.top + 'px'
      resultNumber = checkPosition.number
      checkAnswer()

      setTimeout(() => {
        resetAircraft(object, left, top)
        // leaveDroppable(currentDrag)
        randomDirection()
        randomRbi()
        getCorrectPosition()
      }, delayCheckTime * 1000)
    }
  }

  // function enterDroppable(elem) {
  //   elem.style.background = 'pink';
  // }
  //
  // function leaveDroppable(elem) {
  //   elem.style.background = '';
  // }

  object.ondragstart = function() {
    return false
  }
}

/**
 * 重置飛機位置
 */
function resetAircraft(object, left, top) {
  gameInfo.append(object)
  object.style.left = left + 'px'
  object.style.top = top + 'px'
}

/**
 * 吸附選擇位置
 */
function checkClassName(className) {
  switch (className) {
    case 'one':
      return { left: 854, top: 457, number: 1 }
    case 'two':
      return { left: 914, top: 457, number: 2 }
    case 'three':
      return { left: 914, top: 517, number: 3 }
    case 'four':
      return { left: 914, top: 579, number: 4 }
    case 'five':
      return { left: 854, top: 579, number: 5 }
    case 'six':
      return { left: 792, top: 579, number: 6 }
    case 'seven':
      return { left: 792, top: 517, number: 7 }
    case 'eight':
      return { left: 792, top: 457, number: 8 }
  }
}

/**
 * 檢查答案
 */
function checkAnswer() {
  if (answerParams.number === resultNumber) {
    trueAnswer()
  } else {
    failAnswer()
  }
}

/**
 * 隨機取方向圖片
 */
function randomDirection() {
  const direction = directions[randomSymbol(directions)]
  answerParams.direction = direction
  imgGyro.src = `./assets/${direction}.png`
  instrumentGyro.append(imgGyro)
}

/**
 * 隨機取RBI圖片
 */
function randomRbi() {
  const rbi = rbis[randomSymbol(rbis)]
  answerParams.rbi = rbi
  imgRbi.src = `./assets/${rbi}.png`
  instrumentRbi.append(imgRbi)
}

/**
 * 獲取正確的位置
 */
function getCorrectPosition() {
  if (answerParams.direction === GYRONORTH) {
    switch (answerParams.rbi) {
      case 0:
        return answerParams.number = 5
      case 45:
        return answerParams.number = 6
      case 90:
        return answerParams.number = 7
      case 135:
        return answerParams.number = 8
      case 180:
        return answerParams.number = 1
      case 225:
        return answerParams.number = 2
      case 270:
        return answerParams.number = 3
      case 315:
        return answerParams.number = 4
      default:
        return answerParams.number = 0
    }
  }
  if (answerParams.direction === GYROEAST) {
    switch (answerParams.rbi) {
      case 0:
        return answerParams.number = 7
      case 45:
        return answerParams.number = 8
      case 90:
        return answerParams.number = 1
      case 135:
        return answerParams.number = 2
      case 180:
        return answerParams.number = 3
      case 225:
        return answerParams.number = 4
      case 270:
        return answerParams.number = 5
      case 315:
        return answerParams.number = 6
      default:
        return answerParams.number = 0
    }
  }
  if (answerParams.direction === GYROSOUTH) {
    switch (answerParams.rbi) {
      case 0:
        return answerParams.number = 1
      case 45:
        return answerParams.number = 2
      case 90:
        return answerParams.number = 3
      case 135:
        return answerParams.number = 4
      case 180:
        return answerParams.number = 5
      case 225:
        return answerParams.number = 6
      case 270:
        return answerParams.number = 7
      case 315:
        return answerParams.number = 8
      default:
        return answerParams.number = 0
    }
  }
  if (answerParams.direction === GYROWEST) {
    switch (answerParams.rbi) {
      case 0:
        return answerParams.number = 3
      case 45:
        return answerParams.number = 4
      case 90:
        return answerParams.number = 5
      case 135:
        return answerParams.number = 6
      case 180:
        return answerParams.number = 7
      case 225:
        return answerParams.number = 8
      case 270:
        return answerParams.number = 1
      case 315:
        return answerParams.number = 2
      default:
        return answerParams.number = 0
    }
  }
}

/**
 * 選擇正確
 */
function trueAnswer() {
  checkTrue.style.display = FLEX
  correct++

  setTimeout(() => {
    checkTrue.style.display = NONE
  }, delayCheckTime * 1000)
}

/**
 * 選擇錯誤
 */
function failAnswer() {
  checkFail.style.display = FLEX
  incorrect++

  setTimeout(() => {
    checkFail.style.display = NONE
  }, delayCheckTime * 1000)
}

/**
 * 飛機拖曳
 */
objectMove(aircraft1, 570,380)
objectMove(aircraft2, 640, 380)
objectMove(aircraft3, 570, 450)
objectMove(aircraft4, 640, 450)

/**
 *  倒數計時
 */
function startCountdown(duration) {
  let timer = duration * 60
  let timeWidth = 100

  function updateCountdown() {
    const minutes = Math.floor(timer / 60)

    if ((minutes + 1) === 1) {
      time.innerHTML = `${(minutes + 1).toString()} minute to go`
    } else {
      time.innerHTML = `${(minutes + 1).toString()} minutes to go`
    }

    if (timeWidth >= 0) {
      timerBar.style.width = `${timeWidth}%`
      timeWidth -= 100 / (gameTime * 60)
    }

    if (timer === 0) {
      goToResultPage()
      outputResult()
      clearInterval(interval)
      resetAircraft(aircraft1, 570,380)
      resetAircraft(aircraft2, 640, 380)
      resetAircraft(aircraft3, 570, 450)
      resetAircraft(aircraft4, 640, 450)
    } else {
      timer--
    }
  }

  updateCountdown()
  const interval = setInterval(updateCountdown, 1000)
}

