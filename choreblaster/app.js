/* ChoreBlaster POC — single-device, localStorage. */
(() => {
'use strict';

const KEY = 'choreblaster-v1';
const SESSION_KEY = 'choreblaster-session';
const SUP_TIMEOUT_MS = 15 * 60 * 1000;
const EMOJIS = ['🦊','🐯','🦄','🐸','🐼','🦖','🐙','🚀','⚡','🌈','🐶','🐱','🦁','🐨','🦋','🍕','🎮','⚽','🎸','🌟'];
const SUP_EMOJIS = ['👩','👨','🧑','👵','👴','🧔','👩‍🦱','👨‍🦲','🧙','🦸'];
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const STARTERS = [
  ['Empty the dishwasher', 1, 'honor', 'daily'], ['Take out the trash', 1, 'honor', 'daily'], ['Feed the dog', 1, 'honor', 'daily'],
  ['Clear the table after dinner', 1, 'honor', 'daily'], ['Water the plants', 2, 'honor', 'weekly'], ['Clean your room', 5, 'inspect', 'weekly'],
  ['Vacuum the living room', 4, 'inspect', 'weekly'], ['Fold a load of laundry', 4, 'inspect', 'weekly'], ['Mow the lawn', 12, 'inspect', 'weekly'],
  ['Wipe down the bathroom', 6, 'inspect', 'weekly'],
];

/* ---------- state ---------- */
let S = load();
let session = loadSession();
let ui = { tab: 'board', sheet: null, setupSups: 2, setupKids: 2 };

function blank() {
  return { version: 1, family: { name: '', weekStartDay: 1, defaultPot: 50, claimCap: 2, kidsSeeBoard: true }, people: [], templates: [], weeks: [], ledger: [] };
}
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign(blank(), JSON.parse(raw)); } catch (e) {}
  return blank();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save. Storage full?'); } }
function loadSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || {}; } catch (e) { return {}; } }
function saveSession() { try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {} }

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => { n = Number(n) || 0; const neg = n < 0; n = Math.abs(n); const s = Number.isInteger(n) ? String(n) : n.toFixed(2); return (neg ? '-$' : '$') + s; };
const person = id => S.people.find(p => p.id === id);
const kids = () => S.people.filter(p => p.role === 'kid');
const sups = () => S.people.filter(p => p.role === 'sup');
const me = () => person(session.userId);
const isSup = () => me()?.role === 'sup';
const isDemo = () => !!S.family.demo || (S.family.name === 'The Blasters' && S.people.some(p => p.name === 'Ava' && p.role === 'kid'));

