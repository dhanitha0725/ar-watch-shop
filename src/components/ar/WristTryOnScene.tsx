import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { Watch, TrackingState } from '../../types/watch';
import { Vector3Smoother, ScalarSmoother, estimateWristPose } from '../../utils/mathSmoothing';
import { applyWatchMaterialCustomization } from '../../utils/materialModifier';
import { ARStateBadge } from './ARStateBadge';
import { 
  ArrowLeft, 
  Camera, 
  Hand, 
  Check, 
  Sliders
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
  const containerRef = useRef<HTMLDivElement>(null);

  const [trackingState, setTrackingState] = useState<TrackingState>('searching');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [modelLoading, setModelLoading] = useState<boolean>(true);
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1.0);
  const [yOffset, setYOffset] = useState<number>(0);
  const [snapshotTaken, setSnapshotTaken] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const threeSceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    watchGroup: THREE.Group;
  } | null>(null);

  const posSmoother = useRef(new Vector3Smoother(0.22));
  const scaleSmoother = useRef(new ScalarSmoother(0.2));

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(100, 300, 200);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0066cc, 1.0);
    dirLight2.position.set(-150, -100, 100);
    scene.add(dirLight2);

    const watchGroup = new THREE.Group();
    watchGroup.visible = false;
    scene.add(watchGroup);

    threeSceneRef.current = { scene, camera, renderer, watchGroup };

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
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!threeSceneRef.current) return;
    setModelLoading(true);
    const { watchGroup } = threeSceneRef.current;

    while (watchGroup.children.length > 0) {
      watchGroup.remove(watchGroup.children[0]);
    }

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

        applyWatchMaterialCustomization(model, watch, strapColorHex, dialColorHex);

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
        console.error('Failed to load GLB for wrist try-on:', err);
        setModelLoading(false);
      }
    );
  }, [watch, strapColorHex, dialColorHex]);

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
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });

        handLandmarkerRef.current = handLandmarker;
        startCamera();
      } catch (err) {
        try {
          const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
          );
          const handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numHands: 1,
          });
          handLandmarkerRef.current = handLandmarker;
          startCamera();
        } catch (cpuErr) {
          console.error('HandLandmarker init failed:', cpuErr);
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
          startTrackingLoop();
        };
      } catch (err: any) {
        console.error('Camera stream error:', err);
        setCameraError(err.message || 'Camera permission denied or camera not accessible.');
      }
    }

    initMediaPipe();

    return () => {
      active = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startTrackingLoop = () => {
    let lastVideoTime = -1;

    const renderLoop = (time: number) => {
      animationFrameIdRef.current = requestAnimationFrame(renderLoop);

      const video = videoRef.current;
      const landmarker = handLandmarkerRef.current;
      const three = threeSceneRef.current;

      if (!video || !landmarker || !three || video.readyState < 2) return;

      const container = containerRef.current;
      const canvasWidth = container?.clientWidth || window.innerWidth;
      const canvasHeight = container?.clientHeight || window.innerHeight;

      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        try {
          const results = landmarker.detectForVideo(video, performance.now());

          if (results.landmarks && results.landmarks.length > 0) {
            const rawLandmarks = results.landmarks[0];
            setTrackingState('detected');

            const pose = estimateWristPose(rawLandmarks, canvasWidth, canvasHeight);

            if (pose.isDetected) {
              const smoothedPos = posSmoother.current.update(pose.position);
              const smoothedScale = scaleSmoother.current.update(pose.scaleFactor * scaleMultiplier);

              three.watchGroup.position.set(
                smoothedPos.x,
                smoothedPos.y + yOffset,
                smoothedPos.z
              );

              three.watchGroup.rotation.set(
                pose.rotation.x,
                pose.rotation.y,
                pose.rotation.z
              );

              three.watchGroup.scale.set(smoothedScale, smoothedScale, smoothedScale);
              three.watchGroup.visible = true;
            }
          } else {
            setTrackingState('searching');
            three.watchGroup.visible = false;
          }
        } catch (e) {}
      }

      three.renderer.render(three.scene, three.camera);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);
  };

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
      {/* Mirrored Video Feed */}
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

      {/* Transparent Three.js Canvas Overlay */}
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

      {/* Top HUD Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={onBack}
          className="btn-icon"
          title="Back"
        >
          <ArrowLeft size={18} color="var(--colors-ink)" />
        </button>

        <ARStateBadge
          state={trackingState}
          customMessage={
            trackingState === 'detected' ? `Wrist Tracked: ${watch.name}` :
            'Place wrist in front of camera'
          }
        />

        <button
          onClick={handleTakeSnapshot}
          className="btn-icon"
          title="Capture Snapshot"
        >
          {snapshotTaken ? <Check size={18} color="var(--colors-success)" /> : <Camera size={18} color="var(--colors-ink)" />}
        </button>
      </div>

      {/* Hand Guidance Target */}
      {trackingState === 'searching' && (
        <div style={{
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
        }}>
          <div style={{
            width: '160px',
            height: '220px',
            border: '2px dashed rgba(255, 255, 255, 0.6)',
            borderRadius: 'var(--rounded-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }} className="animate-radar">
            <Hand size={48} color="rgba(255, 255, 255, 0.7)" />
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--rounded-pill)',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--colors-ink)',
          }}>
            Hold wrist up to camera
          </div>
        </div>
      )}

      {/* Camera Error Notice */}
      {cameraError && (
        <div style={{
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
        }}>
          <h4 style={{ color: 'var(--colors-danger)', marginBottom: '8px', fontSize: '18px', fontWeight: 600 }}>Camera Access Required</h4>
          <p style={{ fontSize: '14px', color: 'var(--colors-body-muted)', marginBottom: '20px' }}>{cameraError}</p>
          <button onClick={() => window.location.reload()} className="btn-primary" style={{ width: '100%' }}>
            <span>Retry Camera</span>
          </button>
        </div>
      )}

      {/* Bottom Floating Calibration HUD */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {showControls && (
          <div style={{
            padding: '16px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--rounded-lg)',
            border: '1px solid var(--colors-hairline)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}>
            {/* Watch selector row */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {watches.map(w => {
                const isSelected = w.id === watch.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => onSelectWatch(w)}
                    style={{
                      flexShrink: 0,
                      padding: '6px 14px',
                      borderRadius: 'var(--rounded-pill)',
                      backgroundColor: isSelected ? 'var(--colors-ink)' : 'var(--colors-canvas-parchment)',
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

            {/* Wrist Calibration Sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--colors-body-muted)' }}>Wrist Scale:</span>
                  <span style={{ fontWeight: 600 }}>{scaleMultiplier.toFixed(2)}x</span>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
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
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontSize: '12px',
            color: 'var(--colors-body-muted)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--rounded-pill)',
            border: '1px solid var(--colors-hairline)',
            padding: '5px 14px',
          }}>
            MediaPipe Vision • Landmarks 0, 5, 17 • EMA Filtered
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
