const challengeImg = document.querySelector('#challenge-photo')
const startGameBtn = document.querySelector('.start-game-btn')
const startBtn = document.querySelector('.start-btn')
const startCountDiv = document.querySelector('#start-count')
const timer = document.querySelector('#timer')
const hasGetUserMedia = async () => !!navigator.mediaDevices?.getUserMedia
const submitBtn = document.querySelector('.submit-btn')
let webcamWidth, webcamHeight
let challengeIndex = 1
let countDown = 10
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

// Submit challenge
submitBtn.addEventListener('click', () => {
  if (challengeIndex <= 2){
    challengeIndex++
    loadChallengePhoto(challengeIndex)
    startGameBtn.removeAttribute('disabled')
    startGameBtn.click()
  }
  timer.textContent = '10'
  drawingState = false
  submitClick = true
  startBtn.setAttribute('disabled', '')
  submitBtn.setAttribute('disabled', '')
})

function startTimer(reset = true) {
  const startTime = Date.now()
  const looper = setInterval(() => {
    if (countDown <= 1 || submitClick) {
      if (!submitClick){
        submitBtn.click()
      }
      countDown = 10
      clearInterval(looper)
      submitClick = false
    } else {
      const elaspedTime = (Date.now() - startTime) / 1000
      const displayTime = 10 - elaspedTime
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