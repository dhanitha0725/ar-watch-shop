import React from 'react';
import { TrackingState } from '../../types/watch';
import { Loader2, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { AR_COPY } from '../../data/arCopy';

interface ARStateBadgeProps {
  state: TrackingState;
  customMessage?: string;
}

export const ARStateBadge: React.FC<ARStateBadgeProps> = ({ state, customMessage }) => {
  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    backdropFilter: 'saturate(180%) blur(16px)',
    WebkitBackdropFilter: 'saturate(180%) blur(16px)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    borderRadius: 'var(--rounded-pill)',
    padding: '6px 14px',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '-0.1px',
    color: 'var(--colors-ink)',
    fontFamily: 'var(--font-body)',
  };

  switch (state) {
    case 'searching':
      return (
        <div className="ar-state-badge" style={badgeStyle}>
          <Loader2 size={14} className="animate-spin" color="var(--colors-primary)" style={{ flexShrink: 0 }} />
          <span style={textStyle}>
            {customMessage || AR_COPY.surface.searching}
          </span>
          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
            .animate-spin { animation: spin 1.2s linear infinite; }
          `}</style>
        </div>
      );

    case 'detected':
      return (
        <div className="ar-state-badge" style={badgeStyle}>
          <CheckCircle2 size={14} color="var(--colors-success)" style={{ flexShrink: 0 }} />
          <span style={textStyle}>
            {customMessage || AR_COPY.surface.found}
          </span>
        </div>
      );

    case 'lost':
      return (
        <div className="ar-state-badge" style={badgeStyle}>
          <AlertTriangle size={14} color="var(--colors-danger)" style={{ flexShrink: 0 }} />
          <span style={textStyle}>
            {customMessage || AR_COPY.card.lost}
          </span>
        </div>
      );

    case 'calibrating':
      return (
        <div className="ar-state-badge" style={badgeStyle}>
          <Eye size={14} color="var(--colors-primary)" style={{ flexShrink: 0 }} />
          <span style={textStyle}>
            {customMessage || AR_COPY.surface.ready}
          </span>
        </div>
      );

    case 'unsupported':
    default:
      return (
        <div className="ar-state-badge" style={badgeStyle}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--colors-body-muted)', flexShrink: 0 }} />
          <span style={textStyle}>
            {customMessage || AR_COPY.surface.desktop}
          </span>
        </div>
      );
  }
};
