import React from 'react';
import { Watch, ConfiguratorStep, WatchConfiguration } from '../../types/watch';
import { 
  Check, 
  Palette, 
  Sliders, 
  RotateCcw, 
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
  onLaunchAR?: (mode: 'marker' | 'markerless' | 'wrist') => void;
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
}) => {
  const steps: { id: ConfiguratorStep; title: string; subtitle: string; icon: any }[] = [
    { id: 'select', title: 'Model', subtitle: 'Base Mesh', icon: ShoppingBag },
    { id: 'customize', title: 'Materials', subtitle: 'PBR Shaders', icon: Palette },
    { id: 'manipulate', title: 'Transform', subtitle: 'Scale & Rotate', icon: Sliders },
  ];

  const currentStepIndex = Math.max(0, steps.findIndex(s => s.id === currentStep));

  return (
    <div className="carbon-tile" style={{ padding: '28px', backgroundColor: 'var(--colors-canvas)' }}>
      {/* Carbon 3-Step Stepper Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        backgroundColor: 'var(--colors-hairline)',
        marginBottom: '24px',
        border: '1px solid var(--colors-hairline)',
      }}>
        {steps.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isPassed = idx < currentStepIndex;

          return (
            <button
              key={step.id}
              onClick={() => onSetStep(step.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px 14px',
                cursor: 'pointer',
                backgroundColor: isActive
                  ? 'var(--colors-surface-1)'
                  : isPassed
                  ? 'var(--colors-canvas)'
                  : 'var(--colors-surface-1)',
                border: 'none',
                borderTop: isActive ? '3px solid var(--colors-primary)' : '3px solid transparent',
                textAlign: 'left',
                transition: 'background-color 0.1s ease',
              }}
            >
              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: isActive ? 'var(--colors-primary)' : 'var(--colors-ink-muted)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                {isPassed ? <Check size={11} color="var(--colors-semantic-success)" /> : `0${idx + 1}`}
              </div>
              <div style={{
                fontSize: '13px',
                color: isActive ? 'var(--colors-ink)' : 'var(--colors-ink-muted)',
                fontWeight: isActive ? 600 : 400,
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
              }}>
                {step.title}
              </div>
            </button>
          );
        })}
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
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--colors-primary)',
            marginBottom: '2px',
          }}>
            CONFIGURATOR STEP 0{currentStepIndex + 1} // 0{steps.length}
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 400, color: 'var(--colors-ink)' }}>
            {steps[currentStepIndex].title} — <span style={{ color: 'var(--colors-ink-muted)' }}>{steps[currentStepIndex].subtitle}</span>
          </h3>
        </div>

        <button
          onClick={onReset}
          className="btn-dark-utility"
          style={{ padding: '6px 10px', height: '30px', fontSize: '12px', gap: '4px' }}
          title="Restore factory configuration"
        >
          <RotateCcw size={12} />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Step Contents */}
      <div style={{ minHeight: '190px' }}>
        {/* STEP 1: MODEL SELECTION */}
        {(currentStep === 'select' || (!['customize', 'manipulate'].includes(currentStep))) && (
          <div>
            <p style={{ fontSize: '14px', color: 'var(--colors-ink-muted)', marginBottom: '14px' }}>
              Select base 3D CAD mesh to configure:
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '8px',
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
                      backgroundColor: isSelected ? 'var(--colors-surface-1)' : 'var(--colors-canvas)',
                      border: isSelected ? '2px solid var(--colors-primary)' : '1px solid var(--colors-hairline)',
                      color: 'var(--colors-ink)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'border-color 0.1s ease',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--colors-ink-muted)', fontFamily: 'var(--font-mono)' }}>
                      {w.brand}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {w.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--colors-primary)', marginTop: '4px' }}>
                      ${w.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: CUSTOM MATERIALS */}
        {currentStep === 'customize' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Strap Swatches */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  Strap Material & Color:
                </span>
                <span style={{ fontSize: '13px', color: 'var(--colors-primary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedWatch.strapColors.find(c => c.hex.toLowerCase() === config.strapColor.toLowerCase())?.name || config.strapMaterial}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedWatch.strapColors.map((color) => {
                  const isActive = config.strapColor.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.name}
                      onClick={() => onUpdateConfig({
                        strapColor: color.hex,
                        strapMaterial: color.materialType || 'silicone',
                      })}
                      className={`swatch-square ${isActive ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex, width: '28px', height: '28px' }}
                      title={`${color.name} (${color.materialType || 'silicone'})`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Dial & Lume Colors */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  Dial / Emissive Lume:
                </span>
                <span style={{ fontSize: '13px', color: 'var(--colors-primary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedWatch.dialColors.find(c => c.hex.toLowerCase() === config.dialColor.toLowerCase())?.name || 'Dial Theme'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedWatch.dialColors.map((dial) => {
                  const isActive = config.dialColor.toLowerCase() === dial.hex.toLowerCase();
                  return (
                    <button
                      key={dial.name}
                      onClick={() => onUpdateConfig({ dialColor: dial.hex })}
                      className={`swatch-square ${isActive ? 'active' : ''}`}
                      style={{ backgroundColor: dial.hex, width: '28px', height: '28px' }}
                      title={dial.name}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MANIPULATE TRANSFORMATIONS */}
        {currentStep === 'manipulate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Scale Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  Spatial Scale Factor
                </span>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--colors-primary)' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--colors-ink-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                <span>0.5x [COMPACT]</span>
                <span>1.0x [1:1 TRUE]</span>
                <span>2.0x [EXPANDED]</span>
              </div>
            </div>

            {/* Rotation Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  Y-Axis Rotation
                </span>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--colors-primary)' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--colors-ink-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                <span>0° [FRONT]</span>
                <span>90° [PROFILE]</span>
                <span>180° [CASEBACK]</span>
                <span>270° [CROWN]</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
