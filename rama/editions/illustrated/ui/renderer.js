"use strict";

/* =====================================================================
   ILLUSTRATED OPENING-ARC RENDERER
   ===================================================================== */
const ILLUSTRATED_OPENING_ARC_SCENES=Object.freeze({
  "alpha_airlock_first_arrival":Object.freeze({
    src:"assets/alpha-airlock-prototype.png",
    label:"Alpha Airlock — Northern Hub",
      alt:"Sparse green line illustration of Alpha Airlock's immense enclosed chamber and descending stairway, with a tiny human figure for scale."
  }),
  "biot_procession_first_encounter":Object.freeze({
    src:"assets/biot-procession-opening-arc.png",
    label:"Central Plain — Biot Track",
    alt:"Sparse green and amber line illustration of exactly six low-slung crab biots crossing a polished machine track, with two tiny human figures far behind for scale."
  }),
  "cylindrical_sea_first_reveal":Object.freeze({
    src:"assets/cylindrical-sea-prototype.png",
    label:"Beta Camp — Shore of the Cylindrical Sea",
    alt:"Sparse blue and white line illustration from a tiny expedition camp above a black sea that curves upward inside Rama's enormous artificial cylinder."
  }),
  "raman_dawn":Object.freeze({
    src:"assets/raman-dawn.png",
    label:"Raman Dawn — Beta Shore",
    alt:"Sparse phosphor line illustration of six straight light bands igniting along Rama's inner cylinder above a ring sea, with humans reduced to tiny scale marks."
  }),
  "new_york_waterfront":Object.freeze({
    src:"assets/new-york-waterfront.png",
    label:"New York — Waterfront",
    alt:"Sparse cyan and white line illustration of a sheer artificial seawall, one ramp from the ring sea, and a doorless city rising into blackness."
  }),
  "octahedron_plaza":Object.freeze({
    src:"assets/octahedron-plaza.png",
    label:"New York — Plaza of the Octahedron",
    alt:"Sparse white line illustration of an enormous flawless octahedron balanced on one point in a black plaza, with one tiny cyan human figure for scale."
  }),
  "latticed_way_shaft":Object.freeze({
    src:"assets/latticed-way-shaft.png",
    label:"New York — The Latticed Way",
    alt:"Sparse phosphor line illustration of a silver polyhedral lattice spanning a narrow artificial way above a dark circular shaft."
  }),
  "the_pit_stranded":Object.freeze({
    src:"assets/the-pit-stranded.png",
    label:"The Pit — Stranded",
    alt:"Sparse phosphor illustration of Nicole alone in a nearly black engineered shaft chamber beneath an unreachable spiral and a tiny coin of light."
  }),
  "pit_falstaff_contact":Object.freeze({
    src:"assets/pit-falstaff-contact.png",
    label:"The Pit — Falstaff's First Contact",
    alt:"Sparse green and amber phosphor illustration of tiny brass Falstaff on the lowest hold above Nicole and three black tunnel mouths."
  }),
  "lair_family_home":Object.freeze({
    src:"assets/lair-family-home.png",
    label:"Under New York — The Lair",
    alt:"Sparse early-computer illustration of a human home built from salvage inside a black machine gallery, with a warm garden lamp, workbench, drawings, and closed grill."
  }),
  "atrium_sirius_revealed":Object.freeze({
    src:"assets/atrium-sirius.png",
    label:"The Atrium — Sirius Revealed",
    alt:"Sparse phosphor illustration of a dark artificial chamber whose wall shows Rama's elliptical course and the paired stars of Sirius."
  }),
  "avian_vertical":Object.freeze({
    src:"assets/avian-vertical.png",
    label:"The Avian Vertical",
    alt:"Sparse phosphor illustration of immense glider-like avians circling through a deep engineered vertical lined by repeating ledges."
  }),
  "node_arrival_hangar":Object.freeze({
    src:"assets/node-arrival-hangar.png",
    label:"The Node — Hangar of Light",
    alt:"Sparse pale-field illustration of Rama resting as one grey cylinder in a cradle, with five tiny family silhouettes holding hands in sourceless radiance."
  }),
  "node_hall_eagle":Object.freeze({
    src:"assets/node-hall-eagle.png",
    label:"The Node — Hall of Reception",
    alt:"Sparse early-computer line illustration of the engineered Eagle greeting exactly five human family members in a pearl dome with one dark doorway and a simple table of food."
  }),
  "node_observation_sirius":Object.freeze({
    src:"assets/node-observation.png",
    label:"The Node — Observation Gallery",
    alt:"Sparse early-computer line illustration of five family figures at a transparent gallery facing Sirius A, its white-dwarf companion, and unfamiliar moving lights."
  }),
  "design_atelier_new_eden":Object.freeze({
    src:"assets/design-atelier.png",
    label:"The Node — Design Atelier",
    alt:"Sparse early-computer line illustration of the Eagle and five family members around an unresolved waist-high light model of New Eden."
  }),
  "new_eden_plaza":Object.freeze({
    src:"assets/new-eden-plaza.png",
    label:"New Eden — Central Plaza",
    alt:"Sparse early-computer line illustration of New Eden curving upward inside Rama, with a tense well-house queue, market awnings, and unreadable election posters."
  }),
  "eden_clinic_ward":Object.freeze({
    src:"assets/eden-clinic-ward.png",
    label:"New Eden — RV-41 Ward",
    alt:"Sparse early-computer line illustration of exactly twelve clinic beds, eight occupied, with Ellie and an idle three-color dispensary pillar."
  }),
  "assembly_hall_election_eve":Object.freeze({
    src:"assets/assembly-hall-election-eve.png",
    label:"New Eden — Election Eve",
    alt:"Sparse early-computer line illustration of Nicole alone on the worn speaker's floor before a packed horseshoe assembly, before any vote is cast."
  }),
  "lair_sanctuary_octospiders":Object.freeze({
    src:"assets/lair-sanctuary-octospiders.png",
    label:"The Lair — Sanctuary",
    alt:"Sparse early-computer illustration of Nicole and Richard at a warm opened passage with exactly three calm, faceless, eight-limbed octospiders."
  }),
  "threshold_of_light":Object.freeze({
    src:"assets/threshold-of-light.png",
    label:"The Threshold",
    alt:"Sparse pale-field computer illustration of empty-handed Nicole beside the Eagle in a fading non-place, with a distant grey cylinder held in a cradle."
  }),
  "medical_hut_quiet":Object.freeze({
    src:"assets/medical-hut-quiet.png",
    label:"Camp Alpha — Quiet Medical Hut",
    alt:"Sparse early-computer line illustration of Nicole's empty fold-out medical station before the emergency."
  }),
  "london_factory_reveal":Object.freeze({
    src:"assets/london-factory-reveal.png",
    label:"London — Factory Revealed",
    alt:"Sparse green line illustration through London's slot into receding racks of separate unfinished biot shells, legs, and lensless eye housings."
  }),
  "resolution_crossing":Object.freeze({
    src:"assets/resolution-crossing.png",
    label:"Cylindrical Sea — The Resolution Crossing",
    alt:"Sparse early-computer illustration of Nicole and Richard crossing Rama's curving ring sea in the tiny Resolution while shark biots pace them."
  }),
  "new_york_narrow_ways":Object.freeze({
    src:"assets/new-york-narrow-ways.png",
    label:"New York — Narrow Ways",
    alt:"Sparse phosphor illustration of Nicole entering black slots between immense towers, with silver lattice and a partial octahedral edge."
  }),
  "rama_course_change":Object.freeze({
    src:"assets/rama-course-change.png",
    label:"Under New York — Rama Steers",
    alt:"Sparse phosphor illustration of the lair floor tilting as Rama changes course, with Richard laughing on his back while Nicole and Michael brace."
  }),
  "alpha_stairway_climb":Object.freeze({
    src:"assets/alpha-stairway-climb.png",
    label:"Alpha Stairway — The Climb",
    alt:"Sparse early-computer line illustration of Nicole and Richard descending Rama's immense Alpha stairway, dwarfed by the enclosing machine."
  }),
  "central_plain_first_footing":Object.freeze({
    src:"assets/central-plain-first-footing.png",
    label:"Central Plain — First Footing",
    alt:"Sparse early-computer line illustration of Nicole and Richard taking their first steps onto Rama's vast Central Plain beneath the upward-curving world."
  }),
  "act_ii_voyage_years":Object.freeze({
    src:"assets/act-ii-voyage-years.png",
    label:"Act II — Voyage Years",
    alt:"Sparse early-computer montage of Nicole, Richard, Michael, Simone, and Katie living and exploring together through Rama's voyage years."
  }),
  "node_dock_family_revisit":Object.freeze({
    src:"assets/node-dock-family-revisit.png",
    label:"The Node — Family Revisit",
    alt:"Sparse early-computer line illustration of Nicole, Richard, Michael, Simone, and Katie returning together to the Node dock after meeting the Eagle."
  }),
  "new_eden_gatehouse":Object.freeze({
    src:"assets/new-eden-gatehouse.png",
    label:"New Eden — The Gate",
    alt:"Sparse early-computer line illustration of New Eden's guarded gatehouse within Rama's enclosed, upward-curving habitat."
  }),
  "service_dark":Object.freeze({
    src:"assets/service-dark.png",
    label:"The Service Dark",
    alt:"Sparse early-computer line illustration of Nicole walking a narrow maintenance tunnel inside Rama's silent habitat skin."
  }),
  "twilight_in_the_lair":Object.freeze({
    src:"assets/twilight-in-the-lair.png",
    label:"The Lair — Twilight",
    alt:"Sparse early-computer line illustration of Nicole and her family living through the later quiet years in their enclosed home beneath New York."
  }),
  "postlude_inventory":Object.freeze({
    src:"assets/postlude-inventory.png",
    label:"Postlude — Inventory",
    alt:"Sparse early-computer line illustration of Nicole reviewing the small collection of objects and memories she carries at Rama's threshold."
  })
});

