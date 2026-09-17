(function installRamaEditionSession(global) {
  "use strict";

  function start(settings) {
    settings = settings || {};
    if (typeof document === "undefined" || typeof window === "undefined") return null;
    const editionId = settings.editionId;
    const lifecycle = global.RamaEditionLifecycle;
    const sessionApi = global.RamaVoyageSession;
    const registry = global.RamaEditionRegistry;
    if (!lifecycle || !sessionApi || !registry || !registry.edition(editionId)) return null;

    const fallback = new URL("../../launcher/", window.location.href);
    const coordinator = sessionApi.createCoordinator({
      localStorage: global.localStorage,
      sessionStorage: global.sessionStorage,
      editionRegistry: registry,
      eventTarget: window
    });
    let returnPath = fallback.pathname;
    let locked = false;
    let returnButton = null;

    function sessionStatus(message, isError) {
      let status = document.getElementById("session-status");
      if (!status) {
        status = document.createElement("div");
        status.id = "session-status";
        status.setAttribute("role", isError ? "alert" : "status");
        status.setAttribute("aria-live", isError ? "assertive" : "polite");
        document.body.appendChild(status);
      }
      status.textContent = message;
      status.classList.toggle("is-error", !!isError);
      status.setAttribute("role", isError ? "alert" : "status");
      return status;
    }

    function launcherHref() {
      return new URL(returnPath || fallback.pathname, window.location.origin).href;
    }

    function navigateToLauncher() {
      window.location.assign(launcherHref());
    }

    function lock(reason) {
      if (locked) return;
      locked = true;
      lifecycle.setWritable(false);
      for (const id of ["btn-begin", "btn-continue"]) {
        const button = document.getElementById(id);
        if (button) button.disabled = true;
      }
      if (returnButton) returnButton.disabled = true;
      const message = reason === "stale-save"
        ? "A newer voyage snapshot exists elsewhere. This tab is locked and cannot overwrite it."
        : reason === "storage-unavailable" || reason === "storage-failed" || reason === "verification-failed" || reason === "rollback-failed"
          ? "Protected saving is unavailable. This tab is locked so the canonical voyage cannot be damaged."
          : "This voyage was continued in another tab. This tab can no longer accept commands or save.";
      sessionStatus(`${message} Return to the launcher to recover from the latest saved voyage.`, true);
      addUnsafeReturnControl();
    }

    function guardedGate() {
      return Object.freeze({
        commit(payload) {
          const result = coordinator.commit(payload);
          if (!result.ok) lock(result.reason);
          return result;
        },
        removeCanonical() {
          const result = coordinator.removeCanonical();
          if (!result.ok) lock(result.reason);
          return result;
        }
      });
    }

    function installProtection() {
      installCanonicalWriteGate(guardedGate());
      coordinator.onLock(lock);
      coordinator.startMonitoring();
      window.addEventListener("pagehide", coordinator.stopMonitoring, { once: true });
    }

    function saveAndReturn() {
      if (locked || !returnButton) return;
      returnButton.disabled = true;
      sessionStatus("Saving the canonical voyage…", false);
      const expected = snapshot();
      const saved = doSave(false);
      let exact = false;
      try { exact = saved === true && localStorage.getItem(SAVEKEY) === expected; }
      catch (error) { exact = false; }
      if (!exact) {
        returnButton.disabled = false;
        if (!locked) sessionStatus("The voyage could not be saved and verified exactly. Return has been cancelled.", true);
        return;
      }
      const released = coordinator.release(editionId);
      if (!released.ok) {
        returnButton.disabled = false;
        lock(released.reason);
        return;
      }
      sessionStatus("Voyage saved and verified. Returning to the gallery…", false);
      navigateToLauncher();
    }

    function addReturnControl() {
      if (returnButton) return returnButton;
      returnButton = document.createElement("button");
      returnButton.type = "button";
      returnButton.id = "return-to-launcher";
      returnButton.textContent = "Save and return to launcher";
      returnButton.setAttribute("aria-label", "Save the canonical voyage and return to the launcher");
      returnButton.addEventListener("click", saveAndReturn);
      document.body.appendChild(returnButton);
      document.body.classList.add("launcher-session");
      return returnButton;
    }

    function addUnsafeReturnControl() {
      let button = document.getElementById("return-without-saving");
      if (button) return button;
      button = document.createElement("button");
      button.type = "button";
      button.id = "return-without-saving";
      button.textContent = "Return to launcher without saving";
      button.addEventListener("click", navigateToLauncher);
      document.body.appendChild(button);
      return button;
    }

    function failClosed(message) {
      lifecycle.setWritable(false);
      for (const id of ["btn-begin", "btn-continue"]) {
        const button = document.getElementById(id);
        if (button) button.disabled = true;
      }
      sessionStatus(message, true);
      addUnsafeReturnControl();
    }

    function beginManagedHandoff(token) {
      const claimed = coordinator.claimHandoff(token, editionId);
      if (!claimed.ok) {
        if (claimed.reason === "handoff-replayed" && claimed.status === "consumed") {
          const recovery = coordinator.recoverHandoff(token, editionId);
          if (!recovery.ok) {
            failClosed("This launch has already been used and no protected recovery save is available.");
            return;
          }
          returnPath = recovery.handoff.returnPath;
          installProtection();
          addReturnControl();
          sessionStatus("Recovered from the latest protected canonical save after refresh.", false);
          if (!lifecycle.start("continue")) lock("restore-failed");
          return;
        }
        failClosed("This launcher handoff is invalid, expired, already used, or belongs to another edition. The canonical save was not changed.");
        return;
      }

      returnPath = claimed.handoff.returnPath;
      installProtection();
      addReturnControl();
      const consumed = coordinator.consumeHandoff(token);
      if (!consumed.ok) {
        lock(consumed.reason);
        return;
      }
      const started = lifecycle.start(consumed.handoff.intent);
      if (!started) {
        lock(consumed.handoff.intent === "continue" ? "restore-failed" : "new-game-failed");
        sessionStatus(
          consumed.handoff.intent === "continue"
            ? "The stored voyage could not be restored. It remains untouched; return to the launcher for recovery."
            : "The new voyage could not start safely. The stored voyage was not replaced.",
          true
        );
      }
    }

    function beginDirectEntry() {
      const acquired = coordinator.acquire(editionId);
      if (acquired.ok) {
        installProtection();
        addReturnControl();
        sessionStatus("Direct preservation entry has protected canonical-save ownership.", false);
        return;
      }
      if (acquired.reason !== "active-owner") {
        failClosed("Protected voyage coordination is unavailable in this browser. Play is disabled to protect the canonical save.");
        return;
      }

      lifecycle.setWritable(false);
      for (const id of ["btn-begin", "btn-continue"]) {
        const button = document.getElementById(id);
        if (button) button.disabled = true;
      }
      sessionStatus(
        `${acquired.stale ? "An earlier voyage session may have been abandoned." : "The voyage is active in another tab."} Direct entry will not take control without permission.`,
        true
      );
      const takeover = document.createElement("button");
      takeover.type = "button";
      takeover.id = "take-over-voyage";
      takeover.textContent = "Take over from latest save";
      takeover.addEventListener("click", function() {
        takeover.disabled = true;
        const result = coordinator.acquire(editionId, { takeover: true });
        if (!result.ok) {
          takeover.disabled = false;
          sessionStatus("Takeover failed. The canonical save was not changed.", true);
          return;
        }
        lifecycle.setWritable(true);
        for (const id of ["btn-begin", "btn-continue"]) {
          const button = document.getElementById(id);
          if (button) button.disabled = false;
        }
        installProtection();
        addReturnControl();
        takeover.remove();
        const unsafeReturn = document.getElementById("return-without-saving");
        if (unsafeReturn) unsafeReturn.remove();
        sessionStatus("Takeover complete. Choose Continue to restore the latest canonical save.", false);
      });
      document.body.appendChild(takeover);
      addUnsafeReturnControl();
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("handoff");
    if (token) beginManagedHandoff(token);
    else beginDirectEntry();

    return Object.freeze({ coordinator, editionId, lock, saveAndReturn });
  }

  global.RamaEditionSession = Object.freeze({ start });
})(globalThis);
