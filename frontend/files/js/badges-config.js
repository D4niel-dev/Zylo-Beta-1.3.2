/**
 * badges-config.js - Centralized Badge Catalog for Zylo
 */

const BADGE_CATALOG = {
    // 1. Skill / Mode Badges
    'thinker': { name: 'Thinker', icon: 'cpu', description: 'Active user of Thinking / Planning modes; asks deep, multi-step questions.', rarity: 'Uncommon', color: 'text-indigo-400' },
    'coder': { name: 'Coder', icon: 'code', description: 'Frequently requests code generation, refactors, or debugging from Diszi.', rarity: 'Uncommon', color: 'text-green-400' },
    'debugger': { name: 'Debugger', icon: 'crosshair', description: 'Uses the debug pipeline (uploading screenshots/code images → OCR → fix) effectively.', rarity: 'Uncommon', color: 'text-red-400' },
    'writer': { name: 'Writer', icon: 'edit-3', description: 'Uses Zily for creative writing, editing, or long-form content.', rarity: 'Common', color: 'text-orange-400' },
    'reviewer': { name: 'Reviewer', icon: 'search', description: 'Uses the Review mode often to critique or polish text.', rarity: 'Common', color: 'text-blue-300' },
    
    // 2. Milestone Badges
    'power_user': { name: 'Power User', icon: 'zap', description: 'High-frequency user across multiple modes.', rarity: 'Rare', color: 'text-yellow-400' },
    'newcomer': { name: 'Newcomer', icon: 'sun', description: 'Welcome badge for new accounts.', rarity: 'Very common', color: 'text-green-200' },
    'explorer': { name: 'Explorer', icon: 'compass', description: 'Uses diverse features (Explore, Moments, groups).', rarity: 'Common', color: 'text-teal-400' },
    'veteran': { name: 'Veteran', icon: 'award', description: 'Long-term or returning user.', rarity: 'Rare', color: 'text-yellow-600' },
    'night_owl': { name: 'Night Owl', icon: 'moon', description: 'Frequent activity during late-night hours.', rarity: 'Uncommon', color: 'text-purple-300' },
    
    // 3. Personality Badges
    'diszi_minded': { name: 'Diszi-minded', icon: 'box', description: 'Prefers analytical, structured responses (Diszi).', rarity: 'Uncommon', color: 'text-blue-500' },
    'zily_hearted': { name: 'Zily-hearted', icon: 'heart', description: 'Prefers creative, human-sounding responses (Zily).', rarity: 'Uncommon', color: 'text-pink-400' },
    
    // 4. Trust / Contribution
    'early_supporter': { name: 'Early Supporter', icon: 'slack', description: 'Participated in testing the Zylo beta phase.', rarity: 'Epic', color: 'text-orange-500' },
    'verified': { name: 'Verified', icon: 'check-circle', description: 'Verified email or identity.', rarity: 'Common', color: 'text-blue-400' },
    'bug_hunter': { name: 'Bug Hunter', icon: 'alert-triangle', description: 'Contributed useful bug reports.', rarity: 'Rare', color: 'text-red-500' },
    'contributor': { name: 'Contributor', icon: 'tool', description: 'Contributed code, documentation, or assets to Zylo.', rarity: 'Very rare', color: 'text-purple-400' },
    'developer': { name: 'Developer', icon: 'command', description: 'Active development in the Zylo community.', rarity: 'Very rare', color: 'text-purple-400' },

    // 5. Fun / Discovery
    'first_chat': { name: 'First Chat', icon: 'message-square', description: 'First successful interaction with the AI.', rarity: 'Very common', color: 'text-gray-300' },
    '100_messages': { name: '100 Messages', icon: 'hash', description: 'Sent 100 messages.', rarity: 'Common', color: 'text-blue-200' },
    'deep_thinker': { name: 'Deep Thinker', icon: 'layers', description: 'Engages with multi-step complex tasks.', rarity: 'Uncommon', color: 'text-indigo-500' },
    'idea_spark': { name: 'Idea Spark', icon: 'star', description: 'Creative prompts that produce notable outputs.', rarity: 'Common', color: 'text-yellow-300' },
    
    // 6. System / Tech
    'offline_survivor': { name: 'Offline Survivor', icon: 'wifi-off', description: 'Used Zylo in offline / local fallback mode.', rarity: 'Uncommon', color: 'text-gray-500' },
    'cloud_mind': { name: 'Cloud Mind', icon: 'cloud', description: 'Frequently uses cloud AI (OpenRouter).', rarity: 'Common', color: 'text-blue-400' },
    'local_mind': { name: 'Local Mind', icon: 'monitor', description: 'Frequently uses local Ollama models in desktop app.', rarity: 'Uncommon', color: 'text-green-500' },
    
    // 7. Developer Authority
    'architect': { name: 'Architect', icon: 'hexagon', description: 'Creator of Zylo.', rarity: 'Mythic', color: 'text-yellow-400' },
    'core_maintainer': { name: 'Core Maintainer', icon: 'database', description: 'Maintains core AI or backend systems.', rarity: 'Mythic', color: 'text-purple-600' },
    'system_override': { name: 'System Override', icon: 'shield', description: 'Has admin-level access.', rarity: 'Legendary', color: 'text-red-600' },
    'origin': { name: 'Origin', icon: 'globe', description: 'Account created before public launch.', rarity: 'Mythic', color: 'text-blue-600' },
    
    // 8. Message Master Series
    'chatter_1': { name: 'Chatter I', icon: 'message-circle', description: '100+ messages sent.', rarity: 'Uncommon', color: 'text-gray-400' },
    'chatter_2': { name: 'Chatter II', icon: 'message-circle', description: '1,000 messages sent.', rarity: 'Rare', color: 'text-blue-400' },
    'chatter_3': { name: 'Chatter III', icon: 'message-circle', description: '5,000 messages sent.', rarity: 'Epic', color: 'text-purple-400' },
    'chatter_4': { name: 'Chatter IV', icon: 'message-circle', description: '10,000 messages sent.', rarity: 'Legendary', color: 'text-yellow-500' },
    
    // 9. Code Warrior Series
    'code_apprentice': { name: 'Code Apprentice', icon: 'terminal', description: '25 code requests.', rarity: 'Uncommon', color: 'text-green-300' },
    'code_adept': { name: 'Code Adept', icon: 'terminal', description: '100 code requests.', rarity: 'Rare', color: 'text-green-400' },
    'code_master': { name: 'Code Master', icon: 'terminal', description: '500 code requests.', rarity: 'Epic', color: 'text-green-500' },
    'code_overlord': { name: 'Code Overlord', icon: 'terminal', description: '1,500+ code requests.', rarity: 'Legendary', color: 'text-green-600' },
    
    // 10. Hidden & Social
    'the_glitch': { name: 'The Glitch', icon: 'cpu', description: 'Trigger a specific hidden easter egg phrase.', rarity: 'Secret', color: 'text-red-500' },
    'speedrunner': { name: 'Speedrunner', icon: 'fast-forward', description: 'Complete onboarding in under 3 minutes.', rarity: 'Secret', color: 'text-yellow-500' },
    'the_silent_one': { name: 'The Silent One', icon: 'mic-off', description: 'Use app for 30 days without posting in public chat.', rarity: 'Secret', color: 'text-gray-500' },
    'chaos_mode': { name: 'Chaos Mode', icon: 'shuffle', description: 'Switch between Diszi and Zily 50 times in one session.', rarity: 'Secret', color: 'text-purple-500' },
    'the_dual_mind': { name: 'The Dual Mind', icon: 'git-merge', description: 'Balanced usage: 50% Diszi, 50% Zily over 100 sessions.', rarity: 'Secret', color: 'text-indigo-400' },
    'community_helper': { name: 'Community Helper', icon: 'users', description: 'Marked helpful by 10 users.', rarity: 'Epic', color: 'text-blue-400' },
    'trend_starter': { name: 'Trend Starter', icon: 'trending-up', description: 'Prompt copied/used by 20 users.', rarity: 'Epic', color: 'text-pink-500' },
    'beta_explorer': { name: 'Beta Explorer', icon: 'target', description: 'Used beta model 20 times.', rarity: 'Rare', color: 'text-orange-400' },
    'cloud_pioneer': { name: 'Cloud Pioneer', icon: 'cloud-lightning', description: 'First 100 users to use OpenRouter integration.', rarity: 'Legendary', color: 'text-blue-500' },
    'local_titan': { name: 'Local Titan', icon: 'server', description: 'Runs 7B+ local model consistently.', rarity: 'Epic', color: 'text-green-500' },
    'the_1_percent': { name: 'The 1%', icon: 'activity', description: 'Top 1% of activity in last 30 days.', rarity: 'Legendary', color: 'text-yellow-400' },
    'ai_whisperer': { name: 'AI Whisperer', icon: 'radio', description: '90%+ helpful rating over 200 sessions.', rarity: 'Legendary', color: 'text-purple-400' },
    'eternal': { name: 'Eternal', icon: 'infinity', description: '365-day login streak.', rarity: 'Mythic', color: 'text-yellow-500' },
    'mythic_mind': { name: 'Mythic Mind', icon: 'award', description: 'Unlock 30+ total badges.', rarity: 'Mythic', color: 'text-indigo-500' }
};

