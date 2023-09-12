// Declare variables
const canvasContainer = document.querySelector('#p5-canvas-container')
const video = document.getElementById("webcam")
const canvasElement = document.getElementById("output_canvas")
const canvasCtx = canvasElement.getContext("2d");
const canvasHands = document.querySelector('#landmarks')
const canvasHandsCtx = canvasHands.getContext('2d')
const indicator = document.querySelector('#input-indictor')
const undoSign = document.querySelector('#undo-sign')
const startBtn = document.querySelector('.start-btn')
const submitBtn = document.querySelector('.submit-btn')
const scoreBtn = document.querySelector('#score-btn')
const scoreBoard = document.querySelector('#score-board')
const exitBtn = document.querySelector('.exit-btn')
const undoBtn = document.querySelector('#undo-btn')
const frameIntervel = 70

let challengeIndex = 1
const submissionSet = new Map()


// Drawing status
let drawingState = false

// Get windows width and height
let canvasWidth, canvasHeight
if (window.innerWidth <= 500) {
    [canvasWidth, canvasHeight] = [400, 600]
} else {
    [canvasWidth, canvasHeight] = [1024, 768]
}

// Set up p5js
function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight)
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
    stroke('black')
    strokeWeight(10)
    ellipse(x1, y1, w, h)
}

// Clear Canvas btn
undoBtn.addEventListener('click', () => {
    setup()
})

// Start Btn
startBtn.addEventListener('click', () => {
    if (drawingState) {
        drawingState = false
        startBtn.textContent = 'Start'
    } else {
        drawingState = true
        startBtn.textContent = 'Stop'
    }
})

// Leave Btn
exitBtn.addEventListener('click', ()=>{
    window.location = './index.html'
})

