(function installRamaVoyageSession(global) {
  "use strict";

  const RECORD_VERSION = 1;
  const OWNER_TTL_MS = 5 * 60 * 1000;
  const HEARTBEAT_MS = 15 * 1000;
  const HANDOFF_TTL_MS = 2 * 60 * 1000;
  const KEYS = Object.freeze({
    canonicalSave: "rama_if_save_v2",
    owner: "rama_voyage_owner_v1",
    client: "rama_voyage_client_v1",
    handoff: "rama_voyage_handoff_v1",
    launcherSelection: "rama_launcher_selection_v1"
  });

  function parseRecord(raw) {
    if (!raw) return null;
    try {
      const value = JSON.parse(raw);
      return value && typeof value === "object" && !Array.isArray(value) ? value : null;
    } catch (error) {
      return null;
    }
  }

  function read(storage, key) {
    try { return storage ? storage.getItem(key) : null; }
    catch (error) { return null; }
  }

  function write(storage, key, value) {
    try {
      const encoded = JSON.stringify(value);
      storage.setItem(key, encoded);
      return storage.getItem(key) === encoded;
    }
    catch (error) { return false; }
  }

  function remove(storage, key) {
    try { storage.removeItem(key); return storage.getItem(key) === null; }
    catch (error) { return false; }
  }

  function randomToken() {
    if (global.crypto && typeof global.crypto.randomUUID === "function") return global.crypto.randomUUID();
    const part = () => Math.random().toString(36).slice(2);
    return `${part()}-${part()}-${Date.now().toString(36)}`;
  }

  function validateCanonicalEnvelope(payload) {
    if (typeof payload !== "string" || !payload) return false;
    try {
      const value = JSON.parse(payload);
      if (!value || typeof value !== "object" || Array.isArray(value)) return false;
      const keys = Object.keys(value).sort();
      if (keys.join("|") !== "S|charLocs|itemLocs|version") return false;
      if (value.version !== 2 || !value.S || typeof value.S !== "object" || Array.isArray(value.S)) return false;
      if (!value.itemLocs || typeof value.itemLocs !== "object" || Array.isArray(value.itemLocs)) return false;
      if (!value.charLocs || typeof value.charLocs !== "object" || Array.isArray(value.charLocs)) return false;
      return typeof value.S.loc === "string" && value.S.loc.length > 0 && value.S.act >= 1 && value.S.act <= 4;
    } catch (error) {
      return false;
    }
  }

  function normalizeReturnPath(requested, origin, fallbackPath) {
    try {
      const fallback = new URL(fallbackPath, origin);
      const candidate = new URL(requested || fallback.href, origin);
      if (candidate.origin !== fallback.origin) return fallback.pathname + fallback.search + fallback.hash;
      return candidate.pathname + candidate.search + candidate.hash;
    } catch (error) {
      try {
        const fallback = new URL(fallbackPath, origin);
        return fallback.pathname + fallback.search + fallback.hash;
      } catch (ignored) {
        return "/rama/launcher/";
      }
    }
  }

  function createCoordinator(options) {
    options = options || {};
    const localStorage = options.localStorage;
    const sessionStorage = options.sessionStorage;
    const now = typeof options.now === "function" ? options.now : () => Date.now();
    const makeToken = typeof options.makeToken === "function" ? options.makeToken : randomToken;
    const editionRegistry = options.editionRegistry || global.RamaEditionRegistry;
    const eventTarget = options.eventTarget || null;
    const setIntervalFn = options.setInterval || global.setInterval;
    const clearIntervalFn = options.clearInterval || global.clearInterval;
    const ownerTtlMs = Number.isFinite(options.ownerTtlMs) ? options.ownerTtlMs : OWNER_TTL_MS;
    const handoffTtlMs = Number.isFinite(options.handoffTtlMs) ? options.handoffTtlMs : HANDOFF_TTL_MS;
    const listeners = new Set();
    let monitorTimer = null;
    let lockedReason = null;

    function validEdition(id) {
      return !!(editionRegistry && typeof editionRegistry.edition === "function" && editionRegistry.edition(id));
    }

    function ownerRecord() {
      const record = parseRecord(read(localStorage, KEYS.owner));
      if (!record || record.version !== RECORD_VERSION || typeof record.ownerId !== "string" || !Number.isInteger(record.generation)) return null;
      return record;
    }

    function clientRecord() {
      const record = parseRecord(read(sessionStorage, KEYS.client));
      if (!record || record.version !== RECORD_VERSION || typeof record.ownerId !== "string" || !Number.isInteger(record.generation)) return null;
      return record;
    }

    function handoffRecord() {
      const record = parseRecord(read(sessionStorage, KEYS.handoff));
      if (!record || record.version !== RECORD_VERSION || typeof record.token !== "string") return null;
      return record;
    }

    function notify(reason) {
      if (!lockedReason) lockedReason = reason;
      for (const listener of listeners) listener(lockedReason);
    }

    function claimIsCurrent() {
      const owner = ownerRecord();
      const client = clientRecord();
      return !!(owner && client && owner.state === "active" &&
        owner.ownerId === client.ownerId && owner.generation === client.generation);
    }

    function isOwnerStale(owner) {
      return !!(owner && owner.state === "active" && now() - Number(owner.heartbeatAt || 0) > ownerTtlMs);
    }

    function ownershipStatus() {
      const owner = ownerRecord();
      const client = clientRecord();
      if (!owner || owner.state !== "active") return { state: "available", owner, stale: false };
      if (client && owner.ownerId === client.ownerId && owner.generation === client.generation) {
        return { state: "owned", owner, stale: false };
      }
      return { state: "conflict", owner, stale: isOwnerStale(owner) };
    }

    function acquire(editionId, settings) {
      settings = settings || {};
      if (!validEdition(editionId)) return { ok: false, reason: "unknown-edition" };
      const existing = ownerRecord();
      const client = clientRecord();
      const sameClaim = existing && client && existing.state === "active" &&
        existing.ownerId === client.ownerId && existing.generation === client.generation;

      if (existing && existing.state === "active" && !sameClaim && !settings.takeover) {
        return { ok: false, reason: "active-owner", stale: isOwnerStale(existing), owner: existing };
      }

      if (sameClaim && !settings.takeover) {
        const updatedOwner = { ...existing, editionId, heartbeatAt: now() };
        const updatedClient = { ...client, editionId, lockedReason: null };
        if (!write(localStorage, KEYS.owner, updatedOwner) || !write(sessionStorage, KEYS.client, updatedClient)) {
          return { ok: false, reason: "storage-unavailable" };
        }
        lockedReason = null;
        return { ok: true, claim: updatedClient, reused: true };
      }

      const ownerId = makeToken();
      const generation = Math.max(0, existing && Number.isInteger(existing.generation) ? existing.generation : 0) + 1;
      let baseline;
      try { baseline = localStorage.getItem(KEYS.canonicalSave); }
      catch (error) { return { ok: false, reason: "storage-unavailable" }; }
      const nextOwner = {
        version: RECORD_VERSION,
        state: "active",
        ownerId,
        generation,
        editionId,
        heartbeatAt: now()
      };
      const nextClient = {
        version: RECORD_VERSION,
        ownerId,
        generation,
        editionId,
        expectedPayload: baseline,
        lockedReason: null
      };
      if (!write(localStorage, KEYS.owner, nextOwner) || !write(sessionStorage, KEYS.client, nextClient)) {
        return { ok: false, reason: "storage-unavailable" };
      }
      lockedReason = null;
      return { ok: true, claim: nextClient, takeover: !!settings.takeover };
    }

    function createHandoff(settings) {
      settings = settings || {};
      const editionId = settings.editionId;
      const descriptor = editionRegistry && editionRegistry.launcherEdition && editionRegistry.launcherEdition(editionId);
      if (!descriptor) return { ok: false, reason: "edition-unavailable" };
      if (settings.intent !== "new" && settings.intent !== "continue") return { ok: false, reason: "invalid-intent" };
      const acquired = acquire(editionId, { takeover: !!settings.takeover });
      if (!acquired.ok) return acquired;
      const token = makeToken();
      const fallbackPath = settings.fallbackPath || "/rama/launcher/";
      const record = {
        version: RECORD_VERSION,
        token,
        editionId,
        intent: settings.intent,
        returnPath: normalizeReturnPath(settings.returnPath, settings.origin, fallbackPath),
        ownerId: acquired.claim.ownerId,
        generation: acquired.claim.generation,
        status: "ready",
        createdAt: now(),
        expiresAt: now() + handoffTtlMs
      };
      if (!write(sessionStorage, KEYS.handoff, record)) {
        release(editionId);
        return { ok: false, reason: "storage-unavailable" };
      }
      return { ok: true, token, handoff: record, claim: acquired.claim, takeover: acquired.takeover };
    }

    function claimHandoff(token, editionId) {
      const record = handoffRecord();
      if (!record || record.token !== token) return { ok: false, reason: "missing-handoff" };
      if (record.editionId !== editionId) return { ok: false, reason: "edition-mismatch" };
      if (record.status !== "ready") return { ok: false, reason: "handoff-replayed", status: record.status };
      if (record.expiresAt < now()) return { ok: false, reason: "handoff-expired" };
      const client = clientRecord();
      if (!client || client.ownerId !== record.ownerId || client.generation !== record.generation || !claimIsCurrent()) {
        return { ok: false, reason: "ownership-lost" };
      }
      const claimed = { ...record, status: "claimed", claimedAt: now() };
      if (!write(sessionStorage, KEYS.handoff, claimed)) return { ok: false, reason: "storage-unavailable" };
      return { ok: true, handoff: claimed };
    }

    function consumeHandoff(token) {
      const record = handoffRecord();
      if (!record || record.token !== token || record.status !== "claimed") return { ok: false, reason: "handoff-not-claimed" };
      if (!claimIsCurrent()) return { ok: false, reason: "ownership-lost" };
      const consumed = { ...record, status: "consumed", consumedAt: now() };
      if (!write(sessionStorage, KEYS.handoff, consumed)) return { ok: false, reason: "storage-unavailable" };
      return { ok: true, handoff: consumed };
    }

    function recoverHandoff(token, editionId) {
      const record = handoffRecord();
      if (!record || record.token !== token || record.editionId !== editionId || record.status !== "consumed") {
        return { ok: false, reason: "handoff-not-recoverable" };
      }
      if (!claimIsCurrent()) return { ok: false, reason: "ownership-lost" };
      const payload = read(localStorage, KEYS.canonicalSave);
      if (!validateCanonicalEnvelope(payload)) return { ok: false, reason: "no-recovery-save", handoff: record };
      return { ok: true, intent: "recover", handoff: record, payload };
    }

    function guard() {
      if (lockedReason) return { ok: false, reason: lockedReason };
      const owner = ownerRecord();
      const client = clientRecord();
      if (!owner || !client || owner.state !== "active" || owner.ownerId !== client.ownerId || owner.generation !== client.generation) {
        notify("ownership-lost");
        return { ok: false, reason: "ownership-lost" };
      }
      let actual;
      try { actual = localStorage.getItem(KEYS.canonicalSave); }
      catch (error) {
        notify("storage-unavailable");
        return { ok: false, reason: "storage-unavailable" };
      }
      if (actual !== client.expectedPayload) {
        notify("stale-save");
        return { ok: false, reason: "stale-save", expected: client.expectedPayload, actual };
      }
      return { ok: true, owner, client, actual };
    }

    function updateExpected(client, payload) {
      const next = { ...client, expectedPayload: payload, lockedReason: null };
      if (!write(sessionStorage, KEYS.client, next)) {
        notify("storage-unavailable");
        return false;
      }
      return true;
    }

    function rollbackCanonical(checked, writtenPayload) {
      try {
        const owner = ownerRecord();
        if (!owner || owner.state !== "active" || owner.ownerId !== checked.owner.ownerId || owner.generation !== checked.owner.generation) {
          return false;
        }
        if (localStorage.getItem(KEYS.canonicalSave) !== writtenPayload) return false;
        if (checked.actual === null) localStorage.removeItem(KEYS.canonicalSave);
        else localStorage.setItem(KEYS.canonicalSave, checked.actual);
        return localStorage.getItem(KEYS.canonicalSave) === checked.actual;
      } catch (error) {
        return false;
      }
    }

    function heartbeat() {
      const checked = guard();
      if (!checked.ok) return checked;
      const nextOwner = { ...checked.owner, heartbeatAt: now() };
      if (!write(localStorage, KEYS.owner, nextOwner)) {
        notify("storage-unavailable");
        return { ok: false, reason: "storage-unavailable" };
      }
      return { ok: true };
    }

    function commit(payload) {
      if (typeof payload !== "string") return { ok: false, reason: "invalid-payload" };
      const checked = guard();
      if (!checked.ok) return checked;
      try {
        localStorage.setItem(KEYS.canonicalSave, payload);
        const stored = localStorage.getItem(KEYS.canonicalSave);
        if (stored !== payload) {
          notify("verification-failed");
          return { ok: false, reason: "verification-failed", actual: stored };
        }
        if (!updateExpected(checked.client, payload)) {
          const rolledBack = rollbackCanonical(checked, payload);
          return { ok: false, reason: rolledBack ? "storage-unavailable" : "rollback-failed" };
        }
        const currentOwner = ownerRecord();
        if (currentOwner && currentOwner.ownerId === checked.owner.ownerId && currentOwner.generation === checked.owner.generation) {
          write(localStorage, KEYS.owner, { ...currentOwner, heartbeatAt: now() });
        }
        return { ok: true, payload };
      } catch (error) {
        return { ok: false, reason: "storage-failed", error };
      }
    }

    function removeCanonical() {
      const checked = guard();
      if (!checked.ok) return checked;
      try {
        localStorage.removeItem(KEYS.canonicalSave);
        const stored = localStorage.getItem(KEYS.canonicalSave);
        if (stored !== null) {
          notify("verification-failed");
          return { ok: false, reason: "verification-failed", actual: stored };
        }
        if (!updateExpected(checked.client, null)) {
          const rolledBack = rollbackCanonical(checked, null);
          return { ok: false, reason: rolledBack ? "storage-unavailable" : "rollback-failed" };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, reason: "storage-failed", error };
      }
    }

    function release(editionId) {
      const checked = guard();
      if (!checked.ok) return checked;
      const released = { ...checked.owner, state: "released", editionId, heartbeatAt: now() };
      if (!write(localStorage, KEYS.owner, released)) return { ok: false, reason: "storage-unavailable" };
      write(sessionStorage, KEYS.launcherSelection, { version: RECORD_VERSION, editionId });
      remove(sessionStorage, KEYS.client);
      lockedReason = "released";
      return { ok: true };
    }

    function rememberSelection(editionId) {
      if (!validEdition(editionId)) return false;
      return write(sessionStorage, KEYS.launcherSelection, { version: RECORD_VERSION, editionId });
    }

    function rememberedSelection() {
      const record = parseRecord(read(sessionStorage, KEYS.launcherSelection));
      return record && record.version === RECORD_VERSION && validEdition(record.editionId) ? record.editionId : null;
    }

    function canDispatch() {
      return !lockedReason && claimIsCurrent();
    }

    function onLock(listener) {
      if (typeof listener !== "function") throw new TypeError("Voyage-session lock listener must be a function");
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    function inspectExternalChange(event) {
      if (!event || event.key === KEYS.owner) {
        if (!claimIsCurrent()) notify("ownership-lost");
      }
      if (event && event.key === KEYS.canonicalSave) {
        const client = clientRecord();
        if (client && event.newValue !== client.expectedPayload) notify("stale-save");
      }
    }

    function startMonitoring() {
      if (eventTarget && typeof eventTarget.addEventListener === "function") eventTarget.addEventListener("storage", inspectExternalChange);
      if (!monitorTimer && typeof setIntervalFn === "function") monitorTimer = setIntervalFn(heartbeat, HEARTBEAT_MS);
      return stopMonitoring;
    }

    function stopMonitoring() {
      if (eventTarget && typeof eventTarget.removeEventListener === "function") eventTarget.removeEventListener("storage", inspectExternalChange);
      if (monitorTimer && typeof clearIntervalFn === "function") clearIntervalFn(monitorTimer);
      monitorTimer = null;
    }

    return Object.freeze({
      acquire,
      createHandoff,
      claimHandoff,
      consumeHandoff,
      recoverHandoff,
      ownershipStatus,
      claimIsCurrent,
      commit,
      removeCanonical,
      release,
      heartbeat,
      rememberSelection,
      rememberedSelection,
      canDispatch,
      onLock,
      inspectExternalChange,
      startMonitoring,
      stopMonitoring,
      clientRecord,
      ownerRecord,
      handoffRecord,
      lockedReason: () => lockedReason
    });
  }

  global.RamaVoyageSession = Object.freeze({
    RECORD_VERSION,
    OWNER_TTL_MS,
    HEARTBEAT_MS,
    HANDOFF_TTL_MS,
    KEYS,
    validateCanonicalEnvelope,
    normalizeReturnPath,
    createCoordinator
  });
})(globalThis);
