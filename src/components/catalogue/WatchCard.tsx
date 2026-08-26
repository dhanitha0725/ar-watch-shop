import React from 'react';
import { Watch } from '../../types/watch';
import { Scan, Eye, Hand, ArrowRight } from 'lucide-react';

interface WatchCardProps {
  watch: Watch;
  onSelect: (watch: Watch) => void;
  onLaunchAR: (mode: 'marker' | 'markerless' | 'wrist', watch: Watch) => void;
}

export const WatchCard: React.FC<WatchCardProps> = ({
  watch,
  onSelect,
  onLaunchAR,
}) => {
  return (
    <div className="store-utility-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Category & Brand Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--colors-primary)',
        }}>
          {watch.category}
        </span>
        <span style={{
          fontSize: '13px',
          color: 'var(--colors-body-muted)',
        }}>
          {watch.brand}
        </span>
      </div>

      {/* Title & Tagline */}
      <h3 style={{
        fontSize: '22px',
        fontWeight: 600,
        lineHeight: 1.2,
        marginBottom: '6px',
        color: 'var(--colors-ink)',
      }}>
        {watch.name}
      </h3>
      <p style={{
        fontSize: '14px',
        color: 'var(--colors-body-muted)',
        lineHeight: 1.4,
        marginBottom: '20px',
        flex: 1,
      }}>
        {watch.tagline}
      </p>

      {/* Color Swatches */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--colors-body-muted)',
          marginBottom: '8px',
        }}>
          {watch.strapColors.length} Band Finishes
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {watch.strapColors.slice(0, 5).map((color, idx) => (
            <div
              key={idx}
              className="swatch-circle"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: color.hex,
              }}
              title={`${color.name} (${color.materialType || 'silicone'})`}
            />
          ))}
        </div>
      </div>

      {/* Spec Snapshot */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginBottom: '20px',
      }}>
        <div style={{
          backgroundColor: 'var(--colors-canvas-parchment)',
          borderRadius: 'var(--rounded-sm)',
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--colors-body-muted)' }}>CASE</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colors-ink)' }}>{watch.specs.caseDiameter}</div>
        </div>

        <div style={{
          backgroundColor: 'var(--colors-canvas-parchment)',
          borderRadius: 'var(--rounded-sm)',
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--colors-body-muted)' }}>WATER RESIST</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colors-ink)' }}>{watch.specs.waterResistance}</div>
        </div>
      </div>

      {/* Price & Primary CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--colors-divider-soft)',
      }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--colors-body-muted)' }}>From</div>
          <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--colors-ink)' }}>
            ${watch.price}
          </div>
        </div>

        <button
          onClick={() => onSelect(watch)}
          className="btn-primary"
          style={{ padding: '8px 18px', minHeight: '36px', fontSize: '13px' }}
        >
          <span>Inspect 3D</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* AR Quick Launchers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
      }}>
        <button
          onClick={() => onLaunchAR('markerless', watch)}
          className="btn-secondary"
          style={{
            padding: '6px 4px',
            minHeight: '32px',
            fontSize: '12px',
            justifyContent: 'center',
          }}
          title="WebXR Surface AR"
        >
          <Eye size={13} />
          <span>Space AR</span>
        </button>

        <button
          onClick={() => onLaunchAR('marker', watch)}
          className="btn-secondary"
          style={{
            padding: '6px 4px',
            minHeight: '32px',
            fontSize: '12px',
            justifyContent: 'center',
          }}
          title="Marker AR"
        >
          <Scan size={13} />
          <span>Marker</span>
        </button>

        <button
          onClick={() => onLaunchAR('wrist', watch)}
          className="btn-secondary"
          style={{
            padding: '6px 4px',
            minHeight: '32px',
            fontSize: '12px',
            justifyContent: 'center',
          }}
          title="Wrist Try-On"
        >
          <Hand size={13} />
          <span>Try-On</span>
        </button>
      </div>
    </div>
  );
};