function illustratedContextAsset(file,label,alt){
  return Object.freeze({src:"assets/"+file+".png",label,alt});
}
const ILLUSTRATED_ACT_ONE_CONTEXTS=Object.freeze({
  alpha_airlock_exploration:ILLUSTRATED_OPENING_ARC_SCENES.alpha_airlock_first_arrival,
  alpha_upper_flights:illustratedContextAsset("alpha-upper-flights","Alpha Stairway — Upper Flights","Shallow steps and a handrail curve down an immense black bowl toward three distant expedition lights."),
  alpha_lower_flights:illustratedContextAsset("alpha-stairway-climb","Alpha Stairway — Lower Flights","Sparse stair treads and two small explorers descend toward the plain, the camp lights below."),
  central_plain_exploration:illustratedContextAsset("central-plain-first-footing","Central Plain — Foot of Alpha","Grooved machine ground at the foot of the rising stairway, with camp lights to the east."),
  camp_alpha_working:illustratedContextAsset("camp-alpha-context","Camp Alpha","Two tiny expedition huts, a communications mast, crates and a folding chess table on the vast black plain."),
  camp_alpha_storm_damage:illustratedContextAsset("camp-alpha-storm-damage","Camp Alpha — After the Storm","One expedition hut has collapsed; scattered supplies lie near the surviving hut, mast and lowered floodlights."),
  medical_hut_emergency:illustratedContextAsset("medical-hut-emergency","Medical Hut — Borzov's Emergency","Borzov lies on the surgical table guarding his abdomen; Nicole stands beside the diagnostic rack."),
  medical_hut_recovery:illustratedContextAsset("medical-hut-recovery","Medical Hut — Recovery","Borzov rests beneath a thermal sheet on the field table in Nicole's quiet medical station."),
  medical_hut_available:ILLUSTRATED_OPENING_ARC_SCENES.medical_hut_quiet,
  biot_track_active:ILLUSTRATED_OPENING_ARC_SCENES.biot_procession_first_encounter,
  biot_track_empty:illustratedContextAsset("biot-track-empty","Central Plain — Open Ground","Empty parallel grooves converge into the polished biot track; no machines remain in view."),
  london_exterior:illustratedContextAsset("london-exterior","London","Sealed blocks, drums and a low shed with one small dark slot; the interior remains unseen."),
  beta_shore_predawn:ILLUSTRATED_OPENING_ARC_SCENES.cylindrical_sea_first_reveal,
  beta_shore_daylight:ILLUSTRATED_OPENING_ARC_SCENES.raman_dawn,
  new_york_arrival_context:ILLUSTRATED_OPENING_ARC_SCENES.new_york_waterfront,
  new_york_waterfront_withdrawal:illustratedContextAsset("new-york-withdrawal","New York — Waterfront","A shore-side view of the seawall gap and towers, with empty Resolution mooring rings; the lower landing is out of view."),
  octahedron_exploration:ILLUSTRATED_OPENING_ARC_SCENES.octahedron_plaza,
  lattice_exploration:ILLUSTRATED_OPENING_ARC_SCENES.latticed_way_shaft,
  pit_waiting:ILLUSTRATED_OPENING_ARC_SCENES.the_pit_stranded,
  pit_contact_context:ILLUSTRATED_OPENING_ARC_SCENES.pit_falstaff_contact,
  pit_rescue_cable:illustratedContextAsset("pit-rescue-cable","The Pit — Rescue Cable","A lamp at the shaft mouth and a thin rescue cable reaching Nicole above the same three dark tunnels."),
  lair_first_shelter:illustratedContextAsset("lair-first-shelter","Under New York — First Shelter","Three castaways shelter in a sparse, color-banded machine gallery beneath New York.")
});

