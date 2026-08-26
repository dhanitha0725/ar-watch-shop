import React from 'react';
import { Watch, ConfiguratorStep, WatchConfiguration } from '../../types/watch';
import { 
  Check, 
  Palette, 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Layers,
  ShoppingBag
} from 'lucide-react';

interface ConfiguratorWizardProps {
  watches: Watch[];
  selectedWatch: Watch;
  config: WatchConfiguration;
  currentStep: ConfiguratorStep;
  onSelectWatch: (watch: Watch) => void;
  onUpdateConfig: (partial: Partial<WatchConfiguration>) => void;
  onSetStep: (step: ConfiguratorStep) => void;
  onReset: () => void;
  onLaunchAR: (mode: 'marker' | 'markerless' | 'wrist') => void;
}

export const ConfiguratorWizard: React.FC<ConfiguratorWizardProps> = ({
  watches,
  selectedWatch,
  config,
  currentStep,
  onSelectWatch,
  onUpdateConfig,
  onSetStep,
  onReset,
  onLaunchAR,
}) => {
  const steps: { id: ConfiguratorStep; title: string; subtitle: string; icon: any }[] = [
    { id: 'select', title: 'Model', subtitle: 'Choose Timepiece', icon: ShoppingBag },
    { id: 'place', title: 'Placement', subtitle: 'Spatial Anchor', icon: Layers },
    { id: 'customize', title: 'Materials', subtitle: 'Band & Dial', icon: Palette },
    { id: 'manipulate', title: 'Transform', subtitle: 'Scale & Rotate', icon: Sliders },
    { id: 'complete', title: 'Review', subtitle: 'Launch in AR', icon: Sparkles },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      onSetStep(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      onSetStep(steps[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="store-utility-card" style={{ padding: '28px' }}>
      {/* Wizard Progress Stepper */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        position: 'relative',
      }}>
        {steps.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isPassed = idx < currentStepIndex;

          return (
            <div
              key={step.id}
              onClick={() => onSetStep(step.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                flex: 1,
                zIndex: 2,
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isActive
                  ? 'var(--colors-primary)'
                  : isPassed
                  ? 'var(--colors-canvas-parchment)'
                  : 'var(--colors-canvas)',
                border: isActive
                  ? '1px solid var(--colors-primary)'
                  : '1px solid var(--colors-hairline)',
                color: isActive ? '#ffffff' : isPassed ? 'var(--colors-ink)' : 'var(--colors-body-muted)',
                fontWeight: 600,
                fontSize: '13px',
                transition: 'all 0.2s ease',
              }}>
                {isPassed ? <Check size={14} /> : (idx + 1)}
              </div>
              <div style={{
                fontSize: '12px',
                color: isActive ? 'var(--colors-ink)' : 'var(--colors-body-muted)',
                fontWeight: isActive ? 600 : 400,
                textAlign: 'center',
                display: 'none',
              }} className="stepper-label">
                {step.title}
              </div>
            </div>
          );
        })}

        {/* Step Connecting Line */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '10%',
          right: '10%',
          height: '1px',
          backgroundColor: 'var(--colors-hairline)',
          zIndex: 1,
        }}>
          <div style={{
            height: '100%',
            backgroundColor: 'var(--colors-primary)',
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            transition: 'width 0.25s ease',
          }} />
        </div>
      </div>

      {/* Step Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--colors-hairline)',
        paddingBottom: '14px',
        marginBottom: '20px',
      }}>
        <div>
          <div style={{
            fontSize: '12px',
            color: 'var(--colors-primary)',
            fontWeight: 600,
            marginBottom: '2px',
          }}>
            Step {currentStepIndex + 1} of 5
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
            {steps[currentStepIndex].title} — {steps[currentStepIndex].subtitle}
          </h3>
        </div>

        <button
          onClick={onReset}
          className="btn-secondary"
          style={{ padding: '6px 12px', minHeight: '30px', fontSize: '12px', gap: '4px' }}
          title="Restore defaults"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Step Contents */}
      <div style={{ minHeight: '180px', marginBottom: '24px' }}>
        {/* STEP 1: MODEL SELECTION */}
        {currentStep === 'select' && (
          <div>
            <p style={{ fontSize: '14px', color: 'var(--colors-body-muted)', marginBottom: '14px' }}>
              Choose a base model to customize:
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '10px',
            }}>
              {watches.map((w) => {
                const isSelected = w.id === selectedWatch.id;
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
                      padding: '12px',
                      borderRadius: 'var(--rounded-md)',
                      backgroundColor: isSelected ? 'var(--colors-canvas-parchment)' : '#ffffff',
                      border: isSelected ? '2px solid var(--colors-primary)' : '1px solid var(--colors-hairline)',
                      color: 'var(--colors-ink)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--colors-body-muted)' }}>
                      {w.brand}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {w.name}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colors-primary)', marginTop: '4px' }}>
                      ${w.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: PLACEMENT & ANCHORING */}
        {currentStep === 'place' && (
          <div>
            <p style={{ fontSize: '14px', color: 'var(--colors-body-muted)', marginBottom: '14px' }}>
              Choose placement anchor style:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div
                onClick={() => onUpdateConfig({ isPlaced: true })}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: config.isPlaced ? 'var(--colors-canvas-parchment)' : '#ffffff',
                  border: config.isPlaced ? '2px solid var(--colors-primary)' : '1px solid var(--colors-hairline)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Layers size={16} color="var(--colors-primary)" />
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>
                    Horizontal Plane
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--colors-body-muted)', lineHeight: 1.4 }}>
                  WebXR plane hit-testing on desks and tables with 1:1 true scale.
                </p>
              </div>

              <div
                onClick={() => onUpdateConfig({ isPlaced: true })}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--colors-hairline)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Sparkles size={16} color="var(--colors-primary)" />
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>
                    Studio Pedestal
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--colors-body-muted)', lineHeight: 1.4 }}>
                  360° orbital preview with studio reflection lighting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOM MATERIALS */}
        {currentStep === 'customize' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Strap Swatches */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  Band Material & Finish
                </span>
                <span style={{ fontSize: '13px', color: 'var(--colors-primary)' }}>
                  {selectedWatch.strapColors.find(c => c.hex.toLowerCase() === config.strapColor.toLowerCase())?.name || config.strapMaterial}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {selectedWatch.strapColors.map((color) => {
                  const isActive = config.strapColor.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.name}
                      onClick={() => onUpdateConfig({
                        strapColor: color.hex,
                        strapMaterial: color.materialType || 'silicone',
                      })}
                      className={`swatch-circle ${isActive ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} (${color.materialType || 'silicone'})`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Dial & Lume Colors */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  Dial / Glow Accent
                </span>
                <span style={{ fontSize: '13px', color: 'var(--colors-primary)' }}>
                  {selectedWatch.dialColors.find(c => c.hex.toLowerCase() === config.dialColor.toLowerCase())?.name || 'Dial Theme'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {selectedWatch.dialColors.map((dial) => {
                  const isActive = config.dialColor.toLowerCase() === dial.hex.toLowerCase();
                  return (
                    <button
                      key={dial.name}
                      onClick={() => onUpdateConfig({ dialColor: dial.hex })}
                      className={`swatch-circle ${isActive ? 'active' : ''}`}
                      style={{ backgroundColor: dial.hex }}
                      title={dial.name}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: MANIPULATE TRANSFORMATIONS */}
        {currentStep === 'manipulate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Scale Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  3D Scale Multiplier
                </span>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--colors-primary)' }}>
                  {config.scale.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={config.scale}
                onChange={(e) => onUpdateConfig({ scale: parseFloat(e.target.value) })}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--colors-body-muted)', marginTop: '6px' }}>
                <span>0.5x Compact</span>
                <span>1.0x Real Scale</span>
                <span>2.0x Large</span>
              </div>
            </div>

            {/* Rotation Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  Rotation Angle
                </span>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--colors-primary)' }}>
                  {Math.round((config.rotationY * 180) / Math.PI)}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.05"
                value={config.rotationY}
                onChange={(e) => onUpdateConfig({ rotationY: parseFloat(e.target.value) })}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--colors-body-muted)', marginTop: '6px' }}>
                <span>0° Front</span>
                <span>90° Side</span>
                <span>180° Back</span>
                <span>270° Crown</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: FINALIZE & LAUNCH AR */}
        {currentStep === 'complete' && (
          <div>
            <div style={{
              backgroundColor: 'var(--colors-canvas-parchment)',
              borderRadius: 'var(--rounded-md)',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--colors-ink)' }}>
                Specification Summary: {selectedWatch.name}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--colors-body-muted)',
              }}>
                <div>Band: <strong style={{ color: 'var(--colors-ink)' }}>{config.strapMaterial}</strong></div>
                <div>Scale: <strong style={{ color: 'var(--colors-ink)' }}>{config.scale.toFixed(2)}x</strong></div>
                <div>Price: <strong style={{ color: 'var(--colors-primary)' }}>${selectedWatch.price}</strong></div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--colors-body-muted)', marginBottom: '14px' }}>
              Select an Augmented Reality mode to launch:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              <button
                onClick={() => onLaunchAR('markerless')}
                className="btn-primary"
                style={{ fontSize: '13px' }}
              >
                <Sparkles size={14} />
                <span>Space AR</span>
              </button>

              <button
                onClick={() => onLaunchAR('marker')}
                className="btn-secondary"
                style={{ fontSize: '13px' }}
              >
                <span>Marker AR</span>
              </button>

              <button
                onClick={() => onLaunchAR('wrist')}
                className="btn-secondary"
                style={{ fontSize: '13px' }}
              >
                <span>Wrist Try-On</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons (Prev / Next) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid var(--colors-hairline)',
      }}>
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="btn-secondary"
          style={{
            fontSize: '13px',
            opacity: currentStepIndex === 0 ? 0.35 : 1,
            cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <ArrowLeft size={14} />
          <span>Previous</span>
        </button>

        <div style={{ fontSize: '12px', color: 'var(--colors-body-muted)', fontFamily: 'var(--font-mono)' }}>
          {currentStepIndex + 1} / {steps.length}
        </div>

        <button
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          className="btn-primary"
          style={{
            fontSize: '13px',
            opacity: currentStepIndex === steps.length - 1 ? 0.35 : 1,
            cursor: currentStepIndex === steps.length - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          <span>Next</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <style>{`
        @media (min-width: 600px) {
          .stepper-label { display: block !important; }
        }
      `}</style>
    </div>
  );
};
