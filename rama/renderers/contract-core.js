(function installRamaRendererContract(global) {
  "use strict";

  const RENDERER_ID_VALUES = ["text", "illustrated", "era-1989", "era-1994"];
  const OUTPUT_KIND_VALUES = ["p", "sys", "alert", "room", "act", "fin", "echo"];
  const ACTION_TYPE_VALUES = ["act", "move", "answer", "system"];
  const UI_MODE_VALUES = ["normal", "question", "ended"];

  const RENDERER_IDS = Object.freeze([...RENDERER_ID_VALUES]);
  const OUTPUT_KINDS = Object.freeze([...OUTPUT_KIND_VALUES]);
  const ACTION_TYPES = Object.freeze([...ACTION_TYPE_VALUES]);
  const UI_MODES = Object.freeze([...UI_MODE_VALUES]);

  function fail(message) {
    throw new TypeError(`Renderer contract: ${message}`);
  }

  function assertObject(value, label) {
    if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
  }

  function assertString(value, label) {
    if (typeof value !== "string" || !value) fail(`${label} must be a non-empty string`);
  }

  function assertKeys(value, allowed, label) {
    for (const key of Object.keys(value)) {
      if (!allowed.includes(key)) fail(`${label} contains unsupported key ${key}`);
    }
  }

  function immutableCopy(value) {
    if (Array.isArray(value)) return Object.freeze(value.map(immutableCopy));
    if (value && typeof value === "object") {
      const copy = {};
      for (const [key, child] of Object.entries(value)) copy[key] = immutableCopy(child);
      return Object.freeze(copy);
    }
    if (value === null || ["string", "number", "boolean"].includes(typeof value)) return value;
    fail("frames, records, and actions must contain serializable data only");
  }

  function assertSemanticAction(action) {
    assertObject(action, "semantic action");
    if (!ACTION_TYPE_VALUES.includes(action.type)) fail(`unknown semantic action type ${action.type}`);

    if (action.type === "act") {
      assertKeys(action, ["type", "verb", "target", "instrument", "prep"], "act action");
      assertString(action.verb, "act.verb");
    }
    if (action.type === "move") {
      assertKeys(action, ["type", "direction"], "move action");
      assertString(action.direction, "move.direction");
    }
    if (action.type === "answer") {
      assertKeys(action, ["type", "questionId", "choice"], "answer action");
      assertString(action.questionId, "answer.questionId");
      assertString(action.choice, "answer.choice");
    }
    if (action.type === "system") {
      assertKeys(action, ["type", "command"], "system action");
      assertString(action.command, "system.command");
    }

    return action;
  }

  function assertRef(value, label, allowed) {
    assertObject(value, label);
    assertKeys(value, allowed, label);
    assertString(value.id, `${label}.id`);
    assertString(value.label, `${label}.label`);
  }

  function assertRendererFrame(frame) {
    assertObject(frame, "frame");
    assertKeys(frame, ["revision", "room", "scene", "presentation", "actors", "objects", "exits", "actions", "ui"], "frame");
    if (!Number.isInteger(frame.revision) || frame.revision < 0) fail("frame.revision must be a non-negative integer");

    assertRef(frame.room, "frame.room", ["id", "label"]);
    if (frame.scene !== undefined) {
      assertObject(frame.scene, "frame.scene");
      assertKeys(frame.scene, ["id"], "frame.scene");
      assertString(frame.scene.id, "frame.scene.id");
    }

    if (frame.presentation !== undefined) {
      const presentation = frame.presentation;
      assertObject(presentation, "frame.presentation");
      assertKeys(presentation, ["revision", "context", "beats"], "frame.presentation");
      if (!Number.isInteger(presentation.revision) || presentation.revision < 0) fail("presentation.revision must be a non-negative integer");
      if (!Array.isArray(presentation.beats) || presentation.beats.length > 3) fail("presentation.beats must be an array of at most three identities");
      for (const scene of [presentation.context, ...presentation.beats]) {
        assertObject(scene, "presentation scene");
        assertKeys(scene, ["id"], "presentation scene");
        assertString(scene.id, "presentation scene.id");
      }
    }

    if (!Array.isArray(frame.actors)) fail("frame.actors must be an array");
    for (const actor of frame.actors) assertRef(actor, "frame actor", ["id", "label"]);

    if (!Array.isArray(frame.objects)) fail("frame.objects must be an array");
    for (const object of frame.objects) {
      assertRef(object, "frame object", ["id", "label", "kind"]);
      assertString(object.kind, "frame object.kind");
    }

    if (!Array.isArray(frame.exits)) fail("frame.exits must be an array");
    for (const exit of frame.exits) {
      assertObject(exit, "frame exit");
      assertKeys(exit, ["direction", "label", "action"], "frame exit");
      assertString(exit.direction, "frame exit.direction");
      assertString(exit.label, "frame exit.label");
      assertSemanticAction(exit.action);
      if (exit.action.type !== "move") fail("frame exit action must be move");
    }

    if (!Array.isArray(frame.actions)) fail("frame.actions must be an array");
    for (const available of frame.actions) {
      assertObject(available, "available action");
      assertKeys(available, ["id", "label", "enabled", "action"], "available action");
      assertString(available.id, "available action.id");
      assertString(available.label, "available action.label");
      if (typeof available.enabled !== "boolean") fail("available action.enabled must be boolean");
      assertSemanticAction(available.action);
    }

    assertObject(frame.ui, "frame.ui");
    assertKeys(frame.ui, ["mode", "locationLabel", "actLabel", "inputEnabled"], "frame.ui");
    if (!UI_MODE_VALUES.includes(frame.ui.mode)) fail(`unknown UI mode ${frame.ui.mode}`);
    assertString(frame.ui.locationLabel, "frame.ui.locationLabel");
    assertString(frame.ui.actLabel, "frame.ui.actLabel");
    if (typeof frame.ui.inputEnabled !== "boolean") fail("frame.ui.inputEnabled must be boolean");

    return frame;
  }

  function assertOutputRecords(records) {
    if (!Array.isArray(records)) fail("output records must be an array");
    for (const record of records) {
      assertObject(record, "output record");
      if (!OUTPUT_KIND_VALUES.includes(record.k)) fail(`unknown output kind ${record.k}`);
      if (record.k === "act") {
        assertKeys(record, ["k", "num", "name"], "act output record");
        assertString(record.num, "act output record.num");
        assertString(record.name, "act output record.name");
      } else {
        assertKeys(record, ["k", "t"], "output record");
        if (typeof record.t !== "string") fail("output record.t must be a string");
      }
    }
    return records;
  }

  function defineRenderer(specification) {
    assertObject(specification, "renderer");
    assertString(specification.id, "renderer.id");
    if (!RENDERER_ID_VALUES.includes(specification.id)) fail(`unknown renderer id ${specification.id}`);
    for (const method of ["mount", "render", "consume", "destroy"]) {
      if (typeof specification[method] !== "function") fail(`renderer.${method} must be a function`);
    }
    return Object.freeze({ ...specification });
  }

  function createRendererHost({ renderer, readFrame, dispatch, subscribe }) {
    const validatedRenderer = defineRenderer(renderer);
    for (const [name, value] of Object.entries({ readFrame, dispatch, subscribe })) {
      if (typeof value !== "function") fail(`${name} must be a function`);
    }

    let mounted = false;
    let unsubscribe = null;
    let host;

    const services = Object.freeze({
      dispatch(action) {
        assertSemanticAction(action);
        return dispatch(immutableCopy(action));
      },
      requestRender() {
        return host.render();
      }
    });

    host = Object.freeze({
      mount(target) {
        if (mounted) fail("host is already mounted");
        validatedRenderer.mount(target, services);
        mounted = true;
        const maybeUnsubscribe = subscribe(records => {
          assertOutputRecords(records);
          validatedRenderer.consume(immutableCopy(records));
        });
        if (maybeUnsubscribe != null && typeof maybeUnsubscribe !== "function") fail("subscribe must return a function or nothing");
        unsubscribe = maybeUnsubscribe || null;
        return host.render();
      },
      render() {
        if (!mounted) fail("host is not mounted");
        const frame = immutableCopy(readFrame());
        assertRendererFrame(frame);
        validatedRenderer.render(frame);
        return frame;
      },
      destroy() {
        if (!mounted) return;
        if (unsubscribe) unsubscribe();
        unsubscribe = null;
        validatedRenderer.destroy();
        mounted = false;
      }
    });

    return host;
  }

  global.RamaRendererContract = Object.freeze({
    RENDERER_IDS,
    OUTPUT_KINDS,
    ACTION_TYPES,
    UI_MODES,
    assertSemanticAction,
    assertRendererFrame,
    assertOutputRecords,
    defineRenderer,
    createRendererHost
  });
})(globalThis);
