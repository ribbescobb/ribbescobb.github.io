"use strict";

const ERA_1994_SCENES=Object.freeze({
  alpha_airlock_first_arrival:Object.freeze({
    src:"assets/alpha-airlock.png",
    label:"Alpha Airlock — Northern Hub · VGA plate",
    alt:"A richly painted 256-color adventure-game view of the immense Alpha Airlock, dark water, machine walls, and expedition figures reduced to tiny silhouettes."
  }),
  descent_to_central_plain:Object.freeze({
    src:"assets/descent-central-plain.png",
    label:"Alpha Stairway — Descent to the Central Plain · VGA plate",
    alt:"A dark indexed-VGA adventure-game view down thirty thousand steps inside Rama's immense northern bowl, with expedition figures and Camp Alpha reduced to scale marks."
  }),
  camp_alpha_survey_assignment:Object.freeze({
    src:"assets/camp-alpha-survey.png",
    label:"Camp Alpha — Survey Assignment · VGA plate",
    alt:"An indexed-VGA adventure-game camp of two inflatable huts, a comms mast, crates, cables, and a chess table lit warmly against Rama's darkness."
  }),
  biot_procession_first_encounter:Object.freeze({
    src:"assets/biot-procession.png",
    label:"Central Plain — First Biot Procession · VGA plate",
    alt:"An indexed-VGA adventure-game view of exactly six bronze six-legged crab biots proceeding calmly along a polished machine track past Nicole."
  }),
  borzov_medical_emergency:Object.freeze({
    src:"assets/borzov-emergency.png",
    label:"Camp Alpha — Medical Hut · VGA plate",
    alt:"An indexed-VGA adventure-game medical hut where Nicole attends the fully clothed, grey-faced Borzov before any diagnosis or operation."
  }),
  cylindrical_sea_first_reveal:Object.freeze({
    src:"assets/cylindrical-sea.png",
    label:"Beta Camp — Cylindrical Sea Reveal · VGA plate",
    alt:"A pre-dawn indexed-VGA adventure-game view of the black Cylindrical Sea curving overhead, with tiny figures, a hoist, floating stage, and intact skiff."
  }),
  raman_dawn:Object.freeze({
    src:"assets/raman-dawn.png",
    label:"Raman Dawn — Beta Shore · VGA plate",
    alt:"A painted 256-color adventure-game view of six artificial light lines revealing Rama's immense curving world and ring sea."
  }),
  new_york_waterfront:Object.freeze({
    src:"assets/new-york-waterfront.png",
    label:"New York — Waterfront · VGA plate",
    alt:"A painted 256-color adventure-game view of a monumental seamless seawall, a single ramp and skiff, and a cold doorless city."
  }),
  octahedron_plaza:Object.freeze({
    src:"assets/octahedron-plaza.png",
    label:"New York — Plaza of the Octahedron · VGA plate",
    alt:"A painted 256-color adventure-game plaza with a mirror-smooth octahedron balanced on one point amid immense featureless towers."
  }),
  latticed_way_shaft:Object.freeze({
    src:"assets/latticed-way-shaft.png",
    label:"New York — The Latticed Way · VGA plate",
    alt:"A painted 256-color adventure-game tower canyon crossed by a silver polyhedral lattice above a deep circular shaft."
  }),
  the_pit_stranded:Object.freeze({
    src:"assets/the-pit-stranded.png",
    label:"The Pit — Stranded · VGA plate",
    alt:"A dark painted 256-color adventure-game view of Nicole enduring alone below unreachable holds, three empty tunnel mouths, and a remote grey light."
  }),
  lair_family_home:Object.freeze({
    src:"assets/lair-family-home.png",
    label:"Under New York — The Lair · VGA plate",
    alt:"A warm painted 256-color adventure-game home assembled inside a cool machine gallery, with partitions, robot workbench, garden, drawings, colour wall, and closed grill."
  }),
  atrium_sirius_revealed:Object.freeze({
    src:"assets/atrium-sirius.png",
    label:"The Atrium — Sirius Revealed · VGA plate",
    alt:"A painted 256-color adventure-game chamber whose luminous wall reveals Rama's elliptical course toward the paired suns of Sirius."
  }),
  avian_vertical:Object.freeze({
    src:"assets/avian-vertical.png",
    label:"The Avian Vertical · VGA plate",
    alt:"A painted 256-color adventure-game view into a seamless half-kilometre vertical where immense velvet-bodied avians ride warm updrafts."
  }),
  node_arrival_hangar:Object.freeze({
    src:"assets/node-arrival-hangar.png",
    label:"The Node — Hangar of Light · VGA plate",
    alt:"A shadowless 256-color adventure-game view of the whole grey cylinder Rama resting in a cradle beyond five tiny family silhouettes."
  }),
  node_hall_eagle:Object.freeze({
    src:"assets/node-hall-eagle.png",
    label:"The Node — Hall of Reception · VGA plate",
    alt:"A painted 256-color adventure-game view of the engineered Eagle greeting exactly five humans in a pearl dome with one dark doorway and a table of food."
  }),
  node_observation_sirius:Object.freeze({
    src:"assets/node-observation.png",
    label:"The Node — Observation Gallery · VGA plate",
    alt:"A painted 256-color adventure-game view of five family members facing brilliant Sirius A, its white-dwarf companion, and unfamiliar traffic."
  }),
  design_atelier_new_eden:Object.freeze({
    src:"assets/design-atelier.png",
    label:"The Node — Design Atelier · VGA plate",
    alt:"A painted 256-color adventure-game view of the Eagle and five humans around an unfinished translucent light design for New Eden."
  }),
  new_eden_plaza:Object.freeze({
    src:"assets/new-eden-plaza.png",
    label:"New Eden — Central Plaza · VGA plate",
    alt:"A painted 256-color adventure-game plaza curving upward inside Rama, with a well-house queue, market awnings, and unreadable election posters."
  }),
  eden_clinic_ward:Object.freeze({
    src:"assets/eden-clinic-ward.png",
    label:"New Eden — RV-41 Ward · VGA plate",
    alt:"A painted 256-color adventure-game clinic with exactly twelve beds, eight occupied, Ellie, Nicole, and an idle three-color dispensary."
  }),
  assembly_hall_election_eve:Object.freeze({
    src:"assets/assembly-hall-election-eve.png",
    label:"New Eden — Election Eve · VGA plate",
    alt:"A painted 256-color adventure-game assembly packed beyond the doors while Nicole stands before the unresolved election."
  }),
  lair_sanctuary_octospiders:Object.freeze({
    src:"assets/lair-sanctuary-octospiders.png",
    label:"The Lair — Sanctuary · VGA plate",
    alt:"A painted 256-color adventure-game view of Nicole and Richard meeting exactly three calm, faceless, eight-limbed octospiders beside a warm passage."
  }),
  threshold_of_light:Object.freeze({
    src:"assets/threshold-of-light.png",
    label:"The Threshold · VGA plate",
    alt:"A luminous painted 256-color adventure-game non-place where empty-handed Nicole stands beside the Eagle and a distant grey cylinder rests in a cradle."
  }),
  ending_god:Object.freeze({src:"assets/ending-god.png",label:"The Threshold — Attention · VGA plate",alt:"A painted 256-color adventure-game image of Nicole and the Eagle beneath ordered points of light at Rama's threshold."}),
  ending_rama:Object.freeze({src:"assets/ending-rama.png",label:"The Threshold — The Instrument · VGA plate",alt:"A painted 256-color adventure-game image of Nicole and the Eagle watching a human household within Rama's vast curve."}),
  ending_family:Object.freeze({src:"assets/ending-family.png",label:"The Threshold — The Living · VGA plate",alt:"A painted 256-color adventure-game image of Nicole and the Eagle looking toward a future garden, homes, and wall of names."}),
  ending_purpose:Object.freeze({src:"assets/ending-purpose.png",label:"The Threshold — The Finding · VGA plate",alt:"A painted 256-color adventure-game image of Nicole and the Eagle before a luminous doorway opening on stars and ships."}),
  london_sealed_city:Object.freeze({
    src:"assets/london-sealed-city.png",
    label:"London — Sealed City · VGA plate",
    alt:"A painted 256-color adventure-game view of seamless streetless grey blocks, drums, and long sheds inside Rama, with Nicole reduced to scale."
  }),
  pit_falstaff_contact:Object.freeze({
    src:"assets/pit-falstaff-contact.png",
    label:"The Pit — Falstaff's First Contact · VGA plate",
    alt:"A dark painted 256-color adventure-game view of tiny brass Falstaff on the lowest hold above Nicole and three black tunnel mouths."
  }),
  camp_alpha_ruins:Object.freeze({
    src:"assets/camp-alpha-ruins.png",
    label:"Camp Alpha — Ruins · VGA plate",
    alt:"A painted 256-color adventure-game view of Camp Alpha twenty-six years later: skeletal hut frames, a dead mast, table legs, and one upright rover wheel."
  }),
  beta_shore_skiff_return:Object.freeze({
    src:"assets/beta-shore-skiff-return.png",
    label:"Beta Shore — Resolution II · VGA plate",
    alt:"A painted 256-color adventure-game view from the old cliff toward a rusted hoist, floating stage, Resolution II, and tiny Falstaff bowing on its foredeck."
  }),
  tailors_room:Object.freeze({
    src:"assets/tailors-room.png",
    label:"The Node — Tailor's Room · VGA plate",
    alt:"A sparse painted 256-color adventure-game chamber where older Nicole studies a waist-high synthesizer crowned by abstract colored squares."
  }),
  node_family_quarters:Object.freeze({
    src:"assets/node-family-quarters.png",
    label:"The Node — Family Quarters · VGA plate",
    alt:"A warm painted 256-color adventure-game family room where Nicole, Richard, Michael, Simone, and Katie live beneath dimming ceilings and pinless drawings."
  }),
  wakefield_house:Object.freeze({
    src:"assets/wakefield-house.png",
    label:"New Eden — The Wakefield House · VGA plate",
    alt:"A painted 256-color adventure-game home where Nicole returns to Richard's active workshop and Benjy sorts seed cards beneath Simone's framed drawing."
  }),
  vegas_floor:Object.freeze({
    src:"assets/vegas-floor.png",
    label:"New Eden — Vegas · VGA plate",
    alt:"A painted 256-color adventure-game gaming floor opening onto steaming bathhouses and New Eden's curved fixed-dusk habitat, with Katie and Nakamura held apart in the crowd."
  }),
  eden_clinic_recovered:Object.freeze({
    src:"assets/eden-clinic-recovered.png",
    label:"New Eden — The Ward Recovers · VGA plate",
    alt:"A painted 256-color adventure-game clinic with twelve beds, eight patients sleeping ordinary sleep, Nicole and Ellie handing off, and an inactive dispensary."
  }),
  assembly_hall_trial:Object.freeze({
    src:"assets/assembly-hall-trial.png",
    label:"New Eden — The Trial · VGA plate",
    alt:"A painted 256-color adventure-game courtroom where older Nicole stands resolute inside a horseshoe of witnesses and officials while two bailiffs hold the entrance."
  }),
  katie_lost_vertical:Object.freeze({
    src:"assets/katie-lost-vertical.png",
    label:"The Avian Vertical — Katie Lost · VGA plate",
    alt:"A painted 256-color adventure-game view of Nicole, Richard, and Michael searching an immense shaft crowded by low-gyring avians, with Katie nowhere visible."
  }),
  node_farewell:Object.freeze({
    src:"assets/node-farewell.png",
    label:"The Node — Farewell · VGA plate",
    alt:"A pale painted 256-color adventure-game farewell at a corridor of light, with Nicole, Richard, and Katie departing while Simone and Michael remain beside the Eagle."
  }),
  gatehouse_rescue_katie:Object.freeze({
    src:"assets/gatehouse-rescue-katie.png",
    label:"New Eden — Katie at the Gatehouse · VGA plate",
    alt:"A dark painted 256-color adventure-game holding room where Katie in tailored black brings boots, a lamp, and a medical kit to older Nicole."
  }),
  gatehouse_rescue_siblings:Object.freeze({
    src:"assets/gatehouse-rescue-siblings.png",
    label:"New Eden — Ellie and Patrick at the Gatehouse · VGA plate",
    alt:"A dark painted 256-color adventure-game holding room where Ellie and Patrick in work coveralls bring boots, a lamp, and a medical kit to older Nicole."
  }),
  medical_hut_quiet:Object.freeze({
    src:"assets/medical-hut-quiet.png",
    label:"Camp Alpha — Quiet Medical Hut · VGA plate",
    alt:"A painted 256-color adventure-game view of Nicole's empty fold-out medical station before the emergency."
  }),
  london_factory_reveal:Object.freeze({
    src:"assets/london-factory-reveal.png",
    label:"London — Factory Revealed · VGA plate",
    alt:"A painted 256-color adventure-game view through London's slot into receding racks of separate unfinished biot shells, legs, and lensless eye housings."
  }),
  resolution_crossing:Object.freeze({
    src:"assets/resolution-crossing.png",
    label:"Cylindrical Sea — The Resolution Crossing · VGA plate",
    alt:"A painted 256-color adventure-game view of Nicole and Richard crossing Rama's curving ring sea in the tiny Resolution while shark biots pace them."
  }),
  new_york_narrow_ways:Object.freeze({
    src:"assets/new-york-narrow-ways.png",
    label:"New York — Narrow Ways · VGA plate",
    alt:"A painted 256-color adventure-game view of Nicole entering black slots between immense towers, with silver lattice and a partial octahedral edge."
  }),
  rama_course_change:Object.freeze({
    src:"assets/rama-course-change.png",
    label:"Under New York — Rama Steers · VGA plate",
    alt:"A painted 256-color adventure-game view of the lair tilting as Richard laughs on his back and Nicole and Michael brace against Rama's course change."
  }),
  alpha_stairway_climb:Object.freeze({
    src:"assets/alpha-stairway-climb.png",
    label:"Alpha Stairway — The Climb · VGA plate",
    alt:"A painted 256-color adventure-game view of Nicole and Richard descending Rama's immense Alpha stairway."
  }),
  central_plain_first_footing:Object.freeze({
    src:"assets/central-plain-first-footing.png",
    label:"Central Plain — First Footing · VGA plate",
    alt:"A painted 256-color adventure-game view of Nicole and Richard stepping onto Rama's vast Central Plain beneath the curving world."
  }),
  act_ii_voyage_years:Object.freeze({
    src:"assets/act-ii-voyage-years.png",
    label:"Act II — Voyage Years · VGA plate",
    alt:"A painted 256-color adventure-game montage of Nicole, Richard, Michael, Simone, and Katie living and exploring through Rama's voyage years."
  }),
  node_dock_family_revisit:Object.freeze({
    src:"assets/node-dock-family-revisit.png",
    label:"The Node — Family Revisit · VGA plate",
    alt:"A painted 256-color adventure-game view of Nicole, Richard, Michael, Simone, and Katie returning to the Node dock."
  }),
  new_eden_gatehouse:Object.freeze({
    src:"assets/new-eden-gatehouse.png",
    label:"New Eden — The Gate · VGA plate",
    alt:"A painted 256-color adventure-game view of New Eden's guarded gatehouse inside Rama's enclosed habitat."
  }),
  service_dark:Object.freeze({
    src:"assets/service-dark.png",
    label:"The Service Dark · VGA plate",
    alt:"A painted 256-color adventure-game view of Nicole walking a narrow maintenance tunnel inside Rama's silent habitat skin."
  }),
  twilight_in_the_lair:Object.freeze({
    src:"assets/twilight-in-the-lair.png",
    label:"The Lair — Twilight · VGA plate",
    alt:"A painted 256-color adventure-game view of Nicole and her family living through the later quiet years in their enclosed home beneath New York."
  }),
  postlude_inventory:Object.freeze({
    src:"assets/postlude-inventory.png",
    label:"Postlude — Inventory · VGA plate",
    alt:"A painted 256-color adventure-game view of Nicole reviewing the objects and memories she carries at Rama's threshold."
  })
});

