// =====================================================
// DRIVER DROWSINESS DETECTION SYSTEM
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const video = document.getElementById("video");

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const faceStatus =
    document.getElementById("faceStatus");

const eyeStatus =
    document.getElementById("eyeStatus");

const systemStatus =
    document.getElementById("systemStatus");

const faceTimer =
    document.getElementById("faceTimer");

const startButton =
    document.getElementById("startButton");

const testAlarmButton =
    document.getElementById("testAlarmButton");

const cameraMessage =
    document.getElementById("cameraMessage");

const errorBox =
    document.getElementById("errorBox");


// =====================================================
// SETTINGS
// =====================================================

const FACE_MISSING_TIME = 7000;

// Eyes must remain closed for 1.5 seconds
const EYE_CLOSED_TIME = 1500;

// Eye aspect ratio threshold
const EAR_THRESHOLD = 0.21;


// =====================================================
// VARIABLES
// =====================================================

let stream = null;

let faceMesh = null;

let cameraRunning = false;

let processingFrame = false;


// Face missing timer
let faceMissingStart = null;


// Eye timer
let eyesClosedStart = null;


// Alarm
let audioContext = null;

let alarmTimer = null;

let faceAlarm = false;

let drowsinessAlarm = false;


// =====================================================
// AUDIO
// =====================================================

function initializeAudio() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {

            showError(
                "Your browser does not support Web Audio."
            );

            return false;
        }

        audioContext = new AudioContext();

    }


    if (audioContext.state === "suspended") {

        audioContext.resume();

    }

    return true;
}


// =====================================================
// BEEP
// =====================================================

function beep() {

    if (!initializeAudio()) {
        return;
    }


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type = "square";


    // High-frequency warning tone

    oscillator.frequency.setValueAtTime(
        900,
        audioContext.currentTime
    );


    oscillator.frequency.linearRampToValueAtTime(
        1400,
        audioContext.currentTime + 0.15
    );


    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.6,
        audioContext.currentTime + 0.03
    );


    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.45
    );


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.45
    );

}


// =====================================================
// START ALARM
// =====================================================

function startAlarm(type) {


    if (type === "face") {

        faceAlarm = true;

        systemStatus.textContent =
            "🚨 FACE NOT DETECTED";

    }


    if (type === "drowsiness") {

        drowsinessAlarm = true;

        systemStatus.textContent =
            "🚨 DROWSINESS DETECTED";

    }


    // Don't create multiple alarm loops

    if (alarmTimer !== null) {

        return;

    }


    beep();


    alarmTimer = setInterval(() => {

        beep();

    }, 600);

}


// =====================================================
// STOP ALARM
// =====================================================

function stopAlarm(type) {


    if (type === "face") {

        faceAlarm = false;

    }


    if (type === "drowsiness") {

        drowsinessAlarm = false;

    }


    if (
        !faceAlarm &&
        !drowsinessAlarm
    ) {

        if (alarmTimer !== null) {

            clearInterval(alarmTimer);

            alarmTimer = null;

        }


        if (cameraRunning) {

            systemStatus.textContent =
                "✅ Monitoring Normally";

        }

    }

}


// =====================================================
// ERROR
// =====================================================

function showError(message) {

    errorBox.textContent =
        "⚠️ " + message;

}


// =====================================================
// DISTANCE
// =====================================================

function distance(a, b) {

    const x =
        a.x - b.x;

    const y =
        a.y - b.y;

    return Math.sqrt(
        x * x +
        y * y
    );

}


// =====================================================
// EYE ASPECT RATIO
// =====================================================

function calculateEAR(
    points,
    p1,
    p2,
    p3,
    p4,
    p5,
    p6
) {


    const vertical1 =
        distance(
            points[p2],
            points[p6]
        );


    const vertical2 =
        distance(
            points[p3],
            points[p5]
        );


    const horizontal =
        distance(
            points[p1],
            points[p4]
        );


    if (horizontal === 0) {

        return 1;

    }


    return (
        vertical1 +
        vertical2
    ) / (
        2 * horizontal
    );

}


