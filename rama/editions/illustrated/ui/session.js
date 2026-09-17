"use strict";

(function(){
  function startSession(){
    if(globalThis.RamaEditionSession) globalThis.RamaEditionSession.start({editionId:"illustrated"});
  }

  function bootEdition(){
    if(globalThis.RamaEditionBoot){
      globalThis.RamaEditionBoot.start({
        editionId:"illustrated",
        durationMs:2800,
        statusText:{
          ready:"POWER OFF",
          readyMuted:"POWER OFF · SOUND MUTED",
          running:"PICTURE DISK · READING",
          runningMuted:"PICTURE DISK · READING SILENTLY"
        },
        onComplete:startSession
      });
    } else startSession();
  }

  if(typeof document!=="undefined"){
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bootEdition);
    else bootEdition();
  }
})();
