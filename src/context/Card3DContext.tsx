import React, { createContext, useContext, useState } from 'react';

export type Card3DStyleId = 'v1-obsidian' | 'v2-gold-chamfer' | 'v3-spatial-crystal';
export type ScrollModeId = 'scroll-v1-glide' | 'scroll-v2-coverflow' | 'scroll-v3-deck';

export interface Card3DStyleMeta {
  id: Card3DStyleId;
  versionNumber: string;
  name: string;
  nameDe: string;
  tagline: string;
  taglineDe: string;
  badge: string;
  badgeDe: string;
  description: string;
  descriptionDe: string;
  highlights: string[];
  highlightsDe: string[];
  accentColor: string;
  borderColor: string;
}

export interface ScrollModeMeta {
  id: ScrollModeId;
  versionNumber: string;
  name: string;
  nameDe: string;
  tagline: string;
  taglineDe: string;
  badge: string;
  badgeDe: string;
}

export const SCROLL_MODES: ScrollModeMeta[] = [
  {
    id: 'scroll-v1-glide',
    versionNumber: 'Scroll V1',
    name: 'Silky Horizontal Glide',
    nameDe: 'Sanftes Horizontal-Gleiten',
    tagline: 'Elastic spring slide with subtle depth scale',
    taglineDe: 'Elastischer Gleit-Übergang mit Tiefenskalierung',
    badge: 'Classic Glide',
    badgeDe: 'Klassik-Gleiten',
  },
  {
    id: 'scroll-v2-coverflow',
    versionNumber: 'Scroll V2',
    name: '3D Carousel Turn',
    nameDe: '3D-Karussell-Drehung',
    tagline: 'Spatial Y-axis rotation & Z-depth perspective',
    taglineDe: 'Räumliche Y-Achsen-Drehung mit Z-Tiefe',
    badge: '3D Turn',
    badgeDe: '3D-Drehung',
  },
  {
    id: 'scroll-v3-deck',
    versionNumber: 'Scroll V3',
    name: 'Stacked Atelier Deck',
    nameDe: 'Gestapeltes Atelier-Deck',
    tagline: 'Overlapping Z-layered tactile card stack',
    taglineDe: 'Überlappender Z-Ebenen-Kartenstapel',
    badge: 'Stacked Deck',
    badgeDe: 'Kartenstapel',
  }
];

