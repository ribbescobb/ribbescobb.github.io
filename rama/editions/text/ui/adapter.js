"use strict";

/* =====================================================================
   TEXT PRESENTATION ADAPTER
   ===================================================================== */
const TEXT_ACT_NAMES={1:"Act I — Rama",2:"Act II — The Node",3:"Act III — Return",4:"Postlude"};
let HIST=[], HPOS=-1;
let TEXT_ADAPTER_HOST=null, TEXT_OUTPUT_SINK=null, TEXT_FRAME_REVISION=0, TEXT_ADAPTER_RENDERER_ID="text";
let TEXT_SESSION_WRITABLE=true;
let TEXT_PRESENTATION_RECORDS=[];
let TEXT_PRESENTATION_REVISION=0;

function textSystemAction(id,label,command){
  return {id,label,enabled:true,action:{type:"system",command}};
}

function textMoveAction(direction){
  return {id:"move-"+direction,label:direction.toUpperCase(),enabled:true,action:{type:"move",direction}};
}

function textAnswerAction(questionId,label,choice){
  return {id:"answer-"+choice,label,enabled:true,action:{type:"answer",questionId,choice}};
}

function textTouchFirstViewport(){
  return typeof matchMedia==="function"&&matchMedia("(pointer: coarse)").matches;
}

function textSceneFacts(actors){
  return {
    act:S.act,
    phase:S.phase,
    location:S.loc,
    ended:S.ended===true,
    ending:S.ending||null,
    inventoryEmpty:S.inv.length===0,
    community:S.rel.community,
    borzovStatus:S.borzov,
    questionId:S.pendingQuestion?S.pendingQuestion.id:null,
    flags:{
      campIntro:F().campIntro===true,
      campLoss:F().campLoss===true,
      biotSeen:F().biotSeen===true,
      biotGone:F().biotGone===true,
      katieFound:F().katieFound===true,
      betaOpen:F().betaOpen===true,
      betaIntro:F().betaIntro===true,
      ramaDawn:F().ramaDawn===true,
      boatDamaged:F().boatDamaged===true,
      nyIntro:F().nyIntro===true,
      fell:F().fell===true,
      rescued:F().rescued===true,
      falstaffHere:F().falstaffHere===true,
      signalDone:F().signalDone===true,
      cableDown:F().cableDown===true,
      nodeCorridor:F().nodeCorridor===true,
      interviewDone:F().interviewDone===true,
      obsSeen:F().obsSeen===true,
      designOpen:F().designOpen===true,
      designStarted:F().designStarted===true,
      designDone:F().designDone===true,
      feverCured:F().feverCured===true,
      waterDone:F().waterDone===true,
      clinicIntro:F().clinicIntro===true,
      serumMade:F().serumMade===true,
      serumDone:F().serumDone===true,
      voteScene:F().voteScene===true,
      voteDone:F().voteDone===true,
      trialScene:F().trialScene===true,
      trialDone:F().trialDone===true,
      richardMissing:F().richardMissing===true,
      cellOpen:F().cellOpen===true,
      rescuer:F().rescuer||null,
      grillOpened:F().grillOpened===true,
      campRevisit:F().campRevisit===true,
      betaRevisit:F().betaRevisit===true
    },
    knowledge:{
      biots:K().k_biots===true,
      dawn:K().k_dawn===true,
      sirius:K().k_sirius===true,
      eagleMet:K().k_eagleMet===true
    },
    items:{
      boatLocation:ITEMS.boat?ITEMS.boat.loc:null,
      skiffLocation:ITEMS.skiff?ITEMS.skiff.loc:null
    },
    actorIds:actors.map(actor=>actor.id)
  };
}

function textCanonicalScene(actors){
  const identityLayer=globalThis.RamaSceneIdentity;
  if(!identityLayer||typeof identityLayer.resolve!=="function"){
    throw new Error("RAMA canonical scene identity layer is unavailable.");
  }
  if(typeof identityLayer.resolveOutput==="function"){
    const outputScene=identityLayer.resolveOutput(TEXT_PRESENTATION_RECORDS.length?TEXT_PRESENTATION_RECORDS:BUF);
    if(outputScene) return outputScene;
  }
  return identityLayer.resolve(textSceneFacts(actors));
}

