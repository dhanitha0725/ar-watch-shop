import React, { useEffect, useRef, useState } from 'react';
import { Watch, TrackingState } from '../../types/watch';
import { ARStateBadge } from './ARStateBadge';
import { ArrowLeft, QrCode, Sliders } from 'lucide-react';

interface MarkerARSceneProps {
  watch: Watch;
  watches: Watch[];
  onSelectWatch: (watch: Watch) => void;
  onBack: () => void;
  onOpenMarkerModal: () => void;
}

export const MarkerARScene: React.FC<MarkerARSceneProps> = ({
  watch,
  watches,
  onSelectWatch,
  onBack,
  onOpenMarkerModal,
}) => {
  const [trackingState, setTrackingState] = useState<TrackingState>('searching');
  const [modelState, setModelState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [modelError, setModelError] = useState<string | null>(null);
  const [modelScaleMultiplier, setModelScaleMultiplier] = useState<number>(1.0);
  const [showControls, setShowControls] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const scaleParts = watch.markerScale.split(' ').map(Number);
  const computedScale = scaleParts.map(s => (s * modelScaleMultiplier).toFixed(4)).join(' ');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source === 'mindar-marker-frame') {
        if (event.data.type === 'modelLoading') {
          setModelState('loading');
          setModelError(null);
        } else if (event.data.type === 'modelLoaded') {
          setModelState('ready');
          setModelError(null);
        } else if (event.data.type === 'modelError') {
          setModelState('error');
          setModelError(event.data.data || 'Unable to load the 3D model.');
        } else if (event.data.type === 'markerFound') {
          setTrackingState('detected');
        } else if (event.data.type === 'markerLost') {
          setTrackingState('lost');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Update iframe model/scale when watch or scale multiplier changes
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        target: 'mindar-marker-frame',
        action: 'updateWatch',
        modelUrl: watch.modelUrl,
        scale: computedScale,
        rotation: watch.markerRotation || '0 0 0',
      }, '*');
    }
  }, [watch, computedScale]);

  useEffect(() => {
    setModelState('loading');
    setModelError(null);
    setTrackingState('searching');
  }, [watch.modelUrl]);

  const iframeSrc = `/ar-marker-frame.html?model=${encodeURIComponent(watch.modelUrl)}&scale=${encodeURIComponent(computedScale)}&rotation=${encodeURIComponent(watch.markerRotation || '0 0 0')}`;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#000', overflow: 'hidden' }}>
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
            modelState === 'error' ? `3D model failed: ${modelError}` :
            modelState === 'loading' ? `Loading ${watch.name}…` :
            trackingState === 'searching' ? 'Point camera at Image Target Card' :
            trackingState === 'detected' ? `Tracking ${watch.name}` :
            'Target lost — realigning'
          }
        />

        <button
          onClick={onOpenMarkerModal}
          className="btn-icon"
          title="Display / Print Target Card"
        >
          <QrCode size={18} color="var(--colors-ink)" />
        </button>
      </div>

      {/* Standalone MindAR Camera & Tracking Frame */}
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        allow="camera; microphone; display-capture"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        title="MindAR Image Target Tracking Scene"
      />

      {/* Bottom Floating Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '16px',
        right: '16px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {showControls && (
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--rounded-lg)',
            border: '1px solid var(--colors-hairline)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}>
            {/* Model Switcher Row */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
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
                      fontFamily: 'var(--font-body)',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {w.name}
                  </button>
                );
              })}
            </div>

            {/* Scale Slider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', gap: '14px' }}>
              <span style={{ fontSize: '12px', color: 'var(--colors-body-muted)', whiteSpace: 'nowrap' }}>
                Scale:
              </span>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={modelScaleMultiplier}
                onChange={(e) => setModelScaleMultiplier(parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--colors-primary)' }}>
                {modelScaleMultiplier.toFixed(1)}x
              </span>
            </div>
          </div>
        )}

        {/* Marker HUD bottom bar */}
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
            MindAR 6DOF Tracking • Natural Feature Card
          </div>

          <button
            onClick={() => setShowControls(!showControls)}
            className="btn-secondary"
            style={{ padding: '6px 14px', minHeight: '32px', fontSize: '12px' }}
          >
            <Sliders size={13} />
            <span>{showControls ? 'Hide Controls' : 'Show Controls'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
