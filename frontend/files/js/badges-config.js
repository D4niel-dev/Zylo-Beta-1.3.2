/**
 * badges-config.js - Centralized Badge Catalog for Zylo
 */

const BADGE_CATALOG = {
    'early_supporter': {
        name: 'Early Supporter',
        icon: '🏆',
        description: 'One of the first users to join the Zylo beta.',
        rarity: 'Legendary',
        color: 'text-yellow-400'
    },
    'developer': {
        name: 'Developer',
        icon: '💻',
        description: 'A contributor to the Zylo codebase.',
        rarity: 'Epic',
        color: 'text-purple-400'
    },
    'verified': {
        name: 'Verified',
        icon: '✨',
        description: 'This user has verified their identity/email.',
        rarity: 'Common',
        color: 'text-blue-400'
    },
    'thinker': {
        name: 'Thinker',
        icon: '🧠',
        description: 'Active user of Thinking / Planning modes; asks deep questions.',
        rarity: 'Uncommon',
        color: 'text-indigo-400'
    },
    'coder': {
        name: 'Coder',
        icon: '⌨️',
        description: 'Frequently requests code generation or refactors.',
        rarity: 'Uncommon',
        color: 'text-green-400'
    },
    'writer': {
        name: 'Writer',
        icon: '✍️',
        description: 'Prolific writer; frequently uses Creative/Long-form modes.',
        rarity: 'Common',
        color: 'text-orange-400'
    }
};

/**
 * Returns badge metadata by ID
 */
function getBadge(id) {
    return BADGE_CATALOG[id] || {
        name: 'Unknown Badge',
        icon: '❓',
        description: 'An undocumented badge.',
        rarity: 'Unknown',
        color: 'text-gray-400'
    };
}

/**
 * Renders a list of badges into a container
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
        badgeEl.className = "w-10 h-10 bg-discord-gray-700/50 rounded-lg flex items-center justify-center text-xl cursor-help hover:bg-discord-gray-700 transition group relative";
        badgeEl.title = `${badge.name}: ${badge.description}`;
        badgeEl.innerHTML = `
            <span>${badge.icon}</span>
            <!-- Custom Tooltip -->
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 min-w-[150px] border border-discord-gray-700">
                <div class="font-bold ${badge.color}">${badge.name}</div>
                <div class="text-discord-gray-400 mt-1">${badge.description}</div>
                <div class="mt-1 text-[10px] uppercase tracking-wider font-bold opacity-70">${badge.rarity}</div>
            </div>
        `;
        target.appendChild(badgeEl);
    });
}

window.BADGE_CATALOG = BADGE_CATALOG;
window.getBadge = getBadge;
window.renderBadges = renderBadges;
