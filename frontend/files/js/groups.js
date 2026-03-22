
// Group Logic
// groupsData and currentGroupId are defined in chat.js (globals)

function getGroupColor(groupName) {
    let hash = 0;
    for (let i = 0; i < groupName.length; i++) {
        hash = groupName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 60%, 50%)`;
}

function getGroupInitial(groupName) {
    return (groupName || 'G')[0].toUpperCase();
}

async function loadGroups() {
    const username = localStorage.getItem('username');
    if (!username) return;
    try {
        const res = await fetch(`/api/groups/list?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        groupsData = data.groups || [];
        renderServerSidebar();
    } catch (e) { console.error('Failed to load groups:', e); }
}
window.loadGroups = loadGroups;

function renderServerSidebar() {
    const container = document.getElementById('groupIconsContainer');
    if (!container) return;
    container.innerHTML = '';

    groupsData.forEach(g => {
        const item = document.createElement('div');
        item.className = 'group-icon-wrapper group relative flex items-center justify-center cursor-pointer my-2';

        const isActive = currentGroupId === g.id;
        const pillHeight = isActive ? 'h-10' : 'h-2';
        const pillOpacity = isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100';

        const color = getGroupColor(g.name);
        const initial = getGroupInitial(g.name);
        let iconStyle = '';

        if (g.icon) {
            iconStyle = `background-image: url(${g.icon}); background-size: cover; background-position: center;`;
        } else if (!isActive) {
            iconStyle = `background-color: ${color};`;
        }

        item.onclick = () => selectGroup(g.id);

        item.innerHTML = `
            <div class="absolute -left-2 w-1 bg-white rounded-r-full transition-all duration-200 ${pillHeight} ${pillOpacity}"></div>
            <div class="sidebar-icon w-12 h-12 flex items-center justify-center bg-discord-gray-700 hover:bg-discord-blurple text-white font-semibold transition-all duration-200 ${isActive ? 'rounded-2xl bg-discord-blurple' : 'rounded-[24px] hover:rounded-2xl'}" style="${iconStyle}">
               ${g.icon ? '' : initial}
            </div>
            <!-- Tooltip -->
            <div class="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
               ${g.name}
            </div>
        `;
        container.appendChild(item);
    });
    if (window.feather) feather.replace();
}
window.renderServerSidebar = renderServerSidebar;


// renderGroupChannels removed: using loadGroupChannels instead

function selectGroup(groupId) {
    if (window.vcSimulationInterval) clearInterval(window.vcSimulationInterval);

    // Leave previous group room if connected
    if (typeof socket !== 'undefined' && socket && currentGroupId && currentGroupId !== groupId) {
        socket.emit('leave', { room: currentGroupId });
    }

    currentGroupId = groupId;
    const group = groupsData.find(g => g.id === groupId);
    if (!group) return;

    // Reset channel
    activeChannelId = 'general';

    // Update sidebar list (server icons)
    renderServerSidebar();

    // Show group panel (sidebar) and tab (main content)
    document.querySelectorAll('.sub-panel-content').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));

    // Fix active pill duplication: Clear focus from all primary sidebar tabs when entering a group
    document.querySelectorAll('.sidebar-tab').forEach(b => b.classList.remove('active'));

    const gPanel = document.getElementById('sub-panel-group');
    const gTab = document.getElementById('tab-group');
    if (gPanel) gPanel.classList.remove('hidden');
    if (gTab) {
        gTab.classList.remove('hidden');
        gTab.style.display = ''; // Force remove inline display:none from navigateTo()
    }

    // Update basic info in sidebar
    const nameEl = document.getElementById('groupPanelName');
    const descEl = document.getElementById('groupPanelDesc');
    if (group) {
        if (nameEl) nameEl.textContent = group.name;
        if (descEl) descEl.textContent = group.description || 'No description';
    }

    // Handle Socket join
    if (typeof socket !== 'undefined' && socket) {
        socket.emit('join', { room: group.id });
    }

    // Hide community/messages global titles when inside a group
    const subPanelHeader = document.getElementById('subPanelHeaderBlock');
    const mainContentHeader = document.getElementById('mainContentHeaderBlock');
    const subPanelTitle = document.getElementById('subPanelTitle');
    const mainContentTitle = document.getElementById('main-content-title');
    const messagesSubTabs = document.getElementById('sub-panel-messages-tabs');
    if (subPanelHeader) subPanelHeader.style.display = 'none';
    if (mainContentHeader) mainContentHeader.style.display = 'none';
    if (subPanelTitle) subPanelTitle.style.display = 'none';
    if (mainContentTitle) mainContentTitle.style.display = 'none';
    if (messagesSubTabs) messagesSubTabs.style.display = 'none';

    // Load specific group data
    loadGroupChannels(group, activeChannelId);
    loadGroupMembers(group);
    loadGroupMessages(group, activeChannelId);

    if (window.feather) feather.replace();
}
window.selectGroup = selectGroup;

