import React from 'react';
import { Scan, Eye, QrCode, ArrowRight } from 'lucide-react';
import { AR_COPY } from '../../data/arCopy';

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
          SEE IT IN YOUR SPACE
        </div>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 36px)',
          fontWeight: 300,
          lineHeight: 1.2,
          color: 'var(--colors-ink)',
        }}>
          Choose how you want to explore.
        </h2>
        <p style={{
          fontSize: '15px',
          color: 'var(--colors-ink-muted)',
          lineHeight: 1.5,
          marginTop: '6px',
          maxWidth: '720px',
        }}>
          Place a watch on a table, or point your camera at the watch card to see it appear.
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
              OPTION 01
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 400, marginBottom: '8px', color: 'var(--colors-ink)' }}>
              {AR_COPY.surface.title}
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--colors-ink-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
              {AR_COPY.surface.description}
            </p>
          </div>

          <button
            onClick={() => onLaunchMode('markerless')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>{AR_COPY.surface.button}</span>
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
              OPTION 02
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 400, marginBottom: '8px', color: 'var(--colors-ink)' }}>
              {AR_COPY.card.title}
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--colors-ink-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
              {AR_COPY.card.description} Open or print the card first, then keep the full card in view.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onLaunchMode('marker')}
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'space-between' }}
            >
              <span>{AR_COPY.card.button}</span>
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
