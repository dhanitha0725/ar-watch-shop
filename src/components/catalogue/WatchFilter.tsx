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
}) => {
  const categories: { id: string; label: string }[] = [
    { id: 'All', label: 'All Models' },
    { id: 'Smart', label: 'Smartwatches' },
    { id: 'Sport', label: 'Sport Chronographs' },
    { id: 'Luxury', label: 'Luxury Automatic' },
    { id: 'Digital', label: 'Digital Display' },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '32px',
      overflowX: 'auto',
      padding: '4px 0',
    }}>
      <div style={{
        display: 'inline-flex',
        backgroundColor: 'var(--colors-canvas-parchment)',
        padding: '4px',
        borderRadius: 'var(--rounded-pill)',
        gap: '4px',
      }}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                padding: '8px 18px',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--colors-ink)' : 'var(--colors-body-muted)',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                borderRadius: 'var(--rounded-pill)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
