// marquee.js — a 14-segment alphanumeric LED strip, the kind a 1985 VCR or receiver had. Steps one character every
// half second. Lives on the cable box and the remote, never on the picture.
(function () {
  // segment geometry in a 44x76 cell: a top, b/c right, d bottom, e/f left, g1/g2 center halves,
  // h/j upper diagonals, i upper center, k/m lower diagonals, l lower center, p a dot
  const SEG = {
    a: '10,3 34,3 38,7 34,11 10,11 6,7', f: '8,9 12,13 12,33 8,37 4,33 4,13', b: '36,9 40,13 40,33 36,37 32,33 32,13',
    e: '8,39 12,43 12,63 8,67 4,63 4,43', c: '36,39 40,43 40,63 36,67 32,63 32,43', d: '10,65 34,65 38,69 34,73 10,73 6,69',
    g1: '10,34 20,34 23,38 20,42 10,42 6,38', g2: '24,34 34,34 38,38 34,42 24,42 21,38',
    i: '20,13 24,13 24,33 22,36 20,33', l: '20,43 22,40 24,43 24,63 20,63',
    h: '10,12 14,12 20,30 20,34 16,34 10,16', j: '34,12 30,12 24,30 24,34 28,34 34,16',
    k: '20,42 20,46 14,64 10,64 10,60 16,42', m: '24,42 24,46 30,64 34,64 34,60 28,42',
  };
  const FONT = {
    A: 'a b c e f g1 g2', B: 'a b c d i l g2', C: 'a d e f', D: 'a b c d i l', E: 'a d e f g1 g2', F: 'a e f g1 g2', G: 'a c d e f g2',
    H: 'b c e f g1 g2', I: 'a d i l', J: 'b c d e', K: 'e f g1 j m', L: 'd e f', M: 'b c e f h j', N: 'b c e f h m', O: 'a b c d e f',
    P: 'a b e f g1 g2', Q: 'a b c d e f m', R: 'a b e f g1 g2 m', S: 'a c d f g1 g2', T: 'a i l', U: 'b c d e f', V: 'e f j k',
    W: 'b c e f k m', X: 'h j k m', Y: 'h j l', Z: 'a d j k',
    0: 'a b c d e f', 1: 'b c', 2: 'a b d e g1 g2', 3: 'a b c d g2', 4: 'b c f g1 g2', 5: 'a c d f g1 g2', 6: 'a c d e f g1 g2',
    7: 'a b c', 8: 'a b c d e f g1 g2', 9: 'a b c d f g1 g2',
    '-': 'g1 g2', '+': 'g1 g2 i l', '/': 'j k', '\\': 'h m', "'": 'i', '!': 'i l', '?': 'a b g2 l', ':': 'i l', '*': 'g1 g2 h i j k l m',
    '=': 'a d', '(': 'j m', ')': 'h k', '"': 'f i', ',': 'k', '.': 'k', '_': 'd', ' ': '',
  };
  function normalize(text) {
    return String(text || '').toUpperCase().replace(/&/g, ' AND ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
      .replace(/[–—|]/g, '-').replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ').trim();
  }
  function make(container, n) {
    container.innerHTML = '';
    const cells = [];
    for (let i = 0; i < n; i++) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 44 76'); svg.setAttribute('class', 'mq');
      svg.innerHTML = Object.keys(SEG).map(k => `<polygon data-s="${k}" points="${SEG[k]}"/>`).join('');
      container.appendChild(svg); cells.push(svg);
    }
    let text = '', pos = 0, timer = null;
    function paint() {
      const pad = text.length > n ? text + '   ' : text.padEnd(n, ' ');
      for (let i = 0; i < n; i++) {
        const ch = pad[(pos + i) % pad.length] || ' ';
        const on = (FONT[ch] !== undefined ? FONT[ch] : FONT[ch.toUpperCase()] || '').split(' ').filter(Boolean);
        cells[i].querySelectorAll('polygon').forEach(p => p.classList.toggle('on', on.includes(p.dataset.s)));
      }
    }
    function set(t) {
      const nt = normalize(t);
      if (nt === text) return;
      text = nt; pos = 0; paint();
      clearInterval(timer); timer = null;
      if (text.length > n) timer = setInterval(() => { pos = (pos + 1) % (text.length + 3); paint(); }, 500);
    }
    function clear() { set(''); }
    return { set, clear, get text() { return text; } };
  }
  window.Marquee = { make, normalize };
})();
