"use strict";

/* ---------- execution of resolved commands ---------- */
function handlerFor(r, verb){
  if(!r) return null;
  let def=null;
  if(r.kind==="item") def=ITEMS[r.id];
  else if(r.kind==="scenery") def=SCENERY[r.id];
  else if(r.kind==="char") def=CHARS[r.id];
  if(def && def.on && def.on[verb]!==undefined) return def.on[verb];
  return null;
}
function runH(h, r, obj2){
  if(typeof h==="function") return h(r,obj2);
  out(h); return endTurn();
}
function needObj(r, verbLabel){
  if(!r){ outSys(cap(verbLabel)+" what?"); return true; }
  if(r.kind==="unknown"){ outSys("Nicole doesn't see any \""+r.phrase+"\" — perhaps another word for it?"); return true; }
  if(r.kind==="absentchar"){ outSys(CHARS[r.id].name+" isn't here."); return true; }
  if(r.kind==="absent"){ const nm=ITEMS[r.id]?ITEMS[r.id].name:(SCENERY[r.id]?SCENERY[r.id].name:"thing"); outSys("The "+nm+" isn't here."); return true; }
  return false;
}
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

function execute(verb, obj, obj2, prep, firstText){
  // room-level interceptor (puzzle scenes)
  const rm = here();
  if(rm.onCmd && rm.onCmd(verb,obj,obj2,prep)===true) return;

  switch(verb){
    case "look": return doLook(true);
    case "examine": return doExamine(obj);
    case "inventory": return doInventory();
    case "take": case "take_item": return doTake(obj);
    case "drop": return doDrop(obj);
    case "open": return doGenericOn(verb,obj,"open");
    case "close": return doGenericOn(verb,obj,"close");
    case "push": return doGenericOn(verb,obj,"push");
    case "pull": return doGenericOn(verb,obj,"pull");
    case "turn": return doGenericOn(verb,obj,"turn");
    case "put": return doGenericOn(verb,obj,"put",obj2);
    case "touch": return doGenericOn(verb,obj,"touch");
    case "read": return doRead(obj);
    case "use": return doUse(obj,obj2);
    case "search": return doGenericOn(verb,obj,"search");
    case "tie": return doGenericOn(verb,obj,"tie",obj2);
    case "untie": return doGenericOn(verb,obj,"untie");
    case "throw": return doGenericOn(verb,obj,"throw",obj2);
    case "knock": return doGenericOn(verb,obj,"knock");
    case "wave": return doGenericOn(verb,obj,"wave");
    case "light": return doGenericOn(verb,obj,"light");
    case "photograph": return doPhotograph(obj);
    case "scan": return doScan(obj);
    case "treat": return doTreat(obj);
    case "drink": return doDrink(obj);
    case "eat": return doEat(obj);
    case "wear": case "remove": outSys("Nicole's suit and thermals stay where they are; the checklist was drilled into all of them."); return;
    case "talk": return doTalk(obj);
    case "kiss": return doKiss(obj);
    case "listen": return doListen(obj);
    case "smell": return doSmell(obj);
    case "sleep": return doSleep();
    case "shout": return doShout();
    case "sing": return doSing();
    case "jump": out("She keeps her feet on the deck. The Coriolis drift here punishes theatrics."); return endTurn();
    case "sit": return doSit(obj);
    case "stand": outSys("She is standing."); return;
    case "wait": return doWait();
    case "think": return doThink();
    case "log": return doLog();
    case "help": return doHelp();
    case "hint": return doHint();
    case "about": return doAbout();
    case "save": return doSave(true);
    case "load": return doLoad();
    case "restart": return doRestartAsk();
    case "verbose": S.verbose=true; outSys("Full descriptions on every visit."); return;
    case "brief": S.verbose=false; outSys("Brief descriptions for revisited places."); return;
    case "transcript": return doTranscript();
    case "score": outSys("Rama does not keep score. What Nicole has learned, and whom she has kept, is the measure."); return;
    case "say": outSys("Say it to someone: TALK TO a person, or ASK them ABOUT a topic."); return;
    case "operate_surgery": case "operate": case "evacuate":
      if(S.phase==="borzov_decide") outSys("The patient is on the table in the medical hut at Camp Alpha. Decide there, at his side.");
      else outSys("No one requires that of Nicole just now.");
      return;
    case "honestly": case "curated": case "refuse":
      outSys("There is no question on the floor just now."); return;
    case "sickest": case "children": case "lottery":
      outSys("No allocation is pending."); return;
    case "sample": {
      if(!has("sampler")){ outSys("The sample probe isn't with her."); return; }
      const sh=handlerFor({kind:"item",id:"sampler"},"use");
      if(sh!==null) return runH(sh,{kind:"item",id:"sampler"},obj);
      outSys("The probe declines the assignment."); return;
    }
    case "follow": {
      if(!obj){ outSys("Follow whom?"); return; }
      if(obj.kind==="char"){ out("She falls in beside "+CHARS[obj.id].name+", matching stride. Wherever they're going, they're going together."); return endTurn(); }
      if(obj.kind==="absentchar"){ outSys(CHARS[obj.id].name+" isn't here."); return; }
      if(obj.kind==="scenery"&&(obj.id==="biot")){ out("She paces the procession along the polished track — south, always south, toward the sea — until their tireless economy outwalks hers. Whatever errand the biots keep, it does not include company."); return endTurn(); }
      out("It isn't going anywhere she can follow."); return endTurn();
    }
    case "curse":
      out("Nicole permits herself the word — once, quietly, in her father's French. The universe declines to apologize, and she feels marginally better anyway.");
      return endTurn();
    case "enterThing": {
      const h = handlerFor(obj,"enter"); if(h!==null) return runH(h,obj);
      outSys("She can't get inside that."); return;
    }
    default:
      outSys("Nicole isn't sure how to do that here.");
  }
}

