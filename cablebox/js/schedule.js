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

  // Holidays. A daypart may carry "holiday": "MM-DD" | "easter" | "thanksgiving" | "mothers-day" | "fathers-day".
  function easter(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
      g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
      l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, mo - 1, da);
  }
  function nthWeekday(y, month, weekday, n) { const first = new Date(y, month - 1, 1); return new Date(y, month - 1, 1 + (weekday - first.getDay() + 7) % 7 + 7 * (n - 1)); }
  function holidayDate(spec, y) {
    if (spec === 'easter') return easter(y);
    if (spec === 'thanksgiving') return nthWeekday(y, 11, 4, 4);
    if (spec === 'mothers-day') return nthWeekday(y, 5, 0, 2);
    if (spec === 'fathers-day') return nthWeekday(y, 6, 0, 3);
    const p = String(spec).split('-'); return new Date(y, +p[0] - 1, +p[1]);
  }
  // Signed days to the nearest occurrence: negative when it just passed.
  function daysUntil(spec, date) {
    const today = midnight(date); let best = null;
    for (const y of [date.getFullYear() - 1, date.getFullYear(), date.getFullYear() + 1]) {
      const d = Math.round((holidayDate(spec, y) - today) / 86400000);
      if (best === null || Math.abs(d) < Math.abs(best)) best = d;
    }
    return best;
  }

  // Which daypart is on at second t. Plain dayparts are a hard schedule: the first one covering t whose pool has
  // anything in it wins (so a show strip can sit above a catch-all block and fall through while its pool is thin).
  // Holiday dayparts are a soft mix: everything whose holiday lies inside the forward window (default 90 days)
  // is in season, weighted toward the nearest, and takes `skew` (default 85%) of the picks; the rest, or the
  // whole channel when nothing is in season, is a random smattering of all of them.
  function daypartAt(channel, date, dow, t, seed, k, catalog) {
    const soft = [];
    for (const dp of channel.dayparts || []) {
      if (dp.days && !dp.days.includes(dow)) continue;
      const from = dp.from ? hm(dp.from) : 0, to = dp.to ? hm(dp.to) : DAY;
      if (t < from || t >= to) continue;
      const stocked = catalog.pools[dp.pool] && catalog.pools[dp.pool].length;
      if (!dp.holiday) { if (stocked) return dp; continue; }   // an empty strip falls through to the next daypart covering t
      if (stocked) soft.push(dp);
    }
    if (!soft.length) return null;
    const window = num(channel.window, 90);
    let total = 0;
    const w = soft.map((dp) => {
      const d = daysUntil(dp.holiday, date);
      if (d > window || d < -num(dp.linger, 1)) return 0;
      const near = (window - Math.max(d, 0)) / window;         // 0 at the edge of the window, 1 on the day
      const x = num(dp.weight, 1) * near * near; total += x; return x;
    });
    const unit = (n) => mix(seed, k * 31 + n) / 4294967296;
    if (total > 0 && unit(7) < num(channel.skew, 0.85)) {
      let r = unit(11) * total;
      for (let i = 0; i < soft.length; i++) { r -= w[i]; if (r < 0) return soft[i]; }
    }
    return soft[Math.floor(unit(13) * soft.length)];
  }

  // Consistent hashing: the candidate whose id-hash sits nearest above the slot's target.
  // Dropping one video from a pool only disturbs the slots that would have picked it.
  // The seasonal nudge (Chris): tagged candidates count for NUDGE each in the draw instead of one. News leans toward
  // broadcasts from this calendar month; everything else leans toward this month's and next month's holidays. Music
  // channels and the SEASONAL channel (which has its own weighting) are exempt. Set per channel-day by build().
  const NUDGE = 10;
  let PREFER = null;
  const wanted = (it) => !!PREFER && ((PREFER.tags && it.hol && PREFER.tags.has(it.hol)) || (PREFER.month && it.m === PREFER.month));
  function eligible(items, exclude, maxDur) {
    const out = [];
    for (const it of items) if (!((exclude && exclude.has(it.id)) || (maxDur && it.d > maxDur))) out.push(it);
    return out;
  }
  // Deterministically decide whether this slot draws from the tagged candidates; returns the list to draw from.
  function nudged(cands, target) {
    if (!PREFER || cands.length < 2) return cands;
    const tagged = cands.filter(wanted); const T = tagged.length;
    if (!T || T === cands.length) return cands;
    const share = (T * NUDGE) / ((cands.length - T) + T * NUDGE);
    return (mix(target, 17) / 4294967296) < share ? tagged : cands;
  }
  function nearest(cands, target) {
    let best = null, bestD = Infinity;
    for (const it of cands) { const dist = (it.h - target) >>> 0; if (dist < bestD) { bestD = dist; best = it; } }
    return best;
  }
  function pickFrom(items, target, exclude, maxDur) {
    return nearest(nudged(eligible(items, exclude, maxDur), target), target);
  }
  // Series balance: a pool with several shows picks the show first (a show's share of the ring goes by the square root
  // of its episode count, so 437 Gadgets no longer drown 13 Galaxy Highs), then the episode within it.
  // Walk the ring from the ticket nearest above the target; a show with nothing eligible (all of it recently aired,
  // or too long for the slot) hands the slot to the next show on the ring, not back to the whole pool.
  function bySeries(items, target, exclude, maxDur, choose) {
    const tk = items.tickets; if (!tk) return null;
    let i = 0, bestD = Infinity;
    for (let j = 0; j < tk.length; j++) { const d = (tk[j].h - target) >>> 0; if (d < bestD) { bestD = d; i = j; } }
    const tried = new Set();
    for (let n = 0; n < tk.length && tried.size < items.groups.size; n++) {
      const t = tk[(i + n) % tk.length]; if (tried.has(t.s)) continue; tried.add(t.s);
      const r = choose(items.groups.get(t.s), mix(target, 5 + tried.size), exclude, maxDur);
      if (r) return r;
    }
    return null;
  }
  function pick(items, target, exclude, maxDur) {
    return bySeries(items, target, exclude, maxDur, pickFrom) || pickFrom(items, target, exclude, maxDur);
  }

  function num() { for (const v of arguments) if (v != null) return v; return 0; }

  // Among the nearest candidates by hash, the one that wastes the least of its half-hour slot. Deterministic.
  function pickFitting(items, target, exclude, maxDur) {
    return bySeries(items, target, exclude, maxDur, fittingFrom) || fittingFrom(items, target, exclude, maxDur);
  }
  function fittingFrom(items, target, exclude, maxDur) {
    const cands = nudged(eligible(items, exclude, maxDur), target).map((it) => [(it.h - target) >>> 0, it]);
    if (!cands.length) return null;
    cands.sort((a, b) => a[0] - b[0]);
    const near = cands.slice(0, 6);
    const pad = (it) => Math.ceil(it.d / HALF) * HALF - it.d;
    near.sort((a, b) => pad(a[1]) - pad(b[1]) || a[0] - b[0]);
    return near[0][1];
  }

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
  const HOLIDAYS = { xmas: '12-25', halloween: '10-31', thanksgiving: 'thanksgiving', valentines: '02-14', easter: 'easter', newyear: '01-01', july4: '07-04' };
  function preferenceFor(channel, date) {
    const pools = (channel.dayparts || []).map((dp) => dp.pool);
    if (channel.kind === 'guide' || channel.kind === 'scrambled' || pools.some((p) => /^music-/.test(p)) || (channel.dayparts || []).some((dp) => dp.holiday)) return null;
    if (pools.some((p) => /^news/.test(p))) return { month: date.getMonth() + 1 };
    const m = date.getMonth(), y = date.getFullYear(), tags = new Set();
    for (const key in HOLIDAYS) for (const yy of [y, y + 1]) { const d = holidayDate(HOLIDAYS[key], yy); const dm = d.getMonth() + (d.getFullYear() - y) * 12; if (dm === m || dm === m + 1) tags.add(key); }
    return tags.size ? { tags } : null;
  }
  function build(channel, date, catalog) {
    PREFER = preferenceFor(channel, date);
    const seed = hash32(channel.id + '|' + ymd(date));
    const dow = date.getDay();
    const out = [], recent = [];
    const every = num(channel.breakEvery, catalog.breakEvery, 900), len = num(channel.breakSeconds, catalog.breakSeconds, 150);
    const ads = every > 0 && len > 0;
    let t = 0, k = 0, lastBreak = 0;
    const due = (now) => ads && now - lastBreak >= every;
    const doBreak = (from, length) => { const to = Math.min(DAY, from + (length || len)); fillBreak(out, from, to, seed, k * 1000 + out.length, catalog); lastBreak = to; return to; };

    while (t < DAY) {
      const dp = daypartAt(channel, date, dow, t, seed, k, catalog);
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
        if (due(t)) { t = doBreak(t, 90); k++; continue; }   // between songs: one or two spots, not an act break
        const win = Math.min(40, pool.length - 1), ex = new Set(recent.slice(-win));
        const song = pick(pool, target, ex, DAY - t) || pick(pool, target, null, DAY - t) || pick(pool, target, ex) || pick(pool, target);
        const end = Math.min(DAY, t + song.d);
        out.push({ start: t, end, kind: 'program', pid: k, id: song.id, title: song.t, series: song.s || '', off: 0, dur: song.d, pool: name, label: dp.label || channel.name, cut: t + song.d > DAY, a: song.a || '', n: song.n || '', y: song.y || '' });
        recent.push(song.id); t = end; k++; continue;
      }

      // A regular program. It starts on the hour or half hour; the padding to the next boundary becomes commercials,
      // spread as one or two short breaks inside the show (act breaks) with the remainder after the credits.
      // Long broadcasts (games) break about every 15 minutes instead.
      const ex = new Set(recent.slice(-12));
      const prog = pickFitting(pool, target, ex, DAY - t) || pick(pool, target, null, DAY - t) || pick(pool, target, ex) || pick(pool, target);
      const dur = Math.min(prog.d, DAY - t), cut = prog.d > DAY - t;
      const slotEnd = Math.min(DAY, Math.ceil((t + dur) / HALF) * HALF);
      const pad = slotEnd - (t + dur);
      let n = 0;
      if (ads && pad >= 90) n = dur > 3600 ? Math.max(1, Math.floor(dur / 900) - 1) : (dur > 1800 ? 2 : 1);
      let midLen = n ? Math.min(len, Math.floor(pad / (n + 1))) : 0;
      if (midLen < 45) { n = 0; midLen = 0; }
      const segs = n + 1;
      let off = 0, tt = t;
      for (let i = 0; i < segs; i++) {
        const segEnd = i === segs - 1 ? dur : Math.round(dur * (i + 1) / segs);
        out.push({ start: tt, end: tt + (segEnd - off), kind: 'program', pid: k, id: prog.id, title: prog.t, series: prog.s || '', off, dur: prog.d, pool: name, label: dp.label, cut });
        tt += segEnd - off; off = segEnd;
        if (i < segs - 1) { fillBreak(out, tt, tt + midLen, seed, k * 1000 + i, catalog); tt += midLen; }
      }
      recent.push(prog.id);
      if (ads && slotEnd - tt >= 360) {
        // a long gap after the credits: run a classic cartoon short first, then the commercials
        const shorts = catalog.pools.classics || [];
        const clip = shorts.length && !dp.block ? pick(shorts, mix(seed, k * 1000 + 77), null, slotEnd - tt - 60) : null;
        if (clip) { out.push({ start: tt, end: tt + clip.d, kind: 'program', pid: k + 0.5, id: clip.id, title: clip.t, series: '', off: 0, dur: clip.d, pool: 'classics', label: 'Cartoon' }); tt += clip.d; }
      }
      if (ads && tt < slotEnd) fillBreak(out, tt, slotEnd, seed, k * 1000 + 99, catalog);
      t = ads ? slotEnd : tt; lastBreak = t; k++;   // no commercials on this channel = no padding: the next program starts when this one ends
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
    if (i < 0) {   // a hole: off the air until the next entry
      const next = list.find(e => e.start > s), prev = [...list].reverse().find(e => e.end <= s);
      const e = { start: prev ? prev.end : 0, end: next ? next.start : DAY, kind: 'off' };
      return { entry: e, index: -1, elapsed: s - e.start, list, dayStart: midnight(when) };
    }
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
    for (const name in catalog.pools) {
      const pool = catalog.pools[name], groups = new Map();
      for (const it of pool) { it.h = hash32(it.id); const key = it.s || ''; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(it); }
      pool.groups = null; pool.tickets = null;
      if (groups.size >= 2) {
        const tickets = [];
        for (const [key, list] of groups) { const k = Math.max(1, Math.round(Math.sqrt(list.length))); const base = hash32(key); for (let j = 0; j < k; j++) tickets.push({ h: mix(base, j), s: key }); }   // mix(): FNV of near-identical strings clusters on the ring
        tickets.sort((a, b) => a.h - b.h);
        pool.groups = groups; pool.tickets = tickets;
      }
    }
    cache.clear();
  }

  // For the printed listings: which holiday dayparts are in season on a date, nearest first.
  function inSeason(channel, date) {
    const window = num(channel.window, 90), out = [];
    for (const dp of channel.dayparts || []) {
      if (!dp.holiday) continue;
      const d = daysUntil(dp.holiday, date);
      if (d > window || d < -num(dp.linger, 1)) continue;
      out.push({ dp, d });
    }
    return out.sort((a, b) => a.d - b.d).map((x) => x.dp);
  }
  window.Sched = { at, programsBetween, dayList, prepare, hash32, inSeason };
})();
