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

  // Compact square SVG dimensions (viewBox 160 x 136)
  const width = 160;
  const height = 136;

  // Staves line positions
  // Treble staff lines (y: 22, 30, 38, 46, 54)
  const trebleLines = [22, 30, 38, 46, 54];
  // Bass staff lines (y: 82, 90, 98, 106, 114)
  const bassLines = [82, 90, 98, 106, 114];

  // Horizontal position for chord note stack
  const noteX = 108;

  // Authentic metallic gold color matching the Beyond Magic logo
  const goldColor = '#d4af37';
  const goldBright = '#ffd56b';

  return (
    <div className="flex items-center justify-center select-none shrink-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-36 sm:w-44 h-auto overflow-visible"
        style={{ filter: 'drop-shadow(0 2px 10px rgba(212, 175, 55, 0.28))' }}
        aria-label={`Musical score of ${chordName}`}
      >
        <defs>
          {/* Authentic Metallic Gold Gradient matching the G-Key on the logo */}
          <linearGradient id="scoreLogoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fae082" />
            <stop offset="18%" stopColor="#d4af37" />
            <stop offset="38%" stopColor="#fff8db" />
            <stop offset="58%" stopColor="#ffd56b" />
            <stop offset="78%" stopColor="#fdf497" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>

          <radialGradient id="scoreNoteGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd56b" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Treble Staff: 5 Solid Golden Lines (Reliable on all browsers, 1px fine stroke) */}
        {trebleLines.map((y, idx) => (
          <line
            key={`treble-line-${idx}`}
            x1="8"
            y1={y}
            x2="152"
            y2={y}
            stroke={goldColor}
            strokeWidth="0.95"
            strokeOpacity="0.85"
          />
        ))}

        {/* Bass Staff: 5 Solid Golden Lines (Reliable on all browsers, 1px fine stroke) */}
        {bassLines.map((y, idx) => (
          <line
            key={`bass-line-${idx}`}
            x1="8"
            y1={y}
            x2="152"
            y2={y}
            stroke={goldColor}
            strokeWidth="0.95"
            strokeOpacity="0.85"
          />
        ))}

        {/* The Authentic Golden Key (G-Clef) from the Beyond Magic Logo */}
        <g transform="translate(13, 10) scale(1.18, 1.22)">
          <path
            d={G_CLEF_PATH}
            fill="url(#scoreLogoGold)"
            stroke={goldBright}
            strokeWidth="0.12"
          />
        </g>

        {/* Stylized Golden Bass Clef (F-Clef) - In same golden metallic yellow */}
        <g transform="translate(13, 83) scale(0.66)" fill="url(#scoreLogoGold)">
          <circle cx="5" cy="8" r="3.9" />
          <path d="M 5 4.0 C 13.0 4.0 18.5 9 18.5 17 C 18.5 25 12 32 2.5 36 L 1.5 33.2 C 9.0 29.5 15 23.5 15 17 C 15 11 10.5 7.2 5 7.2 Z" />
          <circle cx="23" cy="10.8" r="1.8" />
          <circle cx="23" cy="21.5" r="1.8" />
        </g>

        {/* Middle C (C4) Ledger Line if present */}
        {parsedNotes.some((n) => n.hasLedgerLine && n.ledgerY === 68) && (
          <line
            x1={noteX - 11}
            y1="68"
            x2={noteX + 11}
            y2="68"
            stroke={goldColor}
            strokeWidth="1.0"
            strokeOpacity="0.9"
          />
        )}

        {/* Low E2 Ledger Line if present */}
        {parsedNotes.some((n) => n.hasLedgerLine && (n.ledgerY ?? 0) >= 122) && (
          <line
            x1={noteX - 11}
            y1="122"
            x2={noteX + 11}
            y2="122"
            stroke={goldColor}
            strokeWidth="1.0"
            strokeOpacity="0.9"
          />
        )}

        {/* Chord Notes Stack */}
        {parsedNotes.map((n, idx) => {
          // If two adjacent notes are a second apart (|y1 - y2| <= 4), shift one right
          const prevNote = idx > 0 ? parsedNotes[idx - 1] : null;
          const isSecondInterval = prevNote && Math.abs(prevNote.y - n.y) <= 4;
          const xOffset = isSecondInterval && idx % 2 === 1 ? 10 : 0;
          const curX = noteX + xOffset;

          return (
            <g key={`note-${idx}`}>
              {/* Authentic Classical Engraved Flat Sign (♭) with prominent vertical stem & arched belly */}
              {n.accidental === 'b' && (
                <g transform={`translate(${curX - 14}, ${n.y})`}>
                  {/* Prominent, tall vertical line stem */}
                  <line
                    x1="0"
                    y1="-8.5"
                    x2="0"
                    y2="4.5"
                    stroke="#fdf497"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  {/* Arched pointed belly on the right */}
                  <path
                    d="M 0 -0.5 C 3.6 -2.0 5.6 -0.8 5.6 1.5 C 5.6 3.6 3.6 4.6 0 4.6 Z"
                    fill="#fdf497"
                  />
                  {/* Inner counter opening */}
                  <path
                    d="M 0 0.8 C 2.2 0.1 3.6 0.8 3.6 1.8 C 3.6 2.8 2.2 3.5 0 3.5 Z"
                    fill="#141822"
                  />
                </g>
              )}

              {/* Double Flat (𝄫) - Two engraved flats paired */}
              {n.accidental === 'bb' && (
                <g transform={`translate(${curX - 19}, ${n.y})`}>
                  {/* First flat */}
                  <line
                    x1="0"
                    y1="-8.5"
                    x2="0"
                    y2="4.5"
                    stroke="#fdf497"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 0 -0.5 C 3.6 -2.0 5.6 -0.8 5.6 1.5 C 5.6 3.6 3.6 4.6 0 4.6 Z"
                    fill="#fdf497"
                  />
                  <path
                    d="M 0 0.8 C 2.2 0.1 3.6 0.8 3.6 1.8 C 3.6 2.8 2.2 3.5 0 3.5 Z"
                    fill="#141822"
                  />

                  {/* Second flat */}
                  <line
                    x1="5"
                    y1="-8.5"
                    x2="5"
                    y2="4.5"
                    stroke="#fdf497"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 5 -0.5 C 8.6 -2.0 10.6 -0.8 10.6 1.5 C 10.6 3.6 8.6 4.6 5 4.6 Z"
                    fill="#fdf497"
                  />
                  <path
                    d="M 5 0.8 C 7.2 0.1 8.6 0.8 8.6 1.8 C 8.6 2.8 7.2 3.5 5 3.5 Z"
                    fill="#141822"
                  />
                </g>
              )}

              {/* Sharp Sign (♯) */}
              {n.accidental === '#' && (
                <text
                  x={curX - 12.5}
                  y={n.y + 4.2}
                  fill="#fdf497"
                  fontSize="15"
                  fontFamily="serif"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ♯
                </text>
              )}

              {/* Golden Whole Notehead (Finer and more delicate engraving) */}
              <ellipse
                cx={curX}
                cy={n.y}
                rx="5.3"
                ry="3.7"
                transform={`rotate(-20 ${curX} ${n.y})`}
                fill="#fdf497"
                stroke="url(#scoreLogoGold)"
                strokeWidth="1.1"
              />

              {/* Inner Counter Hole */}
              <ellipse
                cx={curX}
                cy={n.y}
                rx="2.5"
                ry="1.6"
                transform={`rotate(-20 ${curX} ${n.y})`}
                fill="#141822"
              />

              {/* Subtle Warm Amber Glow */}
              <circle
                cx={curX}
                cy={n.y}
                r="6.5"
                fill="url(#scoreNoteGlow)"
                pointerEvents="none"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
