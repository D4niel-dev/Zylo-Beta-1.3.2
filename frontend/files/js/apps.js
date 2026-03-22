
/**
 * apps.js - Logic for the internal "Apps" modal (Calculator, Calendar, etc.)
 */

var currentApp = null;

function openAppModal(appName) {
    currentApp = appName;
    const modal = document.getElementById('appsModal');
    const title = document.getElementById('appModalTitle');
    const content = document.getElementById('appModalContent');

    const apps = {
        menu: {
            title: 'Apps & Tools',
            render: () => `
        <div class="grid grid-cols-2 gap-3 p-2">
          <button onclick="openAppModal('calculator')" class="p-4 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
            <i data-feather="hash" class="w-8 h-8 mb-2 text-discord-gray-300 group-hover:text-white transition"></i>
            <div class="text-sm font-medium text-gray-300 group-hover:text-white">Calculator</div>
          </button>
          <button onclick="openAppModal('calendar')" class="p-4 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
            <i data-feather="calendar" class="w-8 h-8 mb-2 text-discord-gray-300 group-hover:text-white transition"></i>
            <div class="text-sm font-medium text-gray-300 group-hover:text-white">Calendar</div>
          </button>
          <button onclick="openAppModal('speedtest')" class="p-4 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
            <i data-feather="zap" class="w-8 h-8 mb-2 text-discord-gray-300 group-hover:text-white transition"></i>
            <div class="text-sm font-medium text-gray-300 group-hover:text-white">Speed Test</div>
          </button>
          <button onclick="openAppModal('notes')" class="p-4 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
            <i data-feather="file-text" class="w-8 h-8 mb-2 text-discord-gray-300 group-hover:text-white transition"></i>
            <div class="text-sm font-medium text-gray-300 group-hover:text-white">Notes</div>
          </button>
          <button onclick="openAppModal('timer')" class="p-4 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
            <i data-feather="clock" class="w-8 h-8 mb-2 text-discord-gray-300 group-hover:text-white transition"></i>
            <div class="text-sm font-medium text-gray-300 group-hover:text-white">Timer</div>
          </button>
          <button onclick="openAppModal('colorpicker')" class="p-4 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
            <i data-feather="aperture" class="w-8 h-8 mb-2 text-discord-gray-300 group-hover:text-white transition"></i>
            <div class="text-sm font-medium text-gray-300 group-hover:text-white">Colors</div>
          </button>
          <button onclick="openAppModal('snake')" class="p-4 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
            <i data-feather="play-circle" class="w-8 h-8 mb-2 text-discord-gray-300 group-hover:text-white transition"></i>
            <div class="text-sm font-medium text-gray-300 group-hover:text-white">Snake</div>
          </button>
          <button onclick="openAppModal('zyloslayer')" class="p-4 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
            <i data-feather="shield" class="w-8 h-8 mb-2 text-discord-gray-300 group-hover:text-white transition"></i>
            <div class="text-sm font-medium text-gray-300 group-hover:text-white">Zylo Slayer</div>
          </button>
        </div>
      `
        },
        calculator: {
            title: 'Calculator',
            render: () => `
        <div class="bg-discord-gray-700 p-4 rounded-lg">
          <input type="text" id="calcDisplay" class="w-full bg-discord-gray-900 text-white text-2xl text-right p-3 rounded mb-3" readonly value="0">
          <div class="grid grid-cols-4 gap-2">
            ${['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map(b =>
                `<button onclick="calcPress('${b}')" class="p-3 rounded ${b.match(/[0-9.]/) ? 'bg-discord-gray-600' : 'bg-discord-blurple'} hover:opacity-80 text-white font-bold">${b}</button>`
            ).join('')}
          </div>
        </div>
      `
        },
        calendar: {
            title: 'Calendar',
            render: () => {
                const now = new Date();
                const month = now.toLocaleString('default', { month: 'long' });
                const year = now.getFullYear();
                const today = now.getDate();
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

                let days = '';
                for (let i = 0; i < firstDay; i++) days += '<div></div>';
                for (let d = 1; d <= daysInMonth; d++) {
                    const isToday = d === today ? 'bg-discord-blurple text-white' : 'bg-discord-gray-700 hover:bg-discord-gray-600';
                    days += `<div class="p-2 text-center rounded ${isToday} cursor-pointer">${d}</div>`;
                }

                return `
          <div class="text-center mb-4">
            <div class="text-xl font-bold text-white">${month} ${year}</div>
          </div>
          <div class="grid grid-cols-7 gap-1 text-xs text-center">
            <div class="text-discord-gray-400 font-bold">Sun</div>
            <div class="text-discord-gray-400 font-bold">Mon</div>
            <div class="text-discord-gray-400 font-bold">Tue</div>
            <div class="text-discord-gray-400 font-bold">Wed</div>
            <div class="text-discord-gray-400 font-bold">Thu</div>
            <div class="text-discord-gray-400 font-bold">Fri</div>
            <div class="text-discord-gray-400 font-bold">Sat</div>
            ${days}
          </div>
        `;
            }
        },
        speedtest: {
            title: 'Speed Test',
            render: () => `
        <div class="text-center">
          <div id="speedResult" class="text-6xl font-bold text-white mb-2">--</div>
          <div class="text-discord-gray-400 mb-4">Mbps (Download)</div>
          <button onclick="runSpeedTest()" class="px-6 py-3 bg-discord-blurple hover:bg-opacity-80 text-white rounded-lg font-medium">
            Run Test
          </button>
          <p class="text-xs text-discord-gray-500 mt-4">Note: Simulated test for demo</p>
        </div>
      `
        },
        notes: {
            title: 'Quick Notes',
            render: () => `
        <textarea id="quickNotes" class="w-full h-48 bg-discord-gray-700 text-white p-3 rounded-lg resize-none" placeholder="Type your notes here...">${localStorage.getItem('quickNotes') || ''}</textarea>
        <button onclick="saveNotes()" class="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Save Notes</button>
      `
        },
        timer: {
            title: 'Timer',
            render: () => `
        <div class="text-center">
          <div id="timerDisplay" class="text-6xl font-mono font-bold text-white mb-4">00:00</div>
          <div class="flex gap-2 justify-center mb-4">
            <input type="number" id="timerMinutes" class="w-20 bg-discord-gray-700 text-white p-2 rounded text-center" placeholder="Min" value="5">
            <span class="text-2xl text-white">:</span>
            <input type="number" id="timerSeconds" class="w-20 bg-discord-gray-700 text-white p-2 rounded text-center" placeholder="Sec" value="00">
          </div>
          <div class="flex gap-2 justify-center">
            <button onclick="startTimer()" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Start</button>
            <button onclick="stopTimer()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Stop</button>
            <button onclick="resetTimer()" class="px-4 py-2 bg-discord-gray-600 hover:bg-discord-gray-500 text-white rounded-lg">Reset</button>
          </div>
        </div>
      `
        },
        colorpicker: {
            title: 'Color Picker',
            render: () => `
        <div class="space-y-4">
          <div id="colorPreview" class="w-full h-24 rounded-lg bg-discord-blurple border-2 border-discord-gray-600"></div>
          <input type="color" id="colorInput" class="w-full h-12 rounded cursor-pointer" value="#5865f2" onchange="updateColorPreview()">
          <input type="text" id="colorHex" class="w-full bg-discord-gray-700 text-white p-2 rounded text-center font-mono" value="#5865f2" onchange="updateFromHex()">
          <button onclick="copyColor()" class="w-full py-2 bg-discord-blurple hover:bg-opacity-80 text-white rounded-lg">Copy Hex Code</button>
        </div>
      `
        },
        snake: {
            title: 'Snake',
            render: () => `
        <div class="flex flex-col items-center">
          <div class="flex justify-between w-full mb-2 max-w-[300px]">
             <span class="text-white font-bold">Score: <span id="snakeScore">0</span></span>
             <span class="text-discord-gray-400 font-bold">High: <span id="snakeHighScore">0</span></span>
          </div>
          <canvas id="snakeCanvas" width="300" height="300" class="bg-discord-gray-900 border-2 border-discord-gray-600 rounded-lg shadow-lg"></canvas>
          <div class="text-discord-gray-400 text-xs mt-3 text-center">Use Arrow Keys to move.<br>Game auto-starts.</div>
        </div>
      `,
            init: () => {
                const canvas = document.getElementById('snakeCanvas');
                const ctx = canvas.getContext('2d');
                const gridSize = 15;
                const tileCount = canvas.width / gridSize;

                let snake = [{ x: 10, y: 10 }];
                let velocity = { x: 0, y: 0 };
                let apple = { x: 5, y: 5 };
                let score = 0;
                let highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
                
                document.getElementById('snakeHighScore').textContent = highScore;

                function resetGame() {
                    snake = [{ x: 10, y: 10 }];
                    velocity = { x: 0, y: 0 };
                    score = 0;
                    document.getElementById('snakeScore').textContent = score;
                    placeApple();
                }

                function placeApple() {
                    apple = {
                        x: Math.floor(Math.random() * tileCount),
                        y: Math.floor(Math.random() * tileCount)
                    };
                    // Ensure apple doesn't spawn on snake
                    if (snake.some(segment => segment.x === apple.x && segment.y === apple.y)) {
                        placeApple();
                    }
                }

                function update() {
                    // Move snake
                    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

                    // Wall collision (wrap around)
                    if (head.x < 0) head.x = tileCount - 1;
                    if (head.x >= tileCount) head.x = 0;
                    if (head.y < 0) head.y = tileCount - 1;
                    if (head.y >= tileCount) head.y = 0;

                    // Self collision
                    if (velocity.x !== 0 || velocity.y !== 0) {
                        for (let i = 0; i < snake.length; i++) {
                            if (head.x === snake[i].x && head.y === snake[i].y) {
                                resetGame();
                                return; // Game over frame
                            }
                        }
                    }

                    snake.unshift(head);

                    // Apple collision
                    if (head.x === apple.x && head.y === apple.y) {
                        score += 10;
                        document.getElementById('snakeScore').textContent = score;
                        if (score > highScore) {
                            highScore = score;
                            localStorage.setItem('snakeHighScore', highScore);
                            document.getElementById('snakeHighScore').textContent = highScore;
                        }
                        placeApple();
                    } else {
                        snake.pop(); // Remove tail if no apple eaten
                    }
                }

                function draw() {
                    ctx.fillStyle = '#202225'; // discord-gray-900 background
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw Apple
                    ctx.fillStyle = '#ed4245'; // discord red
                    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);

                    // Draw Snake
                    ctx.fillStyle = '#57F287'; // discord green
                    snake.forEach((segment, index) => {
                        ctx.fillStyle = index === 0 ? '#3ba55d' : '#57F287'; // Head is slightly darker green
                        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
                    });
                }

                function gameLoop() {
                    update();
                    draw();
                }

                window.snakeKeydownListener = (e) => {
                    switch (e.key) {
                        case 'ArrowLeft': if (velocity.x !== 1) velocity = { x: -1, y: 0 }; break;
                        case 'ArrowUp': if (velocity.y !== 1) velocity = { x: 0, y: -1 }; break;
                        case 'ArrowRight': if (velocity.x !== -1) velocity = { x: 1, y: 0 }; break;
                        case 'ArrowDown': if (velocity.y !== -1) velocity = { x: 0, y: 1 }; break;
                    }
                };
                document.addEventListener('keydown', window.snakeKeydownListener);
                window.snakeInterval = setInterval(gameLoop, 100);
                
                // Init first frame
                resetGame();
                velocity = { x: 1, y: 0 }; // Start moving right automatically
            },
            destroy: () => {
                if (window.snakeInterval) clearInterval(window.snakeInterval);
                if (window.snakeKeydownListener) document.removeEventListener('keydown', window.snakeKeydownListener);
            }
        },
        zyloslayer: {
            title: 'Zylo Slayer (Idle RPG)',
            render: () => `
        <div class="flex flex-col gap-2 h-full text-sm">
            <!-- Stage Header -->
            <div class="flex justify-between items-center bg-discord-gray-800 p-2 rounded-lg border border-discord-gray-600">
                <div class="font-bold text-lg text-white">Stage: <span id="rpgStage">1</span></div>
                <div class="font-bold text-yellow-400"><i data-feather="database" class="w-4 h-4 inline pb-1"></i> <span id="rpgGold">0</span></div>
            </div>

            <!-- Battle Log -->
            <div id="rpgLog" class="bg-discord-gray-900 border border-discord-gray-700 rounded-lg p-2 h-32 overflow-y-auto text-xs font-mono text-gray-300 flex flex-col gap-1">
                <div class="text-blue-400">Welcome to Zylo Slayer! Battle commencing...</div>
            </div>

            <!-- Player Status -->
            <div class="bg-discord-gray-800 p-3 rounded-lg border border-discord-gray-600">
                <div class="flex justify-between text-white font-bold mb-1">
                   <span>Player Lv.<span id="rpgLevel">1</span></span>
                   <span class="text-xs text-discord-gray-400">XP: <span id="rpgXp">0</span>/<span id="rpgNextXp">100</span></span>
                </div>
                <div class="w-full bg-discord-gray-900 rounded-full h-1.5 mb-3">
                   <div id="rpgXpBar" class="bg-blue-500 h-1.5 rounded-full" style="width: 0%"></div>
                </div>
                
                <div class="flex justify-between items-center mb-1">
                    <span class="text-red-400 font-bold text-xs"><i data-feather="heart" class="w-3 h-3 inline pb-0.5"></i> HP</span>
                    <span class="text-white text-xs"><span id="rpgHp">100</span> / <span id="rpgMaxHp">100</span></span>
                </div>
                <div class="w-full bg-discord-gray-900 rounded-full h-2">
                    <div id="rpgHpBar" class="bg-red-500 h-2 rounded-full transition-all duration-300" style="width: 100%"></div>
                </div>
            </div>

            <!-- Upgrades -->
            <div class="grid grid-cols-2 gap-2 mt-1">
                <button onclick="window.zyloSlayerBuy('atk')" class="bg-discord-gray-700 hover:bg-discord-gray-600 border border-discord-gray-600 rounded p-2 flex flex-col items-center group transition">
                    <div class="text-gray-300 font-bold mb-1"><i data-feather="crosshair" class="w-3 h-3 inline pb-0.5"></i> Attack</div>
                    <div class="text-xs text-gray-400 group-hover:text-white transition">Current: <span id="rpgStatAtk">10</span></div>
                    <div class="text-xs text-yellow-400 mt-1 font-bold">Cost: <span id="rpgCostAtk">10</span>g</div>
                </button>
                <button onclick="window.zyloSlayerBuy('hp')" class="bg-discord-gray-700 hover:bg-discord-gray-600 border border-discord-gray-600 rounded p-2 flex flex-col items-center group transition">
                    <div class="text-gray-300 font-bold mb-1"><i data-feather="plus-circle" class="w-3 h-3 inline pb-0.5"></i> Max HP</div>
                    <div class="text-xs text-gray-400 group-hover:text-white transition">Current: <span id="rpgStatHp">100</span></div>
                    <div class="text-xs text-yellow-400 mt-1 font-bold">Cost: <span id="rpgCostHp">15</span>g</div>
                </button>
                <button onclick="window.zyloSlayerBuy('regen')" class="bg-discord-gray-700 hover:bg-discord-gray-600 border border-discord-gray-600 rounded p-2 flex flex-col items-center group transition">
                    <div class="text-gray-300 font-bold mb-1"><i data-feather="activity" class="w-3 h-3 inline pb-0.5"></i> Regen</div>
                    <div class="text-xs text-gray-400 group-hover:text-white transition">Current: <span id="rpgStatRegen">1</span>/turn</div>
                    <div class="text-xs text-yellow-400 mt-1 font-bold">Cost: <span id="rpgCostRegen">50</span>g</div>
                </button>
                <button onclick="window.zyloSlayerBuy('crit')" class="bg-discord-gray-700 hover:bg-discord-gray-600 border border-discord-gray-600 rounded p-2 flex flex-col items-center group transition">
                    <div class="text-gray-300 font-bold mb-1"><i data-feather="zap" class="w-3 h-3 inline pb-0.5"></i> Crit %</div>
                    <div class="text-xs text-gray-400 group-hover:text-white transition">Current: <span id="rpgStatCrit">5</span>%</div>
                    <div class="text-xs text-yellow-400 mt-1 font-bold">Cost: <span id="rpgCostCrit">100</span>g</div>
                </button>
            </div>
            <div class="flex justify-end mt-1">
                <button onclick="window.zyloSlayerReset()" class="text-xs text-red-500 hover:underline">Hard Reset Progress</button>
            </div>
        </div>
        `,
            init: () => {
                // Default State
                let state = {
                    gold: 0,
                    level: 1, xp: 0,
                    stage: 1, killsInStage: 0,
                    stats: { atk: 10, maxHp: 100, regen: 1, crit: 5 },
                    costs: { atk: 10, hp: 15, regen: 50, crit: 100 }
                };
                
                // Load State
                try {
                    const saved = localStorage.getItem('zylo_slayer_save');
                    if (saved) state = JSON.parse(saved);
                } catch (e) { console.error('Failed to load Zylo Slayer save', e); }

                let currentHp = state.stats.maxHp;
                let enemy = null; 

                // DOM Elements
                const el = (id) => document.getElementById(id);
                const logEl = el('rpgLog');

                function saveGame() {
                    localStorage.setItem('zylo_slayer_save', JSON.stringify(state));
                }

                function log(msg, color = 'text-gray-300') {
                    if (!logEl) return;
                    const line = document.createElement('div');
                    line.className = color;
                    line.textContent = msg;
                    logEl.appendChild(line);
                    logEl.scrollTop = logEl.scrollHeight;
                    // Max lines limit to prevent memory leak
                    if (logEl.children.length > 50) logEl.removeChild(logEl.firstChild);
                }

                function getNextXp() { return Math.floor(100 * Math.pow(1.5, state.level - 1)); }

                function updateUI() {
                    if (!el('rpgGold')) return; // Modal closed
                    el('rpgGold').textContent = Math.floor(state.gold);
                    el('rpgStage').textContent = state.stage;
                    el('rpgLevel').textContent = state.level;
                    el('rpgXp').textContent = Math.floor(state.xp);
                    el('rpgNextXp').textContent = getNextXp();
                    el('rpgXpBar').style.width = Math.min(100, (state.xp / getNextXp()) * 100) + '%';
                    
                    el('rpgHp').textContent = Math.max(0, Math.floor(currentHp));
                    el('rpgMaxHp').textContent = state.stats.maxHp;
                    el('rpgHpBar').style.width = Math.min(100, (currentHp / state.stats.maxHp) * 100) + '%';

                    el('rpgStatAtk').textContent = state.stats.atk;
                    el('rpgCostAtk').textContent = state.costs.atk;
                    el('rpgStatHp').textContent = state.stats.maxHp;
                    el('rpgCostHp').textContent = state.costs.hp;
                    el('rpgStatRegen').textContent = state.stats.regen;
                    el('rpgCostRegen').textContent = state.costs.regen;
                    el('rpgStatCrit').textContent = state.stats.crit;
                    el('rpgCostCrit').textContent = state.costs.crit;
                }

                function startBattle() {
                    const isBoss = state.killsInStage >= 10;
                    const baseHp = 40 * Math.pow(1.2, state.stage - 1);
                    const eHp = isBoss ? baseHp * 5 : baseHp;
                    const baseAtk = 2 * Math.pow(1.15, state.stage - 1);
                    const eAtk = isBoss ? baseAtk * 3 : baseAtk;

                    enemy = {
                         name: isBoss ? `Stage ${state.stage} Boss` : 'Monster',
                         maxHp: eHp,
                         hp: eHp,
                         atk: eAtk,
                         isBoss: isBoss,
                         goldReward: (isBoss ? 50 : 5) * Math.pow(1.1, state.stage - 1),
                         xpReward: (isBoss ? 50 : 10) * Math.pow(1.1, state.stage - 1)
                    };
                    log(`[${enemy.name}] appeared! (HP: ${Math.floor(enemy.hp)})`, isBoss ? 'text-purple-400 font-bold' : 'text-gray-400');
                }

                function combatTick() {
                    if (!enemy) startBattle();
                    if (currentHp <= 0) {
                        log('You fainted! Resting to recover...', 'text-red-400');
                        currentHp = state.stats.maxHp;
                        state.stage = Math.max(1, state.stage - 1); // Fallback a stage on death
                        state.killsInStage = 0;
                        enemy = null;
                        updateUI();
                        saveGame();
                        return;
                    }

                    // Player Turn
                    currentHp = Math.min(state.stats.maxHp, currentHp + state.stats.regen); // Regen
                    
                    let dmg = state.stats.atk;
                    let isCrit = Math.random() * 100 < state.stats.crit;
                    if (isCrit) dmg *= 2; // Simple 2x crit multiplier
                    
                    enemy.hp -= dmg;
                    log(`You hit ${enemy.name} for ${Math.floor(dmg)} dmg!${isCrit ? ' (CRIT!)' : ''}`, isCrit ? 'text-yellow-400' : 'text-white');

                    if (enemy.hp <= 0) {
                        log(`You defeated ${enemy.name}! Gained ${Math.floor(enemy.goldReward)}g & ${Math.floor(enemy.xpReward)}xp.`, 'text-green-400');
                        state.gold += enemy.goldReward;
                        state.xp += enemy.xpReward;
                        if (enemy.isBoss) {
                            state.stage++;
                            state.killsInStage = 0;
                            log(`STAGE CLEARED! Advancing to Stage ${state.stage}.`, 'text-blue-400 font-bold');
                        } else {
                            state.killsInStage++;
                        }

                        // Level Up check
                        while (state.xp >= getNextXp()) {
                            state.xp -= getNextXp();
                            state.level++;
                            state.stats.atk += 2;
                            state.stats.maxHp += 20;
                            currentHp = state.stats.maxHp;
                            log(`LEVEL UP! You are now Level ${state.level}!`, 'text-pink-400 font-bold');
                        }
                        
                        enemy = null;
                        updateUI();
                        saveGame();
                        return;
                    }

                    // Enemy Turn
                    currentHp -= enemy.atk;
                    log(`${enemy.name} hits you for ${Math.floor(enemy.atk)} dmg!`, 'text-red-300');
                    updateUI();
                }

                // Global Buy Hook
                window.zyloSlayerBuy = (type) => {
                    const cost = state.costs[type];
                    if (state.gold >= cost) {
                        state.gold -= cost;
                        if (type === 'atk') { state.stats.atk += 5; state.costs.atk = Math.floor(cost * 1.5); }
                        if (type === 'hp') { state.stats.maxHp += 50; state.costs.hp = Math.floor(cost * 1.5); currentHp += 50; }
                        if (type === 'regen') { state.stats.regen += 2; state.costs.regen = Math.floor(cost * 2.5); }
                        if (type === 'crit') { 
                            if (state.stats.crit < 100) { state.stats.crit += 1; state.costs.crit = Math.floor(cost * 1.8); }
                            else { alert("Max Crit Reached."); state.gold += cost; }
                        }
                        updateUI();
                        saveGame();
                    }
                };

                // Hard Reset Hook
                window.zyloSlayerReset = () => {
                    if (confirm("Are you sure you want to completely erase your Zylo Slayer progress?")) {
                        localStorage.removeItem('zylo_slayer_save');
                        if (window.zyloslayerInterval) clearInterval(window.zyloslayerInterval);
                        closeAppModal();
                    }
                };

                updateUI();
                window.zyloslayerInterval = setInterval(combatTick, 1000); // 1 tick per second
            },
            destroy: () => {
                if (window.zyloslayerInterval) clearInterval(window.zyloslayerInterval);
                delete window.zyloSlayerBuy;
                delete window.zyloSlayerReset;
            }
        }
    };

    const app = apps[appName];
    if (!app) return;

    if (window.currentAppRef && window.currentAppRef.destroy) {
        window.currentAppRef.destroy();
    }

    window.currentAppRef = app;
    title.textContent = app.title;
    content.innerHTML = app.render();
    modal.classList.remove('hidden');

    if (app.init) {
        setTimeout(app.init, 0); // Allow DOM to repaint before init
    }

    feather.replace();
}

