"use strict";
(function(){
  function startSession(){ if(globalThis.RamaEditionSession) globalThis.RamaEditionSession.start({editionId:"era-1989"}); }
  function bootEdition(){
    if(globalThis.RamaEditionBoot) globalThis.RamaEditionBoot.start({
      editionId:"era-1989",
      durationMs:3100,
      statusText:{ready:"POWER OFF",readyMuted:"POWER OFF · SOUND MUTED",running:"DRIVE A · READING",runningMuted:"MUTED · DRIVE A · READING"},
      onComplete:startSession
    });
    else startSession();
  }
  if(typeof document!=="undefined"){
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bootEdition);
    else bootEdition();
  }
})();