async function enableCam(webcamWidth, webcamHeight, trainingMode = false) {
    // Submit challenge
    submitBtn.addEventListener('click', async () => {
        drawingState = false
        startBtn.textContent = 'Start'
        const data = document.querySelector('#defaultCanvas0').toDataURL('image/png')
        // training mode
        if (trainingMode) {
            const challenge = document.querySelector('#challenge-selector').value 
            const res = await fetch('/game/training', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ submission: data, challenge: challenge}),
            })

            const result = await res.json()
            if (result.success) {
                scoreBoard.innerHTML = ``
                scoreBoard.innerHTML += `<div>Your score: ${result.score}</div>`
                scoreBtn.click()
            }
            // count-down mode
        } else {
            if (challengeIndex === 5) {
                submissionSet.set(`challenge${challengeIndex}`, data)
                const username = sessionStorage.getItem('username') || 'Guest'
                const res = await fetch('/game/count-down', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ submissionSet: Object.fromEntries(submissionSet), username: username }),
                })

                submissionSet.clear()
                challengeIndex = 1
                const result = await res.json()
                if (result.success) {
                    scoreBoard.innerHTML = ``
                    scoreBoard.innerHTML += `<div> Your name: ${result.username}</div>
                                            <div> Your score: ${result.score}</div>
                                            <div> Your rank: ${result.rank}</div>
                                            `
                    scoreBtn.click()
                }
            } else {
                submissionSet.set(`challenge${challengeIndex}`, data)
                challengeIndex++
            }
        }
        setup()
        indicator.textContent = "submitted"
        indicator.style.backgroundColor = "black"
        indicator.style.color = "white"
    })

    // save image
    if (trainingMode){
        const saveBtn = document.querySelector('.save-btn')
        saveBtn.addEventListener('click', ()=>{
            const link = document.createElement('a')
            link.href = document.querySelector('#defaultCanvas0').toDataURL('image/png')
            link.setAttribute('download', 'hand-drawing')
            link.style.display = 'none'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            delete(link)
        })
    }

    // getUsermedia parameters.
    const constraints = {
        video: {
            width: webcamWidth,
            height: webcamHeight
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
            // Take stream picture to server
            let prevX, prevY
            let centreX1, centreY1, centreX2, centreY2
            let drawOvalMode = false
            let undoCounter = 0
            // Reverse img
            canvasCtx.setTransform(-1, 0, 0, 1, canvasElement.width, 0)

            setInterval(async () => {
                if (drawingState) {
                    canvasCtx.drawImage(video, 0, 0)
                    const data = canvasElement.toDataURL('image/jpeg', 0.5)
                    const res = await fetch('/game/frame', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ frame: data }),
                    })
                    const result = await res.json()

                    // Draw hands shape in other canvas
                    canvasHandsCtx.save();
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
                        // Check undo gesture
                        if (result.fingersUp.length == 0) {
                            // Undo gesture threshold = 3000ms
                            if (undoCounter === 1020) {
                                undoSign.textContent = "Undo in 2 Sec"
                                undoSign.classList.remove('output-data')
                            } else if (undoCounter === 2040) {
                                undoSign.textContent = "Undo in 1 Sec"
                            } else if (undoCounter === 3000) {
                                undoBtn.click()
                                undoSign.classList.add('output-data')
                            }
                            undoCounter += frameIntervel

                        } else {
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
                                const fingerIndex = result.fingersUp[0]
                                const fingerX = result.landmarksInPixel[0][fingerIndex][1]
                                const fingerY = result.landmarksInPixel[0][fingerIndex][2]
                                if (!prevX && !prevY) {
                                    prevX = fingerX
                                    prevY = fingerY
                                }
                                indicator.textContent = "Rubber mode"
                                indicator.style.backgroundColor = "grey"
                                clearLine(result.landmarksInPixel[0][fingerIndex][1], result.landmarksInPixel[0][fingerIndex][2], prevX, prevY)
                                drawLandmarks(canvasHandsCtx, [{ x: result.landmarksInPixel[0][fingerIndex][1] / video.videoWidth, y: result.landmarksInPixel[0][fingerIndex][2] / video.videoHeight }],
                                    { color: "grey", lineWidth: 3 });
                                prevX = fingerX
                                prevY = fingerY
                            }
                            else {
                                undoSign.classList.add('output-data')
                                undoCounter = 0
                                prevX = 0
                                prevY = 0
                            }
                        }
                    }
                    // Two hand mode (For drawing circle and square)
                    // else if (result.landmarks.length === 2) {
                    //     indicator.textContent = "Two Hands"
                    //     indicator.style.backgroundColor = "blue"
                    //     for (const handLandmark of result.landmarks) {
                    //         drawConnectors(canvasHandsCtx, handLandmark, HAND_CONNECTIONS, {
                    //             color: "#0000FF",
                    //             lineWidth: 2
                    //         });
                    //     }
                    //     if (result.checkDraw.check && result.checkDraw.hands_lms_list.length > 1) {
                    //         indicator.textContent = "Drawing Circle"
                    //         indicator.style.backgroundColor = "silver"
                    //         drawOvalMode = true
                    //         centreX1 = result.checkDraw.hands_lms_list[0].centre_XY[0]
                    //         centreY1 = result.checkDraw.hands_lms_list[0].centre_XY[1]
                    //         centreX2 = result.checkDraw.hands_lms_list[1].centre_XY[0]
                    //         centreY2 = result.checkDraw.hands_lms_list[1].centre_XY[1]
                    //         drawLandmarks(canvasHandsCtx, [{ x: centreX1 / video.videoWidth, y: centreY1 / video.videoHeight }],
                    //             { color: "#FF0000", lineWidth: 5 });
                    //         drawLandmarks(canvasHandsCtx, [{ x: centreX2 / video.videoWidth, y: centreY2 / video.videoHeight }],
                    //             { color: "#00FF00", lineWidth: 5 });
                    //     } else {
                    //         drawOvalMode = false
                    //     }
                    //     if (!drawOvalMode && centreX1 > 0 && centreX2 > 0) {
                    //         const w = Math.hypot(centreX1 - centreX2)
                    //         const h = Math.hypot(centreY1 - centreY2)
                    //         const x1 = (centreX1 + centreX2) / 2
                    //         const y1 = (centreY1 + centreY2) / 2
                    //         centreX1 = 0
                    //         centreY1 = 0
                    //         centreX2 = 0
                    //         centreY2 = 0
                    //         drawOval(x1, y1, w, h)
                    //     }
                    // } 
                    else {
                        indicator.textContent = "Not detected"
                        indicator.style.backgroundColor = "white"
                    }
                    canvasHandsCtx.restore();
                }
            }, frameIntervel)
        });
    });
}

function submitChallenge (trainingMode) {
    submitBtn.addEventListener('click', async () => {
        drawingState = false
        startBtn.textContent = 'Start'
        const data = document.querySelector('#defaultCanvas0').toDataURL('image/png')
        // training mode
        if (trainingMode) {
            const challenge = document.querySelector('#challenge-selector').value 
            const res = await fetch('/game/training', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ submission: data, challenge: challenge}),
            })

            const result = await res.json()
            if (result.success) {
                scoreBoard.innerHTML = ``
                scoreBoard.innerHTML += `<div>Your score: ${result.score}</div>`
                scoreBtn.click()
            }
            // count-down mode
        } else {
            if (challengeIndex === 5) {
                submissionSet.set(`challenge${challengeIndex}`, data)
                const username = sessionStorage.getItem('username') || 'Guest'
                const res = await fetch('/game/count-down', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ submissionSet: Object.fromEntries(submissionSet), username: username }),
                })

                submissionSet.clear()
                challengeIndex = 1
                const result = await res.json()
                if (result.success) {
                    console.log('challenge completed')
                    scoreBoard.innerHTML = ``
                    scoreBoard.innerHTML += `<div> Your name: ${result.username}</div>
                                            <div> Your score: ${result.score}</div>
                                            <div> Your rank: ${result.rank}</div>
                                            `
                    scoreBtn.click()
                }
            } else {
                submissionSet.set(`challenge${challengeIndex}`, data)
                challengeIndex++
            }
        }
        setup()
        indicator.textContent = "submitted"
        indicator.style.backgroundColor = "black"
        indicator.style.color = "white"
    })
}