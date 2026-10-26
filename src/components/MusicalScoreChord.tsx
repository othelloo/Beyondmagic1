import React from 'react';
import { G_CLEF_PATH } from '../utils/svgVectorGenerator';

interface MusicalScoreChordProps {
  notes: string[]; // e.g. ['C3', 'E3', 'G3', 'C4'] or ['Eb3', 'G3', 'Bb3', 'D4']
  chordName: string;
  color?: string;
  isDe?: boolean;
}

interface ParsedNote {
  original: string;
  step: string; // 'C', 'D', 'E', 'F', 'G', 'A', 'B'
  accidental: '' | 'b' | '#' | 'bb';
  octave: number;
  midi: number;
  clef: 'treble' | 'bass';
  y: number; // Y position in SVG
  hasLedgerLine: boolean;
  ledgerY?: number;
}

// Standard Classical Bass Clef (F-Clef) vector path from Wikimedia / standard SVG music symbols
const BASS_CLEF_BODY =
  'M176.014,0l-2.823,0.01C89.091,1.164,20.78,63.557,15.904,118.564c-3.125,35.072,4.693,63.941,22.568,83.494 c16.307,17.803,39.765,26.836,69.727,26.836c31.095,0,61.603-29.77,61.603-60.106c0-30.803-25.076-55.869-55.888-55.869 c-16.569,0-27.575,7.323-34.858,12.179c-2.853,1.892-5.796,3.854-7.121,3.854c-0.446,0-1.477-1.184-2.458-5.635 c-3.399-15.335,1.902-33.644,14.212-48.98c10.399-12.978,34.858-34.726,81.876-34.726c65.67,0,101.833,52.894,101.833,148.952 c0,192.852-165.703,271.845-216.483,291.459c-10.398,4.016-13.778,12.716-12.492,19.553C39.828,507.002,45.947,512,53.686,512 c2.448,0,5.037-0.496,7.657-1.477l5.807-2.165C262.916,435.82,362.19,326.247,362.19,182.648C362.19,57.164,265.688,0,176.014,0z';

const BASS_CLEF_DOT1 =
  'M455.486,126.84c22.771,0,41.282-18.522,41.282-41.292c0-22.76-18.512-41.271-41.282-41.271 c-22.759,0-41.281,18.511-41.281,41.271C414.205,108.318,432.726,126.84,455.486,126.84z';

const BASS_CLEF_DOT2 =
  'M455.486,293.88c22.771,0,41.282-18.522,41.282-41.282c0-22.76-18.512-41.282-41.282-41.282 c-22.759,0-41.281,18.522-41.281,41.282C414.205,275.358,432.726,293.88,455.486,293.88z';

