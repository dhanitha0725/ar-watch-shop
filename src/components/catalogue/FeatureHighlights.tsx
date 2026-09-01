import React from 'react';
import { Scan, Eye, Hand, QrCode } from 'lucide-react';

interface FeatureHighlightsProps {
  onLaunchMode: (mode: 'markerless' | 'marker' | 'wrist') => void;
  onOpenMarkerModal: () => void;
}

export const FeatureHighlights: React.FC<FeatureHighlightsProps> = ({
  onLaunchMode,
  onOpenMarkerModal,
}) => {
  return (
    <section style={{
      marginTop: 'var(--spacing-section)',
      padding: '80px 24px',
      backgroundColor: 'var(--colors-canvas-parchment)',
      borderRadius: 'var(--rounded-lg)',
    }}>
      {/* Section Header */}
      <div style={{ maxWidth: '680px', margin: '0 auto 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '12px' }}>
          Three Ways to Experience in AR.
        </h2>
        <p style={{ fontSize: '17px', color: 'var(--colors-body-muted)', lineHeight: 1.5 }}>
          Inspect true-to-scale luxury timepieces in your physical environment using WebXR surface mapping, physical marker tracking, or real-time wrist detection.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Mode 1: Markerless WebXR */}
        <div className="store-utility-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 102, 204, 0.08)',
            color: 'var(--colors-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}>
            <Eye size={22} />
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            WebXR Space AR
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--colors-body-muted)', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
            Detects horizontal planes on desks and tables using WebXR Device API. Place the timepiece with realistic lighting and 1:1 scale.
          </p>

          <button
            onClick={() => onLaunchMode('markerless')}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            <span>Launch Surface AR</span>
          </button>
        </div>

        {/* Mode 2: Marker-Based MindAR */}
        <div className="store-utility-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 102, 204, 0.08)',
            color: 'var(--colors-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}>
            <Scan size={22} />
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Marker & Target Tracking
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--colors-body-muted)', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
            High-precision 6DOF physical anchoring with MindAR. Point your camera at a target card or pattern on screen or paper for locked tracking.
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onLaunchMode('marker')}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              <span>Scan Marker</span>
            </button>
            <button
              onClick={onOpenMarkerModal}
              className="btn-secondary"
              style={{ padding: '10px 14px' }}
              title="View Marker"
            >
              <QrCode size={16} />
            </button>
          </div>
        </div>

        {/* Mode 3: MediaPipe Hand Landmarker Wrist Try-On */}
        <div className="store-utility-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 102, 204, 0.08)',
            color: 'var(--colors-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}>
            <Hand size={22} />
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Wrist Virtual Try-On
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--colors-body-muted)', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
            Tracks 21 hand landmarks via MediaPipe Vision in real time, calculating wrist joint orientation with smoothing filters.
          </p>

          <button
            onClick={() => onLaunchMode('wrist')}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            <span>Try On Your Wrist</span>
          </button>
        </div>
      </div>
    </section>
  );
};