function closeAppModal() {
    if (window.currentAppRef && window.currentAppRef.destroy) {
        window.currentAppRef.destroy();
    }
    document.getElementById('appsModal').classList.add('hidden');
    currentApp = null;
    window.currentAppRef = null;
}

// Calculator functions
var calcValue = '0';
function calcPress(btn) {
    const display = document.getElementById('calcDisplay');
    if (btn === 'C') {
        calcValue = '0';
    } else if (btn === '=') {
        try { calcValue = String(eval(calcValue)); } catch { calcValue = 'Error'; }
    } else {
        if (calcValue === '0' && !btn.match(/[+\-*/]/)) calcValue = btn;
        else calcValue += btn;
    }
    display.value = calcValue;
}

// Speed test (simulated)
function runSpeedTest() {
    const result = document.getElementById('speedResult');
    result.textContent = '...';
    let i = 0;
    const interval = setInterval(() => {
        result.textContent = Math.floor(Math.random() * 100 + 50);
        i++;
        if (i > 20) {
            clearInterval(interval);
            result.textContent = Math.floor(Math.random() * 50 + 75);
        }
    }, 100);
}

// Notes functions
function saveNotes() {
    const notes = document.getElementById('quickNotes').value;
    localStorage.setItem('quickNotes', notes);
    alert('Notes saved!');
}