// Convert note string like "Eb3" or "G2" or "Ab3" into staff coordinates
function parseNote(noteStr: string): ParsedNote {
  const match = noteStr.match(/^([A-G])(b|#|bb)?([1-5])$/);
  if (!match) {
    return {
      original: noteStr,
      step: 'C',
      accidental: '',
      octave: 4,
      midi: 60,
      clef: 'treble',
      y: 68,
      hasLedgerLine: true,
      ledgerY: 68
    };
  }

  const step = match[1];
  const accidental = (match[2] || '') as '' | 'b' | '#' | 'bb';
  const octave = parseInt(match[3], 10);

  // Semitone offsets from C
  const stepOffsets: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let midi = (octave + 1) * 12 + stepOffsets[step];
  if (accidental === 'b') midi -= 1;
  if (accidental === 'bb') midi -= 2;
  if (accidental === '#') midi += 1;

  // Diatonic steps from C0 (C=0, D=1, E=2, F=3, G=4, A=5, B=6)
  const diatonicSteps: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
  const absoluteDiatonic = octave * 7 + diatonicSteps[step];

  // Treble staff lines (spacing 8px): y = [22, 30, 38, 46, 54] (F5, D5, B4, G4, E4)
  // Bass staff lines (spacing 8px):   y = [82, 90, 98, 106, 114] (A3, F3, D3, B2, G2)
  // Middle C (C4, absoluteDiatonic = 28) sits at y = 68 with ledger line
  let y = 68;
  let hasLedgerLine = false;
  let ledgerY: number | undefined = undefined;
  const clef: 'treble' | 'bass' = absoluteDiatonic >= 28 ? 'treble' : 'bass';

  if (absoluteDiatonic === 28) {
    // Middle C
    y = 68;
    hasLedgerLine = true;
    ledgerY = 68;
  } else if (absoluteDiatonic > 28) {
    // Treble notes: E4 (diatonic 30) is at y=54. Step is 4px.
    y = 54 - (absoluteDiatonic - 30) * 4;
    if (absoluteDiatonic >= 40) {
      hasLedgerLine = true;
      ledgerY = 14;
    }
  } else {
    // Bass notes: A3 (diatonic 26) is at y=82. Step is 4px.
    y = 82 + (26 - absoluteDiatonic) * 4;
    if (absoluteDiatonic <= 16) {
      hasLedgerLine = true;
      ledgerY = 122;
    }
  }

  return {
    original: noteStr,
    step,
    accidental,
    octave,
    midi,
    clef,
    y,
    hasLedgerLine,
    ledgerY
  };
}

export const MusicalScoreChord: React.FC<MusicalScoreChordProps> = ({
  notes,
  chordName,
}) => {
  const parsedNotes = notes.map(parseNote);

  // Compact true 1:1 square SVG dimensions (viewBox 132 x 132)
  const width = 132;
  const height = 132;

  // Staves line positions
  // Treble staff lines (y: 22, 30, 38, 46, 54)
  const trebleLines = [22, 30, 38, 46, 54];
  // Bass staff lines (y: 82, 90, 98, 106, 114)
  const bassLines = [82, 90, 98, 106, 114];

  // Horizontal position for chord note stack (balanced within the square)
  const noteX = 84;

  // Warm, noble subdued gold (no harsh yellow glare)
  const goldStroke = '#c49750';

  return (
    <div className="w-full h-full flex items-center justify-center select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full aspect-square overflow-visible"
        style={{ filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.45))' }}
        aria-label={`Musical score of ${chordName}`}
      >
        <defs>
          {/* Warm, noble antique gold gradient (subdued, elegant, never neon) */}
          <linearGradient id="scoreSubduedGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e5c07b" />
            <stop offset="35%" stopColor="#c49750" />
            <stop offset="70%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#aa771c" />
          </linearGradient>
        </defs>

        {/* Treble Staff: 5 Fine Golden Lines (0.75px fine engraving, compact square width) */}
        {trebleLines.map((y, idx) => (
          <line
            key={`treble-line-${idx}`}
            x1="8"
            y1={y}
            x2="124"
            y2={y}
            stroke={goldStroke}
            strokeWidth="0.75"
            strokeOpacity="0.75"
          />
        ))}

        {/* Bass Staff: 5 Fine Golden Lines (0.75px fine engraving, compact square width) */}
        {bassLines.map((y, idx) => (
          <line
            key={`bass-line-${idx}`}
            x1="8"
            y1={y}
            x2="124"
            y2={y}
            stroke={goldStroke}
            strokeWidth="0.75"
            strokeOpacity="0.75"
          />
        ))}

        {/* The Authentic Golden Key (G-Clef) from the Beyond Magic Logo - G staff line (y=46) dead center in middle circle */}
        <g transform="translate(10.5, 14.5) scale(1.15, 1.20)">
          <path
            d={G_CLEF_PATH}
            fill="url(#scoreSubduedGold)"
          />
        </g>

        {/* Standard Classical Bass Clef (F-Clef) from Wikimedia - F staff line (y=90) dead center between the two dots */}
        <g transform="translate(8.8, 81.9) scale(0.04787)" fill="url(#scoreSubduedGold)">
          <path d={BASS_CLEF_BODY} />
          <path d={BASS_CLEF_DOT1} />
          <path d={BASS_CLEF_DOT2} />
        </g>

        {/* Middle C (C4) Ledger Line if present */}
        {parsedNotes.some((n) => n.hasLedgerLine && n.ledgerY === 68) && (
          <line
            x1={noteX - 10}
            y1="68"
            x2={noteX + 10}
            y2="68"
            stroke={goldStroke}
            strokeWidth="0.8"
            strokeOpacity="0.8"
          />
        )}

        {/* Low E2 Ledger Line if present */}
        {parsedNotes.some((n) => n.hasLedgerLine && (n.ledgerY ?? 0) >= 122) && (
          <line
            x1={noteX - 10}
            y1="122"
            x2={noteX + 10}
            y2="122"
            stroke={goldStroke}
            strokeWidth="0.8"
            strokeOpacity="0.8"
          />
        )}

        {/* Chord Notes Stack */}
        {parsedNotes.map((n, idx) => {
          // If two adjacent notes are a second apart (|y1 - y2| <= 4), shift one right
          const prevNote = idx > 0 ? parsedNotes[idx - 1] : null;
          const isSecondInterval = prevNote && Math.abs(prevNote.y - n.y) <= 4;
          const xOffset = isSecondInterval && idx % 2 === 1 ? 10 : 0;
          const curX = noteX + xOffset;

          // Stagger accidental horizontally if vertically close to another accidental to prevent overlap
          const prevAccidentalNote = parsedNotes.slice(0, idx).reverse().find((p) => p.accidental !== '');
          const isAccidentalCollision = prevAccidentalNote && Math.abs(prevAccidentalNote.y - n.y) <= 6;
          const accStagger = isAccidentalCollision ? -4.5 : 0;

          return (
            <g key={`note-${idx}`}>
              {/* Authentic Classical Engraved Flat Sign (♭) with slender vertical stem & arched belly */}
              {n.accidental === 'b' && (
                <g transform={`translate(${curX - 13.5 + accStagger}, ${n.y})`}>
                  {/* Slender, tall vertical line stem */}
                  <line
                    x1="0"
                    y1="-8.5"
                    x2="0"
                    y2="4.5"
                    stroke={goldStroke}
                    strokeWidth="1.0"
                    strokeLinecap="round"
                  />
                  {/* Arched pointed belly on the right */}
                  <path
                    d="M 0 -0.5 C 3.4 -1.8 5.2 -0.8 5.2 1.5 C 5.2 3.5 3.4 4.5 0 4.5 Z"
                    fill={goldStroke}
                  />
                  {/* Inner counter opening */}
                  <path
                    d="M 0 0.8 C 2.0 0.1 3.3 0.8 3.3 1.8 C 3.3 2.8 2.0 3.5 0 3.5 Z"
                    fill="#141822"
                  />
                </g>
              )}

              {/* Double Flat (𝄫) - Two engraved flats paired */}
              {n.accidental === 'bb' && (
                <g transform={`translate(${curX - 18 + accStagger}, ${n.y})`}>
                  {/* First flat */}
                  <line
                    x1="0"
                    y1="-8.5"
                    x2="0"
                    y2="4.5"
                    stroke={goldStroke}
                    strokeWidth="1.0"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 0 -0.5 C 3.4 -1.8 5.2 -0.8 5.2 1.5 C 5.2 3.5 3.4 4.5 0 4.5 Z"
                    fill={goldStroke}
                  />
                  <path
                    d="M 0 0.8 C 2.0 0.1 3.3 0.8 3.3 1.8 C 3.3 2.8 2.0 3.5 0 3.5 Z"
                    fill="#141822"
                  />

                  {/* Second flat */}
                  <line
                    x1="4.8"
                    y1="-8.5"
                    x2="4.8"
                    y2="4.5"
                    stroke={goldStroke}
                    strokeWidth="1.0"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 4.8 -0.5 C 8.2 -1.8 10.0 -0.8 10.0 1.5 C 10.0 3.5 8.2 4.5 4.8 4.5 Z"
                    fill={goldStroke}
                  />
                  <path
                    d="M 4.8 0.8 C 6.8 0.1 8.1 0.8 8.1 1.8 C 8.1 2.8 6.8 3.5 4.8 3.5 Z"
                    fill="#141822"
                  />
                </g>
              )}

              {/* Sharp Sign (♯) */}
              {n.accidental === '#' && (
                <text
                  x={curX - 12 + accStagger}
                  y={n.y + 4.0}
                  fill={goldStroke}
                  fontSize="14"
                  fontFamily="serif"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ♯
                </text>
              )}

              {/* Slender, Refined Whole Notehead in warm antique gold - zero blurry glow */}
              <ellipse
                cx={curX}
                cy={n.y}
                rx="4.9"
                ry="3.2"
                transform={`rotate(-20 ${curX} ${n.y})`}
                fill="url(#scoreSubduedGold)"
                stroke="#aa771c"
                strokeWidth="0.6"
              />

              {/* Wide Open Inner Counter Hole for light, elegant classical appearance */}
              <ellipse
                cx={curX}
                cy={n.y}
                rx="3.6"
                ry="1.8"
                transform={`rotate(-20 ${curX} ${n.y})`}
                fill="#141822"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
