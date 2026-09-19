"use strict";

/* Resolve a noun phrase against scope. Returns {kind,id} | {amb:[...]} | null */
function nounScope(){
  const scope = [];
  const loc = S.loc;
  for(const id of itemsAt(loc)) scope.push({kind:"item", id});
  for(const id of S.inv) scope.push({kind:"item", id});
  for(const id of charsAt(loc)) scope.push({kind:"char", id});
  const sc = here().scenery || [];
  for(const id of sc) scope.push({kind:"scenery", id});
  return scope;
}
function wordsMatch(words, names){
  // every input word must appear in some name's word list; score = matched name specificity
  let best = 0;
  for(const nm of names){
    const nw = nm.toLowerCase().split(" ");
    if(words.every(w=>nw.includes(w))) best = Math.max(best, words.length===nw.length?3:2);
  }
  if(best===0 && words.length===1){
    for(const nm of names){ if(nm.toLowerCase().split(" ").includes(words[0])) best=Math.max(best,1); }
  }
  return best;
}
function namesFor(kind,id){
  if(kind==="char") return [CHARS[id].name, ...(CHARS[id].alias||[])];
  if(kind==="item") return [ITEMS[id].name, ...(ITEMS[id].alias||[])];
  return [SCENERY[id].name, ...(SCENERY[id].alias||[])];
}
function resolveNoun(phrase, opts){
  opts = opts||{};
  const words = phrase.split(" ").filter(w=>!FILLER.has(w));
  if(!words.length) return null;
  if(words.length===1 && (words[0]==="me"||words[0]==="myself"||words[0]==="self"||words[0]==="nicole"))
    return {kind:"self", id:"self"};
  if(words.length===1 && (words[0]==="it"||words[0]==="him"||words[0]==="her"||words[0]==="them") && S.pronoun)
    return S.pronoun;
  const cands = [];
  for(const c of nounScope()){
    const sc = wordsMatch(words, namesFor(c.kind,c.id));
    if(sc>0) cands.push({...c, sc});
  }
  if(opts.invOnly){
    const inv = cands.filter(c=>c.kind==="item" && has(c.id));
    if(inv.length) return pickBest(inv);
  }
  if(!cands.length){
    // known word anywhere in the game? -> "not here"
    for(const id in ITEMS){ if(wordsMatch(words,namesFor("item",id))) return {kind:"absent", id}; }
    for(const id in CHARS){ if(wordsMatch(words,namesFor("char",id))) return {kind:"absentchar", id}; }
    for(const id in SCENERY){ if(wordsMatch(words,namesFor("scenery",id))) return {kind:"absent", id}; }
    return {kind:"unknown", phrase:words.join(" ")};
  }
  return pickBest(cands);
}
function pickBest(cands){
  const top = Math.max(...cands.map(c=>c.sc));
  const best = cands.filter(c=>c.sc===top);
  const uniq = []; const seen = new Set();
  for(const b of best){ const k=b.kind+":"+b.id; if(!seen.has(k)){seen.add(k);uniq.push(b);} }
  if(uniq.length===1) return uniq[0];
  return {amb:uniq};
}
function articleName(name, definite){
  if(/^[A-Z]|['’]s\b|^the\s/.test(name)) return name;
  return (definite?"the ":(/^[aeiou]/i.test(name)?"an ":"a "))+name;
}
function theName(r){
  if(r.kind==="char") return CHARS[r.id].name;
  if(r.kind==="item") return articleName(ITEMS[r.id].name,true);
  if(r.kind==="scenery") return articleName(SCENERY[r.id].name,true);
  return "that";
}
