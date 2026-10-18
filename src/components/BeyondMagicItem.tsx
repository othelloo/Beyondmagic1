import React from 'react';
import {
  generateCircleAvatarSvg,
  generateStandaloneSvg,
  LogoCalibrationConfig,
} from '../utils/svgVectorGenerator';

export interface BeyondMagicItemProps {
  className?: string;
  style?: React.CSSProperties;

  // Framing Ring
  withCircle?: boolean; // default false
  circleTheme?: 'gold' | 'white'; // default 'gold'
  circleColor?: string;
  circleRadius?: number; // default 360
  circleStrokeWidth?: number; // default 2.5
  ringSize?: number; // width/height in px when circular, default 175

  // Compound position in circle space
  globalX?: number; // default 14
  globalY?: number; // default -47
  globalScale?: number; // default 125

  // Left word: B E Y
  beyText?: string; // default "B E Y"
  beyFontSize?: number; // default 59
  beyX?: number; // default 0
  beyY?: number; // default -16
  beyTracking?: number; // default 8
  beyColor?: string; // default "#ffffff"

  // Right word: N D ("actually it'S not ond but nd.")
  ndText?: string; // default "N D"
  ndFontSize?: number; // default 59
  ndX?: number; // default 6
  ndY?: number; // default -16
  ndTracking?: number; // default 8
  ndColor?: string; // default "#ffffff"

  // The Golden Key (G-Clef)
  clefScale?: number; // default 126
  clefX?: number; // default -4
  clefY?: number; // default -35
  clefColor?: 'white' | 'gold'; // default 'gold'

  // MAGIC configuration: "magic is without G because the lower part of the G key is the G"
  showMagic?: boolean; // default true
  magicMode?: 'split' | 'full'; // default 'split'
  magicLeftText?: string; // default "M A"
  magicRightText?: string; // default "I C"
  magicText?: string; // default "M A G I C"
  magicFont?: 'cormorant' | 'didot' | 'geometric' | 'cinzel'; // default 'cinzel'
  magicFontSize?: number; // default 80
  magicColor?: string; // default "#dc2626"
  magicX?: number; // default 0
  magicY?: number; // default -24
  magicLeftX?: number; // default -37
  magicRightX?: number; // default 0
  magicTracking?: number; // default 8

  // Optional Name (false by default: item means Bey, ond/nd, ma-ic, and G key and that's it)
  showName?: boolean; // default false
  nameTopText?: string; // default "A B D E L L A H"
  nameBottomText?: string; // default "L A S R I"
  nameX?: number; // default 0
  nameY?: number; // default 0
  nameFontSize?: number; // default 13
  nameLineGap?: number; // default 8
  nameTracking?: number; // default 8
  nameFont?: 'cormorant' | 'didot' | 'geometric' | 'cinzel'; // default 'cormorant'
  nameColor?: string; // default '#dedacf'
  useMetallic3D?: boolean; // default false per user instruction ("For now, put the logo without the metallic effect in the menu, landing page and down there")
  centered?: boolean; // default true - centers standalone artwork
  logoX?: number; // horizontal offset in standalone space
  logoY?: number; // vertical offset in standalone space (adjusts height when vertically too high)
  vertOffset?: number; // alias for logoY
  with3DFrame?: boolean; // renders sophisticated 3D golden metallic border frame directly on the logo
  frameStyle?: 'beveled' | 'cartouche' | 'fillet'; // style of 3D frame
}

/**
 * BeyondMagicItem
 * 
 * Authentic, pure vector SVG implementation of the Beyond Magic signature brand item:
 * - Centered Golden Key (G-Clef) in royal metallic gold gradient
 * - Upper row: "B E Y" and "N D" in Cormorant Garamond serif
 * - Lower row: "M A" and "I C" flanking the lower loop of the Golden Key (#dc2626 opera red, Cinzel)
 *   --> "magic is without G because the lower part of the G key is the G"
 * - Framed in metallic golden circular ring (when withCircle=true) or standalone (withCircle=false)
 * - Item means: Bey, ond/nd, ma-ic, and G key, and that's it!
 */
export const BeyondMagicItem: React.FC<BeyondMagicItemProps> = ({
  className = '',
  style = {},
  withCircle = false,
  circleTheme = 'gold',
  circleColor,
  circleRadius = 360,
  circleStrokeWidth = 2.5,
  ringSize = 175,
  globalX = 14,
  globalY = -47,
  globalScale = 125,
  beyText = 'B E Y',
  beyFontSize,
  beyX,
  beyY,
  beyTracking = 8,
  beyColor,
  ndText = 'N D',
  ndFontSize,
  ndX,
  ndY,
  ndTracking = 8,
  ndColor,
  clefScale,
  clefX,
  clefY,
  clefColor = 'gold',
  showMagic = true,
  magicMode = 'split',
  magicLeftText = 'M A',
  magicRightText = 'I C',
  magicText = 'M A G I C',
  magicFont = 'cinzel',
  magicFontSize,
  magicColor,
  magicX,
  magicY,
  magicLeftX,
  magicRightX,
  magicTracking = 8,
  showName = false,
  nameTopText = 'A B D E L L A H',
  nameBottomText = 'L A S R I',
  nameX = 0,
  nameY = 0,
  nameFontSize = 13,
  nameLineGap = 8,
  nameTracking = 8,
  nameFont = 'cormorant',
  nameColor = '#dedacf',
  useMetallic3D = false,
  centered = true,
  logoX,
  logoY,
  vertOffset,
  with3DFrame = false,
  frameStyle = 'beveled',
}) => {
  const config: LogoCalibrationConfig = {
    beyText,
    beyFontSize,
    beyX,
    beyY,
    beyTracking,
    beyColor,
    ndText,
    ndFontSize,
    ndX,
    ndY,
    ndTracking,
    ndColor,
    clefScale,
    clefX,
    clefY,
    clefColor,
    showMagic,
    magicMode,
    magicLeftText,
    magicRightText,
    magicText,
    magicFont,
    magicFontSize,
    magicColor,
    magicX,
    magicY,
    magicLeftX,
    magicRightX,
    magicTracking,
    showName,
    nameTopText,
    nameBottomText,
    nameX,
    nameY,
    nameFontSize,
    nameLineGap,
    nameTracking,
    nameFont,
    nameColor,
    globalScale,
    globalX,
    globalY,
    circleTheme,
    circleColor,
    circleRadius,
    circleStrokeWidth,
    useMetallic3D,
    centered,
    logoX,
    logoY,
    vertOffset,
    with3DFrame,
    frameStyle,
    svgWidth: '100%',
    svgHeight: '100%',
  };

  const svgMarkup = withCircle
    ? generateCircleAvatarSvg(config)
    : generateStandaloneSvg(config);

  return (
    <div
      className={`inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{
        width: withCircle && ringSize ? `${ringSize}px` : undefined,
        height: withCircle && ringSize ? `${ringSize}px` : undefined,
        aspectRatio: withCircle ? '1 / 1' : '560 / 240',
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
      aria-label="Beyond Magic Logo"
    />
  );
};
