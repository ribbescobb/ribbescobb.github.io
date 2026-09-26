"use strict";

(function runRamaBook(){
  const story=globalThis.RamaBookStory;
  if(!story)throw new Error("The RAMA book pages are unavailable.");

  const SAVE_KEY="rama_book_1982_save_v1";
  const openBook=document.getElementById("open-book");
  const pageAct=document.getElementById("page-act");
  const pageTitle=document.getElementById("page-title");
  const pageText=document.getElementById("page-text");
  const pageChoices=document.getElementById("page-choices");
  const pageFigure=document.getElementById("page-figure");
  const pageArt=document.getElementById("page-art");
  const printerMark=document.getElementById("printer-mark");
  const leftPageNumber=document.getElementById("left-page-number");
  const rightPageNumber=document.getElementById("right-page-number");
  const theEnd=document.getElementById("the-end");
  const turnBack=document.getElementById("turn-back");
  const resumeBook=document.getElementById("resume-book");
  const bookmarkStatus=document.getElementById("bookmark-status");
  const restartBook=document.getElementById("restart-book");
  const restartDialog=document.getElementById("restart-dialog");
  const confirmRestart=document.getElementById("confirm-restart");
  const reducedMotion=globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")||{matches:false};

  function freshState(){
    return {version:1,current:story.start,history:[],endings:[],turns:0,updatedAt:Date.now()};
  }

  function validState(candidate){
    if(!candidate||candidate.version!==1||!story.nodes[candidate.current])return false;
    if(!Array.isArray(candidate.history)||!candidate.history.every(id=>!!story.nodes[id]))return false;
    if(!Array.isArray(candidate.endings)||!candidate.endings.every(id=>typeof id==="string"))return false;
    return true;
  }

  function loadState(){
    try{
      const parsed=JSON.parse(localStorage.getItem(SAVE_KEY));
      return validState(parsed)?parsed:freshState();
    }catch(error){return freshState();}
  }

  let state=loadState();

  function saveState(message="Bookmark saved"){
    state.updatedAt=Date.now();
    localStorage.setItem(SAVE_KEY,JSON.stringify(state));
    bookmarkStatus.textContent=message;
  }

  function choiceLabel(choice){
    const destination=story.nodes[choice.to];
    return `${choice.label} — turn to page ${destination.page}`;
  }

  function render(){
    const node=story.nodes[state.current];
    pageAct.textContent=node.act;
    pageTitle.textContent=node.title;
    pageText.replaceChildren(...node.text.filter(line=>line!=="THE END").map(line=>{
      const paragraph=document.createElement("p");
      paragraph.textContent=line;
      return paragraph;
    }));
    theEnd.hidden=!node.ending;
    rightPageNumber.textContent=String(node.page);
    leftPageNumber.textContent=String(Math.max(2,node.page-(node.page%2===0?0:1)));

    if(node.art){
      pageArt.src=node.art.src;
      pageArt.alt=node.art.alt;
      pageFigure.hidden=false;
      printerMark.hidden=true;
    }else{
      pageArt.removeAttribute("src");
      pageArt.alt="";
      pageFigure.hidden=true;
      printerMark.hidden=false;
    }

    pageChoices.replaceChildren();
    if(node.ending){
      const back=document.createElement("button");
      back.type="button";
      back.className="choice-link ending-choice";
      back.textContent="Keep one finger here and return to your last choice";
      back.addEventListener("click",goBack);
      pageChoices.append(back);

      const again=document.createElement("button");
      again.type="button";
      again.className="choice-link ending-choice";
      again.textContent="Close the book and begin again at page 1";
      again.addEventListener("click",()=>restartDialog.showModal());
      pageChoices.append(again);
    }else{
      for(const choice of node.choices||[]){
        const button=document.createElement("button");
        button.type="button";
        button.className="choice-link";
        button.textContent=choiceLabel(choice);
        button.addEventListener("click",()=>choose(choice));
        pageChoices.append(button);
      }
    }
    turnBack.disabled=state.history.length===0;
    document.title=`${node.title} — RAMA: The World Within`;
    openBook.focus?.({preventScroll:true});
  }

  function turnPage(update){
    if(reducedMotion.matches){update();render();return;}
    openBook.classList.add("is-turning");
    globalThis.setTimeout(()=>{
      update();
      render();
      requestAnimationFrame(()=>openBook.classList.remove("is-turning"));
    },150);
  }

  function choose(choice){
    if(!story.nodes[choice.to])return;
    turnPage(()=>{
      state.history.push(state.current);
      state.current=choice.to;
      state.turns+=1;
      const ending=story.nodes[state.current].ending;
      if(ending&&!state.endings.includes(ending))state.endings.push(ending);
      saveState();
    });
  }

  function goBack(){
    if(!state.history.length)return;
    turnPage(()=>{
      state.current=state.history.pop();
      state.turns+=1;
      saveState("Previous page restored");
    });
  }

  function restart(){
    state=freshState();
    saveState("New bookmark started");
    restartDialog.close();
    render();
  }

  turnBack.addEventListener("click",goBack);
  restartBook.addEventListener("click",()=>restartDialog.showModal());
  confirmRestart.addEventListener("click",restart);
  resumeBook.addEventListener("click",render);
  globalThis.addEventListener("storage",event=>{
    if(event.key!==SAVE_KEY||event.newValue===null)return;
    const incoming=loadState();
    if(incoming.updatedAt<=state.updatedAt)return;
    state=incoming;
    bookmarkStatus.textContent="Bookmark refreshed from another tab";
    render();
  });

  saveState(state.turns?"Bookmark restored":"Bookmark ready");
  render();
})();