/**
 * Returns badge metadata by ID
 */
function getBadge(id) {
    return BADGE_CATALOG[id] || {
        name: 'Unknown Badge',
        icon: 'help-circle',
        description: 'An undocumented badge.',
        rarity: 'Unknown',
        color: 'text-gray-400'
    };
}

/**
 * Renders a list of badges into a container using Feather icons
 * @param {Array} badgeIds - List of badge IDs
 * @param {HTMLElement|string} container - Container element or ID
 */
function renderBadges(badgeIds, container) {
    const target = typeof container === 'string' ? document.getElementById(container) : container;
    if (!target) return;

    target.innerHTML = '';
    
    if (!badgeIds || badgeIds.length === 0) {
        target.innerHTML = `
            <div class="text-xs text-discord-gray-500 italic px-2">No badges unlocked yet.</div>
        `;
        return;
    }

    badgeIds.forEach(id => {
        const badge = getBadge(id);
        const badgeEl = document.createElement('div');
        badgeEl.className = "w-10 h-10 bg-discord-gray-700/50 rounded-lg flex items-center justify-center cursor-help hover:bg-discord-gray-700 transition group relative";
        badgeEl.title = `${badge.name}: ${badge.description}`;
        badgeEl.innerHTML = `
            <i data-feather="${badge.icon}" class="w-5 h-5 ${badge.color}"></i>
            <!-- Custom Tooltip -->
            <div class="absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 px-3 py-2 bg-black text-white text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-[100] min-w-[200px] max-w-[250px] border border-discord-gray-700 text-center">
                <div class="font-bold ${badge.color} mb-1 flex items-center justify-center gap-2">
                    <i data-feather="${badge.icon}" class="w-4 h-4"></i>
                    ${badge.name}
                </div>
                <div class="text-discord-gray-400 mt-1 whitespace-normal">${badge.description}</div>
                <div class="mt-2 text-[10px] uppercase tracking-wider font-bold opacity-70 border-t border-discord-gray-700 pt-1">${badge.rarity}</div>
            </div>
        `;
        target.appendChild(badgeEl);
    });

    if (window.feather) {
        feather.replace();
    }
}

