
// Settings & 2FA Logic

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initSettingsModules, 1000); // Delay slightly to ensure mainapp.html DOM is ready
});

function initSettingsModules() {
    console.log("Initializing Settings Module...");
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    if (twoFactorToggle) {
        check2FAStatus();
        twoFactorToggle.addEventListener('change', handle2FAToggle);
    }
}

async function check2FAStatus() {
    const username = localStorage.getItem('username');
    if (!username) return;

    try {
        const res = await fetch(`/api/get-user?identifier=${encodeURIComponent(username)}`);
        const data = await res.json();
        const toggle = document.getElementById('twoFactorToggle');
        if (toggle) {
            if (data.success && data.user.twofa_enabled) {
                toggle.checked = true;
            } else {
                toggle.checked = false;
            }
        }
    } catch (e) {
        console.error("Failed to check 2FA status", e);
    }
}

async function handle2FAToggle(e) {
    const isEnabled = e.target.checked;
    const username = localStorage.getItem('username');
    if (!username) return;

    if (isEnabled) {
        // Enable 2FA
        try {
            const res = await fetch('/api/auth/2fa/enable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await res.json();
            if (data.success) {
                show2FAModal(data.secret);
            } else {
                if (window.showToast) window.showToast(data.error || "Failed to enable 2FA", 3000, true);
                else alert(data.error);
                e.target.checked = false;
            }
        } catch (err) {
            if (window.showToast) window.showToast("Network error", 3000, true);
            e.target.checked = false;
        }
    } else {
        // Disable 2FA
        if (!confirm("Are you sure you want to disable 2FA? Your account will be less secure.")) {
            e.target.checked = true;
            return;
        }
        try {
            const res = await fetch('/api/auth/2fa/disable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await res.json();
            if (data.success) {
                if (window.showToast) window.showToast("2FA Disabled");
            } else {
                if (window.showToast) window.showToast(data.error || "Failed to disable 2FA", 3000, true);
                e.target.checked = true;
            }
        } catch (err) {
            if (window.showToast) window.showToast("Network error", 3000, true);
            e.target.checked = true;
        }
    }
}

function show2FAModal(secret) {
    // Remove existing if any
    const existing = document.getElementById('twoFaSetupModal');
    if (existing) existing.remove();

    const modalHtml = `
    <div id="twoFaSetupModal" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fadeIn">
        <div class="bg-discord-gray-800 max-w-md w-full p-6 rounded-lg shadow-xl border border-discord-gray-700">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-discord-blurple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-discord-blurple"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">Two-Factor Authentication</h3>
                <p class="text-discord-gray-400 text-sm">Scan the QR code or enter the secret key into your authenticator app.</p>
            </div>

            <div class="bg-discord-gray-900 p-4 rounded-lg mb-6 text-center border border-discord-gray-700">
                <p class="text-xs text-discord-gray-500 uppercase font-bold tracking-wider mb-2">Secret Key</p>
                <code class="text-lg text-discord-blurple font-mono tracking-widest select-all cursor-pointer hover:text-white transition" onclick="navigator.clipboard.writeText(this.innerText); if(window.showToast) window.showToast('Copied!')">${secret}</code>
                <p class="text-xs text-discord-gray-600 mt-2">(Use '123456' to test verification)</p>
            </div>

            <div class="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 mb-6 flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-500 flex-shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <p class="text-xs text-yellow-200">Save this key! If you lose access to your authenticator app, you will need this key to restore access.</p>
            </div>

            <button onclick="close2FAModal()" class="w-full py-2 bg-discord-blurple hover:bg-opacity-90 text-white font-medium rounded-lg transition shadow-lg transform active:scale-95">
                I've Saved It
            </button>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}


function close2FAModal() {
    const modal = document.getElementById('twoFaSetupModal');
    if (modal) {
        modal.remove(); 
    }
}



// --- Account Settings Logic ---
var pendingAvatar = null;
var pendingBanner = null;
var pendingUsertag = null;
var pendingPronouns = null;
var pendingActiveBadges = null; // null means no changes made
var accountSettingsChanged = false;

window.renderBadgeSelectionUI = function(unlockedBadges, activeBadges) {
    const container = document.getElementById('settingsBadgesContainer');
    const countSpan = document.getElementById('activeBadgesCount');
    if (!container || !countSpan) return;

    container.innerHTML = '';
    
    // Initialize pendingActiveBadges if null
    if (pendingActiveBadges === null) {
        pendingActiveBadges = [...activeBadges];
    }

    countSpan.textContent = pendingActiveBadges.length;

    if (!unlockedBadges || unlockedBadges.length === 0) {
        container.innerHTML = '<div class="w-full text-center text-discord-gray-500 text-sm py-4 italic">No badges unlocked yet. Keep chatting to earn some!</div>';
        return;
    }

    unlockedBadges.forEach(id => {
        // Assume window.getBadge exists from badges-config.js
        const badge = typeof window.getBadge === 'function' ? window.getBadge(id) : { name: id, icon: 'help-circle', color: 'text-gray-400' };
        
        const isSelected = pendingActiveBadges.includes(id);
        
        const badgeEl = document.createElement('div');
        badgeEl.className = `w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-all transform active:scale-95 border-2 ${isSelected ? 'bg-discord-gray-700 border-discord-blurple shadow-[0_0_10px_rgba(88,101,242,0.3)]' : 'bg-discord-gray-800/50 border-transparent hover:bg-discord-gray-700/80'} group relative`;
        badgeEl.title = badge.name;
        
        // Add checkmark if selected
        let checkmark = isSelected ? '<div class="absolute -top-2 -right-2 bg-discord-blurple rounded-full p-0.5 border-2 border-[#2b2d31] shadow-md z-10"><i data-feather="check" class="w-3 h-3 text-white"></i></div>' : '';

        badgeEl.innerHTML = `
            ${checkmark}
            <i data-feather="${badge.icon}" class="w-6 h-6 ${badge.color} transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}"></i>
        `;
        
        badgeEl.onclick = () => {
            if (isSelected) {
                // Deselect
                pendingActiveBadges = pendingActiveBadges.filter(b => b !== id);
            } else {
                // Select (max 3)
                if (pendingActiveBadges.length >= 3) {
                    if (window.showToast) window.showToast("You can only display up to 3 active badges.", 2000, true);
                    return;
                }
                pendingActiveBadges.push(id);
            }
            
            toggleSettingChanged();
            window.renderBadgeSelectionUI(unlockedBadges, activeBadges); // Re-render this section
        };

        container.appendChild(badgeEl);
    });

    if (window.feather) {
        feather.replace();
    }
};

// Account edit functions moved to mainapp.html for Discord-like Modal support

function toggleSettingChanged() {
    accountSettingsChanged = true;
    updateSaveButtonVisibility();
}

function updateSaveButtonVisibility() {
    const btn = document.getElementById('saveSettingsBtn');
    if (btn) btn.style.display = accountSettingsChanged ? 'block' : 'none';
    
    const accountBtn = document.getElementById('saveAccountSettingsBtn');
    if (accountBtn) accountBtn.style.display = accountSettingsChanged ? 'flex' : 'none';
}

function showSaveSettingsModal() {
    // Just save directly for now
    persistAccountSettings();
    accountSettingsChanged = false;
    updateSaveButtonVisibility();
}

// Avatar/Banner Upload Listeners
document.addEventListener('DOMContentLoaded', () => {
    const avatarInput = document.getElementById('settingsAvatarUpload');
    const bannerInput = document.getElementById('settingsBannerUpload');

    if (avatarInput) {
        avatarInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (evt) {
                const img = document.getElementById('settingsAvatar');
                if (img) img.src = evt.target.result;
                pendingAvatar = evt.target.result; // Data URL
                accountSettingsChanged = true;
                updateSaveButtonVisibility();
            };
            reader.readAsDataURL(file);
        });
    }

    if (bannerInput) {
        bannerInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (evt) {
                const img = document.getElementById('settingsBanner');
                if (img) img.src = evt.target.result;
                pendingBanner = evt.target.result; // Data URL
                accountSettingsChanged = true;
                updateSaveButtonVisibility();
            };
            reader.readAsDataURL(file);
        });
    }
});

// Helper to persist account settings
async function persistAccountSettings() {
    const username = localStorage.getItem('username');
    if (!username) return;

    const payload = {
        username: username,
    };

    let hasChanges = false;

    if (pendingAvatar) {
        payload.avatar = pendingAvatar;
        hasChanges = true;
    }
    if (pendingBanner) {
        payload.banner = pendingBanner;
        hasChanges = true;
    }
    if (pendingUsertag) {
        payload.usertag = pendingUsertag;
        hasChanges = true;
    }

    if (pendingPronouns !== null) {
        payload.pronouns = pendingPronouns;
        hasChanges = true;
    }

    if (pendingActiveBadges !== null) {
        payload.badges_active = pendingActiveBadges;
        hasChanges = true;
    }

    const dmToggle = document.getElementById("allowDMsToggle");
    if (dmToggle) {
        payload.allowDMs = dmToggle.checked;
    }

    const frToggle = document.getElementById("allowFriendRequestsToggle");
    if (frToggle) {
        payload.allowFriendRequests = frToggle.checked;
    }

    if (accountSettingsChanged) {
        hasChanges = true;
    }

    if (!hasChanges) {
        if (window.showToast) window.showToast("No changes to save.");
        return;
    }

    try {
        const res = await fetch('/api/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            // Update local storage if needed
            if (data.user.avatar) localStorage.setItem('avatar', data.user.avatar);
            if (data.user.banner) localStorage.setItem('banner', data.user.banner);
            if (data.user.usertag) localStorage.setItem('usertag', data.user.usertag);

            // Clear pending
            pendingAvatar = null;
            pendingBanner = null;
            pendingUsertag = null;
            pendingPronouns = null;
            pendingActiveBadges = null;
            accountSettingsChanged = false;
            updateSaveButtonVisibility();

             if (window.showToast) window.showToast("Profile updated successfully!");

            // Refresh profile UI if function exists
            if (typeof loadUserProfile === 'function') loadUserProfile();
        } else {
            console.error("Failed to update profile:", data.error);
            if (window.showToast) window.showToast("Failed to update profile: " + data.error, 3000, true);
        }
    } catch (err) {
        console.error("Error saving profile:", err);
         if (window.showToast) window.showToast("Error saving profile settings.", 3000, true);
    }
}
window.persistAccountSettings = persistAccountSettings;
window.saveAccountSettings = persistAccountSettings;
