import React from 'react';
import { X, Download, Printer, CheckCircle2, Sparkles } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarkerModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const currentMarkerUrl = '/markers/card.png';
  const markerName = 'MindAR Product Target Card';

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
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background: #ffffff;
                color: #1d1d1f;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
              }
              .card-container {
                border: 2px dashed #0071e3;
                border-radius: 16px;
                padding: 24px;
                background: #fbfbfd;
                max-width: 460px;
              }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
              }
              h2 {
                font-size: 20px;
                margin: 0 0 12px 0;
                color: #1d1d1f;
              }
              p {
                margin: 14px 0 0 0;
                color: #6e6e73;
                font-size: 13px;
                line-height: 1.5;
              }
            </style>
          </head>
          <body onload="window.print();">
            <div class="card-container">
              <h2>Chrono AR Image Target Card</h2>
              <img src="${window.location.origin}${currentMarkerUrl}" alt="${markerName}" />
              <p>Point your mobile camera at this Target Card in the WebAR Watch Store to view and inspect the 3D watch in 6DOF Augmented Reality.</p>
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
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'var(--colors-canvas)',
          borderRadius: 'var(--rounded-lg)',
          border: '1px solid var(--colors-hairline)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '28px' }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn-icon"
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              width: '34px',
              height: '34px',
            }}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(0, 113, 227, 0.08)',
              color: 'var(--colors-primary)',
              padding: '4px 10px',
              borderRadius: 'var(--rounded-pill)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              <Sparkles size={12} />
              <span>MindAR Natural Feature Tracking</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--colors-ink)' }}>
              AR Tracking Target Card
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--colors-body-muted)', margin: 0, lineHeight: 1.45 }}>
              Point your smartphone camera at this graphic card on your second screen or print it out on paper.
            </p>
          </div>

          {/* Target Card Image Preview Container */}
          <div style={{
            backgroundColor: 'var(--colors-canvas-parchment)',
            padding: '20px',
            borderRadius: 'var(--rounded-md)',
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
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
              }}
            />
            <div style={{
              marginTop: '10px',
              fontSize: '11px',
              color: 'var(--colors-body-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <CheckCircle2 size={13} color="#30d158" />
              <span>Official 6DOF target compiled in <code style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>card.mind</code></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
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
              className="btn-secondary"
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
            backgroundColor: 'var(--colors-surface-pearl)',
            borderRadius: 'var(--rounded-md)',
            padding: '14px 16px',
            fontSize: '12px',
            color: 'var(--colors-body-muted)',
            lineHeight: 1.5,
            border: '1px solid var(--colors-hairline)',
          }}>
            <strong style={{ color: 'var(--colors-ink)', display: 'block', marginBottom: '6px', fontSize: '13px' }}>
              How to view the 3D watch:
            </strong>
            <ol style={{ margin: '0 0 8px 0', paddingLeft: '18px' }}>
              <li style={{ marginBottom: '4px' }}>Open <strong>Marker AR mode</strong> on your smartphone.</li>
              <li style={{ marginBottom: '4px' }}>Point your camera at the <strong>Target Card image</strong> above (keep it clearly in frame).</li>
              <li>The 3D watch anchors instantly in full 6DOF 3D space on top of the card.</li>
            </ol>
            <div style={{ fontSize: '11px', color: 'var(--colors-body-muted)', borderTop: '1px solid var(--colors-hairline)', paddingTop: '6px', marginTop: '6px' }}>
              💡 <em>Note: MindAR uses Natural Feature Tracking (NFT). Pointing at old black-and-white square QR/Hiro markers is not supported.</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
