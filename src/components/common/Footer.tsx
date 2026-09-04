import React from 'react';
import { Terminal, Eye, Scan, Sliders } from 'lucide-react';

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
        {/* Footnote / Capability Notice */}
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
            WebAR spatial features require a compatible device environment. WebXR plane hit-testing requires ARCore / WebXR-capable browsers over HTTPS. Marker AR utilizes camera permissions and 6DOF Natural Feature Tracking (NFT).
          </div>
        </div>

        {/* 3 Clean Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
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
                  MindAR Marker 6DOF Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: 3D Engine & Virtual Studio */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--colors-inverse-ink)',
              marginBottom: '16px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px',
            }}>
              // 3D VIRTUAL STUDIO
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
              <li>
                <span style={{ color: 'var(--colors-ink-subtle)' }}>PBR Material Customizer</span>
              </li>
              <li>
                <span style={{ color: 'var(--colors-ink-subtle)' }}>360° Studio Turntable Inspection</span>
              </li>
              <li>
                <span style={{ color: 'var(--colors-ink-subtle)' }}>Metric Physical Scale Calibration</span>
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
          <div>CHRONO WebAR Studio • Spatial Horology & 3D Interactive Virtual Try-On</div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span>60 FPS WebGL / WebXR Rendering</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
