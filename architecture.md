# WebAR Watch Store — Technical Architecture Document

## 1. Executive Summary & System Overview

**WebAR Watch Store** is a client-side Augmented Reality (AR) and 3D e-commerce web application engineered with **React 18, TypeScript, Vite, Three.js, Google `<model-viewer>`, and MindAR / A-Frame 1.5.0**.

### Core Problem Solved:
Online watch shopping historically suffers from high return rates because 2D photography cannot communicate true physical scale, metallic material reflectivity, or real-world lighting interaction. WebAR Watch Store addresses this by providing three complementary immersive visualization modalities:
1. **Interactive 3D Turntable:** 360° orbital inspection with PBR environment reflections, customizable strap/dial materials, and exploded/dimension views.
2. **Marker & Image Target 6DOF AR:** Pinned rigid 3D tracking on physical cards, packaging, or screen targets via MindAR GPU/WASM Natural Feature Tracking (NFT).
3. **Markerless WebXR Surface AR:** True 1:1 real-world surface placement on desks and floors using device SLAM and hit-testing (with desktop 3D ground-plane fallback).

---

## 2. High-Level System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Client Browser (Desktop / Mobile)"]
        UI["React 18 UI Layer<br/>(SF Pro / Apple Clean Design System)"]
        StateMgr["App State Machine & Configurator<br/>(Option B 5-Step Flow)"]
        
        subgraph Subsystems ["Rendering & Tracking Subsystems"]
            MV["Google <model-viewer><br/>PBR Shading & HDR Environment"]
            ThreeCore["Three.js (r183)<br/>Scene Graph & Live Material Mutator"]
            
            subgraph ARModes ["AR Tracking Engines"]
                MindAR["Marker AR Sandbox (Iframe)<br/>MindAR 1.2.5 + A-Frame 1.5.0<br/>6DOF Natural Feature Tracking on .mind Targets"]
                WebXR["Markerless WebXR AR<br/>WebXR Device API + Hit-Test<br/>(ARCore / Quick Look / Desktop Fallback)"]
            end
        end
        
        subgraph MutatorPipeline ["Dynamic Material Pipeline"]
            MatMut["applyWatchMaterialCustomization()<br/>(Scene-Graph Traverser)"]
        end
    end

    subgraph Assets ["Static Assets (public/)"]
        GLB["Optimized GLB Models<br/>(Apple, Mudmaster, Cyber, Seiko)"]
        Markers["AR Targets<br/>(marker.mind, marker.jpg, watch-marker.svg)"]
    end

    UI --> StateMgr
    StateMgr --> MV
    StateMgr --> ThreeCore
    StateMgr --> MindAR
    StateMgr --> WebXR
    
    StateMgr --> MatMut --> ThreeCore
    
    GLB --> MV
    GLB --> ThreeCore
    GLB --> MindAR
    Markers --> MindAR
