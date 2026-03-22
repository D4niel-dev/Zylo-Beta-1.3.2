// ============================================================
// Zylo Unified Sound Engine
// Single source of truth for ALL audio in the app.
// Exposes `window.ZyloSounds` (and `window.SoundEngine` for compat).
// ============================================================

(function () {
  "use strict";

  // ---- Audio file map ---------------------------------------------------
  const AUDIO_PATH = "/files/audio/";
  const SOUNDS = {
    send:           AUDIO_PATH + "send.mp3",
    receive:        AUDIO_PATH + "notification.mp3",
    mention:        AUDIO_PATH + "notification.mp3",
    callRing:       AUDIO_PATH + "notification.mp3",
    callJoin:       AUDIO_PATH + "notification.mp3",
    friendOnline:   AUDIO_PATH + "ui.mp3",
    callDisconnect: AUDIO_PATH + "error.mp3",
    ui:             AUDIO_PATH + "ui.mp3",
    achievement:    AUDIO_PATH + "notification.mp3",
    login:          AUDIO_PATH + "login.mp3",
    logout:         AUDIO_PATH + "logout.mp3",
    error:          AUDIO_PATH + "error.mp3",
  };

  const BG_MUSIC_SRC = AUDIO_PATH + "bg.mp3";

  // ---- Cached Audio objects ---------------------------------------------
  const audioCache = {};
  let bgMusic = null;
  let bgmHasStarted = false;

  function getAudio(key) {
    if (!audioCache[key] && SOUNDS[key]) {
      audioCache[key] = new Audio(SOUNDS[key]);
    }
    return audioCache[key] || null;
  }

  // ---- Settings helpers --------------------------------------------------
  function setting(key, fallback) {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    if (v === "true") return true;
    if (v === "false") return false;
    return v;
  }

  function isMuted()        { return setting("muteAll", false) === true; }
  function soundEnabled()   { return setting("enableSound", true) === true; }
  function musicEnabled()   { return setting("enableMusic", false) === true; }
  function soundVolume()    { return parseInt(setting("soundVolume", 75), 10) / 100; }
  function musicVolume()    { return parseInt(setting("musicVolume", 60), 10) / 100; }
  function duckEnabled()    { return setting("duckMusic", false) === true; }

  // ---- Per-trigger settings ---------------------------------------------
  const TRIGGER_MAP = {
    playSend:           "send",
    playReceive:        "receive",
    playMention:        "mention",
    playCallRing:       "callRing",
    playFriendOnline:   "friendOnline",
    playCallDisconnect: "callDisconnect",
    playUi:             "ui",
    playAchievement:    "achievement",
  };

  function isTriggerEnabled(triggerKey) {
    return setting(triggerKey, true) === true;
  }

  // ---- Notification Muting (per source) ---------------------------------
  let mutedSources = new Set();
  let dndMode = false;

  function loadNotificationSettings() {
    try {
      const muted = JSON.parse(localStorage.getItem("mutedSources") || "[]");
      mutedSources = new Set(muted);
      dndMode = localStorage.getItem("doNotDisturb") === "true";
    } catch (e) {
      console.error("Failed to load notification settings", e);
    }
  }

  function isSourceMuted(sourceId) {
    if (dndMode) return true;
    if (!sourceId) return false;
    return mutedSources.has(sourceId);
  }

  function toggleMuteSource(sourceId) {
    if (mutedSources.has(sourceId)) {
      mutedSources.delete(sourceId);
    } else {
      mutedSources.add(sourceId);
    }
    localStorage.setItem("mutedSources", JSON.stringify([...mutedSources]));
    return mutedSources.has(sourceId);
  }

  function getMuteStatus(sourceId) {
    return mutedSources.has(sourceId);
  }

  function toggleDND() {
    dndMode = !dndMode;
    localStorage.setItem("doNotDisturb", String(dndMode));
    return dndMode;
  }

  function getDNDStatus() {
    return dndMode;
  }

  // ---- Core play function -----------------------------------------------
  function play(soundKey, sourceId) {
    if (isMuted()) return;
    if (!soundEnabled()) return;

    // Check per-trigger setting
    const triggerKey = Object.keys(TRIGGER_MAP).find(
      (k) => TRIGGER_MAP[k] === soundKey
    );
    if (triggerKey && !isTriggerEnabled(triggerKey)) return;

    // Check per-source muting (for receive notifications)
    if (soundKey === "receive" && isSourceMuted(sourceId)) return;

    const audio = getAudio(soundKey);
    if (!audio) return;

    audio.volume = soundVolume();
    audio.currentTime = 0;
    audio.play().catch(() => {});

    // Duck BGM briefly when SFX plays
    if (duckEnabled() && bgMusic && !bgMusic.paused) {
      duckMusicOnce();
    }
  }

  // ---- Music Ducking ----------------------------------------------------
  function duckMusicOnce() {
    if (!bgMusic) return;
    const originalVol = bgMusic.volume;
    bgMusic.volume = originalVol * 0.4;
    setTimeout(() => {
      if (bgMusic) bgMusic.volume = originalVol;
    }, 250);
  }

  // ---- Background Music -------------------------------------------------
  function startBgMusic() {
    if (isMuted()) return;
    if (!musicEnabled()) return;

    if (!bgMusic) {
      bgMusic = new Audio(BG_MUSIC_SRC);
      bgMusic.loop = true;
    }

    // Don't call play() if already playing — prevents double layers
    if (!bgMusic.paused) return;

    bgMusic.volume = musicVolume();
    bgMusic.play().catch(() => {});
    bgmHasStarted = true;
  }

  function resumeBgMusic() {
    if (!bgMusic || !musicEnabled()) return;
    bgMusic.volume = musicVolume();
    bgMusic.play().catch(() => {});
  }

  function stopBgMusic() {
    if (bgMusic) {
      bgMusic.pause();
    }
  }

  function updateBgMusicVolume() {
    if (bgMusic) bgMusic.volume = musicVolume();
  }

  // ---- Auto-start BG Music on page load if enabled ----------------------
  function initBgMusic() {
    if (bgmHasStarted) return;
    if (!musicEnabled() || isMuted()) return;

    startBgMusic();
    const tryStart = () => {
      if (!bgmHasStarted) startBgMusic();
      document.removeEventListener("click", tryStart);
      document.removeEventListener("keydown", tryStart);
    };
    document.addEventListener("click", tryStart, { once: true });
    document.addEventListener("keydown", tryStart, { once: true });
  }

  // ---- Listen for settings changes in real-time -------------------------
  function watchSettingsChanges() {
    // Music toggle
    const musicToggle = document.getElementById("enableMusic");
    if (musicToggle) {
      musicToggle.addEventListener("change", function () {
        if (this.checked && !isMuted()) {
          startBgMusic();
        } else {
          stopBgMusic();
        }
      });
    }

    // Mute all toggle
    const muteToggle = document.getElementById("muteAll");
    if (muteToggle) {
      muteToggle.addEventListener("change", function () {
        if (this.checked) {
          stopBgMusic();
          Object.values(audioCache).forEach(a => { try { a.pause(); a.currentTime = 0; } catch(e){} });
        } else {
          if (musicEnabled() && bgMusic) {
            resumeBgMusic();
          } else if (musicEnabled()) {
            startBgMusic();
          }
        }
      });
    }

    // Sound volume slider — live update + preview on release
    const svSlider = document.getElementById("soundVolume");
    if (svSlider) {
      svSlider.addEventListener("input", function () {
        localStorage.setItem("soundVolume", this.value);
      });
      svSlider.addEventListener("change", function () {
        localStorage.setItem("soundVolume", this.value);
        const preview = getAudio("ui");
        if (preview && soundEnabled() && !isMuted()) {
          preview.volume = parseInt(this.value, 10) / 100;
          preview.currentTime = 0;
          preview.play().catch(() => {});
        }
      });
    }

    // Music volume slider — live BGM update
    const mvSlider = document.getElementById("musicVolume");
    if (mvSlider) {
      mvSlider.addEventListener("input", function () {
        const vol = parseInt(this.value, 10) / 100;
        localStorage.setItem("musicVolume", this.value);
        if (bgMusic) bgMusic.volume = vol;
      });
    }

    // Sound enable toggle
    const soundToggle = document.getElementById("enableSound");
    if (soundToggle) {
      soundToggle.addEventListener("change", function () {
        if (this.checked && !isMuted()) {
          play("ui");
        }
      });
    }

    // DND toggle
    const dndToggle = document.getElementById("dndToggle");
    if (dndToggle) {
      dndToggle.addEventListener("change", function () {
        dndMode = this.checked;
        localStorage.setItem("doNotDisturb", String(dndMode));
      });
    }
  }

  // ---- Wire app-wide SFX events ----------------------------------------
  function wireAppSounds() {
    // Chat send buttons
    document.querySelectorAll(".chat-send-btn").forEach(btn => {
      btn.addEventListener("click", () => play("send"));
    });

    // Navbar clicks
    document.querySelectorAll(".sidebar-tab").forEach(tab => {
      tab.addEventListener("click", () => play("ui"));
    });

    // Logout SFX
    document.querySelectorAll('.logout-link, a[href="/login.html"]').forEach(a => {
      a.addEventListener("click", () => play("logout"));
    });

    // Socket events for incoming messages
    const tryAttachSocket = () => {
      const s = window.socket;
      if (!s || s.__zyloSoundPatched) return;
      try {
        s.on("receive_message", () => play("receive", "community"));
        s.on("receive_group_message", (data) => {
          if (data && data.groupId) play("receive", data.groupId);
          else play("receive");
        });
        s.on("receive_file", (data) => {
          if (data && data.groupId) play("receive", data.groupId);
          else play("receive", "community");
        });
        s.on("receive_dm", (data) => {
          if (data && data.from) play("receive", data.from);
          else play("receive");
        });
        s.__zyloSoundPatched = true;
      } catch {}
    };
    tryAttachSocket();
    let attempts = 0;
    const iv = setInterval(() => { attempts++; tryAttachSocket(); if (attempts > 10) clearInterval(iv); }, 500);
  }

  // ---- Boot -------------------------------------------------------------
  window.addEventListener("DOMContentLoaded", () => {
    loadNotificationSettings();
    setTimeout(() => {
      initBgMusic();
      watchSettingsChanges();
      wireAppSounds();
    }, 1200);
  });

  // ---- Expose globally --------------------------------------------------
  const api = {
    play,
    startBgMusic,
    stopBgMusic,
    resumeBgMusic,
    updateBgMusicVolume,
    toggleMuteSource,
    getMuteStatus,
    toggleDND,
    getDNDStatus,
    isSourceMuted,
    SOUNDS,
  };

  window.ZyloSounds = api;
  window.SoundEngine = api; // Backward compat
  window.toggleMute = (id) => toggleMuteSource(id);
  window.toggleDND = () => toggleDND();
  window.getMuteStatus = (id) => getMuteStatus(id);
  window.getDNDStatus = () => getDNDStatus();
})();
