/**
 * 常數
 */
const FLEX = 'flex'
const NONE = 'none'
const VISIBLE = 'visible'
const HIDDEN = 'hidden'
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
const gyroNorth = document.querySelector('.gyro-north')
const gyroEast = document.querySelector('.gyro-east')
const gyroSouth = document.querySelector('.gyro-south')
const gyroWest = document.querySelector('.gyro-west')
const rbiNorth = document.querySelector('.rbi-0')
const rbiNorthEast = document.querySelector('.rbi-45')
const rbiEast = document.querySelector('.rbi-90')
const rbiSouthEast = document.querySelector('.rbi-135')
const rbiSouth = document.querySelector('.rbi-180')
const rbiSouthWest = document.querySelector('.rbi-225')
const rbiWest = document.querySelector('.rbi-270')
const rbiNorthWest = document.querySelector('.rbi-315')
const numberZones = document.querySelector('.number-zones')
const correctResult = document.querySelector('#correct')
const incorrectResult = document.querySelector('#incorrect')
const performance = document.querySelector('#performance')
const loginInfo = document.querySelector('.login-info')
const login = document.querySelector('.login')
const account = document.querySelector('#account')
const password = document.querySelector('#password')

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
const answerParams = {
  direction: '',
  rbi: 0,
  number: 0
}
const userInfo = {
  account: 'FTTW',
  password: 'Afttw4785',
}

/**
 * 監聽
 */
start.addEventListener('click', startClickHandler)
restart.addEventListener('click', restartClickHandler)
login.addEventListener('click', loginHandler)

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
 * 登入
 */
function loginHandler() {
  const userAccount = account.value
  const userPassword = password.value

  if (userAccount === userInfo.account && userPassword === userInfo.password) {
    goToInstructionPage()
    loginInfo.style.display = NONE
  } else {
    alert('帳號或密碼錯誤')
  }
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
      numberZones.append(object)
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
      return { left: 60, top: 0, number: 1 }
    case 'two':
      return { left: 120, top: 0, number: 2 }
    case 'three':
      return { left: 120, top: 60, number: 3 }
    case 'four':
      return { left: 120, top: 120, number: 4 }
    case 'five':
      return { left: 60, top: 120, number: 5 }
    case 'six':
      return { left: 0, top: 120, number: 6 }
    case 'seven':
      return { left: 0, top: 60, number: 7 }
    case 'eight':
      return { left: 0, top: 0, number: 8 }
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
  const gyroImages = [gyroNorth, gyroEast, gyroSouth, gyroWest]
  answerParams.direction = direction
  hideAllImages(gyroImages)
  showImage(direction, gyroImages)
}

/**
 * 隨機取RBI圖片
 */
function randomRbi() {
  const rbi = rbis[randomSymbol(rbis)]
  const ribImages = [rbiNorth, rbiNorthEast, rbiEast, rbiSouthEast, rbiSouth, rbiSouthWest, rbiWest, rbiNorthWest]
  answerParams.rbi = rbi
  hideAllImages(ribImages)
  showImage(rbi, ribImages)
}

/**
 * 判斷圖形隱藏圖片
 */
function hideAllImages(images) {
  images.forEach(image => {
    hiddenImages(image)
  })
}

/**
 * 判斷圖形顯示圖片
 */
function showImage(ImageType, images) {
  switch (ImageType) {
    case GYRONORTH:
      visibleImages(images[0]);
      break;
    case GYROEAST:
      visibleImages(images[1]);
      break;
    case GYROSOUTH:
      visibleImages(images[2]);
      break;
    case GYROWEST:
      visibleImages(images[3]);
      break;
    case NORTH:
      visibleImages(images[0]);
      break;
    case NORTHEAST:
      visibleImages(images[1]);
      break;
    case EAST:
      visibleImages(images[2]);
      break;
    case SOUTHEAST:
      visibleImages(images[3]);
      break;
    case SOUTH:
      visibleImages(images[4]);
      break;
    case SOUTHWEST:
      visibleImages(images[5]);
      break;
    case WEST:
      visibleImages(images[6]);
      break;
    case NORTHWEST:
      visibleImages(images[7]);
      break;
    default:
      break;
  }
}

/**
 * 隱藏圖片
 */
function hiddenImages(object) {
  object.style.visibility = HIDDEN
}

/**
 * 顯示圖片
 */
function visibleImages(object) {
  object.style.visibility = VISIBLE
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
objectMove(aircraft1, 590,400)
objectMove(aircraft2, 650, 400)
objectMove(aircraft3, 590, 460)
objectMove(aircraft4, 650, 460)

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
      resetAircraft(aircraft1, 590,400)
      resetAircraft(aircraft2, 650, 400)
      resetAircraft(aircraft3, 590, 460)
      resetAircraft(aircraft4, 650, 460)
    } else {
      timer--
    }
  }

  updateCountdown()
  const interval = setInterval(updateCountdown, 1000)
}

