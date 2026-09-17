"use strict";

/* ---------- persistence ---------- */
const SAVEKEY="rama_if_save_v2";
function snapshot(){ return JSON.stringify({version:2, S, itemLocs:Object.fromEntries(Object.keys(ITEMS).map(k=>[k,ITEMS[k].loc])), charLocs:Object.fromEntries(Object.keys(CHARS).map(k=>[k,{loc:CHARS[k].loc,gone:!!CHARS[k].gone}]))}); }
function reconcileCanonicalCharacterLocations(){
  if(S.act!==2) return;
  if(F().nodeCorridor||String(S.loc).startsWith("node_")||String(S.phase).startsWith("act2_eagle")||["act2_interview","act2_settled","simone_fever","act2_settled2","act2_request_wait","act2_farewell"].includes(S.phase)){
    if(S.phase==="simone_fever"&&!F().feverCured){
      CHARS.simone.loc="node_quarters"; CHARS.katie.loc="node_quarters";
    }else{
      CHARS.simone.loc="party"; CHARS.katie.loc="party";
    }
    return;
  }
  if(F().katieResolved) CHARS.katie.loc="party";
}
function restore(json){
  try{
    const d = JSON.parse(json);
    if(!d || d.version!==2 || !d.S || typeof d.S!=="object") return false;
    if(!WORLD[d.S.loc]) return false;
    if(!(d.S.act>=1&&d.S.act<=4)) return false;
    const ns = Object.assign(freshState(), d.S);
    ns.inv = (ns.inv||[]).filter(id=>ITEMS[id]);
    if(ns.pendingQuestion && !QUESTION_HANDLERS[ns.pendingQuestion.id]) ns.pendingQuestion=null;
    if(ns.phase==="act2_interview"&&!ns.pendingQuestion){
      const q=Math.min(3,Math.max(1,Number(ns.flags&&ns.flags.eagleQ)||1));
      ns.pendingQuestion={id:"eagle_interview",prompt:EAGLE_INTERVIEW_PROMPTS[q],prev:null};
    }
    S = ns;
    for(const k in (d.itemLocs||{})){ if(ITEMS[k]) ITEMS[k].loc=d.itemLocs[k]; }
    for(const k in (d.charLocs||{})){ if(CHARS[k]){ CHARS[k].loc=d.charLocs[k].loc; CHARS[k].gone=d.charLocs[k].gone; } }
    reconcileCanonicalCharacterLocations();
    return true;
  }catch(e){ return false; }
}
function storageOK(){ try{ return typeof localStorage!=="undefined"; }catch(e){ return false; } }
let CANONICAL_WRITE_GATE=null;
function installCanonicalWriteGate(gate){
  if(gate!==null&&(!gate||typeof gate.commit!=="function"||typeof gate.removeCanonical!=="function")){
    throw new TypeError("Canonical write gate must provide commit and removeCanonical functions.");
  }
  CANONICAL_WRITE_GATE=gate;
}
function writeCanonicalPayload(payload){
  if(CANONICAL_WRITE_GATE) return CANONICAL_WRITE_GATE.commit(payload);
  try{ localStorage.setItem(SAVEKEY,payload); return {ok:localStorage.getItem(SAVEKEY)===payload}; }
  catch(e){ return {ok:false,reason:"storage-failed",error:e}; }
}
function removeCanonicalPayload(){
  if(CANONICAL_WRITE_GATE) return CANONICAL_WRITE_GATE.removeCanonical();
  try{ localStorage.removeItem(SAVEKEY); return {ok:localStorage.getItem(SAVEKEY)===null}; }
  catch(e){ return {ok:false,reason:"storage-failed",error:e}; }
}
function doSave(manual){
  if(!storageOK()){ if(manual) outSys("This browser is refusing to store saves; the autosave will not work either."); return false; }
  const result=writeCanonicalPayload(snapshot());
  if(result&&result.ok){ if(manual) outSys("Saved."); return true; }
  if(manual){
    if(result&&["ownership-lost","stale-save","released"].includes(result.reason)) outSys("The save was blocked because this voyage is active or newer in another tab.");
    else outSys("The save failed — storage may be full or blocked.");
  }
  return false;
}
function autosave(){ doSave(false); }
function doLoad(){
  let hasP=false; try{ hasP=storageOK()&&!!localStorage.getItem(SAVEKEY); }catch(e){}
  if(!hasP){ outSys("No saved voyage found."); return false; }
  let payload=null; try{ payload=localStorage.getItem(SAVEKEY); }catch(e){}
  if(payload && restore(payload)){
    outSys("Restored.");
    if(S.ended){
      outSys("Completed ending restored"+(S.ending?": "+S.ending.toUpperCase():"."));
      outFin("THE END");
    } else doLook(false);
    if(S.pendingQuestion&&S.pendingQuestion.prompt) outSys(S.pendingQuestion.prompt);
    refreshUI();
    return true;
  }
  outSys("That save cannot be restored.");
  return false;
}
function doRestartAsk(){
  askQ("restart","Restart from the beginning? All progress will be lost. (YES/NO)");
}
function hardRestart(){
  if(storageOK()){
    const removed=removeCanonicalPayload();
    if(!removed||!removed.ok){
      outSys("A newer voyage is active elsewhere. Restart was cancelled to protect it.");
      return false;
    }
  }
  resetWorld();
  S = freshState();
  LASTCMD="";
  if(typeof HIST!=="undefined"){ HIST.length=0; HPOS=-1; }
  BUF.length=0;
  if(typeof document!=="undefined"){ document.getElementById("transcript").innerHTML=""; document.body.classList.remove("postlude","ended"); }
  openingScene();
  flush();
  return true;
}
function doTranscript(){
  if(typeof document==="undefined"){ outSys("No transcript in this mode."); return; }
  const text = Array.from(document.querySelectorAll("#transcript p, #transcript div")).map(e=>e.textContent).join("\n");
  const blob = new Blob([text],{type:"text/plain"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="rama-transcript.txt"; a.click();
  outSys("Transcript downloaded.");
}
