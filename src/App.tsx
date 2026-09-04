import React, { useState } from 'react';
import { WATCHES } from './data/watches';
import { Watch, WatchConfiguration, ConfiguratorStep } from './types/watch';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MarkerModal } from './components/common/Modal';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { MarkerARPage } from './pages/MarkerARPage';
import { MarkerlessARPage } from './pages/MarkerlessARPage';
import { ComparePage } from './pages/ComparePage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedWatch, setSelectedWatch] = useState<Watch>(WATCHES[0]);
  const [configStep, setConfigStep] = useState<ConfiguratorStep>('select');
  const [isMarkerModalOpen, setIsMarkerModalOpen] = useState<boolean>(false);

  // Global Option B Watch Configuration state
  const [config, setConfig] = useState<WatchConfiguration>({
    watchId: WATCHES[0].id,
    scale: 1.0,
    rotationY: 0,
    elevation: 0,
    isPlaced: false,
  });

  const handleUpdateConfig = (partial: Partial<WatchConfiguration>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  };

  const handleSelectWatch = (watch: Watch) => {
    setSelectedWatch(watch);
    setConfig({
      watchId: watch.id,
      scale: 1.0,
      rotationY: 0,
      elevation: 0,
      isPlaced: false,
    });
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetConfig = () => {
    setConfig({
      watchId: selectedWatch.id,
      scale: 1.0,
      rotationY: 0,
      elevation: 0,
      isPlaced: false,
    });
  };

  const handleLaunchAR = (mode: 'marker' | 'markerless', watch?: Watch) => {
    if (watch) {
      setSelectedWatch(watch);
    }
    if (mode === 'marker') setCurrentView('marker-ar');
    else if (mode === 'markerless') setCurrentView('markerless-ar');
  };

  const handleNavigate = (view: string) => {
    if (view === 'catalogue') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('catalogue-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if current screen is an immersive fullscreen AR mode
  const isImmersiveAR = ['marker-ar', 'markerless-ar'].includes(currentView);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: isImmersiveAR ? 'transparent' : 'var(--bg-primary)' }}>
      {/* Global Navbar (hidden in fullscreen AR modes) */}
      {!isImmersiveAR && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenMarkerModal={() => setIsMarkerModalOpen(true)}
        />
      )}

      {/* Main Content View Switcher */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <HomePage
            watches={WATCHES}
            onSelectWatch={handleSelectWatch}
            onLaunchAR={handleLaunchAR}
            onOpenMarkerModal={() => setIsMarkerModalOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'product' && (
          <ProductDetailPage
            watch={selectedWatch}
            watches={WATCHES}
            config={config}
            configStep={configStep}
            onSelectWatch={(w) => {
              setSelectedWatch(w);
              handleUpdateConfig({
                watchId: w.id,
              });
            }}
            onUpdateConfig={handleUpdateConfig}
            onSetConfigStep={setConfigStep}
            onResetConfig={handleResetConfig}
            onLaunchAR={handleLaunchAR}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'marker-ar' && (
          <MarkerARPage
            watch={selectedWatch}
            watches={WATCHES}
            onSelectWatch={(w) => {
              setSelectedWatch(w);
              handleUpdateConfig({ watchId: w.id });
            }}
            onBack={() => setCurrentView('product')}
            onOpenMarkerModal={() => setIsMarkerModalOpen(true)}
          />
        )}

        {currentView === 'markerless-ar' && (
          <MarkerlessARPage
            watch={selectedWatch}
            watches={WATCHES}
            config={config}
            onSelectWatch={(w) => {
              setSelectedWatch(w);
              handleUpdateConfig({ watchId: w.id });
            }}
            onUpdateConfig={handleUpdateConfig}
            onBack={() => setCurrentView('product')}
            onResetConfig={handleResetConfig}
          />
        )}

        {currentView === 'compare' && (
          <ComparePage
            watches={WATCHES}
            onSelectWatch={handleSelectWatch}
            onLaunchAR={handleLaunchAR}
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Global Footer (hidden in fullscreen AR modes) */}
      {!isImmersiveAR && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Global on-screen AR marker modal */}
      <MarkerModal
        isOpen={isMarkerModalOpen}
        onClose={() => setIsMarkerModalOpen(false)}
      />
    </div>
  );
};