function loadGroupChannels(group, activeChannel = 'general') {
    const container = document.getElementById('groupChannelsList');
    if (!container) return;

    container.innerHTML = '';

    const channels = group.channels || [{ id: 'general', name: 'general', type: 'text', category: 'TEXT CHANNELS' }];

    const categories = {};
    channels.forEach(ch => {
        const c = typeof ch === 'string' ? { id: ch, name: ch, type: 'text', category: 'TEXT CHANNELS' } : ch;
        const cat = (c.category || 'TEXT CHANNELS').toUpperCase();
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(c);
    });

    const sortedCats = Object.keys(categories).sort((a, b) => {
        if (a === 'TEXT CHANNELS') return -1;
        if (b === 'TEXT CHANNELS') return 1;
        return a.localeCompare(b);
    });

    sortedCats.forEach(cat => {
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between px-2 pt-4 pb-1 text-xs font-bold text-discord-gray-400 uppercase hover:text-discord-gray-300 group select-none transition-colors';
        header.innerHTML = `
            <div class="flex items-center gap-1 cursor-pointer">
                <i data-feather="chevron-down" class="w-3 h-3"></i>
                <span class="tracking-wider">${cat}</span>
            </div>
            <i data-feather="plus" class="w-3 h-3 opacity-0 group-hover:opacity-100 cursor-pointer"></i>
        `;
        container.appendChild(header);

        categories[cat].forEach(ch => {
            const btn = document.createElement('button');
            const isActive = ch.id === activeChannel;
            const icon = ch.type === 'voice' ? 'volume-2' : (ch.type === 'announcement' ? 'mic' : 'hash');

            btn.className = `sub-panel-item text-left w-[calc(100%-1rem)] group/item ${isActive ? 'active' : ''}`;
            btn.innerHTML = `
                <i data-feather="${icon}" class="w-4 h-4 mr-1.5 ${isActive ? 'text-white' : 'text-discord-gray-400'}"></i>
                <span class="truncate font-medium">${ch.name}</span>
            `;
            btn.onclick = () => {
                if (ch.type === 'voice') {
                    // Update active state
                    document.querySelectorAll('#groupChannelsList .sub-panel-item').forEach(el => el.classList.remove('active'));
                    btn.classList.add('active');
                    renderVoiceActivity(group, ch);
                    return;
                }
                switchGroupChannel(group, ch.id);
            };
            container.appendChild(btn);
        });
    });
    if (window.feather) feather.replace();
}