```

---

## 3. Core Technology Stack

| Layer | Technology / Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | React + TypeScript | `^18.3.1` | Declarative component tree, lifecycle control, UI overlays |
| **Build Tool** | Vite | `^5.4.21` | Hot module replacement, bundling, asset optimization |
| **3D Rendering** | Three.js | `^0.183.0` | Custom scene graphs, lights, cameras, real-time material traversal |
| **Product Viewer** | `@google/model-viewer` | `^4.0.0` | Standardized glTF 2.0 PBR rendering, auto-poster, AR launch bridge |
| **Marker / Image AR** | MindAR + A-Frame | `1.2.5` / `1.5.0` | Neural & GPU Natural Feature Tracking (NFT) on `.mind` image targets |
| **Icons** | `lucide-react` | `^0.475.0` | Apple-style minimal functional vector iconography |
| **Styling** | Modern Vanilla CSS | Custom Tokens | Responsive grid, typography scale, frosted glass, micro-animations |

---

## 4. Directory Structure & Key Files

```
d:\ar\
├── public/
│   ├── marker.jpg                # Marker image shown on a laptop or another phone
│   ├── ar-marker-frame.html      # Isolated sandbox for MindAR image-target camera tracking
│   ├── markers/
│   │   ├── marker.mind           # Compiled binary feature map for the on-screen marker image
│   │   ├── hiro.svg              # Universal standard Hiro high-contrast marker
│   │   ├── watch-marker.svg      # Custom branded watch AR marker
│   │   └── watch-marker.patt     # Trained binary pattern file for custom marker
│   └── models/
│       ├── apple-watch-ultra.glb     # 49mm Titanium Smartwatch asset
│       ├── chronograph-mudmaster.glb # Heavy-duty Tactical Chronograph asset
│       ├── digital-watch.glb         # Cyber Horizon OLED digital asset
│       └── seiko-classic.glb         # 41.8mm Mechanical Dress Watch asset
├── src/
│   ├── components/
│   │   ├── ar/
│   │   │   ├── ARStateBadge.tsx          # Dynamic HUD state indicator badge
│   │   │   ├── MarkerARScene.tsx         # Iframe bridge and HUD for Marker/Image AR
│   │   │   └── MarkerlessARScene.tsx     # WebXR surface placement + desktop fallback
│   │   ├── catalogue/
│   │   │   ├── FeatureHighlights.tsx     # Core selling proposition badges (2 Modalities)
│   │   │   ├── WatchCard.tsx             # Interactive 3D preview product card
│   │   │   └── WatchFilter.tsx           # Category, brand, and price filter chips
│   │   ├── common/
│   │   │   ├── Footer.tsx                # Site navigation & system status footer
│   │   │   ├── Modal.tsx                 # On-screen AR marker popup modal
│   │   │   └── Navbar.tsx                # Floating frosted glass navigation header
│   │   ├── configurator/
│   │   │   └── ConfiguratorWizard.tsx    # 5-step Option B state machine
│   │   └── viewer/
│   │       └── Interactive3DViewer.tsx   # <model-viewer> wrapper with camera controls
│   ├── data/
│   │   └── watches.ts            # Catalogue specifications, mesh maps, test matrix
│   ├── pages/
│   │   ├── ComparePage.tsx       # Side-by-side dual 3D watch comparison
│   │   ├── DocumentationPage.tsx # In-app user manual & architecture viewer
│   │   ├── HomePage.tsx          # Hero section, catalogue grid, AR feature links
│   │   ├── MarkerARPage.tsx      # Marker tracking entry view
│   │   ├── MarkerlessARPage.tsx  # Surface tracking entry view
│   │   └── ProductDetailPage.tsx # Single product deep-dive + configurator wizard
│   ├── types/
│   │   └── watch.ts              # TypeScript interfaces for models, configs, tests
│   ├── utils/
│   │   ├── materialModifier.ts   # In-memory Three.js PBR material mutator
│   │   └── webxr.ts              # WebXR session detection & permission queries
│   ├── App.tsx                   # Top-level view routing & global configuration state
│   ├── index.css                 # Apple Design System design tokens and CSS rules
│   └── main.tsx                  # React DOM root entry point
├── architecture.md               # Complete technical architecture specification
├── CREDITS.md                    # Open-source asset, 3D model, and library licenses
├── DESIGN-apple.md               # Apple Clean Photography-first Design System tokens
├── DESIGN-bmw-m.md               # High-contrast BMW M Motorsport Design System
├── DESIGN.md                     # Active design system master reference
├── TESTING_REPORT.md             # Formal T01–T09 test suite execution report
└── package.json                  # Dependencies, build scripts, and metadata
```

---

## 5. Detailed Subsystem Architectures

### 5.1 Interactive 3D Turntable Subsystem (`Interactive3DViewer.tsx`)
- **Rendering Engine:** Google `<model-viewer>` component.
- **Lighting & Reflection:** High Dynamic Range (HDR) neutral studio environment map with ACESFilmic tone mapping and dynamic contact shadow rendering.
- **User Interactions:**
  - **Orbit Controls:** Continuous azimuthal and polar rotation with inertia damping.
  - **Zoom Clamping:** Bounded field-of-view limits ($12^\circ$ to $65^\circ$) to prevent clipping.
  - **Snapshot Generator:** Extracts high-resolution PNG composite canvas captures with alpha channels.

---

### 5.2 Marker & Image-Target 6DOF AR Subsystem (`MarkerARScene.tsx` & `ar-marker-frame.html`)
To prevent namespace pollution and DOM conflicts between React and A-Frame, Marker/Image AR uses an **Isolated Iframe Sandbox Architecture** powered by **MindAR 1.2.5** and **A-Frame 1.5.0**:

```mermaid
sequenceDiagram
    participant User
    participant ReactHUD as React UI (MarkerARScene.tsx)
    participant Iframe as Iframe Sandbox (ar-marker-frame.html)
    participant MindAR as MindAR & A-Frame 1.5.0 Engine
    participant Camera as Device Webcam

    ReactHUD->>Iframe: Load /ar-marker-frame.html?model=...&scale=...
    Iframe->>Camera: Request getUserMedia({ video: true })
    Camera-->>Iframe: Active Video Stream (60fps)
    Iframe->>MindAR: Start camera tracking & load /markers/marker.mind
    
    loop Every Video Frame
        MindAR->>MindAR: Match Natural Feature Points (NFT) against Target 0
        alt Target In View
            MindAR->>Iframe: Emit 'targetFound' event
            Iframe->>ReactHUD: postMessage({ source: 'mindar-marker-frame', type: 'markerFound' })
            ReactHUD->>ReactHUD: Update HUD: "Tracking [Watch Name]"
        else Target Lost
            MindAR->>Iframe: Emit 'targetLost' event
            Iframe->>ReactHUD: postMessage({ source: 'mindar-marker-frame', type: 'markerLost' })
            ReactHUD->>ReactHUD: Update HUD: "Target lost — realigning"
        end
    end

    User->>ReactHUD: Switch Model or Drag Scale Slider
    ReactHUD->>Iframe: postMessage({ target: 'mindar-marker-frame', action: 'updateWatch', scale: '...' })
    Iframe->>MindAR: Update gltf-model & scale attributes in real time
