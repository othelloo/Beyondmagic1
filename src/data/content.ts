import { PhotoItem, VideoItem, CourseDetail } from '../types';

export const HERO_PERFORMANCE_IMAGE = '/src/assets/images/opera_hero_performance_1790680283852.jpg';
export const SINGER_PORTRAIT_IMAGE = '/images/portrait.jpg';
export const REHEARSAL_IMAGE = '/src/assets/images/rehearsal_behind_scenes_1790680310364.jpg';
export const PRODUCTION_STAGE_IMAGE = '/src/assets/images/opera_production_stage_1790680324315.jpg';

export const PHOTOS_COLLECTION: PhotoItem[] = [
  {
    "id": "stage-traviata-1",
    "title": "La Traviata (Alfredo & Violetta)",
    "category": "production",
    "image": "/images/onstage/La-Traviata-Sonya-Yoncheva-Violetta-Val_ry-Abdellah-Lasri-Alfredo-Germont-Foto-Bernd-Uhlig.jpg",
    "caption": "Singing Alfredo Germont in Giuseppe Verdi's La Traviata opposite soprano Sonya Yoncheva (Violetta Valery).",
    "venueOrContext": "Staatsoper Berlin / Schiller Theater · Photo: Bernd Uhlig",
    "year": "2015",
    "role": "Alfredo Germont"
  },
  {
    "id": "stage-traviata-2",
    "title": "La Traviata (Confrontation Scene)",
    "category": "production",
    "image": "/images/onstage/La-Traviata-Holger-Jacobs-21-900.jpg",
    "caption": "The intense dramatic confrontation scene in La Traviata, conducted by Daniel Barenboim.",
    "venueOrContext": "Staatsoper Berlin · Photo: Holger Jacobs",
    "year": "2015",
    "role": "Alfredo Germont"
  },
  {
    "id": "stage-traviata-3",
    "title": "La Traviata (Dramatic Finale)",
    "category": "production",
    "image": "/images/onstage/Traviata_48.jpg",
    "caption": "A deeply moving stage moment from Verdi's immortal masterpiece.",
    "venueOrContext": "Staatsoper Berlin",
    "year": "2015",
    "role": "Alfredo Germont"
  },
  {
    "id": "stage-werther-1",
    "title": "Werther (Act III 'Pourquoi me reveiller')",
    "category": "production",
    "image": "/images/onstage/csm_Lasri_-werther_c_Jung_Matthias_1024x670_ff2b9c6b6b.jpg",
    "caption": "Singing the title role of Werther in Jules Massenet's romantic opera.",
    "venueOrContext": "Opera Stage · Photo: Matthias Jung",
    "year": "2016",
    "role": "Werther"
  },
  {
    "id": "stage-werther-2",
    "title": "Werther (Aalto-Theater Essen)",
    "category": "production",
    "image": "/images/onstage/csm_WAWerther199_8e7ee2bb60.jpg",
    "caption": "Critically acclaimed portrayal of the young poet Werther in Massenet's lyric masterpiece.",
    "venueOrContext": "Aalto-Theater Essen",
    "year": "2016",
    "role": "Werther"
  },
  {
    "id": "stage-werther-3",
    "title": "Werther (The Letter Scene)",
    "category": "production",
    "image": "/images/onstage/WAWerther08.JPG",
    "caption": "Atmospheric stage portrayal capturing the emotional depth of Werther.",
    "venueOrContext": "Aalto-Theater Essen",
    "year": "2016",
    "role": "Werther"
  },
  {
    "id": "stage-werther-4",
    "title": "Werther (Solitary Drama)",
    "category": "production",
    "image": "/images/onstage/werther_17.jpg",
    "caption": "Intense interiority and vocal focus in Massenet's Werther.",
    "venueOrContext": "Opera Stage",
    "year": "2016",
    "role": "Werther"
  },
  {
    "id": "stage-werther-5",
    "title": "Werther (Duet with Charlotte)",
    "category": "production",
    "image": "/images/onstage/E-werther2.jpg",
    "caption": "Passionate vocal and dramatic exchange in Act III of Werther.",
    "venueOrContext": "Opera Stage",
    "year": "2016",
    "role": "Werther"
  },
  {
    "id": "stage-werther-6",
    "title": "Werther (Final Resolution)",
    "category": "production",
    "image": "/images/onstage/E-werther5.jpg",
    "caption": "The haunting conclusion of Jules Massenet's Werther.",
    "venueOrContext": "Opera Stage",
    "year": "2016",
    "role": "Werther"
  },
  {
    "id": "stage-faust-1",
    "title": "Faust (Charles Gounod)",
    "category": "production",
    "image": "/images/onstage/E-faust4.jpg",
    "caption": "Portraying the title character Faust in Gounod's grand French opera.",
    "venueOrContext": "Opera National Stage",
    "year": "2018",
    "role": "Faust"
  },
  {
    "id": "stage-duo-shelley",
    "title": "Opera Stage Duet (with Shelley Jackson)",
    "category": "production",
    "image": "/images/onstage/1539969239_21_abdellahlasriundshelleyjackson-100__h-364_v-img__16__9__xl_w-648_-be6819cc57a5436fe2e22755fd9495d5c6ac08f6.jpg",
    "caption": "Dramatic vocal duet performed with soprano Shelley Jackson on the European opera stage.",
    "venueOrContext": "European Opera Production",
    "year": "2017",
    "role": "Leading Tenor"
  },
  {
    "id": "stage-orchestra-gala",
    "title": "Symphony Orchestra Concert Gala",
    "category": "production",
    "image": "/images/onstage/10295294_10152382639231775_3063041552591107591_o.jpg",
    "caption": "Live soloist performance with full symphony orchestra and choir.",
    "venueOrContext": "Concert Hall Gala",
    "year": "Stage Archive",
    "role": "Solo Tenor"
  },
  {
    "id": "stage-scene-modern",
    "title": "Contemporary Opera Staging",
    "category": "production",
    "image": "/images/onstage/15419810_624786874367408_4003300553435267845_o-845x475.webp",
    "caption": "Modern operatic staging blending visceral theatrical acting with classical bel canto singing.",
    "venueOrContext": "European Opera Stage",
    "year": "Stage Archive",
    "role": "Tenor Lead"
  },
  {
    "id": "stage-press-archive",
    "title": "Dramatic Opera Production",
    "category": "production",
    "image": "/images/onstage/imago0100606850w.jpg",
    "caption": "Stage scene from European opera season, documented in the international press archive.",
    "venueOrContext": "European Opera House",
    "year": "Stage Archive",
    "role": "Tenor Lead"
  },
  {
    "id": "stage-recital-gala",
    "title": "Classical Vocal Recital",
    "category": "production",
    "image": "/images/onstage/musique-classique-abdellah-lasri.jpg",
    "caption": "Abdellah Lasri performing lyric tenor arias and classical repertoire.",
    "venueOrContext": "Classical Recital Stage",
    "year": "Stage Archive",
    "role": "Lyric Tenor"
  },
  {
    "id": "stage-theatrical-1",
    "title": "Chamber Opera & Dramatic Staging",
    "category": "production",
    "image": "/images/onstage/14715487_1167683886620344_7904836535870165212_o.jpg",
    "caption": "Intense character portrayal on stage in contemporary production.",
    "venueOrContext": "Opera Stage",
    "year": "Stage Archive",
    "role": "Tenor Lead"
  },
  {
    "id": "stage-dramatic-encounter",
    "title": "Dramatic Duo & High Tension Scene",
    "category": "production",
    "image": "/images/onstage/15443057_1167684259953640_552127129375396965_o.jpg",
    "caption": "Dynamic dramatic exchange between lead soloists in full production.",
    "venueOrContext": "Opera Stage",
    "year": "Stage Archive",
    "role": "Leading Tenor"
  },
  {
    "id": "stage-curtain-call",
    "title": "Curtain Call & Audience Acclaim",
    "category": "production",
    "image": "/images/onstage/15440517_1167683723287027_4298346041862022946_o.jpg",
    "caption": "Receiving the applause of the audience at the close of an opera premiere.",
    "venueOrContext": "Opera House Main Stage",
    "year": "Stage Archive",
    "role": "Tenor Lead"
  },
  {
    "id": "stage-ensemble",
    "title": "Grand Ensemble Scene",
    "category": "production",
    "image": "/images/onstage/15493524_1167683729953693_32029096591630545_o.jpg",
    "caption": "Full cast operatic scene displaying vocal projection and stage craft.",
    "venueOrContext": "European Opera Stage",
    "year": "Stage Archive",
    "role": "Tenor Role"
  },
  {
    "id": "stage-poetic-moon",
    "title": "The Moonlit Terrace Scene",
    "category": "production",
    "image": "/images/onstage/20632730430_89e6fceaa3_b.jpg",
    "caption": "Lyrical poetic staging with stunning moon visual design and romantic lighting.",
    "venueOrContext": "Opera Stage",
    "year": "Stage Archive",
    "role": "Tenor Lead"
  },
  {
    "id": "stage-soliloquy",
    "title": "Stage Monologue & Aria",
    "category": "production",
    "image": "/images/onstage/29255_548_822.jpg",
    "caption": "Solo moment on stage demonstrating intense emotional commitment.",
    "venueOrContext": "Opera House",
    "year": "Stage Archive",
    "role": "Tenor Soloist"
  },
  {
    "id": "stage-vocal-piano",
    "title": "Concert Recital with Grand Piano",
    "category": "production",
    "image": "/images/onstage/936025_10151495165221775_1438648544_n.jpg",
    "caption": "Solo voice and piano performance of French melodie and Italian art songs.",
    "venueOrContext": "Grand Salon Concert",
    "year": "Stage Archive",
    "role": "Tenor Soloist"
  },
  {
    "id": "stage-period-costume",
    "title": "Period Opera (Classic Eighteenth Century)",
    "category": "production",
    "image": "/images/onstage/imgtoolkit.culturebase.jpg",
    "caption": "Elaborate period wigs and baroque costumes in classical opera production.",
    "venueOrContext": "European Opera House",
    "year": "Stage Archive",
    "role": "Opera Character"
  },
  {
    "id": "stage-period-opera-2",
    "title": "Costume Drama in Action",
    "category": "production",
    "image": "/images/onstage/1390715_210561215789978_175656656_n.jpg",
    "caption": "Historical staging with complete classical operatic styling.",
    "venueOrContext": "Opera Stage",
    "year": "Stage Archive",
    "role": "Operatic Character"
  },
  {
    "id": "stage-celebration",
    "title": "Joyous Operatic Celebration",
    "category": "production",
    "image": "/images/onstage/sedfsef.jpg",
    "caption": "Spirited comedic stage energy in festive opera scene.",
    "venueOrContext": "Opera Stage",
    "year": "Stage Archive",
    "role": "Lead Artist"
  },
  {
    "id": "stage-grand-finale",
    "title": "Grand Stage Finale",
    "category": "production",
    "image": "/images/onstage/photo_4.JPG",
    "caption": "Triumphant final chord of production with company and orchestra.",
    "venueOrContext": "Opera House",
    "year": "Stage Archive",
    "role": "Tenor Soloist"
  },
  {
    "id": "stage-art-song",
    "title": "Art Song & Bel Canto Recital",
    "category": "production",
    "image": "/images/onstage/img.jpg",
    "caption": "Vocal presentation focusing on resonance, Italian vowel clarity, and breath flow.",
    "venueOrContext": "Concert Hall",
    "year": "Stage Archive",
    "role": "Concert Tenor"
  },
  {
    "id": "stage-scene-8",
    "title": "Theatrical Operatic Scene",
    "category": "production",
    "image": "/images/onstage/image_8.jpeg",
    "caption": "Live stage performance captured during European opera tour.",
    "venueOrContext": "Opera Stage",
    "year": "Stage Archive",
    "role": "Tenor Role"
  },
  {
    "id": "stage-scene-10",
    "title": "Expressive Operatic Character",
    "category": "production",
    "image": "/images/onstage/image_10.jpeg",
    "caption": "Close-up stage portrait showing intense focus and vocal engagement.",
    "venueOrContext": "Opera Stage",
    "year": "Stage Archive",
    "role": "Tenor Lead"
  },
  {
    "id": "stage-scene-11",
    "title": "Heroic Tenor Presence",
    "category": "production",
    "image": "/images/onstage/image_11.jpeg",
    "caption": "Commanding stage presence in French lyric repertoire.",
    "venueOrContext": "Opera Stage",
    "year": "Stage Archive",
    "role": "Tenor Lead"
  },
  {
    "id": "stage-intimate-scene",
    "title": "Intimate Dramatic Exchange",
    "category": "production",
    "image": "/images/onstage/17122151_10208450693931603_1767986076_o.jpg",
    "caption": "Subtle character interaction in chamber setting.",
    "venueOrContext": "Opera Stage",
    "year": "Stage Archive",
    "role": "Tenor Lead"
  },
  {
    "id": "stage-portrayal-17",
    "title": "Deep Dramatic Resonance",
    "category": "production",
    "image": "/images/onstage/17175992_10208450693811600_463692066_o.jpg",
    "caption": "Capturing the vocal and psychological vulnerability of operatic tragedy.",
    "venueOrContext": "Opera Stage",
    "year": "Stage Archive",
    "role": "Tenor Lead"
  },
  {
    "id": "bts-real-1",
    "title": "Score Study & Piano Coaching",
    "category": "behind_the_scenes",
    "image": "/images/behind_the_scenes/photo.PNG",
    "caption": "Deep musical preparation: working at the piano to internalize harmonic subtleties and vocal freedom before performance.",
    "venueOrContext": "Music Studio",
    "year": "Studio Archive",
    "role": "Vocal Preparation"
  },
  {
    "id": "bts-real-2",
    "title": "Backstage Preparation & Vocal Warm-up",
    "category": "behind_the_scenes",
    "image": "/images/behind_the_scenes/image.jpeg",
    "caption": "Quiet focus moments before stepping onto the opera stage.",
    "venueOrContext": "Opera Dressing Room",
    "year": "Production Life",
    "role": "Stage Preparation"
  },
  {
    "id": "bts-real-3",
    "title": "Rehearsal Hall Staging & Blocking",
    "category": "behind_the_scenes",
    "image": "/images/behind_the_scenes/index.jpg",
    "caption": "Collaborating with directors and cast members on dramatic character intention.",
    "venueOrContext": "Rehearsal Hall",
    "year": "Production Archive",
    "role": "Stage Staging"
  },
  {
    "id": "bts-real-4",
    "title": "Cast Rehearsal & Musical Ensemble",
    "category": "behind_the_scenes",
    "image": "/images/behind_the_scenes/20689751_10102291601883861_3945203505819857741_o.jpg",
    "caption": "Singing through complex ensembles and balancing acoustics in the rehearsal studio.",
    "venueOrContext": "Opera Studio",
    "year": "Stage Archive",
    "role": "Ensemble Rehearsal"
  },
  {
    "id": "bts-real-5",
    "title": "Behind the Scenes Staging Dynamics",
    "category": "behind_the_scenes",
    "image": "/images/behind_the_scenes/20746090_10102291601898831_5913950021023984669_o.jpg",
    "caption": "Refining dramatic blocking, theatrical posture, and vocal connection.",
    "venueOrContext": "Opera House Rehearsal",
    "year": "Production Archive",
    "role": "Stage Craft"
  },
  {
    "id": "bts-real-6",
    "title": "Candid Stage & Studio Life",
    "category": "behind_the_scenes",
    "image": "/images/behind_the_scenes/1897782_268036436709122_3670323377214272728_n.jpg",
    "caption": "An authentic glimpse into the daily dedication, passion, and camaraderie of the operatic journey.",
    "venueOrContext": "Opera Archive",
    "year": "Artist Archive",
    "role": "Studio Life"
  }
];

