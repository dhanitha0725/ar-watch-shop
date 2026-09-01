import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { Watch, TrackingState, DepthStatusType } from '../../types/watch';
import {
  Vector3Smoother,
  ScalarSmoother,
  QuaternionSmoother,
  estimateWristPose,
  estimateWristPoseMetric,
  POSITION_SMOOTHING,
  ROTATION_SMOOTHING,
  SCALE_SMOOTHING,
  OCCLUSION_BIAS,
  WristPoseResult,
} from '../../utils/mathSmoothing';
import {
  createDepthOcclusionManager,
  checkWebXRDepthSupport,
  DepthOcclusionManager,
} from '../../ar/wrist/depthOcclusion';
import { applyWatchMaterialCustomization } from '../../utils/materialModifier';
import { ARStateBadge } from './ARStateBadge';
import {
  ArrowLeft,
  Camera,
  Hand,
  Check,
  Sliders,
  Sparkles,
  Layers,
  Activity,
  RotateCcw,
  Bug,
  Eye,
  EyeOff,
  ShieldAlert,
} from 'lucide-react';

interface WristTryOnSceneProps {
  watch: Watch;
  watches: Watch[];
  strapColorHex: string;
  dialColorHex: string;
  onSelectWatch: (watch: Watch) => void;
  onBack: () => void;
}

