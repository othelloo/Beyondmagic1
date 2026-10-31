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
  timeSignature: string; // e.g. "4/4", "3/4", "2/4", "6/8", "7/8", "5/8"
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

// ============================================================================
// 1. LEVEL 1: Exactly 4 bars, classical foundational meters (4/4, 3/4, 2/4)
// Perfectly balanced, no barlines ties, steady pulse.
// ============================================================================
export const RHYTHMS_LEVEL_1: RhythmExercise[] = [
  {
    id: 'r1-four-bars-march',
    name: 'Even March (4/4, 4 Bars)',
    nameDe: 'Gleichmäßiger Marsch (4/4, 4 Takte)',
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
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '4 solid measures of 4/4. Steady quarter notes and sustained half notes.',
    descriptionDe: '4 Takte im 4/4-Takt mit gleichmäßigen Vierteln und Halben Noten.'
  },
  {
    id: 'r1-four-bars-waltz',
    name: 'Lyrical Waltz (3/4, 4 Bars)',
    nameDe: 'Lyrischer Walzer (3/4, 4 Takte)',
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
      },
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
          { type: 'dotted-half', duration: 3 },
        ]
      }
    ],
    description: '4 flowing measures of 3/4 waltz rhythm concluding on a dotted half note.',
    descriptionDe: '4 fließende Takte im 3/4-Walzertakt mit punktierter Halber Note als Abschluss.'
  },
  {
    id: 'r1-four-bars-gavotte',
    name: 'Classical Gavotte (2/4, 4 Bars)',
    nameDe: 'Klassische Gavotte (2/4, 4 Takte)',
    level: 1,
    bars: [
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '4 lively measures in 2/4 meter. Quarters introducing flowing eighths.',
    descriptionDe: '4 Takte im 2/4-Takt mit präzisem Viertel- und Achtel-Wechsel.'
  },
  {
    id: 'r1-four-bars-choral',
    name: 'Solemn Choral (4/4, 4 Bars)',
    nameDe: 'Feierlicher Choral (4/4, 4 Takte)',
    level: 1,
    bars: [
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'rest-quarter', duration: 1, isRest: true },
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
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '4 dignified measures featuring meditative quarter rest.',
    descriptionDe: '4 getragene Choral-Takte mit Viertelpause und vollen Halben Noten.'
  },
  {
    id: 'r1-four-bars-berceuse',
    name: 'Gentle Berceuse (3/4, 4 Bars)',
    nameDe: 'Sanfte Wiege (3/4, 4 Takte)',
    level: 1,
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
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
          { type: 'quarter', duration: 1 },
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
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'dotted-half', duration: 3 },
        ]
      }
    ],
    description: '4 measures of French pastoral lullaby in 3/4 meter.',
    descriptionDe: '4 Takte französisches Wiegenlied im 3/4-Takt.'
  },
  {
    id: 'r1-four-bars-allegretto',
    name: 'Allegretto Sonatina (2/4, 4 Bars)',
    nameDe: 'Allegretto Sonatine (2/4, 4 Takte)',
    level: 1,
    bars: [
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '4 cheerful measures in classic sonatina style.',
    descriptionDe: '4 muntere Takte im heiteren Sonatinenstil.'
  }
];

// ============================================================================
// 2. LEVEL 2: Exactly 8 bars, rich phrasing, 6/8 beamed in 3s, zero math bugs!
// ============================================================================
export const RHYTHMS_LEVEL_2: RhythmExercise[] = [
  {
    id: 'r2-eight-bars-pastoral-sicilienne',
    name: 'Pastoral Sicilienne (6/8, 8 Bars)',
    nameDe: 'Pastorale Sizilienne (6/8, 8 Takte)',
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
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
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
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
        ]
      },
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
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'dotted-quarter', duration: 3 },
        ]
      }
    ],
    description: '8 measures of compound duple (6/8). Flowing pastoral barcarolle with triplet eighths.',
    descriptionDe: '8 Takte im 6/8-Takt mit wiegendem Barcarole-Schwung und sauber gebündelten Dreier-Achteln.'
  },
  {
    id: 'r2-eight-bars-syncopated-suite',
    name: 'Syncopated Suite (4/4, 8 Bars)',
    nameDe: 'Synkopierte Suite (4/4, 8 Takte)',
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
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 }, // Strictly 1+1+0.5+0.5+1 = 4.0!
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'half', duration: 2 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'dotted-quarter', duration: 1.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
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
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '8 measures of classical 4/4 phrasing with syncopated eighths and crisp pauses.',
    descriptionDe: '8 Takte 4/4 mit rhythmischen Achtel-Akzenten und exakter Taktmathematik.'
  },
  {
    id: 'r2-eight-bars-grand-chaconne',
    name: 'Grand Chaconne (3/4, 8 Bars)',
    nameDe: 'Große Chaconne (3/4, 8 Takte)',
    level: 2,
    bars: [
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'dotted-quarter', duration: 1.5 },
          { type: 'eighth', duration: 0.5 },
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
      },
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
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'dotted-half', duration: 3 },
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
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
        ]
      },
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
          { type: 'dotted-half', duration: 3 },
        ]
      }
    ],
    description: '8 stately measures of baroque chaconne in 3/4 with second-beat gravity.',
    descriptionDe: '8 getragene Takte einer barocken Chaconne mit Schwerpunkt auf Schlag 2.'
  },
  {
    id: 'r2-eight-bars-rondo-march',
    name: 'Rondo March (2/4, 8 Bars)',
    nameDe: 'Rondo-Marsch (2/4, 8 Takte)',
    level: 2,
    bars: [
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'dotted-quarter', duration: 1.5 },
          { type: 'eighth', duration: 0.5 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
        ]
      },
      {
        timeSignature: '2/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '8 brisk measures in 2/4 classical divertimento style.',
    descriptionDe: '8 lebhafte Takte im heiteren klassischen Divertimento-Stil.'
  }
];

