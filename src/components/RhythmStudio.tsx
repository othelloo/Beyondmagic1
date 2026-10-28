import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, RotateCcw, Trophy, Music, Flame, Award, ChevronRight, X, Clock, CheckCircle2 } from 'lucide-react';

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
// 1. LEVEL 1: Exactly 2 bars, simple classical meters (4/4, 3/4, 2/4), two bars close
// No irregular signatures (no 5/4 or 7/8). No cross-bar ties.
// ============================================================================
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
  },
  {
    id: 'r1-duple-gavotte',
    name: 'Classical Gavotte (2/4)',
    nameDe: 'Klassische Gavotte (2/4)',
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
      }
    ],
    description: 'Two lively measures of 2/4. Clean quarters leading into eighths.',
    descriptionDe: 'Zwei lebendige Takte im 2/4-Takt. Klare Viertel führen in fließende Achtel.'
  },
  {
    id: 'r1-hymn-cadence',
    name: 'Choral Cadence (4/4)',
    nameDe: 'Choralschluss (4/4)',
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
      }
    ],
    description: 'A solemn four-four choral cadence featuring a meditative breath rest.',
    descriptionDe: 'Ein feierlicher Choral-Abschluss mit bewusster Atempause.'
  },
  {
    id: 'r1-sarabande-solemn',
    name: 'Noble Sarabande (3/4)',
    nameDe: 'Edle Sarabande (3/4)',
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
          { type: 'dotted-half', duration: 3 },
        ]
      }
    ],
    description: '3/4 baroque dance placing expressive weight on beat two.',
    descriptionDe: '3/4 Barocktanz mit getragenem Schwerpunkt auf dem zweiten Schlag.'
  },
  {
    id: 'r1-fanfare-pulse',
    name: 'Fanfare Pulse (4/4)',
    nameDe: 'Fanfaren-Puls (4/4)',
    level: 1,
    bars: [
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
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
          { type: 'half', duration: 2 },
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: 'Crisp marching pulse with eighth-note heraldry.',
    descriptionDe: 'Präziser Marschimpuls mit rhythmischem Achtel-Schwung.'
  },
  {
    id: 'r1-lullaby-flow',
    name: 'Gentle Berceuse (3/4)',
    nameDe: 'Sanfte Wiege (3/4)',
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
          { type: 'quarter', duration: 1 },
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: 'Flowing French lullaby phrasing in 3/4 meter.',
    descriptionDe: 'Fließendes Wiegenlied im 3/4-Takt.'
  },
  {
    id: 'r1-sonata-allegro',
    name: 'Sonatina Theme (2/4)',
    nameDe: 'Sonatinen-Thema (2/4)',
    level: 1,
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
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: 'Two measures of concise classical clarity in 2/4.',
    descriptionDe: 'Zwei Takte von klassischer Klarheit im 2/4-Takt.'
  }
];

// ============================================================================
// 2. LEVEL 2: Exactly 4 bars (standardized length), richer meters (4/4, 3/4, 6/8, 2/4)
// Cross-bar liaisons drastically reduced (almost zero ties).
// ============================================================================
const RHYTHMS_LEVEL_2: RhythmExercise[] = [
  {
    id: 'r2-four-bars-pastoral',
    name: 'Pastoral Sicilienne (6/8, 4 Bars)',
    nameDe: 'Pastorale Sizilienne (6/8, 4 Takte)',
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
      }
    ],
    description: '4 measures of compound duple (6/8). Lilting pastoral pulse without ties.',
    descriptionDe: '4 Takte im 6/8-Takt mit wiegendem Sicilienne-Schwung ohne Bindungen.'
  },
  {
    id: 'r2-four-bars-syncopated-groove',
    name: 'Syncopated Suite (4/4, 4 Bars)',
    nameDe: 'Synkopierte Suite (4/4, 4 Takte)',
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
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '4 balanced measures in 4/4 with eighth-note offbeats and rests.',
    descriptionDe: '4 Takte 4/4 mit rhythmischen Achtel-Akzenten und Pausen.'
  },
  {
    id: 'r2-four-bars-chaconne',
    name: 'Grand Chaconne (3/4, 4 Bars)',
    nameDe: 'Große Chaconne (3/4, 4 Takte)',
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
      }
    ],
    description: '4 stately measures of 3/4 chaconne phrasing with dotted quarter rhythms.',
    descriptionDe: '4 getragene Takte einer barocken Chaconne mit punktierten Vierteln.'
  },
  {
    id: 'r2-four-bars-balkan-seven',
    name: 'Balkan Dance (7/8, 4 Bars)',
    nameDe: 'Balkan-Tanz (7/8, 4 Takte)',
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
          { type: 'quarter', duration: 2 },
          { type: 'quarter', duration: 2 },
          { type: 'dotted-quarter', duration: 3 },
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'quarter', duration: 2 },
          { type: 'quarter', duration: 2 },
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
          { type: 'quarter', duration: 2 },
        ]
      }
    ],
    description: '4 measures of asymmetric 7/8 pulse (3+2+2 into 2+2+3).',
    descriptionDe: '4 Takte asymmetrischer 7/8-Rhythmus mit wechselnder Betonung.'
  },
  {
    id: 'r2-four-bars-rondo-march',
    name: 'Rondo March (2/4, 4 Bars)',
    nameDe: 'Rondo-Marsch (2/4, 4 Takte)',
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
      }
    ],
    description: '4 energetic measures in 2/4 classical sonata style.',
    descriptionDe: '4 lebhafte Takte im klassischen 2/4 Sonatenstil.'
  },
  {
    id: 'r2-four-bars-metric-shift',
    name: 'Metric Transition (3/4 → 4/4, 4 Bars)',
    nameDe: 'Taktwechsel-Fluss (3/4 → 4/4, 4 Takte)',
    level: 2,
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
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: 'Two measures of 3/4 transitioning cleanly into two measures of 4/4.',
    descriptionDe: 'Zwei Takte 3/4 wechseln nahtlos in zwei Takte 4/4.'
  },
  {
    id: 'r2-four-bars-tarentella',
    name: 'Neapolitan Tarantella (6/8, 4 Bars)',
    nameDe: 'Neapolitanische Tarantella (6/8, 4 Takte)',
    level: 2,
    bars: [
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
          { type: 'dotted-quarter', duration: 3 },
        ]
      }
    ],
    description: '4 measures of brisk Mediterranean dance with rolling eighths.',
    descriptionDe: '4 Takte temperamentvoller Mittelmeertanz mit sprudelnden Achteln.'
  },
  {
    id: 'r2-four-bars-dotted-grandeur',
    name: 'French Overture (4/4, 4 Bars)',
    nameDe: 'Französische Ouvertüre (4/4, 4 Takte)',
    level: 2,
    bars: [
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
          { type: 'half', duration: 2 },
          { type: 'dotted-quarter', duration: 1.5 },
          { type: 'eighth', duration: 0.5 },
        ]
      },
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'rest-quarter', duration: 1, isRest: true },
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
    description: 'Stately baroque majesty with sharp dotted rhythms.',
    descriptionDe: 'Majestätischer Barockcharakter mit punktierten Rhythmen.'
  },
  {
    id: 'r2-four-bars-five-eight',
    name: 'Aegean Wave (5/8, 4 Bars)',
    nameDe: 'Ägäische Welle (5/8, 4 Takte)',
    level: 2,
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
          { type: 'quarter', duration: 2 },
          { type: 'dotted-quarter', duration: 3 },
        ]
      },
      {
        timeSignature: '5/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'quarter', duration: 2 },
        ]
      },
      {
        timeSignature: '5/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
        ]
      }
    ],
    description: '4 measures of swaying 5/8 (3+2 and 2+3 subdivisions).',
    descriptionDe: '4 Takte wiegendes 5/8-Metrum mit 3+2 und 2+3 Unterteilung.'
  },
  {
    id: 'r2-four-bars-polonaise',
    name: 'Chopin Polonaise (3/4, 4 Bars)',
    nameDe: 'Polonaise-Rhythmus (3/4, 4 Takte)',
    level: 2,
    bars: [
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
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
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
    description: 'Classical Polish courtly rhythm with sixteenth-note flourish.',
    descriptionDe: 'Klassischer höfischer Polonaiserhythmus mit Sechzehntel-Auftakt.'
  }
];

