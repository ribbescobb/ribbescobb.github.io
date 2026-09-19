"use strict";

/* ---------- derived expedition log ---------- */
const LOG_ENTRIES = [
  {id:"reach_alpha", active:()=>S.phase==="arrival",
    text:"Descend to the Central Plain, then go east to Camp Alpha for the survey assignment."},
  {id:"report_survey", active:()=>S.phase==="survey"&&K().k_sample&&K().k_biots&&!F().reportedBiots,
    text:"Report the biot observations to Richard or the crew at Camp Alpha."},
  {id:"survey_sample", active:()=>S.phase==="survey"&&!K().k_sample,
    text:"Collect a survey sample from Rama's plain."},
  {id:"survey_biots", active:()=>S.phase==="survey"&&!K().k_biots,
    text:"Document one of Rama's biots photographically."},

  {id:"borzov_diagnosis", active:()=>S.phase==="borzov"&&!K().k_diag,
    text:"Examine and diagnose General Borzov."},
  {id:"borzov_treatment", active:()=>S.phase==="borzov_decide"&&S.borzov==="sick",
    text:"Choose a treatment plan for General Borzov."},
  {id:"reach_sea", active:()=>S.phase==="storm_prep",
    text:"Continue the expedition at the Cylindrical Sea."},
  {id:"secure_resolution", active:()=>S.phase==="storm"&&!F().boatSecured,
    text:"Secure the Resolution before Raman dawn."},
  {id:"warn_alpha", active:()=>S.phase==="storm"&&!F().stormWarned,
    text:"Warn Camp Alpha about the approaching weather."},
  {id:"witness_dawn", active:()=>S.phase==="storm"&&F().boatSecured&&F().stormWarned,
    text:"The boat and camp are prepared. Wait to witness Raman dawn."},
  {id:"repair_resolution", active:()=>S.phase==="crossing"&&F().boatDamaged&&!F().boatFixed,
    text:"Make the Resolution seaworthy again."},
  {id:"cross_sea", active:()=>S.phase==="crossing",
    text:"Cross the Cylindrical Sea to New York."},
  {id:"survey_new_york", active:()=>S.phase==="newyork",
    text:"Survey New York and investigate the source of its hum."},
  {id:"stabilize_injuries", active:()=>S.phase==="pit"&&S.pit.hurt&&!S.pit.splinted,
    text:"Assess and stabilize Nicole's injuries."},
  {id:"escape_pit", active:()=>S.phase==="pit",
    text:"Find a way back to the expedition."},
  {id:"await_michael", active:()=>S.phase==="stranded"&&!F().michaelArrived,
    text:"Hold at New York until Michael reaches the island."},
  {id:"find_shelter", active:()=>S.phase==="stranded"&&F().michaelArrived,
    text:"Choose a safe way forward before Rama departs."},

  {id:"richard_discovery", active:()=>S.phase==="act2_voyage",
    text:"Review Richard's discovery in the atrium."},
  {id:"find_katie", active:()=>S.phase==="katie_lost",
    text:()=>S.loc==="avian_shaft"?"SHOUT for Katie in the Avian Vertical.":"Find Katie in the Avian Vertical."},
  {id:"approach_sirius", active:()=>S.phase==="act2_node_wait",
    text:"Remain with the family while Rama completes its approach to Sirius."},
  {id:"enter_node", active:()=>S.phase==="act2_arrival",
    text:"Follow the opened corridor beyond the lair."},
  {id:"meet_eagle", active:()=>S.phase==="act2_eagle",
    text:"Learn what the Eagle will share about the Node."},
  {id:"eagle_interview", active:()=>S.phase==="act2_interview",
    text:"Answer the Eagle's current question."},
  {id:"explore_node", active:()=>S.phase==="act2_settled",
    text:"Explore the Node with the family."},
  {id:"treat_simone", active:()=>S.phase==="simone_fever"&&!F().feverCured,
    text:"Find a treatment for Simone's fever."},
  {id:"design_new_eden", active:()=>S.phase==="act2_settled2"&&!F().designDone,
    text:"Help define New Eden's founding parameters."},
  {id:"ask_next", active:()=>S.phase==="act2_request_wait"&&!F().requestGiven,
    text:"Ask the Eagle what comes next for the family."},
  {id:"say_farewell", active:()=>S.phase==="act2_farewell",
    text:"Say farewell before leaving the Node."},

  {id:"rv41", active:()=>S.phase==="act3_open"&&!F().serumDone,
    text:"Attend the RV-41 outbreak at the clinic."},
  {id:"water", active:()=>S.phase==="act3_open"&&!F().waterDone,
    text:"Restore reliable water service to New Eden."},
  {id:"make_serum", active:()=>S.phase==="act3_serum"&&!F().serumMade,
    text:"Produce a treatment for the RV-41 outbreak."},
  {id:"allocate_serum", active:()=>S.phase==="act3_alloc"&&!F().serumDone,
    text:"Decide how to allocate the limited serum."},
  {id:"election_assembly", active:()=>S.phase==="act3_vote"&&!F().voteDone,
    text:"Address New Eden's election-eve assembly."},
  {id:"trial_statement", active:()=>S.phase==="act3_trial"&&!F().trialDone,
    text:"Give Nicole's statement to the assembly."},
  {id:"wait_for_release", active:()=>S.phase==="act3_escape"&&!F().cellOpen,
    text:"Hold steady until a way out presents itself."},
  {id:"find_richard", active:()=>S.phase==="act3_escape"&&F().cellOpen,
    text:()=>THINK.act3_escape()},
  {id:"reach_sanctuary", active:()=>S.phase==="act3_sanctuary"&&!F().grillOpened,
    text:"Find Richard in the old lair beneath New York."},
  {id:"rest_with_richard", active:()=>S.phase==="act3_sanctuary"&&F().grillOpened,
    text:"Rest with Richard when Nicole is ready."},
  {id:"final_question", active:()=>S.phase==="postlude"&&!F().finalAsked&&!S.ended,
    text:"Ask the Eagle Nicole's final question."}
];

function expeditionLog(){
  if(S.ended) return {active:[]};
  const active=LOG_ENTRIES.filter(entry=>entry.active()).map(entry=>({id:entry.id,text:typeof entry.text==="function"?entry.text():entry.text}));
  // Between sub-objectives the phase is still live. Reuse the read-only,
  // progress-aware THINK guidance rather than inventing another quest state.
  if(!active.length && THINK[S.phase]){
    const guidance=THINK[S.phase];
    active.push({id:"continue_"+S.phase,text:typeof guidance==="function"?guidance():guidance});
  }
  return {
    active
  };
}
