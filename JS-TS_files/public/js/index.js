import * as drawFn from "./sketch.js"

const video = document.getElementById("webcam")
const canvasElement = document.getElementById("output_canvas")
const canvasShow = document.querySelector('#hand-detection')
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia
const canvasCtx = canvasElement.getContext("2d");
const canvasShowCtx = canvasShow.getContext('2d')
const canvasHands = document.querySelector('#landmarks')
const drawingCanvas= document.querySelector('#drawing-canvas')
const canvasHandsCtx = canvasHands.getContext('2d')
const drawingCanvasCtx = drawingCanvas.getContext('2d')

const canvasContainer = document.querySelector('#canvas-container')

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