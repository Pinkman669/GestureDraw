const challengeSelector = document.querySelector('#challenge-selector')
const challengeImg = document.querySelector('#challenge-photo')
const hasGetUserMedia = async () => !!navigator.mediaDevices?.getUserMedia
const submitBtn = document.querySelector('.submit-btn')

if (hasGetUserMedia()) {
    enableCam()
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