// ============================================================================
// 3. LEVEL 3: Exactly 6 BARS! Includes 1/16 notes, syncopations, and subtle liaisons.
// Cross-bar ties are used sparingly (at most 1 or 2 per 6-bar piece) for musical expression.
// ============================================================================
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
          { type: 'quarter', duration: 1 },
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
          { type: 'quarter', duration: 1, tiedToNext: true }, // 1 subtle musical tie
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
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '6 measures in 4/4 with beamed sixteenth groups and a lyrical barline tie.',
    descriptionDe: '6 Takte 4/4 mit Sechzehntel-Vierergruppen und musikalischem Haltebogen.'
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
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1, tiedToNext: true }, // Subtle liaison
        ]
      },
      {
        timeSignature: '3/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1, isTiedFromPrev: true },
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
      }
    ],
    description: '6 measures in 3/4 with fluid sixteenth arabesques and expressive phrasing.',
    descriptionDe: '6 Takte im 3/4-Takt mit fließenden Sechzehntel-Arabesken.'
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
          { type: 'quarter', duration: 2 },
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1 },
          { type: 'quarter', duration: 2 },
          { type: 'quarter', duration: 2, tiedToNext: true }, // Single tie
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'quarter', duration: 2, isTiedFromPrev: true },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'eighth', duration: 1 },
          { type: 'dotted-quarter', duration: 3 },
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'quarter', duration: 2 },
        ]
      },
      {
        timeSignature: '7/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
          { type: 'quarter', duration: 2 },
        ]
      }
    ],
    description: '6 measures of 7/8 with rapid sixteenth snaps and syncopations.',
    descriptionDe: '6 Takte im 7/8-Takt mit Sechzehntel-Figuren und lebhaftem Rhythmus.'
  },
  {
    id: 'r3-six-bars-sicilienne',
    name: 'Compound Sicilienne (6/8, 6 Bars)',
    nameDe: 'Pastorale Sizilienne (6/8, 6 Takte)',
    level: 3,
    bars: [
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
          { type: 'sixteenth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'quarter', duration: 2 },
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
          { type: 'eighth', duration: 1, tiedToNext: true }, // Liaison into bar 5
        ]
      },
      {
        timeSignature: '6/8',
        unit: 'eighth',
        notes: [
          { type: 'eighth', duration: 1, isTiedFromPrev: true },
          { type: 'quarter', duration: 2 },
          { type: 'dotted-quarter', duration: 3 },
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
    description: '6 measures in 6/8 compound meter with lilting dotted pulses and sixteenth ornamentation.',
    descriptionDe: '6 Takte im 6/8-Takt mit wiegender Bewegung und Sechzehntel-Figuren.'
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
          { type: 'sixteenth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.5 },
          { type: 'eighth', duration: 1 },
          { type: 'eighth', duration: 1 },
          { type: 'quarter', duration: 2 },
        ]
      },
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
          { type: 'quarter', duration: 2 },
          { type: 'dotted-quarter', duration: 3 },
          { type: 'quarter', duration: 2 },
        ]
      }
    ],
    description: '6 shifting measures (5/8 into 6/8 into 7/8) with sixteenth subdivisions.',
    descriptionDe: '6 wechselnde Takte (5/8 in 6/8 in 7/8) mit Sechzehntel-Noten.'
  },
  {
    id: 'r3-six-bars-toccata',
    name: 'Baroque Toccata (4/4, 6 Bars)',
    nameDe: 'Barocke Toccata (4/4, 6 Takte)',
    level: 3,
    bars: [
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
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'eighth', duration: 0.5 },
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
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
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
    description: '6 measures of virtuoso keyboard motor with sixteenth-note motorics.',
    descriptionDe: '6 Takte virtuose Toccata mit präziser Sechzehntel-Motorik.'
  },
  {
    id: 'r3-six-bars-faurian-flow',
    name: 'Fauré Pavane Rhythm (4/4, 6 Bars)',
    nameDe: 'Fauré Pavane Rhythmus (4/4, 6 Takte)',
    level: 3,
    bars: [
      {
        timeSignature: '4/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
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
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'half', duration: 2 },
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
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '6 measures capturing the elegant sixteenth-note lilt of French Pavane.',
    descriptionDe: '6 Takte im eleganten Rhythmus der französischen Pavane.'
  },
  {
    id: 'r3-six-bars-rhapsodic-five',
    name: 'Asymmetric Flow (5/4, 6 Bars)',
    nameDe: 'Asymmetrischer Fluss (5/4, 6 Takte)',
    level: 3,
    bars: [
      {
        timeSignature: '5/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'half', duration: 2 },
        ]
      },
      {
        timeSignature: '5/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'half', duration: 2 },
        ]
      },
      {
        timeSignature: '5/4',
        unit: 'quarter',
        notes: [
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'sixteenth', duration: 0.25 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'half', duration: 2 },
        ]
      },
      {
        timeSignature: '5/4',
        unit: 'quarter',
        notes: [
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '5/4',
        unit: 'quarter',
        notes: [
          { type: 'half', duration: 2 },
          { type: 'quarter', duration: 1 },
          { type: 'eighth', duration: 0.5 },
          { type: 'eighth', duration: 0.5 },
          { type: 'quarter', duration: 1 },
        ]
      },
      {
        timeSignature: '5/4',
        unit: 'quarter',
        notes: [
          { type: 'dotted-half', duration: 3 },
          { type: 'half', duration: 2 },
        ]
      }
    ],
    description: '6 measures in expansive 5/4 meter with 3+2 natural vocal cadence.',
    descriptionDe: '6 weite Takte im 5/4-Takt mit natürlicher 3+2 Gesangsbewegung.'
  }
];

