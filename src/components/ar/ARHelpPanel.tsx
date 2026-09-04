import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { AR_COPY } from '../../data/arCopy';

interface ARHelpPanelProps {
  mode: 'surface' | 'card';
  onClose: () => void;
  onShowCard?: () => void;
  placement?: 'left' | 'center';
  className?: string;
  style?: React.CSSProperties;
}

export const ARHelpPanel: React.FC<ARHelpPanelProps> = ({
  mode,
  onClose,
  onShowCard,
  placement = 'center',
  className = '',
  style,
}) => {
  const copy = AR_COPY[mode];

  const positionStyle: React.CSSProperties = placement === 'left' ? {
    position: 'absolute',
    top: '72px',
    left: '16px',
    right: 'auto',
    zIndex: 110,
    width: 'calc(100vw - 32px)',
    maxWidth: '380px',
    margin: 0,
  } : {
    position: 'absolute',
    top: '72px',
    left: '16px',
    right: '16px',
    zIndex: 110,
    maxWidth: '420px',
    margin: '0 auto',
  };

  return (
    <div
      role="dialog"
      aria-label={copy.helpTitle}
      className={`ar-help-panel ${placement === 'left' ? 'ar-help-panel-left' : ''} ${className}`.trim()}
      style={{
        ...positionStyle,
        padding: '18px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--colors-hairline)',
        borderRadius: 'var(--rounded-lg)',
        boxShadow: '0 10px 36px rgba(0, 0, 0, 0.18)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--colors-primary)', marginBottom: '6px' }}>
            <HelpCircle size={17} />
            <strong style={{ fontSize: '15px', color: 'var(--colors-ink)' }}>{copy.helpTitle}</strong>
          </div>
          <ol style={{ margin: '10px 0 0', paddingLeft: '20px', color: 'var(--colors-ink-muted)', fontSize: '13px', lineHeight: 1.55 }}>
            {copy.helpSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
        <button onClick={onClose} className="btn-icon" title={AR_COPY.common.closeHelp} aria-label={AR_COPY.common.closeHelp}>
          <X size={16} />
        </button>
      </div>

      {mode === 'surface' ? (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--colors-hairline)', fontSize: '12px', color: 'var(--colors-ink-muted)' }}>
          <strong style={{ color: 'var(--colors-ink)' }}>Controls:</strong> pinch to resize · drag to look around · use Start over to place again
        </div>
      ) : (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--colors-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--colors-ink-muted)' }}>
          <span><strong style={{ color: 'var(--colors-ink)' }}>Controls:</strong> drag to turn · use Size to resize</span>
          {onShowCard && <button onClick={onShowCard} className="btn-secondary" style={{ padding: '7px 10px', fontSize: '12px', whiteSpace: 'nowrap' }}>{AR_COPY.common.showCard}</button>}
        </div>
      )}

    </div>
  );
};
