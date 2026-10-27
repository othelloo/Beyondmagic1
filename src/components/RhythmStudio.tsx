import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, RotateCcw, Trophy, Music, Flame, Award, ChevronRight, X } from 'lucide-react';

export type RhythmDifficulty = 1 | 2 | 3;

export type RhythmNoteType = 
  | 'quarter' 
  | 'half' 
  | 'dotted-half' 
  | 'dotted-quarter' 
  | 'eighth' 
  | 'sixteenth' 
  | 'rest-quarter' 
  | 'rest-eighth';

export interface RhythmNote {
  type: RhythmNoteType;
  duration: number;    // duration in bar units (quarters or eighths)
  isRest?: boolean;
  tiedToNext?: boolean;      // Liaison (tie) connecting to the next note
  isTiedFromPrev?: boolean;  // Note sustained from previous note (held, not re-struck)
}

export interface RhythmBar {
  timeSignature: string; // e.g. "4/4", "3/4", "7/8", "6/8", "5/8"
  unit: 'quarter' | 'eighth';
  notes: RhythmNote[];
}

export interface RhythmExercise {
  id: string;
  name: string;
  nameDe: string;
  level: RhythmDifficulty;
  bars: RhythmBar[];
  description: string;
  descriptionDe: string;
}

// 1. Level 1: Exactly 2 bars, simple classical meters (4/4 & 3/4), two bars close to each other.
const RHYTHMS_LEVEL_1: RhythmExercise[] = [
  {
    id: 'r1-two-bars-march',
    name: 'Even March (4/4)',
    nameDe: 'Gleichmäßiger Marsch (4/4)',
    level: 1,
    bars: [
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'half', duration: 2 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      }
    ],
    description: 'Two measures of 4/4. Solid quarter notes and 2-beat sustained halves.',
    descriptionDe: 'Zwei Takte im 4/4-Takt. Gleichmäßige Viertel und 2-Schlag-Halbenoten.'
  },
  {
    id: 'r1-two-bars-waltz',
    name: 'Waltz Phrasing (3/4)',
    nameDe: 'Walzer-Phrasierung (3/4)',
    level: 1,
    bars: [
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
          { type: 'quarter', duration: 1 },
        ]
      }
    ],
    description: 'Two measures of 3/4 time (3 + 3 = 6 beats). Gentle lyrical waltz step.',
    descriptionDe: 'Zwei Takte im 3/4-Takt (3 + 3 = 6 Schläge). Klassischer Walzerschritt.'
  },
  {
    id: 'r1-steady-halves',
    name: 'Balanced Pulse (4/4)',
    nameDe: 'Ausgeglichener Puls (4/4)',
    level: 1,
    bars: [
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
          { type: 'half', duration: 2 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: 'Two measures of 4/4. Sustained 2-beat half notes resolving into quarters.',
    descriptionDe: 'Zwei Takte 4/4. Gehaltene Halbe Noten münden in ruhige Viertel.'
  },
  {
    id: 'r1-minuet-lilt',
    name: 'Minuet Step (3/4)',
    nameDe: 'Menuett-Schritt (3/4)',
    level: 1,
    bars: [
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'half', duration: 2 },
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      }
    ],
    description: 'Two measures of 3/4 with half note center and returning quarters.',
    descriptionDe: 'Zwei Takte 3/4 mit zentraler Halber Note und abschließenden Vierteln.'
  }
];

// 2. Level 2: Exactly 2 bars, higher difficulty (7/8, 6/8, syncopated 4/4, changing meters)
const RHYTHMS_LEVEL_2: RhythmExercise[] = [
  {
    id: 'r2-seven-eight-pure',
    name: 'Balkan 7/8 Dance',
    nameDe: 'Balkan 7/8 Tanz',
    level: 2,
    bars: [
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
          { type: 'quarter', duration: 2 },
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
        ]
      }
    ],
    description: 'Two measures of 7/8 (3+2+2 then 1+1+3+2 = 14 eighth beats). Authentic Balkan pulse.',
    descriptionDe: 'Zwei Takte im 7/8-Takt (3+2+2 dann 1+1+3+2 = 14 Achtel). Authentischer Balkan-Puls.'
  },
  {
    id: 'r2-two-bars-six-eight',
    name: 'Pastoral 6/8 Sicilienne',
    nameDe: 'Pastorale 6/8 Sizilienne',
    level: 2,
    bars: [
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'dotted-quarter', duration: 3 },
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'dotted-quarter', duration: 3 },
        ]
      }
    ],
    description: 'Two measures of 6/8 (compound duple: dotted pulses subdividing into three).',
    descriptionDe: 'Zwei Takte im 6/8-Takt mit wiegender Triolen-Unterteilung.'
  },
  {
    id: 'r2-four-four-syncopated',
    name: 'Syncopated Groove (4/4)',
    nameDe: 'Synkopierter Groove (4/4)',
    level: 2,
    bars: [
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
          { type: 'rest-quarter', duration: 1, isRest: true },
          { type: 'quarter', duration: 1 },
        ]
      }
    ],
    description: 'Two measures of 4/4 with eighth-note subdivisions and silent quarter rest.',
    descriptionDe: 'Zwei Takte 4/4 mit Achtelläufen und bewusster Viertelpause.'
  },
  {
    id: 'r2-changing-three-to-four',
    name: 'Changing Meter (3/4 → 4/4)',
    nameDe: 'Taktwechsel (3/4 → 4/4)',
    level: 2,
    bars: [
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
          { type: 'rest-quarter', duration: 1, isRest: true },
          { type: 'quarter', duration: 1 },
        ]
      }
    ],
    description: 'Measure 1 in 3/4 transitions seamlessly across the barline into 4/4.',
    descriptionDe: 'Takt 1 im 3/4-Takt wechselt an der Taktlinie unmittelbar in den 4/4-Takt.'
  }
];

