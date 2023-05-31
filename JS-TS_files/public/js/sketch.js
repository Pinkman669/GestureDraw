const canvasContainer = document.querySelector('#canvas-container')
const video = document.getElementById("webcam")
const canvasElement = document.getElementById("output_canvas")
const canvasShow = document.querySelector('#hand-detection')
const canvasCtx = canvasElement.getContext("2d");
const canvasShowCtx = canvasShow.getContext('2d')
const canvasHands = document.querySelector('#landmarks')
const drawingCanvas= document.querySelector('#drawing-canvas')
const canvasHandsCtx = canvasHands.getContext('2d')
const drawingCanvasCtx = drawingCanvas.getContext('2d')

function setup() {
    const canvas = createCanvas(800, 600)
    canvas.parent(canvasContainer)
    noLoop()
}

function draw() {
    background(220);
}

function drawPoint(x, y) {
    point(x,y)
    strokeWeight(10)
    stroke('purple')
}

async function enableCam() {
    // getUsermedia parameters.
    const constraints = {
        video: {
            width: 800,
            height: 600
        }
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", async () => {
            console.log(video.videoHeight)
            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;
            canvasShow.width = video.videoWidth;
            canvasShow.height = video.videoHeight;
            canvasHands.width = video.videoWidth
            canvasHands.height = video.videoHeight
            drawingCanvas.width = video.videoWidth
            drawingCanvas.height = video.videoHeight
            // Take stream picture to server
            setInterval(async () => {
                canvasCtx.drawImage(video, 0, 0)
                const data = canvasElement.toDataURL('image/jpeg')
                console.log("sent")
                const res = await fetch('/', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ frame: data }),
                })
                const result = await res.json()

                // Draw hands shape in other canvas
                canvasHandsCtx.save()
                canvasHandsCtx.clearRect(0, 0, canvasHands.width, canvasHands.height);
                if (result.landmarks) {
                    const landmarks = []
                    let thumbX, thumbY
                    let indexX, indexY
                    for (const marks of result.landmarks) {
                        if (marks[0] == 4) {
                            [thumbX, thumbY] = [marks[1], marks[2]]
                        }
                        if (marks[0] == 8) {
                            [indexX, indexY] = [marks[1], marks[2]]
                        }
                        landmarks.push({ x: marks[1], y: marks[2] })
                    }
                    const centreX = (thumbX + indexX) / 2
                    const centreY = (thumbY + indexY) / 2
                    const fingersDistance = Math.hypot(thumbX * canvasHands.width - indexX * canvasHands.width, thumbY * canvasHands.height - indexY * canvasHands.height)
                    // Draw hand shape
                    drawConnectors(canvasHandsCtx, landmarks, HAND_CONNECTIONS, {
                        color: "#00FF00",
                        lineWidth: 2
                    });
                    // If index and thumb are close
                    if (fingersDistance < 40) {
                        drawLandmarks(canvasHandsCtx, [{ x: centreX, y: centreY }], { color: "#FF0000", lineWidth: 5 });
                        drawPoint(centreX*video.videoWidth, centreY*video.videoHeight)
                    }
                }
                canvasHandsCtx.restore()
            }, 50)
        });
    });
}