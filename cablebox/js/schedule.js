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

  // Seconds of commercials after a program (regular) or after every third video (block). Daypart, then channel,
  // then the lineup's default, then the mode's own default.
  function breakLen(dp, channel, catalog, modeDefault) {
    for (const v of [dp.breakSeconds, channel.breakSeconds, catalog.breakSeconds]) if (v != null) return v;
    return modeDefault;
  }

  function fillBreak(out, from, to, seed, k, catalog) {
    const fill = catalog.pools[catalog.filler] || [];
    let t = from, j = 0;
    while (t < to && fill.length && j < 24) {
      const target = mix(seed, k * 131 + j + 7);
      const clip = pick(fill, target);
      const len = Math.min(to - t, clip.d);
      const maxOff = Math.max(0, clip.d - len);
      const off = maxOff ? mix(target, 99) % maxOff : 0;
      out.push({ start: t, end: t + len, kind: 'break', id: clip.id, off, title: clip.t, dur: clip.d });
      t += len; j++;
    }
    if (t < to) out.push({ start: t, end: to, kind: 'off' });
  }

  function build(channel, date, catalog) {
    const seed = hash32(channel.id + '|' + ymd(date));
    const dow = date.getDay();
    const out = [], recent = [];
    let t = 0, k = 0;
    while (t < DAY) {
      const dp = daypartAt(channel, dow, t);
      const name = dp && dp.pool;
      const pool = name && catalog.pools[name];
      if (!pool || !pool.length) {
        const end = Math.min(DAY, Math.floor(t / HALF) * HALF + HALF);
        out.push({ start: t, end, kind: 'off' });
        t = end; k++; continue;
      }
      if (dp.block) {
        // Music-television mode: fill the half hour with videos back to back, a short break every three.
        // The guide shows the block's label, not every song.
        const slotEnd = Math.min(DAY, Math.floor(t / HALF) * HALF + HALF);
        const label = dp.label || channel.name, win = Math.min(40, pool.length - 1);
        let n = 0;
        while (t < slotEnd) {
          const brk = breakLen(dp, channel, catalog, 90);
          if (brk > 0 && n > 0 && n % 3 === 0) {
            const len = Math.min(slotEnd - t, brk);
            fillBreak(out, t, t + len, seed, k * 1000 + n, catalog); t += len;
            if (t >= slotEnd) break;
          }
          const target = mix(seed, k * 1000 + n);
          const prog = pick(pool, target, new Set(recent.slice(-win)), slotEnd - t) || pick(pool, target, null, slotEnd - t);
          if (!prog) { fillBreak(out, t, slotEnd, seed, k * 1000 + n, catalog); t = slotEnd; break; }
          out.push({ start: t, end: t + prog.d, kind: 'program', id: prog.id, title: prog.t, series: prog.s || '', off: 0, dur: prog.d, pool: name, label });
          recent.push(prog.id); t += prog.d; n++;
        }
        k++; continue;
      }
      const remaining = DAY - t, target = mix(seed, k), ex = new Set(recent.slice(-12));
      // Prefer something that ends before midnight; otherwise take the next pick anyway and cut it at midnight,
      // the way a station switched to the overnight feed.
      const prog = pick(pool, target, ex, remaining) || pick(pool, target, null, remaining) || pick(pool, target, ex) || pick(pool, target);
      const end = Math.min(DAY, t + prog.d);
      out.push({ start: t, end, kind: 'program', id: prog.id, title: prog.t, series: prog.s || '', off: 0, dur: prog.d, pool: name, label: dp.label, cut: t + prog.d > DAY });
      recent.push(prog.id);
      const brk = breakLen(dp, channel, catalog, 0);
      let next = end;
      if (brk > 0 && end < DAY) { next = Math.min(DAY, end + brk); fillBreak(out, end, next, seed, k, catalog); }
      t = next; k++;
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
        out.push({ start: s, end: en, kind: e.kind, title: e.title || '', series: e.series || '', label: e.label || '' });
      }
      d = new Date(d.getTime() + DAY * 1000 + 3600 * 1000); d.setHours(0, 0, 0, 0);
    }
    return out;
  }

  function prepare(catalog, filler, breakSeconds) {
    catalog.filler = catalog.filler || filler || 'commercials';
    catalog.breakSeconds = breakSeconds;
    for (const name in catalog.pools) for (const it of catalog.pools[name]) it.h = hash32(it.id);
    cache.clear();
  }

  window.Sched = { at, programsBetween, dayList, prepare, hash32 };
})();