export const VIDEOS_COLLECTION: VideoItem[] = [
  {
    id: 'vid-werther-paris',
    title: 'Werther (Massenet)',
    category: 'opera',
    youtubeUrl: 'https://www.youtube.com/watch?v=cWED7SDQGY0',
    youtubeId: 'cWED7SDQGY0',
    duration: 'Live',
    thumbnail: 'https://img.youtube.com/vi/cWED7SDQGY0/hqdefault.jpg',
    description: 'Singing the title role of Werther in Jules Massenet’s Werther at the Opéra National de Paris.',
    tags: ['Werther', 'Massenet', 'Opéra National de Paris', 'Role: Werther'],
    featured: true
  },
  {
    id: 'vid-faust-berlin',
    title: 'Faust (Gounod)',
    category: 'opera',
    youtubeUrl: 'https://www.youtube.com/watch?v=dqpuR8Zjnyk',
    youtubeId: 'dqpuR8Zjnyk',
    duration: 'Live',
    thumbnail: 'https://img.youtube.com/vi/dqpuR8Zjnyk/hqdefault.jpg',
    description: 'Singing the title role of Faust at the Deutsche Oper Berlin.',
    tags: ['Faust', 'Deutsche Oper Berlin', 'Role: Faust'],
    featured: false
  },
  {
    id: 'vid-macbeth-essen',
    title: 'Macbeth (Verdi)',
    category: 'opera',
    youtubeUrl: 'https://www.youtube.com/watch?v=KzJwfXKPn-0',
    youtubeId: 'KzJwfXKPn-0',
    duration: 'Live',
    thumbnail: 'https://img.youtube.com/vi/KzJwfXKPn-0/hqdefault.jpg',
    description: 'Singing the role of Malcolm in Giuseppe Verdi’s Macbeth at the Aalto-Theater Essen.',
    tags: ['Macbeth', 'Verdi', 'Aalto-Theater Essen', 'Role: Malcolm'],
    featured: false
  },
  {
    id: 'vid-falstaff-graz',
    title: 'Falstaff (Verdi)',
    category: 'opera',
    youtubeUrl: 'https://www.youtube.com/watch?v=8wG0aCzjbZI',
    youtubeId: '8wG0aCzjbZI',
    duration: 'Dress Rehearsal',
    thumbnail: 'https://img.youtube.com/vi/8wG0aCzjbZI/hqdefault.jpg',
    description: 'Singing the role of Fenton in Giuseppe Verdi’s Falstaff at the Oper Graz (Dress Rehearsal).',
    tags: ['Falstaff', 'Verdi', 'Oper Graz', 'Role: Fenton'],
    featured: false
  }
];