// ============================================================================
// 3. LEVEL 3: Exactly 12 bars! Virtuosic phrasing with mixed sixteenths/eighths,
// beamed quartets, eighth + 2 sixteenths, and rare clean single barlines ties.
// ============================================================================
export const RHYTHMS_LEVEL_3: RhythmExercise[] = [
  {
    id: 'r3-twelve-bars-classical-concerto',
    name: 'Classical Concerto (4/4, 12 Bars)',
    nameDe: 'Klassisches Konzert (4/4, 12 Takte)',
    level: 3,
    bars: [
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
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
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 }, // Eighth + 2 sixteenths!
          { type: 'dotted-quarter', duration: 1.5 },
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
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'eighth', duration: 0.5 }, // 2 sixteenths + eighth!
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
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'quarter', duration: 1 },
          { type: 'half', duration: 2 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
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
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
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
          { type: 'dotted-quarter', duration: 1.5 },
          { type: 'eighth', duration: 0.5 },
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
          { type: 'quarter', duration: 1, tiedToNext: true }, // Single clean liaison
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
          { type: 'half', duration: 2 },
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '12 expansive measures in 4/4. Virtuosic sixteenth beams, mixed eighth-sixteenth figures, and balanced phrasing.',
    descriptionDe: '12 weite Takte in 4/4 mit Sechzehntel-Vierern, gemischten Achtel-Sechzehntel-Figuren und Haltebogen.'
  },
  {
    id: 'r3-twelve-bars-french-arabesque',
    name: 'French Arabesque (3/4, 12 Bars)',
    nameDe: 'Französische Arabeske (3/4, 12 Takte)',
    level: 3,
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
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      },
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
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'dotted-quarter', duration: 1.5 },
          { type: 'eighth', duration: 0.5 },
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
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'half', duration: 2 },
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'eighth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
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
          { type: 'dotted-half', duration: 3 },
        ]
      }
    ],
    description: '12 measures of Debussy-like impressionist arabesques in 3/4 meter.',
    descriptionDe: '12 Takte impressionistischer Sechzehntel-Arabesken im 3/4-Takt.'
  },
  {
    id: 'r3-twelve-bars-barcarolle-allegro',
    name: 'Barcarolle Presto (6/8, 12 Bars)',
    nameDe: 'Barcarole Presto (6/8, 12 Takte)',
    level: 3,
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
          { type: 'sixteenth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'eighth', duration: 1 },
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
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
        ]
      },
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
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'eighth', duration: 1 },
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'eighth', duration: 1 },
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
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
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'dotted-quarter', duration: 3 },
        ]
      }
    ],
    description: '12 measures of spirited Mediterranean barcarolle in 6/8 with virtuosic sixteenth turns.',
    descriptionDe: '12 temperamentvolle Takte im 6/8-Takt mit schnellen Sechzehntel-Figuren.'
  }
];

// ============================================================================
// Mathematical Validator
// ============================================================================
export function validateRhythmExercise(ex: RhythmExercise): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  ex.bars.forEach((bar, bIdx) => {
    const parts = bar.timeSignature.split('/');
    if (parts.length !== 2) {
      errors.push(`[${ex.id}] Bar ${bIdx + 1}: Invalid timeSignature '${bar.timeSignature}'. Expected format 'N/D'.`);
      return;
    }
    const num = parseInt(parts[0], 10);
    const den = parseInt(parts[1], 10);
    if (isNaN(num) || isNaN(den) || den === 0) {
      errors.push(`[${ex.id}] Bar ${bIdx + 1}: Non-numeric time signature '${bar.timeSignature}'.`);
      return;
    }

    const expectedDuration = bar.unit === 'quarter' ? (num / den) * 4 : (num / den) * 8;
    const actualDuration = bar.notes.reduce((sum, n) => sum + n.duration, 0);

    if (Math.abs(actualDuration - expectedDuration) > 0.0001) {
      errors.push(
        `[${ex.id} - ${ex.name}] Bar ${bIdx + 1}: Duration mismatch! Meter is ${bar.timeSignature} (expects ${expectedDuration} ${bar.unit} beats), but notes sum to ${actualDuration} ${bar.unit} beats.`
      );
    }
  });

  return { valid: errors.length === 0, errors };
}

export function validateAllRhythms(): boolean {
  const allExercises = [...RHYTHMS_LEVEL_1, ...RHYTHMS_LEVEL_2, ...RHYTHMS_LEVEL_3];
  let allValid = true;

  allExercises.forEach((ex) => {
    const res = validateRhythmExercise(ex);
    if (!res.valid) {
      allValid = false;
      console.error(`🚨 Rhythm Validation Failure in "${ex.id}":\n`, res.errors.join('\n'));
    }
  });

  return allValid;
}