export const CARD_3D_STYLES: Card3DStyleMeta[] = [
  {
    id: 'v1-obsidian',
    versionNumber: 'Version 1',
    name: 'Obsidian Prism 3D',
    nameDe: 'Obsidian-Prisma 3D',
    tagline: 'Deep Volumetric Spatial Depth',
    taglineDe: 'Tiefe Volumetrische Raumwirkung',
    badge: 'Volumetric Depth',
    badgeDe: 'Volumetrische Tiefe',
    description: 'Deep obsidian monolithic tablet with true multi-layer Z-space perspective. Elements physically float above the surface with dynamic cursor-tracking specular glare and soft ambient occlusion.',
    descriptionDe: 'Monolithische Obsidian-Tafel mit echter Z-Ebenen-Tiefenstaffelung. Typografie und Medaillons schweben greifbar über der Oberfläche mit dynamischem Glanzlicht.',
    highlights: [
      'Multi-plane Z-axis floating layers (translateZ depth)',
      'Dynamic cursor & touch tilt tracking with perspective',
      'Realistic gold specular glare that glides across the slab',
      'Deep multi-stage ambient drop shadows (35px depth)'
    ],
    highlightsDe: [
      'Mehrschichtige Z-Achsen-Schwebeebenen (translateZ)',
      'Dynamische 3D-Neigung bei Cursor- und Touch-Bewegung',
      'Reales goldenes Glanzlicht, das über die Oberfläche wandert',
      'Tiefe mehrstufige Raumschatten (35px Tiefe)'
    ],
    accentColor: '#c49750',
    borderColor: 'rgba(196, 151, 80, 0.4)'
  },
  {
    id: 'v2-gold-chamfer',
    versionNumber: 'Version 2',
    name: 'Architectural Gold Chamfer',
    nameDe: 'Architektonische Goldfase',
    tagline: 'Tactile Physical Atelier Relief',
    taglineDe: 'Haptisches Atelier-Relief',
    badge: 'Precision Chamfer',
    badgeDe: 'Präzisions-Fase',
    description: 'Inspired by luxury Swiss horology and Steinway cast-iron frames: dark brushed metal featuring precision chamfered/beveled gold edges, embossed medallion plates, and tactile physical weight.',
    descriptionDe: 'Inspiriert von Schweizer Uhrmacherkunst und Steinway-Gussrahmen: dunkel gebürstetes Metall mit präzise geschliffenen Goldkanten und erhabenem Medaillon.',
    highlights: [
      'Precision chamfered/beveled warm gold perimeter relief',
      'Embossed metallic header plate with brushed gold gradient',
      'Solid tactile slab presence with physical 3D thickness',
      'Tactile compression and weighted response on interaction'
    ],
    highlightsDe: [
      'Präzise gefaste warme Goldkanten im Relief-Schliff',
      'Geprägte Metall-Plakette mit gebürstetem Goldverlauf',
      'Spürbare physische Platten-Präsenz mit 3D-Volumen',
      'Haptisches Absenken bei Klick und Berührung'
    ],
    accentColor: '#e5c17d',
    borderColor: 'rgba(229, 193, 125, 0.55)'
  },
  {
    id: 'v3-spatial-crystal',
    versionNumber: 'Version 3',
    name: 'Spatial Frosted Crystal',
    nameDe: 'Räumliches Milchglas',
    tagline: 'Floating Acoustic Resonance Chamber',
    taglineDe: 'Schwebende Akustik-Resonanzkammer',
    badge: 'Acoustic Glass',
    badgeDe: 'Akustisches Glas',
    description: 'Modern spatial computing aesthetic reminiscent of curved studio acoustic crystals. Semi-translucent smoked glass with chromatic prism edge refraction and an internal glowing resonance aura.',
    descriptionDe: 'Moderne räumliche Glas-Ästhetik inspiriert von Studio-Akustikkristallen. Getöntes Milchglas mit chromatischer Lichtbrechung und innerer goldener Resonanz-Aura.',
    highlights: [
      'High-refraction frosted smoked crystal (backdrop-blur)',
      'Subtle chromatic prism borders catching directional light',
      'Warm internal harmonic glow simulating acoustic chamber resonance',
      'Weightless spatial levitation with soft diffused elevation'
    ],
    highlightsDe: [
      'Hochbrechendes getöntes Milchglas (Backdrop-Blur)',
      'Feine chromatische Prismakanten mit Lichtreflexion',
      'Warme innere Resonanz-Aura wie ein akustischer Hohlraum',
      'Schwerelose Raum-Levitation mit weicher Schattentiefe'
    ],
    accentColor: '#38bdf8',
    borderColor: 'rgba(255, 255, 255, 0.2)'
  }
];

interface Card3DContextType {
  activeStyle: Card3DStyleId;
  setActiveStyle: (style: Card3DStyleId) => void;
  scrollMode: ScrollModeId;
  setScrollMode: (mode: ScrollModeId) => void;
  tiltEnabled: boolean;
  setTiltEnabled: (enabled: boolean) => void;
  ambientMotion: boolean;
  setAmbientMotion: (motion: boolean) => void;
  currentStyleMeta: Card3DStyleMeta;
  currentScrollMeta: ScrollModeMeta;
}

const Card3DContext = createContext<Card3DContextType | undefined>(undefined);

export const Card3DProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStyle, setActiveStyle] = useState<Card3DStyleId>('v1-obsidian');
  const [scrollMode, setScrollMode] = useState<ScrollModeId>('scroll-v1-glide');
  const [tiltEnabled, setTiltEnabled] = useState<boolean>(false);
  const [ambientMotion, setAmbientMotion] = useState<boolean>(false);

  const currentStyleMeta = CARD_3D_STYLES.find(s => s.id === activeStyle) || CARD_3D_STYLES[0];
  const currentScrollMeta = SCROLL_MODES.find(m => m.id === scrollMode) || SCROLL_MODES[0];

  return (
    <Card3DContext.Provider
      value={{
        activeStyle,
        setActiveStyle,
        scrollMode,
        setScrollMode,
        tiltEnabled,
        setTiltEnabled,
        ambientMotion,
        setAmbientMotion,
        currentStyleMeta,
        currentScrollMeta
      }}
    >
      {children}
    </Card3DContext.Provider>
  );
};

export const useCard3D = (): Card3DContextType => {
  const context = useContext(Card3DContext);
  if (!context) {
    throw new Error('useCard3D must be used within a Card3DProvider');
  }
  return context;
};
