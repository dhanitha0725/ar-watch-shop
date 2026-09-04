import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { Watch } from '../../types/watch';
import { RotateCw, Maximize2, Camera, Sun, RefreshCw, Check } from 'lucide-react';

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
  autoRotateDefault?: boolean;
  onSnapshot?: (dataUrl: string) => void;
  height?: string;
  hideControls?: boolean;
  loading?: 'lazy' | 'eager';
}

export const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({
  watch,
  autoRotateDefault = true,
  onSnapshot,
  height = '520px',
  hideControls = false,
  loading = 'eager',
}) => {
  const modelViewerRef = useRef<any>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotateDefault);
  const [lightingPreset, setLightingPreset] = useState<'neutral' | 'studio'>('neutral');
  const [exposure, setExposure] = useState<number>(1.1);
  const [isLoading, setIsLoading] = useState(true);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleModelLoad = () => {
      setIsLoading(false);
    };

    setIsLoading(true);
    viewer.addEventListener('load', handleModelLoad);

    return () => {
      viewer.removeEventListener('load', handleModelLoad);
    };
  }, [watch.modelUrl]);

  const handleResetCamera = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = '0deg 75deg 105%';
      modelViewerRef.current.fieldOfView = 'auto';
    }
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
          `}</style>
        </div>
      )}

      {/* Google Model Viewer Web Component */}
      <model-viewer
        ref={modelViewerRef}
        src={watch.modelUrl}
        alt={`3D representation of ${watch.name}`}
        camera-controls
        auto-rotate={isAutoRotating}
        auto-rotate-delay="1000"
        rotation-per-second="18deg"
        shadow-intensity="1.2"
        shadow-softness="0.8"
        exposure={exposure.toString()}
        environment-image={lightingPreset === 'neutral' ? 'neutral' : 'legacy'}
        interaction-prompt="none"
        camera-orbit="0deg 75deg 105%"
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
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="btn-icon"
            title={isAutoRotating ? 'Pause Rotation' : 'Auto Rotate'}
          >
            <RotateCw size={17} className={isAutoRotating ? 'animate-spin-slow' : ''} color="var(--colors-ink)" />
          </button>

          {/* Snapshot Capture */}
          <button
            onClick={handleTakeSnapshot}
            className="btn-icon"
            title="Save Snapshot"
          >
            {snapshotTaken ? <Check size={17} color="var(--colors-success)" /> : <Camera size={17} color="var(--colors-ink)" />}
          </button>

          {/* Lighting Switcher */}
          <button
            onClick={() => {
              const next = lightingPreset === 'neutral' ? 'studio' : 'neutral';
              setLightingPreset(next);
              setExposure(next === 'studio' ? 1.35 : 1.1);
            }}
            className="btn-icon"
            title={`Lighting: ${lightingPreset}`}
          >
            <Sun size={17} color="var(--colors-ink)" />
          </button>

          {/* Reset Camera Orbit */}
          <button
            onClick={handleResetCamera}
            className="btn-icon"
            title="Reset Camera"
          >
            <RefreshCw size={17} color="var(--colors-ink)" />
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
