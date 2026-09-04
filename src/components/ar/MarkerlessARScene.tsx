import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { Watch, WatchConfiguration } from '../../types/watch';
import { checkWebXRSupport, XRSupportStatus } from '../../utils/webxr';
import { ARStateBadge } from './ARStateBadge';
import { ARHelpPanel } from './ARHelpPanel';
import { AR_COPY } from '../../data/arCopy';
import { 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  RotateCcw, 
  Smartphone, 
  Sliders,
  HelpCircle,
  X
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
  const [arState, setArState] = useState<'idle' | 'starting' | 'active' | 'failed'>('idle');
  const [arError, setArError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  const [showControls, setShowControls] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  useEffect(() => {
    checkWebXRSupport().then((status) => {
      setXrStatus(status);
    });
  }, []);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleArStatus = (event: CustomEvent<{ status: string }>) => {
      switch (event.detail.status) {
        case 'session-started':
          setArState('active');
          setArError(null);
          setIsPlaced(false);
          break;
        case 'object-placed':
          setIsPlaced(true);
          break;
        case 'not-presenting':
          setArState('idle');
          setIsPlaced(false);
          break;
        case 'failed':
          setArState('failed');
          setArError(AR_COPY.surface.error);
          break;
      }
    };

    viewer.addEventListener('ar-status', handleArStatus);
    return () => viewer.removeEventListener('ar-status', handleArStatus);
  }, []);

  const launchAR = async () => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    setArState('starting');
    setArError(null);

    try {
      if (!viewer.canActivateAR) {
        throw new Error(AR_COPY.surface.notReady);
      }
      await viewer.activateAR();
    } catch (error) {
      setArState('failed');
      setArError(error instanceof Error && error.message === AR_COPY.surface.notReady
        ? error.message
        : AR_COPY.surface.error);
    }
  };

  const handleDoubleTap = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setIsAutoRotating(current => !current);
  };

  // All models are normalized to an approximately 12 cm maximum dimension.
  // config.scale is a user-controlled multiplier on top of that baseline.
  const normalizedScale = (watch.webARScale * config.scale).toFixed(4);

  const statusMessage = arError ? arError :
    arState === 'active'
      ? (isPlaced ? AR_COPY.surface.placed : AR_COPY.surface.searching)
      : arState === 'starting'
        ? AR_COPY.surface.starting
        : xrStatus.isSupported
          ? AR_COPY.surface.ready
          : AR_COPY.surface.desktop;

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
          scale={`${normalizedScale} ${normalizedScale} ${normalizedScale}`}
          xr-environment
          camera-controls
          auto-rotate={isAutoRotating}
          auto-rotate-delay="1000"
          rotation-per-second="18deg"
          touch-action="pan-y"
          onDoubleClick={handleDoubleTap}
          shadow-intensity="1.4"
          shadow-softness="0.6"
          exposure="1.2"
          environment-image="neutral"
          interaction-prompt="auto"
          camera-orbit={`${Math.round((config.rotationY * 180) / Math.PI)}deg 75deg 105%`}
          style={{ width: '100%', height: '100%', outline: 'none' }}
        >
          <button slot="ar-button" style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} />
        </model-viewer>
      </div>

      {/* Top Navigation HUD */}
      <header className="ar-hud-top" role="banner">
        <div className="ar-hud-bar">
          {/* Left Side: Back + Reset/Start Over Button */}
          <div className="ar-hud-left">
            <button
              onClick={onBack}
              className="btn-icon"
              title="Back"
              aria-label="Back"
            >
              <ArrowLeft size={18} color="var(--colors-ink)" />
            </button>

            <button
              onClick={() => {
                setIsPlaced(false);
                onResetConfig();
              }}
              className="btn-icon"
              title={AR_COPY.common.startOver}
              aria-label={AR_COPY.common.startOver}
            >
              <RotateCcw size={18} color="var(--colors-ink)" />
            </button>
          </div>

          {/* Desktop Center: Top State Showing Component */}
          <div className="ar-hud-center ar-hud-center-desktop">
            <ARStateBadge
              state={arState === 'active' ? 'detected' : 'calibrating'}
              customMessage={statusMessage}
            />
          </div>

          {/* Right Side: Help and Controls Toggles */}
          <div className="ar-hud-right">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="btn-icon"
              title={showHelp ? AR_COPY.common.closeHelp : AR_COPY.common.help}
              aria-label={showHelp ? AR_COPY.common.closeHelp : AR_COPY.common.help}
              style={{
                backgroundColor: showHelp ? 'var(--colors-ink)' : 'var(--colors-canvas)',
                color: showHelp ? '#ffffff' : 'var(--colors-ink)',
              }}
            >
              <HelpCircle size={18} />
            </button>

            {!showControls && (
              <button
                onClick={() => setShowControls(true)}
                className="btn-secondary"
                title={AR_COPY.common.showControls}
                aria-label={AR_COPY.common.showControls}
                style={{ padding: '0 12px', minHeight: '36px', height: '36px', fontSize: '12px' }}
              >
                <Sliders size={14} />
                <span>Controls</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile State Showing Row */}
        <div className="ar-hud-status-mobile">
          <ARStateBadge
            state={arState === 'active' ? 'detected' : 'calibrating'}
            customMessage={statusMessage}
          />
        </div>
      </header>

      {/* User Guideline Model on the Left Side */}
      {showHelp && (
        <ARHelpPanel
          mode="surface"
          placement="left"
          onClose={() => setShowHelp(false)}
        />
      )}

      {/* WebXR Notice Banner for Non-Supported Desktop */}
      {!xrStatus.isSupported && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 90,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--colors-hairline)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '360px',
        }}>
          <Smartphone size={18} color="var(--colors-primary)" />
          <div style={{ fontSize: '12px', color: 'var(--colors-ink)', lineHeight: 1.4 }}>
            <strong>{AR_COPY.surface.desktop}</strong>
          </div>
        </div>
      )}

      {/* Right-Side Operator Window */}
      {showControls && (
        <aside
          className="ar-operator-window"
          role="region"
          aria-label="AR Operator Controls"
        >
          {/* Header */}
          <div className="ar-operator-header">
            <div className="ar-operator-title">
              <Sliders size={14} color="var(--colors-primary)" />
              <span>Controls</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--colors-primary)', marginLeft: '6px' }}>
                ${watch.price}
              </span>
            </div>
            <button
              onClick={() => setShowControls(false)}
              className="btn-icon"
              title={AR_COPY.common.hideControls}
              aria-label={AR_COPY.common.hideControls}
              style={{ width: '28px', height: '28px', border: 'none', background: 'transparent' }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="ar-operator-body">
            {/* Launch AR Button when supported */}
            {xrStatus.isSupported && arState !== 'active' && (
              <button
                onClick={launchAR}
                disabled={arState === 'starting'}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: '13px',
                  boxShadow: '0 4px 16px rgba(15, 98, 254, 0.3)',
                  opacity: arState === 'starting' ? 0.7 : 1,
                  cursor: arState === 'starting' ? 'wait' : 'pointer',
                }}
              >
                <Sparkles size={15} />
                <span>{arState === 'starting' ? AR_COPY.surface.starting : AR_COPY.surface.button}</span>
              </button>
            )}

            {/* Step Selector Ribbon */}
            <div className="ar-operator-tabs">
              {[
                { step: 1, label: 'Model', icon: Layers },
                { step: 2, label: 'Transform', icon: Sliders },
              ].map(s => {
                const active = activeStep === s.step;
                const Icon = s.icon;
                return (
                  <button
                    key={s.step}
                    onClick={() => setActiveStep(s.step)}
                    className={`ar-tab-pill ${active ? 'active' : ''}`}
                    type="button"
                  >
                    <Icon size={12} />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Step 1: Model Switcher */}
            {activeStep === 1 && (
              <div>
                <div className="ar-operator-section-label">Select Model</div>
                <div className="ar-model-list">
                  {watches.map(w => {
                    const isSelected = w.id === watch.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => {
                          onSelectWatch(w);
                          onUpdateConfig({
                            watchId: w.id,
                          });
                        }}
                        className={`ar-model-btn ${isSelected ? 'active' : ''}`}
                        type="button"
                      >
                        <div>
                          <div style={{ fontWeight: isSelected ? 600 : 400 }}>{w.name}</div>
                          <div style={{ fontSize: '11px', opacity: 0.65 }}>{w.brand}</div>
                        </div>
                        {isSelected && (
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--colors-primary)',
                            display: 'inline-block'
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Scale & Rotation Gestures */}
            {activeStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div className="ar-operator-section-label">Scale</div>
                  <div className="ar-scale-container">
                    <button
                      type="button"
                      className="ar-scale-btn"
                      title="Decrease scale"
                      aria-label="Decrease scale"
                      onClick={() => onUpdateConfig({ scale: Math.max(0.5, parseFloat((config.scale - 0.05).toFixed(2))) })}
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={config.scale}
                      onChange={(e) => onUpdateConfig({ scale: parseFloat(e.target.value) })}
                      className="ar-scale-slider"
                      aria-label="Adjust scale"
                    />
                    <button
                      type="button"
                      className="ar-scale-btn"
                      title="Increase scale"
                      aria-label="Increase scale"
                      onClick={() => onUpdateConfig({ scale: Math.min(2.0, parseFloat((config.scale + 0.05).toFixed(2))) })}
                    >
                      +
                    </button>
                    <span className="ar-scale-val">
                      {config.scale.toFixed(2)}x
                    </span>
                  </div>
                </div>

                <div>
                  <div className="ar-operator-section-label">Rotation</div>
                  <div className="ar-scale-container">
                    <input
                      type="range"
                      min="0"
                      max={Math.PI * 2}
                      step="0.05"
                      value={config.rotationY}
                      onChange={(e) => onUpdateConfig({ rotationY: parseFloat(e.target.value) })}
                      className="ar-scale-slider"
                      style={{ flex: 1, width: 'auto', maxWidth: 'none' }}
                      aria-label="Adjust rotation"
                    />
                    <span className="ar-scale-val">
                      {Math.round((config.rotationY * 180) / Math.PI)}°
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Status Hint */}
          <div className="ar-operator-footer">
            {arState === 'active'
              ? (isPlaced ? AR_COPY.surface.placed : AR_COPY.surface.searching)
              : 'Pinch to resize · drag to look around'}
          </div>
        </aside>
      )}
    </div>
  );
};