function vgaContextAsset(file,label,alt){
  return Object.freeze({src:"assets/"+file+".png",label:label+" · VGA plate",alt});
}
const ERA_1994_ACT_ONE_CONTEXTS=Object.freeze({
  alpha_airlock_exploration:ERA_1994_SCENES.alpha_airlock_first_arrival,
  alpha_upper_flights:vgaContextAsset("descent-central-plain","Alpha Stairway — Upper Flights","Nicole and Richard high on the Alpha stairway, with expedition lights far below in the immense northern bowl."),
  alpha_lower_flights:vgaContextAsset("alpha-stairway-climb","Alpha Stairway — Lower Flights","A closer viewpoint along the lower Alpha flights, with Nicole, Richard and the remote camp lights."),
  central_plain_exploration:ERA_1994_SCENES.central_plain_first_footing,
  camp_alpha_working:vgaContextAsset("camp-alpha-survey","Camp Alpha","Nicole between two inflatable huts, the comms mast, crates, cables and a chess table."),
  camp_alpha_storm_damage:vgaContextAsset("camp-alpha-storm-damage","Camp Alpha — After the Storm","One hut lies collapsed in its restraints beside scattered supplies; the other hut and working camp remain."),
  medical_hut_emergency:ERA_1994_SCENES.borzov_medical_emergency,
  medical_hut_recovery:vgaContextAsset("medical-hut-recovery","Medical Hut — Recovery","Borzov rests peacefully under a thermal sheet on the same field table, with Nicole beside him."),
  medical_hut_available:vgaContextAsset("medical-hut-quiet","Medical Hut","Nicole's medical station with an empty fold-out table, diagnostic rack and safe."),
  biot_track_active:ERA_1994_SCENES.biot_procession_first_encounter,
  biot_track_empty:vgaContextAsset("biot-track-empty","Central Plain — Open Ground","Nicole beside the same polished tracks, now empty of the departed biot procession."),
  london_exterior:ERA_1994_SCENES.london_sealed_city,
  beta_shore_predawn:ERA_1994_SCENES.cylindrical_sea_first_reveal,
  beta_shore_daylight:ERA_1994_SCENES.raman_dawn,
  new_york_arrival_context:ERA_1994_SCENES.new_york_waterfront,
  new_york_waterfront_withdrawal:vgaContextAsset("new-york-withdrawal","New York — Waterfront","The same monumental towers beyond empty Resolution moorings; the lower dinghy landing is outside the view."),
  octahedron_exploration:ERA_1994_SCENES.octahedron_plaza,
  lattice_exploration:ERA_1994_SCENES.latticed_way_shaft,
  pit_waiting:ERA_1994_SCENES.the_pit_stranded,
  pit_contact_context:ERA_1994_SCENES.pit_falstaff_contact,
  pit_rescue_cable:vgaContextAsset("pit-rescue-cable","The Pit — Rescue Cable","A thin rescue cable reaches the seated Nicole beneath the same three empty tunnels and remote shaft light."),
  lair_first_shelter:vgaContextAsset("lair-first-shelter","Under New York — First Shelter","Three castaways find their first sparse shelter in the banded gallery beneath New York."),
  atrium_undeciphered:vgaContextAsset("atrium-undeciphered","The Atrium — Unread Display","A wall of abstract glyphs, one plain star and an unexplained elliptical path."),
  avian_search_context:ERA_1994_SCENES.katie_lost_vertical,
  node_hall_conversation:vgaContextAsset("node-hall-conversation","The Node — Hall of Reception","The pearl-grey hall with its dark doorway and food table, deliberately without a fixed cast."),
  node_observation_quiet:vgaContextAsset("node-observation-quiet","The Node — Observation Gallery","The quiet gallery faces the paired stars without a foreground family tableau."),
  node_hangar_quiet:vgaContextAsset("node-hangar-quiet","The Node — Hangar of Light","Rama rests in its cradle, with neutral nearby berths establishing the Node's scale."),
  node_departure_context:vgaContextAsset("node-departure","The Node — Before Departure","Five family figures pause together beside the radiant corridor; nobody has yet left."),
  node_quarters_domestic:ERA_1994_SCENES.node_family_quarters,
  node_quarters_fever:vgaContextAsset("node-quarters-fever","The Node — Simone's Fever","Simone rests under a blanket while Katie keeps watch; no cure is implied."),
  tailor_workspace:ERA_1994_SCENES.tailors_room,
  design_atelier_detail:vgaContextAsset("design-atelier-detail","The Node — Design Atelier","A neutral close view of the model table and its small lake, excluding variable city plans."),
  eden_home_quiet:ERA_1994_SCENES.wakefield_house,
  eden_plaza_civic:ERA_1994_SCENES.new_eden_plaza,
  eden_clinic_recovered_context:ERA_1994_SCENES.eden_clinic_recovered,
  eden_hall_council:ERA_1994_SCENES.assembly_hall_election_eve,
  gatehouse_escape_katie:ERA_1994_SCENES.gatehouse_rescue_katie,
  gatehouse_escape_siblings:ERA_1994_SCENES.gatehouse_rescue_siblings,
  central_plain_return:vgaContextAsset("central-plain-return","Central Plain — Return","The old stairway and empty plain after the expedition's years."),
  camp_alpha_ruins_context:ERA_1994_SCENES.camp_alpha_ruins,
  beta_shore_return_context:ERA_1994_SCENES.beta_shore_skiff_return,
  new_york_return_context:vgaContextAsset("new-york-return","New York — Return","The silent seawall and city with a returning skiff."),
  lair_return_grill:vgaContextAsset("lair-return-grill","Under New York — The Closed Grill","The family gallery before the sanctuary opens."),
  vegas_council_floor:ERA_1994_SCENES.vegas_floor
});

globalThis.RamaEditionRendererFactory=function(){
  return globalThis.RamaStaticGraphicalRenderer.create({
    id:"era-1994",scenes:ERA_1994_SCENES,contexts:ERA_1994_ACT_ONE_CONTEXTS,continuity:true
  });
};
globalThis.RamaEditionPresentationProfile="act-three-continuity";
globalThis.__RAMA_ERA_1994=Object.freeze({scenes:ERA_1994_SCENES,fallback:"canonical-text"});
