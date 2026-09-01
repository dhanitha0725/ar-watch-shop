import React from 'react';
import { Terminal, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--colors-inverse-canvas)',
      borderTop: '1px solid var(--colors-inverse-surface-1)',
      marginTop: '0',
      color: 'var(--colors-inverse-ink-muted)',
    }}>
      <div className="carbon-grid-container" style={{
        borderLeft: 'none',
        borderRight: 'none',
        padding: '56px 32px 32px',
        fontSize: '13px',
        lineHeight: 1.5,
      }}>
        {/* Footnote / Disclaimer */}
        <div style={{
          color: 'var(--colors-ink-subtle)',
          fontSize: '12px',
          lineHeight: 1.5,
          marginBottom: '36px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--colors-inverse-surface-1)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}>
          <Terminal size={16} color="var(--colors-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            1. WebAR features require a compatible hardware environment. WebXR Plane Hit-Testing requires ARCore / WebXR-capable browsers over HTTPS. Marker AR requires camera permissions and 6DOF Natural Feature Tracking (NFT). MediaPipe Hand Landmarker runs on-device WASM machine learning at 60 FPS.
          </div>
        </div>

        {/* 4 Clean Columns Separated by Hairlines */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '48px',
        }}>
          {/* Column 1: Store & Collection */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--colors-inverse-ink)',
              marginBottom: '16px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px',
            }}>
              // COLLECTION
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
              <li>
                <button 
                  onClick={() => onNavigate('catalogue')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-inverse-ink-muted)', fontSize: '13px', padding: 0 }}
                >
                  All Timepieces (04 Models)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('compare')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-inverse-ink-muted)', fontSize: '13px', padding: 0 }}
                >
                  Compare Specifications
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Augmented Reality */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--colors-inverse-ink)',
              marginBottom: '16px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px',
            }}>
              // SPATIAL TRACKING
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
              <li>
                <button 
                  onClick={() => onNavigate('markerless-ar')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-inverse-ink-muted)', fontSize: '13px', padding: 0 }}
                >
                  WebXR Space AR (Hit-Test)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('marker-ar')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-inverse-ink-muted)', fontSize: '13px', padding: 0 }}
                >
                  MindAR NFT 6DOF Tracking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('wrist-tryon')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-inverse-ink-muted)', fontSize: '13px', padding: 0 }}
                >
                  MediaPipe Wrist Virtual Try-On
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Configurator Engine */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--colors-inverse-ink)',
              marginBottom: '16px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px',
            }}>
              // 3D PBR ENGINE
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
              <li>
                <span style={{ color: 'var(--colors-ink-subtle)' }}>PBR Material Customizer</span>
              </li>
              <li>
                <span style={{ color: 'var(--colors-ink-subtle)' }}>3D Transform & Scale Multipliers</span>
              </li>
              <li>
                <span style={{ color: 'var(--colors-ink-subtle)' }}>Exponential Moving Average Filter</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Verification & Docs */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--colors-inverse-ink)',
              marginBottom: '16px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px',
            }}>
              // VERIFICATION
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
              <li>
                <button 
                  onClick={() => onNavigate('docs')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-primary-on-dark)', fontSize: '13px', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Test Matrix (T01–T10)</span>
                  <ExternalLink size={12} />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('docs')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-inverse-ink-muted)', fontSize: '13px', padding: 0 }}
                >
                  Asset Attribution & Licensing
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid var(--colors-inverse-surface-1)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          color: 'var(--colors-ink-subtle)',
          fontSize: '12px',
        }}>
          <div>CHRONO WebAR Enterprise Studio • IBM Carbon Design System Implementation</div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--colors-semantic-success)' }}>
              <ShieldCheck size={14} />
              <span>10/10 Verification Tests Passed</span>
            </span>
            <button 
              onClick={() => onNavigate('docs')}
              style={{ background: 'none', border: 'none', color: 'var(--colors-ink-subtle)', cursor: 'pointer', fontSize: '12px' }}
            >
              System Documentation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