function renderVoiceActivity(group, channel) {
    const container = document.getElementById('groupChatMessages');
    const header = document.getElementById('chatHeaderTitle');
    const inputArea = document.getElementById('groupChatInputContainer');
    
    if (!container || !header) return;

    // Set header
    header.innerHTML = `<i data-feather="volume-2" class="w-5 h-5 text-discord-gray-400"></i> <span class="tracking-wide">${channel.name}</span>`;

    // Hide input area for voice
    if (inputArea) inputArea.style.display = 'none';

    // Build the Voice UI Canvas
    const username = localStorage.getItem('savedUsername') || localStorage.getItem('username') || 'Me';
    const otherMembers = (group.members || []).filter(m => m !== username).slice(0, 3);
    const fallback = '/images/default_avatar.png';

    // Clear any previous mockup intervals
    if (window.vcSimulationInterval) clearInterval(window.vcSimulationInterval);

    container.innerHTML = `
        <div class="flex-1 flex flex-col h-full bg-[#000000] relative overflow-hidden group/vc rounded-xl m-2 border border-white/5">
            
            <!-- Dark glass background effect -->
            <div class="absolute inset-0 bg-gradient-to-b from-discord-blurple/10 to-transparent pointer-events-none"></div>

            <!-- Avatar Grid -->
            <div class="flex-1 flex items-center justify-center p-8 z-10 w-full overflow-y-auto">
                <div class="grid grid-cols-1 sm:grid-cols-2 ${otherMembers.length > 2 ? 'lg:grid-cols-3' : ''} gap-6 max-w-5xl w-full" id="vcUserGrid">
                    
                    <!-- Me -->
                    <div class="vc-user-tile aspect-video bg-[#2f3136] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-xl transition-all border border-transparent">
                        <img src="${fallback}" data-vc-user="${username}" class="w-24 h-24 rounded-full mb-3 shadow-2xl ring-4 ring-[#2f3136] vc-avatar transition-all">
                        <div class="absolute bottom-3 left-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/5">
                            <span class="text-white font-medium text-sm w-24 truncate">${username}</span>
                            <i data-feather="mic-off" class="vc-mic w-3.5 h-3.5 text-red-400 shrink-0"></i>
                        </div>
                    </div>

                    <!-- Mock other users -->
                    ${otherMembers.map(m => `
                    <div class="vc-user-tile aspect-video bg-[#2f3136] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border border-white/5 shadow-lg opacity-90 backdrop-blur-sm transition-all">
                        <img src="${fallback}" data-vc-user="${m}" class="w-20 h-20 rounded-full mb-3 opacity-90 vc-avatar transition-all">
                        <div class="absolute bottom-3 left-4 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
                            <span class="text-white/90 font-medium text-sm w-24 truncate">${m}</span>
                            <i data-feather="mic-off" class="vc-mic w-3.5 h-3.5 text-red-400 shrink-0"></i>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>

            <!-- Bottom Control Bar -->
            <div class="h-20 bg-black/60 backdrop-blur-xl border-t border-white/5 flex items-center justify-center gap-4 z-20 px-6 absolute bottom-0 left-0 right-0">
                <button class="w-12 h-12 rounded-full bg-[#2b2d31] hover:bg-[#383a40] flex items-center justify-center text-white transition-colors border border-white/5" title="Turn On Camera">
                    <i data-feather="video" class="w-5 h-5"></i>
                </button>
                <button class="w-12 h-12 rounded-full bg-[#2b2d31] hover:bg-[#383a40] flex items-center justify-center text-white transition-colors border border-white/5" title="Share Screen">
                    <i data-feather="monitor" class="w-5 h-5"></i>
                </button>
                <div class="w-px h-8 bg-white/10 mx-2"></div>
                <button class="w-12 h-12 rounded-full bg-[#2b2d31] hover:bg-[#383a40] flex items-center justify-center text-white transition-colors border border-white/5" title="Mute">
                    <i data-feather="mic-off" class="w-5 h-5"></i>
                </button>
                <button class="w-12 h-12 rounded-full bg-[#2b2d31] hover:bg-[#383a40] flex items-center justify-center text-white transition-colors border border-white/5" title="Deafen">
                    <i data-feather="headphones" class="w-5 h-5"></i>
                </button>
                <button onclick="if(window.vcSimulationInterval) clearInterval(window.vcSimulationInterval); switchGroupChannel(groupsData.find(g => g.id === window.currentGroupId), 'general')" class="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20 transition-all hover:scale-105 ml-2" title="Disconnect">
                    <i data-feather="phone-missed" class="w-6 h-6"></i>
                </button>
            </div>
            
        </div>
    `;

    // Async-load real avatars for all VC tiles
    if (window.getUserAvatarUrl) {
        container.querySelectorAll('.vc-avatar').forEach(img => {
            const u = img.getAttribute('data-vc-user');
            if (u) getUserAvatarUrl(u).then(url => { img.src = url; });
        });
    }

    if (window.feather) feather.replace();
    if (window.ZyloSounds) ZyloSounds.play('callJoin');

    // Simulate Voice Activity
    const tiles = Array.from(document.querySelectorAll('.vc-user-tile'));
    window.vcSimulationInterval = setInterval(() => {
        // Reset all tiles
        tiles.forEach(t => {
            t.classList.remove('ring-2', 'ring-green-500', 'scale-[1.02]', 'opacity-100');
            t.classList.add('border-white/5', 'opacity-90');
            const mic = t.querySelector('.vc-mic');
            if (mic && !mic.hasAttribute('data-muted')) {
                mic.setAttribute('data-feather', 'mic-off');
                mic.classList.remove('text-green-400');
                mic.classList.add('text-red-400');
            }
        });

        // Pick 1 or 2 random speakers
        const speakerCount = Math.random() > 0.7 ? 2 : 1;
        for (let i = 0; i < speakerCount; i++) {
            const speaker = tiles[Math.floor(Math.random() * tiles.length)];
            if (!speaker) continue;
            
            speaker.classList.add('ring-2', 'ring-green-500', 'scale-[1.02]', 'opacity-100');
            speaker.classList.remove('border-white/5', 'opacity-90');
            
            const mic = speaker.querySelector('.vc-mic');
            if (mic) {
                mic.setAttribute('data-feather', 'mic');
                mic.classList.add('text-green-400');
                mic.classList.remove('text-red-400');
            }
        }
        
        // Re-replace feather icons for updated icons
        if (window.feather) feather.replace();
    }, 2000);
}

function loadGroupMembers(group) {
    const container = document.getElementById('groupMembersList');
    if (!container) return;

    container.innerHTML = '';

    const members = group.members || [localStorage.getItem('savedUsername') || localStorage.getItem('username') || 'You'];

    members.forEach(member => {
        const item = document.createElement('div');
        item.className = 'flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-discord-gray-700/50 cursor-pointer mb-0.5 group transition-colors';

        // Mock status
        const statuses = ['online', 'idle', 'dnd', 'offline'];
        const status = statuses[Math.floor(Math.random() * 3)]; // demo random active statuses
        let statusColor = 'bg-discord-gray-400';
        if (status === 'online') statusColor = 'bg-green-500';
        else if (status === 'idle') statusColor = 'bg-yellow-500';
        else if (status === 'dnd') statusColor = 'bg-red-500';

        const roles = group.roles || {};
        const isAdmin = (roles.admin || []).includes(member);
        const isMod = (roles.moderator || []).includes(member);
        const isOwner = group.owner === member;

        // Context menu for owner to assign roles (simple implementation)
        const me = localStorage.getItem('username') || localStorage.getItem('savedUsername');
        if (group.owner === me && member !== me) {
             item.oncontextmenu = (e) => {
                 e.preventDefault();
                 const action = confirm(`Manage role for ${member}?\nOK for Admin, Cancel for Moderator.`); // Very basic, improved in next step if needed or rely on settings
                 // Actually relying on settings tab is better UX. 
                 // Let's just add a simple onclick to open profile or something.
             };
        }
        
        container.appendChild(item);
    });
    if (window.feather) feather.replace();

    // Update member count
    const countEl = document.getElementById('groupChatMemberCount');
    if (countEl) countEl.textContent = `${members.length} members`;
}

function loadGroupMembers(group) {
    const container = document.getElementById('groupMembersList');
    if (!container) return;

    container.innerHTML = '';

    const members = group.members || [localStorage.getItem('savedUsername') || localStorage.getItem('username') || 'You'];

    members.forEach(member => {
        const item = document.createElement('div');
        item.className = 'flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-discord-gray-700/50 cursor-pointer mb-0.5 group transition-colors';
        
        // Mock status
        const statuses = ['online', 'idle', 'dnd', 'offline'];
        const status = statuses[Math.floor(Math.random() * 3)]; // demo random active statuses
        let statusColor = 'bg-discord-gray-400';
        if (status === 'online') statusColor = 'bg-green-500';
        else if (status === 'idle') statusColor = 'bg-yellow-500';
        else if (status === 'dnd') statusColor = 'bg-red-500';

        const roles = group.roles || {};
        const isAdmin = (roles.admin || []).includes(member);
        const isMod = (roles.moderator || []).includes(member);
        const isOwner = group.owner === member;

        let roleColor = 'text-discord-gray-300';
        if (isOwner) roleColor = 'text-yellow-500 font-bold';
        else if (isAdmin) roleColor = 'text-red-400 font-medium';
        else if (isMod) roleColor = 'text-green-400 font-medium';

        // Build with placeholder, then async-load the real avatar
        const fallbackAvatar = '/images/default_avatar.png';

        item.innerHTML = `
            <div class="relative w-8 h-8 shrink-0">
                <img src="${fallbackAvatar}" class="w-full h-full rounded-full object-cover member-avatar" data-username="${member}">
                <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${statusColor} rounded-full border-[2.5px] border-[#2f3136] z-10 transition-colors"></div>
            </div>
            <div class="flex flex-col overflow-hidden">
                <span class="truncate text-[13px] ${roleColor} group-hover:text-white transition-colors">${member}</span>
            </div>
        `;

        // Async load real avatar
        if (window.getUserAvatarUrl) {
            getUserAvatarUrl(member).then(url => {
                const img = item.querySelector('.member-avatar');
                if (img) img.src = url;
            });
        }

        // Context menu for owner to assign roles (simple implementation)
        const me = localStorage.getItem('username') || localStorage.getItem('savedUsername');
        if (group.owner === me && member !== me) {
            item.oncontextmenu = (e) => {
                e.preventDefault();
                showGroupMemberContextMenu(e, member, group);
            };
        }

        container.appendChild(item);
    });
}

window.lastGroupMsgUsername = null;
window.lastGroupMsgTimestamp = 0;

async function loadGroupMessages(group, channelId) {
    activeChannelId = channelId;
    window.lastGroupMsgUsername = null;
    window.lastGroupMsgTimestamp = 0;

    const container = document.getElementById('groupChatMessages');
    if (!container) return;

    container.innerHTML = '<div class="text-center text-discord-gray-400 py-4">Loading messages...</div>';

    // Update channel name and placeholder
    const channel = (group.channels || []).find(c => (c.id || c) === channelId) || { name: channelId };
    const displayTitle = channel.name || channelId;

    const titleEl = document.getElementById('groupChatChannelName');
    if (titleEl) titleEl.textContent = displayTitle;

    const input = document.getElementById('groupChatInput');
    if (input) input.placeholder = `Message #${displayTitle}`;

    try {
        const res = await fetch(`/api/groups/${group.id}/messages?channel=${channelId}`);
        const data = await res.json();
        const messages = data.messages || [];

        container.innerHTML = '';
        for (const msg of messages) {
            await appendGroupMessage(msg);
        }

        // Apply pinned status
        const currentChObj = (group.channels || []).find(c => (c.id || c) === channelId);
        if (currentChObj && currentChObj.pinned_messages) {
            currentChObj.pinned_messages.forEach(mid => {
                const el = container.querySelector(`[data-msg-id="${mid}"]`);
                if (el) updatePinnedMessageUI(el, true);
            });
        }

        container.scrollTop = container.scrollHeight;
    } catch (error) {
        console.log('No messages yet or error loading:', error);
        container.innerHTML = '<div class="text-center text-discord-gray-400 py-4">Start the conversation!</div>';
    }
}

function switchGroupChannel(group, channelId) {
    if (window.vcSimulationInterval) clearInterval(window.vcSimulationInterval);

    const inputArea = document.getElementById('groupChatInputContainer');
    if (inputArea) inputArea.style.display = ''; // Restore text input dynamically

    // Re-render channel list to update active states
    loadGroupChannels(group, channelId);

    // Load messages for this channel
    loadGroupMessages(group, channelId);
}

async function appendGroupMessage(msg) {
    const container = document.getElementById('groupChatMessages');
    if (!container || !window.createDiscordMessage) return;

    // Deduplication: skip if message with this ID already exists
    const msgId = msg.id || msg.timestamp || msg.ts;
    if (msgId && container.querySelector(`[data-msg-id="${msgId}"]`)) return;

    const msgUser = msg.username || msg.from;
    const msgTime = msg.timestamp || msg.ts || 0;

    // Enable compact mode if same user within 5 minutes (300 seconds)
    if (window.lastGroupMsgUsername === msgUser && (msgTime - window.lastGroupMsgTimestamp) < 300) {
        msg.compact = true;
    }

    window.lastGroupMsgUsername = msgUser;
    window.lastGroupMsgTimestamp = msgTime;

    const el = await createDiscordMessage(msg);
    if (msgId) el.setAttribute('data-msg-id', msgId);
    
    // Context Menu for Pinning
    el.addEventListener('contextmenu', (e) => {
        // Check permissions
        const me = localStorage.getItem('username') || localStorage.getItem('savedUsername');
        const group = groupsData.find(g => g.id === currentGroupId);
        if (!group) return;
        
        const roles = group.roles || {};
        const isOwner = group.owner === me;
        const isAdmin = (roles.admin || []).includes(me);
        const isMod = (roles.moderator || []).includes(me);
        
        if (isOwner || isAdmin || isMod) {
            e.preventDefault();
            if (confirm("Pin/Unpin this message?")) {
                 const action = confirm("Click OK to PIN, Cancel to UNPIN") ? 'pin' : 'unpin';
                 window.socket.emit('pin_message', {
                     groupId: currentGroupId,
                     channelId: activeChannelId,
                     messageId: msg.id,
                     username: me,
                     action: action
                 });
            }
        }
    });

    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
    if (window.feather) feather.replace();
}
window.appendGroupMessage = appendGroupMessage;

// Pin Listeners
function setupPinListeners() {
    const s = window.socket;
    if (!s) { setTimeout(setupPinListeners, 500); return; }
    if (s.__pinListenersAttached) return;
    s.__pinListenersAttached = true;
    
    s.on('message_pinned_update', (data) => {
        if (data.groupId === currentGroupId && data.channelId === activeChannelId) {
            // Update UI for all messages in the list
            // data.pinnedMessages is an array of IDs
            const allMsgs = document.querySelectorAll('#groupChatMessages > div');
            allMsgs.forEach(el => {
                const mid = el.getAttribute('data-msg-id');
                if (mid) {
                    const isPinned = data.pinnedMessages.includes(mid);
                    updatePinnedMessageUI(el, isPinned);
                }
            });
        }
    });
}

function updatePinnedMessageUI(el, isPinned) {
    let pinIcon = el.querySelector('.pin-icon');
    if (isPinned) {
        if (!pinIcon) {
            pinIcon = document.createElement('div');
            pinIcon.className = 'pin-icon absolute -left-2 top-2 text-red-500 transform -rotate-45';
            pinIcon.innerHTML = '<i data-feather="map-pin" class="w-3 h-3"></i>';
            el.appendChild(pinIcon);
            if (window.feather) feather.replace();
        }
    } else {
        if (pinIcon) pinIcon.remove();
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPinListeners);
} else {
    setupPinListeners();
}

// Remove old openGroupChat - no longer needed since selectGroup handles everything

// Keep loadGroupMembers export for external calls



window.selectGroup = selectGroup;

function showGroupsModal() {
    const m = document.getElementById('groupsModal');
    if (m) m.classList.remove('hidden');
}
window.showGroupsModal = showGroupsModal;

function closeGroupsModal() {
    const m = document.getElementById('groupsModal');
    if (m) m.classList.add('hidden');
}
window.closeGroupsModal = closeGroupsModal;

function switchGroupModalTab(tab) {
    const createTab = document.getElementById('createGroupTab');
    const joinTab = document.getElementById('joinGroupTab');
    const createForm = document.getElementById('createGroupForm');
    const joinForm = document.getElementById('joinGroupForm');

    if (tab === 'create') {
        createTab.classList.add('border-b-2', 'border-discord-blurple', 'text-white');
        createTab.classList.remove('text-discord-gray-400');
        joinTab.classList.remove('border-b-2', 'border-discord-blurple', 'text-white');
        joinTab.classList.add('text-discord-gray-400');

        createForm.classList.remove('hidden');
        joinForm.classList.add('hidden');
    } else {
        joinTab.classList.add('border-b-2', 'border-discord-blurple', 'text-white');
        joinTab.classList.remove('text-discord-gray-400');
        createTab.classList.remove('border-b-2', 'border-discord-blurple', 'text-white');
        createTab.classList.add('text-discord-gray-400');

        joinForm.classList.remove('hidden');
        createForm.classList.add('hidden');
    }
}
window.switchGroupModalTab = switchGroupModalTab;

// function openGroupChat removed (duplicated/legacy)
// function appendGroupMessage removed (duplicated)


async function refreshGroups() {
    return loadGroups();
}
window.refreshGroups = refreshGroups;

async function createNewGroup() {
    const owner = localStorage.getItem('username');
    const nameInput = document.getElementById('newGroupNameInput');
    const descInput = document.getElementById('newGroupDescInput');
    const iconInput = document.getElementById('newGroupIconInput');
    let name = nameInput?.value?.trim();

    if (!name) { alert("Please enter a group name."); return; }

    const description = descInput?.value?.trim() || "";
    
    // Read icon data if provided
    let iconData = null;
    if (iconInput && iconInput.files && iconInput.files[0]) {
        iconData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.readAsDataURL(iconInput.files[0]);
        });
    }

    if (!owner) return;
    try {
        const res = await fetch('/api/groups/create', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ owner, name, description, iconData }) 
        });
        const data = await res.json();
        if (res.ok && data.success) {
            closeGroupsModal();
            refreshGroups();
            if (nameInput) nameInput.value = '';
            if (descInput) descInput.value = '';
            if (iconInput) iconInput.value = '';
        } else {
            alert(data.error || "Failed to create group.");
        }
    } catch { }
}
window.createNewGroup = createNewGroup;

