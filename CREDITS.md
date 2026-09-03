# Asset Attribution & Open Source Licensing (CREDITS.md)

This project, **WebAR Watch Store: Interactive 3D Product Visualization, AR Placement, and Virtual Watch Try-On**, utilizes open-source 3D models and libraries in accordance with their respective Creative Commons, MIT, and Apache 2.0 licenses.

---

## 3D Watch Models

### 1. Apple Watch Ultra 2
- **Asset Name**: `apple-watch-ultra.glb` (`apple_watch_ultra_2.glb`)
- **Format**: glTF 2.0 Binary (GLB)
- **License**: Creative Commons Attribution (CC BY 4.0)
- **Source**: Sketchfab / Open 3D Repository
- **Modifications**: Mesh hierarchy inspection, bounding box normalization, PBR material mapping for straps and case accents.

### 2. G-Shock Mudmaster Chronograph
- **Asset Name**: `chronograph-mudmaster.glb` (`chronograph_watch_mudmaster.glb`)
- **Format**: glTF 2.0 Binary (GLB)
- **License**: Creative Commons Attribution (CC BY 4.0)
- **Source**: Sketchfab / Open 3D Repository
- **Modifications**: Separated belt and case material hooks, tactical dial accent color bindings.

### 3. Cyber Horizon Digital Watch
- **Asset Name**: `digital-watch.glb` (`digital_watch.glb`)
- **Format**: glTF 2.0 Binary (GLB)
- **License**: Creative Commons Attribution (CC BY 4.0)
- **Source**: Sketchfab / Open 3D Repository
- **Modifications**: Discrete `strap_0`, `screen_0`, and `watch_0` sub-mesh isolation for dynamic emissive shader tinting.

### 4. Seiko Premier Automatic Dress Watch
- **Asset Name**: `seiko-classic.glb` (`seiko_watch.glb`)
- **Format**: glTF 2.0 Binary (GLB)
- **License**: Creative Commons Attribution (CC BY 4.0)
- **Source**: Sketchfab / Open 3D Repository
- **Modifications**: Metallic reflection calibration and luxury bracelet PBR shader tuning.

---

## Open Source Software & Libraries

### 1. Three.js
- **Author**: Mr.doob & Three.js Contributors
- **License**: MIT License
- **URL**: [https://threejs.org](https://threejs.org)

### 2. Google Model Viewer (`@google/model-viewer`)
- **Author**: Google LLC
- **License**: Apache License 2.0
- **URL**: [https://modelviewer.dev](https://modelviewer.dev)

### 3. MediaPipe Tasks Vision (`@mediapipe/tasks-vision`)
- **Author**: Google LLC
- **License**: Apache License 2.0
- **URL**: [https://developers.google.com/mediapipe](https://developers.google.com/mediapipe)

### 4. MindAR & A-Frame
- **Author**: HiuKim & A-Frame Community
- **License**: MIT License
- **URL**: [https://hiukim.github.io/mind-ar-js-doc/](https://hiukim.github.io/mind-ar-js-doc/)

### 5. React & Vite
- **License**: MIT License
- **URL**: [https://react.dev](https://react.dev) | [https://vitejs.dev](https://vitejs.dev)

### 6. Lucide React
- **License**: ISC License
- **URL**: [https://lucide.dev](https://lucide.dev)

---

## Statement of Originality & Technical Contribution
Original 3D modeling from scratch is explicitly not required by the project brief. The primary technical contributions of this project encompass:
1. Multi-modal WebAR client architecture unifying WebXR, MindAR Natural Feature Tracking, and MediaPipe Vision in a single responsive React application.
2. Option B Complex Interaction state machine managing real-time PBR material mutation, transformation constraints, and resets.
3. Hand landmark pose estimation and Exponential Moving Average (EMA) mathematical jitter filtering for webcam wrist virtual try-on.
4. Comprehensive 10-point test matrix and device fallback safeguards.
