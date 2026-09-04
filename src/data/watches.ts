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
    strapColors: [
      { name: 'Alpine Orange', hex: '#ea580c', materialType: 'silicone', roughness: 0.6, metalness: 0.05 },
      { name: 'Ocean Midnight', hex: '#0f172a', materialType: 'silicone', roughness: 0.5, metalness: 0.1 },
      { name: 'Trail Olive', hex: '#4d7c0f', materialType: 'silicone', roughness: 0.7, metalness: 0.05 },
      { name: 'Titanium Gray', hex: '#71717a', materialType: 'titanium', roughness: 0.35, metalness: 0.85 },
      { name: 'Solar Yellow', hex: '#eab308', materialType: 'silicone', roughness: 0.55, metalness: 0.05 }
    ],
    dialColors: [
      { name: 'Night Waypoint (Red)', hex: '#dc2626', roughness: 0.2, metalness: 0.1 },
      { name: 'Ultra Daylight (White/Cyan)', hex: '#06b6d4', roughness: 0.1, metalness: 0.2 },
      { name: 'Stealth Tactical (Dark)', hex: '#18181b', roughness: 0.3, metalness: 0.1 },
      { name: 'Amber Glow', hex: '#f59e0b', roughness: 0.2, metalness: 0.3 }
    ],
    strapMeshNames: ['bXoKVYbQhcORrRo', 'LMTUXYhSYYJrnsy_0', 'LMTUXYhSYYJrnsy', 'niuesVpLyOylhzG', 'dAobUVRiwHRHUwW', 'AXTiAWNANGWNPZh', 'pYoTjWyHwknCsXs', 'GYKIDhUtSmfksAh', 'tZSTMNOYIPNFEiO'],
    dialMeshNames: ['VHnHbLOyhEXLvWA', 'DCiPNWQGULbWNNE', 'joGEgikMuDmcVlT', 'ytGVVkppetlPrjk'],
    glassMeshNames: ['EZmdWXCjqrUDeoX'],
    defaultScale: 1.0,
    webARScale: 1.5748,
    markerScale: '9.1813 9.1813 9.1813',
    markerRotation: '0 0 0'
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
    strapColors: [
      { name: 'Tactical Matte Black', hex: '#18181b', materialType: 'silicone', roughness: 0.8, metalness: 0.05 },
      { name: 'Desert Sand Brown', hex: '#92400e', materialType: 'silicone', roughness: 0.75, metalness: 0.05 },
      { name: 'Military Olive Green', hex: '#3f6212', materialType: 'silicone', roughness: 0.8, metalness: 0.05 },
      { name: 'Emergency Rescue Orange', hex: '#ea580c', materialType: 'silicone', roughness: 0.7, metalness: 0.05 },
      { name: 'Stealth Navy', hex: '#1e293b', materialType: 'silicone', roughness: 0.75, metalness: 0.1 }
    ],
    dialColors: [
      { name: 'High-Contrast White & Gold', hex: '#fef08a', roughness: 0.3, metalness: 0.6 },
      { name: 'Stealth Blackout', hex: '#27272a', roughness: 0.4, metalness: 0.2 },
      { name: 'Rally Red Accent', hex: '#ef4444', roughness: 0.3, metalness: 0.4 },
      { name: 'Arctic Ice Glow', hex: '#38bdf8', roughness: 0.2, metalness: 0.3 }
    ],
    strapMeshNames: ['belt_1_BLACK_PLASTIC_BUMP_0', 'belt_1_BLACK_EMAL_SMOOSH_0', 'belt_2_BLACK_PLASTIC_BUMP_0', 'belt_2_BLACK_EMAL_SMOOSH_0', 'MUDMUSTER_BELT_1_glowing-plastick.001_0', 'MUDMUSTER_BELT_2_glowing-plastick.001_0'],
    dialMeshNames: ['N6_JewelryGlossyGold.001_0', 'N9_3_JewelryGlossyGold.001_0', 'N12_JewelryGlossyGold.001_0', 'numbers_base_frame.001_BLACK_EMAL._SMOOSH_SS.001_0', 'A_PLASTIC_RED_1.001_0', 'MUDMUSTER_RED_PLASTIC_RED_1.001_0'],
    glassMeshNames: ['Main_glass.001_GLASS.001_0', 'WINDOW_GLASS_top.001_GLASS.001_0'],
    defaultScale: 0.08,
    webARScale: 0.0159,
    markerScale: '0.0926 0.0926 0.0926',
    markerRotation: '0 0 0'
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
    strapColors: [
      { name: 'Neon Cyber Blue', hex: '#0284c7', materialType: 'silicone', roughness: 0.4, metalness: 0.1 },
      { name: 'Obsidian Matte Black', hex: '#18181b', materialType: 'silicone', roughness: 0.6, metalness: 0.05 },
      { name: 'Cyberpunk Hot Pink', hex: '#db2777', materialType: 'silicone', roughness: 0.35, metalness: 0.15 },
      { name: 'Acid Neon Green', hex: '#65a30d', materialType: 'silicone', roughness: 0.4, metalness: 0.1 },
      { name: 'Snow White Glaze', hex: '#f8fafc', materialType: 'silicone', roughness: 0.3, metalness: 0.2 }
    ],
    dialColors: [
      { name: 'Matrix Cyan Glow', hex: '#00f0ff', roughness: 0.1, metalness: 0.1 },
      { name: 'Amber Neon Beam', hex: '#ff9900', roughness: 0.1, metalness: 0.1 },
      { name: 'Violet Pulse', hex: '#a855f7', roughness: 0.1, metalness: 0.1 },
      { name: 'Laser Lime', hex: '#84cc16', roughness: 0.1, metalness: 0.1 }
    ],
    strapMeshNames: ['strap_0'],
    dialMeshNames: ['screen_0', 'screen.001_0'],
    glassMeshNames: ['watch_0'],
    defaultScale: 1.0,
    webARScale: 0.0095,
    markerScale: '0.0551 0.0551 0.0551',
    markerRotation: '0 0 0'
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
    strapColors: [
      { name: 'Polished Steel Silver', hex: '#d4d4d8', materialType: 'steel', roughness: 0.15, metalness: 0.95 },
      { name: 'Rose Gold Plated', hex: '#e0a98b', materialType: 'gold', roughness: 0.2, metalness: 0.9 },
      { name: 'Rich Cognac Leather', hex: '#78350f', materialType: 'leather', roughness: 0.7, metalness: 0.05 },
      { name: 'Dark Oxford Blue', hex: '#1e3a5f', materialType: 'leather', roughness: 0.65, metalness: 0.05 },
      { name: 'Midnight Onyx Black', hex: '#1c1917', materialType: 'leather', roughness: 0.75, metalness: 0.05 }
    ],
    dialColors: [
      { name: 'Classic Silver Sunburst', hex: '#f4f4f5', roughness: 0.2, metalness: 0.8 },
      { name: 'Royal Midnight Blue', hex: '#1e40af', roughness: 0.25, metalness: 0.7 },
      { name: 'Emerald Forest Green', hex: '#065f46', roughness: 0.3, metalness: 0.65 },
      { name: 'Champagne Gold Sunray', hex: '#fef08a', roughness: 0.2, metalness: 0.85 }
    ],
    strapMeshNames: ['defaultMaterial'],
    dialMeshNames: ['defaultMaterial'],
    glassMeshNames: ['defaultMaterial'],
    defaultScale: 1.0,
    webARScale: 1.1131,
    markerScale: '6.4927 6.4927 6.4927',
    markerRotation: '0 0 0'
  }
];

