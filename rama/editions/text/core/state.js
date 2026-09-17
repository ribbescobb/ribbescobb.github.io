"use strict";

/* ---------- game state ---------- */
function freshState(){
  return {
    act:1, phase:"arrival", loc:"hub", turn:0, verbose:true, ended:false, ending:null,
    crossingDeclined:false,
    inv:["medkit","medscan","sampler","camera","scarf","canteen"],
    flags:{}, know:{}, seen:{}, visited:{}, completedEvents:{}, pendingQuestion:null,
    rel:{ richard:2, michael:2, francesca:0, katie:2, simone:2, ellie:2, community:0 },
    borzov:"well",           // well | sick | operated | evacuated | dead
    topicsAsked:{},
    pit:{ water:3, hurt:false, splinted:false, signaled:false, waitTurns:0 },
    eagleAnswers:{},         // war, faith, fear -> honest|curated|defiant
    habitat:{},              // charter, margin, garden
    eden:{ serum:"", water:"", vote:"", katie:"", trial:[] },
    history:[]
  };
}
let S = freshState();
const F = () => S.flags;
const K = () => S.know;

function has(id){ return S.inv.includes(id); }
function take(id){ if(!has(id)) S.inv.push(id); }
function lose(id){ const i=S.inv.indexOf(id); if(i>=0) S.inv.splice(i,1); }
function here(){ return WORLD[S.loc]; }
function itemsAt(loc){ return Object.keys(ITEMS).filter(k=>ITEMS[k].loc===loc); }
function charsAt(loc){ return Object.keys(CHARS).filter(k=>(CHARS[k].loc===loc||CHARS[k].loc==="party") && !CHARS[k].gone); }


let THINK={}, HINTS={}, openingScene, pitDrink, pitSelfScan, pitTreatSelf, postludeInventory;
