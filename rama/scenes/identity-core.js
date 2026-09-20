(function installRamaSceneIdentity(global) {
  "use strict";

  const definitions = [
    { id: "machine_boot", source: "session", status: "registry-only" },
    { id: "opening_sequence", source: "output", status: "registry-only" },
    { id: "nicole_introduction", source: "output", status: "registry-only" },
    { id: "alpha_airlock_first_arrival", source: "state", status: "resolved" },
    { id: "descent_to_central_plain", source: "state", status: "resolved" },
    { id: "camp_alpha_survey_assignment", source: "state", status: "resolved" },
    { id: "biot_procession_first_encounter", source: "state", status: "resolved" },
    { id: "borzov_medical_emergency", source: "state", status: "resolved" },
    { id: "cylindrical_sea_first_reveal", source: "state", status: "resolved" },
    { id: "raman_dawn", source: "state", status: "resolved" },
    { id: "new_york_waterfront", source: "state", status: "resolved" },
    { id: "octahedron_plaza", source: "state", status: "resolved" },
    { id: "latticed_way_shaft", source: "state", status: "resolved" },
    { id: "the_pit_stranded", source: "state", status: "resolved" },
    { id: "lair_first_shelter", source: "output", status: "registry-only" },
    { id: "lair_family_home", source: "state", status: "resolved" },
    { id: "atrium_sirius_revealed", source: "state", status: "resolved" },
    { id: "avian_vertical", source: "state", status: "resolved" },
    { id: "node_arrival_hangar", source: "state", status: "resolved" },
    { id: "node_hall_eagle", source: "state", status: "resolved" },
    { id: "node_observation_sirius", source: "state", status: "resolved" },
    { id: "design_atelier_new_eden", source: "state", status: "resolved" },
    { id: "new_eden_plaza", source: "state", status: "resolved" },
    { id: "eden_clinic_ward", source: "state", status: "resolved" },
    { id: "assembly_hall_election_eve", source: "state", status: "resolved" },
    { id: "lair_sanctuary_octospiders", source: "state", status: "resolved" },
    { id: "threshold_of_light", source: "state", status: "resolved" },
    { id: "london_sealed_city", source: "state", status: "resolved" },
    { id: "pit_falstaff_contact", source: "state", status: "resolved" },
    { id: "camp_alpha_ruins", source: "state", status: "resolved" },
    { id: "beta_shore_skiff_return", source: "state", status: "resolved" },
    { id: "tailors_room", source: "state", status: "resolved" },
    { id: "node_family_quarters", source: "state", status: "resolved" },
    { id: "wakefield_house", source: "state", status: "resolved" },
    { id: "vegas_floor", source: "state", status: "resolved" },
    { id: "eden_clinic_recovered", source: "state", status: "resolved" },
    { id: "assembly_hall_trial", source: "state", status: "resolved" },
    { id: "katie_lost_vertical", source: "state", status: "resolved" },
    { id: "node_farewell", source: "state", status: "resolved" },
    { id: "gatehouse_rescue_katie", source: "state", status: "resolved" },
    { id: "gatehouse_rescue_siblings", source: "state", status: "resolved" },
    { id: "medical_hut_quiet", source: "state", status: "resolved" },
    { id: "london_factory_reveal", source: "output", status: "resolved" },
    { id: "resolution_crossing", source: "output", status: "resolved" },
    { id: "new_york_narrow_ways", source: "output", status: "resolved" },
    { id: "rama_course_change", source: "output", status: "resolved" },
    { id: "alpha_stairway_climb", source: "state", status: "resolved" },
    { id: "central_plain_first_footing", source: "state", status: "resolved" },
    { id: "act_ii_voyage_years", source: "state", status: "resolved" },
    { id: "node_dock_family_revisit", source: "state", status: "resolved" },
    { id: "new_eden_gatehouse", source: "state", status: "resolved" },
    { id: "service_dark", source: "state", status: "resolved" },
    { id: "twilight_in_the_lair", source: "output", status: "resolved" },
    { id: "postlude_inventory", source: "output", status: "resolved" }
  ];

  const SCENE_DEFINITIONS = Object.freeze(definitions.map(definition => Object.freeze({ ...definition })));
  const SCENE_IDS = Object.freeze(SCENE_DEFINITIONS.map(definition => definition.id));
  const RESOLVED_SCENE_IDS = Object.freeze(
    SCENE_DEFINITIONS.filter(definition => definition.status === "resolved").map(definition => definition.id)
  );
  const STATE_RESOLVED_SCENE_IDS = Object.freeze(
    SCENE_DEFINITIONS.filter(definition => definition.status === "resolved" && definition.source === "state")
      .map(definition => definition.id)
  );
  const OUTPUT_RESOLVED_SCENE_IDS = Object.freeze(
    SCENE_DEFINITIONS.filter(definition => definition.status === "resolved" && definition.source === "output")
      .map(definition => definition.id)
  );
  const DESCENT_LOCATIONS = new Set(["stair_top"]);
  const BORZOV_LOCATIONS = new Set(["camp_alpha", "medlab"]);
  const BORZOV_PHASES = new Set(["borzov", "borzov_decide"]);

  function identity(id) {
    return Object.freeze({ id });
  }

  function includesActor(facts, id) {
    return Array.isArray(facts.actorIds) && facts.actorIds.includes(id);
  }

  function outputIncludes(records, fragment) {
    return Array.isArray(records) && records.some(record =>
      record && typeof record.t === "string" && record.t.includes(fragment)
    );
  }

  function resolveOutput(records) {
    if (outputIncludes(records, "racks of half-made things receding out of focus")) {
      return identity("london_factory_reveal");
    }
    if (outputIncludes(records, "CROSSING. The hoist lowers them to the stage")) {
      return identity("resolution_crossing");
    }
    if (outputIncludes(records, "Slots between towers, dark and patient.")) {
      return identity("new_york_narrow_ways");
    }
    if (outputIncludes(records, "And then Rama answers a question nobody had standing to ask.")) {
      return identity("rama_course_change");
    }
    if (outputIncludes(records, "Years, then. The lair years, the second edition:")) {
      return identity("twilight_in_the_lair");
    }
    if (outputIncludes(records, "(That is everything, and it is not a small list.)")) {
      return identity("postlude_inventory");
    }
    return null;
  }

  function resolve(facts) {
    if (!facts || typeof facts !== "object") return null;
    const flags = facts.flags || {};
    const knowledge = facts.knowledge || {};
    const items = facts.items || {};

    if (facts.act === 1 && facts.phase === "arrival" && facts.location === "hub") {
      return identity("alpha_airlock_first_arrival");
    }

    if (facts.act === 1 && facts.phase === "arrival" && DESCENT_LOCATIONS.has(facts.location)) {
      return identity("descent_to_central_plain");
    }

    if (facts.act === 1 && facts.phase === "arrival" && facts.location === "stairway") {
      return identity("alpha_stairway_climb");
    }

    if (facts.act === 1 && facts.phase === "arrival" && facts.location === "plain_north") {
      return identity("central_plain_first_footing");
    }

    if (
      facts.act === 1 && facts.phase === "survey" && facts.location === "camp_alpha" &&
      flags.campIntro === true && knowledge.biots !== true
    ) {
      return identity("camp_alpha_survey_assignment");
    }

    if (
      facts.act === 1 && facts.phase === "survey" && facts.location === "plain_biot" &&
      flags.biotSeen === true && flags.biotGone !== true
    ) {
      return identity("biot_procession_first_encounter");
    }

    if (
      facts.act === 1 && BORZOV_PHASES.has(facts.phase) && BORZOV_LOCATIONS.has(facts.location)
    ) {
      return identity("borzov_medical_emergency");
    }

    if (
      facts.act === 1 && facts.location === "medlab" &&
      ["arrival", "survey"].includes(facts.phase)
    ) {
      return identity("medical_hut_quiet");
    }

    if (
      facts.act === 1 && facts.phase === "storm" && facts.location === "beta_shore" &&
      flags.betaOpen === true && flags.betaIntro === true && knowledge.dawn === true &&
      flags.ramaDawn !== true && flags.boatDamaged !== true && items.boatLocation === "beta_shore" &&
      ["richard", "michael", "francesca"].every(id => includesActor(facts, id))
    ) {
      return identity("cylindrical_sea_first_reveal");
    }

    if (
      facts.act === 1 && facts.phase === "crossing" && facts.location === "beta_shore" &&
      flags.ramaDawn === true
    ) {
      return identity("raman_dawn");
    }

    if (
      facts.act === 1 && facts.phase === "newyork" && facts.location === "ny_dock" &&
      flags.ramaDawn === true && flags.nyIntro === true
    ) {
      return identity("new_york_waterfront");
    }

    if (facts.act === 1 && facts.phase === "newyork" && facts.location === "ny_plaza") {
      return identity("octahedron_plaza");
    }

    if (
      facts.act === 1 && facts.phase === "newyork" && facts.location === "ny_lattice" &&
      flags.fell !== true
    ) {
      return identity("latticed_way_shaft");
    }

    if (
      facts.act === 1 && facts.phase === "pit" && facts.location === "pit" &&
      flags.rescued !== true && flags.falstaffHere !== true && flags.cableDown !== true
    ) {
      return identity("the_pit_stranded");
    }

    if (facts.act === 2 && facts.phase === "act2_voyage" && facts.location === "lair") {
      return identity("act_ii_voyage_years");
    }

    if (facts.act === 2 && facts.location === "lair") {
      return identity("lair_family_home");
    }

    if (facts.act === 2 && facts.location === "atrium" && knowledge.sirius === true) {
      return identity("atrium_sirius_revealed");
    }

    if (facts.act === 2 && facts.location === "avian_shaft" && facts.phase !== "katie_lost") {
      return identity("avian_vertical");
    }

    if (
      facts.act === 2 && facts.phase === "act2_arrival" && facts.location === "node_dock" &&
      flags.nodeCorridor === true && knowledge.eagleMet !== true &&
      ["richard", "michael", "simone", "katie"].every(id => includesActor(facts, id))
    ) {
      return identity("node_arrival_hangar");
    }

    if (
      facts.act === 2 && facts.location === "node_dock" &&
      facts.phase !== "act2_arrival" && facts.phase !== "act2_farewell" &&
      knowledge.eagleMet === true &&
      ["richard", "michael", "simone", "katie"].every(id => includesActor(facts, id))
    ) {
      return identity("node_dock_family_revisit");
    }

    if (
      facts.act === 2 && facts.phase === "act2_eagle" && facts.location === "node_hall" &&
      knowledge.eagleMet === true && flags.interviewDone !== true &&
      ["richard", "michael", "simone", "katie", "eagle"].every(id => includesActor(facts, id))
    ) {
      return identity("node_hall_eagle");
    }

    if (
      facts.act === 2 && facts.phase === "act2_settled" && facts.location === "node_obs" &&
      flags.obsSeen === true &&
      ["richard", "michael", "simone", "katie"].every(id => includesActor(facts, id))
    ) {
      return identity("node_observation_sirius");
    }

    if (
      facts.act === 2 && facts.phase === "act2_settled2" && facts.location === "node_design" &&
      flags.designOpen === true && flags.designStarted === true && flags.designDone !== true &&
      facts.questionId === "design_charter" &&
      ["richard", "michael", "simone", "katie"].every(id => includesActor(facts, id))
    ) {
      return identity("design_atelier_new_eden");
    }

    if (
      facts.act === 3 && facts.phase === "act3_open" && facts.location === "eden_plaza" &&
      flags.waterDone !== true && facts.community >= 2 && facts.community < 4 &&
      includesActor(facts, "patrick")
    ) {
      return identity("new_eden_plaza");
    }

    if (
      facts.act === 3 && facts.phase === "act3_serum" && facts.location === "eden_clinic" &&
      flags.clinicIntro === true && flags.serumMade !== true && flags.serumDone !== true &&
      includesActor(facts, "ellie")
    ) {
      return identity("eden_clinic_ward");
    }

    if (
      facts.act === 3 && facts.phase === "act3_vote" && facts.location === "eden_hall" &&
      flags.voteScene === true && flags.voteDone !== true
    ) {
      return identity("assembly_hall_election_eve");
    }

    if (
      facts.act === 3 && facts.phase === "act3_sanctuary" && facts.location === "lair" &&
      flags.grillOpened === true && includesActor(facts, "richard") && includesActor(facts, "octos")
    ) {
      return identity("lair_sanctuary_octospiders");
    }

    if (facts.act === 1 && facts.location === "london") {
      return identity("london_sealed_city");
    }

    if (
      facts.act === 1 && facts.phase === "pit" && facts.location === "pit" &&
      flags.falstaffHere === true && flags.signalDone !== true &&
      flags.rescued !== true && flags.cableDown !== true
    ) {
      return identity("pit_falstaff_contact");
    }

    if (
      facts.act === 3 && facts.location === "camp_alpha" && flags.campRevisit === true
    ) {
      return identity("camp_alpha_ruins");
    }

    if (
      facts.act === 3 && facts.location === "beta_shore" && flags.betaRevisit === true &&
      items.skiffLocation === "beta_shore" && includesActor(facts, "falstaff")
    ) {
      return identity("beta_shore_skiff_return");
    }

    if (facts.act === 2 && facts.location === "node_med") {
      return identity("tailors_room");
    }

    if (
      facts.act === 2 && facts.location === "node_quarters" &&
      ["act2_settled", "act2_settled2"].includes(facts.phase) &&
      ["richard", "michael", "simone", "katie"].every(id => includesActor(facts, id))
    ) {
      return identity("node_family_quarters");
    }

    if (
      facts.act === 3 && facts.location === "eden_home" && flags.richardMissing !== true &&
      includesActor(facts, "richard") && includesActor(facts, "benjy")
    ) {
      return identity("wakefield_house");
    }

    if (
      facts.act === 3 && facts.location === "vegas" &&
      includesActor(facts, "katie") && includesActor(facts, "nakamura")
    ) {
      return identity("vegas_floor");
    }

    if (
      facts.act === 3 && ["act3_open", "act3_vote"].includes(facts.phase) &&
      facts.location === "eden_clinic" && flags.serumDone === true &&
      includesActor(facts, "ellie")
    ) {
      return identity("eden_clinic_recovered");
    }

    if (
      facts.act === 3 && facts.phase === "act3_trial" && facts.location === "eden_hall" &&
      flags.trialScene === true && flags.trialDone !== true
    ) {
      return identity("assembly_hall_trial");
    }

    if (
      facts.act === 2 && facts.phase === "katie_lost" && facts.location === "avian_shaft" &&
      flags.katieFound !== true && includesActor(facts, "richard") &&
      includesActor(facts, "michael") && !includesActor(facts, "katie")
    ) {
      return identity("katie_lost_vertical");
    }

    if (
      facts.act === 2 && facts.phase === "act2_farewell" && facts.location === "node_dock" &&
      ["richard", "michael", "simone", "katie"].every(id => includesActor(facts, id))
    ) {
      return identity("node_farewell");
    }

    if (
      facts.act === 3 && facts.phase === "act3_escape" && facts.location === "eden_gate" &&
      flags.trialDone === true && flags.cellOpen === true && flags.rescuer === "katie" &&
      includesActor(facts, "katie")
    ) {
      return identity("gatehouse_rescue_katie");
    }

    if (
      facts.act === 3 && facts.phase === "act3_escape" && facts.location === "eden_gate" &&
      flags.trialDone === true && flags.cellOpen === true && flags.rescuer === "ellie"
    ) {
      return identity("gatehouse_rescue_siblings");
    }

    if (
      facts.act === 3 && facts.phase === "act3_escape" && facts.location === "tunnel"
    ) {
      return identity("service_dark");
    }

    if (
      facts.act === 3 && facts.location === "eden_gate" && facts.phase !== "act3_escape"
    ) {
      return identity("new_eden_gatehouse");
    }

    if (
      facts.act === 4 && facts.phase === "postlude" && facts.location === "pl_shore" &&
      facts.ended !== true && facts.inventoryEmpty === true && includesActor(facts, "eagle")
    ) {
      return identity("threshold_of_light");
    }

    return null;
  }

  // Additive context vocabulary: legacy scene resolution is deliberately unchanged.
  // Only a presentation consumer opting into this Act I packet uses these views.
  const ACT_ONE_CONTEXT_IDS = Object.freeze([
    "alpha_airlock_exploration", "alpha_upper_flights", "alpha_lower_flights",
    "central_plain_exploration", "camp_alpha_working", "camp_alpha_storm_damage",
    "medical_hut_emergency", "medical_hut_recovery", "medical_hut_available",
    "biot_track_active", "biot_track_empty", "london_exterior",
    "beta_shore_predawn", "beta_shore_daylight", "new_york_arrival_context",
    "new_york_waterfront_withdrawal", "octahedron_exploration", "lattice_exploration",
    "pit_waiting", "pit_contact_context", "pit_rescue_cable"
  ]);

  function resolveActOnePresentation(facts, records) {
    if (!facts || facts.ended) return null;
    const flags = facts.flags || {};
    // Echoes must never manufacture a narrative beat from a typed quotation.
    const output = (records || []).filter(record => record && record.k !== "echo");
    const finale = facts.act === 2 && facts.location === "lair" &&
      facts.phase === "act2_voyage" &&
      outputIncludes(output, "They carry down what three people can carry:") &&
      outputIncludes(output, "And then Rama answers a question nobody had standing to ask.");
    if (finale) return Object.freeze({
      context: identity("act_ii_voyage_years"),
      beats: Object.freeze([identity("lair_first_shelter"), identity("rama_course_change")])
    });
    if (facts.act !== 1) return null;
    let id = null;
    switch (facts.location) {
      case "hub": id = "alpha_airlock_exploration"; break;
      case "stair_top": id = "alpha_upper_flights"; break;
      case "stairway": id = "alpha_lower_flights"; break;
      case "plain_north": id = "central_plain_exploration"; break;
      case "camp_alpha": id = flags.campLoss ? "camp_alpha_storm_damage" : "camp_alpha_working"; break;
      case "medlab":
        id = includesActor(facts, "borzov") && facts.borzovStatus === "sick"
          ? "medical_hut_emergency"
          : includesActor(facts, "borzov") && facts.borzovStatus === "operated"
            ? "medical_hut_recovery" : "medical_hut_available";
        break;
      case "plain_biot": id = flags.biotSeen && !flags.biotGone ? "biot_track_active" : "biot_track_empty"; break;
      case "london": id = "london_exterior"; break;
      case "beta_shore": id = flags.ramaDawn ? "beta_shore_daylight" : "beta_shore_predawn"; break;
      case "ny_dock": id = flags.rescued ? "new_york_waterfront_withdrawal" : "new_york_arrival_context"; break;
      case "ny_plaza": id = "octahedron_exploration"; break;
      case "ny_lattice": id = "lattice_exploration"; break;
      case "pit": id = flags.cableDown ? "pit_rescue_cable"
        : flags.falstaffHere && !flags.signalDone ? "pit_contact_context" : "pit_waiting"; break;
    }
    if (!id) return null;
    const beat = resolveOutput(output);
    const beats = beat && ["london_factory_reveal", "resolution_crossing", "new_york_narrow_ways"].includes(beat.id)
      ? [beat] : [];
    return Object.freeze({context: identity(id), beats: Object.freeze(beats)});
  }

  // Act II continuity is separately opt-in. These are presentation identities,
  // not game phases: reading them cannot advance events, knowledge or choices.
  const ACT_TWO_CONTEXT_IDS = Object.freeze([
    "atrium_undeciphered", "avian_search_context", "node_hall_conversation",
    "node_observation_quiet", "node_hangar_quiet", "node_departure_context",
    "node_quarters_domestic", "node_quarters_fever", "tailor_workspace",
    "design_atelier_detail"
  ]);

  function resolveActTwoPresentation(facts) {
    if (!facts || facts.act !== 2 || facts.ended) return null;
    const flags = facts.flags || {};
    const knowledge = facts.knowledge || {};
    const familyPresent = ["richard", "michael", "simone", "katie"]
      .every(id => includesActor(facts, id));
    let id = null;
    switch (facts.location) {
      case "lair": id = facts.phase === "act2_voyage" ? "act_ii_voyage_years" : "lair_family_home"; break;
      case "atrium": id = knowledge.sirius ? "atrium_sirius_revealed" : "atrium_undeciphered"; break;
      case "avian_shaft": id = facts.phase === "katie_lost" ? "avian_search_context" : "avian_vertical"; break;
      case "node_dock":
        id = facts.phase === "act2_farewell" && familyPresent ? "node_departure_context"
          : resolve(facts)?.id || "node_hangar_quiet";
        break;
      case "node_hall": id = resolve(facts)?.id || "node_hall_conversation"; break;
      case "node_obs": id = resolve(facts)?.id || "node_observation_quiet"; break;
      case "node_med": id = "tailor_workspace"; break;
      case "node_quarters":
        id = facts.phase === "simone_fever" && !flags.feverCured &&
          includesActor(facts, "simone") && includesActor(facts, "katie")
          ? "node_quarters_fever" : "node_quarters_domestic";
        break;
      // A near-table/lake detail deliberately leaves variable doors, housing
      // density and garden plots outside the view, for every design branch.
      case "node_design": id = "design_atelier_detail"; break;
    }
    return id ? Object.freeze({context: identity(id), beats: Object.freeze([])}) : null;
  }

  // Act III carries the player through communities that visibly change. These
  // identities isolate only what a renderer may safely show at each location.
  const ACT_THREE_CONTEXT_IDS = Object.freeze([
    "eden_home_quiet", "eden_plaza_civic", "eden_clinic_recovered_context",
    "eden_hall_council", "gatehouse_escape_katie", "gatehouse_escape_siblings",
    "central_plain_return", "camp_alpha_ruins_context", "beta_shore_return_context",
    "new_york_return_context", "lair_return_grill", "vegas_council_floor"
  ]);

  function resolveActThreePresentation(facts) {
    if (!facts || facts.act !== 3 || facts.ended) return null;
    const flags = facts.flags || {};
    let id = null;
    switch (facts.location) {
      case "eden_home": id = "eden_home_quiet"; break;
      case "eden_plaza": id = "eden_plaza_civic"; break;
      case "eden_clinic":
        id = flags.serumDone ? "eden_clinic_recovered_context" : "eden_clinic_ward";
        break;
      case "eden_hall":
        id = facts.phase === "act3_trial" ? "assembly_hall_trial" : "eden_hall_council";
        break;
      case "eden_gate":
        if (facts.phase === "act3_escape" && flags.rescuer === "katie") id = "gatehouse_escape_katie";
        else if (facts.phase === "act3_escape" && flags.rescuer === "ellie") id = "gatehouse_escape_siblings";
        else id = "new_eden_gatehouse";
        break;
      case "tunnel": id = "service_dark"; break;
      case "plain_north": id = "central_plain_return"; break;
      case "camp_alpha": id = "camp_alpha_ruins_context"; break;
      case "beta_shore": id = "beta_shore_return_context"; break;
      case "ny_dock": id = "new_york_return_context"; break;
      case "ny_plaza": id = "octahedron_plaza"; break;
      case "ny_lattice": id = "latticed_way_shaft"; break;
      case "lair": id = flags.grillOpened ? "lair_sanctuary_octospiders" : "lair_return_grill"; break;
      case "vegas": id = "vegas_council_floor"; break;
    }
    return id ? Object.freeze({context: identity(id), beats: Object.freeze([])}) : null;
  }

  global.RamaSceneIdentity = Object.freeze({
    SCENE_DEFINITIONS,
    SCENE_IDS,
    RESOLVED_SCENE_IDS,
    STATE_RESOLVED_SCENE_IDS,
    OUTPUT_RESOLVED_SCENE_IDS,
    resolveOutput,
    ACT_ONE_CONTEXT_IDS,
    resolveActOnePresentation,
    ACT_TWO_CONTEXT_IDS,
    resolveActTwoPresentation,
    ACT_THREE_CONTEXT_IDS,
    resolveActThreePresentation,
    resolve
  });
})(globalThis);