// ============================================================================
// Strict Mathematical Validation Engine
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

  // Verify ties across notes
  const flatNotes: { note: RhythmNote; bIdx: number; nIdx: number }[] = [];
  ex.bars.forEach((bar, bIdx) => {
    bar.notes.forEach((note, nIdx) => {
      flatNotes.push({ note, bIdx, nIdx });
    });
  });

  flatNotes.forEach((item, idx) => {
    if (item.note.tiedToNext) {
      const nextItem = flatNotes[idx + 1];
      if (!nextItem) {
        errors.push(`[${ex.id}] Final note has tiedToNext=true but no subsequent note exists!`);
      } else if (!nextItem.note.isTiedFromPrev) {
        errors.push(
          `[${ex.id}] Bar ${item.bIdx + 1} Note ${item.nIdx + 1} has tiedToNext=true, but next note is missing isTiedFromPrev=true!`
        );
      }
    }
    if (item.note.isTiedFromPrev) {
      const prevItem = flatNotes[idx - 1];
      if (!prevItem) {
        errors.push(`[${ex.id}] First note has isTiedFromPrev=true but no previous note exists!`);
      } else if (!prevItem.note.tiedToNext) {
        errors.push(
          `[${ex.id}] Bar ${item.bIdx + 1} Note ${item.nIdx + 1} has isTiedFromPrev=true, but previous note is missing tiedToNext=true!`
        );
      }
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

// Run validation immediately on load
if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
  validateAllRhythms();
}

// ============================================================================
// High-Fidelity Music Notation Components (Henle / Durand Classical Engraving)
// ============================================================================

// Beamed Group of 4 Sixteenth Notes (Takes ~48px total, only slightly more than a quarter note!)
export const BeamedSixteenthQuartet: React.FC = () => (
  <svg viewBox="0 0 54 36" className="w-12 h-8 sm:w-13 sm:h-9 overflow-visible select-none shrink-0">
    {/* Double horizontal beams connecting all 4 stems across the top */}
    <line x1="14" y1="5" x2="50" y2="5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="14" y1="9.5" x2="50" y2="9.5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />

    {/* Note 1 */}
    <ellipse cx="9" cy="27" rx="5" ry="3.2" transform="rotate(-25 9 27)" fill="#fbf9f5" />
    <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    {/* Note 2 */}
    <ellipse cx="21" cy="27" rx="5" ry="3.2" transform="rotate(-25 21 27)" fill="#fbf9f5" />
    <line x1="26" y1="25" x2="26" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    {/* Note 3 */}
    <ellipse cx="33" cy="27" rx="5" ry="3.2" transform="rotate(-25 33 27)" fill="#fbf9f5" />
    <line x1="38" y1="25" x2="38" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    {/* Note 4 */}
    <ellipse cx="45" cy="27" rx="5" ry="3.2" transform="rotate(-25 45 27)" fill="#fbf9f5" />
    <line x1="50" y1="25" x2="50" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />
  </svg>
);

// Beamed Duo of 2 Sixteenth Notes (Takes ~28px)
export const BeamedSixteenthDuo: React.FC = () => (
  <svg viewBox="0 0 32 36" className="w-7 h-8 sm:w-8 sm:h-9 overflow-visible select-none shrink-0">
    <line x1="14" y1="5" x2="26" y2="5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="14" y1="9.5" x2="26" y2="9.5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />

    <ellipse cx="9" cy="27" rx="5" ry="3.2" transform="rotate(-25 9 27)" fill="#fbf9f5" />
    <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="21" cy="27" rx="5" ry="3.2" transform="rotate(-25 21 27)" fill="#fbf9f5" />
    <line x1="26" y1="25" x2="26" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />
  </svg>
);

// Beamed Pair of 2 Eighth Notes (Takes ~34px)
export const BeamedEighthPair: React.FC = () => (
  <svg viewBox="0 0 38 36" className="w-8 h-8 sm:w-9 sm:h-9 overflow-visible select-none shrink-0">
    <line x1="14" y1="5" x2="32" y2="5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />

    <ellipse cx="9" cy="27" rx="5" ry="3.2" transform="rotate(-25 9 27)" fill="#fbf9f5" />
    <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="27" cy="27" rx="5" ry="3.2" transform="rotate(-25 27 27)" fill="#fbf9f5" />
    <line x1="32" y1="25" x2="32" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />
  </svg>
);

// Individual Fine Musical Note Glyphs
export const FineMusicNote: React.FC<{ type: RhythmNoteType }> = ({ type }) => {
  switch (type) {
    case 'half':
      return (
        <svg viewBox="0 0 26 36" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="none"
            stroke="#fbf9f5"
            strokeWidth="1.5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'dotted-half':
      return (
        <svg viewBox="0 0 30 36" className="w-6 h-7 sm:w-7 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="none"
            stroke="#fbf9f5"
            strokeWidth="1.5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="20" cy="27" r="1.8" fill="#fbf9f5" />
        </svg>
      );
    case 'quarter':
      return (
        <svg viewBox="0 0 26 36" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="#fbf9f5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'dotted-quarter':
      return (
        <svg viewBox="0 0 30 36" className="w-6 h-7 sm:w-7 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="#fbf9f5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="20" cy="27" r="1.8" fill="#fbf9f5" />
        </svg>
      );
    case 'eighth':
      return (
        <svg viewBox="0 0 26 36" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="#fbf9f5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          {/* Straight diagonal descending line flag */}
          <line x1="14" y1="5" x2="20" y2="15" stroke="#fbf9f5" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'sixteenth':
      return (
        <svg viewBox="0 0 26 36" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="#fbf9f5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="14" y1="5" x2="20" y2="14" stroke="#fbf9f5" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="14" y1="10" x2="20" y2="19" stroke="#fbf9f5" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'rest-quarter':
      return (
        <svg viewBox="0 0 18 36" className="w-4 h-7 sm:w-5 sm:h-8 overflow-visible select-none shrink-0">
          <path
            d="M6 7 L11 13 L5 18 L9 22 C6 25, 6 28, 9 30"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'rest-eighth':
      return (
        <svg viewBox="0 0 18 36" className="w-4 h-7 sm:w-5 sm:h-8 overflow-visible select-none shrink-0">
          <circle cx="7" cy="14" r="1.5" fill="#f59e0b" />
          <line x1="8" y1="14" x2="12" y2="9" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="12" y1="9" x2="7" y2="22" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

// ============================================================================
// Types & Main Component
// ============================================================================
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

  // Anti-repeat history buffer: keeps track of recently seen rhythm IDs
  const recentHistoryRef = useRef<string[]>([RHYTHMS_LEVEL_1[0].id]);

  // Repeat / Practice attempt tracking: repeating does not inflate score/streak
  const [isRepeatAttempt, setIsRepeatAttempt] = useState<boolean>(false);
  const [hasScoredThisExercise, setHasScoredThisExercise] = useState<boolean>(false);

  // 2-second cooldown on Next Rhythm button after exercise completes
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

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
  const [holeToleratedMessage, setHoleToleratedMessage] = useState<string | null>(null);

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

  // Clean up cooldown timer
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
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

  // Pick random rhythm with anti-repeat queue (never repeats immediately)
  const pickRhythm = useCallback((diff: RhythmDifficulty): RhythmExercise => {
    const pool = diff === 1 ? RHYTHMS_LEVEL_1 : diff === 2 ? RHYTHMS_LEVEL_2 : RHYTHMS_LEVEL_3;
    const history = recentHistoryRef.current;

    // Filter out recently played rhythms (last 4)
    const candidates = pool.filter(ex => !history.slice(-4).includes(ex.id));
    const selectionPool = candidates.length > 0 ? candidates : pool;

    const rIdx = Math.floor(Math.random() * selectionPool.length);
    const chosen = selectionPool[rIdx];

    recentHistoryRef.current = [...history.slice(-8), chosen.id];
    return chosen;
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
    setHoleToleratedMessage(null);
    setCooldownRemaining(0);
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
    setState('READY');
  }, []);

  // Switch Difficulty
  const handleSwitchDifficulty = (diff: RhythmDifficulty) => {
    setDifficulty(diff);
    setIsRepeatAttempt(false);
    setHasScoredThisExercise(false);
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

  // Start 2-second cooldown on entering SUMMARY
  const startNextCooldown = useCallback(() => {
    setCooldownRemaining(2);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    const start = Date.now();
    cooldownTimerRef.current = setInterval(() => {
      const elapsedSec = (Date.now() - start) / 1000;
      const rem = Math.max(0, 2 - elapsedSec);
      setCooldownRemaining(rem);
      if (rem <= 0 && cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }
    }, 100);
  }, []);

  // Evaluate rhythm performance with Hole / Missed-Click Fault Tolerance
  const evaluatePerformance = useCallback((taps: number[], ex: RhythmExercise) => {
    setState('SUMMARY');
    startNextCooldown();

    const pNotes = buildFlattenedPlayableNotes(ex).filter(n => !n.isRest && !n.isTiedFromPrev);
    if (taps.length < 2 || pNotes.length < 2) {
      setFeedbackMessage(isDe ? 'Bitte mindestens 2 Schläge tippen.' : 'Please tap at least 2 beats.');
      return;
    }

    // Helper: calculate precision for an aligned subset of target notes
    const testAlignment = (alignedNotes: typeof pNotes) => {
      const count = Math.min(taps.length, alignedNotes.length);
      if (count < 2) return { precision: 0, bpm: 80, avgError: 1 };

      const t0 = taps[0];
      const b0 = alignedNotes[0].offsetBeats;

      let sumNum = 0;
      let sumDenom = 0;
      for (let i = 1; i < count; i++) {
        const deltaB = alignedNotes[i].offsetBeats - b0;
        const deltaT = taps[i] - t0;
        sumNum += deltaT * deltaB;
        sumDenom += deltaB * deltaB;
      }

      const dBeat = sumDenom > 0 ? sumNum / sumDenom : 600;
      const bpm = Math.max(30, Math.min(240, Math.round(60000 / dBeat)));

      let totalErr = 0;
      for (let i = 0; i < count; i++) {
        const expected = t0 + (alignedNotes[i].offsetBeats - b0) * dBeat;
        const diffMs = Math.abs(taps[i] - expected);
        totalErr += diffMs / dBeat;
      }

      const avgErr = totalErr / count;
      const prec = Math.max(0, Math.min(100, Math.round(100 - avgErr * 135)));
      return { precision: prec, bpm, avgError: avgErr };
    };

    // 1. Direct alignment (no holes skipped)
    let bestResult = testAlignment(pNotes);
    let holeDetected = false;

    // 2. Sudden Hole / Missed-Click Fault Tolerance:
    // If a mouse click was dropped (or taps < notes), test skipping candidate note `skipIdx`
    if (taps.length <= pNotes.length) {
      for (let skipIdx = 0; skipIdx < pNotes.length; skipIdx++) {
        const candidateNotes = pNotes.filter((_, idx) => idx !== skipIdx);
        const res = testAlignment(candidateNotes);
        // If skipping this note dramatically cleans up the score (+18% or restores >= 75%)
        if (res.precision > bestResult.precision + 16 || (bestResult.precision < 65 && res.precision >= 75)) {
          bestResult = res;
          holeDetected = true;
        }
      }
    }

    setDetectedBpm(bestResult.bpm);
    setPrecisionScore(bestResult.precision);

    if (holeDetected) {
      setHoleToleratedMessage(
        isDe 
          ? '✨ 1 verpasster Klick erkannt & automatisch ausgeglichen!' 
          : '✨ 1 missed mouse click tolerated & aligned!'
      );
    } else {
      setHoleToleratedMessage(null);
    }

    // Practice / Repeat Rule:
    // Repeating the same rhythm acts as practice and preserves score/streak without adding points!
    if (isRepeatAttempt) {
      setFeedbackMessage(
        isDe
          ? 'Übungswiederholung: Präzision gemessen, Punkte & Serie bleiben unverändert erhalten.'
          : 'Practice Repeat: Precision measured, score & streak preserved.'
      );
      return;
    }

    // First attempt scoring
    if (bestResult.precision >= 80) {
      const roundScore = 180 * ex.level + (streak + 1) * 35;
      setScore(prev => prev + roundScore);
      setStreak(prev => {
        const next = prev + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
      setHasScoredThisExercise(true);
      setFeedbackMessage(
        isDe 
          ? 'Großartige Präzision! Sicher im eigenen Puls gehalten.' 
          : 'Exceptional precision! Rock-solid groove in your tempo.'
      );
    } else if (bestResult.precision >= 68) {
      const roundScore = 100 * ex.level;
      setScore(prev => prev + roundScore);
      setHasScoredThisExercise(true);
      setFeedbackMessage(
        isDe 
          ? 'Gutes Gefühl! Halte die Taktunterteilung noch gleichmäßiger.' 
          : 'Good feel! Keep your inner subdivisions steady.'
      );
    } else {
      setStreak(0);
      setFeedbackMessage(
        isDe 
          ? 'Ungleichmäßiges Tempo. Versuche einen stetigen Puls zu halten.' 
          : 'Uneven tempo. Keep a relaxed, continuous pulse.'
      );
    }
  }, [isDe, streak, isRepeatAttempt, buildFlattenedPlayableNotes, startNextCooldown]);

  // Handle User Tap (Single PC Button, Mobile Dual Pads, or Keyboard)
  const handleUserTap = useCallback((source: 'single' | 'left' | 'right' | 'key') => {
    // If in SUMMARY state, the tap button acts as "Next Rhythm" only if cooldown finished
    if (state === 'SUMMARY') {
      if (cooldownRemaining <= 0.05) {
        // Proceed to next rhythm!
        setIsRepeatAttempt(false);
        setHasScoredThisExercise(false);
        const newEx = pickRhythm(difficulty);
        setCurrentExercise(newEx);
        resetToReady();
      }
      return;
    }

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

    const now = performance.now();
    const updated = [...tapTimesRef.current, now];
    tapTimesRef.current = updated;
    const currentCount = updated.length;
    setTapsCount(currentCount);

    if (state === 'READY') {
      setState('TAPPING');
    }

    // Finish when all playable notes in the score have been tapped
    if (currentCount >= totalPlayableCount) {
      setTimeout(() => {
        evaluatePerformance(updated, currentExercise);
      }, 250);
    }
  }, [state, cooldownRemaining, totalPlayableCount, difficulty, pickRhythm, playTaikoSound, evaluatePerformance, currentExercise, resetToReady]);

  // Keyboard shortcut listener: Spacebar and any Arrow key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space' || e.code === 'Enter' || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) || e.key === 'k' || e.key === 'j') {
        e.preventDefault();
        handleUserTap('key');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUserTap]);

  // "Beat Again" button: repeat the same rhythm as practice (score stays preserved)
  const handleBeatAgain = () => {
    setIsRepeatAttempt(true);
    resetToReady();
  };

  // Next Rhythm Challenge (via direct button click or cooldown completion)
  const handleNextChallenge = () => {
    if (cooldownRemaining > 0.05) return;
    setIsRepeatAttempt(false);
    setHasScoredThisExercise(false);
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

  // Split bars into systems of 2 bars per line for uniform reading:
  // - Level 1: 2 bars -> 1 line of 2 bars (close together)
  // - Level 2: 4 bars -> 2 equal lines of 2 bars
  // - Level 3: 6 bars -> 3 equal lines of 2 bars
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

  // Smart note grouping for a bar: groups consecutive 16ths into tight beamed quartets or duos
  const renderBarNotes = (bar: RhythmBar, globalBarIdx: number, systemIdx: number) => {
    const elements: React.ReactNode[] = [];
    const notes = bar.notes;
    let i = 0;

    while (i < notes.length) {
      const note = notes[i];

      // Check for group of 4 sixteenths without ties
      if (
        i + 3 < notes.length &&
        notes[i].type === 'sixteenth' &&
        notes[i + 1].type === 'sixteenth' &&
        notes[i + 2].type === 'sixteenth' &&
        notes[i + 3].type === 'sixteenth' &&
        !notes[i].tiedToNext &&
        !notes[i + 1].tiedToNext &&
        !notes[i + 2].tiedToNext
      ) {
        elements.push(
          <div key={`beam4-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedSixteenthQuartet />
          </div>
        );
        i += 4;
        continue;
      }

      // Check for duo of 2 sixteenths
      if (
        i + 1 < notes.length &&
        notes[i].type === 'sixteenth' &&
        notes[i + 1].type === 'sixteenth' &&
        !notes[i].tiedToNext
      ) {
        elements.push(
          <div key={`beam2-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedSixteenthDuo />
          </div>
        );
        i += 2;
        continue;
      }

      // Check for pair of 2 eighth notes
      if (
        i + 1 < notes.length &&
        notes[i].type === 'eighth' &&
        notes[i + 1].type === 'eighth' &&
        !notes[i].tiedToNext
      ) {
        elements.push(
          <div key={`beameight-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedEighthPair />
          </div>
        );
        i += 2;
        continue;
      }

      // Standalone note with optional liaison
      elements.push(
        <div key={`single-${i}`} className={`relative flex items-center justify-center shrink-0 ${note.isTiedFromPrev ? 'opacity-70' : ''}`}>
          <FineMusicNote type={note.type} />

          {/* Tie Arc connecting forward */}
          {note.tiedToNext && (
            <div className="absolute -bottom-2 left-2 pointer-events-none z-30">
              <svg className="w-8 sm:w-10 h-3 overflow-visible" viewBox="0 0 32 12">
                <path
                  d="M 2 2 Q 16 11 30 2"
                  fill="none"
                  stroke="#e6b769"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}

          {/* Continuation of tie from previous system */}
          {note.isTiedFromPrev && i === 0 && (
            <div className="absolute -bottom-2 -left-4 pointer-events-none z-30">
              <svg className="w-5 h-3 overflow-visible" viewBox="0 0 20 12">
                <path
                  d="M 2 2 Q 10 11 18 2"
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
      i++;
    }

    return elements;
  };

  return (
    <div id="rhythm-studio-console" className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto select-none overflow-x-hidden">
      {/* Console Frame */}
      <div className="relative rounded-2xl bg-[#121520] border border-[#2b3347] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-3 sm:p-5 overflow-hidden w-full box-border">
        
        {/* Mood Ambient Glow */}
        <div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-500"
          style={{ backgroundColor: state === 'SUMMARY' ? '#10b981' : state === 'TAPPING' ? '#ffd56b' : '#c49750' }}
        />

        {/* 1. Header Bar: Clear Mobile-Friendly Level Buttons + Top 10 High Scores */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-2.5 mb-2.5 border-b border-white/10 w-full">
          <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
            {([1, 2, 3] as RhythmDifficulty[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleSwitchDifficulty(lvl)}
                className={`flex-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
                  difficulty === lvl
                    ? 'bg-gradient-to-r from-[#c49750] to-[#e6b769] text-black font-extrabold shadow-md shadow-[#c49750]/30 ring-1 ring-white/30'
                    : 'bg-[#0e111a] text-[#a09c91] hover:text-[#fbf9f5] border border-white/5 hover:border-white/10'
                }`}
                title={lvl === 1 ? 'Level 1: Simple 4/4 & 3/4' : lvl === 2 ? 'Level 2: 4-Bar Grooves' : 'Level 3: 6-Bar Symphony'}
              >
                <span className="text-xs sm:text-sm shrink-0">{lvl === 1 ? '🌱' : lvl === 2 ? '🌿' : '🌳'}</span>
                <span className="font-bold text-[11px] sm:text-xs whitespace-nowrap">
                  <span className="sm:hidden">{isDe ? `St.${lvl}` : `L${lvl}`}</span>
                  <span className="hidden sm:inline">{lvl === 1 ? (isDe ? 'Stufe 1' : 'Level 1') : lvl === 2 ? (isDe ? 'Stufe 2' : 'Level 2') : (isDe ? 'Stufe 3' : 'Level 3')}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Top 10 Button */}
          <button
            type="button"
            onClick={() => setShowLeaderboard(true)}
            className="shrink-0 ml-1.5 sm:ml-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#181c28] hover:bg-[#222738] border border-[#c49750]/60 text-[#fbf9f5] flex items-center gap-1.5 text-xs font-mono transition-all cursor-pointer shadow-sm group"
            title={isDe ? 'Top 10 Bestenliste' : 'Top 10 High Scores'}
          >
            <Trophy className="w-3.5 h-3.5 text-[#c49750] group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-semibold text-[#f5eedf] text-[11px] sm:text-xs whitespace-nowrap">Top 10</span>
          </button>
        </div>

        {/* 2. HUD Bar: Streak, Points, Practice Notice & Demo */}
        <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2 border-b border-white/10 text-xs font-mono w-full">
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
            {isRepeatAttempt && (
              <span className="hidden md:inline-flex px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/40 text-[10px] text-amber-300">
                {isDe ? 'Übungswiederholung' : 'Practice Mode'}
              </span>
            )}

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
                setIsRepeatAttempt(false);
                setHasScoredThisExercise(false);
                resetToReady();
              }}
              className="p-1 rounded-lg text-[#8c887d] hover:text-white bg-[#0b0d14] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title={isDe ? 'Neu starten' : 'Restart'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. PURE CLASSICAL SHEET MUSIC CONTAINER: All Staff Lines In One Unified Frame */}
        <div className="my-2 p-3 sm:p-4 rounded-2xl bg-[#080a10] border border-[#c49750]/30 shadow-[inset_0_2px_20px_rgba(0,0,0,0.85)] text-center w-full box-border">
          
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#8c887d]">
            <span className="text-[#c49750] font-semibold flex items-center gap-1.5 truncate max-w-[65%] sm:max-w-none text-left">
              <Music className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{isDe ? currentExercise.nameDe : currentExercise.name}</span>
            </span>

            <span className="shrink-0">
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
                  {isDe ? 'Abgeschlossen' : 'Completed'}
                </span>
              )}
            </span>
          </div>

          {/* Unified Score Manuscript Plate: Stacked systems with 100% equal width and continuous 5 staff lines */}
          <div className="flex flex-col gap-4 sm:gap-5 w-full py-2">
            {systems.map((system) => {
              const isLastSystem = system.systemIdx === systems.length - 1;

              return (
                <div 
                  key={system.systemIdx} 
                  className="relative w-full flex items-center h-16 sm:h-18 px-2 sm:px-4 bg-[#05070c] rounded-xl border border-white/5 select-none box-border"
                >
                  {/* 5 Classical Golden Staff Lines spanning 100% full width */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 sm:h-9 flex flex-col justify-between pointer-events-none opacity-25 px-2">
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                  </div>

                  {/* Percussion Clef at start of staff line */}
                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 mr-2 sm:mr-3 z-10 select-none">
                    <span className="w-0.5 sm:w-1 h-7 sm:h-8 bg-[#c49750]/80 rounded-sm" />
                    <span className="w-0.5 sm:w-1 h-7 sm:h-8 bg-[#c49750]/80 rounded-sm" />
                  </div>

                  {/* Equal-Width Measures in this System (Partitioned Equally) */}
                  <div className="relative flex-1 flex items-center h-full z-10">
                    {system.bars.map((barInfo) => {
                      const prevBar = barInfo.globalBarIdx > 0 ? currentExercise.bars[barInfo.globalBarIdx - 1] : null;
                      const showTimeSig = barInfo.globalBarIdx === 0 || (prevBar && prevBar.timeSignature !== barInfo.bar.timeSignature);
                      const [numerator, denominator] = barInfo.bar.timeSignature.split('/');

                      return (
                        <div 
                          key={barInfo.globalBarIdx} 
                          className="flex-1 flex items-center justify-between h-full px-1 sm:px-3 relative"
                        >
                          {/* Time Signature - Perfectly scaled inside staff lines */}
                          {showTimeSig && (
                            <div className="flex flex-col items-center justify-center font-serif text-base sm:text-lg font-black text-[#fbf9f5] leading-[0.8] tracking-tight mr-1 sm:mr-2 select-none shrink-0 drop-shadow-md">
                              <span>{numerator}</span>
                              <span>{denominator}</span>
                            </div>
                          )}

                          {/* Notes inside this measure (with smart beaming for 16ths and 8ths) */}
                          <div className="flex-1 flex items-center justify-around gap-1 sm:gap-2 px-1">
                            {renderBarNotes(barInfo.bar, barInfo.globalBarIdx, system.systemIdx)}
                          </div>

                          {/* Barline between bars in this system */}
                          {barInfo.localBarIdx < system.bars.length - 1 && (
                            <div className="w-[1.5px] h-7 sm:h-8 bg-white/35 shrink-0 ml-1 select-none" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* End of System Barline: Double barline on last line of piece, single on continuing lines */}
                  <div className="flex items-center gap-0.5 shrink-0 ml-1.5 sm:ml-2 z-10 select-none">
                    {isLastSystem ? (
                      <>
                        <div className="w-[1.5px] h-7 sm:h-8 bg-white/40" />
                        <div className="w-1 h-7 sm:h-8 bg-[#c49750]/90 rounded-sm" />
                      </>
                    ) : (
                      <div className="w-[1.5px] h-7 sm:h-8 bg-white/35" />
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

        {/* 4. PRIMARY ACTION DECK: Tapping Deck DURING exercise -> Morphing into "Next Rhythm" AFTER with 2-second lock */}
        <div className="my-2 space-y-1.5">
          {state === 'SUMMARY' ? (
            /* Summary Phase: The Primary Striking Button Morphing into NEXT RHYTHM with 2-Second Cooldown (Compact Mobile Height) */
            <div className="w-full">
              <button
                type="button"
                disabled={cooldownRemaining > 0.05}
                onClick={handleNextChallenge}
                className={`w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl border flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 select-none cursor-pointer ${
                  cooldownRemaining > 0.05
                    ? 'bg-[#151822] text-[#8c887d] border-white/10 opacity-70 cursor-not-allowed shadow-inner'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-[0.99] animate-pulse'
                }`}
              >
                {cooldownRemaining > 0.05 ? (
                  <>
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span className="text-xs sm:text-sm font-mono font-bold">
                      {isDe 
                        ? `Nächster Rhythmus (in ${Math.ceil(cooldownRemaining)}s...)` 
                        : `Next Rhythm (in ${Math.ceil(cooldownRemaining)}s...)`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-base sm:text-xl">✨</span>
                    <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-black">
                      {isDe ? 'Nächster Rhythmus' : 'Next Rhythm'}
                    </span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] text-black" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Exercise Phase: Single button on Desktop, Dual buttons on Mobile/Tablet */
            <>
              {/* Desktop / PC: ONE single wide button */}
              <div className="hidden sm:block">
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handleUserTap('single');
                  }}
                  className={`w-full h-20 sm:h-22 rounded-2xl border flex items-center justify-center gap-3 transition-all duration-75 select-none cursor-pointer ${
                    padPressed
                      ? 'bg-gradient-to-r from-[#c49750] to-[#ffd56b] text-black border-[#ffd56b] shadow-[0_0_25px_rgba(196,151,80,0.85)] scale-[0.98]'
                      : 'bg-[#151824] hover:bg-[#1b2132] active:scale-[0.98] text-[#fbf9f5] border-white/10 shadow-lg'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">🥁</span>
                  <span className="text-sm sm:text-base font-bold font-mono uppercase tracking-widest text-[#fbf9f5]">
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
                  className={`h-20 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-75 select-none cursor-pointer ${
                    leftPadPressed
                      ? 'bg-gradient-to-br from-[#c49750] to-[#ffd56b] text-black border-[#ffd56b] shadow-[0_0_20px_rgba(196,151,80,0.85)] scale-95'
                      : 'bg-[#151824] active:scale-95 text-[#fbf9f5] border-white/10 shadow-lg'
                  }`}
                >
                  <span className="text-xl">🥁</span>
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
                  className={`h-20 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-75 select-none cursor-pointer ${
                    rightPadPressed
                      ? 'bg-gradient-to-br from-[#c49750] to-[#ffd56b] text-black border-[#ffd56b] shadow-[0_0_20px_rgba(196,151,80,0.85)] scale-95'
                      : 'bg-[#151824] active:scale-95 text-[#fbf9f5] border-white/10 shadow-lg'
                  }`}
                >
                  <span className="text-xl">🥁</span>
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">
                    {isDe ? 'Trommel' : 'Beat'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* 5. ANCHORED RESULTS & STATUS DECK (Ultra-compact, all on one screen) */}
        <div className="min-h-[72px] sm:min-h-[84px] flex items-center justify-center">
          {state === 'SUMMARY' && detectedBpm !== null && precisionScore !== null ? (
            /* Sleek, Compact Results Card Fitting Seamlessly on Mobile Screen */
            <div className="w-full p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#0b0f1a] border border-[#c49750]/50 text-center animate-fade-in shadow-xl">
              <div className="flex flex-row items-center justify-between gap-1.5 sm:gap-4">
                {/* Rhythmic Accuracy Metric */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#8c887d] truncate">
                    {isDe ? 'Präzision' : 'Accuracy'}
                  </span>
                  <span className={`text-2xl sm:text-4xl font-black font-mono tracking-tight drop-shadow-md ${
                    precisionScore >= 80 ? 'text-emerald-400' : precisionScore >= 65 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {precisionScore}%
                  </span>
                </div>

                <div className="w-[1px] h-8 sm:h-10 bg-white/10 shrink-0" />

                {/* Detected Tempo Metric */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#8c887d] truncate">
                    {isDe ? 'Dein Tempo' : 'Tempo'}
                  </span>
                  <span className="text-lg sm:text-2xl font-extrabold font-mono text-[#ffd56b] mt-0.5">
                    {detectedBpm} <span className="text-[10px] sm:text-xs font-normal text-[#8c887d]">BPM</span>
                  </span>
                </div>

                <div className="w-[1px] h-8 sm:h-10 bg-white/10 shrink-0" />

                {/* Compact "Repeat exercise" Button */}
                <div className="flex items-center justify-center flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={handleBeatAgain}
                    className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-[#1a1f2e] hover:bg-[#252c40] border border-[#c49750]/70 hover:border-[#ffd56b] text-xs font-mono font-bold text-[#fbf9f5] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                    title={isDe ? 'Übung wiederholen' : 'Repeat exercise'}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#c49750] shrink-0" />
                    <span className="text-[10px] sm:text-xs whitespace-nowrap">
                      {isDe ? 'Übung wiederholen' : 'Repeat exercise'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Hole tolerance message if a mouse click was dropped */}
              {holeToleratedMessage && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 mt-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{holeToleratedMessage}</span>
                </div>
              )}

              {feedbackMessage && (
                <p className="text-[10px] sm:text-xs text-[#dedacf] font-serif italic mt-1 line-clamp-1 max-w-md mx-auto">
                  {feedbackMessage}
                </p>
              )}
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
