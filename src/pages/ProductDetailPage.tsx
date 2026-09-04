import React, { useState } from 'react';
import { Watch, WatchConfiguration, ConfiguratorStep } from '../types/watch';
import { Interactive3DViewer } from '../components/viewer/Interactive3DViewer';
import { ConfiguratorWizard } from '../components/configurator/ConfiguratorWizard';
import { 
  ArrowLeft, 
  Scan, 
  Eye, 
  CheckCircle2
} from 'lucide-react';

interface ProductDetailPageProps {
  watch: Watch;
  watches: Watch[];
  config: WatchConfiguration;
  configStep: ConfiguratorStep;
  onSelectWatch: (watch: Watch) => void;
  onUpdateConfig: (partial: Partial<WatchConfiguration>) => void;
  onSetConfigStep: (step: ConfiguratorStep) => void;
  onResetConfig: () => void;
  onLaunchAR: (mode: 'marker' | 'markerless') => void;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  watch,
  watches,
  config,
  configStep,
  onSelectWatch,
  onUpdateConfig,
  onSetConfigStep,
  onResetConfig,
  onLaunchAR,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'features'>('specs');

  return (
    <div className="carbon-grid-container">
      {/* Top Header / Back Ribbon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        borderBottom: '1px solid var(--colors-hairline)',
        backgroundColor: 'var(--colors-surface-1)',
      }}>
        <button
          onClick={onBack}
          className="btn-dark-utility"
          style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Collection</span>
        </button>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
          <span style={{ color: 'var(--colors-primary)', fontWeight: 600 }}>
            {watch.category.toUpperCase()}
          </span>
          <span style={{ color: 'var(--colors-hairline-strong)' }}>//</span>
          <span style={{ color: 'var(--colors-ink-muted)' }}>
            {watch.brand}
          </span>
        </div>
      </div>

      {/* Main Grid: Left 3D Viewer | Right Option B Configurator */}
      <section className="carbon-section">
        <div className="carbon-grid-2col" style={{ alignItems: 'stretch' }}>
          {/* Left Column: 3D Model Interactive Canvas Cell */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid var(--colors-hairline)',
            backgroundColor: 'var(--colors-canvas)',
          }}>
            <div style={{ flex: 1, minHeight: '520px' }}>
              <Interactive3DViewer
                watch={watch}
                config={config}
                height="100%"
              />
            </div>

            {/* AR Launchpad Bar */}
            <div style={{
              backgroundColor: 'var(--colors-surface-1)',
              borderTop: '1px solid var(--colors-hairline)',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colors-ink)' }}>
                  View in Physical Environment
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onLaunchAR('markerless')}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '12px', height: '36px' }}
                  title="WebXR Surface AR"
                >
                  <Eye size={13} />
                  <span>Space AR</span>
                </button>

                <button
                  onClick={() => onLaunchAR('marker')}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '12px', height: '36px' }}
                  title="MindAR Image Target Tracking"
                >
                  <Scan size={13} />
                  <span>Marker AR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price, and Option B Configurator Wizard */}
          <div style={{ padding: '36px 32px', backgroundColor: 'var(--colors-canvas)' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--colors-primary)',
                marginBottom: '4px',
              }}>
                MODEL ID: {watch.id.toUpperCase()}
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 38px)', fontWeight: 300, marginBottom: '6px', lineHeight: 1.15 }}>
                {watch.name}
              </h1>

              <p style={{ fontSize: '15px', color: 'var(--colors-ink-muted)', lineHeight: 1.45, marginBottom: '16px' }}>
                {watch.tagline}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '16px',
                paddingTop: '12px',
                borderTop: '1px solid var(--colors-hairline)',
              }}>
                <span style={{ fontSize: '30px', fontWeight: 400, color: 'var(--colors-ink)', fontFamily: 'var(--font-display)' }}>
                  ${watch.price}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--colors-semantic-success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <CheckCircle2 size={14} />
                  <span>In Stock</span>
                </span>
              </div>
            </div>

            {/* Option B Configurator Wizard */}
            <ConfiguratorWizard
              watches={watches}
              selectedWatch={watch}
              config={config}
              currentStep={configStep}
              onSelectWatch={onSelectWatch}
              onUpdateConfig={onUpdateConfig}
              onSetStep={onSetConfigStep}
              onReset={onResetConfig}
              onLaunchAR={onLaunchAR}
            />
          </div>
        </div>
      </section>

      {/* Tabs: Specifications & Key Features Grid */}
      <section className="carbon-section" style={{ padding: '0' }}>
        <div className="carbon-tab-bar" style={{ padding: '0 32px' }}>
          <button
            onClick={() => setActiveTab('specs')}
            className={`product-tab ${activeTab === 'specs' ? 'active product-tab-selected' : ''}`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`product-tab ${activeTab === 'features' ? 'active product-tab-selected' : ''}`}
          >
            Engineering Highlights
          </button>
        </div>

        <div style={{ padding: '32px' }}>
          {/* Specifications Table Grid */}
          {activeTab === 'specs' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1px',
              backgroundColor: 'var(--colors-hairline)',
              border: '1px solid var(--colors-hairline)',
            }}>
              {Object.entries(watch.specs).map(([key, value]) => {
                const formatKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div
                    key={key}
                    style={{
                      backgroundColor: 'var(--colors-canvas)',
                      padding: '16px 20px',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--colors-ink-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                      {formatKey.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colors-ink)' }}>
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Engineering Highlights Grid */}
          {activeTab === 'features' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1px',
              backgroundColor: 'var(--colors-hairline)',
              border: '1px solid var(--colors-hairline)',
            }}>
              {watch.features.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    backgroundColor: 'var(--colors-canvas)',
                    padding: '18px 20px',
                  }}
                >
                  <div style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: 'var(--colors-primary)',
                    marginTop: '1px',
                  }}>
                    0{idx + 1}
                  </div>
                  <span style={{ fontSize: '14px', color: 'var(--colors-ink)', lineHeight: 1.4 }}>{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
