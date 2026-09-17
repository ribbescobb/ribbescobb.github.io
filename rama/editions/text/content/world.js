"use strict";

/* =====================================================================
   WORLD DATA
   ===================================================================== */
const WORLD={}, ITEMS={}, SCENERY={}, CHARS={};
function clearObj(o){ for(const k in o) delete o[k]; }

function defineWorld(){
clearObj(WORLD); clearObj(ITEMS); clearObj(SCENERY); clearObj(CHARS); clearObj(QUESTION_HANDLERS);
registerCoreQuestions();

/* ---------------- ACT I : RAMA ---------------- */

WORLD.hub = {
  name:"Alpha Airlock — Northern Hub",
  desc:"A chamber the size of a chapel, cut into the axis of a world. The walls are the grey of Rama itself — seamless, faintly warm, indifferent. Nicole's suit lamp finds the mouth of the great stairway falling away below, and beyond it, darkness sixteen kilometers deep in which an entire landscape is waiting. Gravity here at the hub is barely a rumor. Equipment cases stand netted along one wall.",
  brief:"The axis chamber, equipment netted along the wall, the stairway mouth below.",
  scenery:["walls","cases","case_contents","axis","hub_chamber","suit_lamp","richard_robots"],
  sound:"A hum below hearing. Richard says it is the ventilation of a cathedral the size of a nation.",
  exits:{ down:{to:"stair_top", msg:"She pushes off toward the stairway mouth, drifting more than walking."} }
};
SCENERY.walls={name:"wall",alias:["walls","grey wall","surface","chamber surface"],desc:"Close up, the material has no grain, no seam, no tool mark. It has been here, the dating suggests, for something like a million years. It looks like it was finished yesterday.",
  on:{touch:"Faintly warm, seamless, without even the microscopic roughness a tool would leave. Rama keeps its own counsel under her glove."}};
SCENERY.cases={name:"equipment cases",alias:["cases","case","equipment","equipment cases","stores"],desc:"Expedition stores in transit: rations, spare cells, the folded skeleton of a relay antenna. Everything triple-lashed. Cosmonauts are superstitious about drift.",
  on:{search:function(){ if(!F().gotPatch){ F().gotPatch=true; ITEMS.patch.loc="inv"; take("patch"); out("Among the spares she finds a hull patch kit — resin, mesh, a spreader — and signs it out on the manifest. Old habits."); } else out("Nothing else she has a claim to."); return endTurn(); },
      open:function(){ return SCENERY.cases.on.search(); },
      take:"The cases are triple-lashed expedition stores, not loose luggage. She signs out only what the mission needs."}};
SCENERY.case_contents={name:"netted case contents",alias:["net","netting","rations","spare cells","cells","relay antenna","folded antenna"],desc:"Rations, spare cells, and a folded relay antenna show through the securing net. Each component is clipped or strapped inside its case for the drift to the plain.",
  on:{open:"The component is already stowed inside an open-front transit case; opening it separately would only defeat its restraint.",
      search:"The visible stores are inventoried and secure. Searching the equipment cases themselves is the way to sign out anything Nicole needs.",
      take:"She leaves the individually secured stores on the manifest. Mission equipment is issued from the cases, not plucked through their netting."}};
SCENERY.axis={name:"stairway",alias:["stairway mouth","stairs","mouth","darkness"],desc:"Alpha Stairway: thirty thousand steps descending the curve of the northern bowl. Near the hub the steps are shallow as ripples — there is almost no weight to fall with. It gets more serious as you go down."};
SCENERY.hub_chamber={name:"axis chamber",alias:["chamber","axis chamber","northern hub","hub","axis","gravity","world"],desc:"The northern hub is a chapel-sized chamber on Rama's axis. Here gravity is barely a suggestion; every wall and opening is arranged around a center that is also a direction.",
  on:{touch:"The chamber supplies no up or down beyond the one Nicole carries with her. Only the stairway commits to a direction."}};
SCENERY.suit_lamp={name:"suit lamp",alias:["suit lamp","lamp","beam","lamp beam","light"],desc:"A compact lamp sealed to Nicole's harness, throwing a disciplined white beam into a darkness too large to notice.",
  on:{light:"It is already lit. Inside Rama, turning it off would be theater rather than economy.",
      touch:"Warm housing, secure clip, full charge — three small reassurances."}};
SCENERY.richard_robots={name:"Richard's little robots",alias:["robots","little robots","shakespeareans","pockets","ticking pockets","brass robots"],
  desc:function(){ return charsAt(S.loc).includes("richard")?"Richard's pockets tick with tiny brass scouts, each named for Shakespeare and each built to go where an adult human cannot. One lens peers over a seam, then ducks away.":"Richard and his mechanical company are elsewhere."; },
  on:{touch:"A brass head withdraws into Richard's pocket with offended dignity.",
      take:"Richard protects the pocket with one hand. ‘Build your own supporting cast,’ he says."}};

WORLD.stair_top = {
  name:"Alpha Stairway — Upper Flights",
  desc:"The stairway pours down the inside of the bowl like something geological. This high, Nicole can descend in long floating bounds, the handrail sliding through her glove. Below, three threads of light — the beams of earlier parties — stitch the darkness of the Central Plain. The scale refuses to become normal. Every time she looks out, some animal part of her brain files a formal objection.",
  brief:"The upper flights, gravity gathering slowly beneath her.",
  scenery:["handrail","plain_view","stair_flights"],
  exits:{ up:"hub", down:{to:"stairway", msg:"Down. The bounds shorten as Rama's spin takes hold of her."} }
};
SCENERY.handrail={name:"handrail",alias:["rail"],desc:"Sized, as far as anyone can tell, for hands. That thought has kept more than one cosmonaut awake."};
SCENERY.plain_view={name:"plain",alias:["central plain","landscape","view","darkness","lights","beams","threads of light","cities","city","cylindrical sea","distant sea","ridged fields","fields","straight channels","channels","camp floodlights"],desc:"Sixteen kilometers below and fifty ahead: a plain that bends up and over her head to close upon itself. A cylindrical sea belts the world's waist. Cities — they call them cities — sit dark on the land like circuit elements. All of it engineered. None of it explained.",
  on:{touch:"It is a world away beneath her boots. The distance is the thing she can feel."}};
SCENERY.stair_flights={name:"stairway",alias:["stairway","stairs","steps","flights","upper flights","lower flights"],
  desc:function(){ return S.loc==="stair_top"?"The upper stairway is scarcely a stair at all: shallow ripples and a handrail curving down into gathering gravity. Far below, the flights become a continuous pale thread.":"The lower flights are unmistakably stairs now — thousands behind, thousands still visible above, each shallow tread cut with machine regularity."; },
  on:{touch:"The tread is seamless Raman material, faintly warm through her boot; the rail is the only concession to human scale."}};

WORLD.stairway = {
  name:"Alpha Stairway — Lower Flights",
  desc:"True weight now, and ten thousand steps behind her. The stairway has become work, thighs burning, breath loud in her ears. The plain below has resolved into textures: ridged fields that are not fields, straight channels that carry no water, and to the east the low geometries of the camp's floodlights.",
  brief:"The lower flights, the camp lights visible below.",
  scenery:["plain_view","stair_flights"],
  exits:{ up:{to:"stair_top", msg:"Up is easier on the lungs and harder on the schedule."}, down:{to:"plain_north", msg:"The last thousand steps. Her legs will file their complaint tomorrow."} }
};

WORLD.plain_north = {
  name:"Central Plain — Foot of Alpha",
  desc:function(){ return S.act===3?"Level ground beneath the long-dead stair: fine-grained metal loam ruled with shallow parallel grooves. East, Camp Alpha is an unlit geometry of skeletal frames and one upright wheel. The old floodlights do not glow; no human beacon marks this country now.":"Level ground, if ground is the word: a surface like fine-grained metal loam, firm underfoot, ruled with shallow parallel grooves that run away toward the sea. The stairway climbs behind her into darkness. Camp Alpha's floodlights glow to the east. Southwest, farther off, stands the fenced geometry the survey has labeled LONDON."; },
  brief:"The plain at the stairway's foot. Camp east; the city southwest.",
  scenery:["grooves","ground","stair_flights","plain_landmarks"],
  exits:{ up:"stairway", east:"camp_alpha", southwest:"london", south:"plain_biot" }
};
SCENERY.grooves={name:"grooves",alias:["groove","parallel grooves","lines","tracks"],
  desc:"Shallow channels, dead straight, spaced with a machinist's regularity. Not erosion. Not decoration, probably. Nicole crouches: the inner surfaces are polished, as if by long use.",
  on:{touch:"Polished smooth. Something travels these — or did, or will."}};
SCENERY.ground={name:"ground",alias:["soil","loam","surface","dirt","grains","metal loam"],desc:"Granular, grey-brown, faintly metallic. It is not soil in any terrestrial sense; the biology package found no organics at all on the first pass.",
  on:{search:"She sifts a handful. Uniform grains, no seeds, no stones, nothing alive. A gardener's nightmare; an engineer's substrate.",
      touch:"The grains rasp softly across her glove: dry, uniform, faintly metallic. Not smooth, and not soil."}};
SCENERY.plain_landmarks={name:"distant landmarks",alias:["camp lights","camp floodlights","floodlights","camp","london","fenced geometry","distant city"],desc:function(){ return S.act===3?"Camp Alpha lies east as a dark scatter of skeletal frames. Its floodlights are dead. London remains southwest, another old address in the unlit country.":"Camp Alpha's floodlights mark the east in human white. Southwest, London's sealed blocks form a darker geometry against the curving plain. Both are destinations, not details, from here."; }};

WORLD.plain_biot = {
  name:"Central Plain — Open Ground",
  desc:function(){ return "Open plain south of the stairway, the grooves converging here into a broad polished track that runs on toward the sea. The silence has weight."+(F().biotSeen?" This is where the biots crossed.":""); },
  brief:"Open plain; the polished track runs south.",
  scenery:["track","grooves","biot_parts"],
  exits:{ north:"plain_north" },
  onTurn:function(){
    if(!F().biotSeen && S.visited.plain_biot){
      F().biotSeen=true; F().biotTurn=S.turn;
      out("A sound at last — a ticking, multiplying. Out of the southern dark comes a procession: six machines the size of ponies, low-slung, six-legged, carapaced in dull bronze. Crab biots, the survey calls them. They flow along the polished track with absolute economy, neither fast nor slow, and they do not so much ignore Nicole as fail to include her in any category worth processing.");
      outSys("The biots are passing. This may not last.");
    }
  }
};
SCENERY.track={name:"track",alias:["polished track","road"],desc:"A wide band worn — no, finished — to a shine. It runs toward the Cylindrical Sea. Things use this."};
WORLD.plain_biot.scenery.push("biot");
SCENERY.biot={name:"crab biot",alias:["biot","biots","crab","machine","machines","robot","procession","creature"],
  desc:function(){
    if(F().biotGone) return "Gone south, toward the sea. The polished track keeps their absence the way a riverbed keeps a river.";
    if(!F().biotSeen) return "No biots here now — only the track they use.";
    return "Six legs in a rhythm no animal uses; a carapace with the sheen of old bronze; forward sensors like a row of stitched shut eyes. It is not alive. It is not exactly a machine either, or not only. Nicole's professional instincts reach for a taxonomy and come back empty-handed.";
  },
  on:{
    photograph:function(){
      if(!F().biotSeen||F().biotGone){ out("Nothing to photograph but the empty track."); return endTurn(); }
      if(!K().k_biots){ K().k_biots=true;
        out("She shoots a full sequence — gait, joint articulation, the intake vents along the flank. Through the long lens she catches something the naked eye missed: each biot carries a cargo of grey slurry in a dorsal hopper, and the hoppers of the last two are empty. They are not wandering. They are working. Rama is being maintained.");
        outSys("Learned: the biots are maintenance workers. Someone at camp should hear this. (TELL them ABOUT BIOTS.)");
      } else out("More frames for the archive. The gait never varies.");
      return endTurn();
    },
    touch:function(){
      if(!F().biotSeen||F().biotGone){ out("Only the track is here to touch."); return endTurn(); }
      out("Against every protocol, she lays a glove on the carapace as it passes. Warm. The biot alters course by exactly the width of her hand and continues, unbothered, unhurried. She has been routed around, like weather.");
      relUp("richard",0);
      return endTurn();
    },
    take:"It masses half a tonne and is going somewhere. No."
  }};
SCENERY.biot_parts={name:"biot machinery",alias:["legs","leg","joints","joint","carapace","sensors","sensor","eyes","vents","intake vents","flank","hopper","hoppers","cargo","slurry"],
  desc:function(){
    if(!F().biotSeen) return "Only the polished track is present. Whatever owns those engineered details has not arrived.";
    if(F().biotGone) return "The biots have carried their anatomy and cargo south. Nicole has the images: articulated legs, stitched-eye sensors, flank vents, bronze carapaces, dorsal hoppers.";
    return "Articulated legs keep an unvarying six-beat gait. Stitched-eye sensors line each bronze carapace; intake vents open along the flank. Dorsal hoppers carry grey slurry, except on the last two machines, whose empty bins make the procession look like a completed work shift.";
  },
  on:{photograph:function(){ return SCENERY.biot.on.photograph(); },
      touch:function(){ return SCENERY.biot.on.touch(); },
      take:"Half-tonne components moving in formation are not specimens Nicole can pocket."}};

WORLD.camp_alpha = {
  name:"Camp Alpha",
  desc:function(){
    if(F().campLoss) return "Camp Alpha has survived, which is not the same as remaining intact. One inflatable hut stands; the other lies collapsed in its restraints. A day of supplies is scattered across the grey plain, while the mast, cables, folding table, and lowered floodlights hold their improvised little province of Earth together.";
    return "Human clutter, defiantly bright against the grey: two inflatable huts, a comms mast blinking at the distant hub, crates, cables, a folding table with a chessboard nobody has time for. The floodlights make a little province of Earth, forty meters wide."+(F().stormWarned?" The gear has been lashed down against the coming wind.":"");
  },
  brief:"Camp Alpha: mast, floodlights, human shelter and expedition stores.",
  scenery:["huts","mast","chessboard","crates","camp_cables","camp_table","camp_mug","camp_lights","camp_generator","camp_drone","camp_gear","camp_rover","survey_board","richard_slate","richard_robots","michael_rosary","camp_radio"],
  sound:"Generator hum, the tick of the mast, and — beneath it — Rama's silence, waiting for the generator to lose.",
  exits:{ west:"plain_north", "in":{to:"medlab", msg:"She ducks into the medical hut."},
    east:{to:"beta_shore", hidden:function(){return S.phase!=="storm"&&S.phase!=="crossing"&&!F().betaOpen;},
      blocked:function(){ return (S.phase==="arrival"||S.phase==="survey"||S.phase==="borzov"||S.phase==="borzov_decide")?"The rover run to Beta Camp on the sea is scheduled after the survey report is in. First things first.":null; },
      to:"beta_shore", msg:"The electric rover hums east across the plain for an hour that feels like a held breath, grooves flowing past like rails. The air grows imperceptibly humid. Then a smell that does not belong inside a machine: water."} }
};
SCENERY.huts={name:"huts",alias:["hut","hut frames","frames","inflatable","habitat","sleeping hut","medical hut","skins","airlocks"],desc:function(){ return F().campLoss?"One hut remains taut and habitable. The other's skin has folded around its frame, held down by the very restraints meant to save it. Nobody was inside when it went.":"Sleeping hut and medical hut, skins taut, airlocks fussy. Absurd, fragile, home."; },
  on:{open:"The sleeping hut's airlock cycles at a touch. The medical hut is the one Nicole needs when medicine calls; she can go IN."}};
SCENERY.mast={name:"comms mast",alias:["mast","antenna","comms","relay"],desc:"It relays camp traffic up to the Newton, moored outside the hub, and from there the long minutes to Earth. Tonight Earth mostly sends questions.",
  on:{touch:"Human aluminum, cable ties, and a vibration from the relay package — reassuringly ordinary engineering."}};
SCENERY.chessboard={name:"chessboard",alias:["chess","board","game","knight","piece","pieces","chess piece","chess pieces"],desc:"Mid-game, abandoned. Richard is winning, which is why Janos has stopped playing.",
  on:{push:"She nudges a knight into a better square for Janos. Small mercies.",
      take:"The pieces belong to a game still in progress, however long Richard and Janos choose to define progress."}};
SCENERY.crates={name:"crates",alias:["crate","supplies","stores","rations","science stores","medical resupply","camp stores"],desc:function(){ return F().campLoss?"The surviving crates remain strapped down. Torn ration wrappers and labeled science stores lie scattered beyond the lights; the lost day's margin is already being counted.":"Rations, science stores, medical resupply. Enough for the scheduled stay and a cautious margin. Margins are Nicole's love language."; },
  on:{search:function(){ if(!F().gotPatch){ F().gotPatch=true; take("patch"); out("She turns up a hull patch kit and adds it to her sling bag. On a boat crossing, resin is courage."); } else out("Nothing else worth the weight."); return endTurn(); },
      open:function(){ return SCENERY.crates.on.search(); },
      take:"Rations and science stores stay accounted for. If Nicole needs one particular tool, she can SEARCH the crates and sign it out."}};
SCENERY.camp_cables={name:"camp cables",alias:["cables","cable runs","power cables","leads","cords"],
  desc:function(){ return F().stormWarned?"Power and data cables lie coiled, clipped, and double-lashed to low anchors. Nothing remains loose for the wind to teach a lesson.":"Human power and data lines snake between huts, mast, lights, and generator, taped down wherever a boot might find them."; },
  on:{touch:"Rubber insulation, dust, and the pulse of human current — these cables belong to the camp, not to Rama's silver lattice.",
      pull:"She leaves the camp's power and data connected. Janos would feel the disturbance personally."}};
SCENERY.camp_table={name:"folding table",alias:["table","folding table","camp table","comm notes","notes","score sheets","score sheet"],desc:function(){ return S.act===3?"Only the folding table's legs remain planted in the dust, faithful as furniture long after the expedition became history.":"A scarred aluminum folding table, presently supporting the abandoned chess game, comm notes, and more elbows than its manufacturer certified."; },
  on:{search:"Score sheets, grease pencil, a cold mug, and no secret that belongs to Nicole.",
      read:"The comm notes list survey windows, rover allocations, and a reminder in Janos's hand: RICHARD STILL CHEATING AT CHESS.",
      open:"The folding table has no drawer. Its braces are locked open and its working surface is already fully exposed.",
      touch:"Scarred aluminum, warm under the floodlights and entirely human-made.",
      take:"It is camp furniture, presently holding the comm notes and a disputed chess position."}};
SCENERY.camp_mug={name:"cold mug",alias:["mug","cold mug","coffee mug","coffee"],desc:"A metal camp mug beside the chessboard. The coffee in it went cold several arguments ago.",
  on:{drink:"Nicole tastes the cold coffee, considers the long shift ahead, and finishes a dutiful sip. It is emphatically not canteen water.",
      open:"The mug is already open, its cold coffee exposed to Rama's carefully unexplained air.",
      read:"The mug bears Janos's name in grease pencil and no operational information.",
      touch:"Cold metal and colder coffee.",
      take:"It is Janos's mug. Nicole leaves it beside his unfinished chess game."}};
SCENERY.camp_lights={name:"floodlights",alias:["floodlights","floodlight","lights","camp lights","camp floodlights","lamps","light stands","stands","housing"],
  desc:function(){ return F().campLoss?"The lowered floodlights survived on their guy lines. They throw hard white light across one collapsed hut and the scattered supplies beyond it.":F().stormWarned?"The floodlights have been lowered and guyed for the storm, still carving a stubborn human circle out of Rama's dark.":"Portable floodlights on telescoping stands make forty meters of plain look temporarily owned."; },
  on:{touch:"The housing is hot and vibrates faintly with the generator's current.",
      light:"They are already burning, bright enough to make the surrounding dark look deliberate."}};
SCENERY.camp_generator={name:"generator",alias:["generator","power unit","power","engine","acoustic shroud","shroud","service cover"],desc:"A compact expedition generator inside an acoustic shroud. It supplies the camp with light, heat, and the small electrical arrogance of home.",
  on:{open:"Janos has marked the service cover with a grease-pencil skull. Nicole respects interdisciplinary boundaries.",
      touch:"Warm housing, steady vibration. Its ordinary mechanical pulse almost masks Rama's deeper hum."}};
SCENERY.camp_drone={name:"camera drone",alias:["drone","camera drone","flying camera","drone lens","lens"],
  desc:function(){
    if(charsAt(S.loc).includes("francesca")) return "Francesca's camera drone holds station near her shoulder, lens tracking whatever might become history after editing.";
    if(S.loc==="camp_alpha") return "The drone is elsewhere with Francesca; only its charging mark and a loop of spare cable remain at camp.";
    return "The drone left this place with Francesca. No lens or charging gear remains here to inspect.";
  },
  on:{touch:function(){ out(charsAt(S.loc).includes("francesca")?"It sidesteps her hand with insect precision. Francesca has programmed boundaries into at least one thing.":"The drone is with Francesca, not within Nicole's reach here."); return endTurn(); },
      take:function(){ out(charsAt(S.loc).includes("francesca")?"The drone belongs to Francesca and, more decisively, is hovering out of reach.":"The drone left with Francesca. Nicole cannot take an afterimage."); return endTurn(); }}};
SCENERY.camp_gear={name:"camp gear",alias:["gear","lashed gear","lashings","straps","anchors","guy lines","rover tools","storm straps"],
  desc:function(){ return F().campLoss?"Most lashings held. One hut did not, and a day's loose supplies now marks the limit of every checklist. The remaining cases, antenna, and light stands are still secured.":F().stormWarned?"Cases are strapped, hut skins checked, antenna and light stands guyed low. Michael's warning has become knots and redundancy.":"Cases, guy lines, rover tools, and folded storm straps wait in the organized disorder of a working camp."; },
  on:{search:"Everything has an owner, a checklist, and a place. Nicole's own contribution is not making Janos repeat the inventory."}};
SCENERY.camp_rover={name:"electric rover",alias:["rover","electric rover","vehicle","wheels"],
  desc:function(){ return S.loc==="beta_shore"?"The expedition rover stands back from the cliff, dusted grey from the hour across the plain. Its charge indicator promises the return to Camp Alpha.":"A low electric rover waits beside the huts, seats open to Rama's air, wheels narrow enough to follow the plain's grooves without belonging to them."; },
  on:{use:function(){ out(S.loc==="beta_shore"?"The rover route leads WEST to Camp Alpha.":F().betaOpen?"The rover run to Beta Camp is EAST when Nicole is ready.":"The sea run is scheduled after the survey and medical work. First things first."); return endTurn(); },
      search:"Charge, tires, emergency oxygen, tow line: all green. Janos maintains vehicles as a form of moral argument."}};
SCENERY.survey_board={name:"survey assignments",alias:["assignments","survey assignments","assignment","posted assignments","survey board","orders"],desc:"The board divides impossible geography into names and initials: plain sample and biot imagery — DES JARDINS; London — unassigned; Beta Sea — after initial survey.",
  on:{read:"DES JARDINS: CENTRAL PLAIN SAMPLE; BIOT-TRACK IMAGERY. WAKEFIELD ACCOMPANIES. LONDON UNASSIGNED. BREAK NOTHING."}};
SCENERY.richard_slate={name:"Richard's slate",alias:["slate","richard's slate","tablet","charts","numbers","thermal curves","hull readings","perihelion projection","projection"],
  desc:function(){ return charsAt(S.loc).includes("richard")?"Richard's battered slate is dense with thermal curves, hull readings, and annotations written at the speed of delight. The perihelion projection is the only line that refuses to look playful.":"Richard and his slate are elsewhere, turning some fresh impossibility into numbers."; },
  on:{read:function(){ out(charsAt(S.loc).includes("richard")?"Temperature rising; light threshold approaching; atmospheric convection after ignition. His conclusion is underlined twice: WEATHER.":"The slate is with Richard."); return endTurn(); },
      take:"Richard's fingers close over it by reflex. Some people carry security blankets; engineers add batteries."}};
SCENERY.michael_rosary={name:"Michael's rosary",alias:["rosary","michael's rosary","beads","prayer beads"],
  desc:function(){ return charsAt(S.loc).includes("michael")?"Worn dark at the decades of contact, the rosary rides in Michael's thigh pocket or his hand according to the seriousness of the hour.":"Michael has the rosary with him elsewhere."; },
  on:{touch:"Michael closes his hand around the beads, not possessive — simply finishing a thought begun long before Rama.",
      take:"The rosary belongs in Michael's hand or pocket. Nicole leaves his private anchor where he put it."}};
SCENERY.camp_radio={name:"camp radio",alias:["radio","receiver","channel","comms log","log","traffic"],desc:"The camp set routes through the mast to the Newton and, after the long light-time, Earth. Most of its traffic is logistics pretending not to be fear.",
  on:{read:"The comm log is timestamps, acknowledgements, and questions from Earth that arrived too late to remain urgent.",
      use:"The set is live. Specific reports belong to specific people: TELL them what Nicole has learned."}};

WORLD.medlab = {
  name:"Medical Hut",
  desc:function(){ return "Nicole's small kingdom: a fold-out surgical table, diagnostic rack, drug safe, the smell of antiseptic winning a border war against the smell of feet."+(S.borzov==="sick"?" General Borzov lies on the table, grey-faced, a hand pressed below his ribs.":S.borzov==="operated"?" Borzov sleeps off the anesthetic, color returning, monitors content.":""); },
  brief:"The medical hut.",
  scenery:["table","safe","rack","medical_log","borzov_body","medlab_air"],
  exits:{ out:"camp_alpha" },
  onCmd:function(verb,obj){
    if(verb==="smell"&&obj&&obj.kind==="scenery"&&obj.id==="medlab_air"){
      out("Antiseptic wins at close range. Under it: warmed plastic, tired bodies, and the unavoidable truth that feet crossed thirty thousand steps to get here.");
      endTurn(); return true;
    }
    if(S.phase==="borzov_decide"){
      if(verb==="operate"){ return borzovOperate(), true; }
      if(verb==="evacuate"){ return borzovEvacuate(), true; }
    }
    return false;
  }
};
SCENERY.table={name:"surgical table",alias:["table","surgical table","fold-out surgical table","fold out surgical table","fold-out table","operating table","field table","sterile drape","drape","thermal sheet","field dressing","dressing","sterile packs","instrument tray","instruments","restraints","suction","compartments","folded compartments"],desc:function(){
  if(S.borzov==="sick") return "The field table is extended, sterile drape ready beneath Borzov. It was rated for exactly the operation Nicole hopes not to perform here.";
  if(S.borzov==="operated") return "Borzov sleeps on the surgical table beneath a thermal sheet, dressings clean, color returning by degrees.";
  return "A fold-out field surgical table, cleaned, counted, and rated for the emergency everyone intended to avoid.";
},on:{search:function(){ out(S.borzov==="sick"?"Sterile packs, restraints, suction, and instrument tray are staged within reach. Nothing replaces diagnosis or the decision that follows.":"The table's folded compartments contain sterile drapes and instrument packs, sealed and counted."); return endTurn(); },
      open:function(){ out(S.borzov==="sick"?"Its fold-out compartments are already open: sterile packs, restraints, suction, and the instrument tray arranged for immediate use.":"She releases one human latch. Folded compartments expose sealed drapes and counted instrument packs; she closes them after the check."); return endTurn(); },
      touch:function(){ out(S.borzov==="sick"?"Powder-coated alloy beneath a sterile drape, steady under Borzov's weight. Nicole keeps her touch inside the prepared field.":"Cool powder-coated alloy, hinges, latches: a human clinical tool designed to unfold wherever it is needed."); return endTurn(); },
      take:"The sterile instruments and dressings remain staged at the table, where Nicole's hands will need them in order.",
      sit:function(){ out(S.borzov==="sick"?"Borzov needs every centimeter of the table. Nicole keeps the sterile field clear.":S.borzov==="operated"?"Borzov is using the table, which settles the question.":"Nicole keeps clinical surfaces for patients. She rests against the diagnostic rack instead."); return endTurn(); }}};
SCENERY.safe={name:"drug safe",alias:["safe","drug safe","drugs","pharmacy","code","combination","sedatives","antibiotics","analgesics","anesthesia","anesthetic","anesthesia kit","ampoule","ampoules","numbered ampoule","numbered ampoules","numbered recess","numbered recesses"],desc:"Sedatives, antibiotics, analgesics, and the anesthesia kit, all logged to the milligram. Nicole keeps the only code.",
  on:{open:function(){ out("Nicole keys the memorized code. The safe releases with a human click: sedatives, antibiotics, analgesics, controlled anesthesia, each ampoule clipped into a numbered recess."+(S.borzov==="sick"?" If she operates, the required doses are here and already entering her calculation.":" She checks the seals and closes it again.")); return endTurn(); },
      search:function(){ out(S.borzov==="sick"?"The controlled drugs and anesthesia kit are complete, in date, and sufficient for Borzov's field procedure. Nicole leaves each dose in its numbered place until she commits to a course.":"Controlled drugs, field anesthesia, antibiotics, analgesics: complete, sealed, logged. No discrepancy and no reason to create one."); return endTurn(); },
      take:"Nicole does not carry controlled drugs loose. Any dose the patient requires will be selected, logged, and used at the table.",
      read:"The code is in Nicole's memory, not written on the safe. The milligram log is clipped beside it."}};
SCENERY.rack={name:"diagnostic rack",alias:["rack","diagnostics","monitors","monitor","imagers","assay gear","imager","display","green display","readout","vital signs","vitals","pulse","pressure","reconstruction"],desc:function(){
  if(S.borzov==="sick"&&K().k_diag) return "The rack holds the scanner's green reconstruction: inflamed appendix, surrounding tissue angry, the clock visible in every measurement. The monitors keep Borzov's vital signs in disciplined rows.";
  if(S.borzov==="sick") return "Imagers and assay gear wait beside the table; the monitors show Borzov's pain in pulse and pressure but not yet its cause.";
  if(S.borzov==="operated") return "The monitors murmur through recovery: pulse settling, oxygen steady, temperature acceptable. A good ordinary pattern after an extraordinary operation.";
  return "Imagers and assay gear — a decent rural clinic folded into two crates, displays idle and self-tests green.";
},on:{read:function(){ out(val(SCENERY.rack.desc)); return endTurn(); },
      open:"The diagnostic rack's service panels stay closed during field use. Sensors and displays are already exposed on its working face.",
      touch:"Human polymer housings, warm displays, familiar controls. The rack answers to gloved hands and medical training.",
      take:"The rack is two clinic crates locked into a working station. It stays assembled beside the patient."}};
SCENERY.medical_log={name:"medical log",alias:["medical log","drug log","controlled drug log","milligram log","record","records"],desc:"A waterproof controlled-drug ledger, every ampoule signed in and out. Medicine survives impossible settings by being boring about records.",
  on:{read:function(){ out(S.borzov==="sick"?"Inventory complete. No allergies in Borzov's file; anesthesia and antibiotics available. The next entry waits for Nicole's decision.":"Every controlled dose balances to the milligram. Nicole signs the review with the satisfaction of a locked door."); return endTurn(); },
      take:"The log belongs clipped beside the safe, where the next physician can find it."}};
SCENERY.borzov_body={name:"Borzov's abdomen",alias:["abdomen","stomach","right side","pain","right lower quadrant","lower quadrant","guarding hand","symptoms"],desc:function(){
  if(S.borzov==="sick") return "His abdomen is guarded and rigid at the right lower quadrant; movement makes the pain sharpen. The clinical pattern points one way, but Nicole confirms patterns with instruments.";
  if(S.borzov==="operated") return "A clean field dressing covers the small incision. No fresh bleeding, no rigidity, no reason to disturb his sleep.";
  return "There is no abdominal complaint to examine now; Borzov is upright and professionally impatient.";
},on:{touch:function(){ out(S.borzov==="sick"?"She palpates gently from the painless side. Guarding, rebound tenderness, the involuntary flinch he cannot command away: enough.":"No examination is indicated now."); return endTurn(); },
      scan:function(){ return CHARS.borzov.on.scan(); },
      treat:function(){ return CHARS.borzov.on.treat(); }}};
SCENERY.medlab_air={name:"medical-hut air",alias:["antiseptic","smell","air","feet","odor","odour"],desc:"Antiseptic dominates the small hut, with warmed plastic, human fatigue, and thirty thousand steps of expedition footwear underneath.",
  on:{search:"The source is the whole occupied hut, not a hidden contamination. Nicole's infection-control standards remain intact."}};

WORLD.london = {
  name:"London",
  desc:"They named it London because naming things makes them smaller, and it does not work. Structures of the same seamless grey rise in blocks and drums and long low sheds, streetless, doorless, windowless, arranged with a purpose that stays just out of reach. It is less a city than the idea of a city, filed for later.",
  brief:"The sealed grey geometries of London.",
  scenery:["buildings","shed","slot","factory_interior"],
  sound:"Nothing. Then, from deep in the blocks, once: a single mechanical clack, like a relay closing. She waits a long time but it does not repeat.",
  exits:{ northeast:"plain_north" }
};
SCENERY.buildings={name:"buildings",alias:["building","structures","structure","blocks","drums","city","doors","door","windows","window","streets","street"],desc:"No seams, no entrances, no wear — specifically no doors, windows, or streets. Either the city is solid, or it opens for things that are not her.",
  on:{open:"There is no door, seam, handle, or acknowledged category of visitor. London remains closed without visibly containing a closure.",
      search:"She walks the nearest block's whole perimeter. The only human-scale interruption is the dark slot in the one long shed."}};
SCENERY.shed={name:"long shed",alias:["shed","low shed","long low shed","long low sheds","sheds"],desc:"One shed differs: along its flank, at knee height, runs a horizontal slot half a meter long, dark within.",
  on:{open:"There is nothing to grip — but that slot at knee height is an opening of sorts.", knock:"A flat clank, oddly disappointing. Nothing answers."}};
SCENERY.slot={name:"slot",alias:["opening","aperture","gap"],
  desc:"Half a meter of darkness. Her lamp, angled in, catches the suggestion of moving parts deep inside — stilled, or slow beyond seeing.",
  on:{
    photograph:function(){
      if(!K().k_factory){ K().k_factory=true;
        out("She braces the camera in the slot and lets the long exposure drink the dark. The image, when it builds, silences her: racks of half-made things receding out of focus — carapaces, legs, lensless eyes. The biots are not Rama's crew. They are Rama's product. Somewhere in this city, the world manufactures its own inhabitants.");
        outSys("Learned: London is a factory. Richard will want to hear this.");
      } else out("Another exposure of the still assembly lines. They have not moved.");
      return endTurn();
    },
    search:"Her arm fits to the elbow. Her nerve does not. The camera would be braver.",
    touch:"Cool air moves across her glove from inside — the building is breathing, very slowly."
  }};
SCENERY.factory_interior={name:"factory interior",alias:["factory interior","racks","assembly racks","assembly lines","lines","carapaces","legs","lensless eyes","half-made things","moving parts"],
  desc:function(){ return K().k_factory?"In the camera's long exposure, ranks of assembly racks carry half-made biots: carapaces without legs, legs without bodies, rows of lensless eyes. The interior is less a warehouse than an organism manufacturing its own cells.":"The slot admits a suggestion of racks and moving parts, but naked sight cannot hold enough light to make them facts. The camera can."; },
  on:{photograph:function(){ return SCENERY.slot.on.photograph(); },
      search:"The interior is beyond her arm and almost beyond the light. The slot — and the camera — are the only safe access.",
      take:"Every component is deep inside the sealed structure, on an assembly line built for no human hand."}};
WORLD.beta_shore = {
  name:"Beta Camp — Shore of the Cylindrical Sea",
  desc:function(){
    if(S.act===3) return "The cliff, the hoist frame rusted to sculpture, the ringed sea breathing below in the dark — Beta Camp, reduced to geometry and memory. The stage still floats at the cable's foot, patient as ever, and something rides beside it that was not here twenty years ago.";
    let d="The plain ends at a fifty-meter cliff, and beyond it lies the impossible: a sea that girdles the world, a band of dark water ten kilometers wide, bending up on either hand to meet itself overhead. "+(F().ramaDawn?"Under the risen light it is grey-green and restless, whitecaps chasing themselves around the sky.":"In the darkness it is a blackness with texture, felt more than seen.")+" A cable hoist descends the cliff to a floating stage where the expedition's skiff, the Resolution, rides its line.";
    if(F().boatDamaged&&!F().boatFixed) d+=" The Resolution lies half-swamped against the stage, hull gashed.";
    return d;
  },
  brief:"Beta Camp on the cliff; the hoist; the Resolution below.",
  scenery:["sea","cliff","hoist","beta_mooring","boat_fittings","sea_log","rama_day","camp_rover","richard_slate","richard_robots","michael_rosary","camp_drone"],
  sound:function(){ return F().ramaDawn?"Wind, and water on stone — the oldest sounds in the world, in the newest place she has ever been.":"Faint slap of water below, in the dark."; },
  exits:{ west:{to:"camp_alpha", msg:"The rover retraces the hour west to Camp Alpha."},
    south:{to:"ny_dock", blocked:function(){
      if(S.phase==="storm") return "Richard's hand closes on her arm. \"Not on that water. Not until we know what the dawn is going to do.\"";
      if(F().boatDamaged&&!F().boatFixed) return "The Resolution is holed. Nothing crosses ten kilometers of that on goodwill. (The hull patch kit from camp stores could mend her.)";
      return null;
    }, msg:"CROSSING. The hoist lowers them to the stage; the Resolution takes the sea at a steady eight knots. Halfway out, sleek shapes pace the boat for a kilometer — shark biots, Richard names them, with more delight than the name deserves — then peel away as if dismissed. The far cliff rises. On its crown stand towers."} },
  onCmd:function(verb,obj){
    if(verb==="drink"&&obj&&obj.kind==="scenery"&&obj.id==="sea"){
      out("Absolutely not — her own rule, posted in the medical log in capital letters."); endTurn(); return true;
    }
    if(verb==="smell"&&obj&&obj.kind==="scenery"&&obj.id==="sea"){
      out("Salt, cold mineral water, and a faint organic slickness that makes the sea feel body-adjacent. It does not smell like a machine should."); endTurn(); return true;
    }
    if(S.phase==="storm"&&verb==="tie"&&obj&&((obj.kind==="item"&&obj.id==="boat")||(obj.kind==="scenery"&&obj.id==="hoist"))){ secureBoat(); return true; }
    return false;
  }
};
SCENERY.sea={name:"cylindrical sea",alias:["sea","ringed sea","water","ocean","waves"],
  desc:"The water is real — the probes taste salts, organics, a chemistry like a body's. A sea with the composition of blood plasma, hung around the middle of a machine. Nobody on two worlds knows what to do with that sentence.",
  on:{touch:"From the stage, once, she let it run through her glove: cold, faintly slick. Alive-adjacent.", drink:"Absolutely not — her own rule, posted in the medical log in capital letters."}};
SCENERY.cliff={name:"cliff",alias:["cliffs","edge","southern cliff","far cliff","cliff face"],desc:"Fifty meters sheer on this side. On the far side, the southern cliff stands ten times higher — another asymmetry on the pile of asymmetries."};
SCENERY.hoist={name:"cable hoist",alias:["hoist","cable hoist","hoist frame","frame","winch","stage","floating stage","bollard","controls","hoist controls","control pendant","pendant","hoist line"],desc:"A motorized line and weathered frame descend to the floating stage. Sturdy, human, comprehensible — three qualities in short supply here.",
  on:{use:"The hoist carries people and gear between cliff and stage. The crossing itself is SOUTH when sea and schedule permit.",
      push:"She checks the control pendant without moving the occupied stage. Up, down, stop: three blessedly familiar instructions.",
      take:"The control pendant is hard-wired to the hoist frame. Nicole leaves this useful piece of human machinery attached to its work."}};
SCENERY.beta_mooring={name:"Resolution's mooring",alias:["mooring","moorings","mooring rings","rings","lines","mooring lines","fenders","knots","second line","doubled lines"],
  desc:function(){
    if(F().boatSecured) return "Two mooring lines run to separate rings, fenders doubled along the stage side, every knot dressed and checked. The Resolution has the best shelter this exposed cliff can offer.";
    if(F().boatDamaged&&!F().boatFixed) return "A slack line saws at its ring while the damaged Resolution wallows against the stage. The mooring held; the hull paid for it.";
    return "One working line and ordinary fenders hold the Resolution to the floating stage. Adequate for calm water; Richard's forecast has other adjectives.";
  },
  on:{touch:"Human rope and rubber fenders, wet with the impossible sea.",
      pull:"She tests the line. It holds, but securing the boat for weather means a deliberate TIE BOAT.",
      take:"The lines and fenders are working parts of the Resolution's mooring. Removing them would turn equipment into a problem."}};
SCENERY.boat_fittings={name:"Resolution's fittings",alias:["boat fittings","resolution fittings","outboard","electric outboard","motor","emergency kit","boat emergency kit","thwart","helm","boat controls"],desc:"The electric outboard rests at standby behind the thwart. A compact emergency kit is clipped beneath the seat, and the helm controls are dry and familiar.",
  on:{open:"The fitting has no lid to force. The emergency kit is clipped and sealed for the crossing; the outboard's service housing stays shut beside open water.",
      search:"Emergency kit secure beneath the thwart, outboard seated, helm controls dry. The human checks end in reassuringly ordinary answers.",
      touch:"Rubber grips, molded seat, sealed motor housing — small-boat hardware made for human hands.",
      take:"It is secured working equipment on the Resolution, not loose gear."}};
SCENERY.sea_log={name:"medical log",alias:["medical log","rule","capital letters"],desc:"Nicole's field notes include a standing rule about the Cylindrical Sea: unknown salts, unknown organics, no ingestion.",
  on:{read:"DO NOT DRINK THE RAMAN WATER. The capital letters are hers; so is the professional satisfaction of not needing a second draft."}};
SCENERY.rama_day={name:"Raman sky",alias:["sky","day","dawn","suns","straight suns","lights","overhead lights","air","salt air","warm air","wind","spray","whitecaps","far cities"],desc:function(){ return F().ramaDawn?"Six straight suns burn along Rama's length. Wind drives spray off the grey-green sea, whitecaps run up both sides of the world, and far cities stand revealed in shadowless day.":"The sky is sixteen kilometers of cold darkness. Rama's six long lights have not yet made a day of it."; },
  on:{touch:"Weather at this scale cannot be touched one piece at a time; wind and spray find Nicole without assistance.",
      smell:function(){ out(F().ramaDawn?"Warm salt air moves off the sea, carrying mineral water, spray, and the faint organic note that makes Raman weather stranger than vacuum.":"The dark air is cool and still. Near the sea it carries salt, cold mineral water, and a faint organic slickness."); return endTurn(); },
      listen:function(){ out(F().ramaDawn?"Wind, water, singing hoist cables — the first Raman morning sounding like a machine discovering weather.":"Dark water below, the hoist at rest, and an atmosphere waiting for heat."); return endTurn(); }}};
ITEMS.boat={name:"Resolution",alias:["boat","skiff","resolution","hull","boat hull","port side","gash","bow","stencil","name"],loc:"beta_shore",fixed:true,hidden:true,
  desc:function(){ return F().boatDamaged&&!F().boatFixed?"The skiff lies gashed along the port side, sloshing. Fixable — with resin and mesh and an hour of unglamorous work.":"A rigid inflatable with an electric outboard, rated for six. Someone has stenciled RESOLUTION on the bow, which Nicole considers the most human act committed inside Rama to date."; },
  takeFail:"It stays in the water; that is the entire point of it.",
  on:{
    tie:function(){ if(S.phase==="storm"){ secureBoat(); } else { out("She checks the mooring. Snug."); endTurn(); } },
    use:function(){ out("To cross, GO SOUTH when the sea and the schedule allow."); return endTurn(); },
    fix:null,
    open:"It has no lid. It is a boat.",
    read:"RESOLUTION, stenciled on the bow in expedition black. A practical label made unexpectedly tender by its location.",
    search:function(){ out(F().boatDamaged&&!F().boatFixed?"The port-side gash is the only damage that matters: torn skin, exposed fabric, edges clean enough for resin and mesh.":"Outboard seated, controls dry, hull sound, emergency kit clipped beneath the thwart. A small human boat asked to cross a world-sized machine."); return endTurn(); },
    touch:function(){ out(F().boatDamaged&&!F().boatFixed?"The torn hull fabric flexes wetly around the gash. Fixable, but not by optimism.":"Cold spray on rubberized hull; beneath it, the faint vibration of the electric outboard at standby."); return endTurn(); }
  }};
ITEMS.patch={name:"hull patch kit",alias:["patch","kit","resin","repair kit","mesh","spreader","hull resin","surface prep"],loc:"limbo",
  desc:"Resin, mesh, spreader, and surface prep: the difference between a hole and a story about a hole.",
  on:{use:function(r,r2){ return tryFixBoat(); },
      open:"She unfolds the repair wallet: sealed resin, structural mesh, spreader, surface prep. Complete and still clean.",
      search:"Resin, mesh, spreader, surface prep — one careful hull repair in a package small enough to inspire false confidence."}};
function tryFixBoat(){
  if(S.loc!=="beta_shore"){ outSys("Nothing here needs patching."); return; }
  if(!F().boatDamaged){ out("The Resolution's hull is sound."); return endTurn(); }
  if(F().boatFixed){ out("Already mended, and holding."); return endTurn(); }
  F().boatFixed=true;
  out("An hour of resin, mesh, and language her mother would not have approved of. The gash closes. The Resolution rides her line again, seaworthy if not proud.");
  outSys("The boat is repaired.");
  return endTurn();
}
function secureBoat(){
  if(F().boatSecured){ out("The Resolution is already double-moored and fendered."); return endTurn(); }
  F().boatSecured=true;
  out("She and Richard run a second line, double the fenders, and swing the hoist stage to the lee of the cliff. Richard pats the hull. \"Sleep well, little ship.\"");
  outSys("The Resolution is secured against the storm.");
  return endTurn();
}

WORLD.ny_dock = {
  name:"New York — Waterfront",
  desc:function(){ return "The island the maps call New York: a walled oval two kilometers long, dense with towers, standing in the middle of the Cylindrical Sea like a sentence in a language of one. A ramp climbs from the water through a gap in the seawall. The towers above are dark"+(F().ramaDawn?", their tops burning faintly in the long light":"")+". Of all Rama's cities, only this one hums."; },
  brief:"The New York waterfront; the ramp up through the seawall.",
  scenery:["seawall","towers","sea","ny_mooring","ny_radio","beta_dinghy","ny_arrival_gear","ny_gloves","camp_drone","michael_rosary","ny_hum"],
  sound:"There. Under everything: a deep, patient thrumming from beneath the island, like machinery the size of a cathedral turning over in its sleep.",
  exits:{ north:{to:"beta_shore", blocked:function(){ return actOneNoReturn(); }, msg:"The Resolution takes them back across a mercifully empty sea."}, up:"ny_plaza", "in":"ny_plaza" }
};
SCENERY.seawall={name:"seawall",alias:["wall","ramp","island","walled oval","gap","waterfront"],desc:"Fifty meters of the grey material, sheer to the water. The ramp is the only gap — an invitation, if Rama did invitations.",
  on:{enter:function(){ out("She follows the ramp up through the seawall and into New York's central plaza."); return moveTo("ny_plaza"); },
      climb:function(){ out("She climbs the ramp through the seawall."); return moveTo("ny_plaza"); }}};
SCENERY.towers={name:"towers",alias:["tower","skyline","buildings","spires"],desc:"Octahedra on columns, fluted drums, blades of grey rising two hundred meters. No windows. No doors at street level. And yet: the hum."};
SCENERY.ny_mooring={name:"waterfront mooring",alias:["mooring","mooring rings","rings","lines","empty mooring","long swells","swells"],desc:function(){ return F().rescued?"The rings are empty. Francesca took the Resolution; long swells tug at the lines she left behind.":"The Resolution rides below the ramp, made absurdly small by seawall and sea."; },
  on:{search:"Wet rope, metal rings, no hidden boat and no useful answer from the sea."}};
SCENERY.ny_radio={name:"Richard's radio",alias:["radio","richard's radio","receiver","channel","clean channel","command channel","transmission","traffic"],
  desc:function(){ return F().radioScene?"Richard's field radio is locked to the Newton traffic. The recall order repeats beneath Francesca's smooth voice and Michael's much less negotiable one.":"A field radio clipped to Richard's harness, receiving the New York hum more clearly than any human channel."; },
  on:{use:"The channel is open. Francesca can hear Nicole; TALK TO or ASK FRANCESCA carries over the link.",
      listen:function(){ out(F().radioScene?"Recall traffic, Francesca's edited contrition, then Michael's calm declaration that he is crossing whether the Newton approves or not.":"Static, telemetry, and New York's low hum bleeding through the receiver."); return endTurn(); },
      read:"The display identifies the Newton command channel and a field-strength bar that keeps trembling in time with the island's hum."}};
SCENERY.beta_dinghy={name:"Beta dinghy",alias:["dinghy","beta dinghy","second boat","rowboat","outboard"],desc:function(){
  if(!F().michaelArrived) return "Michael is still bringing the Beta dinghy across the circling sea; it is a moving light and an engine note, not yet a boat Nicole can reach.";
  if(F().triedCrossing) return "The dinghy is wreckage against the seawall now, its sacrifice having made the crossing decision permanent.";
  return "A work dinghy with an electric outboard, wet to the gunwales and tied in haste. Michael has brought exactly enough boat for an argument with the sea.";
},on:{take:"It is moored transport, not luggage.",
      use:"To attempt the return crossing, Nicole must choose NORTH — and accept the decision when it is asked."}};
SCENERY.ny_arrival_gear={name:"Michael's landing gear",alias:["crate","ration crate","crate of rations","rations","last crate","landing gear"],desc:function(){ return F().michaelArrived?"The last crate of rations sits above the spray line beside Michael's soaked gloves. Practical provisions for whichever shelter Nicole chooses.":"No landing gear yet. Michael and the last rations are still on the water."; },
  on:{open:"Ration bricks, water packs, thermal blankets: survival reduced to labeled rectangles.",
      take:"The crate will travel with the group when Nicole chooses shelter; carrying it around by hand gains nothing."}};
SCENERY.ny_gloves={name:"Michael's soaked gloves",alias:["soaked gloves","michael's gloves","wet gloves","gloves"],desc:function(){ return F().michaelArrived?"Michael's soaked gloves lie beside the ration crate, salt-stiff at the cuffs after the crossing.":"Michael and his gloves are still on the water."; },
  on:{touch:"Cold, wet expedition fabric. Michael has already traded them for the rosary in his bare hand.",
      take:"They are Michael's gloves, set out to dry beside the provisions."}};
SCENERY.ny_hum={name:"New York's hum",alias:["hum","thrumming","heartbeat","machinery","sound","vibration"],desc:"A deep, patient chord rises through island, floor, and bone. It is not loud. Scale makes loudness unnecessary.",
  on:{listen:"Layered tones turn just below hearing, a machine the size of an island idling in its sleep.",
      touch:"The vibration enters through her glove and climbs the bones of her arm, too steady to be geological."}};

WORLD.ny_plaza = {
  name:"New York — Plaza of the Octahedron",
  desc:"A plaza at the island's heart, floored in the polished track-material, ringed by towers. At its center stands a flawless octahedron ten meters tall, balanced on one vertex, humming almost below hearing. Narrow ways lead off between the towers; to the east, one is curtained across with silver lattice, like a web spun by something with a theory of geometry.",
  brief:"The central plaza; the octahedron; the latticed way east.",
  scenery:["octahedron","ways","plaza_lattice_view","plaza_surface","towers","camp_drone","ny_hum"],
  sound:"The octahedron's hum resolves, this close, into layered tones — a chord held for a million years.",
  exits:{ down:"ny_dock", out:"ny_dock", east:"ny_lattice" }
};
SCENERY.octahedron={name:"octahedron",alias:["polyhedron","monolith","crystal","facets","facet","vertex","reflection","nicole's reflection"],
  desc:"Ten meters of mirror-smooth facets balanced on a point, which is not how mass behaves anywhere Nicole has been licensed to practice medicine. Her reflection stands inside it, warped, watching her back.",
  on:{touch:function(){ out("Warm — blood warm. Beneath her palm, the hum climbs a quarter tone, holds, and returns. Acknowledged, she thinks, absurdly. Or measured."); K().k_octahedron=true; return endTurn(); },
    knock:"She stops her knuckles a centimeter short. Some doors you do not knock on.",
    photograph:"The image shows the plaza, the towers, and a smeared column of light where the octahedron stands. It photographs the way a secret does."}};
SCENERY.ways={name:"narrow ways",alias:["ways","streets","alleys","alley"],desc:"Slots between towers, dark and patient. Only the eastern one is latticed."};
SCENERY.plaza_lattice_view={name:"eastern lattice",alias:["lattice","silver lattice","web","curtain","latticed way","eastern lattice","silver threads","threads","polyhedral web"],desc:"Across the eastern way, silver threads cross in precise polyhedral webs. The shaft and the details are out of sight from here; EAST will put Nicole beneath them.",
  on:{touch:"The lattice is across the plaza to the east, beyond her reach from here.",
      pull:"She would have to go EAST before she could test it."}};
SCENERY.plaza_surface={name:"plaza",alias:["plaza","floor","track material","polished floor","surface","seam","seams"],desc:"The plaza is floored in the same polished material as the biot track, fitted without seams and faintly warm underfoot.",
  on:{touch:"Mirror-smooth, warm, and machined on the scale of a civic square."}};
WORLD.ny_lattice = {
  name:"New York — The Latticed Way",
  desc:function(){ return "A slot canyon of towers, crossed and recrossed by silver lattice — cables finer than wire, taut as certainty, woven in polyhedral webs. At the way's end the ground opens: a circular shaft, perhaps twenty meters across, breathing cool air up from a darkness the lamps cannot bottom. A spiral of hand-holds — they look like hand-holds; everything here looks like something — descends its inner wall."+(F().fell?"":" The lip of the shaft is glass-smooth."); },
  brief:"The latticed way; the great shaft descending.",
  scenery:["lattice","shaft","holds","shaft_lip","towers","suit_lamp","camp_drone","ny_hum"],
  exits:{ west:"ny_plaza",
    down:{to:"pit", blocked:function(){ return null; }, msg:null} },
  onCmd:function(verb,obj){
    if(verb==="smell"&&obj&&obj.kind==="scenery"&&obj.id==="shaft"){
      out("Cool air rises mineral-sharp from the shaft, with an almost-organic undertone Nicole cannot place. The smell is evidence that the darkness is not empty.");
      endTurn(); return true;
    }
    return false;
  },
  onGo:function(dir){
    if(dir==="down"&&!F().fell){ theFall(); return true; }
    if(dir==="down"&&F().rescued){ out("Once was enough. The lair can be reached the way Richard found — through the barred gallery below — and she has no intention of arriving by gravity again."); moveTo("lair"); return true; }
    return false;
  }
};
SCENERY.lattice={name:"lattice",alias:["web","cables","webbing","silver lattice","wire","wires","junctions","fused junctions","polyhedra","polyhedral webs"],
  desc:"Not spun — drawn, extruded, engineered. Each junction is a tiny fused polyhedron. Francesca is filming it with the expression she saves for things that will lead a broadcast.",
  on:{touch:"Taut, faintly warm, thrumming at a frequency she feels in her teeth.", pull:"It does not so much resist as decline to acknowledge force at her scale.", take:"It is anchored into the towers themselves."}};
SCENERY.shaft={name:"shaft",alias:["pit","hole","opening","circular shaft","air","cool air","breath","smell","mineral smell","depth"],
  desc:"Twenty meters across. The exhaled air is cool and carries a smell she has no referent for — mineral, and under it something almost organic. The spiral of holds descends into the dark. The lip, she notes clinically, is polished to a gleam.",
  on:{listen:"From far below: the island's hum, and — once — a sound like great soft bodies moving. Then nothing, for a long time.",
    photograph:"The flash drops into the dark and shows her thirty meters of wall, then nothing. The shaft keeps its floor to itself."}};
SCENERY.holds={name:"hand-holds",alias:["holds","spiral","rungs","handholds","recess","recesses","first hold","first few holds"],desc:"A descending spiral of recesses in the shaft wall, spaced for something with reach. Usable, maybe, by a careful human. The first few are within a long step of the polished lip."};
SCENERY.shaft_lip={name:"shaft lip",alias:["lip","shaft lip","footing","floor","edge","rim","glass-smooth lip","polished lip","smooth surface","boot"],
  desc:function(){
    if(F().rescued) return "The polished lip is unchanged: seamless, glass-smooth, and now impossible for Nicole to mistake for neutral ground. A faint scrape is the only mark her fall managed to leave.";
    if(F().fell) return "Far above, the lip is only a bright edge. She remembers exactly how little friction it offered her boot.";
    return "The floor runs to the shaft without curb or warning. Its polished lip gleams like glass; Richard's warning about footing is engineering, not nerves.";
  },
  on:{touch:function(){ out(F().fell?"Memory supplies the sensation: no grain, no purchase, her boot gone sideways before balance could vote.":"Even a glove slides across it with almost no drag. The safe conclusion is distance."); return endTurn(); },
      search:"No grit, seam, rail, or anchor interrupts the polished edge. The danger is precisely the absence of detail."}};

function theFall(){
  F().fell=true; S.phase="pit"; S.pit.hurt=true;
  out("\"One look,\" Francesca says behind her, camera up. \"Get on the holds, I'll frame you against the depth — history, Nicole, come on.\" And Nicole — who will replay this instant for years — steps onto the polished lip to reach the first hold.");
  out("The world's oldest accident. Her boot goes out from under her as if the floor had voted. The lattice above spins once across her vision; her hands find a hold, lose it — the wall's spiral batters her in slow ruthless rhythm, breaking her fall in installments — and then black.");
  outAlert("* * *");
  out("Pain reassembles her, one system at a time. She is lying on cold stone, in darkness pricked by her suit lamp's dying angle. Far above — forty meters, fifty — hangs a coin of grey light. Of Francesca: no lamp, no voice, nothing.");
  moveTo("pit");
}

WORLD.pit = {
  name:"The Pit",
  desc:function(){
    let d="The shaft's floor: a chamber of smooth stone, ten meters across, the spiral of holds ending — she can now see, bitterly — a full body-length above the highest point she can reach. Three low tunnels lead off into absolute dark, each exhaling cool air. The coin of light hangs far above.";
    if(S.pit.splinted) d+=" Her splinted ankle throbs in time with her pulse — bearable, if nothing is asked of it.";
    else if(S.pit.hurt) d+=" Her left ankle is a bright wrongness she has been refusing to look at.";
    return d;
  },
  brief:"The pit floor; the unreachable spiral; three dark tunnels.",
  scenery:["tunnels","light","spiral2","pit_injury","pit_band","pit_floor","pit_walls"],
  sound:"Her own pulse. The island's hum, closer now, beneath the stone. And at long intervals, from one tunnel or another, the soft-bodied sound.",
  exits:{},
  noExit:"The tunnels are low, lightless, and exhale like living throats. Nicole des Jardins has exactly one working ankle and a rule about spending it wisely. Not yet. Not blind.",
  onGo:function(dir){
    if(dir==="up"){
      if(F().cableTied){ pitClimbOut(); return true; }
      if(F().cableDown){ out("The cable hangs within reach. TIE it around herself first — Richard's voice, above, says exactly that, twice."); return true; }
      out("She tries. Splinted or not, the gap between the floor and the lowest hold defeats her three times, the last attempt costing a cry she is glad no one hears. Not this way. Not alone."); endTurn(); return true;
    }
    return false;
  },
  onSleep:function(){
    S.pit.waitTurns+=2;
    out("She sleeps because the body invoices whether or not you can pay. Dreams: her father's house at Beauvois; her mother's country, drums at dusk; water. She wakes with her cheek on stone and the coin of light unchanged.");
    pitProgress();
    return endTurn();
  },
  onShout:function(){
    if(F().falstaffHere){ pitSignal("Her shout"); return; }
    out("She shouts up the shaft, spacing the cries, saving her voice between. The stone returns nothing. But sound carries in Rama — she has seen the instruments say so — and someone up there is Richard Wakefield, who does not stop looking for things.");
    S.pit.signaled=true;
    return endTurn();
  },
  onSing:function(){
    out("She sings — low, steady, her father's old song about the sea. It is not for rescue. It is to remain Nicole, in the dark, on purpose. It works, mostly.");
    relUp("richard",0);
    return endTurn();
  },
  onCmd:function(verb,obj){
    if(verb==="smell"&&obj&&obj.kind==="scenery"&&obj.id==="tunnels"){
      out("The leftmost tunnel's breath is mineral first, then almost organic — the warm-stone scent of something Nicole cannot classify and does not believe is empty.");
      endTurn(); return true;
    }
    if(verb==="examine"&&obj&&obj.kind==="self"){
      out(selfDesc()+" Here in the pit, the useful facts are harsher: "+(S.pit.splinted?"her left ankle is splinted and holding, bruises darken beneath the suit, and thirst is becoming a clinical measurement.":"her left ankle is swelling into a bright wrongness, the impact has left her bruised and concussed, and diagnosis must come before treatment."));
      endTurn(); return true;
    }
    if(verb==="wave"&&obj&&obj.kind==="item"&&obj.id==="scarf"){
      if(F().falstaffHere){ pitSignal("The scarf, waved in her lamp beam,"); return true; }
      out("She waves the scarf at the distant coin of light. A red thread of defiance. Nothing answers yet."); endTurn(); return true;
    }
    if((verb==="light")&&F().falstaffHere){ pitSignal("Her lamp, aimed and flashed in threes,"); return true; }
    return false;
  },
  onTurn:function(){ pitProgress(); }
};
SCENERY.tunnels={name:"tunnels",alias:["tunnel","openings","dark tunnels","mouths","tunnel mouths","leftmost tunnel","left tunnel","leftmost mouth","middle tunnel","right tunnel"],
  desc:"Three mouths, each a meter and a half high, floored with the polished material. Things travel these. The air from the leftmost carries, very faintly, that almost-organic smell.",
  on:{listen:"From the leftmost tunnel, at the edge of hearing: movement, soft and multiple and unhurried. It does not approach. It is, she becomes certain, aware of her, and electing to wait.",
    search:"She leans into the leftmost mouth as far as nerve allows. Her lamp finds the tunnel bending away, and on its wall — she pulls back — a band of painted color: red, then blue, then green. Deliberate. A sign, for eyes that read color.",
    smell:"The leftmost tunnel's breath is mineral first, then almost organic — the warm-stone scent of something Nicole cannot classify and does not believe is empty."}};
SCENERY.light={name:"coin of light",alias:["light","opening","top","sky","lamp","suit lamp","lamp beam","beam","flashlight"],desc:"The shaft's mouth, impossibly far. Her suit lamp throws a much smaller coin across the floor; sometimes the high light shifts, as if something crossed it. Sometimes it is just her eyes voting for hope.",
  on:{touch:"Her suit lamp is sealed to the harness and warm from use. Its beam is weak, but it is hers.",
      light:function(){ if(F().falstaffHere) return pitSignal("Her lamp, aimed and flashed in threes,"); out("She flashes the lamp up the shaft in a deliberate pattern. No answer yet, but the act itself is a refusal to disappear."); return endTurn(); }}};
SCENERY.spiral2={name:"spiral of holds",alias:["holds","spiral","hand-holds","handholds","lowest hold","gap","unreachable gap"],desc:"It ends a body-length above her best reach — designed, evidently, for a species that does not fall, or does not mind.",
  on:{enter:"She tries for the lowest hold. The body-length gap defeats reach, jump, and pride; climbing starts only after someone gets a line to her.",
      touch:"The lowest hold remains a body-length beyond her fingertips.",
      pull:"There is nothing within reach to pull."}};
SCENERY.pit_injury={name:"injured ankle",alias:["ankle","left ankle","injury","injuries","fracture","malleolus","bruises","contusions","concussion","splint","splinted ankle","pain"],
  desc:function(){
    if(S.pit.splinted) return "The collapsible splint holds her left ankle in alignment. Swelling presses the wrap but circulation remains good; pain has become information instead of weather.";
    if(K().k_ankle) return "The left ankle is swollen around a hairline lateral-malleolus fracture. Bruising maps the rest of the fall; the concussion is mild and resolving. It wants the splint in her kit.";
    return "Her left ankle is swelling fast and refuses weight. Bruises and headache report the rest of the fall, but she will not treat a guess. The scanner can turn pain into a diagnosis.";
  },
  on:{touch:function(){ out(S.pit.splinted?"Warm toes, good capillary return, wrap firm but not dangerous. The splint is doing its job.":"Tenderness spikes at the outer ankle. She stops before pain can pretend to be useful data."); return endTurn(); },
      scan:function(){ out(pitSelfScan()); return endTurn(); },
      treat:function(){ return pitTreatSelf(); }}};
SCENERY.pit_band={name:"painted color band",alias:["color band","painted band","band","colors","paint","red blue green","red band","blue band","green band","sign"],desc:"Just inside the leftmost tunnel, her lamp catches a painted band: red, then blue, then green. The edges are too exact for seepage, the order too deliberate for decoration.",
  on:{read:"It is meant to be read — that much Nicole can tell. Red, blue, green forms a phrase whose grammar and audience remain somewhere in the dark.",
      touch:"The pigment lies flush with the tunnel wall, neither raised nor worn. A sign made to outlast its readers.",
      photograph:"She records the band with scale and color references. If she survives, the archive will receive three very important rectangles."}};
SCENERY.pit_floor={name:"pit floor",alias:["floor","stone","smooth stone","chamber","shaft floor","cold stone","darkness"],desc:"A ten-meter chamber of smooth, cold stone. Impact marks exist mostly in Nicole; the floor itself shows no concern and almost no wear.",
  on:{touch:"Cold, seamless stone against her glove. Beneath it, the island's hum is close enough to feel."}};
SCENERY.pit_walls={name:"shaft wall",alias:["wall","walls","shaft wall","tunnel wall","stone wall","impact marks"],desc:"Smooth stone rises around her, interrupted by the spiral of holds and three low tunnel mouths. One wall inside the leftmost tunnel carries the painted color band.",
  on:{touch:"Cold, seamless, and faintly vibrating with the island's hum. The wall offers no accidental handhold."}};

function pitProgress(){
  S.pit.waitTurns++;
  if(!F().falstaffHere && !F().rescued && S.pit.waitTurns>=5 && S.pit.splinted){
    F().falstaffHere=true; CHARS.falstaff.gone=false;
    out("A sound from above — tiny, mechanical, absurd. Down the spiral of holds comes picking a robot the size of a rat, brass-bright in her lamp: one of Richard's. It stops on the lowest hold, cocks its head with theatrical precision, and declaims in a piping voice: \"How now, spirit! Whither wander you?\"");
    outSys("Richard's little robot has found the shaft — SIGNAL it so it can carry word: SHOUT, WAVE SCARF, or flash a LIGHT.");
  }
  else if(!F().falstaffHere && !F().rescued && S.pit.waitTurns>=9 && !S.pit.splinted){
    F().falstaffHere=true; CHARS.falstaff.gone=false;
    out("A sound from above — tiny, mechanical. Down the spiral comes a robot the size of a rat, brass-bright: one of Richard's Shakespeareans. It halts on the lowest hold and pipes: \"How now, spirit! Whither wander you?\"");
    outSys("Richard's little robot has found the shaft — SIGNAL it: SHOUT, WAVE SCARF, or flash a LIGHT.");
  }
}
function pitSignal(how){
  if(F().signalDone){ out("Falstaff has already gone up with the news."); return endTurn(); }
  F().signalDone=true; CHARS.falstaff.gone=true;
  out(how+" does it. The little robot executes a bow — \"I am not only witty in myself, but the cause that wit is in other men!\" — and swarms back up the spiral into the dark, carrying her position in its small bright head.");
  F().richardTimer=S.turn+2;
  return endTurn();
}
pitDrink = function(){
  if(!has("canteen")){ out("Her canteen is somewhere above, with everything else she left in the world of plans. The arithmetic of her situation loses a term she badly wanted."); return endTurn(); }
  if(S.pit.water<=0){ out("The canteen gives up a last, insulting drop. That is the end of the water."); return endTurn(); }
  S.pit.water--;
  out(S.pit.water===2?"A measured swallow. Two remain, by her ration.":S.pit.water===1?"A second swallow, held on the tongue. One remains.":"The last ration, taken without ceremony. The canteen is empty, and the arithmetic of her situation is now very simple.");
  return endTurn();
}
pitSelfScan = function(){
  K().k_ankle=true;
  return "The scanner is blunt about it: hairline fracture, left lateral malleolus; contusions in ugly constellation; mild concussion, resolving; dehydration, incipient. Survivable — her professional opinion, rendered to her only patient. The ankle wants a splint before it wants anything else.";
}
pitTreatSelf = function(){
  if(!S.pit.hurt){ out("Nothing left to treat but her pride, which is beyond medicine."); return endTurn(); }
  if(!has("medkit")){ outSys("Her medical kit — she checks twice — is still on her sling. Small mercies. (It's in her INVENTORY: TREAT SELF again.)"); return; }
  if(!K().k_ankle){ out("She reaches for the kit, then stops herself: diagnose first, doctor. (SCAN SELF.)"); return endTurn(); }
  if(S.pit.splinted){ out("The splint is set and holding."); return endTurn(); }
  S.pit.splinted=true;
  out("She does for herself what she has done for a hundred others, narrating the steps aloud in the dark because a voice — any voice — helps: analgesic, measured; the ankle set against the collapsible splint; the wrap firm to the edge of circulation. When it is done she is shaking, and the pain has become a fact instead of a weather. Facts can be worked with.");
  outSys("Ankle splinted. Now: conserve water, keep signaling, and endure. (SLEEP passes time; DRINK spends rations; SHOUT or WAVE SCARF when hope presents itself.)");
  return endTurn();
}
function pitClimbOut(){
  F().rescued=true; S.phase="stranded";
  out("She ties the cable around her waist with a surgeon's knots and calls up two words she will remember as among the best of her life: \"Take me.\" The winch above — Richard's improvisation of hoist motor and stubbornness — walks her up the wall, her good foot fending, the coin of light widening into a sky.");
  out("Then hands. Richard Wakefield hauls her over the polished lip and holds on — no words for a moment, just the grip of a man doing arithmetic about how close it was. \"Three days,\" he says finally, into her hair. \"Francesca said the shaft was empty. She said she looked.\" A beat. \"I looked.\"");
  outAlert("* * *");
  moveTo("ny_lattice");
}
function falstaffSpeech(){
  if(S.act===1&&S.loc==="pit"&&F().falstaffHere){
    if(F().signalDone) return "Falstaff has already gone up with the news.";
    F().signalDone=true; CHARS.falstaff.gone=true; F().richardTimer=S.turn+2;
    return "Her voice, steady and clear, does it. The little robot executes a bow — ‘I am not only witty in myself, but the cause that wit is in other men!’ — and swarms back up the spiral carrying her position in its small bright head.";
  }
  return "Falstaff answers with a courtly bow and two bright notes. The older service is complete, and no past machinery stirs.";
}
CHARS.falstaff={name:"Falstaff",alias:["robot","falstaff","little robot","rat robot","small brass figure","brass figure"],loc:"pit",gone:true,pron:"it",
  desc:"Thirty centimeters of brass-colored ingenuity, built by Richard Wakefield's own hands and programmed, for reasons psychiatry could address, to speak only in Shakespeare.",
  here:function(){ return S.loc==="beta_shore"?"Falstaff stands sentry on the skiff's foredeck, brass case bright in the running light.":"Falstaff, Richard's little robot, perches on the lowest hold, watching her with lens-bright interest."; },
  talk:function(){ return falstaffSpeech(); },
  ask:{}, askDefault:function(){ return falstaffSpeech(); },
  on:{wave:function(){ if(S.act===1&&S.loc==="pit"&&F().falstaffHere) return pitSignal("Her hand signal,"); out("Falstaff acknowledges with a precise mechanical bow."); return endTurn(); }},
  show:{ scarf:function(){ if(S.act===1&&S.loc==="pit"&&F().falstaffHere) return pitSignal("The scarf, held up in the lamp beam,"); out("Falstaff studies the scarf, executes a courtly bow, and leaves every old rescue flag untouched."); return endTurn(); },
         medkit:function(){ if(S.act===1&&S.loc==="pit"&&F().falstaffHere) return pitSignal("The kit, held up in the lamp beam,"); out("Falstaff inspects the medical kit with solemn brass attention, then reports nothing because no rescue is in progress."); return endTurn(); } }
};
ITEMS.cable={name:"cable",alias:["line","rope","winch cable","cable end","end","swaying end","rescue line"],loc:"limbo",fixed:true,hidden:false,
  here:"A cable hangs down the shaft wall, its end swaying at chest height.",
  desc:"Woven line from the Beta hoist, rigged above to a motor and to Richard Wakefield. Rated, he calls down, 'for two Nicoles and a piano.'",
  takeFail:"The cable is still rigged to the Beta hoist and to Richard above. Its useful destination is around Nicole, not in her bag.",
  on:{ touch:"Woven human rescue line, rough enough for a gloved grip and taut with the load Richard's hoist is ready to take.",
       tie:function(){ F().cableTied=true; out("She ties it around her waist and under her arms — bowline, backed up, dressed and set. Her hands know the knots better than her mind does, which is the point of training."); outSys("Tied on. Now UP."); return endTurn(); },
       pull:function(){ if(!F().cableTied){ out("It gives a little, then holds — Richard's rig is sound. Tie on first; falling twice into the same pit is against her religion."); return endTurn(); } pitClimbOut(); },
       use:function(){ if(!F().cableTied){ F().cableTied=true; out("Bowline, backed up, dressed and set."); outSys("Tied on. Now UP."); return endTurn(); } pitClimbOut(); } }
};

/* Lair & shaft (reached in Act II; defined here) */
WORLD.lair = {
  name:"Under New York — The Lair",
  desc:function(){
    if(S.act===1) return "A gallery beneath the island: vaulted, dry, floored in the warm grey material, lit by their three lamps and, faintly, by veins of luminescence in the walls. Tunnel mouths open in several directions, one barred by a grill of woven metal. On the wall opposite, painted bands of color run in ordered rows — red, blue, green, and colors between — deliberate as text.";
    if(S.act===3&&S.phase==="act3_sanctuary"&&F().grillOpened) return "The old family gallery opens into its deeper life. Where the woven grill stood, a warm banded passage descends among the octospiders; Richard's lexicon rests beside the mature mural, and its recurring red-blue-green greeting is no longer unanswered. Richard is here. The landlords attend at a courteous distance.";
    let d="The gallery they have made a home: partitioned rooms of salvage and Raman lattice, Richard's workbench of scavenged wonders, a garden tray under a grow lamp, drawings pinned to the grey wall at child height. The luminescent veins give a dusk that never deepens. The color-banded wall — their oldest neighbor — keeps its counsel. The barred grill guards the deep tunnel; a shaft-passage leads north toward the avian vertical.";
    return d;
  },
  brief:"The lair beneath New York — home.",
  scenery:["lair_home","mural","grill","workbench","garden","lair_drawings","lair_veins","lair_lamp","lair_passage","node_approach","node_corridor"],
  sound:"The island's hum, so constant now it registers only when she imagines its absence.",
  exits:{ up:{to:"ny_lattice", blocked:function(){ return S.act===1?"Above, Rama is still burning its terrible candle. Not yet.":null;}, msg:"Up the long gallery ramp to the latticed way."},
          north:{to:"avian_shaft", hidden:function(){ return S.act===1; } } }
};
SCENERY.lair_home={name:"family gallery",alias:["gallery","lair","partitioned rooms","rooms","home","family","children","Raman lattice"],
  desc:"Fourteen years of human insistence laid over Raman structure: sleeping partitions, shared tables, storage tucked into every useful recess, and paths worn by five people who stopped calling this temporary long ago."};
SCENERY.mural={name:"color bands",alias:["mural","bands","colors","wall","painted bands","color wall","color-banded wall","color banded wall"],
  desc:function(){ if(!K().k_mural){ K().k_mural=true; outSysDeferred("Learned: the color bands repeat in ordered patterns — a script of color."); }
    return "Rows of painted bands, each a precise width: red, blue, green, and graded hues between, repeating in groups. Richard has photographed every row. The groups repeat the way words repeat. Somebody wrote this wall."; },
  on:{read:"She can see that it says something. She cannot see what. Not yet — though the pattern red-blue-green recurs like a signature, or a greeting.",
      photograph:"Documented, every row. The archive of an alphabet with no Rosetta."}};
SCENERY.grill={name:"grill",alias:["grille","bars","barred tunnel","deep tunnel","gate","barrier"],
  desc:function(){ return F().grillOpened?"The woven lattice has folded into the wall, leaving the largest tunnel mouth open. Warm biolight and slow bands of color breathe up from the passage beyond.":"A woven-metal barrier across the largest tunnel mouth, warm to the touch, humming faintly. On its center panel: three painted squares — red, blue, green."; },
  on:{open:function(){ return grillTry(); }, push:function(){ return grillTry(); }, pull:function(){ return grillTry(); },
      knock:"She raps the grill. Far down the tunnel, after a courteous interval, something raps back — same rhythm, deeper voice. She decides, on balance, to be delighted.",
      touch:function(){ out(F().grillOpened?"No bars remain beneath her hand. The old lattice is flush with the wall, and warm banded air moves through the open way.":"Warm, thrumming. Less a fence, she thinks, than a door with an opinion."); return endTurn(); }}};
function grillTry(){
  if(F().grillOpened){ out("The way stands open; warm banded light breathes up out of the passage."); return endTurn(); }
  if(S.act===3 && S.phase==="act3_sanctuary") return octoDoor();
  out("It neither lifts nor swings. The three colored squares on its panel look, the longer she studies them, less like decoration and more like a lock stating its terms."); K().k_grillLock=true; return endTurn();
}
SCENERY.workbench={name:"workbench",alias:["bench","richard's bench","tools","gadgets","salvage","raman salvage","scavenged wonders","wonders","raman fragments","fragments","coils","shakespeareans","robots"],desc:"Richard's empire: disassembled Raman fragments, hand-wound coils, three of his tiny Shakespeareans in various states of undress. Order would be an insult to it."};
SCENERY.garden={name:"garden tray",alias:["garden","plants","tray","tomatoes","beans","rose","heroic rose","seed stock","survival stores"],desc:"Tomatoes, beans, and one heroic rose, grown from the seed stock in the survival stores, under a lamp Richard rigged from Raman luminescence. The children think food comes from here. It very nearly does."};
SCENERY.lair_drawings={name:"children's drawings",alias:["drawings","pinned drawings","children's drawings","grey wall"],
  desc:"Years of the girls in layers: Simone's careful sections and constellations; Katie's wings, speed lines, and impossible landings. The lowest pages are sun-faded now. Newer ones climb the wall as their hands have climbed.",
  on:{read:"The pictures have no captions, but their two vocabularies are unmistakable: Simone labels the world by structure; Katie labels it by motion."}};
SCENERY.lair_veins={name:"luminescent veins",alias:["luminescent veins","veins","luminescence","banded light"],
  desc:"Threads of Raman light under the grey surface, steady enough to live by and strange enough that Nicole still sometimes wakes to remember there is no bulb behind them.",
  on:{touch:"Faint warmth passes into her fingertips — not heat from a lamp, but the patient circulation of the island itself."}};
SCENERY.lair_lamp={name:"grow lamp",alias:["grow lamp","lamp","garden lamp"],
  desc:"Richard coaxed the lamp from salvaged Raman elements and human wiring. Its spectrum is ugly, dependable, and beloved by the rose.",
  on:{touch:"Warm housing, hand-cut brackets, Richard's wiring tied into knots only he calls a diagram."}};
SCENERY.lair_passage={name:"shaft-passage",alias:["shaft-passage","shaft passage","passage","north passage","avian vertical","vertical"],
  desc:"The passage runs north from the family's gallery to the lip of the Avian Vertical. Warm air arrives through it in slow breaths, carrying three falling notes.",
  on:{enter:function(){ return doGo("north"); }}};
SCENERY.node_approach={name:"Node structure",alias:["structure","node structure","lattice of spars","spars","dark chambers","chambers","double dawn","harbor"],
  desc:function(){
    if(!F().nodeCorridor) return "Nothing beyond Rama's familiar skin yet — only the sense, stronger every day, of Sirius drawing near.";
    return "Through Richard's patient wall of light: a lattice of spars and vast dark chambers in Sirius's double dawn. Rama is not approaching a world but a harbor large enough to receive worlds.";
  }};
SCENERY.node_corridor={name:"corridor of white light",alias:["corridor","white corridor","corridor of light","corridor of white light","seam","way out"],
  desc:function(){ return F().nodeCorridor?"A seam in the gallery wall has opened into depthless white radiance. The light makes a corridor by agreeing, step by step, to be a floor.":"The wall is seamless here. Whatever door it may contain has not chosen to become one yet."; },
  on:{touch:function(){ out(F().nodeCorridor?"Light meets her palm with the gentle resistance of warm glass. The corridor holds.":"Warm grey wall, unbroken under her hand."); return endTurn(); },
      enter:function(){ if(F().nodeCorridor) return doGo("out"); outSys("No corridor is open yet."); }}};

WORLD.avian_shaft = {
  name:"The Avian Vertical",
  desc:"The passage opens onto a ledge inside a cylindrical void half a kilometer deep, rising through the island's whole body. Updrafts breathe past, warm and rhythmic. And in the vault: the avians — grey-winged, velvet-bodied, wide as gliders — riding the thermals in slow gyres, calling to one another in phrases of three falling notes.",
  brief:"The great vertical; avians gyring in the updrafts.",
  scenery:["avians","ledges","void","avian_air","avian_tether","avian_light"],
  sound:"Three falling notes, answered by three falling notes, all the way up the dark.",
  exits:{ south:"lair" },
  onCmd:function(verb,obj){
    if(S.phase==="katie_lost"&&(verb==="shout")){ out("\"KATIE.\" The vertical takes her daughter's name and multiplies it. The avians' calls stop — a silence like held breath — and then, from a ledge below, small and furious and alive: \"I'm FINE, maman!\""); F().katieFound=true; endTurn(); return true; }
    return false;
  }
};
SCENERY.avians={name:"avians",alias:["avian","birds","creatures","gliders","big avian","big grey one","grey wing","folded wing","wing","grey-winged","velvet-bodied","amber eye","ancient amber eye","three falling notes","falling notes","notes","calls","avian calls"],
  desc:"Biology, this time — her instruments are sure of it. Warm-blooded, winged, social, vocal. They share Rama with the biots the way whales share an ocean with ships. On the day one dropped a spiral of woven grass onto their ledge, Richard called it first contact. Nicole called it a gift, and has never been argued out of it.",
  on:{photograph:"She has a hundred frames and takes another. Grace is not diminished by documentation.",
      listen:"Three falling notes. Michael says it sounds like vespers. He would."}};
SCENERY.ledges={name:"ledges",alias:["ledge"],desc:"Ringing the vertical at intervals — roosts, or balconies, or words she doesn't have."};
SCENERY.void={name:"vertical void",alias:["void","shaft2","vertical","depths"],desc:"Half a kilometer of warm rising air. Somewhere below, the hum's heart. Somewhere above, a ceiling no lamp has found."};
SCENERY.avian_air={name:"updrafts",alias:["updrafts","updraft","thermals","thermal","warm air"],desc:"Warm air rises through the shaft in long, regular breaths. The avians read changes too small for Nicole's skin and bank before each new current arrives."};
SCENERY.avian_tether={name:"tether",alias:["tether","line","rescue line","recovery line","rigging","rope"],desc:function(){ return S.phase==="katie_lost"&&!F().katieResolved?"Katie's safety line lies where she abandoned it at the ledge — clipped, coiled, useless. Richard will rig the recovery line the instant Nicole finds her.":"Richard's line is anchored twice and inspected three times. Katie complains about wearing it, which means she is wearing it."; },on:{take:"The line stays clipped to the ledge. A safety system is useful only while attached to something safer than its wearer.",use:"She checks the anchor, the locking clip, and the line's run. Richard's rigging is sound."}};
SCENERY.avian_light={name:"suit lamp",alias:["lamp","suit lamp","beam","lamp beam"],desc:"The lamp's beam reaches a fraction of the shaft before warmth and darkness swallow it. It is enough to find ledges, feathers, and the next safe handhold — never the bottom."};

function outSysDeferred(t){ outSys(t); }

function actOneNoReturn(){
  if(S.act===3) return "Back across? No. Everything left worth reaching on this side of the sky is above and below this island now.";
  if(S.phase==="newyork") return "Not yet. New York has barely been touched — the story of the day is up the ramp, and Francesca would mutiny.";
  return "No boat rides the mooring, and the ringed sea keeps its own counsel.";
}

/* ---------------- ACT I CHARACTERS ---------------- */
CHARS.richard={name:"Richard Wakefield",alias:["richard","wakefield"],loc:"hub",pron:"his",
  desc:function(){ return S.act===1?"Richard Wakefield, electronics officer: a compact Englishman with disorderly hair and the permanently delighted expression of a boy who has been given, against all odds, the largest machine in the universe to play with. His pockets tick — the little robots. He watches Nicole more than the mission plan strictly requires.":S.act===2?"Richard Wakefield — husband, father, unlicensed archmage of Raman salvage. Grey coming in at the temples; the delight undimmed.":"Richard Wakefield, older, wary in crowds now, still incapable of passing a closed panel without wanting it open. Her husband. Her north."; },
  here:null,
  talk:function(){
    if(S.act===1){
      if(S.phase==="pit") return "";
      if(S.phase==="stranded") return "\"Well,\" Richard says, looking at the sea, the towers, her. \"Of all the people to be marooned inside a mystery with.\" It should be a joke. His eyes make it something else.";
      return "\"Nicole.\" Richard's grin arrives before his attention fully does — he was mid-thought about something Raman, he always is. \"Tell me you've found something inexplicable. It's been almost an hour.\"";
    }
    if(S.act===2){
      if(S.phase==="act2_farewell") return "Richard puts down the tool he is pretending to tune. \"I've tried to solve this like engineering,\" he says. \"There isn't a version where it doesn't hurt. There's only the version where Simone chooses her life and knows we saw her choose it.\"";
      return "\"Come look at this,\" is how Richard begins most conversations now, and the this is always worth it.";
    }
    return "\"Still here,\" Richard says — their old greeting from the lair years, worn smooth as a river stone. \"Still us.\"";
  },
  suggest:function(){
    const t=[];
    if(S.act===1){ t.push("Rama","biots","the sea");
      if(K().k_factory) t.push("the factory");
      if(S.phase==="storm"||F().ramaDawn) t.push("the dawn");
      if(F().fell||F().rescued) t.push("Francesca");
      t.push("himself");
    }
    if(S.act===2){
      if(S.phase==="act2_farewell") t.push("the departure","Simone","the children","the voyage");
      else { t.push("the Node","the Eagle","the children","the voyage"); if(K().k_colorGrammar) t.push("the colors"); }
    }
    if(S.act===3){ t.push("Nakamura","the colony","Katie","the old days"); }
    return t;
  },
  ask:{
    "rama":[
      {if:()=>S.act===1, text:"\"What is Rama?\" He laughs — the question of the age, asked over a camp table. \"A ship. A world. A message nobody addressed to us. Ask me what it's *for* and I'll show you a man with theories and no evidence. But it works, Nicole — a million years old and everything still *works*. Whoever built this didn't think in careers. They thought in eons.\""},
      {if:()=>S.act>=2, text:"\"I used to want to know what Rama was,\" he says. \"Now I mostly want to deserve the ride.\""}
    ],
    "node":"\"A machine for tending machines,\" Richard says, delighted and appalled in equal measure. \"Harbor, workshop, archive — and all of Rama fits into one of its berths like a probe in a rack. I have revised my sense of scale downward.\"",
    "eagle":"\"An interface wearing an answer key it refuses to show us,\" Richard says. \"Which is unfair. Also probably wise. It chose a form we would read as authority and then had the courtesy to admit it.\"",
    "children|simone|katie":[
      {if:()=>S.phase==="act2_farewell", text:"Richard looks toward the corridor Simone will take. \"We raised two girls who think the impossible is ordinary. One of them has chosen to stay with it. I am proud enough to be furious.\""},
      {if:()=>true, text:"\"Simone studies until the question becomes larger. Katie jumps until the distance becomes smaller,\" Richard says. \"Between them they have reverse-engineered parenthood into a continuous emergency.\""}
    ],
    "voyage|years|journey":"\"Fourteen years inside a machine that never once asked our permission and never once failed to keep us alive,\" Richard says. \"Long enough to stop calling it survival. Long enough for the girls to call it childhood.\"",
    "colors|color|grammar":[
      {if:()=>K().k_colorGrammar, text:"\"Order is syntax, repetition is courtesy, and red-blue-green is *begin*,\" Richard says. \"We spent years admiring a sentence before we knew it was speaking. That's practically the human condition.\""},
      {if:()=>true, text:"\"The bands repeat like language,\" Richard says. \"I can prove the pattern and none of the meaning. Yet.\""}
    ],
    "departure|leaving|farewell|staying":[
      {if:()=>S.phase==="act2_farewell", text:"\"I keep wanting to ask her to reconsider,\" Richard says. \"Then I remember who taught her that a closed door is an invitation. We did. This is the bill.\""},
      {if:()=>true, text:"\"We have been leaving Earth for years,\" he says. \"The difficult part is admitting when a departure has finished.\""}
    ],
    "biot|biots|crab":[
      {if:()=>!K().k_biots, text:"\"Only glimpses so far. Get imagery if you can — gait, articulation, anything. The engineering will tell us more than the philosophy will.\""},
      {if:()=>K().k_biots&&!F().reportedBiots, text:"He listens to her account of the procession, hungry for the details. \"Hoppers. Cargo. Maintenance rounds.\" He exhales. \"It's a working ship, Nicole. Crewed by its own tools.\" (He'd want the others told too.)", fx:function(){ F().reportedBiots=true; relUp("richard",1); }},
      {if:()=>true, text:"\"Maintenance castes,\" he says happily. \"A whole ecology of purpose. I could spend a life on the taxonomy alone.\""}
    ],
    "factory|london":[
      {if:()=>K().k_factory, text:"When she shows him the long-exposure of the assembly racks he goes quiet in the specific way she has learned to treasure. \"They grow their crew,\" he says at last. \"The city's a womb.\" Then, softer: \"What do you suppose it makes when it needs something new?\"", fx:function(){ F().reportedFactory=true; relUp("richard",1); }},
      {if:()=>true, text:"\"London? Sealed boxes and stage fright, so far. If you get a look inside anything, I want to see it.\""}
    ],
    "sea|water|cylindrical":"\"Salt water with the chemistry of blood plasma, wrapped around a machine's waist. Either it's coolant, or it's an aquarium, or the distinction wouldn't survive translation. I've stopped assuming those are different answers.\"",
    "dawn|light|lights|storm|weather":[
      {if:()=>!K().k_dawn, text:"\"Here's my worry,\" Richard says, tapping his slate. \"The hull's warming. When Rama decides it's morning — and it will, the perihelion numbers say soon — sixteen kilometers of cold air over a warming sea is a weather engine. Dawn here won't be a sunrise. It'll be an event.\""},
      {if:()=>true, text:"\"When the lights come, the wind comes with them. Physics doesn't care that we're standing in an artifact.\""}
    ],
    "francesca":[
      {if:()=>F().rescued, text:"His face closes like a hatch. \"She came back across alone and said the shaft was empty. I timed her account against the boat log. It doesn't reconcile.\" A breath. \"You're alive. I'm keeping the rest for a colder day.\""},
      {if:()=>true, text:"\"Francesca films everything and believes the edit. Charming, brilliant, and I wouldn't turn my back on her at the rim of anything deep.\""}
    ],
    "himself|robots|falstaff|shakespeare":"\"The robots? A misspent childhood with a soldering iron and a Complete Works. Falstaff, Prince Hal, TB — they scout where I can't fit.\" He produces one from a pocket; it bows. \"Also, they're better company than most committee meetings.\"",
    "michael":"\"O'Toole believes God is watching all this with interest, which I can't disprove and have stopped trying to. Finest man aboard. Don't tell him.\"",
    "borzov":[
      {if:()=>S.borzov==="sick", text:"\"He was grey at breakfast and grey is not a color the general does. You're the doctor, Nicole — I'm just the man who'll hold whatever you tell me to hold.\""},
      {if:()=>true, text:"\"Borzov runs a tight expedition and a private conscience. Rare combination.\""}
    ],
    "octahedron":"\"Balanced on a vertex and humming in chords. I have four theories and the honesty to admit they're decorations on ignorance. Touch it? I did. It noticed. I've decided to be flattered.\"",
    "newton|earth|mission":"\"Earth sends us questions with the panic filtered out, mostly. Down here the mission is simpler: look properly at everything, break nothing, come back honest.\"",
    "shaft|pit|lattice":[
      {if:()=>F().rescued, text:"\"Three days,\" he says. \"I want you to know the arithmetic I did in them, and I never want to say it aloud.\" He takes her hand, engineer-brisk, and doesn't let go quite as briskly."},
      {if:()=>true, text:"\"That lattice is drawn metal, fused junctions — spun by something with better materials science than two planets. Mind the footing near the shaft. I mean it. The lip's like ice.\""}
    ],
    "nicole|me":"\"You,\" Richard says, and for once the wit stands down. \"You're the only thing in here I understand less the longer I look. That's a compliment. It's the same one I pay Rama.\""
  },
  tell:{
    "biot|biots":[{if:()=>K().k_biots,text:"(Told. He drinks the detail like water — see ASK RICHARD ABOUT BIOTS.)", fx:function(){F().reportedBiots=true;}},{if:()=>true,text:"\"Tell me when you've seen one properly — imagery, Nicole, imagery.\""}],
    "factory":[{if:()=>K().k_factory,text:"He studies the exposure a long time. \"The city's a womb,\" he says. \"Rama makes its own crew.\"", fx:function(){F().reportedFactory=true; relUp("richard",1);}},{if:()=>true,text:"\"A factory? Show me and I'll believe anything you like.\""}],
    "storm|dawn":[{if:()=>K().k_dawn,text:"\"Exactly. Lash everything that floats or flies, and stand somewhere humble when it starts.\""}],
    "pit|fall|shaft":[{if:()=>F().rescued,text:"He listens to all of it — the holds, the tunnels, the color band, the patient soft sounds — without one interruption. \"Something down there let you live,\" he says finally. \"I intend to be polite to it forever.\""}]
  },
  show:{
    camera:function(){ out("He scrolls her imagery with the reverence other men save for scripture. \"Good eye. Good *eye*, des Jardins.\""); return endTurn(); },
    scarf:function(){ out("\"Your father's?\" he asks — he remembers everything she has ever told him, she is beginning to notice. \"It suits the expedition. A little defiant color.\""); relUp("richard",1); return endTurn(); }
  },
  kiss:function(){
    if(S.act===1&&!F().rescued){ out("Not yet. There is a carefulness between them still, a bridge neither has tested with full weight."); return endTurn(); }
    if(S.act===1){ out("She kisses him — brief, sure, entirely against regulations that no longer apply to anyone. Richard blinks like a man handed a star. \"Well,\" he manages. \"Marooned properly, then.\""); relUp("richard",2); F().kissed=true; return endTurn(); }
    out("She kisses her husband. Some experiments one simply replicates, for rigor."); relUp("richard",1); return endTurn();
  }
};
CHARS.michael={name:"Michael O'Toole",alias:["michael","otoole","o'toole","general"],loc:"camp_alpha",pron:"his",
  desc:function(){ return S.act===1?"General Michael O'Toole, USAF: silver-haired, unhurried, the expedition's ballast. He carries a worn rosary in a thigh pocket and the entire weight of two governments' expectations without visibly stooping.":S.act===2?"Michael O'Toole — older, lighter somehow, as if the vacuum between stars had taken only the things he didn't need. He conducts a small mass every Sunday for a congregation of five, two of whom are children and one of whom is an atheist who comes for the singing.":"Michael, remembered: silver and kindness and certainty worn soft."; },
  talk:function(){
    if(S.phase==="borzov"||S.phase==="borzov_decide") return "\"He's yours now, Doctor,\" Michael says quietly. \"Tell me what you need and I'll get it, and I'll keep everyone else out of your light.\"";
    if(S.act===2){
      if(S.phase==="act2_farewell") return "\"She won't stand at that door alone,\" Michael says. His voice is steady; his hand around the rosary is not. \"A calling isn't less real because it breaks the hearts that hear it.\"";
      return "\"I was just thinking,\" Michael says — his sentences often begin there and end somewhere worth going — \"that of all the congregations in creation, I may have the one with the best view.\"";
    }
    return "\"Nicole.\" Michael has a way of saying a name like a small blessing. \"What have you seen?\"";
  },
  suggest:function(){
    const t=["God","the mission","Rama"];
    if(S.borzov!=="well") t.push("Borzov");
    if(S.act===2){
      if(S.phase==="act2_farewell") t.push("Simone","staying","the departure");
      else t.push("Simone","the Eagle");
    }
    return t;
  },
  ask:{
    "god|faith|religion|prayer":[
      {if:()=>S.act===1, text:"\"People keep asking if Rama shakes my faith.\" He smiles at the middle distance. \"A cathedral doesn't shake my faith in architects. Scale was never the question, Nicole. The question was always whether anything is watching with love. I still say yes. I say it here more easily than I did in Houston.\""},
      {if:()=>true, text:"\"The Eagle asked me the same thing,\" Michael says. \"I told it: faith isn't a conclusion. It's a direction you keep walking.\""}
    ],
    "rama":"\"I read the reports and I think: we keep asking what Rama is for. Maybe we're the first thing in it that ever asked. Maybe that's what we're for.\"",
    "borzov":[
      {if:()=>S.borzov==="sick", text:"\"Valeriy is the strongest man I know and he is frightened, which frightens me. Whatever you decide, decide it as his doctor, not his subordinate. I'll carry the command consequences.\""},
      {if:()=>S.borzov==="operated", text:"\"You cut a man open under an alien sky and gave him back his mornings. I have seen fewer miracles that looked more like one.\""},
      {if:()=>S.borzov==="evacuated", text:"\"He's stable topside, complaining about the food, which is the most reassuring symptom in medicine. You judged it rightly.\""},
      {if:()=>true, text:"\"A commander who reads poetry when he thinks no one is watching. I trust him with everything but chess.\""}
    ],
    "mission|earth|newton":"\"Two superpowers, one crew, and a schedule written by people forty light-minutes from the consequences. We manage. Mostly we manage because nobody down here has time to be political.\"",
    "francesca":"\"I pray for Francesca,\" Michael says, which from him is a complete diagnostic.",
    "richard":"\"Richard believes in nothing and marvels at everything. I believe in everything and marvel at everything. We get along famously.\"",
    "storm|dawn":[{if:()=>K().k_dawn,text:"\"Then we secure the camp and we don't gamble with the sea. Weather is God's way of reminding engineers about humility — I imagine that holds inside Rama too.\"", fx:function(){ F().stormWarned=true; relUp("michael",1); }},{if:()=>true,text:"\"If Richard's charts say weather is coming, we treat it as coming.\""}],
    "simone":[
      {if:()=>S.phase==="act2_farewell",text:"\"Simone has made her decision,\" Michael says. \"I have made mine. She will be a stranger's first familiar face, and I will be there until she no longer needs one.\""},
      {if:()=>S.act>=2,text:"\"Simone,\" he says, and his whole face gentles. \"She asks the questions I spent seminary avoiding. Yesterday: does Rama have a soul? I said I'd get back to her. I meant it.\""}
    ],
    "staying|stay|departure|leaving|farewell":[
      {if:()=>S.phase==="act2_farewell",text:"\"This is not abandonment,\" Michael says gently. \"It is accompaniment. Simone stays for the passengers. I stay for Simone. You and Richard go on loving us from the only direction left.\""},
      {if:()=>true,text:"\"Every voyage is a school for leaving,\" Michael says. \"That does not make graduation easier.\""}
    ],
    "eagle":[{if:()=>S.act>=2&&K().k_eagleMet,text:"\"I asked it about God,\" Michael admits. \"It said — I wrote this down — 'That information is above the Node's station.' Nicole, I have been happy for a week.\""},{if:()=>S.act>=2,text:"\"Whatever meets us out there, it will meet the whole of us. Try to make sure the whole of us is worth meeting.\""}],
    "nicole|me":"\"You hold this crew's bodies together and half its spirits, and you think nobody notices the cost. Noticed, Nicole. Logged, as Richard would say.\""
  },
  tell:{
    "biot|biots":[{if:()=>K().k_biots,text:"\"Workers keeping a world,\" he muses. \"There's a psalm about that, more or less.\"", fx:function(){F().reportedBiots=true;}}],
    "storm|dawn":[{if:()=>K().k_dawn,text:"\"Understood.\" He is instantly the general: orders, lashings, shelter assignments. \"Camp will be ready. Thank you, Nicole.\"", fx:function(){ F().stormWarned=true; relUp("michael",1); relUp("community",1); }},{if:()=>true,text:"\"Tell me when there's something to act on, and we'll act.\""}],
    "factory":[{if:()=>K().k_factory,text:"\"A city that builds its own citizens.\" He crosses himself, thoughtfully rather than fearfully. \"And people say the age of wonders ended.\""}]
  },
  show:{ scarf:function(){ out("\"A little courage at the throat,\" Michael says approvingly. \"Armor comes in many weights.\""); return endTurn(); } }
};

CHARS.francesca={name:"Francesca Sabatini",alias:["francesca","sabatini","journalist"],loc:"camp_alpha",pron:"her",
  desc:"Francesca Sabatini: the mission's embedded journalist and its most reliable source of glamour, ambition, and unattributed trouble. Beautiful the way a headline is beautiful. Her camera drone orbits her like a moon.",
  talk:function(){
    if(F().rescued&&CHARS.francesca.loc==="ny_dock") return "Static, then Francesca's voice from the Newton, pitched for posterity: \"Nicole. Thank God. I told them — I told them you were unfindable, the shaft was dark, I had to make the crossing while the sea allowed—\" The transmission is very smooth. It has had two days of rehearsal.";
    return "\"Nicole! Give me one quotable sentence about the majesty of it all.\" Her smile is professional-grade. \"Or better — give me an unquotable one.\"";
  },
  suggest:function(){ return F().rescued?["the shaft","the crossing"]:["the story","Rama","the crew"]; },
  ask:{
    "story|broadcast|journalism|camera":"\"Two billion people are watching this expedition through my edit, darling. History is a story someone had the sense to file on deadline. I intend to be someone.\"",
    "rama":"\"Rama is the best set ever built,\" Francesca says. \"I keep waiting for it to send someone out to take a bow.\"",
    "crew|brown|david":"\"David Brown wants a Nobel, Borzov wants everyone home alive, Richard wants the machine, Michael wants heaven, and you—\" the smile sharpens a degree \"—you want to *understand*, which is the most expensive want on the list.\"",
    "shaft|pit|fall":[
      {if:()=>F().rescued, text:"\"I looked,\" she says, too quickly, on the radio's clean channel. \"The lamp was gone, there was no answer, the sea was turning — Nicole, what would staying have been except a second casualty?\" A pause with edges. \"I'm glad you're alive. Put that on the record.\"", fx:function(){ F().francescaConfronted=true; }},
      {if:()=>true, text:"\"That web-alley? Magnificent framing. Let me get you against the depth of it sometime.\""}
    ],
    "crossing":[{if:()=>F().rescued,text:"\"The sea was rising and the schedule was dying. I made a captain's decision in a rowing boat.\" On the recording, later, this line will sound noble. That, Nicole understands at last, is the point of Francesca.", fx:function(){F().francescaConfronted=true;}}]
  },
  tell:{
    "pit|fall|truth":[
      {if:()=>F().rescued, text:"Nicole says it plainly, once, for the log: the polished lip, the urging, the empty days. Silence on the channel. Then: \"...I'll have the record reflect your account alongside mine.\" It is, from Francesca, almost a confession. Almost.", fx:function(){ F().francescaConfronted=true; }}
    ]
  },
  show:{}
};

CHARS.borzov={name:"General Borzov",alias:["borzov","valeriy","commander"],loc:"camp_alpha",pron:"his",
  desc:function(){ return S.borzov==="sick"?"Valeriy Borzov, expedition commander, lying grey and sweating on her table, one hand guarding the right side of his abdomen and both eyes guarding his dignity.":S.borzov==="operated"?"Borzov, post-operative and asleep, drawn but the right color again. The monitors murmur contentment.":"General Valeriy Borzov: broad, deliberate, a career of command carried lightly. He reads Pushkin in the off-shifts and thinks nobody has noticed."; },
  talk:function(){
    if(S.borzov==="sick") return "\"Doctor.\" He manages half a smile through the grey. \"I appear to be… relieving myself of command temporarily. Do your worst.\"";
    if(S.borzov==="operated") return "He sleeps. Command can wait; the body has pulled rank.";
    return "\"Des Jardins.\" Borzov gives her the nod he gives the reliable. \"The survey?\"";
  },
  suggest:function(){ return S.borzov==="sick"?["the pain","his history"]:["the mission","Rama"]; },
  ask:{
    "pain|symptoms|stomach|abdomen":[
      {if:()=>S.borzov==="sick", text:"\"It began at the navel,\" he reports, precise even now, \"then marched itself here.\" His hand indicates the right lower quadrant. \"Worse when your rover hit the grooves. I have not eaten. I did not report it because commanders are stupid.\" The clinical picture is assembling itself with textbook manners.", fx:function(){ K().k_history=true; }},
      {if:()=>true, text:"\"I am, thanks to my doctor, disgustingly well.\""}
    ],
    "history|medical|health":[
      {if:()=>S.borzov==="sick", text:"\"No surgeries. No allergies. A commander's file — dull by design.\" A grimace. \"Until today.\"", fx:function(){ K().k_history=true; }},
      {if:()=>true, text:"\"My file is dull by design.\""}
    ],
    "mission":"\"The mission is twelve people and one question mark the size of a nation. I ration the risks. It is most of the job.\"",
    "rama":"\"I command inside Rama the way one commands weather: with respect and a good barometer. Your reports are the barometer, Doctor. Keep them honest.\""
  },
  tell:{}, show:{}
};

CHARS.tabori={name:"Janos Tabori",alias:["janos","tabori"],loc:"camp_alpha",pron:"his",
  desc:"Janos Tabori, engineer: cheerful, round, endlessly competent with a winch. He loses at chess to Richard on principle, he claims — it keeps the Englishman manageable.",
  talk:"\"Nicole! Tell Richard his knight is doomed and his ego shortly to follow.\"",
  suggest:["the hoist","the crew"],
  ask:{
    "hoist|winch|equipment|rover":"\"Everything mechanical down here answers to me, which is why nothing mechanical down here has yet dared to fail. Touch wood.\" He touches the grey Raman floor doubtfully. \"Touch… whatever this is.\"",
    "crew|chess":"\"A good crew. Even the difficult ones are difficult in useful directions.\"",
    "rama":"\"A machine this old that still runs? Somewhere, Nicole, there is a maintenance manual that would make me weep. Find it for me.\""
  },
  tell:{ "biot|biots":[{if:()=>K().k_biots,text:"\"Half-tonne walking toolboxes on a schedule. I am in love and unashamed.\"", fx:function(){F().reportedBiots=true;}}] }, show:{}
};

/* ---------------- ACT I ITEMS ---------------- */
ITEMS.medkit={name:"medical kit",alias:["medkit","kit","med kit","first aid","trauma dressing","trauma dressings","collapsible splint","injector","injectors","suture","sutures","airway kit","medical gloves"],loc:"inv",
  desc:"Her field surgical and trauma kit: trauma dressings, collapsible splint, injectors, sutures, airway kit, and gloves, each sealed in its own recess. She has repacked it so many times she could inventory it blind.",
  on:{open:"Trauma dressings, collapsible splint, injectors, sutures, airway kit, gloves. Every recess has a purpose and every seal is intact.",
      search:"Trauma dressings, collapsible splint, injectors, sutures, airway kit, gloves. Nicole could inventory it blind and does so now by touch."}};
ITEMS.medscan={name:"medical scanner",alias:["medscan","scanner","sterile sleeve","sterile sleeves","patient sleeve","calibration tile","scanner calibration tile"],loc:"inv",
  desc:"A diagnostic imager the size of a paperback, with a sterile patient sleeve and calibration tile in its fitted case. It has strong opinions and states them in green type.",
  on:{read:function(){
    if(S.loc==="pit"){ out(pitSelfScan()); return endTurn(); }
    if(S.borzov==="sick"&&K().k_diag) out("The green display holds Borzov's reconstruction: inflamed appendix, worsening tissue response, intervention clock running.");
    else out("READY — PATIENT NOT SELECTED. Battery, calibration, and sterile-sleeve indicators are green.");
    return endTurn();
  },open:"The diagnostic imager is a sealed field unit. Its patient sleeve opens; its calibrated electronics do not.",
     search:"Battery, sterile sleeves, calibration tile: complete. The useful operation is SCAN."}};
ITEMS.sampler={name:"sample probe",alias:["sampler","probe","sample kit","coring probe","sterile vials","vials","coring head","probe seals","sample labels"],loc:"inv",
  desc:"Coring probe, sterile vials, seals, and labels, for taking pieces of Rama home to people who will not believe the context.",
  on:{use:function(r,r2){ return takeSample(); },
      open:"The probe unfolds; a sterile vial locks beneath the coring head. It is ready to SAMPLE the plain.",
      search:"Coring head, sterile vials, seals, labels. Science arranged as a checklist."}};
ITEMS.camera={name:"camera",alias:["long lens","imager","camera storage","storage","optics","weather seal","frame count","exposure","archive timecode"],loc:"inv",
  desc:"Expedition imager with a long lens, sealed optics, and ample solid-state storage. Whatever she frames with it becomes, technically, data.",
  on:{open:"The weather seal protects storage and optics; the camera's useful side is already open to light.",
      search:"Long lens clean, storage ample, battery green. Francesca would call that readiness; Nicole calls it data hygiene.",
      read:"Frame count, exposure, archive timecode. The camera labels moments, not meanings."}};
ITEMS.scarf={name:"red-and-gold scarf",alias:["scarf","father's scarf"],loc:"inv",
  desc:"Her father's scarf, red and gold, worn soft. Pierre des Jardins wrote historical novels in a Loire farmhouse and raised her to believe the past was a place you could love without living in it. She wears the scarf the way Michael carries his rosary.",
  on:{wave:function(){ if(S.loc==="pit"){ if(F().falstaffHere){ pitSignal("The scarf, waved in her lamp beam,"); return; } out("A red thread of defiance, waved at the dark."); return endTurn(); } out("She waves the scarf. The gesture feels like a small flag planted in enormity."); return endTurn(); },
      smell:"Faintly, still, impossibly: her father's pipe tobacco. Memory is the best-sealed container ever made."}};
ITEMS.canteen={name:"canteen",alias:["water","flask","bottle","drinking valve","canteen valve"],loc:"inv",
  desc:function(){ return S.loc==="pit"||S.pit.water<3?("Her canteen, its drinking valve within easy reach. "+(S.pit.water>0?("Perhaps "+S.pit.water+" careful ration"+(S.pit.water>1?"s":"")+" remain."):"Empty.")):"Standard expedition canteen, full, faithful, its drinking valve sealed against low-gravity spills."; },
  on:{drink:function(){ return doDrink({kind:"item",id:"canteen"}); },
      open:"She thumbs the drinking valve open. It is engineered not to spill in low gravity and has survived Nicole's standards besides.",
      search:function(){ out(val(ITEMS.canteen.desc)); return endTurn(); }}};
ITEMS.sample={name:"soil sample",alias:["sample","vial","core"],loc:"limbo",
  desc:"A vial of Rama's not-soil: grey grains, faintly metallic, sterile as a proof.",
  on:{open:"The vial stays sealed. Contamination would turn a sample into a souvenir.",
      touch:"Grey metallic grains shift behind the clear wall, uniform as manufactured powder."}};
function takeSample(){
  if(S.loc!=="plain_north"&&S.loc!=="plain_biot"){ outSys("Nothing here the protocol wants cored."); return; }
  if(K().k_sample){ out("The survey has its samples. Science thanks her; her sling bag begs for mercy."); return endTurn(); }
  K().k_sample=true; take("sample"); ITEMS.sample.loc="inv";
  out("She cores the plain and seals the vial: grey grains, no organics, no water, no history a mass-spec can read. A world's skin, and it tells her nothing except that it is very good at telling nothing.");
  outSys("Sample taken.");
  return endTurn();
}

/* ---------------- BORZOV MEDICAL SEQUENCE ---------------- */
CHARS.borzov.on={
  scan:function(){
    if(S.borzov!=="sick"){ out("The scanner pronounces the general fit and slightly annoyed."); return endTurn(); }
    if(!K().k_diag){
      K().k_diag=true;
      out("The scanner builds its picture in green light: an inflamed appendix — or the structure a million kilometers from home that answers to that name — swollen, angry, hours from a decision it will make without anyone's consent. Textbook, except for every single circumstance.");
      out("Michael, at the hut door, reads her face. \"Options, Doctor?\"");
      outSys("Decision: OPERATE here in the field, or EVACUATE him up thirty thousand steps to the Newton's surgeon. (You can ASK BORZOV ABOUT HIS HISTORY, or ASK MICHAEL ABOUT BORZOV, before deciding.)");
      S.phase="borzov_decide"; CHARS.michael.loc="medlab";
      return endTurn();
    }
    out("The picture hasn't improved. Pictures like this don't. The clock is the third party in the room.");
    return endTurn();
  },
  treat:function(){
    if(S.borzov!=="sick"){ out("He needs nothing from her kit today."); return endTurn(); }
    if(!K().k_diag){ out("Diagnose before treating — her oldest rule. (SCAN BORZOV.)"); return endTurn(); }
    outSys("The kit can't fix this. It wants a decision: OPERATE or EVACUATE.");
  },
  kiss:"Borzov would die of protocol on the spot, which would defeat the clinical purpose."
};
function borzovOperate(){
  if(!K().k_diag){ outSys("Operate on what? Diagnose first. (SCAN BORZOV.)"); return; }
  if(S.borzov!=="sick"){ outSys("There is no one on the table."); return; }
  const thorough = K().k_history;
  S.borzov="operated"; S.flags.borzovPath="operated"; S.phase="storm_prep";
  out("She scrubs in a hut, in an alien world, with Michael passing instruments in a silence that has the shape of prayer. The anesthesia takes; the field kit performs; her hands do what four decades trained them for while the largest machine in the universe holds perfectly still around a single sleeping man."+(thorough?" His clean history is the margin she plays in, and the margin holds.":""));
  out("Forty minutes. Then the closing, the count, the exhale. Borzov will wake commanding again. Michael touches her shoulder once, says nothing, and goes out to tell the crew — and she hears, through the hut skin, something she will not forget: applause, thin and fierce, under a sky sixteen kilometers deep.");
  relUp("michael",1); relUp("community",2); relUp("richard",1);
  outSys("Borzov will recover. The expedition breathes again.");
  startStormPhase();
  return endTurn();
}
function borzovEvacuate(){
  if(!K().k_diag){ outSys("Evacuate whom, and why? Diagnose first. (SCAN BORZOV.)"); return; }
  if(S.borzov!=="sick"){ outSys("There is no one on the table."); return; }
  S.borzov="evacuated"; S.flags.borzovPath="evacuated"; S.phase="storm_prep"; CHARS.borzov.loc="limbo";
  out("She makes the unglamorous call: stabilize, package, and send him up. Antibiotics to hold the line; a litter rigged to the chairlift; Janos coaxing the hoist like a lover. Thirty thousand steps of ascent measured out in her mind against one operating table forty light-minutes from backup.");
  out("Six hours later the Newton's channel crackles: on the table topside, appendix out, prognosis excellent. Nobody applauds a safe decision. Nicole has made a career of not needing them to.");
  relUp("michael",1); relUp("community",1);
  outSys("Borzov is safe aboard the Newton.");
  startStormPhase();
  return endTurn();
}
function startStormPhase(){
  S.phase="storm"; F().betaOpen=true;
  CHARS.michael.loc="beta_shore"; CHARS.francesca.loc="beta_shore";
  out("With the commander settled, the schedule reasserts itself: the expedition's next objective is the Cylindrical Sea. Michael takes the first rover east to establish Beta Camp on the cliffs; Francesca goes with the cameras; Richard waits on Nicole. \"When you're ready, Doctor,\" he says, \"come see an ocean bent into a ring.\" (The rover run: EAST from Camp Alpha.)");
}

/* ---------------- ACT I SCENES & EVENTS ---------------- */
WORLD.camp_alpha.onEnter=function(){
  if(!F().campIntro){
    F().campIntro=true; S.phase="survey";
    doLookInline();
    out("The camp receives her with the relief of people who count heads by reflex. General Borzov looks up from the comms log; Michael O'Toole lifts a hand from the folding table; Francesca Sabatini's drone swings round to put Nicole's arrival on the record, cosmonaut-descends-stairway, take four.");
    out("\"Doctor des Jardins.\" Borzov's nod is the entire ceremony. \"Survey assignments are posted. Yours: the plain and the biot track south — imagery and samples. Richard goes where you go; Earth's actuaries insist nobody walks alone down here.\" A dry pause. \"Walk far. Look hard. Break nothing.\"");
    outSys("Assignment: survey the plain (a SAMPLE would please the biology team) and get imagery of the biots on the track SOUTH of the stairway. London, southwest, is unassigned — and therefore, Richard notes, interesting.");
    endTurn(true);
    return true;
  }
  return false;
};
function doLookInline(){ const rm=here(); outTitle(rm.name); out(typeof rm.desc==="function"?rm.desc():rm.desc); const cs=charsAt(S.loc); if(cs.length) out(cs.map(c=>{const h=CHARS[c].here;const v=typeof h==="function"?h():h;return v||(CHARS[c].name+" is here.");}).join(" ")); const ex=exitsOf(rm); if(ex.length) outSys("Exits: "+ex.join(", ")+"."); S.visited[S.loc]=true; }

WORLD.beta_shore.onEnter=function(){
  if(!F().betaIntro){
    F().betaIntro=true; K().k_dawn=true; F().dawnClock=S.turn;
    doLookInline();
    out("Richard stands at the cliff edge with his slate, and for once the delight in his face has an edge. \"Feel the air? Two degrees warmer than yesterday. The hull's soaking up sun as we close on perihelion — and when Rama turns its lights on, all this cold dark air over a warming sea becomes an engine. Dawn is coming, Nicole. Real dawn. And it will arrive like a fist.\"");
    outSys("A storm is coming with the dawn. The Resolution should be SECURED (TIE BOAT), and Camp Alpha warned (TELL MICHAEL ABOUT THE STORM — he's here at Beta).");
    endTurn(true);
    return true;
  }
  return false;
};

WORLD.ny_dock.onEnter=function(){
  if(S.phase==="crossing"&&!F().nyIntro){
    F().nyIntro=true; S.phase="newyork";
    doLookInline();
    out("Francesca is already ashore, drone aloft, narrating quietly for two billion people. Richard turns a slow circle at the ramp's foot. \"Hear it?\" he says. \"The hum. Every other city is a held breath. This one is a heartbeat.\"");
    outSys("New York: the only city that hums. The way IN leads up through the seawall.");
    endTurn(true);
    return true;
  }
  if(S.phase==="stranded"&&F().rescued&&!F().radioScene){
    F().radioScene=true;
    doLookInline();
    out("The waterfront is wrong. The Resolution is gone from her mooring — Francesca's crossing — and the sea itself has changed key: long slow swells circling the world like something pacing. Richard's radio finds the Newton on the second try, and the traffic that spills out ends the expedition in four sentences: Rama is maneuvering. Thruster activity at the southern horn. All personnel recalled; the Newton departs in nineteen hours, with or without.");
    out("Then Francesca's voice, smooth as an edit, glad Nicole is alive, sorry about the shaft, the sea, the schedule. And under it, on the command channel, Michael O'Toole, very calm: \"Newton, note for the log that I am taking the Beta dinghy across to New York. Three of my people are on the wrong side of a sea.\" A pause. \"It was not a request, Newton.\"");
    outSys("Michael is crossing to them. The Newton is leaving. Nicole has time to speak on the radio (Francesca can still hear her) — and a decision coming.");
    F().michaelTimer=S.turn+3;
    CHARS.francesca.loc="ny_dock";
    endTurn(true);
    return true;
  }
  return false;
};
WORLD.ny_dock.onGo=function(dir){
  if(dir!=="north") return false;
  if(S.phase!=="stranded") return false;
  if(!F().michaelArrived){ out("No boat. The mooring rings hold nothing but the circling sea. Michael is coming across; until he lands, north is just a direction water owns."); return true; }
  if(S.crossingDeclined){ out("The decision stands: they will not gamble three lives on the circling sea. Shelter lies down in the gallery beneath New York."); return true; }
  if(F().triedCrossing){ out("The dinghy is gone — the sea took its answer and kept the boat. There is no north anymore. There is only down, and whatever Rama does next."); return true; }
  askQ("cross_attempt","Attempt the crossing in the dinghy, against that sea? (YES/NO)");
  return true;
};
QUESTION_HANDLERS.cross_attempt = {
    yes:function(){
      F().triedCrossing=true;
      out("They try. Of course they try. The dinghy takes the first three swells like a veteran and the fourth like a leaf — a ridge of sea a house high, running the ring of the world, contemptuous of outboards. Michael puts the helm over without being asked. They make the ramp swamped, shaking, alive, and the dinghy grinds itself to pieces against the seawall behind them as if settling the argument.");
      out("Richard laughs — one bark, more oxygen than humor. \"Well. Now nobody has to decide anything.\" Michael, wringing out his sleeve: \"I find that God's decisions are frequently disguised as weather.\"");
      relUp("michael",1);
      outSys("The crossing is impossible. The only way left is DOWN — the shaft gallery under New York, before Rama lights its engines.");
      endTurn();
    },
    no:function(){
      S.crossingDeclined=true;
      out("Nicole looks at the ringing sea, at the two men, at the nineteen hours, and makes the call she was trained for: no. \"We don't spend the three of us on a coin flip. We go down, we go deep, and we let Rama do its worst over our heads.\" Michael nods slowly. \"Deep it is.\" Richard is already calculating loads.");
      outSys("Decision made: shelter DOWN, in the gallery under New York (east from the plaza, then down).");
      endTurn();
    }
};

/* fall triggers via shaft/holds too */
SCENERY.shaft.on.enter=function(){ if(!F().fell){ theFall(); return; } out("Once was enough; the gallery route serves now."); return endTurn(); };
SCENERY.holds.on=SCENERY.holds.on||{}; SCENERY.holds.on.enter=function(){ if(!F().fell){ theFall(); return; } out("She lets the holds keep their spiral. She has a route that doesn't require falling."); return endTurn(); };
SCENERY.holds.on.touch="Recesses cut for a longer reach than hers. The material is warm.";

WORLD.ny_lattice.onEnter=function(){
  if(S.phase==="newyork"&&!F().latticeIntro){
    F().latticeIntro=true;
    doLookInline();
    out("Francesca's drone rises to drink the geometry. \"This,\" she breathes, \"leads the broadcast. Nicole — the shaft. One look down for the cameras. History has a composition, darling, and you're standing just outside the frame.\" Richard's voice, from the plaza behind: \"Mind the footing by that lip! It's like ice!\"");
    endTurn(true);
    return true;
  }
  return false;
};
const _latticeGo = WORLD.ny_lattice.onGo;
WORLD.ny_lattice.onGo=function(dir){
  if(dir==="down"&&F().rescued&&S.phase==="stranded"&&!F().michaelArrived){
    out("Richard's hand on her shoulder. \"Michael's on that sea for us. We don't go below until he's standing here to go below with us.\"");
    return true;
  }
  return _latticeGo?_latticeGo(dir):false;
};

WORLD.lair.onEnter=function(){
  if(S.act===1){
    doLookInline();
    actOneFinale();
    return true;
  }
  return false;
};

function actOneFinale(){
  out("They carry down what three people can carry: rations, cells, the medical kit, Richard's impossible pockets. The gallery receives them with its dusk of luminescent veins, its painted colors, its patient hum. Michael looks around once and says, mildly, \"I've prayed in worse chapels.\"");
  out("Nineteen hours later, far above, the Newton lights its torch and goes home without them. No one says anything for a while.");
  out("And then Rama answers a question nobody had standing to ask. The hum deepens by octaves. The floor leans — gently, enormously — as a thrust older than the human species takes hold of the world and swings it. Loose gear slides; the garden of luminescence brightens as if interested. Richard, flat on his back with his instruments, starts to laugh, and there are tears in it: \"Course change. She's not falling past the sun, she's *steering*. Nicole — Michael — we're not castaways.\" The numbers assemble on his slate like a verdict. \"We're passengers.\"");
  outAlert("Rama is leaving the solar system. Destination: unknown. Crew: three.");
  startActII();
}

/* wrappers to orchestrate companions */
const _origFall = theFall;
theFall = function(){
  CHARS.richard.loc="away"; CHARS.francesca.loc="limbo";
  _origFall();
};
const _origClimb = pitClimbOut;
pitClimbOut = function(){
  CHARS.richard.loc="party"; CHARS.falstaff.gone=true;
  _origClimb();
};

function registerActOneEvents(){
  addEvent("borzov_collapse",
    ()=>S.act===1&&S.phase==="survey"&&K().k_biots&&S.loc==="camp_alpha",
    function(){
      S.phase="borzov"; S.borzov="sick"; CHARS.borzov.loc="medlab";
      out("It happens between one sentence and the next. Borzov, mid-order at the comms table, goes the color of the plain, folds a hand hard against his right side, and sits down on a crate with the terrible care of a strong man rationing himself. \"Doctor,\" he says — quietly, so the camp won't hear, which the whole camp hears — \"I believe I have become your problem.\"");
      out("They get him to the medical hut between them. Michael clears the doorway with a look; Francesca's drone, for once, stays outside without being told.");
      outSys("Borzov is on her table (IN, to the medical hut). Assess him: EXAMINE, ASK about the PAIN, and SCAN BORZOV.");
    });
  addEvent("biots_leave",
    ()=>F().biotSeen&&!F().biotGone&&S.turn>=(F().biotTurn||0)+4,
    function(){ F().biotGone=true;
      if(S.loc==="plain_biot") out("The last biot ticks past and the procession pours away south, unhurried, complete. The silence that closes behind them is the same silence as before, and entirely different."); });
  addEvent("rama_dawn",
    ()=>S.phase==="storm"&&F().dawnClock!==undefined&&S.turn>=F().dawnClock+6,
    function(){
      F().ramaDawn=true; S.phase="crossing";
      outAlert("— and then Rama turns on the sky.");
      out("It begins as a thread of fire along the world's whole length — six straight suns igniting in the overhead land, flooding sixteen kilometers of night with an instant, shadowless noon. The sea blazes. The far cities leap out of darkness like a confession. For one heartbeat every human inside Rama simply stands still, being small.");
      out("Then the air remembers physics. Cold dark atmosphere and sun-warming sea trade places with a violence that owns no malice at all: wind screaming down the bowl, spray torn off the ringing water, the hoist cables singing like struck strings. It lasts an hour. It feels geological.");
      if(S.borzov==="operated"){ CHARS.borzov.loc="limbo"; out("Ahead of the weather, Borzov — mending, upright, magnificently disobedient about bed rest — was hoisted up the stair-chair to the Newton to finish healing in orbit. His last order on the plain: \"Look after my doctor.\""); }
      if(F().boatSecured){ out("When it passes, the Resolution rides her doubled lines in the lee of the cliff, wet and whole. Richard salutes the knots. \"Seamanship,\" he says, \"is applied pessimism.\""); }
      else { F().boatDamaged=true; out("When it passes, the Resolution hangs half-swamped against the stage, her port side gashed by the hoist frame. Salvageable — with resin and unglamorous labor. (A hull PATCH kit exists in camp stores, if no one has one already.)"); }
      if(F().stormWarned){ out("The radio from Camp Alpha reports gear lashed, huts holding, dignity mostly intact. Michael's warning ran ahead of the wind."); relUp("community",1); }
      else { F().campLoss=true; out("Camp Alpha reports one hut collapsed and a day of supplies scattered across the plain. Nobody is hurt. Janos's commentary is not suitable for the broadcast."); }
      outSys("Rama's day has begun. The crossing to New York is now possible: SOUTH from Beta, once the boat is sound.");
    });
  addEvent("michael_arrives",
    ()=>S.phase==="stranded"&&!F().michaelArrived&&F().michaelTimer!==undefined&&S.turn>=F().michaelTimer,
    function(){
      F().michaelArrived=true; CHARS.michael.loc="party"; CHARS.francesca.loc="limbo";
      out((S.loc==="ny_dock"?"":"From the direction of the waterfront comes the sound of an outboard being asked for everything it has. ")+"Michael O'Toole brings the Beta dinghy through the circling swells like a man rowing across a metaphor, grounds it at the ramp, and steps ashore with his rosary in one fist and the last crate of rations in the other. \"Well,\" he says. \"I appear to have resigned.\"");
      outSys("The three of them are together. The Newton departs within hours; the sea is rising. Decide: attempt the crossing NORTH, or go DOWN into the gallery beneath New York to ride out whatever Rama intends.");
    });
  addEvent("richard_cable",
    ()=>F().signalDone&&F().richardTimer!==undefined&&S.turn>=F().richardTimer&&!F().cableDown,
    function(){
      F().cableDown=true; ITEMS.cable.loc="pit";
      out("Light blooms at the shaft mouth — a real lamp, swinging — and a voice comes down fifty meters of stone, ragged and English and the single best sound in the universe: \"NICOLE! Hold on — cable coming — don't you dare move that ankle!\" A line snakes down the wall, its end swaying to a stop at chest height.");
      outSys("The cable is here. TIE CABLE, then UP.");
    });
}

/* ---------------- THINK & HINTS (Act I) ---------------- */
THINK={
  arrival:"Down first — thirty thousand steps to the plain, and the camp lights to the east at the bottom. The survey can't start at the top of a stairway.",
  survey:function(){ return "Assignments: sample the plain, get imagery of the biots on the track south"+(K().k_biots?" — done; the crew should hear about the hoppers":"")+". London stands southwest, sealed and unassigned, which is Richard-speak for irresistible."+((K().k_biots&&!F().reportedBiots)?" Tell someone about the biots.":""); },
  borzov:"Borzov is her patient now. Examine him, ask about the pain, and SCAN him — diagnosis before decision, always.",
  borzov_decide:"The scan says appendix, hours to spare, none to waste. Operate here with a field kit and steady hands, or stabilize and evacuate him up thirty thousand steps to the Newton's theater. His history matters; so does the climb. Her call. (OPERATE or EVACUATE.)",
  storm_prep:"The sea next. East from camp when she's ready.",
  storm:function(){ return "Richard's dawn is coming, and wind with it. The Resolution needs securing (TIE BOAT)"+(F().boatSecured?" — done":"")+", and Camp Alpha should be warned (TELL MICHAEL ABOUT THE STORM)"+(F().stormWarned?" — done":"")+". Then: witness it."; },
  crossing:function(){ return F().boatDamaged&&!F().boatFixed?"The Resolution is holed. The patch kit from camp stores can mend her (USE PATCH ON BOAT); then south, across the sea.":"South, across ten kilometers of impossible water, to the island that hums."; },
  newyork:"New York breathes — the hum under everything. Explore it. Francesca wants drama at the latticed way east of the plaza; the shaft there exhales like something alive. Careful footing. Careful everything.",
  pit:function(){ return "Alive. Inventory the body first (SCAN SELF), splint what's broken (TREAT SELF), ration the canteen, and make herself findable — sound carries, and Richard Wakefield does not stop looking. Endure. (SLEEP passes the dark hours.)"+(F().falstaffHere&&!F().signalDone?" That little robot is Richard's eyes: SIGNAL it — shout, wave the scarf, flash the lamp.":"")+(F().cableDown&&!F().cableTied?" The cable is down: TIE on, then UP.":""); },
  stranded:function(){ return F().michaelArrived?"Together, boatless or nearly, with Rama warming its engines. The gallery under the island is deep, dry, and defensible: the way is up the ramp, east through the plaza, and DOWN at the latticed way. Or gamble everything on the sea one more time.":"The Newton is leaving; Michael is crossing to them against orders and arithmetic. Hold the waterfront until he lands. Francesca can still hear the radio, if Nicole has anything to say to her."; }
};
HINTS={
  arrival:["The stairway leads DOWN, several times over.","Keep going DOWN until the plain, then EAST to the camp lights.","GO DOWN from the hub, DOWN twice more, then EAST to Camp Alpha."],
  survey:["The assignment: a sample from the plain, and imagery of biots on the southern track. USE SAMPLER on the plain; wait where the track runs.","Biots travel the polished track SOUTH of the stairway's foot. Be present, be patient, and PHOTOGRAPH them when they come. London (southwest) rewards a close look at its one imperfect shed.","1) At the plain: USE SAMPLER. 2) Go SOUTH, WAIT for the procession, PHOTOGRAPH BIOT. 3) In London, EXAMINE SHED, then PHOTOGRAPH SLOT. 4) Return to camp and TELL RICHARD ABOUT BIOTS."],
  borzov:["A physician's order of operations: history, examination, imaging.","ASK BORZOV ABOUT THE PAIN, then SCAN BORZOV in the medical hut.","SCAN BORZOV. The scanner will put the decision in front of you."],
  borzov_decide:["Both paths can save him; they cost different things. His clean history favors boldness; the thirty-thousand-step climb punishes delay.","Asking about his HISTORY firms the surgical case. Then commit: OPERATE or EVACUATE.","Type OPERATE (field surgery, Nicole's hands) or EVACUATE (stabilize and hoist him to the Newton). Both succeed; the expedition remembers differently."],
  storm:["Two verbs protect two things: the boat, and the camp.","TIE BOAT secures the Resolution. TELL MICHAEL ABOUT THE STORM sends the warning east.","1) TIE BOAT. 2) TELL MICHAEL ABOUT STORM. 3) WAIT for the dawn. It is worth being outside for."],
  crossing:["If the boat took damage, camp stores held a patch kit (SEARCH CRATES at Alpha — or it may already be in the bag).","USE PATCH ON BOAT at Beta if she's holed. Then GO SOUTH.","Repair if needed (USE PATCH ON BOAT), then SOUTH across the sea."],
  newyork:["The city wants examining: the octahedron, the towers, the hum. The story wants the latticed way, east of the plaza.","EXAMINE the octahedron; TOUCH it if her nerve holds. Then EAST to the lattice. What happens at the shaft is not her fault.","Go EAST from the plaza. EXAMINE the SHAFT. The rest is Rama."],
  pit:["Doctor first, castaway second: assess, splint, ration.","SCAN SELF, then TREAT SELF (the kit is on her sling). DRINK sparingly. SLEEP to pass the dark. When anything appears above — SIGNAL it.","1) SCAN SELF. 2) TREAT SELF. 3) SLEEP / WAIT; DRINK only when needed. 4) When the little robot appears: SHOUT or WAVE SCARF. 5) When the cable drops: TIE CABLE, then UP."],
  stranded:["The sea is closing; the island is opening. One of those is an exit.","Wait for Michael at the waterfront. Then either test the sea (NORTH — it will answer) or take everyone DOWN via the latticed way.","With Michael ashore: UP, EAST, then DOWN at the lattice. The gallery below is the way through the end of the world."]
};

/* ---------------- OPENING ---------------- */
openingScene = function(){
  outAct("ACT I","RAMA");
  out("Sixty-six years after the first Rama crossed the solar system in silence and was gone, a second one came. This time, humanity was ready enough to be dangerous to itself. This time, they sent people.");
  out("Nicole des Jardins — physician, once an Olympian, daughter of a Senoufo princess and a French novelist — came the two hundred million kilometers for reasons she has stopped explaining to committees. The truth is simpler than her file: something a million years old is asking a question, and she intends to hear it properly.");
  out("The Newton hangs moored outside. The airlocks are behind her. Below her boots, sixteen kilometers of engineered night are waiting to be believed.");
  CHARS.richard.loc="party";
  outSys("(Type LOOK to see where you are, EXAMINE things that interest you, and HELP for the full range of what Nicole can do. THINK reviews her goals; HINT helps, free of charge.)");
  doLookInline();
}

/* =====================================================================
   ACT II — THE NODE
   ===================================================================== */
function startActII(){
  S.act=2; S.phase="act2_voyage";
  CHARS.richard.loc="party"; CHARS.michael.loc="party";
  CHARS.francesca.loc="limbo"; CHARS.tabori.loc="limbo"; CHARS.borzov.loc="limbo";
  CHARS.simone.loc="lair"; CHARS.katie.loc="lair";
  outAct("ACT II","THE NODE");
  out("Time, aboard a world with its own agenda, does what time does.");
  out("The three of them build a life in the gallery under New York the way coral builds a reef: layer by patient layer. Richard tames Raman salvage into light, water, heat; Michael establishes a calendar, a sabbath, and a garden; Nicole keeps them alive and, harder, keeps them whole. In the second year"+(F().kissed?", to the surprise of no one,":", to the surprise only of themselves,")+" Michael marries Nicole and Richard beneath the color-banded wall, using words he wrote for the occasion because no liturgy had anticipated it.");
  out("Simone is born in the third year — grave, gentle, watchful. Katie in the fifth — a spark looking for oxygen. They are the first human beings in history for whom Rama is not a mystery but an address.");
  out("And ahead, for twelve years, one star has grown slowly brighter, dead on the bow.");
  outSys("(Years have passed. Nicole's family: Richard; the girls, Simone and Katie; and Michael, godfather-general to everyone. Richard has been asking her to come and see something in the atrium — the chamber EAST of the lair.)");
  moveTo("lair");
}

WORLD.atrium={
  name:"The Atrium",
  desc:function(){ return "A chamber east of the lair that Richard spent a year coaxing into partnership: one whole wall wakes at a touch into a field of drifting glyphs and, at its center, a schematic that needs no translation — a long ellipse, a moving point, and a star. The children call it the window. Richard calls it the bridge, quietly, when he thinks no one is listening."+(K().k_sirius?"":" The display is lit now, waiting."); },
  brief:"The atrium; Richard's wall of light.",
  scenery:["screen","node_approach"],
  exits:{ west:"lair" }
};
SCENERY.screen={name:"display wall",alias:["screen","wall of light","display","glyphs","window","bridge","map","schematic","ellipse","moving point","point","star","sirius","companion","two suns","suns","course","line","spectra","timetable"],
  desc:function(){
    if(!K().k_sirius){ K().k_sirius=true; F().siriusTurn=S.turn;
      return "She studies the schematic while Richard hovers like a man introducing his parents. The moving point is Rama; the ellipse is its course; and the star it falls toward has a companion — two suns, circling each other. \"Run the spectra and it's unambiguous,\" Richard says. \"Sirius, Nicole. The brightest star in Earth's sky. We are twelve years into an eight-point-six light-year commute, and somebody built the timetable a million years early.\" The point creeps along its line. Destination is no longer a metaphor.";
    }
    return "Rama's course, drawn in patient light: the double star of Sirius, closer every time she looks.";
  },
  on:{read:function(){ return doExamine({kind:"scenery",id:"screen"}); },
      touch:"The glyphs shoal away from her fingers like fish, then drift back. Interested. Everything here is interested.",
      photograph:"She frames Richard's wall of light. In the image, impossibly, the glyphs have arranged themselves to face the lens."}};
WORLD.lair.exits.east={to:"atrium", hidden:function(){ return S.act<2; }};
WORLD.lair.exits.out={to:"node_dock", hidden:function(){ return !F().nodeCorridor||S.act!==2; }, msg:"Out of their world, through the corridor of light — all five of them holding hands like a paper chain."};

CHARS.simone={name:"Simone",alias:["simone","daughter"],loc:"limbo",pron:"her",
  desc:function(){ return S.phase==="act2_farewell"||F().nodeYears?"Simone, grown: tall, still, with her father's patience for machines and a stillness that is entirely her own. People fall quiet around Simone and then feel better, which she has never once noticed.":"Simone, the elder: serious eyes, a habit of asking the day's largest question at dinner, guardian and translator of her sister."; },
  here:function(){ return "Simone is here"+(S.loc==="lair"?", reading by the luminescent veins":"")+"."; },
  talk:function(){ return F().nodeYears?"\"Maman.\" Simone takes her hand — when did her daughter's hands get larger than hers? — and holds it while she talks, an old habit neither retires.":"\"Maman, I have a question,\" Simone announces, which is how her best conversations and her worst bedtimes both begin."; },
  suggest:function(){ const t=["her question","Katie"]; if(S.phase==="act2_farewell") t.push("staying"); if(K().k_eagleMet) t.push("the Eagle"); return t; },
  ask:{
    "question|questions":"\"Does Rama know we're inside it?\" she asks. Nicole starts three answers and finishes none. Simone nods, satisfied. \"Papa couldn't either. I think that means yes.\"",
    "katie|sister":"\"Katie isn't bad, maman. Katie is *fast*. The rules arrive after she's already left.\" A pause. \"I go along so someone is there when the rules catch up.\"",
    "eagle":[{if:()=>K().k_eagleMet,text:"\"It watches you the most,\" Simone observes. \"When you talk, it stops doing that thing where it's also doing something else.\""}],
    "staying|node":[{if:()=>S.phase==="act2_farewell",text:"\"I'm not leaving you,\" Simone says, in her level way. \"I'm staying *for* you. Someone from our family should stand at the door we came through. Michael says a life can be a lighthouse.\" Her eyes shine and do not spill. \"Let mine.\""}],
    "god|faith":"\"Michael says God is a direction,\" Simone reports thoughtfully. \"I checked with Papa's instruments. They can't find it. Michael says that's correct.\""
  },
  on:{
    scan:function(){ if(S.phase==="simone_fever"&&!F().feverCured){ out("The scan again, hoping for a different truth: fever climbing in slow stairs, a terrestrial pathogen twelve years drifted from every reference she carries. Her stocks can harry it. The Tailor's Room could end it — if she can make the synthesizer listen."); return endTurn(); } out("Vitals steady. Her gravest patient, in every sense."); return endTurn(); },
    treat:function(){ if(S.phase==="simone_fever"&&!F().feverCured){ out("Antipyretics, fluids, cool cloths — the rearguard actions. They buy hours. The answer is east, in the Tailor's Room, behind three colors."); return endTurn(); } out("Nothing to treat; the treaty holds."); return endTurn(); },
    touch:function(){ out(S.phase==="simone_fever"&&!F().feverCured?"Simone's skin is fever-hot beneath Nicole's hand, dry at the forehead and damp at the hairline. The cool cloth is already losing ground.":"Warm skin, steady pulse. Simone squeezes her mother's hand before Nicole can pretend this was not a checkup."); return endTurn(); }
  },
  tell:{}, show:{}, kiss:function(){ out("She kisses her daughter's hair. Simone permits this with the gravity of a treaty."); relUp("simone",1); return endTurn(); }
};

CHARS.katie={name:"Katie",alias:["katie","catherine","katherine","kate"],loc:"limbo",pron:"her",
  desc:function(){
    if(S.act===3&&S.phase==="act3_escape"&&F().cellOpen&&F().rescuer==="katie"&&S.loc==="eden_gate") return "Katie wears Vegas black and borrowed authority, every motion clipped to the stolen guard rotation. The floor's old tremor is gone. Keys, looped cameras, boots, and the open service route reveal the professional she chose to become — tonight, for her family.";
    return S.act===3?"Katie, grown into her velocity: sharp-dressed for the Vegas floor, sharper-eyed, beautiful the way an exposed blade is. Under the polish, her mother's diagnostic eye finds the tremor, the pinned pupils, the weather of a storm spending itself.":"Katie: eight going on escape velocity, scabbed knees, avian feathers braided into her hair, a laugh that arrives before she does.";
  },
  here:function(){ if(S.loc==="eden_gate") return "Katie waits at the service door, holding the borrowed guard rotation together."; return S.act===3?"Katie holds court near the tables, not quite looking at her mother.":"Katie orbits the room, touching everything once."; },
  talk:function(){
    if(S.act===3&&S.phase==="act3_escape"&&F().cellOpen&&F().rescuer==="katie"&&S.loc==="eden_gate") return "\"Go, maman,\" Katie says, one hand on the keyed door and one eye on the cameras. \"Papa's waiting. Tell him I kept the feathers. I'll keep his machine looking the wrong way.\"";
    if(S.act===3) return "\"Mother.\" The word wears armor. \"Come to inspect the fallen?\"";
    if(S.phase==="act2_farewell") return "Katie presses herself against Nicole's side without admitting to it. \"I'm not crying in front of the Eagle,\" she says. \"That's a rule.\"";
    return "\"Maman! The avians let me get CLOSE today—\" the rest arrives at flank speed.";
  },
  suggest:function(){
    if(S.act===3) return ["Nakamura","home","herself"];
    if(S.phase==="act2_farewell") return ["Simone","the departure","the Node"];
    return ["the avians","the shaft"];
  },
  ask:{
    "avians|birds":[{if:()=>S.act===2,text:"\"They know me,\" Katie says, with the total certainty of eight. \"The big grey one waits for me. I'm going to fly someday, maman. Rama just hasn't told me how yet.\""}],
    "shaft|vertical":[{if:()=>S.act===2,text:"\"I'm CAREFUL,\" she says, which among Katie's words is the one doing the most unsupervised work."}],
    "simone|sister":[{if:()=>S.act===2&&S.phase==="act2_farewell",text:"\"She gets to stay because she's *steady*,\" Katie says, making the word an accusation. Then, smaller: \"Tell her I'm going to learn every avian call she doesn't get to hear. I'll remember for both of us.\""},{if:()=>S.act===2,text:"\"Simone worries professionally,\" Katie says. \"I'm helping her build expertise.\""}],
    "leaving|departure|farewell|node":[{if:()=>S.act===2&&S.phase==="act2_farewell",text:"\"I hate this place,\" Katie says, looking up into the impossible pearl light. \"I also want Simone to tell me everything. Both can be true. Michael says that's practically theology.\""}],
    "nakamura":[{if:()=>S.act===3,text:"\"He's the only one here who doesn't lie about what he is.\" A brittle laugh. \"You should try it, Mother. It's restful.\""}],
    "home":[{if:()=>S.act===3&&S.rel.katie>=4,text:"For a moment the armor hangs open. \"Home is a lamp in a cave and Papa's stupid robots and Simone reading out loud.\" She looks away. \"You can't go back down a shaft you climbed out of. You taught me that.\" \"I never—\" \"You *lived* it, maman. Same thing.\""},
        {if:()=>S.act===3,text:"\"Don't,\" Katie says, and the word closes like a door."}],
    "herself|drugs|kokomo":[{if:()=>S.act===3,text:"Her chin lifts. \"I'm exactly where everyone always said I'd end up. There's a comfort in arriving.\" The pupils say the rest; the daughter dares the doctor to say it aloud."}]
  },
  tell:{}, show:{},
  kiss:function(){ if(S.act===3){ if(S.rel.katie>=4){ out("She kisses her daughter's cheek before the armor can decide. Katie goes rigid — then, for one broken second, leans in. \"...Go home, maman,\" she whispers. \"It's not safe for you here.\""); F().katieWarned=true; } else { out("Katie steps back from the kiss, smooth as choreography. \"We're past that, Mother.\""); } return endTurn(); }
    out("She catches the comet and kisses it. \"MamAN,\" Katie protests, delighted."); relUp("katie",1); return endTurn(); }
};
/* ---- Act II events: Katie lost, arrival at the Node ---- */
function registerActTwoEvents(){
  addEvent("katie_lost",
    ()=>S.act===2&&S.phase==="act2_voyage"&&K().k_sirius&&S.turn>=(F().siriusTurn||0)+2,
    function(){
      S.phase="katie_lost"; CHARS.katie.loc="limbo";
      out("Simone appears at the atrium door with the particular stillness that means trouble has already happened. \"Maman. Katie went to the vertical. Alone. An hour ago.\" A beat. \"She said the big avian was calling her. She left her tether.\"");
      outSys("Katie is somewhere in the Avian Vertical — north from the lair. Find her.");
    });
  addEvent("node_arrival",
    ()=>S.act===2&&S.phase==="act2_node_wait"&&F().katieResolved&&S.turn>=(F().katieTurn||0)+4,
    function(){
      S.phase="act2_arrival";
      CHARS.simone.loc="party"; CHARS.katie.loc="party";
      outAlert("Deceleration.");
      out("It comes in the night watch: the hum changing key, the floor leaning the other way, twelve years of velocity being paid back with interest. For six days Rama brakes, and the family lives on the walls, and Richard laughs at intervals for no reason he can explain.");
      out("On the seventh day the engines stop, the lights of Rama dim to a hush — and through the atrium wall, rendered in patient light, they see what has caught them: a structure. A lattice of spars and vast dark chambers, hanging in the double dawn of Sirius, so large that Rama — their whole world, their sixteen-kilometer nation — is entering it the way a bee enters a cathedral.");
      out("Richard says, at last, in a small voice: \"It's a harbor.\" And in the gallery wall behind them, with a sound like a chord resolving, a seam none of them has ever found opens onto a corridor of white light.");
      outSys("The Node. A way OUT has opened from the lair.");
      F().nodeCorridor=true;
    });
}
WORLD.avian_shaft.onEnter=function(){
  if(S.phase==="katie_lost"&&!F().katieFound){
    doLookInline();
    out("The vertical is in uproar — avians gyring low, calls overlapping, and no small daughter anywhere the lamp finds. Fear does its cold trick with time. Sound carries here; the whole shaft is an ear.");
    outSys("(SHOUT for her.)");
    endTurn(true);
    return true;
  }
  return false;
};
QUESTION_HANDLERS.katie_angry = {
  yes:function(){ out("\"Yes.\" Nicole lets it be simple and true, doctor-flat. \"You left your tether and your sister and your word. The avian saved your life; you spent it cheaply first.\" Katie's chin sets — the anger going in deep, to be studied later, alone. Simone, at the passage mouth, catches her mother's eye: *filed*."); F().katieStern=true; endTurn(); },
  no:function(){ out("\"No,\" Nicole says, and sits down on the cold ledge so their eyes are level. \"I'm frightened. Those are different animals. Tell me everything — the calls, the wing, all of it — and then we're going to build you a tether you'll actually wear.\" Katie tells it three times, faster each round. Somewhere in the second telling, she takes her mother's hand and forgets to let go."); relUp("katie",2); endTurn(); }
};
WORLD.avian_shaft.onTurn=function(){
  if(S.phase==="katie_lost"&&F().katieFound&&!F().katieResolved){
    F().katieResolved=true; F().katieTurn=S.turn; S.phase="act2_node_wait"; CHARS.katie.loc="party";
    out("She is on a ledge eight meters down, entirely unhurt, entirely unrepentant, one hand resting — resting! — on the folded wing of an avian the size of a rowing boat, which regards Nicole with an ancient amber eye and does not move. Richard rigs the line in four minutes flat. Katie ascends under protest, trailing three falling notes behind her like a scarf.");
    out("At the top, her daughter looks up, mud-streaked and shining. \"He CAUGHT me, maman. I slipped and he was just — THERE.\" The truth of it is all over her: somewhere below, a grey wing broke a human child's fall, on purpose. \"Are you angry?\"");
    askQ("katie_angry","Is she angry? (YES/NO)");
  }
};

/* ---- The Node ---- */
WORLD.node_dock={
  name:"The Node — Hangar of Light",
  desc:"There is no scale here that the mind will accept. They stand on a floor of white radiance at the edge of a chamber in which Rama — all of Rama, the sea, the cities, the sky they lived under — rests in a cradle of spars like a model on a shelf. Light without source; air without origin; a horizon made of architecture. Nicole's eyes keep trying to make it a sky, and it keeps, gently, declining.",
  brief:"The hangar: Rama at rest in its cradle, in light without source.",
  scenery:["rama_hull","radiance","node_hangar","distant_berth","node_pulse"],
  sound:"A silence so complete it has texture — until she notices, beneath it, a slow pulse, like a tide, like circulation. The Node is not quiet. The Node is calm.",
  exits:{ "in":{to:"node_hall", msg:"A path proposes itself across the radiance — light thickening, step by step, exactly where a path should be."}, out:{to:"lair", msg:"Back through the corridor, into the familiar dusk of home. It is strange to think of Rama as small."} }
};
SCENERY.rama_hull={name:"Rama",alias:["hull","ship","cradle","world","home"],desc:"From outside, at last: a grey cylinder, work-worn, immense, and — in this chamber — one artifact among berths for many. Several cradles stand empty. One, very distant, does not."};
SCENERY.radiance={name:"radiance",alias:["light","floor","white light","white radiance","floor of white radiance"],desc:"The light comes from everywhere and casts no shadows, which her hindbrain has voted, eleven to one, to stop mentioning."};
SCENERY.node_hangar={name:"hangar",alias:["hangar","chamber","horizon","architecture","spars","berths","cradles","path","path of light","cradle of spars","air","air without origin","edge","edge of chamber"],desc:"The chamber refuses every familiar measure. Spars cross distances that should contain weather; berths hold world-sized machines; the floor and horizon are the same source-less radiance. This is infrastructure for a civilization that treats planets as cargo."};
SCENERY.distant_berth={name:"distant occupied berth",alias:["distant cradle","distant berth","occupied cradle","far cradle","other vehicle","nonempty cradle"],desc:"At the limit of useful sight, one cradle holds something that is not Rama: a dark, many-lobed vehicle with no concession to human symmetry. Nothing moves around it. The fact of another arrival is enough."};
SCENERY.node_pulse={name:"slow pulse",alias:["slow pulse","pulse","tide","circulation"],desc:"More felt through her soles than heard: a measured pressure wave passing through the Node's structure. Circulation, perhaps, or traffic, or a heartbeat selected for visitors who require metaphors.",on:{listen:"There: a slow pulse below silence, recurring without hurry. The Node is not quiet. The Node is calm."}};

WORLD.node_hall={
  name:"The Node — Hall of Reception",
  desc:function(){ return "A dome of pearl light, furnished with exactly what is needed and nothing else: seats that anticipated human proportions, a floor warm to bare feet, a table that bears — this took a week to stop being frightening — fresh fruit, bread, and water. "+(K().k_eagleMet?"The Eagle stands at its accustomed place, patient as furniture, alert as a hawk.":"The far side of the dome holds a taller doorway, dark within."); },
  brief:"The pearl dome; the Eagle's hall.",
  scenery:["table_node","doorway","node_dome","node_seats","node_floor"],
  exits:{ out:"node_dock",
    north:{to:"node_obs", hidden:function(){return !K().k_eagleMet;}},
    east:{to:"node_med", hidden:function(){return !K().k_eagleMet;}},
    west:{to:"node_quarters", hidden:function(){return !K().k_eagleMet;}},
    south:{to:"node_design", hidden:function(){return !F().designOpen;}} },
  onEnter:function(){
    if(!K().k_eagleMet){
      S.phase="act2_eagle";
      doLookInline();
      K().k_eagleMet=true; CHARS.eagle.loc="node_hall"; CHARS.eagle.gone=false;
      out("It comes through the tall doorway without haste, and Nicole's mind performs the assessments of her two professions at once. The body: humanoid, two and a half meters, functional, engineered. The head: an eagle's — feathered, gold-eyed, beaked — chosen, she understands immediately, from Earth's own inventory of forms, the way a host chooses a language. It is not pretending to be alive. It is not pretending anything.");
      out("\"Nicole des Jardins.\" Its voice is even, neither warm nor cold — calibrated. \"Richard Wakefield. Michael O'Toole. Simone. Katherine. You are the first of your species to reach a Node. You will have questions. I am configured to answer some of them.\" A measured pause. \"I also have questions. That is, in the end, what all of this is for.\"");
      outSys("The Eagle. TALK to it; ASK it ABOUT anything. When you are ready to be questioned in return, TELL THE EAGLE ABOUT HUMANITY.");
      endTurn(true);
      return true;
    }
    return false;
  }
};
SCENERY.table_node={name:"table",alias:["food","fruit","bread","water"],desc:"Fresh fruit that matches no cultivar on record and every craving on the manifest. Michael said grace over it the first night. The Eagle waited politely for him to finish, then asked him to explain the custom, and listened for an hour.",
  on:{eat:"She eats. It is, as always, exactly right, which is its own species of unsettling.",drink:"She drinks the Node's water. It is cool, clean, and mineral-balanced to a body whose chemistry this place knew before she arrived. That may be hospitality. It may also be inventory control.",take:"The food is freely offered. She takes what she wants for the moment; there is no reason to turn the Node's hospitality into expedition inventory."}};
SCENERY.doorway={name:"tall doorway",alias:["door","dark doorway"],desc:"Taller than human needs. The dark inside it is restful rather than ominous — the dark of backstage, not of the pit.",on:{open:"There is no door to open; the tall passage already stands dark and unobstructed.",enter:"The passage is not one of the paths the Node has offered its guests. Nicole respects that distinction for now."}};
SCENERY.node_dome={name:"pearl dome",alias:["dome","pearl light","hall","chamber"],desc:"Pearl radiance curves overhead without fixture or seam. The scale is formal without being grandiose: a room designed to say that visitors are expected and none of them will define the architecture.",on:{touch:"The curving surface is warm and faintly resilient. No fixture, seam, or hidden source explains its light."}};
SCENERY.node_seats={name:"human-sized seats",alias:["seats","seat","chair","chairs"],desc:"Five seats shaped for human backs, knees, and habits of personal distance. They are not copies of any human chair. They are the result of watching people sit.",on:{sit:"She sits. The support adjusts once, almost below perception, and becomes exactly the chair her posture requested."}};
SCENERY.node_floor={name:"warm floor",alias:["floor","warm floor","bare feet"],desc:"Smooth underfoot and held exactly warmer than skin expects. The Node has learned comfort as an engineering specification.",on:{touch:"Warm, seamless, and very slightly yielding — a floor specified for human feet by something that has never had them."}};
CHARS.eagle={name:"the Eagle",alias:["eagle","alien","host","bird","eagle's head","head","feathers","beak","gold eyes","gold irises","irises","humanoid frame","matte frame"],loc:"node_hall",gone:true,pron:"its",
  desc:"Two and a half meters of deliberate design: a humanoid frame, matte and seamless, surmounted by the head of an eagle rendered with unnerving fidelity — feathers, gold irises, the small constant adjustments of a raptor's attention. It is a translator's choice of body, a form selected from humanity's own archive of the dignified. When it is not needed, it does not fidget. It simply is not needed yet.",
  here:"The Eagle attends, gold-eyed, patient.",
  talk:function(){
    if(S.phase==="act2_farewell") return "\"The request stands,\" the Eagle says. \"So does Simone Wakefield. We do not mistake the cost to your family for evidence against her choice.\"";
    return "\"I am listening,\" the Eagle says, and the terrible thing, Nicole thinks, is that it is the literal truth: everything here is listening, and has been for a very long time.";
  },
  suggest:function(){ const t=["the Node","Rama","its purpose","itself"]; if(!F().interviewDone) t.push("(or TELL THE EAGLE ABOUT HUMANITY, when ready)"); if(F().interviewDone&&!F().requestGiven) t.push("what comes next"); return t; },
  ask:{
    "node":"\"The Node is a harbor, a workshop, and a post office,\" the Eagle says. \"Vehicles such as Rama are received here, restored here, and dispatched from here. There are other Nodes. The number would not be meaningful to you yet.\"",
    "harbor|workshop|post office|vehicles|vehicle":"\"Receive, restore, dispatch,\" the Eagle says. \"Those are the Node's local functions. Your postal systems were the nearest concise analogy. The correspondence here is conducted in worlds.\"",
    "hierarchy|station|clearance|clearances":"\"This Node can answer within its station,\" the Eagle says. \"Some questions belong to the network; some to the builders; some have not been assigned an answer. Your species also distinguishes ignorance from classification, though less consistently.\"",
    "rama":"\"Rama is a survey instrument. It gathers.\" A pause calibrated to human rhythm. \"You have perhaps noticed that it gathered you.\"",
    "purpose|mission|why|for":"\"You are asking the question beneath the question,\" the Eagle observes. \"Why observe? I will say this much: information about spacefaring species is being assembled. Carefully. Comprehensively. For a purpose that is—\" the pause, this time, seems almost rueful \"—above this Node's station.\"",
    "builders|ramans|makers|creators":"\"You wish to meet the builders.\" The gold eyes are steady. \"Nicole des Jardins: in a sense you have been inside their handshake for fourteen years. The hand itself is further away. In every direction you can name, and several you cannot.\"",
    "god":"\"General O'Toole asks me that daily,\" the Eagle says. \"I give him the only honest answer available at this level of the hierarchy: the question is receivable, and I am not authorized to be its answer.\"",
    "itself|yourself|you":"\"I am an interface, purpose-built for your species from your species' own broadcasts. The eagle was selected from your iconography of the trustworthy. If the selection was in error, alternative forms exist.\" It does not smile — it cannot — and yet.",
    "broadcasts|alternative forms|forms|body":"\"Your broadcasts provided shapes, voices, gestures, and many incompatible theories of authority,\" it says. \"This form produced the lowest modeled fear and the highest modeled attention. Alternative bodies remain available. None improved both values.\"",
    "sirius":"\"A convenient harbor with reliable light. Your poets made much of it. The choice was not sentimental. It was, however, noted that you would find it beautiful.\"",
    "biots":"\"Rama's maintenance ecology. They will not be discussed individually; you do not introduce a visitor to your white blood cells.\"",
    "octospiders|colors|color":[{if:()=>K().k_mural||K().k_grillLock,text:"\"The chromatic script you found beneath New York belongs to another passenger species — prior guests, in a sense, and possibly future neighbors. They speak in ordered color. You have already seen their greeting: red, blue, green. Remember it. Courtesy travels well.\"", fx:function(){ K().k_octoHint=true; }},
      {if:()=>true,text:"\"In time,\" the Eagle says, which from it is a complete sentence."}],
    "humanity|humans":function(){ return startInterview(); },
    "next|request|return|earth|future":[
      {if:()=>F().requestGiven, text:"\"Rama departs with your habitat,\" the Eagle says. \"The second habitat remains here under a human steward. Simone Wakefield has offered; Michael O'Toole accompanies her. This future is no longer hypothetical.\""},
      {if:()=>F().interviewDone&&!F().requestGiven, run:function(){ return eagleRequest(); }},
      {if:()=>true, text:"\"Soon,\" the Eagle says. \"First, I would understand you better. When you are ready: tell me about humanity.\""}
    ],
    "simone|family|children":"\"Your children are observed with particular interest,\" the Eagle says, and something in the calibration of its voice has softened by one degree. \"They are the first of you for whom none of this is strange. Data of that kind cannot be simulated.\"",
    "katie|richard|michael":"\"Each member of your family is separately legible and collectively surprising,\" the Eagle says. \"That is not a defect in the model. It is a reason for the observation.\"",
    "passenger species|passengers|neighbors|greeting|second habitat|steward":[
      {if:()=>F().requestGiven, text:"\"The second habitat carries passengers whose forms and needs are not mine to disclose before introduction,\" the Eagle says. \"They require a steward who can remain curious without making curiosity a claim of ownership. Simone Wakefield understands this.\""},
      {if:()=>true, text:"\"Other passengers have traveled through this network,\" the Eagle says. \"Ordered color is one surviving greeting. Courtesy before comprehension is a sound first protocol.\""}
    ]
  },
  tell:{
    "humanity|humans|us|ourselves":function(){ return startInterview(); }
  },
  show:{ scarf:function(){ out("The Eagle regards the scarf for four full seconds. \"An inheritance. A portable loyalty.\" It inclines its head. \"This is the category of object we understand your species least well through instruments, and best through you.\""); return endTurn(); } }
};
SCENERY.eagle_form={name:"the Eagle's body",alias:["body","eagle body","eagle's body","selected body","selected form"],desc:"A matte humanoid frame carrying an eagle's head with unnerving fidelity: not biology but an interface body selected from humanity's own archive of authority.",on:{touch:"The Eagle permits one clinical contact. Matte material, faint warmth, no pulse Nicole recognizes; the body is a deliberate translation, not a disguise."}};
WORLD.node_hall.scenery.push("eagle_form");
function startInterview(){
  if(F().interviewDone){ out("\"You have answered,\" the Eagle says. \"The answers are already traveling.\""); return endTurn(); }
  if(S.phase==="act2_interview"){ outSys((S.pendingQuestion&&S.pendingQuestion.prompt)||EAGLE_INTERVIEW_PROMPTS[F().eagleQ||1]); return; }
  S.phase="act2_interview"; F().eagleQ=1;
  out("\"Thank you.\" The Eagle settles into a stillness that is somehow more attentive than motion. \"Three questions. Answer as you choose; the choosing is also an answer.\"");
  out("\"First. Your expedition arrived carrying weapons, and your governments' final act was to target this vehicle with more. Tell me about your species and war.\"");
  queueInterviewQuestion(1);
  outSys("Answer HONESTLY, give a CURATED account, or REFUSE.");
  return endTurn();
}
function queueInterviewQuestion(q){
  F().eagleQ=q;
  askQ("eagle_interview",EAGLE_INTERVIEW_PROMPTS[q],false,false);
}
QUESTION_HANDLERS.eagle_interview={
  options:[["HONESTLY","honestly"],["CURATED","curated"],["REFUSE","refuse"]],
  honestly:function(){ return answerInterview("honestly"); },
  curated:function(){ return answerInterview("curated"); },
  refuse:function(){ return answerInterview("refuse"); }
};
function answerInterview(verb){
  const q=F().eagleQ;
  const key=q===1?"war":q===2?"love":"fear";
  S.eagleAnswers[key]=verb;
  if(q===1){
    if(verb==="honestly") out("Nicole gives it whole: the wars of religion and the wars of appetite, the twentieth century's arithmetic, the missiles that followed Rama out of the system with her children aboard. \"We are afraid of what we don't understand,\" she finishes, \"and we arm the fear. Some of us spend our lives trying to get there before the weapons do. Sometimes we're fast enough.\"");
    else if(verb==="curated") out("Nicole chooses the account a diplomat would sign: war as humanity's failure mode, not its nature; the treaties, the long peaces, the trend lines. All true. All arranged. The Eagle's gold eyes hold hers a moment longer than comfort, noting, she is certain, precisely what has been left in the drawer.");
    else out("\"No,\" Nicole says. \"Not as a species' spokeswoman. I'll answer for what I've seen and done; humanity can testify for itself when it gets here.\" The Eagle inclines its head as if a hypothesis has been usefully confirmed.");
    out("\"Second. You crossed two hundred million kilometers, and then eight light-years, and by every measure of your biology this cost you. Tell me about your species and love.\"");
    queueInterviewQuestion(2);
    outSys("HONESTLY, CURATED, or REFUSE.");
    endTurn();
    return true;
  }
  if(q===2){
    if(verb==="honestly") out("She tells it the truth so plainly that Richard, beside her, looks at the floor: a father's scarf; a daughter's hand in the dark of a vertical; a man who searched a pit for three days because arithmetic was unacceptable. \"It doesn't scale and it doesn't optimize,\" she says. \"It's the most expensive thing we make. We make it constantly.\"");
    else if(verb==="curated") out("She gives the anthropology: pair-bonding, kin altruism, the chemistry and the sociology, love as strategy refined into sentiment. Accurate, defensible, and — she hears it as she says it — a map of a country drawn by someone standing outside it.");
    else out("\"That one isn't mine to file,\" Nicole says. \"You've watched us for fourteen years. Check your own instruments.\" The Eagle's head tilts, one degree. \"We have. They disagree with each other. It is our favorite anomaly.\"");
    out("\"Last. You are mortal, and you know it as few species know it. Tell me about your species and fear — what you do with the ending of things.\"");
    queueInterviewQuestion(3);
    outSys("HONESTLY, CURATED, or REFUSE.");
    endTurn();
    return true;
  }
  if(verb==="honestly") out("Nicole answers as a physician who has held more last hours than she has counted: the bargaining and the courage, the ones who curse and the ones who bless, Michael's psalms, Richard's equations, her own father teaching her — with his final winter — that an ending can be *done well*, like anything else. \"We die,\" she says. \"So we tell each other stories that are longer than we are. You're standing in one.\"");
  else if(verb==="curated") out("She gives the noble version: fear as the engine of foresight, mortality as the mother of meaning, monuments and medicine as its children. It is the answer of a species putting its best foot forward, and the Eagle receives it the way a customs officer receives a beautifully packed suitcase.");
  else out("\"Ask me again someday,\" Nicole says quietly, \"when it's closer.\" For three full seconds the Eagle says nothing at all. Then: \"That,\" it says, \"is the first answer of yours I will flag for the attention of my superiors.\"");
  F().interviewDone=true; S.phase="act2_settled";
  out("The Eagle rises through no visible motion into a posture of conclusion. \"Thank you. You will want rest, and your children want the observation gallery, and your husband wants — everything; we have prepared accordingly. The dome's doors are open to you.\" And they are: north, east, west, where there were no doors before.");
  outSys("The Node opens: the Observation Gallery (NORTH), a medical chamber (EAST), family quarters (WEST).");
  endTurn();
  return true;
}
WORLD.node_obs={
  name:"The Node — Observation Gallery",
  desc:"A blister of perfect transparency on the Node's flank. Sirius A stands off the port quarter, a diamond furnace; its white-dwarf companion rides beside it, small and dense and patient, the two of them waltzing a fifty-year measure. Between and beyond: the black, and the unfamiliar constellations, and — once she knows where to look — a scatter of moving lights that are not stars. Traffic.",
  brief:"The transparent gallery; Sirius and its companion.",
  scenery:["sirius_view","traffic","node_transparency","node_constellations"],
  sound:"Nothing. Glory, it turns out, is silent.",
  exits:{ south:"node_hall" },
  onEnter:function(){
    if(!F().obsSeen){ F().obsSeen=true; F().obsTurn=S.turn+1;
      doLookInline();
      out("They stand in a row at the transparency, the five of them, for a long time. Katie's hand finds Nicole's on one side; Richard's on the other. Michael, at the end of the line, is saying something under his breath, and for once it does not sound like a request. It sounds like a receipt.");
      endTurn(true); return true; }
    return false;
  }
};
SCENERY.sirius_view={name:"Sirius",alias:["star","stars","suns","companion","dwarf","Sirius A","white dwarf","white-dwarf companion","white dwarf companion","diamond furnace"],desc:"Eight and a half light-years from the porch light of her species. The brightest star in Earth's sky, seen from the wrong side. She files the thought under vertigo, subcategory: earned."};
SCENERY.traffic={name:"moving lights",alias:["traffic","lights2","ships"],desc:"Points of light on unhurried errands among the Node's far structures. Not stars. Not hers to hail. Not yet."};
SCENERY.node_transparency={name:"perfect transparency",alias:["blister","transparency","window","gallery window"],desc:"No frame, reflection, or visible material separates the gallery from Sirius. Only the pressure under Nicole's palm insists that vacuum is not in the room with them.",on:{touch:"Her palm meets a surface she cannot see: room-warm, utterly smooth, and immovable against the dark."}};
SCENERY.node_constellations={name:"unfamiliar constellations",alias:["black","darkness","unfamiliar constellations","constellations","far structures","node structures","structures"],desc:"The stars refuse every pattern she learned from Earth. Against them, the Node's far structures appear only when they occult a point of light: a harbor too large to see except by what it hides."};

WORLD.node_med={
  name:"The Node — The Tailor's Room",
  desc:function(){ return "Richard named it the Tailor's Room: a chamber that makes things to measure. At its heart stands the synthesizer — a waist-high pillar crowned with a panel of colored squares that light and fade in ordered runs. It has produced, on request and after study, vitamins, boot soles, a violin. It works by color, in sequences, like the painted wall at home."+(K().k_colorGrammar?" Nicole can read its opening courtesy now: red, blue, green — *begin*.":""); },
  brief:"The Tailor's Room; the color-keyed synthesizer.",
  scenery:["synth","redsq","bluesq","greensq","node_med_readout","node_synthesis_output"],
  exits:{ west:"node_hall" }
};
SCENERY.synth={name:"synthesizer",alias:["pillar","machine2","fabricator","panel","palette","sequences","color sequences","sequences of color","colored squares","panel of colored squares","ordered runs","courtesy","prompt","vitamins","boot soles","violin"],
  desc:"The panel offers a palette of colored squares. When Richard works it, sequences of color ripple across it like sentences. The first three squares — red, blue, green — pulse gently whenever someone new approaches, an idle, repeated phrase. A greeting, Nicole is nearly sure. Or a prompt: *state your business, politely*.",
  on:{read:function(){ out(K().k_colorGrammar?"The panel's opening phrase is legible now: red, blue, green — *begin*. Beyond that courtesy, the cascades remain a language Nicole can follow only by context and reply.":"Ordered color repeats across the panel with the cadence of writing. The opening red-blue-green phrase is familiar from Rama, but not yet translated."); return endTurn(); },
      use:function(){ outSys("It speaks color. PUSH the squares in a sequence — beginning, perhaps, with the phrase Rama has been showing them for years."); return; },
      push:function(){ outSys("Push a particular square: RED, BLUE, or GREEN."); return; }}};
SCENERY.node_med_readout={name:"medscan readout",alias:["readout","medscan readout"],
  desc:function(){ return F().feverCured?"The medscan records the treatment's clean result: Simone's fever broke, the pathogen count collapsed, and her vitals returned to their familiar range.":S.phase==="simone_fever"?"The medscan readout shows Simone's fever climbing in slow stairs and a terrestrial pathogen drifted beyond every reference Nicole carries. It contains the question the Tailor's Room must answer.":"The medscan readout is quiet: no active patient profile, calibration and battery green."; },
  on:{read:function(){ return doExamine({kind:"scenery",id:"node_med_readout"}); }} };
SCENERY.node_synthesis_output={name:"synthesizer output",alias:["drawer","wafer","gel","pale gel"],
  desc:function(){ return F().feverCured?"The seamless drawer is closed again. The pale gel it produced has already done its work in Simone's bloodstream; the miracle has left no packaging behind.":S.phase==="simone_fever"?"There is no drawer, seam, or medicine yet. The medscan readout contains the question; the color panel still needs the opening word.":"The pillar has no visible output slot. It produces what is requested by opening exactly where a drawer needs to be, then becomes seamless again."; },
  on:{take:function(){ out(F().feverCured?"The dose is already administered. There is nothing left to pocket.":"There is nothing loose to take. The Tailor's Room waits for a request it understands."); return endTurn(); },
      open:function(){ out(F().feverCured?"The drawer has already delivered its dose and disappeared back into the seamless pillar. It does not reopen.":S.phase==="simone_fever"?"There is no drawer or seam to open yet. The color panel is waiting for the opening phrase.":"No seam answers her hand. The pillar makes an opening only when it has understood a request."); return endTurn(); }}};
function makeSquare(id,color){
  SCENERY[id]={name:color+" square",alias:[color],desc:"A square of "+color+" light on the panel, patient as a key.",
    on:{push:function(){ return pressColor(color); }, touch:function(){ return pressColor(color); }}};
}
makeSquare("redsq","red"); makeSquare("bluesq","blue"); makeSquare("greensq","green");
function pressColor(color){
  if(S.loc==="lair"){
    if(S.act===3 && S.phase==="act3_sanctuary" && !F().grillOpened) return octoPress(color);
    outSys(F().grillOpened?"The way is already open.":"Painted squares, inert under her fingers. For now, paint is all they are."); return;
  }
  if(S.loc==="eden_clinic") return clinicColor(color);
  if(S.loc!=="node_med"){ outSys("No color panel here."); return; }
  S.seq=S.seq||[];
  S.seq.push(color);
  out("The "+color+" square drinks her touch and holds its light.");
  const want=["red","blue","green"];
  for(let i=0;i<S.seq.length;i++){
    if(S.seq[i]!==want[i]){
      S.seq=[];
      out("The panel flushes amber — a polite negative — and clears itself, returning to the pulsing prompt: red, blue, green. Wrong phrase. It is willing to wait.");
      return endTurn();
    }
  }
  if(S.seq.length===3){
    S.seq=[];
    if(S.phase==="simone_fever"&&!F().feverCured){
      F().feverCured=true; K().k_colorGrammar=true;
      CHARS.simone.loc="party"; CHARS.katie.loc="party";
      out("Red, blue, green: *begin*. The panel wakes fully — cascades of color asking questions she answers by holding up the medscan's readout to its light, feeling like a woman miming to an oracle, until the pillar chimes once, opens a drawer that was not there, and presents a wafer of pale gel, dosage-sized, blood-warm.");
      out("Simone takes it under her mother's eye. The fever breaks in an hour — not dramatically; competently, the way everything here happens. Richard studies the panel afterward with tears of pure professional envy. \"It's a *grammar*, Nicole. Color order is syntax. You just said your first sentence.\"");
      relUp("simone",1);
      outSys("Learned: the color grammar — red, blue, green means BEGIN. (This will matter again.)");
      S.phase="act2_settled2";
      openDesignPhase();
      return endTurn();
    }
    K().k_colorGrammar=true;
    out("Red, blue, green: the panel wakes fully, colors cascading in courteous inquiry. Having nothing to ask of it, she gives the palette a small bow — Richard's habit, contagious — and it subsides to its patient prompt.");
    outSys("Learned: the color grammar — red, blue, green means BEGIN.");
    return endTurn();
  }
  return endTurn();
}
function clinicColor(color){
  if(F().serumMade){ outSys("The dispensary is already in production."); return; }
  S.cseq=S.cseq||[];
  S.cseq.push(color);
  out("The "+color+" square holds her touch and its light.");
  const want=["red","blue","green"];
  for(let i=0;i<S.cseq.length;i++){
    if(S.cseq[i]!==want[i]){ S.cseq=[]; out("Amber flush; polite reset. The prompt resumes its patient pulse: red, blue, green."); return endTurn(); }
  }
  if(S.cseq.length===3){
    S.cseq=[]; F().serumMade=true; S.phase="act3_alloc";
    out("Red, blue, green: *begin* — and the pillar wakes the way the Tailor's Room woke a quarter century ago, colors cascading in courteous inquiry. She feeds it the medscan's RV-41 workup, holding the readout to the light, answering cascade with cascade; and after a night of low chiming the drawer that was not there opens on the first tray of serum, dosage-marked, blood-warm, smelling faintly of rain on warm stone.");
    out("Ellie reads the assay twice and puts it down carefully, as one puts down something explosive. \"Maman. This doesn't manage RV-41. This *reverses* it.\" Then, doctor to doctor, the next sentence they both already know: \"First run is forty doses. We have forty-one patients — and a waiting list of exposed.\"");
    outSys("Allocation. Who receives the first run: the SICKEST first, the CHILDREN first, or a public LOTTERY?");
    return endTurn();
  }
  return endTurn();
}
function registerFeverEvent(){
  addEvent("simone_fever",
    ()=>S.act===2&&(S.phase==="act2_settled")&&F().obsSeen&&Number.isInteger(F().obsTurn)&&S.turn>=F().obsTurn+2,
    function(){
      S.phase="simone_fever"; CHARS.simone.loc="node_quarters"; CHARS.katie.loc="node_quarters";
      out("It arrives the way trouble arrives in families: quietly, at night. Simone — steady Simone — is burning. The medscan gives Nicole a fever chart climbing wrong and a pathogen profile it hesitates over: terrestrial, but drifted, twelve years of shipboard evolution ahead of every reference in her formulary. Her stocks can chase it. The Tailor's Room could *answer* it — if she can make the synthesizer listen.");
      outSys("Simone is feverish in the family quarters (WEST of the hall). The synthesizer (EAST) speaks in color — and Rama has been showing them one three-color phrase for years. (The lair's wall, the pit tunnel, the grill: red, blue, green.)");
    });
}
WORLD.node_obs.onTurn=function(){ if(F().obsSeen&&!Number.isInteger(F().obsTurn)) F().obsTurn=S.turn; };

WORLD.node_quarters={
  name:"The Node — Family Quarters",
  desc:function(){ return "Rooms that learned their family fast: ceilings that dim at bedtime, walls that hold the children's drawings without pins, a kitchen alcove that produces Michael's terrible coffee to his exact terrible specification. Home, provided by management."+(S.phase==="simone_fever"&&!F().feverCured?" Simone lies flushed and too quiet on her bunk, Katie standing guard over her sister with a ferocity that has nowhere to go.":""); },
  brief:"The family quarters.",
  scenery:["quarters_shell","quarters_kitchen","drawings","quarters_bunk","quarters_cloth","quarters_diagnostics"],
  exits:{ east:"node_hall" },
  onCmd:function(verb,obj){
    if(S.phase==="simone_fever"&&!F().feverCured&&obj&&obj.kind==="char"&&obj.id==="simone"){
      if(verb==="scan"){ out("The scan again: fever climbing in slow stairs, the drifted pathogen sitting a half-step outside her formulary's reach. Her stocks can hold the line tonight. The Tailor's Room can end it — if she can say *begin* in color."); K().k_feverScan=true; return true; }
      if(verb==="treat"){ out("She does what the kit can do — antipyretics, fluids, the cool cloth that is half medicine and half mother. It buys hours. The answer is east, in the room that makes things, behind a phrase of three colors."); return true; }
    }
    return false;
  }
};
SCENERY.quarters_shell={name:"family rooms",alias:["rooms","ceilings","ceiling","walls","wall"],desc:"The ceilings dim along the household's old sleep cycle; the walls accept drawings, shelves, and privacy screens where the family expects them. The Node has not imitated a house. It has inferred one from habits."};
SCENERY.quarters_kitchen={name:"kitchen alcove",alias:["kitchen alcove","kitchen","alcove","coffee","michael's coffee"],desc:"A compact service niche that provides food and drink from no visible stores. Michael requested coffee once; the alcove treated his preference as a specification and has produced the same heroic bitterness ever since.",on:{drink:"She tries Michael's coffee. It is hot, strong, and exactly as terrible as advertised. The alcove has reproduced the recipe with flawless accuracy, which absolves neither machine nor priest."}};
SCENERY.drawings={name:"drawings",alias:["drawing","pictures","art"],desc:"Katie's are all wings and velocity. Simone's are all structure: the lair in section, the family as a constellation, the Eagle rendered kindly. One shows a woman with a red-and-gold scarf, larger than the sun beside her. Nicole does not take it down."};
SCENERY.quarters_bunk={name:"Simone's bunk",alias:["bunk","bed","thin cover","cover"],desc:function(){ return S.phase==="simone_fever"&&!F().feverCured?"Simone lies under a thin cover, the cool cloth warming too quickly on her forehead. Katie has placed a chair beside the bunk and declared it a guard post.":"A built-in bunk adjusted to Simone's length and preferred firmness. The folded cloth at its head is clean now; Nicole still sees the fever when she looks at it."; }};
SCENERY.quarters_cloth={name:"cool cloth",alias:["cloth","cool cloth","folded cloth"],
  desc:function(){ return S.phase==="simone_fever"&&!F().feverCured?"The cloth is already warming against Simone's fevered forehead. It is comfort and borrowed time, not a cure.":"The clean cloth is folded at the head of Simone's bunk, ordinary and welcome among the Node's impossible provisions."; },
  on:{touch:function(){ out(S.phase==="simone_fever"&&!F().feverCured?"Damp and no longer cool. Nicole turns it to the cooler side and settles it back against Simone's forehead.":"Cool, damp, clean cotton — an ordinary household reassurance."); return endTurn(); },
      take:function(){ out(S.phase==="simone_fever"&&!F().feverCured?"She lifts the cloth only long enough to cool and replace it. Simone needs it here; Nicole has no reason to carry it away.":"She leaves the folded cloth by the bunk, where it belongs."); return endTurn(); }}};
SCENERY.quarters_diagnostics={name:"medical diagnostics",alias:["fever chart","chart","pathogen profile","pathogen","profile","formulary","stocks","medical stocks","readout","medscan readout"],desc:function(){ return S.phase==="simone_fever"&&!F().feverCured?"The fever climbs in slow stairs. The pathogen is terrestrial but drifted beyond the formulary Nicole carried into Rama. Her stocks can hold it; the Tailor's Room may be able to answer it.":F().feverCured?"The chart records a clean inflection: the synthesized treatment enters, the fever breaks, the pathogen count collapses. Competent medicine from an impossible pharmacy.":"The compact kit and formulary have kept a family alive across fourteen years. Everything is counted; everything human eventually runs short."; },on:{read:function(){ return doExamine({kind:"scenery",id:"quarters_diagnostics"}); }}};
function openDesignPhase(){
  F().designOpen=true;
  out("The next day the Eagle finds her in the hall. \"Your daughter recovers. You addressed the fabricator in its own syntax.\" A pause of, she would swear, approval. \"That aptitude has scheduling implications. Nicole des Jardins: it is time to speak about what your species does next. The atelier is open — south of this hall — when your family is ready.\"");
  outSys("The Design Atelier has opened, SOUTH of the Hall of Reception.");
}
WORLD.node_design={
  name:"The Node — Design Atelier",
  desc:"A chamber that is mostly a model: New Eden, rendered in light at waist height — a habitat to be grown inside Rama's northern bowl, a walled land of villages, fields, a lake, weather. Two thousand souls' worth of world, awaiting parameters. The model breathes; when Nicole leans in, it helpfully enlarges whatever she studies.",
  brief:"The atelier; the living model of New Eden.",
  scenery:["model","model_landscape","model_records","model_reserves","model_garden","model_parameters"],
  exits:{ north:"node_hall" },
  onEnter:function(){
    if(F().designOpen&&!F().designStarted){
      F().designStarted=true;
      doLookInline();
      out("\"Rama returns to your solar system,\" the Eagle says, at the model's far side. \"It will collect two thousand of your species — colonists, chosen by your governments — and carry them outbound for long-term observation. This habitat will hold them. The engineering is settled. The *society* is not, and you five are the only humans available to be consulted. Certain parameters are yours to set.\"");
      out("Richard mutters, \"No pressure,\" and leans into the model like a man falling in love.");
      out("\"First parameter,\" says the Eagle. \"Information. Shall the colony's records — governance, accounts, deliberations — be open to every citizen by default?\"");
      askQ("design_charter","Open records for all citizens? (YES/NO)");
      endTurn(true);
      return true;
    }
    if(F().designStarted&&!F().designDone&&!S.pendingQuestion){
      doLookInline();
      out("The model waits where they left it, patient as its makers, the unset parameter glowing softly for attention.");
      resumeDesign();
      endTurn(true);
      return true;
    }
    return false;
  }
};
SCENERY.model={name:"model",alias:["new eden","habitat","miniature","eden model","world","settlement"],desc:function(){
  const h=S.habitat||{};
  let d="Villages named for nothing yet; a lake with programmable weather; fields in tidy quarters. A world the size of a promise. Somewhere in this light, though she cannot know it, is the room where she will grow old.";
  if(h.charter) d+=" The archive now has "+(h.charter==="open"?"wide public doors":"one guarded, deliberate entrance")+".";
  if(h.margin) d+=" The settlement favors "+(h.margin==="reserve"?"broad fields, deep stores, and close-set houses":"generous homes, common space, and leaner reserves")+".";
  if(h.garden) d+=h.garden==="yes"?" At its center, the Memory Garden is green and unmistakable.":" Orchard rows occupy the land once proposed for a Memory Garden.";
  return d;
}};
SCENERY.model_landscape={name:"modeled landscape",alias:["villages","village","lake","fields","weather","northern bowl","walled land"],desc:"The model enlarges whatever Nicole studies: unclaimed village streets, a lake under programmable weather, fields curved to the northern bowl, and the enclosing wall of Rama where a horizon should continue."};
SCENERY.model_records={name:"colony records",alias:["records","governance","accounts","deliberations","archive","archive building","doors","archive doors","wide public doors","guarded entrance","modest entrance","books"],desc:function(){
  const choice=(S.habitat||{}).charter;
  if(choice==="open") return "The archive building stands at the village center with wide doors. Governance, accounts, and deliberations will be public by default — an argument everyone may enter.";
  if(choice==="sealed") return "The archive has one modest entrance: records private by default, opened through due process. A room for unfinished thoughts, and a wall behind which danger might gather.";
  return "The archive flickers between wide doors and a guarded entrance. The model is waiting to learn whether the colony's records begin open or sealed.";
},on:{read:function(){ return doExamine({kind:"scenery",id:"model_records"}); }}};
SCENERY.model_reserves={name:"habitat margin",alias:["margin","reserve","reserves","deep stores","stores","granaries","pharmacy","water","houses","homes","personal space","common space","common rooms","comfort"],desc:function(){
  const choice=(S.habitat||{}).margin;
  if(choice==="reserve") return "Fields widen around fat granaries; the pharmacy and water systems duplicate themselves; houses draw closer. Insurance is visible here as space deliberately left unused.";
  if(choice==="comfort") return "Houses spread apart, doors gain private thresholds, and common rooms breathe. Stores are sufficient rather than deep. The design treats morale as a resource that can also run out.";
  return "The model alternates between deep reserves and generous living space. It can build either margin, not both; the choice remains unset.";
}};
SCENERY.model_garden={name:"Memory Garden",alias:["memory garden","commons","heirloom species","names","orchard rows","paths","tiny wall"],desc:function(){
  const choice=(S.habitat||{}).garden;
  if(choice==="yes") return "A commons blooms at the village heart: heirloom trees, shared paths, and a tiny wall awaiting the names of the dead. It produces nothing the manifest can weigh.";
  if(choice==="no") return "Productive orchard rows cover the proposed commons. The calories are honest and necessary. The absence of a place for names is honest too.";
  return "A green commons appears and dissolves, alternating with orchard rows. The model waits to learn whether memory will receive land, water, and labor of its own.";
}};
SCENERY.model_parameters={name:"design parameters",alias:["parameters","parameter","unset parameter","design choices","choices"],desc:function(){
  const h=S.habitat||{};
  const pending=[];
  if(!h.charter) pending.push("records");
  if(!h.margin) pending.push("margin");
  if(!h.garden) pending.push("memory");
  return pending.length?"Three human questions govern the social design: records, margin, and memory. Still unset: "+pending.join(", ")+".":"The human parameters are set: "+(h.charter==="open"?"open records":"sealed records")+", "+(h.margin==="reserve"?"deep reserves":"generous comfort")+", "+(h.garden==="yes"?"the Memory Garden":"productive orchards in its place")+".";
},on:{read:function(){ return doExamine({kind:"scenery",id:"model_parameters"}); }}};
QUESTION_HANDLERS.design_charter = { yes:function(){ designChoice("charter","open"); }, no:function(){ designChoice("charter","sealed"); } };
QUESTION_HANDLERS.design_margin  = { yes:function(){ designChoice("margin","reserve"); }, no:function(){ designChoice("margin","comfort"); } };
QUESTION_HANDLERS.design_garden  = { yes:function(){ designChoice("garden","yes"); }, no:function(){ designChoice("garden","no"); } };
function resumeDesign(){
  if(!S.habitat.charter) askQ("design_charter","Open records for all citizens? (YES/NO)");
  else if(!S.habitat.margin) askQ("design_margin","Weight toward reserve? (YES/NO)");
  else askQ("design_garden","Build the Memory Garden? (YES/NO)");
}
function designChoice(param,val){
  S.habitat[param]=val;
  if(param==="charter"){
    out(val==="open"?"\"Open,\" Nicole says. \"Secrets are compound interest; I've watched them pay out. Let the books be public and the arguments be loud.\" The model's small archive building acquires wide doors. Richard applauds silently. The Eagle notes: \"Transparency selected. This will make certain futures harder to build, and certain others impossible. Both features.\"":"\"Sealed, with due process,\" Nicole says slowly. \"People need rooms where half-formed thoughts are safe, or the thinking stops. Openness by request; privacy by default.\" The model's archive grows a modest door. The Eagle notes: \"Discretion selected. This will make certain futures harder to see coming. That, too, is a feature and a cost.\"");
    out("\"Second parameter. Margin. The habitat's capacity can favor agricultural and medical reserve — or personal space and comfort. Reserve is insurance nobody thanks you for. Comfort is morale nobody audits. Weight the design toward reserve?\"");
    askQ("design_margin","Weight toward reserve? (YES/NO)");
    return;
  }
  if(param==="margin"){
    out(val==="reserve"?"\"Reserve.\" The physician answers before the politician can convene. \"Margins are my love language. Fat granaries, deep pharmacy, redundant water. Comfort can be earned; buffer has to be built.\" The model's fields widen; the houses draw modestly closer together.":"\"Comfort,\" Nicole decides. \"Two thousand people locked in a bottle for years — despair is a shortage too. Gardens, space, doors of one's own. We'll grow the margins with our hands.\" The model's houses spread out generously; the fields trim to sufficiency.");
    out("\"Final parameter. A cultural allocation exists — unassigned. One proposal in your species' file is called a memory garden: a commons planted with heirloom species, holding names and records of the dead, tended in common. It consumes land, water, and labor and produces nothing the manifest can weigh. Shall it be built?\"");
    askQ("design_garden","Build the Memory Garden? (YES/NO)");
    return;
  }
  // garden
  out(val==="yes"?"\"Build it,\" Nicole says, and finds her hand at her scarf. \"A society that can't visit its dead starts misplacing its living.\" In the model, at the village's heart, a green space blooms — tiny trees, tiny paths, a tiny wall awaiting names. Michael, in the doorway, says \"Amen\" like a man signing something.":"\"No,\" Nicole says at last, hating the arithmetic and doing it anyway. \"Not at two thousand souls on a closed manifest. Memory travels in people; the land has to travel in calories.\" The green space in the model dissolves into orchard rows, productive and mute. Michael, in the doorway, says nothing, which from Michael is a paragraph.");
  F().designDone=true; S.phase="act2_request_wait"; F().designTurn=S.turn;
  out("The Eagle regards the finished model — her model now, its lights breathing — for a long moment. \"Parameters accepted. Fabrication begins tonight. Rest, Nicole des Jardins. What comes next will ask more of you than a fever did.\"");
  outSys("New Eden is set: "+(S.habitat.charter==="open"?"open records":"sealed records")+", "+(S.habitat.margin==="reserve"?"deep reserves":"generous comfort")+", "+(S.habitat.garden==="yes"?"and the Memory Garden":"no memory garden")+".");
  endTurn();
}
function eagleRequest(){
  F().requestGiven=true; F().nodeYears=true; S.phase="act2_farewell";
  out("\"Then hear the whole of it,\" the Eagle says, and for once it sits, folding its improbable height into a chair as if to be smaller for this. \"Rama departs within the month, sunward. Aboard it: your family, and the habitat, and — when your species delivers them — two thousand of your kind, outbound to be known. The voyage is long. The observation is longer. You will not see Earth again, and you knew that before I said it.\"");
  out("\"One more thing, and it is a request, not an instruction. A second habitat travels with the Node — other species, other passengers, other children. It requires what your file calls a steward: a human presence, permanent, here. The candidate profile is: patient, kind, unafraid of the unexplained, and young enough to give it a lifetime.\" The gold eyes do not move to the doorway, where Simone is standing very straight. They do not need to.");
  out("The family council lasts three days and is none of the Node's business, so the Node, courteously, does not exist for three days. Simone has already decided — has, Nicole realizes with a physician's calm and a mother's free-fall, been deciding for years, in a hundred grave questions at dinner. Michael, silver and certain: \"She won't stand at that door alone. My congregation appears to be transferring.\" And there is nothing wrong with any of it except everything.");
  outSys("The month passes. When you are ready to say goodbye — and you will never be ready — go OUT to the hangar. (There is time first: talk to SIMONE, to MICHAEL, to everyone.)");
  return endTurn();
}
WORLD.node_dock.onGo=function(dir){
  if(dir!=="out") return false;
  if(S.phase!=="act2_farewell") return false;
  actTwoFinale();
  return true;
};
function actTwoFinale(){
  out("They say goodbye at the corridor of light, because there is no good place and this one at least is beautiful. Katie clings to her sister and will not cry in front of the Eagle, which Nicole understands completely. Richard holds Michael a long time — the atheist and the priest, fourteen years past needing words. Simone comes last, and puts into her mother's hands a folded paper: the drawing, the woman with the scarf, larger than her sun.");
  out("\"You taught me the whole job, maman,\" Simone says. \"Watch carefully. Love anyway. Leave the door open.\" She steps back beside Michael, into the white, and the two of them stand there — a lighthouse, staffed — until the corridor closes like water.");
  outAlert("Rama departs the Node. Aboard: Nicole, Richard, Katie — and, waiting to be born in the years of the long return, Ellie, Patrick, and Benjy. Sunward. Home, whatever that means now.");
  startActIII();
}

/* =====================================================================
   ACT III — RETURN
   ===================================================================== */
function startActIII(){
  S.act=3; S.phase="act3_open";
  CHARS.simone.loc="limbo"; CHARS.michael.loc="limbo"; CHARS.eagle.loc="limbo"; CHARS.eagle.gone=true;
  CHARS.richard.loc="party"; CHARS.katie.loc="vegas";
  CHARS.ellie.loc="eden_clinic"; CHARS.patrick.loc="eden_plaza"; CHARS.benjy.loc="eden_home"; CHARS.nakamura.loc="vegas";
  S.inv=["medkit","medscan","scarf"]; ITEMS.medkit.loc="inv"; ITEMS.medscan.loc="inv"; ITEMS.scarf.loc="inv";
  outAct("ACT III","RETURN");
  out("The return voyage is a story in itself, and it is told, as long stories are, in the names of children: Ellie, born in the second year, curious as her father; Patrick, in the fourth, an engineer before he could spell it; and Benjy — gentle Benjy, born with a mind that walks where others run, and a heart that arrived complete.");
  out("At the solar system's edge, humanity delivered its two thousand: chosen, screened, hopeful, and human, which is to say carrying everything. New Eden opened its gates in Rama's northern bowl — the villages, the lake, the weather, "+(S.habitat.garden==="yes"?"the Memory Garden green at its heart, ":"")+"all of it exactly as the model promised. Rama swung outbound again. And for five years, it worked.");
  out("It works less now. There is a sickness in the settlement called RV-41 that came up the well from Earth in someone's blood. There is a man named Toshio Nakamura who arrived with soft loans and hard friends and now owns the district everyone calls Vegas. There is an election coming that smells like an ending. And there is Nicole des Jardins Wakefield — councilor, chief physician, sixty-one years old — holding a clinic, a family, and a conscience in a colony that is starting to choose sides against itself.");
  outSys("(New Eden, year five. Home is where Benjy is; the clinic, the plaza, the assembly hall, the gate, and Vegas lie beyond. THINK reviews what's pressing.)");
  moveTo("eden_home");
}

WORLD.eden_home={
  name:"New Eden — The Wakefield House, Beauvois",
  desc:function(){ return "A house in the village she named for her father's: whitewashed panels, Richard's workshop annex leaking gadgets onto the porch, Simone's drawing framed by the door — the woman with the scarf, larger than her sun. "+(F().richardMissing?"Richard's workshop stands exactly as he left it, which is the loudest thing in the house.":"")+(CHARS.benjy.loc==="eden_home"?" Benjy is here, at the table, sorting his seed cards into constellations only he can see.":""); },
  brief:"Home, in Beauvois.",
  scenery:["workshop","drawing2","eden_house","home_table","seed_cards","home_ambient","home_missing_details"],
  sound:"Village sounds through the window: a well pump, children, someone's argument about water allocations conducted at neighborly volume. The weather engine gives them birdsong at fixed hours. Nobody has told Benjy it is recorded, because for Benjy it isn't.",
  exits:{ out:"eden_plaza" }
};
SCENERY.workshop={name:"workshop",alias:["annex","richard's workshop","richard s workshop","workbench","gadgets"],desc:function(){ return F().richardMissing?"Tools racked, projects paused mid-thought. On the bench, disassembled: one of the little Shakespeareans, its case open like a book he meant to finish reading. She does not touch it. She touches it every day.":"Richard's annex: three projects deep, two of them secret, one of them singing quietly to itself."; },
  on:{search:"Tools are racked and projects paused exactly where Richard left them. Nicole finds no message beyond the order itself.",
      touch:"The workbench is human-scarred and familiar: tools, filings, and the interrupted shape of Richard's attention.",
      open:"The little Shakespearean's case is already open on the bench. Nicole leaves its unfinished mechanisms as Richard arranged them."}};
SCENERY.drawing2={name:"Simone's drawing",alias:["drawing","simone's drawing","simone s drawing","simones drawing","frame","picture","sun"],desc:"The woman with the red-and-gold scarf, larger than the sun beside her. Eight light-years away, its artist keeps a lighthouse. Nicole touches the frame on her way out, every time, a small liturgy of her own.",
  takeFail:"The drawing belongs beside the family door. Nicole leaves it framed where home can keep it.",
  on:{read:"There are no words to read, only Simone's old declaration in line and color: her mother, scarf bright, larger than the sun.",touch:"Her fingertips find the frame's worn lower edge. She has made this small contact on the way out for years."}};
SCENERY.eden_house={name:"Wakefield house",alias:["house","home","door","family door","whitewashed panels","panels","porch"],desc:function(){ return F().richardMissing?"Whitewashed panels, a familiar porch, and Richard's absence occupying every room more completely than furniture.":"A practical village house made personal by years: white panels, a busy porch, and Richard's workshop steadily escaping its annex."; },takeFail:"The Wakefield house is home, not portable property. Nicole leaves walls, porch, and family door where lives can return to them."};
SCENERY.home_table={name:"table",alias:["kitchen table","family table"],desc:function(){ return CHARS.benjy.loc==="eden_home"?"The family table is presently Benjy's map of the universe, each seed card placed with grave precision.":"A scarred family table, cleared except for the faint rectangular ghosts of Benjy's seed cards."; },
  takeFail:"The family table is furniture, not field equipment.",
  on:{touch:"Scarred wood, rounded edges, and years of meals and projects: a human surface thoroughly fingerprinted.",search:"Nothing is hidden here. Benjy's arrangement is all on the surface, exactly where he intends it."}};
SCENERY.seed_cards={name:"seed cards",alias:["cards","seeds","arrangement","beans","tall flower","sunflower","papa card"],desc:"Benjy's hand-drawn cards: beans, flowers, names, and relationships arranged according to a patient astronomy all his own.",takeFail:"They are Benjy's working vocabulary. Nicole leaves the constellation intact.",
  on:{read:"Beans. Tall flower. Papa. Benjy's labels are careful; the relationships between them are the part written in placement.",touch:"She straightens one card only after Benjy nods permission, preserving the constellation."}};
SCENERY.home_ambient={name:"village sounds",alias:["window","well pump","pump","weather engine","birdsong","recorded birdsong"],desc:"Through the window: the village pump, children, and birdsong issued by the weather engine on an exact schedule. Artificial does not mean unloved."};
SCENERY.home_missing_details={name:"Richard's things",alias:["tools","bench","projects","shakespearean","shakespeareans","little shakespearean","case","robot case","open robot case","mechanism","unfinished mechanism","bed","side of the bed","pillow","walking boots","boots"],desc:function(){ return F().richardMissing?"The workshop tools are racked, the little Shakespearean lies open on the bench, his side of the bed is cold, and the walking boots are gone. Absence, itemized.":"Tools, projects, boots, and the ordinary evidence of Richard occupying a life at high velocity."; },
  takeFail:"Tools and projects stay on Richard's bench; the missing boots are already carrying their owner somewhere else.",
  on:{touch:function(){ out(F().richardMissing?"Cold pillow, racked tools, an open robot case. Every surface confirms the same absence.":"Tools, bedding, and half-finished machines: the ordinary textures of Richard being home."); return endTurn(); },
      open:function(){ out(F().richardMissing?"The robot case is already open. Its unfinished mechanism offers no hidden message.":"Richard's cases are open because Richard has never understood storage as a lasting state."); return endTurn(); },
      search:function(){ out(F().richardMissing?"She checks the bench, bed, and pillow. Nothing is concealed; the missing boots and ordered tools are the message.":"No mystery here beyond Richard's filing system, which is mystery enough."); return endTurn(); }}};

CHARS.benjy={name:"Benjy",alias:["benjy","benjamin","son"],loc:"limbo",pron:"his",
  desc:"Benjy, fourteen: broad, gentle, deliberate. The colony's forms have a box for him and the box is wrong. He knows every planting in New Eden by leaf, remembers every kindness ever done him with compound interest, and has never once in his life been in a hurry, which in this year, in this place, makes him the sanest person Nicole knows.",
  here:"Benjy is at the table with his seed cards.",
  talk:"\"Ma-man.\" Benjy gives the word its full two bells, the way he gives everything its full weight. He shows her today's arrangement of the seed cards. It is, as always, beautiful, and organized by a principle she will spend the evening happily failing to deduce.",
  suggest:["the garden","his cards"],
  ask:{
    "cards|seeds|seed":"He walks her through them: this one is beans, this one is the tall flower, this one is Papa. The card for Papa is a sunflower. \"Tall,\" Benjy explains, patiently, to his slow mother.",
    "garden|memory garden":[{if:()=>S.habitat.garden==="yes",text:"\"I water it,\" Benjy says, with the gravity of office. He is, in fact, the Memory Garden's most faithful warden; the colony's dead have no better neighbor. \"The names like the water,\" he adds, and Nicole decides, on reflection, that no theologian she has met could improve the sentence."},
      {if:()=>true,text:"\"We could grow one,\" Benjy says — he means a garden, he always means a garden. \"Behind the house. Small is a size.\""}],
    "katie|sister":"His face works. \"Katie is loud lights now,\" he says finally. \"Katie was my reader.\" He aligns a card with great care. \"She will come back. She is only lost. I get lost. You always come.\"",
    "papa|richard|father":[{if:()=>F().richardMissing,text:"\"Papa is being quiet somewhere,\" Benjy says, untroubled, certain. \"Quiet is not gone.\" Nicole holds that sentence for days, the way you hold a coal in winter."},{if:()=>true,text:"\"Papa makes things wake up,\" Benjy says approvingly."}]
  },
  tell:{}, show:{},
  kiss:function(){ out("She kisses the top of his head. Benjy pats her arm twice — his seal of state — and returns to the republic of the cards."); relUp("community",0); return endTurn(); }
};
WORLD.eden_plaza={
  name:"New Eden — Central Plaza",
  desc:function(){ return "The plaza where four villages meet: the well-house, the market awnings, the assembly hall's white portico to the north, and the avenue of engineered plane trees Richard once reprogrammed to drop their leaves on the first of October, for the children. Posters for the election are pasted three deep — NAKAMURA: STRENGTH & PLENTY over everything older."+(F().waterDone?"":" A queue snakes from the well-house: the pressure has been dropping for a week, and a queue is a colony's mood made visible."); },
  brief:"The central plaza.",
  scenery:["posters","wellhouse","crowd","plaza_details","waterworks"],
  sound:function(){ return F().arrestSoon?"The crowd noise has changed key this week. She has heard the sound before, in history books read aloud by her father: the sound a town makes when it has already decided something and is waiting to be told what.":"Market voices, pump clatter, a busker with a violin the Tailor's Room made two decades and eight light-years ago."; },
  exits:{ south:"eden_home", north:"eden_hall", east:"eden_clinic", west:"eden_gate", northeast:"vegas" }
};
SCENERY.posters={name:"election posters",alias:["posters","poster","election","plaza board","election board","election notice","notice"],desc:"NAKAMURA: STRENGTH & PLENTY, in confident sans-serif, over a photograph of a man who has practiced looking like a harbor. Beneath, half-covered, older paper: the colony charter's first line, which Nicole helped write. She can recite what the poster is standing on.",
  takeFail:"Tearing down one poster would leave three more and turn paper into martyrdom. Nicole leaves the argument where the town can see it.",
  on:{read:"NAKAMURA: STRENGTH & PLENTY. Beneath it, half-covered: NEW EDEN IS FOUNDED ON THE PROPOSITIONS THAT KNOWLEDGE IS A COMMONS... The newer paper has not quite managed to erase the older sentence."}};
SCENERY.wellhouse={name:"well-house",alias:["well","pump","queue","water"],desc:function(){ return F().waterDone?"Pressure restored; the queue has dissolved back into a town.":"The gauges read low and falling. Upstream, somewhere, New Eden's water is going somewhere newer and louder. Patrick has theories with schematics attached."; },
  on:{use:function(){ out(F().waterDone?"The pump answers at once; pressure has returned to ordinary usefulness.":"The pump labors and the queue waits. Patrick's schematic, not the handle, identifies the stolen pressure."); return endTurn(); },
      turn:function(){ out(F().waterDone?"The tap gives a clean, pressurized stream.":"The tap coughs out too little water. Turning it farther cannot repair a diverted ring main."); return endTurn(); }}};
SCENERY.crowd={name:"crowd",alias:["people","colonists","settlers"],desc:function(){ const c=S.rel.community; return c>=4?"Faces that still greet her: patients, neighbors, the parents of children she delivered. Whatever the posters say, the plaza still says *Doctor*.":c>=2?"Nods, mostly. A few gazes that slide away — Vegas money has been buying opinions in bulk.":"More faces turn away than toward, now. Nakamura's paper has been calling the old councilors 'the first-family aristocracy' for a month, and paper, repeated, becomes pavement."; }};
SCENERY.plaza_details={name:"central plaza",alias:["plaza","market","market awnings","awnings","portico","white portico","plane trees","engineered plane trees","leaves"],desc:"Four villages meet under market awnings and engineered trees. The hall's white portico watches from the north; commerce, argument, and neighborliness share the paving without agreeing on it.",
  on:{touch:"Canvas awnings, leaf bark, worn paving: New Eden is artificial construction made human by five years of hands and weather.",take:"The market awnings shelter working stalls and neighbors. Nicole leaves the canvas rigged above the commerce it serves."}};
SCENERY.plaza_hall_view={name:"assembly hall",alias:["assembly hall","hall","white hall","hall to the north"],desc:"North beyond the market, the assembly hall's white portico frames the room where New Eden conducts its arguments in public. NORTH will take Nicole there."};
WORLD.eden_plaza.scenery.push("plaza_hall_view");
SCENERY.waterworks={name:"water system",alias:["gauges","pressure gauges","pressure","schematic","schematics","ring main","tap","meters","meter"],desc:function(){ return F().waterDone?"Patrick's schematic now agrees with the gauges: the ring main is holding pressure, and the illicit tap no longer owns the town's water.":"The gauges fall while Patrick's schematic traces the loss to an unauthorized tap feeding Vegas through conveniently dark meters."; },
  on:{read:function(){ out(F().waterDone?"PRESSURE NOMINAL. RING MAIN HOLDING. Patrick's annotations close the illicit branch to Vegas.":"PRESSURE FALLING. Patrick's marked schematic follows the loss around the ring main to a dark meter and an unauthorized Vegas tap."); return endTurn(); },
      turn:function(){ out(F().waterDone?"The nearest tap runs normally.":"A local valve cannot restore pressure being taken upstream. Patrick's schematic identifies the choice that matters."); return endTurn(); },
      use:function(){ out(F().waterDone?"The gauges and schematic agree: the repaired system is carrying the town again.":"The system is not operated from the plaza. The falling gauges make the problem visible; Patrick knows the available remedies."); return endTurn(); },
      touch:"Paper schematic, scratched gauge glass, and a pipe vibrating with too little pressure: human infrastructure under a human argument.",
      take:"Patrick needs the schematic at the well-house. Nicole leaves the evidence in the hands doing the repair."}};
const _edenPlazaOnCmd=WORLD.eden_plaza.onCmd;
WORLD.eden_plaza.onCmd=function(verb,obj,obj2,prep){
  if(verb==="talk"&&obj&&obj.kind==="scenery"&&obj.id==="crowd"){
    out(S.rel.community>=4?"A dozen conversations answer at once — patients, neighbors, parents — and the common word among them is still *Doctor*.":"The crowd answers in fragments: water, the ward, the election, fear wearing the practical clothes of complaint.");
    endTurn(); return true;
  }
  return _edenPlazaOnCmd?_edenPlazaOnCmd(verb,obj,obj2,prep):false;
};

CHARS.patrick={name:"Patrick",alias:["patrick","son2"],loc:"limbo",pron:"his",
  desc:"Patrick, twenty: his father's hands, his mother's stubbornness, chief of the water and power co-op because nobody else could read the Node-built manuals and he could not stop. He carries a schematic the way Michael carried a rosary.",
  here:"Patrick is at the well-house gauges, not liking them.",
  talk:"\"Maman. Tell me you're here about the water, because I'm about to be unprofessional about the water.\"",
  suggest:["the water","his father"],
  ask:{
    "water|pumps|pressure|wellhouse":[
      {if:()=>F().waterDone,text:"\"Holding steady,\" Patrick reports, patting the well-house like a flank. \"For now. Everything here is 'for now' lately.\""},
      {if:()=>true,text:"He unrolls the schematic on the well-house step. \"It's not a fault. Faults are honest. Someone's tapped the ring main upstream — here — feeding the new bathhouses in Vegas. Nakamura's contractors, Nakamura's meters conveniently dark. I can reroute around the tap in a day — but the moment I cut his water, it's political, and I'm twenty, maman. I need either the council's paper or...\" he looks at her \"...or someone Vegas doesn't dare bill.\" (Options assemble themselves: TELL PATRICK ABOUT THE REROUTE — give him the authority and take the heat; or go northeast and put it to NAKAMURA directly.)", fx:function(){ K().k_water=true; }}
    ],
    "father|richard|papa":[
      {if:()=>F().richardMissing,text:"Patrick's jaw works. \"He left me the workshop keys and a checklist. A *checklist*, maman. Item nine is 'mind the pressure gauges.' Item twelve is 'mind your mother.'\" He looks north, at nothing. \"He's not dead. Dead men don't leave checklists.\""},
      {if:()=>true,text:"\"Papa's been quiet lately. Workshop-quiet, not sulking-quiet. He's building something and pretending he isn't, which means it's either wonderful or worrying.\""}
    ],
    "nakamura|election|vote":"\"He's good, maman — that's what nobody wants to hear at our dinner table. He fixes small things fast and loudly, and lets the big things rot quietly on our watch. People are tired. Tired votes for loud.\"",
    "ellie":"\"At the clinic every waking hour. She's you, maman, twenty-five years ago, and I mean that as a warning as much as a compliment.\""
  },
  tell:{
    "water|reroute|pumps":[
      {if:()=>K().k_water&&!F().waterDone,text:"\"Do it,\" Nicole says. \"On my authority as councilor and chief physician — water is a health system, and I'll sign that in front of the assembly with a steady hand.\" Patrick is already rolling the schematic. By nightfall the ring main sings again and the Vegas bathhouses run cold, and by morning there is a new poster in the plaza with her name on it and the word ARISTOCRAT underneath. The queue at the well-house, dissolving, tells her the exchange rate was acceptable.", fx:function(){ F().waterDone=true; F().waterPath="reroute"; relUp("community",1); relUp("francesca",0); S.rel.nakamura=(S.rel.nakamura||0)-2; checkVoteReady(); }},
      {if:()=>F().waterDone,text:"\"Flowing,\" Patrick says. \"Loudly, in certain bathhouses' absence.\""}
    ]
  },
  show:{}, kiss:function(){ out("She kisses her son's cheek. \"Maman,\" he protests, exactly as his father protests nothing."); return endTurn(); }
};

WORLD.eden_clinic={
  name:"New Eden — The Clinic",
  desc:function(){ return "Her clinic: twelve beds, a compounding bench, and the dispensary unit — a Node-built pillar, cousin to the Tailor's Room, that has quietly manufactured half the colony's pharmacopoeia for five years. "+(F().serumDone?"The RV-41 ward is a ward again, not a vigil: patients sleeping ordinary sleep.":"Eight of the twelve beds hold RV-41 patients in the flat, careful quiet of the seriously ill. Charts hang like verdicts.")+(CHARS.ellie.loc==="eden_clinic"?" Ellie moves bed to bed with her mother's exact economy.":""); },
  brief:"The clinic and the RV-41 ward.",
  scenery:["dispensary","charts","patients","clinic_room","compounding_bench","clinic_supplies"],
  exits:{ west:"eden_plaza" },
  onEnter:function(){
    if(S.act===3&&!F().clinicIntro){
      F().clinicIntro=true; S.phase="act3_serum";
      doLookInline();
      out("Ellie meets her with the numbers, low-voiced: \"Forty-one confirmed now, maman. It's the retrovirus — RV-41, the one that came up the well from Earth in the second cohort's blood. Progressive, slow, and our stocks only manage symptoms.\" She glances at the Node pillar. \"The dispensary could *synthesize* against it — I've watched it build proteins to spec — but its deep functions won't wake for me. It just sits there running its three-color prompt, over and over, like it's waiting for a password.\"");
      outSys("The dispensary pulses its idle phrase: red, blue, green. Nicole has spoken this language before. (PUSH RED, then BLUE, then GREEN.)");
      endTurn(true);
      return true;
    }
    return false;
  },
  onCmd:function(verb){
    const obj=arguments[1];
    if(verb==="talk"&&obj&&obj.kind==="scenery"&&obj.id==="patients"){
      out(F().serumDone?"A waking patient asks when she can go home. An ordinary complaint; Nicole could kiss her for it.":"Answers come softly from the occupied beds: thirst, pain, worry for children outside the ward. Nicole listens, because listening is treatment too.");
      endTurn(); return true;
    }
    if(S.phase==="act3_alloc"){
      if(verb==="sickest"){ return allocSerum("sickest"); }
      if(verb==="children"){ return allocSerum("children"); }
      if(verb==="lottery"){ return allocSerum("lottery"); }
    }
    return false;
  }
};
SCENERY.charts={name:"charts",alias:["chart","case chart","case charts","medical chart","medical charts","records2","names","patient records"],desc:"Forty-one names. She knows every one — delivered three of them, taught two to splint, danced at one's wedding under the recorded birdsong. Epidemiology, in a town this size, is just friendship with arithmetic.",takeFail:"The charts stay with the ward. Confidentiality survived interstellar travel.",
  on:{read:function(){ out(F().serumDone?"Temperatures falling, blood counts recovering, forty-one trajectories bending back toward ordinary life.":"Forty-one confirmed RV-41 cases: progressive wasting, declining counts, supportive care buying time that the dispensary must turn into treatment."); return endTurn(); }}};
SCENERY.patients={name:"patients",alias:["patient","ward","rv-41","rv 41","rv-41 ward","rv 41 ward","sick","symptom","symptoms","beds","rv-41 cases","cases"],desc:function(){ return F().serumDone?"Color returning to faces; the particular bad quiet gone from the ward. Medicine's best sound is ordinary snoring.":"The RV-41 cases: wasting, weakening, patient beyond what she has any right to ask. They watch her the way sailors watch a barometer."; },
  on:{touch:function(){ out(F().serumDone?"Warm skin, steady pulses, fevers breaking. Nicole's hands confirm what the charts promised.":"She checks brow, pulse, capillary return — small clinical contacts that tell frightened people they have not become numbers."); return endTurn(); },
      scan:function(){ out(F().serumDone?"The scanner confirms recovery in uneven but unmistakable increments. The ward is turning a corner.":"The scanner finds the RV-41 signature in every occupied bed: systemic, progressive, and beyond supportive care alone."); return endTurn(); },
      treat:function(){ out(F().serumDone?"Supportive care continues while the serum does the deeper work. There is nothing dramatic to add, which is excellent medicine.":"She adjusts fluids, eases symptoms, checks every airway. It buys time; the dispensary must supply the cure."); return endTurn(); },
      take:"The beds are occupied clinical furniture, and the patients are people under Nicole's care. Neither belongs in inventory."}};
SCENERY.dispensary={name:"dispensary unit",alias:["dispensary","pillar","node pillar","node-built pillar","node built pillar","machine3","pharmacopoeia","proteins","deep functions","three-color prompt","three color prompt","password"],
  desc:function(){ return "Node fabrication: a waist-high pillar with a color panel, sibling to the Tailor's Room across eight light-years. "+(F().serumMade?"Its internal chambers are synthesizing the serum, the three-color greeting replaced by steady production light.":"Its greeting pulses patiently — red, blue, green — "+(K().k_colorGrammar?"and she can read it now, plain as type: *begin*.":"a phrase she has seen before, painted on a gallery wall, banded in a pit tunnel.")); },
  on:{use:function(){ if(!F().serumMade){ outSys("It wants its greeting first: PUSH RED, then BLUE, then GREEN."); return; } outSys("The dispensary is in production; the ward is in hand."); return; },
      push:function(){ outSys("Push a square: RED, BLUE, or GREEN."); return; },open:"The dispensary has no user-serviceable door. Its interface is the color panel, and its answer is production."}};
SCENERY.clinic_room={name:"clinic",alias:["clinic","ward room","room"],desc:function(){ return F().serumDone?"Twelve beds, a compounding bench, and the deep ordinary quiet of a ward recovering.":"A small colony clinic carrying a large outbreak: twelve beds, too many patients, and one machine capable of changing the arithmetic."; }};
SCENERY.compounding_bench={name:"compounding bench",alias:["bench","compounding","work surface"],desc:"Human-scale pharmacy equipment, clean and ready. It can dilute and dispense what the Node pillar makes, but it cannot invent the serum.",
  on:{touch:"Clean steel, calibrated glassware, and familiar controls: the human half of the clinic's pharmacy.",search:"Diluent, sterile lines, labels, and measuring tools are ready for the serum the pillar must make.",use:"The bench can prepare and dispense a known medicine. It cannot invent the missing serum."}};
SCENERY.clinic_supplies={name:"serum supplies",alias:["color panel","panel","prompt","drawer","receiving drawer","tray","receiving tray","serum","doses","dose","waiting list","waiting-list","list","stock","stocks","ward stock","manual","manuals","dispensary manual","dispensary manuals"],desc:function(){ return F().serumMade?"Fresh serum waits in labeled doses beside the allocation list. The machine made the medicine; the human decision remains.":"The color panel pulses red, blue, green above closed drawers and an empty receiving tray. There is no hidden stock; the dispensary must synthesize it."; },
  takeFail:"The serum is ward stock, already measured into patient doses. Nicole allocates it; she does not pocket it.",
  on:{read:function(){ out(F().serumMade?"The allocation list gives forty-one patients, severity, age, and dose. The manuals describe handling and dilution; they cannot choose who receives the first run.":"The manuals identify the receiving tray and color interface. The waiting list still has forty-one names and no serum beside them."); return endTurn(); },
      open:function(){ out(F().serumMade?"The drawer is open on labeled doses and the allocation list. Nothing is concealed; the hard part is deciding.":"The receiving drawer opens on an empty tray. The color prompt must wake the pillar's deep functions first."); return endTurn(); },
      search:function(){ out(F().serumMade?"Labeled doses, sterile delivery supplies, and the complete waiting list. The inventory is exact and insufficient all at once.":"Drawers, empty tray, manuals, no hidden stock. Synthesis is the only route to enough serum."); return endTurn(); },
      touch:function(){ out(F().serumMade?"Human labels and cool dose vials sit against the Node unit's warm panel: two medical traditions sharing one bench.":"The panel is warm; the receiving tray is cool and empty. No dose vial exists yet to touch."); return endTurn(); },
      take:function(){ out(F().serumMade?"The serum is ward stock, already measured into patient doses. Nicole allocates it; she does not pocket it.":"There is no serum or hidden stock to take. The empty tray waits for synthesis."); return endTurn(); },
      use:function(){ out(F().serumDone?"The first serum run has already been allocated and administered. Supportive care continues while it works.":F().serumMade?"The doses are ready; using them means making the allocation decision the waiting list requires.":"There is no serum to use yet. The dispensary's red-blue-green prompt must wake synthesis first."); return endTurn(); }}};
function allocSerum(mode){
  S.eden.serum=mode; F().serumDone=true; S.phase="act3_open";
  if(mode==="sickest") out("\"Sickest first,\" Nicole rules — triage as old as medicine. \"We stand where the dying are.\" The ward's worst cases turn the corner within days; two were, by any honest chart, days from gone. The colony's harder heads mutter about spending serum on the spent; the colony's mothers do not mutter, and mothers, Nicole has found, are the load-bearing opinion.");
  else if(mode==="children") out("\"Youngest first.\" She signs it and makes herself watch the whole list as she does — the older names sliding down the queue, some of whom will not reach its end. The town understands in its bones; the town also hears, from a Vegas radio show that evening, that Councilor Wakefield has 'decided whose lives weigh more.' Both things are true. She sleeps anyway. Barely.");
  else out("\"Lottery. Blind draw, public, my hand in the bowl on the plaza steps.\" It is the only allocation nobody can call corrupt and everybody can call heartless, and she takes that trade with open eyes. The draw is held at noon; the town watches its own fairness like a hawk; and fairness, it turns out, is a kind of medicine too.");
  relUp("community",mode==="lottery"?2:1); relUp("ellie",1);
  outSys("The serum program is running. (RV-41 will take years to beat — but the dying has stopped.)");
  checkVoteReady();
  endTurn();
  return true;
}

CHARS.ellie={name:"Ellie",alias:["ellie","eleanor","daughter2"],loc:"limbo",pron:"her",
  desc:"Ellie, twenty-two: her mother's profession arriving in a second generation like an echo that got louder. She trained on Nicole's cases, Benjy's patience, and the dispensary's manuals, and she runs the ward with a kindness that has a spine in it.",
  here:"Ellie is here, chart in hand.",
  talk:function(){ return F().serumDone?"\"Ward's holding, maman. Go be a councilor; I'll be the doctor till supper.\" The handoff, casual as bread, is the proudest sentence of Nicole's year.":"\"Numbers first,\" Ellie says, because that is what her mother taught her to say instead of *I'm frightened*."; },
  suggest:["the ward","RV-41"],
  ask:{
    "ward|patients|rv|rv-41|virus|sick":[
      {if:()=>!F().serumDone,text:"\"Supportive care is a rearguard action, maman. We need the dispensary's deep functions — and it needs whatever password Rama's been painting on walls since before I was born.\""},
      {if:()=>true,text:"\"Responding — all of them, at different speeds. I've started the registry for long-term sequelae. Twenty years of follow-up, minimum.\" She says *twenty years* the way other people say *next Tuesday*, and Nicole hears her own voice in it, and is glad."}
    ],
    "katie|sister":"Ellie's mouth thins. \"I go up there once a month with a med kit and my temper on a leash. She lets me check her over. She doesn't let me *see* her. There's a difference and it's the size of Vegas.\"",
    "nakamura":"\"He sent the clinic a donation last quarter. I banked it and published the receipt. Papa said that was the most political thing anyone in this family has ever done.\""
  },
  tell:{}, show:{}, kiss:function(){ out("She kisses her daughter's forehead — colleague to colleague, which between these two is the tenderest available rank."); relUp("ellie",1); return endTurn(); }
};
WORLD.eden_clinic.scenery.push("redsq","bluesq","greensq");
WORLD.vegas={
  name:"New Eden — Vegas",
  desc:"The district's real name is San Miguel, and nobody has used it in three years. Nakamura's quarter: bathhouses steaming against the habitat's fixed dusk, gaming floors running on scrip he prints, music engineered to sound like appetite. It is warm, bright, generous, and owned — every lumen of it — and the ownership is the product.",
  brief:"Vegas: Nakamura's bright quarter.",
  scenery:["tables","bathhouses","vegas_district","vegas_ambience","nakamura_chip"],
  sound:"Music, dice, laughter with a transactional finish. Underneath, if she listens like a doctor: the same anxious pulse as the plaza queue, spending itself instead of standing in line.",
  exits:{ southwest:"eden_plaza" }
};
SCENERY.tables={name:"gaming tables",alias:["table","tables","gaming","games","dice","scrip"],desc:"Colonists betting Nakamura's scrip at Nakamura's tables under Nakamura's lights. The house edge is the honest part.",takeFail:"The scrip belongs to the game, the tables to Nakamura, and Nicole to neither economy.",
  on:{touch:"Worn felt, warm dice, and locally printed scrip: every surface is human, handled, and priced.",read:"The scrip carries Nakamura's district mark and a value honored only inside the economy that issued it.",search:"Dice, chips, and scrip remain under dealers' hands. The hidden mechanism is the house edge, and it is not very hidden."}};
SCENERY.bathhouses={name:"bathhouses",alias:["bathhouse","baths","steam"],desc:function(){ return F().waterDone&&F().waterPath==="reroute"?"Steamless today, and loudly aggrieved about it. The colony's water pressure is somebody's grievance now, which tells you everything about the year.":"Steam rising on metered water while the plaza queues. Infrastructure as theater; theater as power."; }};
SCENERY.vegas_district={name:"Vegas",alias:["vegas","san miguel","district","quarter","nakamura's quarter"],desc:"San Miguel beneath the nickname: a bright human district engineered to make appetite feel like citizenship, every generous surface carrying an owner's mark."};
SCENERY.vegas_ambience={name:"gaming floor",alias:["gaming floor","gaming floors","floor","lights","lumens","music"],desc:"Music, warm light, and gaming noise turn the district's fixed dusk into perpetual evening. The brightness is calculated; so is the welcome.",
  on:{touch:"Warm fixtures and scuffed flooring: expensive human comfort engineered for turnover, not eternity.",listen:"Music and laughter resolve, underneath, into transactions."}};
SCENERY.nakamura_chip={name:"gaming chip",alias:["chip","token"],desc:"One of Nakamura's chips, turned idly through practiced fingers: a tiny negotiable promise backed by the man holding it.",takeFail:"It is in Nakamura's hand, and the point he is making depends on it staying there."};

CHARS.nakamura={name:"Toshio Nakamura",alias:["nakamura","toshio","boss"],loc:"limbo",pron:"his",
  desc:function(){ return S.loc==="eden_hall"&&S.phase==="act3_vote"?"Toshio Nakamura waits across the horseshoe: trim, tailored, and composed after a speech in which every pipe became proof and every price became reassurance. He looks less like a candidate than the declared result.":"Toshio Nakamura: trim, sixty, tailored even here, with the stillness of a man who has already read your file. He arrived with the second cohort, three shell companies, and a theory of people, and the theory has been paying out ever since."; },
  here:function(){ return S.loc==="eden_hall"&&S.phase==="act3_vote"?"Nakamura waits across the horseshoe, composed and legible.":"Nakamura observes his floor from a quiet table, being visibly unhurried."; },
  talk:function(){ return S.loc==="eden_hall"&&S.phase==="act3_vote"?"\"Councilor,\" Nakamura says across the horseshoe, pitching the courtesy for the hall to hear. \"The voters have heard my account. I look forward to yours.\"":"\"Councilor.\" Nakamura rises exactly enough. \"Or is it Doctor tonight? You wear the offices interchangeably. It's admired, you know. Admiration is my business — I keep close accounts of it.\""; },
  suggest:["the water","the election","Katie"],
  ask:{
    "water|bathhouses":[
      {if:()=>F().waterDone,text:"\"The pressure question.\" A dry smile. \"Resolved, I'm told, with characteristic directness. Do notice, Councilor, which of us the town saw fixing it — and which of us it saw enduring it gracefully.\""},
      {if:()=>K().k_water,text:"\"Metering disputes.\" He turns a chip over once. \"Bring it to the assembly, by all means. Or settle it here, between the two adults in the colony. I respond well to directness. It's cheaper than paper.\""},
      {if:()=>true,text:"\"Water finds its level, Councilor. So does everything else in a closed system. I merely arrived already knowing that.\""}
    ],
    "election|vote|nakamura":"\"I will win,\" he says, without heat, as one reports weather. \"Not because I am loved — spare us both — but because I am *legible*. Your generation offered them wonder and asked for patience. I offer them plumbing and ask for nothing they'll miss until later. Later is my collateral.\"",
    "katie":[
      {if:()=>S.rel.katie>=4,text:"Something flickers — the file being consulted. \"Katherine is the most talented person on my floor and the angriest. I employ both. You'll want me to say I'm harming her.\" He turns the chip. \"I'm the only thing here she hasn't had to be a Wakefield for. Solve that, Doctor, and she's yours again.\""},
      {if:()=>true,text:"\"An excellent employee,\" he says, with a courtesy engineered to draw blood."}
    ],
    "himself|past|earth":"\"On Earth I rebuilt three bankrupt arcologies and was thanked by none of them. I have stopped requiring thanks. It is the single most liberating renunciation available to a public man.\""
  },
  tell:{
    "water|reroute":[
      {if:()=>K().k_water&&!F().waterDone,text:"Nicole lays it out — the tap, the meters, the queue — in clinic-plain declaratives, and ends with the only sentence that matters: \"The pressure comes back by Friday, or I table the schematics at assembly with your contractors' names read aloud.\" Nakamura studies her the way he studies odds. \"Friday,\" he agrees pleasantly. \"You know, Councilor, I keep offering you a partnership and you keep bringing me subpoenas. One of us is misreading the future.\" The water returns Thursday, without apology, with interest accruing somewhere invisible.", fx:function(){ F().waterDone=true; F().waterPath="confront"; relUp("community",2); S.rel.nakamura=(S.rel.nakamura||0)-3; checkVoteReady(); }},
      {if:()=>F().waterDone,text:"\"Old water,\" Nakamura says, \"under old bridges.\""}
    ]
  },
  show:{}
};

WORLD.eden_hall={
  name:"New Eden — Assembly Hall",
  desc:function(){ return "The hall Nicole helped charter: benches in a horseshoe, the colony's founding text "+(S.habitat.charter==="open"?"displayed under glass beside the public ledgers, open as promised":"displayed under glass, the sealed archives' door discreet behind it")+", and the speaker's floor worn pale by five years of argument conducted, mostly, like neighbors."+(S.phase==="act3_trial"?" Tonight it is a courtroom, and the horseshoe is a jaw.":""); },
  brief:"The assembly hall.",
  scenery:["charter_glass","hall_room","hall_furnishings","hall_ledgers","hall_archives","hall_people","trial_record"],
  exits:{ south:{to:"eden_plaza", blocked:function(){ if(S.phase==="act3_trial"&&F().trialScene&&!F().trialDone) return "The bailiffs at the door — she vaccinated both of them, twice — are apologetic and immovable. The statement comes first."; return null; }} },
  onEnter:function(){
    if(S.phase==="act3_vote"&&!F().voteDone) CHARS.nakamura.loc="eden_hall";
    if(S.phase==="act3_vote"&&!F().voteScene){
      F().voteScene=true;
      doLookInline();
      out("Election eve. The hall is packed to the rafters and out the doors — the queue's faces, the ward's families, the Vegas floor given a night off to attend in bloc. Nakamura speaks first and speaks well: plumbing, plenty, and a future with the wonder priced out of it. Then the moderator turns: \"Councilor Wakefield. The floor recognizes the colony's founding physician.\" Two thousand faces. Her whole adult life has been one long house call on this town, and the town is deciding what that was worth.");
      outSys("Speak HONESTLY (name what Nakamura is, and what it costs), give a CURATED appeal (unity, continuity, the charter), or REFUSE the floor (let the record speak).");
      endTurn(true);
      return true;
    }
    return false;
  },
  onCmd:function(verb){
    const obj=arguments[1];
    if(verb==="talk"&&obj&&obj.kind==="scenery"&&obj.id==="hall_people"){
      out(S.phase==="act3_trial"?"The bailiffs will not discuss the case. The clerk studies the record; the gallery answers only in breath and shifting feet.":"The audience answers in the overlapping civic dialect of neighbors who have decided tonight must settle everything.");
      endTurn(); return true;
    }
    if(S.phase==="act3_vote"&&F().voteScene&&!F().voteDone&&(verb==="honestly"||verb==="curated"||verb==="refuse")){
      F().voteDone=true; F().voteStand=verb; F().voteTurn=S.turn;
      CHARS.nakamura.loc="vegas";
      if(verb==="honestly") out("She names it. The scrip and the meters, the bought paper and the borrowed anger, the arithmetic of a man who lends a town its own water. She is precise, documented, and unforgivable, and the hall is silent in two different ways at once — half of it hearing a warning, half a eulogy. Nakamura, across the floor, inclines his head a centimeter: *noted, filed, and payable*.");
      else if(verb==="curated") out("She gives them the town instead of the man: the ward's recoveries read aloud, the charter's first line, the memory of building this hall with forty volunteers and one argument about roof pitch that lasted nine days. Kind, true, and aimed past the election at whatever survives it. The applause is warm. Warm, she notes clinically, is not the same as *numerous*.");
      else out("\"The record speaks,\" Nicole says, and sits down. Three seconds of astonished quiet — then the hall erupts into everyone else's opinion of her silence, which was perhaps the point. Benjy, in the back row, claps alone and unbothered, for her, specifically, at length.");
      out("The count comes at midnight: Nakamura, fifty-eight percent. The charter changes hands. The lights in Vegas burn till dawn, and the plaza's recorded birds sing the first of their songs into a different town.");
      relUp("community",verb==="honestly"?1:0);
      outSys("Nakamura governs New Eden now. (The clinic is still the clinic. The family is still the family. For a while.)");
      endTurn();
      return true;
    }
    if(S.phase==="act3_trial"&&F().trialScene&&!F().trialDone&&(verb==="honestly"||verb==="curated"||verb==="refuse")){
      return trialStatement(verb);
    }
    return false;
  }
};
WORLD.eden_hall.onGo=function(dir){
  if(dir==="south"&&CHARS.nakamura.loc==="eden_hall") CHARS.nakamura.loc="vegas";
  return false;
};
SCENERY.charter_glass={name:"founding charter",alias:["charter","glass","founding text"],desc:function(){ return "\"New Eden is founded on the propositions that knowledge is a commons, care is an infrastructure, and no emergency repeals a person.\" She wrote the third clause herself, over Richard's shoulder, at the Node, in another life. Under Nakamura's administration it is still under glass. Glass, she reflects, works from both sides."; },
  on:{read:"NEW EDEN IS FOUNDED ON THE PROPOSITIONS THAT KNOWLEDGE IS A COMMONS, CARE IS AN INFRASTRUCTURE, AND NO EMERGENCY REPEALS A PERSON.",open:"The charter's case is sealed against handling. The words remain visible, which was the more important promise.",touch:"Ordinary glass, cleaned by human hands and protecting words humans are still learning how to keep."}};
SCENERY.hall_room={name:"assembly hall",alias:["hall","assembly","courtroom"],desc:function(){ return S.phase==="act3_trial"?"Her assembly hall converted to a courtroom by arrangement and armed insistence; the architecture has not consented.":"A civic room built for argument among neighbors: public, worn, and larger tonight than anyone inside it feels."; }};
SCENERY.hall_furnishings={name:"horseshoe benches",alias:["benches","bench","horseshoe","speaker's floor","speaker s floor","speakers floor","floor","rafters","doors"],desc:function(){ return S.phase==="act3_trial"?"The horseshoe has become a jaw: bench above, bailiffs at the doors, gallery packed under the rafters.":"Benches curve around the speaker's worn floor, a practical geometry meant to make citizens face one another."; },
  on:{touch:"Worn human wood and a speaker's floor polished by five years of anxious shoes.",sit:"Nicole takes the bench for one measured breath without mistaking rest for surrender.",take:"The horseshoe benches are civic furniture bolted to the hall, not spoils from its latest proceeding."}};
SCENERY.hall_ledgers={name:"public ledgers",alias:["ledgers","ledger","books","public records"],desc:"The colony's accounts and deliberations, maintained as the founding design required.",on:{read:function(){ out(S.habitat.charter==="open"?"Water, stores, contracts, votes: the town's workings laid open in columns anyone may inspect.":"The index is public; access to the underlying records now requires a petition and patience."); return endTurn(); }}};
SCENERY.hall_archives={name:"archives",alias:["archives","sealed archives","archive","archive door"],desc:function(){ return S.habitat.charter==="open"?"The archive doors stand broad and ordinary, because public access was built into the walls.":"A modest sealed door behind the charter: privacy made architectural, with all the protection and danger that implies."; },
  on:{read:function(){ out(S.habitat.charter==="open"?"The public catalogue lists the colony's founding records, votes, contracts, and minutes for inspection.":"The public index remains readable. The records behind it require the sealed procedure New Eden chose at founding."); return endTurn(); },
      open:function(){ out(S.habitat.charter==="open"?"The public archive is already available through its ordinary doors.":"The archive remains sealed under the privacy rules Nicole helped choose. A political emergency does not erase them."); return endTurn(); },
      touch:"A human door, a human seal, and consequences no material analysis can settle."}};
SCENERY.hall_people={name:"hall assembly",alias:["audience","faces","moderator","clerk","bailiffs","uniforms","gallery","accused"],desc:function(){ return S.phase==="act3_trial"?"Bailiffs at the door, a clerk reading charges into the record, a gallery trying not to meet Nicole's eyes, and Nakamura's authority occupying the bench.":"The moderator holds the floor between two thousand citizens; Nakamura waits across the horseshoe, composed and legible."; }};
SCENERY.trial_record={name:"trial record",alias:["record","court record","warrant","letterhead","charges","clipboard","statement","verdict"],desc:function(){ return S.phase==="act3_trial"?"New letterhead, an official warrant, and charges arranged to make the verdict look inevitable: sedition, sabotage, conspiracy.":"The election record is public, contested, and still being written by everyone in the room."; },on:{read:function(){ out(S.phase==="act3_trial"?"SEDITION. SABOTAGE OF COLONIAL INFRASTRUCTURE. CONSPIRACY WITH THE FUGITIVE WAKEFIELD. The legal language is upholstery; the political frame shows through.":"The record contains speeches, tallies, objections, and the stubborn fact that the town heard all of them."); return endTurn(); }}};
SCENERY.trial_gavel={name:"gavel",alias:["gavel"],desc:function(){ return S.phase==="act3_trial"?"Node fabrication pressed into service as a human symbol of judgment. Its beautiful sound does not improve the verdict.":"A ceremonial tool waiting for a proceeding that mistakes sound for authority."; },takeFail:"The court's gavel stays on the bench. Nicole has more exact instruments for dissection."};
SCENERY.trial_gavel.on={touch:"Warm from the hand using it, smooth as every symbol that prefers ceremony to consequence.",push:"Nicole does not borrow the court's punctuation."};
WORLD.eden_hall.scenery.push("trial_gavel");

WORLD.eden_gate={
  name:"New Eden — The Gate",
  desc:function(){ return S.phase==="act3_escape"?"The gatehouse holding room: a bench, a barred window onto the airlock plaza, and a door whose lock is currently the most interesting object in her universe.":"The colony's one door: a Node-built airlock in the habitat's skin, flanked by the gatehouse. Beyond it, everyone knows and no one says, is Rama — the dark original country, sixteen kilometers of it, off-limits by three successive administrations' decree."; },
  brief:"The gate in the habitat's skin.",
  scenery:["airlock","gatehouse","holding_room","cell_door","rescue_bundle"],
  exits:{ east:{to:"eden_plaza", blocked:function(){ if(S.phase==="act3_escape"&&!F().cellOpen) return "The holding-room door is locked, and the lock is Nakamura fabrication: new, smug, and thorough."; if(S.phase==="act3_escape") return "Back into the colony? No. The night has chosen a direction, and it is OUT."; return null; }},
    out:{to:"tunnel", hidden:function(){ return S.phase!=="act3_escape"||!F().cellOpen; }, msg:"Through the airlock's small service door, out of New Eden, into the original dark."} }
};
SCENERY.airlock={name:"airlock",alias:["gate","door2","skin"],desc:"Node engineering: a door that would survive the habitat around it. Decree keeps it shut more firmly than the mechanism does. Decrees, Nicole has noticed, are the first thing this administration fabricates locally.",on:{open:function(){ out(S.phase==="act3_escape"?(F().cellOpen?"The main airlock remains controlled, but its small service door stands open to the dark.":"The airlock is beyond the locked holding-room door. First problems first."):"The gate opens for permits, not arguments. Tonight Nicole has neither."); return endTurn(); }}};
SCENERY.gatehouse={name:"gatehouse",alias:["guardpost","guards","guard","uniforms"],desc:function(){ return S.phase==="act3_escape"?"Two guards on the night shift, both delivered by the prisoner they're guarding — a fact the night shift finds acutely, usefully embarrassing.":"Nakamura's uniforms at the colony's only exit, checking permits that did not exist last year."; },on:{search:function(){ out(S.phase==="act3_escape"?(F().cellOpen?"The rescue was precise: lock keyed, cameras looped, service route clear. Nothing useful was left to chance.":"Bars, bench, lock, window. The useful weakness here is not equipment but the guards' memory of who delivered them."):"Permits, shift lists, and procedures new enough to smell of fresh paper."); return endTurn(); }}};
SCENERY.holding_room={name:"holding room",alias:["holding room","cell","bench","barred window","window","airlock plaza","plaza"],desc:function(){ return F().cellOpen?"The little cell is open now: bench, barred window, and the night beyond no longer theoretical.":"A bench, a barred window onto the airlock plaza, and just enough room for procedure to pretend it is not imprisonment."; },
  on:{open:"The window is barred and does not open; after the rescue, the useful opening is the service door marked OUT.",touch:"Painted human metal, worn bench, cold bars. Imprisonment does not become alien merely because it happens inside Rama.",sit:"She sits long enough to conserve strength and no longer."}};
SCENERY.cell_door={name:"holding-room door",alias:["holding-room door","holding room door","cell door","door","lock","service door","small door","small service door"],desc:function(){ return F().cellOpen?"The lock has been keyed and the service route beyond it stands open. OUT is freedom in its least decorative form.":"New Nakamura fabrication: a smug, thorough lock in a door Nicole has no intention of accepting as permanent."; },on:{open:function(){ out(F().cellOpen?"The way OUT already stands open through the service door.":"The lock does not yield. For now, the only operation available is patience."); return endTurn(); },search:function(){ out(F().cellOpen?"Keyed cleanly, no damage. Whoever opened it intended the escape to look authorized for as long as possible.":"No improvised release, no loose plate. The weakness will have to come from outside the mechanism."); return endTurn(); },touch:function(){ out(F().cellOpen?"Cool lock plate, clean keyway, and an open route beyond it.":"Cool new metal, close tolerances, no loose plate: human manufacture, smug and thorough."); return endTurn(); }}};
SCENERY.rescue_bundle={name:"rescue bundle",alias:["bundle","boots","walking boots","key","coveralls","cameras","camera","feathers","family messages","messages","family message"],desc:function(){ return F().cellOpen?"Boots for the dark, a keyed lock, borrowed coveralls, blinded cameras, and the family messages packed more carefully than any equipment.":"Nothing has been left for her yet. The night is still assembling its answer."; },
  takeFail:"Nicole has already taken the usable lamp, medkit, and scarf. The borrowed clothing and family messages remain part of the escape, not new inventory.",
  on:{open:function(){ out(F().cellOpen?"The bundle is already open. Its useful contents have been distributed; nothing remains hidden.":"No bundle has arrived yet."); return endTurn(); },
      search:function(){ out(F().cellOpen?"Boots, coveralls, a keyed lock, blinded cameras, and no additional equipment beyond what the rescue already placed in her hands.":"There is nothing to search yet. The night has not delivered its answer."); return endTurn(); },
      read:"The only message needs no paper: lost is not gone.",
      touch:"Canvas, boot leather, and the warmth left by family hands moving quickly."}};
WORLD.eden_gate.onCmd=function(verb,obj){
  if(verb==="talk"&&obj&&obj.kind==="scenery"&&obj.id==="gatehouse"){
    out(S.phase==="act3_escape"?(F().cellOpen?"The guards have discovered urgent reasons to study the far end of the plaza.":"One guard clears his throat. \"Doctor, please don't make us discuss how many times you treated our children. The lock doesn't care.\""):"The guards ask for a permit and avoid calling it a new rule.");
    endTurn(); return true;
  }
  return false;
};

function checkVoteReady(){
  if(F().serumDone&&F().waterDone&&!F().voteCalled){
    F().voteCalled=true; S.phase="act3_vote";
    out("That evening the plaza board flickers and posts it in letters a hand high: ELECTION EVE ASSEMBLY — ALL CITIZENS — THE HALL, TONIGHT. The colony has scheduled its argument with itself, and both candidates are expected to stand in the horseshoe and be weighed.");
    outSys("Election eve. The Assembly Hall stands north of the plaza — when she's ready to face the horseshoe.");
  }
}
function registerActThreeEvents(){
  addEvent("richard_missing",
    ()=>S.act===3&&F().voteDone&&!F().richardMissing&&S.turn>=(F().voteTurn||S.turn)+2,
    function(){
      F().richardMissing=true; CHARS.richard.loc="limbo"; ITEMS.rnote.loc="eden_home";
      out("Richard is gone in the morning. Not dramatically — Richard has never once done anything dramatically except by accident — just gone: his side of the bed cold, the workshop tidied to a suspicion, his walking boots absent, and on her pillow a folded page of graph paper with her name on it in his terrible engineer's hand. The new administration's paper, by noon, calls it 'the flight of a person of interest.' The house calls it a hole in the air.");
      outSys("Richard has vanished. He left a NOTE (at home).");
    });
  addEvent("arrest",
    ()=>S.act===3&&F().voteDone&&F().richardMissing&&F().readNote&&!F().arrested&&S.turn>=(F().noteTurn||S.turn)+3,
    function(){
      F().arrested=true; F().arrestSoon=true; S.phase="act3_trial"; F().trialScene=true;
      outAlert("They come for her at the clinic, because of course they do.");
      out("Four uniforms and a warrant with new letterhead: *sedition, sabotage of colonial infrastructure, conspiracy with the fugitive Wakefield*. The charges are upholstery; the frame is the furniture. Ellie steps between her mother and the door with a clipboard like a shield until Nicole, very gently, takes it out of her hands. \"Run the ward,\" she says. \"That's the resistance. Do you hear me? *The ward.*\"");
      out("The trial convenes in her own hall that night — Nakamura understands theater the way she understands anatomy. The horseshoe is packed. The charges are read into the record by a clerk who was in the second cohort of children she vaccinated, and who cannot meet her eyes.");
      out("\"The accused,\" says the bench, \"may make a statement.\"");
      moveTo("eden_hall");
      outSys("Her statement: HONESTLY (name the frame and its author), CURATED (defend the record, spare the town), or REFUSE (silence, and let them own every word of this).");
    });
  addEvent("night_rescue",
    ()=>S.act===3&&F().trialDone&&S.phase==="act3_escape"&&!F().cellOpen&&S.turn>=(F().trialTurn||0)+3,
    function(){
      F().cellOpen=true;
      if(F().katieWarned||S.rel.katie>=4){
        F().rescuer="katie"; CHARS.katie.loc="eden_gate";
        out("Past midnight, the lock speaks — not forced, *keyed* — and Katie is inside the holding room in Vegas black, moving like the professional her mother never wanted her to become. \"Guard rotation's mine till the hour,\" she says, flat and fast. \"Nakamura thinks I'm running his errand. I am running his errand. The errand is wrong about its contents.\" She sets a bundle on the bench: boots, a lamp, the medkit — and, folded with a care that undoes Nicole completely, the red-and-gold scarf. \"Papa's waiting somewhere only you two believe in. Ellie packed the kit. Patrick killed the plaza cameras. Benjy—\" her voice snags, one broken note \"—Benjy said to tell you: *lost is not gone*.\"");
        out("At the service door she stops her mother with one hand. \"I'm not coming. Someone has to be inside his machine, and I'm already — I'm *placed*, maman. Let me be placed.\" A beat, and the armor fails entirely, twenty years too late and right on time: \"Tell Papa I kept the feathers.\"");
        relUp("katie",2);
      } else {
        F().rescuer="ellie";
        out("Past midnight, the lock speaks — keyed, not forced — and it is Ellie and Patrick in the holding room, wearing the gatehouse's own coveralls and expressions their mother recognizes from her own mirror, circa several emergencies ago. \"Guards are having a medical episode of the scheduled variety,\" Ellie murmurs, setting down boots, a lamp, the medkit, the scarf. \"Patrick owns the cameras for forty minutes. Benjy is home asleep and innocent, and will remain all three, and says — he made me memorize it — *lost is not gone*.\"");
        out("\"We're not coming,\" Patrick says at the service door, forestalling her. \"The ward needs Ellie; the water needs me; and the town needs Wakefields it can see behaving lawfully while it thinks about what it just did to the one who wasn't.\" He manages his father's grin at one-third power. \"Go find him, maman. Item twelve on my checklist is *mind your mother*, and this is me, minding.\"");
        relUp("ellie",1);
      }
      take("lamp2"); ITEMS.lamp2.loc="inv"; if(!has("medkit")){take("medkit"); ITEMS.medkit.loc="inv";} if(!has("scarf")){take("scarf"); ITEMS.scarf.loc="inv";}
      outSys("The way OUT stands open: through the airlock's service door, out of New Eden, into Rama's original dark.");
    });
}
ITEMS.rnote={name:"Richard's note",alias:["note","graph paper","page"],loc:"limbo",
  desc:"Graph paper, folded in eighths, her name on the outside in the handwriting of a man who thinks in exploded diagrams.",
  on:{read:function(){
    if(!F().readNote){ F().readNote=true; F().noteTurn=S.turn; }
    out("*N. — They'll come for me first and you second; my leaving buys you days, use them better than I would. I've gone DOWN, to the old address — the one with the painted wall and the terrible acoustics. The landlords below have been leaving the porch light on for us for years (three colors; you know the knock). Bring the scarf. Bring yourself. Everything else the neighbors can print. — R.*");
    out("*P.S. — Falstaff knows the way to the boat. He always did like you best.*");
    outSys("Richard has gone to the lair, below New York — and something is waiting at the old shore to take her across. First: survive what's coming here.");
    return endTurn();
  }, take:function(){ take("rnote"); ITEMS.rnote.loc="inv"; out("She folds the note into the scarf's keeping."); return endTurn(); }}};
ITEMS.lamp2={name:"lamp",alias:["lantern","light3"],loc:"limbo",desc:"A gatehouse service lamp, charged and steady. Light, in her experience of Rama, is less a tool than a form of address."};

function trialStatement(verb){
  F().trialDone=true; F().trialStand=verb;
  if(verb==="honestly") out("She names the frame. Dates, meters, the letterhead's provenance, the arithmetic connecting her water ruling to his bathhouses to this bench — a clinical dissection performed on the state, in the state's own theater, in four unhurried minutes. Nobody applauds; the hall has learned what applause costs. But she watches the town's face while she works, and sees, here and there, the expression she has spent a life reading: the moment a patient decides to survive.");
  else if(verb==="curated") out("She defends the record and declines the fight: the ward's numbers, the water's return, the charter's third clause read slowly, once. No names. No counter-charges. She makes herself small and the work large — and watches half the hall relax with gratitude and the other half realize, in real time, that this is what losing gracefully is *for*: it teaches a town nothing it can use.");
  else out("\"No statement.\" Two words, and she folds her hands and gives the horseshoe the clinic face — the one that outlasts pain, panic, and administrators. The prosecution's evening is a monologue delivered to a silence that grows teeth as it lengthens. By the end, the town cannot look at her, which she notes with interest is not at all the same as the town looking away.");
  out("The verdict returns in forty minutes, which is enough deliberation to launder and not enough to mean it: *guilty on all counts*. Sentence: expulsion from the body politic, indefinite detention at the gatehouse pending 'resettlement review.' The gavel is Node fabrication and sounds beautiful. Somewhere in the gallery, Benjy is crying with a total, unembarrassed thoroughness, and it is the only sound in the hall with any dignity in it.");
  outSys("Guilty. They hold her at the gatehouse; the night is young and full of procedure.");
  S.phase="act3_escape"; F().trialTurn=S.turn; moveTo("eden_gate");
  endTurn();
  return true;
}

/* ---- The escape route: back through the old country ---- */
WORLD.tunnel={
  name:"The Service Dark",
  desc:"A maintenance way in the habitat's skin: Node conduits, Rama silence, the temperature of a cellar. Behind her, through the small door, the glow of New Eden's fixed dusk. Ahead, north, the passage runs out into a darkness she recognizes the way one recognizes an old coat: the plain. The original country. Home's first draft.",
  brief:"The service passage out of New Eden.",
  scenery:["service_way","node_conduits","eden_glow","old_plain_view"],
  exits:{ "in":{to:"eden_gate", blocked:function(){ return "Not back through that door. Not tonight. Possibly not ever, and she is surprised how level the thought sits."; }}, north:"plain_north" }
};
SCENERY.service_way={name:"maintenance way",alias:["maintenance way","service passage","passage","way","small door","service door","door"],desc:"A narrow route inside the habitat skin, built for maintenance rather than escape. Behind, one small door; ahead, the old country.",
  on:{open:"The small door behind her is shut to return. The open route is north, where the passage runs into the old country.",enter:"She is already inside the service passage. North leads out onto the plain.",touch:"Human-accessible panels over Node structure: the habitat's machinery translated into maintenance."}};
SCENERY.node_conduits={name:"Node conduits",alias:["conduits","node conduits","pipes","cables"],desc:"Service runs nested in the habitat skin, warm with transported power and utterly indifferent to the government overhead.",
  on:{touch:"The conduits are warm through their access covers, carrying the habitat's power past her hand toward the human world behind the door."}};
SCENERY.eden_glow={name:"New Eden glow",alias:["glow","fixed dusk","dusk","new eden"],desc:"The settlement's engineered dusk leaks through the small door: a whole political world reduced to a line of light."};
SCENERY.old_plain_view={name:"original country",alias:["darkness","plain","original country","old country","home's first draft","home first draft"],desc:"North, the dark opens onto the Central Plain: Rama before weather, law, family, and every human attempt to rename it."};
WORLD.camp_alpha.onEnterAct3=true;
const _campEnter=WORLD.camp_alpha.onEnter;
const _campDesc=WORLD.camp_alpha.desc;
const _campHutsDesc=SCENERY.huts.desc;
const _campMastDesc=SCENERY.mast.desc;
const _campCratesDesc=SCENERY.crates.desc;
const _campCratesSearch=SCENERY.crates.on.search;
const _campSound=WORLD.camp_alpha.sound;
const _campHutsOpen=SCENERY.huts.on.open;
const _campMastTouch=SCENERY.mast.on.touch;
const _campTableSearch=SCENERY.camp_table.on.search;
const _campTableRead=SCENERY.camp_table.on.read;
const _campTableOpen=SCENERY.camp_table.on.open;
const _campTableTouch=SCENERY.camp_table.on.touch;
const _campTableTake=SCENERY.camp_table.on.take;
const _campMugDesc=SCENERY.camp_mug.desc;
const _campMugDrink=SCENERY.camp_mug.on.drink;
const _campMugOpen=SCENERY.camp_mug.on.open;
const _campMugRead=SCENERY.camp_mug.on.read;
const _campMugTouch=SCENERY.camp_mug.on.touch;
const _campMugTake=SCENERY.camp_mug.on.take;
const _campCablesDesc=SCENERY.camp_cables.desc;
const _campCablesTouch=SCENERY.camp_cables.on.touch;
const _campCablesPull=SCENERY.camp_cables.on.pull;
const _campLightsDesc=SCENERY.camp_lights.desc;
const _campLightsTouch=SCENERY.camp_lights.on.touch;
const _campLightsLight=SCENERY.camp_lights.on.light;
const _campGeneratorDesc=SCENERY.camp_generator.desc;
const _campGeneratorOpen=SCENERY.camp_generator.on.open;
const _campGeneratorTouch=SCENERY.camp_generator.on.touch;
const _campDroneDesc=SCENERY.camp_drone.desc;
const _campDroneTouch=SCENERY.camp_drone.on.touch;
const _campDroneTake=SCENERY.camp_drone.on.take;
const _campGearDesc=SCENERY.camp_gear.desc;
const _campGearSearch=SCENERY.camp_gear.on.search;
const _campRoverDesc=SCENERY.camp_rover.desc;
const _campRoverUse=SCENERY.camp_rover.on.use;
const _campRoverSearch=SCENERY.camp_rover.on.search;
const _surveyBoardDesc=SCENERY.survey_board.desc;
const _surveyBoardRead=SCENERY.survey_board.on.read;
const _campRadioDesc=SCENERY.camp_radio.desc;
const _campRadioRead=SCENERY.camp_radio.on.read;
const _campRadioUse=SCENERY.camp_radio.on.use;
const _chessboardDesc=SCENERY.chessboard.desc;
const _chessboardPush=SCENERY.chessboard.on.push;
const _chessboardTake=SCENERY.chessboard.on.take;
const _richardSlateDesc=SCENERY.richard_slate.desc;
const _richardSlateRead=SCENERY.richard_slate.on.read;
const _richardSlateTake=SCENERY.richard_slate.on.take;
const _richardRobotsDesc=SCENERY.richard_robots.desc;
const _richardRobotsTouch=SCENERY.richard_robots.on.touch;
const _richardRobotsTake=SCENERY.richard_robots.on.take;
const _michaelRosaryDesc=SCENERY.michael_rosary.desc;
const _michaelRosaryTouch=SCENERY.michael_rosary.on.touch;
WORLD.camp_alpha.desc=function(){
  if(S.act===3) return "Camp Alpha, twenty-six years on: hut frames scoured to skeletons, the med-lab's shell half-swallowed by the plain's slow dust, one rover wheel standing upright like a monument to itself. Here she cut a man open under an alien sky. Here Michael said grace over ration bars. The folding table's legs remain planted, faithful as furniture: her own museum, not finished being lived.";
  return val(_campDesc);
};
SCENERY.huts.desc=function(){ return S.act===3?"The inflatable skins are long gone. Hut frames and the med-lab shell stand scoured to pale skeletons in the slow dust.":val(_campHutsDesc); };
SCENERY.mast.desc=function(){ return S.act===3?"The comms mast is dead and weathered, no Newton above it and no Earth waiting at the other end.":val(_campMastDesc); };
SCENERY.crates.desc=function(){ return S.act===3?"Collapsed store frames and empty containers, picked clean by time and necessity decades ago.":val(_campCratesDesc); };
SCENERY.crates.on.search=function(){
  if(S.act===3){ out("Nothing remains but dust and the shapes of supplies once kept here. The old margin was spent a lifetime ago."); return endTurn(); }
  return _campCratesSearch();
};
SCENERY.crates.on.touch=function(){ out(S.act===3?"Collapsed frames, empty containers, dust: every portable supply is long gone.":"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.crates.on.take=function(){ out(S.act===3?"There are no intact stores to carry away, only collapsed frames Nicole leaves in place.":"Rations and science stores stay accounted for. If Nicole needs one particular tool, she can SEARCH the crates and sign it out."); return endTurn(); };
WORLD.camp_alpha.sound=function(){ return S.act===3?"No generator, no mast tick: only the old plain's immense silence moving through open frames.":val(_campSound); };
SCENERY.huts.on.open=function(){ if(S.act===3){ out("There are no hut skins or working airlocks left to open, only scoured frames and the med-lab shell."); return endTurn(); } out(val(_campHutsOpen)); return endTurn(); };
SCENERY.huts.on.touch=function(){ out(S.act===3?"Dusty frame alloy and torn restraint points; the inflatable skins are only memory now.":"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.huts.on.take=function(){ out(S.act===3?"The skeletal frames are fixed in the dust and offer Nicole no useful salvage.":"It is part of Rama, or as good as. It stays."); return endTurn(); };
SCENERY.mast.on.touch=function(){ if(S.act===3){ out("Cold, dead aluminum roughened by twenty-six years without a relay pulse."); return endTurn(); } out(val(_campMastTouch)); return endTurn(); };
SCENERY.mast.on.use=function(){ out(S.act===3?"There is no relay package left to use and no Newton to answer it.":"Try a more specific verb — OPEN, PUSH, SCAN, TIE, that sort of thing."); return endTurn(); };
SCENERY.mast.on.take=function(){ out(S.act===3?"The dead mast is anchored among the ruins. It has no message left to carry.":"It is part of Rama, or as good as. It stays."); return endTurn(); };
SCENERY.camp_table.on.search=function(){ if(S.act===3){ out("Dust, fixed metal legs, and no surviving notes or game pieces."); return endTurn(); } out(val(_campTableSearch)); return endTurn(); };
SCENERY.camp_table.on.read=function(){ if(S.act===3){ out("No comm notes or score sheets survive on the table's bare frame."); return endTurn(); } out(val(_campTableRead)); return endTurn(); };
SCENERY.camp_table.on.open=function(){ if(S.act===3){ out("The tabletop is gone. The surviving legs have no drawer, compartment, or secret to open."); return endTurn(); } out(val(_campTableOpen)); return endTurn(); };
SCENERY.camp_table.on.touch=function(){ if(S.act===3){ out("Cold, dust-scoured metal. The floodlights that once warmed it have been dead for decades."); return endTurn(); } out(val(_campTableTouch)); return endTurn(); };
SCENERY.camp_table.on.take=function(){ if(S.act===3){ out("The planted legs have outlasted their usefulness. Nicole leaves the old furniture to its patient museum."); return endTurn(); } out(val(_campTableTake)); return endTurn(); };
SCENERY.camp_mug.desc=function(){ return S.act===3?"No camp mug or cold coffee remains beside the vanished chessboard. Janos took his name and his arguments with him.":val(_campMugDesc); };
SCENERY.camp_mug.on.drink=function(){ if(S.act===3){ out("There is no coffee here to drink; even the stain has weathered away."); return endTurn(); } out(val(_campMugDrink)); return endTurn(); };
SCENERY.camp_mug.on.open=function(){ if(S.act===3){ out("No mug remains to open."); return endTurn(); } out(val(_campMugOpen)); return endTurn(); };
SCENERY.camp_mug.on.read=function(){ if(S.act===3){ out("Janos's grease-pencil name is gone with the mug that bore it."); return endTurn(); } out(val(_campMugRead)); return endTurn(); };
SCENERY.camp_mug.on.touch=function(){ if(S.act===3){ out("Her hand finds only dust where the mug once stood."); return endTurn(); } out(val(_campMugTouch)); return endTurn(); };
SCENERY.camp_mug.on.take=function(){ if(S.act===3){ out("There is no mug left to take."); return endTurn(); } out(val(_campMugTake)); return endTurn(); };
SCENERY.camp_cables.desc=function(){ return S.act===3?"Dead lengths of insulation have split or vanished into dust. Nothing connects the skeletal huts now.":val(_campCablesDesc); };
SCENERY.camp_cables.on.touch=function(){ if(S.act===3){ out("Brittle insulation and dead wire; no human current remains."); return endTurn(); } out(val(_campCablesTouch)); return endTurn(); };
SCENERY.camp_cables.on.pull=function(){ if(S.act===3){ out("The dead cable flakes under her glove. She leaves the ruin undisturbed."); return endTurn(); } out(val(_campCablesPull)); return endTurn(); };
SCENERY.camp_lights.desc=function(){ return S.act===3?"Collapsed light stands lie pale in the dust. No lamp has burned here in decades.":val(_campLightsDesc); };
SCENERY.camp_lights.on.touch=function(){ if(S.act===3){ out("Cold metal, no vibration, no current."); return endTurn(); } out(val(_campLightsTouch)); return endTurn(); };
SCENERY.camp_lights.on.light=function(){ if(S.act===3){ out("The floodlights are ruined beyond power or repair."); return endTurn(); } out(val(_campLightsLight)); return endTurn(); };
SCENERY.camp_lights.on.use=function(){ out(S.act===3?"No switch or current survives. The collapsed stands cannot make a human circle in the dark again.":"Try a more specific verb — OPEN, PUSH, SCAN, TIE, that sort of thing."); return endTurn(); };
SCENERY.camp_lights.on.take=function(){ out(S.act===3?"The collapsed stands are corroded into the ruin and not worth disturbing.":"It is part of Rama, or as good as. It stays."); return endTurn(); };
SCENERY.camp_generator.desc=function(){ return S.act===3?"The generator's corroded shell is open to dust; its useful parts were salvaged long ago.":val(_campGeneratorDesc); };
SCENERY.camp_generator.on.open=function(){ if(S.act===3){ out("The service cover is already gone. The dead housing contains dust and stripped mountings."); return endTurn(); } out(val(_campGeneratorOpen)); return endTurn(); };
SCENERY.camp_generator.on.touch=function(){ if(S.act===3){ out("Cold, still, and empty of every pulse but memory."); return endTurn(); } out(val(_campGeneratorTouch)); return endTurn(); };
SCENERY.camp_generator.on.use=function(){ out(S.act===3?"Nothing answers. The generator is a stripped housing, not a source of power.":"Try a more specific verb — OPEN, PUSH, SCAN, TIE, that sort of thing."); return endTurn(); };
SCENERY.camp_generator.on.take=function(){ out(S.act===3?"The corroded housing is anchored among the ruins and contains nothing useful to salvage.":"It is part of Rama, or as good as. It stays."); return endTurn(); };
SCENERY.camp_drone.desc=function(){ return S.act===3?"No drone or charging mark remains. Francesca and her cameras left this camp a lifetime ago.":val(_campDroneDesc); };
SCENERY.camp_drone.on.touch=function(){ if(S.act===3){ out("There is no drone here to evade her hand."); return endTurn(); } return _campDroneTouch(); };
SCENERY.camp_drone.on.take=function(){ if(S.act===3){ out("No camera drone remains at the ruin."); return endTurn(); } return _campDroneTake(); };
SCENERY.camp_gear.desc=function(){ return S.act===3?"A few corroded anchors and strap buckles mark where the expedition gear once stood. Everything useful was carried away.":val(_campGearDesc); };
SCENERY.camp_gear.on.search=function(){ if(S.act===3){ out("Only dead buckles, buried anchors, and dust. Nothing remains to issue or inventory."); return endTurn(); } out(val(_campGearSearch)); return endTurn(); };
SCENERY.camp_gear.on.touch=function(){ out(S.act===3?"Corroded buckles and half-buried anchors, cold and emptied of every working strap.":"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.camp_gear.on.take=function(){ out(S.act===3?"Everything portable left long ago. Nicole leaves the buried anchors where history planted them.":"It is part of Rama, or as good as. It stays."); return endTurn(); };
SCENERY.camp_rover.desc=function(){ if(S.act===3) return S.loc==="camp_alpha"?"One wheel survives upright in the dust; the rest of the rover was salvaged or weathered away.":"No expedition rover waits at Beta now. Only old tracks and the memory of the route west remain."; return val(_campRoverDesc); };
SCENERY.camp_rover.on.use=function(){ if(S.act===3){ out("There is no working rover to use. Nicole crosses the old country on foot."); return endTurn(); } return _campRoverUse(); };
SCENERY.camp_rover.on.search=function(){ if(S.act===3){ out("No charged vehicle, oxygen kit, or tow line remains — only the camp's solitary wheel, far west."); return endTurn(); } out(val(_campRoverSearch)); return endTurn(); };
SCENERY.camp_rover.on.touch=function(){ out(S.act===3?(S.loc==="camp_alpha"?"Her glove meets the surviving wheel: dead tread, dust-packed hub, no rover around it.":"Only old tracks remain at Beta; there is no rover within reach."):"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.camp_rover.on.take=function(){ out(S.act===3?"No portable rover part remains beyond the wheel that marks the ruin.":"It is part of Rama, or as good as. It stays."); return endTurn(); };
SCENERY.survey_board.desc=function(){ return S.act===3?"The survey board is gone. A pair of mounting holes survives where the expedition once divided the impossible into assignments.":val(_surveyBoardDesc); };
SCENERY.survey_board.on.read=function(){ if(S.act===3){ out("No assignments remain to read; the board and its orders ended with the expedition."); return endTurn(); } out(val(_surveyBoardRead)); return endTurn(); };
SCENERY.survey_board.on.touch=function(){ out(S.act===3?"Her fingers find two empty mounting holes and the pale outline of a board long gone.":"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.survey_board.on.take=function(){ out(S.act===3?"There is no board left to take, only its mounting holes.":"It is part of Rama, or as good as. It stays."); return endTurn(); };
SCENERY.camp_radio.desc=function(){ return S.act===3?"Only the radio's empty mounting and a dead lead remain. Earth is no longer at the other end.":val(_campRadioDesc); };
SCENERY.camp_radio.on.read=function(){ if(S.act===3){ out("No display, log, or signal survives."); return endTurn(); } out(val(_campRadioRead)); return endTurn(); };
SCENERY.camp_radio.on.use=function(){ if(S.act===3){ out("The set is gone and the channel has been silent for decades."); return endTurn(); } out(val(_campRadioUse)); return endTurn(); };
SCENERY.camp_radio.on.touch=function(){ out(S.act===3?"Only an empty mounting and dead lead remain under her hand.":"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.camp_radio.on.take=function(){ out(S.act===3?"The radio itself is gone; the dead mounting stays with the ruin.":"It is part of Rama, or as good as. It stays."); return endTurn(); };
SCENERY.chessboard.desc=function(){ return S.act===3?"The chessboard and its players are gone. Only a pale rectangle on the old table frame suggests where the game waited unfinished.":val(_chessboardDesc); };
SCENERY.chessboard.on.push=function(){ if(S.act===3){ out("There are no pieces left to move and no old game to resume."); return endTurn(); } out(val(_chessboardPush)); return endTurn(); };
SCENERY.chessboard.on.touch=function(){ out(S.act===3?"The pale rectangle is only dust protected for a little longer than the dust around it.":"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.chessboard.on.take=function(){ if(S.act===3){ out("No board or piece survives to take."); return endTurn(); } out(val(_chessboardTake)); return endTurn(); };
SCENERY.richard_slate.desc=function(){ return S.act===3?"Richard carried the slate away decades ago; no thermal curves remain here to read.":val(_richardSlateDesc); };
SCENERY.richard_slate.on.read=function(){ if(S.act===3){ out("The slate is not among these old remains. Its forecasts have already become weather and history."); return endTurn(); } return _richardSlateRead(); };
SCENERY.richard_slate.on.take=function(){ if(S.act===3){ out("No slate remains here to take."); return endTurn(); } out(val(_richardSlateTake)); return endTurn(); };
SCENERY.richard_slate.on.touch=function(){ out(S.act===3?"There is no slate here; only the remembered gesture of Richard turning a forecast toward her.":"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.richard_robots.desc=function(){
  if(S.act===3&&S.loc==="beta_shore"&&!CHARS.falstaff.gone&&CHARS.falstaff.loc==="beta_shore") return "Falstaff is the only little robot here now, a small brass figure standing sentry on Resolution II's foredeck.";
  if(S.act===3&&S.loc==="ny_dock"&&!CHARS.falstaff.gone&&CHARS.falstaff.loc==="ny_dock") return "Falstaff is the only little robot here now, keeping watch aboard Resolution II beneath the seawall.";
  return S.act===3&&S.loc!=="lair"?"No little robots haunt the old expedition sites now. Falstaff alone waits farther along the route.":val(_richardRobotsDesc);
};
SCENERY.richard_robots.on.touch=function(){ if(S.act===3&&S.loc!=="lair"){ out("There is no brass scout here to touch."); return endTurn(); } out(val(_richardRobotsTouch)); return endTurn(); };
SCENERY.richard_robots.on.take=function(){ if(S.act===3&&S.loc!=="lair"){ out("No little robot remains here to take."); return endTurn(); } out(val(_richardRobotsTake)); return endTurn(); };
SCENERY.michael_rosary.desc=function(){ return S.act===3?"Michael and his rosary are eight light-years behind her now. No beads remain at this shore.":val(_michaelRosaryDesc); };
SCENERY.michael_rosary.on.touch=function(){ if(S.act===3){ out("The remembered beads are beyond her hand."); return endTurn(); } out(val(_michaelRosaryTouch)); return endTurn(); };
SCENERY.michael_rosary.on.take=function(){ out(S.act===3?"No rosary remains here to take; Michael and the beads are eight light-years away.":val(SCENERY.michael_rosary.takeFail||"The rosary belongs in Michael's hand or pocket. Nicole leaves his private anchor where he put it.")); return endTurn(); };
SCENERY.camp_ruins={name:"camp ruins",alias:["ruins","med-lab shell","med lab shell","shell","dust","slow dust","museum","exhibit"],desc:function(){ return S.act===3?"Human intention reduced to durable outlines: a medical shell, table legs, dust, and memories that need no labels.":"Camp Alpha is still occupied and working; these structures are equipment, not ruins."; },on:{touch:function(){ out(S.act===3?"Dust roughens the medical shell. Human alloy has outlasted every purpose except memory.":"The camp structures are intact, taut, and busy with human use."); return endTurn(); },take:function(){ out(S.act===3?"The ruin is architecture now, and not salvage Nicole needs.":"The working camp is not something Nicole can take."); return endTurn(); }}};
SCENERY.rover_wheel={name:"rover wheel",alias:["rover wheel","wheel","monument"],desc:function(){ return S.act===3?"One rover wheel stands upright where the rest of the machine has vanished, an accidental monument to every expedition certain its equipment was temporary.":"All four wheels remain attached to the working electric rover."; },on:{touch:function(){ out(S.act===3?"Its tread is stone-hard with age, the hub packed with grey dust.":"Rubber tread and a maintained hub, still attached to the rover."); return endTurn(); },take:function(){ out(S.act===3?"The wheel has become part of the ruin's geometry. Nicole leaves the monument standing.":"The rover still needs its wheel."); return endTurn(); }}};
WORLD.camp_alpha.scenery.push("camp_ruins","rover_wheel");
WORLD.camp_alpha.onEnter=function(){
  if(S.act===3&&!F().campRevisit){ F().campRevisit=true;
    doLookInline();
    endTurn(true); return true;
  }
  return _campEnter?_campEnter():false;
};
const _campAct3OnGo=WORLD.camp_alpha.onGo;
const _campEastHidden=WORLD.camp_alpha.exits.east.hidden;
WORLD.camp_alpha.exits.east.hidden=function(){ return S.act===3?false:_campEastHidden(); };
WORLD.camp_alpha.onGo=function(dir){
  if(S.act===3&&dir==="in"){
    out("The medical hut is a scoured shell, open to dust and memory. There is no pristine clinic left to enter.");
    endTurn(); return true;
  }
  if(S.act===3&&dir==="east"){
    out("She walks east along the old rover route, following grooves and memory to the Cylindrical Sea.");
    moveTo("beta_shore"); return true;
  }
  return _campAct3OnGo?_campAct3OnGo(dir):false;
};
const _betaEnter=WORLD.beta_shore.onEnter;
const _betaHoistDesc=SCENERY.hoist.desc;
const _betaHoistUse=SCENERY.hoist.on.use;
const _betaHoistPush=SCENERY.hoist.on.push;
const _betaHoistTake=SCENERY.hoist.on.take;
const _betaMooringDesc=SCENERY.beta_mooring.desc;
const _betaMooringTouch=SCENERY.beta_mooring.on.touch;
const _betaMooringPull=SCENERY.beta_mooring.on.pull;
const _betaMooringTake=SCENERY.beta_mooring.on.take;
const _boatFittingsDesc=SCENERY.boat_fittings.desc;
const _boatFittingsOpen=SCENERY.boat_fittings.on.open;
const _boatFittingsSearch=SCENERY.boat_fittings.on.search;
const _boatFittingsTouch=SCENERY.boat_fittings.on.touch;
const _boatFittingsTake=SCENERY.boat_fittings.on.take;
const _seaLogDesc=SCENERY.sea_log.desc;
const _seaLogRead=SCENERY.sea_log.on.read;
WORLD.beta_shore.onEnter=function(){
  if(S.act===3&&!F().betaRevisit){ F().betaRevisit=true; ITEMS.skiff.loc="beta_shore"; ITEMS.boat.loc="limbo"; CHARS.falstaff.gone=false; CHARS.falstaff.loc="beta_shore";
    doLookInline();
    out("The stair down the cliff is the same stair; the sea is the same impossible ring, breathing in the dark. And at the old mooring, riding two neat lines with its running light dimmed to an ember, is a boat — hull panels she recognizes as workshop stock, seams she recognizes as her husband's, and on the foredeck, standing sentry with theatrical rigor, a small brass figure that executes, upon sighting her, its very best bow.");
    out("\"Falstaff,\" Nicole says, and her voice does something unprofessional. The little robot pipes two bars of a march and gestures grandly aboard: *madam, your carriage*.");
    outSys("Richard's boat. (ENTER the SKIFF when ready to cross.)");
    endTurn(true); return true;
  }
  return _betaEnter?_betaEnter():false;
};
const _betaAct3OnGo=WORLD.beta_shore.onGo;
WORLD.beta_shore.onGo=function(dir){
  if(S.act===3&&dir==="west"){
    out("She walks west along the remembered rover route. No vehicle remains; the old country is crossed on foot now.");
    moveTo("camp_alpha"); return true;
  }
  if(S.act===3&&dir==="south"){
    out("The sea crossing belongs to Richard's waiting boat, not to a bare direction. ENTER THE SKIFF when she is ready.");
    endTurn(); return true;
  }
  return _betaAct3OnGo?_betaAct3OnGo(dir):false;
};
ITEMS.skiff={name:"skiff",alias:["boat","boat2","hull","richard's boat","richard s boat","carriage","resolution ii","resolution 2"],loc:"limbo",fixed:true,takeFail:"Resolution II is transport, not luggage. Nicole leaves Richard's skiff secured to its lines.",
  desc:"Workshop-built, Rama-salvaged, twenty years of secret weekends explained in one hull. On the transom, hand-lettered: RESOLUTION II. Under it, smaller: *she'll forgive the name — R.*",
  on:{enter:function(){ return crossHome(); }, use:function(){ return crossHome(); }, board:function(){ return crossHome(); },
      sit:"The stern seat waits aboard Resolution II. ENTER THE SKIFF when Nicole is ready to cross; sitting beside it will not make the voyage for her.",
      read:"On the transom, hand-lettered: RESOLUTION II. Beneath it, smaller: *she'll forgive the name — R.*",
      search:"Richard built no hidden compartment, only a sound hull, compact controls, and the accumulated evidence of twenty secret weekends.",
      touch:"Workshop panels, hand-finished seams, and a hull vibration that feels unmistakably like Richard's engineering."}};
SCENERY.beta_mooring.alias.push("old mooring","mooring line");
SCENERY.beta_return_details={name:"return skiff details",alias:["stair","old stair","running light","light","hull panels","panels","seams","foredeck","transom"],desc:function(){ return S.act===3?"The old stair and mooring remain. Two neat lines hold the skiff beside the stage; its dim running light finds workshop hull panels, Richard's seams, and the lettered transom.":"The cliff stair, expedition equipment, and original Resolution occupy this shore; no second skiff or lettered transom has arrived."; },
  on:{read:function(){ out(S.act===3?"The transom reads RESOLUTION II. Beneath it, smaller: *she'll forgive the name — R.*":"There is no RESOLUTION II transom here yet; the expedition boat below is simply stenciled RESOLUTION."); return endTurn(); },
      touch:function(){ out(S.act===3?"The stair and old mooring are cold with age; the skiff's panels and seams are warmer, recently worked, and human.":"The stair and expedition fittings are weathered but working. There are no hand-finished return-skiff seams here yet."); return endTurn(); }}};
WORLD.beta_shore.scenery.push("beta_return_details");
SCENERY.hoist.desc=function(){ return S.act===3?"The hoist frame has rusted into sculpture above a stage still held in the ringed sea. Its motor and working cable are long gone.":val(_betaHoistDesc); };
SCENERY.hoist.on.use=function(){ if(S.act===3){ out("The old hoist cannot move. The stair still reaches the stage, and Richard's skiff is entered directly."); return endTurn(); } out(val(_betaHoistUse)); return endTurn(); };
SCENERY.hoist.on.push=function(){ if(S.act===3){ out("The control pendant is dead and its buttons have fused in place."); return endTurn(); } out(val(_betaHoistPush)); return endTurn(); };
SCENERY.hoist.on.take=function(){ if(S.act===3){ out("The fused pendant and rusted frame have become one dead mechanism. Nicole leaves them attached."); return endTurn(); } out(val(_betaHoistTake)); return endTurn(); };
SCENERY.beta_mooring.desc=function(){ return S.act===3?"Two neat lines hold Richard's Resolution II beside the old floating stage. The rope is recent; the rings and fenders remember the expedition.":val(_betaMooringDesc); };
SCENERY.beta_mooring.on.touch=function(){ if(S.act===3){ out("Recent human rope runs through old wet rings; the skiff's fenders give gently against the stage."); return endTurn(); } out(val(_betaMooringTouch)); return endTurn(); };
SCENERY.beta_mooring.on.pull=function(){ if(S.act===3){ out("She tests Richard's two lines. Both hold; the skiff rides ready for the crossing."); return endTurn(); } out(val(_betaMooringPull)); return endTurn(); };
SCENERY.beta_mooring.on.take=function(){ if(S.act===3){ out("Removing the lines would set Richard's skiff adrift. Nicole leaves the mooring to its work."); return endTurn(); } out(val(_betaMooringTake)); return endTurn(); };
SCENERY.boat_fittings.desc=function(){ return S.act===3?"The expedition Resolution and its outboard are gone. Richard's newer skiff carries its own compact controls and equipment behind hand-finished hull panels.":val(_boatFittingsDesc); };
SCENERY.boat_fittings.on.open=function(){ if(S.act===3){ out("The old expedition fittings are gone; Richard's skiff has no service housing Nicole needs to open here."); return endTurn(); } out(val(_boatFittingsOpen)); return endTurn(); };
SCENERY.boat_fittings.on.search=function(){ if(S.act===3){ out("No old emergency kit or expedition outboard remains. The return skiff itself is sound, compact, and ready."); return endTurn(); } out(val(_boatFittingsSearch)); return endTurn(); };
SCENERY.boat_fittings.on.touch=function(){ if(S.act===3){ out("Her hand finds Richard's recent controls and finished panels, not the molded fittings of the old Resolution."); return endTurn(); } out(val(_boatFittingsTouch)); return endTurn(); };
SCENERY.boat_fittings.on.take=function(){ if(S.act===3){ out("The return skiff's controls remain secured to the boat Richard built."); return endTurn(); } out(val(_boatFittingsTake)); return endTurn(); };
SCENERY.sea_log.desc=function(){ return S.act===3?"The old field log is long gone, but Nicole remembers her rule about the Cylindrical Sea without needing paper: unknown salts, unknown organics, no ingestion.":val(_seaLogDesc); };
SCENERY.sea_log.on.read=function(){ if(S.act===3){ out("The absent page remains legible in memory: DO NOT DRINK THE RAMAN WATER."); return endTurn(); } out(val(_seaLogRead)); return endTurn(); };
function crossHome(){
  if(S.loc==="ny_dock"){ out("Resolution II rests at the New York waterfront, crossing complete. The old address is up through the seawall."); return endTurn(); }
  if(S.loc!=="beta_shore"){ outSys("The skiff is not here."); return; }
  out("The crossing, this time, is quiet. Falstaff steers — of course Falstaff steers — and Nicole sits in the stern of her husband's secret boat with the scarf at her throat and twenty-six years of this sea moving under her, and lets the dark ring carry her toward the island that hums. New York rises off the bow the way it rose the first morning of the world: patient, lit from within by its own idea of itself.");
  S.phase="act3_sanctuary";
  S.loc="ny_dock"; S.pronoun=null;
  ITEMS.skiff.loc="ny_dock"; CHARS.falstaff.loc="ny_dock"; CHARS.falstaff.gone=false;
  doLook(false); S.visited.ny_dock=true;
  outSys("New York. The old address is below: up through the seawall, east across the plaza, and DOWN the latticed way.");
  endTurn();
}
const _falstaffHere=CHARS.falstaff.here;
CHARS.falstaff.here=function(){ return S.act===3&&S.loc==="ny_dock"?"Falstaff remains aboard Resolution II at the waterfront, brass case bright beneath the seawall.":val(_falstaffHere); };
const _nyMooringDesc=SCENERY.ny_mooring.desc;
const _nyMooringSearch=SCENERY.ny_mooring.on.search;
const _nyRadioDesc=SCENERY.ny_radio.desc;
const _nyRadioUse=SCENERY.ny_radio.on.use;
const _nyRadioListen=SCENERY.ny_radio.on.listen;
const _nyRadioRead=SCENERY.ny_radio.on.read;
const _betaDinghyDesc=SCENERY.beta_dinghy.desc;
const _betaDinghyTake=SCENERY.beta_dinghy.on.take;
const _betaDinghyUse=SCENERY.beta_dinghy.on.use;
const _nyArrivalGearDesc=SCENERY.ny_arrival_gear.desc;
const _nyArrivalGearOpen=SCENERY.ny_arrival_gear.on.open;
const _nyArrivalGearTake=SCENERY.ny_arrival_gear.on.take;
const _nyGlovesDesc=SCENERY.ny_gloves.desc;
const _nyGlovesTouch=SCENERY.ny_gloves.on.touch;
const _nyGlovesTake=SCENERY.ny_gloves.on.take;
SCENERY.ny_mooring.desc=function(){ return S.act===3?"Resolution II rides two neat lines at the old waterfront rings. The skiff has crossed; the route onward is up through the seawall.":val(_nyMooringDesc); };
SCENERY.ny_mooring.on.search=function(){ if(S.act===3){ out("Two sound lines, wet rings, Richard's skiff secured below the ramp. Nothing hidden and nothing missing."); return endTurn(); } out(val(_nyMooringSearch)); return endTurn(); };
SCENERY.ny_mooring.on.touch=function(){ out(S.act===3?"Wet rope, old metal rings, and the gentle tug of Resolution II at rest.":"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.ny_mooring.on.take=function(){ out(S.act===3?"The lines keep Richard's skiff at the waterfront. Nicole leaves them fast.":"It is part of Rama, or as good as. It stays."); return endTurn(); };
SCENERY.ny_radio.desc=function(){ return S.act===3?"No field radio hangs from Richard's harness here. The expedition channel has been silent for decades.":val(_nyRadioDesc); };
SCENERY.ny_radio.on.use=function(){ if(S.act===3){ out("There is no expedition radio here to use."); return endTurn(); } out(val(_nyRadioUse)); return endTurn(); };
SCENERY.ny_radio.on.listen=function(){ if(S.act===3){ out("No command-channel static remains, only New York's patient hum."); return endTurn(); } return _nyRadioListen(); };
SCENERY.ny_radio.on.read=function(){ if(S.act===3){ out("There is no radio display or Newton traffic left to read."); return endTurn(); } out(val(_nyRadioRead)); return endTurn(); };
SCENERY.ny_radio.on.touch=function(){ out(S.act===3?"No receiver is within reach. The remembered weight belonged to another expedition.":"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.ny_radio.on.take=function(){ out(S.act===3?"There is no radio here to take.":"It is part of Rama, or as good as. It stays."); return endTurn(); };
SCENERY.beta_dinghy.desc=function(){ return S.act===3?"Michael's Beta dinghy is long gone. Resolution II is the only human boat at this waterfront now.":val(_betaDinghyDesc); };
SCENERY.beta_dinghy.on.take=function(){ if(S.act===3){ out("There is no old dinghy here to take."); return endTurn(); } out(val(_betaDinghyTake)); return endTurn(); };
SCENERY.beta_dinghy.on.use=function(){ if(S.act===3){ out("The old dinghy no longer exists here. The return crossing aboard Resolution II is complete."); return endTurn(); } out(val(_betaDinghyUse)); return endTurn(); };
SCENERY.ny_arrival_gear.desc=function(){ return S.act===3?"No expedition ration crate remains above the spray line. The provisions and emergency that placed it here ended decades ago.":val(_nyArrivalGearDesc); };
SCENERY.ny_arrival_gear.on.open=function(){ if(S.act===3){ out("There is no ration crate left to open."); return endTurn(); } out(val(_nyArrivalGearOpen)); return endTurn(); };
SCENERY.ny_arrival_gear.on.take=function(){ if(S.act===3){ out("No old provisions remain to take."); return endTurn(); } out(val(_nyArrivalGearTake)); return endTurn(); };
SCENERY.ny_arrival_gear.on.touch=function(){ out(S.act===3?"Only the old spray line and bare grey surface remain.":"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.ny_gloves.desc=function(){ return S.act===3?"Michael's soaked gloves are not here. The salt and water that stiffened them belong to the first crossing.":val(_nyGlovesDesc); };
SCENERY.ny_gloves.on.touch=function(){ if(S.act===3){ out("There are no wet gloves here to touch."); return endTurn(); } out(val(_nyGlovesTouch)); return endTurn(); };
SCENERY.ny_gloves.on.take=function(){ if(S.act===3){ out("Michael's gloves left this waterfront a lifetime ago."); return endTurn(); } out(val(_nyGlovesTake)); return endTurn(); };
WORLD.lair.scenery.push("redsq","bluesq","greensq");
const _muralRead=SCENERY.mural.on.read;
const _muralDesc=SCENERY.mural.desc;
const _muralPhotograph=SCENERY.mural.on.photograph;
const _lairPassageDesc=SCENERY.lair_passage.desc;
SCENERY.mural.alias.push("painted wall","color-banded wall","color banded wall");
SCENERY.mural.desc=function(){
  if(S.act===3&&S.phase==="act3_sanctuary") return F().grillOpened?"The old color-banded wall is legible now beside Richard's lexicon: greeting, shelter, patient attention, and the recurring red-blue-green word *begin*. It is no longer an undeciphered neighbor but a conversation still in progress.":"The mature mural repeats Rama's oldest greeting — red, blue, green, *begin* — and points toward the speakers waiting behind the grill.";
  return val(_muralDesc);
};
SCENERY.mural.on.read=function(){
  if(S.act===3&&S.phase==="act3_sanctuary") out(F().grillOpened?"With Richard's lexicon beside it, the wall yields fragments: greeting, shelter, patient attention — and the recurring red-blue-green word they translate as *begin*.":"The old greeting is clear now: red, blue, green — *begin*. The rest waits behind the grill with the speakers who wrote it.");
  else out(val(_muralRead));
  return endTurn();
};
SCENERY.mural.on.touch=function(){ out(S.act===3&&S.phase==="act3_sanctuary"?(F().grillOpened?"Warm bands of pigment and buried light meet her fingertips. Beside Richard's lexicon, touch has become part of reading.":"The painted bands are warm and patient. Red, blue, green waits under her hand like a remembered knock."):"Cool, smoother than it looks. Whatever made this did not worry about fingerprints."); return endTurn(); };
SCENERY.mural.on.photograph=function(){ if(S.act===3&&S.phase==="act3_sanctuary"){ out(F().grillOpened?"The old archive and Richard's lexicon have made this more than an image now: a correspondence, still growing.":"Nicole has photographs from the first survey. What matters tonight is answering the greeting."); return endTurn(); } out(val(_muralPhotograph)); return endTurn(); };
SCENERY.color_squares={name:"three painted squares",alias:["squares","painted squares","three squares","three colors","color panel"],desc:function(){ return F().grillOpened?"Red, blue, green rest dim and cool in the wall where the grill dissolved: a completed phrase, Rama's oldest courtesy answered.":"Three warm keys in the grill's center panel: red, blue, green, Rama's oldest courtesy made touchable."; },
  on:{touch:function(){ out(F().grillOpened?"The three squares have cooled. The phrase is complete; the open passage is its answer.":"All three squares are faintly warm, waiting for a deliberate sequence."); return endTurn(); },push:"The phrase needs individual words: PUSH RED, then BLUE, then GREEN."}};
SCENERY.lair_passage.alias.push("biolight","warm biolight","banded walls","walls","doorway","passage mouth","tunnel mouth");
SCENERY.lair_passage.desc=function(){
  if(S.act===3&&S.phase==="act3_sanctuary"&&F().grillOpened) return "The dissolved grill reveals a descending passage washed in warm biolight, its curved walls speaking in patient bands of color.";
  return val(_lairPassageDesc);
};
SCENERY.octo_lexicon={name:"octospider lexicon",alias:["lexicon","book","translation","translations","dispatches"],desc:function(){ return F().grillOpened?"Richard's patient, handmade concordance of ordered light. Whole pages circle meanings near greeting, shelter, mending, and begin.":"Richard's note promised a language below. The lexicon and its maker wait on the other side of the grill."; },on:{read:function(){ out(F().grillOpened?"RED-BLUE-GREEN: BEGIN / GREETING. A longer band Richard glosses as THE ONE WHO MENDS. The margins contain twenty-six years of delighted argument.":"Not until the grill opens and Richard can put the colors in context."); return endTurn(); }}};
WORLD.lair.scenery.push("color_squares","octo_lexicon");
const _richardChildrenAsk=CHARS.richard.ask["children|simone|katie"];
CHARS.richard.ask["children|simone|katie"]=[
  {if:()=>S.act===3,text:"Richard's smile goes careful. \"Katie found a place inside Nakamura's machine where she could stop being our daughter long enough to discover who else she is. I hate the machine. I will not insult her by pretending the choice inside it isn't hers.\""},
  ..._richardChildrenAsk
];
CHARS.richard.ask["nakamura"]=function(){ out(S.act===3?"\"Nakamura built a machine out of a town,\" Richard says. \"Efficient, legible, and designed to make every human part replaceable. I preferred Rama.\"":val(CHARS.richard.askDefault)); return endTurn(); };
CHARS.richard.ask["colony|new eden"]=function(){ out(S.act===3?"\"New Eden will survive us,\" Richard says. \"That was the specification. Surviving what we made of it is the acceptance test.\"":val(CHARS.richard.askDefault)); return endTurn(); };
CHARS.richard.ask["old days|past"]=function(){ out(S.act===3?"He looks around the gallery they once called temporary. \"The old days were terrifying, underprovisioned, and full of people we miss. Naturally I remember them as perfect.\"":val(CHARS.richard.askDefault)); return endTurn(); };
const _richardShowScarf=CHARS.richard.show.scarf;
CHARS.richard.show.scarf=function(){
  if(S.act===3&&S.phase==="act3_sanctuary"){
    out("Richard touches the edge of the red-and-gold scarf. \"You brought it,\" he says. \"I remember the first expedition — that impossible color in all this grey. I knew it would find us again.\"");
    return endTurn();
  }
  return _richardShowScarf();
};
WORLD.lair.onCmd=function(verb,obj){
  if(S.act===3&&S.phase==="act3_sanctuary"&&F().grillOpened&&verb==="touch"&&obj&&obj.kind==="char"&&obj.id==="richard"){
    out("Nicole takes Richard's hand. It is older, warmer, and real; he closes his fingers around hers with the grip of a man still checking that rescue has become reunion.");
    endTurn(); return true;
  }
  return false;
};
function octoDoor(){
  outSys("The three painted squares wait beside the grill — red, blue, green — no longer inert paint but keys under her lamp, each faintly warm. (PUSH them in Rama's oldest order.)");
}
function octoPress(color){
  S.oseq=S.oseq||[];
  S.oseq.push(color);
  out("She presses the "+color+" square. It glows under her palm, holding the light like held breath.");
  const want=["red","blue","green"];
  for(let i=0;i<S.oseq.length;i++){
    if(S.oseq[i]!==want[i]){ S.oseq=[]; out("The squares dim, all three, a courteous erasure: wrong phrase, try again. Somewhere behind the grill, something waits without impatience."); return endTurn(); }
  }
  if(S.oseq.length===3){ S.oseq=[]; return grillOpens(); }
  return endTurn();
}
function grillOpens(){
  F().grillOpened=true;
  out("Red, blue, green: *begin*. The grill does not swing — it *dissolves*, lattice folding into wall like a sentence finishing, and warm biolight breathes out of the passage beyond, banded in slow colors down walls that curve away and down. And in the doorway, backlit, thinner, greyer, grinning like the boy given the largest machine in the universe, stands Richard Wakefield.");
  out("\"You kept them waiting,\" he says, unsteady, holding her at last at arm's length as if to verify the instruments. \"Twenty-six years I've been telling them my wife says a proper thank-you eventually—\" and then neither of them manages words for a while, and the colors on the walls slow to something like tact.");
  out("Behind him, at a respectful remove, stand the landlords: three beings the height of doors, eight-limbed, velvet-black, their heads ringed with bands of flowing color — speaking, she realizes, *watching them speak* — and one of them cycles, very slowly, red, blue, green: *begin*. \"They pulled me out of a search party's worth of trouble the month I arrived,\" Richard says. \"Same as they watched over you, that first time, in the pit. They've been leaving the light on for us for twenty-six years, Nicole. Turns out we were never squatters. We were *expected*.\"");
  CHARS.richard.loc="party"; CHARS.octos.loc="lair"; CHARS.octos.gone=false;
  relUp("richard",2);
  outSys("Sanctuary. (Talk to RICHARD; meet the OCTOSPIDERS. And when she is ready to rest — truly ready — SLEEP.)");
  return endTurn();
}
CHARS.octos={name:"the octospiders",alias:["octospiders","octospider","octo","landlords","hosts"],loc:"limbo",gone:true,pron:"their",
  desc:"Eight-limbed, silent, patient as geology, with heads ringed in flowing bands of color — a language of light, older than her species' words. Up close they smell faintly of rain on warm stone. They have been her downstairs neighbors, it turns out, for most of her life.",
  here:"The octospiders attend at the passage mouth, colors idling like slow water.",
  talk:"She faces the nearest and, feeling equal parts ambassador and toddler, cycles her lamp: red, blue, green. The rings around its head flare in what she will go to her grave believing is delight, and it answers — a long, banded, patient sentence of which she understands one word, the first one, which is *begin*. It is, she reflects, the only word two species strictly need to share.",
  suggest:["the colors"],
  ask:{
    "colors|language|color":"Richard translates what twenty-six years and a homemade lexicon can: they speak in ordered light; red-blue-green opens every courtesy; and they have a word for Nicole — he shows her, lamp in hand — that renders, as best he can tell, as *the one who mends*. She decides she can live inside that translation.",
    "pit|rescue|past":"Richard confirms what the tunnels only hinted: the soft sounds in her three lost days, the water that never quite ran out. \"They triaged you,\" he says. \"Their word for it is nicer. Their word for it is the same as their word for *greeting*.\""
  },
  tell:{}, show:{ scarf:function(){ out("She holds up the scarf. Three heads ring slowly through red and gold — matching it, she realizes, *complimenting* it — and one reaches out a velvet limb and, with the delicacy of a surgeon, does not touch it. Manners, rendered in restraint."); return endTurn(); } }
};
WORLD.lair.onSleep=function(){
  if(S.act===3&&S.phase==="act3_sanctuary"&&F().grillOpened){ finaleTwilight(); return true; }
  return false;
};
function finaleTwilight(){
  S.phase="act3_twilight";
  out("Years, then. The lair years, the second edition: Richard's lamps strung down the octospider galleries, a lexicon growing page by patient page, dispatches smuggled up-habitat through Katie's channels and back — Ellie's ward reports, Patrick's pressure readings, one drawing from Benjy every month, always of a garden. New Eden argues its way onward overhead. Below, in the banded light, two elderly humans are, against every actuarial table of two worlds, *happy*.");
  out("Her heart declares itself on an ordinary evening — the old arrhythmia she has carried like a folded letter since the return voyage, opening at last. Nicole des Jardins Wakefield, physician, does the workup on herself with steady hands, closes the scanner, and tells her husband the truth, because they have never once managed anything else that stuck.");
  out("Rama, as if it had been waiting for exactly this, begins — very gently, sixteen kilometers around them — to decelerate.");
  out("She lies down in the garden of luminescence with the scarf at her throat and Richard's hand in hers and the colors on the walls slowing, slowing, to the rhythm of a tide, or a heart, or circulation; and the last thing she hears from the world of instruments is Richard's voice, very far away and very close, saying her name the way he said it the first morning of the world—");
  startPostlude();
}

/* =====================================================================
   POSTLUDE — NICOLE
   ===================================================================== */
function startPostlude(){
  S.act=4; S.phase="postlude"; S.ended=false;
  S.loc="pl_shore"; S.visited["pl_shore"]=true; S.inv=[];
  CHARS.eagle.loc="pl_shore"; CHARS.eagle.gone=false;
  Object.keys(CHARS).forEach(function(c){ if(c!=="eagle"){ CHARS[c].loc="limbo"; } });
  outAct("POSTLUDE","NICOLE");
  out("—and then the far-away voice is not far away, and it is not Richard's.");
  out("There is no weight. There is no pain, which after this last year is itself a country. There is light without source, and beneath her — around her; prepositions have stopped insisting — something like a shore: the calm of the Node's hangar, remembered perfectly, or perhaps consulted directly. She is standing. She has, she notices with a physician's last professional interest, decided to be standing.");
  out("\"Nicole des Jardins.\" The Eagle is beside her, unchanged by twenty-six years because it was never *in* them. Its gold eyes hold her with what she long ago stopped pretending was not warmth. \"Your body rests in the garden, in your husband's keeping. What you are now is a question your species' file marks *open*. We are permitted, at this threshold, to keep you company in it for a while.\"");
  outSys("(Directions have stopped meaning. Her hands are empty; INVENTORY holds other things now. The Eagle is here, and this once, it will answer more than it used to. When she is ready, she may ask it one last thing: ASK THE EAGLE ABOUT GOD, ABOUT RAMA, ABOUT HER FAMILY, or ABOUT THE PURPOSE.)");
}
WORLD.pl_shore={
  name:"The Threshold",
  desc:"Light, and the memory of a shore. When she looks for walls, there is architecture, courteously. When she stops looking, there is simply *here*. Far off — distance is another courtesy — a grey cylinder rests in a cradle of spars, and she knows it the way one knows a house from outside at night: everyone she loves is a lit window in it.",
  brief:"The threshold of light.",
  scenery:["cylinder","light4","threshold_architecture"],
  sound:"The pulse she first heard beneath the Node's silence, all those years ago. Tide, or heart, or circulation. She has stopped needing the metaphors to be different things.",
  exits:{}
};
SCENERY.cylinder={name:"Rama",alias:["cylinder","grey cylinder","ship2","home2","window","windows"],desc:"Rama at rest, holding her family the way it has held everything: patiently, at scale, with the lights on. Richard is in the garden. Katie is placed. Ellie has the ward. Patrick has the water. Benjy has the names. Simone, eight light-years sternward, has the door. The accounting settles her like a hand on the shoulder.",on:{touch:"The distant cylinder has no surface here. Her gesture finds instead the certainty of lit windows and lives continuing inside them."}};
SCENERY.light4={name:"light",alias:["shore","memory of a shore","shore2","threshold","radiance2"],desc:"It does not come from anywhere. She has given up mentioning it, eleven votes to one, decades ago; the last holdout finally concurs.",on:{touch:"There is no surface and no temperature. The light receives the gesture as attention and seems, impossibly, to return it."}};
SCENERY.threshold_architecture={name:"threshold architecture",alias:["architecture","walls","wall","here","cradle","spars","house","distance"],desc:"Architecture appears when Nicole asks for it: walls without enclosure, a shore without water, and far away a cradle of spars holding the lit cylinder of home.",
  on:{touch:"Her hand meets no cold alien surface. Wall, cradle, and spar persist only as long as attention needs a shape for them."}};
SCENERY.threshold_memory={name:"remembered life",alias:["memory","body","garden","husband","richard","hands","pulse","door","scarf","red-and-gold scarf","red and gold scarf","brass robot","small brass robot","robot","key","lock","names","wall of names"],desc:"Her body rests in the garden with Richard; her empty hands remember his. The scarf, a brass robot's bow, a key turning in a lock, and names watered in a garden remain present without needing objects. The pulse beneath the light is becoming a direction, a door held open rather than a mechanism to inspect.",
  on:{touch:"Memory supplies contact without pretending it is matter: Richard's hand, garden air, scarf cloth, brass weight, the turn of a key, the pulse of a door becoming direction.",
      read:"The names are not written here, but memory reads them in the garden wall: the dead kept present, the living carried forward, every name Benjy watered until remembrance became a place."}};
WORLD.pl_shore.scenery.push("threshold_memory");
WORLD.pl_shore.onCmd=function(verb,obj){
  if(verb==="touch"&&obj&&obj.kind==="char"&&obj.id==="eagle"){
    out("Nicole reaches toward the Eagle's gold eyes. It inclines its head into the gesture: no skin, no pulse, only faint warmth and an attention so complete it becomes a kind of contact.");
    endTurn(); return true;
  }
  return false;
};
const _eagleDesc=CHARS.eagle.desc;
CHARS.eagle.desc=function(){ return S.act===4?"The Eagle remains beside her, gold-eyed and patient. Nicole's body is elsewhere, resting in the garden in Richard's keeping; what stands here is the memory of a woman, accompanied at the threshold.":val(_eagleDesc); };
const _eagleSuggest=CHARS.eagle.suggest;
CHARS.eagle.suggest=function(){
  if(S.act===4||S.phase==="postlude") return ["God","Rama","her family","the purpose"];
  return typeof _eagleSuggest==="function"?_eagleSuggest():_eagleSuggest;
};
postludeInventory = function(){
  outSys("She is carrying:");
  out("— her father's scarf, red and gold, which was in the garden with her body and is somehow also here, because some belongings are not stored in objects;");
  out("— the weight of a small brass robot bowing on a foredeck;");
  if(F().borzovPath==="operated") out("— the sound of thin fierce applause through a hut wall, under a sky sixteen kilometers deep;");
  else if(F().borzovPath==="evacuated") out("— the memory of a hard climb chosen over a proud one, and a man alive at the top of it;");
  if(F().francescaConfronted) out("— one plain account, spoken once for the record, and the silence it bought on a clean channel;");
  if(S.eagleAnswers.fear==="refuse") out("— an unanswered question about endings, held in reserve for exactly now;");
  if(S.habitat.garden==="yes") out("— a green place with names on a wall, watered faithfully by her gentlest child;");
  if(F().voteStand==="honestly"||F().trialStand==="honestly") out("— the town's face at the moment it decided to survive;");
  if(F().rescuer==="katie") out("— a key turning in a lock at midnight, held by a daughter who kept the feathers;");
  out("— and the sound of her name in Richard's voice, the way he said it the first morning of the world.");
  outSys("(That is everything, and it is not a small list.)");
};
CHARS.eagle.finalAsk=function(topic){
  if(F().finalAsked) { out("The Eagle inclines its head: the question was one, and it has been spent well. The light is beginning to feel less like a place and more like a direction."); return endTurn(); }
  F().finalAsked=true;
  const opening = S.eagleAnswers.fear==="honestly" ?
    "\"You told me once,\" the Eagle says, \"that your species dies, and and so tells stories longer than itself. You were standing in one, you said. You still are. It does not end here; it widens.\"" :
    S.eagleAnswers.fear==="refuse" ?
    "\"You told me once to ask you about endings when it was closer.\" The gold eyes hold hers. \"It is closer. And I find, Nicole, that you have already answered — you answered with the whole of the intervening years.\"" :
    "\"You gave me, once, your species' noble account of endings,\" the Eagle says. \"I have carried it up the hierarchy. Annotated: *the witness undersold it.*\"";
  out(opening);
  if(topic==="god"){
    out("\"You ask what Michael asked, every day, with his coffee.\" A pause that is not evasion but *placement*. \"Here is everything I am permitted, and it is more than I have ever said: the hierarchy above me does not end at any level I can see, and at every level I *can* see, the instruction set reduces to a single operation, performed at scale, without exception, on everything that suffers and hopes.\" The Eagle's voice does not change, and changes everything: \"The operation is *attention*. Whether attention at sufficient depth is what your species means by *love* is the open question the Nodes were built to close. You, Nicole — your file — you are evidence for.\"");
  } else if(topic==="rama"){
    out("\"Rama is a question your universe asked itself,\" the Eagle says. \"Are the makers of tools also the keepers of each other? It has been asked, in this format, of one thousand four hundred and six species. Some burn the questionnaire. Some worship it. Some — very few — move in, raise children, mend what sickens, plant names in a garden, and teach the landlords their word for *begin*.\" The gold eyes hold something that in any face less engineered she would chart, professionally, as pride. \"The instrument's final reading on your species is disputed. Your household's reading is not.\"");
  } else if(topic==="family"){
    out("\"Watch,\" says the Eagle, and the lit windows of the far cylinder come gently closer, one by one: Richard in the banded garden, planting a lamp at her grave like a seedling, already — she laughs, weightless — already improving its wiring. Ellie, sleeves rolled, teaching a second generation to read a fever's grammar. Patrick at his gauges; Benjy watering the wall of names, telling them, one by one, today's news. Katie in the bright quarter, placed, keeping a feather in a locked drawer and the drawer's key on a chain. And far sternward, at a door between species, a grave woman with her mother's stillness, keeping the light on. \"They do not require your worry,\" the Eagle says. \"They are, every one, already what you were for them. That is how your species stores its dead, Nicole. In the living. It is the finest data architecture we have yet catalogued.\"");
  } else {
    out("\"The purpose.\" The Eagle is silent for three full seconds, and she understands the silence now: not computation — *permission*, sought and granted. \"At the top of every hierarchy we can observe, the purpose of the gathering is this: the universe is young, and lonely, and does not yet know what it will be when it grows up. It is assembling — carefully, at the speed of ships and patience — a memory of every way that matter has learned to care. Against what, we are not told. *For* what, you have spent seventy years demonstrating.\" The gold eyes close, once, deliberately: the only bow its body can make. \"You were never the subject of the study, Nicole des Jardins. You were the finding.\"");
  }
  out("The light is a direction now. Somewhere ahead of her — prepositions have stopped insisting, but *ahead* survives — the pulse she has heard beneath everything is resolving into what it always was: not tide, not heart. A door, being held open. She takes one step, and it is exactly like beginning.");
  finishGame(topic);
  return null;
}
function finishGame(ending){
  S.ending=ending;
  S.ended=true;
  outFin("THE END");
  autosave();
}

/* ---------------- THINK & HINTS (Acts II–IV) ---------------- */
Object.assign(THINK,{
  act2_voyage:"Years underway, a family grown, and Richard hovering about something in the atrium, east of the lair. Humor him. It's usually worth it.",
  katie_lost:"Katie is somewhere in the Avian Vertical — north of the lair — alone. Go. Now. Sound carries in that shaft.",
  act2_node_wait:"Katie is safe; Sirius is close. The family's world is about to get a second act. Live in it a little — the answer will arrive on its own schedule.",
  act2_arrival:"A corridor of light has opened from the lair. OUT, then. All of them together.",
  act2_eagle:"The Eagle receives questions in the pearl hall. Ask it everything — and when she's ready to be the one examined, TELL THE EAGLE ABOUT HUMANITY.",
  act2_interview:"The Eagle has asked; the choosing is also an answer. HONESTLY, CURATED, or REFUSE.",
  act2_settled:"The Node has opened its doors: the gallery north, the Tailor's Room east, quarters west. See it all. Especially the gallery — the children deserve the window.",
  simone_fever:"Simone burns in the quarters (west); the answer is east, in the Tailor's Room, behind a phrase of three colors Rama has been teaching them for years: red, blue, green.",
  act2_settled2:"The atelier is open, south of the hall — New Eden waits on her parameters.",
  act2_request_wait:"The design is set. The Eagle has one more thing to say — ASK THE EAGLE ABOUT WHAT COMES NEXT, when the family is braced for it.",
  act2_farewell:"A month of goodbyes. Talk to Simone. Talk to Michael. Talk to everyone. Then OUT, to the hangar, when ready — knowing that no one ever is.",
  act3_open:function(){ const p=[]; if(!F().serumDone) p.push("the RV-41 ward (the clinic, east of the plaza)"); if(!F().waterDone) p.push("the water (Patrick, at the plaza well-house)"); if(F().voteCalled&&!F().voteDone) p.push("the assembly (the hall, north)"); if(F().richardMissing&&!F().readNote) p.push("Richard's note (at home)"); return p.length?("Pressing: "+p.join("; ")+".") : "The colony holds its breath between crises. Family is also a clinic: Benjy at home, Ellie at the ward, Patrick at the plaza, Katie in Vegas."; },
  act3_serum:"The dispensary speaks the old language: PUSH RED, then BLUE, then GREEN. Then medicine can start being medicine again.",
  act3_alloc:"Not enough serum, all at once, for everyone: allocate to the SICKEST first, the CHILDREN first, or by public LOTTERY. Each is defensible. Each has a bill.",
  act3_vote:"Election eve, at the hall north of the plaza. The horseshoe wants a speech: HONESTLY, CURATED, or REFUSE the floor.",
  act3_trial:"Her own hall, turned courtroom. One statement: HONESTLY, CURATED, or REFUSE. The verdict is written; the record is not.",
  act3_escape:function(){ return F().cellOpen?"The service door stands open: OUT, into the original dark, north across the old plain — the route she has walked in two other lives.":"Held at the gatehouse. The night is long, and this town has more Wakefields in it than the warrant counted. WAIT."; },
  act3_sanctuary:function(){ return F().grillOpened?"Below the world, among the landlords, with Richard. Talk. Rest. And when she is truly ready — SLEEP.":"The old address: down the latticed way, to the gallery with the painted wall. Three colors, Rama's oldest order, at the grill."; },
  act3_twilight:"Rest now.",
  postlude:"One question was always reserved for her. ASK THE EAGLE — ABOUT GOD, ABOUT RAMA, ABOUT HER FAMILY, or ABOUT THE PURPOSE."
});
Object.assign(HINTS,{
  act2_voyage:["Richard wants her in the atrium, east of the lair.","GO EAST from the lair; EXAMINE the display wall.","EAST, then EXAMINE SCREEN. Destiny has coordinates now."],
  katie_lost:["North, to the Avian Vertical. Fast.","In the shaft, sound is the searchlight.","GO NORTH from the lair, then SHOUT."],
  act2_node_wait:["Nothing is stuck; the story is inbound. Spend a few turns as a family.","Talk to the children; look at things; WAIT.","WAIT a few turns. Rama is decelerating toward the answer."],
  act2_arrival:["The lair has a new exit.","OUT, from the lair, into the corridor of light.","GO OUT. Bring everyone; the game already did."],
  act2_eagle:["Curiosity is the whole assignment: ASK THE EAGLE ABOUT the Node, Rama, its purpose, itself.","When ready to be questioned in return: TELL THE EAGLE ABOUT HUMANITY.","ASK EAGLE ABOUT anything, then TELL EAGLE ABOUT HUMANITY to begin its three questions."],
  act2_interview:["There is no wrong answer; there is only which Nicole is speaking.","HONESTLY bares the species; CURATED dresses it; REFUSE declines to speak for it.","Type HONESTLY, CURATED, or REFUSE. The Postlude remembers."],
  act2_settled:["Three doors from the pearl hall: north, east, west.","The Observation Gallery (NORTH) is the one the family will remember.","GO NORTH and stand at the window. Then wander; trouble will find her when it's time."],
  simone_fever:["The synthesizer's idle pulse is a prompt, and Rama has shown her the phrase for years.","The lair's wall. The pit tunnel. The grill. Red, blue, green.","In the Tailor's Room: PUSH RED, PUSH BLUE, PUSH GREEN. Then the machine will talk medicine."],
  act2_settled2:["The atelier is south of the hall.","Three parameters, three answers: records, margin, garden. YES or NO each time.","GO SOUTH; answer the Eagle's three questions. New Eden will be built from them — and Act III lived in them."],
  act2_request_wait:["The Eagle is waiting to be asked about the future.","ASK THE EAGLE ABOUT WHAT COMES NEXT.","ASK EAGLE ABOUT NEXT. Sit down first."],
  act2_farewell:["Goodbyes are content, not obstacles: SIMONE, MICHAEL, the children.","When ready: OUT, at the hangar.","TALK TO SIMONE. TALK TO MICHAEL. Then GO OUT from the hangar, and forgive the game."],
  act3_open:["THINK lists what's pressing; the map is small and the troubles are labeled.","Clinic east; well-house at the plaza; Vegas northeast; home south. Family in all four.","Work the list: the clinic's dispensary; Patrick's water; then the hall when the assembly is called."],
  act3_serum:["The dispensary's pulse is the same old greeting.","Red. Blue. Green. In that order.","PUSH RED, PUSH BLUE, PUSH GREEN at the dispensary."],
  act3_alloc:["Triage is a values question wearing a clinical coat.","SICKEST is medicine's oldest answer; CHILDREN is a mother's; LOTTERY is a citizen's.","Type SICKEST, CHILDREN, or LOTTERY."],
  act3_vote:["The hall is north of the plaza; the speech is one word.","HONESTLY names the man; CURATED serves the town; REFUSE lets silence testify.","Type HONESTLY, CURATED, or REFUSE. The count is not the point; the record is."],
  act3_trial:["Same three doors as every hard room this year.","Her statement shapes what the town does after — and one line of the ending.","Type HONESTLY, CURATED, or REFUSE."],
  act3_escape:["Cells in this colony have more exits than the architect filed.","WAIT for midnight; this family does not leave people in rooms.","WAIT. When the door opens: OUT, then NORTH across the plain, EAST to the old camps, and the shore beyond."],
  act3_sanctuary:["The route is a memory: plain, camp, shore, sea, island, lattice, down.","At the grill: the phrase Rama has been teaching her since the pit.","PUSH RED, PUSH BLUE, PUSH GREEN at the grill. Then, when whole: SLEEP."],
  act3_twilight:["SLEEP.","SLEEP.","SLEEP. It has been a long seventy years, and the last room is lit."],
  postlude:["One question, four doors: GOD, RAMA, FAMILY, PURPOSE.","There is no best answer; there is the one Nicole would ask.","ASK EAGLE ABOUT GOD / RAMA / FAMILY / PURPOSE. Then let go of the keyboard gently."]
});

CHARS.richard.askDefault="Richard cocks his head, genuinely trying, then shrugs with his whole body. \"Outside my wheelhouse — and you know the acreage of my wheelhouse.\"";
CHARS.michael.askDefault="Michael turns it over with theological patience. \"I'd be guessing,\" he says, \"and I try to save my guessing for God.\"";
CHARS.francesca.askDefault="Francesca gives the on-camera smile. \"Darling, if I knew that, you'd have heard it on my feed already.\"";
CHARS.borzov.askDefault="Borzov grunts. \"Ask me about crews, ships, or discipline, Doctor. My expertise thins rapidly beyond the hull.\"";
CHARS.eagle.askDefault="\"That is not mine to give,\" the Eagle says — which she has learned translates as *filed above both our clearances*.";
CHARS.simone.askDefault="Simone considers it with her whole stillness, then shakes her head once. \"I don't know yet, maman.\" The *yet* is the whole of her.";
CHARS.katie.askDefault=function(){ return S.act===3?"Katie's eyes flick to the floor cameras and back. \"Wrong room for that question, maman.\"":"Katie shrugs, already in motion. \"Dunno. Race you to the shaft?\""; };
CHARS.ellie.askDefault="Ellie flips mentally through her charts and comes up empty. \"Unknown etiology,\" she says. \"I hate those.\"";
CHARS.patrick.askDefault="Patrick frowns at it like a schematic with a page missing. \"No data, maman. Give me a day and a manual.\"";
CHARS.benjy.askDefault="Benjy thinks about it for a long, unhurried while, and then says, kindly, \"I don't know.\" It is somehow the most complete answer of her week.";
CHARS.nakamura.askDefault="Nakamura's smile prices the question and declines to purchase. \"Outside my portfolio, Councilor.\"";
CHARS.octos.askDefault="The colors ripple politely — a whole considered sentence, in a language she owns three words of.";
CHARS.tabori.askDefault="Tabori spreads his hands. \"Above my pay grade, which is a crowded altitude on this expedition.\"";
registerActOneEvents();
registerActTwoEvents();
registerFeverEvent();
registerActThreeEvents();
} /* end defineWorld */
function resetWorld(){ EVENTS.length=0; defineWorld(); }