async function joinExistingGroup() {
    const groupIdInput = document.getElementById('joinGroupIdInput');
    const groupId = groupIdInput?.value?.trim();
    const username = localStorage.getItem('username');

    if (!username || !groupId) return;

    try {
        const res = await fetch('/api/groups/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, groupId }) });
        const data = await res.json();

        if (data.success) {
            closeGroupsModal();
            refreshGroups();
            if (groupIdInput) groupIdInput.value = '';
        } else {
            alert(data.error || "Failed to join group.");
        }
    } catch { }
}
window.joinExistingGroup = joinExistingGroup;

function sendGroupChatMessage() {
    const inputAlt = document.getElementById('groupChatInput');
    if (!inputAlt) return;
    
    const message = (inputAlt.value || '').trim();
    if (!message || !currentGroupId) return;
    
    const username = localStorage.getItem('username') || localStorage.getItem('savedUsername');
    const channel = activeChannelId || 'general';
    
    const payload = {
        id: (typeof generateUUID === 'function' ? generateUUID() : 'grp_' + Date.now()),
        groupId: currentGroupId,
        channel: channel,
        username: username,
        message,
        replyTo: window.replyContext ? { id: replyContext.id, username: replyContext.username, content: replyContext.content } : null,
        ts: Date.now() / 1000
    };
    
    // Optimistic UI - show message immediately
    (async () => { await appendGroupMessage(payload); })();
    
    // Send to server
    if (navigator.onLine && window.socket) {
        window.socket.emit('send_group_message', payload);
    }
    
    inputAlt.value = ''; 
    inputAlt.style.height = 'auto';
    if(window.cancelReply) window.cancelReply();
}
window.sendGroupChatMessage = sendGroupChatMessage;

function sendGroupFile(event) {
    const file = event.target.files?.[0];
    if (!file || !currentGroupId) return;

    // Security: 10MB File Size Limit
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
        alert("File is too large! Maximum file size is 10MB.");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (e) {
        const username = localStorage.getItem('username');
        const payload = {
            groupId: currentGroupId,
            channel: activeChannelId || 'general',
            username: username,
            fileName: file.name,
            fileType: file.type,
            fileData: e.target.result,
            ts: Date.now() / 1000
        };

        // Optimistic UI
        if(window.appendGroupMessage) {
            await appendGroupMessage({ 
                ...payload, 
                message: `File: ${file.name}` // fallback
            });
        }

        if (navigator.onLine && window.socket) window.socket.emit('send_group_file', payload);
        event.target.value = '';
    };
    reader.readAsDataURL(file);
}
window.sendGroupFile = sendGroupFile;

// Listeners - Deferred setup to ensure socket is ready
function setupGroupSocketListeners() {
    const s = window.socket;
    if (!s) {
        // Retry if socket not ready yet
        setTimeout(setupGroupSocketListeners, 500);
        return;
    }
    if (s.__groupListenersAttached) return;
    s.__groupListenersAttached = true;
    
    s.on('receive_group_message', async (data) => {
        if (data.groupId === currentGroupId) {
            await appendGroupMessage(data);
            // If viewing this channel, mark as read
            if (activeChannelId === (data.channel || 'general')) {
                markGroupChannelRead();
            }
        }
    });
    s.on('receive_group_file', async (data) => {
        if (data.groupId === currentGroupId) await appendGroupMessage(data);
    });
    
    s.on('group_read_update', (data) => {
        // data = { groupId, channel, username, messageId }
        if (data.groupId === currentGroupId) {
            // Find messages and update tick
            const selector = data.messageId ? `[data-msg-id="${data.messageId}"]` : `.chat-messages > div`;
            const msgs = document.querySelectorAll(selector);
            msgs.forEach(msgEl => {
                 // Only update own messages
                 // But wait, createDiscordMessage only renders status for OWN messages.
                 // So selecting all is fine, the non-own ones won't have the status icon container or we check author.
                 // Actually, simpler: find .msg-status-icon inside.
                 const icon = msgEl.querySelector('.msg-status-icon');
                 if (icon) {
                     icon.innerHTML = '<span class="text-blue-400 font-bold" title="Read">✓✓</span>';
                 }
            });
        }
    });
}

function markGroupChannelRead() {
    if (!currentGroupId || !activeChannelId || !window.socket) return;
    const me = localStorage.getItem('username') || localStorage.getItem('savedUsername');
    window.socket.emit('mark_group_read', {
        groupId: currentGroupId,
        channel: activeChannelId,
        username: me
    });
}

// Initialize on DOM ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGroupSocketListeners);
} else {
    setupGroupSocketListeners();
}
// Role Management
function showAssignRoleModal(role) {
    const username = prompt(`Enter username to assign as ${role}:`);
    if (username) {
        assignRole(username, role);
    }
}
window.showAssignRoleModal = showAssignRoleModal;

