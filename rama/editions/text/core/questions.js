"use strict";

/* ---------- pending question registry (handlers are code; state is data) ---------- */
const QUESTION_HANDLERS = {};
function registerCoreQuestions(){
  QUESTION_HANDLERS.restart = {
    options:[["YES","yes"],["NO","no"]],
    yes:function(){ hardRestart(); },
    no:function(){ outSys("Continuing."); if(S.pendingQuestion&&S.pendingQuestion.prompt) outSys(S.pendingQuestion.prompt); autosave(); }
  };
}
function askQ(id, prompt, saveNow, displayPrompt){
  S.pendingQuestion = { id:id, prompt:prompt, prev:S.pendingQuestion||null };
  if(displayPrompt!==false) outSys(prompt);
  if(saveNow!==false) autosave();
}
function resolveQ(ans){
  const q = S.pendingQuestion;
  S.pendingQuestion = (q&&q.prev)||null;
  const h = q && QUESTION_HANDLERS[q.id];
  if(!h || typeof h[ans]!=="function"){ outSys("(That moment has passed.)"); return; }
  return h[ans]();
}
function questionChoices(q){
  const h=q&&QUESTION_HANDLERS[q.id];
  if(!h) return [];
  if(Array.isArray(h.options)) return h.options;
  const choices=[];
  if(typeof h.yes==="function") choices.push(["YES","yes"]);
  if(typeof h.no==="function") choices.push(["NO","no"]);
  return choices;
}
function pendingAnswer(s){
  const h=S.pendingQuestion&&QUESTION_HANDLERS[S.pendingQuestion.id];
  if(!h) return null;
  if(/^(yes|y|yeah|oui|ok|okay|sure)$/.test(s)&&typeof h.yes==="function") return "yes";
  if(/^(no|n|non|nope)$/.test(s)&&typeof h.no==="function") return "no";
  return typeof h[s]==="function"?s:null;
}
const EAGLE_INTERVIEW_PROMPTS={
  1:"The Eagle's question: Your expedition arrived carrying weapons, and your governments' final act was to target this vehicle with more. Tell me about your species and war. Answer HONESTLY, give a CURATED account, or REFUSE.",
  2:"The Eagle's question: You crossed two hundred million kilometers, and then eight light-years, and by every measure of your biology this cost you. Tell me about your species and love. Answer HONESTLY, give a CURATED account, or REFUSE.",
  3:"The Eagle's question: You are mortal, and you know it as few species know it. Tell me about your species and fear — what you do with the ending of things. Answer HONESTLY, give a CURATED account, or REFUSE."
};
const SAFE_DURING_QUESTION = new Set(["look","l","gaze","examine","x","inspect","study","check","observe","watch","view","inventory","i","inv","help","commands","?","save","load","restore","hint","hints","clue","think","plan","ponder","remember","goals","objectives","log","about","credits","transcript","verbose","brief","superbrief","score","listen","read","peruse","smell","sniff"]);
