import React, { useState } from 'react';
import { Watch } from '../types/watch';
import { Interactive3DViewer } from '../components/viewer/Interactive3DViewer';
import { ArrowLeft } from 'lucide-react';

interface ComparePageProps {
  watches: Watch[];
  onSelectWatch: (watch: Watch) => void;
  onLaunchAR: (mode: 'marker' | 'markerless' | 'wrist', watch: Watch) => void;
  onBack: () => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  watches,
  onLaunchAR,
  onBack,
}) => {
  const [watch1Id, setWatch1Id] = useState<string>(watches[0]?.id || '');
  const [watch2Id, setWatch2Id] = useState<string>(watches[1]?.id || '');

  const watch1 = watches.find(w => w.id === watch1Id) || watches[0];
  const watch2 = watches.find(w => w.id === watch2Id) || watches[1];

  const specKeys: { key: keyof Watch['specs']; label: string }[] = [
    { key: 'caseDiameter', label: 'Case Diameter' },
    { key: 'caseThickness', label: 'Case Thickness' },
    { key: 'waterResistance', label: 'Water Resistance' },
    { key: 'batteryLifeOrMovement', label: 'Movement / Battery' },
    { key: 'glassMaterial', label: 'Crystal Glass' },
    { key: 'caseMaterial', label: 'Chassis Material' },
    { key: 'weight', label: 'Total Weight' },
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={onBack}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '13px', marginBottom: '16px', gap: '6px' }}
        >
          <ArrowLeft size={15} />
          <span>Collection</span>
        </button>
        <h1 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '6px' }}>
          Compare Timepieces
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--colors-body-muted)' }}>
          Inspect two models side-by-side in real-time 3D and compare technical specifications.
        </p>
      </div>

      {/* Side-by-Side Model Selectors & 3D Viewers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
        marginBottom: '48px',
      }}>
        {/* Watch 1 Column */}
        <div className="store-utility-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: 'var(--colors-body-muted)', display: 'block', marginBottom: '6px' }}>
              Select Model 1:
            </label>
            <select
              value={watch1Id}
              onChange={(e) => setWatch1Id(e.target.value)}
              style={{
                width: '100%',
              }}
            >
              {watches.map(w => (
                <option key={w.id} value={w.id}>
                  {w.brand} — {w.name} (${w.price})
                </option>
              ))}
            </select>
          </div>

          <Interactive3DViewer
            watch={watch1}
            selectedStrapColor={watch1.strapColors[0]}
            selectedDialColor={watch1.dialColors[0]}
            height="360px"
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--colors-ink)' }}>{watch1.name}</div>
              <div style={{ fontSize: '15px', color: 'var(--colors-primary)', fontWeight: 600 }}>${watch1.price}</div>
            </div>
            <button
              onClick={() => onLaunchAR('markerless', watch1)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              <span>View in AR</span>
            </button>
          </div>
        </div>

        {/* Watch 2 Column */}
        <div className="store-utility-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: 'var(--colors-body-muted)', display: 'block', marginBottom: '6px' }}>
              Select Model 2:
            </label>
            <select
              value={watch2Id}
              onChange={(e) => setWatch2Id(e.target.value)}
              style={{
                width: '100%',
              }}
            >
              {watches.map(w => (
                <option key={w.id} value={w.id}>
                  {w.brand} — {w.name} (${w.price})
                </option>
              ))}
            </select>
          </div>

          <Interactive3DViewer
            watch={watch2}
            selectedStrapColor={watch2.strapColors[0]}
            selectedDialColor={watch2.dialColors[0]}
            height="360px"
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--colors-ink)' }}>{watch2.name}</div>
              <div style={{ fontSize: '15px', color: 'var(--colors-primary)', fontWeight: 600 }}>${watch2.price}</div>
            </div>
            <button
              onClick={() => onLaunchAR('markerless', watch2)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              <span>View in AR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comparative Specification Table */}
      <section className="store-utility-card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>
          Specifications Comparison
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--colors-primary)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--colors-body-muted)', width: '30%', fontWeight: 600 }}>Metric</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--colors-ink)', width: '35%', fontWeight: 600 }}>{watch1.name}</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--colors-ink)', width: '35%', fontWeight: 600 }}>{watch2.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--colors-divider-soft)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--colors-body-muted)' }}>Category & Brand</td>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{watch1.brand} ({watch1.category})</td>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{watch2.brand} ({watch2.category})</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--colors-divider-soft)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--colors-body-muted)' }}>Price</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--colors-primary)' }}>${watch1.price}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--colors-primary)' }}>${watch2.price}</td>
              </tr>
              {specKeys.map(spec => (
                <tr key={spec.key} style={{ borderBottom: '1px solid var(--colors-divider-soft)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--colors-body-muted)' }}>{spec.label}</td>
                  <td style={{ padding: '12px 16px' }}>{watch1.specs[spec.key]}</td>
                  <td style={{ padding: '12px 16px' }}>{watch2.specs[spec.key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
