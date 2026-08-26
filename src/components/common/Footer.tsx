import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--colors-canvas-parchment)',
      borderTop: '1px solid var(--colors-hairline)',
      marginTop: 'var(--spacing-section)',
      color: 'var(--colors-ink-muted-80)',
    }}>
      <div style={{
        maxWidth: '980px',
        margin: '0 auto',
        padding: '48px 24px 32px',
        fontSize: '12px',
        lineHeight: 1.4,
      }}>
        {/* Footnote / Disclaimer */}
        <p style={{
          color: 'var(--colors-ink-muted-48)',
          fontSize: '12px',
          lineHeight: 1.5,
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--colors-hairline)',
        }}>
          1. WebAR features require a compatible browser. WebXR Surface Hit-Testing is supported on WebXR-compatible mobile browsers. Marker AR requires camera permission. Wrist Try-On utilizes MediaPipe Vision for real-time landmark tracking.
        </p>

        {/* 4 Clean Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '32px',
          marginBottom: '36px',
        }}>
          {/* Column 1: Store & Collection */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--colors-ink)',
              marginBottom: '12px',
            }}>
              Explore Collection
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
              <li>
                <button 
                  onClick={() => onNavigate('catalogue')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-ink-muted-80)', fontSize: '12px', padding: 0 }}
                >
                  All Timepieces
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('compare')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-ink-muted-80)', fontSize: '12px', padding: 0 }}
                >
                  Compare Models
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Augmented Reality */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--colors-ink)',
              marginBottom: '12px',
            }}>
              Augmented Reality
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
              <li>
                <button 
                  onClick={() => onNavigate('markerless-ar')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-ink-muted-80)', fontSize: '12px', padding: 0 }}
                >
                  WebXR Surface AR
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('marker-ar')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-ink-muted-80)', fontSize: '12px', padding: 0 }}
                >
                  Marker AR Tracking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('wrist-tryon')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-ink-muted-80)', fontSize: '12px', padding: 0 }}
                >
                  Wrist Virtual Try-On
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Configurator */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--colors-ink)',
              marginBottom: '12px',
            }}>
              Custom Studio
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
              <li>
                <span style={{ color: 'var(--colors-ink-muted-48)' }}>Material Customization</span>
              </li>
              <li>
                <span style={{ color: 'var(--colors-ink-muted-48)' }}>3D Scale & Rotation</span>
              </li>
              <li>
                <span style={{ color: 'var(--colors-ink-muted-48)' }}>Real-Time PBR Shaders</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Documentation */}
          <div>
            <h4 style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--colors-ink)',
              marginBottom: '12px',
            }}>
              Verification & Docs
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
              <li>
                <button 
                  onClick={() => onNavigate('docs')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-primary)', fontSize: '12px', padding: 0 }}
                >
                  Test Matrix (T01–T10)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('docs')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-ink-muted-80)', fontSize: '12px', padding: 0 }}
                >
                  Asset Attribution
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid var(--colors-hairline)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          color: 'var(--colors-ink-muted-48)',
        }}>
          <div>Copyright © 2026 Chrono WebAR. Built with React, Three.js, WebXR & MediaPipe.</div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button 
              onClick={() => onNavigate('docs')}
              style={{ background: 'none', border: 'none', color: 'var(--colors-ink-muted-48)', cursor: 'pointer', fontSize: '12px' }}
            >
              Documentation & Licensing
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
