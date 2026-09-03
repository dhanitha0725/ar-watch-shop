import React from 'react';
import { Scan, Eye, QrCode, ArrowRight } from 'lucide-react';

interface FeatureHighlightsProps {
  onLaunchMode: (mode: 'markerless' | 'marker') => void;
  onOpenMarkerModal: () => void;
}

export const FeatureHighlights: React.FC<FeatureHighlightsProps> = ({
  onLaunchMode,
  onOpenMarkerModal,
}) => {
  return (
    <section style={{
      width: '100%',
      backgroundColor: 'var(--colors-surface-1)',
      borderTop: '1px solid var(--colors-hairline)',
      borderBottom: '1px solid var(--colors-hairline)',
      padding: '0',
    }}>
      {/* Section Header Bar */}
      <div style={{
        padding: '32px 32px 24px',
        borderBottom: '1px solid var(--colors-hairline)',
        backgroundColor: 'var(--colors-canvas)',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 400,
          color: 'var(--colors-primary)',
          letterSpacing: '0.16px',
          marginBottom: '4px',
        }}>
          AUGMENTED REALITY CAPABILITIES
        </div>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 36px)',
          fontWeight: 300,
          lineHeight: 1.2,
          color: 'var(--colors-ink)',
        }}>
          Two Spatial Tracking Modalities.
        </h2>
        <p style={{
          fontSize: '15px',
          color: 'var(--colors-ink-muted)',
          lineHeight: 1.5,
          marginTop: '6px',
          maxWidth: '720px',
        }}>
          Calibrated WebXR hit-testing for planar surface placement and 6DOF Natural Feature Tracking (NFT) image targets via MindAR.
        </p>
      </div>

      {/* 2-Column Flush Modular Grid */}
      <div className="carbon-grid-2col" style={{
        gap: '0',
        backgroundColor: 'var(--colors-hairline)',
      }}>
        {/* Mode 1: Markerless WebXR */}
        <div className="carbon-cell" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: 'var(--colors-canvas)',
        }}>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--colors-surface-1)',
              border: '1px solid var(--colors-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--colors-primary)',
              marginBottom: '20px',
            }}>
              <Eye size={20} />
            </div>

            <div style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--colors-ink-muted)',
              marginBottom: '4px',
            }}>
              MODALITY 01 // WEBXR
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 400, marginBottom: '8px', color: 'var(--colors-ink)' }}>
              WebXR Space AR
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--colors-ink-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
              Real-time horizontal surface hit-testing using WebXR Device API. Anchors timepiece models to physical tables with 1:1 metric scale and lighting estimation.
            </p>
          </div>

          <button
            onClick={() => onLaunchMode('markerless')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>Launch Surface AR</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Mode 2: Marker-Based MindAR */}
        <div className="carbon-cell" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: 'var(--colors-canvas)',
        }}>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--colors-surface-1)',
              border: '1px solid var(--colors-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--colors-primary)',
              marginBottom: '20px',
            }}>
              <Scan size={20} />
            </div>

            <div style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--colors-ink-muted)',
              marginBottom: '4px',
            }}>
              MODALITY 02 // MINDAR
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 400, marginBottom: '8px', color: 'var(--colors-ink)' }}>
              6DOF Target Tracking
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--colors-ink-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
              GPU-accelerated Natural Feature Tracking (NFT) compiled with WASM. Point smartphone camera at printable target card for ultra-stable orientation lock.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onLaunchMode('marker')}
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'space-between' }}
            >
              <span>Scan Marker</span>
              <ArrowRight size={15} />
            </button>
            <button
              onClick={onOpenMarkerModal}
              className="btn-secondary"
              style={{ padding: '10px 14px' }}
              title="View Printable Target Card"
            >
              <QrCode size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
