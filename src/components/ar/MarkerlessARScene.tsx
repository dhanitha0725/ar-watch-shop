import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { Watch, WatchConfiguration } from '../../types/watch';
import { checkWebXRSupport, XRSupportStatus } from '../../utils/webxr';
import { ARStateBadge } from './ARStateBadge';
import { 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Palette, 
  RotateCcw, 
  Smartphone, 
  Sliders
} from 'lucide-react';

interface MarkerlessARSceneProps {
  watch: Watch;
  watches: Watch[];
  config: WatchConfiguration;
  onSelectWatch: (watch: Watch) => void;
  onUpdateConfig: (partial: Partial<WatchConfiguration>) => void;
  onBack: () => void;
  onResetConfig: () => void;
}

export const MarkerlessARScene: React.FC<MarkerlessARSceneProps> = ({
  watch,
  watches,
  config,
  onSelectWatch,
  onUpdateConfig,
  onBack,
  onResetConfig,
}) => {
  const modelViewerRef = useRef<any>(null);
  const [xrStatus, setXrStatus] = useState<XRSupportStatus>({
    isSupported: false,
    hasWebXR: false,
    isMobile: false,
    isSecureContext: true
  });
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaced, setIsPlaced] = useState<boolean>(false);
  const [isReticleLocked, setIsReticleLocked] = useState<boolean>(false);

  useEffect(() => {
    checkWebXRSupport().then((status) => {
      setXrStatus(status);
      if (status.isSupported) {
        setIsReticleLocked(true);
      }
    });
  }, []);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const applyColors = () => {
      try {
        if (!viewer.model) return;
        const materials = viewer.model.materials;
        if (!materials) return;

        const hex = config.strapColor;
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        for (const mat of materials) {
          const matName = (mat.name || '').toLowerCase();
          if (matName.includes('strap') || matName.includes('belt') || matName.includes('band')) {
            mat.pbrMetallicRoughness?.setBaseColorFactor([r, g, b, 1.0]);
          }
          if (matName.includes('dial') || matName.includes('screen') || matName.includes('face')) {
            const dialHex = config.dialColor;
            const dr = parseInt(dialHex.slice(1, 3), 16) / 255;
            const dg = parseInt(dialHex.slice(3, 5), 16) / 255;
            const db = parseInt(dialHex.slice(5, 7), 16) / 255;
            mat.pbrMetallicRoughness?.setBaseColorFactor([dr, dg, db, 1.0]);
          }
        }
      } catch (e) {
        console.warn('Sync material notice:', e);
      }
    };

    viewer.addEventListener('load', applyColors);
    applyColors();

    return () => {
      viewer.removeEventListener('load', applyColors);
    };
  }, [watch, config.strapColor, config.dialColor]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#000', overflow: 'hidden' }}>
      {/* 3D / WebXR Scene Viewport */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <model-viewer
          ref={modelViewerRef}
          src={watch.modelUrl}
          alt={`WebXR 3D representation of ${watch.name}`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-controls
          shadow-intensity="1.4"
          shadow-softness="0.6"
          exposure="1.2"
          environment-image="neutral"
          interaction-prompt="auto"
          camera-orbit={`${Math.round((config.rotationY * 180) / Math.PI)}deg 75deg 105%`}
          style={{ width: '100%', height: '100%', outline: 'none' }}
        >
          <button 
            slot="ar-button" 
            className="btn-primary"
            style={{
              position: 'absolute',
              bottom: '90px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 80,
              padding: '12px 28px',
              fontSize: '14px',
              boxShadow: '0 8px 24px rgba(0, 102, 204, 0.35)',
            }}
          >
            <Sparkles size={16} />
            <span>Place on Real-World Surface</span>
          </button>
        </model-viewer>
      </div>

      {/* Surface Radar / Reticle Simulation Overlay */}
      {!isPlaced && (
        <div style={{
          position: 'absolute',
          bottom: '22%',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            border: '2px dashed rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }} className="animate-radar">
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--colors-primary)',
            }} />
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--colors-ink)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '5px 14px',
            borderRadius: 'var(--rounded-pill)',
            border: '1px solid var(--colors-hairline)',
          }}>
            Surface Detection Reticle
          </div>
        </div>
      )}

      {/* Top Navigation HUD */}
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
          state={isReticleLocked ? 'detected' : 'calibrating'}
          customMessage={
            xrStatus.isSupported 
              ? 'WebXR Surface Tracking Active' 
              : 'Interactive 3D Studio Active'
          }
        />

        <button
          onClick={onResetConfig}
          className="btn-icon"
          title="Reset to Defaults"
        >
          <RotateCcw size={18} color="var(--colors-ink)" />
        </button>
      </div>

      {/* WebXR Notice Banner for Desktop */}
      {!xrStatus.isSupported && (
        <div style={{
          position: 'absolute',
          top: '72px',
          left: '16px',
          right: '16px',
          zIndex: 90,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'var(--rounded-md)',
          border: '1px solid var(--colors-hairline)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <Smartphone size={18} color="var(--colors-primary)" />
          <div style={{ fontSize: '13px', color: 'var(--colors-ink)' }}>
            <strong>Desktop Preview:</strong> Full 3D rotation & customization active. For camera plane placement, open on a <strong>WebXR-capable smartphone</strong>.
          </div>
        </div>
      )}

      {/* Bottom Option B Interactive HUD Configurator */}
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
        <div style={{
          padding: '16px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--rounded-lg)',
          border: '1px solid var(--colors-hairline)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>
          {/* Step Selector Ribbon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--colors-hairline)',
            paddingBottom: '10px',
            marginBottom: '14px',
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { step: 1, label: 'Model', icon: Layers },
                { step: 2, label: 'Materials', icon: Palette },
                { step: 3, label: 'Transform', icon: Sliders },
              ].map(s => {
                const active = activeStep === s.step;
                return (
                  <button
                    key={s.step}
                    onClick={() => setActiveStep(s.step)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--rounded-pill)',
                      backgroundColor: active ? 'var(--colors-ink)' : 'transparent',
                      color: active ? '#ffffff' : 'var(--colors-body-muted)',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: active ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colors-ink)' }}>
              ${watch.price}
            </div>
          </div>

          {/* Step 1: Model Switcher */}
          {activeStep === 1 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {watches.map(w => {
                const isSelected = w.id === watch.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => {
                      onSelectWatch(w);
                      onUpdateConfig({
                        watchId: w.id,
                        strapColor: w.strapColors[0]?.hex || '#18181b',
                        strapMaterial: w.strapColors[0]?.materialType || 'silicone',
                        dialColor: w.dialColors[0]?.hex || '#00f0ff',
                      });
                    }}
                    style={{
                      flexShrink: 0,
                      padding: '8px 14px',
                      borderRadius: 'var(--rounded-md)',
                      backgroundColor: isSelected ? 'var(--colors-canvas-parchment)' : '#ffffff',
                      border: isSelected ? '2px solid var(--colors-primary)' : '1px solid var(--colors-hairline)',
                      color: 'var(--colors-ink)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{w.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--colors-body-muted)' }}>{w.brand}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Live Material Color Customization */}
          {activeStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--colors-body-muted)', marginBottom: '6px' }}>
                  Band Finish:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {watch.strapColors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => onUpdateConfig({
                        strapColor: color.hex,
                        strapMaterial: color.materialType || 'silicone'
                      })}
                      className={`swatch-circle ${config.strapColor.toLowerCase() === color.hex.toLowerCase() ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex, width: '26px', height: '26px' }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: 'var(--colors-body-muted)', marginBottom: '6px' }}>
                  Dial Accent:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {watch.dialColors.map(dial => (
                    <button
                      key={dial.name}
                      onClick={() => onUpdateConfig({ dialColor: dial.hex })}
                      className={`swatch-circle ${config.dialColor.toLowerCase() === dial.hex.toLowerCase() ? 'active' : ''}`}
                      style={{ backgroundColor: dial.hex, width: '26px', height: '26px' }}
                      title={dial.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Scale & Rotation Gestures */}
          {activeStep === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--colors-body-muted)' }}>Scale:</span>
                  <span style={{ fontWeight: 600 }}>{config.scale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={config.scale}
                  onChange={(e) => onUpdateConfig({ scale: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--colors-body-muted)' }}>Rotation:</span>
                  <span style={{ fontWeight: 600 }}>{Math.round((config.rotationY * 180) / Math.PI)}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.PI * 2}
                  step="0.05"
                  value={config.rotationY}
                  onChange={(e) => onUpdateConfig({ rotationY: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
