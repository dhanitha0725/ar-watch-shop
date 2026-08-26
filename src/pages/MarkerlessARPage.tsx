import React from 'react';
import { Watch, WatchConfiguration } from '../types/watch';
import { MarkerlessARScene } from '../components/ar/MarkerlessARScene';

interface MarkerlessARPageProps {
  watch: Watch;
  watches: Watch[];
  config: WatchConfiguration;
  onSelectWatch: (watch: Watch) => void;
  onUpdateConfig: (partial: Partial<WatchConfiguration>) => void;
  onBack: () => void;
  onResetConfig: () => void;
}

export const MarkerlessARPage: React.FC<MarkerlessARPageProps> = ({
  watch,
  watches,
  config,
  onSelectWatch,
  onUpdateConfig,
  onBack,
  onResetConfig,
}) => {
  return (
    <MarkerlessARScene
      watch={watch}
      watches={watches}
      config={config}
      onSelectWatch={onSelectWatch}
      onUpdateConfig={onUpdateConfig}
      onBack={onBack}
      onResetConfig={onResetConfig}
    />
  );
};
