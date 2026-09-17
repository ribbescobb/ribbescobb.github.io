"use strict";

(function(){
  function startSession(){
    if(globalThis.RamaEditionSession) globalThis.RamaEditionSession.start({editionId:"text"});
  }

  function bootEdition(){
    if(globalThis.RamaEditionBoot){
      globalThis.RamaEditionBoot.start({
        editionId:"text",
        durationMs:3400,
        audioCueOffsetsMs:[0,2100],
        statusText:{
          ready:"POWER OFF",
          readyMuted:"POWER OFF · SOUND MUTED",
          running:"DRIVE A · READING",
          runningMuted:"COLD START · SOUND MUTED",
          audioBlocked:"DRIVE A · AUDIO BLOCKED",
          audioUnavailable:"DRIVE A · AUDIO UNAVAILABLE"
        },
        onComplete:startSession
      });
    } else startSession();
  }

  if(typeof document!=="undefined"){
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootEdition);
    else bootEdition();
  }
})();
