"use strict";

/* ---------- turn engine ---------- */
function endTurn(silent){
  S.turn++;
  if(!S.completedEvents) S.completedEvents={};
  for(const ev of EVENTS){
    if(S.completedEvents[ev.id]) continue;
    if(ev.when()){ S.completedEvents[ev.id]=true; ev.run(); }
  }
  const rm=here();
  if(rm.onTurn) rm.onTurn();
  autosave();
}
const EVENTS=[];
function addEvent(id, when, run){ EVENTS.push({id, when, run}); }
function eventDone(id){ return !!(S.completedEvents&&S.completedEvents[id]); }
function relUp(k,n){ S.rel[k]=(S.rel[k]||0)+n; }
