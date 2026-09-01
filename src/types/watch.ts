export type WatchCategory = 'Smart' | 'Sport' | 'Luxury' | 'Digital';

export interface WatchColorOption {
  name: string;
  hex: string;
  materialType?: 'silicone' | 'leather' | 'steel' | 'titanium' | 'gold';
  roughness?: number;
  metalness?: number;
}

export interface WatchSpecs {
  caseDiameter: string;
  caseThickness: string;
  waterResistance: string;
  batteryLifeOrMovement: string;
  glassMaterial: string;
  caseMaterial: string;
  weight: string;
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
  strapColors: WatchColorOption[];
  dialColors: WatchColorOption[];
  strapMeshNames: string[];
  dialMeshNames: string[];
  glassMeshNames: string[];
  defaultScale: number;
  webARScale: number;
  markerScale: string; // e.g. "0.08 0.08 0.08"
  markerRotation?: string;
  wristScaleFactor: number;
  wristRotationOffset: [number, number, number];
}

export type ConfiguratorStep = 'select' | 'place' | 'customize' | 'manipulate' | 'complete';

export interface WatchConfiguration {
  watchId: string;
  strapColor: string;
  strapMaterial: string;
  dialColor: string;
  scale: number;
  rotationY: number;
  elevation: number;
  isPlaced: boolean;
}

export type TrackingState = 'searching' | 'detected' | 'lost' | 'calibrating' | 'unsupported';

export type DepthStatusType =
  | 'checking'
  | 'depth-gpu-active'
  | 'depth-cpu-active'
  | 'depth-unavailable'
  | 'ar-unsupported';

export interface TestMatrixItem {
  id: string;
  category: 'Mandatory 3D' | 'Marker AR' | 'Markerless WebXR' | 'Option B Interaction' | 'Showcase Wrist AR' | 'System & UX';
  feature: string;
  expectedResult: string;
  status: 'Pass' | 'Pass (with fallback)' | 'In Progress';
  notes: string;
}
