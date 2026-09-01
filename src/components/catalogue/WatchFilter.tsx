import React from 'react';

interface WatchFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const WatchFilter: React.FC<WatchFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const categories: { id: string; label: string }[] = [
    { id: 'All', label: 'All Models (04)' },
    { id: 'Smart', label: 'Smartwatch (01)' },
    { id: 'Sport', label: 'Sport Chronograph (01)' },
    { id: 'Luxury', label: 'Luxury Automatic (01)' },
    { id: 'Digital', label: 'Digital Display (01)' },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      borderBottom: '1px solid var(--colors-hairline)',
      backgroundColor: 'var(--colors-canvas)',
      marginBottom: '0',
    }}>
      {/* Carbon Horizontal Category Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
      }}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                padding: '14px 20px',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--colors-ink)' : 'var(--colors-ink-muted)',
                backgroundColor: isActive ? 'var(--colors-surface-1)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--colors-primary)' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.1s ease',
                letterSpacing: '0.16px',
              }}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Carbon Search Input */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 12px' }}>
        <input
          type="text"
          placeholder="Filter timepieces by keyword..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            height: '36px',
            padding: '8px 14px',
            fontSize: '13px',
            backgroundColor: 'var(--colors-surface-1)',
            border: 'none',
            borderBottom: '1px solid var(--colors-hairline-strong)',
            width: '240px',
            color: 'var(--colors-ink)',
          }}
        />
      </div>
    </div>
  );
};
