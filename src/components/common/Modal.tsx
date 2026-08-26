import React, { useState } from 'react';
import { X, Download, Printer, Smartphone } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarkerModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'hiro' | 'custom'>('hiro');

  if (!isOpen) return null;

  const currentMarkerUrl = activeTab === 'hiro' ? '/markers/hiro.svg' : '/markers/watch-marker.svg';
  const markerName = activeTab === 'hiro' ? 'Hiro Standard Marker' : 'Custom Watch Store Marker';

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Print AR Marker - ${markerName}</title>
            <style>
              body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; font-family: -apple-system, sans-serif; background: #fff; color: #1d1d1f; }
              img { max-width: 360px; max-height: 360px; border: 1px solid #e0e0e0; padding: 16px; border-radius: 12px; }
              p { margin-top: 16px; color: #86868b; font-size: 14px; }
            </style>
          </head>
          <body onload="window.print();">
            <h2>Chrono AR Tracking Marker: ${markerName}</h2>
            <img src="${window.location.origin}${currentMarkerUrl}" alt="${markerName}" />
            <p>Point your mobile camera at this marker in the WebAR Watch Store to view the 3D model.</p>
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
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--colors-canvas)',
          borderRadius: 'var(--rounded-lg)',
          border: '1px solid var(--colors-hairline)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '32px' }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn-icon"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '36px',
              height: '36px',
            }}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>

          {/* Title */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '6px' }}>
              AR Tracking Marker
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--colors-body-muted)', lineHeight: 1.4 }}>
              Point your camera at this marker on-screen or print it on paper.
            </p>
          </div>

          {/* Marker Switcher Segmented Control */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--colors-canvas-parchment)',
            padding: '4px',
            borderRadius: 'var(--rounded-pill)',
            marginBottom: '24px',
          }}>
            <button
              onClick={() => setActiveTab('hiro')}
              style={{
                flex: 1,
                padding: '8px 16px',
                borderRadius: 'var(--rounded-pill)',
                border: 'none',
                backgroundColor: activeTab === 'hiro' ? '#ffffff' : 'transparent',
                color: activeTab === 'hiro' ? 'var(--colors-ink)' : 'var(--colors-body-muted)',
                fontWeight: activeTab === 'hiro' ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'hiro' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Hiro Marker
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              style={{
                flex: 1,
                padding: '8px 16px',
                borderRadius: 'var(--rounded-pill)',
                border: 'none',
                backgroundColor: activeTab === 'custom' ? '#ffffff' : 'transparent',
                color: activeTab === 'custom' ? 'var(--colors-ink)' : 'var(--colors-body-muted)',
                fontWeight: activeTab === 'custom' ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'custom' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Watch Marker
            </button>
          </div>

          {/* Marker Image Display Container */}
          <div style={{
            backgroundColor: 'var(--colors-canvas-parchment)',
            padding: '24px',
            borderRadius: 'var(--rounded-md)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '24px',
            border: '1px solid var(--colors-hairline)',
          }}>
            <img
              src={currentMarkerUrl}
              alt={markerName}
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'contain',
                display: 'block',
                borderRadius: '8px',
              }}
            />
          </div>

          {/* Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '24px',
          }}>
            <a
              href={currentMarkerUrl}
              download={`${activeTab}-marker.svg`}
              className="btn-secondary"
              style={{
                fontSize: '14px',
                justifyContent: 'center',
              }}
            >
              <Download size={15} />
              <span>Download SVG</span>
            </a>

            <button
              onClick={handlePrint}
              className="btn-secondary"
              style={{
                fontSize: '14px',
                justifyContent: 'center',
              }}
            >
              <Printer size={15} />
              <span>Print Marker</span>
            </button>
          </div>

          {/* Instructions */}
          <div style={{
            backgroundColor: 'var(--colors-surface-pearl)',
            borderRadius: 'var(--rounded-md)',
            padding: '16px',
            fontSize: '13px',
            color: 'var(--colors-body-muted)',
            lineHeight: 1.5,
          }}>
            <strong style={{ color: 'var(--colors-ink)', display: 'block', marginBottom: '4px' }}>Quick Instructions:</strong>
            1. Open Marker AR mode on your smartphone.<br />
            2. Point your camera at this marker.<br />
            3. The 3D watch will anchor directly on top of the pattern.
          </div>
        </div>
      </div>
    </div>
  );
};
