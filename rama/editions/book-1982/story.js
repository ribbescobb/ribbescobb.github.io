"use strict";

(function installRamaBookStory(global){
  const art={
    airlock:{"src":"assets/r2-airlock.png","alt":"Young Nicole and Richard prepare at the Alpha Airlock above Rama's barren interior."},
    stairway:{"src":"assets/r2-stairway.png","alt":"Nicole descends Alpha's immense stairway into the engineered darkness."},
    plain:{"src":"assets/r2-plain.png","alt":"Nicole takes a soil sample beside the grooves of the barren Central Plain."},
    biot:{"src":"assets/r2-biot.png","alt":"Nicole photographs a biot from a safe distance on Rama's barren plain."},
    london:{"src":"assets/r2-london.png","alt":"Nicole photographs a maintenance slot among London's seamless alien structures."},
    borzov:{"src":"assets/r2-borzov.png","alt":"Nicole examines Borzov in the field medical hut while Michael waits with a stretcher."},
    storm:{"src":"assets/r2-storm.png","alt":"Nicole secures the expedition boat at its mooring during Rama's artificial storm."},
    storm_evacuated:{"src":"assets/r2-storm-evacuated.png","alt":"An expedition crew carries Borzov up Alpha's stairway toward the shuttle."},
    pit:{"src":"assets/r2-pit.png","alt":"Nicole treats her injured side on a ledge deep inside the service shaft."},
    pit_clinic:{"src":"assets/r2-pit-clinic.png","alt":"Nicole clutches the salvaged drug case on the ledge where she fell."},
    rescue:{"src":"assets/r2-rescue.png","alt":"A rat-sized Falstaff guides the rescue line while Michael operates the winch far above Nicole."},
    sea:{"src":"assets/r2-sea.png","alt":"Nicole, Richard, and Michael watch a signal from New York across the black sea."},
    node:{"src":"assets/node-arrival-v2.png","alt":"Nicole faces the Node's unfamiliar display and its two impossible passages."},
    interview:{"src":"assets/eagle-questions-v2.png","alt":"Nicole and the Eagle face one another beneath a living star map."},
    sanctuary:{"src":"assets/r2-sanctuary.png","alt":"Nicole and the feathered Eagle stand clear of a closed sanctuary door beside three greeting controls."},
    habitat:{"src":"assets/r2-habitat.png","alt":"Nicole considers settlement designs after meeting an octospider at the Node."},
    eden_adaptive:{"src":"assets/eden-adaptive-v2.png","alt":"Older Nicole walks through New Eden's living, changing garden."},
    eden_curated:{"src":"assets/eden-curated-v2.png","alt":"Older Nicole looks over New Eden's carefully preserved orchard."},
    eden_unchosen:{"src":"assets/eden-unchosen-v2.png","alt":"Nicole joins settlers deciding the future of New Eden together."},
    clinic:{"src":"assets/r2-clinic.png","alt":"Older Nicole, Ellie, and Katie organize scarce serum in a crowded public clinic."},
    family:{"src":"assets/r2-family.png","alt":"Nicole examines her grown daughter Simone at home while Richard waits beside them."},
    family_children:{"src":"assets/r2-family-children.png","alt":"Ellie brings the next serum batch to the ward as children recover and adult patients wait."},
    family_lottery:{"src":"assets/family-lottery-v2.png","alt":"New Eden residents wait for a public medicine lottery."},
    water:{"src":"assets/r2-water.png","alt":"Patrick shows Nicole the pipes controlled by Nakamura's private water station."},
    water_rerouted:{"src":"assets/r2-water-rerouted.png","alt":"Nicole keeps watch while her young adult son Patrick reroutes the clinic's water at night."},
    water_confronted:{"src":"assets/water-confronted-v2.png","alt":"Nicole publicly confronts Nakamura over New Eden's water controls."},
    election:{"src":"assets/r2-election.png","alt":"Nicole faces the public water vote while deputies stand beside the ballot table."},
    note:{"src":"assets/r2-note.png","alt":"Nicole and Richard read Katie's warning in the clinic at night."},
    confrontation:{"src":"assets/r2-confrontation.png","alt":"Nicole destroys Katie's warning before confronting the council."},
    trial:{"src":"assets/r2-trial.png","alt":"Nicole gives evidence before the council, with Katie and Richard among the witnesses."},
    cell:{"src":"assets/r2-cell.png","alt":"Older Nicole examines the loose service grate beside a lantern in the gatehouse detention room."},
    service:{"src":"assets/r2-service.png","alt":"Nicole follows moving air through a forked service tunnel with a failing lantern."},
    gatehouse:{"src":"assets/r2-gatehouse.png","alt":"Patrick and Ellie wait with a cable beyond the gatehouse grille."},
    return:{"src":"assets/r2-return.png","alt":"Nicole, Richard, Patrick, and Ellie meet at New Eden's dock beside the escape skiff."},
    grill:{"src":"assets/r2-grill.png","alt":"Richard and Nicole wait at a closed grille, with only an octospider's shadow visible beyond it."},
    lair:{"src":"assets/r2-lair.png","alt":"An octospider welcomes Nicole and Richard into a refuge furnished with their belongings."},
    threshold:{"src":"assets/r2-threshold.png","alt":"Nicole and the feathered Eagle face four possible paths beside the sea beyond time."},
    ending_god:{"src":"assets/r2-ending-god.png","alt":"Nicole and the Eagle contemplate an immense pattern of stars above the quiet shore."},
    ending_rama:{"src":"assets/r2-ending-rama.png","alt":"Nicole and the Eagle look across the serene inhabited world inside Rama."},
    ending_family:{"src":"assets/r2-ending-family.png","alt":"Nicole recognizes Richard, Michael, and her five children beyond the distant doorway."},
    ending_purpose:{"src":"assets/r2-ending-purpose.png","alt":"Nicole takes a step along one unfinished road while the Eagle watches."},
    failure_missed:{"src":"assets/r2-failure-missed.png","alt":"Nicole continues her medical work on Earth with Rama only a memory."},
    failure_fall:{"src":"assets/failure-fall-v2.png","alt":"Nicole falls through an open maintenance hatch into Rama's immense shaft."},
    failure_biot:{"src":"assets/failure-machines.png","alt":"An indifferent alien maintenance machine closes around a tiny human figure."},
    failure_slot:{"src":"assets/failure-slot.png","alt":"An alien maintenance slot closes with impersonal finality."},
    failure_neglect:{"src":"assets/failure-neglect-v2.png","alt":"Nicole faces Borzov's empty medical cot after refusing to help."},
    failure_storm:{"src":"assets/r2-failure-storm.png","alt":"Rama's artificial storm overturns the expedition boat."},
    failure_pit:{"src":"assets/failure-pit.png","alt":"A lone climber hangs in a vast service shaft."},
    failure_cable:{"src":"assets/r2-failure-cable.png","alt":"Nicole's outstretched hand misses the rescue cable above the deep shaft."},
    failure_abandon:{"src":"assets/r2-failure-abandon.png","alt":"Nicole, Richard, and Michael safely watch Rama depart from the Newton."},
    failure_darkpassage:{"src":"assets/failure-darkpassage-v2.png","alt":"Nicole walks alone into a passage that swallows her lamp light."},
    failure_node:{"src":"assets/r2-failure-node.png","alt":"The feathered Eagle lowers its head as a door closes between Nicole and the Node."},
    failure_sanctuary:{"src":"assets/failure-sanctuary.png","alt":"The sanctuary door opens with unstoppable alien force."},
    failure_fever:{"src":"assets/r2-failure-fever.png","alt":"A room falls quiet as Benjy takes down his drawing after Simone's death."},
    failure_cell:{"src":"assets/r2-failure-cell.png","alt":"Older Nicole is escorted beyond New Eden while the clinic records are confiscated."},
    failure_service:{"src":"assets/r2-failure-service.png","alt":"Nicole struggles in a service passage filling with water from a ruptured pipe."},
    failure_gatehouse:{"src":"assets/r2-failure-gatehouse.png","alt":"Nicole reaches for the gatehouse platform while the unused rescue cable hangs beyond her."},
    failure_remain:{"src":"assets/r2-failure-remain.png","alt":"Nicole and Richard grow old above Ellie's dispensary among neighbors they have helped."},
    failure_grill:{"src":"assets/r2-failure-grill.png","alt":"A defensive circuit flashes through the closed grille as Nicole strikes it."},
    failure_lair:{"src":"assets/r2-failure-lair.png","alt":"A patrol intercepts Nicole and Richard's skiff after they turn away from the refuge."},
    voyage:{"src":"assets/r2-voyage.png","alt":"Nicole, Richard, Michael, Simone, and Katie watch Rama approach the vast Node at Sirius."},
    family_recovered:{"src":"assets/r2-family-recovered.png","alt":"Simone sits up recovering while Patrick arrives with an empty water jug."},
    twilight:{"src":"assets/r2-twilight.png","alt":"Years later, an elderly Richard holds Nicole's hand beside her bed in the refuge."},
    failure_water:{"src":"assets/r2-failure-water.png","alt":"Nicole treats permitted patients while a guard turns others away from the clinic."}
  };

  const nodes={
    warning:{page:1,act:"Before you begin",title:"WARNING!",text:[
      "Do not read this book straight through from beginning to end. These pages contain many different voyages through Rama. From time to time you will be asked to make a choice. Choose, then turn to the page indicated.",
      "You are Nicole des Jardins, the physician aboard the survey ship Newton. A second vessel called Rama has entered the Solar System: a hollow cylinder large enough to carry a sea, and old enough to have forgotten its builders. You have come to look after the expedition. You would also like to know who sent it.",
      "There is no score. Curiosity is useful. Certainty is dangerous. Keep one finger on the page you came from if you do not trust yourself."
    ],choices:[{label:"Enter Rama",to:"airlock"}]},

    airlock:{page:67,act:"Act I — Rama",title:"The Alpha Airlock",art:art.airlock,text:[
      "The Alpha Airlock is almost weightless. Beyond it, a stairway descends into engineered night; the barren interior curves overhead until land becomes sky. A supply crew has already built Camp Alpha below. Their commander, Borzov, has asked you to examine the ground on your way down.",
      "Richard Wakefield, the expedition engineer, checks your lamp and medical kit. His pocket robot Falstaff, a brass machine no larger than a rat, bows from his shoulder. The air is breathable; you leave your helmet aboard the Newton and wear your work coveralls.",
      "The survey is voluntary. You may descend while Richard finishes checking the equipment, or take the shuttle home before Rama's departure. Neither choice will keep this door open forever."
    ],choices:[
      {label:"Check your safety line and begin the survey",to:"stairway"},
      {label:"Decline the survey and return to Earth",to:"failure_missed"}
    ]},

    stairway:{page:75,act:"Act I — Rama",title:"Ten Thousand Steps",art:art.stairway,text:[
      "Gravity gathers one patient gram at a time. The stair coils beneath you; the black Cylindrical Sea hangs impossibly overhead. Halfway down, a narrow maintenance hatch stands ajar.",
      "The hatch is close. The plain below is still thousands of steps away."
    ],choices:[
      {label:"Continue toward the Central Plain",to:"plain"},
      {label:"Crawl through the maintenance hatch",to:"failure_fall"}
    ]},

    plain:{page:5,act:"Act I — Rama",title:"The Foot of Alpha",art:art.plain,text:[
      "The ground resembles dark metal loam scored by parallel grooves. A delicate many-legged machine crosses the distance without acknowledging you. Your orders are to sample the ground and document any machine you can approach safely.",
      "The machine will soon vanish behind a ridge."
    ],choices:[
      {label:"Take the soil sample first",to:"biot"},
      {label:"Run directly into the machine's path",to:"failure_biot"}
    ]},

    biot:{page:43,act:"Act I — Rama",title:"A Machine That Lives",art:art.biot,text:[
      "Your sampler seals a curl of metallic soil. Beyond the ridge, the machine stops—not for you, but to work beside a shallow slot. You follow at a safe distance. Its limbs are too graceful for a robot and too exact for an animal.",
      "You raise the expedition camera. One of its bright sensor clusters turns toward you."
    ],choices:[
      {label:"Photograph it from a careful distance",to:"london"},
      {label:"Touch its polished shell",to:"failure_biot"}
    ]},

    london:{page:15,act:"Act I — Rama",title:"London",art:art.london,text:[
      "The expedition has named a fenced geometry of sheds and drums LONDON. At its edge, the same narrow slot appears beneath a black panel. Your photograph will prove the pattern repeats.",
      "The slot is just wide enough for your hand."
    ],choices:[
      {label:"Photograph the slot and return to camp",to:"borzov"},
      {label:"Reach inside the slot",to:"failure_slot"}
    ]},

    borzov:{page:69,act:"Act I — Rama",title:"The Medical Hut",art:art.borzov,text:[
      "Back at Camp Alpha, Michael O'Toole, the expedition's pilot, meets you outside the medical hut. He has carried Borzov in from the survey. Now the commander lies curled on the examination table, one hand pressed to his abdomen.",
      "The scanner gives the plain, alarming answer: an inflamed appendix, hours from rupture. You can operate here, or send him to the Newton's surgical team. Michael has a stretcher ready; Richard brings the instruments you request.",
      "Borzov opens his eyes. “Your decision, Doctor.”"
    ],choices:[
      {label:"Operate now",to:"storm"},
      {label:"Order his evacuation",to:"storm_evacuated"},
      {label:"Leave him and continue the survey",to:"failure_neglect"}
    ]},

    storm:{page:59,act:"Act I — Rama",title:"The Cylindrical Storm",art:art.storm,text:[
      "Forty minutes of steady hands, then the closing, the count, the exhale. Borzov wakes long enough to thank you before the return crew carries him to the shuttle. Later, his voice reaches your radio from the Newton: recovery hurts, but he is alive to complain.",
      "Rama manufactures weather with no warning. Wind lifts crates, and the expedition boat bucks at its mooring. Falstaff's tiny lamp bobs on Richard's shoulder as Michael shouts that both the boat and the medical stores must be secured."
    ],choices:[
      {label:"Tie down the boat before the storm peaks",to:"pit"},
      {label:"Help Michael move the medical stores",to:"pit_clinic"},
      {label:"Launch immediately and outrun the weather",to:"failure_storm"}
    ]},

    storm_evacuated:{page:39,act:"Act I — Rama",title:"The Cylindrical Storm",art:art.storm_evacuated,text:[
      "Michael and the return crew carry Borzov up Alpha's stairway to the shuttle. The Newton's surgeon operates at once. When Borzov calls to thank you, the pain in his voice has become irritation at being kept in bed. You can live with irritation.",
      "Then Rama manufactures weather. Wind lifts crates. The expedition boat bucks at its mooring. Falstaff's tiny lamp bobs on Richard's shoulder as Michael shouts that both the boat and the medical stores must be secured."
    ],choices:[
      {label:"Tie down the boat before the storm peaks",to:"pit"},
      {label:"Help Michael move the medical stores",to:"pit_clinic"},
      {label:"Launch immediately and outrun the weather",to:"failure_storm"}
    ]},

    pit:{page:27,act:"Act I — Rama",title:"The Pit",art:art.pit,text:[
      "You get the boat's last line around the mooring post before a wave hurls you sideways. The polished service cover beneath your boots opens under the impact. You fall into a dark shaft with your scanner and medical kit still clipped to your harness.",
      "You land hard on a ledge. Your scanner reports a deep cut in your side. Below, a pale light makes three slow pulses before moving away. You cannot reach it, but you remember the rhythm."
    ],choices:[
      {label:"Scan and treat yourself before climbing",to:"rescue"},
      {label:"Climb immediately while strength remains",to:"failure_pit"}
    ]},

    pit_clinic:{page:51,act:"Act I — Rama",title:"The Pit",art:art.pit_clinic,text:[
      "You and Michael get the drug case clear of the flooding hut. A loose crate skids across the service cover at your feet; its catch releases. You fall into the shaft with the medical kit clutched hard against your ribs.",
      "You land on a ledge, the kit intact but your side badly cut. Below, a pale light makes three slow pulses before moving away. You cannot reach it, but you remember the rhythm."
    ],choices:[
      {label:"Scan and treat yourself before climbing",to:"rescue"},
      {label:"Climb immediately while strength remains",to:"failure_pit"}
    ]},

    rescue:{page:35,act:"Act I — Rama",title:"The Cable",art:art.rescue,text:[
      "Your bandage holds. A cable snakes down from the storm-dark opening, where Michael has braced a hand winch. Falstaff, Richard's little brass scout, reaches your ledge along a crack in the wall. Its lamp points out the cable end swinging beyond your reach.",
      "Your treated side aches when you stand."
    ],choices:[
      {label:"Signal Falstaff to guide the cable within reach",to:"sea"},
      {label:"Leap across the pit and seize it",to:"failure_cable"}
    ]},

    sea:{page:61,act:"Act I — Rama",title:"Across the Black Sea",art:art.sea,text:[
      "Falstaff hooks the light guide cord with its little paws and nudges the cable toward you. You clip it to your harness. Michael works the winch while Richard steadies the line; the robot rides up in your pocket. At the lip Michael swears with relief. You finish dressing the wound while the storm dies.",
      "Across the sea, a lamp signals from the island the expedition calls New York. Its flashes repeat the rhythm you saw below the pit. The boat floats, but the Newton has called everyone back: Rama's engines are warming, and this is the last shuttle to Earth.",
      "Richard and Michael will cross with you if you choose to investigate. They understand the risk. A signal might be an invitation. It is not a promise that you can come back."
    ],choices:[
      {label:"Cross with Richard and Michael to investigate the signal",to:"voyage"},
      {label:"Return to the Newton while the shuttle is waiting",to:"failure_abandon"}
    ]},

    voyage:{page:113,act:"Act II — The Voyage",title:"Twelve Years Out",art:art.voyage,text:[
      "Your boat reaches New York as Rama closes its outer airlocks. The Newton's last message fades behind you. You have chosen to stay aboard a moving world, and that world is leaving the Solar System.",
      "The signal leads to a dry gallery beneath the island. Richard makes lights and a water pump; Michael plants the survey's seed stock; you test the water and tend the growing beds. In the second year Michael witnesses your marriage to Richard. Your daughters Simone and Katie are born here. To them, Rama is home before it is a mystery.",
      "Twelve years after the crossing, Richard identifies the twin stars ahead: Sirius. Rama docks inside a vast station where whole vessels like yours rest in cradles. Richard calls it the Node, a junction in a network built between stars. Your family waits safely aboard Rama while you enter its reception chamber."
    ],choices:[{label:"Enter the Node at Sirius",to:"node"}]},

    node:{page:103,act:"Act II — The Node",title:"A Door Without Hinges",art:art.node,text:[
      "The Node receives you as if it has expected your weight. A display fills with symbols that rearrange themselves around your reflection. A passage opens toward a chamber full of moving stars.",
      "A second passage descends into absolute dark."
    ],choices:[
      {label:"Study the display before moving on",to:"interview"},
      {label:"Descend into the unlit passage",to:"failure_darkpassage"}
    ]},

    interview:{page:41,act:"Act II — The Node",title:"The Eagle's Questions",art:art.interview,text:[
      "The being waiting beneath the star maps is taller than any human. Feathers cover a body built with the severe economy of a machine. You call it the Eagle because you need some word for it.",
      "It asks what humanity fears. A diplomatic answer forms easily. The truth is harder."
    ],choices:[
      {label:"Answer honestly",to:"sanctuary"},
      {label:"Tell it what you think it wants to hear",to:"failure_node"}
    ]},

    sanctuary:{page:111,act:"Act II — The Node",title:"Three Colored Lights",art:art.sanctuary,text:[
      "The Eagle leads you to a visitor sanctuary. Three controls shine red, blue, green. Their rhythm matches both the display and the light below your old pit. Behind the closed door, something taps once.",
      "“A greeting,” the Eagle says. “Answer it and our other guests will admit you. Stand clear when the door moves.” Red, blue, green: you can learn three words, even in a language made of light."
    ],choices:[
      {label:"Press red, then blue, then green",to:"habitat"},
      {label:"Pry the door before answering the greeting",to:"failure_sanctuary"}
    ]},

    habitat:{page:97,act:"Act II — The Node",title:"A Place for Humans",art:art.habitat,text:[
      "You answer the lights and step back. The door opens. An eight-limbed being retreats politely from the threshold, bands of light circling its head. It was the one who tapped. The Eagle calls its people octospiders; they exchange greetings before leaving you to the visitors' table.",
      "The table shows three possible human settlements. The Eagle explains that Rama will return to the Solar System to collect colonists. Its builders study how different peoples learn to live together. They have asked you to propose a place for humans, but you need not make that decision alone.",
      "You can preserve familiar Earth landscapes, design a garden that can adapt, or leave the plan open for the settlers to decide."
    ],choices:[
      {label:"Design a living garden that can change",to:"eden_adaptive"},
      {label:"Preserve Earth exactly as memory",to:"eden_curated"},
      {label:"Refuse to decide for future settlers",to:"eden_unchosen"}
    ]},

    eden_adaptive:{page:19,act:"Act III — Return",title:"The Garden That Changes",art:art.eden_adaptive,text:[
      "Rama carries your family back to the Solar System. Two thousand colonists board from Earth, bringing seeds, trades, arguments, and the hope of another chance. They build New Eden around terraces that can be replanted and rerouted. The garden changes because you left it room to change.",
      "More years pass. Simone and Katie are grown; your younger daughter Ellie helps run your clinic. Your son Patrick maintains the water system. Benjy, fourteen, fills the house with drawings of the family in his garden. Richard is still your husband, Michael still the family's oldest friend. They all remember the first home under New York.",
      "There is gray among your curls now. You take medicine for an uneven heartbeat, and Richard knows why you pause on stairs. Today the clinic calls: a fever is spreading through the settlement."
    ],choices:[{label:"Open the clinic",to:"clinic"}]},

    eden_curated:{page:119,act:"Act III — Return",title:"The Garden Remembered",art:art.eden_curated,text:[
      "Rama carries your family back to the Solar System. Two thousand colonists board from Earth, bringing seeds, trades, arguments, and the hope of another chance. They build New Eden with the familiar river and ordered orchards you requested. The beauty is real. So is the work of preserving it.",
      "More years pass. Simone and Katie are grown; your younger daughter Ellie helps run your clinic. Your son Patrick maintains the water system. Benjy, fourteen, fills the house with drawings of the family in his garden. Richard is still your husband, Michael still the family's oldest friend. They all remember the first home under New York.",
      "There is gray among your curls now. You take medicine for an uneven heartbeat, and Richard knows why you pause on stairs. Today the clinic calls: a fever is spreading through the settlement."
    ],choices:[{label:"Open the clinic",to:"clinic"}]},

    eden_unchosen:{page:79,act:"Act III — Return",title:"The Garden We Chose Together",art:art.eden_unchosen,text:[
      "Rama carries your family back to the Solar System. Two thousand colonists board from Earth, bringing seeds, trades, arguments, and the hope of another chance. You left the plan open, so they build New Eden through assemblies and revisions. Nobody calls it perfect. Many people call it theirs.",
      "More years pass. Simone and Katie are grown; your younger daughter Ellie helps run your clinic. Your son Patrick maintains the water system. Benjy, fourteen, fills the house with drawings of the family in his garden. Richard is still your husband, Michael still the family's oldest friend. They all remember the first home under New York.",
      "There is gray among your curls now. You take medicine for an uneven heartbeat, and Richard knows why you pause on stairs. Today the clinic calls: a fever is spreading through the settlement."
    ],choices:[{label:"Open the clinic",to:"clinic"}]},

    clinic:{page:17,act:"Act III — Return",title:"The Serum",art:art.clinic,text:[
      "Richard organizes the queue while Michael carries water and Katie records names beside her sister Ellie's charts. The first run of serum cannot cover everyone. You keep one emergency dose for a sudden collapse; the rest must go to one group while the second run is made.",
      "Today the most seriously ill patients are adults. The children are stable, but may worsen. A public lottery would give everyone the same chance. None of these rules can remove the shortage.",
      "Councilor Nakamura has offered supplies if you accept his control of admissions. You refused: illness, not loyalty, decides who gets a bed."
    ],choices:[
      {label:"Treat the sickest first",to:"family"},
      {label:"Treat the children first",to:"family_children"},
      {label:"Use a public lottery",to:"family_lottery"}
    ]},

    family:{page:121,act:"Act III — Return",title:"Simone's Fever",art:art.family,text:[
      "You treat the sickest first. Several adults turn the corner; Ellie stays with the waiting children through a difficult night. Before the new run is ready, your grown daughter Simone collapses at home. The scanner shows that she now meets the same emergency rule as any other patient.",
      "The reserved ampoule is in your hand. Richard asks what your diagnosis says. Simone asks you to stay. A council messenger at the door insists that a relative's treatment must be approved before you give it."
    ],choices:[
      {label:"Use the emergency dose and remain beside Simone",to:"family_recovered"},
      {label:"Wait for a second opinion from the council",to:"failure_fever"}
    ]},

    family_recovered:{page:117,act:"Act III — Return",title:"The Fever Breaks",art:art.family_recovered,text:[
      "You give the dose and stay until the scanner shows a steady improvement. Simone opens her eyes and asks for water. You have treated your daughter by the same rule you wrote for strangers; that is what you will tell the council.",
      "Patrick arrives with an empty jug. Nakamura's station has cut the clinic's water. Richard will stay with Simone while you and your son find out whether the pipes can be made to serve everyone again."
    ],choices:[{label:"Go with Patrick to the water station",to:"water"}]},

    family_children:{page:53,act:"Act III — Return",title:"Simone's Fever",art:art.family_children,text:[
      "You treat the children first. Their fevers break, but two adults must be watched through the night. Among the waiting patients is your grown daughter Simone. Ellie keeps her stable until the next serum run reaches the ward; by morning she is recovering too. You owe Ellie more than thanks.",
      "Patrick arrives at breakfast with a different emergency: Nakamura has closed the city's water controls around the clinic."
    ],choices:[{label:"Go with Patrick to the water station",to:"water"}]},

    family_lottery:{page:37,act:"Act III — Return",title:"Simone's Fever",art:art.family_lottery,text:[
      "You use a public lottery. Simone's number is drawn. So is the number of an old mechanic who repairs half the city's heaters. Ellie cares for the people who must wait. You publish the complete list, including your daughter's name, because fairness must survive being looked at.",
      "At home, Simone is recovering while Benjy asks why a fair rule can still hurt. Patrick brings an empty jug before you can answer: Nakamura has cut the clinic's water."
    ],choices:[{label:"Go with Patrick to the water station",to:"water"}]},

    water:{page:77,act:"Act III — Return",title:"Who Owns the Water?",art:art.water,text:[
      "Patrick has found a way to reroute the settlement's water around Nakamura's private control station. Doing it quietly will keep the clinic alive. Exposing the scheme publicly might change the city—or start a war.",
      "The pipes hum beneath the floor."
    ],choices:[
      {label:"Help Patrick reroute the water",to:"water_rerouted"},
      {label:"Confront Nakamura in public",to:"water_confronted"},
      {label:"Accept Nakamura's terms to restore the water",to:"failure_water"}
    ]},

    water_rerouted:{page:71,act:"Act III — Return",title:"Water by Night",art:art.water_rerouted,text:[
      "You wait for the station's evening shift change. Patrick works by touch while you keep watch. The rerouted water reaches the clinic and three dry blocks before dawn. By breakfast everyone knows someone has challenged Nakamura's rules.",
      "An emergency assembly is called for noon. Katie warns you that Nakamura's deputies already control its security guards. Bring witnesses, she says."
    ],choices:[{label:"Go to the assembly",to:"election"}]},

    water_confronted:{page:83,act:"Act III — Return",title:"Water in Public",art:art.water_confronted,text:[
      "You name Nakamura's control station before the whole plaza. He denies nothing; he calls it rationing, triage, necessary order. Patrick uncaps a pipe and lets the evidence run across the floor between you.",
      "The plaza demands an assembly. It is called for noon the next day. Katie warns you that Nakamura's deputies already control its security guards. Bring witnesses, she says."
    ],choices:[{label:"Go to the assembly",to:"election"}]},

    election:{page:95,act:"Act III — Return",title:"The Count",art:art.election,text:[
      "The settlement gathers to vote on placing the water system under public control. Nakamura wants you to endorse his private scheme instead; he offers an exemption for the clinic. His deputies stand beside the ballot table.",
      "Katie has gathered the clinic records and the pipe diagrams. Your account could change the vote. The guards could also decide they have heard enough."
    ],choices:[
      {label:"Tell the truth without endorsing anyone",to:"trial"},
      {label:"Trade your endorsement for clinic protection",to:"note"}
    ]},

    note:{page:101,act:"Act III — Return",title:"The Folded Note",art:art.note,text:[
      "You endorse Nakamura's scheme in exchange for water. The count gives his scheme a narrow victory. By nightfall he has withdrawn behind his private guards. His deputies announce that his promise does not exempt you from an investigation into unauthorized treatment. The bargain protected their vote, not your patients.",
      "Katie slips a note beneath the clinic door. She has copied the detention order from the council office: a hearing tomorrow, then the gatehouse cell. She and Ellie are arranging help. Richard reads it twice and asks whether you will take the records to the hearing or demand an answer from the deputies now."
    ],choices:[
      {label:"Read every line and go to the trial",to:"trial"},
      {label:"Destroy the note and confront the council",to:"confrontation"}
    ]},

    confrontation:{page:105,act:"Act III — Return",title:"The Confrontation",art:art.confrontation,text:[
      "You tear Katie's note into narrow strips so the guards cannot use it against her, then walk into the council chamber. Richard follows. Nakamura's deputy refuses to honor the clinic exemption; a guard already holds the detention warrant.",
      "The confrontation lasts long enough for you to name every person the clinic treated. Then the guard takes your arm, and the door closes behind you."
    ],choices:[{label:"Let the guard take you",to:"cell"}]},

    trial:{page:23,act:"Act III — Return",title:"The Human Puzzle",art:art.trial,text:[
      "The hearing convenes in the hall where Nakamura's water scheme won the vote by a narrow margin. His deputies charge you with treating patients outside their rules. Your medical records are on the table; Katie and Richard are among the witnesses. The new regulations would let the deputies decide which lives are worth the cost.",
      "You can put each decision on record, giving your family evidence to use, or refuse to take part. A clerk warns that refusing to answer permits immediate transfer beyond the city."
    ],choices:[
      {label:"Describe every decision plainly",to:"cell"},
      {label:"Refuse to recognize the court",to:"failure_cell"}
    ]},

    cell:{page:81,act:"Act III — Return",title:"The Detention Room",art:art.cell,text:[
      "The guards take you to the gatehouse detention room. Richard has seen where they brought you, but cannot follow. The door is locked and the window barred. Beneath the bench, a loose service grate carries air from passages older than the city.",
      "A lamp hangs beside the bench. You take it down as boots stop outside your door."
    ],choices:[
      {label:"Open the service grate",to:"service"},
      {label:"Wait for the legal process to work",to:"failure_cell"}
    ]},

    service:{page:93,act:"Act III — Return",title:"Service Dark",art:art.service,text:[
      "The passage forks beneath the gatehouse. Air moves from the left. Water sounds against metal on the right. Behind you, someone lifts the grate.",
      "Your lantern is failing."
    ],choices:[
      {label:"Follow the moving air",to:"gatehouse"},
      {label:"Follow the sound of water",to:"failure_service"}
    ]},

    gatehouse:{page:55,act:"Act III — Return",title:"The Gatehouse",art:art.gatehouse,text:[
      "Patrick and Ellie wait beyond the final grille with a coil of cable. Guards cross the platform above. One clean signal will tell your friends when to pull.",
      "Or you can climb alone before anyone else is endangered."
    ],choices:[
      {label:"Signal Patrick and Ellie",to:"return"},
      {label:"Climb alone",to:"failure_gatehouse"}
    ]},

    return:{page:89,act:"Act III — Return",title:"The Waiting Skiff",art:art.return,text:[
      "Patrick and Ellie anchor the cable and haul you onto the platform. They lead you down to New Eden's dock, where Richard waits with the skiff. Your family is safe with friends; Michael is helping Katie hide the medical records.",
      "Richard has found shelter at Alpha. “Below the place where you fell, that first year. Three lights, the same greeting you brought back from the Node. Someone answered me. They offered us a room.” He has already taken your medicines and a few things from home there.",
      "The patrol will leave the crossing open only until dawn. You can go with him, or stay hidden in New Eden with Ellie and the patients who cannot leave."
    ],choices:[
      {label:"Enter the skiff and return to Alpha",to:"grill"},
      {label:"Stay with Ellie and work in hiding",to:"failure_remain"}
    ]},

    grill:{page:31,act:"Act III — Return",title:"The Last Machine",art:art.grill,text:[
      "Richard pilots the skiff across the sea to Alpha. Beneath the old pit, three controls shine beside a closed black grille: red, blue, green. The greeting you learned at the Node belongs here too.",
      "An eight-limbed shadow waits beyond the bars. Richard holds back. “Let them invite us,” he says."
    ],choices:[
      {label:"Press red, blue, green",to:"lair"},
      {label:"Force the grille",to:"failure_grill"}
    ]},

    lair:{page:107,act:"Act III — Return",title:"The Family's Lair",art:art.lair,text:[
      "You answer the lights. The grille opens, and an octospider steps back to admit you. Its head carries the same slow bands you saw at the sanctuary. Richard's small dictionary explains the greeting: begin, welcome, shelter.",
      "These people live in galleries beneath the human settlements. Richard has learned that their patrol found you in the pit long ago; the pale light belonged to a neighbor, not a trap. Now they have offered a room. Richard brought your old workbench, Benjy's drawings, and the folded quilt from New Eden. The bed was made for you.",
      "You are tired and your heart is racing. Your medicine is on the table. You may trust your husband and these careful hosts enough to rest, or refuse their shelter and return to the city."
    ],choices:[
      {label:"Take your medicine and rest beside Richard",to:"twilight"},
      {label:"Refuse the refuge and return to New Eden",to:"failure_lair"}
    ]},

    twilight:{page:57,act:"Act III — The Later Years",title:"The Time You Were Given",art:art.twilight,text:[
      "You wake to breakfast. In time your hosts offer a room overlooking a garden sheltered within their galleries. Then come years: Richard learning the octospiders' language, visits from the children, letters from Michael, and medicines traded between the clinic and your neighbors below. The city changes without becoming perfect. You are allowed ordinary happy days.",
      "Your heart disease advances despite the treatments you and Ellie try. One evening the scanner confirms what your body has been telling you. You tell Richard. He sits beside you while you lie down, and holds your hand as your breathing grows quiet.",
      "You have lived the years the refuge gave you. Richard says your name, and the sound travels farther than the room."
    ],choices:[{label:"Follow the sound of your name",to:"threshold"}]},

    threshold:{page:13,act:"Postlude — Nicole",title:"The Shore Beyond",art:art.threshold,text:[
      "You stand beside a quiet sea, without the ache in your chest. The Eagle is beside you, unchanged. “Your body has finished its voyage. Richard is still holding your hand,” it says. “At this threshold, we can keep you company.” You do not yet know whether this is memory, another form of life, or the last gift of a machine.",
      "It asks what gave the voyage meaning. Four answers open like paths across the water."
    ],choices:[
      {label:"A greater mind called us forward",to:"ending_god"},
      {label:"Rama itself was the answer",to:"ending_rama"},
      {label:"The people we carried with us",to:"ending_family"},
      {label:"We made meaning by choosing",to:"ending_purpose"}
    ]},

    ending_god:{page:109,act:"One true conclusion",title:"The Mind Beyond the Machine",art:art.ending_god,ending:"god",text:[
      "You tell the Eagle that intelligence is a door, not a throne—that every opened world implies another mind beyond it. The stars above the water rearrange themselves into a question you cannot yet read.",
      "You step forward anyway.","THE END"
    ]},
    ending_rama:{page:7,act:"One true conclusion",title:"The World Was Enough",art:art.ending_rama,ending:"rama",text:[
      "You say that Rama needed no purpose beyond its existence. It crossed darkness, carried life, and made wonder measurable. The Eagle bows its long head.",
      "For once, you let the mystery remain larger than its explanation.","THE END"
    ]},
    ending_family:{page:11,act:"One true conclusion",title:"What We Carried",art:art.ending_family,ending:"family",text:[
      "You name Richard, Simone, Katie, Benjy, Michael, Patrick, Ellie, and everyone whose fear became responsibility. The distant doorway fills with familiar voices.",
      "The universe was never empty. You had been carrying it all along.","THE END"
    ]},
    ending_purpose:{page:21,act:"One true conclusion",title:"The Choice Itself",art:art.ending_purpose,ending:"purpose",text:[
      "You tell the Eagle there was no answer waiting to be discovered. Meaning accumulated each time you chose despite incomplete knowledge. The unfinished road brightens.",
      "You take the next step before the question is finished.","THE END"
    ]},

    failure_missed:{page:127,act:"Another voyage",title:"The Door Closes",art:art.failure_missed,ending:"quiet",text:["You take the shuttle back to the Newton. Months later you are practicing medicine on Earth while Rama disappears beyond the telescopes. You have a life worth living. You will also always wonder what lay at the bottom of that stairway.","THE END"]},
    failure_fall:{page:115,act:"A sudden ending",title:"No Floor",art:art.failure_fall,ending:"failure",text:["The hatch contains no passage—only a shaft descending toward the spinning shell. At first the fall feels like flight. Then gravity remembers you.","THE END"]},
    failure_biot:{page:129,act:"A sudden ending",title:"Maintenance",art:art.failure_biot,ending:"failure",text:["The machine interprets your movement as damage. Six precise limbs unfold. Rama repairs the obstruction you have become.","THE END"]},
    failure_slot:{page:85,act:"A sudden ending",title:"The Slot",art:art.failure_slot,ending:"failure",text:["The panel closes without malice. The machine has accepted your hand as raw material. The expedition's report is extremely brief.","THE END"]},
    failure_neglect:{page:99,act:"A sudden ending",title:"Doctor",art:art.failure_neglect,ending:"failure",text:["Borzov dies before sunset. Michael takes command without ever looking toward the empty medical table. The mission continues, but every later decision contains the shape of the first one you refused to make.","THE END"]},
    failure_storm:{page:25,act:"A sudden ending",title:"Weather Wins",art:art.failure_storm,ending:"failure",text:["The first wave turns the boat sideways. The second lifts it into Rama's artificial sky. Nobody ever finds the third piece.","THE END"]},
    failure_pit:{page:123,act:"A sudden ending",title:"The Last Step",art:art.failure_pit,ending:"failure",text:["Halfway up, the untreated wound opens. The light below reaches you before the rescuers above.","THE END"]},
    failure_cable:{page:63,act:"A sudden ending",title:"Almost",art:art.failure_cable,ending:"failure",text:["Your fingers brush the cable. For one perfect second you are certain effort will be enough. Then the pit turns beneath you.","THE END"]},
    failure_abandon:{page:47,act:"Another voyage",title:"The Shore You Leave",art:art.failure_abandon,ending:"quiet",text:["You leave the boat tied at Camp Alpha and take the last shuttle with Richard and Michael. From the Newton you watch Rama's engines flare. You saved a life here, and your friends brought you back alive. Years later, you still draw the rhythm of that distant island's light in the margins of your notes.","THE END"]},
    failure_darkpassage:{page:29,act:"A sudden ending",title:"The Passage Below",art:art.failure_darkpassage,ending:"failure",text:["The unlit passage closes behind you with no visible door. You walk until your lamp fails, then listen to a machine continuing a conversation in a language no human will translate.","THE END"]},
    failure_node:{page:73,act:"A sudden ending",title:"An Answer Without a Question",art:art.failure_node,ending:"failure",text:["The Node listens to the answer you perform instead of the one you believe. The Eagle lowers its head. A door closes between species. It does not open in your lifetime.","THE END"]},
    failure_sanctuary:{page:3,act:"A sudden ending",title:"The Wrong Kind of Opening",art:art.failure_sanctuary,ending:"failure",text:["The door opens outward with the patient force of continental drift. You have put your weight against its moving edge. The greeting was meant to give you time to stand clear.","THE END"]},
    failure_fever:{page:125,act:"A sudden ending",title:"The Cost of Waiting",art:art.failure_fever,ending:"failure",text:["By the time the council agrees on jurisdiction, the fever has made the decision for you. Benjy takes down his drawing of the family in his garden.","THE END"]},
    failure_cell:{page:91,act:"A sudden ending",title:"Procedure",art:art.failure_cell,ending:"failure",text:["The process works exactly as designed. At dawn you are transferred beyond the city gate. The clinic is reassigned before noon.","THE END"]},
    failure_service:{page:45,act:"A sudden ending",title:"Below the Waterline",art:art.failure_service,ending:"failure",text:["The sound is not a channel. It is pressure. The old pipe splits, and the passage fills faster than any human can climb.","THE END"]},
    failure_gatehouse:{page:9,act:"A sudden ending",title:"One Pair of Hands",art:art.failure_gatehouse,ending:"failure",text:["You reach the platform. The cable does not. Courage was never the same thing as leverage.","THE END"]},
    failure_remain:{page:87,act:"A quiet ending",title:"Citizen of Rama",art:art.failure_remain,ending:"quiet",text:["Ellie hides you in a room above the dispensary. Richard stays too. At first you treat patients behind a locked door; later the medical records Katie saved help the city overturn the detention orders. You grow old among neighbors whose names you know. The mystery beyond the sea remains, but this life has room for love and useful work.","THE END"]},
    failure_water:{page:65,act:"A compromised ending",title:"The Price of Water",art:art.failure_water,ending:"compromise",text:["You accept Nakamura's admission rules. Water flows again, but a guard at the clinic door turns away anyone without his permit. You keep some people alive and lose the power to help others. Patrick no longer brings you plans. You remain a doctor, and spend the years ahead trying to recover the promise that word once held.","THE END"]},
    failure_grill:{page:49,act:"A sudden ending",title:"The Machine Defends Itself",art:art.failure_grill,ending:"failure",text:["The grille is not a barrier. It is part of a living circuit. When you strike it, the circuit completes.","THE END"]},
    failure_lair:{page:33,act:"A closed road",title:"The Watch",art:art.failure_lair,ending:"failure",text:["Richard takes you back across the sea, but the crossing is no longer open. A patrol stops the skiff. The deputies seize you both before Ellie can reach the dock. The refuge remains ready below Alpha; you have lost the chance to use it.","THE END"]}
  };

  global.RamaBookStory=Object.freeze({
    id:"book-1982",
    title:"RAMA: The World Within",
    start:"warning",
    nodes:Object.freeze(nodes)
  });
})(globalThis);