/**
 * Shows an animated unlock notification for a badge
 * @param {string} badgeId - The ID of the unlocked badge
 */
function showBadgeUnlock(badgeId) {
    const badge = getBadge(badgeId);
    
    // Play achievement sound
    if (window.ZyloSounds) {
        ZyloSounds.play('achievement');
    }

    // Create the toast element
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-discord-gray-900 border border-discord-gray-700 rounded-lg shadow-2xl p-4 transform translate-y-20 opacity-0 transition-all duration-500 ease-out min-w-[300px] pointer-events-none`;
    
    toast.innerHTML = `
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-discord-gray-800 border-2 border-discord-gray-600 shadow-[0_0_15px_rgba(255,255,255,0.1)] relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent border-t border-l border-white/10 rounded-full animate-spin-slow"></div>
            <i data-feather="${badge.icon}" class="w-6 h-6 ${badge.color} relative z-10 animate-bounce"></i>
        </div>
        <div class="flex flex-col">
            <div class="text-[10px] uppercase tracking-wider font-bold text-discord-gray-400">Badge Unlocked!</div>
            <div class="font-bold text-white text-lg ${badge.color} drop-shadow-md">${badge.name}</div>
            <div class="text-xs text-discord-gray-300 mt-0.5 line-clamp-1">${badge.description}</div>
        </div>
    `;

    document.body.appendChild(toast);
    
    if (window.feather) {
        feather.replace();
    }

    // Animate In
    requestAnimationFrame(() => {
        toast.style.transform = 'translate(-50%, 0) scale(1.05)';
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.transform = 'translate(-50%, 0) scale(1)';
        }, 300);
    });

    // Animate Out after 4 seconds
    setTimeout(() => {
        toast.style.transform = 'translate(-50%, -20px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 4500);
}

window.BADGE_CATALOG = BADGE_CATALOG;
window.getBadge = getBadge;
window.renderBadges = renderBadges;
window.showBadgeUnlock = showBadgeUnlock;
