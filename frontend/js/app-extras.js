(function () {
  // ---- Profile Effects ----
  function applyAvatarEffect(effect) {
    const avatar = document.getElementById('avatarImage');
    const wrapper = document.querySelector('.avatar-wrapper');
    if (!avatar || !wrapper) return;
    const effects = [
      'avatar-effect-none', 'avatar-effect-glow', 'avatar-effect-pulse', 'avatar-effect-ring', 'avatar-effect-sparkle',
      'avatar-effect-vintage', 'avatar-effect-neon-border', 'avatar-effect-gradient-border', 'avatar-effect-frosted',
      'avatar-effect-holographic', 'avatar-effect-matrix', 'avatar-effect-cyberpunk'
    ];
    avatar.classList.remove(...effects);
    wrapper.classList.remove(...effects);
    switch (effect) {
      case 'glow':
        avatar.classList.add('avatar-effect-glow'); break;
      case 'pulse':
        avatar.classList.add('avatar-effect-pulse'); break;
      case 'ring':
        wrapper.classList.add('avatar-effect-ring'); break;
      case 'sparkle':
        wrapper.classList.add('avatar-effect-sparkle'); break;
      case 'vintage':
        avatar.classList.add('avatar-effect-vintage'); break;
      case 'neon-border':
        avatar.classList.add('avatar-effect-neon-border'); break;
      case 'gradient-border':
        avatar.classList.add('avatar-effect-gradient-border'); break;
      case 'frosted':
        avatar.classList.add('avatar-effect-frosted'); break;
      case 'holographic':
        avatar.classList.add('avatar-effect-holographic'); break;
      case 'matrix':
        avatar.classList.add('avatar-effect-matrix'); break;
      case 'cyberpunk':
        avatar.classList.add('avatar-effect-cyberpunk'); break;
      default:
        avatar.classList.add('avatar-effect-none');
    }
  }

  function applyBannerEffect(effect) {
    const banner = document.querySelector('.profile-banner');
    if (!banner) return;
    const effects = [
      'banner-effect-none', 'banner-effect-blur-overlay', 'banner-effect-gradient-overlay', 'banner-effect-vignette',
      'banner-effect-neon-glow', 'banner-effect-cyber-grid', 'banner-effect-holographic-banner', 'banner-effect-matrix-banner',
      'banner-effect-retro-wave', 'banner-effect-neon-city'
    ];
    banner.classList.remove(...effects);
    switch (effect) {
      case 'blur-overlay':
        banner.classList.add('banner-effect-blur-overlay'); break;
      case 'gradient-overlay':
        banner.classList.add('banner-effect-gradient-overlay'); break;
      case 'vignette':
        banner.classList.add('banner-effect-vignette'); break;
      case 'neon-glow':
        banner.classList.add('banner-effect-neon-glow'); break;
      case 'cyber-grid':
        banner.classList.add('banner-effect-cyber-grid'); break;
      case 'holographic-banner':
        banner.classList.add('banner-effect-holographic-banner'); break;
      case 'matrix-banner':
        banner.classList.add('banner-effect-matrix-banner'); break;
      case 'retro-wave':
        banner.classList.add('banner-effect-retro-wave'); break;
      case 'neon-city':
        banner.classList.add('banner-effect-neon-city'); break;
      default:
        banner.classList.add('banner-effect-none');
    }
  }

  function initProfileEffects() {
    const select = document.getElementById('profileEffectSelect');
    const bannerSelect = document.getElementById('bannerEffectSelect');
    const saved = localStorage.getItem('profileEffect') || 'none';
    const bannerSaved = localStorage.getItem('bannerEffect') || 'none';

    if (select) select.value = saved;
    if (bannerSelect) bannerSelect.value = bannerSaved;

    applyAvatarEffect(saved);
    applyBannerEffect(bannerSaved);

    if (select) {
      select.addEventListener('change', function () {
        const val = this.value;
        localStorage.setItem('profileEffect', val);
        if (typeof persistSettings === 'function') {
          persistSettings({ profileEffect: val });
        }
        applyAvatarEffect(val);
        if (window.ZyloSounds) ZyloSounds.play('ui');
      });
    }

    if (bannerSelect) {
      bannerSelect.addEventListener('change', function () {
        const val = this.value;
        localStorage.setItem('bannerEffect', val);
        if (typeof persistSettings === 'function') {
          persistSettings({ bannerEffect: val });
        }
        applyBannerEffect(val);
        if (window.ZyloSounds) ZyloSounds.play('ui');
      });
    }
  }

  // ---- Icon fill on active (post-feather replace safety) ----
  function applyActiveIconFill() {
    try { if (window.feather) feather.replace(); } catch { }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initProfileEffects();
    applyActiveIconFill();
  });
})();
