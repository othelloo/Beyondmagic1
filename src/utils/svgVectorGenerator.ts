import glyphData from './glyphData.json';

interface GlyphEntry {
  d: string;
  advance: number;
}

interface GlyphDataRecord {
  cinzel: Record<string, GlyphEntry>;
  cormorant: Record<string, GlyphEntry>;
  didot?: Record<string, GlyphEntry>;
  geometric?: Record<string, GlyphEntry>;
}

const data = glyphData as unknown as GlyphDataRecord;

export interface RenderTextOptions {
  fontName: 'cormorant' | 'didot' | 'geometric' | 'cinzel';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  tracking?: number;
  anchor?: 'start' | 'middle' | 'end';
  fill?: string;
}

/**
 * Converts a text string into pure SVG <path> elements with accurate font geometry.
 * Completely immune to font loading issues, local font overrides, and external viewer bugs.
 */
export function renderTextToPaths({
  fontName,
  text,
  x,
  y,
  fontSize,
  tracking = 0,
  anchor = 'start',
  fill = '#ffffff',
}: RenderTextOptions): { pathsXml: string; totalWidth: number; startX: number } {
  const font = data[fontName] || data.cormorant;
  const scale = fontSize / 100;

  // Calculate total width first
  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i].toUpperCase();
    if (ch === ' ') {
      totalWidth += fontSize * 0.32 + tracking;
    } else if (font && font[ch]) {
      totalWidth += font[ch].advance * scale + tracking;
    }
  }
  if (text.length > 0) totalWidth -= tracking;

  let startX = x;
  if (anchor === 'end') startX = x - totalWidth;
  else if (anchor === 'middle') startX = x - totalWidth / 2;

  let curX = startX;
  const paths: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i].toUpperCase();
    if (ch === ' ') {
      curX += fontSize * 0.32 + tracking;
    } else if (font && font[ch]) {
      paths.push(
        `    <path fill="${fill}" transform="translate(${curX.toFixed(2)}, ${y.toFixed(2)}) scale(${scale.toFixed(4)})" d="${font[ch].d}" />`
      );
      curX += font[ch].advance * scale + tracking;
    }
  }

  return { pathsXml: paths.join('\n'), totalWidth, startX };
}

export interface LogoCalibrationConfig {
  // Left word (BEY)
  beyText?: string; // default "B E Y"
  beyFontSize?: number; // default 54
  beyX?: number; // horizontal offset from anchor, default 0
  beyY?: number; // vertical offset from anchor, default 0
  beyTracking?: number; // tracking in px, default 8
  beyColor?: string; // default "#ffffff"

  // Right word: "actually it'S not ond but nd." -> default "N D"
  ndText?: string; // default "N D"
  ndFontSize?: number; // default 54
  ndX?: number; // horizontal offset from anchor, default 0
  ndY?: number; // vertical offset from anchor, default 0
  ndTracking?: number; // tracking in px, default 8
  ndColor?: string; // default "#ffffff"

  // Magic configuration: "magic is without G because the lower part of the G key is the G"
  showMagic?: boolean; // default true
  magicMode?: 'split' | 'full'; // default 'split'
  magicLeftText?: string; // default "M A"
  magicRightText?: string; // default "I C"
  magicFont?: 'cormorant' | 'didot' | 'geometric' | 'cinzel'; // default "cinzel" (authentic working logo mark)
  magicFontSize?: number; // default 80
  magicX?: number; // default 0
  magicY?: number; // vertical offset, default -24
  magicLeftX?: number; // offset for MA, default -37
  magicRightX?: number; // offset for IC, default 0
  magicTracking?: number; // default 8
  magicColor?: string; // default "#dc2626" (vibrant opera red)

  // Fallback single-line magic text
  magicText?: string; // default "M A G I C"

  // Name Configuration: "Add my name : Abdellah lasri, abdellah above lasri. and let me modify it position"
  showName?: boolean; // default false (item means Bey and ond and ma-ic and the G key and thats it)
  nameTopText?: string; // default "A B D E L L A H"
  nameBottomText?: string; // default "L A S R I"
  nameX?: number; // default 0
  nameY?: number; // default 0
  nameFontSize?: number; // default 14
  nameLineGap?: number; // default 8
  nameTracking?: number; // default 8
  nameFont?: 'cormorant' | 'didot' | 'geometric' | 'cinzel'; // default 'cormorant'
  nameColor?: string; // default '#dedacf'

  // G-Clef (The Golden Key)
  clefScale?: number; // default 82
  clefX?: number; // horizontal offset, default 0
  clefY?: number; // vertical offset, default 0
  clefColor?: 'white' | 'gold'; // default 'gold' (the authentic golden key)

  // Compound logo positioning inside circle
  globalScale?: number; // default 125
  globalX?: number; // horizontal offset in circle space, default 0 (unconstrained)
  globalY?: number; // vertical offset in circle space, default 0 (unconstrained)

