import React, { useState } from 'react';
import { Watch } from '../types/watch';
import { Interactive3DViewer } from '../components/viewer/Interactive3DViewer';
import { ArrowLeft, Eye } from 'lucide-react';

interface ComparePageProps {
  watches: Watch[];
  onSelectWatch: (watch: Watch) => void;
  onLaunchAR: (mode: 'marker' | 'markerless', watch: Watch) => void;
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
    <div className="carbon-grid-container">
      {/* Top Header Banner */}
      <div style={{
        padding: '32px 32px 24px',
        borderBottom: '1px solid var(--colors-hairline)',
        backgroundColor: 'var(--colors-canvas)',
      }}>
        <button
          onClick={onBack}
          className="btn-dark-utility"
          style={{ padding: '6px 12px', fontSize: '12px', marginBottom: '16px', gap: '6px' }}
        >
          <ArrowLeft size={14} />
          <span>Return to Collection</span>
        </button>

        <div style={{
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--colors-primary)',
          marginBottom: '4px',
        }}>
          SIDE-BY-SIDE MATRIX COMPARISON
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 36px)', fontWeight: 300, marginBottom: '6px', color: 'var(--colors-ink)' }}>
          Compare Timepieces.
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--colors-ink-muted)' }}>
          Inspect two CAD models simultaneously in real-time 3D and cross-evaluate engineering specifications.
        </p>
      </div>

      {/* Side-by-Side Model Selectors & 3D Viewers in Flush 2-Column Grid */}
      <section className="carbon-section">
        <div className="carbon-grid-2col" style={{ alignItems: 'stretch' }}>
          {/* Watch 1 Column */}
          <div style={{
            padding: '24px 32px',
            borderRight: '1px solid var(--colors-hairline)',
            backgroundColor: 'var(--colors-canvas)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--colors-ink-muted)', display: 'block', marginBottom: '6px' }}>
                  PRIMARY TIMEPIECE // 01
                </label>
                <select
                  value={watch1Id}
                  onChange={(e) => setWatch1Id(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {watches.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.brand} — {w.name} (${w.price})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ border: 'none', backgroundColor: 'var(--colors-surface-1)', marginBottom: '16px' }}>
                <Interactive3DViewer
                  watch={watch1}
                  selectedStrapColor={watch1.strapColors[0]}
                  selectedDialColor={watch1.dialColors[0]}
                  height="340px"
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1px solid var(--colors-hairline)',
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--colors-ink)' }}>{watch1.name}</div>
                <div style={{ fontSize: '14px', color: 'var(--colors-primary)', fontFamily: 'var(--font-mono)' }}>${watch1.price}</div>
              </div>
              <button
                onClick={() => onLaunchAR('markerless', watch1)}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '12px', height: '36px' }}
              >
                <Eye size={13} />
                <span>View in AR</span>
              </button>
            </div>
          </div>

          {/* Watch 2 Column */}
          <div style={{
            padding: '24px 32px',
            backgroundColor: 'var(--colors-canvas)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--colors-ink-muted)', display: 'block', marginBottom: '6px' }}>
                  SECONDARY TIMEPIECE // 02
                </label>
                <select
                  value={watch2Id}
                  onChange={(e) => setWatch2Id(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {watches.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.brand} — {w.name} (${w.price})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ border: 'none', backgroundColor: 'var(--colors-surface-1)', marginBottom: '16px' }}>
                <Interactive3DViewer
                  watch={watch2}
                  selectedStrapColor={watch2.strapColors[0]}
                  selectedDialColor={watch2.dialColors[0]}
                  height="340px"
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1px solid var(--colors-hairline)',
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--colors-ink)' }}>{watch2.name}</div>
                <div style={{ fontSize: '14px', color: 'var(--colors-primary)', fontFamily: 'var(--font-mono)' }}>${watch2.price}</div>
              </div>
              <button
                onClick={() => onLaunchAR('markerless', watch2)}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '12px', height: '36px' }}
              >
                <Eye size={13} />
                <span>View in AR</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparative Specification Data Table */}
      <section className="carbon-section" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 400, marginBottom: '16px', color: 'var(--colors-ink)' }}>
          Technical Metric Matrix
        </h3>

        <div style={{ overflowX: 'auto', border: '1px solid var(--colors-hairline)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--colors-surface-1)', borderBottom: '2px solid var(--colors-primary)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--colors-ink-muted)', width: '30%', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>SPECIFICATION</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--colors-ink)', width: '35%', fontWeight: 600 }}>{watch1.name}</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--colors-ink)', width: '35%', fontWeight: 600 }}>{watch2.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--colors-hairline)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--colors-ink-muted)' }}>Category & Brand</td>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{watch1.brand} ({watch1.category})</td>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{watch2.brand} ({watch2.category})</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--colors-hairline)', backgroundColor: '#fafafa' }}>
                <td style={{ padding: '12px 16px', color: 'var(--colors-ink-muted)' }}>MSRP Price</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--colors-primary)', fontFamily: 'var(--font-mono)' }}>${watch1.price}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--colors-primary)', fontFamily: 'var(--font-mono)' }}>${watch2.price}</td>
              </tr>
              {specKeys.map((spec, idx) => (
                <tr key={spec.key} style={{ borderBottom: '1px solid var(--colors-hairline)', backgroundColor: idx % 2 === 0 ? 'var(--colors-canvas)' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--colors-ink-muted)' }}>{spec.label}</td>
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
