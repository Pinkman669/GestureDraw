const canvasContainer = document.querySelector('#canvas-container')
const video = document.getElementById("webcam")
const canvasElement = document.getElementById("output_canvas")
const canvasCtx = canvasElement.getContext("2d");
const canvasHands = document.querySelector('#landmarks')
const drawingCanvas = document.querySelector('#drawing-canvas')
const canvasHandsCtx = canvasHands.getContext('2d')
const drawingCanvasCtx = drawingCanvas.getContext('2d')
const indicator = document.querySelector('#input-indictor')
const undoSign = document.querySelector('#undo-sign')
// Gesture btn
const undoBtn = document.querySelector('#undo-btn')

function setup() {
    const canvas = createCanvas(1280, 720)
    canvas.parent(canvasContainer)
    background(255);
    fill(255)
}

function drawLine(x1, y1, x2, y2) {
    stroke('black')
    strokeWeight(15)
    line(x1, y1, x2, y2)
}

function clearLine(x1, y1, x2, y2) {
    stroke(255)
    strokeWeight(20)
    line(x1, y1, x2, y2)
}

function drawOval(x1, y1, w, h) {
    console.log(w, h)
    stroke('black')
    strokeWeight(10)
    ellipse(x1, y1, w, h)
}

// Clear Canvas btn
undoBtn.addEventListener('click', () => {
    setup()
})

async function enableCam() {
    // getUsermedia parameters.
    const constraints = {
        video: {
            width: 1280,
            height: 720
        }
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", () => {
            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;
            canvasHands.width = video.videoWidth
            canvasHands.height = video.videoHeight
            drawingCanvas.width = video.videoWidth
            drawingCanvas.height = video.videoHeight
            // Take stream picture to server
            let prevX, prevY
            let centreX1, centreY1, centreX2, centreY2
            let drawOvalMode = false
            let undoCounter = 0
            // Reverse img
            canvasCtx.setTransform(-1, 0, 0, 1, canvasElement.width, 0)

            setInterval(async () => {
                canvasCtx.drawImage(video, 0, 0)
                const data = canvasElement.toDataURL('image/jpeg')
                const res = await fetch('/frame', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ frame: data }),
                })
                const result = await res.json()

                // Draw hands shape in other canvas
                // canvasHandsCtx.save()
                canvasHandsCtx.clearRect(0, 0, canvasHands.width, canvasHands.height);
                // Draw line mode (single hand)
                if (result.landmarks.length === 1) {
                    indicator.textContent = "Single Hand"
                    indicator.style.backgroundColor = "green"
                    // Draw hand shape
                    drawConnectors(canvasHandsCtx, result.landmarks[0], HAND_CONNECTIONS, {
                        color: "#00FF00",
                        lineWidth: 2
                    });

                    // If index and thumb are close
                    if (result.checkDraw.check) {
                        const centreX = result.checkDraw.hands_lms_list[0].centre_XY[0]
                        const centreY = result.checkDraw.hands_lms_list[0].centre_XY[1]
                        indicator.textContent = "Drawing Line"
                        indicator.style.backgroundColor = "grey"
                        // Draw mode indicator
                        drawLandmarks(canvasHandsCtx, [{ x: centreX / video.videoWidth, y: centreY / video.videoHeight }], { color: "#FF0000", lineWidth: 5 });
                        if (!prevX && !prevY) {
                            prevX = centreX
                            prevY = centreY
                        }
                        // Painting
                        drawLine(centreX, centreY, prevX, prevY)
                        prevX = centreX
                        prevY = centreY
                    } else if (result.fingersUp.length == 1) {
                        // if (result.fingersUp.includes(8)) {
                            const indexX = result.landmarksInPixel[0][8][1]
                            const indexY = result.landmarksInPixel[0][8][2]
                            if (!prevX && !prevY) {
                                prevX = indexX
                                prevY = indexY
                            }
                            indicator.textContent = "Rubber mode"
                            indicator.style.backgroundColor = "grey"
                            clearLine(result.landmarksInPixel[0][8][1], result.landmarksInPixel[0][8][2], prevX, prevY)
                            drawLandmarks(canvasHandsCtx, [{ x: result.checkDraw.hands_lms_list[0].index_XY[0] / video.videoWidth, y: result.checkDraw.hands_lms_list[0].index_XY[1] / video.videoHeight }],
                                { color: "grey", lineWidth: 3 });
                            prevX = indexX
                            prevY = indexY
                        // }
                    // Undo gesture threshold = 3000ms
                    } else if (result.fingersUp.length == 0){
                        if (undoCounter === 1020){
                            undoSign.textContent = "Undo in 2 Sec"
                            undoSign.classList.remove('output-data')
                        } else if (undoCounter ===2040){
                            undoSign.textContent = "Undo in 1 Sec"
                        } else if (undoCounter === 3000){
                            undoBtn.click()
                            undoSign.classList.add('output-data')
                        }
                        undoCounter += 60
                    } 
                    else {
                        undoSign.classList.add('output-data')
                        undoCounter = 0
                        prevX = 0
                        prevY = 0
                    }
                    // Two hand mode (For drawing circle and square)
                } else if (result.landmarks.length === 2) {
                    indicator.textContent = "Two Hands"
                    indicator.style.backgroundColor = "blue"
                    for (const handLandmark of result.landmarks) {
                        drawConnectors(canvasHandsCtx, handLandmark, HAND_CONNECTIONS, {
                            color: "#0000FF",
                            lineWidth: 2
                        });
                    }
                    if (result.checkDraw.check && result.checkDraw.hands_lms_list.length > 1) {
                        indicator.textContent = "Drawing Circle"
                        indicator.style.backgroundColor = "silver"
                        drawOvalMode = true
                        centreX1 = result.checkDraw.hands_lms_list[0].centre_XY[0]
                        centreY1 = result.checkDraw.hands_lms_list[0].centre_XY[1]
                        centreX2 = result.checkDraw.hands_lms_list[1].centre_XY[0]
                        centreY2 = result.checkDraw.hands_lms_list[1].centre_XY[1]
                        drawLandmarks(canvasHandsCtx, [{ x: centreX1 / video.videoWidth, y: centreY1 / video.videoHeight }],
                            { color: "#FF0000", lineWidth: 5 });
                        drawLandmarks(canvasHandsCtx, [{ x: centreX2 / video.videoWidth, y: centreY2 / video.videoHeight }],
                            { color: "#00FF00", lineWidth: 5 });
                    } else {
                        drawOvalMode = false
                    }
                    if (!drawOvalMode && centreX1 > 0 && centreX2 > 0) {
                        const w = Math.hypot(centreX1 - centreX2)
                        const h = Math.hypot(centreY1 - centreY2)
                        const x1 = (centreX1 + centreX2) / 2
                        const y1 = (centreY1 + centreY2) / 2
                        centreX1 = 0
                        centreY1 = 0
                        centreX2 = 0
                        centreY2 = 0
                        drawOval(x1, y1, w, h)
                    }
                } else {
                    indicator.textContent = "Not detected"
                    indicator.style.backgroundColor = "white"
                }
                // canvasHandsCtx.restore()
            }, 55)
        });
    });
}