function assignRole(targetUser, role) {
    if (!currentGroupId || !window.socket) return;
    const me = localStorage.getItem('username') || localStorage.getItem('savedUsername');
    
    window.socket.emit('assign_role', {
        groupId: currentGroupId,
        username: me,
        targetUser: targetUser,
        role: role
    });
}

function updateRolesUI(groupId, roles) {
    // Only update if we are in settings for this group
    if (currentGroupId !== groupId) return;
    
    // In a real app, we would re-render the list. 
    // For now, let's just alert success or refresh logic if needed.
    // The simple UI we built doesn't list individual members yet except via logic we need to add.
    // Let's implement a simple member list fetch/refresh if open.
    console.log('Roles updated:', roles);
}

// Enhance setupGroupSocketListeners from previous step
// We need to re-declare it or append to it. 
// Since we can't easily append to inside a function without replacing it, 
// let's add a separate listener setup that runs finding the socket.

function setupRoleListeners() {
    const s = window.socket;
    if (!s) { setTimeout(setupRoleListeners, 500); return; }
    if (s.__roleListenersAttached) return;
    s.__roleListenersAttached = true;
    
    s.on('group_roles_updated', (data) => {
        if (data.groupId === currentGroupId) {
            // updateRolesUI(data.groupId, data.roles);
            // Refresh groups data to get new roles
            loadGroups(); 
            alert('Roles updated successfully!');
        }
    });
    
    s.on('user_kicked', (data) => {
        if (data.username === (localStorage.getItem('username') || localStorage.getItem('savedUsername'))) {
            alert(`You have been kicked from the group.`);
            location.reload(); // Simple reload to reset state
        } else if (data.groupId === currentGroupId) {
            loadGroups(); // Refresh member list
        }
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupRoleListeners);
    setupRoleListeners();
}

// Channel Creation
async function showCreateChannelInput() {
    const name = prompt("Enter new channel name:");
    if (!name) return;
    
    // Simple verification for category input for now
    const category = prompt("Enter category (e.g. Text Channels, Voice Channels):", "Text Channels");
    
    // Determine type based on name or ask? 
    const type = confirm("Is this a Voice Channel? OK for Yes, Cancel for No") ? 'voice' : 'text';
    
    if (!currentGroupId) return;
    
    const username = localStorage.getItem('username') || localStorage.getItem('savedUsername');
    
    try {
        const res = await fetch('/api/groups/channels/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupId: currentGroupId,
                username: username,
                channelName: name,
                type: type,
                category: category || 'Text Channels'
            })
        });
        
        const data = await res.json();
        if (data.success) {
            // Refresh group data
            loadGroups(); // This will re-render channels
            alert('Channel created!');
        } else {
            alert(data.error || 'Failed to create channel');
        }
    } catch (e) {
        console.error('Error creating channel:', e);
        alert('Failed to connect to server.');
    }
}
window.showCreateChannelInput = showCreateChannelInput;

