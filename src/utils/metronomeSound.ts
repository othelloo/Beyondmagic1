/**
 * Realistic Acoustic Mechanical Metronome Sound Generator
 * Modeled after physical Wittner / Maelzel pyramid wooden metronomes.
 * 
 * Physics breakdown:
 * 1. Mechanical Escapement Contact (Impulse transient):
 *    Sharp acoustic transient (2-4ms) of the anchor releasing and brass pin contact.
 * 2. Solid Woodblock Resonant Formant (Pyramidal soundbox top):
 *    High wood strike resonance with fast damping (25-40ms).
 * 3. Hollow Cavity Resonant Chamber (Interior air cavity):
 *    Warm wooden lower resonance providing acoustic presence and body depth.
 * 
 * Synthesized entirely via native browser Web Audio API: 0 network bytes, 0 latency.
 */

export function playRealisticMetronomeClick(
  ctx: AudioContext,
  isAccent: boolean,
  volume: number = 0.85
): void {
  try {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // 1. Sharp mechanical escapement transient (brass pin strike / click)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    const clickStartFreq = isAccent ? 3600 : 2600;
    const clickEndFreq = isAccent ? 900 : 600;
    clickOsc.frequency.setValueAtTime(clickStartFreq, now);
    clickOsc.frequency.exponentialRampToValueAtTime(clickEndFreq, now + 0.0035);

    clickGain.gain.setValueAtTime(0.75 * volume, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.005);
    clickOsc.connect(clickGain);

    // 2. Resonant solid woodblock strike (upper body tone)
    const woodOsc = ctx.createOscillator();
    const woodGain = ctx.createGain();
    woodOsc.type = 'sine';
    // Accented downbeat is a higher, crisper wooden 'TOCK' (1850 Hz), unaccented is a deep woody 'TOK' (920 Hz)
    const woodFreq = isAccent ? 1850 : 920;
    woodOsc.frequency.setValueAtTime(woodFreq, now);
    woodOsc.frequency.exponentialRampToValueAtTime(woodFreq * 0.72, now + 0.032);

    woodGain.gain.setValueAtTime((isAccent ? 0.95 : 0.65) * volume, now);
    woodGain.gain.exponentialRampToValueAtTime(0.0001, now + (isAccent ? 0.045 : 0.035));
    woodOsc.connect(woodGain);

    // 3. Hollow wooden chamber resonance (interior body air resonance)
    const cavityOsc = ctx.createOscillator();
    const cavityGain = ctx.createGain();
    cavityOsc.type = 'sine';
    const cavityFreq = isAccent ? 580 : 380;
    cavityOsc.frequency.setValueAtTime(cavityFreq, now);
    cavityOsc.frequency.exponentialRampToValueAtTime(cavityFreq * 0.55, now + 0.042);

    cavityGain.gain.setValueAtTime(0.5 * volume, now);
    cavityGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    cavityOsc.connect(cavityGain);

    // 4. Acoustic wooden enclosure filter (Bandpass filter shaping the characteristic box resonance)
    const woodFilter = ctx.createBiquadFilter();
    woodFilter.type = 'bandpass';
    woodFilter.frequency.setValueAtTime(isAccent ? 1800 : 1050, now);
    woodFilter.Q.setValueAtTime(2.2, now);

    // Combine all acoustic layers
    clickGain.connect(woodFilter);
    woodGain.connect(woodFilter);
    cavityGain.connect(woodFilter);
    woodFilter.connect(ctx.destination);

    clickOsc.start(now);
    clickOsc.stop(now + 0.01);
    woodOsc.start(now);
    woodOsc.stop(now + 0.05);
    cavityOsc.start(now);
    cavityOsc.stop(now + 0.05);
  } catch {}
}
