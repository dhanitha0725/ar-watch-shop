export type WatchCategory = 'Smart' | 'Sport' | 'Luxury' | 'Digital';

export interface WatchSpecs {
  caseDiameter: string;
  caseThickness: string;
  waterResistance: string;
  batteryLifeOrMovement: string;
  glassMaterial: string;
  caseMaterial: string;
  weight: string;
}

export interface ModelAttribution {
  originalModelName: string;
  creator: string;
  licenseName: string;
  licenseUrl: string;
}

export interface Watch {
  id: string;
  name: string;
  tagline: string;
  brand: string;
  category: WatchCategory;
  price: number;
  modelUrl: string;
  posterUrl?: string;
  description: string;
  features: string[];
  specs: WatchSpecs;
  defaultScale: number;
  webARScale: number;
  markerScale: string; // e.g. "0.08 0.08 0.08"
  markerRotation?: string;
  attribution?: ModelAttribution;
}

export type ConfiguratorStep = 'select' | 'place' | 'customize' | 'manipulate' | 'complete';

export interface WatchConfiguration {
  watchId: string;
  scale: number;
  rotationY: number;
  elevation: number;
  isPlaced: boolean;
}

export type TrackingState = 'searching' | 'detected' | 'lost' | 'calibrating' | 'unsupported';

