"use strict";

/* ---------- command dispatch ---------- */
let LASTCMD = "";
function doCommand(raw){
  try{ return doCommandInner(raw); }
  catch(e){ if(typeof console!=="undefined") console.error(e); outSys("(Something snagged mid-thought. Try that another way.)"); }
}
function doCommandInner(raw){
  let s = normalize(raw);
  if(!s) return;
  let safeAtEnding=false;
  if(S.pendingQuestion){
    const answer=pendingAnswer(s);
    if(answer) return resolveQ(answer);
    if(s==="restart"){
      if(S.pendingQuestion.id==="restart"){ outSys(S.pendingQuestion.prompt); return; }
      return doRestartAsk();
    }
    if(!SAFE_DURING_QUESTION.has(s.split(" ")[0])){
      outSys("Nicole needs to answer first — "+(S.pendingQuestion.prompt||"YES or NO?"));
      return;
    }
    safeAtEnding=true;
    // harmless command: let it run; the question remains pending.
  }
  if(S.ended&&!safeAtEnding){
    if(s==="restart") return doRestartAsk();
    if(s==="transcript") return doTranscript();
    if(s==="log") return doLog();
    outSys("THE END. (RESTART begins a new voyage; TRANSCRIPT saves this one.)"); return;
  }
  if(s==="again"||s==="g"){ if(!LASTCMD){outSys("Nothing to repeat.");return;} s=LASTCMD; }
  else LASTCMD = s;

  if(S.pendingDisamb){
    const pd = S.pendingDisamb; S.pendingDisamb=null;
    const r = resolveNoun(s,{});
    if(r && !r.amb && r.kind!=="unknown" && r.kind!=="absent" && r.kind!=="absentchar"){
      return execute(pd.verb, r, pd.second, pd.prep);
    }
    // fall through and treat as a fresh command
  }

  // direction shorthand
  if(DIRS[s]) return doGo(DIRS[s]);

  const tokens = s.split(" ");
  let verbWord = tokens[0];
  let verb = VERB_LOOKUP[verbWord];

  // "pick up"
  if(verbWord==="pick" && tokens[1]==="up"){ verb="take"; tokens.splice(1,1); }
  if(verb==="take"){
    let ai=1; if(tokens[ai]==="a"||tokens[ai]==="the"||tokens[ai]==="another") ai++;
    const nw=tokens[ai];
    if(["photo","photograph","picture","pic","snapshot","shot"].includes(nw)){
      verb="photograph"; let j=ai+1; if(tokens[j]==="of") j++; tokens.splice(1,j-1);
    } else if(nw==="sample"&&tokens[ai+1]==="of"){
      verb="sample"; tokens.splice(1,ai+1);
    } else if(nw==="reading"||nw==="scan"){
      verb="scan"; let j=ai+1; if(tokens[j]==="of") j++; tokens.splice(1,j-1);
    }
  }
  if(verbWord==="get" && tokens[1]==="up"){ outSys("You are on your feet."); return endTurn(); }
  if((verbWord==="look"||verbWord==="l") && tokens[1]==="at"){ verb="examine"; tokens.splice(1,1); }
  if(verbWord==="look" && (tokens[1]==="in"||tokens[1]==="inside"||tokens[1]==="under"||tokens[1]==="behind")){ verb="search"; tokens.splice(1,1); }
  if(verbWord==="talk" && tokens[1]==="to") tokens.splice(1,1);
  if(verbWord==="listen" && tokens[1]==="to") tokens.splice(1,1);
  if(verbWord==="sit" && tokens[1]==="on") tokens.splice(1,1);

  if(!verb){
    if(DIRS[verbWord]) return doGo(DIRS[verbWord]);
    outSys(failVerb(verbWord));
    return;
  }
  const rest = tokens.slice(1).join(" ");

  // structured forms
  if(verb==="ask"||verb==="tell"){
    const m = rest.match(/^(.*?)\s+about\s+(.+)$/);
    if(m){
      const who = resolveNoun(m[1],{});
      return doAskTell(verb, who, m[2].trim(), m[1]);
    }
    if(rest){
      const who = resolveNoun(rest,{});
      if(who && who.kind==="char"){ outSys("Ask "+CHARS[who.id].name+" about what? (ASK "+commandNoun(CHARS[who.id])+" ABOUT ...)"); return; }
    }
    outSys("Try ASK someone ABOUT a topic, or TELL someone ABOUT something you've learned."); return;
  }
  if(verb==="show"||verb==="give"){
    const m = rest.match(/^(.*?)\s+to\s+(.+)$/);
    if(m){
      const obj = resolveNoun(m[1],{invOnly:true});
      const who = resolveNoun(m[2],{});
      return doShowGive(verb,obj,who);
    }
  }
  if(verb==="go"){
    const dw = rest.split(" ").filter(w=>!FILLER.has(w))[0];
    if(DIRS[dw]) return doGo(DIRS[dw]);
    if(dw){
      const r = resolveNoun(rest,{});
      if(r && !r.amb && (r.kind==="scenery"||r.kind==="item")){ return execute("enterThing", r); }
      outSys("Which way? Compass directions work here — the exits are listed when you LOOK.");
      return;
    }
    outSys("Go where?"); return;
  }

  // split off prepositional second object: VERB X with/on Y
  let first=rest, prep=null, second=null;
  const words=rest.split(" ");
  // Leading prepositions introduce the direct object (KNOCK ON DOOR).
  if(PREPS.has(words[0])) words.shift();
  const idx=words.findIndex(word=>PREPS.has(word));
  if(idx>=0){
    first=words.slice(0,idx).join(" ");
    prep=words[idx];
    second=words.slice(idx+1).join(" ");
  } else {
    first=words.join(" ");
  }
  let obj=null, obj2=null;
  if(first){ obj = resolveNoun(first,{}); }
  if(second){ obj2 = resolveNoun(second,{}); }

  if(obj && obj.amb){
    S.pendingDisamb = {verb, second:obj2, prep};
    outSys("Which do you mean: "+obj.amb.map(theName).join(", ")+"?");
    return;
  }
  if(obj2 && obj2.amb){
    outSys("Which do you mean: "+obj2.amb.map(theName).join(", ")+"?");
    return;
  }
  execute(verb, obj, obj2, prep);
}

function failVerb(w){
  const near = ["That's not a verb Nicole knows. HELP lists what she can do.",
    "Nicole considers, then discards the idea — she isn't sure what \""+w+"\" would mean here.",
    "That verb isn't in her vocabulary. Try LOOK, EXAMINE, TALK, or HELP."];
  return near[S.turn % near.length];
}