// =====================================================
// DRAW FACE
// =====================================================

function drawFace(landmarks) {


    if (!landmarks) {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        return;

    }


    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Face mesh

    if (
        typeof drawConnectors ===
        "function"
    ) {

        drawConnectors(
            ctx,
            landmarks,
            FACEMESH_TESSELATION,
            {
                color: "#00ff00",
                lineWidth: 0.5
            }
        );


        // Left eye

        drawConnectors(
            ctx,
            landmarks,
            FACEMESH_LEFT_EYE,
            {
                color: "#ff0000",
                lineWidth: 2
            }
        );


        // Right eye

        drawConnectors(
            ctx,
            landmarks,
            FACEMESH_RIGHT_EYE,
            {
                color: "#ff0000",
                lineWidth: 2
            }
        );

    }

}


// =====================================================
// PROCESS FACE RESULTS
// =====================================================

function processResults(results) {


    const now =
        performance.now();


    // =================================================
    // FACE NOT FOUND
    // =================================================

    if (
        !results.multiFaceLandmarks ||
        results.multiFaceLandmarks.length === 0
    ) {


        faceStatus.textContent =
            "❌ Face Not Detected";


        eyeStatus.textContent =
            "Unknown";


        drawFace(null);


        // Start timer

        if (faceMissingStart === null) {

            faceMissingStart = now;

        }


        const elapsed =
            now - faceMissingStart;


        const seconds =
            elapsed / 1000;


        faceTimer.textContent =
            Math.min(
                seconds,
                7
            ).toFixed(1);


        // =============================================
        // 7 SECOND ALARM
        // =============================================

        if (
            elapsed >= FACE_MISSING_TIME
        ) {

            startAlarm("face");

        }


        return;

    }


    // =================================================
    // FACE FOUND
    // =================================================

    const landmarks =
        results.multiFaceLandmarks[0];


    faceStatus.textContent =
        "✅ Face Detected";


    // Reset face timer

    faceMissingStart = null;

    faceTimer.textContent =
        "0.0";


    // Stop face alarm

    if (faceAlarm) {

        stopAlarm("face");

    }


    // Draw

    drawFace(landmarks);


    // =================================================
    // EYE DETECTION
    // =================================================


    const leftEAR =
        calculateEAR(
            landmarks,

            33,
            160,
            158,
            133,
            153,
            144
        );


    const rightEAR =
        calculateEAR(
            landmarks,

            362,
            385,
            387,
            263,
            373,
            380
        );


    const averageEAR =
        (
            leftEAR +
            rightEAR
        ) / 2;


    // =================================================
    // EYES CLOSED
    // =================================================

    if (
        averageEAR <
        EAR_THRESHOLD
    ) {


        eyeStatus.textContent =
            "😴 Eyes Closed";


        if (
            eyesClosedStart === null
        ) {

            eyesClosedStart = now;

        }


        const closedTime =
            now -
            eyesClosedStart;


        if (
            closedTime >=
            EYE_CLOSED_TIME
        ) {

            startAlarm(
                "drowsiness"
            );

        }

    }


    // =================================================
    // EYES OPEN
    // =================================================

    else {


        eyeStatus.textContent =
            "👁️ Eyes Open";


        eyesClosedStart = null;


        if (
            drowsinessAlarm
        ) {

            stopAlarm(
                "drowsiness"
            );

        }

    }

}


// =====================================================
// MEDIAPIPE INITIALIZATION
// =====================================================