  // Framing Circle (Metallic Golden Circle by default, thinner stroke)
  circleTheme?: 'white' | 'gold'; // default 'gold'
  circleColor?: string; // default '#d4af37'
  circleRadius?: number; // default 360
  circleStrokeWidth?: number; // default 2.5 (thinner, more refined)
  circleMetallicStyle?: 'royal' | 'mirror' | 'champagne' | 'antique'; // for gold mode
  showInnerRim?: boolean; // default false
  showGlow?: boolean; // default false
  bgColor?: string; // default '#0b0c0e'
  includeBackground?: boolean; // default true
  svgWidth?: string | number; // default "100%" or 800
  svgHeight?: string | number; // default "100%" or 800
  useMetallic3D?: boolean; // default true - enables 3D metallic light textures and specular bevel filter
  centered?: boolean; // default true - horizontally centers the standalone artwork inside the 560x240 frame (53.56px equal margins)
  logoX?: number; // horizontal offset in standalone space, default 0
  logoY?: number; // vertical offset in standalone space, default 0 (positive shifts down, negative shifts up)
  vertOffset?: number; // alias for logoY
  with3DFrame?: boolean; // renders an elegant 3D golden metallic border frame directly on the logo
  frameStyle?: 'beveled' | 'cartouche' | 'fillet'; // style of 3D frame

  // Legacy fallback fields
  beyondFontSize?: number;
  beyondY?: number;
  beyNudge?: number;
  ndNudge?: number;
  beyVertNudge?: number;
  ndVertNudge?: number;
}

export const G_CLEF_PATH =
  'm12.049 3.5296c0.305 3.1263-2.019 5.6563-4.0772 7.7014-0.9349 0.897-0.155 0.148-0.6437 0.594-0.1022-0.479-0.2986-1.731-0.2802-2.11 0.1304-2.6939 2.3198-6.5875 4.2381-8.0236 0.309 0.5767 0.563 0.6231 0.763 1.8382zm0.651 16.142c-1.232-0.906-2.85-1.144-4.3336-0.885-0.1913-1.255-0.3827-2.51-0.574-3.764 2.3506-2.329 4.9066-5.0322 5.0406-8.5394 0.059-2.232-0.276-4.6714-1.678-6.4836-1.7004 0.12823-2.8995 2.156-3.8019 3.4165-1.4889 2.6705-1.1414 5.9169-0.57 8.7965-0.8094 0.952-1.9296 1.743-2.7274 2.734-2.3561 2.308-4.4085 5.43-4.0046 8.878 0.18332 3.334 2.5894 6.434 5.8702 7.227 1.2457 0.315 2.5639 0.346 3.8241 0.099 0.2199 2.25 1.0266 4.629 0.0925 6.813-0.7007 1.598-2.7875 3.004-4.3325 2.192-0.5994-0.316-0.1137-0.051-0.478-0.252 1.0698-0.257 1.9996-1.036 2.26-1.565 0.8378-1.464-0.3998-3.639-2.1554-3.358-2.262 0.046-3.1904 3.14-1.7356 4.685 1.3468 1.52 3.833 1.312 5.4301 0.318 1.8125-1.18 2.0395-3.544 1.8325-5.562-0.07-0.678-0.403-2.67-0.444-3.387 0.697-0.249 0.209-0.059 1.193-0.449 2.66-1.053 4.357-4.259 3.594-7.122-0.318-1.469-1.044-2.914-2.302-3.792zm0.561 5.757c0.214 1.991-1.053 4.321-3.079 4.96-0.136-0.795-0.172-1.011-0.2626-1.475-0.4822-2.46-0.744-4.987-1.116-7.481 1.6246-0.168 3.4576 0.543 4.0226 2.184 0.244 0.577 0.343 1.197 0.435 1.812zm-5.1486 5.196c-2.5441 0.141-4.9995-1.595-5.6343-4.081-0.749-2.153-0.5283-4.63 0.8207-6.504 1.1151-1.702 2.6065-3.105 4.0286-4.543 0.183 1.127 0.366 2.254 0.549 3.382-2.9906 0.782-5.0046 4.725-3.215 7.451 0.5324 0.764 1.9765 2.223 2.7655 1.634-1.102-0.683-2.0033-1.859-1.8095-3.227-0.0821-1.282 1.3699-2.911 2.6513-3.198 0.4384 2.869 0.9413 6.073 1.3797 8.943-0.5054 0.1-1.0211 0.143-1.536 0.143z';

/**
 * Builds the G-Clef SVG markup with exact geometry, configurable color, and optional 3D filter.
 */
export function buildGClefMarkup(
  id: string,
  left: number,
  top: number,
  w: number,
  h: number,
  color: 'white' | 'gold' = 'white',
  filterId?: string
): string {
  const fillAttr = color === 'gold' ? `url(#${id})` : '#ffffff';
  const strokeAttr = color === 'gold' ? `url(#metallicGoldMirror)` : '#ffffff';
  const filterAttr = filterId ? ` filter="url(#${filterId})"` : '';

  return `  <!-- G-Clef Key (${color}) -->
  <g transform="translate(${left.toFixed(2)}, ${top.toFixed(2)}) scale(${(w / 16).toFixed(4)}, ${(h / 43).toFixed(4)}) translate(2, 1)"${filterAttr}>
    <g transform="scale(0.72, 1) translate(2.2, 0)">
      <path
        fill="${fillAttr}"
        stroke="${strokeAttr}"
        stroke-width="0.15"
        d="${G_CLEF_PATH}"
      />
    </g>
  </g>`;
}

