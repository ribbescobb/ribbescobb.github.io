"use strict";

(function installRamaBookStory(global){
  const art={
    stair:{src:"assets/alpha-stairway.png",alt:"Nicole descends the immense Alpha stairway into Rama."},
    storm:{src:"assets/storm-crossing.png",alt:"Nicole secures a boat during a storm on the Cylindrical Sea."},
    eagle:{src:"assets/node-eagle.png",alt:"Nicole meets the Eagle beneath the Node's star maps."},
    family:{src:"assets/family-fever.png",alt:"Nicole examines a feverish child in the family quarters."},
    escape:{src:"assets/service-escape.png",alt:"Nicole opens a service grate in the detention room."},
    threshold:{src:"assets/postlude-threshold.png",alt:"Nicole and the Eagle face four paths beyond ordinary time."},
    biotLondon:{src:"assets/biot-london.png",alt:"Nicole studies an alien maintenance machine near the survey sheds of London."},
    medicalHut:{src:"assets/medical-hut.png",alt:"Nicole tends Borzov in the expedition medical hut."},
    rescueCable:{src:"assets/rescue-cable.png",alt:"Nicole reaches for Falstaff's rescue cable in a deep service shaft."},
    sanctuaryLights:{src:"assets/sanctuary-lights.png",alt:"Nicole and the Eagle face the three circular controls of an alien sanctuary."},
    newEden:{src:"assets/new-eden-politics.png",alt:"Nicole faces the human politics of New Eden beneath Rama's curving interior."},
    returnSkiff:{src:"assets/return-skiff.png",alt:"Nicole and Richard wait beside a small skiff at New York's dark dock."},
    familyLair:{src:"assets/family-lair.png",alt:"Nicole finds a tender human refuge inside an alien machine chamber."},
    failureMachines:{src:"assets/failure-machines.png",alt:"An indifferent alien maintenance machine closes around a tiny human figure."},
    failureWeather:{src:"assets/failure-weather.png",alt:"A small skiff fights towering artificial waves inside Rama."},
    failureHuman:{src:"assets/failure-human.png",alt:"A lonely figure faces the human consequences of a road not taken."},
    stairwayDescent:{src:"assets/stairway-descent.png",alt:"Nicole descends Rama's immense stairway past an open maintenance hatch."},
    centralPlain:{src:"assets/central-plain.png",alt:"Nicole gathers a soil sample at the foot of Alpha."},
    londonSlot:{src:"assets/london-slot.png",alt:"Nicole photographs a repeating maintenance slot outside the London survey camp."},
    pitAftermath:{src:"assets/pit-aftermath.png",alt:"Nicole assesses the service pit after the storm."},
    blackSeaCrossing:{src:"assets/black-sea-crossing.png",alt:"Nicole looks toward the Node from a battered expedition boat."},
    failureSlot:{src:"assets/failure-slot.png",alt:"An alien maintenance slot closes with impersonal finality."},
    failureStorm:{src:"assets/failure-storm.png",alt:"Nicole braces as an artificial storm breaks over the expedition boat."},
    failurePit:{src:"assets/failure-pit.png",alt:"A lone climber hangs in a vast service shaft."},
    failureCable:{src:"assets/failure-cable.png",alt:"Nicole's hand misses the swinging rescue cable by inches."},
    eagleQuestions:{src:"assets/eagle-questions.png",alt:"Nicole and the Eagle face one another beneath a living star map."},
    habitatChoice:{src:"assets/habitat-choice.png",alt:"Nicole weighs three possible futures for human settlement in Rama."},
    failureNode:{src:"assets/failure-node.png",alt:"Nicole faces a sealed Node door as a chance for understanding passes."},
    failureSanctuary:{src:"assets/failure-sanctuary.png",alt:"The sanctuary door opens with unstoppable alien force."},
    simoneFever:{src:"assets/simone-fever.png",alt:"Nicole sits beside Simone during the fever."},
    electionCount:{src:"assets/election-count.png",alt:"Nicole addresses New Eden's gathered settlers during the count."},
    foldedNote:{src:"assets/folded-note.png",alt:"Nicole discovers a folded note in her dark clinic."},
    humanPuzzle:{src:"assets/human-puzzle.png",alt:"Nicole speaks before a crowded improvised court."},
    serviceDark:{src:"assets/service-dark.png",alt:"Nicole crawls through the forked service tunnel by failing lantern light."},
    gatehouseRescue:{src:"assets/gatehouse-rescue.png",alt:"Patrick and Ellie prepare the rescue cable beyond the gatehouse grille."},
    familyLairRest:{src:"assets/family-lair-rest.png",alt:"Nicole finds the prepared bed at the heart of the family's lair."},
    failureFever:{src:"assets/failure-fever.png",alt:"A child’s room falls quiet after a choice came too late."},
    failureCell:{src:"assets/failure-cell.png",alt:"Nicole watches clinic files leave through a barred detention door."},
    failureGatehouse:{src:"assets/failure-gatehouse.png",alt:"Nicole reaches for a rescue cable that stops just beyond her grasp."},
    failureGrill:{src:"assets/failure-grill.png",alt:"An alien grille becomes an active defensive circuit."},
    endingGod:{src:"assets/ending-god.png",alt:"Nicole and the Eagle face a vast star-patterned intelligence beyond Rama."},
    endingRama:{src:"assets/ending-rama.png",alt:"Nicole accepts the serene world within Rama as enough."},
    endingFamily:{src:"assets/ending-family.png",alt:"Nicole and the people she carried with her share the shore beyond time."},
    endingPurpose:{src:"assets/ending-purpose.png",alt:"Nicole faces four distinct paths across the shore beyond ordinary time."}
  };

  const nodes={
    warning:{page:1,act:"Before you begin",title:"WARNING!",text:[
      "Do not read this book straight through from beginning to end. These pages contain many different voyages through Rama. From time to time you will be asked to make a choice. Choose, then turn to the page indicated.",
      "You are Nicole des Jardins: physician, explorer, mother, and—on this morning—the first person through an airlock no human being built. Some choices lead onward. Others lead to THE END.",
      "There is no score. Curiosity is useful. Certainty is dangerous. Keep one finger on the page you came from if you do not trust yourself."
    ],choices:[{label:"Enter Rama",to:"airlock"}]},

    airlock:{page:3,act:"Act I — Rama",title:"The Alpha Airlock",art:art.stair,text:[
      "The chamber is the size of a chapel and almost weightless. Beyond its inner door, a stairway descends along the axis of a world. Fifty kilometers of landscape curve around you until land becomes sky.",
      "Richard's voice asks you to wait for the full survey party. The open door makes no sound at all."
    ],choices:[
      {label:"Begin the descent alone",to:"stairway",set:{bold:true}},
      {label:"Obey Richard and wait for authorization",to:"failure_missed"}
    ]},

    stairway:{page:7,act:"Act I — Rama",title:"Ten Thousand Steps",art:art.stairwayDescent,text:[
      "Gravity gathers one patient gram at a time. The stair coils beneath you; the black Cylindrical Sea hangs impossibly overhead. Halfway down, a narrow maintenance hatch stands ajar.",
      "The hatch is close. The plain below is still thousands of steps away."
    ],choices:[
      {label:"Continue toward the Central Plain",to:"plain"},
      {label:"Crawl through the maintenance hatch",to:"failure_fall"}
    ]},

    plain:{page:11,act:"Act I — Rama",title:"The Foot of Alpha",art:art.centralPlain,text:[
      "The ground resembles dark metal loam scored by parallel grooves. A delicate many-legged machine crosses the distance without acknowledging you. Your orders are to sample the ground and document any machine you can approach safely.",
      "The machine will soon vanish behind a ridge."
    ],choices:[
      {label:"Take the soil sample first",to:"biot",set:{sample:true}},
      {label:"Run directly into the machine's path",to:"failure_biot"}
    ]},

    biot:{page:15,act:"Act I — Rama",title:"A Machine That Lives",art:art.biotLondon,text:[
      "Your sampler seals a curl of metallic soil. The many-legged machine pauses beside a shallow slot cut into the plain. Its limbs are too graceful for a robot and too exact for an animal.",
      "You raise the expedition camera. One of its bright sensor clusters turns toward you."
    ],choices:[
      {label:"Photograph it from a careful distance",to:"london",set:{biotPhoto:true}},
      {label:"Touch its polished shell",to:"failure_biot"}
    ]},

    london:{page:18,act:"Act I — Rama",title:"London",art:art.londonSlot,text:[
      "The expedition has named a fenced geometry of sheds and drums LONDON. At its edge, the same narrow slot appears beneath a black panel. Your photograph will prove the pattern repeats.",
      "The slot is just wide enough for your hand."
    ],choices:[
      {label:"Photograph the slot and return to camp",to:"borzov",set:{slotPhoto:true}},
      {label:"Reach inside the slot",to:"failure_slot"}
    ]},

    borzov:{page:22,act:"Act I — Rama",title:"The Medical Hut",art:art.medicalHut,text:[
      "Borzov lies curled on the examination table, one hand pressed to his abdomen. The scanner shows a moving shadow no human anatomy should contain. Evacuation may save him. Immediate surgery may save the expedition's only chance to understand what happened.",
      "Borzov opens his eyes. “Your decision, Doctor.”"
    ],choices:[
      {label:"Operate now",to:"storm",set:{borzov:"treated"}},
      {label:"Order his evacuation",to:"storm",set:{borzov:"evacuated"}},
      {label:"Leave him and continue the survey",to:"failure_neglect"}
    ]},

    storm:{page:27,act:"Act I — Rama",title:"The Cylindrical Storm",art:art.storm,text:[
      "Rama manufactures weather with no warning. Wind strikes Camp Alpha hard enough to lift crates. The expedition boat bucks at its mooring while waves build on the inland sea.",
      "Michael shouts that the boat must be secured. The medical hut shudders behind you."
    ],choices:[
      {label:"Tie down the boat before the storm peaks",to:"pit",set:{boat:"secured"}},
      {label:"Stay with the injured and sacrifice the boat",to:"pit",set:{boat:"damaged"}},
      {label:"Launch immediately and outrun the weather",to:"failure_storm"}
    ]},

    pit:{page:32,act:"Act I — Rama",title:"The Pit",art:art.pitAftermath,text:[
      "The storm throws you into a dark service pit. Your suit reports blood loss. Above, the opening is already shrinking behind blown debris. Your scanner and medical kit survived the fall.",
      "A pale light moves somewhere below."
    ],choices:[
      {label:"Scan and treat yourself before climbing",to:"rescue",set:{selfTreated:true}},
      {label:"Climb immediately while strength remains",to:"failure_pit"}
    ]},

    rescue:{page:36,act:"Act I — Rama",title:"The Cable",art:art.rescueCable,text:[
      "A cable snakes down from the storm-dark opening. Falstaff, the expedition robot, flashes a light above. The cable end swings beyond easy reach.",
      "Your treated side aches when you stand."
    ],choices:[
      {label:"Signal Falstaff to lower the cable",to:"sea"},
      {label:"Leap across the pit and seize it",to:"failure_cable"}
    ]},

    sea:{page:40,act:"Act I — Rama",title:"Across the Black Sea",art:art.blackSeaCrossing,text:[
      "The storm passes. Beyond the water, a light has appeared where no expedition lamp should be. The Node waits on the far shore.",
      "Your boat is battered, but it floats. The choice is no longer whether Rama wants you to cross. It is whether you are willing to answer."
    ],choices:[
      {label:"Repair what you can and cross",to:"node",set:{crossed:true}},
      {label:"Remain at Camp Alpha until the mission ends",to:"failure_missed"}
    ]},

    node:{page:45,act:"Act II — The Node",title:"A Door Without Hinges",art:art.eagle,text:[
      "The Node receives you as if it has expected your weight. A display fills with symbols that rearrange themselves around your reflection. A passage opens toward a chamber full of moving stars.",
      "A second passage descends into absolute dark."
    ],choices:[
      {label:"Study the display before moving on",to:"interview",set:{displayRead:true}},
      {label:"Descend into the unlit passage",to:"failure_node"}
    ]},

    interview:{page:49,act:"Act II — The Node",title:"The Eagle's Questions",art:art.eagleQuestions,text:[
      "The being waiting beneath the star maps is taller than any human. Feathers cover a body built with the severe economy of a machine. You call it the Eagle because you need some word for it.",
      "It asks what humanity fears. A diplomatic answer forms easily. The truth is harder."
    ],choices:[
      {label:"Answer honestly",to:"sanctuary",set:{honest:true}},
      {label:"Tell it what you think it wants to hear",to:"failure_node"}
    ]},

    sanctuary:{page:54,act:"Act II — The Node",title:"Three Colored Lights",art:art.sanctuaryLights,text:[
      "The Eagle leads you to a sealed sanctuary. Three lights—red, blue, green—pulse in a sequence that echoes the display. Behind the door, something taps once and waits.",
      "The pattern repeats: red, blue, green."
    ],choices:[
      {label:"Press red, then blue, then green",to:"habitat",set:{sanctuary:true}},
      {label:"Force the door before the pattern changes",to:"failure_sanctuary"}
    ]},

    habitat:{page:58,act:"Act II — The Node",title:"A Place for Humans",art:art.habitatChoice,text:[
      "The Node offers a design problem instead of an explanation. You can preserve a perfect copy of Earth, build a garden adapted to Rama, or refuse to choose for people not yet born.",
      "The Eagle watches without judgment."
    ],choices:[
      {label:"Design a living garden that can change",to:"clinic",set:{habitat:"adaptive"}},
      {label:"Preserve Earth exactly as memory",to:"clinic",set:{habitat:"curated"}},
      {label:"Refuse to decide for future settlers",to:"clinic",set:{habitat:"refused"}}
    ]},

    clinic:{page:63,act:"Act III — Return",title:"The Serum",art:art.family,text:[
      "Years pass. Humans have built cities inside Rama and imported every old argument with them. A fever spreads through New Eden. Your clinic has enough serum for one group before the next batch is ready.",
      "The sickest may die first. Children have the most years to lose. A lottery is the only rule nobody designed to favor themselves."
    ],choices:[
      {label:"Treat the sickest first",to:"family",set:{serum:"sickest"}},
      {label:"Treat the children first",to:"family",set:{serum:"children"}},
      {label:"Use a public lottery",to:"family",set:{serum:"lottery"}}
    ]},

    family:{page:68,act:"Act III — Return",title:"Simone's Fever",art:art.simoneFever,text:[
      "Simone burns with fever in the family quarters. Benjy has drawn the whole household beneath Rama's artificial sun. Richard asks you to be her physician. Simone asks you to be her mother.",
      "The serum may work, but only if you act before the fever turns."
    ],choices:[
      {label:"Treat Simone now and remain beside her",to:"water",set:{simone:"cured"}},
      {label:"Wait for a second opinion from the council",to:"failure_fever"}
    ]},

    water:{page:73,act:"Act III — Return",title:"Who Owns the Water?",art:art.newEden,text:[
      "Patrick has found a way to reroute the settlement's water around Nakamura's private control station. Doing it quietly will keep the clinic alive. Exposing the scheme publicly might change the city—or start a war.",
      "The pipes hum beneath the floor."
    ],choices:[
      {label:"Help Patrick reroute the water",to:"election",set:{water:"rerouted"}},
      {label:"Confront Nakamura in public",to:"election",set:{water:"confronted"}},
      {label:"Do nothing and protect your position",to:"failure_fever"}
    ]},

    election:{page:77,act:"Act III — Return",title:"The Count",art:art.electionCount,text:[
      "The settlement gathers to choose what kind of government survives inside an alien world. Your endorsement could decide the count. So could one honest description of what the clinic has seen.",
      "Every face turns toward you."
    ],choices:[
      {label:"Tell the truth without endorsing anyone",to:"note",set:{vote:"honest"}},
      {label:"Trade your endorsement for clinic protection",to:"note",set:{vote:"alliance"}}
    ]},

    note:{page:81,act:"Act III — Return",title:"The Folded Note",art:art.foldedNote,text:[
      "After the count, Nakamura disappears. A folded note lies beneath your clinic door. It names the gatehouse, a detention room, and a trial already arranged.",
      "Richard wants to confront the council immediately."
    ],choices:[
      {label:"Read every line and go to the trial",to:"trial",set:{noteRead:true}},
      {label:"Destroy the note and confront the council",to:"cell"}
    ]},

    trial:{page:86,act:"Act III — Return",title:"The Human Puzzle",art:art.humanPuzzle,text:[
      "The charge is treason. The evidence is that you treated people without asking who owned the medicine, the water, or the city. The room is full of people you saved and people who believe saving them made you dangerous.",
      "You can defend your actions or refuse the court's premise."
    ],choices:[
      {label:"Describe every decision plainly",to:"cell",set:{trial:"truth"}},
      {label:"Refuse to recognize the court",to:"cell",set:{trial:"refused"}}
    ]},

    cell:{page:91,act:"Act III — Return",title:"The Detention Room",art:art.escape,text:[
      "The door is locked. The barred window is not. Beneath a bench, a service grate carries warm air from passages older than the city.",
      "Boots stop outside your door."
    ],choices:[
      {label:"Open the service grate",to:"service",set:{escaped:true}},
      {label:"Wait for the legal process to work",to:"failure_cell"}
    ]},

    service:{page:95,act:"Act III — Return",title:"Service Dark",art:art.serviceDark,text:[
      "The passage forks beneath the gatehouse. Air moves from the left. Water sounds against metal on the right. Behind you, someone lifts the grate.",
      "Your lantern is failing."
    ],choices:[
      {label:"Follow the moving air",to:"gatehouse"},
      {label:"Follow the sound of water",to:"failure_service"}
    ]},

    gatehouse:{page:99,act:"Act III — Return",title:"The Gatehouse",art:art.gatehouseRescue,text:[
      "Patrick and Ellie wait beyond the final grille with a coil of cable. Guards cross the platform above. One clean signal will tell your friends when to pull.",
      "Or you can climb alone before anyone else is endangered."
    ],choices:[
      {label:"Signal Patrick and Ellie",to:"return",set:{rescued:true}},
      {label:"Climb alone",to:"failure_gatehouse"}
    ]},

    return:{page:104,act:"Act III — Return",title:"The Waiting Skiff",art:art.returnSkiff,text:[
      "The skiff waits at New York's dark dock. The route back to Alpha is open for a few minutes. Behind you is the human city you helped shape. Ahead is the oldest unopened chamber in Rama.",
      "Richard asks whether you are coming home."
    ],choices:[
      {label:"Enter the skiff and return to Alpha",to:"grill"},
      {label:"Remain in New Eden",to:"failure_remain"}
    ]},

    grill:{page:108,act:"Act III — Return",title:"The Last Machine",art:art.familyLair,text:[
      "At Alpha, three colored controls guard a black grille: red, blue, green. The sequence has followed you from the Node like a sentence waiting for its final word.",
      "Something moves beyond the grille."
    ],choices:[
      {label:"Press red, blue, green",to:"lair"},
      {label:"Force the grille",to:"failure_grill"}
    ]},

    lair:{page:112,act:"Act III — Return",title:"The Family's Lair",art:art.familyLairRest,text:[
      "Beyond the grille, the machine world becomes a home. Small objects have been arranged with care. A place has been prepared for sleep. Rama's deepest answer may require you to stop demanding one.",
      "For the first time since the airlock, nobody is waiting for your decision."
    ],choices:[
      {label:"Sleep",to:"threshold",set:{lair:true}},
      {label:"Stay awake and keep watch",to:"failure_lair"}
    ]},

    threshold:{page:117,act:"Postlude — Nicole",title:"The Shore Beyond",art:art.threshold,text:[
      "You wake older, or younger, or simply beyond the usefulness of either word. The Eagle stands beside a sea that remembers every sea. Your hands are empty. Your choices are not.",
      "It asks what gave the voyage meaning. Four answers open like paths across the water."
    ],choices:[
      {label:"A greater mind called us forward",to:"ending_god"},
      {label:"Rama itself was the answer",to:"ending_rama"},
      {label:"The people we carried with us",to:"ending_family"},
      {label:"We made meaning by choosing",to:"ending_purpose"}
    ]},

    ending_god:{page:121,act:"One true conclusion",title:"The Mind Beyond the Machine",art:art.endingGod,ending:"god",text:[
      "You tell the Eagle that intelligence is a door, not a throne—that every opened world implies another mind beyond it. The stars above the water rearrange themselves into a question you cannot yet read.",
      "You step forward anyway.","THE END"
    ]},
    ending_rama:{page:123,act:"One true conclusion",title:"The World Was Enough",art:art.endingRama,ending:"rama",text:[
      "You say that Rama needed no purpose beyond its existence. It crossed darkness, carried life, and made wonder measurable. The Eagle bows its long head.",
      "For once, you let the mystery remain larger than its explanation.","THE END"
    ]},
    ending_family:{page:125,act:"One true conclusion",title:"What We Carried",art:art.endingFamily,ending:"family",text:[
      "You name Richard, Simone, Katie, Benjy, Patrick, Ellie, and everyone whose fear became responsibility. The distant doorway fills with familiar voices.",
      "The universe was never empty. You had been carrying it all along.","THE END"
    ]},
    ending_purpose:{page:127,act:"One true conclusion",title:"The Choice Itself",art:art.endingPurpose,ending:"purpose",text:[
      "You tell the Eagle there was no answer waiting to be discovered. Meaning accumulated each time you chose despite incomplete knowledge. The unfinished road brightens.",
      "You take the next step before the question is finished.","THE END"
    ]},

    failure_missed:{page:13,act:"A sudden ending",title:"The Door Closes",art:art.failureHuman,ending:"failure",text:["Authorization arrives six hours later. The inner door does not open again. Rama continues through the Solar System, carrying every unanswered question with it.","THE END"]},
    failure_fall:{page:9,act:"A sudden ending",title:"No Floor",art:art.failureWeather,ending:"failure",text:["The hatch contains no passage—only a shaft descending toward the spinning shell. At first the fall feels like flight. Then gravity remembers you.","THE END"]},
    failure_biot:{page:17,act:"A sudden ending",title:"Maintenance",art:art.failureMachines,ending:"failure",text:["The machine interprets your movement as damage. Six precise limbs unfold. Rama repairs the obstruction you have become.","THE END"]},
    failure_slot:{page:20,act:"A sudden ending",title:"The Slot",art:art.failureSlot,ending:"failure",text:["The panel closes without malice. The machine has accepted your hand as raw material. The expedition's report is extremely brief.","THE END"]},
    failure_neglect:{page:25,act:"A sudden ending",title:"Doctor",ending:"failure",text:["Borzov dies before sunset. The mission continues, but every later decision contains the shape of the first one you refused to make.","THE END"]},
    failure_storm:{page:30,act:"A sudden ending",title:"Weather Wins",art:art.failureStorm,ending:"failure",text:["The first wave turns the boat sideways. The second lifts it into Rama's artificial sky. Nobody ever finds the third piece.","THE END"]},
    failure_pit:{page:34,act:"A sudden ending",title:"The Last Step",art:art.failurePit,ending:"failure",text:["Halfway up, the untreated wound opens. The light below reaches you before the rescuers above.","THE END"]},
    failure_cable:{page:38,act:"A sudden ending",title:"Almost",art:art.failureCable,ending:"failure",text:["Your fingers brush the cable. For one perfect second you are certain effort will be enough. Then the pit turns beneath you.","THE END"]},
    failure_node:{page:52,act:"A sudden ending",title:"An Answer Without a Question",art:art.failureNode,ending:"failure",text:["The Node listens to the answer you perform instead of the one you believe. A door closes between species. It does not open in your lifetime.","THE END"]},
    failure_sanctuary:{page:56,act:"A sudden ending",title:"The Wrong Kind of Opening",art:art.failureSanctuary,ending:"failure",text:["The door opens outward with the patient force of continental drift. You learn, too late, why the lights were a warning rather than a lock.","THE END"]},
    failure_fever:{page:71,act:"A sudden ending",title:"The Cost of Waiting",art:art.failureFever,ending:"failure",text:["By the time the council agrees on jurisdiction, the fever has made the decision for you. Benjy takes down his drawing of the family beneath the sun.","THE END"]},
    failure_cell:{page:93,act:"A sudden ending",title:"Procedure",art:art.failureCell,ending:"failure",text:["The process works exactly as designed. At dawn you are transferred beyond the city gate. The clinic is reassigned before noon.","THE END"]},
    failure_service:{page:97,act:"A sudden ending",title:"Below the Waterline",ending:"failure",text:["The sound is not a channel. It is pressure. The old pipe splits, and the passage fills faster than any human can climb.","THE END"]},
    failure_gatehouse:{page:102,act:"A sudden ending",title:"One Pair of Hands",art:art.failureGatehouse,ending:"failure",text:["You reach the platform. The cable does not. Courage was never the same thing as leverage.","THE END"]},
    failure_remain:{page:106,act:"Another Life",title:"Citizen of Rama",ending:"failure",text:["You remain in New Eden and build a good life. Years later the last unopened chamber at Alpha opens for someone else. This is not the wrong ending—but it is the end of this book.","THE END"]},
    failure_grill:{page:110,act:"A sudden ending",title:"The Machine Defends Itself",art:art.failureGrill,ending:"failure",text:["The grille is not a barrier. It is part of a living circuit. When you strike it, the circuit completes.","THE END"]},
    failure_lair:{page:115,act:"A sudden ending",title:"The Watch",ending:"failure",text:["You keep watch until watching is the only thing left of you. The prepared bed remains empty. Some doors open only when you close your eyes.","THE END"]}
  };

  global.RamaBookStory=Object.freeze({
    id:"book-1982",
    title:"RAMA: The World Within",
    start:"warning",
    nodes:Object.freeze(nodes)
  });
})(globalThis);