function textAvailableActions(exits){
  const actions=[];
  if(S.pendingQuestion){
    for(const [label,choice] of questionChoices(S.pendingQuestion)){
      actions.push(textAnswerAction(S.pendingQuestion.id,label,choice));
    }
  } else if(S.ended){
    actions.push(textSystemAction("restart","RESTART","restart"),textSystemAction("transcript","TRANSCRIPT","transcript"));
  } else if(S.phase==="act2_interview"||S.phase==="act3_vote"&&F().voteScene&&!F().voteDone||S.phase==="act3_trial"&&F().trialScene&&!F().trialDone){
    actions.push(
      textSystemAction("honestly","HONESTLY","honestly"),
      textSystemAction("curated","CURATED","curated"),
      textSystemAction("refuse","REFUSE","refuse"),
      textSystemAction("think","THINK","think")
    );
  } else if(S.phase==="act3_alloc"){
    actions.push(
      textSystemAction("sickest","SICKEST","sickest"),
      textSystemAction("children","CHILDREN","children"),
      textSystemAction("lottery","LOTTERY","lottery"),
      textSystemAction("think","THINK","think")
    );
  } else if(S.act===4){
    actions.push(
      textSystemAction("ask-god","ASK EAGLE ABOUT GOD","ask eagle about god"),
      textSystemAction("ask-rama","RAMA","ask eagle about rama"),
      textSystemAction("ask-family","FAMILY","ask eagle about family"),
      textSystemAction("ask-purpose","PURPOSE","ask eagle about purpose"),
      textSystemAction("inventory","INVENTORY","inventory")
    );
  } else {
    actions.push(
      textSystemAction("look","LOOK","look"),
      textSystemAction("think","THINK","think"),
      textSystemAction("hint","HINT","hint"),
      textSystemAction("inventory","INV","inventory")
    );
    for(const exit of exits) actions.push(textMoveAction(exit.direction));
    const localCharacters=charsAt(S.loc).filter(id=>CHARS[id].loc!=="party");
    if(localCharacters.length===1){
      const id=localCharacters[0];
      actions.push({
        id:"talk-"+id,label:"TALK",enabled:true,
        action:{type:"act",verb:"talk",target:id,prep:"to"}
      });
    }
  }
  return actions;
}

function readTextFrame(){
  const room=WORLD[S.loc];
  const exitDirections=room?exitsOf(room):[];
  const exits=exitDirections.map(direction=>({
    direction,label:direction.charAt(0).toUpperCase()+direction.slice(1),
    action:{type:"move",direction}
  }));
  const actors=charsAt(S.loc).map(id=>({id,label:CHARS[id].name}));
  const scene=textCanonicalScene(actors);
  const profile=globalThis.RamaEditionPresentationProfile;
  const continuity=profile==="act-one-continuity"||profile==="act-two-continuity"||profile==="act-three-continuity";
  const facts=continuity?textSceneFacts(actors):null;
  const presentation=continuity
    ? globalThis.RamaSceneIdentity.resolveActOnePresentation(facts,TEXT_PRESENTATION_RECORDS.length?TEXT_PRESENTATION_RECORDS:BUF)
      ||(["act-two-continuity","act-three-continuity"].includes(profile)?globalThis.RamaSceneIdentity.resolveActTwoPresentation(facts):null)
      ||(profile==="act-three-continuity"?globalThis.RamaSceneIdentity.resolveActThreePresentation(facts):null)
      ||(profile==="act-three-continuity"?globalThis.RamaSceneIdentity.resolvePostludePresentation(facts):null)
    : null;
  const objects=[];
  for(const id of itemsAt(S.loc)){
    if(!ITEMS[id].hidden) objects.push({id,label:ITEMS[id].name,kind:"item"});
  }
  for(const id of (room&&room.scenery)||[]){
    if(SCENERY[id]) objects.push({id,label:SCENERY[id].name,kind:"scenery"});
  }
  const mode=S.pendingQuestion?"question":(S.ended?"ended":"normal");
  const availableActions=textAvailableActions(exits).map(available=>TEXT_SESSION_WRITABLE?available:{...available,enabled:false});
  return {
    revision:TEXT_FRAME_REVISION++,
    room:{id:S.loc,label:(room&&room.name)||"Unknown location"},
    ...(scene?{scene}:{}),
    ...(presentation?{presentation:{...presentation,revision:TEXT_PRESENTATION_REVISION}}:{}),
    actors,objects,exits,
    actions:availableActions,
    ui:{
      mode,
      locationLabel:(room&&room.name)||"Unknown location",
      actLabel:TEXT_ACT_NAMES[S.act]||"Unknown act",
      inputEnabled:mode!=="ended"&&TEXT_SESSION_WRITABLE
    }
  };
}

function textActionNoun(id){
  if(CHARS[id]) return (CHARS[id].alias&&CHARS[id].alias[0])||CHARS[id].name;
  if(ITEMS[id]) return (ITEMS[id].alias&&ITEMS[id].alias[0])||ITEMS[id].name;
  if(SCENERY[id]) return (SCENERY[id].alias&&SCENERY[id].alias[0])||SCENERY[id].name;
  return id;
}

function textCommandForAction(action){
  if(action.type==="move") return action.direction;
  if(action.type==="answer") return action.choice;
  if(action.type==="system") return action.command;
  let command=action.verb;
  if(action.target){
    if(action.prep&&!action.instrument) command+=" "+action.prep+" "+textActionNoun(action.target);
    else command+=" "+textActionNoun(action.target);
  }
  if(action.instrument){ command+=" "+(action.prep||"with")+" "+textActionNoun(action.instrument); }
  return command;
}

