const challengeSelector = document.querySelector('#challenge-selector')
const challengeImg = document.querySelector('#challenge-photo')
const submitBtn = document.querySelector('.submit-btn')
const trainingMode = true
let webcamWidth, webcamHeight

const hasGetUserMedia = async () => !!navigator.mediaDevices?.getUserMedia

if (window.innerWidth <= 500){
  [webcamWidth, webcamHeight] = [400, 600]
} else {
  [webcamWidth, webcamHeight] = [1024, 768]
}
if (hasGetUserMedia()) {
  enableCam(webcamWidth, webcamHeight, true)
} else {
  console.warn("getUserMedia() is not supported by your browser")
}

challengeSelector.addEventListener('change', (e)=>{
  loadChallengePhoto(e.target.value)
  submitBtn.removeAttribute('disabled')
})

function loadChallengePhoto(index){
  if (!isNaN(index)){
    challengeImg.setAttribute('src', `./challenge_photos/challenge-${index}.png`)
  }
}