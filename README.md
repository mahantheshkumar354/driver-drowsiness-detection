# 🚗 Driver Drowsiness Detection System

A real-time, browser-based **Driver Drowsiness Detection System** designed to improve driver safety by continuously monitoring the driver's face and eye activity through a webcam.

The system uses **MediaPipe Face Mesh** and JavaScript-based computer vision techniques to detect the driver's face and monitor eye closure. It provides an audio warning when prolonged eye closure is detected or when the driver's face remains undetected for **7 seconds**.

## 🌐 Live Demo

**[▶ Launch Driver Drowsiness Detection System](https://mahantheshkumar354.github.io/driver-drowsiness-detection/)**

> Camera permission is required. For the best experience, use a modern browser such as Google Chrome or Microsoft Edge.

---

## ✨ Features

* 🎥 Real-time webcam monitoring
* 👤 Real-time face detection
* 👁️ Eye-closure monitoring
* 🧠 Facial landmark tracking using MediaPipe Face Mesh
* ⏱️ 7-second face absence detection
* 🚨 Automatic audio warning alarm
* 🔊 Built-in alarm testing
* 📊 Real-time system status
* 📱 Responsive web interface
* 🌐 Can be deployed as a static website
* 🔒 Camera processing is performed directly in the browser

---

## 🧠 System Overview

The system continuously analyzes the webcam feed and monitors the driver's face and eyes.

### Face Detection

When a face is detected, the system continues normal monitoring.

If the face is not detected:

```text
Face Not Detected
       ↓
Start Timer
       ↓
1 Second
       ↓
2 Seconds
       ↓
...
       ↓
7 Seconds
       ↓
🚨 Warning Alarm
```

The alarm automatically stops when the driver's face is detected again.

### Drowsiness Detection

The system tracks facial landmarks around the eyes and calculates an **Eye Aspect Ratio (EAR)**.

```text
Webcam
   ↓
Face Detection
   ↓
Facial Landmarks
   ↓
Eye Landmark Detection
   ↓
EAR Calculation
   ↓
Eyes Open / Eyes Closed
   ↓
Prolonged Eye Closure
   ↓
🚨 Drowsiness Alarm
```

---

## 🛠️ Technologies Used

| Technology                    | Purpose                                    |
| ----------------------------- | ------------------------------------------ |
| **HTML5**                     | Application structure                      |
| **CSS3**                      | User interface and responsive design       |
| **JavaScript**                | Application logic and real-time processing |
| **MediaPipe Face Mesh**       | Facial landmark detection                  |
| **WebRTC / getUserMedia API** | Webcam access                              |
| **Web Audio API**             | Warning alarm generation                   |
| **Git & GitHub**              | Version control and project hosting        |
| **GitHub Pages**              | Live deployment                            |

---

## 📂 Project Structure

```text
driver-drowsiness-detection/
│
├── index.html       # Main application interface
├── style.css        # User interface styling
├── script.js        # Face, eye and alarm detection logic
└── README.md        # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mahantheshkumar354/driver-drowsiness-detection.git
```

### 2. Open the Project

```bash
cd driver-drowsiness-detection
```

### 3. Run a Local Web Server

Using Python:

```bash
python -m http.server 8000
```

If `python` is not recognized, try:

```bash
py -m http.server 8000
```

### 4. Open the Application

Open the following address in your browser:

```text
http://localhost:8000
```

Allow camera access when prompted.

---

## 🎥 How to Use

1. Open the application.
2. Click **Start Camera**.
3. Allow the browser to access your webcam.
4. Position your face in front of the camera.
5. The system will begin real-time monitoring.
6. Keep your face visible to the camera.
7. If your face is not detected continuously for **7 seconds**, the warning alarm will activate.
8. If your eyes remain closed for the configured duration, the drowsiness alarm will activate.
9. When normal conditions are detected again, the corresponding alarm stops.

### 🔊 Test the Alarm

Use the **Test Alarm** button to verify that your device's audio output is working before using the monitoring system.

---

## ⚙️ Detection Parameters

The current implementation uses configurable thresholds in `script.js`.

### Face Absence

```javascript
const FACE_MISSING_TIME = 7000;
```

This represents **7 seconds**.

### Eye Closure

```javascript
const EYE_CLOSED_TIME = 1500;
```

The system considers prolonged eye closure after approximately **1.5 seconds** under the current configuration.

### Eye Aspect Ratio

```javascript
const EAR_THRESHOLD = 0.21;
```

The EAR threshold can be adjusted depending on camera quality, lighting conditions, and individual eye characteristics.

---

## 🔊 Alarm System

The application uses the browser's **Web Audio API** to generate a repeating warning tone.

The alarm can be triggered by:

* Face not detected for 7 seconds
* Prolonged eye closure

The alarm automatically stops when the corresponding normal condition is restored.

> Actual perceived loudness depends on the device's speaker/headphones and system volume. The application does not guarantee a specific physical decibel level.

---

## 🌐 GitHub Pages Deployment

This project can be deployed using GitHub Pages because it is a client-side HTML/CSS/JavaScript application.

### Deployment Steps

1. Open the GitHub repository.
2. Go to **Settings**.
3. Select **Pages**.
4. Under **Build and deployment**, select:

   * Source: `Deploy from a branch`
   * Branch: `main`
   * Folder: `/ (root)`
5. Click **Save**.
6. Wait for GitHub Pages to build the website.
7. Open the generated GitHub Pages URL.

### Live Application

**[Open Live Demo](https://mahantheshkumar354.github.io/driver-drowsiness-detection/)**

---

## 🔐 Privacy

The application accesses the webcam using the browser's camera API.

The project is designed to perform face and eye analysis **locally in the browser**. It does not require a dedicated backend server for the detection functionality.

Camera access is only available after the user grants browser permission.

---

## ⚠️ Limitations

This project is an educational computer-vision prototype and is not a certified automotive safety system.

Detection performance can be affected by:

* Poor lighting
* Low-quality cameras
* Face position
* Camera angle
* Partial face visibility
* Glasses or other obstructions
* Rapid head movement
* Browser/device performance

The system should not be relied upon as the sole safety mechanism while driving.

---

## 🔮 Future Improvements

Potential future enhancements include:

* 🧠 Machine-learning-based fatigue classification
* 👀 Improved eye and blink detection
* 🤕 Head-pose estimation
* 🥱 Yawning detection
* 📱 Improved mobile-device support
* 🚘 Integration with vehicle safety systems
* 📩 Emergency notification functionality
* 📊 Driver monitoring analytics dashboard
* ☁️ Optional cloud-based monitoring
* 🔔 Additional configurable warning types

---

## 🎯 Applications

The project can be used as a foundation for:

* Driver monitoring systems
* Intelligent transportation systems
* Fleet safety applications
* Automotive safety research
* Computer vision projects
* Academic demonstrations
* Embedded/IoT driver safety systems

---

## 📈 Learning Outcomes

This project demonstrates practical experience with:

* Real-time computer vision
* Facial landmark detection
* Webcam and browser APIs
* JavaScript event handling
* Eye Aspect Ratio calculation
* Real-time state monitoring
* Audio alert generation
* Responsive web development
* Git and GitHub
* Static web deployment

---

## 👨‍💻 Author

### Mahanthesh Kumar

Computer Science Engineering Student

**GitHub:**
[github.com/mahantheshkumar354](https://github.com/mahantheshkumar354)

---

## 📄 License

This project is intended primarily for **educational and research purposes**.

You are welcome to study, modify, and extend the project for academic and personal learning purposes.
