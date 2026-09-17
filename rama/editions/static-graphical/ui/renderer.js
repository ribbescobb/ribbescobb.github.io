"use strict";

/* =====================================================================
   SHARED STATIC GRAPHICAL PARSER RENDERER
   =====================================================================
   This presentation seam deliberately consumes only canonical scene IDs
   and renderer frames. It never reads simulation collections or storage.
*/
(function installStaticGraphicalRendererFactory(global){
  function create(config){
    if(!config||typeof config!=="object") throw new TypeError("Static graphical renderer configuration is required.");
    const scenes=Object.freeze({...config.scenes});
    const contexts=Object.freeze({...config.contexts});
    const continuity=config.continuity===true;
    const textRenderer=createTextRenderer();
    let target=null;
    let panel=null;
    let image=null;
    let label=null;
    let fallback=null;
    let currentAsset="";
    const failedAssets=new Set();
    let skip=null, timer=null, packetKey="", views=[], viewIndex=0;

    function sceneFor(frame){
      if(continuity&&frame&&frame.presentation) return assetFor(frame.presentation.context.id);
      return frame&&frame.scene?scenes[frame.scene.id]||null:null;
    }

    function assetFor(id){ return contexts[id]||scenes[id]||null; }
    function isBeat(){ return viewIndex<views.length-1; }
    function cancelTimer(){
      if(timer!==null) clearTimeout(timer);
      timer=null;
    }
    function advanceView(){
      if(!target) return;
      if(isBeat()) viewIndex++;
      showView();
    }
    function showView(){
      cancelTimer();
      const scene=views[viewIndex];
      if(skip) skip.hidden=!isBeat();
      if(!scene||failedAssets.has(scene.src)){
        if(isBeat()){ viewIndex++; showView(); return; }
        image.removeAttribute("src"); currentAsset="";
        hide(!!scene); return;
      }
      label.textContent=scene.label;
      image.alt=scene.alt;
      panel.hidden=false; fallback.hidden=true;
      if(currentAsset!==scene.src){ currentAsset=scene.src; image.src=scene.src; }
      if(isBeat()) timer=setTimeout(advanceView,image.complete&&image.naturalWidth>0?4000:12000);
    }

    function hide(showFallback){
      if(!panel) return;
      panel.hidden=true;
      fallback.hidden=!showFallback;
    }

    return global.RamaRendererContract.defineRenderer({
      id:config.id,
      status:"early-access",
      mount(nextTarget,services){
        target=nextTarget;
        panel=document.getElementById("scene-panel");
        image=document.getElementById("scene-art");
        label=document.getElementById("scene-label");
        fallback=document.getElementById("scene-fallback");
        if(continuity){
          skip=document.getElementById("scene-skip");
          if(skip) skip.addEventListener("click",function(){
            viewIndex=views.length-1; showView();
          });
          image.addEventListener("load",function(){
            if(isBeat()){ cancelTimer(); timer=setTimeout(advanceView,4000); }
          });
        }
        image.addEventListener("error",function(){
          if(currentAsset) failedAssets.add(currentAsset);
          image.removeAttribute("src");
          currentAsset="";
          if(continuity&&isBeat()) advanceView();
          else hide(true);
        });
        textRenderer.mount(nextTarget,services);
      },
      render(frame){
        textRenderer.render(frame);
        if(!target.started){ cancelTimer(); hide(false); return; }
        if(continuity&&frame.presentation){
          const packet=frame.presentation;
          const key=packet.revision+":"+packet.context.id;
          if(key===packetKey) return;
          packetKey=key;
          views=[...packet.beats.map(scene=>assetFor(scene.id)).filter(Boolean),sceneFor(frame)];
          viewIndex=0;
          showView();
          return;
        }
        cancelTimer(); packetKey=""; views=[]; viewIndex=0;
        if(skip) skip.hidden=true;
        const scene=sceneFor(frame);
        if(!scene){
          image.removeAttribute("src");
          currentAsset="";
          hide(false);
          return;
        }
        if(failedAssets.has(scene.src)){ hide(true); return; }
        label.textContent=scene.label;
        image.alt=scene.alt;
        panel.hidden=false;
        fallback.hidden=true;
        if(currentAsset!==scene.src){
          currentAsset=scene.src;
          image.src=scene.src;
        }
      },
      consume(records){ textRenderer.consume(records); },
      destroy(){
        textRenderer.destroy();
        cancelTimer(); packetKey=""; views=[]; viewIndex=0; skip=null;
        target=null;
        panel=null;
        image=null;
        label=null;
        fallback=null;
        currentAsset="";
      }
    });
  }

  global.RamaStaticGraphicalRenderer=Object.freeze({create});
})(globalThis);
