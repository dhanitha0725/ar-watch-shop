import React from 'react';
import { Hand, Sliders } from 'lucide-react';

type GestureType = 'drag' | 'pinch' | 'double-tap' | 'slider';

interface GestureTip {
  type: GestureType;
  label: string;
  description: string;
}

interface ARGestureGuideProps {
  mode: 'surface' | 'card';
  isAutoRotating?: boolean;
}

const GESTURE_TIPS: Record<ARGestureGuideProps['mode'], GestureTip[]> = {
  surface: [
    {
      type: 'drag',
      label: 'Rotate the watch',
      description: 'Drag with one finger to look around the watch.',
    },
    {
      type: 'pinch',
      label: 'Resize the watch',
      description: 'Pinch with two fingers to make it larger or smaller.',
    },
    {
      type: 'double-tap',
      label: 'Auto-rotate',
      description: 'Double-tap the watch to start or stop the spin.',
    },
  ],
  card: [
    {
      type: 'drag',
      label: 'Rotate the watch',
      description: 'Drag with one finger to view every angle.',
    },
    {
      type: 'double-tap',
      label: 'Auto-rotate',
      description: 'Double-tap the watch to start or stop the spin.',
    },
    {
      type: 'slider',
      label: 'Resize the watch',
      description: 'Use Size in Controls to make it larger or smaller.',
    },
  ],
};

const GESTURE_ICONS = {
  drag: Hand,
  pinch: Hand,
  'double-tap': Hand,
  slider: Sliders,
} as const;

const GestureVisual: React.FC<{ type: GestureType }> = ({ type }) => {
  const Icon = GESTURE_ICONS[type];

  return (
    <span className={`ar-gesture-visual ar-gesture-visual-${type}`} aria-hidden="true">
      {type === 'pinch' ? (
        <>
          <span className="ar-gesture-hand ar-gesture-hand-one"><Icon size={18} strokeWidth={1.8} /></span>
          <span className="ar-gesture-hand ar-gesture-hand-two"><Icon size={18} strokeWidth={1.8} /></span>
        </>
      ) : (
        <span className="ar-gesture-icon"><Icon size={20} strokeWidth={1.8} /></span>
      )}
      {type === 'double-tap' && (
        <span className="ar-gesture-tap-dots">
          <span />
          <span />
        </span>
      )}
      {type === 'pinch' && <span className="ar-gesture-pinch-line" />}
    </span>
  );
};

export const ARGestureGuide: React.FC<ARGestureGuideProps> = ({ mode, isAutoRotating = false }) => (
  <div className="ar-gesture-guide" role="group" aria-label="Gesture tips">
    <div className="ar-gesture-guide-heading">Quick gestures</div>
    <div className="ar-gesture-tip-list">
      {GESTURE_TIPS[mode].map((tip) => (
        <div className="ar-gesture-tip" key={tip.type}>
          <GestureVisual type={tip.type} />
          <div className="ar-gesture-tip-copy">
            <div className="ar-gesture-tip-label">
              {tip.label}
              {tip.type === 'double-tap' && isAutoRotating && (
                <span className="ar-gesture-live-status">On</span>
              )}
            </div>
            <div className="ar-gesture-tip-description">{tip.description}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