let ILLUSTRATED_TARGET=null, ILLUSTRATED_PANEL=null, ILLUSTRATED_IMAGE=null;
let ILLUSTRATED_LABEL=null, ILLUSTRATED_FALLBACK=null, ILLUSTRATED_CURRENT_ASSET="";
let ILLUSTRATED_SKIP=null, ILLUSTRATED_TIMER=null, ILLUSTRATED_PACKET_KEY="";
let ILLUSTRATED_VIEWS=[], ILLUSTRATED_VIEW_INDEX=0;
const ILLUSTRATED_FAILED_ASSETS=new Set();

function illustratedAssetFor(id){
  return ILLUSTRATED_ACT_ONE_CONTEXTS[id]||ILLUSTRATED_OPENING_ARC_SCENES[id]||null;
}
function illustratedSceneFor(frame){
  if(frame&&frame.presentation) return illustratedAssetFor(frame.presentation.context.id);
  return frame&&frame.scene?illustratedAssetFor(frame.scene.id):null;
}

function hideIllustratedScene(showFallback){
  if(!ILLUSTRATED_PANEL) return;
  ILLUSTRATED_PANEL.hidden=true;
  ILLUSTRATED_FALLBACK.hidden=!showFallback;
}

function cancelIllustratedTimer(){
  if(ILLUSTRATED_TIMER!==null) clearTimeout(ILLUSTRATED_TIMER);
  ILLUSTRATED_TIMER=null;
}

