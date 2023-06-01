// import * as drawFn from "./sketch.js"

const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia

function setup(){
    const canvas = createCanvas(800,600)
    canvas.parent(canvasContainer)
    noLoop()
}

function draw(){
    background(220);
}

if (hasGetUserMedia) {
  await enableCam()
} else {
  console.warn("getUserMedia() is not supported by your browser")
}