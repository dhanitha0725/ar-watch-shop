import React from 'react';
import { Watch, WatchConfiguration } from '../types/watch';
import { WristTryOnScene } from '../components/ar/WristTryOnScene';

interface WristTryOnPageProps {
  watch: Watch;
  watches: Watch[];
  config: WatchConfiguration;
  onSelectWatch: (watch: Watch) => void;
  onBack: () => void;
}

export const WristTryOnPage: React.FC<WristTryOnPageProps> = ({
  watch,
  watches,
  config,
  onSelectWatch,
  onBack,
}) => {
  return (
    <WristTryOnScene
      watch={watch}
      watches={watches}
      strapColorHex={config.strapColor}
      dialColorHex={config.dialColor}
      onSelectWatch={onSelectWatch}
      onBack={onBack}
    />
  );
};
