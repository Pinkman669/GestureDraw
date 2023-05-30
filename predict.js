import {
    HandLandmarker,
    FilesetResolver
} from '@mediapipe/tasks-vision'

let handLandmarker;
const runningMode = "IMAGE";

const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "@mediapipe/tasks-vision/wasm"
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "CPU"
        },
        runningMode: runningMode,
        numHands: 2
    });
};
createHandLandmarker()