```

---

### 5.3 Markerless WebXR Surface AR Subsystem (`MarkerlessARScene.tsx`)
- **Mobile Path (ARCore / ARKit):**
  - Invokes `navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'] })` or triggers Google Scene Viewer / Apple Quick Look through `<model-viewer ar>`.
  - Scans horizontal floor/table surfaces and projects an alignment reticle.
  - Anchors the 3D watch rigidly in real-world metric scale ($1\text{ unit} = 1\text{ meter}$).
- **Desktop Fallback Path:**
  - When accessed from a laptop/desktop without SLAM hardware, automatically loads an interactive 3D ground-plane simulation environment.
  - Allows users to drag-place, elevate, rotate, and scale the watch against a virtual shadow plane.

---

### 5.4 Dynamic Material Mutation Pipeline (`materialModifier.ts`)
Rather than re-downloading GLB assets when users pick colors or materials, the application traverses the Three.js scene-graph in-memory:

```typescript
// Mesh Traversal & PBR Mutation
model.traverse((child) => {
  if ((child as THREE.Mesh).isMesh) {
    const mesh = child as THREE.Mesh;
    const isStrap = matchMeshName(mesh.name, watch.strapMeshNames);
    const isDial = matchMeshName(mesh.name, watch.dialMeshNames);

    if (isStrap) {
      mesh.material.color.set(strapColorHex);
      mesh.material.roughness = targetRoughness;
      mesh.material.metalness = targetMetalness;
      mesh.material.needsUpdate = true;
    }
    if (isDial) {
      mesh.material.color.set(dialColorHex);
      if (mesh.material.emissive) {
        mesh.material.emissive.set(dialColorHex).multiplyScalar(0.25);
      }
      mesh.material.needsUpdate = true;
    }
  }
});
```

### 5.5 GLB Asset Optimization & Texture Sampling

All production 3D assets remain self-contained `.glb` files so the `<model-viewer>` markerless path and the A-Frame/MindAR marker path load the same URL:

- Textures are compressed to WebP with glTF Transform at quality `95` using a texture-only pass.
- Geometry, node hierarchy, mesh names, material names, and AR calibration transforms are preserved.
- Draco, Meshopt geometry compression, KTX2, and texture resizing are not enabled in the shared production assets because the marker AR loader has no explicit decoder configuration for those extensions.
- Each model keeps the glTF sampler `minFilter: 9987` (`LINEAR_MIPMAP_LINEAR`). The browser renderer generates and uses runtime mipmaps for the regular WebP textures, improving distant-view stability and reducing texture shimmering.

The default all-in-one `gltf-transform optimize` pipeline was evaluated separately. It also enables mesh simplification, quantization, joining, and Meshopt compression, so those outputs require separate compatibility and visual QA before they can be used by both AR modes.

---

## 6. 3D Model Catalog & Mesh Name Mapping

| Watch Model | Asset Path | Key Strap Meshes | Key Dial Meshes | Glass Meshes | Default Marker Scale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Apple Watch Ultra 2** | `/models/apple-watch-ultra.glb` | `bXoKVYbQhcORrRo`, `LMTUXYhSYYJrnsy_0` | `VHnHbLOyhEXLvWA`, `DCiPNWQGULbWNNE` | `EZmdWXCjqrUDeoX` | `0.06 0.06 0.06` |
| **G-Shock Mudmaster** | `/models/chronograph-mudmaster.glb` | `belt_1_...`, `belt_2_...` | `N6_JewelryGlossyGold...`, `numbers_base_frame` | `Main_glass...` | `0.005 0.005 0.005` |
| **Cyber Horizon Digital** | `/models/digital-watch.glb` | `strap_0` | `screen_0`, `screen.001_0` | `watch_0` | `0.07 0.07 0.07` |
| **Seiko Premier Automatic** | `/models/seiko-classic.glb` | `defaultMaterial` | `defaultMaterial` | `defaultMaterial` | `0.07 0.07 0.07` |

