// app.js — the set: power, the converter box, tuning, static, stand-by, and the guide.
(function () {
  const $ = (s) => document.querySelector(s);
  const glass = $('#glass'), staticCanvas = $('#static'), hint = $('#hint');
  let MAX_CH = 36, startChannel = 1;
  let channels = [], byNum = new Map(), catalog = null, lineup = null, refreshedOn = '';
  let power = false, ch = 2, digits = '', digitTimer = null, snowTimer = null;
  let current = null;            // { key, entry, channel, mode: 'sched'|'sub'|'tail', sub, tailStart }
  let askedAt = 0;               // when we last asked the player for a picture
  let recovering = false, deadInSlot = 0, deadSlotKey = '';   // after a dead video, stay in stand-by until a picture actually arrives
  let lastGuideOnly = false;
  const compact = () => glass.clientHeight < 420;   // phones: the tube is too short for a promo window plus a grid
  const subs = new Map();        // schedule key -> substitute program, when the scheduled one is dead
  const dead = new Set();

  // ---------------- data ----------------
  async function loadData() {
    const [c, k] = await Promise.all([
      fetch('data/channels.json?v=e3ed657').then(r => r.json()),
      fetch('data/catalog.json?v=e3ed657').then(r => r.json())
    ]);
    channels = c.channels; catalog = k; lineup = c;
    catalog.pools.scrambled = Scramble.pool();           // channel 69's schedule exists only in the browser
    Sched.prepare(catalog, c.filler || 'commercials', c.breakSeconds, c.breakEvery);
    channels.forEach(x => byNum.set(x.num, x));
    MAX_CH = Math.max(36, ...channels.map(x => x.num));
    startChannel = c.startChannel || 1; ch = startChannel;   // the box always wakes up on the guide
    try { const v = localStorage.getItem('cablebox.vol'); if (v !== null && v !== '') Player.setVolume(+v); } catch (e) {}
  }

  // After the nightly sweep, pick up the fresh catalog so a set left on stays on the same schedule as everyone else.
  async function refreshCatalog() {
    try {
      const k = await fetch('data/catalog.json' + '?t=' + Date.now(), { cache: 'no-store' }).then(r => r.json());
      k.pools.scrambled = Scramble.pool();
      catalog = k; Sched.prepare(catalog, lineup.filler || 'commercials', lineup.breakSeconds, lineup.breakEvery);
      Guide.invalidate(); current = null; if (power) render(true);
      console.log('[cablebox] catalog refreshed', k.built, k.swept || '');
    } catch (e) { console.warn('[cablebox] catalog refresh failed', e); }
  }
  function maybeRefresh(now) {
    const day = now.toDateString();
    if (now.getHours() === 4 && now.getMinutes() === 5 && refreshedOn !== day) { refreshedOn = day; refreshCatalog(); }
  }

  // ---------------- glass states ----------------
  const STATES = ['off', 'warming', 'cooling', 'on', 'snow', 'standby', 'offair', 'scramble'];
  const level = () => (Player.muted ? 0 : Player.volume / 100);
  function setGlass(state) {
    STATES.forEach(s => glass.classList.toggle(s, s === state));
    if (state !== 'on') glass.classList.remove('squeeze');
    if (state === 'snow') startStatic(); else stopStatic();
    if (state === 'scramble') Scramble.start($('#scrambled'), ac, level()); else Scramble.stop(ac);
  }

  // ---------------- static ----------------
  const sctx = staticCanvas.getContext('2d');
  const W = staticCanvas.width, H = staticCanvas.height;
  const frame = sctx.createImageData(W, H), px = new Uint32Array(frame.data.buffer), rnd = new Uint8Array(W * H);
  let staticRAF = null;
  function drawStatic() {
    crypto.getRandomValues(rnd);
    for (let i = 0; i < px.length; i++) { const v = rnd[i]; px[i] = 0xff000000 | (v << 16) | (v << 8) | v; }
    sctx.putImageData(frame, 0, 0);
    staticRAF = requestAnimationFrame(drawStatic);
  }
  function startStatic() { if (!staticRAF) drawStatic(); noise(true); }
  function stopStatic() { if (staticRAF) cancelAnimationFrame(staticRAF); staticRAF = null; noise(false); }

  // ---------------- sound (set-side; program audio comes from the player) ----------------
  let ac = null, noiseSrc = null, noiseGain = null;
  function ensureAudio() {
    if (ac) return;
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      const len = ac.sampleRate * 2, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      noiseSrc = ac.createBufferSource(); noiseSrc.buffer = buf; noiseSrc.loop = true;
      noiseGain = ac.createGain(); noiseGain.gain.value = 0;
      noiseSrc.connect(noiseGain).connect(ac.destination); noiseSrc.start();
    } catch (e) { ac = null; }
  }
  function noise(on) { if (!ac) return; noiseGain.gain.setTargetAtTime(on && !Player.muted ? 0.12 * (Player.volume / 100) : 0, ac.currentTime, 0.02); }
  function beep(freq = 1100, ms = 45) {
    if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'square'; o.frequency.value = freq; g.gain.value = 0.03;
    o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + ms / 1000);
  }
  // The power switch: a latching plunger, not a beep. Contact tick, the plunger's thump, a little cabinet wood, the latch settling.
  function click() {
    if (!ac) return;
    const t0 = ac.currentTime;
    const burst = (at, ms, gain, freq, q) => {
      const len = Math.ceil(ac.sampleRate * ms / 1000), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      const src = ac.createBufferSource(); src.buffer = buf;
      const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q;
      const g = ac.createGain(); g.gain.setValueAtTime(gain, at); g.gain.exponentialRampToValueAtTime(0.001, at + ms / 1000);
      src.connect(bp).connect(g).connect(ac.destination); src.start(at); src.stop(at + ms / 1000 + 0.01);
    };
    burst(t0, 28, 0.55, 2600, 0.7);           // the contact
    burst(t0 + 0.004, 70, 0.3, 420, 0.5);     // the cabinet
    burst(t0 + 0.058, 16, 0.22, 3300, 1.0);   // the latch settling
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(190, t0); o.frequency.exponentialRampToValueAtTime(65, t0 + 0.06);
    g.gain.setValueAtTime(0.45, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.09);
    o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + 0.1);
  }
  function thunk() { click(); }

  // ---------------- seven-segment display ----------------
  const SEG = {
    a: '10,3 34,3 38,7 34,11 10,11 6,7', b: '36,9 40,13 40,33 36,37 32,33 32,13', c: '36,39 40,43 40,63 36,67 32,63 32,43',
    d: '10,65 34,65 38,69 34,73 10,73 6,69', e: '8,39 12,43 12,63 8,67 4,63 4,43', f: '8,9 12,13 12,33 8,37 4,33 4,13',
    g: '10,34 34,34 38,38 34,42 10,42 6,38'
  };
  const DIGIT = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', '-': 'g', ' ': '' };
  // the readouts: what's on, spelled out, stepping every half second
  const marquees = [Marquee.make($('#boxMarquee'), 12), Marquee.make($('#remoteMarquee'), 16)];
  const setMarquee = (t) => marquees.forEach(m => m.set(t));
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function marqueeText(channel, entry) {
    if (!power) return '';
    if (!channel) return 'NO SIGNAL';
    if (channel.kind === 'guide') return 'PREVUE GUIDE';
    if (channel.kind === 'scrambled') return entry && entry.title ? entry.title : 'PREMIUM';   // the whole joke is the title
    if (!entry || entry.kind === 'off') return 'OFF AIR';
    if (entry.kind === 'break') return channel.name;
    if (entry.a || entry.n) return [entry.a, entry.n].filter(Boolean).join(' - ');
    let t = entry.title || '';
    if (entry.series) {
      t = t.replace(new RegExp(escRe(entry.series), 'i'), '').replace(/^[\s|:\-–]+|[\s|:\-–]+$/g, '');
      return entry.series + (t ? ' - ' + t : '');
    }
    return t;
  }
  window.Marquees = marquees;

  const displays = [...document.querySelectorAll('.cb-display, .rm-display')].map(d => [...d.querySelectorAll('svg.seg')]);
  displays.flat().forEach(svg => {
    svg.setAttribute('viewBox', '0 0 44 76');
    svg.innerHTML = Object.keys(SEG).map(k => `<polygon data-s="${k}" points="${SEG[k]}"/>`).join('');
  });
  function showDigits(str) {
    const s = String(str).slice(-2).padStart(2, ' ');
    displays.forEach(segs => segs.forEach((svg, i) => { const on = DIGIT[s[i]] || ''; svg.querySelectorAll('polygon').forEach(p => p.classList.toggle('on', on.includes(p.dataset.s))); }));
  }

  // ---------------- tuner dials (decorative) ----------------
  function buildDial(el, labels) {
    const svg = el.querySelector('svg'), n = labels.length, span = 300, a0 = -150;
    let s = '<circle class="ring" cx="50" cy="50" r="47"/>';
    labels.forEach((l, i) => {
      const deg = a0 + i * span / (n - 1), a = deg * Math.PI / 180;
      const x = 50 + 41.5 * Math.sin(a), y = 50 - 41.5 * Math.cos(a);   // on the black ring, outside the knob
      s += `<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" transform="rotate(${deg.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})">${l}</text>`;
    });
    svg.innerHTML = s;
  }
  buildDial($('#dialUHF'), ['83', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15']);
  buildDial($('#dialVHF'), ['UHF', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']);

  // ---------------- tuning ----------------
  function tune(n) {
    n = Math.max(1, Math.min(MAX_CH, n));
    const changed = n !== ch;
    ch = n; showDigits(String(ch));
    if (!power || !changed) return;
    Player.stop(); current = null;
    setGlass('snow');
    clearTimeout(snowTimer);
    snowTimer = setTimeout(() => render(true), 380);
  }
  // CH up/down walk the channels that exist, in number order, wrapping. Dead numbers are for punching in on purpose.
  function step(dir) {
    const nums = channels.map(x => x.num).sort((a, b) => a - b);
    const i = nums.indexOf(ch);
    const next = i < 0 ? (dir > 0 ? nums.find(n => n > ch) ?? nums[0] : [...nums].reverse().find(n => n < ch) ?? nums[nums.length - 1])
                       : nums[(i + dir + nums.length) % nums.length];
    tune(next);
  }
  function keyPress(k) {
    ensureAudio(); beep();
    if (k === 'up') return step(1);
    if (k === 'down') return step(-1);
    digits += k; showDigits(digits);
    clearTimeout(digitTimer);
    if (digits.length >= 2) { const n = +digits; digits = ''; tune(n || ch); }
    else digitTimer = setTimeout(() => { const n = +digits; digits = ''; tune(n || ch); }, 1400);
  }

  // ---------------- what is on ----------------
  function expectedOffset(entry, elapsed) {
    if (current && current.mode === 'sub') return elapsed % current.sub.d;
    if (current && current.mode === 'tail') return Math.max(0, Date.now() / 1000 - current.tailStart);
    return (entry.off || 0) + elapsed;
  }

  const lt = $('#lowerThird'), CHYRON_SECS = 8, CHYRON = false;   // off until the presentation is right; the metadata keeps coming
  function updateCaption(entry, elapsed) {
    if (!CHYRON) { glass.classList.remove('squeeze'); return; }
    const dur = entry.end - entry.start;
    const show = entry.kind === 'program' && !!(entry.a || entry.n) && dur > 30 && glass.classList.contains('on') &&
      (elapsed < CHYRON_SECS || dur - elapsed <= CHYRON_SECS);
    if (show) {
      lt.querySelector('.lt-artist').textContent = entry.a || '';
      lt.querySelector('.lt-song').textContent = entry.n ? '\u201c' + entry.n + '\u201d' : '';
      lt.querySelector('.lt-year').textContent = entry.y || '';
    }
    glass.classList.toggle('squeeze', show);
  }

  function render(force) {
    if (!power) return;
    const channel = byNum.get(ch);
    if (!channel) { if (!glass.classList.contains('snow')) setGlass('snow'); Player.stop(); current = null; setMarquee('NO SIGNAL'); glass.classList.remove('guide-mode'); return; }
    const now = new Date();
    const { entry, elapsed, dayStart } = Sched.at(channel, now, catalog);
    const key = channel.id + ':' + dayStart.getTime() + ':' + entry.start;
    const isGuide = channel.kind === 'guide';
    const guideOnly = isGuide && compact();
    glass.classList.toggle('guide-mode', isGuide);
    glass.classList.toggle('guide-only', guideOnly);
    if (isGuide) Guide.tick(now);
    if (guideOnly !== lastGuideOnly) { lastGuideOnly = guideOnly; force = true; }
    if (guideOnly) { current = { key, entry, channel, mode: 'sched' }; Player.stop(); setGlass('on'); setMarquee(marqueeText(channel, entry)); return; }
    if (channel.kind === 'scrambled') { current = { key, entry, channel, mode: 'sched' }; Player.stop(); if (!glass.classList.contains('scramble')) setGlass('scramble'); setMarquee(marqueeText(channel, entry)); return; }

    updateCaption(entry, elapsed);
    setMarquee(marqueeText(channel, entry));
    if (!force && current && current.key === key) {
      if (current.mode !== 'tail') Player.correct(expectedOffset(entry, elapsed));
      // No picture for 20s after asking for one: stand by rather than stare at a dead tube.
      if (!Player.playing && askedAt && Date.now() - askedAt > 20000 && glass.classList.contains('on')) setGlass('standby');
      return;
    }
    if (entry.kind === 'off') { current = { key, entry, channel, mode: 'sched' }; Player.stop(); setGlass('offair'); return; }
    const sub = subs.get(key);
    current = { key, entry, channel, mode: sub ? 'sub' : 'sched', sub };
    if (key !== deadSlotKey) { deadInSlot = 0; deadSlotKey = key; recovering = false; }
    if (deadInSlot >= 3) { setGlass('standby'); Player.stop(); return; }   // this slot is a write-off; try again next slot
    setGlass(recovering ? 'standby' : 'on');
    const off = expectedOffset(entry, elapsed);
    const end = entry.kind === 'break' && !sub ? (entry.off || 0) + (entry.end - entry.start) : undefined;
    askedAt = Date.now();
    Player.play(sub ? sub.id : entry.id, off, end);
  }

  function altFor(poolName, notId, salt) {
    const pool = catalog.pools[poolName] || [];
    const cands = pool.filter(p => p.id !== notId && !dead.has(p.id));
    if (!cands.length) return null;
    return cands[Sched.hash32(notId + '|' + salt) % cands.length];
  }

  Player.on('onPlaying', () => { recovering = false; deadInSlot = 0; if (power && glass.classList.contains('standby')) setGlass('on'); });

  Player.on('onDead', (id) => {
    if (!current || !power || dead.has(id) && current.mode === 'sub') { if (current) setGlass('standby'); return; }
    dead.add(id); recovering = true; deadInSlot++;
    if (deadInSlot >= 3) { setGlass('standby'); Player.stop(); return; }
    const { entry, key } = current;
    const poolName = entry.kind === 'break' ? catalog.filler : entry.pool;
    const alt = altFor(poolName, id, key);
    if (!alt) { setGlass('standby'); return; }
    subs.set(key, alt);
    if (entry.kind === 'break') { current = null; render(true); return; }
    setGlass('standby');
    setTimeout(() => { if (current && current.key === key) { current = null; render(true); } }, 1600);
  });

  // The video ran out before its slot did (catalog duration was optimistic): fill the tail with a commercial.
  Player.on('onEnded', () => {
    if (!current || !power) return;
    const now = new Date();
    const { entry, elapsed } = Sched.at(current.channel, now, catalog);
    const remaining = entry.end - entry.start - elapsed;
    if (remaining < 4) { current = null; render(true); return; }
    const clip = altFor(catalog.filler, current.entry.id, 'tail' + Math.floor(now.getTime() / 10000));
    if (!clip) return;
    current.mode = 'tail'; current.tailStart = now.getTime() / 1000;
    const off = clip.d > remaining ? Sched.hash32(current.key) % (clip.d - remaining) : 0;
    Player.play(clip.id, off, off + remaining);
  });

  // ---------------- power ----------------
  function powerOn() {
    if (power) return;
    power = true; ensureAudio(); thunk(); hint.classList.add('hidden'); document.body.classList.remove('power-off');
    if (Player.muted) Player.setMuted(false);                       // a set that was turned on has sound
    if (Player.volume < 20) saveVol(Player.setVolume(40));
    ch = startChannel; digits = ''; showDigits(String(ch));
    setGlass('warming');
    Player.ensureApi();
    setTimeout(() => { if (power) { current = null; render(true); } }, 800);
  }
  function powerOff() {
    if (!power) return;
    power = false; thunk(); Player.stop(); current = null; clearTimeout(snowTimer); document.body.classList.add('power-off'); setMarquee('');
    glass.classList.remove('guide-mode', 'guide-only'); setGlass('cooling'); hint.classList.remove('hidden');
    setTimeout(() => { if (!power) setGlass('off'); }, 950);
  }
  function togglePower() { power ? powerOff() : powerOn(); }

  // ---------------- guide (channel 1) ----------------
  const Guide = (() => {
    const head = $('#guideHead'), rows = $('#guideRows');
    let windowStart = 0, y = 0, lastT = 0, raf = null, setH = 0;
    const esc = (s) => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    function fmt(sec) { const d = new Date(sec * 1000); let h = d.getHours(); const m = d.getMinutes(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + String(m).padStart(2, '0') + ' ' + ap; }
    function clock(d) { let h = d.getHours(); const m = d.getMinutes(), s = d.getSeconds(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ' ' + ap; }
    function label(p) { if (!p) return ''; if (p.kind === 'off') return 'Off Air'; return p.label || p.series || p.title; }
    const same = (a, b) => a === b || (a && b && ((a.pid != null && a.pid === b.pid) || (a.label && a.label === b.label) || (a.kind === 'off' && b.kind === 'off')));
    function build(now) {
      const start = Math.floor(now.getTime() / 1000 / 1800) * 1800, span = 7200;
      windowStart = start;
      head.innerHTML = '<div class="gclock"></div>' + [0, 1, 2, 3].map(i => `<div>${fmt(start + i * 1800)}</div>`).join('');
      const list = channels.filter(c => c.kind !== 'guide').sort((a, b) => a.num - b.num);
      let html = '';
      for (const c of list) {
        const raw = Sched.programsBetween(c, new Date(start * 1000), span, catalog);
        // one cell per program or block: segments of one program (split around breaks), consecutive songs of a
        // block, and consecutive off-air slots all merge; a commercial break between them is not a gap
        const progs = [];
        for (const p of raw) {
          const last = progs[progs.length - 1];
          const same = last && ((p.pid != null && p.pid === last.pid) || (p.label && p.label === last.label) || (p.kind === 'off' && last.kind === 'off'));
          if (same && p.start - last.end <= 300) last.end = p.end; else progs.push({ ...p });   // an act break is not a gap
        }
        let cells = '';
        for (const p of progs) {
          const s0 = Math.max(p.start, start), e0 = Math.min(p.end, start + span);
          if (e0 - s0 < 90) continue;                                   // slivers at the window edges
          const left = (100 * (s0 - start) / span).toFixed(2), width = (100 * (e0 - s0) / span).toFixed(2);
          cells += `<div class="gp${p.kind === 'off' ? ' off' : ''}${e0 - s0 < 480 ? ' tiny' : ''}" style="left:${left}%;width:${width}%">${esc(label(p))}</div>`;
        }
        html += `<div class="grow"><div class="gch"><b>${c.num}</b>${esc(c.name)}</div><div class="gtl">${cells}</div></div>`;
      }
      html += `<div class="grow spacer"><div class="gch">CABLEBOX &nbsp;·&nbsp; ${now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</div></div>`;
      rows.innerHTML = html + html;
      setH = rows.scrollHeight / 2;
    }
    function step(t) {
      const dt = Math.min(0.1, (t - lastT) / 1000); lastT = t;
      const rowH = rows.firstElementChild ? rows.firstElementChild.offsetHeight : 30;
      y += dt * rowH / 2.8;                     // one row every 2.8 seconds: painfully slow, as requested
      if (setH && y >= setH) y -= setH;
      rows.style.transform = `translateY(${-y}px)`;
      raf = glass.classList.contains('guide-mode') && power ? requestAnimationFrame(step) : null;
    }
    function tick(now) {
      const start = Math.floor(now.getTime() / 1000 / 1800) * 1800;
      if (start !== windowStart || !rows.children.length) build(now);
      const c = head.querySelector('.gclock'); if (c) c.textContent = clock(now);
      document.querySelector('.guide-viewport').style.setProperty('--nowx', ((now.getTime() / 1000 - windowStart) / 7200).toFixed(4));
      if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(step); }
    }
    function invalidate() { rows.innerHTML = ''; windowStart = 0; }
    return { tick, invalidate };
  })();

  // ---------------- wiring ----------------
  $('#keys').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) keyPress(b.dataset.key); });
  $('#power').addEventListener('click', () => { ensureAudio(); togglePower(); });
  $('#zoom').addEventListener('click', () => { ensureAudio(); beep(900, 40); setZoom(!zoomed); });
  $('#unzoom').addEventListener('click', () => setZoom(false));
  $('#zoomControls').addEventListener('click', (e) => { const b = e.target.closest('button[data-key]'); if (b) keyPress(b.dataset.key); });
  const saveVol = (v) => { try { localStorage.setItem('cablebox.vol', v); } catch (x) {} flash(Player.muted ? 'Muted' : 'Volume ' + v); return v; };
  $('#volume').addEventListener('wheel', (e) => { e.preventDefault(); saveVol(Player.setVolume(Player.volume + (e.deltaY < 0 ? 5 : -5))); }, { passive: false });
  $('#volume').addEventListener('click', () => { Player.setMuted(!Player.muted); noise(glass.classList.contains('snow')); if (glass.classList.contains('scramble')) Scramble.audio(true, ac, level()); flash(Player.muted ? 'Muted' : 'Sound on, volume ' + Player.volume); });
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[0-9]$/.test(e.key)) { keyPress(e.key); e.preventDefault(); }
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') { keyPress('up'); e.preventDefault(); }
    else if (e.key === 'ArrowDown' || e.key === 'PageDown') { keyPress('down'); e.preventDefault(); }
    else if (e.key === 'p' || e.key === ' ') { togglePower(); e.preventDefault(); }
    else if (e.key === 'g') keyPress('1');
    else if (e.key === 'f') toggleFullscreen();
    else if (e.key === 'z') setZoom(!zoomed);
    else if (e.key === 'm') { Player.setMuted(!Player.muted); noise(glass.classList.contains('snow')); if (glass.classList.contains('scramble')) Scramble.audio(true, ac, level()); flash(Player.muted ? 'Muted' : 'Sound on, volume ' + Player.volume); }
    else if (e.key === '=' || e.key === '+') saveVol(Player.setVolume(Player.volume + 5));
    else if (e.key === '-' || e.key === '_') saveVol(Player.setVolume(Player.volume - 5));
  });
  // ---------------- phones: the tube fills the screen and the phone is the remote ----------------
  const phoneMQ = window.matchMedia('(pointer: coarse) and ((max-width: 700px) or (max-height: 500px))');
  const remote = $('#remote'), remoteToggle = $('#remoteToggle');
  let phone = false, peek = false, remoteTimer = null;
  function safeTop() { return parseFloat(getComputedStyle($('#safeProbe')).paddingTop) || 0; }
  function layoutPhone() {
    phone = phoneMQ.matches; document.body.classList.toggle('phone', phone);
    if (!phone) { document.body.classList.remove('portrait', 'landscape'); remote.classList.remove('open'); remote.style.top = ''; return false; }
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight, portrait = vh > vw;
    document.body.classList.toggle('portrait', portrait); document.body.classList.toggle('landscape', !portrait);
    if (portrait) peek = false;                         // portrait is always the tube: no SET view there
    document.body.classList.toggle('zoom', !peek);
    if (peek) { scene.style.width = ''; scene.style.left = ''; scene.style.top = ''; remote.style.top = ''; return true; }
    scene.style.left = '0px'; scene.style.top = '0px'; scene.style.width = '';
    const w0 = scene.getBoundingClientRect().width, g0 = glass.getBoundingClientRect();
    const k = portrait ? vw / g0.width : Math.min(vh / g0.height, vw / g0.width);
    scene.style.width = (w0 * k) + 'px';
    const g = glass.getBoundingClientRect(), bez = g.height * 0.07, st = safeTop();
    scene.style.left = ((vw - g.width) / 2 - g.left) + 'px';
    if (portrait) { scene.style.top = (st + bez - g.top) + 'px'; remote.style.top = (st + g.height + 2 * bez) + 'px'; }
    else { scene.style.top = ((vh - g.height) / 2 - g.top) + 'px'; remote.style.top = ''; }
    // the paper under the remote needs its masthead to show: hide it when the keypad runs to the bottom of the screen
    const gap = portrait ? vh - remote.getBoundingClientRect().bottom : 0;
    document.body.classList.toggle('has-paper', portrait && gap >= 46);
    const under = $('#paperUnder'); if (under) { under.style.height = (Math.max(46, gap) + 60) + 'px'; under.style.paddingTop = '66px'; }   // 60px tucked under the handset, masthead just below its edge
    return true;
  }
  // On phones and in the home-screen app the listings open in place (a new tab would leave the app); on a desk, a new tab.
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  document.querySelectorAll('.paper, .paper-under').forEach((a) => a.addEventListener('click', (e) => {
    if (phone || standalone()) { e.preventDefault(); location.href = a.getAttribute('href'); }
  }));
  function openRemote(on) {
    remote.classList.toggle('open', on); clearTimeout(remoteTimer);
    if (on && document.body.classList.contains('landscape')) remoteTimer = setTimeout(() => remote.classList.remove('open'), 6000);
  }
  remoteToggle.addEventListener('click', () => openRemote(true));
  remote.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.key) keyPress(b.dataset.key);
    else if (b.dataset.act === 'power') { ensureAudio(); togglePower(); }
    else if (b.dataset.act === 'set' && !document.body.classList.contains('portrait')) { peek = !peek; layoutPhone(); if (power) render(false); }
    if (document.body.classList.contains('landscape')) openRemote(true);   // keep it up while in use
  });

  // ---------------- zoom: just the picture side of the set ----------------
  let zoomed = false;
  const scene = document.querySelector('.scene'), zone = document.querySelector('.screen-zone');
  function layoutZoom() {
    if (layoutPhone()) return;
    if (!zoomed) { scene.style.width = ''; scene.style.left = ''; scene.style.top = ''; return; }
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    scene.style.left = '0px'; scene.style.top = '0px'; scene.style.width = '';
    const w0 = scene.getBoundingClientRect().width, z0 = zone.getBoundingClientRect();
    const k = Math.min(vw / z0.width, vh / z0.height) * 0.995;
    scene.style.width = (w0 * k) + 'px';                       // lay out at the size where the picture side fills the window
    const z = zone.getBoundingClientRect();
    scene.style.left = ((vw - z.width) / 2 - z.left) + 'px';
    scene.style.top = ((vh - z.height) / 2 - z.top) + 'px';
  }
  function setZoom(on) {
    if (phone) { if (document.body.classList.contains('portrait')) return; peek = !peek; layoutPhone(); if (power) render(false); return; }
    zoomed = !!on; document.body.classList.toggle('zoom', zoomed);
    try { localStorage.setItem('cablebox.zoom', zoomed ? '1' : '0'); } catch (e) {}
    layoutZoom(); if (power) render(false);
  }
  window.addEventListener('resize', layoutZoom);
  window.addEventListener('orientationchange', () => setTimeout(layoutZoom, 60));
  phoneMQ.addEventListener('change', layoutZoom);

  function toggleFullscreen() {
    const d = document, el = d.documentElement;
    const on = d.fullscreenElement || d.webkitFullscreenElement;
    try { on ? (d.exitFullscreen || d.webkitExitFullscreen).call(d) : (el.requestFullscreen || el.webkitRequestFullscreen).call(el); } catch (e) {}
  }
  document.querySelector('.set').addEventListener('dblclick', (e) => { if (!e.target.closest('.glass, button')) toggleFullscreen(); });
  document.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) b.blur(); });   // no lingering focus ring on the photo
  document.addEventListener('visibilitychange', () => { if (!document.hidden && power) render(false); });

  let flashT = null;
  function flash(msg) {                                              // a brief readout under the set
    hint.textContent = msg; hint.classList.remove('hidden'); clearTimeout(flashT);
    flashT = setTimeout(() => { hintText(); if (power) hint.classList.add('hidden'); }, 1600);
  }
  function hintText() {
    const portraitPhone = window.matchMedia('(max-width: 700px) and (orientation: portrait)').matches;
    hint.textContent = portraitPhone ? 'Turn your phone sideways, then press POWER on the cable box.' : 'Press POWER on the cable box. Punch a channel, or type it. The guide is channel 1. This week\'s listings are in the paper on top of the set. Z zooms to the picture, F for full screen.';
  }
  hintText(); window.addEventListener('resize', hintText);
  { const line = document.querySelector('.paper-line'); if (line) line.textContent = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()] + "'s listings · page 4"; }
  document.body.classList.add('power-off');

  loadData().then(() => {
    showDigits(String(ch));
    if (!layoutPhone()) { try { if (localStorage.getItem('cablebox.zoom') === '1') setZoom(true); } catch (e) {} }
    setInterval(() => { render(false); maybeRefresh(new Date()); }, 1000);
  }).catch(err => { console.error(err); hint.textContent = 'Could not load the channel data.'; });
})();