// 3. Level 3: Exactly 6 BARS! Includes 1/16 notes and liaison (ties) across beats and barlines!
const RHYTHMS_LEVEL_3: RhythmExercise[] = [
  {
    id: 'r3-six-bars-symphonic',
    name: 'Symphonic Suite (4/4, 6 Bars)',
    nameDe: 'Symphonische Suite (4/4, 6 Takte)',
    level: 3,
    bars: [
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1, tiedToNext: true }, // Liaison into bar 2!
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1, isTiedFromPrev: true },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'half', duration: 2 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1, tiedToNext: true }, // Liaison into bar 5!
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1, isTiedFromPrev: true },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'eighth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '6 measures in 4/4 with 1/16 runs and liaisons across barlines. True symphonic depth.',
    descriptionDe: '6 Takte im 4/4-Takt mit 1/16-Läufen und Haltebögen über die Taktstriche.'
  },
  {
    id: 'r3-six-bars-balkan',
    name: 'Balkan Rhapsody (7/8, 6 Bars)',
    nameDe: 'Balkan-Rhapsodie (7/8, 6 Takte)',
    level: 3,
    bars: [
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
          { type: 'quarter', duration: 2 },
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2, tiedToNext: true }, // Liaison into bar 3!
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'quarter', duration: 2, isTiedFromPrev: true },
          { type: 'eighth', duration: 1 },
          { type: 'quarter', duration: 2 },
          { type: 'quarter', duration: 2 },
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'sixteenth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'eighth', duration: 1 },
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'eighth', duration: 1 },
          { type: 'quarter', duration: 2, tiedToNext: true }, // Liaison into bar 6!
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1, isTiedFromPrev: true },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'dotted-quarter', duration: 3 },
          { type: 'eighth', duration: 1 },
        ]
      }
    ],
    description: '6 measures of 7/8 with rapid sixteenth snaps and syncopated liaisons.',
    descriptionDe: '6 Takte im 7/8-Takt mit Sechzehntel-Figuren und rhythmischen Haltebögen.'
  },
  {
    id: 'r3-six-bars-arabesque',
    name: 'French Arabesque (3/4, 6 Bars)',
    nameDe: 'Französische Arabeske (3/4, 6 Takte)',
    level: 3,
    bars: [
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1, tiedToNext: true }, // Liaison
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1, isTiedFromPrev: true },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1, tiedToNext: true }, // Liaison
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1, isTiedFromPrev: true },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'dotted-half', duration: 3 },
        ]
      }
    ],
    description: '6 measures in 3/4 with fluid 1/16 arabesques and sustained ties across barlines.',
    descriptionDe: '6 Takte im 3/4-Takt mit eleganten Sechzehntel-Arabesken und fließenden Bindungen.'
  },
  {
    id: 'r3-six-bars-modulation',
    name: 'Metric Modulation (5/8 → 6/8 → 7/8, 6 Bars)',
    nameDe: 'Metrische Modulation (5/8 → 6/8 → 7/8, 6 Takte)',
    level: 3,
    bars: [
      {
        timeSignature: '5/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
        ]
      },
      {
        timeSignature: '5/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'dotted-quarter', duration: 3, tiedToNext: true }, // Liaison
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1, isTiedFromPrev: true },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'dotted-quarter', duration: 3 },
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'sixteenth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'eighth', duration: 1 },
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
          { type: 'quarter', duration: 2, tiedToNext: true }, // Liaison
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'quarter', duration: 2, isTiedFromPrev: true },
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
        ]
      }
    ],
    description: '6 shifting measures (5/8 into 6/8 into 7/8) with sixteenth subdivisions and liaisons.',
    descriptionDe: '6 wechselnde Takte (5/8 in 6/8 in 7/8) mit Sechzehntel-Noten und Haltebögen.'
  }
];

