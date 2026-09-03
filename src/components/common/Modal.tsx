import React from 'react';
import { X, Download, Printer, CheckCircle2, Sparkles, Terminal } from 'lucide-react';
import { AR_COPY } from '../../data/arCopy';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarkerModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const currentMarkerUrl = '/markers/card.png';
  const markerName = 'Chrono watch card';

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print AR Target - ${markerName}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background: #ffffff;
                color: #161616;
                text-align: center;
                padding: 24px;
                box-sizing: border-box;
              }
              .card-container {
                border: 2px solid #0f62fe;
                padding: 24px;
                background: #ffffff;
                max-width: 480px;
              }
              img {
                max-width: 100%;
                height: auto;
                border: 1px solid #e0e0e0;
              }
              h2 {
                font-size: 20px;
                margin: 0 0 12px 0;
                color: #161616;
                font-weight: 400;
              }
              p {
                margin: 14px 0 0 0;
                color: #525252;
                font-size: 13px;
                line-height: 1.5;
              }
            </style>
          </head>
          <body onload="window.print();">
            <div class="card-container">
              <h2>Chrono watch card</h2>
              <img src="${window.location.origin}${currentMarkerUrl}" alt="${markerName}" />
              <p>Show this card on another screen or print it, then point your phone camera at the full card to view the watch.</p>
            </div>
          </body>
        </html>
      `);
      win.document.close();
    }
  };

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
            <Terminal size={13} />
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
              Show this card on another screen or print it on paper. Keep it flat, fully visible, and well lit.
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
            marginBottom: '20px',
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

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '20px',
          }}>
            <a
              href={currentMarkerUrl}
              download="chrono-ar-target-card.png"
              className="btn-secondary"
              style={{
                fontSize: '13px',
                justifyContent: 'center',
                padding: '10px 14px',
              }}
            >
              <Download size={14} />
              <span>Download Image</span>
            </a>

            <button
              onClick={handlePrint}
              className="btn-primary"
              style={{
                fontSize: '13px',
                justifyContent: 'center',
                padding: '10px 14px',
              }}
            >
              <Printer size={14} />
              <span>Print Target Card</span>
            </button>
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
              <li style={{ marginBottom: '4px' }}>Open <strong>{AR_COPY.card.button}</strong> on your phone.</li>
              <li style={{ marginBottom: '4px' }}>Show or print the <strong>watch card</strong>.</li>
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
