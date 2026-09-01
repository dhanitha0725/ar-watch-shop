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
    <div className="carbon-tile" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '24px',
      borderRight: '1px solid var(--colors-hairline)',
      borderBottom: '1px solid var(--colors-hairline)',
      backgroundColor: 'var(--colors-canvas)',
    }}>
      {/* Category & Brand Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 400,
          color: 'var(--colors-primary)',
          letterSpacing: '0.16px',
        }}>
          {watch.category}
        </span>
        <span style={{
          fontSize: '12px',
          color: 'var(--colors-ink-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          {watch.brand}
        </span>
      </div>

      {/* Title & Tagline */}
      <h3 style={{
        fontSize: '20px',
        fontWeight: 400,
        lineHeight: 1.3,
        marginBottom: '6px',
        color: 'var(--colors-ink)',
      }}>
        {watch.name}
      </h3>
      <p style={{
        fontSize: '14px',
        color: 'var(--colors-ink-muted)',
        lineHeight: 1.4,
        marginBottom: '20px',
        flex: 1,
      }}>
        {watch.tagline}
      </p>

      {/* Color Swatches - Carbon Square Swatches */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--colors-ink-muted)',
          marginBottom: '8px',
        }}>
          Finishes: <strong>{watch.strapColors.length} Variants</strong>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {watch.strapColors.slice(0, 5).map((color, idx) => (
            <div
              key={idx}
              className="swatch-square"
              style={{
                width: '18px',
                height: '18px',
                backgroundColor: color.hex,
              }}
              title={`${color.name} (${color.materialType || 'silicone'})`}
            />
          ))}
        </div>
      </div>

      {/* Spec Snapshot - Carbon 2x2 Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1px',
        backgroundColor: 'var(--colors-hairline)',
        marginBottom: '20px',
        border: '1px solid var(--colors-hairline)',
      }}>
        <div style={{
          backgroundColor: 'var(--colors-surface-1)',
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--colors-ink-muted)', fontFamily: 'var(--font-mono)' }}>DIAMETER</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colors-ink)' }}>{watch.specs.caseDiameter}</div>
        </div>

        <div style={{
          backgroundColor: 'var(--colors-surface-1)',
          padding: '10px 12px',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--colors-ink-muted)', fontFamily: 'var(--font-mono)' }}>WATERPROOF</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colors-ink)' }}>{watch.specs.waterResistance}</div>
        </div>
      </div>

      {/* Price & Primary CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--colors-hairline)',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--colors-ink-muted)' }}>MSRP</div>
          <div style={{ fontSize: '20px', fontWeight: 400, color: 'var(--colors-ink)' }}>
            ${watch.price}
          </div>
        </div>

        <button
          onClick={() => onSelect(watch)}
          className="btn-primary"
          style={{ padding: '8px 14px', minHeight: '36px', height: '36px', fontSize: '13px' }}
        >
          <span>Configure 3D</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* AR Quick Launchers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        backgroundColor: 'var(--colors-hairline)',
        border: '1px solid var(--colors-hairline)',
      }}>
        <button
          onClick={() => onLaunchAR('markerless', watch)}
          style={{
            padding: '8px 4px',
            fontSize: '11px',
            fontFamily: 'var(--font-body)',
            backgroundColor: 'var(--colors-surface-1)',
            color: 'var(--colors-ink)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'background-color 0.1s ease',
          }}
          title="WebXR Surface AR"
        >
          <Eye size={12} color="var(--colors-primary)" />
          <span>Space</span>
        </button>

        <button
          onClick={() => onLaunchAR('marker', watch)}
          style={{
            padding: '8px 4px',
            fontSize: '11px',
            fontFamily: 'var(--font-body)',
            backgroundColor: 'var(--colors-surface-1)',
            color: 'var(--colors-ink)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'background-color 0.1s ease',
          }}
          title="Marker AR"
        >
          <Scan size={12} color="var(--colors-primary)" />
          <span>Marker</span>
        </button>

        <button
          onClick={() => onLaunchAR('wrist', watch)}
          style={{
            padding: '8px 4px',
            fontSize: '11px',
            fontFamily: 'var(--font-body)',
            backgroundColor: 'var(--colors-surface-1)',
            color: 'var(--colors-ink)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'background-color 0.1s ease',
          }}
          title="Wrist Try-On"
        >
          <Hand size={12} color="var(--colors-primary)" />
          <span>Try-On</span>
        </button>
      </div>
    </div>
  );
};
