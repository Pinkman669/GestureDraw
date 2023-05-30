import {
  HandLandmarker,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

let handLandmarker = undefined;

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numHands: 2
  });
};
createHandLandmarker();

const video = document.getElementById("webcam")
const canvasElement = document.getElementById("output_canvas")
const canvasShow = document.querySelector('#hand-detection')
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia
const canvasCtx = canvasElement.getContext("2d");
const canvasShowCtx = canvasShow.getContext('2d')
let webcamRunning = true

if (hasGetUserMedia) {
  enableCam()
} else {
  console.warn("getUserMedia() is not supported by your browser")
}

async function enableCam() {
  // getUsermedia parameters.
  const constraints = {
    video: true
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", async () => {
      canvasElement.style.width = video.videoWidth;
      canvasElement.style.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;

      // const URI = `data:image/jpeg;base64,${result.handDetection}`
      // const imageData = await convertURIToImageData(URI)
      // const newFrame = await createImageBitmap(imageData)
      // document.querySelector('#hand-detection').setAttribute('src', `data:image/jpeg;base64,${result.handDetection}`)
      // canvasShowCtx.drawImage(newFrame, 0, 0, video.videoWidth, video.videoHeight)
      // setInterval(async () => {
        // }, 1000)
        for (let i = 0; i < 15; i++){
          canvasCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
          const data = canvasElement.toDataURL('image/jpeg', 0.5)
          console.log("sent")
          const res = await fetch('/', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ frame: data }),
          })
          const result = await res.json()
          document.querySelector('#hand-img').setAttribute('src', `data:image/jpeg;base64,${result.handDetection}`)
      }
    });
  });
}

function convertURIToImageData(URI) {
  return new Promise(function (resolve, reject) {
    if (URI == null) return reject();
    const canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      image = new Image();
    image.addEventListener('load', function () {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(context.getImageData(0, 0, canvas.width, canvas.height));
    }, false);
    image.src = URI;
  });
}

// Frontend hand tracking testing
let lastVideoTime = -1;
let results = undefined;
async function predictWebcam() {
  canvasElement.style.width = video.videoWidth;
  canvasElement.style.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvasElement.height = video.videoHeight;

  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = handLandmarker.detectForVideo(video, startTimeMs);
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      const { x: thumbX, y: thumbY, z: thumbZ } = landmarks[4]
      const { x: indexX, y: indexY, z: indexZ } = landmarks[8]
      const centreX = (thumbX + indexX) / 2
      const centreY = (thumbY + indexY) / 2

      const fingers_distance = Math.hypot(thumbX * video.videoWidth - indexX * video.videoWidth, thumbY * video.videoHeight - indexY * video.videoHeight)
      if (fingers_distance < 50) {
        drawLandmarks(canvasCtx, [{ x: centreX, y: centreY }], { color: "#FF0000", lineWidth: 2 });
      }

      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5
      });
      // drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
    }
  }
  canvasCtx.restore();

  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }
}