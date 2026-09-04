import React from 'react';
import { Watch } from '../../types/watch';
import { Interactive3DViewer } from '../viewer/Interactive3DViewer';
import { ArrowRight } from 'lucide-react';

interface WatchCardProps {
  watch: Watch;
  onSelect: (watch: Watch) => void;
  onLaunchAR?: (mode: 'marker' | 'markerless', watch: Watch) => void;
}

export const WatchCard: React.FC<WatchCardProps> = ({
  watch,
  onSelect,
}) => {
  return (
    <div className="carbon-tile" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '28px 24px 24px',
      borderRight: '1px solid var(--colors-hairline)',
      borderBottom: '1px solid var(--colors-hairline)',
      backgroundColor: 'var(--colors-canvas)',
      justifyContent: 'space-between',
    }}>
      <div>
        {/* Clean Brand Header */}
        <div style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--colors-primary)',
          letterSpacing: '0.5px',
          marginBottom: '6px',
        }}>
          {watch.brand.toUpperCase()}
        </div>

        {/* Model Title */}
        <h3 style={{
          fontSize: '20px',
          fontWeight: 400,
          lineHeight: 1.25,
          marginBottom: '12px',
          color: 'var(--colors-ink)',
        }}>
          {watch.name}
        </h3>

        {/* Clean 3D Model seamlessly on the same card background (no inner square/borders, no operational buttons) */}
        <div style={{
          height: '240px',
          backgroundColor: 'transparent',
          position: 'relative',
          marginBottom: '16px',
        }}>
          <Interactive3DViewer
            watch={watch}
            autoRotateDefault={false}
            hideControls={true}
            height="100%"
            loading="lazy"
          />
        </div>
      </div>

      {/* Price & Primary CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '16px',
        borderTop: '1px solid var(--colors-hairline)',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--colors-ink-muted)', fontFamily: 'var(--font-mono)' }}>MSRP</div>
          <div style={{ fontSize: '20px', fontWeight: 400, color: 'var(--colors-ink)', fontFamily: 'var(--font-display)' }}>
            ${watch.price}
          </div>
        </div>

        <button
          onClick={() => onSelect(watch)}
          className="btn-primary"
          style={{ padding: '8px 16px', minHeight: '36px', height: '36px', fontSize: '13px' }}
        >
          <span>Configure 3D</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