function initializeFaceMesh() {


    if (
        typeof FaceMesh ===
        "undefined"
    ) {

        showError(
            "Face detection library did not load. Check your internet connection and refresh the page."
        );

        return false;

    }


    faceMesh =
        new FaceMesh({

            locateFile: function(file) {

                return (
                    "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/" +
                    file
                );

            }

        });


    faceMesh.setOptions({

        maxNumFaces: 1,

        refineLandmarks: true,

        minDetectionConfidence: 0.35,

        minTrackingConfidence: 0.35

    });


    faceMesh.onResults(
        processResults
    );


    return true;

}


// =====================================================
// CAMERA LOOP
// =====================================================

async function cameraLoop() {


    if (!cameraRunning) {

        return;

    }


    if (
        video.readyState >= 2 &&
        !processingFrame
    ) {


        processingFrame = true;


        try {

            await faceMesh.send({

                image: video

            });

        }

        catch (error) {

            console.error(
                "Face processing error:",
                error
            );

        }


        processingFrame = false;

    }


    requestAnimationFrame(
        cameraLoop
    );

}


// =====================================================
// START CAMERA
// =====================================================

async function startCamera() {


    errorBox.textContent = "";


    // ================================================
    // Check browser support
    // ================================================

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        showError(
            "Camera API is unavailable. Open this project using http://localhost or HTTPS, not by double-clicking the HTML file."
        );

        return;

    }


    // ================================================
    // Initialize audio
    // ================================================

    initializeAudio();


    // ================================================
    // Initialize MediaPipe
    // ================================================

    if (!faceMesh) {

        const initialized =
            initializeFaceMesh();


        if (!initialized) {

            return;

        }

    }


    // ================================================
    // CAMERA
    // ================================================

    try {


        cameraMessage.textContent =
            "Requesting camera permission...";


        /*
         * Request webcam
         */

        stream =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    width: {
                        ideal: 1280
                    },

                    height: {
                        ideal: 720
                    },

                    facingMode: "user"

                },

                audio: false

            });


        // ============================================
        // Attach camera stream
        // ============================================

        video.srcObject =
            stream;


        // Wait until video metadata loads

        await new Promise(
            (resolve) => {

                if (
                    video.readyState >= 1
                ) {

                    resolve();

                }

                else {

                    video.onloadedmetadata =
                        () => resolve();

                }

            }
        );


        // Start video

        await video.play();


        cameraRunning =
            true;


        cameraMessage.style.display =
            "none";


        startButton.textContent =
            "✅ Camera Running";


        startButton.disabled =
            true;


        systemStatus.textContent =
            "🔍 Starting detection...";


        faceStatus.textContent =
            "Searching...";


        eyeStatus.textContent =
            "Searching...";


        // Start detection loop

        requestAnimationFrame(
            cameraLoop
        );


    }

    catch (error) {


        console.error(
            "Camera error:",
            error
        );


        cameraRunning =
            false;


        cameraMessage.textContent =
            "Camera unavailable";


        startButton.disabled =
            false;


        if (
            error.name ===
            "NotAllowedError"
        ) {

            showError(
                "Camera permission was denied. Click the camera icon 🔒 in Chrome's address bar and allow Camera access."
            );

        }

        else if (
            error.name ===
            "NotFoundError"
        ) {

            showError(
                "No camera was found. Connect a webcam and try again."
            );

        }

        else if (
            error.name ===
            "NotReadableError"
        ) {

            showError(
                "The camera is being used by another application. Close other apps using the webcam and try again."
            );

        }

        else {

            showError(
                "Camera error: " +
                error.message
            );

        }

    }

}


// =====================================================
// TEST ALARM BUTTON
// =====================================================

testAlarmButton.addEventListener(
    "click",
    function() {

        initializeAudio();

        beep();

    }
);


// =====================================================
// START BUTTON
// =====================================================

startButton.addEventListener(
    "click",
    startCamera
);


// =====================================================
// PAGE LOAD
// =====================================================

window.addEventListener(
    "load",
    function() {

        if (
            typeof FaceMesh ===
            "undefined"
        ) {

            showError(
                "Face detection library is still unavailable. Make sure you have an internet connection."
            );

        }

    }
);