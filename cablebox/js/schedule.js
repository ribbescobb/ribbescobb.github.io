// schedule.js — the broadcast clock.
// A channel's day is computed from (channel id, local date, catalog) with a seeded consistent hash, so every
// viewer with the same catalog sees the same program at the same moment. No server, no schedule file.
// Programs snap to half-hour slots; the slack is filled with commercials from the filler pool.
(function () {
  const HALF = 1800, DAY = 86400;

  function hash32(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return h >>> 0;
  }
  function mix(a, b) {
    let h = (a ^ Math.imul((b + 0x9E3779B1) | 0, 0x85EBCA77)) >>> 0;
    h ^= h >>> 15; h = Math.imul(h, 0xC2B2AE3D) >>> 0; h ^= h >>> 13;
    return h >>> 0;
  }
  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function secOfDay(d) { return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds(); }
  function midnight(d) { const m = new Date(d); m.setHours(0, 0, 0, 0); return m; }
  function hm(s) { const p = String(s).split(':'); return (+p[0]) * 3600 + (+(p[1] || 0)) * 60; }

  function daypartAt(channel, dow, t) {
    for (const dp of channel.dayparts || []) {
      if (dp.days && !dp.days.includes(dow)) continue;
      const from = dp.from ? hm(dp.from) : 0, to = dp.to ? hm(dp.to) : DAY;
      if (t >= from && t < to) return dp;
    }
    return null;
  }

  // Consistent hashing: the candidate whose id-hash sits nearest above the slot's target.
  // Dropping one video from a pool only disturbs the slots that would have picked it.
  function pick(items, target, exclude, maxDur) {
    let best = null, bestD = Infinity;
    for (const it of items) {
      if ((exclude && exclude.has(it.id)) || (maxDur && it.d > maxDur)) continue;
      const dist = (it.h - target) >>> 0;
      if (dist < bestD) { bestD = dist; best = it; }
    }
    return best;
  }

  function num() { for (const v of arguments) if (v != null) return v; return 0; }

  function fillBreak(out, from, to, seed, salt, catalog) {
    const fill = catalog.pools[catalog.filler] || [];
    let t = from, j = 0;
    while (t < to && fill.length && j < 8) {
      const target = mix(seed, salt * 131 + j + 7);
      const clip = pick(fill, target);
      const len = Math.min(to - t, clip.d);
      const maxOff = Math.max(0, clip.d - len);
      const off = maxOff ? mix(target, 99) % maxOff : 0;
      out.push({ start: t, end: t + len, kind: 'break', id: clip.id, off, title: clip.t, dur: clip.d });
      t += len; j++;
    }
    if (t < to) out.push({ start: t, end: to, kind: 'off' });
  }

  // One channel-day. A running clock inserts a short commercial break every `breakEvery` seconds (60s every 15 min
  // by default). Regular programs are interrupted and resume where they left off, unless the program ends within
  // three minutes of the mark, in which case the break waits for the end. Block-mode (music) channels only break
  // between songs. breakEvery 0 = no commercials on that channel.
  function build(channel, date, catalog) {
    const seed = hash32(channel.id + '|' + ymd(date));
    const dow = date.getDay();
    const out = [], recent = [];
    const every = num(channel.breakEvery, catalog.breakEvery, 900), len = num(channel.breakSeconds, catalog.breakSeconds, 60);
    const ads = every > 0 && len > 0;
    let t = 0, k = 0, lastBreak = 0;
    const due = (now) => ads && now - lastBreak >= every;
    const doBreak = (from) => { const to = Math.min(DAY, from + len); fillBreak(out, from, to, seed, k * 1000 + out.length, catalog); lastBreak = to; return to; };

    while (t < DAY) {
      const dp = daypartAt(channel, dow, t);
      const name = dp && dp.pool;
      const pool = name && catalog.pools[name];
      if (!pool || !pool.length) {
        const end = Math.min(DAY, Math.floor(t / HALF) * HALF + HALF);
        out.push({ start: t, end, kind: 'off' });
        t = end; lastBreak = end; k++; continue;
      }
      const target = mix(seed, k);

      if (dp.block) {
        // Music television: songs back to back, a break only at a song boundary once the clock is due.
        if (due(t)) { t = doBreak(t); k++; continue; }
        const win = Math.min(40, pool.length - 1), ex = new Set(recent.slice(-win));
        const song = pick(pool, target, ex, DAY - t) || pick(pool, target, null, DAY - t) || pick(pool, target, ex) || pick(pool, target);
        const end = Math.min(DAY, t + song.d);
        out.push({ start: t, end, kind: 'program', pid: k, id: song.id, title: song.t, series: song.s || '', off: 0, dur: song.d, pool: name, label: dp.label || channel.name, cut: t + song.d > DAY, a: song.a || '', n: song.n || '', y: song.y || '' });
        recent.push(song.id); t = end; k++; continue;
      }

      // A regular program, in segments around the breaks.
      const ex = new Set(recent.slice(-12));
      const prog = pick(pool, target, ex, DAY - t) || pick(pool, target, null, DAY - t) || pick(pool, target, ex) || pick(pool, target);
      const progEnd = Math.min(DAY, t + prog.d), cut = t + prog.d > DAY;
      let off = 0;
      while (t < progEnd) {
        if (due(t)) { t = doBreak(t); if (t >= progEnd) break; }
        const mark = lastBreak + every;
        const end = (ads && mark < progEnd - 180) ? mark : progEnd;
        out.push({ start: t, end, kind: 'program', pid: k, id: prog.id, title: prog.t, series: prog.s || '', off, dur: prog.d, pool: name, label: dp.label, cut });
        off += end - t; t = end;
      }
      recent.push(prog.id);
      if (ads && t < DAY && t - lastBreak >= every * 0.8) t = doBreak(t);   // a natural boundary close to the mark takes the break
      k++;
    }
    return out;
  }

  const cache = new Map();
  function dayList(channel, date, catalog) {
    const key = channel.id + '|' + ymd(date);
    let list = cache.get(key);
    if (!list) { list = build(channel, date, catalog); cache.set(key, list); }
    return list;
  }

  // What is on `channel` at Date `when`.
  function at(channel, when, catalog) {
    const list = dayList(channel, when, catalog);
    const s = secOfDay(when);
    let i = list.findIndex(e => s >= e.start && s < e.end);
    if (i < 0) i = list.length - 1;
    const e = list[i];
    return { entry: e, index: i, elapsed: s - e.start, list, dayStart: midnight(when) };
  }

  // Programs and off-air blocks (not breaks) overlapping [from, from + seconds), in epoch seconds.
  function programsBetween(channel, from, seconds, catalog) {
    const out = [];
    const fromS = from.getTime() / 1000, toS = fromS + seconds;
    let d = midnight(from);
    for (let n = 0; n < 3 && d.getTime() / 1000 < toS; n++) {
      const base = d.getTime() / 1000;
      for (const e of dayList(channel, d, catalog)) {
        if (e.kind === 'break') continue;
        const s = base + e.start, en = base + e.end;
        if (en <= fromS || s >= toS) continue;
        out.push({ start: s, end: en, kind: e.kind, title: e.title || '', series: e.series || '', label: e.label || '', pid: e.pid });
      }
      d = new Date(d.getTime() + DAY * 1000 + 3600 * 1000); d.setHours(0, 0, 0, 0);
    }
    return out;
  }

  function prepare(catalog, filler, breakSeconds, breakEvery) {
    catalog.filler = catalog.filler || filler || 'commercials';
    catalog.breakSeconds = breakSeconds; catalog.breakEvery = breakEvery;
    for (const name in catalog.pools) for (const it of catalog.pools[name]) it.h = hash32(it.id);
    cache.clear();
  }

  window.Sched = { at, programsBetween, dayList, prepare, hash32 };
})();
