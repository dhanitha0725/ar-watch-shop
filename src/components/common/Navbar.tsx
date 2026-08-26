import React, { useState } from 'react';
import { Watch as WatchIcon, Eye, Scan, Hand, Sliders, FileText, Menu, X, QrCode, Sparkles } from 'lucide-react';

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
    { id: 'wrist-tryon', label: 'Wrist Try-On', icon: Hand },
    { id: 'compare', label: 'Compare', icon: Sliders },
    { id: 'docs', label: 'Test Report', icon: FileText },
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
      backgroundColor: 'rgba(255, 255, 255, 0.82)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderBottom: '1px solid var(--colors-hairline)',
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        height: '52px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo - Sleek Apple Style */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--colors-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}>
            <WatchIcon size={16} />
          </div>

          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '18px',
            letterSpacing: '-0.3px',
            color: 'var(--colors-ink)',
          }}>
            Chrono
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '8px',
          height: '100%',
        }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--colors-ink)' : 'var(--colors-body-muted)',
                  backgroundColor: isActive ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  borderRadius: 'var(--rounded-pill)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
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
          gap: '10px',
        }}>
          <button
            onClick={onOpenMarkerModal}
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              minHeight: '32px',
              gap: '6px',
            }}
            title="AR Marker"
          >
            <QrCode size={14} />
            <span style={{ display: 'none' }} className="marker-btn-text">Marker</span>
          </button>

          <button
            onClick={() => handleNavClick('markerless-ar')}
            className="btn-primary"
            style={{
              padding: '6px 16px',
              fontSize: '13px',
              minHeight: '32px',
              gap: '6px',
            }}
          >
            <Sparkles size={14} />
            <span>Launch AR</span>
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
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
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
                  padding: '12px 16px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: isActive ? 'var(--colors-canvas-parchment)' : 'transparent',
                  border: 'none',
                  color: isActive ? 'var(--colors-primary)' : 'var(--colors-ink)',
                  fontSize: '15px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              onOpenMarkerModal();
              setMobileMenuOpen(false);
            }}
            className="btn-secondary"
            style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}
          >
            <QrCode size={16} />
            <span>Printable Marker</span>
          </button>
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
        }
      `}</style>
    </header>
  );
};
