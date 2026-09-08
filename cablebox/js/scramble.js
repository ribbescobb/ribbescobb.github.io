// scramble.js — channel 69. Sync-suppressed pay television, 1986. Nothing to see here, which was the whole experience.
// Pure canvas and WebAudio: there is no video source. The titles are a deterministic pool so the guide has a schedule.
(function () {
  const W = 320, H = 240;
  let canvas, ctx, src, sctx, raf = null, t0 = 0, roll = 0, invertUntil = 0, nodes = null;

  const CITIES = ['Toledo', 'Des Moines', 'Sheboygan', 'Scranton', 'Akron', 'Bakersfield', 'Fresno', 'Duluth', 'Fargo', 'Boise', 'Tulsa',
    'Gary', 'Peoria', 'Wichita', 'Yonkers', 'Hoboken', 'Schenectady', 'Kalamazoo', 'Muskegon', 'Cedar Rapids', 'Rapid City', 'Sioux Falls',
    'Bismarck', 'Topeka', 'Lubbock', 'Amarillo', 'Chattanooga', 'Paducah', 'Hackensack', 'Poughkeepsie', 'Walla Walla', 'Yakima', 'Modesto',
    'Stockton', 'Flint', 'Saginaw', 'Dubuque', 'Waterloo', 'Moline', 'Albert Lea', 'Brainerd', 'Mankato', 'Hibbing', 'Bemidji', 'Fond du Lac',
    'Oshkosh', 'Wausau', 'Eau Claire', 'Rockford', 'Terre Haute', 'Fort Wayne', 'Elkhart', 'Altoona', 'Allentown', 'Utica', 'Binghamton',
    'Erie', 'Youngstown', 'Dayton', 'Chillicothe', 'Muncie', 'Kokomo', 'Joliet', 'Decatur', 'Springfield', 'Omaha', 'Lincoln', 'Kearney',
    'Cheyenne', 'Laramie', 'Pocatello', 'Provo', 'Yuma', 'Barstow', 'Needles', 'Lodi', 'Turlock', 'Tacoma', 'Spokane', 'Missoula', 'Butte',
    'Minot', 'Pierre', 'Mitchell', 'Fort Dodge', 'Ottumwa', 'Keokuk', 'Hannibal', 'Joplin', 'Enid', 'Waco', 'Beaumont', 'Shreveport',
    'Tupelo', 'Dothan', 'Valdosta', 'Ocala', 'Macon', 'Spartanburg', 'Roanoke', 'Wheeling', 'Parkersburg', 'Cumberland', 'Wilkes-Barre',
    'Bayonne', 'Passaic', 'Bridgeport', 'Worcester', 'Chicopee', 'Nashua', 'Bangor', 'Presque Isle', 'Burlington', 'Watertown', 'Rome'];
  const FORMS = ['Emmanuelle in {c}', 'Emmanuelle Goes to {c}', 'Emmanuelle: {c} Nights', 'Emmanuelle IV: Escape to {c}', 'Emmanuelle in {c}, Part II',
    'Emmanuelle: The {c} Affair', 'Emmanuelle Takes {c}', 'Emmanuelle: One Night in {c}'];

  // A deterministic pool of feature-length "movies" for the scheduler. Same list for everyone, forever.
  function pool() {
    return CITIES.map((c, i) => ({ id: 'scr-' + i, t: FORMS[(i * 5) % FORMS.length].replace('{c}', c), d: 5040 + ((i * 7919) % 1560), s: '' }));
  }

  function init(c) {
    canvas = c; canvas.width = W; canvas.height = H; ctx = canvas.getContext('2d');
    src = document.createElement('canvas'); src.width = W; src.height = H; sctx = src.getContext('2d');
  }

  // A warm, dim room. Shapes drift. Abstract on purpose.
  function drawSource(t) {
    sctx.fillStyle = '#1a0b12'; sctx.fillRect(0, 0, W, H);
    const blobs = [
      [0.30, 0.55, 90, 70, '#d9a184', 0.9, 0.11], [0.62, 0.45, 110, 60, '#c98466', 0.85, 0.07], [0.5, 0.82, 170, 40, '#6a2036', 0.9, 0.05],
      [0.2, 0.2, 60, 60, '#3a4a7a', 0.6, 0.13], [0.8, 0.25, 70, 90, '#e0b090', 0.7, 0.09], [0.45, 0.35, 40, 30, '#f2d7c0', 0.5, 0.17]
    ];
    for (const [x, y, rx, ry, col, a, sp] of blobs) {
      const cx = x * W + Math.sin(t * sp) * 30, cy = y * H + Math.cos(t * sp * 1.3) * 18;
      const g = sctx.createRadialGradient(cx, cy, 2, cx, cy, Math.max(rx, ry));
      g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
      sctx.globalAlpha = a; sctx.fillStyle = g;
      sctx.beginPath(); sctx.ellipse(cx, cy, rx, ry, Math.sin(t * 0.2) * 0.5, 0, Math.PI * 2); sctx.fill();
    }
    sctx.globalAlpha = 1;
  }

  function frame(now) {
    const t = (now - t0) / 1000;
    drawSource(t);
    roll = (roll + 0.9 + Math.sin(t * 0.7) * 0.8 + H) % H;                       // the vertical hold is gone
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const tearA = 30 + 20 * Math.sin(t * 0.9), tearB = Math.sin(t * 3.1) * 12;
    for (let y = 0; y < H; y += 2) {
      const sy = (y + roll) % H;
      const off = tearA * Math.sin(sy / 28 + t * 2.2) + tearB * Math.sin(sy / 7 + t * 9) + (Math.random() - 0.5) * 6;
      ctx.drawImage(src, 0, sy, W, 2, off, y, W, 2);
      if (Math.random() < 0.012) ctx.drawImage(src, 0, sy, W, 2, off + (Math.random() - 0.5) * 160, y, W, 2);   // a torn band
    }
    const barY = ((t * 37) % (H * 1.6)) - H * 0.3;                                 // the sync bar rolling through
    ctx.fillStyle = 'rgba(0,0,0,.85)'; ctx.fillRect(0, barY, W, 14);
    ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.28;               // chroma smear
    ctx.drawImage(canvas, 4 + Math.sin(t * 5) * 3, 0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (now > invertUntil && Math.random() < 0.012) invertUntil = now + 100 + Math.random() * 400;
    if (now < invertUntil) { ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }
    raf = requestAnimationFrame(frame);
  }

  // The buzz: a 60-cycle sawtooth through a wandering bandpass, warbling. Level follows the set's volume.
  function audio(on, ac, level) {
    if (!ac) return;
    if (on && !nodes) {
      const osc = ac.createOscillator(); osc.type = 'sawtooth'; osc.frequency.value = 60;
      const lfo = ac.createOscillator(); lfo.frequency.value = 3.5; const lfoG = ac.createGain(); lfoG.gain.value = 22; lfo.connect(lfoG).connect(osc.frequency);
      const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 2.5;
      const lfo2 = ac.createOscillator(); lfo2.frequency.value = 0.4; const lfo2G = ac.createGain(); lfo2G.gain.value = 500; lfo2.connect(lfo2G).connect(bp.frequency);
      const gain = ac.createGain(); gain.gain.value = 0;
      osc.connect(bp).connect(gain).connect(ac.destination); osc.start(); lfo.start(); lfo2.start();
      nodes = { gain };
    }
    if (nodes) nodes.gain.gain.setTargetAtTime(on ? 0.07 * level : 0, ac.currentTime, 0.05);
  }

  function start(c, ac, level) { if (!ctx) init(c); if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); } audio(true, ac, level); }
  function stop(ac) { if (raf) cancelAnimationFrame(raf); raf = null; audio(false, ac, 0); }

  window.Scramble = { pool, start, stop, audio, get running() { return !!raf; } };
})();
