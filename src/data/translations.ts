export type Language = 'en' | 'de';

export interface Translations {
  nav: {
    method: string;
    audiences: string;
    french: string;
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
      about: 'About Me',
      media: 'Photos & Videos',
      spirituality: 'Spirituality (Soon)',
      contact: 'Contact / Book'
    },
    hero: {
      badge: ['Opera & Diction Coaching', 'Ear-First Education', 'Somatic Technique'],
      titleMain: 'Music is a natural language everyone understands.',
      titleSub: 'Notes on paper are only a representation.',
      summary: 'Master French lyric diction, release vocal constriction, and train your ear to internalize harmonic resonance before decoding notation. Private coaching and masterclasses by European lead tenor Abdellah Lasri.',
      locationAvailability: 'Available in NRW (Germany), Berlin, or online worldwide.',
      highlights: {
        location: 'NRW (Cologne/Düsseldorf/Essen) · Berlin · Online Worldwide',
        credentials: 'CNSMDP Paris Valedictorian · Staatsoper Berlin Young Artist',
        stages: 'Opéra National de Paris · Deutsche Oper Berlin · Aalto-Theater Essen'
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
      title: 'The Method: Ear-First Somatic Learning',
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
      card1Badge: 'Singers & Students',
      card1Title: 'Opera Singers & Voice Students',
      card1Subtitle: 'Conservatory preparation, auditions & vocal freedom',
      card1Desc: 'Break through vocal fatigue, eliminate throat tension, and learn complete roles 3x faster through auditory memory and authentic French and Italian diction.',
      card1Points: [
        'Eliminate vocal fatigue and throat strain',
        'Learn roles 3x faster through auditory memory',
        'Flawless French and Italian lyric diction'
      ],
      card1Cta: 'Singing Coaching',
      card2Badge: 'Producers & Beatmakers',
      card2Title: 'Music Producers & Composers',
      card2Subtitle: 'Translating intuition into harmonic mastery',
      card2Desc: 'Move beyond repetitive chord packs. Ground your DAW workflow in classical harmonic awareness to create chord progressions and arrangements that truly hit home.',
      card2Points: [
        'Ear education tailored to modern DAW workflows',
        'Craft emotional chord progressions without relying on preset packs',
        'Incorporate orchestral voicing and acoustic depth into your beats'
      ],
      card2Cta: 'Producer Lessons',
      card3Badge: 'Curious Listeners',
      card3Title: 'Music Lovers & Active Listeners',
      card3Subtitle: 'Hearing layers and emotions you never noticed before',
      card3Desc: 'No instrument needed. Learn how tension and release operate inside classical music, opera, and film scores to experience music on a profoundly deeper level.',
      card3Points: [
        'Recognize harmonic tension and emotional release in any piece',
        'Explore classical masterpieces and opera with an expert guide',
        'A relaxed, joyful approach to ear training with zero exam stress'
      ],
      card3Cta: 'Listening Sessions'
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
      about: 'Über Mich',
      media: 'Fotos & Videos',
      spirituality: 'Spiritualität (Demnächst)',
      contact: 'Kontakt / Buchen'
    },
    hero: {
      badge: ['Opern- & Diktions-Coaching', 'Gehör-orientierte Ausbildung', 'Somatische Stimmtechnik'],
      titleMain: 'Musik ist eine natürliche Sprache, die jeder versteht.',
      titleSub: 'Noten auf Papier sind nur eine Repräsentation.',
      summary: 'Meistern Sie französische Gesangsdiktion, lösen Sie Stimmblockaden und lernen Sie, harmonische Resonanz im Körper zu fühlen, bevor Sie Noten deuten. Einzelcoaching und Meisterkurse von Operntenor Abdellah Lasri.',
      locationAvailability: 'Verfügbar in NRW (Köln / Düsseldorf / Essen), Berlin oder weltweit online.',
      highlights: {
        location: 'NRW (Köln / Düsseldorf / Essen) · Berlin · Online weltweit',
        credentials: 'CNSMDP Paris Jahrgangsbester · Staatsoper Berlin Opernstudio',
        stages: 'Opéra National de Paris · Deutsche Oper Berlin · Aalto-Theater Essen'
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
      title: 'Die Methode: Gehör-orientiertes somatisches Lernen',
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
      card1Badge: 'Sänger & Studierende',
      card1Title: 'Opernsänger & Gesangsstudierende',
      card1Subtitle: 'Hochschulvorbereitung, Vorsingen & Stimmbefreiung',
      card1Desc: 'Stimmliche Ermüdung überwinden, Partien durch auditives Gedächtnis dreimal schneller lernen und authentische französische sowie italienische Diktion meistern.',
      card1Points: [
        'Stimmliche Überlastung und Enge dauerhaft auflösen',
        'Rollen 3x schneller durch auditives Gedächtnis erarbeiten',
        'Perfekte Diktion im französischen und italienischen Repertoire'
      ],
      card1Cta: 'Gesangscoaching',
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
