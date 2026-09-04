import React from 'react';
import { X, CheckCircle2, Download } from 'lucide-react';
import { AR_COPY } from '../../data/arCopy';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarkerModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const currentMarkerUrl = '/marker.jpg';
  const markerName = 'Chrono watch card';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(22, 22, 22, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--colors-canvas)',
          border: '1px solid var(--colors-hairline)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Top Window Bar */}
        <div style={{
          backgroundColor: 'var(--colors-surface-1)',
          borderBottom: '1px solid var(--colors-hairline)',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--colors-primary)' }}>
            <span>WATCH CARD</span>
          </div>

          <button
            onClick={onClose}
            className="btn-icon"
            style={{ width: '28px', height: '28px', border: 'none', background: 'transparent' }}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '28px' }}>
          {/* Header */}
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 6px 0', color: 'var(--colors-ink)' }}>
              Use the watch card
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--colors-ink-muted)', margin: 0, lineHeight: 1.45 }}>
              Open this image on a laptop or another phone, then point your phone camera at the full image.
            </p>
          </div>

          {/* Target Card Image Preview Container */}
          <div style={{
            backgroundColor: 'var(--colors-surface-1)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '16px',
            border: '1px solid var(--colors-hairline)',
            position: 'relative',
          }}>
            <img
              src={currentMarkerUrl}
              alt={markerName}
              style={{
                width: '100%',
                maxHeight: '190px',
                objectFit: 'contain',
                display: 'block',
                border: '1px solid var(--colors-hairline)',
              }}
            />
            <div style={{
              marginTop: '10px',
              fontSize: '11px',
              color: 'var(--colors-ink-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <CheckCircle2 size={13} color="var(--colors-semantic-success)" />
              <span>Ready to use with your phone camera</span>
            </div>
          </div>

          {/* Download Marker Action */}
          <div style={{ marginBottom: '20px' }}>
            <a
              href={currentMarkerUrl}
              download="chrono-watch-card.jpg"
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                textDecoration: 'none',
                gap: '8px',
                minHeight: '44px',
                fontSize: '14px',
              }}
            >
              <Download size={16} />
              <span>{AR_COPY.common.getMarkerImage}</span>
            </a>
          </div>

          {/* Step-by-Step Instructions */}
          <div style={{
            backgroundColor: 'var(--colors-surface-1)',
            padding: '14px 16px',
            fontSize: '12px',
            color: 'var(--colors-ink-muted)',
            lineHeight: 1.5,
            border: '1px solid var(--colors-hairline)',
          }}>
            <strong style={{ color: 'var(--colors-ink)', display: 'block', marginBottom: '6px', fontSize: '13px' }}>
              Instructions:
            </strong>
            <ol style={{ margin: '0 0 8px 0', paddingLeft: '18px' }}>
              <li style={{ marginBottom: '4px' }}>Open this watch card on a laptop or another phone.</li>
              <li>Point your camera at the whole card and hold it steady.</li>
            </ol>
            <div style={{ fontSize: '11px', color: 'var(--colors-ink-subtle)', borderTop: '1px solid var(--colors-hairline)', paddingTop: '6px', marginTop: '6px' }}>
              💡 <em>Good lighting and a fully visible card help the watch appear quickly.</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
