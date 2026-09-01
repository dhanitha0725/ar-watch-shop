import React, { useState } from 'react';
import { Watch, WatchConfiguration, ConfiguratorStep } from '../types/watch';
import { Interactive3DViewer } from '../components/viewer/Interactive3DViewer';
import { ConfiguratorWizard } from '../components/configurator/ConfiguratorWizard';
import { 
  ArrowLeft, 
  Scan, 
  Eye, 
  Hand, 
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
  onLaunchAR: (mode: 'marker' | 'markerless' | 'wrist') => void;
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

  const selectedStrapObj = watch.strapColors.find(
    c => c.hex.toLowerCase() === config.strapColor.toLowerCase()
  ) || watch.strapColors[0];

  const selectedDialObj = watch.dialColors.find(
    c => c.hex.toLowerCase() === config.dialColor.toLowerCase()
  ) || watch.dialColors[0];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Top Back Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
      }}>
        <button
          onClick={onBack}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '13px', gap: '6px' }}
        >
          <ArrowLeft size={15} />
          <span>All Timepieces</span>
        </button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colors-primary)' }}>
            {watch.category}
          </span>
          <span style={{ color: 'var(--colors-body-muted)' }}>•</span>
          <span style={{ fontSize: '13px', color: 'var(--colors-body-muted)' }}>
            {watch.brand}
          </span>
        </div>
      </div>

      {/* Main Layout: Left 3D Viewer | Right Option B Configurator */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '40px',
        marginBottom: '64px',
        alignItems: 'start',
      }}>
        {/* Left Column: 3D Model Interactive Canvas */}
        <div>
          <Interactive3DViewer
            watch={watch}
            selectedStrapColor={selectedStrapObj}
            selectedDialColor={selectedDialObj}
            height="500px"
          />

          {/* AR Launchpad Bar */}
          <div style={{
            marginTop: '16px',
            backgroundColor: 'var(--colors-canvas-parchment)',
            borderRadius: 'var(--rounded-md)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--colors-body-muted)' }}>
                Augmented Reality
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colors-ink)' }}>
                View in your space
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onLaunchAR('markerless')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '12px' }}
                title="WebXR Surface AR"
              >
                <Eye size={13} />
                <span>Space AR</span>
              </button>

              <button
                onClick={() => onLaunchAR('marker')}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '12px' }}
                title="MindAR Image Target Tracking"
              >
                <Scan size={13} />
                <span>Marker</span>
              </button>

              <button
                onClick={() => onLaunchAR('wrist')}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '12px' }}
                title="MediaPipe Wrist Try-On"
              >
                <Hand size={13} />
                <span>Try-On</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Price, and Option B Configurator Wizard */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '6px', lineHeight: 1.1 }}>
              {watch.name}
            </h1>
            <p style={{ fontSize: '17px', color: 'var(--colors-body-muted)', lineHeight: 1.45 }}>
              {watch.tagline}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px',
              marginTop: '16px',
            }}>
              <span style={{ fontSize: '32px', fontWeight: 600, color: 'var(--colors-ink)' }}>
                ${watch.price}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--colors-success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <CheckCircle2 size={15} />
                <span>In Stock • Real-Time PBR</span>
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

      {/* Tabs: Specifications & Key Features */}
      <section className="store-utility-card" style={{ padding: '36px', marginBottom: '48px' }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          borderBottom: '1px solid var(--colors-hairline)',
          paddingBottom: '12px',
          marginBottom: '28px',
        }}>
          <button
            onClick={() => setActiveTab('specs')}
            className={`category-tab ${activeTab === 'specs' ? 'active' : ''}`}
            style={{ fontSize: '15px' }}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`category-tab ${activeTab === 'features' ? 'active' : ''}`}
            style={{ fontSize: '15px' }}
          >
            Key Highlights
          </button>
        </div>

        {/* Specifications Table */}
        {activeTab === 'specs' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}>
            {Object.entries(watch.specs).map(([key, value]) => {
              const formatKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return (
                <div
                  key={key}
                  style={{
                    backgroundColor: 'var(--colors-canvas-parchment)',
                    borderRadius: 'var(--rounded-md)',
                    padding: '16px',
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'var(--colors-body-muted)', marginBottom: '4px' }}>
                    {formatKey}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colors-ink)' }}>
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Engineering Highlights */}
        {activeTab === 'features' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {watch.features.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  backgroundColor: 'var(--colors-canvas-parchment)',
                  padding: '14px 18px',
                  borderRadius: 'var(--rounded-md)',
                }}
              >
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--colors-primary)',
                }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <span style={{ fontSize: '15px', color: 'var(--colors-ink)' }}>{feat}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