/* ---------- dates & weeks ---------- */
function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function parseYmd(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function weekStartOf(d) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); const diff = (x.getDay() - S.family.weekStartDay + 7) % 7; x.setDate(x.getDate() - diff); return x; }
function fmtDate(d) { return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
function weekLabel(w) { return 'Week of ' + fmtDate(parseYmd(w.start)); }
function daysLeft(w) { const end = parseYmd(w.start); end.setDate(end.getDate() + 6); const t = new Date(); t.setHours(0, 0, 0, 0); return Math.max(0, Math.round((end - t) / 86400000)); }
function paydayName() { return DAYS[(S.family.weekStartDay + 6) % 7]; }

const today = () => ymd(new Date());
function addDays(s, n) { const d = parseYmd(s); d.setDate(d.getDate() + n); return ymd(d); }
function dayName(s) { return parseYmd(s).toLocaleDateString(undefined, { weekday: 'short' }); }
function instanceFrom(t, day) { return { id: uid(), templateId: t.id, title: t.title, price: t.price, mode: t.mode, assignedTo: t.assignedTo || null, freq: t.freq || 'weekly', day: day || null, state: 'open', claimedBy: null, note: '' }; }
/* All instances a template contributes to a week. Dailies get one per day, from `from` (default: week start) to week end. */
function instancesFrom(t, w, from) {
  if (t.freq !== 'daily') return [instanceFrom(t)];
  const out = []; for (let i = 0; i < 7; i++) { const d = addDays(w.start, i); if (!from || d >= from) out.push(instanceFrom(t, d)); } return out;
}
/* Which instances belong on today's board: everything weekly, today's dailies, and past dailies that were done or sent back. */
function visible(c) { if (!c.day) return true; const t = today(); if (c.day > t) return false; if (c.day < t) return c.state !== 'open'; return true; }
function ensureWeek() {
  const startId = ymd(weekStartOf(new Date()));
  let w = S.weeks.find(w => w.start === startId);
  if (w) return w;
  w = { id: uid(), start: startId, pot: S.family.defaultPot, chores: [] };
  S.templates.filter(t => !t.archived).forEach(t => w.chores.push(...instancesFrom(t, w)));
  S.weeks.push(w); S.weeks.sort((a, b) => a.start < b.start ? -1 : 1); save();
  return w;
}
const week = () => ensureWeek();
const allocated = w => w.chores.reduce((s, c) => s + Number(c.price), 0);
const isEarned = c => c.state === 'approved' || c.state === 'paid';

/* ---------- money ---------- */
function weekEntries(w, kidId) { return S.ledger.filter(e => e.weekId === w.id && e.kidId === kidId && e.type !== 'payout'); }
function weekEarned(w, kidId) { return weekEntries(w, kidId).reduce((s, e) => s + e.amount, 0); }
function pendingAmt(w, kidId) { return w.chores.filter(c => c.state === 'done' && c.claimedBy === kidId).reduce((s, c) => s + Number(c.price), 0); }
function balance(kidId) { return S.ledger.filter(e => e.kidId === kidId).reduce((s, e) => s + e.amount, 0); }
function rollup(entries) { const out = []; entries.forEach(e => { const hit = e.type === 'chore' && out.find(o => o.type === 'chore' && o.title === e.title); if (hit) { hit.n++; hit.amount += e.amount; } else out.push(Object.assign({ n: 1 }, e)); }); return out; }
function ranking(w) { return kids().map(k => ({ k, amt: weekEarned(w, k.id) })).sort((a, b) => b.amt - a.amt); }

/* ---------- actions ---------- */
function touch() { if (isSup()) { session.at = Date.now(); saveSession(); } }
function signIn(id) { session = { userId: id, at: Date.now() }; saveSession(); ui.tab = 'board'; render(); }
function signOut() { session = {}; saveSession(); render(); }

function claim(c) {
  const k = me(); const w = week();
  if (c.state !== 'open') return toast('Someone already grabbed that.');
  if (c.assignedTo && c.assignedTo !== k.id) return toast('That one is assigned to ' + person(c.assignedTo)?.name + '.');
  const cap = Number(S.family.claimCap);
  const open = w.chores.filter(x => x.state === 'claimed' && x.claimedBy === k.id && x.assignedTo !== k.id && !x.day).length;
  if (cap > 0 && !c.assignedTo && open >= cap) return toast('Finish one first. You can hold ' + cap + ' at a time.');
  c.state = 'claimed'; c.claimedBy = k.id; c.claimedAt = Date.now(); save(); render(); toast('Claimed! Go get it.');
}
function unclaim(c) { c.state = 'open'; c.claimedBy = null; c.note = ''; save(); render(); }
function markDone(c) {
  const k = me();
  if (c.state === 'open' && c.assignedTo && c.assignedTo !== k.id) return toast('That one is for ' + person(c.assignedTo)?.name + '.');
  if (c.state === 'open' && !c.day && c.assignedTo !== k.id) return toast('Claim it first.');
  if (!c.claimedBy) c.claimedBy = k.id;
  c.doneAt = Date.now();
  if (c.mode === 'honor') { approve(c, null); pop('+' + money(c.price)); toast('Cashed in!'); }
  else { c.state = 'done'; save(); render(); toast('Sent for inspection.'); }
}
function approve(c, by) {
  c.state = 'approved'; c.approvedAt = Date.now(); c.approvedBy = by; c.note = '';
  S.ledger.push({ id: uid(), type: 'chore', choreId: c.id, weekId: week().id, kidId: c.claimedBy, amount: Number(c.price), title: c.title, at: Date.now() });
  save(); render();
}
function undoApprove(c) {
  if (c.state !== 'approved') return;
  S.ledger = S.ledger.filter(e => !(e.type === 'chore' && e.choreId === c.id));
  c.state = 'claimed'; save(); render(); toast('Sent back to ' + person(c.claimedBy)?.name + '.');
}
function reject(c, note) { c.state = 'claimed'; c.note = note || 'Not quite. Try again.'; save(); render(); toast('Sent back.'); }
function payout(kidId) {
  const owed = balance(kidId); if (owed <= 0) return;
  S.ledger.push({ id: uid(), type: 'payout', weekId: week().id, kidId, amount: -owed, at: Date.now(), by: session.userId });
  S.weeks.forEach(w => w.chores.forEach(c => { if (c.state === 'approved' && c.claimedBy === kidId) c.state = 'paid'; }));
  save(); render(); toast('Paid ' + person(kidId)?.name + ' ' + money(owed));
}

/* ---------- rendering ---------- */
const app = document.getElementById('app');
function render() {
  if (isSup() && Date.now() - (session.at || 0) > SUP_TIMEOUT_MS) { session = {}; saveSession(); }
  let html;
  if (!S.people.length) html = viewSetup();
  else if (!me()) html = viewWho();
  else if (isSup()) html = viewSup();
  else html = viewKid();
  app.innerHTML = html;
}

function header(sub) {
  const p = me();
  return `<header class="top">
    <div class="who"><div class="avatar ${p.role === 'sup' ? 'sup' : ''}">${p.emoji}</div><div><div class="name">${esc(p.name)}</div><div class="sub">${sub}</div></div></div>
    <button class="link" data-act="signout">Switch</button>
  </header>`;
}
function tagDay(c) { if (c.day) return c.day === today() ? '<span class="tag daily">📅 Daily · Today</span>' : `<span class="tag daily">📅 Daily · ${dayName(c.day)}</span>`; return c.templateId ? '<span class="tag standing">🔁 Weekly</span>' : '<span class="tag">One-time</span>'; }
function tagMode(c) { return c.mode === 'inspect' ? '<span class="tag inspect">🔍 Inspected</span>' : '<span class="tag honor">✓ Honor</span>'; }
function tagWho(id, prefix) { const p = person(id); return p ? `<span class="tag who">${prefix || ''}${p.emoji} ${esc(p.name)}</span>` : ''; }
function tagState(c) {
  return { open: '', claimed: c.note ? '<span class="tag rejected">Sent back</span>' : '<span class="tag">In progress</span>', done: '<span class="tag pending">⏳ Waiting on inspection</span>', approved: '<span class="tag cashed">💵 Cashed in</span>', paid: '<span class="tag paid">Paid</span>' }[c.state] || '';
}
function weekSub() { const w = week(); const dl = daysLeft(w); return `${weekLabel(w)} · ${dl === 0 ? 'Payday is today!' : dl + ' day' + (dl === 1 ? '' : 's') + ' to ' + paydayName()}`; }

function leaderboard(myId) {
  const r = ranking(week());
  if (!r.length) return '';
  const top = r[0].amt;
  return `<div class="board">${r.map((x, i) => `<div class="rank ${i === 0 && top > 0 ? 'first' : ''} ${x.k.id === myId ? 'me' : ''}">${i === 0 && top > 0 ? '<div class="crown">👑</div>' : ''}<div class="avatar">${x.k.emoji}</div><div class="n">${esc(x.k.name)}</div><div class="amt">${money(x.amt)}</div><div class="pos">#${i + 1} this week</div></div>`).join('')}</div>`;
}

/* --- kid --- */
function viewKid() {
  const k = me(); const w = week();
  const vis = w.chores.filter(visible);
  const mine = vis.filter(c => (c.claimedBy === k.id && ['claimed', 'done'].includes(c.state)) || (c.state === 'open' && c.assignedTo === k.id));
  const grabs = vis.filter(c => c.state === 'open' && !c.assignedTo);
  const cashed = vis.filter(c => c.claimedBy === k.id && isEarned(c));
  const earned = weekEarned(w, k.id), pend = pendingAmt(w, k.id), bal = balance(k.id);
  const r = ranking(w); const myRank = r.findIndex(x => x.k.id === k.id) + 1;
  return header(weekSub()) + `
    <div class="card hero"><div class="label">Earned this week</div><div class="big">${money(earned)}</div>
      <div class="row"><div>Waiting on inspection<b>${money(pend)}</b></div><div>In your wallet<b>${money(bal)}</b></div>${S.family.kidsSeeBoard ? `<div>Rank<b>#${myRank} of ${r.length}</b></div>` : ''}</div></div>
    ${S.family.kidsSeeBoard ? leaderboard(k.id) : ''}
    <div class="section"><h2>Your chores</h2><span class="count">${mine.length}</span></div>
    ${mine.length ? mine.map(c => kidChore(c, k)).join('') : '<div class="empty">Nothing yet. Grab something below!</div>'}
    <div class="section"><h2>Up for grabs</h2><span class="count">${money(grabs.reduce((s, c) => s + Number(c.price), 0))} available</span></div>
    ${grabs.length ? grabs.map(c => kidChore(c, k)).join('') : '<div class="empty">All claimed. Ask a grown-up for more!</div>'}
    ${cashed.length ? `<div class="section"><h2>Cashed in</h2><span class="count">${money(cashed.reduce((s, c) => s + Number(c.price), 0))}</span></div>${cashed.map(c => kidChore(c, k)).join('')}` : ''}
    <div class="footer">ChoreBlaster · Ribbescobb Labs</div>`;
}
function kidChore(c, k) {
  let actions = '';
  if (c.state === 'open' && (c.assignedTo === k.id || c.day)) actions = `<button class="btn cash" data-act="done" data-id="${c.id}">✓ Mark done</button>`;
  else if (c.state === 'open') actions = `<button class="btn primary" data-act="claim" data-id="${c.id}">Claim it</button>`;
  else if (c.state === 'claimed' && c.claimedBy === k.id) actions = `<button class="btn cash" data-act="done" data-id="${c.id}">✓ Mark done</button>${c.assignedTo === k.id ? '' : `<button class="btn ghost sm" data-act="unclaim" data-id="${c.id}">Give it back</button>`}`;
  return `<div class="chore ${isEarned(c) ? 'done' : ''}"><div class="body"><div class="title">${esc(c.title)}</div><div class="tags">${tagDay(c)}${tagMode(c)}${c.assignedTo ? tagWho(c.assignedTo, 'For ') : ''}${tagState(c)}</div>
    ${c.note && c.state === 'claimed' ? `<div class="note">${esc(c.note)}</div>` : ''}${actions ? `<div class="actions">${actions}</div>` : ''}</div><div class="price">${money(c.price)}</div></div>`;
}

/* --- who / setup --- */
function viewWho() {
  return `<div class="splash"><h1>Chore<span>Blaster</span></h1><p>${esc(S.family.name) || 'Who\'s this?'}</p></div>
    <div class="who-grid">${S.people.map(p => `<button class="who-tile" data-act="pick" data-id="${p.id}"><div class="avatar lg ${p.role === 'sup' ? 'sup' : ''}">${p.emoji}</div><div class="n">${esc(p.name)}</div><div class="r">${p.role === 'sup' ? '🔒 Grown-up' : 'Kid'}</div></button>`).join('')}</div>
    ${isDemo() ? `<div class="card" style="margin-top:16px;text-align:center"><p class="fine">This is the demo family. Grown-up PIN is <b>1234</b>.</p><div style="margin-top:10px"><button class="btn block" data-act="leave-demo">Leave the demo and set up your family</button></div></div>` : ''}
    <div class="footer">Everyone shares this device for now. Grown-ups need their PIN.</div>`;
}
function viewSetup() {
  const supRows = Array.from({ length: ui.setupSups }, (_, i) => `<div class="setup-row"><button class="emo" data-act="cycle-emoji" data-kind="sup" data-i="${i}" type="button">${SUP_EMOJIS[i % SUP_EMOJIS.length]}</button><input name="sup-name-${i}" placeholder="${i === 0 ? 'Mom' : i === 1 ? 'Dad' : 'Name'}" autocomplete="off"><input class="pinf" name="sup-pin-${i}" placeholder="PIN" inputmode="numeric" maxlength="4" autocomplete="off"></div>`).join('');
  const kidRows = Array.from({ length: ui.setupKids }, (_, i) => `<div class="setup-row"><button class="emo" data-act="cycle-emoji" data-kind="kid" data-i="${i}" type="button">${EMOJIS[i % EMOJIS.length]}</button><input name="kid-name-${i}" placeholder="Kid's name" autocomplete="off"></div>`).join('');
  return `<div class="splash"><h1>Chore<span>Blaster</span></h1><p>One pot a week. Claim it, do it, cash it in.</p></div>
  <form id="setup" class="card">
    <div class="field"><label>Family name</label><input type="text" name="family" placeholder="The Blasters" autocomplete="off"></div>
    <div class="field"><label>Weekly pot</label><div class="money-in"><input type="number" name="pot" value="50" min="0" step="1" inputmode="decimal"></div><div class="hint">The most you'll pay out in a week. Chores you add draw from it.</div></div>
    <div class="field"><label>Grown-ups (pick a 4-digit PIN each)</label>${supRows}<button class="link" type="button" data-act="more-sups">+ Add another grown-up</button></div>
    <div class="field"><label>Kids (tap the emoji to change it)</label>${kidRows}<button class="link" type="button" data-act="more-kids">+ Add another kid</button></div>
    <div class="field"><label>Starter chores (edit any of these later)</label>${STARTERS.map(([t, p, m, f], i) => `<label class="starter"><input type="checkbox" name="st-${i}" checked><span class="t">${t}</span><span class="tag ${m} m">${m === 'inspect' ? '🔍' : '✓'}</span><span class="p">${money(p)}${f === 'daily' ? '<small>/day</small>' : ''}</span></label>`).join('')}</div>
    <button class="btn primary block" type="submit">Let's go</button>
    <p class="fine" style="text-align:center;margin-top:14px">or <button class="link" type="button" data-act="demo">load a demo family</button> to poke around</p>
  </form>
  <div class="card"><h3>How it works</h3><p class="fine" style="margin-top:6px">Grown-ups set a weekly pot and price the chores. Kids claim a chore, do it, and cash it in. Honor chores pay instantly. Inspected chores wait for a grown-up to approve. Standing chores come back every week automatically. Whatever isn't earned by payday disappears.</p></div>`;
}

/* --- supervisor --- */
function viewSup() {
  const w = week();
  const queue = w.chores.filter(c => c.state === 'done').length;
  const body = { board: supBoard, chores: supChores, payday: supPayday, family: supFamily }[ui.tab]();
  const tab = (id, ic, label, dot) => `<button class="${ui.tab === id ? 'on' : ''}" data-act="tab" data-tab="${id}"><span class="ic">${ic}</span>${label}${dot ? '<span class="dot"></span>' : ''}</button>`;
  return header(weekSub()) + body + `<nav class="tabs"><div class="in">${tab('board', '🧹', 'This week', queue)}${tab('chores', '🔁', 'Standing')}${tab('payday', '💵', 'Payday')}${tab('family', '👪', 'Family')}</div></nav>`;
}
function supBoard() {
  const w = week(); const alloc = allocated(w); const pct = w.pot > 0 ? Math.min(100, alloc / w.pot * 100) : 100;
  const vis = w.chores.filter(visible);
  const queue = vis.filter(c => c.state === 'done');
  const groups = [['Open', vis.filter(c => c.state === 'open')], ['In progress', vis.filter(c => c.state === 'claimed')], ['Cashed in', vis.filter(c => isEarned(c))]];
  return `<div class="card pot"><div class="head"><div><div class="fine" style="font-weight:800;text-transform:uppercase;letter-spacing:.06em">This week's pot</div><div class="amt">${money(w.pot)}</div></div><button class="btn sm" data-act="edit-pot">Edit</button></div>
    <div class="bar"><i class="${alloc > w.pot ? 'over' : ''}" style="width:${pct}%"></i></div>
    <div class="meta"><span>${money(alloc)} in chores${alloc > w.pot ? ` · <span style="color:var(--danger)">${money(alloc - w.pot)} over</span>` : ''}</span><span>${money(Math.max(0, w.pot - alloc))} unallocated</span></div>
    ${w.chores.some(c => c.day) ? '<p class="fine" style="margin-top:6px">Dailies count every day of the week toward the pot. The board shows today\'s.</p>' : ''}
    <div style="margin-top:12px"><button class="btn primary block" data-act="add-chore">+ Add a chore this week</button></div></div>
    ${leaderboard()}
    ${queue.length ? `<div class="section"><h2>🔍 Needs inspection</h2><span class="count">${queue.length}</span></div>${queue.map(supChore).join('')}` : ''}
    ${groups.map(([n, list]) => list.length ? `<div class="section"><h2>${n}</h2><span class="count">${list.length}</span></div>${list.map(supChore).join('')}` : '').join('')}
    ${w.chores.length ? '' : '<div class="empty">No chores this week yet. Add one, or set up standing chores.</div>'}`;
}
function supChore(c) {
  let actions = '';
  if (c.state === 'done') actions = `<button class="btn cash" data-act="approve" data-id="${c.id}">✓ Approve ${money(c.price)}</button><button class="btn danger" data-act="reject" data-id="${c.id}">Send back</button>`;
  else if (c.state === 'approved') actions = `<button class="btn ghost sm" data-act="undo" data-id="${c.id}">Undo</button>`;
  else if (c.state === 'claimed') actions = `<button class="btn ghost sm" data-act="release" data-id="${c.id}">Release claim</button>`;
  if (c.state !== 'paid') actions += `<button class="btn ghost sm" data-act="edit-chore" data-id="${c.id}">Edit</button>`;
  return `<div class="chore ${isEarned(c) ? 'done' : ''}"><div class="body"><div class="title">${esc(c.title)}</div><div class="tags">${tagDay(c)}${tagMode(c)}${c.claimedBy ? tagWho(c.claimedBy) : c.assignedTo ? tagWho(c.assignedTo, 'For ') : ''}${tagState(c)}</div>
    ${c.note && c.state === 'claimed' ? `<div class="note">${esc(c.note)}</div>` : ''}${actions ? `<div class="actions">${actions}</div>` : ''}</div><div class="price">${money(c.price)}</div></div>`;
}
function supChores() {
  const w = week(); const live = S.templates.filter(t => !t.archived);
  const total = live.reduce((s, t) => s + Number(t.price) * (t.freq === 'daily' ? 7 : 1), 0);
  return `<div class="card"><h2>Standing chores</h2><p class="fine" style="margin-top:4px">These show up automatically every new week. ${live.length ? `Right now that's ${money(total)} against a ${money(S.family.defaultPot)} pot.` : ''}</p>
    <div style="margin-top:12px"><button class="btn primary block" data-act="add-template">+ Add a standing chore</button></div></div>
    <div class="list">${live.map(t => { const inWeek = t.freq === 'daily' ? w.chores.some(c => c.templateId === t.id && c.day === today()) : w.chores.some(c => c.templateId === t.id); return `<div class="item"><div class="body"><div class="t">${esc(t.title)}</div><div class="s">${money(t.price)}${t.freq === 'daily' ? '/day' : ''} · ${t.mode === 'inspect' ? 'Inspected' : 'Honor'}${t.assignedTo ? ' · for ' + esc(person(t.assignedTo)?.name || '?') : ''}${inWeek ? '' : ' · <b>not in this week</b>'}</div></div>${inWeek ? '' : `<button class="btn sm" data-act="template-to-week" data-id="${t.id}">Add to week</button>`}<button class="kebab" data-act="edit-template" data-id="${t.id}">⋯</button></div>`; }).join('')}</div>
    ${live.length ? '' : '<div class="empty">No standing chores yet.</div>'}`;
}
function supPayday() {
  const w = week();
  const cards = kids().map(k => {
    const entries = weekEntries(w, k.id); const bal = balance(k.id); const pend = pendingAmt(w, k.id);
    const carried = bal - S.ledger.filter(e => e.weekId === w.id && e.kidId === k.id).reduce((s, e) => s + e.amount, 0);
    return `<div class="card"><div class="between"><div class="who" style="display:flex;align-items:center;gap:10px"><div class="avatar">${k.emoji}</div><div><div style="font-weight:800">${esc(k.name)}</div><div class="fine">${weekLabel(w)}</div></div></div><div class="owed">${money(bal)}</div></div>
      <div class="ledger" style="margin-top:10px">${rollup(entries).map(e => `<div class="l"><span>${e.type === 'chore' ? '🧹 ' : e.type === 'bonus' ? '⭐ ' : '⚠️ '}${esc(e.title || e.note || e.type)}${e.n > 1 ? ` <span class="fine">×${e.n}</span>` : ''}</span><span class="${e.amount < 0 ? 'neg' : ''}">${money(e.amount)}</span></div>`).join('')}
        ${pend > 0 ? `<div class="l"><span style="color:var(--muted)">⏳ Waiting on inspection</span><span style="color:var(--muted)">${money(pend)}</span></div>` : ''}
        <div class="l total"><span>This week</span><span>${money(weekEarned(w, k.id))}</span></div>
        ${S.ledger.filter(e => e.type === 'payout' && e.weekId === w.id && e.kidId === k.id).map(e => `<div class="l"><span class="fine">💵 Paid out ${new Date(e.at).toLocaleDateString(undefined, { weekday: 'short' })}</span><span class="fine">${money(e.amount)}</span></div>`).join('')}
        ${Math.abs(carried) > 0.001 ? `<div class="l"><span class="fine">Carried from earlier weeks</span><span class="fine">${money(carried)}</span></div>` : ''}</div>
      <div class="actions" style="display:flex;gap:8px;margin-top:12px"><button class="btn cash" data-act="pay" data-id="${k.id}" ${bal > 0 ? '' : 'disabled'}>💵 Paid ${money(Math.max(0, bal))}</button><button class="btn" data-act="adjust" data-id="${k.id}">± Bonus / deduction</button></div></div>`;
  }).join('');
  const past = S.weeks.filter(x => x.id !== w.id).slice().reverse();
  return `<div class="card gold"><h2>Payday</h2><p style="margin-top:4px;font-weight:700">Settle up however you like (cash, Venmo, Apple Cash), then tap Paid. The app is the wallet; it remembers what's owed.</p></div>${cards}
    ${past.length ? `<div class="section"><h2>Past weeks</h2></div><div class="list">${past.map(x => `<div class="item"><div class="body"><div class="t">${weekLabel(x)}</div><div class="s">Pot ${money(x.pot)} · ${kids().map(k => esc(k.name) + ' ' + money(weekEarned(x, k.id))).join(' · ')}</div></div></div>`).join('')}</div>` : ''}`;
}
function supFamily() {
  return `<div class="card"><div class="between"><h2>${esc(S.family.name) || 'Family'}</h2><button class="btn sm" data-act="edit-family">Edit</button></div>
    <div class="list" style="margin-top:12px">${S.people.map(p => `<div class="item"><div class="avatar sm ${p.role === 'sup' ? 'sup' : ''}">${p.emoji}</div><div class="body"><div class="t">${esc(p.name)}</div><div class="s">${p.role === 'sup' ? 'Grown-up' : 'Kid'}</div></div><button class="kebab" data-act="edit-person" data-id="${p.id}">⋯</button></div>`).join('')}</div>
    <div style="margin-top:12px"><button class="btn block" data-act="add-person">+ Add a person</button></div></div>
    <div class="card"><h2>Settings</h2><div class="list" style="margin-top:12px">
      <div class="item"><div class="body"><div class="t">Week starts on ${DAYS[S.family.weekStartDay]}</div><div class="s">Payday is ${paydayName()}. Unearned money disappears at the turn.</div></div></div>
      <div class="item"><div class="body"><div class="t">Claim limit: ${Number(S.family.claimCap) > 0 ? S.family.claimCap + ' at a time' : 'none'}</div><div class="s">Stops one kid from hoarding every chore. Assigned chores don't count.</div></div></div>
      <div class="item"><div class="body"><div class="t">Kids ${S.family.kidsSeeBoard ? 'see' : "don't see"} the leaderboard</div><div class="s">${S.family.kidsSeeBoard ? 'Rankings and earnings are visible all week.' : 'Only their own earnings, until you tell them.'}</div></div></div>
      <div class="item"><div class="body"><div class="t">Default pot: ${money(S.family.defaultPot)}</div><div class="s">Every new week starts here. Raising this week's pot is a one-time thing.</div></div></div></div>
    <div style="margin-top:12px"><button class="btn block" data-act="edit-family">Change settings</button></div></div>
    <div class="card"><h2>Backup</h2><p class="fine" style="margin-top:4px">Everything lives in this browser only. Copy a backup now and then. Clearing Safari data wipes it.</p>
      <div class="row2" style="margin-top:12px"><button class="btn" data-act="export">Copy backup</button><button class="btn" data-act="import">Restore</button></div>
      <div style="margin-top:10px"><button class="btn danger block" data-act="reset">Start over (erase everything)</button></div></div>
    <div class="footer">ChoreBlaster POC · Ribbescobb Labs</div>`;
}

/* ---------- sheets ---------- */
const sheetRoot = document.getElementById('sheet-root');
function openSheet(title, body, opts = {}) {
  sheetRoot.innerHTML = `<div class="sheet-wrap"><div class="sheet" role="dialog"><div class="head"><h2>${title}</h2><button class="close" data-close aria-label="Close">×</button></div><form id="sheet-form">${body}</form></div></div>`;
  ui.sheet = opts;
  const f = document.getElementById('sheet-form');
  f.addEventListener('submit', e => { e.preventDefault(); if (opts.onSubmit) opts.onSubmit(new FormData(f), f); });
  const first = f.querySelector('input[type=text],input[type=number],input[type=tel],textarea');
  if (first && !opts.noFocus) setTimeout(() => first.focus(), 50);
}
function closeSheet() { sheetRoot.innerHTML = ''; ui.sheet = null; }
function segField(name, val, options, label) {
  return `<div class="field"><label>${label}</label><div class="seg" data-seg="${name}">${options.map(([v, t]) => `<button type="button" class="${v === val ? 'on' : ''}" data-v="${v}">${t}</button>`).join('')}<input type="hidden" name="${name}" value="${val}"></div></div>`;
}
function kidSelect(name, val) {
  return `<div class="field"><label>Who can do it</label><select name="${name}"><option value="">Anyone (first to claim)</option>${kids().map(k => `<option value="${k.id}" ${k.id === val ? 'selected' : ''}>${k.emoji} ${esc(k.name)} only</option>`).join('')}</select></div>`;
}
function choreForm(c, extra) {
  return `<div class="field"><label>Chore</label><input type="text" name="title" value="${esc(c.title || '')}" placeholder="Mow the lawn" required autocomplete="off"></div>
    <div class="field"><label>Pays</label><div class="money-in"><input type="number" name="price" value="${c.price ?? ''}" min="0" step="0.25" inputmode="decimal" required></div></div>
    ${segField('mode', c.mode || 'honor', [['honor', '✓ Honor system'], ['inspect', '🔍 Needs inspection']], 'Payment')}
    <p class="fine" style="margin-top:-8px;margin-bottom:14px">Honor pays the moment they mark it done. Inspected waits for a grown-up to approve. You can undo either before payday.</p>
    ${kidSelect('assignedTo', c.assignedTo)}${extra || ''}`;
}
function readChore(fd) { return { title: fd.get('title').trim(), price: Math.max(0, Number(fd.get('price')) || 0), mode: fd.get('mode') || 'honor', assignedTo: fd.get('assignedTo') || null }; }
const freqField = (val) => segField('freq', val || 'weekly', [['weekly', '🔁 Once a week'], ['daily', '📅 Every day']], 'How often') + '<p class="fine" style="margin-top:-8px;margin-bottom:14px">Dailies pay that amount each day, show up one day at a time, and skip the claim step: first kid to mark it done gets it.</p>';

function sheetAddChore(prefill) {
  openSheet('Add a chore', choreForm(prefill || {}, segField('repeat', 'once', [['once', 'Just this week'], ['weekly', '🔁 Every week'], ['daily', '📅 Every day']], 'Repeats') + `<p class="fine" style="margin-top:-8px;margin-bottom:14px">Every week and every day become standing chores. Dailies pay per day, one day at a time, no claim step.</p><div class="foot"><button class="btn primary" type="submit">Add</button></div>`), {
    onSubmit(fd) {
      const d = readChore(fd); if (!d.title) return;
      const repeat = fd.get('repeat'); const w = week();
      let t = null, inst;
      if (repeat === 'once') inst = [Object.assign(instanceFrom({ id: null }), d, { templateId: null })];
      else { t = Object.assign({ id: uid(), archived: false, freq: repeat }, d); inst = instancesFrom(t, w, today()); }
      const after = allocated(w) + inst.reduce((s, x) => s + Number(x.price), 0);
      const add = () => { if (t) S.templates.push(t); w.chores.push(...inst); save(); closeSheet(); render(); toast('Added ' + d.title); };
      if (after > w.pot) sheetOverPot(w, after, add); else add();
    }
  });
}
function sheetOverPot(w, after, add) {
  const over = after - w.pot;
  openSheet('Over the pot', `<p>This week's pot is <b>${money(w.pot)}</b>. With this chore, the list adds up to <b>${money(after)}</b>, which is <b>${money(over)}</b> over.</p>
    <div class="stack" style="margin-top:16px"><button class="btn primary" type="button" data-choice="raise">Raise the pot to ${money(after)}</button><button class="btn" type="button" data-choice="anyway">Add it anyway</button><button class="btn ghost" type="button" data-close>Cancel</button></div>`, { noFocus: true });
  sheetRoot.querySelectorAll('[data-choice]').forEach(b => b.addEventListener('click', () => { if (b.dataset.choice === 'raise') w.pot = after; add(); }));
}
function sheetEditChore(c) {
  const t = c.templateId ? S.templates.find(t => t.id === c.templateId) : null;
  const cur = t ? (t.freq || 'weekly') : 'once';
  const extra = segField('repeat', cur, [['once', 'Just this week'], ['weekly', '🔁 Every week'], ['daily', '📅 Every day']], 'Repeats')
    + `<p class="fine" style="margin-top:-8px;margin-bottom:14px">${t ? 'Switching to "just this week" retires the standing chore and keeps this one.' : 'Every week and every day turn this into a standing chore.'} Dailies pay per day, one day at a time, no claim step.</p>`
    + (t ? `<label class="check"><input type="checkbox" name="sync"> Also update the standing chore${c.day ? ' (and the other days this week)' : ' for future weeks'}</label>` : '')
    + `<div class="foot"><button class="btn danger" type="button" data-act="delete-chore" data-id="${c.id}">Remove</button><button class="btn primary" type="submit">Save</button></div>`;
  openSheet('Edit chore', choreForm(c, extra), {
    onSubmit(fd) {
      const d = readChore(fd); if (!d.title) return;
      const rep = fd.get('repeat') || cur; const w = week();
      Object.assign(c, d);
      if (t && fd.get('sync')) { Object.assign(t, d); w.chores.forEach(x => { if (x.templateId === t.id && x.state === 'open' && x !== c) Object.assign(x, d); }); }
      if (rep !== cur) {
        const dropOpenSiblings = id => { w.chores = w.chores.filter(x => x === c || x.templateId !== id || x.state !== 'open'); };
        if (rep === 'once') {
          if (t) { t.archived = true; dropOpenSiblings(t.id); }
          c.templateId = null; c.day = null; c.freq = 'weekly';
        } else {
          let nt = t;
          if (!nt) { nt = Object.assign({ id: uid(), archived: false }, d); S.templates.push(nt); c.templateId = nt.id; }
          else Object.assign(nt, d);
          nt.freq = rep; dropOpenSiblings(nt.id);
          if (rep === 'daily') { c.freq = 'daily'; c.day = c.day || today(); w.chores.push(...instancesFrom(nt, w, addDays(today(), 1))); }
          else { c.freq = 'weekly'; c.day = null; }
        }
      }
      if (c.state === 'approved') { const e = S.ledger.find(e => e.type === 'chore' && e.choreId === c.id); if (e) { e.amount = d.price; e.title = d.title; } }
      save(); closeSheet(); render();
    }
  });
}
function sheetTemplate(t) {
  const isNew = !t; t = t || {};
  openSheet(isNew ? 'New standing chore' : 'Edit standing chore', choreForm(t, freqField(t.freq) + `${isNew ? '<label class="check"><input type="checkbox" name="now" checked> Also add it to this week</label>' : ''}<div class="foot">${isNew ? '' : `<button class="btn danger" type="button" data-act="archive-template" data-id="${t.id}">Retire</button>`}<button class="btn primary" type="submit">${isNew ? 'Add' : 'Save'}</button></div>`), {
    onSubmit(fd) {
      const d = readChore(fd); if (!d.title) return;
      d.freq = fd.get('freq') || 'weekly';
      if (isNew) { const nt = Object.assign({ id: uid(), archived: false }, d); S.templates.push(nt); if (fd.get('now')) week().chores.push(...instancesFrom(nt, week(), today())); }
      else { Object.assign(t, d); week().chores.forEach(c => { if (c.templateId === t.id && c.state === 'open') Object.assign(c, { title: d.title, price: d.price, mode: d.mode, assignedTo: d.assignedTo }); }); }
      save(); closeSheet(); render();
    }
  });
}
function sheetPot() {
  const w = week();
  openSheet("This week's pot", `<div class="field"><label>Pot</label><div class="money-in"><input type="number" name="pot" value="${w.pot}" min="0" step="1" inputmode="decimal" required></div><div class="hint">Chores add up to ${money(allocated(w))} right now.</div></div><div class="foot"><button class="btn primary" type="submit">Save</button></div>`, {
    onSubmit(fd) { w.pot = Math.max(0, Number(fd.get('pot')) || 0); save(); closeSheet(); render(); }
  });
}
function sheetReject(c) {
  openSheet('Send it back', `<p>Tell ${esc(person(c.claimedBy)?.name || 'them')} what's missing on <b>${esc(c.title)}</b>.</p><div class="field" style="margin-top:12px"><label>Note</label><textarea name="note" placeholder="Under the couch too, please."></textarea></div><div class="foot"><button class="btn danger" type="submit">Send back</button></div>`, {
    onSubmit(fd) { reject(c, fd.get('note').trim()); closeSheet(); }
  });
}
function sheetAdjust(k) {
  openSheet('Bonus or deduction', `<p>For <b>${k.emoji} ${esc(k.name)}</b></p>${segField('type', 'bonus', [['bonus', '⭐ Bonus'], ['deduction', '⚠️ Deduction']], 'Type')}
    <div class="field"><label>Amount</label><div class="money-in"><input type="number" name="amount" min="0" step="0.25" inputmode="decimal" required></div></div>
    <div class="field"><label>For</label><input type="text" name="note" placeholder="Helped with groceries" required autocomplete="off"></div><div class="foot"><button class="btn primary" type="submit">Add</button></div>`, {
    onSubmit(fd) {
      const amt = Math.abs(Number(fd.get('amount')) || 0); if (!amt) return;
      const type = fd.get('type');
      S.ledger.push({ id: uid(), type, weekId: week().id, kidId: k.id, amount: type === 'deduction' ? -amt : amt, note: fd.get('note').trim(), at: Date.now(), by: session.userId });
      save(); closeSheet(); render();
    }
  });
}
function sheetPerson(p) {
  const isNew = !p; p = p || { role: 'kid', emoji: EMOJIS[kids().length % EMOJIS.length] };
  const pool = p.role === 'sup' ? SUP_EMOJIS : EMOJIS;
  openSheet(isNew ? 'Add a person' : 'Edit ' + esc(p.name), `<div class="field"><label>Name</label><input type="text" name="name" value="${esc(p.name || '')}" required autocomplete="off"></div>
    ${segField('role', p.role, [['kid', 'Kid'], ['sup', '🔒 Grown-up']], 'Role')}
    <div class="field"><label>PIN (grown-ups only)</label><input type="tel" name="pin" value="${esc(p.pin || '')}" inputmode="numeric" maxlength="4" placeholder="4 digits" autocomplete="off"></div>
    <div class="field"><label>Avatar</label><div class="emoji-pick" data-emoji>${[...new Set([...pool, ...SUP_EMOJIS, ...EMOJIS])].map(e => `<button type="button" class="${e === p.emoji ? 'on' : ''}" data-e="${e}">${e}</button>`).join('')}<input type="hidden" name="emoji" value="${p.emoji}"></div></div>
    <div class="foot">${isNew ? '' : `<button class="btn danger" type="button" data-act="remove-person" data-id="${p.id}">Remove</button>`}<button class="btn primary" type="submit">${isNew ? 'Add' : 'Save'}</button></div>`, {
    onSubmit(fd) {
      const d = { name: fd.get('name').trim(), role: fd.get('role'), emoji: fd.get('emoji'), pin: (fd.get('pin') || '').replace(/\D/g, '').slice(0, 4) };
      if (!d.name) return;
      if (d.role === 'sup' && d.pin.length !== 4) return toast('Grown-ups need a 4-digit PIN.');
      if (isNew) S.people.push(Object.assign({ id: uid() }, d)); else Object.assign(p, d);
      save(); closeSheet(); render();
    }
  });
}
function sheetFamily() {
  const f = S.family;
  openSheet('Family settings', `<div class="field"><label>Family name</label><input type="text" name="name" value="${esc(f.name)}" autocomplete="off"></div>
    <div class="field"><label>Default pot for new weeks</label><div class="money-in"><input type="number" name="defaultPot" value="${f.defaultPot}" min="0" step="1" inputmode="decimal"></div></div>
    <div class="field"><label>Week starts on</label><select name="weekStartDay">${DAYS.map((d, i) => `<option value="${i}" ${i === f.weekStartDay ? 'selected' : ''}>${d} (payday ${DAYS[(i + 6) % 7]})</option>`).join('')}</select></div>
    <div class="field"><label>Claim limit per kid</label><select name="claimCap">${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}" ${n === Number(f.claimCap) ? 'selected' : ''}>${n === 0 ? 'No limit' : n + ' at a time'}</option>`).join('')}</select></div>
    ${segField('kidsSeeBoard', f.kidsSeeBoard ? '1' : '0', [['1', 'Kids see leaderboard'], ['0', 'Only at payday']], 'Leaderboard')}
    <div class="foot"><button class="btn primary" type="submit">Save</button></div>`, {
    onSubmit(fd) {
      f.name = fd.get('name').trim(); f.defaultPot = Math.max(0, Number(fd.get('defaultPot')) || 0);
      f.weekStartDay = Number(fd.get('weekStartDay')); f.claimCap = Number(fd.get('claimCap')); f.kidsSeeBoard = fd.get('kidsSeeBoard') === '1';
      save(); closeSheet(); render();
    }
  });
}
function sheetPin(p) {
  let entered = '';
  const draw = () => { sheetRoot.querySelector('.pin').innerHTML = [0, 1, 2, 3].map(i => `<i class="${i < entered.length ? 'on' : ''}"></i>`).join(''); };
  openSheet(`${p.emoji} ${esc(p.name)}`, `<p style="text-align:center" class="fine">Enter your PIN</p><div class="pin"></div><div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button type="button" data-k="${n}">${n}</button>`).join('')}<button type="button" class="mute" data-close>Cancel</button><button type="button" data-k="0">0</button><button type="button" class="mute" data-k="del">⌫</button></div>`, { noFocus: true });
  draw();
  sheetRoot.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.k;
    if (k === 'del') entered = entered.slice(0, -1); else if (entered.length < 4) entered += k;
    draw();
    if (entered.length === 4) {
      if (entered === p.pin) { closeSheet(); signIn(p.id); }
      else { const el = sheetRoot.querySelector('.sheet'); el.classList.add('shake'); setTimeout(() => { el.classList.remove('shake'); entered = ''; draw(); }, 400); }
    }
  }));
}
function sheetConfirm(title, text, label, fn, danger) {
  openSheet(title, `<p>${text}</p><div class="foot"><button class="btn ghost" type="button" data-close>Cancel</button><button class="btn ${danger ? 'danger' : 'primary'}" type="submit">${label}</button></div>`, { noFocus: true, onSubmit() { closeSheet(); fn(); } });
}
function sheetImport() {
  openSheet('Restore a backup', `<div class="field"><label>Paste backup</label><textarea name="data" placeholder='{"version":1,...}'></textarea><div class="hint">This replaces everything currently here.</div></div><div class="foot"><button class="btn danger" type="submit">Replace and restore</button></div>`, {
    onSubmit(fd) {
      try { const d = JSON.parse(fd.get('data')); if (!d || !Array.isArray(d.people)) throw 0; S = Object.assign(blank(), d); save(); session = {}; saveSession(); closeSheet(); render(); toast('Restored.'); }
      catch (e) { toast("That doesn't look like a ChoreBlaster backup."); }
    }
  });
}