// Clean, fine SVG musical note glyphs:
// - Half note: Clear hollow open oval head (2 beats) vs solid filled quarter note (1 beat)
// - 1/8 and 1/16 flags: Clean straight diagonal descending lines (not arches!)
const FineMusicNote: React.FC<{ type: RhythmNoteType }> = ({ type }) => {
  switch (type) {
    case 'half':
      return (
        <svg viewBox="0 0 28 40" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none">
          {/* Fine open hollow note head */}
          <ellipse
            cx="10"
            cy="30"
            rx="5.8"
            ry="3.6"
            transform="rotate(-25 10 30)"
            fill="none"
            stroke="#fbf9f5"
            strokeWidth="1.5"
          />
          {/* Fine vertical stem */}
          <line x1="15" y1="28" x2="15" y2="6" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'dotted-half':
      return (
        <svg viewBox="0 0 32 40" className="w-6 h-7 sm:w-7 sm:h-8 overflow-visible select-none">
          <ellipse
            cx="10"
            cy="30"
            rx="5.8"
            ry="3.6"
            transform="rotate(-25 10 30)"
            fill="none"
            stroke="#fbf9f5"
            strokeWidth="1.5"
          />
          <line x1="15" y1="28" x2="15" y2="6" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="21" cy="30" r="1.8" fill="#fbf9f5" />
        </svg>
      );
    case 'quarter':
      return (
        <svg viewBox="0 0 28 40" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none">
          {/* Crisp solid filled note head */}
          <ellipse
            cx="10"
            cy="30"
            rx="5.8"
            ry="3.6"
            transform="rotate(-25 10 30)"
            fill="#fbf9f5"
          />
          <line x1="15" y1="28" x2="15" y2="6" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'dotted-quarter':
      return (
        <svg viewBox="0 0 32 40" className="w-6 h-7 sm:w-7 sm:h-8 overflow-visible select-none">
          <ellipse
            cx="10"
            cy="30"
            rx="5.8"
            ry="3.6"
            transform="rotate(-25 10 30)"
            fill="#fbf9f5"
          />
          <line x1="15" y1="28" x2="15" y2="6" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="21" cy="30" r="1.8" fill="#fbf9f5" />
        </svg>
      );
    case 'eighth':
      return (
        <svg viewBox="0 0 28 40" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none">
          <ellipse
            cx="10"
            cy="30"
            rx="5.8"
            ry="3.6"
            transform="rotate(-25 10 30)"
            fill="#fbf9f5"
          />
          <line x1="15" y1="28" x2="15" y2="6" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          {/* Clean, straight diagonal descending line flag (starting at top of stem, more a line than an arch) */}
          <line x1="15" y1="6" x2="21" y2="16" stroke="#fbf9f5" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'sixteenth':
      return (
        <svg viewBox="0 0 28 40" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none">
          <ellipse
            cx="10"
            cy="30"
            rx="5.8"
            ry="3.6"
            transform="rotate(-25 10 30)"
            fill="#fbf9f5"
          />
          <line x1="15" y1="28" x2="15" y2="6" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          {/* Two parallel straight diagonal lines descending from the stem */}
          <line x1="15" y1="6" x2="21" y2="15" stroke="#fbf9f5" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="15" y1="11" x2="21" y2="20" stroke="#fbf9f5" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'rest-quarter':
      return (
        <svg viewBox="0 0 20 40" className="w-4 h-7 sm:w-5 sm:h-8 overflow-visible select-none">
          <path
            d="M7 8 L12 14 L6 20 L10 24 C7 27, 7 30, 10 32"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'rest-eighth':
      return (
        <svg viewBox="0 0 20 40" className="w-4 h-7 sm:w-5 sm:h-8 overflow-visible select-none">
          <circle cx="8" cy="15" r="1.6" fill="#f59e0b" />
          <line x1="9" y1="15" x2="13" y2="10" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="13" y1="10" x2="8" y2="26" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

export interface RhythmLeaderboardEntry {
  id: string;
  name: string;
  score: number;
  streak: number;
  accuracy: number;
  bpm: number;
  difficulty: RhythmDifficulty;
  date: string;
}

interface RhythmStudioProps {
  isDe?: boolean;
}

type RhythmState = 'READY' | 'TAPPING' | 'SUMMARY';

export const RhythmStudio: React.FC<RhythmStudioProps> = ({ isDe = false }) => {
  const [difficulty, setDifficulty] = useState<RhythmDifficulty>(1);
  const [state, setState] = useState<RhythmState>('READY');
  const [currentExercise, setCurrentExercise] = useState<RhythmExercise>(RHYTHMS_LEVEL_1[0]);

  // Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Tap tracking
  const tapTimesRef = useRef<number[]>([]);
  const [tapsCount, setTapsCount] = useState<number>(0);
  const [padPressed, setPadPressed] = useState<boolean>(false);
  const [leftPadPressed, setLeftPadPressed] = useState<boolean>(false);
  const [rightPadPressed, setRightPadPressed] = useState<boolean>(false);

  // Performance Results
  const [detectedBpm, setDetectedBpm] = useState<number | null>(null);
  const [precisionScore, setPrecisionScore] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Demo audio playing state
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const demoTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Scoring & Leaderboard
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<RhythmLeaderboardEntry[]>([]);
  const [userName, setUserName] = useState<string>('Drummer');

  // Load Leaderboard on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('beyondMagic_rhythmScores');
      if (stored) {
        setLeaderboard(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  }, []);

  // Rich, resonant Japanese drum sound synthesis
  const playTaikoSound = useCallback((isLow = true) => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      // Membrane slap transient
      const slapOsc = ctx.createOscillator();
      const slapGain = ctx.createGain();
      slapOsc.type = 'triangle';
      slapOsc.frequency.setValueAtTime(isLow ? 340 : 440, now);
      slapOsc.frequency.exponentialRampToValueAtTime(110, now + 0.035);
      slapGain.gain.setValueAtTime(0.75, now);
      slapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      slapOsc.connect(slapGain);

      // Deep wooden body resonance
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(isLow ? 145 : 185, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(isLow ? 60 : 82, now + 0.075);

      bodyGain.gain.setValueAtTime(0.90, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + (isLow ? 0.45 : 0.32));
      bodyOsc.connect(bodyGain);

      // Tone Sculptor
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1500, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.25);

      slapGain.connect(filter);
      bodyGain.connect(filter);
      filter.connect(ctx.destination);

      slapOsc.start(now);
      slapOsc.stop(now + 0.045);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.5);
    } catch {}
  }, [getAudioContext]);

  // Pick random rhythm for difficulty
  const pickRhythm = useCallback((diff: RhythmDifficulty): RhythmExercise => {
    const pool = diff === 1 ? RHYTHMS_LEVEL_1 : diff === 2 ? RHYTHMS_LEVEL_2 : RHYTHMS_LEVEL_3;
    const rIdx = Math.floor(Math.random() * pool.length);
    return pool[rIdx];
  }, []);

  // Reset to Ready
  const resetToReady = useCallback(() => {
    demoTimersRef.current.forEach(clearTimeout);
    demoTimersRef.current = [];
    setIsPlayingDemo(false);
    tapTimesRef.current = [];
    setTapsCount(0);
    setDetectedBpm(null);
    setPrecisionScore(null);
    setFeedbackMessage(null);
    setState('READY');
  }, []);

  // Switch Difficulty
  const handleSwitchDifficulty = (diff: RhythmDifficulty) => {
    setDifficulty(diff);
    const newEx = pickRhythm(diff);
    setCurrentExercise(newEx);
    resetToReady();
  };

  // Build flattened sequence of playable notes with absolute beat offsets normalized to quarter beats
  const buildFlattenedPlayableNotes = useCallback((ex: RhythmExercise) => {
    const notes: { offsetBeats: number; isRest?: boolean; isTiedFromPrev?: boolean; isLow: boolean; durationQuarter: number }[] = [];
    let currentQuarterOffset = 0;

    ex.bars.forEach((bar) => {
      bar.notes.forEach((note, nIdx) => {
        const durationQuarter = bar.unit === 'eighth' ? note.duration * 0.5 : note.duration;
        notes.push({
          offsetBeats: currentQuarterOffset,
          isRest: note.isRest,
          isTiedFromPrev: note.isTiedFromPrev,
          isLow: nIdx % 2 === 0,
          durationQuarter
        });
        currentQuarterOffset += durationQuarter;
      });
    });

    return notes;
  }, []);

  const flattenedNotes = buildFlattenedPlayableNotes(currentExercise);
  // Only actual attacks: exclude rests AND sustained liaison notes
  const playableNotes = flattenedNotes.filter(n => !n.isRest && !n.isTiedFromPrev);
  const totalPlayableCount = playableNotes.length;

  // Play demo acoustic preview of the rhythm
  const playDemoPreview = () => {
    if (isPlayingDemo) {
      demoTimersRef.current.forEach(clearTimeout);
      demoTimersRef.current = [];
      setIsPlayingDemo(false);
      return;
    }

    setIsPlayingDemo(true);
    demoTimersRef.current.forEach(clearTimeout);
    demoTimersRef.current = [];

    const demoBpm = 86;
    const secPerBeat = 60 / demoBpm;

    playableNotes.forEach((note, idx) => {
      const tId = setTimeout(() => {
        playTaikoSound(idx % 2 === 0);
      }, note.offsetBeats * secPerBeat * 1000);
      demoTimersRef.current.push(tId);
    });

    const lastOffset = playableNotes[playableNotes.length - 1]?.offsetBeats || 4;
    const endTId = setTimeout(() => {
      setIsPlayingDemo(false);
    }, (lastOffset + 1.5) * secPerBeat * 1000);
    demoTimersRef.current.push(endTId);
  };

  // Evaluate rhythm performance based on USER'S OWN TEMPO
  const evaluatePerformance = useCallback((taps: number[], ex: RhythmExercise) => {
    setState('SUMMARY');
    const pNotes = buildFlattenedPlayableNotes(ex).filter(n => !n.isRest && !n.isTiedFromPrev);
    if (taps.length < 2 || pNotes.length < 2) {
      setFeedbackMessage(isDe ? 'Bitte mindestens 2 Schläge tippen.' : 'Please tap at least 2 beats.');
      return;
    }

    const t0 = taps[0];
    const b0 = pNotes[0].offsetBeats;

    // Linear regression to find user's duration per beat (D_beat)
    let sumNum = 0;
    let sumDenom = 0;

    for (let i = 1; i < Math.min(taps.length, pNotes.length); i++) {
      const deltaB = pNotes[i].offsetBeats - b0;
      const deltaT = taps[i] - t0;
      sumNum += deltaT * deltaB;
      sumDenom += deltaB * deltaB;
    }

    const dBeat = sumDenom > 0 ? sumNum / sumDenom : 600;
    const bpm = Math.max(30, Math.min(240, Math.round(60000 / dBeat)));
    setDetectedBpm(bpm);

    let totalErrorPercent = 0;
    const count = Math.min(taps.length, pNotes.length);

    for (let i = 0; i < count; i++) {
      const expectedTime = t0 + (pNotes[i].offsetBeats - b0) * dBeat;
      const actualTime = taps[i];
      const diffMs = Math.abs(actualTime - expectedTime);
      const errorRatio = diffMs / dBeat;
      totalErrorPercent += errorRatio;
    }

    const avgError = totalErrorPercent / count;
    const precision = Math.max(0, Math.min(100, Math.round(100 - avgError * 135)));
    setPrecisionScore(precision);

    if (precision >= 82) {
      const roundScore = 180 * ex.level + (streak + 1) * 35;
      setScore(prev => prev + roundScore);
      setStreak(prev => {
        const next = prev + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
      setFeedbackMessage(isDe ? 'Großartige Präzision! Sicher im eigenen Puls gehalten.' : 'Exceptional precision! Rock-solid groove in your tempo.');
    } else if (precision >= 68) {
      const roundScore = 100 * ex.level;
      setScore(prev => prev + roundScore);
      setFeedbackMessage(isDe ? 'Gutes Gefühl! Halte die Taktunterteilung noch präziser.' : 'Good feel! Keep your inner subdivisions steady.');
    } else {
      setStreak(0);
      setFeedbackMessage(isDe ? 'Ungleichmäßiges Tempo. Versuche einen stetigen Puls zu halten.' : 'Uneven tempo. Keep a relaxed, continuous pulse.');
    }
  }, [isDe, streak, buildFlattenedPlayableNotes]);

  // Handle a Tap (from Single PC Button, Mobile Pads, or Keyboard Space / Arrow)
  const handleUserTap = useCallback((source: 'single' | 'left' | 'right' | 'key') => {
    const isLow = source === 'single' || source === 'left' || source === 'key';
    playTaikoSound(isLow);

    if (source === 'single' || source === 'key') {
      setPadPressed(true);
      setTimeout(() => setPadPressed(false), 120);
    } else if (source === 'left') {
      setLeftPadPressed(true);
      setTimeout(() => setLeftPadPressed(false), 120);
    } else if (source === 'right') {
      setRightPadPressed(true);
      setTimeout(() => setRightPadPressed(false), 120);
    }

    if (state === 'SUMMARY') {
      tapTimesRef.current = [performance.now()];
      setTapsCount(1);
      setState('TAPPING');
      return;
    }

    const now = performance.now();
    const updated = [...tapTimesRef.current, now];
    tapTimesRef.current = updated;
    const currentCount = updated.length;
    setTapsCount(currentCount);

    if (state === 'READY') {
      setState('TAPPING');
    }

    // Only finish when ALL playable notes in the score have been tapped!
    if (currentCount >= totalPlayableCount) {
      setTimeout(() => {
        evaluatePerformance(updated, currentExercise);
      }, 250);
    }
  }, [state, totalPlayableCount, playTaikoSound, evaluatePerformance, currentExercise]);

  // Keyboard shortcut listener: Spacebar and any Arrow key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space' || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
        handleUserTap('key');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUserTap]);

  // Next Rhythm Challenge
  const handleNextChallenge = () => {
    const newEx = pickRhythm(difficulty);
    setCurrentExercise(newEx);
    resetToReady();
  };

  // Save score to leaderboard
  const saveScoreToLeaderboard = () => {
    if (score <= 0) return;
    const entry: RhythmLeaderboardEntry = {
      id: Date.now().toString(),
      name: userName.trim() || (isDe ? 'Trommler' : 'Drummer'),
      score,
      streak: bestStreak,
      accuracy: precisionScore || 90,
      bpm: detectedBpm || 80,
      difficulty,
      date: new Date().toLocaleDateString(isDe ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric' })
    };
    const updated = [entry, ...leaderboard].sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(updated);
    try {
      localStorage.setItem('beyondMagic_rhythmScores', JSON.stringify(updated));
    } catch {}
  };

  // Split bars into systems of 2 bars per staff line:
  // - Level 1: 2 bars -> 1 staff line (bars close together)
  // - Level 2: 2 bars -> 1 staff line (bars close together)
  // - Level 3: 6 bars -> 3 staff lines (2 bars per line, cleanly proportioned without overflow)
  const BARS_PER_SYSTEM = 2;
  const systems: {
    systemIdx: number;
    bars: {
      bar: RhythmBar;
      globalBarIdx: number;
      localBarIdx: number;
    }[];
  }[] = [];

  for (let i = 0; i < currentExercise.bars.length; i += BARS_PER_SYSTEM) {
    const slice = currentExercise.bars.slice(i, i + BARS_PER_SYSTEM);
    systems.push({
      systemIdx: Math.floor(i / BARS_PER_SYSTEM),
      bars: slice.map((bar, localIdx) => ({
        bar,
        globalBarIdx: i + localIdx,
        localBarIdx: localIdx,
      })),
    });
  }

  return (
    <div id="rhythm-studio-console" className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto select-none">
      {/* Console Frame */}
      <div className="relative rounded-2xl bg-[#121520] border border-[#2b3347] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-3 sm:p-5 overflow-hidden">
        
        {/* Mood Ambient Glow */}
        <div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-500"
          style={{ backgroundColor: state === 'SUMMARY' ? '#10b981' : state === 'TAPPING' ? '#ffd56b' : '#c49750' }}
        />

        {/* 1. Header Bar: Difficulty Tabs + Top 10 High Scores */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-2.5 mb-2.5 border-b border-white/10">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
            {([1, 2, 3] as RhythmDifficulty[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleSwitchDifficulty(lvl)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
                  difficulty === lvl
                    ? 'bg-gradient-to-r from-[#c49750] to-[#e6b769] text-black font-bold shadow-md shadow-[#c49750]/20'
                    : 'bg-[#0e111a] text-[#8c887d] hover:text-[#fbf9f5] border border-white/5 hover:border-white/10'
                }`}
                title={lvl === 1 ? 'Level 1 (Simple 4/4 & 3/4)' : lvl === 2 ? 'Level 2' : 'Level 3'}
              >
                <span>{lvl === 1 ? '🌱' : lvl === 2 ? '🌿' : '🌳'}</span>
                <span className="truncate">
                  {lvl === 1 ? (isDe ? 'Stufe 1 (Einfach)' : 'Level 1 (Simple)') :
                   lvl === 2 ? (isDe ? 'Stufe 2' : 'Level 2') :
                   (isDe ? 'Stufe 3' : 'Level 3')}
                </span>
              </button>
            ))}
          </div>

          {/* Top 10 Button */}
          <button
            type="button"
            onClick={() => setShowLeaderboard(true)}
            className="shrink-0 px-2 sm:px-2.5 py-1.5 rounded-xl bg-[#181c28] hover:bg-[#222738] border border-[#c49750]/60 text-[#fbf9f5] flex items-center gap-1 text-xs font-mono transition-all cursor-pointer shadow-sm group"
            title={isDe ? 'Top 10 Bestenliste' : 'Top 10 High Scores'}
          >
            <Trophy className="w-3.5 h-3.5 text-[#c49750] group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-semibold text-[#f5eedf] text-[11px] sm:text-xs">Top 10</span>
          </button>
        </div>

        {/* 2. HUD Bar: Streak, Points & Demo */}
        <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2 border-b border-white/10 text-xs font-mono">
          {/* Left: Streak & Points */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="px-2 py-1 rounded-lg bg-[#0b0d14] border border-white/10 flex items-center gap-1 text-[11px]">
              <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-[#f59e0b] animate-bounce' : 'text-[#6e6a60]'}`} />
              <span className="text-[#8c887d]">{isDe ? 'Serie' : 'Streak'}</span>
              <span className="font-bold text-[#fbf9f5]">{streak}</span>
            </div>

            <div className="px-2 py-1 rounded-lg bg-[#0b0d14] border border-white/10 flex items-center gap-1 text-[11px]">
              <Award className="w-3.5 h-3.5 text-[#c49750]" />
              <span className="text-[#8c887d]">{isDe ? 'Punkte' : 'Score'}</span>
              <span className="font-bold text-[#fbf9f5]">{score}</span>
            </div>
          </div>

          {/* Right: Demo preview & Restart */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={playDemoPreview}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingDemo 
                  ? 'bg-amber-950/70 border-amber-500/50 text-amber-300' 
                  : 'bg-[#181c28] border-white/10 text-[#dedacf] hover:text-white'
              }`}
              title={isDe ? 'Klangbeispiel anhören' : 'Listen to demo'}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#c49750]" />
              <span className="text-[11px]">{isPlayingDemo ? (isDe ? 'Spielt...' : 'Playing...') : 'Demo'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setScore(0);
                setStreak(0);
                resetToReady();
              }}
              className="p-1 rounded-lg text-[#8c887d] hover:text-white bg-[#0b0d14] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title={isDe ? 'Neu starten' : 'Restart'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Pure Classical Rhythm Score: Stacked Staff Systems (NO horizontal scroll, fine vector notes) */}
        <div className="my-2 p-2.5 sm:p-3.5 rounded-xl bg-[#0c0e15] border border-white/10 text-center">
          
          <div className="flex items-center justify-between mb-2 text-[11px] font-mono text-[#8c887d]">
            <span className="text-[#c49750] font-semibold flex items-center gap-1">
              <Music className="w-3.5 h-3.5" />
              <span>{isDe ? currentExercise.nameDe : currentExercise.name}</span>
            </span>

            <span>
              {state === 'READY' ? (
                <span className="text-[#a78bfa]">
                  {isDe ? 'Startbereit: Beginne in deinem Tempo!' : 'Ready: Start at your own tempo!'}
                </span>
              ) : state === 'TAPPING' ? (
                <span className="text-[#ffd56b] font-bold">
                  {isDe ? `● Schlag ${tapsCount} von ${totalPlayableCount}` : `● Note ${tapsCount} of ${totalPlayableCount}`}
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  {isDe ? 'Ergebnis berechnet' : 'Result calculated'}
                </span>
              )}
            </span>
          </div>

          {/* Stacked Musical Staffs: Dynamically adapts to the number of bars/notes without empty side space */}
          <div className="flex flex-col items-center gap-2 sm:gap-2.5 w-full overflow-x-auto py-1">
            {systems.map((system) => {
              const isLastSystem = system.systemIdx === systems.length - 1;

              return (
                <div 
                  key={system.systemIdx} 
                  className="relative inline-flex items-center py-2.5 sm:py-3 px-3 sm:px-4 bg-[#07090e] rounded-xl border border-white/10 shadow-inner select-none w-fit max-w-full animate-fade-in"
                >
                  {/* 5 Classical Golden Staff Lines in Background - snugly hugging the staff width */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 sm:h-9 flex flex-col justify-between pointer-events-none opacity-30 px-2 sm:px-3">
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                  </div>

                  {/* Percussion Clef at start of staff line */}
                  <div className="flex items-center gap-1 shrink-0 mr-2 sm:mr-3 z-10 select-none">
                    <span className="w-1 h-8 sm:h-9 bg-[#c49750]/80 rounded-sm" />
                    <span className="w-1 h-8 sm:h-9 bg-[#c49750]/80 rounded-sm" />
                  </div>

                  {/* Bars in this System - tightly proportioned, no empty side gaps */}
                  <div className="relative flex items-center shrink-0 gap-2.5 sm:gap-4 z-10">
                    {system.bars.map((barInfo) => {
                      const prevBar = barInfo.globalBarIdx > 0 ? currentExercise.bars[barInfo.globalBarIdx - 1] : null;
                      const showTimeSig = barInfo.globalBarIdx === 0 || (prevBar && prevBar.timeSignature !== barInfo.bar.timeSignature);
                      const [numerator, denominator] = barInfo.bar.timeSignature.split('/');

                      return (
                        <div key={barInfo.globalBarIdx} className="flex items-center shrink-0">
                          {/* Time Signature - Perfectly scaled inside staff lines */}
                          {showTimeSig && (
                            <div className="flex flex-col items-center justify-center font-serif text-lg sm:text-xl font-black text-[#fbf9f5] leading-[0.82] tracking-tight mr-1.5 sm:mr-2 select-none shrink-0 drop-shadow-md">
                              <span>{numerator}</span>
                              <span>{denominator}</span>
                            </div>
                          )}

                          {/* Notes Inside This Measure */}
                          <div className="flex items-center gap-1.5 sm:gap-2.5 px-0.5">
                            {barInfo.bar.notes.map((note, nIdx) => {
                              const isLastNoteInBar = nIdx === barInfo.bar.notes.length - 1;
                              const isLastNoteInSystem = isLastNoteInBar && barInfo.localBarIdx === system.bars.length - 1;
                              const isFirstNoteInSystem = nIdx === 0 && barInfo.localBarIdx === 0;

                              return (
                                <div key={nIdx} className={`relative flex items-center justify-center ${note.isTiedFromPrev ? 'opacity-75' : ''}`}>
                                  <FineMusicNote type={note.type} />

                                  {/* Liaison continuation arc from previous system if tied across lines */}
                                  {note.isTiedFromPrev && isFirstNoteInSystem && system.systemIdx > 0 && (
                                    <div className="absolute -bottom-2 -left-5 pointer-events-none z-30">
                                      <svg className="w-6 h-3 overflow-visible" viewBox="0 0 24 12">
                                        <path
                                          d="M 2 2 Q 12 11 22 2"
                                          fill="none"
                                          stroke="#e6b769"
                                          strokeWidth="2.2"
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                    </div>
                                  )}

                                  {/* Liaison / Tie arc connecting note forward */}
                                  {note.tiedToNext && (
                                    <div className="absolute -bottom-2 left-2.5 pointer-events-none z-30">
                                      <svg 
                                        className={`h-3 overflow-visible ${
                                          isLastNoteInSystem ? 'w-8 sm:w-10' : isLastNoteInBar ? 'w-9 sm:w-11' : 'w-6 sm:w-8'
                                        }`} 
                                        viewBox={isLastNoteInSystem ? "0 0 34 12" : isLastNoteInBar ? "0 0 38 12" : "0 0 26 12"}
                                      >
                                        <path
                                          d={
                                            isLastNoteInSystem 
                                              ? "M 2 2 Q 17 11 32 2"
                                              : isLastNoteInBar 
                                              ? "M 2 2 Q 19 11 36 2" 
                                              : "M 2 2 Q 13 10 24 2"
                                          }
                                          fill="none"
                                          stroke="#e6b769"
                                          strokeWidth="2.2"
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Barline between bars in this system */}
                          {barInfo.localBarIdx < system.bars.length - 1 && (
                            <div className="w-[1.5px] h-8 sm:h-9 bg-white/40 shrink-0 ml-2 sm:ml-3 mr-0.5 select-none" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* End of System Barline: Double barline on last line of piece, single on continuing lines */}
                  <div className="flex items-center gap-0.5 shrink-0 ml-2 sm:ml-3 z-10 select-none">
                    {isLastSystem ? (
                      <>
                        <div className="w-[1.5px] h-8 sm:h-9 bg-white/35" />
                        <div className="w-1 h-8 sm:h-9 bg-[#c49750]/90 rounded-sm" />
                      </>
                    ) : (
                      <div className="w-[1.5px] h-8 sm:h-9 bg-white/35" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] font-serif italic text-[#dedacf]/80 max-w-sm mx-auto text-center mt-2">
            “{isDe ? currentExercise.descriptionDe : currentExercise.description}”
          </p>
        </div>

        {/* 4. VERTICALLY ANCHORED STRIKING DECK: Single button on PC, Dual buttons on Mobile/Tablet */}
        <div className="my-2 space-y-1.5">
          {/* Desktop / PC: ONE single wide button */}
          <div className="hidden sm:block">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                handleUserTap('single');
              }}
              className={`w-full h-24 sm:h-26 rounded-2xl border flex items-center justify-center gap-3 transition-all duration-75 select-none cursor-pointer ${
                padPressed
                  ? 'bg-gradient-to-r from-[#c49750] to-[#ffd56b] text-black border-[#ffd56b] shadow-[0_0_25px_rgba(196,151,80,0.85)] scale-[0.98]'
                  : 'bg-[#151824] hover:bg-[#1b2132] active:scale-[0.98] text-[#fbf9f5] border-white/10 shadow-lg'
              }`}
            >
              <span className="text-3xl">🥁</span>
              <span className="text-base font-bold font-mono uppercase tracking-widest text-[#fbf9f5]">
                {isDe ? 'Trommeln' : 'Tap / Beat'}
              </span>
              <span className="text-[11px] font-mono text-[#8c887d] ml-2">
                (Spacebar / Click)
              </span>
            </button>
          </div>

          {/* Phone & Tablet: TWO buttons side-by-side */}
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                handleUserTap('left');
              }}
              className={`h-24 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-75 select-none cursor-pointer ${
                leftPadPressed
                  ? 'bg-gradient-to-br from-[#c49750] to-[#ffd56b] text-black border-[#ffd56b] shadow-[0_0_20px_rgba(196,151,80,0.85)] scale-95'
                  : 'bg-[#151824] active:scale-95 text-[#fbf9f5] border-white/10 shadow-lg'
              }`}
            >
              <span className="text-2xl">🥁</span>
              <span className="text-xs font-bold font-mono uppercase tracking-wider">
                {isDe ? 'Trommel' : 'Beat'}
              </span>
            </button>

            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                handleUserTap('right');
              }}
              className={`h-24 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-75 select-none cursor-pointer ${
                rightPadPressed
                  ? 'bg-gradient-to-br from-[#c49750] to-[#ffd56b] text-black border-[#ffd56b] shadow-[0_0_20px_rgba(196,151,80,0.85)] scale-95'
                  : 'bg-[#151824] active:scale-95 text-[#fbf9f5] border-white/10 shadow-lg'
              }`}
            >
              <span className="text-2xl">🥁</span>
              <span className="text-xs font-bold font-mono uppercase tracking-wider">
                {isDe ? 'Trommel' : 'Beat'}
              </span>
            </button>
          </div>
        </div>

        {/* 5. ANCHORED RESULTS & STATUS DECK (Always located below pads, prevents layout jump!) */}
        <div className="min-h-[110px] sm:min-h-[120px] flex items-center justify-center">
          {state === 'SUMMARY' && detectedBpm !== null && precisionScore !== null ? (
            /* Large, Prominent Results Display */
            <div className="w-full p-3 sm:p-4 rounded-xl bg-[#0b0f1a] border border-[#c49750]/50 text-center animate-fade-in shadow-xl">
              <div className="flex items-center justify-around gap-2 mb-2">
                {/* Big Rhythmic Accuracy Metric */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8c887d]">
                    {isDe ? 'Präzision' : 'Rhythmic Accuracy'}
                  </span>
                  <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight drop-shadow-md ${
                    precisionScore >= 80 ? 'text-emerald-400' : precisionScore >= 65 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {precisionScore}%
                  </span>
                </div>

                <div className="w-[1px] h-10 bg-white/10" />

                {/* Detected Tempo Metric */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8c887d]">
                    {isDe ? 'Dein Tempo' : 'Your Tempo'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#ffd56b] mt-1">
                    {detectedBpm} <span className="text-xs font-normal text-[#8c887d]">BPM</span>
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#dedacf] font-serif italic mb-2.5 max-w-md mx-auto">
                {feedbackMessage}
              </p>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => resetToReady()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#181c28] hover:bg-[#222738] border border-white/10 text-xs font-mono text-white transition-colors cursor-pointer"
                >
                  {isDe ? 'Nochmal schlagen' : 'Beat Again'}
                </button>
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isDe ? 'Nächster Rhythmus' : 'Next Rhythm'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : state === 'TAPPING' ? (
            /* Live Tapping Feedback in the same area */
            <div className="w-full py-3 px-4 rounded-xl bg-[#0c0f18] border border-white/5 text-center flex flex-col items-center justify-center gap-1.5 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-mono text-[#ffd56b]">
                <span className="w-2 h-2 rounded-full bg-[#ffd56b] animate-ping" />
                <span className="font-bold">
                  {isDe ? `Trommle: Schlag ${tapsCount} von ${totalPlayableCount}` : `Beating: Note ${tapsCount} of ${totalPlayableCount}`}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#8c887d]">
                {isDe ? 'Spiele in deinem eigenen, gleichmäßigen Tempo...' : 'Play at your own steady groove...'}
              </p>
            </div>
          ) : (
            /* Ready Prompt in the same area */
            <div className="w-full py-3 px-4 rounded-xl bg-[#0c0f18]/60 border border-white/5 text-center flex flex-col items-center justify-center gap-1">
              <span className="text-xs font-mono text-[#c49750] font-semibold">
                {isDe ? 'Startbereit: Schlage den Rhythmus wann immer du willst' : 'Ready: Strike the rhythm whenever you are ready'}
              </span>
              <span className="text-[10px] font-mono text-[#8c887d]">
                {isDe ? `Musterlänge: ${totalPlayableCount} Noten · Die App folgt deinem Tempo` : `Pattern length: ${totalPlayableCount} notes · The app dynamically matches your tempo`}
              </span>
            </div>
          )}
        </div>

        {/* 6. Top 10 Leaderboard Modal */}
        {showLeaderboard && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLeaderboard(false);
            }}
          >
            <div className="relative w-full max-w-sm rounded-2xl bg-[#121622] border border-[#c49750]/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-left">
              <button
                type="button"
                onClick={() => setShowLeaderboard(false)}
                className="absolute top-3.5 right-3.5 p-1 rounded-lg text-[#8c887d] hover:text-white bg-[#181c28] border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c49750] mb-3">
                <Trophy className="w-4 h-4 text-[#c49750]" />
                <span>{isDe ? 'Top 10 Rhythmus-Bestenliste' : 'Top 10 Rhythm Scores'}</span>
              </div>

              {/* Player Name Input */}
              <div className="mb-4">
                <label className="text-[10px] font-mono text-[#8c887d] block mb-1">
                  {isDe ? 'Dein Name:' : 'Your Name:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={14}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b0d13] border border-white/20 text-xs text-[#fbf9f5] font-mono focus:border-[#c49750] outline-none"
                    placeholder="Drummer"
                  />
                  <button
                    type="button"
                    onClick={saveScoreToLeaderboard}
                    disabled={score <= 0}
                    className="px-3 py-1.5 rounded-lg bg-[#c49750] text-black font-semibold text-xs uppercase cursor-pointer disabled:opacity-40"
                  >
                    {isDe ? 'Speichern' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="max-h-60 overflow-y-auto space-y-1.5 thin-scrollbar pr-1">
                {leaderboard.length === 0 ? (
                  <p className="text-xs font-mono text-[#6e6a60] text-center py-4">
                    {isDe ? 'Noch keine Einträge. Trommle einen Rhythmus!' : 'No entries yet. Beat a rhythm!'}
                  </p>
                ) : (
                  leaderboard.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#0d1017] border border-white/5 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#c49750] font-bold w-4">#{idx + 1}</span>
                        <span className="text-[#fbf9f5]">{item.name}</span>
                        <span className="text-[10px] text-[#8c887d]">
                          {item.difficulty === 1 ? 'L1' : item.difficulty === 2 ? 'L2' : 'L3'} ({item.bpm} BPM)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">{item.score} pts</span>
                        <span className="text-[10px] text-[#6e6a60]">{item.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