/**
 * Common Metallic Gold Gradient and 3D Metallic Light Texture definitions for SVG
 */
export const METALLIC_GOLD_DEFS = `
    <!-- Royal Metallic Gold Gradient -->
    <linearGradient id="metallicGoldRoyal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fae082" />
      <stop offset="14%" stop-color="#d4af37" />
      <stop offset="28%" stop-color="#fff8db" />
      <stop offset="42%" stop-color="#aa771c" />
      <stop offset="58%" stop-color="#ffd56b" />
      <stop offset="72%" stop-color="#fdf497" />
      <stop offset="86%" stop-color="#b8860b" />
      <stop offset="100%" stop-color="#7a4f10" />
    </linearGradient>

    <!-- Mirror Polished Gold Gradient -->
    <linearGradient id="metallicGoldMirror" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e5c07b" />
      <stop offset="18%" stop-color="#ffffff" />
      <stop offset="38%" stop-color="#c59b27" />
      <stop offset="58%" stop-color="#fff0a0" />
      <stop offset="78%" stop-color="#8a5e12" />
      <stop offset="100%" stop-color="#e8c872" />
    </linearGradient>

    <!-- Clef Gold Gradient -->
    <linearGradient id="goldClefCommon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef3c7" />
      <stop offset="30%" stop-color="#f59e0b" />
      <stop offset="65%" stop-color="#c49750" />
      <stop offset="100%" stop-color="#784d15" />
    </linearGradient>

    <!-- 3D Specular Metallic Gold Gradient with Light Sheen -->
    <linearGradient id="metallicGoldLight3D" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#5a3806" />
      <stop offset="12%" stop-color="#9a6c17" />
      <stop offset="25%" stop-color="#d4af37" />
      <stop offset="38%" stop-color="#fff8db" />
      <stop offset="46%" stop-color="#ffffff" />
      <stop offset="54%" stop-color="#ffd56b" />
      <stop offset="68%" stop-color="#d4a024" />
      <stop offset="82%" stop-color="#fdf497" />
      <stop offset="92%" stop-color="#a87515" />
      <stop offset="100%" stop-color="#553003" />
    </linearGradient>

    <!-- 3D Specular Platinum Chrome Metallic (B E Y & N D) -->
    <linearGradient id="metallicSilverPlatinum3D" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#64748b" />
      <stop offset="15%" stop-color="#94a3b8" />
      <stop offset="28%" stop-color="#cbd5e1" />
      <stop offset="42%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#f8fafc" />
      <stop offset="60%" stop-color="#e2e8f0" />
      <stop offset="78%" stop-color="#ffffff" />
      <stop offset="90%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>

    <!-- 3D Specular Metallic Ruby Lacquer (M A & I C) -->
    <linearGradient id="metallicRubyOpera3D" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#650a0a" />
      <stop offset="14%" stop-color="#991b1b" />
      <stop offset="28%" stop-color="#dc2626" />
      <stop offset="40%" stop-color="#ff8888" />
      <stop offset="48%" stop-color="#ffffff" />
      <stop offset="56%" stop-color="#ef4444" />
      <stop offset="72%" stop-color="#b91c1c" />
      <stop offset="88%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#500707" />
    </linearGradient>

    <!-- Metallic Light 3D Specular & Bevel Texture Filter -->
    <filter id="metallicLight3DFilter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feDropShadow dx="1.5" dy="3.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.8" result="shadow" />
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blurMap" />
      <feSpecularLighting in="blurMap" surfaceScale="2.8" specularConstant="1.25" specularExponent="22" lighting-color="#ffffff" result="specularLight">
        <fePointLight x="180" y="-80" z="240" />
      </feSpecularLighting>
      <feComposite in="specularLight" in2="SourceAlpha" operator="in" result="specularCut" />
      <feComposite in="SourceGraphic" in2="shadow" operator="over" result="base" />
      <feBlend in="specularCut" in2="base" mode="screen" />
    </filter>`;

/**
 * Generates the Standalone Logo SVG (560 x 240)
 * Uses 100% Vector Path Outlines for complete permanent alignment across all SVG viewers.
 */