/* ---------- core verbs ---------- */
function doLook(force){
  const rm = here();
  outTitle(rm.name);
  const first = !S.visited[S.loc];
  if(first || S.verbose || force){
    out(typeof rm.desc==="function"?rm.desc():rm.desc);
  } else {
    out(rm.brief || (typeof rm.desc==="function"?rm.desc():rm.desc));
  }
  const its = itemsAt(S.loc).filter(i=>!ITEMS[i].hidden);
  if(its.length) out(its.map(i=>val(ITEMS[i].here)||("There is "+aName(i)+" here.")).join(" "));
  const cs = charsAt(S.loc);
  if(cs.length) out(cs.map(c=>{const h=CHARS[c].here;const v=typeof h==="function"?h():h;return v||(CHARS[c].name+" is here.");}).join(" "));
  const ex = exitsOf(rm);
  if(ex.length) outSys("Exits: "+ex.join(", ")+".");
  S.visited[S.loc]=true;
  if(force) endTurn(true);
}
function aName(i){ const n=ITEMS[i].name; return (/^[aeiou]/i.test(n)?"an ":"a ")+n; }
function exitsOf(rm){
  const ex=[];
  for(const d in (rm.exits||{})){
    const e = rm.exits[d];
    if(typeof e==="object" && e.hidden && e.hidden()) continue;
    ex.push(d);
  }
  return ex;
}
function doGo(dir){
  if(S.act===4){ out("Directions have stopped meaning. There is only here, and the light, and the Eagle, and one question."); return endTurn(); }
  const rm = here();
  if(rm.onGo && rm.onGo(dir)===true) return;
  let e = (rm.exits||{})[dir];
  if(e && typeof e==="object" && e.hidden && e.hidden()) e=null;
  if(!e){ outSys(rm.noExit || "She can't go that way."); return; }
  let dest = e, msg=null;
  if(typeof e==="object"){
    if(e.blocked){ const b = typeof e.blocked==="function"?e.blocked():e.blocked; if(b){ out(b); return endTurn(); } }
    dest = e.to; msg = e.msg;
  }
  if(msg) out(msg);
  moveTo(dest);
}
function moveTo(dest){
  if(!WORLD[dest]){ if(typeof console!=="undefined") console.error("moveTo: unknown room "+dest); return; }
  S.loc = dest; S.pronoun=null;
  const rm = here();
  if(rm.onEnter && rm.onEnter()===true){ S.visited[dest]=true; return; }
  doLook(false);
  S.visited[dest]=true;
  endTurn(true);
}
function doExamine(r){
  if(!r){ return doLook(true); }
  if(r.kind==="self"){
    out(selfDesc());
    return endTurn();
  }
  if(needObj(r,"examine")) return;
  S.pronoun = r;
  const h = handlerFor(r,"examine");
  if(h!==null) return runH(h,r);
  if(r.kind==="char"){ out(val(CHARS[r.id].desc)); return endTurn(); }
  if(r.kind==="item"){ out(val(ITEMS[r.id].desc)); return endTurn(); }
  out(val(SCENERY[r.id].desc)); return endTurn();
}
function doInventory(){
  if(S.act===4) return postludeInventory();
  if(!S.inv.length){ out("Nicole's hands are empty."); return endTurn(); }
  out("Nicole is carrying: "+S.inv.map(i=>ITEMS[i].name).join("; ")+".");
  return endTurn();
}
function doTake(r){
  if(needObj(r,"take")) return;
  if(r.kind==="char"){ outSys(CHARS[r.id].name+" would object."); return; }
  const h = handlerFor(r,"take");
  if(h!==null) return runH(h,r);
  if(r.kind==="scenery"){ out(SCENERY[r.id].takeFail || "It is part of Rama, or as good as. It stays."); return endTurn(); }
  const it = ITEMS[r.id];
  if(has(r.id)){ outSys("She already has it."); return; }
  if(it.fixed){ out(it.takeFail||"It won't come free."); return endTurn(); }
  it.loc="inv"; take(r.id);
  out("Taken.");
  return endTurn();
}
function doDrop(r){
  if(needObj(r,"drop")) return;
  if(r.kind!=="item"||!has(r.id)){ outSys("She isn't carrying that."); return; }
  lose(r.id); ITEMS[r.id].loc=S.loc;
  out("She sets down the "+ITEMS[r.id].name+".");
  return endTurn();
}
function doGenericOn(verb,r,key,obj2){
  if(needObj(r,verb)) return;
  const h = handlerFor(r,key);
  if(h!==null) return runH(h,r,obj2);
  const canned = {
    open:"It doesn't open — not for hands, anyway.",
    close:"There's nothing to close.",
    push:"She pushes. Rama, as usual, declines to notice.",
    pull:"It doesn't yield.",
    turn:"It doesn't turn.",
    touch:"Cool, smoother than it looks. Whatever made this did not worry about fingerprints.",
    search:"A careful search turns up nothing new.",
    tie:"There's no sensible way to tie that.",
    untie:"It isn't tied.",
    put:"There's no call to put that anywhere in particular; Rama provides its own arrangements.",
    throw:"She weighs it in her hand and thinks better of it. Equipment is life out here.",
    knock:"She raps it. A flat, strange sound, quickly swallowed.",
    wave:"She waves. Nothing waves back.",
    light:"She has no separate light; her suit lamp is already doing what it can."
  };
  out(canned[key]||"Nothing happens.");
  return endTurn();
}
function doRead(r){
  if(needObj(r,"read")) return;
  const h = handlerFor(r,"read")||handlerFor(r,"examine");
  if(h!==null) return runH(h,r);
  out("There is nothing written on it. Rama does not label things for visitors.");
  return endTurn();
}
function doUse(r,r2){
  if(needObj(r,"use")) return;
  if(r.kind==="item"&&has(r.id)){
    if(r.id==="medscan") return doScan(r2&&r2.kind!=="unknown"?r2:{kind:"self",id:"self"});
    if(r.id==="medkit")  return doTreat(r2&&r2.kind!=="unknown"?r2:{kind:"self",id:"self"});
    if(r.id==="camera")  return doPhotograph(r2&&r2.kind!=="unknown"?r2:null);
  }
  const h = handlerFor(r,"use");
  if(h!==null) return runH(h,r,r2);
  outSys("Try a more specific verb — OPEN, PUSH, SCAN, TIE, that sort of thing.");
}
function doPhotograph(r){
  if(!has("camera")){ outSys("Her camera is not with her."); return; }
  if(!r){ out("She frames the scene and shoots. Another few gigabytes for the archive nobody on Earth will believe."); return endTurn(); }
  if(needObj(r,"photograph")) return;
  const h = handlerFor(r,"photograph");
  if(h!==null) return runH(h,r);
  out("Captured. The image looks smaller than the thing itself. They always do, in here.");
  return endTurn();
}
function doScan(r){
  if(!has("medscan")){ outSys("The medical scanner isn't with her."); return; }
  if(!r||r.kind==="self"){
    const sr = selfScan();
    if(typeof sr==="string"){ out(sr); return endTurn(); }
    return sr;
  }
  if(r.kind==="unknown"||r.kind==="absent"||r.kind==="absentchar"){ needObj(r,"scan"); return; }
  const h = handlerFor(r,"scan");
  if(h!==null) return runH(h,r);
  if(r.kind==="char"){ out("The scanner reads "+CHARS[r.id].name+": vitals nominal, allowing for the circumstances."); return endTurn(); }
  out("The scanner is built for tissue, not for this. It reports, apologetically, an error.");
  return endTurn();
}
function doTreat(r){
  if(!r||r.kind==="self") { return treatSelf(); }
  if(r.kind==="unknown"||r.kind==="absent"||r.kind==="absentchar"){ needObj(r,"treat"); return; }
  const h = handlerFor(r,"treat");
  if(h!==null) return runH(h,r);
  if(r.kind==="char"){ out(CHARS[r.id].name+" doesn't need her medical attention just now."); return endTurn(); }
  outSys("Treat whom?");
}
function doDrink(r){
  if(r && r.kind!=="item" && r.kind!=="scenery" && r.kind!=="char" && r.kind!=="self"){
    if(needObj(r,"drink")) return;
  }
  if(r && !(r.kind==="item" && r.id==="canteen")){
    const h = handlerFor(r,"drink");
    if(h!==null) return runH(h,r);
  }
  if(S.loc==="pit") return pitDrink();
  if(!has("canteen")){ out("Nothing to drink is at hand."); return endTurn(); }
  if(r && r.kind==="item" && r.id==="canteen"){ out("A measured sip. Discipline about water is a habit she keeps even when it isn't scarce."); return endTurn(); }
  out("She takes a sip from her canteen."); return endTurn();
}
function doEat(r){
  if(r && needObj(r,"eat")) return;
  const h = handlerFor(r,"eat"); if(h!==null) return runH(h,r);
  out("Rations later. Work now."); return endTurn();
}
function doKiss(r){
  if(r && r.kind==="absentchar"){ outSys(CHARS[r.id].name+" isn't here."); return; }
  if(r && r.kind==="char"){
    const h = handlerFor(r,"kiss"); if(h!==null) return runH(h,r);
    out("Not here, and not now — but the thought is noted, somewhere private."); return endTurn();
  }
  outSys("Nicole reserves that for people.");
}
function doListen(r){
  if(r){
    if(needObj(r,"listen")) return;
    const h=handlerFor(r,"listen"); if(h!==null) return runH(h,r);
  }
  const rm = here();
  out(val(rm.sound) || "The silence of Rama: not the silence of an empty room, but of a machine holding its breath.");
  return endTurn();
}
function doSmell(r){
  if(r){
    if(needObj(r,"smell")) return;
    const h=handlerFor(r,"smell"); if(h!==null) return runH(h,r);
  }
  const rm=here();
  out(val(rm.smell) || "The air carries the mineral, metallic tang she has come to think of as Rama's breath.");
  return endTurn();
}
function doSit(r){
  if(r){
    if(needObj(r,"sit")) return;
    const h=handlerFor(r,"sit"); if(h!==null) return runH(h,r);
  }
  out("She crouches for a moment, resting.");
  return endTurn();
}
function doSleep(){
  const rm=here();
  if(rm.onSleep){ const r=rm.onSleep(); if(r!==false) return r; }
  out("Not the time. Fatigue is a resource like any other; she budgets it.");
  return endTurn();
}
function doShout(){
  const rm=here();
  if(rm.onShout) return rm.onShout();
  out("Her voice goes out and does not come back. Rama swallows echoes whole.");
  return endTurn();
}
function doSing(){
  const rm=here();
  if(rm.onSing) return rm.onSing();
  out("Softly, half to herself, a scrap of a song her father used to hum. It steadies her more than she expects.");
  return endTurn();
}
function doWait(){
  out("Time passes. In Rama, that is never quite a neutral statement.");
  return endTurn();
}
function doTalk(r){
  if(!r){
    const cs=charsAt(S.loc);
    if(!cs.length){ outSys("There is no one here to talk to."); return; }
    if(cs.length===1) r={kind:"char", id:cs[0]};
    else { outSys("Talk to whom? "+cs.map(c=>CHARS[c].name).join(", ")+" are here."); return; }
  }
  if(r.kind==="absentchar"){ outSys(CHARS[r.id].name+" isn't here."); return; }
  if(r.kind==="unknown"){ outSys("Nicole doesn't see anyone called \""+r.phrase+"\" here."); return; }
  if(r.kind!=="char"){
    const h=handlerFor(r,"talk");
    if(h!==null) return runH(h,r);
    out("It does not answer. Very little in Rama does."); return endTurn();
  }
  const c = CHARS[r.id];
  const t = val(c.talk);
  out(t);
  if(c.suggest){
    const sug = (typeof c.suggest==="function"?c.suggest():c.suggest);
    if(sug && sug.length) outSys("You might ASK "+commandNoun(c)+" ABOUT: "+sug.join(", ")+".");
  }
  return endTurn();
}

