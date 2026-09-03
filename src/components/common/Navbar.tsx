import React, { useState } from 'react';
import { Watch as WatchIcon, Eye, Scan, Sliders, FileText, Menu, X, QrCode, Sparkles, ExternalLink, Terminal } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, watchId?: string) => void;
  onOpenMarkerModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenMarkerModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'catalogue', label: 'Collection', icon: WatchIcon },
    { id: 'markerless-ar', label: 'Space AR', icon: Eye },
    { id: 'marker-ar', label: 'Marker AR', icon: Scan },
    { id: 'compare', label: 'Compare', icon: Sliders },
    { id: 'docs', label: 'Test Matrix', icon: FileText },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--colors-canvas)',
      borderBottom: '1px solid var(--colors-hairline)',
    }}>
      {/* Carbon Utility Bar (32px) */}
      <div style={{
        height: '32px',
        backgroundColor: 'var(--colors-surface-1)',
        borderBottom: '1px solid var(--colors-hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        fontSize: '12px',
        color: 'var(--colors-ink-muted)',
      }} className="utility-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={12} color="var(--colors-primary)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2px' }}>
            CARBON DESIGN SYSTEM // WEBAR RUNTIME 2.4
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => onNavigate('docs')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--colors-ink-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Verification Spec (T01–T09)</span>
            <ExternalLink size={10} />
          </button>
          <span style={{ color: 'var(--colors-hairline)' }}>|</span>
          <span>Status: <strong>PBR Ready</strong></span>
        </div>
      </div>

      {/* Main Carbon Top Navigation Bar (48px) */}
      <div style={{
        maxWidth: '1584px',
        margin: '0 auto',
        height: '48px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Carbon Brand Mark - Square & Confident */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            height: '100%',
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            backgroundColor: 'var(--colors-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}>
            <WatchIcon size={16} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '16px',
              letterSpacing: '-0.1px',
              color: 'var(--colors-ink)',
            }}>
              CHRONO
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links - Carbon Square Tabs */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '0',
          height: '100%',
        }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--colors-ink)' : 'var(--colors-ink-muted)',
                  backgroundColor: isActive ? 'var(--colors-surface-1)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--colors-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.1s ease',
                  letterSpacing: '0.16px',
                }}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <button
            onClick={onOpenMarkerModal}
            className="btn-dark-utility"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              height: '32px',
              gap: '6px',
            }}
            title="AR Marker"
          >
            <QrCode size={13} />
            <span style={{ display: 'none' }} className="marker-btn-text">Target Card</span>
          </button>

          <button
            onClick={() => handleNavClick('markerless-ar')}
            className="btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              minHeight: '32px',
              height: '32px',
              gap: '6px',
            }}
          >
            <Sparkles size={13} />
            <span>Launch Space AR</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon mobile-menu-btn"
            style={{ display: 'none', width: '36px', height: '36px' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--colors-canvas)',
          borderTop: '1px solid var(--colors-hairline)',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 20px',
                  backgroundColor: isActive ? 'var(--colors-surface-1)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--colors-hairline)',
                  color: isActive ? 'var(--colors-primary)' : 'var(--colors-ink)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div style={{ padding: '16px' }}>
            <button
              onClick={() => {
                onOpenMarkerModal();
                setMobileMenuOpen(false);
              }}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <QrCode size={15} />
              <span>Printable Target Card</span>
            </button>
          </div>
        </div>
      )}

      {/* Responsive Inline Styles */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .marker-btn-text { display: inline !important; }
        }
        @media (max-width: 899px) {
          .mobile-menu-btn { display: inline-flex !important; }
          .utility-bar { display: none !important; }
        }
      `}</style>
    </header>
  );
};
