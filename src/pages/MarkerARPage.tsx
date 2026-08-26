import React from 'react';
import { Watch } from '../types/watch';
import { MarkerARScene } from '../components/ar/MarkerARScene';

interface MarkerARPageProps {
  watch: Watch;
  watches: Watch[];
  onSelectWatch: (watch: Watch) => void;
  onBack: () => void;
  onOpenMarkerModal: () => void;
}

export const MarkerARPage: React.FC<MarkerARPageProps> = ({
  watch,
  watches,
  onSelectWatch,
  onBack,
  onOpenMarkerModal,
}) => {
  return (
    <MarkerARScene
      watch={watch}
      watches={watches}
      onSelectWatch={onSelectWatch}
      onBack={onBack}
      onOpenMarkerModal={onOpenMarkerModal}
    />
  );
};