/* ---------- conversation ---------- */
function commandNoun(c){
  const n=(c.alias&&c.alias[0])||c.name.replace(/^the\s+/i,"");
  return n.toUpperCase();
}
const TOPIC_SYN = { ship:"rama", cylinder:"rama", vessel:"rama", craft:"rama",
  spider:"octospiders", spiders:"octospiders", landlord:"octospiders", landlords:"octospiders",
  toshio:"nakamura", otoole:"michael", benjamin:"benjy", katherine:"katie", kate:"katie",
  eleanor:"ellie", bird:"avians", birds:"avians", robot:"falstaff", grille:"grill" };
function wEq(a,b){ return a===b || a+"s"===b || a===b+"s"; }
function knownConceptName(words){
  for(const id in CHARS){ if(wordsMatch(words,namesFor("char",id))) return CHARS[id].name; }
  for(const id in ITEMS){ if(wordsMatch(words,namesFor("item",id))) return "the "+ITEMS[id].name; }
  for(const id in SCENERY){ if(wordsMatch(words,namesFor("scenery",id))) return "the "+SCENERY[id].name; }
  return null;
}
function topicKeyFrom(phrase){
  const words = phrase.split(" ").filter(w=>!FILLER.has(w)).map(w=>TOPIC_SYN[w]||w);
  return words.join(" ");
}
function doAskTell(mode, who, topicPhrase, whoText){
  if(S.act===4 && who && who.kind==="char" && who.id==="eagle"){
    const k4 = topicPhrase.toLowerCase();
    const t4 = /god|heaven|divine|creator/.test(k4)?"god" : /rama|ship|vessel/.test(k4)?"rama" : /famil|children|richard|katie|ellie|patrick|benjy|simone|husband|daughters|sons/.test(k4)?"family" : /purpose|point|why|meaning|all|everything|end/.test(k4)?"purpose" : null;
    if(t4) return CHARS.eagle.finalAsk(t4);
    out("The Eagle waits, gold-eyed. Four doors stand in the question: GOD, RAMA, her FAMILY, the PURPOSE.");
    return endTurn();
  }
  if(!who || who.kind==="unknown"){ outSys("Nicole doesn't see anyone called \""+whoText+"\" here."); return; }
  if(who.amb){ outSys("Which do you mean: "+who.amb.map(theName).join(", ")+"?"); return; }
  if(who.kind!=="char"){
    if(who.kind==="absentchar"){ outSys(CHARS[who.id].name+" isn't here."); return; }
    out("She addresses it. It has no opinion, or keeps it."); return endTurn();
  }
  const c = CHARS[who.id];
  const key = topicKeyFrom(topicPhrase);
  const table = (mode==="ask"?c.ask:c.tell)||{};
  let matched=null, matchedTopic=null;
  const kw0 = key.split(" ");
  const inSet=(w,arr)=>arr.some(x=>wEq(x,w));
  for(const topic in table){
    const alts = topic.split("|");
    for(const alt of alts){
      const aw = alt.trim().split(" ").map(w=>TOPIC_SYN[w]||w);
      if(kw0.some(w=>inSet(w,aw)) && aw.some(w=>inSet(w,kw0))){
        if(aw.every(w=>inSet(w,kw0)) || kw0.every(w=>inSet(w,aw))){ matched=table[topic]; matchedTopic=topic; break; }
      }
    }
    if(matched) break;
  }
  if(!matched){
    const dflt = (mode==="ask"?c.askDefault:c.tellDefault);
    if(dflt){ out(typeof dflt==="function"?dflt(key):dflt); return endTurn(); }
    const kc = knownConceptName(kw0);
    if(kc) out(c.name+" turns the question of "+kc+" over once and hands it back — nothing useful to add, or nothing of "+(c.pron||"their")+"s to give.");
    else out("The question finds no purchase; "+c.name+" doesn't seem to know anything about that.");
    return endTurn();
  }
  // matched may be array of {if, text, fx} or string or fn
  let res = matched;
  if(Array.isArray(matched)){
    res = null;
    for(const m of matched){ if(!m.if || m.if()){ res=m; break; } }
    if(!res){ out(c.name+" has nothing more to say about that."); return endTurn(); }
  }
  S.topicsAsked[who.id+":"+matchedTopic]= (S.topicsAsked[who.id+":"+matchedTopic]||0)+1;
  if(typeof res==="string"){ out(res); return endTurn(); }
  if(typeof res==="function"){ return res(); }
  if(res && res.run){ if(res.fx) res.fx(); return res.run(); }
  out(typeof res.text==="function"?res.text():res.text);
  if(res.fx) res.fx();
  return endTurn();
}
function doShowGive(mode,obj,who){
  if(!obj||obj.kind==="unknown"||obj.amb){ outSys(mode==="show"?"Show what?":"Give what?"); return; }
  if(obj.kind!=="item"||!has(obj.id)){ outSys("She isn't carrying that."); return; }
  if(who&&who.kind==="absentchar"){ outSys(CHARS[who.id].name+" isn't here."); return; }
  if(!who||who.kind!=="char"){ outSys("There's no one like that here."); return; }
  const c = CHARS[who.id];
  const table = c.show||{};
  const h = table[obj.id];
  if(h!==undefined){ return runH(h,{kind:"item",id:obj.id}); }
  out(c.name+" glances at the "+ITEMS[obj.id].name+" and nods, filing it away.");
  return endTurn();
}

