import React, { useState } from 'react';
import { Watch } from '../types/watch';
import { Interactive3DViewer } from '../components/viewer/Interactive3DViewer';
import { WatchCard } from '../components/catalogue/WatchCard';
import { WatchFilter } from '../components/catalogue/WatchFilter';
import { FeatureHighlights } from '../components/catalogue/FeatureHighlights';
import { Eye, ArrowRight } from 'lucide-react';

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
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
      {/* HERO SECTION - Apple Museum Gallery Style */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '48px',
        alignItems: 'center',
        padding: '64px 0 80px',
        minHeight: '75vh',
      }}>
        {/* Left Column: Headlines & CTAs */}
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--colors-primary)',
            marginBottom: '12px',
          }}>
            WebAR Timepiece Experience
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 56px)',
            lineHeight: 1.07,
            fontWeight: 600,
            marginBottom: '16px',
            letterSpacing: '-0.28px',
            color: 'var(--colors-ink)',
          }}>
            Augmented reality.<br />Crafted for your wrist.
          </h1>

          <p style={{
            fontSize: '19px',
            fontWeight: 400,
            color: 'var(--colors-body-muted)',
            lineHeight: 1.45,
            marginBottom: '32px',
            maxWidth: '520px',
            letterSpacing: '-0.2px',
          }}>
            Inspect high-precision 3D timepieces with true-to-life PBR materials. Place models on physical desks with WebXR, track 6DOF markers, or virtually try them on with hand tracking.
          </p>

          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}>
            <button
              onClick={() => onLaunchAR('markerless', heroWatch)}
              className="btn-primary"
              style={{ fontSize: '15px', padding: '12px 24px' }}
            >
              <Eye size={17} />
              <span>Launch Space AR</span>
            </button>

            <button
              onClick={() => onSelectWatch(heroWatch)}
              className="btn-secondary-pill"
              style={{ fontSize: '15px', padding: '12px 24px' }}
            >
              <span>Customize & Inspect</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Minimal Key Stats Row */}
          <div style={{
            display: 'flex',
            gap: '32px',
            paddingTop: '20px',
            borderTop: '1px solid var(--colors-divider-soft)',
          }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--colors-ink)' }}>4 Models</div>
              <div style={{ fontSize: '13px', color: 'var(--colors-body-muted)' }}>PBR Optimized</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--colors-ink)' }}>60 FPS</div>
              <div style={{ fontSize: '13px', color: 'var(--colors-body-muted)' }}>Smooth Tracking</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--colors-success)' }}>10 / 10</div>
              <div style={{ fontSize: '13px', color: 'var(--colors-body-muted)' }}>Tests Verified</div>
            </div>
          </div>
        </div>

        {/* Right Column: Live 3D PBR Model */}
        <div>
          <Interactive3DViewer
            watch={heroWatch}
            selectedStrapColor={heroWatch.strapColors[0]}
            selectedDialColor={heroWatch.dialColors[0]}
            height="480px"
          />

          {/* Floating Model Switcher Bar */}
          <div style={{
            marginTop: '12px',
            backgroundColor: 'var(--colors-canvas-parchment)',
            borderRadius: 'var(--rounded-pill)',
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colors-ink)' }}>
              {heroWatch.name}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {watches.map((w, idx) => (
                <button
                  key={w.id}
                  onClick={() => setHeroWatchIndex(idx)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: heroWatchIndex === idx ? 'var(--colors-primary)' : 'transparent',
                    color: heroWatchIndex === idx ? '#ffffff' : 'var(--colors-ink)',
                    border: 'none',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title={w.name}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WATCH CATALOGUE SECTION */}
      <section id="catalogue-section" style={{ padding: '64px 0 32px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: '28px',
        }}>
          <h2 style={{ fontSize: '36px', fontWeight: 600 }}>
            Explore the Collection.
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--colors-body-muted)', marginTop: '4px' }}>
            Select any timepiece below to customize finishes or launch directly in Augmented Reality.
          </p>
        </div>

        {/* Category Tabs Filter */}
        <WatchFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Watch Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
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

      {/* THREE AR MODES HIGHLIGHT */}
      <FeatureHighlights
        onLaunchMode={(mode) => onLaunchAR(mode, heroWatch)}
        onOpenMarkerModal={onOpenMarkerModal}
      />
    </div>
  );
};
