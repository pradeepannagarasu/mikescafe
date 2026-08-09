/** Loud kitchen-style alert for new bookings (Web Audio). */
export function playNewBookingAlert() {
  if (typeof window === "undefined") return;

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.85;
    master.connect(ctx.destination);

    const tones = [
      { f: 880, t: 0 },
      { f: 1174.7, t: 0.18 },
      { f: 880, t: 0.36 },
      { f: 1318.5, t: 0.54 },
      { f: 880, t: 0.78 },
      { f: 1174.7, t: 0.96 },
    ];

    for (const { f, t } of tones) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.16);
      osc.connect(gain);
      gain.connect(master);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.18);
    }

    window.setTimeout(() => {
      void ctx.close();
    }, 1600);
  } catch {
    // Autoplay / AudioContext blocked, ignore
  }
}