function showIllustratedView(){
  cancelIllustratedTimer();
  const scene=ILLUSTRATED_VIEWS[ILLUSTRATED_VIEW_INDEX];
  const isBeat=ILLUSTRATED_VIEW_INDEX<ILLUSTRATED_VIEWS.length-1;
  if(ILLUSTRATED_SKIP) ILLUSTRATED_SKIP.hidden=!isBeat;
  if(!scene||ILLUSTRATED_FAILED_ASSETS.has(scene.src)){
    if(isBeat){ ILLUSTRATED_VIEW_INDEX++; showIllustratedView(); return; }
    ILLUSTRATED_IMAGE.removeAttribute("src"); ILLUSTRATED_CURRENT_ASSET="";
    hideIllustratedScene(!!scene); return;
  }
  ILLUSTRATED_LABEL.textContent=scene.label;
  ILLUSTRATED_IMAGE.alt=scene.alt;
  ILLUSTRATED_PANEL.hidden=false;
  ILLUSTRATED_FALLBACK.hidden=true;
  if(ILLUSTRATED_CURRENT_ASSET!==scene.src){
    ILLUSTRATED_CURRENT_ASSET=scene.src; ILLUSTRATED_IMAGE.src=scene.src;
  }
  // Give a slow image a bounded loading window; its load event starts the display dwell.
  if(isBeat) ILLUSTRATED_TIMER=setTimeout(advanceIllustratedView,
    ILLUSTRATED_IMAGE.complete&&ILLUSTRATED_IMAGE.naturalWidth>0?4000:12000);
}

