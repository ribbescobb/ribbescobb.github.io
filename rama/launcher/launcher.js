"use strict";

(function(){
  const registry=globalThis.RamaEditionRegistry;
  const voyageApi=globalThis.RamaVoyageSession;
  const packageCopy=globalThis.RamaPackageCopy||{};
  if(!registry||!voyageApi) throw new Error("RAMA launcher registry/session foundation is unavailable.");

  const coordinator=voyageApi.createCoordinator({
    localStorage:globalThis.localStorage,
    sessionStorage:globalThis.sessionStorage,
    editionRegistry:registry,
    eventTarget:window
  });
  const cards=Array.from(document.querySelectorAll(".edition-card"));
  const saveStatus=document.getElementById("save-status");
  const launcherStatus=document.getElementById("launcher-status");
  const packageViewer=document.getElementById("package-viewer");
  const packageViewerTitle=document.getElementById("package-viewer-title");
  const packageViewerImage=document.getElementById("package-viewer-image");
  const viewerBody=document.getElementById("viewer-body");
  const viewerStage=document.getElementById("viewer-stage");
  const viewerFit=document.getElementById("viewer-fit");
  const viewerActual=document.getElementById("viewer-actual");
  const viewerRotate=document.getElementById("viewer-rotate");
  const viewerStatus=document.getElementById("viewer-status");
  const viewerCopy=document.getElementById("viewer-copy");
  const packageTranscript=document.getElementById("package-transcript");
  const packageTranscriptContent=document.getElementById("package-transcript-content");
  const sessionDialog=document.getElementById("session-dialog");
  const replaceDialog=document.getElementById("replace-dialog");
  const conflictDialog=document.getElementById("session-conflict-dialog");
  const sessionEditionLabel=document.getElementById("session-edition-label");
  const conflictCopy=document.getElementById("session-conflict-copy");
  const newButton=document.getElementById("new-game");
  const continueButton=document.getElementById("continue-game");
  const confirmNewButton=document.getElementById("confirm-new");
  const takeOverButton=document.getElementById("confirm-takeover");
  const reducedMotion=globalThis.matchMedia?globalThis.matchMedia("(prefers-reduced-motion: reduce)"):{matches:false};
  let selected="text";
  let pendingIntent=null;
  let viewerMode="fit";
  let viewerTrigger=null;
  let viewerCard=null;
  let viewerSide="front";
  let viewerTurn=null;
  let viewerPointer=null;
  let suppressViewerDoubleClickUntil=0;

  function announce(message,isError){
    launcherStatus.textContent=message||"";
    launcherStatus.classList.toggle("is-error",!!isError);
  }

  function canonicalSaveExists(){
    try{return voyageApi.validateCanonicalEnvelope(localStorage.getItem(voyageApi.KEYS.canonicalSave));}
    catch(error){return false;}
  }

  function updateSaveStatus(){
    const exists=canonicalSaveExists();
    continueButton.disabled=!exists;
    saveStatus.textContent=exists?"Saved voyage available":"No restorable saved voyage on this browser";
    return exists;
  }

  function selectEdition(id){
    const edition=registry.edition(id);
    if(!edition)return false;
    selected=id;
    coordinator.rememberSelection(id);
    for(const card of cards){
      const isSelected=card.dataset.edition===id;
      card.classList.toggle("is-selected",isSelected);
      card.querySelector(".box-select").setAttribute("aria-pressed",String(isSelected));
    }
    sessionEditionLabel.textContent=edition.shortLabel;
    announce("",false);
    return true;
  }

  function openEditionSession(id){
    const edition=registry.launcherEdition(id);
    if(!edition)return false;
    selectEdition(id);
    if(edition.sessionMode==="standalone"){
      const destination=registry.resolveLauncherRoute(id,window.location.href);
      if(!destination){announce("That artifact cannot be opened.",true);return false;}
      window.location.assign(destination.href);
      return true;
    }
    updateSaveStatus();
    sessionDialog.showModal();
    return true;
  }

  function packageSide(card){return card.classList.contains("is-flipped")?"back":"front";}

  function updatePackageControls(card){
    const edition=registry.edition(card.dataset.edition);
    const side=packageSide(card);
    const zoom=card.querySelector(".zoom-control");
    const flip=card.querySelector(".flip-control");
    card.querySelector(".box-front").setAttribute("aria-hidden",String(side!=="front"));
    card.querySelector(".box-back").setAttribute("aria-hidden",String(side!=="back"));
    flip.textContent="Flip";
    flip.setAttribute("aria-label",`Flip ${edition.shortLabel} box to show the ${side==="back"?"front":"back"}`);
    zoom.setAttribute("aria-label",`View ${edition.shortLabel} box ${side} at full size`);
  }

  function setViewerMode(mode){
    if(viewerTurn)return viewerMode;
    viewerMode=mode==="actual"?"actual":"fit";
    viewerStage.dataset.view=viewerMode;
    viewerFit.classList.toggle("is-active",viewerMode==="fit");
    viewerActual.classList.toggle("is-active",viewerMode==="actual");
    viewerFit.setAttribute("aria-pressed",String(viewerMode==="fit"));
    viewerActual.setAttribute("aria-pressed",String(viewerMode==="actual"));
    packageViewerImage.title=viewerMode==="fit"
      ?"Drag left or right to turn · Double-click to view at 100%"
      :"Drag left or right to turn · Double-click to fit the package";
    viewerStage.scrollTop=0;
    viewerStage.scrollLeft=0;
    return viewerMode;
  }

  function renderPackageTranscript(record){
    packageTranscriptContent.replaceChildren();
    if(!record)return false;
    const description=document.createElement("p");
    description.className="artifact-description";
    description.textContent="Artifact description: "+record.art;
    packageTranscriptContent.append(description);
    for(const section of record.sections){
      if(section.heading){
        const heading=document.createElement("h4");
        heading.textContent=section.heading;
        packageTranscriptContent.append(heading);
      }
      for(const text of section.paragraphs){
        const paragraph=document.createElement("p");
        paragraph.textContent=text;
        packageTranscriptContent.append(paragraph);
      }
      if(section.items.length){
        const list=document.createElement("ul");
        for(const text of section.items){
          const item=document.createElement("li");
          item.textContent=text;
          list.append(item);
        }
        packageTranscriptContent.append(list);
      }
    }
    return true;
  }

  function showPackageTranscript(show){
    if(viewerTurn)return !packageTranscript.hidden;
    const visible=!!show;
    packageTranscript.hidden=!visible;
    viewerBody.classList.toggle("has-transcript",visible);
    viewerCopy.setAttribute("aria-expanded",String(visible));
    viewerCopy.textContent=visible?"Hide copy":"Read copy";
    if(visible)packageTranscript.focus();
    return visible;
  }

  const packageImagePreparations=new WeakMap();
  const packageDragState=new WeakMap();
  const suppressedPackageClicks=new WeakMap();

  function restingPackageAngle(card){return card.classList.contains("is-flipped")?174:-6;}

  function packageDetent(angle){
    const stop=Math.round((angle+6)/180)*180-6;
    const distance=angle-stop;
    return Math.abs(distance)<18?stop+distance*0.28:angle;
  }

  function packageSideAtAngle(angle){
    return Math.abs(Math.round((angle+6)/180)%2)===1?"back":"front";
  }

  function finishPackageDrag(card,targetAngle){
    const box=card.querySelector(".box-object");
    box.style.removeProperty("--drag-angle");
    card.classList.remove("is-dragging","is-drag-settling");
    card.classList.add("is-drag-reset");
    requestAnimationFrame(()=>card.classList.remove("is-drag-reset"));
    card.classList.toggle("is-flipped",packageSideAtAngle(targetAngle)==="back");
    updatePackageControls(card);
  }

  function settlePackageDrag(card,angle,velocity){
    const box=card.querySelector(".box-object");
    const projected=angle+Math.max(-0.65,Math.min(0.65,velocity))*150;
    const targetAngle=Math.round((projected+6)/180)*180-6;
    card.classList.remove("is-dragging");
    card.classList.add("is-drag-settling");
    card.classList.toggle("is-flipped",packageSideAtAngle(targetAngle)==="back");
    box.style.setProperty("--drag-angle",targetAngle+"deg");
    if(reducedMotion.matches||Math.abs(targetAngle-angle)<0.15){
      finishPackageDrag(card,targetAngle);
      return targetAngle;
    }
    const finish=function(event){
      if(event.target!==box||event.propertyName!=="transform")return;
      box.removeEventListener("transitionend",finish);
      box.removeEventListener("transitioncancel",finish);
      finishPackageDrag(card,targetAngle);
    };
    box.addEventListener("transitionend",finish);
    box.addEventListener("transitioncancel",finish);
    return targetAngle;
  }

  function installPackageDrag(card){
    const surface=card.querySelector(".box-select");
    const box=card.querySelector(".box-object");
    // Stop the browser's native image drag (most visibly Safari's ghost image) so
    // the same gesture always belongs to the package turn.
    surface.addEventListener("dragstart",function(event){event.preventDefault();});
    surface.addEventListener("pointerdown",function(event){
      if(event.pointerType==="mouse"&&event.button!==0)return;
      if(card.classList.contains("is-flipping")||card.classList.contains("is-preparing")||card.classList.contains("is-drag-settling"))return;
      preparePackageImages(card);
      packageDragState.set(card,{
        pointerId:event.pointerId,
        startX:event.clientX,
        startY:event.clientY,
        startAngle:restingPackageAngle(card),
        rawAngle:restingPackageAngle(card),
        angle:restingPackageAngle(card),
        lastX:event.clientX,
        lastTime:event.timeStamp,
        velocity:0,
        active:false
      });
    });
    surface.addEventListener("pointermove",function(event){
      const drag=packageDragState.get(card);
      if(!drag||drag.pointerId!==event.pointerId)return;
      const dx=event.clientX-drag.startX;
      const dy=event.clientY-drag.startY;
      if(!drag.active){
        if(Math.abs(dx)<7)return;
        if(Math.abs(dy)>Math.abs(dx)*0.9)return;
        drag.active=true;
        card.classList.add("is-dragging");
        selectEdition(card.dataset.edition);
        if(surface.setPointerCapture)surface.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      const width=Math.max(180,surface.getBoundingClientRect().width||0);
      const rawAngle=drag.startAngle+(dx/width)*230;
      const now=event.timeStamp;
      const elapsed=Math.max(8,now-drag.lastTime);
      const instant=((event.clientX-drag.lastX)/width*230)/elapsed;
      drag.velocity=drag.velocity*0.68+instant*0.32;
      drag.rawAngle=rawAngle;
      drag.angle=packageDetent(rawAngle);
      drag.lastX=event.clientX;
      drag.lastTime=now;
      box.style.setProperty("--drag-angle",drag.angle+"deg");
    });
    const release=function(event){
      const drag=packageDragState.get(card);
      if(!drag||drag.pointerId!==event.pointerId)return;
      packageDragState.delete(card);
      if(surface.hasPointerCapture&&surface.hasPointerCapture(event.pointerId))surface.releasePointerCapture(event.pointerId);
      if(!drag.active)return;
      suppressedPackageClicks.set(card,Date.now()+400);
      settlePackageDrag(card,drag.angle,event.type==="pointercancel"?0:drag.velocity);
    };
    surface.addEventListener("pointerup",release);
    surface.addEventListener("pointercancel",release);
  }

  function preparePackageImages(card){
    const pending=packageImagePreparations.get(card);
    if(pending)return pending;
    const images=Array.from(card.querySelectorAll(".box-art"));
    const preparation=Promise.all(images.map(image=>{
      if(typeof image.decode==="function")return image.decode();
      if(image.complete)return image.naturalWidth>0?Promise.resolve():Promise.reject(new Error("Package image unavailable"));
      return new Promise((resolve,reject)=>{
        const finish=function(){
          image.removeEventListener("load",finish);
          image.removeEventListener("error",finish);
          if(image.naturalWidth>0)resolve();
          else reject(new Error("Package image unavailable"));
        };
        image.addEventListener("load",finish);
        image.addEventListener("error",finish);
      });
    })).then(()=>true,()=>false).finally(()=>packageImagePreparations.delete(card));
    // Share only an in-flight decode. Recheck on later flips after possible memory eviction.
    packageImagePreparations.set(card,preparation);
    return preparation;
  }

  function finishPackageFlip(card){
    const flip=card.querySelector(".flip-control");
    const zoom=card.querySelector(".zoom-control");
    card.classList.remove("is-flipping");
    card.classList.remove("is-preparing");
    card.querySelector(".box-select").removeAttribute("aria-busy");
    flip.disabled=false;
    zoom.disabled=false;
    updatePackageControls(card);
  }

  async function flipPackage(card){
    if(card.classList.contains("is-flipping"))return false;
    if(card.classList.contains("is-preparing"))return false;
    if(card.classList.contains("is-dragging")||card.classList.contains("is-drag-settling"))return false;
    const box=card.querySelector(".box-object");
    const flip=card.querySelector(".flip-control");
    const zoom=card.querySelector(".zoom-control");
    const flipped=!card.classList.contains("is-flipped");
    card.classList.add("is-preparing");
    card.querySelector(".box-select").setAttribute("aria-busy","true");
    flip.disabled=true;
    zoom.disabled=true;
    if(!await preparePackageImages(card)){
      finishPackageFlip(card);
      announce("That box image could not be prepared. Please try the flip again.",true);
      return false;
    }
    announce("",false);
    // Give the decoded surfaces a paint opportunity before moving the solid box.
    if(!reducedMotion.matches){
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    }
    // Recheck in case the accessibility preference changed while preparing.
    if(reducedMotion.matches){
      card.classList.toggle("is-flipped",flipped);
      finishPackageFlip(card);
      return true;
    }
    card.classList.remove("is-preparing");
    card.classList.add("is-flipping");
    const onFlipEnd=function(event){
      if(event.target!==box||event.propertyName!=="transform")return;
      box.removeEventListener("transitionend",onFlipEnd);
      box.removeEventListener("transitioncancel",onFlipEnd);
      finishPackageFlip(card);
    };
    box.addEventListener("transitionend",onFlipEnd);
    box.addEventListener("transitioncancel",onFlipEnd);
    card.classList.toggle("is-flipped",flipped);
    return true;
  }

  function setViewerFace(card,side){
    const edition=registry.edition(card.dataset.edition);
    const image=card.querySelector(`.box-${side} .box-art`);
    if(!edition||!image)return;
    viewerSide=side;
    packageViewerTitle.textContent=`${edition.shortLabel} — ${side}`;
    packageViewerImage.src=image.currentSrc||image.src;
    packageViewerImage.alt=image.alt;
    renderPackageTranscript(packageCopy[card.dataset.edition+":"+side]);
    packageTranscript.scrollTop=0;
    viewerRotate.setAttribute("aria-label",`Rotate to ${side==="front"?"back":"front"}`);
  }

  function finishViewerTurn(turn,applyFace){
    if(viewerTurn!==turn)return;
    turn.box.removeEventListener("transitionend",turn.onEnd);
    turn.box.removeEventListener("transitioncancel",turn.onEnd);
    viewerTurn=null;
    if(applyFace&&packageViewer.open)setViewerFace(viewerCard,turn.side);
    turn.host.remove();
    viewerStage.classList.remove("is-turning");
    viewerStage.removeAttribute("aria-busy");
    for(const control of [viewerRotate,viewerFit,viewerActual,viewerCopy])control.disabled=false;
    // Disabling the action may move focus to the body. Restore it only if the
    // reader has not moved on to Close or another control during the turn.
    if(packageViewer.open&&turn.restoreFocus&&document.activeElement===document.body)viewerRotate.focus();
  }

  function positionViewerTurn(turn){
    const imageRect=packageViewerImage.getBoundingClientRect();
    const stageRect=viewerStage.getBoundingClientRect();
    turn.host.style.width=imageRect.width+"px";
    turn.host.style.height=imageRect.height+"px";
    turn.host.style.left=(imageRect.left-stageRect.left+viewerStage.scrollLeft)+"px";
    turn.host.style.top=(imageRect.top-stageRect.top+viewerStage.scrollTop)+"px";
    turn.host.style.setProperty("--box-depth",imageRect.width*0.09+"px");
    turn.host.style.perspective=imageRect.width*5+"px";
  }

  function createViewerTurn(mode){
    const host=document.createElement("div");
    host.className="viewer-turntable";
    host.setAttribute("aria-hidden","true");
    host.classList.toggle("is-flipped",viewerSide==="back");
    const box=viewerCard.querySelector(".box-object").cloneNode(true);
    host.append(box);
    const stock=getComputedStyle(viewerCard);
    for(const name of ["--box-stock","--box-ink"])host.style.setProperty(name,stock.getPropertyValue(name));
    const turn={host,box,side:viewerSide,onEnd:null,restoreFocus:false,mode};
    viewerTurn=turn;
    viewerStatus.textContent="";
    viewerStage.setAttribute("aria-busy","true");
    for(const control of [viewerRotate,viewerFit,viewerActual,viewerCopy])control.disabled=true;
    viewerStage.append(host);
    return turn;
  }

  async function prepareViewerDrag(turn){
    const ready=await preparePackageImages(turn.host);
    if(viewerTurn!==turn)return false;
    if(!ready){
      finishViewerTurn(turn,false);
      viewerPointer=null;
      viewerStatus.textContent="That box image could not be prepared. Please try dragging again.";
      return false;
    }
    positionViewerTurn(turn);
    turn.host.classList.add("is-ready");
    viewerStage.classList.add("is-turning");
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    if(viewerTurn!==turn)return false;
    turn.drag.ready=true;
    turn.host.classList.add("is-dragging");
    turn.box.style.setProperty("--drag-angle",turn.drag.angle+"deg");
    // A quick swipe can end before decoding finishes. Preserve one painted
    // drag frame so the subsequent settling transform always has a real
    // transition (and therefore a reliable transitionend cleanup event).
    if(turn.drag.released)requestAnimationFrame(()=>settleViewerDrag(turn));
    return true;
  }

  function settleViewerDrag(turn){
    if(viewerTurn!==turn)return false;
    const drag=turn.drag;
    const projected=drag.angle+Math.max(-0.65,Math.min(0.65,drag.cancelled?0:drag.velocity))*150;
    const targetAngle=Math.round(projected/180)*180;
    turn.side=Math.abs(Math.round(targetAngle/180)%2)===1?"back":"front";
    turn.host.classList.remove("is-dragging");
    turn.host.classList.add("is-drag-settling");
    turn.box.style.setProperty("--drag-angle",targetAngle+"deg");
    if(reducedMotion.matches||Math.abs(targetAngle-drag.angle)<0.15){
      finishViewerTurn(turn,true);
      return true;
    }
    turn.onEnd=function(event){
      if(event.target===turn.box&&event.propertyName==="transform")finishViewerTurn(turn,true);
    };
    turn.box.addEventListener("transitionend",turn.onEnd);
    turn.box.addEventListener("transitioncancel",turn.onEnd);
    return true;
  }

  function beginViewerPointer(event){
    if(!packageViewer.open||!viewerCard||viewerTurn)return;
    if(event.pointerType==="mouse"&&event.button!==0)return;
    viewerPointer={
      pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,
      startAngle:viewerSide==="back"?180:0,
      angle:viewerSide==="back"?180:0,
      lastX:event.clientX,lastTime:event.timeStamp,velocity:0,active:false,turn:null
    };
  }

  function moveViewerPointer(event){
    const drag=viewerPointer;
    if(!drag||drag.pointerId!==event.pointerId)return;
    const dx=event.clientX-drag.startX;
    const dy=event.clientY-drag.startY;
    if(!drag.active){
      if(Math.abs(dx)<7)return;
      if(Math.abs(dy)>Math.abs(dx)*0.9)return;
      drag.active=true;
      const turn=createViewerTurn("drag");
      turn.drag=drag;
      drag.turn=turn;
      if(packageViewerImage.setPointerCapture)packageViewerImage.setPointerCapture(event.pointerId);
      prepareViewerDrag(turn);
    }
    event.preventDefault();
    const width=Math.max(240,packageViewerImage.getBoundingClientRect().width||0);
    const rawAngle=drag.startAngle+(dx/width)*230;
    const stop=Math.round(rawAngle/180)*180;
    const distance=rawAngle-stop;
    drag.angle=Math.abs(distance)<18?stop+distance*0.28:rawAngle;
    const elapsed=Math.max(8,event.timeStamp-drag.lastTime);
    const instant=((event.clientX-drag.lastX)/width*230)/elapsed;
    drag.velocity=drag.velocity*0.68+instant*0.32;
    drag.lastX=event.clientX;
    drag.lastTime=event.timeStamp;
    if(drag.turn)drag.turn.box.style.setProperty("--drag-angle",drag.angle+"deg");
  }

  function releaseViewerPointer(event){
    const drag=viewerPointer;
    if(!drag||drag.pointerId!==event.pointerId)return;
    viewerPointer=null;
    if(packageViewerImage.hasPointerCapture&&packageViewerImage.hasPointerCapture(event.pointerId))packageViewerImage.releasePointerCapture(event.pointerId);
    if(!drag.active)return;
    suppressViewerDoubleClickUntil=Date.now()+450;
    drag.released=true;
    drag.cancelled=event.type==="pointercancel";
    if(drag.turn?.drag.ready)settleViewerDrag(drag.turn);
  }

  async function rotateViewerPackage(){
    if(!packageViewer.open||!viewerCard||viewerTurn)return false;
    // Borrow the shelf's six faces, not its selection or front/back state.
    // The flat inspection image preserves exact Fit/100% sizing and scrolling at rest.
    const host=document.createElement("div");
    host.className="viewer-turntable";
    host.setAttribute("aria-hidden","true");
    host.classList.toggle("is-flipped",viewerSide==="back");
    const box=viewerCard.querySelector(".box-object").cloneNode(true);
    host.append(box);
    const stock=getComputedStyle(viewerCard);
    for(const name of ["--box-stock","--box-ink"])host.style.setProperty(name,stock.getPropertyValue(name));
    const turn={host,box,side:viewerSide==="front"?"back":"front",onEnd:null,restoreFocus:document.activeElement===viewerRotate};
    turn.onEnd=function(event){
      if(event.target===box&&event.propertyName==="transform")finishViewerTurn(turn,true);
    };
    viewerTurn=turn;
    viewerStatus.textContent="";
    viewerStage.setAttribute("aria-busy","true");
    for(const control of [viewerRotate,viewerFit,viewerActual,viewerCopy])control.disabled=true;
    viewerStage.append(host);
    const ready=await preparePackageImages(host);
    // Close/reopen or resize may have cancelled this preparation in the meantime.
    if(viewerTurn!==turn)return false;
    if(!ready){
      finishViewerTurn(turn,false);
      viewerStatus.textContent="That box image could not be prepared. Please try Rotate again.";
      return false;
    }
    if(reducedMotion.matches){finishViewerTurn(turn,true);return true;}
    const imageRect=packageViewerImage.getBoundingClientRect();
    const stageRect=viewerStage.getBoundingClientRect();
    host.style.width=imageRect.width+"px";
    host.style.height=imageRect.height+"px";
    host.style.left=(imageRect.left-stageRect.left+viewerStage.scrollLeft)+"px";
    host.style.top=(imageRect.top-stageRect.top+viewerStage.scrollTop)+"px";
    host.style.setProperty("--box-depth",imageRect.width*0.09+"px");
    host.style.perspective=imageRect.width*5+"px";
    host.classList.add("is-ready");
    viewerStage.classList.add("is-turning");
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    if(viewerTurn!==turn)return false;
    if(reducedMotion.matches){finishViewerTurn(turn,true);return true;}
    box.addEventListener("transitionend",turn.onEnd);
    box.addEventListener("transitioncancel",turn.onEnd);
    host.classList.add("is-rotating");
    host.classList.toggle("is-flipped",turn.side==="back");
    return true;
  }

  function showPackage(card){
    if(viewerTurn)finishViewerTurn(viewerTurn,false);
    viewerCard=card;
    viewerStatus.textContent="";
    setViewerFace(card,packageSide(card));
    viewerTrigger=card.querySelector(".zoom-control");
    showPackageTranscript(false);
    setViewerMode("fit");
    packageViewer.showModal();
  }

  function closeDialogs(){
    for(const dialog of [packageViewer,sessionDialog,replaceDialog,conflictDialog]){
      if(dialog.open)dialog.close();
    }
  }

  function navigateWithHandoff(intent,takeover){
    const edition=registry.launcherEdition(selected);
    const destination=registry.resolveLauncherRoute(selected,window.location.href);
    if(!edition||!destination){announce("That edition is not available for launcher play.",true);return false;}
    const result=coordinator.createHandoff({
      editionId:selected,
      intent,
      takeover:!!takeover,
      origin:window.location.origin,
      returnPath:new URL("./",window.location.href).pathname,
      fallbackPath:new URL("./",window.location.href).pathname
    });
    if(!result.ok){
      if(result.reason==="active-owner"){
        pendingIntent=intent;
        closeDialogs();
        conflictCopy.textContent=result.stale
          ? "An earlier tab has stopped reporting, but it still owns this voyage. Takeover is explicit and will continue only from the latest canonical save."
          : "The canonical voyage is active in another tab. Taking over will fence that tab out and continue only from the latest saved snapshot.";
        conflictDialog.showModal();
      }else{
        announce("The launcher could not establish protected voyage ownership. Nothing was changed.",true);
      }
      return false;
    }
    closeDialogs();
    destination.search="";
    destination.searchParams.set("handoff",result.token);
    window.location.assign(destination.href);
    return true;
  }

  for(const card of cards){
    // Warm both faces, including the initially hidden back, without delaying the launcher.
    preparePackageImages(card);
    installPackageDrag(card);
    card.querySelector(".box-select").addEventListener("click",function(){
      if((suppressedPackageClicks.get(card)||0)>Date.now())return;
      selectEdition(card.dataset.edition);
    });
    card.querySelector(".zoom-control").addEventListener("click",function(){showPackage(card);});
    card.querySelector(".flip-control").addEventListener("click",function(){flipPackage(card);});
    const play=card.querySelector(".card-play");
    play.disabled=!registry.launcherEdition(card.dataset.edition);
    play.addEventListener("click",function(){openEditionSession(card.dataset.edition);});
    updatePackageControls(card);
  }

  packageViewer.addEventListener("click",function(event){
    if(event.target===packageViewer)packageViewer.close();
  });
  packageViewer.addEventListener("close",function(){
    if(viewerTurn)finishViewerTurn(viewerTurn,false);
    viewerPointer=null;
    viewerCard=null;
    packageViewerImage.removeAttribute("src");
    packageViewerImage.alt="";
    showPackageTranscript(false);
    setViewerMode("fit");
    const trigger=viewerTrigger;
    viewerTrigger=null;
    if(trigger)trigger.focus();
  });
  viewerFit.addEventListener("click",function(){setViewerMode("fit");});
  viewerActual.addEventListener("click",function(){setViewerMode("actual");});
  viewerRotate.addEventListener("click",rotateViewerPackage);
  packageViewerImage.addEventListener("pointerdown",beginViewerPointer);
  packageViewerImage.addEventListener("pointermove",moveViewerPointer);
  packageViewerImage.addEventListener("pointerup",releaseViewerPointer);
  packageViewerImage.addEventListener("pointercancel",releaseViewerPointer);
  window.addEventListener("resize",function(){
    if(viewerTurn)finishViewerTurn(viewerTurn,false);
  });
  viewerCopy.addEventListener("click",function(){showPackageTranscript(packageTranscript.hidden);});
  packageViewerImage.addEventListener("dblclick",function(){
    if(Date.now()<suppressViewerDoubleClickUntil)return;
    setViewerMode(viewerMode==="fit"?"actual":"fit");
  });

  newButton.addEventListener("click",function(){
    if(canonicalSaveExists()){
      sessionDialog.close();
      replaceDialog.showModal();
    }else navigateWithHandoff("new",false);
  });

  continueButton.addEventListener("click",function(){
    if(!canonicalSaveExists())return updateSaveStatus();
    navigateWithHandoff("continue",false);
  });

  confirmNewButton.addEventListener("click",function(){navigateWithHandoff("new",false);});
  takeOverButton.addEventListener("click",function(){
    const intent=pendingIntent;
    pendingIntent=null;
    if(intent)navigateWithHandoff(intent,true);
  });
  replaceDialog.addEventListener("close",function(){
    if(this.returnValue==="cancel")sessionDialog.showModal();
  });
  conflictDialog.addEventListener("close",function(){
    if(this.returnValue==="cancel"){
      pendingIntent=null;
      announce("The existing voyage session and canonical save were preserved.",false);
    }
  });

  window.addEventListener("pageshow",function(){
    const remembered=coordinator.rememberedSelection();
    if(remembered)selectEdition(remembered);
    updateSaveStatus();
  });
  window.addEventListener("storage",function(event){
    if(event.key===voyageApi.KEYS.canonicalSave)updateSaveStatus();
  });

  const remembered=coordinator.rememberedSelection();
  if(remembered)selected=remembered;
  selectEdition(selected);
  updateSaveStatus();

  globalThis.__RAMA_LAUNCHER=Object.freeze({
    canonicalSaveExists,
    selectEdition,
    selectedEdition:()=>selected,
    navigateWithHandoff,
    flipPackage,
    setViewerMode,
    showPackageTranscript,
    coordinator
  });
})();
