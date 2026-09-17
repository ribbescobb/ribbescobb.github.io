"use strict";
(function(){
  function startSession(){ if(globalThis.RamaEditionSession) globalThis.RamaEditionSession.start({editionId:"era-1994"}); }
  function bootEdition(){
    if(globalThis.RamaEditionBoot) globalThis.RamaEditionBoot.start({
      editionId:"era-1994",
      durationMs:3600,
      statusText:{ready:"POWER OFF",readyMuted:"POWER OFF · SOUND MUTED",running:"VGA PROGRAM · STARTING",runningMuted:"MUTED · VGA PROGRAM · STARTING"},
      onComplete:startSession
    });
    else startSession();
  }
  if(typeof document!=="undefined"){
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bootEdition);
    else bootEdition();
  }
})();