function advanceIllustratedView(){
  if(!ILLUSTRATED_TARGET) return;
  if(ILLUSTRATED_VIEW_INDEX<ILLUSTRATED_VIEWS.length-1) ILLUSTRATED_VIEW_INDEX++;
  showIllustratedView();
}

function createIllustratedRenderer(){
  const textRenderer=createTextRenderer();
  return globalThis.RamaRendererContract.defineRenderer({
    id:"illustrated",
    status:"opening-arc-production",
    mount:function(target,services){
      ILLUSTRATED_TARGET=target;
      ILLUSTRATED_PANEL=document.getElementById("scene-panel");
      ILLUSTRATED_IMAGE=document.getElementById("scene-art");
      ILLUSTRATED_LABEL=document.getElementById("scene-label");
      ILLUSTRATED_FALLBACK=document.getElementById("scene-fallback");
      ILLUSTRATED_SKIP=document.getElementById("scene-skip");
      if(ILLUSTRATED_SKIP) ILLUSTRATED_SKIP.addEventListener("click",function(){
        ILLUSTRATED_VIEW_INDEX=ILLUSTRATED_VIEWS.length-1; showIllustratedView();
      });
      ILLUSTRATED_IMAGE.addEventListener("load",function(){
        if(ILLUSTRATED_VIEW_INDEX<ILLUSTRATED_VIEWS.length-1){
          cancelIllustratedTimer(); ILLUSTRATED_TIMER=setTimeout(advanceIllustratedView,4000);
        }
      });
      ILLUSTRATED_IMAGE.addEventListener("error",function(){
        if(ILLUSTRATED_CURRENT_ASSET) ILLUSTRATED_FAILED_ASSETS.add(ILLUSTRATED_CURRENT_ASSET);
        ILLUSTRATED_IMAGE.removeAttribute("src");
        ILLUSTRATED_CURRENT_ASSET="";
        if(ILLUSTRATED_VIEW_INDEX<ILLUSTRATED_VIEWS.length-1) advanceIllustratedView();
        else hideIllustratedScene(true);
      });
      textRenderer.mount(target,services);
    },
    render:function(frame){
      textRenderer.render(frame);
      if(!ILLUSTRATED_TARGET.started){ cancelIllustratedTimer(); hideIllustratedScene(false); return; }
      const packet=frame.presentation;
      const key=packet?packet.revision+":"+packet.context.id:"legacy:"+frame.revision;
      if(packet&&key===ILLUSTRATED_PACKET_KEY) return;
      ILLUSTRATED_PACKET_KEY=key;
      const beats=packet?packet.beats.map(scene=>illustratedAssetFor(scene.id)).filter(Boolean):[];
      ILLUSTRATED_VIEWS=[...beats,illustratedSceneFor(frame)];
      ILLUSTRATED_VIEW_INDEX=0;
      showIllustratedView();
    },
    consume:function(records){ textRenderer.consume(records); },
    destroy:function(){
      textRenderer.destroy();
      cancelIllustratedTimer(); ILLUSTRATED_PACKET_KEY=""; ILLUSTRATED_VIEWS=[];
      ILLUSTRATED_SKIP=null;
      ILLUSTRATED_TARGET=null; ILLUSTRATED_PANEL=null; ILLUSTRATED_IMAGE=null;
      ILLUSTRATED_LABEL=null; ILLUSTRATED_FALLBACK=null; ILLUSTRATED_CURRENT_ASSET="";
    }
  });
}

globalThis.RamaEditionRendererFactory=createIllustratedRenderer;
globalThis.RamaEditionPresentationProfile="act-one-continuity";
globalThis.__RAMA_ILLUSTRATED=Object.freeze({
  sceneFor:function(frame){ return illustratedSceneFor(frame); },
  assetStatus:"production-approved-opening-arc"
});