/* ---------- setup submit & demo ---------- */
function submitSetup(form) {
  const fd = new FormData(form);
  const fam = blank();
  fam.family.name = (fd.get('family') || '').trim(); fam.family.defaultPot = Math.max(0, Number(fd.get('pot')) || 0);
  const emos = form.querySelectorAll('.emo');
  for (let i = 0; i < ui.setupSups; i++) {
    const name = (fd.get('sup-name-' + i) || '').trim(); const pin = (fd.get('sup-pin-' + i) || '').replace(/\D/g, '');
    if (!name) continue; if (pin.length !== 4) return toast(name + ' needs a 4-digit PIN.');
    fam.people.push({ id: uid(), name, role: 'sup', pin, emoji: emos[i].textContent });
  }
  for (let i = 0; i < ui.setupKids; i++) { const name = (fd.get('kid-name-' + i) || '').trim(); if (name) fam.people.push({ id: uid(), name, role: 'kid', emoji: emos[ui.setupSups + i].textContent }); }
  if (!fam.people.some(p => p.role === 'sup')) return toast('Add at least one grown-up with a PIN.');
  if (!fam.people.some(p => p.role === 'kid')) return toast('Add at least one kid.');
  STARTERS.forEach(([title, price, mode, freq], i) => { if (fd.get('st-' + i)) fam.templates.push({ id: uid(), title, price, mode, freq, assignedTo: null, archived: false }); });
  S = fam; save(); ensureWeek(); render(); toast('Welcome, ' + (fam.family.name || 'family') + '!');
}
function loadDemo() {
  const fam = blank(); fam.family.name = 'The Blasters'; fam.family.demo = true;
  const mom = { id: uid(), name: 'Mom', role: 'sup', pin: '1234', emoji: '👩' }, dad = { id: uid(), name: 'Dad', role: 'sup', pin: '1234', emoji: '👨' };
  const ava = { id: uid(), name: 'Ava', role: 'kid', emoji: '🦊' }, max = { id: uid(), name: 'Max', role: 'kid', emoji: '🦖' };
  fam.people = [mom, dad, ava, max];
  const T = (title, price, mode, freq, assignedTo) => ({ id: uid(), title, price, mode, freq, assignedTo: assignedTo || null, archived: false });
  fam.templates = [T('Empty the dishwasher', 1, 'honor', 'daily'), T('Feed the dog', 1, 'honor', 'daily', max.id), T('Take out the trash', 2, 'honor', 'weekly'), T('Clean your room', 5, 'inspect', 'weekly'), T('Vacuum the living room', 4, 'inspect', 'weekly'), T('Fold a load of laundry', 4, 'inspect', 'weekly'), T('Mow the lawn', 12, 'inspect', 'weekly'), T('Wipe down the bathroom', 6, 'inspect', 'weekly'), T('Water the plants', 2, 'honor', 'weekly')];
  S = fam; save(); const w = ensureWeek();
  const by = (t) => w.chores.find(c => c.title === t && (!c.day || c.day === today()));
  const c1 = by('Empty the dishwasher'); c1.state = 'approved'; c1.claimedBy = ava.id; S.ledger.push({ id: uid(), type: 'chore', choreId: c1.id, weekId: w.id, kidId: ava.id, amount: 1, title: c1.title, at: Date.now() });
  const y = addDays(today(), -1); if (y >= w.start) w.chores.filter(c => c.day === y).forEach(c => { c.state = 'approved'; c.claimedBy = c.assignedTo || ava.id; S.ledger.push({ id: uid(), type: 'chore', choreId: c.id, weekId: w.id, kidId: c.claimedBy, amount: Number(c.price), title: c.title, at: Date.now() - 86400000 }); });
  const c2 = by('Vacuum the living room'); c2.state = 'done'; c2.claimedBy = max.id;
  const c3 = by('Mow the lawn'); c3.state = 'claimed'; c3.claimedBy = ava.id;
  const c4 = by('Take out the trash'); c4.state = 'approved'; c4.claimedBy = max.id; S.ledger.push({ id: uid(), type: 'chore', choreId: c4.id, weekId: w.id, kidId: max.id, amount: 2, title: c4.title, at: Date.now() });
  w.chores.push({ id: uid(), templateId: null, title: 'Help carry in groceries', price: 2, mode: 'honor', assignedTo: null, state: 'open', claimedBy: null, note: '' });
  save(); render(); toast('Demo loaded. Grown-up PIN is 1234.');
}

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const seg = e.target.closest('[data-seg] button');
  if (seg) { const wrap = seg.closest('[data-seg]'); wrap.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === seg)); wrap.querySelector('input').value = seg.dataset.v; return; }
  const emo = e.target.closest('[data-emoji] button');
  if (emo) { const wrap = emo.closest('[data-emoji]'); wrap.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === emo)); wrap.querySelector('input').value = emo.dataset.e; return; }
  if (e.target.classList.contains('sheet-wrap') || e.target.closest('[data-close]')) { closeSheet(); return; }
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act, id = el.dataset.id;
  const w = week(); const c = w.chores.find(x => x.id === id);
  touch();
  switch (act) {
    case 'pick': { const p = person(id); if (p.role === 'sup') sheetPin(p); else signIn(p.id); break; }
    case 'signout': signOut(); break;
    case 'tab': ui.tab = el.dataset.tab; render(); break;
    case 'claim': if (c) claim(c); break;
    case 'unclaim': if (c) unclaim(c); break;
    case 'done': if (c) markDone(c); break;
    case 'approve': if (c) { approve(c, session.userId); toast('Approved ' + money(c.price) + ' for ' + person(c.claimedBy)?.name); } break;
    case 'reject': if (c) sheetReject(c); break;
    case 'undo': if (c) undoApprove(c); break;
    case 'release': if (c) { unclaim(c); toast('Released.'); } break;
    case 'edit-chore': if (c) sheetEditChore(c); break;
    case 'delete-chore': if (c) sheetConfirm('Remove chore?', `<b>${esc(c.title)}</b> comes off this week's list.${c.state === 'approved' ? ' Its payment will be removed too.' : ''}`, 'Remove', () => { if (c.state === 'approved') S.ledger = S.ledger.filter(e => !(e.type === 'chore' && e.choreId === c.id)); w.chores = w.chores.filter(x => x.id !== id); save(); render(); }, true); break;
    case 'add-chore': sheetAddChore(); break;
    case 'edit-pot': sheetPot(); break;
    case 'add-template': sheetTemplate(null); break;
    case 'edit-template': sheetTemplate(S.templates.find(t => t.id === id)); break;
    case 'archive-template': { const t = S.templates.find(t => t.id === id); sheetConfirm('Retire standing chore?', `<b>${esc(t.title)}</b> stops showing up in new weeks. This week is untouched.`, 'Retire', () => { t.archived = true; save(); render(); }, true); break; }
    case 'template-to-week': { const t = S.templates.find(t => t.id === id); const inst = instancesFrom(t, w, today()).filter(x => !w.chores.some(c => c.templateId === t.id && c.day === x.day)); const after = allocated(w) + inst.reduce((s, x) => s + Number(x.price), 0); const add = () => { w.chores.push(...inst); save(); closeSheet(); render(); }; if (after > w.pot) sheetOverPot(w, after, add); else add(); break; }
    case 'pay': { const k = person(id); sheetConfirm('Mark as paid?', `You've handed <b>${esc(k.name)}</b> <b>${money(balance(k.id))}</b>. Their wallet goes back to zero.`, 'Yes, paid', () => payout(k.id)); break; }
    case 'adjust': sheetAdjust(person(id)); break;
    case 'add-person': sheetPerson(null); break;
    case 'edit-person': sheetPerson(person(id)); break;
    case 'remove-person': { const p = person(id); if (p.role === 'sup' && sups().length === 1) return toast('Keep at least one grown-up.'); sheetConfirm('Remove ' + esc(p.name) + '?', 'Their chores and money history stay in the records.', 'Remove', () => { S.people = S.people.filter(x => x.id !== id); save(); render(); }, true); break; }
    case 'edit-family': sheetFamily(); break;
    case 'export': navigator.clipboard?.writeText(JSON.stringify(S)).then(() => toast('Backup copied. Paste it somewhere safe.'), () => prompt('Copy this:', JSON.stringify(S))); break;
    case 'import': sheetImport(); break;
    case 'reset': sheetConfirm('Erase everything?', 'Family, chores, and all money history on this device. There is no undo.', 'Erase it all', () => { localStorage.removeItem(KEY); localStorage.removeItem(SESSION_KEY); S = blank(); session = {}; render(); }, true); break;
    case 'more-sups': ui.setupSups++; render(); break;
    case 'more-kids': ui.setupKids++; render(); break;
    case 'cycle-emoji': { const pool = el.dataset.kind === 'sup' ? SUP_EMOJIS : EMOJIS; const i = pool.indexOf(el.textContent); el.textContent = pool[(i + 1) % pool.length]; break; }
    case 'demo': loadDemo(); break;
    case 'leave-demo': sheetConfirm('Leave the demo?', 'The demo family and its pretend money go away. You start fresh with your own family.', 'Leave demo', () => { localStorage.removeItem(KEY); localStorage.removeItem(SESSION_KEY); S = blank(); session = {}; ui.setupSups = 2; ui.setupKids = 2; render(); }, true); break;
  }
});
document.addEventListener('submit', e => { if (e.target.id === 'setup') { e.preventDefault(); submitSetup(e.target); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && ui.sheet) closeSheet(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) { S = load(); render(); } });

/* ---------- feedback ---------- */
let toastTimer;
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200); }
function pop(text) { const el = document.createElement('div'); el.className = 'pop'; el.textContent = text; document.body.appendChild(el); setTimeout(() => el.remove(), 1000); }

render();
})();
