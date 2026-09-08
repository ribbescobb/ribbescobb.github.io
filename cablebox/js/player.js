// player.js — YouTube's IFrame player plus what a TV needs: play-from-offset, a dead-video watchdog, and
// drift correction so the picture stays on the broadcast clock. The player is created only after the
// viewer's first click (the power knob), which is what lets it autoplay with sound.
(function () {
  let yt = null, ready = false, pending = null, loadedId = null, playing = false;
  let watchdog = null, watchdogStrikes = 0, stopped = true;
  const cb = { onDead: null, onEnded: null, onPlaying: null };
  let volume = 70, muted = false;

  function ensureApi() {
    if (yt) return;
    if (window.YT && window.YT.Player) { create(); return; }
    if (!document.getElementById('yt-api')) {
      const s = document.createElement('script'); s.id = 'yt-api'; s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
    window.onYouTubeIframeAPIReady = create;
  }

  function create() {
    if (yt) return;
    yt = new YT.Player('yt', {
      width: '100%', height: '100%',
      playerVars: { autoplay: 1, controls: 0, disablekb: 1, rel: 0, playsinline: 1, iv_load_policy: 3, fs: 0, origin: location.origin },
      events: {
        onReady() {
          ready = true; yt.setVolume(volume); if (muted) yt.mute();
          if (pending) { const p = pending; pending = null; play(p.id, p.start, p.end); }
        },
        onStateChange(e) {
          const S = YT.PlayerState;
          if (e.data === S.PLAYING) {
            playing = true; clearTimeout(watchdog); watchdog = null; watchdogStrikes = 0;
            cb.onPlaying && cb.onPlaying(loadedId);
          } else if (e.data === S.ENDED) {
            playing = false; cb.onEnded && cb.onEnded(loadedId);
          } else if (e.data === S.PAUSED && !stopped) {
            // The picture has no controls, but a click still pauses. Television does not pause.
            setTimeout(() => { if (yt && !stopped && yt.getPlayerState() === S.PAUSED) yt.playVideo(); }, 350);
          }
        },
        onError(e) { dead('error ' + e.data); }
      }
    });
  }

  function armWatchdog() {
    clearTimeout(watchdog);
    watchdog = setTimeout(() => {
      if (playing || stopped) return;
      const st = yt && yt.getPlayerState ? yt.getPlayerState() : -1;
      watchdogStrikes++;
      // Unstarted after 12s is dead. Buffering or cued gets one more chance (pre-roll ads live here).
      if (st === -1 || watchdogStrikes >= 3) dead('never started (state ' + st + ')'); else armWatchdog();
    }, 12000);
  }

  function play(id, start, end) {
    stopped = false;
    if (!ready) { pending = { id, start, end }; ensureApi(); return; }
    loadedId = id; playing = false; watchdogStrikes = 0;
    const opts = { videoId: id, startSeconds: Math.max(0, Math.floor(start || 0)) };
    if (end) opts.endSeconds = Math.floor(end);
    yt.loadVideoById(opts);
    armWatchdog();
  }

  function dead(why) {
    clearTimeout(watchdog); watchdog = null;
    const id = loadedId;
    console.warn('[player] dead video', id, why);
    cb.onDead && cb.onDead(id, why);
  }

  function stop() {
    stopped = true; pending = null; clearTimeout(watchdog); watchdog = null;
    if (yt && ready) yt.stopVideo();
    playing = false; loadedId = null;
  }

  // Nudge the picture back onto the clock if it has drifted (buffering, ads, throttling).
  function correct(expected) {
    if (!yt || !ready || !playing || stopped) return;
    const t = yt.getCurrentTime ? yt.getCurrentTime() : 0;
    if (t < 1) return;                       // reads 0 during a pre-roll ad; leave it alone
    if (Math.abs(t - expected) > 5) yt.seekTo(expected, true);
  }

  function setVolume(v) { volume = Math.max(0, Math.min(100, Math.round(v))); if (yt && ready) yt.setVolume(volume); return volume; }
  function setMuted(m) { muted = !!m; if (yt && ready) (muted ? yt.mute() : yt.unMute()); return muted; }

  window.Player = {
    ensureApi, play, stop, correct, setVolume, setMuted,
    on(name, fn) { cb[name] = fn; },
    get playing() { return playing; }, get volume() { return volume; }, get muted() { return muted; }, get loadedId() { return loadedId; }
  };
})();
