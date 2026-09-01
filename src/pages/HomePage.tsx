import React, { useState } from 'react';
import { Watch } from '../types/watch';
import { Interactive3DViewer } from '../components/viewer/Interactive3DViewer';
import { WatchCard } from '../components/catalogue/WatchCard';
import { WatchFilter } from '../components/catalogue/WatchFilter';
import { FeatureHighlights } from '../components/catalogue/FeatureHighlights';
import { Eye, ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface HomePageProps {
  watches: Watch[];
  onSelectWatch: (watch: Watch) => void;
  onLaunchAR: (mode: 'marker' | 'markerless' | 'wrist', watch?: Watch) => void;
  onOpenMarkerModal: () => void;
  onNavigate: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  watches,
  onSelectWatch,
  onLaunchAR,
  onOpenMarkerModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [heroWatchIndex, setHeroWatchIndex] = useState<number>(0);

  const heroWatch = watches[heroWatchIndex] || watches[0];

  const filteredWatches = watches.filter((w) => {
    const matchesCat = selectedCategory === 'All' || w.category === selectedCategory;
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="carbon-grid-container">
      {/* =========================================================================
          HERO MODULE - 2-Column Flush Grid (Zero Outer Padding, 1px Hairline Borders)
          ========================================================================= */}
      <section className="carbon-section">
        <div className="carbon-grid-2col" style={{ alignItems: 'stretch' }}>
          {/* Left Column: Headlines, Lead & Technical Stats Grid */}
          <div style={{
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid var(--colors-hairline)',
          }}>
            <div>
              {/* Eyebrow Status */}
              <div style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--colors-primary)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <Cpu size={14} />
                <span>ENTERPRISE WEBAR ENGINE // CARBON SPEC</span>
              </div>

              {/* IBM Plex Sans Weight-300 Headline */}
              <h1 style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 56px)',
                lineHeight: 1.12,
                fontWeight: 300,
                marginBottom: '20px',
                color: 'var(--colors-ink)',
                letterSpacing: '-0.4px',
              }}>
                Augmented reality.<br />
                Engineered for precision.
              </h1>

              {/* Lead Paragraph with Carbon 0.16px Tracking */}
              <p style={{
                fontSize: '17px',
                fontWeight: 400,
                color: 'var(--colors-ink-muted)',
                lineHeight: 1.50,
                marginBottom: '36px',
                maxWidth: '540px',
                letterSpacing: '0.16px',
              }}>
                Inspect high-precision 3D timepieces with real-time PBR shaders. Place models on physical surfaces with WebXR, anchor 6DOF target cards with MindAR, or virtually try on watches via MediaPipe hand tracking.
              </p>

              {/* Primary & Secondary Square CTAs */}
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '48px',
              }}>
                <button
                  onClick={() => onLaunchAR('markerless', heroWatch)}
                  className="btn-primary"
                  style={{ fontSize: '14px', padding: '12px 20px' }}
                >
                  <Eye size={16} />
                  <span>Launch Space AR</span>
                </button>

                <button
                  onClick={() => onSelectWatch(heroWatch)}
                  className="btn-secondary"
                  style={{ fontSize: '14px', padding: '12px 20px' }}
                >
                  <span>Customize & Inspect</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Bottom 3-Cell Metric Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              backgroundColor: 'var(--colors-hairline)',
              border: '1px solid var(--colors-hairline)',
            }}>
              <div style={{ backgroundColor: 'var(--colors-surface-1)', padding: '14px 16px' }}>
                <div style={{ fontSize: '20px', fontWeight: 400, color: 'var(--colors-ink)', fontFamily: 'var(--font-display)' }}>
                  04 Models
                </div>
                <div style={{ fontSize: '12px', color: 'var(--colors-ink-muted)', marginTop: '2px' }}>
                  PBR Standardized
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--colors-surface-1)', padding: '14px 16px' }}>
                <div style={{ fontSize: '20px', fontWeight: 400, color: 'var(--colors-ink)', fontFamily: 'var(--font-display)' }}>
                  60 FPS
                </div>
                <div style={{ fontSize: '12px', color: 'var(--colors-ink-muted)', marginTop: '2px' }}>
                  EMA Jitter Filter
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--colors-surface-1)', padding: '14px 16px' }}>
                <div style={{ fontSize: '20px', fontWeight: 400, color: 'var(--colors-semantic-success)', fontFamily: 'var(--font-display)' }}>
                  10 / 10
                </div>
                <div style={{ fontSize: '12px', color: 'var(--colors-ink-muted)', marginTop: '2px' }}>
                  Verified Tests
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live 3D Interactive Canvas Cell */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'var(--colors-canvas)',
          }}>
            <div style={{ flex: 1, minHeight: '440px' }}>
              <Interactive3DViewer
                watch={heroWatch}
                selectedStrapColor={heroWatch.strapColors[0]}
                selectedDialColor={heroWatch.dialColors[0]}
                height="100%"
              />
            </div>

            {/* Flush Model Selector Strip */}
            <div style={{
              backgroundColor: 'var(--colors-surface-1)',
              borderTop: '1px solid var(--colors-hairline)',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colors-ink)' }}>
                Active Model: <span style={{ color: 'var(--colors-primary)', fontWeight: 400 }}>{heroWatch.name}</span>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                {watches.map((w, idx) => (
                  <button
                    key={w.id}
                    onClick={() => setHeroWatchIndex(idx)}
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: heroWatchIndex === idx ? 'var(--colors-primary)' : 'var(--colors-canvas)',
                      color: heroWatchIndex === idx ? '#ffffff' : 'var(--colors-ink)',
                      border: '1px solid var(--colors-hairline)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'background-color 0.1s ease',
                    }}
                    title={w.name}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION BREAKDOWN 02: SPATIAL AR CAPABILITIES GRID
          ========================================================================= */}
      <FeatureHighlights
        onLaunchMode={(mode) => onLaunchAR(mode, heroWatch)}
        onOpenMarkerModal={onOpenMarkerModal}
      />

      {/* =========================================================================
          SECTION BREAKDOWN 03: TIMEPIECE COLLECTION CATALOGUE GRID
          ========================================================================= */}
      <section id="catalogue-section" className="carbon-section">
        {/* Section Header Banner */}
        <div style={{
          padding: '36px 32px 24px',
          backgroundColor: 'var(--colors-canvas)',
          borderBottom: '1px solid var(--colors-hairline)',
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 400,
            color: 'var(--colors-primary)',
            letterSpacing: '0.16px',
            marginBottom: '4px',
          }}>
            CATALOGUE & CONFIGURATION
          </div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 36px)',
            fontWeight: 300,
            lineHeight: 1.2,
          }}>
            Timepiece Collection.
          </h2>
          <p style={{
            fontSize: '15px',
            color: 'var(--colors-ink-muted)',
            marginTop: '6px',
          }}>
            Select any timepiece below to customize finishes, inspect 3D meshes, or launch spatial augmented reality.
          </p>
        </div>

        {/* Carbon Horizontal Category Filter Strip */}
        <WatchFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 4-Column Flush Product Card Grid */}
        <div className="carbon-grid-4col" style={{
          backgroundColor: 'var(--colors-hairline)',
          gap: '1px',
          borderBottom: '1px solid var(--colors-hairline)',
        }}>
          {filteredWatches.map((watch) => (
            <WatchCard
              key={watch.id}
              watch={watch}
              onSelect={onSelectWatch}
              onLaunchAR={onLaunchAR}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