/* ---------- self ---------- */
function selfDesc(){
  if(S.act===1) return "Nicole des Jardins. Life-sciences officer, Newton expedition; once an Olympian, always a physician. Copper-dark skin, forty-one years old, a green flight suit with more pockets than she needs and a red-and-gold scarf — her father's — knotted at her throat. She is very far from Beauvois, and not sorry.";
  if(S.act===2) return "Nicole des Jardins Wakefield. Physician, mother, involuntary ambassador of a species she is no longer sure she can summarize. The scarf is faded now. She still wears it.";
  if(S.act===3) return "Nicole des Jardins Wakefield. Councilor and chief physician of New Eden. There is grey in her hair and an ache in her chest she has diagnosed and told no one about. The scarf, threadbare, stays knotted at her throat.";
  return "Light, and the memory of a woman.";
}
function selfScan(){
  if(S.loc==="pit") return pitSelfScan();
  if(S.act===3) return "The scanner hesitates over her own chest and reports what she already knows: arrhythmia, progressed. Manageable. Probably. She files the reading where she files it every time.";
  return "Vitals nominal. Pulse a shade high — Rama does that to everyone.";
}
function treatSelf(){
  if(S.loc==="pit") return pitTreatSelf();
  out("Nothing needs treating. A rare state of affairs; she enjoys it while it lasts.");
  return endTurn();
}

