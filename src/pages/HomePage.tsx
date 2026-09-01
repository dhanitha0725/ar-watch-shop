import React, { useState, useEffect } from 'react';
import { Watch, WatchColorOption } from '../types/watch';
import { Interactive3DViewer } from '../components/viewer/Interactive3DViewer';
import { FeatureHighlights } from '../components/catalogue/FeatureHighlights';
import { WatchCard } from '../components/catalogue/WatchCard';
import { 
  Eye, 
  ArrowRight, 
  Heart, 
  Scan, 
  Hand, 
  Cpu, 
  CheckCircle2, 
  Grid as GridIcon,
  Layers
} from 'lucide-react';

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
  const [heroWatchIndex, setHeroWatchIndex] = useState<number>(0);

  // Showcase state for the Image-2 layout
  const [showcaseIndex, setShowcaseIndex] = useState<number>(0);
  const [selectedStrapColor, setSelectedStrapColor] = useState<WatchColorOption>(watches[0]?.strapColors[0]);
  const [selectedDialColor, setSelectedDialColor] = useState<WatchColorOption>(watches[0]?.dialColors[0]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'showcase' | 'grid'>('showcase');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const heroWatch = watches[heroWatchIndex] || watches[0];
  const activeShowcaseWatch = watches[showcaseIndex] || watches[0];

  // Sync color selection when showcase model changes
  useEffect(() => {
    if (activeShowcaseWatch) {
      setSelectedStrapColor(activeShowcaseWatch.strapColors[0]);
      setSelectedDialColor(activeShowcaseWatch.dialColors[0]);
    }
  }, [showcaseIndex, activeShowcaseWatch]);

  const toggleFavorite = (watchId: string) => {
    setFavorites(prev => ({
      ...prev,
      [watchId]: !prev[watchId]
    }));
  };

  const categories = [
    { id: 'All', label: 'All Models (04)', watchIndex: 0 },
    { id: 'Smart', label: 'Smartwatch (01)', watchIndex: 0 },
    { id: 'Sport', label: 'Sport Chronograph (01)', watchIndex: 1 },
    { id: 'Digital', label: 'Digital Display (01)', watchIndex: 2 },
    { id: 'Luxury', label: 'Luxury Automatic (01)', watchIndex: 3 },
  ];

  const handleCategoryClick = (cat: typeof categories[0]) => {
    setSelectedCategory(cat.id);
    if (cat.watchIndex !== undefined) {
      setShowcaseIndex(cat.watchIndex);
    }
  };

  const filteredWatches = watches.filter((w) => {
    if (selectedCategory === 'All') return true;
    return w.category === selectedCategory;
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
            backgroundColor: 'var(--colors-canvas)',
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
          SECTION BREAKDOWN 03: TIMEPIECE COLLECTION SHOWCASE & GRID
          ========================================================================= */}
      <section id="catalogue-section" className="carbon-section">
        {/* Section Header Banner with Category Tabs & View Switcher */}
        <div style={{
          padding: '28px 32px 20px',
          backgroundColor: 'var(--colors-canvas)',
          borderBottom: '1px solid var(--colors-hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: 400,
              color: 'var(--colors-primary)',
              letterSpacing: '0.16px',
              marginBottom: '4px',
              fontFamily: 'var(--font-mono)',
            }}>
              CATALOGUE // TIMEPIECE SHOWCASE
            </div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 36px)',
              fontWeight: 300,
              lineHeight: 1.2,
              color: 'var(--colors-ink)',
            }}>
              Explore the Collection.
            </h2>
          </div>

          {/* View Mode Switcher (Showcase Studio vs Grid View) */}
          <div style={{ display: 'flex', gap: '4px', border: '1px solid var(--colors-hairline)' }}>
            <button
              onClick={() => setViewMode('showcase')}
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                fontWeight: viewMode === 'showcase' ? 600 : 400,
                backgroundColor: viewMode === 'showcase' ? 'var(--colors-surface-1)' : 'var(--colors-canvas)',
                color: viewMode === 'showcase' ? 'var(--colors-primary)' : 'var(--colors-ink-muted)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Layers size={13} />
              <span>Showcase Studio</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                fontWeight: viewMode === 'grid' ? 600 : 400,
                backgroundColor: viewMode === 'grid' ? 'var(--colors-surface-1)' : 'var(--colors-canvas)',
                color: viewMode === 'grid' ? 'var(--colors-primary)' : 'var(--colors-ink-muted)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <GridIcon size={13} />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            SHOWCASE VIEW: Image 2 Layout (Center-Aligned 3D Model + Left Details, Clean without bottom bar)
            ========================================================================= */}
        {viewMode === 'showcase' && (
          <div style={{
            position: 'relative',
            backgroundColor: 'var(--colors-canvas)',
            minHeight: '620px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Main Stage Grid: Left Details Panel + Center 3D Model Canvas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 420px) 1fr',
              flex: 1,
              alignItems: 'stretch',
            }} className="showcase-stage-grid">
              
              {/* Left Column: Details (Brand, Title, Finishes, Price, CTA as in Image 2) */}
              <div style={{
                padding: '40px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRight: '1px solid var(--colors-hairline)',
                backgroundColor: 'var(--colors-canvas)',
                zIndex: 10,
              }}>
                <div>
                  {/* Add to favourites Button (Image 2 style) */}
                  <button
                    onClick={() => toggleFavorite(activeShowcaseWatch.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: favorites[activeShowcaseWatch.id] ? 'var(--colors-semantic-error)' : 'var(--colors-semantic-success)',
                      fontSize: '13px',
                      fontWeight: 600,
                      marginBottom: '18px',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    <Heart
                      size={15}
                      fill={favorites[activeShowcaseWatch.id] ? 'var(--colors-semantic-error)' : 'none'}
                      color={favorites[activeShowcaseWatch.id] ? 'var(--colors-semantic-error)' : 'var(--colors-semantic-success)'}
                    />
                    <span>{favorites[activeShowcaseWatch.id] ? 'Saved in Favourites' : 'Add to favourites'}</span>
                  </button>

                  {/* Brand Label */}
                  <div style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--colors-primary)',
                    marginBottom: '6px',
                    letterSpacing: '0.5px',
                  }}>
                    {activeShowcaseWatch.brand.toUpperCase()}
                  </div>

                  {/* Large Model Name (Image 2 headline) */}
                  <h3 style={{
                    fontSize: 'clamp(2rem, 3.2vw, 38px)',
                    fontWeight: 400,
                    lineHeight: 1.15,
                    marginBottom: '8px',
                    color: 'var(--colors-ink)',
                    letterSpacing: '-0.3px',
                  }}>
                    {activeShowcaseWatch.name}
                  </h3>

                  {/* Specs Subtitle Line (e.g. "Oyster, 40 mm, Oystersteel" from Image 2) */}
                  <div style={{
                    fontSize: '15px',
                    color: 'var(--colors-ink-muted)',
                    lineHeight: 1.45,
                    marginBottom: '16px',
                  }}>
                    {activeShowcaseWatch.specs.caseMaterial}, {activeShowcaseWatch.specs.caseDiameter}, {activeShowcaseWatch.specs.waterResistance}
                  </div>

                  <p style={{
                    fontSize: '14px',
                    color: 'var(--colors-ink-muted)',
                    lineHeight: 1.5,
                    marginBottom: '24px',
                  }}>
                    {activeShowcaseWatch.tagline}
                  </p>

                  {/* Colour Variations Swatches */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--colors-ink)',
                      marginBottom: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span>Band Finish:</span>
                      <strong style={{ color: 'var(--colors-primary)', fontFamily: 'var(--font-mono)' }}>
                        {selectedStrapColor?.name || 'Default'}
                      </strong>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {activeShowcaseWatch.strapColors.map((color, idx) => {
                        const isActive = selectedStrapColor?.name === color.name;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedStrapColor(color)}
                            className={`swatch-square ${isActive ? 'active' : ''}`}
                            style={{
                              width: '26px',
                              height: '26px',
                              backgroundColor: color.hex,
                            }}
                            title={`${color.name} (${color.materialType || 'silicone'})`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--colors-hairline)',
                    marginBottom: '24px',
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--colors-ink-muted)' }}>PRICE</div>
                    <div style={{ fontSize: '26px', fontWeight: 400, color: 'var(--colors-ink)', fontFamily: 'var(--font-display)' }}>
                      ${activeShowcaseWatch.price}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--colors-semantic-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} />
                      <span>Ready for 3D & AR</span>
                    </span>
                  </div>
                </div>

                {/* Discover this model / Actions */}
                <div>
                  <button
                    onClick={() => onSelectWatch(activeShowcaseWatch)}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      padding: '12px 18px',
                    }}
                  >
                    <span>Discover & Configure Model</span>
                    <ArrowRight size={16} />
                  </button>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1px',
                    backgroundColor: 'var(--colors-hairline)',
                    border: '1px solid var(--colors-hairline)',
                  }}>
                    <button
                      onClick={() => onLaunchAR('markerless', activeShowcaseWatch)}
                      style={{
                        padding: '8px 4px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-body)',
                        backgroundColor: 'var(--colors-surface-1)',
                        color: 'var(--colors-ink)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                      title="WebXR Surface AR"
                    >
                      <Eye size={12} color="var(--colors-primary)" />
                      <span>Space</span>
                    </button>

                    <button
                      onClick={() => onLaunchAR('marker', activeShowcaseWatch)}
                      style={{
                        padding: '8px 4px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-body)',
                        backgroundColor: 'var(--colors-surface-1)',
                        color: 'var(--colors-ink)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                      title="Marker AR"
                    >
                      <Scan size={12} color="var(--colors-primary)" />
                      <span>Marker</span>
                    </button>

                    <button
                      onClick={() => onLaunchAR('wrist', activeShowcaseWatch)}
                      style={{
                        padding: '8px 4px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-body)',
                        backgroundColor: 'var(--colors-surface-1)',
                        color: 'var(--colors-ink)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                      title="Wrist Try-On"
                    >
                      <Hand size={12} color="var(--colors-primary)" />
                      <span>Try-On</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Center Area: Center-Aligned 3D Interactive Model Canvas (Image 2 style) */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--colors-canvas)',
                minHeight: '560px',
              }}>
                <Interactive3DViewer
                  watch={activeShowcaseWatch}
                  selectedStrapColor={selectedStrapColor}
                  selectedDialColor={selectedDialColor}
                  height="100%"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            GRID VIEW: 4-Column Flush Product Card Grid with Embedded 3D Models
            ========================================================================= */}
        {viewMode === 'grid' && (
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
              />
            ))}
          </div>
        )}
      </section>

      {/* Responsive Inline Styles */}
      <style>{`
        @media (max-width: 960px) {
          .showcase-stage-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
