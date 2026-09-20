"use strict";

/* =====================================================================
   TEXT DOM RENDERER
   ===================================================================== */
let EL=null;
let TEXT_RENDERER_TARGET=null, TEXT_RENDERER_SERVICES=null;

function textDomReady(){ return typeof document!=="undefined" && EL; }
function touchFirstViewport(){ return typeof matchMedia==="function" && matchMedia("(pointer: coarse)").matches; }
function focusCommandAfterSuggestion(){
  // Suggested actions are the touch-first control surface. Keeping a hidden
  // text cursor focused here would summon the software keyboard after every tap.
  if(touchFirstViewport()){
    if(typeof EL.cmd.blur==="function") EL.cmd.blur();
    return;
  }
  EL.cmd.focus();
}

function textOutputElement(record){
  let element;
  if(record.k==="act"){
    element=document.createElement("div"); element.className="acthead";
    element.innerHTML='<div class="rule"></div><div class="actnum"></div><div class="actname"></div><div class="rule2"></div>';
    element.children[1].textContent=record.num; element.children[2].textContent=record.name;
  } else if(record.k==="room"){
    element=document.createElement("div"); element.className="roomtitle"; element.textContent=record.t;
  } else if(record.k==="fin"){
    element=document.createElement("div"); element.className="fin"; element.textContent=record.t;
  } else {
    element=document.createElement("p");
    if(record.k==="sys") element.className="sys";
    if(record.k==="alert") element.className="alert";
    if(record.k==="echo") element.className="echo";
    element.textContent=record.t;
  }
  return element;
}

function createTextRenderer(){
  return globalThis.RamaRendererContract.defineRenderer({
    id:"text",
    status:"active",
    mount:function(target, services){
      TEXT_RENDERER_TARGET=target; TEXT_RENDERER_SERVICES=services; EL=target.elements;
      if(target.hasSave) EL.cont.style.display="";

      EL.begin.addEventListener("click", function(){
        target.start("new");
      });
      EL.cont.addEventListener("click", function(){
        target.start("continue");
      });
      EL.cmd.addEventListener("keydown", function(ev){
        if(ev.key==="Enter"){
          const raw=EL.cmd.value; EL.cmd.value="";
          if(raw.trim()){
            target.started=true;
            services.dispatch({type:"system",command:raw});
          }
        } else if(ev.key==="ArrowUp"){
          if(HIST.length){
            HPOS=Math.max(0,HPOS-1); EL.cmd.value=HIST[HPOS]||""; ev.preventDefault();
            setTimeout(()=>EL.cmd.setSelectionRange(EL.cmd.value.length,EL.cmd.value.length),0);
          }
        } else if(ev.key==="ArrowDown"){
          if(HIST.length){ HPOS=Math.min(HIST.length,HPOS+1); EL.cmd.value=HIST[HPOS]||""; ev.preventDefault(); }
        }
      });
    },
    render:function(frame){
      if(!textDomReady() || !TEXT_RENDERER_TARGET.started) return;
      document.body.classList.toggle("postlude", frame.ui.actLabel==="Postlude");
      document.body.classList.toggle("ended", frame.ui.mode==="ended");
      EL.stloc.textContent=frame.ui.locationLabel;
      EL.stact.textContent=frame.ui.actLabel;
      EL.chips.innerHTML="";
      for(const available of frame.actions){
        const chip=document.createElement("span"); chip.className="chip"; chip.textContent=available.label;
        if(available.enabled){
          chip.addEventListener("click",()=>{ TEXT_RENDERER_SERVICES.dispatch(available.action); focusCommandAfterSuggestion(); });
        }
        EL.chips.appendChild(chip);
      }
      EL.cmd.disabled=!frame.ui.inputEnabled;
      if(frame.ui.inputEnabled&&frame.ui.mode==="question") EL.cmd.focus();
    },
    consume:function(records){
      if(!textDomReady() || !TEXT_RENDERER_TARGET.started || !records.length) return;
      // One response at a time; retain every event/dialogue record in this batch.
      // Ignore empty follow-up flushes (notably after a confirmed restart).
      EL.transcript.innerHTML="";
      for(const record of records) EL.transcript.appendChild(textOutputElement(record));
      EL.scrollwrap.scrollTop=0;
    },
    destroy:function(){
      TEXT_RENDERER_TARGET=null; TEXT_RENDERER_SERVICES=null; EL=null;
    }
  });
}

globalThis.RamaEditionRendererFactory=createTextRenderer;