---

## 7. Option B Configurator State Flow

The Option B Configurator implements a strict 5-step guided state machine:

```mermaid
stateDiagram-v2
    [*] --> Select: Step 1
    Select --> Place: Choose Model & Dimensions
    Place --> Customize: Choose Environment (3D / Marker / Surface)
    Customize --> Manipulate: Mutate Strap & Dial PBR Materials
    Manipulate --> Complete: Adjust Scale, Rotation & Elevation
    Complete --> [*]: Final Review, Snapshot & Order Checkout
    
    Complete --> Customize: Re-edit Materials
    Complete --> Place: Switch AR Mode
```

- **Step 1 (`select`):** Model selection with real-time specs inspection.
- **Step 2 (`place`):** Viewport selection (Studio Turntable, Marker AR, or Surface AR).
- **Step 3 (`customize`):** Interactive PBR material palette (Silicone, Titanium, Leather, Gold, Steel).
- **Step 4 (`manipulate`):** 3D rotation, pitch, elevation offset, and scale multiplier.
- **Step 5 (`complete`):** High-resolution snapshot export, configuration summary, and checkout action.

---

## 8. Design System & CSS Token Architecture

The application implements the **Apple Clean Photography-First Design System** (`src/index.css`):

```css
:root {
  /* Brand Accent */
  --colors-primary: #0066cc;          /* Action Blue */
  --colors-primary-focus: #0071e3;
  --colors-on-primary: #ffffff;

  /* Typography & Surfaces */
  --font-display: "SF Pro Display", -apple-system, sans-serif;
  --font-body: "SF Pro Text", -apple-system, sans-serif;
  --font-mono: "SF Mono", "JetBrains Mono", monospace;
  
  --colors-ink: #1d1d1f;              /* Deep Apple Charcoal */
  --colors-canvas: #ffffff;           /* Clean Pure Canvas */
  --colors-canvas-parchment: #f5f5f7;  /* Soft Warm Neutral */
  --colors-surface-tile-1: #272729;    /* Dark Feature Tile */
  --colors-hairline: #e0e0e0;

  /* Geometry Tokens */
  --rounded-pill: 9999px;             /* Apple Pill Buttons */
  --rounded-lg: 18px;                 /* Apple Store Utility Cards */
  --rounded-md: 11px;                 /* Spec Cells */
}
```

---

## 9. Verification & Testing Matrix (T01–T09)

| Test ID | Category | Feature Verified | Verification Status | Fallback Behavior |
| :---: | :--- | :--- | :---: | :--- |
| **T01** | Mandatory 3D | 4 GLB Models Loading with PBR Shaders | ✅ **Pass** | Fallback poster & retry prompt |
| **T02** | Mandatory 3D | 360° Turntable Orbit, Zoom & Reset | ✅ **Pass** | Bounded FOV clamps ($12^\circ - 65^\circ$) |
| **T03** | Marker AR | MindAR Natural Feature Image Target Tracking | ✅ **Pass** | High-contrast target card modal guide |
| **T04** | Marker AR | Dynamic HUD State Indicator Badge | ✅ **Pass** | Reactive event listeners |
| **T05** | Markerless AR | WebXR Surface Hit-Test Placement | ✅ **Pass** | Desktop 3D Ground-Plane Viewer |
| **T06** | Option B | Real-time Strap & Dial Material Mutation | ✅ **Pass** | In-memory scene-graph traverser |
| **T07** | Option B | 3D Transform Sliders (Scale, Yaw, Elevation)| ✅ **Pass** | Clamped bounds $(0.5\text{x} - 2.5\text{x})$ |
| **T08** | Option B | 5-Step Guided Configurator State Machine | ✅ **Pass** | 1-Click "Reset to Default" button |
| **T09** | System / UX | Hardware Capability & HTTPS Detection | ✅ **Pass** | Graceful alerts & permission modals |

---

## 10. Security, Permissions, & Deployment

1. **HTTPS Context:**
   - WebXR and `getUserMedia` require secure origins (`https://` or `localhost`).
   - For remote mobile testing, Vite is served with `--host`, allowing instant tunneling via `npx localtunnel --port 5173` or `ngrok http 5173`.
2. **Permission Query Graceful Degradation:**
   - Detects `navigator.permissions.query({ name: 'camera' })` where supported (Chrome/Edge/Firefox) with graceful fallbacks for WebKit/Safari.
3. **Camera Stream Lifecycle:**
   - Automatically terminates all active media tracks (`MediaStreamTrack.stop()`) on component unmount to prevent battery drain and hardware locking.
