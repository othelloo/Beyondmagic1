export type Language = 'en' | 'de';

export interface Translations {
  nav: {
    method: string;
    audiences: string;
    french: string;
    contemporaryVocal: string;
    musicTheory: string;
    about: string;
    media: string;
    spirituality: string;
    contact: string;
  };
  hero: {
    badge: string[];
    titleMain: string;
    titleSub: string;
    summary: string;
    locationAvailability: string;
    highlights: {
      location: string;
      credentials: string;
      stages: string;
    };
    ctaPrimary: string;
    ctaMethod: string;
    uploadPhoto: string;
    photoUpdated: string;
    processing: string;
  };
  featuredVideo: {
    eyebrow: string;
    title: string;
    subtitle: string;
    shuffle: string;
    nowPlaying: string;
    watchOnYouTube: string;
    inquireRole: string;
    exploreSpirituality: string;
    videoArchiveTitle: string;
  };
  method: {
    badge: string;
    title: string;
    subtitle: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    demoHint: string;
    ctaBookMethod: string;
  };
  audiences: {
    badge: string;
    title: string;
    subtitle: string;
    card1Badge: string;
    card1Title: string;
    card1Subtitle: string;
    card1Desc: string;
    card1Points: string[];
    card1Cta: string;
    card2Badge: string;
    card2Title: string;
    card2Subtitle: string;
    card2Desc: string;
    card2Points: string[];
    card2Cta: string;
    card3Badge: string;
    card3Title: string;
    card3Subtitle: string;
    card3Desc: string;
    card3Points: string[];
    card3Cta: string;
  };
  french: {
    badge: string;
    title: string;
    subtitle: string;
    tabOneTime: string;
    tabOngoing: string;
    whoIsItFor: string;
    takeawaysTitle: string;
    topicsTitle: string;
    autonomyTitle: string;
    autonomyDesc: string;
    ctaApply: string;
    locationNote: string;
  };
  contemporaryVocal: {
    badge: string;
    title: string;
    subtitle: string;
    credoQuote: string;
    credoTagline: string;
    hookQuote: string;
    hookSubquote: string;
    roleBadge: string;
    roleTitle: string;
    roleSubtitle: string;
    roleTeacher: { title: string; badge: string; desc: string };
    roleCoach: { title: string; badge: string; desc: string };
    roleSpecialist: { title: string; badge: string; desc: string };
    pharyngealBadge: string;
    pharyngealTitle: string;
    pharyngealSubtitle: string;
    contrastLeftTag: string;
    contrastLeftTitle: string;
    contrastLeftDesc: string;
    contrastRightTag: string;
    contrastRightTitle: string;
    contrastRightDesc: string;
    noduleWarningBadge: string;
    noduleWarningText: string;
    retainersBadge: string;
    retainersTitle: string;
    retainersSubtitle: string;
    retainerStudio: {
      badge: string;
      title: string;
      tagline: string;
      desc: string;
      deliverables: string[];
    };
    retainerTour: {
      badge: string;
      title: string;
      tagline: string;
      desc: string;
      deliverables: string[];
    };
    retainerMentorship: {
      badge: string;
      title: string;
      tagline: string;
      desc: string;
      phases: Array<{ phase: string; title: string; desc: string }>;
    };
    pillarsBadge: string;
    pillarsTitle: string;
    pillarsSubtitle: string;
    pillars: {
      breathTitle: string;
      breathTagline: string;
      breathDesc: string;
      rangeTitle: string;
      rangeTagline: string;
      rangeDesc: string;
      habitsTitle: string;
      habitsTagline: string;
      habitsDesc: string;
      theZoneTitle: string;
      theZoneTagline: string;
      theZoneDesc: string;
    };
    genresBadge: string;
    genresTitle: string;
    genresSubtitle: string;
    genres: Array<{
      id: string;
      name: string;
      tag: string;
      tagline: string;
      desc: string;
      skills: string[];
    }>;
    gatekeepersBadge: string;
    gatekeepersTitle: string;
    gatekeepersSubtitle: string;
    gatekeeperCards: Array<{
      category: string;
      title: string;
      subtitle: string;
      benefit: string;
    }>;
    diagnosticBadge: string;
    diagnosticTitle: string;
    diagnosticSubtitle: string;
    diagnosticDesc: string;
    diagnosticDeliverables: string[];
    ctaBook: string;
    ctaExploreClassical: string;
    audioOptionalHint: string;
  };
  musicTheory: {
    badge: string;
    title: string;
    subtitle: string;
    quoteText: string;
    quoteAuthor: string;
    secretGardenTag: string;
    secretGardenTitle: string;
    secretGardenIntro: string;
    secretGardenWaysTitle: string;
    secretGardenItems: { label: string; desc: string }[];
    secretGardenClosing: string;
    theoryTag: string;
    theoryTitle: string;
    theoryIntro: string;
    theoryItems: { label: string; desc: string }[];
    interactiveTitle: string;
    interactiveSubtitle: string;
    interactiveHint: string;
    pianoInstrument: string;
    synthInstrument: string;
    instrumentLabel: string;
    somaticTitle: string;
    somaticSubtitle: string;
    somaticOn: string;
    somaticOff: string;
    somaticHint: string;
    audiencesTitle: string;
    producerBadge: string;
    producerTitle: string;
    producerDesc: string;
    singerBadge: string;
    singerTitle: string;
    singerDesc: string;
    classicalBadge: string;
    classicalTitle: string;
    classicalDesc: string;
    ctaButton: string;
    ctaNote: string;
  };
  biography: {
    badge: string;
    title: string;
    subtitle: string;
    point1Title: string;
    point1Desc: string;
    point2Title: string;
    point2Desc: string;
    point3Title: string;
    point3Desc: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    highlightQuote: string;
    viewGalleryBtn: string;
    inquireBtn: string;
  };
  media: {
    badge: string;
    title: string;
    subtitle: string;
    tabPhotos: string;
    tabVideos: string;
    showMore: (count: number) => string;
    showLess: string;
    openFullModal: (count: number) => string;
    fullModalTitle: string;
    close: string;
    allVideosTitle: string;
    allVideosSubtitle: string;
    filterAll: string;
    filterOpera: string;
    filterTeaching: string;
    filterComposition: string;
    deletePhotoTooltip: string;
  };
  inquiry: {
    modalTitle: string;
    modalSubtitle: string;
    labelTopic: string;
    labelName: string;
    labelEmail: string;
    labelPhone: string;
    labelMessage: string;
    placeholderMessage: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    closeBtn: string;
  };
  spirituality: {
    awakeningBadge: string;
    headline: string;
    subheadline: string;
    quotePrompt: string;
    question: string;
    realization: string;
    reflectionP1: string;
    reflectionP2: string;
    returnBtn: string;
  };
  footer: {
    tagline: string;
    navigationHeader: string;
    locationsHeader: string;
    locationsText: string;
    copyright: string;
  };
  languageToggle: {
    switchToGerman: string;
    switchToEnglish: string;
    currentLanguageLabel: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      method: 'The Method',
      audiences: 'Who It’s For',
      french: 'French Coaching',
      contemporaryVocal: 'Vocal Coaching',
      musicTheory: 'Music Theory',
      about: 'About Me',
      media: 'Photos & Videos',
      spirituality: 'Spirituality (Soon)',
      contact: 'Contact / Book'
    },
    hero: {
      badge: ['emotion-first pedagogy', 'vocal atelier', 'Music theory'],
      titleMain: 'Beyond Magic',
      titleSub: 'Abdellah Lasri',
      summary: 'At the edge where feeling meets understanding, music changes its voice. Each chord has its color, its weight. No note is sung the same twice. A whole spectrum opens, shades we never knew we could hear or feal, and we listen not to the words but to the sound, trembling at the faintest shift',
      locationAvailability: 'Available in NRW (Germany), Berlin, or online worldwide.',
      highlights: {
        location: 'NRW (Cologne/Düsseldorf/Essen) · Berlin · Online Worldwide',
        credentials: 'CNSMDP Paris Valedictorian · Staatsoper Berlin Young Artist',
        stages: 'Operalia finalist · Aalto Stage Prize for Young Artists'
      },
      ctaPrimary: 'Book a Lesson / Inquire',
      ctaMethod: 'Explore The Method ↓',
      uploadPhoto: 'Upload Photo',
      photoUpdated: 'Photo Updated!',
      processing: 'Processing...'
    },
    featuredVideo: {
      eyebrow: 'Live Performance Spotlight',
      title: 'Experience The Voice',
      subtitle: 'Selected stage excerpts and live recordings from European opera houses and concert halls.',
      shuffle: 'Random Video',
      nowPlaying: 'Now Playing',
      watchOnYouTube: 'Open on YouTube',
      inquireRole: 'Inquire About Audition / Role Coaching',
      exploreSpirituality: 'Explore Musical Awakening',
      videoArchiveTitle: 'Featured Recordings'
    },
    method: {
      badge: 'Pedagogical Philosophy',
      title: 'The Method: Emotion-first Learning',
      subtitle: 'Starting with abstract notation slows musicians down. When you internalize acoustic feeling first, reading notes, vocal freedom, and true interpretation develop in record time.',
      pillar1Title: 'Auditory Memory First',
      pillar1Desc: 'Recognizing intervals, chord tensions, and phrasing as physical sensations in the body rather than mathematical calculations on a stave.',
      pillar2Title: 'Notation as Shorthand',
      pillar2Desc: 'Reading scores effortlessly because your inner ear already anticipates the sound before vocal folds vibrate or fingers touch an instrument.',
      pillar3Title: 'Somatic Breath & Resonance',
      pillar3Desc: 'Singing without throat constriction by aligning posture, breath support, and natural acoustic chambers for unforced, ringing projection.',
      demoHint: 'Interactive ear experiment: Feel the physical sensation of harmonic tension resolving into consonance.',
      ctaBookMethod: 'Experience a Somatic Lesson'
    },
    audiences: {
      badge: 'Tailored Mentorship',
      title: 'Who These Lessons Are For',
      subtitle: 'Direct, goal-oriented guidance adapted to your specific artistic milestone.',
      card1Badge: 'French Classical & Lyric Art',
      card1Title: 'French Classical Music, Opera & Mélodie',
      card1Subtitle: 'Elegant French style & language coaching for singers and pianists',
      card1Desc: 'A specialized masterclass course on authentic French classical music interpretation, French lyric opera, and the intimate world of the mélodie. Focus on elegant French vocal style, nuanced language coaching, and collaborative interpretation for singers and collaborative pianists.',
      card1Points: [
        'Master French diction: get to know the French sensitivity, and find your balance between authentic French elegance and an authentic you',
        'Deep dive into French mélodies (Fauré, Debussy, Ravel, Duparc) for singers & pianists',
        'French lyric opera role coaching (Massenet, Gounod, Bizet) with Paris CNSMDP heritage'
      ],
      card1Cta: 'French Repertoire Coaching',
      card2Badge: 'Vocal Studio',
      card2Title: 'Vocal Coaching',
      card2Subtitle: 'Pop, R&B, Soul, Jazz, Indie & Modern Styles',
      card2Desc: 'Coaching modern singers using elite classical breath mechanics and vocal health—without the operatic stiffness. Build an authentic foundation, expand your range effortlessly, dissolve stage fright, and connect raw feeling directly to your voice.',
      card2Points: [
        'Build an authentic foundation: master effortless breath support and let your voice’s natural color emerge and mature',
        'Explore and extend the range of your voice through personalized exercises',
        'Healthy mix voice, fatigue-free belt, and agile pentatonic riffs',
        'Enter "The Zone": connect feeling directly to your voice so stage fright naturally evaporates'
      ],
      card2Cta: 'Book Vocal Coaching',
      card3Badge: 'Harmony, Emotion & Perception',
      card3Title: 'Producers, Composers & Music Lovers',
      card3Subtitle: 'Connecting sound to emotion through color and harmonic tension',
      card3Desc: 'For creators shaping tracks and active listeners seeking deeper musical understanding. Move beyond cold formulas, presets, and dry theory: learn to recognize the emotional colors, harmonic tensions, and psychological release behind every chord and movement.',
      card3Points: [
        'Connect music directly to emotion by recognizing harmonic colors and intuitive tensions',
        'For producers & beatmakers: craft rich, organic chord progressions without relying on preset packs',
        'For listeners & music lovers: experience the hidden layers and emotional narratives in opera and orchestra'
      ],
      card3Cta: 'Harmony & Listening Sessions',
    },
    french: {
      badge: 'Specialized Discipline',
      title: 'French Repertoire & Diction',
      subtitle: 'From Massenet and Gounod to Debussy and Fauré: mastering the acoustic nuances of French lyric singing with clarity, power, and freedom.',
      tabOneTime: '★ ONE-TIME INTENSIVE',
      tabOngoing: 'ONGOING COACHING',
      whoIsItFor: 'Who this is for:',
      takeawaysTitle: 'What you will take away:',
      topicsTitle: 'Key modules covered:',
      autonomyTitle: 'Permanent Autonomy',
      autonomyDesc: 'The primary goal is complete independence: learning the acoustic rules of French and IPA so you never have to depend on a dictionary or coach again.',
      ctaApply: 'Inquire About This Specialization',
      locationNote: 'Available in NRW (Germany), Berlin, or online worldwide'
    },
    contemporaryVocal: {
      badge: 'Vocal Coaching · Muscular Foundation, Emotional Relay & Tour Longevity',
      title: 'The Healthy Basis: Longevity, Resilience & Emotional Relay',
      subtitle: 'Twenty years on European opera stages taught me one undeniable truth: when your voice is anchored in a cultivated muscular and breathing system, you can endure demanding rehearsals, grueling schedules, and colds—without ever developing vocal nodules.',
      credoQuote: 'To claim I never experienced vocal fatigue in twenty years of singing lead roles across Europe would be a lie. We rehearse for weeks, we sing through heavy exhaustion, we catch colds. The real mastery is knowing how to navigate all of that safely. When your muscular foundation and breathing system are deeply cultivated, the body instinctively steps in during tiredness and takes the entire pressure off your throat. No nodules. No permanent strain. Just an enduring, healthy basis that lets you survive demanding concerts, 40-date tours, and connect music directly with authentic emotion.',
      credoTagline: 'CNSMDP Valedictorian · 20+ Years European Lead Operatic Roles · Zero Nodules · Anatomical Resilience',
      hookQuote: 'Music is emotion. But if we are overwhelmed by emotion, the throat constricts and we cannot sing. True vocal artistry is learning how to deeply connect with emotion—and then having the technical basis to relay it without choking.',
      hookSubquote: 'My role is to give you a foundation so reliable that even when you are exhausted on night 30 of a 40-date tour, your body knows exactly what to do—leaving your throat completely free.',
      
      roleBadge: 'The Core Concept',
      roleTitle: 'The Three Cornerstones of Vocal Sovereignty',
      roleSubtitle: 'A grounded muscular foundation, emotional transmission without throat constriction, and total resilience under exhaustion.',
      roleTeacher: {
        badge: '1. THE PHYSICAL INSTRUMENT',
        title: 'Muscular Basis & Cultivated Breathing System',
        desc: 'Building a robust muscular apparatus and an intuitive breathing system that cushions your vocal folds through weeks of rehearsals and hours of demanding performance.'
      },
      roleCoach: {
        badge: '2. THE EMOTIONAL PARADOX',
        title: 'Connecting with Emotion & Knowing How to Relay It',
        desc: 'To move people, we must deeply know and connect with raw feeling. But being overwhelmed by emotion constricts the voice. We train the precise ability to experience emotion fully, and relay it to the audience without strangling the instrument.'
      },
      roleSpecialist: {
        badge: '3. TOUR RESILIENCE & ZERO NODULES',
        title: 'Navigating Fatigue: Surviving Long Concerts & 40-Date Tours',
        desc: 'When tiredness, travel, or a cold strikes during a heavy tour, muscle memory takes over. The body absorbs the physical load, taking the entire pressure off the voice so you never suffer vocal nodules or injury.'
      },

      pharyngealBadge: 'Acoustic Alchemy · Biomechanical Principle',
      pharyngealTitle: 'Arena-Sized Power via Dynamic Pharyngeal Space',
      pharyngealSubtitle: 'The physics of modern commercial belting: how to cut through heavy electronic mixes without vocal cord collision.',
      contrastLeftTag: 'Classical Cavern',
      contrastLeftTitle: 'The Expansive Acoustic Cathedral (Opera)',
      contrastLeftDesc: 'In classical tradition, we expand the lower pharynx and lower the larynx to build a booming acoustic megaphone that travels over 90 unamplified instruments without a microphone. It creates majestic warmth, but forms a dark vowel space unsuited for contemporary charts.',
      contrastRightTag: 'Modern Compression',
      contrastRightTitle: 'Dynamic Pharyngeal Focus (Contemporary Belt)',
      contrastRightDesc: 'With a microphone, volume is already solved. For a modern stadium belt, we narrow the epilaryngeal funnel, engage gentle medial compression, and elevate oral-nasal brilliance. The tone becomes laser-focused, razor-sharp, and emotionally piercing—cutting cleanly through 808s and heavy guitars with zero vocal strain.',
      noduleWarningBadge: 'THE TRAP OF FORCED CHEST-PULLING',
      noduleWarningText: 'Most self-taught singers attempt to belt by forcing massive air against strained cords. This causes hoarseness, swelling, and career-ending nodules. Dynamic pharyngeal narrowing delivers ten times the acoustic presence with effortless lightness and total vocal fold safety.',

      retainersBadge: 'Private Retainers & Engagements',
      retainersTitle: 'A Solid Frame for Extraordinary Voices',
      retainersSubtitle: 'Tailored for recording artists, touring performers, composers, and private individuals seeking absolute vocal sovereignty.',
      retainerStudio: {
        badge: 'STUDIO RECORDING WEEKS',
        title: 'Vocal Producer & Tracking Alchemist',
        tagline: 'Ensuring Radiant, Timeless Takes & Preserving Vocal Freshness',
        desc: 'Studio tracking sessions are costly and emotionally demanding. As your confidential on-call vocal guardian, I ensure your voice stays luminous, centered, and effortless from the first take to the final chorus.',
        deliverables: [
          'Pre-tracking laryngeal decompression & subglottic air calibration',
          'Take-by-take micro resets to eliminate fatigue between vocal passes',
          'Harmonic formant tuning to sit organically inside the production mix',
          'Rapid vocal revival during intense, multi-day recording schedules'
        ]
      },
      retainerTour: {
        badge: 'ARENA & TOUR STAMINA',
        title: 'Tour Endurance & Backstage Sanctuary',
        tagline: 'Unbreakable Vocal Stamina for Rigorous Multi-Date Calendars',
        desc: 'Touring batters the vocal folds with dry travel air, adrenaline, and nightly demanding setlists. We construct a bulletproof physiological and mental shield so your voice rings as fresh on date 40 as on opening night.',
        deliverables: [
          'The 15-minute backstage emergency reset protocol',
          'Dynamic breath stabilization under intense stage movement & choreo',
          'Post-show decongestion and laryngeal cooling rituals',
          'Private, discreet sanctuary for the artist’s mental and physical focus'
        ]
      },
      retainerMentorship: {
        badge: 'CONFIDENTIAL INTENSIVE',
        title: '12-Week Private Vocal Mentorship',
        tagline: 'From Physical Biomechanics to Unfettered Artistic Transcendence',
        desc: 'A transformative one-on-one journey designed to give you permanent mastery over your instrument, dissolving every vocal obstacle and unlocking your truest, most dangerous artistic voice.',
        phases: [
          {
            phase: 'Weeks 1–4',
            title: 'Anatomy, Breath & The Italian Appoggio',
            desc: 'Decoupling neck muscles, activating deep pelvic-diaphragmatic support, and ending subglottic air slamming at the root.'
          },
          {
            phase: 'Weeks 5–8',
            title: 'Dynamic Belting & Acoustic Compression',
            desc: 'Mastering the epilarynx, bridging chest and head register with seamless ease, and adding healthy commercial grit.'
          },
          {
            phase: 'Weeks 9–12',
            title: 'Tour Conditioning, Mystery & "The Zone"',
            desc: 'Daily longevity rituals, dissolving stage fright, and stepping into the transcendent flow state where technique vanishes and pure magic takes over.'
          }
        ]
      },

      pillarsBadge: 'The Four Pillars of Mastery',
      pillarsTitle: 'The Synthesis of Science, Spirit & Passion',
      pillarsSubtitle: 'Harnessing elite classical foundations to give contemporary artists infinite freedom, safety, and emotional power.',
      pillars: {
        breathTitle: 'Italian Appoggio Mechanics · Grounded Freedom',
        breathTagline: 'Lower Torso Expansion & Zero Neck Strain',
        breathDesc: 'We take the legendary breath foundations of classical masters—grounded, low-body support that cushions every note like an invisible pillar. No rigid postures, no fake vibrato, no tension. Your natural tone stays pure, conversational, and uniquely yours.',
        rangeTitle: 'Seamless Mix, Effortless High Belts & Agile Runs',
        rangeTagline: 'Acoustic Compression Without Strain or Breaks',
        rangeDesc: 'Never fear a high note or crack again. Discover the acoustic brilliance of the mixed voice, seamless registration, rapid pentatonic flexibility, and straight-tone precision that blooms into warm, intentional vibrato on command.',
        habitsTitle: 'Vocal Longevity & The 20-Year Athlete Mindset',
        habitsTagline: '15-Minute Daily Maintenance for Lifelong Resilience',
        habitsDesc: 'Singing is an athletic art of extreme precision. We curate a personal daily regimen of hydration, gentle phonation, and restorative rituals that keep your vocal folds supple, cushioned, and ready to ignite at a moment’s notice.',
        theZoneTitle: 'The Sacred Non-Negotiable: "The Zone" & Pure Passion',
        theZoneTagline: 'Dissolving Fear into Pure Artistic Magic',
        theZoneDesc: 'When mechanics become second nature, anxiety dissolves into awe. We remove mental tension completely so you enter "The Zone"—the transcendent flow state where technique disappears and raw emotion speaks straight to the human heart.'
      },

      genresBadge: 'Genre Horizons',
      genresTitle: 'Authentic Soul in Every Style',
      genresSubtitle: 'From intimate bedroom pop to roaring arena rock, every genre receives genre-authentic nuance and anatomical protection.',
      genres: [
        {
          id: 'rnb-soul',
          name: 'R&B, Soul & Neo-Soul',
          tag: 'Agility & Emotion',
          tagline: 'Effortless Minor Pentatonic Runs & Warm Registration',
          desc: 'Master the vocal agility and cord closure required for rapid melismas, seamless chest-to-head voice flips, and raw, vulnerable vocal delivery.',
          skills: [
            'Lightning-fast riffs & runs without laryngeal tension',
            'Smooth registration and cord-closure control',
            'Intimate ad-libs, syncopated timing & neo-soul phrasing',
            'Soulful dynamics from delicate whispers to soaring belts'
          ]
        },
        {
          id: 'pop-commercial',
          name: 'Pop & Contemporary Mainstream',
          tag: 'Radio-Ready Brilliance',
          tagline: 'Healthy Belt, Vocal Formants & Modern Mix Voice',
          desc: 'Build a signature commercial tone that cuts cleanly through modern productions and stadium monitors without vocal fatigue.',
          skills: [
            'Powerful, fatigue-free commercial belt & mix voice',
            'Straight-tone precision blooming into intentional vibrato',
            'Studio microphone proximity effect & vocal dynamics',
            'Vocal formants manipulation for crisp, modern presence'
          ]
        },
        {
          id: 'jazz-blues',
          name: 'Jazz, Blues & Vocal Artistry',
          tag: 'Texture & Phrasing',
          tagline: 'Acoustic Resonator Control & Conversational Phrasing',
          desc: 'Learn how to shape your vocal resonators to flip between smoky, gritty textures and warm, conversational storytelling with complete freedom.',
          skills: [
            'Conversational speech-level diction and organic storytelling',
            'Safe raspy, breathy, and gritty textures without vocal injury',
            'Scatting, syncopated rhythm, and sophisticated improvisation',
            'Rich resonator adjustments for warm low-end presence'
          ]
        },
        {
          id: 'indie-rock',
          name: 'Indie, Rock & Singer-Songwriter',
          tag: 'Authenticity & Power',
          tagline: 'Enduring Stamina & Raw Artistic Identity',
          desc: 'Protect your instrument under heavy touring schedules and intense emotion while maintaining that unmistakable, unvarnished artistic edge.',
          skills: [
            'Safe raspy overdrive and vocal compression without node risk',
            'Authentic, unstuffy delivery with personal lyrical depth',
            'Dynamic control for acoustic sets and high-energy live bands',
            'Nervous system grounding to perform fearlessly under pressure'
          ]
        }
      ],

      gatekeepersBadge: 'The Architecture of Mastery',
      gatekeepersTitle: 'Science, Passion, Mystery & Sanctuary',
      gatekeepersSubtitle: 'A rare sanctuary where world-class vocal physics serves the transcendent fire of human expression.',
      gatekeeperCards: [
        {
          category: 'THE SCIENCE · 50%',
          title: 'Unbreakable Biomechanics',
          subtitle: 'The Anatomy of 20-Year Longevity',
          benefit: 'Subglottic air decoupling, acoustic impedance, and dynamic pharyngeal space. The physical mastery that preserves the voice across decades of peak exertion.'
        },
        {
          category: 'THE PASSION · 30%',
          title: 'The Sacred Fire of Song',
          subtitle: 'Pure Art & Emotional Truth',
          benefit: 'Singing is an act of deep human connection. We dismantle inhibitions so every note carries authenticity, vulnerability, and genuine heart-stopping chills.'
        },
        {
          category: 'THE MYSTERY · 20%',
          title: 'The Hidden Architecture',
          subtitle: 'Esoteric Acoustic Physics',
          benefit: 'The unseen geometry of resonance chambers passed down through elite European masters: transforming breath into radiant, effortless acoustic energy.'
        },
        {
          category: 'THE SOLID FRAME',
          title: 'Discreet Private Practice',
          subtitle: 'Confidentiality & Sanctuary',
          benefit: 'An exclusive, quiet haven for serious artists, touring performers, and private creators. Absolute discretion, zero vanity, and total devotion to the voice.'
        }
      ],

      diagnosticBadge: 'The 45-Minute Diagnostic Protocol',
      diagnosticTitle: 'Book a 45-Minute Biomechanical Vocal Diagnostic',
      diagnosticSubtitle: 'Diagnosing Technical Bottlenecks Within 15 Minutes',
      diagnosticDesc: 'Experience the diagnostic rigor of an international master vocalist. In a focused 45-minute consultation, we analyze your acoustic compression, subglottic air leaks, and laryngeal tension—providing an immediate mechanical roadmap for your voice.',
      diagnosticDeliverables: [
        '15-minute diagnostic identification of structural bottlenecks & strain points',
        'Custom roadmap for safe arena belting, range expansion & mix voice',
        'Emergency 15-minute vocal fold reset blueprint tailored to your instrument',
        'Direct consultation for managers, producers, or private students'
      ],
      ctaBook: 'Book a 45-Minute Vocal Diagnostic',
      ctaExploreClassical: 'Explore Classical Masterclasses & Diction',
      audioOptionalHint: 'Optional: Include a link to your Spotify release, SoundCloud demo, or phone voice memo.'
    },
    musicTheory: {
      badge: 'emotion-first pedagogy',
      title: 'Music Theory: Sound, Harmonic Perception & Color',
      subtitle: '',
      quoteText: 'Before there were scores, there was listening. Music is a language you already understand: a rising line lifts you, a slow chord settles you, a sudden silence makes you hold your breath. My lessons begin there, with how the music affects you. Once you can recognise that feeling, notation stops being a code to decipher and becomes a simple way to write down what you already hear.',
      quoteAuthor: '',
      secretGardenTag: '1 · The Secret Garden',
      secretGardenTitle: 'The Secret Garden',
      secretGardenIntro: 'Call it your secret garden, your DIY garage, or simply your private place. It is the space where you and your music get to know each other. Here you learn to feel the many nuances and colours of a sound, then examine them under a microscope until a vague impression becomes a clearly distinct feeling.',
      secretGardenWaysTitle: 'We explore it in many ways:',
      secretGardenItems: [
        { label: 'Colour listening', desc: 'hear intervals and chords, and describe their colour.' },
        { label: 'Auditory memory', desc: 'expand it through regular exercises.' },
        { label: 'Synesthesia', desc: 'discover whether, and how, sound meets colour, shape or touch for you.' },
        { label: 'Harmony in practice', desc: 'hear basic harmony and recognise the function of each chord.' },
        { label: 'Genres', desc: 'explore different styles of music and notice how each one affects you.' },
        { label: 'Rhythm', desc: 'study it by feeling it, by becoming the rhythm.' }
      ],
      secretGardenClosing: 'Behind every exercise sits the question that matters most: how does this music affect me?',
      theoryTag: '2 · The Music Theory',
      theoryTitle: 'The Music Theory',
      theoryIntro: 'The focus is on developing a sharp ear, but reading music remains an important pillar. A wide range of memory aids and game-like puzzles speeds up the learning curve.',
      theoryItems: [
        { label: 'The basics, if needed', desc: 'what music is and how frequencies work.' },
        { label: 'The scale by heart', desc: 'Do, Re, Mi, Fa, Sol, La, Si, Do, recited until it is automatic.' },
        { label: 'The staff, step by step', desc: 'notes arrive slowly, with reflex games until reading becomes second nature.' },
        { label: 'Colours from the Secret Garden', desc: 'use the palette built there to recognise intervals and chords.' },
        { label: 'Pieces taken apart', desc: 'analyse every aspect of specific pieces of music, selected for the lesson.' }
      ],
      interactiveTitle: 'Interactive Harmonic Color & Weight Studio',
      interactiveSubtitle: 'Select each chord below to hear its acoustic grand piano resonance and feel its emotional weight, color temperature, and gravitational pull.',
      interactiveHint: 'Sampled Concert Grand Piano · Press any chord to strike immediately · Listen with headphones for full bass & overtone depth.',
      pianoInstrument: 'Steinway Grand Piano',
      synthInstrument: 'Harmonic Pure Tones',
      instrumentLabel: 'Sound Timbre',
      somaticTitle: 'Somatic Awareness',
      somaticSubtitle: 'Physical Resonance Field',
      somaticOn: 'Resonance Active',
      somaticOff: 'Resonance Muted',
      somaticHint: 'Visualizing acoustic vibration resonating through the body and surrounding space.',
      audiencesTitle: 'Who Learns Theory Here?',
      producerBadge: 'Producers & Beatmakers',
      producerTitle: 'Break Free from Generic Presets',
      producerDesc: 'Stop relying on chord packs and random MIDI trials. Understand chord substitutions, secondary dominants, and voice-leading to create deep, evocative tracks across R&B, Neo-Soul, Electronic, and Film scores.',
      singerBadge: 'Singers & Songwriters',
      singerTitle: 'Resonant Intonation & Phrasing',
      singerDesc: 'Understand the harmonic context beneath your vocal line. Sing in lockstep with the chord’s emotional color so your intonation settles with effortless resonance and chills-inducing precision.',
      classicalBadge: 'Instrumentalists & Music Lovers',
      classicalTitle: 'The Hidden Architecture of Masters',
      classicalDesc: 'Decipher the harmonic genius of Debussy, Ravel, Chopin, Wagner, and Puccini. Move beyond robotic note-reading and experience the psychological drama woven into every modulation.',
      ctaButton: 'Book a Music Theory & Harmony Session',
      ctaNote: 'One-on-one sessions available in NRW (Germany), Berlin, or online worldwide'
    },
    biography: {
      badge: 'Background & Career',
      title: 'How I Started at 20 and Learned Fast',
      subtitle: 'From zero formal childhood music training to winning a prestigious scholarship in France in just two years, followed by leading tenor roles across Europe.',
      point1Title: 'Paris CNSMDP Valedictorian',
      point1Desc: 'Scholarship winner and summa cum laude graduate of the Conservatoire National Supérieur de Musique de Paris.',
      point2Title: 'Major European Opera Houses',
      point2Desc: 'Lead tenor roles at Opéra National de Paris (Werther), Staatsoper Berlin (Alfredo in La Traviata), Deutsche Oper Berlin, Aalto-Theater Essen.',
      point3Title: 'World-Class Collaborations',
      point3Desc: 'Worked with Daniel Barenboim, Michel Plasson, Sir Neville Marriner, Marco Armiliato, Francisco Araiza, and Sonya Yoncheva.',
      p1: 'I began studying classical singing and music at age twenty—unusually late for the classical world. Without childhood conservatory schooling or rigid rote drills, I immersed myself directly into the physical reality of sound, listening with absolute intensity.',
      p2: 'By training auditory memory to recognize chords, vocal colors, and acoustic tensions directly in the body before naming them, I bypassed years of mechanical stumbling. Just two years later, I won a scholarship to France and subsequently graduated from the CNSMDP in Paris as valedictorian.',
      p3: 'Following two years in the Young Artist Program at the Staatsoper Berlin, I debuted in principal tenor roles across Europe: the title role in Massenet’s Werther at the Opéra National de Paris, Alfredo in Verdi’s La Traviata at the Staatsoper Berlin alongside Sonya Yoncheva, Faust, and Malcolm in Macbeth.',
      p4: 'Today, I bring this exact directness to my students. Whether preparing a major European audition, learning your first French role, or producing music, you do not need decades of confusion. You need to reconnect with sound as a living, natural language.',
      highlightQuote: '“On stage with an orchestra, you don’t calculate textbook rules. You listen, you feel the harmonic pull, and you sing what is genuine.”',
      viewGalleryBtn: 'View Stage Gallery',
      inquireBtn: 'Inquire for Coaching'
    },
    media: {
      badge: 'Archival Portfolio',
      title: 'Photo & Video Archive',
      subtitle: 'Chronological documentation of European opera productions, dress rehearsals, and musical recordings.',
      tabPhotos: 'Production Photos',
      tabVideos: 'Video Recordings',
      showMore: (count: number) => `Show All ${count} Photos on Page`,
      showLess: 'Show Less (First 12)',
      openFullModal: (count: number) => `Open Full-Screen Grid (${count}) →`,
      fullModalTitle: 'Full Stage & Production Archive',
      close: 'Close',
      allVideosTitle: 'Live Opera & Concert Recordings',
      allVideosSubtitle: 'High-definition video excerpts from productions throughout Europe.',
      filterAll: 'All Videos',
      filterOpera: 'Opera Roles',
      filterTeaching: 'Masterclasses',
      filterComposition: 'Musical Analyses',
      deletePhotoTooltip: 'Remove photo'
    },
    inquiry: {
      modalTitle: 'Consultation & Coaching Inquiry',
      modalSubtitle: 'Please share your voice type, background, or upcoming roles. I reply personally within 24 to 48 hours.',
      labelTopic: 'Area of Focus',
      labelName: 'Your Full Name',
      labelEmail: 'Email Address',
      labelPhone: 'Phone / WhatsApp (Optional)',
      labelMessage: 'Your Message or Current Repertoire',
      placeholderMessage: 'Tell me about your voice type, goals, upcoming auditions, or what you would love to achieve...',
      submitBtn: 'Send Message',
      submitting: 'Sending...',
      successTitle: 'Inquiry Received',
      successDesc: 'Thank you for reaching out. I have received your message and will reply personally within 48 hours.',
      closeBtn: 'Close Window'
    },
    spirituality: {
      awakeningBadge: 'Spiritual Resonance',
      headline: 'Music as Consciousness',
      subheadline: 'When the intellect quiets, sound becomes the direct bridge to being.',
      quotePrompt: '“Between the silence before the first note and the resonance after the last, who is listening?”',
      question: 'who are you?',
      realization: 'You are not the notes. You are the awareness in which the music unfolds.',
      reflectionP1: 'In the ancient tradition of sound, music is not mere entertainment or technical athletics. It is a mirror of the self. When harmonic tension resolves, tension in the mind dissolves with it.',
      reflectionP2: 'True vocal and artistic mastery begins when the ego steps aside and allows the resonant body to serve as an unhindered instrument of universal harmony.',
      returnBtn: 'Return to Studio'
    },
    footer: {
      tagline: 'Somatic music education, ear-first acoustic training, and French lyric opera coaching by Abdellah Lasri.',
      navigationHeader: 'Explore',
      locationsHeader: 'Studio Locations',
      locationsText: 'Available in NRW (Düsseldorf / Cologne / Essen), Berlin, and online worldwide.',
      copyright: 'All rights reserved. Dedicated to authentic acoustic mastery.'
    },
    languageToggle: {
      switchToGerman: 'Auf Deutsch umschalten',
      switchToEnglish: 'Switch to English',
      currentLanguageLabel: 'English'
    }
  },
  de: {
    nav: {
      method: 'Die Methode',
      audiences: 'Für Wen',
      french: 'Französisches Coaching',
      contemporaryVocal: 'Modernes Coaching',
      musicTheory: 'Musiktheorie',
      about: 'Über Mich',
      media: 'Fotos & Videos',
      spirituality: 'Spiritualität (Demnächst)',
      contact: 'Kontakt / Buchen'
    },
    hero: {
      badge: ['emotion-first pedagogy', 'vocal atelier', 'Music theory'],
      titleMain: 'Musik ist eine natürliche Sprache, die jeder versteht.',
      titleSub: 'Noten auf Papier sind nur eine Repräsentation.',
      summary: 'An der Schwelle, wo Fühlen auf Verstehen trifft, verändert die Musik ihre Stimme. Jeder Akkord hat seine Farbe, sein Gewicht. Kein Ton wird zweimal gleich gesungen. Ein ganzes Spektrum öffnet sich, Nuancen, von denen wir nie ahnten, dass wir sie hören oder fühlen können – und wir lauschen nicht den Worten, sondern dem Klang selbst, erbebend bei der leisesten Veränderung.',
      locationAvailability: 'Verfügbar in NRW (Köln / Düsseldorf / Essen), Berlin oder weltweit online.',
      highlights: {
        location: 'NRW (Köln / Düsseldorf / Essen) · Berlin · Online weltweit',
        credentials: 'CNSMDP Paris Jahrgangsbester · Staatsoper Berlin Opernstudio',
        stages: 'Operalia finalist · Aalto Stage Prize for Young Artists'
      },
      ctaPrimary: 'Stunde anfragen / Buchen',
      ctaMethod: 'Die Methode entdecken ↓',
      uploadPhoto: 'Foto hochladen',
      photoUpdated: 'Foto aktualisiert!',
      processing: 'Wird verarbeitet...'
    },
    featuredVideo: {
      eyebrow: 'Live-Bühnen-Spotlight',
      title: 'Die Stimme Erleben',
      subtitle: 'Ausgewählte Bühnenausschnitte und Live-Aufnahmen aus europäischen Opernhäusern und Konzertsälen.',
      shuffle: 'Zufälliges Video',
      nowPlaying: 'Aktuelle Wiedergabe',
      watchOnYouTube: 'Auf YouTube ansehen',
      inquireRole: 'Vorsingen / Rollen-Coaching anfragen',
      exploreSpirituality: 'Musikalische Selbsterkenntnis entdecken',
      videoArchiveTitle: 'Ausgewählte Aufnahmen'
    },
    method: {
      badge: 'Pädagogischer Ansatz',
      title: 'Die Methode: Emotionsorientiertes Lernen',
      subtitle: 'Abstrakte Notenlehre hemmt Musiker oft jahrelang. Wenn Sie Klang und Resonanz zuerst im Körper verankern, entwickeln sich Notenlesen, Stimmfreiheit und echte Interpretation in Rekordzeit.',
      pillar1Title: 'Auditives Gedächtnis zuerst',
      pillar1Desc: 'Intervalle, harmonische Spannungen und Phrasierungen als körperliche Empfindungen spüren – statt als mathematische Berechnungen auf Notenlinien.',
      pillar2Title: 'Notenschrift als Stenografie',
      pillar2Desc: 'Partituren mühelos erfassen, weil das innere Ohr den Klang bereits vorwegnimmt, noch bevor Stimmbänder schwingen oder Tasten berührt werden.',
      pillar3Title: 'Somatischer Atem & Resonanz',
      pillar3Desc: 'Singen ohne Kehldruck: Das Öffnen der natürlichen akustischen Räume für eine freie, tragfähige und strahlende Projektion über jedes Orchester.',
      demoHint: 'Interaktives Gehörexperiment: Spüren Sie unmittelbar, wie sich harmonische Spannung in Konsonanz auflöst.',
      ctaBookMethod: 'Eine somatische Stunde erleben'
    },
    audiences: {
      badge: 'Maßgeschneiderte Begleitung',
      title: 'Für Wen Dieser Unterricht Ist',
      subtitle: 'Gezielte, praxisnahe Förderung abgestimmt auf Ihre individuellen musikalischen Meilensteine.',
      card1Badge: 'Französische Klassik & Kunstgesang',
      card1Title: 'Französische Oper, Mélodie & Interpretation',
      card1Subtitle: 'Eleganter französischer Stil & Sprachcoaching für Sänger und Pianisten',
      card1Desc: 'Ein spezialisiertes Meisterkurs-Coaching für authentische Interpretation französischer Klassik, französischer Oper und die Poesie der Mélodie. Fokus auf den eleganten französischen Stil, präzises Sprachcoaching und die gemeinsame Ausgestaltung für Sänger und Liedbegleiter (Pianisten).',
      card1Points: [
        'Französische Diktion meistern: Die französische Sensibilität begreifen und die Balance zwischen authentischer französischer Eleganz und Ihrem wahren Selbst finden',
        'Deep-Dive in die französische Mélodie (Fauré, Debussy, Ravel, Duparc) für Sänger & Pianisten',
        'Rollenstudium im französischen Opernfach (Massenet, Gounod, Bizet) mit Pariser CNSMDP-Expertise',
        'Präzises Sprachcoaching & Phonetik – pure Eleganz ohne steife Theatermanierismen'
      ],
      card1Cta: 'Französisches Coaching',
      card2Badge: 'Produzenten & Beatmaker',
      card2Title: 'Musikproduzenten & Komponisten',
      card2Subtitle: 'Intuition in harmonische Meisterschaft verwandeln',
      card2Desc: 'Schluss mit austauschbaren Akkord-Packs: Verbinden Sie Ihre DAW-Intuition mit klassischem Harmoniebewusstsein für Tracks, die emotional wirklich berühren.',
      card2Points: [
        'Gehörbildung abgestimmt auf moderne Beat- und Track-Produktion',
        'Eigene Akkordfolgen gezielt nach Gefühl und Wirkung formen',
        'Orchestrale Farbigkeit und Tiefe in eigene Produktionen einbinden'
      ],
      card2Cta: 'Produzenten-Coaching',
      card3Badge: 'Aktive Hörer',
      card3Title: 'Musikliebhaber & Neugierige',
      card3Subtitle: 'Ebenen und Emotionen hören, die zuvor verborgen blieben',
      card3Desc: 'Kein Instrument nötig: Erleben Sie, wie Spannung und Lösung in Oper, Klassik und Filmmusik wirken, um Musik auf einer völlig neuen Ebene wahrzunehmen.',
      card3Points: [
        'Spannung und Erlösung in jedem Werk unmittelbar heraushören',
        'Opern und Orchesterwerke mit einem Profi-Sänger neu entdecken',
        'Entspannte Gehörbildung mit Freude – ganz ohne Prüfungsdruck'
      ],
      card3Cta: 'Hör-Sessions',
    },
    french: {
      badge: 'Spezialisierte Disziplin',
      title: 'Französisches Repertoire & Diktion',
      subtitle: 'Von Massenet und Gounod bis Debussy und Fauré: Die akustischen Feinheiten des französischen Kunstgesangs mit natürlicher Leichtigkeit und Strahlkraft meistern.',
      tabOneTime: '★ EINMALIGER INTENSIVKURS',
      tabOngoing: 'FORTLAUFENDES COACHING',
      whoIsItFor: 'Für wen dieser Schwerpunkt gedacht ist:',
      takeawaysTitle: 'Ihre konkreten Ergebnisse:',
      topicsTitle: 'Schwerpunkte & Module:',
      autonomyTitle: 'Vollständige Autonomie',
      autonomyDesc: 'Das oberste Ziel ist Unabhängigkeit: Sie erlernen die phonetischen und akustischen Gesetze des Französischen so fundiert, dass Sie nie wieder von Wörterbüchern oder Coaches abhängig sind.',
      ctaApply: 'Diesen Schwerpunkt anfragen',
      locationNote: 'Verfügbar in NRW (Deutschland), Berlin oder weltweit online'
    },
    contemporaryVocal: {
      badge: 'Gesangscoaching · Muskuläres Fundament, Emotionale Übertragung & Tour-Resilienz',
      title: 'Die gesunde Basis: Belastbarkeit, Langlebigkeit & Emotion',
      subtitle: 'Zwanzig Jahre auf europäischen Opernbühnen haben mich eines gelehrt: Wenn die Stimme auf einem fundierten Muskel- und Atemsystem ruht, meistert man anstrengende Probenwochen, Müdigkeit und Erkältungen – vollkommen ohne Stimmbandknötchen.',
      credoQuote: 'Zu behaupten, ich hätte in zwanzig Jahren nie Stimmermüdung gespürt, wäre schlicht eine Lüge. Man singt manchmal zu viel, Probenphasen ziehen sich über Wochen, Reisen schlauchen oder man fängt sich eine Erkältung ein. Die wahre Kunst ist, wie man sicher durch all das hindurch navigiert. Wenn die muskuläre Basis und das Atemsystem tief verankert sind, übernimmt der Körper bei Erschöpfung automatisch die Arbeit und nimmt den gesamten Druck von den Stimmbändern. Keine Knötchen. Keine Überlastung. Sondern eine gesunde Basis, mit der man lange Konzerte und 40 Tour-Termine souverän übersteht.',
      credoTagline: 'CNSMDP Paris Jahrgangsbester · 20+ Jahre Europäische Opern-Hauptrollen · Null Knötchen · Anatomische Resilienz',
      hookQuote: 'Musik ist Emotion. Doch wenn wir von unseren Gefühlen überwältigt werden, schnürt die Kehle zu und wir können nicht mehr frei singen. Wahre Vokalkunst bedeutet, tief mit Emotionen in Kontakt zu treten – und sie dann klar ans Publikum weiterzugeben, ohne die Stimme zu blockieren.',
      hookSubquote: 'Meine Aufgabe ist es, Ihnen ein Fundament zu geben, das Sie durch jede Erschöpfung trägt: Wenn die Müdigkeit kommt, weiß Ihr Körper exakt, was zu tun ist – und entlastet die Stimme vollständig.',

      roleBadge: 'Das Gesamtkonzept',
      roleTitle: 'Die drei Säulen stimmlicher Souveränität',
      roleSubtitle: 'Ein solides Muskel- und Atemsystem, emotionale Übertragung ohne Enge, und verlässliche Entlastung bei Erschöpfung.',
      roleTeacher: {
        badge: '1. DAS PHYSISCHE INSTRUMENT',
        title: 'Muskuläre Basis & Atemsystem',
        desc: 'Aufbau eines belastbaren Muskelapparats und eines kultivierten Atemsystems, das die Stimmbänder über unzählige Probenwochen und Gesangsstunden hinweg verlässlich schützt.'
      },
      roleCoach: {
        badge: '2. DAS EMOTIONALE PARADOXON',
        title: 'Emotionen spüren & transparent übertragen',
        desc: 'Wir müssen die Emotion intensiv fühlen. Doch wer emotional überwältigt wird, verliert die Stimmkontrolle. Wir lernen, Gefühle ganzheitlich zu erfassen und sie ungefiltert ans Publikum weiterzuleiten, ohne dass die Kehle zuschnürt.'
      },
      roleSpecialist: {
        badge: '3. TOUR-RESILIENZ & NULL KNÖTCHEN',
        title: 'Müdigkeit navigieren & 40 Tour-Dates überstehen',
        desc: 'Wenn Erschöpfung oder ein Infekt während einer Tournee eintreten, übernimmt der Körper die Last. Der Druck wird vollkommen von der Kehle genommen – für dauerhafte Stimmgesundheit ohne Knötchenrisiko.'
      },

      pharyngealBadge: 'Klang-Alchemie · Biomechanisches Prinzip',
      pharyngealTitle: 'Arena-Belting durch dynamischen Pharynx-Raum',
      pharyngealSubtitle: 'Die Physik modernen Belting-Sounds: Wie man sich im dichten elektronischen Mix durchsetzt – ohne Stimmband-Kollision.',
      contrastLeftTag: 'Klassischer Resonanz-Dom',
      contrastLeftTitle: 'Der offene akustische Resonanzraum (Oper)',
      contrastLeftDesc: 'Im klassischen Gesang weiten wir den unteren Rachenraum und senken den Kehlkopf, um ein gewaltiges Megafon zu formen, das 90 Instrumente ohne Mikrofon übertönt. Das erzeugt majestätische Tiefe, schafft aber dunkle Vokale, die modernen Pop-Produktionen fremd sind.',
      contrastRightTag: 'Moderne Kompression',
      contrastRightTitle: 'Dynamische Epilarynx-Fokussierung (Moderner Belt)',
      contrastRightDesc: 'Mit dem Mikrofon ist reine Lautstärke gelöst. Für einen modernen Arena-Belt verengen wir gezielt den Epilarynx-Trichter, aktivieren sanfte mediale Kompression und verstärken die orale Brillanz. Der Ton wird laser-scharf und emotional schneidend – er durchdringt 808-Bässe und Gitarrenwände ohne jede Überanstrengung.',
      noduleWarningBadge: 'DIE FALLE DES ERZWUNGENEN „CHEST-PULLING“',
      noduleWarningText: 'Viele Sänger versuchen zu belten, indem sie rohe Brustluft gegen verkrampfte Stimmbänder pressen. Das führt unweigerlich zu Heiserkeit und Knötchen. Dynamische Epilarynx-Fokussierung liefert zehnfache Durchsetzungskraft bei federleichter Leichtigkeit und absolutem Stimmbandschutz.',

      retainersBadge: 'Private Retainer & Begleitung',
      retainersTitle: 'Ein solides Fundament für außergewöhnliche Stimmen',
      retainersSubtitle: 'Für Recording-Künstler, Tournee-Solisten, Produzenten und private Persönlichkeiten auf der Suche nach absoluter stimmlicher Souveränität.',
      retainerStudio: {
        badge: 'STUDIO-TRACKING & RECORDING',
        title: 'Vocal Producer & Klang-Alchemist',
        tagline: 'Strahlende, zeitlose Takes & Vollkommene Stimmfrische',
        desc: 'Aufnahmesessions sind kostbar und fordernd. Als diskreter On-Call Vocal Fixer stelle ich sicher, dass Ihre Stimme vom ersten bis zum finalen Take leuchtend, elastisch und vollkommen unverkrampft bleibt.',
        deliverables: [
          'Pre-Tracking Dekompression & Kalibrierung des subglottischen Luftstroms',
          'Mikro-Resets zwischen den Vocal-Passes zur Beseitigung jeglicher Ermüdung',
          'Formanten-Feinabstimmung, damit die Stimme organisch im Mix sitzt',
          'Sofortige Stimm-Wiederherstellung bei mehrtägigen, intensiven Tracking-Plänen'
        ]
      },
      retainerTour: {
        badge: 'ARENA- & TOUR-AUSDAUER',
        title: 'Tournee-Endurance & Backstage-Sanctuary',
        tagline: 'Unzerstörbare Ausdauer für anspruchsvolle Tournee-Kalender',
        desc: 'Lange Reisen und trockene Hotel-Klimaanlagen fordern ihren Tribut. Wir errichten einen unerschütterlichen physiologischen und mentalen Schutzschild, damit Ihre Stimme an Show 40 so strahlt wie am Eröffnungsabend.',
        deliverables: [
          'Das 15-Minuten-Backstage-Notfallprotokoll für schnelle Stimmbandregeneration',
          'Atemstabilisierung unter anspruchsvollen Choreografien und Live-Dynamik',
          'Sanfte Abschwellungs- und Kühlungsrituale nach intensiven Konzerten',
          'Diskreter Raum für Ruhe, Fokussierung und mentale Zentrierung'
        ]
      },
      retainerMentorship: {
        badge: 'DISKRITES INTENSIVPROGRAMM',
        title: '12-Wochen Privates Stimm-Mentoring',
        tagline: 'Von körperlicher Biomechanik zu grenzenloser künstlerischer Entfaltung',
        desc: 'Eine tiefgreifende 1:1-Transformation, die Ihnen die dauerhafte Souveränität über Ihr Instrument schenkt, jede stimmliche Barriere auflöst und Ihre wahrhaftigste, mutigste Stimme freilegt.',
        phases: [
          {
            phase: 'Woche 1–4',
            title: 'Anatomie, Atem & Das italienische Appoggio',
            desc: 'Entkopplung der Nackenmuskulatur, Aktivierung tiefer Becken-Zwerchfell-Stützen und Ende des Kehlkopfdrucks an der Wurzel.'
          },
          {
            phase: 'Woche 5–8',
            title: 'Dynamisches Belting & Akustische Kompression',
            desc: 'Beherrschung des Epilarynx, nahtlose Verbindung von Brust- und Kopfstimme und gesunde, ausdrucksstarke Texturen.'
          },
          {
            phase: 'Woche 9–12',
            title: 'Tour-Konditionierung, Mysterium & „The Zone“',
            desc: 'Tägliche Langlebigkeits-Routinen, Auflösung von Bühnenangst und Eintreten in den Flow-Zustand, in dem Technik verschwindet und reine Magie wirkt.'
          }
        ]
      },

      pillarsBadge: 'Die Vier Säulen der Meisterschaft',
      pillarsTitle: 'Die Synthese aus Wissenschaft, Geist & Leidenschaft',
      pillarsSubtitle: 'Elite-Klassik-Physik für moderne Durchschlagskraft, unendliche Freiheit und tiefes emotionales Berühren.',
      pillars: {
        breathTitle: 'Italienische Appoggio-Mechanik · Geerdete Freiheit',
        breathTagline: 'Tiefe Rumpf-Ausdehnung & Null Nackenspannung',
        breathDesc: 'Wir nutzen das legendäre Fundament der alten italienischen Meister – eine tiefe, elastische Körperstütze, die jeden Ton wie eine unsichtbare Säule trägt. Keine starre Theaterhaltung, kein künstliches Dauervibrato. Ihr Klang bleibt natürlich, sprechnah und unverwechselbar.',
        rangeTitle: 'Nahtlose Mix Voice, Mühelose Höhen & Agile Runs',
        rangeTagline: 'Akustische Kompression ohne Druck oder Registerbrüche',
        rangeDesc: 'Nie wieder Furcht vor hohen Tönen. Entdecken Sie die klangliche Brillanz der gemischten Stimme, nahtlose Registerübergänge, flexible Pentatonik-Läufe und kontrollierten Straight-Tone, der gezielt in warmes Vibrato aufblüht.',
        habitsTitle: '20-Jahre-Langlebigkeit & Die Routine des Vokal-Athleten',
        habitsTagline: '15-Minuten tägliche Pflege für lebenslange Belastbarkeit',
        habitsDesc: 'Singen ist Hochleistungssport von extremer Präzision. Gemeinsam etablieren wir ein persönliches tägliches Ritual aus Hydratation, sanfter Phonation und Erholung, das Ihre Stimmbänder geschmeidig und jederzeit einsatzbereit hält.',
        theZoneTitle: 'Das Herzstück: „The Zone“ & Pure Leidenschaft',
        theZoneTagline: 'Bühnenangst auflösen in pure emotionale Hingabe',
        theZoneDesc: 'Wenn die Biomechanik in Fleisch und Blut übergeht, weicht jede Angst dem Staunen. Wir lösen Anspannung vollkommen auf, damit Sie in „The Zone“ eintreten – jenen Zustand, in dem die Technik verblasst und die Seele direkt zum Publikum spricht.'
      },

      genresBadge: 'Genre-Welten',
      genresTitle: 'Echte Seele in jedem Stil',
      genresSubtitle: 'Von intimer Bedroom-Pop-Produktion bis zur Stadion-Bühne – jedes Genre erhält stilistische Authentizität und anatomische Sicherheit.',
      genres: [
        {
          id: 'rnb-soul',
          name: 'R&B, Soul & Neo-Soul',
          tag: 'Agilität & Ausdruck',
          tagline: 'Mühelose Pentatonik-Läufe & Warme Register',
          desc: 'Meistern Sie die Stimmband-Schließung und Agilität für blitzschnelle Melismen, samtweiche Registerwechsel und rohe, berührende Emotion.',
          skills: [
            'Präzise Riffs & Runs ohne Druck auf den Kehlkopf',
            'Nahtlose Übergänge zwischen Brust- und Kopfstimme',
            'Intime Phrasierung, Ad-Libs & modernes Timing',
            'Vom zarten Hauch bis zum kraftvollen Soul-Belt'
          ]
        },
        {
          id: 'pop-commercial',
          name: 'Pop & Contemporary Mainstream',
          tag: 'Radio-Tauglicher Glanz',
          tagline: 'Gesunder Belt, Vokalformanten & Moderner Mix',
          desc: 'Entwickeln Sie einen klaren, modernen Sound, der sich im Mix auf Streaming-Plattformen oder im Live-Monitoring souverän durchsetzt.',
          skills: [
            'Kraftvolles, ermüdungsfreies Belting & Mix Voice',
            'Straight-Tone-Präzision mit gezieltem Vibrato-Abschluss',
            'Nahbesprechungseffekt am Mikrofon & Studio-Dynamik',
            'Gezielte Formanten-Anpassung für modernen Glanz'
          ]
        },
        {
          id: 'jazz-blues',
          name: 'Jazz, Blues & Gesangskunst',
          tag: 'Textur & Phrasierung',
          tagline: 'Resonanzräume & Sprechnahe Phrasierung',
          desc: 'Lernen Sie, Ihre Resonanzräume gezielt zu steuern: von warmen, rauchigen Farben bis zu intimer, sprechnaher Geschichtenerzählung.',
          skills: [
            'Natürliche Speech-Level-Diktion und ehrliche Erzählung',
            'Gesunde raue, hauchige Texturen ohne Stimmbandschäden',
            'Scat-Gesang, Synkopen und stilsichere Improvisation',
            'Warme, tragende Tiefe durch gezielte Resonanzanpassung'
          ]
        },
        {
          id: 'indie-rock',
          name: 'Indie, Rock & Songwriter',
          tag: 'Authentizität & Kraft',
          tagline: 'Dauerhafte Belastbarkeit & Eigene Identität',
          desc: 'Schützen Sie Ihr Instrument bei intensiven Tourneen und maximalem emotionalem Einsatz, ohne Ihre raue, ungeschminkte Kante zu verlieren.',
          skills: [
            'Sicherer rauer Overdrive & Stimmbandkompression ohne Knötchenrisiko',
            'Echte, ungestelzte Interpretation mit lyrischer Tiefe',
            'Dynamikkontrolle für Akustik-Sets und laute Live-Bands',
            'Nervensystem-Erdung für furchtlose Bühnenpräsenz'
          ]
        }
      ],

      gatekeepersBadge: 'Die Architektur der Meisterschaft',
      gatekeepersTitle: 'Wissenschaft, Passion, Mysterium & Zuflucht',
      gatekeepersSubtitle: 'Ein seltener Ort, an dem weltklasse Vokal-Physik dem heiligen Feuer menschlicher Empfindung dient.',
      gatekeeperCards: [
        {
          category: 'DIE WISSENSCHAFT · 50%',
          title: 'Unzerstörbare Biomechanik',
          subtitle: 'Die Anatomie von 20 Jahren Ausdauer',
          benefit: 'Subglottische Druckentkopplung, akustische Impedanz und dynamischer Pharynx-Raum. Die physische Meisterschaft, die Ihre Stimme über Jahrzehnte schützt.'
        },
        {
          category: 'DIE PASSION · 30%',
          title: 'Das heilige Feuer des Gesangs',
          subtitle: 'Reine Kunst & Emotionale Wahrheit',
          benefit: 'Singen ist ein Akt tiefer menschlicher Verbindung. Wir lösen innere Hürden, damit jeder Ton echte Wahrhaftigkeit, Verletzlichkeit und Gänsehaut transportiert.'
        },
        {
          category: 'DAS MYSTERIUM · 20%',
          title: 'Die verborgene Architektur',
          subtitle: 'Esoterische Akustik-Physik',
          benefit: 'Die unsichtbare Geometrie der Resonanzräume alter europäischer Meister: Wie reiner Atem in strahlende, mühelose akustische Energie verwandelt wird.'
        },
        {
          category: 'DER SOLIDE RAHMEN',
          title: 'Diskrete Privat-Praxis',
          subtitle: 'Vertraulichkeit & Zuflucht',
          benefit: 'Ein exklusiver, geschützter Raum für professionelle Künstler, Tournee-Musiker und Privatschüler. Absolute Diskretion und pure Hingabe an die Stimme.'
        }
      ],

      diagnosticBadge: 'Das 45-Minuten-Diagnose-Protokoll',
      diagnosticTitle: '45-Minuten Stimm-Biomechanik-Diagnose buchen',
      diagnosticSubtitle: 'Diagnose technischer Engpässe innerhalb von 15 Minuten',
      diagnosticDesc: 'Erleben Sie die diagnostische Präzision eines internationalen Opern-Solisten. In einer intensiven 45-minütigen Session analysieren wir Ihre akustische Kompression, subglottischen Druckverlust und Kehlkopfspannung – mit direktem Fahrplan für Ihre Stimme.',
      diagnosticDeliverables: [
        '15-Minuten-Diagnose: Erkennung struktureller Blockaden und Druckpunkte',
        'Individueller Fahrplan für sicheres Arena-Belting, Range-Erweiterung & Mix-Voice',
        'Notfall-Stimmband-Reset-Protokoll (15 Min.) abgestimmt auf Ihre Stimme',
        'Direkte Beratung für Managements, Produzenten oder Privatschüler'
      ],
      ctaBook: '45-Minuten Stimm-Diagnose anfragen',
      ctaExploreClassical: 'Klassische Meisterkurse & Diktion ansehen',
      audioOptionalHint: 'Optional: Fügen Sie Ihrer Anfrage einen Link zu Ihrem Spotify-Release, SoundCloud-Demo oder einer Sprachmemo bei.'
    },
    musicTheory: {
      badge: 'Emotions-zuerst-Pädagogik',
      title: 'Musiktheorie: Klang, harmonische Wahrnehmung & Farbe',
      subtitle: '',
      quoteText: 'Bevor es Partituren gab, gab es das Hören. Musik ist eine Sprache, die Sie bereits verstehen: Eine aufsteigende Linie hebt Sie empor, ein getragener Akkord beruhigt, eine plötzliche Stille lässt Sie den Atem anhalten. Genau dort setzt mein Unterricht an – bei der Wirkung der Musik auf Sie. Sobald Sie dieses Empfinden erkennen, hört die Notation auf, ein zu entschlüsselnder Code zu sein, und wird zu einem einfachen Weg, das aufzuschreiben, was Sie bereits hören.',
      quoteAuthor: '',
      secretGardenTag: '1 · Der persönliche Klangraum',
      secretGardenTitle: 'The Secret Garden (Der geheime Garten)',
      secretGardenIntro: 'Nennen Sie es Ihren geheimen Garten, Ihre eigene Klangwerkstatt oder einfach Ihren ganz privaten Ort. Es ist der Raum, in dem Sie und Ihre Musik einander kennenlernen. Hier lernen Sie, die feinsten Nuancen und Farben eines Klanges zu spüren und sie unter dem Mikroskop zu betrachten, bis aus einer vagen Ahnung ein glasklares Empfinden wird.',
      secretGardenWaysTitle: 'Wir erforschen ihn auf vielfältige Weise:',
      secretGardenItems: [
        { label: 'Farben-Hören', desc: 'Intervalle und Akkorde wahrnehmen und ihre Klangfarbe beschreiben.' },
        { label: 'Auditives Gedächtnis', desc: 'durch gezielte Übungen stetig erweitern.' },
        { label: 'Synästhesie', desc: 'entdecken, ob und wie Klang für Sie mit Farbe, Form oder Berührung verschmilzt.' },
        { label: 'Harmonie in der Praxis', desc: 'grundlegende Harmonik hören und die Funktion jedes Akkords erfassen.' },
        { label: 'Genres', desc: 'verschiedene Musikstile erkunden und spüren, wie jeder einzelne auf Sie wirkt.' },
        { label: 'Rhythmus', desc: 'durch körperliches Fühlen studieren – indem Sie selbst zum Rhythmus werden.' }
      ],
      secretGardenClosing: 'Hinter jeder Übung steht die entscheidende Frage: Was bewirkt diese Musik in mir?',
      theoryTag: '2 · Die Musiktheorie',
      theoryTitle: 'The Music Theory (Die Musiktheorie)',
      theoryIntro: 'Der Schwerpunkt liegt auf der Entwicklung eines geschulten Gehörs, doch das Notenlesen bleibt eine wichtige Säule. Eine Vielzahl an Gedankenstützen und spielerischen Rätseln beschleunigt die Lernkurve spürbar.',
      theoryItems: [
        { label: 'Die Grundlagen (nach Bedarf)', desc: 'was Musik ist und wie Frequenzen physikalisch wirken.' },
        { label: 'Die Tonleiter auswendig', desc: 'Do, Re, Mi, Fa, Sol, La, Si, Do – rezitiert bis zur mühelosen Automatisierung.' },
        { label: 'Das Notensystem, Schritt für Schritt', desc: 'Noten werden behutsam eingeführt, mit Reaktionsspielen, bis das Lesen zur zweiten Natur wird.' },
        { label: 'Farben aus dem Secret Garden', desc: 'die dort erarbeitete Farbpalette nutzen, um Intervalle und Harmonien wiederzuerkennen.' },
        { label: 'Musikstücke im Detail zerlegt', desc: 'jeden Aspekt ausgewählter Stücke analysieren und musikalisch verstehen.' }
      ],
      interactiveTitle: 'Interaktives Farb- & Gewichts-Atelier',
      interactiveSubtitle: 'Wählen Sie einen Akkord, um seine akustische Flügelresonanz zu hören und sein emotionales Gewicht, seine Farbtemperatur und seine Anziehungskraft zu spüren.',
      interactiveHint: 'Akustischer Konzertflügel · Jeder Akkord ertönt sofort beim Anschlagen · Für vollen Bass und Obertöne mit Kopfhörern empfohlen.',
      pianoInstrument: 'Steinway-Konzertflügel',
      synthInstrument: 'Harmonische Sinustöne',
      instrumentLabel: 'Klangquelle',
      somaticTitle: 'Somatische Resonanz',
      somaticSubtitle: 'Physisches Resonanzfeld',
      somaticOn: 'Resonanz Aktiv',
      somaticOff: 'Resonanz Deaktiviert',
      somaticHint: 'Visualisiert die physische Schwingung und Ausbreitung der Harmonien im Körper und Raum.',
      audiencesTitle: 'Für wen ist diese Musiktheorie?',
      producerBadge: 'Produzenten & Beatmaker',
      producerTitle: 'Frei von generischen Preset-Packs',
      producerDesc: 'Lösen Sie sich von starren Akkord-Presets. Verstehen Sie Akkord-Substitutionen, Zwischendominanten und Stimmführung, um tiefe, atmosphärische Tracks für R&B, Neo-Soul, Pop und Filmmusik zu erschaffen.',
      singerBadge: 'Sänger & Songwriter',
      singerTitle: 'Resonante Intonation & Phrasierung',
      singerDesc: 'Verstehen Sie den harmonischen Kontext unter Ihrer Gesangslinie. Singen Sie im Einklang mit der emotionalen Farbe des Akkords, damit Ihre Intonation mit natürlicher Resonanz und Gänsehaut-Präzision rastet.',
      classicalBadge: 'Instrumentalisten & Musikliebhaber',
      classicalTitle: 'Die verborgene Architektur der Meister',
      classicalDesc: 'Entschlüsseln Sie das harmonische Genie von Debussy, Ravel, Chopin, Wagner und Puccini. Hören Sie mit geschärftem Gehör die psychologischen Dramen, die in jeder Modulation verwoben sind.',
      ctaButton: 'Stunde für Musiktheorie & Harmonie anfragen',
      ctaNote: 'Einzelsitzungen verfügbar in NRW (Köln / Düsseldorf / Essen), Berlin oder weltweit online'
    },
    biography: {
      badge: 'Künstlerischer Werdegang',
      title: 'Wie ich mit 20 anfing und schnell lernte',
      subtitle: 'Vom Quereinstieg mit zwanzig Jahren ohne Vorbildung zum Frankreich-Stipendium in nur zwei Jahren – und zu führenden Tenor-Hauptrollen an Europas Opernbühnen.',
      point1Title: 'CNSMDP Paris Jahrgangsbester',
      point1Desc: 'Gewinner des Frankreich-Stipendiums und summa cum laude Absolvent des Conservatoire National Supérieur de Musique de Paris.',
      point2Title: 'Führende Opernhäuser Europas',
      point2Desc: 'Tenor-Hauptrollen an der Opéra National de Paris (Werther), Staatsoper Berlin (Alfredo in La Traviata), Deutsche Oper Berlin, Aalto-Theater Essen.',
      point3Title: 'Hochkarätige Zusammenarbeit',
      point3Desc: 'Zusammenarbeit mit Daniel Barenboim, Michel Plasson, Sir Neville Marriner, Marco Armiliato, Francisco Araiza und Sonya Yoncheva.',
      p1: 'Ich kam ungewöhnlich spät zum klassischen Gesang: Erst mit zwanzig Jahren begann ich, mich intensiv mit Musik zu beschäftigen. Ohne jahrelangen kindlichen Konservatoriumsunterricht tauchte ich direkt in das lebendige Phänomen des Klangs ein und hörte mit bedingungsloser Aufmerksamkeit zu.',
      p2: 'Indem ich Akkorde, Klangfarben und Spannungen unmittelbar im Körper spürte, bevor ich sie benannte oder aufschrieb, ersparte ich mir jahrelanges mechanisches Herumprobieren. Nach nur zwei Jahren gewann ich ein Stipendium für Frankreich und schloss mein Studium am renommierten CNSMDP in Paris als Jahrgangsbester ab.',
      p3: 'Nach zwei Jahren im Opernstudio der Staatsoper Berlin folgten internationale Debüts in Tenor-Hauptrollen: Die Titelpartie in Massenets Werther an der Opéra National de Paris, Alfredo in Verdis La Traviata an der Staatsoper Berlin (an der Seite von Sonya Yoncheva), Faust sowie Fenton in Falstaff.',
      p4: 'Genau diese Direktheit gebe ich an meine Schüler weiter. Ob Sie sich auf ein wichtiges Theater-Vorsingen vorbereiten, Ihre erste französische Partie einstudieren oder eigene Musik produzieren: Sie brauchen keine Jahrzehnte der Verwirrung. Sie müssen die Musik wieder als natürliche Sprache begreifen.',
      highlightQuote: '„Auf der Bühne mit Orchester rechnet man keine Lehrbuchregeln ab. Man lauscht, man spürt den harmonischen Zug, und man singt, was wahrhaftig ist.“',
      viewGalleryBtn: 'Bühnengalerie ansehen',
      inquireBtn: 'Coaching anfragen'
    },
    media: {
      badge: 'Archiv & Portfolio',
      title: 'Foto- & Video-Archiv',
      subtitle: 'Chronologische Einblicke in Opernproduktionen, Generalproben und musikalische Aufnahmen.',
      tabPhotos: 'Bühnenfotos',
      tabVideos: 'Videoaufnahmen',
      showMore: (count: number) => `Alle ${count} Fotos anzeigen`,
      showLess: 'Weniger anzeigen (Erste 12)',
      openFullModal: (count: number) => `Vollbild-Galerie öffnen (${count}) →`,
      fullModalTitle: 'Bühnen- & Produktionsarchiv',
      close: 'Schließen',
      allVideosTitle: 'Live-Opern- & Konzertaufnahmen',
      allVideosSubtitle: 'Ausschnitte in hoher Qualität aus Opernproduktionen in ganz Europa.',
      filterAll: 'Alle Videos',
      filterOpera: 'Opernpartien',
      filterTeaching: 'Meisterkurse',
      filterComposition: 'Kompositionen',
      deletePhotoTooltip: 'Foto entfernen'
    },
    inquiry: {
      modalTitle: 'Beratung & Coaching anfragen',
      modalSubtitle: 'Beschreiben Sie kurz Ihr Stimmfach, Ihre Ziele oder anstehende Rollen. Ich antworte persönlich innerhalb von 24 bis 48 Stunden.',
      labelTopic: 'Schwerpunkt',
      labelName: 'Ihr vollständiger Name',
      labelEmail: 'E-Mail-Adresse',
      labelPhone: 'Telefon / WhatsApp (Optional)',
      labelMessage: 'Ihre Nachricht oder aktuelles Repertoire',
      placeholderMessage: 'Erzählen Sie von Ihrem Stimmfach, aktuellen Zielen, bevorstehenden Vorsingen oder woran Sie arbeiten möchten...',
      submitBtn: 'Nachricht absenden',
      submitting: 'Wird gesendet...',
      successTitle: 'Anfrage erfolgreich eingegangen',
      successDesc: 'Vielen Dank für Ihre Kontaktaufnahme. Ich habe Ihre Nachricht erhalten und melde mich innerhalb von 48 Stunden persönlich bei Ihnen.',
      closeBtn: 'Fenster schließen'
    },
    spirituality: {
      awakeningBadge: 'Spirituelle Resonanz',
      headline: 'Musik als Bewusstsein',
      subheadline: 'Wenn der Verstand zur Ruhe kommt, wird Klang zur direkten Brücke zum Sein.',
      quotePrompt: '„Zwischen der Stille vor dem ersten Ton und dem Nachhall nach dem letzten: Wer lauscht?“',
      question: 'wer bist du?',
      realization: 'Du bist nicht die Noten. Du bist das Bewusstsein, in dem sich die Musik entfaltet.',
      reflectionP1: 'In der uralten Tradition des Klangs ist Musik keine bloße Unterhaltung oder mechanische Akrobatik. Sie ist ein Spiegel des inneren Wesens. Löst sich die harmonische Spannung, löst sich auch die Anspannung des Geistes.',
      reflectionP2: 'Wahre stimmliche und künstlerische Meisterschaft beginnt dort, wo das Ego zurücktritt und der resonierende Körper zu einem ungehinderten Instrument universeller Harmonie wird.',
      returnBtn: 'Zurück zum Atelier'
    },
    footer: {
      tagline: 'Somatische Musikpädagogik, gehör-orientierte Ausbildung und französisches Operncoaching von Abdellah Lasri.',
      navigationHeader: 'Übersicht',
      locationsHeader: 'Unterrichtsorte',
      locationsText: 'Verfügbar in NRW (Düsseldorf / Köln / Essen), Berlin sowie weltweite Online-Meisterkurse.',
      copyright: 'Alle Rechte vorbehalten. Gewidmet authentischer akustischer Meisterschaft.'
    },
    languageToggle: {
      switchToGerman: 'Auf Deutsch umschalten',
      switchToEnglish: 'Switch to English',
      currentLanguageLabel: 'Deutsch'
    }
  }
};
