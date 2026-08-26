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
  const [modelScaleMultiplier, setModelScaleMultiplier] = useState<number>(1.0);
  const [showControls, setShowControls] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const sceneContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach(track => track.stop());
      })
      .catch((err) => {
        setCameraError('Camera access denied or unavailable. Please enable camera permissions.');
      });

    const handleMarkerFound = () => setTrackingState('detected');
    const handleMarkerLost = () => setTrackingState('lost');

    window.addEventListener('markerFound', handleMarkerFound);
    window.addEventListener('markerLost', handleMarkerLost);

    return () => {
      window.removeEventListener('markerFound', handleMarkerFound);
      window.removeEventListener('markerLost', handleMarkerLost);

      const videoElements = document.querySelectorAll('video');
      videoElements.forEach(v => {
        if (v.srcObject) {
          const s = v.srcObject as MediaStream;
          s.getTracks().forEach(t => t.stop());
        }
      });
      const arContainers = document.querySelectorAll('.a-canvas, a-scene');
      arContainers.forEach(el => el.remove());
    };
  }, []);

  const scaleParts = watch.markerScale.split(' ').map(Number);
  const computedScale = scaleParts.map(s => (s * modelScaleMultiplier).toFixed(4)).join(' ');

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
            trackingState === 'searching' ? 'Point camera at Hiro / Marker' :
            trackingState === 'detected' ? `Tracking ${watch.name}` :
            'Marker lost — realigning'
          }
        />

        <button
          onClick={onOpenMarkerModal}
          className="btn-icon"
          title="Display / Print AR Marker"
        >
          <QrCode size={18} color="var(--colors-ink)" />
        </button>
      </div>

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
            <span>Retry Permissions</span>
          </button>
        </div>
      )}

      {/* Embedded A-Frame & AR.js Scene */}
      <div 
        ref={sceneContainerRef}
        style={{ width: '100%', height: '100%' }}
        dangerouslySetInnerHTML={{
          __html: `
            <a-scene
              embedded
              arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
              renderer="logarithmicDepthBuffer: true; antialias: true; alpha: true;"
              vr-mode-ui="enabled: false"
              style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
            >
              <a-entity light="type: ambient; color: #ffffff; intensity: 1.2;"></a-entity>
              <a-entity light="type: directional; color: #ffffff; intensity: 1.5; position: 1 4 2"></a-entity>
              <a-entity light="type: directional; color: #0066cc; intensity: 0.8; position: -2 -1 1"></a-entity>

              <!-- Standard Hiro Marker -->
              <a-marker preset="hiro" id="hiro-marker" emitevents="true">
                <a-entity
                  id="watch-model-hiro"
                  gltf-model="url(${watch.modelUrl})"
                  scale="${computedScale}"
                  position="0 0.1 0"
                  rotation="${watch.markerRotation || '0 0 0'}"
                  animation="property: rotation; to: 0 360 0; loop: true; dur: 12000; easing: linear;"
                ></a-entity>
              </a-marker>

              <!-- Custom Pattern Marker -->
              <a-marker type="pattern" url="/markers/watch-marker.patt" id="custom-marker" emitevents="true">
                <a-entity
                  id="watch-model-custom"
                  gltf-model="url(${watch.modelUrl})"
                  scale="${computedScale}"
                  position="0 0.1 0"
                  rotation="${watch.markerRotation || '0 0 0'}"
                  animation="property: rotation; to: 0 360 0; loop: true; dur: 12000; easing: linear;"
                ></a-entity>
              </a-marker>

              <a-entity camera></a-entity>
            </a-scene>
          `
        }}
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
            AR.js 6DOF Tracking • Hiro & .patt
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
