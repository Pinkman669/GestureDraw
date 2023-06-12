const challengeImg = document.querySelector('#challenge-photo')
const startGameBtn = document.querySelector('.start-game-btn')
const startBtn = document.querySelector('.start-btn')
const startCountDiv = document.querySelector('#start-count')
const timer = document.querySelector('#timer')
const hasGetUserMedia = async () => !!navigator.mediaDevices?.getUserMedia
const submitBtn = document.querySelector('.submit-btn')
const restartBtn = document.querySelector('#restart-btn')
let webcamWidth, webcamHeight
let challengeIndex = 1
let countDown = 30
let submitClick = false
const trainingMode = false

if (window.innerWidth <= 500) {
  [webcamWidth, webcamHeight] = [400, 600]
} else {
  [webcamWidth, webcamHeight] = [1024, 768]
}
if (hasGetUserMedia()) {
  enableCam(webcamWidth, webcamHeight)
} else {
  console.warn("getUserMedia() is not supported by your browser")
}

// Start game
startGameBtn.addEventListener('click', (e) => {
  let startCount = 3
  // rename class
  startCountDiv.classList.remove('output-data')
  startCountDiv.textContent = ''
  startGameBtn.setAttribute('disabled', '')
  const looper = setInterval(() => {
    if (startCount === 0) {
      startCountDiv.textContent = "Start!!!"
    } else if (startCount === -1) {
      clearInterval(looper)
      startCountDiv.classList.add('output-data')
      startBtn.removeAttribute('disabled')
      submitBtn.removeAttribute('disabled')
      drawingState = true // From sketch.js
      startBtn.textContent = 'Stop'
      startTimer()
      loadChallengePhoto(challengeIndex)
    } else {
      startCountDiv.textContent = startCount
    }
    startCount--
  }, 1000)
})

// reset state
submitBtn.addEventListener('click', (e) => {
  if (challengeIndex <= 4){
    challengeIndex++
    loadChallengePhoto(challengeIndex)
    startGameBtn.removeAttribute('disabled')
    startGameBtn.click()
  } else{
    challengeIndex = 1
  }
  timer.textContent = '30'
  drawingState = false
  submitClick = true
  startBtn.setAttribute('disabled', '')
  submitBtn.setAttribute('disabled', '')
})

// restart game
restartBtn.addEventListener('click', (e)=>{
  startGameBtn.removeAttribute('disabled')
  indicator.textContent = ''
  indicator.style.color = 'black'
  indicator.style.backgroundColor = 'white'
  challengeImg.setAttribute('src', ``)
})

function startTimer(reset = true) {
  const startTime = Date.now()
  const looper = setInterval(() => {
    if (countDown <= 1 || submitClick) {
      // just call submit function
      if (!submitClick){
        submitBtn.click()
      }
      countDown = 30
      clearInterval(looper)
      submitClick = false
    } else {
      const elaspedTime = (Date.now() - startTime) / 1000
      const displayTime = 30 - elaspedTime
      timer.textContent = displayTime.toFixed(0)
      countDown -= 1
    }
  }, 1000)
}

function loadChallengePhoto(index) {
  if (!isNaN(index)) {
    challengeImg.setAttribute('src', `./challenge_photos/challenge-${index}.png`)
  }
}