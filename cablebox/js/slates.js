// slates.js — the text channels: WEATHER SCAN and the public access COMMUNITY BULLETIN BOARD. No video; a
// character-generator slate in the glass, in the same graphical language as the pledge break. Both channels get a
// synthetic pool so the clock can schedule them like anything else (the guide and TV Week print the daypart label).
//
// Weather comes from the National Weather Service's open API (api.weather.gov, CORS-enabled, no key). We never ask
// where the viewer is: ten fixed cities rotate on the clock, Minneapolis more often than the rest, so everyone
// sees the same city at the same moment. Endpoints were resolved once from lat/lon and are pinned here.
(function () {
  const CITIES = [
    { city: 'Minneapolis', st: 'MN', w: 3, f: 'https://api.weather.gov/gridpoints/MPX/108,72/forecast', h: 'https://api.weather.gov/gridpoints/MPX/108,72/forecast/hourly' },
    { city: 'Sheboygan', st: 'WI', w: 1, f: 'https://api.weather.gov/gridpoints/MKX/93,98/forecast', h: 'https://api.weather.gov/gridpoints/MKX/93,98/forecast/hourly' },
    { city: 'Brainerd', st: 'MN', w: 1, f: 'https://api.weather.gov/gridpoints/DLH/23,48/forecast', h: 'https://api.weather.gov/gridpoints/DLH/23,48/forecast/hourly' },
    { city: 'Hoboken', st: 'NJ', w: 1, f: 'https://api.weather.gov/gridpoints/OKX/32,43/forecast', h: 'https://api.weather.gov/gridpoints/OKX/32,43/forecast/hourly' },
    { city: 'Kearney', st: 'NE', w: 1, f: 'https://api.weather.gov/gridpoints/GID/42,74/forecast', h: 'https://api.weather.gov/gridpoints/GID/42,74/forecast/hourly' },
    { city: 'Toledo', st: 'OH', w: 1, f: 'https://api.weather.gov/gridpoints/CLE/20,66/forecast', h: 'https://api.weather.gov/gridpoints/CLE/20,66/forecast/hourly' },
    { city: 'Des Moines', st: 'IA', w: 1, f: 'https://api.weather.gov/gridpoints/DMX/73,49/forecast', h: 'https://api.weather.gov/gridpoints/DMX/73,49/forecast/hourly' },
    { city: 'Duluth', st: 'MN', w: 1, f: 'https://api.weather.gov/gridpoints/DLH/91,69/forecast', h: 'https://api.weather.gov/gridpoints/DLH/91,69/forecast/hourly' },
    { city: 'Amarillo', st: 'TX', w: 1, f: 'https://api.weather.gov/gridpoints/AMA/48,26/forecast', h: 'https://api.weather.gov/gridpoints/AMA/48,26/forecast/hourly' },
    { city: 'Fargo', st: 'ND', w: 1, f: 'https://api.weather.gov/gridpoints/FGF/100,57/forecast', h: 'https://api.weather.gov/gridpoints/FGF/100,57/forecast/hourly' },
  ];
  // the rotation: Minneapolis every third page, the others spaced out between
  const RING = (() => { const others = CITIES.filter(c => c.w === 1), out = []; let j = 0; while (j < others.length) { out.push(CITIES[0]); out.push(others[j++]); if (j < others.length) out.push(others[j++]); } return out; })();
  const PAGE = 12000;                                             // ms per city page, clock-anchored
  const TTL = 30 * 60 * 1000;                                     // forecast cache
  const cache = {};
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // ---- synthetic pools: half-hour "programs" so the scheduler has something to place ----
  function pool(kind) {
    const out = [];
    for (let i = 0; i < 48; i++) out.push({ id: kind + '-' + i, t: kind === 'weather' ? 'Weather Scan' : 'Community Bulletin Board', d: 1800, s: '' });
    return out;
  }

  // ---- weather ----
  async function fetchCity(c) {
    const now = Date.now();
    if (cache[c.city] && now - cache[c.city].at < TTL) return cache[c.city];
    try {
      const [f, h] = await Promise.all([fetch(c.f, { headers: { Accept: 'application/geo+json' } }).then(r => r.json()), fetch(c.h, { headers: { Accept: 'application/geo+json' } }).then(r => r.json())]);
      const periods = (f.properties && f.properties.periods) || [], hourly = (h.properties && h.properties.periods) || [];
      // "now" is the first hourly period that hasn't ended yet
      const cur = hourly.find(p => new Date(p.endTime) > new Date()) || hourly[0] || null;
      cache[c.city] = { at: now, periods, cur, ok: true };
    } catch (e) { cache[c.city] = { at: now - TTL + 60000, ok: false }; }   // retry in a minute
    return cache[c.city];
  }
  function page(now) { const i = Math.floor(now / PAGE) % RING.length; return RING[i]; }
  function sky(s) { return (s || '').replace(/ then .*$/i, '').replace(/Chance /i, 'Chc ').replace(/Slight /i, 'Slt ').replace(/Thunderstorms/i, 'T-Storms').replace(/Showers And /i, 'Showers & ').toUpperCase(); }
  function renderWeather(el, c, d, now) {
    const t = new Date(now); let hh = t.getHours(); const mm = String(t.getMinutes()).padStart(2, '0'); const ap = hh >= 12 ? 'PM' : 'AM'; hh = hh % 12 || 12;
    if (!d || !d.ok) {
      el.innerHTML = `<div class="sl-head">WEATHER SCAN</div><div class="sl-body"><div class="sl-big">RADAR TEMPORARILY UNAVAILABLE</div><div class="sl-sub">PLEASE STAND BY</div></div><div class="sl-foot">${hh}:${mm} ${ap}</div><div class="pl-bars"></div>`;
      return;
    }
    const cur = d.cur, rows = d.periods.slice(0, 5).map(p => `<div class="sl-row"><span>${esc(p.name.toUpperCase())}</span><span>${p.temperature}°</span><span>${esc(sky(p.shortForecast))}</span></div>`).join('');
    const hum = cur && cur.relativeHumidity && cur.relativeHumidity.value != null ? `HUMIDITY ${cur.relativeHumidity.value}%` : '';
    const pop = cur && cur.probabilityOfPrecipitation && cur.probabilityOfPrecipitation.value ? `PRECIP ${cur.probabilityOfPrecipitation.value}%` : '';
    el.innerHTML = `<div class="sl-head">LOCAL FORECAST &nbsp;·&nbsp; ${esc(c.city.toUpperCase())}, ${c.st}</div>
      <div class="sl-body">
        <div class="sl-now"><span class="sl-temp">${cur ? cur.temperature + '°' : '--'}</span><span class="sl-cond">${cur ? esc(sky(cur.shortForecast)) : ''}<br><small>WIND ${cur ? esc((cur.windDirection || '') + ' ' + (cur.windSpeed || '').toUpperCase()) : ''} ${hum ? '&nbsp;·&nbsp; ' + hum : ''} ${pop ? '&nbsp;·&nbsp; ' + pop : ''}</small></span></div>
        <div class="sl-rows">${rows}</div>
      </div>
      <div class="sl-foot">WEATHER SCAN &nbsp;·&nbsp; ${hh}:${mm} ${ap} &nbsp;·&nbsp; TEMPERATURES IN FAHRENHEIT &nbsp;·&nbsp; COURTESY NATIONAL WEATHER SERVICE</div><div class="pl-bars"></div>`;
  }
  let wxTimer = null, wxEl = null, wxShown = '';
  function weatherStart(el) {
    wxEl = el; weatherStop();
    const tick = async () => {
      const now = Date.now(), c = page(now), key = c.city + Math.floor(now / PAGE);
      const d = await fetchCity(c);
      if (wxEl && key !== wxShown) { wxShown = key; renderWeather(wxEl, c, d, now); }
      else if (wxEl && d && d.ok && !wxEl.querySelector('.sl-temp')) renderWeather(wxEl, c, d, now);
    };
    tick(); wxTimer = setInterval(tick, 1000);
    for (const c of RING.slice(0, 4)) fetchCity(c);                  // warm the next pages
  }
  function weatherStop() { if (wxTimer) clearInterval(wxTimer); wxTimer = null; wxShown = ''; }
  function weatherLine(now) { const c = page(now || Date.now()), d = cache[c.city]; return c.city.toUpperCase() + (d && d.ok && d.cur ? ' ' + d.cur.temperature + 'F ' + sky(d.cur.shortForecast) : ''); }

  // ---- community bulletin board ----
  let bbTimer = null, bbEl = null, bbShown = -1, bbLines = null;
  function renderBoard(el, pageNo, now) {
    const t = new Date(now); let hh = t.getHours(); const mm = String(t.getMinutes()).padStart(2, '0'); const ap = hh >= 12 ? 'PM' : 'AM'; hh = hh % 12 || 12;
    const lines = bbLines ? bbLines(pageNo) : [];
    el.innerHTML = `<div class="sl-head">COMMUNITY BULLETIN BOARD</div><div class="sl-body sl-board">${lines.map(l => `<div class="sl-item">${esc(l)}</div>`).join('')}</div>
      <div class="sl-foot">PUBLIC ACCESS &nbsp;·&nbsp; ${hh}:${mm} ${ap} &nbsp;·&nbsp; TO PLACE A NOTICE CALL THE CABLE OFFICE &nbsp;·&nbsp; PAGE ${(pageNo % 9) + 1} OF 9</div><div class="pl-bars"></div>`;
  }
  function boardStart(el, linesFn) {
    bbEl = el; bbLines = linesFn; boardStop();
    const tick = () => { const now = Date.now(), p = Math.floor(now / PAGE); if (p !== bbShown) { bbShown = p; renderBoard(bbEl, p, now); } };
    tick(); bbTimer = setInterval(tick, 1000);
  }
  function boardStop() { if (bbTimer) clearInterval(bbTimer); bbTimer = null; bbShown = -1; }

  window.Slates = { pool, weatherStart, weatherStop, weatherLine, boardStart, boardStop, CITIES, RING };
})();
