import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { Watch, WatchConfiguration } from '../../types/watch';
import { RotateCw, Maximize2, Camera, Check } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        poster?: string;
        alt?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'auto-rotate-delay'?: string;
        'rotation-per-second'?: string;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        exposure?: string;
        'environment-image'?: string;
        'skybox-image'?: string;
        'interaction-prompt'?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: string;
        scale?: string;
        'camera-orbit'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'field-of-view'?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: 'auto' | 'interaction' | 'manual';
      };
    }
  }
}

interface Interactive3DViewerProps {
  watch: Watch;
  config?: WatchConfiguration;
  scale?: number;
  rotationY?: number;
  autoRotateDefault?: boolean;
  onSnapshot?: (dataUrl: string) => void;
  height?: string;
  hideControls?: boolean;
  loading?: 'lazy' | 'eager';
}

export const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({
  watch,
  config,
  scale,
  rotationY,
  autoRotateDefault = true,
  onSnapshot,
  height = '520px',
  hideControls = false,
  loading = 'eager',
}) => {
  const modelViewerRef = useRef<any>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotateDefault);
  const [exposure] = useState<number>(1.1);
  const [isLoading, setIsLoading] = useState(true);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  // Active transform values from props
  const currentScale = scale ?? config?.scale ?? 1.0;
  const currentRotationY = rotationY ?? config?.rotationY ?? 0;
  const orbitDegree = Math.round((currentRotationY * 180) / Math.PI);

  // Update camera orbit on model-viewer when rotation changes
  useEffect(() => {
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = `${orbitDegree}deg 75deg 105%`;
    }
  }, [orbitDegree]);

  // Sync autoRotate property with model-viewer DOM element
  useEffect(() => {
    if (modelViewerRef.current) {
      modelViewerRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  // Reset auto-rotate state when switching models
  useEffect(() => {
    setIsAutoRotating(autoRotateDefault);
  }, [watch.modelUrl, autoRotateDefault]);

  // Handle model loading state strictly on model URL changes (do NOT depend on isAutoRotating)
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleModelLoad = () => {
      setIsLoading(false);
      if (modelViewerRef.current) {
        modelViewerRef.current.autoRotate = isAutoRotating;
      }
    };

    setIsLoading(true);
    viewer.addEventListener('load', handleModelLoad);

    return () => {
      viewer.removeEventListener('load', handleModelLoad);
    };
  }, [watch.modelUrl]);

  const handleToggleAutoRotate = () => {
    setIsAutoRotating((prev) => {
      const next = !prev;
      if (modelViewerRef.current) {
        modelViewerRef.current.autoRotate = next;
      }
      return next;
    });
  };

  const handleTakeSnapshot = async () => {
    if (!modelViewerRef.current) return;
    try {
      const dataUrl = await modelViewerRef.current.toDataURL('image/png');
      if (onSnapshot) onSnapshot(dataUrl);

      const link = document.createElement('a');
      link.download = `${watch.id}-3d-snapshot.png`;
      link.href = dataUrl;
      link.click();

      setSnapshotTaken(true);
      setTimeout(() => setSnapshotTaken(false), 2000);
    } catch (err) {
      console.error('Failed to take snapshot:', err);
    }
  };

  const handleToggleFullscreen = () => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;
    if (!document.fullscreenElement) {
      viewer.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.().catch(console.error);
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: height,
      backgroundColor: 'var(--colors-canvas-parchment)',
      borderRadius: 'var(--rounded-lg)',
      border: 'none',
      overflow: 'hidden',
    }}>
      {/* 3D Loading State */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--colors-canvas-parchment)',
          zIndex: 10,
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(0, 0, 0, 0.1)',
            borderTopColor: 'var(--colors-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '12px',
          }} />
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colors-ink)' }}>
            Loading {watch.name}
          </div>
          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
            @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .animate-spin-slow { animation: spinSlow 8s linear infinite; }
          `}</style>
        </div>
      )}

      {/* Google Model Viewer Web Component */}
      <model-viewer
        ref={modelViewerRef}
        src={watch.modelUrl}
        alt={`3D representation of ${watch.name}`}
        camera-controls
        scale={`${currentScale} ${currentScale} ${currentScale}`}
        auto-rotate={isAutoRotating}
        auto-rotate-delay="0"
        rotation-per-second="18deg"
        shadow-intensity="1.2"
        shadow-softness="0.8"
        exposure={exposure.toString()}
        environment-image="neutral"
        interaction-prompt="none"
        camera-orbit={`${orbitDegree}deg 75deg 105%`}
        min-camera-orbit="auto auto 40%"
        max-camera-orbit="auto auto 200%"
        loading={loading}
        style={{ width: '100%', height: '100%', outline: 'none' }}
      />

      {/* Floating Toolbar */}
      {!hideControls && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 20,
        }}>
          {/* Auto Rotate Toggle */}
          <button
            onClick={handleToggleAutoRotate}
            className="btn-icon"
            title={isAutoRotating ? 'Pause Rotation' : 'Start Auto Rotate'}
            aria-label={isAutoRotating ? 'Pause Rotation' : 'Start Auto Rotate'}
            style={{
              backgroundColor: isAutoRotating ? 'var(--colors-surface-1)' : 'var(--colors-canvas)',
              borderColor: isAutoRotating ? 'var(--colors-primary)' : 'var(--colors-hairline)',
            }}
          >
            <RotateCw
              size={17}
              className={isAutoRotating ? 'animate-spin-slow' : ''}
              color={isAutoRotating ? 'var(--colors-primary)' : 'var(--colors-ink)'}
            />
          </button>

          {/* Snapshot Capture */}
          <button
            onClick={handleTakeSnapshot}
            className="btn-icon"
            title="Save Snapshot"
          >
            {snapshotTaken ? <Check size={17} color="var(--colors-success)" /> : <Camera size={17} color="var(--colors-ink)" />}
          </button>



          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="btn-icon"
            title="Fullscreen"
          >
            <Maximize2 size={17} color="var(--colors-ink)" />
          </button>
        </div>
      )}

      {/* Bottom Subtle Interaction Hint */}
      {!hideControls && (
        <div style={{
          position: 'absolute',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--colors-surface-1)',
          border: '1px solid var(--colors-hairline)',
          padding: '4px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--colors-ink-muted)',
          pointerEvents: 'none',
        }}>
          <span>DRAG TO ORBIT</span>
          <span>//</span>
          <span>SCROLL TO ZOOM</span>
        </div>
      )}
    </div>
  );
};
