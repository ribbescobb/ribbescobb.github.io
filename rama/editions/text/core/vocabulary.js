"use strict";

/* ---------- vocabulary ---------- */
const VERBS = {
  look:["look","l","gaze"], examine:["examine","x","inspect","study","check","observe","watch","view"],
  inventory:["inventory","i","inv"], take:["take","get","grab","pick","collect"],
  drop:["drop","discard","leave"], give:["give","offer","hand"],
  use:["use","apply","activate"], operate:["operate"], evacuate:["evacuate","evac"],
  honestly:["honestly","honest","truth","truthfully"], curated:["curated","carefully","diplomatically","curate"], refuse:["refuse","decline","silence","nothing"],
  sickest:["sickest","triage"], children:["children","youngest","kids"], lottery:["lottery","draw","random"], open:["open","unseal","unlatch"],
  close:["close","shut","seal"], push:["push","press","shove"], pull:["pull","tug","yank","drag"],
  touch:["touch","feel"], read:["read","peruse"], talk:["talk","speak","greet","converse","hello","hi","hey"],
  ask:["ask","question","query"], tell:["tell","inform","report"], show:["show","present"],
  wait:["wait","z","rest"], help:["help","commands","?"], hint:["hint","hints","clue"],
  save:["save"], load:["load","restore"], restart:["restart"], about:["about","credits"],
  go:["go","walk","move","travel","head","run","climb","descend","ascend","enter","exit","cross","swim","row","sail","board"],
  take_item:[], think:["think","plan","ponder","remember","goals","objectives"], log:["log"],
  drink:["drink","sip"], eat:["eat","taste"], listen:["listen"], smell:["smell","sniff"],
  sleep:["sleep","doze","nap"], shout:["shout","yell","scream","call","cry"],
  knock:["knock","bang","hit","strike","tap","pound"], throw:["throw","toss","hurl"],
  turn:["turn","rotate","twist"], put:["put","place","insert"], tie:["tie","attach","fasten","secure","tether","lash","anchor"],
  untie:["untie","detach","unfasten"], wear:["wear","don"], remove:["remove","doff"],
  search:["search","rummage","dig","explore"], sample:["sample"], follow:["follow","chase","pursue","tail"],
  curse:["fuck","shit","damn","dammit","damnit","merde","fucking","bloody"], wave:["wave","signal"], light:["light","shine","flash"],
  photograph:["photograph","photo","picture","film","record","snap"],
  scan:["scan","diagnose","analyze","analyse","measure"], treat:["treat","heal","bandage","splint","medicate"],
  operate_surgery:["surgery"], sing:["sing","hum","pray"], swim:[], say:["say","answer","reply","yes","no"],
  verbose:["verbose"], brief:["brief","superbrief"], transcript:["transcript"], again:["again","g"],
  kiss:["kiss","hug","embrace","hold","comfort"], sit:["sit"], stand:["stand"], jump:["jump","leap"],
  score:["score"]
};
const VERB_LOOKUP = {};
for(const v in VERBS){ VERBS[v].forEach(w=>VERB_LOOKUP[w]=v); }

const DIRS = {
  north:"north", n:"north", south:"south", s:"south", east:"east", e:"east",
  west:"west", w:"west", up:"up", u:"up", down:"down", d:"down",
  "in":"in", inside:"in", out:"out", outside:"out",
  northeast:"northeast", ne:"northeast", northwest:"northwest", nw:"northwest",
  southeast:"southeast", se:"southeast", southwest:"southwest", sw:"southwest"
};
const FILLER = new Set(["the","a","an","to","at","on","in","into","onto","with","of","my","your","her","his",
  "please","some","that","this","these","those","around","toward","towards","for","from","then","and","again"]);
const PREPS = new Set(["with","on","to","at","about","in","into","onto","under","using","for","from","over","around"]);

function normalize(s){
  return s.toLowerCase().replace(/[.,!?;:"']/g," ").replace(/\s+/g," ").trim();
}
