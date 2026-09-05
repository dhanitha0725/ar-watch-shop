import React, { useEffect, useRef, useState } from 'react';
import { Watch, TrackingState } from '../../types/watch';
import { ARStateBadge } from './ARStateBadge';
import { ARHelpPanel } from './ARHelpPanel';
import { AR_COPY } from '../../data/arCopy';
import { ArrowLeft, QrCode, Sliders, HelpCircle, X } from 'lucide-react';

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
  const [showHelp, setShowHelp] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const scaleParts = watch.markerScale.split(' ').map(Number);
  const computedScale = scaleParts.map(s => (s * modelScaleMultiplier).toFixed(4)).join(' ');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source === 'mindar-marker-frame') {
        if (event.data.type === 'modelLoading') {
          setModelState('loading');
          setModelError(null);
          setCameraError(null);
        } else if (event.data.type === 'modelLoaded') {
          setModelState('ready');
          setModelError(null);
        } else if (event.data.type === 'modelError') {
          setModelState('error');
          setModelError(AR_COPY.card.error);
        } else if (event.data.type === 'arError') {
          setCameraError(AR_COPY.card.error);
        } else if (event.data.type === 'markerFound') {
          setTrackingState('detected');
        } else if (event.data.type === 'markerLost') {
          setTrackingState('lost');
        } else if (event.data.type === 'autoRotateChanged') {
          setIsAutoRotating(Boolean(event.data.data?.enabled));
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // A model change resets the iframe's session-only rotation to the watch's
  // configured base rotation.
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
  }, [watch]);

  // Keep scale updates separate so they do not reset a rotation made by
  // dragging the model inside the AR iframe.
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        target: 'mindar-marker-frame',
        action: 'updateScale',
        scale: computedScale,
      }, '*');
    }
  }, [computedScale]);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage({
      target: 'mindar-marker-frame',
      action: 'updateAutoRotate',
      enabled: isAutoRotating,
    }, '*');
  }, [isAutoRotating]);

  useEffect(() => {
    setModelState('loading');
    setModelError(null);
    setCameraError(null);
    setTrackingState('searching');
  }, [watch.modelUrl]);

  const iframeSrc = '/ar-marker-frame.html';

  const statusMessage = cameraError ? cameraError :
    modelState === 'error' ? AR_COPY.card.error :
    modelState === 'loading' ? AR_COPY.card.loading :
    trackingState === 'searching' ? AR_COPY.card.searching :
    trackingState === 'detected' ? AR_COPY.card.detected :
    AR_COPY.card.lost;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#000', overflow: 'hidden' }}>
      {/* Top HUD Overlay */}
      <header className="ar-hud-top" role="banner">
        <div className="ar-hud-bar">
          {/* Left Side: Back + Card Download Component */}
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
              onClick={onOpenMarkerModal}
              className="btn-icon"
              title={AR_COPY.common.showCard}
              aria-label={AR_COPY.common.showCard}
            >
              <QrCode size={18} color="var(--colors-ink)" />
            </button>
          </div>

          {/* Desktop Center: State Showing Component */}
          <div className="ar-hud-center ar-hud-center-desktop">
            <ARStateBadge
              state={trackingState}
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
            state={trackingState}
            customMessage={statusMessage}
          />
        </div>
      </header>

      {/* User Guideline Model on the Left Side */}
      {showHelp && (
        <ARHelpPanel
          mode="card"
          placement="left"
          onClose={() => setShowHelp(false)}
          onShowCard={onOpenMarkerModal}
          isAutoRotating={isAutoRotating}
        />
      )}

      {/* Standalone MindAR Camera & Tracking Frame */}
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        onLoad={() => {
          iframeRef.current?.contentWindow?.postMessage({
            target: 'mindar-marker-frame',
            action: 'updateWatch',
            modelUrl: watch.modelUrl,
            scale: computedScale,
            rotation: watch.markerRotation || '0 0 0',
          }, '*');
          iframeRef.current?.contentWindow?.postMessage({
            target: 'mindar-marker-frame',
            action: 'updateAutoRotate',
            enabled: isAutoRotating,
          }, '*');
        }}
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
            {/* Watch Model Selector */}
            <div>
              <div className="ar-operator-section-label">Select Model</div>
              <div className="ar-model-list">
                {watches.map(w => {
                  const isSelected = w.id === watch.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => onSelectWatch(w)}
                      className={`ar-model-btn ${isSelected ? 'active' : ''}`}
                      type="button"
                    >
                      <span>{w.name}</span>
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

            {/* Compact Scale Slider */}
            <div>
              <div className="ar-operator-section-label">{AR_COPY.common.size}</div>
              <div className="ar-scale-container">
                <button
                  type="button"
                  className="ar-scale-btn"
                  title="Decrease scale"
                  aria-label="Decrease scale"
                  onClick={() => setModelScaleMultiplier(prev => Math.max(0.5, parseFloat((prev - 0.1).toFixed(1))))}
                >
                  -
                </button>

                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={modelScaleMultiplier}
                  onChange={(e) => setModelScaleMultiplier(parseFloat(e.target.value))}
                  className="ar-scale-slider"
                  aria-label="Adjust scale"
                />

                <button
                  type="button"
                  className="ar-scale-btn"
                  title="Increase scale"
                  aria-label="Increase scale"
                  onClick={() => setModelScaleMultiplier(prev => Math.min(2.5, parseFloat((prev + 0.1).toFixed(1))))}
                >
                  +
                </button>

                <span className="ar-scale-val">
                  {modelScaleMultiplier.toFixed(1)}x
                </span>
              </div>
            </div>
          </div>

          {/* Footer Status Hint */}
          <div className="ar-operator-footer">
            Keep the whole watch card in view
          </div>
        </aside>
      )}
    </div>
  );
};