export const WristTryOnScene: React.FC<WristTryOnSceneProps> = ({
  watch,
  watches,
  strapColorHex,
  dialColorHex,
  onSelectWatch,
  onBack,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // AR & Session State
  const [trackingState, setTrackingState] = useState<TrackingState>('searching');
  const [depthStatus, setDepthStatus] = useState<DepthStatusType>('checking');
  const [isXrActive, setIsXrActive] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [modelLoading, setModelLoading] = useState<boolean>(true);
  const [fallbackWarning, setFallbackWarning] = useState<string | null>(null);

  // Calibration Sliders
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1.0);
  const [yOffset, setYOffset] = useState<number>(0);
  const [occlusionBiasMm, setOcclusionBiasMm] = useState<number>(5.0); // 5mm
  const [showControls, setShowControls] = useState<boolean>(true);

  // Debug Diagnostics
  const [showDebug, setShowDebug] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('debug') === 'true';
    }
    return false;
  });
  const [fps, setFps] = useState<number>(60);
  const [depthDebugInfo, setDepthDebugInfo] = useState<{
    format: string;
    resolution: string;
    biasMm: number;
    rawScale: number;
  }>({
    format: 'None',
    resolution: '0x0',
    biasMm: 5.0,
    rawScale: 1.0,
  });

  const [snapshotTaken, setSnapshotTaken] = useState<boolean>(false);

  // Refs for tracking, Three.js & WebXR
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const xrSessionRef = useRef<any>(null);
  const xrGlBindingRef = useRef<any>(null);
  const depthManagerRef = useRef<DepthOcclusionManager | null>(null);

  const threeSceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    watchGroup: THREE.Group;
    debugAxes: THREE.AxesHelper;
  } | null>(null);

  // Smoothing filters
  const posSmoother = useRef(new Vector3Smoother(1 - POSITION_SMOOTHING));
  const scaleSmoother = useRef(new ScalarSmoother(1 - SCALE_SMOOTHING));
  const rotSmoother = useRef(new QuaternionSmoother(1 - ROTATION_SMOOTHING));

  // FPS & tracking throttler
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const lastInferenceTimeRef = useRef<number>(0);
  const lastPoseRef = useRef<WristPoseResult | null>(null);

  // Check WebXR & Depth Sensing Support on Mount
  useEffect(() => {
    let isMounted = true;

    async function evaluateCapabilities() {
      console.log('[WristAR] Checking WebXR and Depth Sensing capabilities...');
      const status = await checkWebXRDepthSupport();

      if (!isMounted) return;

      if (status.isSupported) {
        setDepthStatus('depth-gpu-active');
        console.log('[WristAR] WebXR supported: Depth sensing (gpu/cpu) available');
      } else {
        setDepthStatus('depth-unavailable');
        setFallbackWarning(
          'Realistic depth occlusion unavailable on this device. Using standard try-on mode.'
        );
        console.log('[WristAR] Depth fallback enabled: Standard try-on active');
      }
    }

    evaluateCapabilities();

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize Three.js scene & Depth Occlusion Manager
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 1000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Enable WebXR support on the Three.js renderer
    renderer.xr.enabled = true;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(100, 300, 200);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0066cc, 1.0);
    dirLight2.position.set(-150, -100, 100);
    scene.add(dirLight2);

    const watchGroup = new THREE.Group();
    watchGroup.visible = false;
    scene.add(watchGroup);

    // 3D Debug Axes Helper
    const debugAxes = new THREE.AxesHelper(30);
    debugAxes.visible = showDebug;
    watchGroup.add(debugAxes);

    // Create Depth Occlusion Manager
    const depthManager = createDepthOcclusionManager();
    depthManagerRef.current = depthManager;

    threeSceneRef.current = { scene, camera, renderer, watchGroup, debugAxes };

    const handleResize = () => {
      if (!containerRef.current || !threeSceneRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      threeSceneRef.current.camera.aspect = w / h;
      threeSceneRef.current.camera.updateProjectionMatrix();
      threeSceneRef.current.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (depthManagerRef.current) {
        depthManagerRef.current.dispose();
      }
      renderer.setAnimationLoop(null);
      renderer.dispose();
    };
  }, []);

  // Update Debug Axes visibility when showDebug changes
  useEffect(() => {
    if (threeSceneRef.current?.debugAxes) {
      threeSceneRef.current.debugAxes.visible = showDebug;
    }
  }, [showDebug]);

  // Update Occlusion Bias in manager when slider changes
  useEffect(() => {
    if (depthManagerRef.current) {
      depthManagerRef.current.setOcclusionBias(occlusionBiasMm / 1000.0);
    }
  }, [occlusionBiasMm]);

  // Load Watch 3D GLB & Patch Materials with Depth Occlusion
  useEffect(() => {
    if (!threeSceneRef.current) return;
    setModelLoading(true);
    const { watchGroup } = threeSceneRef.current;

    // Clear existing watch model children (except debug axes)
    const toRemove = watchGroup.children.filter(
      (c) => c !== threeSceneRef.current?.debugAxes
    );
    toRemove.forEach((c) => watchGroup.remove(c));

    const loader = new GLTFLoader();
    loader.load(
      watch.modelUrl,
      (gltf) => {
        const model = gltf.scene;

        const bbox = new THREE.Box3().setFromObject(model);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        const targetSize = 65;
        const normScale = maxDim > 0 ? targetSize / maxDim : 1;
        model.scale.set(normScale, normScale, normScale);
        model.position.sub(center.multiplyScalar(normScale));

        // Apply color & material customization
        applyWatchMaterialCustomization(
          model,
          watch,
          strapColorHex,
          dialColorHex
        );

        // Patch all meshes with Depth Occlusion shader logic
        if (depthManagerRef.current) {
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              const materials = Array.isArray(mesh.material)
                ? mesh.material
                : [mesh.material];
              materials.forEach((mat) => {
                if (mat) depthManagerRef.current?.patchMaterial(mat);
              });
            }
          });
        }

        const subGroup = new THREE.Group();
        subGroup.add(model);
        subGroup.rotation.set(
          watch.wristRotationOffset[0],
          watch.wristRotationOffset[1],
          watch.wristRotationOffset[2]
        );

        watchGroup.add(subGroup);
        setModelLoading(false);
      },
      undefined,
      (err) => {
        console.error('[WristAR] Failed to load GLB for wrist try-on:', err);
        setModelLoading(false);
      }
    );
  }, [watch, strapColorHex, dialColorHex]);

  // Initialize MediaPipe HandLandmarker & Video Feed
  useEffect(() => {
    let active = true;

    async function initMediaPipe() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        if (!active) return;

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });

        handLandmarkerRef.current = handLandmarker;
        console.log('[WristAR] MediaPipe HandLandmarker GPU initialized');
        startCamera();
      } catch (err) {
        try {
          const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
          );
          const handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numHands: 1,
          });
          handLandmarkerRef.current = handLandmarker;
          console.log('[WristAR] MediaPipe HandLandmarker CPU fallback initialized');
          startCamera();
        } catch (cpuErr) {
          console.error('[WristAR] HandLandmarker init failed:', cpuErr);
          setCameraError('Unable to initialize vision tracking model.');
        }
      }
    }

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!active || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
          setupRenderLoop();
        };
      } catch (err: any) {
        console.error('[WristAR] Camera stream error:', err);
        setCameraError(
          err.message || 'Camera permission denied or camera not accessible.'
        );
      }
    }

    initMediaPipe();

    return () => {
      active = false;
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Single Unified Render & Tracking Animation Loop
  const setupRenderLoop = useCallback(() => {
    const three = threeSceneRef.current;
    if (!three) return;

    let lastVideoTime = -1;

    three.renderer.setAnimationLoop((timestamp, frame) => {
      const now = performance.now();
      frameCountRef.current++;

      // Compute FPS counter every 500ms
      if (now - lastTimeRef.current >= 500) {
        setFps(Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current)));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      const video = videoRef.current;
      const landmarker = handLandmarkerRef.current;
      const depthManager = depthManagerRef.current;

      const container = containerRef.current;
      const canvasWidth = container?.clientWidth || window.innerWidth;
      const canvasHeight = container?.clientHeight || window.innerHeight;

      // 1. MediaPipe Inference (throttled to ~30 FPS on mobile)
      if (
        video &&
        landmarker &&
        video.readyState >= 2 &&
        video.currentTime !== lastVideoTime &&
        now - lastInferenceTimeRef.current >= 30
      ) {
        lastVideoTime = video.currentTime;
        lastInferenceTimeRef.current = now;

        try {
          const results = landmarker.detectForVideo(video, now);

          if (results.landmarks && results.landmarks.length > 0) {
            const rawLandmarks = results.landmarks[0];
            setTrackingState('detected');

            // Compute pose: in XR mode, unproject metric ray; in standard mode, use pixel mapping
            let pose: WristPoseResult;
            if (isXrActive) {
              pose = estimateWristPoseMetric(rawLandmarks, three.camera, 0.42);
            } else {
              pose = estimateWristPose(rawLandmarks, canvasWidth, canvasHeight);
            }

            lastPoseRef.current = pose;

            if (pose.isDetected) {
              const smoothedPos = posSmoother.current.update(pose.position);
              const smoothedScale = scaleSmoother.current.update(
                pose.scaleFactor * scaleMultiplier
              );
              const smoothedQuat = rotSmoother.current.update(pose.quaternion);

              three.watchGroup.position.set(
                smoothedPos.x,
                smoothedPos.y + yOffset,
                smoothedPos.z
              );

              three.watchGroup.quaternion.copy(smoothedQuat);
              three.watchGroup.scale.set(
                smoothedScale,
                smoothedScale,
                smoothedScale
              );
              three.watchGroup.visible = true;

              // Render 2D Landmark Overlay on Debug Canvas if enabled
              if (showDebug && debugCanvasRef.current && pose.landmarks2D) {
                drawDebugLandmarks(
                  debugCanvasRef.current,
                  rawLandmarks,
                  pose.landmarks2D
                );
              }
            }
          } else {
            setTrackingState('searching');
            three.watchGroup.visible = false;
            if (showDebug && debugCanvasRef.current) {
              const ctx = debugCanvasRef.current.getContext('2d');
              ctx?.clearRect(
                0,
                0,
                debugCanvasRef.current.width,
                debugCanvasRef.current.height
              );
            }
          }
        } catch (e) {
          // Ignore transient frame detection drops
        }
      }

      // 2. WebXR Depth Buffer Update (if active XR frame)
      if (frame && isXrActive && depthManager) {
        const session = frame.session;
        const referenceSpace = three.renderer.xr.getReferenceSpace();
        if (referenceSpace) {
          const viewerPose = frame.getViewerPose(referenceSpace);
          if (viewerPose && viewerPose.views.length > 0) {
            const view = viewerPose.views[0];
            const glBinding = xrGlBindingRef.current;
            const hasDepth = depthManager.updateFromXRFrame(
              frame,
              view,
              glBinding,
              three.renderer
            );

            if (hasDepth && showDebug) {
              setDepthDebugInfo({
                format:
                  depthManager.uniforms.uDepthFormat.value === 0
                    ? 'Float32 (GPU)'
                    : 'Luminance-Alpha 16b',
                resolution: `${depthManager.uniforms.uDepthResolution.value.x}x${depthManager.uniforms.uDepthResolution.value.y}`,
                biasMm: occlusionBiasMm,
                rawScale: depthManager.uniforms.uRawValueToMeters.value,
              });
            }
          }
        }
      }

      // 3. Render Three.js scene
      three.renderer.render(three.scene, three.camera);
    });
  }, [isXrActive, scaleMultiplier, yOffset, occlusionBiasMm, showDebug]);

  // Draw 2D wrist landmarks and tracking vectors on debug overlay
  const drawDebugLandmarks = (
    canvas: HTMLCanvasElement,
    landmarks: any[],
    landmarks2D: any
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;

    // Draw palm bounding connections
    ctx.strokeStyle = '#00f0ff';
    ctx.fillStyle = '#00f0ff';

    landmarks.forEach((lm: any, idx: number) => {
      const x = (1.0 - lm.x) * canvas.width; // Mirrored
      const y = lm.y * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, idx === 0 ? 6 : 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw wrist to middle MCP vector
    if (landmarks2D) {
      const wx = (1.0 - landmarks2D.wrist.x) * canvas.width;
      const wy = landmarks2D.wrist.y * canvas.height;
      const mx = (1.0 - landmarks2D.middleMCP.x) * canvas.width;
      const my = landmarks2D.middleMCP.y * canvas.height;

      ctx.beginPath();
      ctx.strokeStyle = '#22c55e';
      ctx.moveTo(wx, wy);
      ctx.lineTo(mx, my);
      ctx.stroke();

      // Wrist Center point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(wx, wy, 7, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // Launch WebXR Immersive AR Session with Depth Sensing
  const handleLaunchWebXR = async () => {
    const three = threeSceneRef.current;
    if (!three || typeof navigator === 'undefined' || !('xr' in navigator)) return;

    try {
      console.log('[WristAR] Requesting WebXR immersive-ar session with depth-sensing...');
      const xr = (navigator as any).xr;

      const sessionInit: any = {
        requiredFeatures: ['depth-sensing'],
        depthSensing: {
          usagePreference: ['gpu-optimized', 'cpu-optimized'],
          dataFormatPreference: ['float32', 'luminance-alpha'],
        },
        optionalFeatures: ['dom-overlay'],
      };

      if (containerRef.current) {
        sessionInit.domOverlay = { root: containerRef.current };
      }

      const session = await xr.requestSession('immersive-ar', sessionInit);
      xrSessionRef.current = session;

      // Create XRWebGLBinding for GPU depth texture
      try {
        const gl = three.renderer.getContext();
        const XRWebGLBindingClass = (window as any).XRWebGLBinding;
        if (XRWebGLBindingClass) {
          xrGlBindingRef.current = new XRWebGLBindingClass(session, gl);
          console.log('[WristAR] XRWebGLBinding initialized for GPU depth');
        }
      } catch (bindErr) {
        console.warn('[WristAR] XRWebGLBinding init notice:', bindErr);
      }

      await three.renderer.xr.setSession(session);
      setIsXrActive(true);
      setDepthStatus('depth-gpu-active');

      session.addEventListener('end', () => {
        console.log('[WristAR] WebXR session ended');
        xrSessionRef.current = null;
        xrGlBindingRef.current = null;
        setIsXrActive(false);
        if (depthManagerRef.current) {
          depthManagerRef.current.uniforms.uDepthActive.value = false;
        }
      });
    } catch (err: any) {
      console.warn('[WristAR] WebXR session failed, falling back to standard try-on:', err);
      setFallbackWarning('WebXR Depth session not supported on this device. Using standard try-on.');
      setDepthStatus('depth-unavailable');
      setIsXrActive(false);
    }
  };

  // Exit WebXR Session
  const handleExitWebXR = async () => {
    if (xrSessionRef.current) {
      await xrSessionRef.current.end();
      xrSessionRef.current = null;
    }
  };

  // Recenter Watch Position
  const handleRecenter = () => {
    posSmoother.current.reset();
    rotSmoother.current.reset();
    scaleSmoother.current.reset();
    setScaleMultiplier(1.0);
    setYOffset(0);
  };

  // Take Snapshot
  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const compositeCanvas = document.createElement('canvas');
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    compositeCanvas.width = w;
    compositeCanvas.height = h;
    const ctx = compositeCanvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, -w, 0, w, h);
    ctx.restore();

    ctx.drawImage(canvasRef.current, 0, 0, w, h);

    const dataUrl = compositeCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `chrono-wrist-tryon-${watch.id}.png`;
    link.href = dataUrl;
    link.click();

    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Background Camera Feed (Hidden in native WebXR session which renders pass-through) */}
      {!isXrActive && (
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)',
            zIndex: 1,
          }}
        />
      )}

      {/* Three.js 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Debug 2D Overlay Canvas */}
      {showDebug && (
        <canvas
          ref={debugCanvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Top HUD Navigation & Status Bar */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <button onClick={onBack} className="btn-icon" title="Back">
          <ArrowLeft size={18} color="var(--colors-ink)" />
        </button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ARStateBadge
            state={trackingState}
            customMessage={
              trackingState === 'detected'
                ? `Wrist Tracked: ${watch.name}`
                : 'Hold wrist in front of camera'
            }
          />

          {/* Depth Sensing Capability Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--rounded-pill)',
              backgroundColor:
                isXrActive && depthStatus === 'depth-gpu-active'
                  ? 'rgba(34, 197, 94, 0.9)'
                  : depthStatus === 'depth-gpu-active'
                  ? 'rgba(14, 165, 233, 0.9)'
                  : 'rgba(245, 158, 11, 0.9)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Sparkles size={12} />
            <span>
              {isXrActive
                ? 'WebXR Depth: Active'
                : depthStatus === 'depth-gpu-active'
                ? 'WebXR Depth: Ready'
                : 'Standard Occlusion'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="btn-icon"
            title={showDebug ? 'Disable Debug HUD' : 'Enable Debug HUD'}
            style={{
              backgroundColor: showDebug ? 'var(--colors-primary)' : 'rgba(255,255,255,0.9)',
              color: showDebug ? '#ffffff' : 'var(--colors-ink)',
            }}
          >
            <Bug size={16} />
          </button>

          <button
            onClick={handleTakeSnapshot}
            className="btn-icon"
            title="Capture Snapshot"
          >
            {snapshotTaken ? (
              <Check size={18} color="var(--colors-success)" />
            ) : (
              <Camera size={18} color="var(--colors-ink)" />
            )}
          </button>
        </div>
      </div>

      {/* Fallback Notice Toast */}
      {fallbackWarning && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: '16px',
            right: '16px',
            zIndex: 90,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--rounded-md)',
            border: '1px solid var(--colors-hairline)',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--colors-ink)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} color="var(--colors-warning)" />
            <span>{fallbackWarning}</span>
          </div>
          <button
            onClick={() => setFallbackWarning(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '11px',
              color: 'var(--colors-body-muted)',
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Enter / Exit Immersive AR WebXR Launch Banner */}
      {depthStatus === 'depth-gpu-active' && (
        <div
          style={{
            position: 'absolute',
            top: fallbackWarning ? '118px' : '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 95,
            display: 'flex',
          }}
        >
          {!isXrActive ? (
            <button
              onClick={handleLaunchWebXR}
              className="btn-primary"
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 24px rgba(0, 102, 204, 0.35)',
              }}
            >
              <Sparkles size={15} />
              <span>Enter Immersive AR (Depth Occlusion)</span>
            </button>
          ) : (
            <button
              onClick={handleExitWebXR}
              className="btn-secondary"
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                backgroundColor: 'rgba(255,255,255,0.92)',
              }}
            >
              <span>Exit WebXR</span>
            </button>
          )}
        </div>
      )}

      {/* Hand Positioning Target Guide */}
      {trackingState === 'searching' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '160px',
              height: '220px',
              border: '2px dashed rgba(255, 255, 255, 0.6)',
              borderRadius: 'var(--rounded-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="animate-radar"
          >
            <Hand size={48} color="rgba(255, 255, 255, 0.7)" />
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--rounded-pill)',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--colors-ink)',
            }}
          >
            Hold wrist up to camera
          </div>
        </div>
      )}

      {/* Camera Error Modal */}
      {cameraError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 200,
            backgroundColor: '#ffffff',
            borderRadius: 'var(--rounded-lg)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            padding: '32px',
            maxWidth: '400px',
            textAlign: 'center',
          }}
        >
          <h4
            style={{
              color: 'var(--colors-danger)',
              marginBottom: '8px',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            Camera Access Required
          </h4>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--colors-body-muted)',
              marginBottom: '20px',
            }}
          >
            {cameraError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            <span>Retry Camera</span>
          </button>
        </div>
      )}

      {/* Floating Debug Diagnostics Panel */}
      {showDebug && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '16px',
            zIndex: 90,
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--rounded-md)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '12px 16px',
            color: '#ffffff',
            fontSize: '11px',
            fontFamily: 'monospace',
            maxWidth: '280px',
            lineHeight: 1.6,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: '#38bdf8',
              marginBottom: '4px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>[DEBUG DIAGNOSTICS]</span>
            <span>{fps} FPS</span>
          </div>
          <div>Tracking: {trackingState.toUpperCase()}</div>
          <div>Mode: {isXrActive ? 'WebXR Immersive AR' : 'Standard 2D Video'}</div>
          <div>Depth API: {depthDebugInfo.format}</div>
          <div>Resolution: {depthDebugInfo.resolution}</div>
          <div>Occlusion Bias: {occlusionBiasMm.toFixed(1)} mm</div>
          <div>Landmarks: 0 (Wrist), 5 (Idx), 17 (Pnk)</div>
          <div>Smoothing: EMA α(pos=0.2, rot=0.15)</div>
        </div>
      )}

      {/* Bottom Floating Calibration HUD */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {showControls && (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 'var(--rounded-lg)',
              border: '1px solid var(--colors-hairline)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
          >
            {/* Watch model selector carousel */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '8px',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {watches.map((w) => {
                  const isSelected = w.id === watch.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => onSelectWatch(w)}
                      style={{
                        flexShrink: 0,
                        padding: '6px 14px',
                        borderRadius: 'var(--rounded-pill)',
                        backgroundColor: isSelected
                          ? 'var(--colors-ink)'
                          : 'var(--colors-canvas-parchment)',
                        border: 'none',
                        color: isSelected ? '#ffffff' : 'var(--colors-ink)',
                        fontSize: '13px',
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {w.name}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleRecenter}
                className="btn-icon"
                title="Recenter Watch Position"
                style={{ flexShrink: 0, width: '32px', height: '32px' }}
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Wrist Calibration Sliders (Scale, Offset & Occlusion Bias) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                marginTop: '10px',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ color: 'var(--colors-body-muted)' }}>Wrist Scale:</span>
                  <span style={{ fontWeight: 600 }}>
                    {scaleMultiplier.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.6"
                  step="0.05"
                  value={scaleMultiplier}
                  onChange={(e) => setScaleMultiplier(parseFloat(e.target.value))}
                />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ color: 'var(--colors-body-muted)' }}>Offset:</span>
                  <span style={{ fontWeight: 600 }}>{yOffset}px</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="2"
                  value={yOffset}
                  onChange={(e) => setYOffset(parseFloat(e.target.value))}
                />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ color: 'var(--colors-body-muted)' }}>Depth Bias:</span>
                  <span style={{ fontWeight: 600 }}>{occlusionBiasMm}mm</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="20.0"
                  step="0.5"
                  value={occlusionBiasMm}
                  onChange={(e) =>
                    setOcclusionBiasMm(parseFloat(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: 'var(--colors-body-muted)',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--rounded-pill)',
              border: '1px solid var(--colors-hairline)',
              padding: '5px 14px',
            }}
          >
            MediaPipe Hand Vision • WebXR Depth Occlusion • Exponential Filter
          </div>

          <button
            onClick={() => setShowControls(!showControls)}
            className="btn-secondary"
            style={{ padding: '6px 14px', minHeight: '32px', fontSize: '12px' }}
          >
            <Sliders size={13} />
            <span>{showControls ? 'Hide Sliders' : 'Calibrate Fit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
