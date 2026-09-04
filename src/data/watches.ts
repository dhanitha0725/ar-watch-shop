import { Watch } from '../types/watch';

export const WATCHES: Watch[] = [
  {
    id: 'apple-watch-ultra',
    name: 'Apple Watch Ultra 2',
    tagline: 'Titanium precision for extreme endurance & exploration.',
    brand: 'Apple',
    category: 'Smart',
    price: 799,
    modelUrl: '/models/apple-watch-ultra.glb',
    description: 'Engineered for athletes, outdoor adventurers, and deep ocean explorers. Featuring a 49mm aerospace-grade titanium case, precision dual-frequency GPS, and an ultra-bright Always-On Retina display.',
    features: [
      '49mm Aerospace Titanium Case with raised bezel edges',
      'Up to 3,000 nits peak brightness display',
      'Dual-frequency high precision GPS (L1 and L5)',
      '100m water resistance with Depth gauge and water temperature sensor',
      'Action Button for instant workout and compass markups'
    ],
    specs: {
      caseDiameter: '49 mm',
      caseThickness: '14.4 mm',
      waterResistance: '100 meters (EN13319)',
      batteryLifeOrMovement: 'Up to 36 hours (72h Low Power)',
      glassMaterial: 'Sapphire Crystal Glass',
      caseMaterial: 'Aerospace-Grade Grade 5 Titanium',
      weight: '61.4 grams'
    },
    defaultScale: 1.0,
    webARScale: 1.5748,
    markerScale: '9.1813 9.1813 9.1813',
    markerRotation: '0 0 0',
    attribution: {
      originalModelName: 'Apple Watch Ultra 2', creator: 'polyman Studio',
      licenseName: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/'
    }
  },
  {
    id: 'chronograph-mudmaster',
    name: 'G-Shock Mudmaster Chronograph',
    tagline: 'Triple sensor tactical mastery built for brutal conditions.',
    brand: 'Casio',
    category: 'Sport',
    price: 380,
    modelUrl: '/models/chronograph-mudmaster.glb',
    description: 'Designed to withstand the harshest land environments. Sealed with mud-resist gasket buttons, solar atomic timekeeping, digital compass, altimeter/barometer, and temperature tracking.',
    features: [
      'Mud & Dust Resist Structure with cylindrical button pipes',
      'Tough Solar charging & Multi-Band 6 Atomic Clock sync',
      'Quad Sensor: Compass, Altimeter, Barometer, Thermometer',
      'Super Illuminator High-brightness Double LED backlight',
      'Carbon Core Guard forged composite chassis'
    ],
    specs: {
      caseDiameter: '54.4 mm',
      caseThickness: '16.1 mm',
      waterResistance: '200 meters (20 Bar)',
      batteryLifeOrMovement: 'Tough Solar (Continuous)',
      glassMaterial: 'Anti-Reflective Sapphire Crystal',
      caseMaterial: 'Carbon Fiber Reinforced Resin & Steel',
      weight: '106 grams'
    },
    defaultScale: 0.08,
    webARScale: 0.0159,
    markerScale: '0.0926 0.0926 0.0926',
    markerRotation: '0 0 0',
    attribution: {
      originalModelName: 'Chronograph Watch Mudmaster', creator: 'graphiccompressor',
      licenseName: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/'
    }
  },
  {
    id: 'digital-cyber',
    name: 'Cyber Horizon Digital Matrix',
    tagline: 'Futuristic OLED luminescent timepiece with modular bands.',
    brand: 'Horizon Labs',
    category: 'Digital',
    price: 245,
    modelUrl: '/models/digital-watch.glb',
    description: 'A cutting-edge cyberpunk aesthetic with curved digital display, programmable glowing neon glyphs, ambient luminescence, and toolless quick-release ergonomic straps.',
    features: [
      'Curved High-Luminance Cyber OLED Panel',
      'Dual-layer Neon Emission Dial with real-time reactive glow',
      'Ergonomic ribbed polymer flex-band with titanium clasp',
      'Programmable dual timezone with UTC matrix readout',
      'Haptic feedback touch crown'
    ],
    specs: {
      caseDiameter: '42 mm',
      caseThickness: '11.2 mm',
      waterResistance: '50 meters (5 ATM)',
      batteryLifeOrMovement: 'Rechargeable Li-Ion (14 Days)',
      glassMaterial: 'Gorilla Glass DX+',
      caseMaterial: 'Anodized 6000 Series Aluminum',
      weight: '48.5 grams'
    },
    defaultScale: 1.0,
    webARScale: 0.0095,
    markerScale: '0.0551 0.0551 0.0551',
    markerRotation: '0 0 0',
    attribution: {
      originalModelName: 'Digital Watch', creator: 'SpatialNeglect',
      licenseName: 'CC BY-NC 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/'
    }
  },
  {
    id: 'seiko-classic',
    name: 'Seiko Premier Automatic Dress',
    tagline: 'Timeless Japanese horological craftsmanship & guilloché elegance.',
    brand: 'Seiko',
    category: 'Luxury',
    price: 520,
    modelUrl: '/models/seiko-classic.glb',
    description: 'An exemplary dress timepiece celebrating Japanese mechanical tradition. Boasting a polished 316L stainless steel case, open-heart dial, blued cathedral hands, and an exhibition caseback revealing the 24-jewel automatic movement.',
    features: [
      'Calibre 4R39 Automatic Movement with 41-hour power reserve',
      'Exhibition open-heart balance wheel aperture at 9 o’clock',
      'Sunburst guilloché dial with applied Roman numerals',
      'See-through exhibition sapphire case back',
      'Five-row Jubilee polished steel bracelet with deployant clasp'
    ],
    specs: {
      caseDiameter: '41.8 mm',
      caseThickness: '12.5 mm',
      waterResistance: '100 meters (10 Bar)',
      batteryLifeOrMovement: 'Mechanical Automatic 21,600 vph',
      glassMaterial: 'Dual-Curved Sapphire with Inner AR Coating',
      caseMaterial: 'Surgically Polished 316L Stainless Steel',
      weight: '142 grams'
    },
    defaultScale: 1.0,
    webARScale: 1.1131,
    markerScale: '6.4927 6.4927 6.4927',
    markerRotation: '0 0 0',
    attribution: {
      originalModelName: 'Seiko Watch', creator: 'carloshisserich',
      licenseName: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/'
    }
  }
];