// Timer functions
var timerInterval = null;
var timerRemaining = 0;
function startTimer() {
    if (timerInterval) return;
    const mins = parseInt(document.getElementById('timerMinutes').value) || 0;
    const secs = parseInt(document.getElementById('timerSeconds').value) || 0;
    timerRemaining = mins * 60 + secs;
    timerInterval = setInterval(tickTimer, 1000);
}
function tickTimer() {
    if (timerRemaining <= 0) {
        stopTimer();
        alert('Timer finished!');
        return;
    }
    timerRemaining--;
    const m = String(Math.floor(timerRemaining / 60)).padStart(2, '0');
    const s = String(timerRemaining % 60).padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${m}:${s}`;
}
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}
function resetTimer() {
    stopTimer();
    document.getElementById('timerDisplay').textContent = '00:00';
    timerRemaining = 0;
}

// Color picker functions
function updateColorPreview() {
    const color = document.getElementById('colorInput').value;
    document.getElementById('colorPreview').style.backgroundColor = color;
    document.getElementById('colorHex').value = color;
}
function updateFromHex() {
    const hex = document.getElementById('colorHex').value;
    document.getElementById('colorInput').value = hex;
    document.getElementById('colorPreview').style.backgroundColor = hex;
}
function copyColor() {
    const hex = document.getElementById('colorHex').value;
    navigator.clipboard.writeText(hex).then(() => alert('Copied: ' + hex));
}

// Close app modal on click outside
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('appsModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'appsModal') closeAppModal();
    });
});
