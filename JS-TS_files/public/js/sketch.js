const canvasContainer = document.querySelector('#canvas-container')
const video = document.getElementById("webcam")
const canvasElement = document.getElementById("output_canvas")
const canvasCtx = canvasElement.getContext("2d");
const canvasHands = document.querySelector('#landmarks')
const drawingCanvas = document.querySelector('#drawing-canvas')
const canvasHandsCtx = canvasHands.getContext('2d')
const drawingCanvasCtx = drawingCanvas.getContext('2d')

function setup() {
    const canvas = createCanvas(800, 600)
    canvas.parent(canvasContainer)
    background(220);
}

function drawLine(x1, y1, x2, y2) {
    stroke('purple')
    strokeWeight(15)
    line(x1, y1, x2, y2)
}

function drawOval(x1, y1, w, h) {
    console.log(w, h)
    stroke('black')
    strokeWeight(2)
    ellipse(x1, y1, w, h)
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
            canvasHands.width = video.videoWidth
            canvasHands.height = video.videoHeight
            drawingCanvas.width = video.videoWidth
            drawingCanvas.height = video.videoHeight
            // Take stream picture to server
            let prevX, prevY
            let centreX1, centreY1, centreX2, centreY2
            let drawOvalMode = false
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
                // canvasHandsCtx.save()
                canvasHandsCtx.clearRect(0, 0, canvasHands.width, canvasHands.height);
                // Draw line mode (single hand)
                if (result.landmarks.length === 1) {
                    // Draw hand shape
                    drawConnectors(canvasHandsCtx, result.landmarks[0], HAND_CONNECTIONS, {
                        color: "#00FF00",
                        lineWidth: 2
                    });
                    // If index and thumb are close
                    if (result.checkDraw.check) {
                        const centreX = result.checkDraw.hands_lms_list[0].centre_XY[0]
                        const centreY = result.checkDraw.hands_lms_list[0].centre_XY[1]
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

                    } else {
                        prevX = 0
                        prevY = 0
                    }
                    // Two hand mode (For drawing circle and square)
                } else if (result.landmarks.length === 2) {
                    for (const handLandmark of result.landmarks) {
                        drawConnectors(canvasHandsCtx, handLandmark, HAND_CONNECTIONS, {
                            color: "#0000FF",
                            lineWidth: 2
                        });
                    }
                    if (result.checkDraw.check && result.checkDraw.hands_lms_list.length > 1) {
                        drawOvalMode = true
                        centreX1 = result.checkDraw.hands_lms_list[0].centre_XY[0]
                        centreY1 = result.checkDraw.hands_lms_list[0].centre_XY[1]
                        centreX2 = result.checkDraw.hands_lms_list[1].centre_XY[0]
                        centreY2 = result.checkDraw.hands_lms_list[1].centre_XY[1]
                        drawLandmarks(canvasHandsCtx, [{ x: centreX1 / video.videoWidth, y: centreY1 / video.videoHeight }],
                            { color: "#FF0000", lineWidth: 5 });
                        drawLandmarks(canvasHandsCtx, [{ x: centreX2 / video.videoWidth, y: centreY2 / video.videoHeight }],
                            { color: "#00FF00", lineWidth: 5 });
                    } else{
                        drawOvalMode = false
                    }
                    if (!drawOvalMode && centreX1 > 0 && centreX2 > 0){
                        const w = Math.hypot(centreX1 - centreX2)
                        const h = Math.hypot(centreY1 - centreY2)
                        const x1 =  (centreX1 + centreX2) / 2
                        const y1 = (centreY1 + centreY2) / 2
                        centreX1 = 0
                        centreY1 = 0
                        centreX2 = 0
                        centreY2 = 0
                        drawOval(x1,y1,w, h)
                    }
                }
                // canvasHandsCtx.restore()
            }, 50)
        });
    });
}