export const SPECIALIZED_COURSES: CourseDetail[] = [
  {
    id: 'french-opera-coaching',
    title: 'French Coaching for Opera Singers',
    subtitle: 'Sing in French with natural clarity, confidence, and vocal freedom',
    audience: 'Opera singers, voice students, and performers preparing French roles or auditions',
    format: '1-on-1 Sessions (60 to 90 min) in Paris or online',
    description: 'Many singers find French intimidating because of silent letters, nasal sounds, and subtle vowels. But French doesn’t have to feel like a trap. I help you understand how French sounds work in your mouth, so you can sing with beautiful words without losing vocal power.',
    syllabus: [
      'The simple rules of French vowels and how to keep them open and ringing',
      'When to connect words together (liaisons) and when not to',
      'The silent "e" in singing: how to breathe naturally and keep the rhythm flowing',
      'How to make French words feel as natural to speak and sing as your own language',
      'Role study for auditions and productions (Faust, Carmen, Werther, and more)'
    ],
    takeaways: [
      'Sing French with clear pronunciation that French audiences immediately understand',
      'Never lose your vocal resonance or squeeze your throat on French vowels',
      'Feel confident and comfortable walking into any French audition'
    ]
  },
  {
    id: 'french-melodie-duo',
    title: 'French Songs (Mélodie) for Singers & Pianists',
    subtitle: 'Learn how to interpret French poetry and music together as a team',
    audience: 'Singers, collaborative pianists, or singer-pianist duos',
    format: 'Duo sessions (90 min) & masterclasses',
    description: 'French Mélodie is the French version of classical art songs (by Fauré, Debussy, Poulenc, Ravel). Unlike grand opera, it is intimate, full of subtle colors, and tells a personal poetic story. I work with singers and pianists together so you listen and breathe as one person.',
    syllabus: [
      'Understanding the poem first: what the words mean and where the emotion lives',
      'How the piano and voice fit together: creating colors and listening to each other',
      'Freedom with timing: how to be expressive without losing the pulse of the song',
      'Exploring the great French song repertoire from early romantic songs to modern classics'
    ],
    takeaways: [
      'A true musical connection where singer and pianist breathe together',
      'Natural storytelling that touches the audience without being overdramatic',
      'A solid repertoire ready for recitals and competitions'
    ]
  },
  {
    id: 'anatomy-ipa-intensive',
    title: 'The Anatomy of Speech & French Rules (One-Time Intensive)',
    subtitle: 'A single, deep workshop to make you completely autonomous for life',
    audience: 'Singers of all levels, vocal teachers, and choral singers',
    format: 'One-Time Comprehensive Intensive (One full day or two half-day sessions)',
    description: 'Unlike regular weekly coaching, this is a one-time course designed to give you everything you need so you never have to depend on a coach or dictionary again. We look at how speech physically works in the body, how the International Phonetic Alphabet (IPA) works, why our mother tongue makes us "deaf" to certain foreign sounds, and how to tweak vowels on stage so your voice carries.',
    syllabus: [
      'The physical anatomy of speech: how your tongue, soft palate, and throat shape sounds',
      'The International Phonetic Alphabet (IPA): a simple guide to reading and pronouncing any sound symbol',
      'The "mother tongue filter": why our native language makes us miss foreign sounds, and how to train your ear to hear them',
      'The exact rules of French pronunciation—and their exceptions—explained simply',
      'How to adjust vowels on stage so your high notes ring easily over an orchestra without losing the word',
      'Complete autonomy: how to prepare any French aria or song entirely on your own'
    ],
    takeaways: [
      'True autonomy: you will know how to prepare any French text by yourself for the rest of your career',
      'Clear, practical knowledge of vocal acoustics that removes tension and guesswork',
      'Permanent confidence whenever you open a French score'
    ]
  }
];
