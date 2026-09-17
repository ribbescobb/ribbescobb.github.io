(function installRamaEditionBoot(global) {
  "use strict";

  function start(settings) {
    settings = settings || {};
    const done = typeof settings.onComplete === "function" ? settings.onComplete : function() {};
    if (typeof document === "undefined") {
      done();
      return null;
    }

    const root = document.getElementById(settings.rootId || "edition-boot");
    if (!root || root.getAttribute("data-edition") !== settings.editionId) {
      done();
      return null;
    }

    const power = document.getElementById("boot-power");
    const skip = document.getElementById("boot-skip");
    const mute = document.getElementById("boot-mute");
    const status = document.getElementById("boot-status");
    const audio = document.getElementById("boot-audio");
    const reducedMotion = typeof global.matchMedia === "function" &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 120 : Math.max(0, Number(settings.durationMs) || 0);
    const statusText = settings.statusText || {};
    const requestedCueOffsets = Array.isArray(settings.audioCueOffsetsMs) && settings.audioCueOffsetsMs.length
      ? settings.audioCueOffsetsMs
      : [0];
    const audioCueOffsets = requestedCueOffsets
      .map(function(offset) { return Math.max(0, Number(offset) || 0); })
      .filter(function(offset, index, values) {
        return offset < duration && values.indexOf(offset) === index;
      });
    let muted = false;
    let running = false;
    let finished = false;
    let timer = null;
    const audioTimers = [];
    const suspendedElements = [];

    function suspendUnderlyingPage() {
      const children = document.body && document.body.children ? Array.from(document.body.children) : [];
      for (const child of children) {
        if (child === root || child.inert === true) continue;
        child.inert = true;
        suspendedElements.push(child);
      }
    }

    function restoreUnderlyingPage() {
      for (const child of suspendedElements) child.inert = false;
      suspendedElements.length = 0;
    }

    function setStatus(message) {
      if (status) status.textContent = message;
    }

    function finish() {
      if (finished) return;
      finished = true;
      if (timer !== null && typeof global.clearTimeout === "function") global.clearTimeout(timer);
      if (typeof global.clearTimeout === "function") {
        for (const audioTimer of audioTimers) global.clearTimeout(audioTimer);
      }
      audioTimers.length = 0;
      if (audio && typeof audio.pause === "function") audio.pause();
      root.hidden = true;
      root.classList.remove("is-running");
      document.body.classList.remove("edition-boot-active");
      restoreUnderlyingPage();
      done();
    }

    function playAudioCue() {
      if (muted || finished || !audio || typeof audio.play !== "function") return;
      try {
        audio.currentTime = 0;
        const playback = audio.play();
        if (playback && typeof playback.catch === "function") {
          playback.catch(function() {
            setStatus(statusText.audioBlocked || "AUDIO BLOCKED · CONTINUING SILENTLY");
          });
        }
      } catch (error) {
        setStatus(statusText.audioUnavailable || "AUDIO UNAVAILABLE · CONTINUING SILENTLY");
      }
    }

    function begin() {
      if (running || finished) return;
      running = true;
      root.classList.add("is-running");
      if (power) power.disabled = true;
      if (mute) mute.disabled = true;
      setStatus(muted
        ? (statusText.runningMuted || "MUTED · BOOTING")
        : (statusText.running || "BOOTING"));

      for (const offset of audioCueOffsets) {
        if (offset === 0) playAudioCue();
        else audioTimers.push(global.setTimeout(playAudioCue, offset));
      }

      timer = global.setTimeout(finish, duration);
    }

    function toggleMute() {
      if (running || finished) return;
      muted = !muted;
      if (mute) {
        mute.setAttribute("aria-pressed", String(muted));
        mute.textContent = muted ? "Sound muted" : "Sound on";
      }
      setStatus(muted
        ? (statusText.readyMuted || "READY · SOUND MUTED")
        : (statusText.ready || "READY"));
    }

    root.hidden = false;
    document.body.classList.add("edition-boot-active");
    suspendUnderlyingPage();
    setStatus(statusText.ready || (status ? status.textContent : "READY"));
    if (power) power.addEventListener("click", begin, { once: true });
    if (skip) skip.addEventListener("click", finish, { once: true });
    if (mute) mute.addEventListener("click", toggleMute);
    if (power && typeof power.focus === "function") power.focus();

    return Object.freeze({
      begin,
      skip: finish,
      muted: function() { return muted; },
      running: function() { return running; },
      finished: function() { return finished; }
    });
  }

  global.RamaEditionBoot = Object.freeze({ start });
})(globalThis);
