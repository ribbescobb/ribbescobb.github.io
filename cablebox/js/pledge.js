// pledge.js — the cable operator's pledge drive. A slate at an act break once someone has watched a while or flipped
// around enough, a line in the guide's bulletins, and a notice in TV Week. Everything is metered on the device and
// nothing leaves it: a counter in localStorage next to the volume setting. Feature flag: "pledge" in channels.json.
//   ?pledge=preview   show the slate right away when a program is on (for tweaking the look)
//   ?pledge=now       due immediately: the slate runs at the next act break
//   ?pledge=off       this device has given; never show the slate here again (?pledge=reset undoes it)
(function () {
  const KEY = 'cablebox.pledge';
  let cfg = { enabled: false }, st = { watched: 0, changes: 0, last: 0, off: false }, forced = false, preview = false, dirty = 0;
  const load = () => { try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {} };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  function init(c) {
    cfg = Object.assign({ enabled: false, url: '#', label: 'KO-FI.COM/YOUR-CABLE-OPERATOR', minutes: 20, changes: 15, cooldownDays: 7, slateSeconds: 12, bulletinShare: 4 }, c || {});
    load();
    const q = new URLSearchParams(location.search).get('pledge');
    if (q === 'now') forced = true;
    if (q === 'preview') preview = true;
    if (q === 'off') { st.off = true; save(); }
    if (q === 'reset') { st = { watched: 0, changes: 0, last: 0, off: false }; save(); }
    const a = document.getElementById('pledgeLink'); if (a) { a.href = cfg.url; a.textContent = cfg.label; }
  }
  const on = () => !!cfg.enabled && !st.off;
  function tick(playing) { if (!on() || !playing) return; st.watched++; if (++dirty >= 10) { dirty = 0; save(); } }
  function changed() { if (!on()) return; st.changes++; save(); }
  function due() {
    if (!on()) return false;
    if (forced) return true;
    if (Date.now() - (st.last || 0) < cfg.cooldownDays * 86400000) return false;
    return st.watched >= cfg.minutes * 60 || st.changes >= cfg.changes;
  }
  function shown() { forced = false; st.last = Date.now(); st.watched = 0; st.changes = 0; save(); }
  function takePreview() { const p = preview; preview = false; return p; }
  // the guide's yellow row, rotated by hash so the crawl doesn't repeat itself
  const LINES = [
    (l) => 'THIS GUIDE IS MADE POSSIBLE BY VIEWERS LIKE YOU · ' + l,
    (l) => 'SUPPORT YOUR LOCAL CABLE OPERATOR · PLEDGE LINE ' + l,
    (l) => 'PLEDGE WEEK · KEEP THE SIGNAL ON · ' + l,
    (l) => 'YOUR CABLE OPERATOR THANKS ITS SUBSCRIBERS · ' + l,
  ];
  function bulletin(h) { return on() ? LINES[(h >>> 0) % LINES.length](cfg.label.toUpperCase()) : null; }
  window.Pledge = { init, tick, changed, due, shown, takePreview, bulletin, get cfg() { return cfg; }, get enabled() { return on(); }, get state() { return st; } };
})();