// Pinned Messages Modal Logic
function togglePinnedMessagesModal() {
    const m = document.getElementById('pinnedMessagesModal');
    if (!m) return;
    
    if (m.classList.contains('hidden')) {
        m.classList.remove('hidden');
        renderPinnedMessagesList();
    } else {
        m.classList.add('hidden');
    }
}
window.togglePinnedMessagesModal = togglePinnedMessagesModal;

async function renderPinnedMessagesList() {
    const list = document.getElementById('pinnedMessagesList');
    if(!list) return;
    list.innerHTML = '<div class="text-center text-gray-500 py-4">Loading...</div>';
    
    if (!currentGroupId || !activeChannelId) return;

    try {
        const res = await fetch(`/api/groups/${currentGroupId}/channels/${activeChannelId}/pins`);
        const data = await res.json();
        
        if (!data.success || !data.messages || data.messages.length === 0) {
            list.innerHTML = `<div class="text-center text-gray-500 py-8 flex flex-col items-center">
                <i data-feather="map-pin" class="w-8 h-8 mb-2 opacity-50"></i>
                <p>No pinned messages yet.</p>
            </div>`;
            if (window.feather) feather.replace();
            return;
        }

        list.innerHTML = '';
        data.messages.forEach(msg => {
            let content = msg.message || "";
            // Check for file
            if (msg.fileName && !content) content = `File: ${msg.fileName}`;
            if (msg.fileName && content) content += ` (File: ${msg.fileName})`;
            
            // Clean up content
            content = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            const item = document.createElement('div');
            item.className = "bg-discord-gray-900 p-3 rounded text-sm mb-2 border border-discord-gray-700 hover:border-discord-gray-600 transition-colors";
            item.innerHTML = `
                <div class="font-bold text-discord-blurple mb-1 flex justify-between items-center">
                    <span>${msg.username || 'Unknown'}</span>
                    <span class="text-[10px] bg-discord-gray-800 px-2 py-0.5 rounded cursor-pointer hover:bg-discord-blurple hover:text-white transition" onclick="scrollToMessage('${msg.id}')">JUMP</span>
                </div>
                <div class="text-gray-300 line-clamp-3 break-words">${content}</div>
                <div class="text-[10px] text-gray-500 mt-1">${new Date((msg.ts || Date.now()) * 1000).toLocaleString()}</div>
            `;
            list.appendChild(item);
        });
        if (window.feather) feather.replace();
        
    } catch (e) {
        console.error('Error fetching pins:', e);
        list.innerHTML = '<div class="text-red-400 text-center py-4">Failed to load pins.</div>';
    }
}

function scrollToMessage(mid) {
    const el = document.querySelector(`[data-msg-id="${mid}"]`);
    if (el) {
        togglePinnedMessagesModal(); // close
        el.scrollIntoView({behavior: 'smooth', block: 'center'});
        
        // Highlight effect
        el.style.transition = 'background-color 0.5s';
        const originalBg = el.style.backgroundColor;
        el.style.backgroundColor = 'rgba(88, 101, 242, 0.3)'; // Blurple transparent
        
        setTimeout(() => {
            el.style.backgroundColor = originalBg;
            setTimeout(() => { el.style.backgroundColor = ''; }, 500);
        }, 1500);
    } else {
        alert("Message is not currently loaded in the view. Scroll up to load context.");
    }
}
window.scrollToMessage = scrollToMessage;