export function generateStandaloneSvg(cfg: LogoCalibrationConfig = {}): string {
  const useMetallic3D = cfg.useMetallic3D ?? false;
  const beyText = cfg.beyText ?? 'B E Y';
  const ndText = cfg.ndText ?? 'N D';
  const beyFontSize = cfg.beyFontSize ?? cfg.beyondFontSize ?? 45;
  const ndFontSize = cfg.ndFontSize ?? cfg.beyondFontSize ?? 45;
  const beyX = cfg.beyX ?? cfg.beyNudge ?? 0;
  const beyY = cfg.beyY ?? cfg.beyondY ?? cfg.beyVertNudge ?? 0;
  const ndX = cfg.ndX ?? cfg.ndNudge ?? 0;
  const ndY = cfg.ndY ?? cfg.beyondY ?? cfg.ndVertNudge ?? 0;
  const beyTracking = cfg.beyTracking ?? 8;
  const ndTracking = cfg.ndTracking ?? 8;

  const defaultBeyColor = useMetallic3D ? 'url(#metallicSilverPlatinum3D)' : '#ffffff';
  const defaultNdColor = useMetallic3D ? 'url(#metallicSilverPlatinum3D)' : '#ffffff';
  const defaultMagicColor = useMetallic3D ? 'url(#metallicRubyOpera3D)' : '#dc2626';
  const defaultClefGradient = useMetallic3D ? 'metallicGoldLight3D' : 'goldClefCommon';

  const beyColor = cfg.beyColor ?? defaultBeyColor;
  const ndColor = cfg.ndColor ?? defaultNdColor;

  const showMagic = cfg.showMagic ?? true;
  const magicMode = cfg.magicMode ?? 'split';
  const magicFont = cfg.magicFont ?? 'cinzel';
  const magicFontSize = cfg.magicFontSize ?? (magicMode === 'split' ? 81 : 22);
  const magicTracking = cfg.magicTracking ?? 8;
  const magicColor = cfg.magicColor ?? defaultMagicColor;
  const magicX = cfg.magicX ?? 0;
  const magicY = cfg.magicY ?? 0;
  const magicLeftX = cfg.magicLeftX ?? 0;
  const magicRightX = cfg.magicRightX ?? 0;

  const clefScale = cfg.clefScale ?? 110;
  const clefX = cfg.clefX ?? -4;
  const clefY = cfg.clefY ?? -35;
  const clefColor = cfg.clefColor ?? 'gold';

  const filterAttr = useMetallic3D ? ' filter="url(#metallicLight3DFilter)"' : '';

  const cx = 280;
  const cy = 112;

  const clefScaleFrac = clefScale / 100;
  const clefW = 88 * clefScaleFrac;
  const clefH = 236.5 * clefScaleFrac;
  const clefLeft = cx + clefX - clefW / 2;
  const clefTop = cy + clefY - clefH / 2;

  // Standalone calibrated anchors
  const beyAnchorX = 253 + beyX;
  const beyAnchorY = 5 + beyY;
  const ndAnchorX = 330 + ndX;
  const ndAnchorY = 5 + ndY;

  const isDefaultBey = beyText === 'B E Y' && beyFontSize === 45 && beyX === 0 && beyY === 0;
  const isDefaultNd = ndText === 'N D' && ndFontSize === 45 && ndX === 0 && ndY === 0;

  let beyXml = '';
  if (isDefaultBey) {
    beyXml = `  <!-- Left Word: B E Y (Vector Outlines) -->
  <g class="vector-bey" fill="${beyColor}"${filterAttr}>
    <path fill="${beyColor}" transform="translate(113.68, 5.00) scale(0.4500)" d="${(data.cormorant?.B || {}).d || ''}" />
    <path fill="${beyColor}" transform="translate(170.27, 5.00) scale(0.4500)" d="${(data.cormorant?.E || {}).d || ''}" />
    <path fill="${beyColor}" transform="translate(225.28, 5.00) scale(0.4500)" d="${(data.cormorant?.Y || {}).d || ''}" />
  </g>`;
  } else {
    const beyPaths = renderTextToPaths({
      fontName: 'cormorant',
      text: beyText,
      x: beyAnchorX,
      y: beyAnchorY,
      fontSize: beyFontSize,
      tracking: beyTracking,
      anchor: 'end',
      fill: beyColor,
    });
    beyXml = `  <!-- Left Word: ${beyText} (Vector Outlines) -->
  <g class="vector-bey" fill="${beyColor}"${filterAttr}>
${beyPaths.pathsXml}
  </g>`;
  }

  let ndXml = '';
  if (isDefaultNd) {
    ndXml = `  <!-- Right Word: N D (Vector Outlines) -->
  <g class="vector-yond" fill="${ndColor}"${filterAttr}>
    <path fill="${ndColor}" transform="translate(330.00, 5.00) scale(0.4500)" d="${(data.cormorant?.N || {}).d || ''}" />
    <path fill="${ndColor}" transform="translate(393.34, 5.00) scale(0.4500)" d="${(data.cormorant?.D || {}).d || ''}" />
  </g>`;
  } else {
    const ndPaths = renderTextToPaths({
      fontName: 'cormorant',
      text: ndText,
      x: ndAnchorX,
      y: ndAnchorY,
      fontSize: ndFontSize,
      tracking: ndTracking,
      anchor: 'start',
      fill: ndColor,
    });
    ndXml = `  <!-- Right Word: ${ndText} (Vector Outlines) -->
  <g class="vector-yond" fill="${ndColor}"${filterAttr}>
${ndPaths.pathsXml}
  </g>`;
  }

  let magicXml = '';
  if (showMagic) {
    if (magicMode === 'split') {
      const leftText = cfg.magicLeftText ?? 'M A';
      const rightText = cfg.magicRightText ?? 'I C';
      const isDefaultMagic = leftText === 'M A' && rightText === 'I C' && magicFont === 'cinzel' && magicFontSize === 81 && magicX === 0 && magicY === 0 && magicLeftX === 0 && magicRightX === 0;

      if (isDefaultMagic) {
        magicXml = `  <!-- Lower Word: M A [G-Clef Key] I C (The lower loop of G-key is the G) -->
  <g class="vector-magic-split" fill="${magicColor}"${filterAttr}>
    <path fill="${magicColor}" transform="translate(36.08, 138.00) scale(0.8100)" d="${(data.cinzel?.M || {}).d || ''}" />
    <path fill="${magicColor}" transform="translate(151.84, 138.00) scale(0.8100)" d="${(data.cinzel?.A || {}).d || ''}" />
    <path fill="${magicColor}" transform="translate(357.00, 138.00) scale(0.8100)" d="${(data.cinzel?.I || {}).d || ''}" />
    <path fill="${magicColor}" transform="translate(427.48, 138.00) scale(0.8100)" d="${(data.cinzel?.C || {}).d || ''}" />
  </g>`;
      } else {
        const magicBaselineY = 138 + magicY;
        const maPaths = renderTextToPaths({
          fontName: magicFont,
          text: leftText,
          x: 210 + magicX + magicLeftX,
          y: magicBaselineY,
          fontSize: magicFontSize,
          tracking: magicTracking,
          anchor: 'end',
          fill: magicColor,
        });

        const icPaths = renderTextToPaths({
          fontName: magicFont,
          text: rightText,
          x: 357 + magicX + magicRightX,
          y: magicBaselineY,
          fontSize: magicFontSize,
          tracking: magicTracking,
          anchor: 'start',
          fill: magicColor,
        });

        magicXml = `  <!-- Lower Word: ${leftText} [G-Clef Key] ${rightText} (The lower loop of G-key is the G) -->
  <g class="vector-magic-split" fill="${magicColor}"${filterAttr}>
${maPaths.pathsXml}
${icPaths.pathsXml}
  </g>`;
      }
    } else {
      const magicText = cfg.magicText ?? 'M A G I C';
      if (magicText.trim().length > 0) {
        const magicAnchorX = cx + magicX;
        const magicAnchorY = 138 + magicY;
        const magicPaths = renderTextToPaths({
          fontName: magicFont,
          text: magicText,
          x: magicAnchorX,
          y: magicAnchorY,
          fontSize: magicFontSize,
          tracking: magicTracking,
          anchor: 'middle',
          fill: magicColor,
        });
        magicXml = `  <!-- Bottom Word: ${magicText} (Vector Outlines) -->
  <g class="vector-magic" fill="${magicColor}"${filterAttr}>
${magicPaths.pathsXml}
  </g>`;
      }
    }
  }

  // Standalone logo strictly does NOT include user name: "in the stand alone logo we dont need my name."
  // "And remember, item meand the Bey and ond and ma-ic and the G key and thats it."
  const clefXml = buildGClefMarkup(
    defaultClefGradient,
    clefLeft,
    clefTop,
    clefW,
    clefH,
    clefColor === 'gold' ? 'gold' : 'white',
    useMetallic3D ? 'metallicLight3DFilter' : undefined
  );
  const svgW = cfg.svgWidth ?? '100%';
  const svgH = cfg.svgHeight ?? '100%';

  const centered = cfg.centered ?? true;
  const centerShiftX = (centered ? 18.86 : 0) + (cfg.logoX ?? 0);
  // Default calibrated vertical shift: brings the artwork down from being vertically too high
  const defaultVertShift = centered ? 65 : 0;
  const centerShiftY = (cfg.logoY ?? cfg.vertOffset ?? 0) + defaultVertShift;

  const contentWrapperOpen = (centerShiftX !== 0 || centerShiftY !== 0) 
    ? `  <g id="beyond-magic-centered-lockup" transform="translate(${centerShiftX.toFixed(2)}, ${centerShiftY.toFixed(2)})">\n` 
    : '';
  const contentWrapperClose = (centerShiftX !== 0 || centerShiftY !== 0) ? `  </g>\n` : '';

  let frameXml = '';
  if (cfg.with3DFrame) {
    const frameStyle = cfg.frameStyle ?? 'beveled';
    if (frameStyle === 'cartouche') {
      frameXml = `  <!-- Sophisticated 3D Baroque Cartouche Frame -->
  <rect x="6" y="6" width="548" height="228" rx="14" fill="#0b0c10" stroke="url(#metallicGoldRoyal)" stroke-width="3" />
  <rect x="12" y="12" width="536" height="216" rx="10" fill="none" stroke="url(#metallicGoldMirror)" stroke-width="1.2" stroke-opacity="0.85" />
  <path d="M 12 36 C 12 24 24 12 36 12 L 44 12 C 28 18 18 28 12 44 Z" fill="url(#metallicGoldRoyal)" />
  <circle cx="36" cy="36" r="3" fill="#fff4b8" />
  <path d="M 548 36 C 548 24 536 12 524 12 L 516 12 C 532 18 542 28 548 44 Z" fill="url(#metallicGoldRoyal)" />
  <circle cx="524" cy="36" r="3" fill="#fff4b8" />
  <path d="M 12 204 C 12 216 24 228 36 228 L 44 228 C 28 222 18 212 12 196 Z" fill="url(#metallicGoldRoyal)" />
  <circle cx="36" cy="204" r="3" fill="#fff4b8" />
  <path d="M 548 204 C 548 216 536 228 524 228 L 516 228 C 532 222 542 212 548 196 Z" fill="url(#metallicGoldRoyal)" />
  <circle cx="524" cy="204" r="3" fill="#fff4b8" />\n`;
    } else {
      frameXml = `  <!-- Sophisticated 3D Royal Beveled Golden Border Frame -->
  <rect x="6" y="6" width="548" height="228" rx="12" fill="url(#metallicGoldRoyal)" stroke="#ffe999" stroke-width="1.2" />
  <rect x="10" y="10" width="540" height="220" rx="9" fill="#1b1206" stroke="#aa771c" stroke-width="1.5" />
  <rect x="13" y="13" width="534" height="214" rx="7" fill="url(#metallicGoldMirror)" />
  <rect x="16" y="16" width="528" height="208" rx="5" fill="#0b0c10" stroke="#d4af37" stroke-width="0.8" />
  <rect x="22" y="22" width="516" height="196" rx="3" fill="none" stroke="#d4af37" stroke-width="0.6" stroke-dasharray="6 3" stroke-opacity="0.4" />
  <circle cx="22" cy="22" r="2.5" fill="#fff4b8" stroke="#8a5e12" stroke-width="0.5" />
  <circle cx="538" cy="22" r="2.5" fill="#fff4b8" stroke="#8a5e12" stroke-width="0.5" />
  <circle cx="22" cy="218" r="2.5" fill="#fff4b8" stroke="#8a5e12" stroke-width="0.5" />
  <circle cx="538" cy="218" r="2.5" fill="#fff4b8" stroke="#8a5e12" stroke-width="0.5" />\n`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 240" width="${svgW}" height="${svgH}" fill="none" style="overflow: visible;">
  <defs>
${METALLIC_GOLD_DEFS}
  </defs>

${frameXml}${contentWrapperOpen}${clefXml}

${beyXml}

${ndXml}

${magicXml}
${contentWrapperClose}</svg>`;
}

/**
 * Generates the Circle Avatar SVG (800 x 800)
 * Default: The authentic, clean pure WHITE circle framing ring (#ffffff, 6px stroke).
 * Also supports optional gold theme. Fully unconstrained centered movement!
 */
export function generateCircleAvatarSvg(cfg: LogoCalibrationConfig = {}): string {
  const useMetallic3D = cfg.useMetallic3D ?? false;
  const beyText = cfg.beyText ?? 'B E Y';
  const ndText = cfg.ndText ?? 'N D';
  const beyFontSize = cfg.beyFontSize ?? cfg.beyondFontSize ?? 59;
  const ndFontSize = cfg.ndFontSize ?? cfg.beyondFontSize ?? 59;
  const beyX = cfg.beyX ?? cfg.beyNudge ?? 0;
  const beyY = cfg.beyY ?? cfg.beyondY ?? cfg.beyVertNudge ?? -16;
  const ndX = cfg.ndX ?? cfg.ndNudge ?? 6;
  const ndY = cfg.ndY ?? cfg.beyondY ?? cfg.ndVertNudge ?? -16;
  const beyTracking = cfg.beyTracking ?? 8;
  const ndTracking = cfg.ndTracking ?? 8;

  const defaultBeyColor = useMetallic3D ? 'url(#metallicSilverPlatinum3D)' : '#ffffff';
  const defaultNdColor = useMetallic3D ? 'url(#metallicSilverPlatinum3D)' : '#ffffff';
  const defaultMagicColor = useMetallic3D ? 'url(#metallicRubyOpera3D)' : '#dc2626';
  const defaultClefGradient = useMetallic3D ? 'metallicGoldLight3D' : 'goldClefCommon';

  const beyColor = cfg.beyColor ?? defaultBeyColor;
  const ndColor = cfg.ndColor ?? defaultNdColor;

  const showMagic = cfg.showMagic ?? true;
  const magicMode = cfg.magicMode ?? 'split';
  const magicFont = cfg.magicFont ?? 'cinzel';
  const magicFontSize = cfg.magicFontSize ?? (magicMode === 'split' ? 80 : 22);
  const magicTracking = cfg.magicTracking ?? 8;
  const magicColor = cfg.magicColor ?? defaultMagicColor;
  const magicX = cfg.magicX ?? 0;
  const magicY = cfg.magicY ?? -24;
  const magicLeftX = cfg.magicLeftX ?? -37;
  const magicRightX = cfg.magicRightX ?? 0;

  const clefScale = cfg.clefScale ?? 126;
  const clefX = cfg.clefX ?? -4;
  const clefY = cfg.clefY ?? -35;
  const clefColor = cfg.clefColor ?? 'gold';

  const globalScale = cfg.globalScale ?? 125;
  const globalX = cfg.globalX ?? 14;
  const globalY = cfg.globalY ?? -47;

  const circleTheme = cfg.circleTheme ?? 'gold';
  const circleColor = cfg.circleColor ?? (circleTheme === 'white' ? '#ffffff' : '#d4af37');
  const circleRadius = cfg.circleRadius ?? 360;
  const circleStrokeWidth = cfg.circleStrokeWidth ?? 2.5;
  const bgColor = cfg.bgColor ?? '#0b0c0e';
  const includeBackground = cfg.includeBackground ?? true;
  const filterAttr = useMetallic3D ? ' filter="url(#metallicLight3DFilter)"' : '';

  const cx = 280;
  const cy = 112;

  const clefScaleFrac = clefScale / 100;
  const clefW = 88 * clefScaleFrac;
  const clefH = 236.5 * clefScaleFrac;
  const clefLeft = cx + clefX - clefW / 2;
  const clefTop = cy + clefY - clefH / 2;

  const beyAnchorX = cx - 44 + beyX;
  const ndAnchorX = cx + 44 + ndX;
  const beyAnchorY = cy + 12 + beyY;
  const ndAnchorY = cy + 12 + ndY;

  const isDefaultBey = beyText === 'B E Y' && beyFontSize === 59 && beyX === 0 && beyY === -16;
  const isDefaultNd = ndText === 'N D' && ndFontSize === 59 && ndX === 6 && ndY === -16;

  let beyXml = '';
  if (isDefaultBey) {
    beyXml = `    <!-- Left Word: B E Y -->
    <g class="vector-bey" fill="${beyColor}"${filterAttr}>
      <path fill="${beyColor}" transform="translate(115.29, -4.00) scale(0.5900)" d="${(data.cormorant?.B || {}).d || ''}" />
      <path fill="${beyColor}" transform="translate(170.50, -4.00) scale(0.5900)" d="${(data.cormorant?.E || {}).d || ''}" />
      <path fill="${beyColor}" transform="translate(223.66, -4.00) scale(0.5900)" d="${(data.cormorant?.Y || {}).d || ''}" />
    </g>`;
  } else {
    const beyPaths = renderTextToPaths({
      fontName: 'cormorant',
      text: beyText,
      x: beyAnchorX,
      y: beyAnchorY,
      fontSize: beyFontSize,
      tracking: beyTracking,
      anchor: 'end',
      fill: beyColor,
    });
    beyXml = `    <!-- Left Word: ${beyText} -->
    <g class="vector-bey" fill="${beyColor}"${filterAttr}>
${beyPaths.pathsXml}
    </g>`;
  }

  let ndXml = '';
  if (isDefaultNd) {
    ndXml = `    <!-- Right Word: N D -->
    <g class="vector-yond" fill="${ndColor}"${filterAttr}>
      <path fill="${ndColor}" transform="translate(328.00, -4.00) scale(0.5900)" d="${(data.cormorant?.N || {}).d || ''}" />
      <path fill="${ndColor}" transform="translate(390.00, -4.00) scale(0.5900)" d="${(data.cormorant?.D || {}).d || ''}" />
    </g>`;
  } else {
    const ndPaths = renderTextToPaths({
      fontName: 'cormorant',
      text: ndText,
      x: ndAnchorX,
      y: ndAnchorY,
      fontSize: ndFontSize,
      tracking: ndTracking,
      anchor: 'start',
      fill: ndColor,
    });
    ndXml = `    <!-- Right Word: ${ndText} -->
    <g class="vector-yond" fill="${ndColor}"${filterAttr}>
${ndPaths.pathsXml}
    </g>`;
  }

  let magicXml = '';
  if (showMagic) {
    if (magicMode === 'split') {
      // Authentic Beyond Magic: Magic without G because the lower part of the G-clef IS the G!
      const leftText = cfg.magicLeftText ?? 'M A';
      const rightText = cfg.magicRightText ?? 'I C';
      const isDefaultMagic = leftText === 'M A' && rightText === 'I C' && magicFont === 'cinzel' && magicFontSize === 80 && magicX === 0 && magicY === -24 && magicLeftX === -37 && magicRightX === 0;

      if (isDefaultMagic) {
        magicXml = `    <!-- Lower Word: M A [G-Clef Key] I C (The lower loop of G-key is the G) -->
    <g class="vector-magic-split" fill="${magicColor}"${filterAttr}>
      <path fill="${magicColor}" transform="translate(36.08, 114.00) scale(0.8000)" d="${(data.cinzel?.M || {}).d || ''}" />
      <path fill="${magicColor}" transform="translate(114.84, 114.00) scale(0.8000)" d="${(data.cinzel?.A || {}).d || ''}" />
      <path fill="${magicColor}" transform="translate(357.00, 114.00) scale(0.8000)" d="${(data.cinzel?.I || {}).d || ''}" />
      <path fill="${magicColor}" transform="translate(427.48, 114.00) scale(0.8000)" d="${(data.cinzel?.C || {}).d || ''}" />
    </g>`;
      } else {
        const magicBaselineY = cy + 52 + magicY;

        const maPaths = renderTextToPaths({
          fontName: magicFont,
          text: leftText,
          x: cx - 32 + magicX + magicLeftX,
          y: magicBaselineY,
          fontSize: magicFontSize,
          tracking: magicTracking,
          anchor: 'end',
          fill: magicColor,
        });

        const icPaths = renderTextToPaths({
          fontName: magicFont,
          text: rightText,
          x: cx + 32 + magicX + magicRightX,
          y: magicBaselineY,
          fontSize: magicFontSize,
          tracking: magicTracking,
          anchor: 'start',
          fill: magicColor,
        });

        magicXml = `    <!-- Lower Word: ${leftText} [G-Clef Key] ${rightText} (The lower loop of G-key is the G) -->
    <g class="vector-magic-split" fill="${magicColor}"${filterAttr}>
${maPaths.pathsXml}
${icPaths.pathsXml}
    </g>`;
      }
    } else {
      const magicText = cfg.magicText ?? 'M A G I C';
      if (magicText.trim().length > 0) {
        const magicAnchorX = cx + (cfg.magicX ?? 0);
        const magicAnchorY = cy + 96 + magicY;
        const magicPaths = renderTextToPaths({
          fontName: magicFont,
          text: magicText,
          x: magicAnchorX,
          y: magicAnchorY,
          fontSize: magicFontSize,
          tracking: magicTracking,
          anchor: 'middle',
          fill: magicColor,
        });
        magicXml = `    <!-- Bottom Word: ${magicText} (Vector Outlines) -->
    <g class="vector-magic" fill="${magicColor}">
${magicPaths.pathsXml}
    </g>`;
      }
    }
  }

  let nameXml = '';
  const showName = cfg.showName ?? false;
  if (showName) {
    const nameTopText = cfg.nameTopText ?? 'A B D E L L A H';
    const nameBottomText = cfg.nameBottomText ?? 'L A S R I';
    const nameFont = cfg.nameFont ?? 'cormorant';
    const nameFontSize = cfg.nameFontSize ?? 13;
    const nameTracking = cfg.nameTracking ?? 8;
    const nameColor = cfg.nameColor ?? '#dedacf';
    const nameX = cfg.nameX ?? 0;
    const nameY = cfg.nameY ?? 0;
    const nameLineGap = cfg.nameLineGap ?? 8;

    const nameAnchorX = cx + nameX;
    const nameTopY = cy + 76 + nameY;
    const nameBottomY = nameTopY + nameFontSize + nameLineGap;

    const topPaths = renderTextToPaths({
      fontName: nameFont,
      text: nameTopText,
      x: nameAnchorX,
      y: nameTopY,
      fontSize: nameFontSize,
      tracking: nameTracking,
      anchor: 'middle',
      fill: nameColor,
    });

    const bottomPaths = renderTextToPaths({
      fontName: nameFont,
      text: nameBottomText,
      x: nameAnchorX,
      y: nameBottomY,
      fontSize: nameFontSize,
      tracking: nameTracking,
      anchor: 'middle',
      fill: nameColor,
    });

    nameXml = `    <!-- Name: ${nameTopText} above ${nameBottomText} (Vector Outlines) -->
    <g class="vector-name" fill="${nameColor}">
${topPaths.pathsXml}
${bottomPaths.pathsXml}
    </g>`;
  }

  const clefXml = buildGClefMarkup(
    defaultClefGradient,
    clefLeft,
    clefTop,
    clefW,
    clefH,
    clefColor === 'gold' ? 'gold' : 'white',
    useMetallic3D ? 'metallicLight3DFilter' : undefined
  );
  const svgW = cfg.svgWidth ?? '100%';
  const svgH = cfg.svgHeight ?? '100%';

  const ringStroke = circleTheme === 'gold' 
    ? (useMetallic3D ? 'url(#metallicGoldLight3D)' : 'url(#metallicGoldRoyal)')
    : circleColor;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="${svgW}" height="${svgH}">
  <defs>
${METALLIC_GOLD_DEFS}
  </defs>

  ${includeBackground ? `<!-- Background Layer -->\n  <rect width="800" height="800" fill="${bgColor}" />` : ''}

  <!-- CIRCULAR FRAMING RING (${circleTheme === 'gold' ? 'Metallic Gold' : 'Pure White'}) -->
  <g class="framing-circle-group">
    <circle cx="400" cy="400" r="${circleRadius}" stroke="${ringStroke}" stroke-width="${circleStrokeWidth}" fill="${includeBackground ? bgColor : 'none'}" />
  </g>

  <!-- COMPOUND LOGO (Centered at 400, 400 + Global User Offsets) -->
  <g transform="translate(400, 400) translate(${globalX}, ${globalY}) scale(${globalScale / 100}) translate(-280, -112)">
${clefXml}

${beyXml}

${ndXml}

${magicXml}
${nameXml}
  </g>
</svg>`;
}
