// ============================================================
// Zylo Sound Engine — reads settings from localStorage and
// exposes a global `ZyloSounds` helper that the rest of the
// app can call (e.g. ZyloSounds.play('send')).
// ============================================================

(function () {
  "use strict";

  // ---- Audio file map ---------------------------------------------------
  const AUDIO_PATH = "/files/audio/";
  const SOUNDS = {
    send:         AUDIO_PATH + "send.mp3",
    receive:      AUDIO_PATH + "notification.mp3",
    mention:      AUDIO_PATH + "notification.mp3",
    callRing:     AUDIO_PATH + "notification.mp3",
    friendOnline: AUDIO_PATH + "ui.mp3",
    callDisconnect: AUDIO_PATH + "error.mp3",
    ui:           AUDIO_PATH + "ui.mp3",
    achievement:  AUDIO_PATH + "notification.mp3",
    login:        AUDIO_PATH + "login.mp3",
    logout:       AUDIO_PATH + "logout.mp3",
    error:        AUDIO_PATH + "error.mp3",
  };

  const BG_MUSIC_SRC = AUDIO_PATH + "bg.mp3";

  // ---- Cached Audio objects ---------------------------------------------
  const audioCache = {};
  let bgMusic = null;

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

  // Map trigger checkbox IDs → sound keys
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
    // Default to true (checkboxes are checked by default in the HTML)
    return setting(triggerKey, true) === true;
  }

  // ---- Core play function -----------------------------------------------
  function play(soundKey) {
    if (isMuted()) return;
    if (!soundEnabled()) return;

    // Find the trigger setting key for this sound
    const triggerKey = Object.keys(TRIGGER_MAP).find(
      (k) => TRIGGER_MAP[k] === soundKey
    );
    if (triggerKey && !isTriggerEnabled(triggerKey)) return;

    const audio = getAudio(soundKey);
    if (!audio) return;

    audio.volume = soundVolume();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  // ---- Background Music -------------------------------------------------
  function startBgMusic() {
    if (isMuted()) return;
    if (!musicEnabled()) return;

    if (!bgMusic) {
      bgMusic = new Audio(BG_MUSIC_SRC);
      bgMusic.loop = true;
    }
    bgMusic.volume = musicVolume();
    bgMusic.play().catch(() => {});
  }

  function stopBgMusic() {
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
  }

  function updateBgMusicVolume() {
    if (bgMusic) bgMusic.volume = musicVolume();
  }

  // ---- Auto-start BG Music on page load if enabled ----------------------
  function initBgMusic() {
    if (musicEnabled() && !isMuted()) {
      // Browsers may block autoplay without user interaction.
      // We try immediately, then also attach a one-time click listener.
      startBgMusic();
      const tryStart = () => {
        startBgMusic();
        document.removeEventListener("click", tryStart);
        document.removeEventListener("keydown", tryStart);
      };
      document.addEventListener("click", tryStart, { once: true });
      document.addEventListener("keydown", tryStart, { once: true });
    }
  }

  // ---- Listen for settings changes in real-time -------------------------
  function watchSettingsChanges() {
    // Music toggle
    const musicToggle = document.getElementById("enableMusic");
    if (musicToggle) {
      musicToggle.addEventListener("change", function () {
        if (this.checked && !isMuted()) startBgMusic();
        else stopBgMusic();
      });
    }

    // Mute all toggle
    const muteToggle = document.getElementById("muteAll");
    if (muteToggle) {
      muteToggle.addEventListener("change", function () {
        if (this.checked) stopBgMusic();
        else if (musicEnabled()) startBgMusic();
      });
    }

    // Sound volume slider
    const svSlider = document.getElementById("soundVolume");
    if (svSlider) {
      svSlider.addEventListener("input", function () {
        // Play a preview sound when adjusting volume
        const preview = getAudio("ui");
        if (preview && soundEnabled() && !isMuted()) {
          preview.volume = parseInt(this.value, 10) / 100;
          preview.currentTime = 0;
          preview.play().catch(() => {});
        }
      });
    }

    // Music volume slider
    const mvSlider = document.getElementById("musicVolume");
    if (mvSlider) {
      mvSlider.addEventListener("input", function () {
        if (bgMusic) bgMusic.volume = parseInt(this.value, 10) / 100;
      });
    }

    // Sound enable toggle
    const soundToggle = document.getElementById("enableSound");
    if (soundToggle) {
      soundToggle.addEventListener("change", function () {
        if (this.checked && !isMuted()) {
          // Play a quick UI sound as feedback
          play("ui");
        }
      });
    }
  }

  // ---- Boot -------------------------------------------------------------
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      initBgMusic();
      watchSettingsChanges();
    }, 1200); // Delay slightly to make sure settings.js has run
  });

  // ---- Expose globally --------------------------------------------------
  window.ZyloSounds = {
    play,
    startBgMusic,
    stopBgMusic,
    updateBgMusicVolume,
    SOUNDS,
  };
})();