function runTextCommand(raw){
  raw=(raw||"").trim();
  if(!raw) return;
  BUF.push({k:"echo",t:raw});
  HIST.push(raw); HPOS=HIST.length;
  doCommand(raw);
  flush(); refreshUI();
}

function dispatchTextAction(action){
  if(!TEXT_SESSION_WRITABLE) return false;
  globalThis.RamaRendererContract.assertSemanticAction(action);
  return runTextCommand(textCommandForAction(action));
}

/* Compatibility names retained for the frozen core's three presentation callbacks. */
function flush(){
  if(typeof document==="undefined"||!TEXT_ADAPTER_HOST||!TEXT_OUTPUT_SINK) return;
  const records=BUF.slice(); BUF.length=0; TEXT_PRESENTATION_RECORDS=records;
  TEXT_PRESENTATION_REVISION++; TEXT_OUTPUT_SINK(records);
}

function refreshUI(){
  if(typeof document==="undefined"||!TEXT_ADAPTER_HOST) return;
  TEXT_ADAPTER_HOST.render();
}

function bootTextAdapter(){
  const elements={
    title:document.getElementById("title"),begin:document.getElementById("btn-begin"),
    cont:document.getElementById("btn-continue"),stloc:document.getElementById("st-loc"),
    stact:document.getElementById("st-act"),transcript:document.getElementById("transcript"),
    scrollwrap:document.getElementById("scrollwrap"),chips:document.getElementById("chips"),
    cmd:document.getElementById("cmd")
  };
  defineWorld();
  if(storageOK()){ try{ localStorage.removeItem("rama_if_save_v1"); }catch(e){} }
  let hasSave=false; try{ hasSave=storageOK()&&!!localStorage.getItem(SAVEKEY); }catch(e){}
  const target={
    elements,hasSave,started:false,
    onBegin:function(){ const started=hardRestart(); refreshUI(); return started; },
    onContinue:function(){ const restored=doLoad(); flush(); refreshUI(); return restored; },
    start:function(intent){
      if(target.started) return false;
      if(intent!=="new"&&intent!=="continue") return false;
      target.started=true;
      elements.title.style.display="none";
      const started=intent==="new"?target.onBegin():target.onContinue();
      if(started===false&&intent==="continue") TEXT_SESSION_WRITABLE=false;
      // Let mobile players start by tapping suggestions without opening the
      // software keyboard over the newly opened game.
      if(TEXT_SESSION_WRITABLE&&!textTouchFirstViewport()) elements.cmd.focus();
      return started!==false;
    }
  };
  const rendererFactory=globalThis.RamaEditionRendererFactory;
  if(typeof rendererFactory!=="function") throw new Error("No RAMA edition renderer factory is registered.");
  const renderer=rendererFactory();
  TEXT_ADAPTER_RENDERER_ID=renderer.id;
  TEXT_ADAPTER_HOST=globalThis.RamaRendererContract.createRendererHost({
    renderer,
    readFrame:readTextFrame,
    dispatch:dispatchTextAction,
    subscribe:function(listener){ TEXT_OUTPUT_SINK=listener; return function(){ TEXT_OUTPUT_SINK=null; }; }
  });
  TEXT_ADAPTER_HOST.mount(target);
  globalThis.RamaEditionLifecycle=Object.freeze({
    editionId:function(){ return TEXT_ADAPTER_RENDERER_ID; },
    start:function(intent){ return target.start(intent); },
    setWritable:function(writable){
      TEXT_SESSION_WRITABLE=!!writable;
      if(TEXT_ADAPTER_HOST) TEXT_ADAPTER_HOST.render();
      return TEXT_SESSION_WRITABLE;
    },
    isWritable:function(){ return TEXT_SESSION_WRITABLE; }
  });
}

if(typeof document!=="undefined"){
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bootTextAdapter);
  else bootTextAdapter();
}

/* headless test hooks */
if(typeof globalThis!=="undefined"){
  globalThis.__RAMA={
    newGame:function(){ resetWorld(); S=freshState(); BUF.length=0; TEXT_PRESENTATION_RECORDS=[]; openingScene(); },
    cmd:function(raw){ BUF.push({k:"echo",t:raw}); doCommand(raw); },
    drain:function(){ const txt=BUF.map(b=>b.k==="act"?("== "+b.num+": "+b.name+" =="):b.t).join("\n"); BUF.length=0; return txt; },
    state:function(){ return S; },flags:function(){ return S.flags; },know:function(){ return S.know; },
    save:function(){ return doSave(true); },load:function(){ return doLoad(); },
    coldBoot:function(){ resetWorld(); S=freshState(); BUF.length=0; TEXT_PRESENTATION_RECORDS=[]; },
    expeditionLog:function(){ return expeditionLog(); },
    items:function(){ return ITEMS; },chars:function(){ return CHARS; },
    rendererFrame:function(){ return readTextFrame(); },
    semanticAction:function(action){ return dispatchTextAction(action); },
    rendererStatus:function(){ return {id:TEXT_ADAPTER_RENDERER_ID,wired:true,mounted:!!TEXT_ADAPTER_HOST}; }
  };
}