/* ---------- meta verbs ---------- */
function doHelp(){
  outSys("MOVE with compass directions (N, S, E, W, UP, DOWN, IN, OUT). LOOK (L) describes where you are; EXAMINE (X) something looks closer. TAKE, DROP, OPEN, PUSH, PULL, TIE, SEARCH, READ act on things. TALK TO a person; ASK them ABOUT a topic; TELL them ABOUT something; SHOW or GIVE things TO them. Nicole's kit: SCAN and TREAT people (or SELF), PHOTOGRAPH things, take a SAMPLE. THINK reviews her goals. HINT gives graduated help, free of penalty. WAIT (Z) passes time. SAVE, LOAD, RESTART, VERBOSE, BRIEF, ABOUT do what they say. The game autosaves at important moments.");
}
function doAbout(){
  outSys("RAMA: an original work of interactive fiction adapted from the Rama novels of Arthur C. Clarke and Gentry Lee — Rendezvous with Rama and its sequels. All prose here is newly written for this adaptation. Structure: Act I, Rama; Act II, The Node; Act III, Return; and a postlude. A first voyage runs a few hours. Play it in Nicole's spirit: look closely, ask questions, and be careful with people.");
}
function doThink(){
  const t = THINK[S.phase];
  out(t?("Nicole gathers her thoughts. "+(typeof t==="function"?t():t)):"Her mind is quiet, for once.");
  return endTurn();
}
function doLog(){
  const log = expeditionLog();
  outSys("EXPEDITION LOG");
  if(!log.active.length){ outSys("No active expedition objectives."); return; }
  outSys("ACTIVE OBJECTIVES");
  for(const entry of log.active) out("• "+entry.text);
}
function doHint(){
  const h = HINTS[S.phase];
  if(!h){ outSys("No hints needed just now — follow the story."); return; }
  const arr = typeof h==="function"?h():h;
  const n = S.flags["hint_"+S.phase]||0;
  const idx = Math.min(n, arr.length-1);
  outSys("Hint "+(idx+1)+" of "+arr.length+": "+arr[idx]);
  S.flags["hint_"+S.phase]=n+1;
}
