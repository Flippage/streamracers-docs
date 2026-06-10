
const document = { getElementById: () => ({ addEventListener: () => {} }) };
const window = { require: require };

// --- ELECTRON MODULES ---
const fs = window.require('fs');
const path = window.require('path');
const os = window.require('os');

// --- FILE SYSTEM PATHS ---
const APP_DATA_PATH = path.join(process.platform === 'win32' ? process.env.APPDATA : os.homedir(), 'StreamRacers');
if (!fs.existsSync(APP_DATA_PATH)) fs.mkdirSync(APP_DATA_PATH, { recursive: true });

const PLAYER_DB_FILE = path.join(APP_DATA_PATH, 'player_data.json');
const CONFIG_FILE = path.join(APP_DATA_PATH, 'config.json');
const BETS_FILE = path.join(APP_DATA_PATH, 'active_bets.json');
const SPIN_QUEUE_FILE = path.join(APP_DATA_PATH, 'spin_queue.json');

// --- AUTO-INITIALIZE CONFIG (Commercial Grade Fix) ---
// This guarantees the file exists before the game even starts.
try {
    if (!fs.existsSync(CONFIG_FILE)) {
        console.log("⚙️ Creating fresh config file...");
        fs.writeFileSync(CONFIG_FILE, JSON.stringify({ channel: "", oauth: "" }, null, 2));
    }
    // We don't strictly need to create player_data.json here as DataManager handles that well,
    // but creating the folder structure effectively happens above.
} catch (e) {
    console.error("CRITICAL: Could not write config file!", e);
    document.body.innerHTML += `<div class="fixed top-0 bg-red-800 text-white p-4">DISK ERROR: ${e.message}</div>`;
}

window.onerror = function (msg, url, line) {
    const c = document.getElementById('consoleLog');
    if (c) c.innerHTML = `<div class="text-red-500 border-b border-red-900 pb-1 mb-1">> ERROR: ${msg}</div>` + c.innerHTML;
};

const CONFIG = {
    wsUrl: 'ws://10.0.10.8:8080/',
    maxPlayers: 20,
    minPlayers: 3,
    trackLength: 7000,
    baseSpeed: 0.6,
    statMultiplier: 0.12,
    evolutionChance: 0.005,
    maxStatLevel: 20,
    segmentLengthMin: 800,
    segmentLengthMax: 1200,
    avatars: ['🚗', '🛸', '👾', '🦊', '🐸', '🐼', '🦁', '🦄', '🐲', '🏎️', '🏍️', '🚲', '💀', '🤖', '🎃'],
    // NEW: Multiplier to tune the game speed feel after DT update
    globalSpeedScale: 2.0
};

const STATS = {
    RUN: { label: 'Run', icon: '🏃', color: '#4ade80' },
    SWIM: { label: 'Swim', icon: '🏊', color: '#3b82f6' },
    CLIMB: { label: 'Climb', icon: '🧗', color: '#a855f7' },
    JUMP: { label: 'Jump', icon: '🦘', color: '#facc15' },
    GLIDE: { label: 'Glide', icon: '🦅', color: '#f472b6' }
};

const ABILITIES = {
    'comeback_kid': { name: 'Comeback Kid', icon: '🚀', desc: 'Speed boost if behind!' },
    'steady_pacer': { name: 'Steady Pacer', icon: '🛡️', desc: 'Immune to bad days.' },
    'final_sprint': { name: 'Final Sprint', icon: '⚡', desc: 'Huge boost at the finish!' },
    'slow_starter': { name: 'Slow Starter', icon: '🐢', desc: 'Slow start, fast finish.' },
    'lucky_charm': { name: 'Lucky Charm', icon: '🍀', desc: 'Guaranteed item drop!' },
    'stumble_master': { name: 'Stumble Master', icon: '🤸', desc: 'Trips but runs faster!' },
    'late_bloomer': { name: 'Late Bloomer', icon: '🌺', desc: 'Slow start, huge finish!' },
    'underdog': { name: 'Underdog', icon: '🐶', desc: 'Bonus speed if 0 wins.' },
    'nitro_boost': { name: 'Nitro Boost', icon: '🧨', desc: 'Random massive speed burst.' },
    'copycat': { name: 'Copycat', icon: '👯', desc: 'Copies leader speed if behind.' }
};
const ABILITY_KEYS = Object.keys(ABILITIES);

// --- COMPLETE ITEM DATABASE (Updated with Rarities) ---
const ITEMS = {
    // --- COMMON (50% Chance) ---
    "boots_common": { name: "Climbing Boots", stat: "CLIMB", amount: 1, rarity: 'common', icon: "🥾" },
    "fins_common": { name: "Swim Fins", stat: "SWIM", amount: 1, rarity: 'common', icon: "🤿" },
    "shoes_common": { name: "Running Shoes", stat: "RUN", amount: 1, rarity: 'common', icon: "👟" },
    "glider_common": { name: "Glider Wings", stat: "GLIDE", amount: 1, rarity: 'common', icon: "🪁" },
    "springs_common": { name: "Jump Springs", stat: "JUMP", amount: 1, rarity: 'common', icon: "🔩" },

    // --- RARE (35% Chance) ---
    "boots_rare": { name: "Spiked Boots", stat: "CLIMB", amount: 2, rarity: 'rare', icon: "🧗" },
    "fins_rare": { name: "Shark Fin", stat: "SWIM", amount: 2, rarity: 'rare', icon: "🦈" },
    "shoes_rare": { name: "Turbo Sneakers", stat: "RUN", amount: 2, rarity: 'rare', icon: "⚡" },
    "glider_rare": { name: "Eagle Wings", stat: "GLIDE", amount: 2, rarity: 'rare', icon: "🦅" },
    "springs_rare": { name: "Pogo Stick", stat: "JUMP", amount: 2, rarity: 'rare', icon: "🦘" },

    // Hybrids (Classified as Rare)
    "duck_suit": { name: "Duck Suit", stat: "SWIM", amount: 1, stat2: "GLIDE", amount2: 1, rarity: 'rare', icon: "🦆" },
    "frog_legs": { name: "Frog Legs", stat: "SWIM", amount: 1, stat2: "JUMP", amount2: 1, rarity: 'rare', icon: "🐸" },
    "spider_gloves": { name: "Spider Gloves", stat: "CLIMB", amount: 1, stat2: "RUN", amount2: 1, rarity: 'rare', icon: "🕷️" },
    "moon_boots": { name: "Moon Boots", stat: "JUMP", amount: 1, stat2: "GLIDE", amount2: 1, rarity: 'rare', icon: "🌑" },
    "ninja_tabi": { name: "Ninja Tabi", stat: "RUN", amount: 1, stat2: "CLIMB", amount2: 1, rarity: 'rare', icon: "🥷" },
    "scuba_jet": { name: "Scuba Jet", stat: "SWIM", amount: 1, stat2: "GLIDE", amount2: 1, rarity: 'rare', icon: "🚤" },
    "monkey_tail": { name: "Monkey Tail", stat: "CLIMB", amount: 1, stat2: "JUMP", amount2: 1, rarity: 'rare', icon: "🐒" },
    "hoverboard": { name: "Hoverboard", stat: "RUN", amount: 1, stat2: "GLIDE", amount2: 1, rarity: 'rare', icon: "🛹" },
    "rocket_skates": { name: "Rocket Skates", stat: "RUN", amount: 1, stat2: "JUMP", amount2: 1, rarity: 'rare', icon: "🚀" },
    "pickaxe_para": { name: "Pickaxe Parachute", stat: "CLIMB", amount: 1, stat2: "GLIDE", amount2: 1, rarity: 'rare', icon: "🪂" },

    // Cursed (Classified as Rare due to risk/reward)
    "anchor_boots": { name: "Anchor Boots (Cursed)", stat: "CLIMB", amount: 2, stat2: "RUN", amount2: -1, rarity: 'rare', icon: "⚓" },
    "lead_belt": { name: "Lead Belt (Cursed)", stat: "SWIM", amount: 2, stat2: "JUMP", amount2: -1, rarity: 'rare', icon: "🏋️" },
    "rocket_pack": { name: "Unstable Rocket (Cursed)", stat: "GLIDE", amount: 2, stat2: "CLIMB", amount2: -1, rarity: 'rare', icon: "🧨" },
    "springy_pogo": { name: "Springy Pogo (Cursed)", stat: "JUMP", amount: 2, stat2: "GLIDE", amount2: -1, rarity: 'rare', icon: "😵" },
    "nitrous": { name: "Nitrous (Cursed)", stat: "RUN", amount: 2, stat2: "SWIM", amount2: -1, rarity: 'rare', icon: "🔥" },
    "plate_armor": { name: "Heavy Plate (Cursed)", stat: "CLIMB", amount: 2, stat2: "GLIDE", amount2: -1, rarity: 'rare', icon: "🛡️" },
    "hydro_thrust": { name: "Hydro Thrusters (Cursed)", stat: "SWIM", amount: 2, stat2: "RUN", amount2: -1, rarity: 'rare', icon: "🌊" },
    "heavy_cape": { name: "Heavy Cape (Cursed)", stat: "GLIDE", amount: 2, stat2: "JUMP", amount2: -1, rarity: 'rare', icon: "🧛" },
    "kang_shoes": { name: "Kang-Shoes (Cursed)", stat: "JUMP", amount: 2, stat2: "CLIMB", amount2: -1, rarity: 'rare', icon: "🥊" },
    "sonic_sneak": { name: "Sonic Sneakers (Cursed)", stat: "RUN", amount: 2, stat2: "GLIDE", amount2: -1, rarity: 'rare', icon: "🦔" },

    // --- EPIC (13% Chance) ---
    "boots_epic": { name: "Gravity Boots", stat: "CLIMB", amount: 3, rarity: 'epic', icon: "🌌" },
    "fins_epic": { name: "Poseidons Trident", stat: "SWIM", amount: 3, rarity: 'epic', icon: "🔱" },
    "shoes_epic": { name: "Sonic Boots", stat: "RUN", amount: 3, rarity: 'epic', icon: "💨" },
    "glider_epic": { name: "Jetpack", stat: "GLIDE", amount: 3, rarity: 'epic', icon: "🎒" },
    "springs_epic": { name: "Bionic Legs", stat: "JUMP", amount: 3, rarity: 'epic', icon: "🦾" },
    "trail_box": { name: "Trail Box", stat: "TRAIL_GIFT", amount: 1, isSpecial: true, rarity: 'epic', icon: "🎁" },

    // --- LEGENDARY (2% Chance) ---
    "boots_leg": { name: "Golden Boots", stat: "CLIMB", amount: 5, rarity: 'legendary', icon: "👑" },
    "fins_leg": { name: "Golden Fins", stat: "SWIM", amount: 5, rarity: 'legendary', icon: "👑" },
    "shoes_leg": { name: "Golden Shoes", stat: "RUN", amount: 5, rarity: 'legendary', icon: "👑" },
    "glider_leg": { name: "Golden Glider", stat: "GLIDE", amount: 5, rarity: 'legendary', icon: "👑" },
    "springs_leg": { name: "Golden Springs", stat: "JUMP", amount: 5, rarity: 'legendary', icon: "👑" },

    // Special (Classified as Legendary)
    "shield_item": { name: "Hazard Shield", stat: "SHIELD", amount: 1, isSpecial: true, rarity: 'legendary', icon: "🛡️" },
    "super_lemming": { name: "Super Lemming", stat: "ALL", amount: 1, isSpecial: true, rarity: 'legendary', icon: "🦸" },
    "thorns_item": { name: "Thorns", stat: "DEBUFF", amount: -1, isSpecial: true, isTargeted: true, rarity: 'legendary', icon: "🌵" }
};

// Aliases
const ITEM_ALIASES = {
    "boots": "boots_common", "climbing": "boots_common", "fins": "fins_common", "swim": "fins_common",
    "shoes": "shoes_common", "running": "shoes_common", "glider": "glider_common", "wings": "glider_common",
    "springs": "springs_common", "jump": "springs_common", "duck": "duck_suit", "frog": "frog_legs",
    "spider": "spider_gloves", "moon": "moon_boots", "ninja": "ninja_tabi", "scuba": "scuba_jet",
    "monkey": "monkey_tail", "hover": "hoverboard", "rocket": "rocket_skates", "pickaxe": "pickaxe_para",
    "shield": "shield_item", "lemming": "super_lemming", "thorns": "thorns_item", "super": "super_lemming"
};

// --- TRAIL DEFINITIONS (LEGENDARY UPGRADES) ---
const TRAILS = {
    // DEFAULT
    'default': { type: 'none', rarity: 'common' },

    // --- TIER 1: COMMON (20 Coins) ---
    'smoke': { name: "Smoke", color: "150, 150, 150", type: "ribbon", glow: 4, width: 14, len: 20, rarity: 'common' },
    'earth': { name: "Earth", color: "139, 69, 19", type: "ribbon", glow: 4, width: 14, len: 20, rarity: 'common' },
    'water': { name: "Water", color: "0, 191, 255", type: "ribbon", glow: 6, width: 14, len: 20, rarity: 'common' },
    'love': { name: "Love", color: "255, 105, 180", type: "ribbon", glow: 6, width: 14, len: 20, rarity: 'common' },
    'tech': { name: "Tech", color: "0, 255, 0", type: "ribbon", glow: 5, width: 14, len: 20, rarity: 'common' },
    'bubble': { name: "Bubblegum", color: "255, 192, 203", type: "ribbon", glow: 6, width: 14, len: 20, rarity: 'common' },

    // --- TIER 2: RARE (44 Coins) ---
    'toxic': { name: "Toxic", colors: ["0, 100, 0", "173, 255, 47"], type: "ribbon", glow: 10, width: 22, len: 35, rarity: 'rare' },
    'oceanic': { name: "Oceanic", colors: ["0, 0, 139", "0, 255, 255"], type: "ribbon", glow: 10, width: 22, len: 35, rarity: 'rare' },
    'plasma': { name: "Plasma", colors: ["75, 0, 130", "255, 0, 255"], type: "ribbon", glow: 12, width: 22, len: 35, rarity: 'rare' },
    'hotrod': { name: "Hot Rod", colors: ["255, 0, 0", "255, 165, 0"], type: "ribbon", glow: 12, width: 22, len: 35, rarity: 'rare' },
    'royalty': { name: "Royalty", colors: ["75, 0, 130", "218, 165, 32"], type: "ribbon", glow: 12, width: 22, len: 35, rarity: 'rare' },
    'voltage': { name: "High Voltage", colors: ["255, 215, 0", "30, 144, 255"], type: "ribbon", glow: 12, width: 22, len: 35, rarity: 'rare' },

    // --- TIER 3: EPIC (70 Coins) ---
    'frost': { name: "Permafrost", colors: ["0, 0, 139", "135, 206, 235", "255, 255, 255"], type: "ribbon", glow: 12, width: 24, len: 50, rarity: 'epic' },
    'sunset': { name: "Sunset Drive", colors: ["75, 0, 130", "255, 69, 0", "255, 165, 0"], type: "ribbon", glow: 12, width: 24, len: 50, rarity: 'epic' },
    'emerald': { name: "Emerald City", colors: ["0, 64, 0", "50, 205, 50", "255, 255, 255"], type: "ribbon", glow: 12, width: 24, len: 50, rarity: 'epic' },
    'void': { name: "The Void", colors: ["0, 0, 0", "20, 20, 20", "75, 0, 130"], type: "ribbon", glow: 10, width: 24, len: 50, rarity: 'epic' },
    'crimson': { name: "Crimson Guard", colors: ["50, 0, 0", "255, 51, 146", "255, 0, 0"], type: "ribbon", glow: 15, width: 24, len: 50, rarity: 'epic' },

    // --- TIER 4: LEGENDARY ---
    'absolute_zero': { name: "Absolute Zero", type: "ribbon", width: 28, len: 150, rarity: 'legendary', special: 'absolute_zero' },
    'inferno': {
        name: "Inferno",
        type: "ribbon", width: 28, len: 80, rarity: 'legendary',
        special: 'fire'
    },
    'matrix': { name: "The Matrix", type: "ribbon", width: 28, len: 150, rarity: 'legendary', special: 'matrix' },
    'rainbow': { name: "Rainbow Road", type: "ribbon", width: 28, len: 110, rarity: 'legendary', special: 'rainbow' },
    'nebula': { name: "Nebula", type: "ribbon", width: 30, len: 150, rarity: 'legendary', special: 'nebula' },
    // NEON (True Cyberpunk V-Grid)
    'neon': {
        name: "Neon Blue",
        type: "ribbon", width: 32, len: 120, rarity: 'legendary',
        special: 'neon'
    },
    // QUANTUM (Superposition Waves)
    'quantum': {
        name: "Quantum Realm",
        type: "ribbon", width: 28, len: 130, rarity: 'legendary',
        special: 'quantum'
    },
    'redacted': {
        name: "Redacted",
        type: "ribbon", width: 32, len: 140, rarity: 'legendary',
        special: 'redacted'
    },

    // --- NOVELTY (100 Coins - Bought Specifically) ---
    'notes': { name: "Music Notes", type: 'novelty', width: 20, rarity: 'novelty', special: 'notes', len: 300 },
    'poop': { name: "Poop", type: 'novelty', width: 20, rarity: 'novelty', special: 'poop', len: 300 },
    'real_bubbles': { name: "Soap Bubbles", type: 'novelty', width: 20, rarity: 'novelty', special: 'bubbles', len: 300 },
    'paws': { name: "Paw Prints", type: 'novelty', width: 20, rarity: 'novelty', special: 'paws', len: 300 },
    'cum': { name: "Cum", type: 'novelty', width: 20, rarity: 'novelty', special: 'cum', len: 180 },
    'tracks': { name: "Train Tracks", type: 'ribbon', width: 24, rarity: 'novelty', special: 'tracks', len: 200 },
    'scratch_marks': { name: "The Entity", type: 'novelty', width: 30, rarity: 'novelty', special: 'scratch_marks', len: 100 },
    'barbed_wire': { name: "Barbed Wire", type: 'novelty', width: 24, rarity: 'novelty', special: 'barbed_wire', len: 180 },
    'blood': { name: "Blood Trail", type: 'novelty', width: 20, rarity: 'novelty', special: 'blood', len: 180 },

    // --- SPECIAL ---
    'money': { name: "High Roller", type: 'novelty', width: 24, rarity: 'special', special: 'money', len: 200 },
    'glitch': {
        name: "ALPHA GLITCH",
        // Increased width for the glitch effect
        type: "ribbon", width: 30, len: 150,
        rarity: 'special',
        special: 'glitch' // <--- Enables new renderer
    }
};

// Add this to your existing CONFIG object or variable area
CONFIG.partyModeEnabled = false; // Default to OFF

// --- NEW TECH THEMED PARTY ITEMS ---
// --- NEW TECH THEMED PARTY ITEMS ---
const PARTY_ITEMS = [
    // OFFENSIVE
    { id: 'PING_SPIKE', name: 'Ping Spike', icon: '📡', type: 'attack_ahead', speed: 2.5, desc: 'Freezes target for 1.5s' },
    { id: 'DDOS', name: 'DDOS Attack', icon: '💀', type: 'global_leader', desc: 'Stuns leader for 3s' },
    { id: 'PACKET_LOSS', name: 'Packet Loss', icon: '📉', type: 'attack_ahead', desc: 'Rewinds target position' },

    // NEW: Reworked Virus (Targeted Attack)
    { id: 'VIRUS', name: 'Virus Upload', icon: '🦠', type: 'multi_target', desc: 'Slows random opponents' },

    // NEW: Position Swap
    { id: 'REMOTE_TRANSFER', name: 'Remote Transfer', icon: '🔄', type: 'swap', desc: 'Swap places with a leader!' },

    // TRAPS
    { id: 'SPAM_BOT', name: 'Spam Bot', icon: '📧', type: 'trap_behind', desc: 'Slows anyone who touches it' },
    { id: 'BSOD', name: 'B.S.O.D.', icon: '🟦', type: 'trap_behind', desc: 'Fatal Error (4s Stun)' },
    { id: 'ZIP_BOMB', name: 'Zip Bomb', icon: '📦', type: 'trap_behind', desc: 'Explosive Area Slow' },

    // DEFENSIVE / UTILITY (Buffed to 10 seconds / 600 frames)
    { id: 'FIREWALL', name: 'Firewall', icon: '🔥', type: 'self', effect: 'shield', duration: 600, desc: 'Blocks hits for 10s' },
    { id: 'VPN', name: 'VPN Tunnel', icon: '👻', type: 'self', effect: 'stealth', duration: 600, desc: 'Untargetable for 10s' },
    { id: 'OVERCLOCK', name: 'Overclock', icon: '⚡', type: 'self', effect: 'boost', duration: 150, desc: '150% Speed + Terrain Ignore' },

    // MOVEMENT
    { id: 'RAM', name: 'Download RAM', icon: '💾', type: 'self', effect: 'teleport', amount: 400, desc: 'Teleport forward' },
    { id: 'CACHE', name: 'Clear Cache', icon: '🔋', type: 'self', effect: 'boost', duration: 60, desc: 'Short Speed Boost' },

    // CHAOS
    { id: 'SYS_UPDATE', name: 'System Update', icon: '⏳', type: 'global_all', duration: 240, desc: 'Slows everyone else' }
];

const WHEEL_PRIZES = [
    // --- TIER 1: CURSED (15% Total - Red/Black) ---
    { label: "BROKEN LEG", type: 'buff', stat: 'RUN', val: -2, weight: 3, color: '#7f1d1d', rarity: 'cursed' },
    { label: "ANCHOR", type: 'buff', stat: 'SWIM', val: -2, weight: 3, color: '#7f1d1d', rarity: 'cursed' },
    { label: "VERTIGO", type: 'buff', stat: 'CLIMB', val: -2, weight: 3, color: '#7f1d1d', rarity: 'cursed' },
    { label: "HEAVY FEET", type: 'buff', stat: 'JUMP', val: -2, weight: 3, color: '#7f1d1d', rarity: 'cursed' },
    { label: "TORN WING", type: 'buff', stat: 'GLIDE', val: -2, weight: 3, color: '#7f1d1d', rarity: 'cursed' },

    // --- TIER 2: COMMON (42% Total - Grey) ---
    { label: "WARM UP", type: 'buff', stat: 'RUN', val: 1, weight: 7, color: '#334155', rarity: 'common' },
    { label: "HYDRATION", type: 'buff', stat: 'SWIM', val: 1, weight: 7, color: '#334155', rarity: 'common' },
    { label: "CHALK UP", type: 'buff', stat: 'CLIMB', val: 1, weight: 7, color: '#334155', rarity: 'common' },
    { label: "STRETCHED", type: 'buff', stat: 'JUMP', val: 1, weight: 7, color: '#334155', rarity: 'common' },
    { label: "WAXED WINGS", type: 'buff', stat: 'GLIDE', val: 1, weight: 7, color: '#334155', rarity: 'common' },
    { label: "POCKET CHANGE", type: 'coin', val: 20, weight: 7, color: '#334155', rarity: 'common' },

    // --- TIER 3: RARE (30% Total - Blue) ---
    { label: "COIN PURSE", type: 'coin', val: 40, weight: 10, color: '#2563eb', rarity: 'rare' },
    { label: "CROSS TRAINING", type: 'buff_split', val: 1, weight: 10, color: '#2563eb', rarity: 'rare' }, // +1 to TWO stats
    { label: "ITEM BOX", type: 'item', rarity: 'rare', weight: 10, color: '#2563eb', rarity: 'rare' },

    // --- TIER 4: EPIC (9% Total - Purple) ---
    { label: "TREASURE CHEST", type: 'coin', val: 60, weight: 3, color: '#9333ea', rarity: 'epic' },
    { label: "TRAIL BOX", type: 'item_specific', itemKey: 'trail_box', weight: 3, color: '#9333ea', rarity: 'epic' },
    { label: "EPIC ITEM", type: 'item', rarity: 'epic', weight: 3, color: '#9333ea', rarity: 'epic' },

    // --- TIER 5: LEGENDARY (4% Total - Gold) ---
    { label: "ADRENALINE", type: 'buff', stat: 'ALL', val: 1, weight: 2, color: '#facc15', rarity: 'legendary' },
    { label: "GOLDEN TICKET", type: 'item', rarity: 'legendary', weight: 2, color: '#facc15', rarity: 'legendary' }
];

/**
 * DataManager: STANDALONE VERSION (Uses File System)
 * Saves to %APPDATA%/StreamRacers/player_data.json
 */
class DataManager {
    constructor() {
        this.players = {};
        this.config = { channel: "", oauth: "" };

        // 1. Load Config Immediately
        this.loadConfig();

        // 2. Load Players
        // FIX: Assign the result of load() to this.players
        const loadedData = this.load();
        if (loadedData) {
            this.players = loadedData;
        }

        // 3. Run Data Integrity Fixes (Bandaid)
        // Restored: This ensures consistency if Season Stats > All Time Stats
        this.runBandaidFix();
    }

    loadConfig() {
        if (typeof fs === 'undefined') return;
        try {
            if (fs.existsSync(CONFIG_FILE)) {
                const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
                const data = JSON.parse(raw);
                // Merge to keep defaults if keys are missing
                this.config = { ...this.config, ...data };
                console.log("⚙️ Config loaded successfully.");
            }
        } catch (e) {
            console.error("❌ Failed to load config:", e);
        }
    }

    load() {
        // If running in browser/no-fs, return defaults
        if (typeof fs === 'undefined') {
            return {};
        }

        const filePath = PLAYER_DB_FILE;

        // --- HISTORICAL BACKUP SYSTEM (PRE-LOAD) ---
        try {
            if (fs.existsSync(filePath)) {
                const backupDir = path.join(APP_DATA_PATH, 'backups');
                if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

                const now = new Date();
                const timeStr = now.toISOString().replace(/T/, '_').replace(/:/g, '-').slice(0, 19);
                const ms = String(now.getMilliseconds()).padStart(3, '0');
                const backupName = `player_data_${timeStr}_${ms}.json`;
                const backupPath = path.join(backupDir, backupName);

                fs.copyFileSync(filePath, backupPath);
                console.log(`🗄️ Created startup backup: ${backupName}`);

                try {
                    const files = fs.readdirSync(backupDir);
                    if (files.length > 50) {
                        files.sort();
                        while (files.length > 50) {
                            const oldFile = files.shift();
                            fs.unlinkSync(path.join(backupDir, oldFile));
                        }
                    }
                } catch (pruneErr) { console.warn("Backup prune warning:", pruneErr); }
            }
        } catch (bkErr) {
            console.error("⚠️ Critical: Failed to create startup backup:", bkErr);
        }

        // 1. Try to load the main file
        try {
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(raw);

                if (data && typeof data === 'object') {
                    try { fs.copyFileSync(filePath, filePath + '.bak'); } catch (e) { }
                    return data;
                } else {
                    throw new Error("Invalid JSON structure");
                }
            }
        } catch (err) {
            console.error("❌ Main save file corrupted or unreadable:", err);
        }

        // 2. Main failed? Try to load the quick backup (.bak)
        console.warn("⚠️ Attempting to restore from quick backup (.bak)...");
        try {
            const bakPath = filePath + '.bak';
            if (fs.existsSync(bakPath)) {
                const rawBak = fs.readFileSync(bakPath, 'utf8');
                const dataBak = JSON.parse(rawBak);

                if (dataBak && typeof dataBak === 'object') {
                    console.log("✅ Quick backup restored successfully.");
                    this._saveAsync(filePath, dataBak);
                    return dataBak;
                }
            }
        } catch (errBak) {
            console.error("❌ Quick backup file also corrupted/missing:", errBak);
        }

        console.warn("⚠️ Starting with fresh data (Check /backups folder for history).");
        return {};
    }

    saveActiveBets(bets) {
        this._saveAsync(BETS_FILE, bets);
    }

    loadActiveBets() {
        if (typeof fs !== 'undefined' && fs.existsSync(BETS_FILE)) {
            try {
                return JSON.parse(fs.readFileSync(BETS_FILE, 'utf8'));
            } catch (e) {
                console.error("Error loading active bets:", e);
                try {
                    const backup = BETS_FILE + '.corrupted_' + Date.now();
                    fs.copyFileSync(BETS_FILE, backup);
                    console.warn(`Saved corrupted bets to ${backup}`);
                } catch (bkErr) { }
                return {};
            }
        }
        return {};
    }

    clearActiveBets() {
        if (typeof fs !== 'undefined') {
            fs.unlink(BETS_FILE, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error("❌ Error clearing active bets file:", err);
                }
            });
        }
    }

    saveSpinQueue(queue) {
        this._saveAsync(SPIN_QUEUE_FILE, queue);
    }

    loadSpinQueue() {
        if (typeof fs !== 'undefined' && fs.existsSync(SPIN_QUEUE_FILE)) {
            try {
                return JSON.parse(fs.readFileSync(SPIN_QUEUE_FILE, 'utf8'));
            } catch (e) {
                console.error("Error loading spin queue:", e);
                return [];
            }
        }
        return [];
    }

    runBandaidFix() {
        let changed = false;
        const keys = Object.keys(this.players); // Get keys array to safely mutate object during loop

        // 1. MIGRATION SWEEP (Legacy Key -> ID Key)
        // If a record is stored under "username" but HAS an ID, move it to "ID" key.
        keys.forEach(key => {
            const p = this.players[key];
            if (p && p.id && key !== p.id) {
                console.log(`📦 Startup Migration: Moving ${p.name} from key [${key}] to ID [${p.id}]`);
                this.players[p.id] = p;
                delete this.players[key];
                changed = true;
            }
        });

        // 2. STAT CONSISTENCY CHECK
        // Refresh keys in case migration changed them
        for (let key in this.players) {
            const p = this.players[key];
            if (!p.season) continue;

            // Updated Stat Pairs to include Elimination Stats
            const statPairs = [
                ['wins', 'wins'], ['wins2', 'wins2'], ['wins3', 'wins3'], ['totalRaces', 'totalRaces'],
                ['tWins', 'tWins'], ['tWins2', 'tWins2'], ['tWins3', 'tWins3'], ['tTotalRaces', 'tTotalRaces'],
                ['rWins', 'rWins'], ['rWins2', 'rWins2'], ['rWins3', 'rWins3'], ['rTotalRaces', 'rTotalRaces'],
                ['eWins', 'eWins'], ['eTotalRaces', 'eTotalRaces']
            ];

            statPairs.forEach(([allKey, seasonKey]) => {
                const aVal = p[allKey] || 0;
                const sVal = p.season[seasonKey] || 0;

                if (aVal < sVal) {
                    p[allKey] = sVal;
                    changed = true;
                }
            });
        }

        if (changed) {
            console.log("🩹 Applied Data Fixes (Migration & Stat Consistency)");
            this.save();
        }
    }

    save() {
        this._saveAsync(PLAYER_DB_FILE, this.players);
    }

    saveConfig() {
        this._saveAsync(CONFIG_FILE, this.config);
    }

    _saveAsync(filePath, dataObj) {
        if (typeof fs === 'undefined') return;

        if (!this._writeLocks) this._writeLocks = {};
        if (!this._pendingWrites) this._pendingWrites = {};
        if (!this._writeTimers) this._writeTimers = {};

        this._pendingWrites[filePath] = dataObj;

        if (this._writeLocks[filePath]) return;
        if (this._writeTimers[filePath]) return;

        this._writeTimers[filePath] = setTimeout(() => {
            delete this._writeTimers[filePath];
            this._executeAtomicWrite(filePath);
        }, 50);
    }

    _executeAtomicWrite(filePath) {
        if (this._writeLocks[filePath]) return;

        const dataObj = this._pendingWrites[filePath];
        if (!dataObj) return;

        this._writeLocks[filePath] = true;
        delete this._pendingWrites[filePath];

        const tempPath = filePath + '.tmp';
        let jsonStr;
        try {
            jsonStr = JSON.stringify(dataObj, null, 2);
        } catch (e) {
            console.error("JSON Stringify Error:", e);
            this._writeLocks[filePath] = false;
            return;
        }

        fs.writeFile(tempPath, jsonStr, 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(`❌ Error writing temp file ${path.basename(tempPath)}:`, writeErr);
                this._writeLocks[filePath] = false;
                if (!this._pendingWrites[filePath]) this._pendingWrites[filePath] = dataObj;
                return;
            }

            fs.rename(tempPath, filePath, (renameErr) => {
                this._writeLocks[filePath] = false;

                if (renameErr) {
                    console.error(`❌ Error renaming ${path.basename(tempPath)} to target:`, renameErr);
                    if (!this._pendingWrites[filePath]) this._pendingWrites[filePath] = dataObj;
                }

                if (this._pendingWrites[filePath]) {
                    this._saveAsync(filePath, this._pendingWrites[filePath]);
                }
            });
        });
    }

    // Updated: Supports ID lookup with fallback to Name lookup
    getUser(username, userId = null) {
        // 1. Try Lookup by ID (Fastest & Accurate)
        if (userId && this.players[userId]) {
            return this.players[userId];
        }

        const lowerName = username.toLowerCase();

        // 2. Try Lookup by Username Key (Legacy Data)
        if (this.players[lowerName]) {
            return this.players[lowerName];
        }

        // 3. Try Lookup by Value (Migrated Data but looking up by Name)
        // This converts the DB object to an array to find the name.
        // Necessary for commands like !racestats @OtherUser where we don't know the ID.
        const found = Object.values(this.players).find(p => p.name.toLowerCase() === lowerName);
        if (found) return found;

        return null;
    }

    // Updated: Handles ID Migration and Name Changes
    getOrCreateUser(username, userId = null) {
        const lowerName = username.toLowerCase();
        const effectiveId = userId || lowerName; // Use Name as ID if ID is missing (Legacy Mode)

        // 1. Check if exists by key (ID or Legacy Name)
        if (this.players[effectiveId]) {
            const p = this.players[effectiveId];
            // Update name if changed (e.g. User changed Twitch Name)
            if (p.name !== username) {
                console.log(`📝 Name change detected for ID ${effectiveId}: ${p.name} -> ${username}`);
                p.name = username;
                this.save();
            }
            return { user: p, isNew: false };
        }

        // 2. Check Legacy (Migration)
        // If we have a real ID, but the user is stored under their OLD username key
        if (userId && this.players[lowerName]) {
            console.log(`📦 Migrating legacy data for ${username} to ID: ${userId}`);
            const data = this.players[lowerName];

            // Move data to ID key
            this.players[userId] = data;
            delete this.players[lowerName];

            // Ensure ID is set and name is current
            data.id = userId;
            data.name = username;

            this.save();
            return { user: data, isNew: false };
        }

        // 2.5. Reverse Lookup (If ID is missing, try to find migrated user by Name)
        if (!userId) {
            const existingUser = Object.values(this.players).find(p => p.name.toLowerCase() === lowerName);
            if (existingUser) {
                return { user: existingUser, isNew: false };
            }
        }

        // 3. Create New
        // If we are here, neither ID nor Legacy Name existed
        if (!this.players[effectiveId]) {
            const stratRoll = Math.random();
            const newClass = (stratRoll < 0.33) ? "specialist" : ((stratRoll < 0.66) ? "dualist" : "balanced");

            this.players[effectiveId] = {
                id: userId || null,
                name: username,
                stats: GameLogic.generateStats(newClass),
                class: newClass,
                inventory: {},
                gpInventory: {},
                coins: 0,
                unlockedTrails: ['default'],
                activeTrail: 'default',
                buffs: {},
                wins: 0, wins2: 0, wins3: 0,
                tWins: 0, tWins2: 0, tWins3: 0,
                rWins: 0, rWins2: 0, rWins3: 0,
                eWins: 0, eTotalRaces: 0,
                gpWins: 0, gpTotalSeries: 0,
                totalRaces: 0,
                tTotalRaces: 0,
                rTotalRaces: 0,
                season: {
                    wins: 0, wins2: 0, wins3: 0,
                    tWins: 0, tWins2: 0, tWins3: 0,
                    rWins: 0, rWins2: 0, rWins3: 0,
                    eWins: 0, eTotalRaces: 0,
                    gpWins: 0, gpTotalSeries: 0,
                    totalRaces: 0,
                    tTotalRaces: 0,
                    rTotalRaces: 0
                },
                lastResult: null,
                icon: null,
                lastVariance: 0,
                // NEW: Chance Wheel Data
                chanceTickets: 0,
                nextRaceBuffs: [],   // Queue of stat buffs from wheel spins (applied 1 per race)
                nextRaceDebuffs: [] // Queue of stat debuffs (curses) from wheel spins (applied 1 per race)
            };
            this.save();
            return { user: this.players[effectiveId], isNew: true };
        }

        // Backfill Fallback (Should be covered by step 1, but safe to keep)
        return { user: this.players[effectiveId], isNew: false };
    }

    updateInventory(username, itemKey, amount, userId = null) {
        const result = this.getOrCreateUser(username, userId);
        const user = result.user;
        if (!user.inventory) user.inventory = {};
        user.inventory[itemKey] = (user.inventory[itemKey] || 0) + amount;
        if (user.inventory[itemKey] <= 0) delete user.inventory[itemKey];
        this.save();
    }
}

/**
 * GameLogic: Ported C# Math for Stats & Variance
 */
class GameLogic {
    static generateStats(strategy) {
        // Base fractional point helps prevent landing exactly on flat x.00 values
        let s = { "RUN": 1.03, "SWIM": 1.03, "CLIMB": 1.03, "JUMP": 1.03, "GLIDE": 1.03 };
        const keys = Object.keys(s);
        const fav1 = keys[Math.floor(Math.random() * keys.length)];
        let fav2 = keys[Math.floor(Math.random() * keys.length)];
        while (fav2 === fav1) fav2 = keys[Math.floor(Math.random() * keys.length)];

        // Distribute points 
        if (strategy === "unstable") {
            for (let i = 0; i < 20; i++) {
                // Heavy variance, chaotic spread across all stats
                const target = keys[Math.floor(Math.random() * keys.length)];
                s[target] += (Math.random() * 2.5); // Much larger spikes
            }
        } else {
            for (let i = 0; i < 20; i++) {
                let target;
                if (strategy === "specialist") target = (Math.random() < 0.65) ? fav1 : keys[Math.floor(Math.random() * keys.length)];
                else if (strategy === "dualist") target = (Math.random() < 0.70) ? ((Math.random() < 0.5) ? fav1 : fav2) : keys[Math.floor(Math.random() * keys.length)];
                else target = keys[Math.floor(Math.random() * keys.length)]; // Balanced

                s[target] += Math.random() + (Math.random() * 0.1); // Add some micro-noise
            }
        }

        // Normalize to exactly 15.00
        let sum = Object.values(s).reduce((a, b) => a + b, 0);
        keys.forEach(k => s[k] = (s[k] / sum) * 15.0);

        // --- IMPROVED CLAMPING LOGIC ---
        for (let pass = 0; pass < 10; pass++) {
            let spill = 0;
            for (let k of keys) {
                if (s[k] > 9.0) { spill += (s[k] - 9.0); s[k] = 9.0; }
                if (s[k] < 1.0) { spill += (s[k] - 1.0); s[k] = 1.0; }
            }
            if (Math.abs(spill) < 0.001) break;

            let valid = [];
            if (spill > 0) valid = keys.filter(k => s[k] < 9.0);
            else valid = keys.filter(k => s[k] > 1.0);

            if (valid.length === 0) break;
            valid.forEach(k => s[k] += spill / valid.length);
        }

        // --- ANTI-BIAS SHUFFLE AND ROUNDING ---
        let shuffledKeys = [...keys];
        for (let i = shuffledKeys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledKeys[i], shuffledKeys[j]] = [shuffledKeys[j], shuffledKeys[i]];
        }

        sum = 0;
        for (let i = 0; i < 4; i++) {
            s[shuffledKeys[i]] = parseFloat(s[shuffledKeys[i]].toFixed(2));
            sum += s[shuffledKeys[i]];
        }

        // Final dump stat receives the exact remainder to perfectly hit 15.00
        s[shuffledKeys[4]] = parseFloat((15.0 - sum).toFixed(2));

        // Safety clamp for the dump stat in case rounding pushed it under 1.0
        if (s[shuffledKeys[4]] < 1.0) {
            const diff = 1.0 - s[shuffledKeys[4]];
            s[shuffledKeys[4]] = 1.0;
            const donor = shuffledKeys.find(k => s[k] > (1.0 + diff));
            if (donor) s[donor] = parseFloat((s[donor] - diff).toFixed(2));
        }

        return s;
    }

    // --- UPDATED VARIANCE LOGIC (With Flavor Text) ---
    static applyVariance(user) {
        if (!user.buffs) user.buffs = {};
        // If already rolled this session, skip
        if (user.buffs._varianceRolled) return null;

        // Mark as rolled
        user.buffs._varianceRolled = 1;

        const roll = Math.random();

        // 5% Bad Chance, 20% Good Chance (Total 25%)
        // If roll > 0.25, no variance happens.
        if (roll >= 0.25) return null;

        const keys = ["RUN", "SWIM", "CLIMB", "JUMP", "GLIDE"];
        const target = keys[Math.floor(Math.random() * keys.length)];

        const isBad = (roll < 0.05);
        const val = isBad ? -1 : 1;
        const sign = isBad ? "" : "+"; // - is automatic for negative numbers

        // Icons
        const icons = { RUN: "🏃", SWIM: "🏊", CLIMB: "🧗", JUMP: "🦘", GLIDE: "🦅" };
        const icon = icons[target];

        // FLAVOR TEXT DATABASE
        const flavor = {
            RUN: {
                good: "is feeling energetic!",
                bad: "has a leg cramp!"
            },
            SWIM: {
                good: "is swimming with the current!",
                bad: "swallowed some water!"
            },
            CLIMB: {
                good: "chalked up their hands!",
                bad: "has slippery fingers!"
            },
            JUMP: {
                good: "is feeling bouncy!",
                bad: "has weak knees today!"
            },
            GLIDE: {
                good: "caught a strong updraft!",
                bad: "has a hole in their wing!"
            }
        };

        const msgText = isBad ? flavor[target].bad : flavor[target].good;

        // Result: "caught a strong updraft! (+1 🦅)"
        const fullMsg = `${msgText} (${sign}${val} ${icon})`;

        return { stat: target, val: val, msg: fullMsg };
    }
}

class TwitchManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.db = new DataManager();
        this.socket = null;
        this.channel = this.db.config.channel || "";
        this.token = this.db.config.oauth || "";

        // Moderator List
        this.mods = ["streamelements", "nightbot"];

        this.reconnectTimer = null;
        this.isConnecting = false;
        this.intentionalDisconnect = false;

        // --- MESSAGE QUEUE SYSTEM ---
        this.messageQueue = [];
        this.isProcessingQueue = false;
        // ----------------------------

        // (Join batch system removed - notifications now fire immediately)

        this.statusEl = document.getElementById('connectionStatus');
        this.updateStatusUI("OFFLINE");

        // AUTO-CONNECT FIX: If credentials exist, connect automatically after a brief delay
        if (this.channel && this.token) {
            console.log("🔄 Auto-connecting to Twitch...");
            setTimeout(() => this.connect(), 500);
        }
    }

    // --- HELPER: Generate Stat String (e.g. "🏃+1") ---
    getItemStatsStr(key) {
        // Support both key string or item object
        let item = key;
        if (typeof key === 'string') {
            if (typeof ITEMS === 'undefined' || !ITEMS[key]) return "";
            item = ITEMS[key];
        }
        if (!item) return "";

        // Special Items Visuals
        if (item.stat === 'TRAIL_GIFT') return " (🎁 Trail Box)";

        const icons = { RUN: "🏃", SWIM: "🏊", CLIMB: "🧗", JUMP: "🦘", GLIDE: "🦅", SHIELD: "🛡️", ALL: "🦸", THORNS: "🌵", DEBUFF: "💢" };

        let parts = [];

        // Primary Stat
        if (item.stat) {
            if (item.stat === "ALL") return "(🦸 All +1)";
            if (item.stat === "SHIELD") return "(🛡️ Shield)";
            if (item.stat === "THORNS") return "(🌵 Thorns)";

            const icon = icons[item.stat] || item.stat;
            const val = item.amount > 0 ? `+${item.amount}` : `${item.amount}`;
            parts.push(`${icon}${val}`);
        }

        // Secondary Stat
        if (item.stat2) {
            const icon2 = icons[item.stat2] || item.stat2;
            const val2 = item.amount2 > 0 ? `+${item.amount2}` : `${item.amount2}`;
            parts.push(`${icon2}${val2}`);
        }

        if (parts.length === 0) return "";
        return `(${parts.join(' ')})`;
    }

    // --- HELPER: Fuzzy Item Search ---
    findItemKey(rawQuery) {
        if (!rawQuery) return null;
        const query = rawQuery.toLowerCase().trim();

        // 1. Exact Key Match (e.g. "boots_common")
        if (ITEMS[query]) return query;

        // 2. Alias Match (e.g. "running" -> "shoes_common")
        if (ITEM_ALIASES[query]) return ITEM_ALIASES[query];

        // 3. Normalization Helper (remove spaces, dashes, underscores)
        // This allows "Kang Shoes" to match "kang-shoes" or "kang_shoes"
        const normalize = (str) => str.replace(/[\s\-_]/g, '').toLowerCase();
        const cleanQuery = normalize(query);

        // 4. Fuzzy Search through ITEMS
        const keys = Object.keys(ITEMS);

        // A. Exact Normalized Name Match (High Priority)
        let match = keys.find(k => normalize(ITEMS[k].name) === cleanQuery);
        if (match) return match;

        // B. Name Contains (Medium Priority) - e.g. "Kang" finds "Kang-Shoes"
        match = keys.find(k => normalize(ITEMS[k].name).includes(cleanQuery));
        if (match) return match;

        // C. Key Contains (Low Priority)
        match = keys.find(k => normalize(k).includes(cleanQuery));

        return match || null;
    }

    updateStatusUI(state, customText) {
        // 1. Handle In-Game Header Button (Compact)
        if (this.statusEl) {
            if (state === "CONNECTED") {
                const name = customText ? customText.split(' ')[0] : this.channel.toUpperCase();
                this.statusEl.innerText = `ONLINE: ${name}`;
                this.statusEl.className = "text-[14px] px-2 py-0.5 rounded bg-green-900/30 text-green-400 font-mono border border-green-900/50 font-bold uppercase tracking-wide cursor-default";
                this.statusEl.disabled = true;
            } else if (state === "CONNECTING") {
                this.statusEl.innerText = "CONNECTING...";
                this.statusEl.className = "text-[14px] px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-400 font-mono border border-yellow-900/50 font-bold uppercase tracking-wide animate-pulse cursor-wait";
                this.statusEl.disabled = true;
            } else {
                this.statusEl.innerText = "OFFLINE";
                this.statusEl.className = "text-[14px] px-2 py-0.5 rounded bg-red-900/30 text-red-400 font-mono border border-red-900/50 hover:bg-red-900/50 transition cursor-pointer font-bold uppercase tracking-wide";
                this.statusEl.disabled = false;
            }
        }

        // 2. Handle Main Menu Status Pill (Detailed)
        const menuPill = document.getElementById('menuConnectionStatus');
        if (menuPill) {
            if (state === "CONNECTED") {
                const name = customText ? customText.split(' ')[0] : this.channel.toUpperCase();
                menuPill.innerHTML = `<span class="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></span> CONNECTED: ${name}`;
                menuPill.className = "absolute top-8 right-8 flex items-center gap-3 px-5 py-2 rounded-full border border-green-500/30 bg-black/80 backdrop-blur-md text-green-400 font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(74,222,128,0.1)] cursor-default select-none z-[101]";
                menuPill.onclick = null;
            } else if (state === "CONNECTING") {
                menuPill.innerHTML = `<span class="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span> CONNECTING...`;
                menuPill.className = "absolute top-8 right-8 flex items-center gap-3 px-5 py-2 rounded-full border border-yellow-500/30 bg-black/80 backdrop-blur-md text-yellow-400 font-mono text-xs font-bold uppercase tracking-widest cursor-wait select-none z-[101]";
                menuPill.onclick = null;
            } else {
                menuPill.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> OFFLINE`;
                menuPill.className = "absolute top-8 right-8 flex items-center gap-3 px-5 py-2 rounded-full border border-red-500/30 bg-black/60 backdrop-blur-md text-red-400 font-mono text-xs font-bold uppercase tracking-widest transition-all hover:bg-red-900/20 hover:text-red-300 hover:border-red-500 cursor-pointer shadow-lg select-none z-[101]";
                menuPill.onclick = () => this.connect();
            }
        }
    }

    disconnect() {
        console.log("🔌 Manual Disconnect Triggered.");
        this.intentionalDisconnect = true;
        clearTimeout(this.reconnectTimer);
        if (this.socket) {
            this.socket.onclose = null;
            this.socket.close();
            this.socket = null;
        }
        this.updateStatusUI("OFFLINE");
    }

    connect() {
        if (this.isConnecting) return;

        if (this.socket) {
            this.socket.onclose = null;
            this.socket.close();
        }

        const targetChannel = this.db.config.channel;
        let identityName = this.db.config.channel;
        let identityToken = this.db.config.oauth;

        if (this.db.config.bot_oauth && this.db.config.bot_channel) {
            identityName = this.db.config.bot_channel;
            identityToken = this.db.config.bot_oauth;
            console.log(`🤖 BOT MODE: connecting as ${identityName}`);
        }

        if (!targetChannel || !identityToken || !identityToken.startsWith("oauth:")) {
            console.log("❌ Twitch Connect Skipped: Missing Credentials.");
            this.updateStatusUI("OFFLINE");
            return;
        }

        this.channel = targetChannel;
        this.intentionalDisconnect = false;
        this.isConnecting = true;
        this.updateStatusUI("CONNECTING");

        console.log(`🔌 Connecting to Twitch IRC: #${targetChannel} (as ${identityName})`);
        this.socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

        this.socket.onopen = () => {
            console.log("✅ WebSocket Open.");
            this.socket.send(`PASS ${identityToken}`);
            this.socket.send(`NICK ${identityName.toLowerCase()}`);
            this.socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
            this.socket.send(`JOIN #${targetChannel.toLowerCase()}`);

            this.isConnecting = false;
            const connectedAs = (identityName === targetChannel) ? targetChannel.toUpperCase() : `${identityName.toUpperCase()} (BOT)`;
            this.updateStatusUI("CONNECTED", connectedAs);
        };

        this.socket.onmessage = (event) => {
            const data = event.data.trim();

            if (data.includes("Login authentication failed")) {
                console.error("🚨 CRITICAL: Twitch Auth Failed (Bad Token)");
                this.socket.onclose = null;
                this.socket.close();
                this.isConnecting = false;
                this.updateStatusUI("OFFLINE");

                if (this.game.showFloatingText) this.game.showFloatingText("AUTH FAILED: RECONNECT ACCOUNT", "#ef4444", "❌");

                if (identityName === this.db.config.bot_channel) {
                    this.db.config.bot_oauth = "";
                } else {
                    this.db.config.oauth = "";
                }
                this.db.saveConfig();
                return;
            }

            if (data.startsWith('PING')) {
                this.socket.send('PONG :tmi.twitch.tv');
                return;
            }
            this.parseRawMessage(data);
        };

        this.socket.onclose = () => {
            console.warn("⚠️ Twitch Disconnected.");
            this.isConnecting = false;
            this.updateStatusUI("OFFLINE");

            if (!this.intentionalDisconnect) {
                console.log("🔄 Reconnecting in 5s...");
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = setTimeout(() => this.connect(), 5000);
            }
        };

        this.socket.onerror = (err) => {
            console.error("Twitch Socket Error:", err);
            this.isConnecting = false;
            this.updateStatusUI("OFFLINE");
        };
    }

    say(channel, message) {
        this.messageQueue.push({ channel, message });
        this.processQueue();
    }

    processQueue() {
        if (this.isProcessingQueue || this.messageQueue.length === 0) return;

        this.isProcessingQueue = true;
        const item = this.messageQueue.shift();

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(`PRIVMSG #${item.channel} :${item.message}`);
        }

        // 1.5s throttle to respect non-verified rate limits
        setTimeout(() => {
            this.isProcessingQueue = false;
            this.processQueue();
        }, 1500);
    }

    announce(msg) {
        console.log(`📢 ${msg}`);
        if (this.channel) this.say(this.channel, msg);
    }

    getTwitchEmoteUrl(tags) {
        if (tags && tags.emotes) {
            const firstEmoteId = tags.emotes.split('/')[0].split(':')[0];
            if (firstEmoteId) { return `https://static-cdn.jtvnw.net/emoticons/v2/${firstEmoteId}/default/dark/3.0`; }
        }
        return null;
    }

    parseRawMessage(raw) {
        const lines = raw.split('\r\n');
        lines.forEach(line => {
            let tags = {};
            const parts = line.split(' ');
            if (parts[0].startsWith('@')) {
                const tagStr = parts.shift().substring(1);
                tagStr.split(';').forEach(t => { const [k, v] = t.split('='); tags[k] = v; });
            }
            if (line.includes("USERSTATE") && tags['room-id']) { this.tryFetch7TV(tags['room-id']); }
            else if (line.includes("GLOBALUSERSTATE") && tags['user-id']) { this.tryFetch7TV(tags['user-id']); }
            else if (line.includes("PRIVMSG")) {
                const prefix = parts[0];
                const username = prefix.split('!')[0].substring(1).toLowerCase();
                if (username === this.channel.toLowerCase() && tags['user-id']) { this.tryFetch7TV(tags['user-id']); }
            }
            if (line.includes('PRIVMSG')) {
                const prefix = parts.shift();
                const username = prefix.split('!')[0].substring(1);
                parts.shift(); parts.shift();
                let msg = parts.join(' ');
                if (msg.startsWith(':')) msg = msg.substring(1);
                // Clean up 7TV/Twitch invisible padding characters (including CGJ)
                msg = msg.replace(/[\u3164\u2800\u200B-\u200D\uFEFF\u034F]/g, '').trim();
                this.handleMessage({
                    'display-name': tags['display-name'] || username,
                    username: username,
                    color: tags['color'] || '#ffffff',
                    badges: this.parseBadges(tags['badges']),
                    'user-id': tags['user-id'], // EXTRACT USER ID
                    emotes: tags['emotes']
                }, msg, tags);
            }
        });
    }

    tryFetch7TV(id) {
        if (this.game.fetchSevenTV && !this.game.sevenTVLoaded && id) {
            this.game.fetchSevenTV(id);
        }
    }

    parseBadges(badgeStr) {
        if (!badgeStr) return {};
        const res = {};
        badgeStr.split(',').forEach(b => { const [k, v] = b.split('/'); res[k] = v; });
        return res;
    }

    queueJoinMessage(username) {
        // Remove batching logic: Immediately trigger the visual notification
        if (this.game && this.game.showJoinNotification) {
            this.game.showJoinNotification(username);
        } else {
            // Fallback to chat if game UI isn't ready
            this.say(this.channel, `@${username} joined the race! 🏁`);
        }
    }

    flushJoinBatch() {
        // Deprecated: No longer used as batching is removed.
        // Keeping empty method to prevent errors if called by stray timeouts.
        this.joinBatch = [];
        this.joinBatchTimer = null;
    }

    handleMessage(tags, message, rawTags) {
        // Remove invisible characters specifically added by extensions like 7TV
        // \u3164 = Hangul Filler, \u2800 = Braille Blank, \u034F = CGJ (the specific '͏' character), \u200B-\u200D = Zero Width
        const cleanMessage = message.replace(/[\u3164\u2800\u034F\u200B\u200C\u200D\uFEFF]/g, '');
        const msg = cleanMessage.trim();

        if (!msg.startsWith('!')) return;

        const args = msg.split(/\s+/);
        const command = args[0].toLowerCase();
        const username = tags['display-name'];
        const userKey = tags.username.toLowerCase();
        const userId = tags['user-id']; // GET ID
        const isMod = (tags.badges && (tags.badges.broadcaster || tags.badges.moderator)) || this.mods.includes(userKey);

        // --- JOIN ---
        if (['!racejoin', '!joinrace', '!rj', '!jr', '!race'].includes(command)) {
            // NEW: Block joining if Gauntlet Series is in progress
            if (this.game.isGrandPrix && this.game.gpSeriesActive) {
                this.say(this.channel, `@${username}, a Gauntlet Series is currently in progress! You cannot join until the series ends. 🏆`);
                return;
            }

            // 1. Validate: Must be in Open Lobby
            if (this.game.state !== 'LOBBY' || !this.game.isOpen) {
                this.say(this.channel, `@${username}, the race isn't ready yet! Wait for the lobby to open before trying to join 🛑`);
                return;
            }

            // 2. Validate: Already in lobby?
            if (this.game.players.some(p => p.name.toLowerCase() === userKey)) {
                this.say(this.channel, `@${username}, you are already in the race! Get ready to run 🏎️`);
                return;
            }

            // 3. Validate: Lobby Full?
            if (this.game.players.length >= CONFIG.maxPlayers) {
                this.say(this.channel, `@${username}, the lobby is currently full! You'll have to wait for the next race 🚫`);
                return;
            }

            // Pass ID to getOrCreateUser to enable migration
            const { user } = this.db.getOrCreateUser(username, userId);
            const alreadyRolled = user.buffs && user.buffs._varianceRolled;

            // Unstable Reroll
            if (user.class === 'unstable' && !alreadyRolled) {
                user.stats = GameLogic.generateStats('unstable');
                this.db.save();
            }

            // Variance
            const variance = GameLogic.applyVariance(user);
            if (variance) {
                if (!user.buffs) user.buffs = {};
                user.buffs[variance.stat] = (user.buffs[variance.stat] || 0) + variance.val;
                this.db.save();
                this.say(this.channel, `@${username} ${variance.msg}`);
            }

            // Note: Removed queueJoinMessage() here because addPlayer() now triggers 
            // the visual showJoinNotification() automatically.

            // Add to Game
            this.game.addPlayer({
                name: user.name, avatar: user.icon, stats: user.stats,
                tempBuffs: user.buffs || {}, inventory: user.inventory || {},
                wins: user.wins || 0, wins2: user.wins2 || 0, wins3: user.wins3 || 0,
                totalRaces: user.totalRaces || 0,
                tWins: user.tWins || 0, tWins2: user.tWins2 || 0, tWins3: user.tWins3 || 0,
                tTotalRaces: user.tTotalRaces || 0,
                rWins: user.rWins || 0, rWins2: user.rWins2 || 0, rWins3: user.rWins3 || 0,
                rTotalRaces: user.rTotalRaces || 0,
                // NEW: Elimination Stats
                eWins: user.eWins || 0, eTotalRaces: user.eTotalRaces || 0,
                color: tags.color,
                id: userId // Pass ID
            });
        }

        // --- LEAVE ---
        if (['!raceleave', '!leaverace', '!rl', '!lr'].includes(command)) {
            if (this.game.state === 'LOBBY') this.game.removePlayer(username);
        }

        // --- STATS (UPDATED) ---
        if (['!racestats', '!racerstats'].includes(command)) {
            let targetName = args[1] ? args[1].replace('@', '') : username;

            // Smart Lookup: Try ID first if self, else Name
            let targetUser = null;
            if (targetName.toLowerCase() === username.toLowerCase()) {
                targetUser = this.db.getUser(username, userId);
            } else {
                targetUser = this.db.getUser(targetName);
            }

            if (!targetUser) { this.say(this.channel, `@${targetName} has not raced!`); return; }

            const s = targetUser.stats || { RUN: 0, SWIM: 0, CLIMB: 0, JUMP: 0, GLIDE: 0 };
            const getRate = (w, t) => (t > 0) ? ((w / t) * 100).toFixed(1) + '%' : '0.0%';

            const msg = `📊 @${targetUser.name} | ` +
                `Solo: 🥇${targetUser.wins || 0}/${targetUser.totalRaces || 0} (${getRate(targetUser.wins || 0, targetUser.totalRaces || 0)}) | ` +
                `Team: 🥇${targetUser.tWins || 0}/${targetUser.tTotalRaces || 0} (${getRate(targetUser.tWins || 0, targetUser.tTotalRaces || 0)}) | ` +
                `Relay: 🥇${targetUser.rWins || 0}/${targetUser.rTotalRaces || 0} (${getRate(targetUser.rWins || 0, targetUser.rTotalRaces || 0)}) | ` +
                `Elim: 💀${targetUser.eWins || 0}/${targetUser.eTotalRaces || 0} (${getRate(targetUser.eWins || 0, targetUser.eTotalRaces || 0)}) | ` +
                `Gauntlet: 🏆${targetUser.gpWins || 0}/${targetUser.gpTotalSeries || 0} (${getRate(targetUser.gpWins || 0, targetUser.gpTotalSeries || 0)}) | ` +
                `Stats: 🏃${s.RUN.toFixed(2)} 🏊${s.SWIM.toFixed(2)} 🧗${s.CLIMB.toFixed(2)} 🦘${s.JUMP.toFixed(2)} 🦅${s.GLIDE.toFixed(2)}`;
            this.say(this.channel, msg);
        }

        // --- REROLL (Lobby Only) ---
        if (['!rollracer', '!reroll'].includes(command)) {
            // Allow rerolling in Lobby OR Menu. 
            // Strictly block during Betting, Countdown, Racing, and Results (Gauntlet Intermission).
            if (this.game.state !== 'LOBBY' && this.game.state !== 'MENU') {
                this.say(this.channel, `@${username}, you can only reroll in the Lobby or Main Menu!`);
                return;
            }

            let input = args[1] ? args[1].toLowerCase() : "";
            let strategy = "balanced";

            if (input.includes("specialist")) strategy = "specialist";
            else if (input.includes("dualist")) strategy = "dualist";
            else if (input.includes("unstable")) strategy = "unstable";
            else if (input.includes("balanced")) strategy = "balanced"; // FIXED: Explicit check for balanced
            else {
                const roll = Math.random();
                strategy = (roll < 0.3) ? "specialist" : ((roll < 0.6) ? "dualist" : "balanced");
            }

            const newStats = GameLogic.generateStats(strategy);
            const { user } = this.db.getOrCreateUser(username, userId);
            user.stats = newStats;
            user.class = strategy;
            this.db.save();
            this.say(this.channel, `🎲 @${username} rerolled as [${strategy.toUpperCase()}]!`);

            const activeP = this.game.players.find(p => p.name.toLowerCase() === userKey);
            if (activeP) {
                activeP.stats = newStats;
                activeP.class = strategy;
                activeP.showFloatingText("REROLLED!", "#a855f7", "🎲");
                this.game.updateUI();
            }
        }

        // --- ICON ---
        if (command === '!icon' || command === '!raceicon') {
            let newIcon = "";
            const twitchUrl = this.getTwitchEmoteUrl(rawTags);

            if (twitchUrl) {
                newIcon = twitchUrl;
                this.game.updatePlayerIconGlobal(username, newIcon, userId);
            }
            else if (args[1]) {
                const rawInput = args[1].trim();
                this.game.handleIconChange(username, rawInput, tags['room-id'], userId);
            }
        }

        // --- INVENTORY COMMAND (Smart Splitting + Icons) ---
        if (['!inventory', '!inv', '!bag', '!racebag'].includes(command)) {
            const { user } = this.db.getOrCreateUser(username, userId);
            // GAUNTLET LOGIC: Use Gauntlet Inventory if active
            let inv = user.inventory || {};
            if (this.game.isGrandPrix) {
                inv = user.gpInventory || {};
            }

            // Filter out items with 0 count
            const keys = Object.keys(inv).filter(k => inv[k] > 0);

            if (keys.length === 0) {
                this.say(this.channel, `🎒 @${username}, your bag is empty!`);
                return;
            }

            // Stat to Icon Mapping
            const statIcons = {
                'RUN': '🏃',
                'SWIM': '🏊',
                'CLIMB': '🧗',
                'JUMP': '🦘',
                'GLIDE': '🦅',
                'THORNS': '🌵',
                'SHIELD': '🛡️',
                'ALL': '🌟',
                'TRAIL_GIFT': '🎁'
            };

            // 1. Build Array of Formatted Strings
            const itemStrings = keys.map(k => {
                const def = ITEMS[k];
                if (!def) return null;

                let statInfo = "";

                if (def.stat === "THORNS") statInfo = "[🌵]";
                else if (def.stat === "ALL") statInfo = "[🌟+1]";
                else if (def.stat === "SHIELD") statInfo = "[🛡️]";
                else if (def.stat === "TRAIL_GIFT") statInfo = "[🎁]";
                else {
                    // Primary Stat
                    const icon1 = statIcons[def.stat] || def.stat;
                    statInfo = `[${icon1} ${def.amount > 0 ? '+' : ''}${def.amount}]`;

                    // Secondary Stat (e.g. Cursed items)
                    if (def.stat2) {
                        const icon2 = statIcons[def.stat2] || def.stat2;
                        statInfo += ` [${icon2} ${def.amount2 > 0 ? '+' : ''}${def.amount2}]`;
                    }
                }

                return `${def.name} (x${inv[k]}) ${statInfo}`;
            }).filter(s => s !== null);

            // 2. Chunking Loop (Twitch 500 char limit)
            const MAX_LEN = 460;
            let currentMsg = `🎒 @${username}'s Bag: `;

            for (let i = 0; i < itemStrings.length; i++) {
                const itemStr = itemStrings[i];
                const isLast = (i === itemStrings.length - 1);
                const suffix = isLast ? "" : ", ";

                // Check if adding this item would overflow
                if (currentMsg.length + itemStr.length + suffix.length > MAX_LEN) {
                    this.say(this.channel, currentMsg);
                    currentMsg = `... ${itemStr}${suffix}`;
                } else {
                    currentMsg += itemStr + suffix;
                }
            }

            if (currentMsg.trim().length > 0) {
                this.say(this.channel, currentMsg);
            }
        }

        // --- TRAILS COMMAND (NEW) ---
        if (command === '!trails') {
            const { user } = this.db.getOrCreateUser(username, userId);
            const trails = user.unlockedTrails ? [...user.unlockedTrails] : [];
            if (user.coins >= 1000 && !trails.includes('money')) trails.push('money');

            const owned = trails.filter(t => t !== 'default');

            if (owned.length === 0) {
                this.say(this.channel, `@${username}, you don't have any special trails yet!`);
            } else {
                // Group by Rarity
                const groups = {};

                owned.forEach(tId => {
                    const def = TRAILS[tId];
                    if (def) {
                        const r = (def.rarity || 'common').toUpperCase();
                        if (!groups[r]) groups[r] = [];
                        groups[r].push(def.name);
                    }
                });

                // Display Order (Best to Worst)
                const order = ['SPECIAL', 'LEGENDARY', 'EPIC', 'RARE', 'COMMON', 'NOVELTY'];
                let parts = [];

                order.forEach(rarity => {
                    if (groups[rarity] && groups[rarity].length > 0) {
                        parts.push(`[${rarity}] ${groups[rarity].join(', ')}`);
                    }
                });

                // Catch misc rarities
                Object.keys(groups).forEach(r => {
                    if (!order.includes(r)) {
                        parts.push(`[${r}] ${groups[r].join(', ')}`);
                    }
                });

                this.say(this.channel, `🌈 @${username}'s Trails: ${parts.join(' // ')}`);
            }
        }

        // --- ECONOMY COMMANDS ---
        if (command === '!racecoins' || command === '!racebalance' || command === '!racewallet' || command === '!rc') {
            const { user } = this.db.getOrCreateUser(username, userId);
            this.say(this.channel, `💰 @${username} has ${user.coins || 0} coins.`);
        }

        // --- NEW: TRADE-IN COMMAND (Supports "!sell all") ---
        if (['!racetrade', '!trade', '!sell'].includes(command)) {
            // 1. Validate: NO Trading during Gauntlet (Fixed Kit Rule)
            if (this.game.isGrandPrix) {
                this.say(this.channel, `@${username}, the Item Shop is closed during Gauntlet!`);
                return;
            }

            // 2. Validate: Only allow trading when not racing/betting/countdown
            if (!['MENU', 'LOBBY', 'RESULTS'].includes(this.game.state)) {
                this.say(this.channel, `@${username}, you cannot trade items right now!`);
                return;
            }

            const { user } = this.db.getOrCreateUser(username, userId);
            // GAUNTLET LOGIC: Use Gauntlet Inventory if active
            let userInv = user.inventory || {};
            if (this.game.isGrandPrix) {
                userInv = user.gpInventory || {};
            }

            // PRICE TABLE (10% of Buy Price, Rounded UP)
            const PRICE_TABLE = {
                'common': 10,
                'rare': 22,
                'epic': 35,
                'legendary': 75,
                'special': 75
            };

            // --- OPTION A: SELL EVERYTHING (!sell all) ---
            if (args[1] && args[1].toLowerCase() === 'all' && args.length === 2) {
                const itemKeys = Object.keys(userInv);
                if (itemKeys.length === 0) {
                    this.say(this.channel, `🎒 @${username}, your inventory is already empty!`);
                    return;
                }

                let totalVal = 0;
                let totalCount = 0;

                // Loop through every item in the bag
                itemKeys.forEach(key => {
                    const count = userInv[key];
                    const itemDef = ITEMS[key];
                    if (itemDef && count > 0) {
                        const rarity = (itemDef.rarity || 'common').toLowerCase();
                        const basePrice = PRICE_TABLE[rarity] || 10;
                        const unitPrice = Math.ceil(basePrice * 0.10);

                        totalVal += (unitPrice * count);
                        totalCount += count;
                    }
                });

                // Clear Inventory & Add Coins
                if (this.game.isGrandPrix) {
                    user.gpInventory = {};
                } else {
                    user.inventory = {};
                }

                user.coins = (user.coins || 0) + totalVal;
                this.db.save();

                this.say(this.channel, `🤑 @${username} liquidated their entire inventory! Sold ${totalCount} items for 🪙${totalVal}! (Balance: ${user.coins})`);

                // Update UI
                const p = this.game.players.find(pl => pl.name.toLowerCase() === username.toLowerCase());
                if (p) {
                    p.inventory = {};
                    this.game.updateUI();
                    p.showFloatingText(`+${totalVal} COINS`, "#facc15", "💰");
                }
                return;
            }

            // --- OPTION B: SELL SPECIFIC ITEM (!sell boots 2) ---

            // Parse Arguments
            if (args.length < 2) {
                this.say(this.channel, `@${username}, usage: !sell <item name> <quantity> OR !sell all`);
                return;
            }

            let quantity = 1; // Default
            let qtyFound = false;
            const searchParts = [];

            // Scan args to separate the Number/All from the Item Name
            for (let i = 1; i < args.length; i++) {
                const arg = args[i];
                const lower = arg.toLowerCase();

                if (!qtyFound && (lower === 'all' || /^\d+$/.test(lower))) {
                    if (lower === 'all') quantity = 'ALL';
                    else quantity = parseInt(lower);
                    qtyFound = true;
                } else {
                    searchParts.push(lower);
                }
            }

            if (searchParts.length === 0) {
                this.say(this.channel, `@${username}, please specify an item name.`);
                return;
            }

            const searchStr = searchParts.join(' ');

            // Resolve Item Key (FUZZY)
            const itemKey = this.findItemKey(searchStr);

            if (!itemKey) {
                this.say(this.channel, `❌ @${username}, could not find item: "${searchStr}".`);
                return;
            }

            const ownedAmount = userInv[itemKey] || 0;

            if (ownedAmount <= 0) {
                this.say(this.channel, `🎒 @${username}, you don't have any ${ITEMS[itemKey].name}.`);
                return;
            }

            // Handle "Sell All of Specific Item" (e.g. !sell boots all)
            if (quantity === 'ALL') quantity = ownedAmount;

            if (ownedAmount < quantity) {
                this.say(this.channel, `⚠️ @${username}, you only have ${ownedAmount}x ${ITEMS[itemKey].name}.`);
                return;
            }

            // Calculate Price (Specific Item)
            const rarity = (ITEMS[itemKey].rarity || 'common').toLowerCase();
            const basePrice = PRICE_TABLE[rarity] || 10;
            const unitPrice = Math.ceil(basePrice * 0.10);
            const totalValue = unitPrice * quantity;

            // Execute Transaction
            userInv[itemKey] -= quantity;
            if (userInv[itemKey] <= 0) delete userInv[itemKey];

            user.coins = (user.coins || 0) + totalValue;
            this.db.save();

            this.say(this.channel, `🤝 @${username} sold ${quantity}x ${ITEMS[itemKey].name} for 🪙${totalValue}! (Balance: ${user.coins})`);

            const p = this.game.players.find(pl => pl.name.toLowerCase() === username.toLowerCase());
            if (p) {
                // FIX: Ensure UI receives the correct inventory ref
                p.inventory = (this.game.isGrandPrix) ? user.gpInventory : user.inventory;
                this.game.updateUI();
                p.showFloatingText(`+${totalValue} COINS`, "#facc15", "💰");
            }
        }

        if (command === '!settrail' || command === '!racetrail') {
            // Allow changing trails anytime (removed LOBBY check)
            const { user } = this.db.getOrCreateUser(username, userId);

            let query = args.slice(1).join(' ').toLowerCase().trim();
            let trailId = null;

            // --- RANDOM LOGIC ---
            if (args[1] && args[1].toLowerCase() === 'random') {
                const rarityReq = args[2] ? args[2].toLowerCase() : null;
                // Ensure unlockedTrails exists
                const unlocked = user.unlockedTrails || ['default'];
                let pool = [];

                if (rarityReq) {
                    // Filter by specific rarity
                    pool = unlocked.filter(k => {
                        const t = TRAILS[k];
                        return t && t.rarity && t.rarity.toLowerCase() === rarityReq;
                    });

                    if (pool.length === 0) {
                        this.say(this.channel, `@${username}, you don't own any [${rarityReq.toUpperCase()}] trails!`);
                        return;
                    }
                } else {
                    // General Random: Exclude 'default' if the user has other trails
                    pool = unlocked.filter(k => k !== 'default');
                    if (pool.length === 0) pool = ['default'];
                }

                trailId = pool[Math.floor(Math.random() * pool.length)];
            }
            // --- STANDARD SELECTION ---
            else if (!query) {
                trailId = 'default';
            } else {
                // 1. Exact Key Match
                if (TRAILS[query]) trailId = query;
                // 2. Underscore Normalization (e.g. "scratch marks" -> "scratch_marks")
                else if (TRAILS[query.replace(/ /g, '_')]) trailId = query.replace(/ /g, '_');
                // 3. Name Match (Exact & Fuzzy)
                else {
                    // Try exact name match first
                    trailId = Object.keys(TRAILS).find(k => TRAILS[k].name && TRAILS[k].name.toLowerCase() === query);

                    // If not found, try fuzzy search (contains)
                    if (!trailId) {
                        trailId = Object.keys(TRAILS).find(k =>
                            k.toLowerCase().includes(query) ||
                            (TRAILS[k].name && TRAILS[k].name.toLowerCase().includes(query))
                        );
                    }
                }
            }

            if (!trailId || !TRAILS[trailId]) {
                this.say(this.channel, `@${username}, trail '${query}' not found.`);
                return;
            }

            let isMoneyBypass = (trailId === 'money' && user.coins >= 1000);

            if (trailId !== 'default' && !isMoneyBypass && (!user.unlockedTrails || !user.unlockedTrails.includes(trailId))) {
                this.say(this.channel, `@${username}, you haven't unlocked the '${TRAILS[trailId].name}' trail yet!`);
                return;
            }

            user.activeTrail = trailId;
            this.db.save();
            this.say(this.channel, `✨ @${username} equipped ${TRAILS[trailId].name} trail!`);

            // Update live player if they exist in the current session
            const p = this.game.players.find(pl => pl.name.toLowerCase() === userKey);
            if (p) {
                p.activeTrail = trailId;
                // Force a trail reset so it doesn't glitch visually by connecting old path to new path style
                p.trailHistory = [];
                this.game.updateUI();
            }
        }

        // --- BETTING (UPDATED: Flexible Syntax + ALL option) ---
        if (command === '!racebet' || command === '!rb') {
            // Usage: !rb 100 Red Team  OR  !rb Red Team 100  OR  !rb all Red

            // 1. Validate State
            if (this.game.state === 'RACING' || this.game.state === 'RESULTS') {
                this.say(this.channel, `@${username}, betting is closed!`);
                return;
            }
            if ((this.game.isTeamRace || this.game.isRelayRace) && this.game.state !== 'BETTING') {
                this.say(this.channel, `@${username}, wait for teams to be drafted!`);
                return;
            }
            // For Solo races (if timer is active)
            if (this.game.state === 'BETTING' && this.game.bettingTimer <= 0) {
                this.say(this.channel, `@${username}, betting is closed!`);
                return;
            }

            // Filter empty strings caused by double spaces
            const words = args.slice(1).filter(w => w.trim().length > 0);
            if (words.length < 2) return; // Need at least Target + Amount

            const { user } = this.db.getOrCreateUser(username, userId);

            let amount = 0;
            let amountIndex = -1;

            // 2. Scan for Amount (Number or 'all')
            for (let i = 0; i < words.length; i++) {
                const w = words[i].toLowerCase();
                if (w === 'all') {
                    amount = user.coins || 0;
                    amountIndex = i;
                    break;
                }
                // Check for valid positive integer (strict check prevents "100abc")
                const val = parseInt(w);
                if (!isNaN(val) && val > 0 && String(val) === w) {
                    amount = val;
                    amountIndex = i;
                    break;
                }
            }

            if (amountIndex === -1) {
                // No valid amount found
                return;
            }

            if (amount <= 0) {
                this.say(this.channel, `@${username}, you have no coins to bet!`);
                return;
            }

            // 3. Construct Target Name (Join remaining words)
            // This handles multi-word targets like "Red Team" or "Super Mario"
            const targetParts = words.filter((_, i) => i !== amountIndex);
            const targetInput = targetParts.join(' ').toLowerCase().replace('@', '');

            if (!targetInput) return;

            // 4. Check if already bet
            if (this.game.currentBets[username]) {
                const existing = this.game.currentBets[username];
                this.say(this.channel, `🛑 @${username}, you already have a bet on ${existing.target.toUpperCase()}! Use !rcb to cancel it first.`);
                return;
            }

            // 5. Check Balance
            if ((user.coins || 0) < amount) {
                this.say(this.channel, `@${username}, you only have ${user.coins || 0} coins!`);
                return;
            }

            // 6. Identify Target (Team or Player)
            let betType = null;
            let betTargetId = null;

            if (this.game.isTeamRace || this.game.isRelayRace) {
                // Use activeTeamCount to filter valid targets
                const validTeams = this.game.activeTeamCount ? TEAMS.slice(0, this.game.activeTeamCount) : TEAMS;

                // Check ID, Name, or Aliases
                const team = validTeams.find(t =>
                    t.id === targetInput ||
                    t.name.toLowerCase().includes(targetInput) ||
                    (t.aliases && t.aliases.includes(targetInput))
                );

                if (!team) {
                    const validNames = validTeams.map(t => t.name.replace(' TEAM', '')).join(', ');
                    this.say(this.channel, `@${username}, invalid team! Valid teams: ${validNames}`);
                    return;
                }
                betType = 'team';
                betTargetId = team.id;
            } else {
                // Solo Bet
                const racer = this.game.players.find(p => p.name.toLowerCase().includes(targetInput));
                if (!racer) {
                    this.say(this.channel, `@${username}, racer "${targetInput}" is not in the lobby!`);
                    return;
                }
                betType = 'solo';
                betTargetId = racer.name;
            }

            // 7. Place Bet
            user.coins -= amount;
            this.db.save();

            this.game.currentBets[username] = {
                amount: amount,
                target: betTargetId,
                type: betType,
                userId: userId
            };

            this.db.saveActiveBets(this.game.currentBets);
            this.say(this.channel, `💰 @${username} bet ${amount} on ${betTargetId.toUpperCase()}!`);
            this.game.updateBettingUI();
        }

        // --- NEW: CANCEL BET COMMAND ---
        if (command === '!racecancelbet' || command === '!rcb') {
            // 1. Validate State (Must be valid betting phase)
            if (this.game.state === 'RACING' || this.game.state === 'RESULTS') {
                this.say(this.channel, `@${username}, betting is closed! Too late to cancel.`);
                return;
            }
            // For team modes, ensure we are in the specific betting window
            if ((this.game.isTeamRace || this.game.isRelayRace) && this.game.state !== 'BETTING') {
                this.say(this.channel, `@${username}, no active betting phase.`);
                return;
            }

            // 2. Check active bet
            const currentBet = this.game.currentBets[username];
            if (!currentBet) {
                this.say(this.channel, `@${username}, you don't have an active bet to cancel.`);
                return;
            }

            // 3. Refund Coins
            const { user } = this.db.getOrCreateUser(username, userId);
            user.coins = (user.coins || 0) + currentBet.amount;
            this.db.save();

            // 4. Remove Bet from Memory
            delete this.game.currentBets[username];

            // NEW: Sync with disk
            this.db.saveActiveBets(this.game.currentBets);

            this.say(this.channel, `🔄 @${username}, bet cancelled! Refunded ${currentBet.amount} coins.`);

            this.game.updateBettingUI();
        }

        // --- COIN LEADERBOARD (GLOBAL) ---
        if (command === '!racecoinleaderboard' || command === '!rich' || command === '!wealth' || command === '!rcl') {
            // 1. Get all players from the database
            // Object.values converts the hash map { "user": {...}, "user2": {...} } into an array
            const allPlayers = Object.values(this.db.players);

            // 2. Sort by Coins (Descending)
            // (b.coins || 0) ensures undefined coins are treated as 0
            const sorted = allPlayers.sort((a, b) => (b.coins || 0) - (a.coins || 0));

            // 3. Take Top 5
            const top5 = sorted.slice(0, 5);

            if (top5.length === 0) {
                this.say(this.channel, "💰 No coin data found yet!");
                return;
            }

            // 4. Format Message
            const msg = top5.map((p, i) => `#${i + 1} ${p.name} (${p.coins || 0}©)`).join('  //  ');

            this.say(this.channel, `💎 WEALTHIEST RACERS: ${msg}`);
        }

        // --- STAT LEADERBOARDS (CHAT) ---
        if (['!topsolo', '!topteam', '!toprelay', '!topelim', '!topgauntlet'].includes(command)) {
            const mode = (args[1] && args[1].toLowerCase() === 'all') ? 'ALL-TIME' : 'SEASON';
            const isAll = (mode === 'ALL-TIME');
            let typeLabel = "";
            let sortKeys = []; // [Key1 (Wins), Key2 (Secondary Metric), Key3 (Tertiary)]

            if (command === '!topsolo') {
                typeLabel = "SOLO";
                sortKeys = isAll ? ['wins', 'wins2', 'wins3'] : ['season.wins', 'season.wins2', 'season.wins3'];
            } else if (command === '!topteam') {
                typeLabel = "TEAM";
                sortKeys = isAll ? ['tWins', 'tWins2', 'tWins3'] : ['season.tWins', 'season.tWins2', 'season.tWins3'];
            } else if (command === '!toprelay') {
                typeLabel = "RELAY";
                sortKeys = isAll ? ['rWins', 'rWins2', 'rWins3'] : ['season.rWins', 'season.rWins2', 'season.rWins3'];
            } else if (command === '!topelim') {
                typeLabel = "ELIMINATION";
                sortKeys = isAll ? ['eWins', 'eTotalRaces'] : ['season.eWins', 'season.eTotalRaces'];
            } else if (command === '!topgauntlet') {
                typeLabel = "GAUNTLET";
                sortKeys = isAll ? ['gpWins', 'gpTotalSeries'] : ['season.gpWins', 'season.gpTotalSeries'];
            }

            const getVal = (obj, path) => {
                if (!path) return 0;
                if (path.includes('.')) {
                    const [p, c] = path.split('.');
                    return (obj[p] && obj[p][c]) ? obj[p][c] : 0;
                }
                return obj[path] || 0;
            };

            const allPlayers = Object.values(this.db.players);

            allPlayers.sort((a, b) => {
                const valA = getVal(a, sortKeys[0]);
                const valB = getVal(b, sortKeys[0]);
                if (valA !== valB) return valB - valA;
                if (sortKeys[1]) {
                    const secA = getVal(a, sortKeys[1]);
                    const secB = getVal(b, sortKeys[1]);
                    return secB - secA;
                }
                return 0;
            });

            const top5 = allPlayers.filter(p => getVal(p, sortKeys[0]) > 0).slice(0, 5);

            if (top5.length === 0) {
                this.say(this.channel, `🏆 No ${typeLabel} wins recorded yet for ${mode}.`);
            } else {
                const msgParts = top5.map((p, i) => {
                    const w1 = getVal(p, sortKeys[0]);

                    if (command === '!topelim') return `#${i + 1} ${p.name} (💀${w1})`;

                    if (command === '!topgauntlet') {
                        const series = getVal(p, sortKeys[1]);
                        return `#${i + 1} ${p.name} (🏆${w1}/${series})`;
                    }

                    const w2 = getVal(p, sortKeys[1]);
                    const w3 = getVal(p, sortKeys[2]);
                    return `#${i + 1} ${p.name} (🥇${w1} 🥈${w2} 🥉${w3})`;
                });
                this.say(this.channel, `🏆 TOP 5 ${typeLabel} (${mode}): ${msgParts.join(' // ')}`);
            }
        }

        // --- SHOP (RANDOMIZED GACHA) ---
        if (command === '!racebuy' || command === '!buy') {
            // 1. Validate: NO Buying during Gauntlet (Fixed Kit Rule)
            if (this.game.isGrandPrix) {
                this.say(this.channel, `@${username}, the Item Shop is closed during Gauntlet! You must rely on your starter kit.`);
                return;
            }

            // Usage: !buy item common  OR  !buy trail rare  OR  !buy trail poop
            const category = args[1] ? args[1].toLowerCase() : null; // 'item' or 'trail'
            const query = args.slice(2).join(' ').toLowerCase().trim();

            if (!category || !query || !['item', 'trail'].includes(category)) {
                this.say(this.channel, `@${username}, usage: !buy [item|trail] [rarity/name]. 🎒 ITEMS: (C:10, R:22, E:35, L:75) | 🌈 TRAILS: (C:20, R:44, E:70, L:150) | 🎪 NOVELTY: (!buy trail <name> 100c)`);
                return;
            }

            const { user } = this.db.getOrCreateUser(username, userId);

            // --- PRICES ---
            const ITEM_PRICES = { 'common': 10, 'rare': 22, 'epic': 35, 'legendary': 75 };
            const TRAIL_PRICES = { 'common': 20, 'rare': 44, 'epic': 70, 'legendary': 150, 'novelty': 100 };

            // --- LOGIC: BUY TRAIL ---
            if (category === 'trail') {
                // 1. CHECK: Is query a direct Rarity? (Gacha Mode - Priority)
                // This prevents the code from searching for a trail named "legendary" and failing.
                if (TRAIL_PRICES[query]) {
                    const cost = TRAIL_PRICES[query];
                    if ((user.coins || 0) < cost) {
                        this.say(this.channel, `@${username}, you need ${cost} coins for a ${query} trail!`);
                        return;
                    }

                    // Get pool (Safety: check if trails exist and exclude default)
                    const pool = Object.keys(TRAILS).filter(k => TRAILS[k].rarity === query && k !== 'default');
                    if (pool.length === 0) {
                        this.say(this.channel, `@${username}, there are no ${query} trails defined yet!`);
                        return;
                    }

                    // Filter owned
                    if (!user.unlockedTrails) user.unlockedTrails = ['default'];
                    const unowned = pool.filter(id => !user.unlockedTrails.includes(id));

                    if (unowned.length === 0) {
                        this.say(this.channel, `🛑 @${username}, you already own ALL ${query} trails!`);
                        return;
                    }

                    // Buy Random
                    const wonId = unowned[Math.floor(Math.random() * unowned.length)];
                    const wonTrail = TRAILS[wonId];
                    const trailName = wonTrail.name || "Unknown Trail";

                    user.coins -= cost;
                    user.unlockedTrails.push(wonId);
                    this.db.save();

                    this.say(this.channel, `✨ @${username} unlocked [${query.toUpperCase()}] ${trailName} Trail! (-${cost} coins). Type !settrail ${wonId} to use it.`);
                    return;
                }

                // 2. Resolve Trail ID (Fuzzy Search for Specific Buy)
                let trailId = null;

                // A. Exact Match (Key)
                if (TRAILS[query]) trailId = query;
                // B. Underscore Normalization ("scratch marks" -> "scratch_marks")
                else if (TRAILS[query.replace(/ /g, '_')]) trailId = query.replace(/ /g, '_');
                // C. Fuzzy Search (Key or Name) - Added safety check for missing names
                else {
                    trailId = Object.keys(TRAILS).find(k => k.toLowerCase() === query || k.toLowerCase().includes(query)) ||
                        Object.keys(TRAILS).find(k => TRAILS[k].name && TRAILS[k].name.toLowerCase().includes(query));
                }

                // 3. CHECK: Specific Trail Purchase (Novelty Only)
                if (trailId && TRAILS[trailId]) {
                    const trailDef = TRAILS[trailId];

                    // Only Novelty trails can be bought directly
                    if (trailDef.rarity === 'novelty') {
                        const cost = TRAIL_PRICES['novelty'];
                        if ((user.coins || 0) < cost) {
                            this.say(this.channel, `@${username}, the '${trailDef.name}' trail costs ${cost} coins!`);
                            return;
                        }
                        if (!user.unlockedTrails) user.unlockedTrails = ['default'];
                        if (user.unlockedTrails.includes(trailId)) {
                            this.say(this.channel, `🛑 @${username}, you already own the '${trailDef.name}' trail!`);
                            return;
                        }

                        user.coins -= cost;
                        user.unlockedTrails.push(trailId);
                        this.db.save();
                        this.say(this.channel, `🎪 @${username} bought the '${trailDef.name}' trail! (-${cost} coins). Type !settrail ${trailId} to equip.`);
                        return;
                    } else {
                        // If user tried to buy "inferno" (Legendary) directly
                        const r = trailDef.rarity;
                        this.say(this.channel, `@${username}, the '${trailDef.name}' trail cannot be bought directly! You must buy a [${r.toUpperCase()}] box.`);
                        return;
                    }
                }

                // 4. Fallback
                this.say(this.channel, `@${username}, trail or rarity '${query}' not found! Try: common, rare, epic, legendary OR novelty trails like 'poop'.`);
                return;
            }

            // --- LOGIC: BUY ITEM (Consumable) ---
            if (category === 'item') {
                const cost = ITEM_PRICES[query];
                if (!cost) {
                    this.say(this.channel, `@${username}, invalid item rarity! (common, rare, epic, legendary)`);
                    return;
                }

                if ((user.coins || 0) < cost) {
                    this.say(this.channel, `@${username}, you need ${cost} coins for a ${query} item!`);
                    return;
                }

                const pool = Object.keys(ITEMS).filter(k => ITEMS[k].rarity === query);
                if (pool.length === 0) {
                    this.say(this.channel, `@${username}, there are no ${query} items defined.`);
                    return;
                }

                const wonId = pool[Math.floor(Math.random() * pool.length)];
                const wonItem = ITEMS[wonId];

                user.coins -= cost;

                // GAUNTLET LOGIC: Add to Gauntlet inventory if active
                if (this.game.isGrandPrix) {
                    if (!user.gpInventory) user.gpInventory = {};
                    user.gpInventory[wonId] = (user.gpInventory[wonId] || 0) + 1;
                } else {
                    if (!user.inventory) user.inventory = {};
                    user.inventory[wonId] = (user.inventory[wonId] || 0) + 1;
                }

                this.db.save();

                // Update Live UI
                const p = this.game.players.find(pl => pl.name.toLowerCase() === tags.username.toLowerCase());
                if (p) {
                    p.inventory = (this.game.isGrandPrix) ? user.gpInventory : user.inventory;
                    this.game.updateUI();
                }

                let statStr = this.getItemStatsStr(wonItem);
                this.say(this.channel, `🛒 @${username} bought [${query.toUpperCase()}] ${wonItem.name} ${statStr}! (-${cost} coins)`);
                return;
            }
        }

        // --- TICKETS CHECK ---
        if (['!tickets', '!ticket', '!spintickets'].includes(command)) {
            const { user } = this.db.getOrCreateUser(username, userId);
            const count = user.chanceTickets || 0;
            this.say(this.channel, `🎟️ @${username}, you have ${count} Spin Ticket(s).`);
        }

        // --- CHANCE WHEEL COMMAND ---
        if (['!spin', '!racewheel'].includes(command)) {
            // Removed State Check: Allow spinning anytime (queueing)

            const { user } = this.db.getOrCreateUser(username, userId);

            // 1. Determine Amount
            let amount = 1;
            const arg = args[1];

            if (arg && arg.toLowerCase() === 'all') {
                amount = user.chanceTickets || 0;
            } else if (arg && !isNaN(parseInt(arg))) {
                amount = parseInt(arg);
            }

            // 2. Validation
            if ((user.chanceTickets || 0) <= 0) {
                this.say(this.channel, `🛑 @${username}, you don't have any Spin Tickets! Win races to earn them.`);
                return;
            }

            if (amount <= 0) return; // Ignore negative/zero inputs

            if (user.chanceTickets < amount) {
                this.say(this.channel, `🛑 @${username}, you only have ${user.chanceTickets} tickets!`);
                return;
            }

            // 3. Deduct Tickets & Save
            user.chanceTickets -= amount;
            this.db.save();

            // Sync live player & Update UI immediately
            const p = this.game.players.find(pl => pl.name.toLowerCase() === username.toLowerCase());
            if (p) {
                p.chanceTickets = user.chanceTickets;
                this.game.updateUI();
            }

            // 4. ADD TO QUEUE (Loop for multiple)
            if (!this.game.spinQueue) this.game.spinQueue = [];

            for (let i = 0; i < amount; i++) {
                this.game.spinQueue.push({ name: username, id: userId });
            }

            // SAVE QUEUE STATE
            this.db.saveSpinQueue(this.game.spinQueue);

            const pos = this.game.spinQueue.length;
            const s = amount > 1 ? "s" : "";
            this.say(this.channel, `🎟️ @${username} added ${amount} spin${s} to Queue! (Total Queue: ${pos})`);

            // Update the Broadcaster UI Button to show pending count
            this.game.updateWheelButton();
        }

        // --- BROADCASTER COMMANDS ---
        const isBroadcaster = (tags.username.toLowerCase() === this.channel.toLowerCase()) || (tags.badges && tags.badges.broadcaster);

        if (isBroadcaster) {
            // !giveticket <target> <amount>
            if (command === '!giveticket' && args[1]) {
                const target = args[1].replace('@', '');
                const amount = parseInt(args[2]) || 1;

                const { user } = this.db.getOrCreateUser(target);
                user.chanceTickets = (user.chanceTickets || 0) + amount;
                this.db.save();

                this.say(this.channel, `🎟️ Gave ${amount} Spin Ticket(s) to @${user.name}. Total: ${user.chanceTickets}`);

                // Sync live player & UI
                const p = this.game.players.find(pl => pl.name.toLowerCase() === user.name.toLowerCase());
                if (p) {
                    p.chanceTickets = user.chanceTickets;
                    this.game.updateUI();
                    p.showFloatingText(`+${amount} TICKET`, "#facc15", "🎟️");
                }
            }

            // !givecoins <target> <amount>
            if (command === '!givecoins' && args[1] && args[2]) {
                const target = args[1].replace('@', '');
                const amount = parseInt(args[2]);
                if (!isNaN(amount)) {
                    const { user } = this.db.getOrCreateUser(target);
                    user.coins = (user.coins || 0) + amount;
                    this.db.save();
                    this.say(this.channel, `💰 Added ${amount} coins to @${user.name}. Balance: ${user.coins}`);

                    const p = this.game.players.find(pl => pl.name.toLowerCase() === user.name.toLowerCase());
                    if (p) p.showFloatingText(`+${amount} COINS`, "#facc15", "💰");
                }
            }

            // !giveitem <target> <amount> <item>
            if (command === '!giveitem' && args[2]) {
                const target = args[1].replace('@', '');
                // Check if amount is specified as second arg
                let amount = parseInt(args[2]);
                let itemStr = "";

                if (!isNaN(amount)) {
                    // Format: !giveitem user amount item...
                    itemStr = args.slice(3).join(' ');
                } else {
                    // Format: !giveitem user item... (Default 1)
                    amount = 1;
                    itemStr = args.slice(2).join(' ');
                }

                const itemKey = this.findItemKey(itemStr);

                if (itemKey && amount > 0) {
                    const { user } = this.db.getOrCreateUser(target);

                    // DEFAULT: Standard inventory logic
                    let inv = this.game.isGrandPrix ? (user.gpInventory = user.gpInventory || {}) : (user.inventory = user.inventory || {});

                    // EXCEPTION: Trail Boxes always go to Main Inventory
                    const itemDef = ITEMS[itemKey];
                    if (itemDef && itemDef.stat === 'TRAIL_GIFT') {
                        inv = user.inventory = user.inventory || {};
                    }

                    inv[itemKey] = (inv[itemKey] || 0) + amount;
                    this.db.save();

                    this.say(this.channel, `🎒 Gave ${amount}x ${ITEMS[itemKey].name} to @${user.name}.`);

                    const p = this.game.players.find(pl => pl.name.toLowerCase() === user.name.toLowerCase());
                    if (p) {
                        // Sync the inventory we actually modified
                        if (this.game.isGrandPrix) {
                            if (itemDef.stat === 'TRAIL_GIFT') {
                                // Trail box added to main inventory during Gauntlet.
                                // No UI change needed for P because P is looking at gpInventory.
                            } else {
                                p.inventory = inv; // Update pointer
                            }
                        } else {
                            p.inventory = inv;
                        }

                        this.game.updateUI();
                        p.showFloatingText(`+${amount} ITEM`, "#a855f7", "🎒");
                    }
                } else if (!itemKey) {
                    this.say(this.channel, `❌ Could not find item: "${itemStr}"`);
                }
            }

            // !givetrail <target> <trail>
            if (command === '!givetrail' && args[2]) {
                const target = args[1].replace('@', '');
                const trailQuery = args.slice(2).join(' ').toLowerCase();
                const trailId = Object.keys(TRAILS).find(k => k === trailQuery || (TRAILS[k].name && TRAILS[k].name.toLowerCase() === trailQuery));

                if (trailId) {
                    const { user } = this.db.getOrCreateUser(target);
                    if (!user.unlockedTrails) user.unlockedTrails = ['default'];
                    if (!user.unlockedTrails.includes(trailId)) {
                        user.unlockedTrails.push(trailId);
                        this.db.save();
                        this.say(this.channel, `🌈 Unlocked '${TRAILS[trailId].name}' trail for @${user.name}.`);

                        // Sync live player & Show Notification
                        const p = this.game.players.find(pl => pl.name.toLowerCase() === user.name.toLowerCase());
                        if (p) {
                            p.unlockedTrails = user.unlockedTrails;
                            p.showFloatingText("TRAIL UNLOCKED!", "#ec4899", "🌈");
                        }
                    } else {
                        this.say(this.channel, `@${user.name} already has that trail.`);
                    }
                }
            }
        }

        // --- USE ITEM (Smart Targeting + Random + Buff Limits) ---
        if (['!useitem', '!raceitem', '!ri', '!use'].includes(command)) {
            // PARSE ARGS FIRST (Moved State Check Later)
            // FIX: Filter empty strings to prevent parsing errors with extra spaces
            let words = args.slice(1).filter(w => w.trim().length > 0);
            if (words.length === 0) return;

            let amountReq = 1;
            let targetName = null;

            // 1. Extract Target (Explicit @)
            const targetIndex = words.findIndex(w => w.startsWith('@'));
            if (targetIndex !== -1) {
                targetName = words[targetIndex].substring(1);
                words.splice(targetIndex, 1);
            } else {
                // --- SMART DETECTION (No @ symbol) ---
                if (words.length > 1) {
                    const potentialName = words[words.length - 1]; // Check last word
                    // Check against DB or Active Players
                    const potentialUser = this.db.getUser(potentialName) || this.game.players.find(p => p.name.toLowerCase() === potentialName.toLowerCase());

                    // Only treat as target if it is NOT a number and NOT 'all'
                    if (potentialUser && !/^\d+$/.test(potentialName) && potentialName.toLowerCase() !== 'all') {
                        targetName = potentialName;
                        words.pop(); // Remove target from words
                    }
                }
            }

            // 2. Extract Amount (if present at end)
            if (words.length > 0) {
                const last = words[words.length - 1].toLowerCase();

                // NEW: Handle 'all' explicitly
                if (last === 'all') {
                    amountReq = 999; // Will be clamped by inventory later
                    words.pop();
                }
                // FIX: Strict check for number to avoid empty strings (coerced to 0) or NaN results
                else if (last !== '' && !isNaN(last)) {
                    const parsed = parseInt(last);
                    if (!isNaN(parsed)) {
                        amountReq = parsed;
                        words.pop();
                    }
                }
            }

            if (words.length === 0) return;
            let itemQuery = words.join(' ').toLowerCase();

            // --- Random Mode Check ---
            const isRandom = (itemQuery === 'random');
            let specificItemKey = null;

            if (!isRandom) {
                // 3. Find Specific Item Key using Helper
                specificItemKey = this.findItemKey(itemQuery);

                if (!specificItemKey) {
                    this.say(this.channel, `@${username}, item "${itemQuery}" not found.`);
                    return;
                }
            }

            // --- NEW STATE VALIDATION ---
            // Allow Trail Box anytime. Require Lobby for everything else.
            let isAllowed = false;

            // NEW: Allow usage during Gauntlet Intermission (Results Screen)
            const isGPIntermission = this.game.isGrandPrix && this.game.state === 'RESULTS' && this.game.gpSeriesActive;

            if (isRandom) {
                // Random always excludes Trail Box in loop logic below, so it's only buffs. 
                // Must be in Lobby OR Gauntlet Intermission.
                if (this.game.state === 'LOBBY' || isGPIntermission) isAllowed = true;
            } else {
                const checkDef = ITEMS[specificItemKey];
                if (checkDef && checkDef.stat === 'TRAIL_GIFT') {
                    isAllowed = true; // Always allow Trail Box
                } else {
                    if (this.game.state === 'LOBBY' || isGPIntermission) isAllowed = true;
                }
            }

            if (!isAllowed) {
                this.say(this.channel, `@${username}, you can only use buff items in the Lobby (or Gauntlet Intermission)!`);
                return;
            }

            // 4. Sender Validation
            const { user } = this.db.getOrCreateUser(username, userId);

            // GAUNTLET LOGIC: Use Gauntlet Inventory if active, UNLESS it's a persistent item (Trail Box)
            // If Grand Prix is active, we default to gpInventory.
            // However, if the user specifically asked for a Trail Box (or other future global item),
            // we must switch the 'activeInventory' reference to the main 'user.inventory'.
            let activeInventory = user.inventory || {};

            if (this.game.isGrandPrix) {
                let useMainInv = false;

                // Check if specific item is global
                if (!isRandom && specificItemKey) {
                    const itemDef = ITEMS[specificItemKey];
                    if (itemDef && itemDef.stat === 'TRAIL_GIFT') {
                        useMainInv = true;
                    }
                }

                if (!useMainInv) {
                    if (!user.gpInventory) user.gpInventory = {};
                    activeInventory = user.gpInventory;
                }
                // Else: we keep activeInventory pointing to user.inventory
            }

            if (!user.buffs) user.buffs = {};
            const currentUsed = user.buffs._itemsUsed || 0;
            const MAX = 3;

            // Only check limit if it's NOT a trail box (Trail boxes don't count towards limit)
            let checkLimit = true;
            if (!isRandom && specificItemKey && ITEMS[specificItemKey].stat === 'TRAIL_GIFT') checkLimit = false;

            if (checkLimit && currentUsed >= MAX) { this.say(this.channel, `@${username}, you hit the limit! [3/3]`); return; }

            // Determine how many we *can* use
            let loopCount = amountReq;
            if (checkLimit && currentUsed + loopCount > MAX) loopCount = MAX - currentUsed;
            if (loopCount <= 0 && checkLimit) { this.say(this.channel, `@${username}, limit reached!`); return; }

            // Valid Target User resolution
            let validTargetUser = null;
            if (targetName) {
                validTargetUser = this.db.getUser(targetName);
                if (!validTargetUser) { this.say(this.channel, `@${username}, target @${targetName} not found.`); return; }
                if (!validTargetUser.buffs) validTargetUser.buffs = {};
            }

            // If Specific Mode: Check Stock & Target Reqs early
            if (!isRandom) {
                const userHas = (activeInventory[specificItemKey]) ? activeInventory[specificItemKey] : 0;
                if (userHas <= 0) { this.say(this.channel, `@${username}, you don't have that item!`); return; }
                if (loopCount > userHas) { this.say(this.channel, `@${username}, you only have ${userHas}x!`); return; }

                const def = ITEMS[specificItemKey];
                if (def.isTargeted && !validTargetUser) {
                    this.say(this.channel, `@${username}, ${def.name} requires a target!`);
                    return;
                }
            }

            // 6. Application Loop
            let actualApplied = 0;
            let itemsProcessed = 0;
            const usedItemKeys = [];

            for (let i = 0; i < loopCount; i++) {
                let currentItemKey = specificItemKey;

                // RANDOM SELECTION LOGIC
                if (isRandom) {
                    const candidates = Object.keys(activeInventory).filter(k => {
                        if (activeInventory[k] <= 0) return false;
                        const d = ITEMS[k];
                        if (!d) return false;

                        // EXCLUDE TRAIL BOX FROM RANDOM
                        if (d.stat === 'TRAIL_GIFT') return false;

                        // Target Logic Checks
                        if (d.isTargeted && !validTargetUser) return false;

                        // NEW: Check Buff Limit for Targets
                        if (validTargetUser && validTargetUser !== user) {
                            // If trying to add a BUFF (not attack)
                            if (!d.isTargeted) {
                                if ((validTargetUser.buffs._externalBuffs || 0) >= 2) return false;
                            }
                            // If trying to add THORNS (Limit 1)
                            if (d.stat === 'THORNS' && validTargetUser.buffs._hasThorns) return false;
                        }

                        return true;
                    });

                    if (candidates.length === 0) break; // No usable items left
                    currentItemKey = candidates[Math.floor(Math.random() * candidates.length)];
                }

                const def = ITEMS[currentItemKey];
                const receiver = validTargetUser || user;

                // Check for External Application (Buffing a friend)
                const isExternal = validTargetUser && validTargetUser !== user;
                const isBuff = !def.isTargeted; // Items without target requirement are buffs

                // STOP if limit reached (Specific Item Case)
                if (!isRandom && isExternal && isBuff) {
                    if ((receiver.buffs._externalBuffs || 0) >= 2) {
                        this.say(this.channel, `🛑 @${receiver.name} has max (2) buffs from others!`);
                        break;
                    }
                }

                // Special Handling for "Attack" items
                if (def.isTargeted && validTargetUser) {
                    if (validTargetUser.buffs._hasThorns && def.stat === "THORNS") {
                        if (!isRandom) {
                            this.say(this.channel, `🛑 @${receiver.name} already has Thorns!`);
                            break;
                        } else continue;
                    }

                    if (def.stat === "THORNS") {
                        validTargetUser.buffs._hasThorns = 1;
                    } else {
                        const stats = ["RUN", "SWIM", "CLIMB", "JUMP", "GLIDE"];
                        const rs = stats[Math.floor(Math.random() * stats.length)];
                        validTargetUser.buffs[rs] = (validTargetUser.buffs[rs] || 0) - 1;
                    }
                }
                // NEW: TRAIL BOX LOGIC
                else if (def.stat === "TRAIL_GIFT") {
                    // Ensure unlockedTrails array exists on RECEIVER (Target or Self)
                    if (!receiver.unlockedTrails) receiver.unlockedTrails = ['default'];

                    // 1. Identify all unowned trails (excluding default)
                    const allTrailKeys = Object.keys(TRAILS).filter(k => k !== 'default');
                    const unowned = allTrailKeys.filter(k => !receiver.unlockedTrails.includes(k));

                    if (unowned.length === 0) {
                        // Fallback: User has collected EVERYTHING
                        const comp = 25;
                        receiver.coins = (receiver.coins || 0) + comp;

                        if (receiver === user) {
                            this.say(this.channel, `🎁 @${receiver.name} already owns ALL trails! The Trail Box contained ${comp} coins instead.`);
                        } else {
                            this.say(this.channel, `🎁 @${user.name} sent a Trail Box to @${receiver.name}, but they own everything! They got ${comp} coins.`);
                        }
                    } else {
                        // 2. Determine Target Rarity via Weights
                        const roll = Math.random();
                        let targetRarity = 'common';
                        if (roll < 0.35) targetRarity = 'common';       // 35% Common
                        else if (roll < 0.65) targetRarity = 'rare';    // 30% Rare
                        else if (roll < 0.80) targetRarity = 'epic';    // 15% Epic
                        else if (roll < 0.90) targetRarity = 'novelty'; // 10% Novelty
                        else targetRarity = 'legendary';                // 10% Legendary (inc. Special)

                        // 3. Filter unowned list by target rarity
                        let pool = unowned.filter(k => TRAILS[k].rarity === targetRarity);

                        // 4. Smart Fallback: If no unowned trails of that specific rarity exist, 
                        // fall back to ANY unowned trail to ensure they get something new.
                        if (pool.length === 0) {
                            pool = unowned;
                        }

                        // 5. Pick and Unlock
                        const finalKey = pool[Math.floor(Math.random() * pool.length)];
                        const trailDef = TRAILS[finalKey];

                        receiver.unlockedTrails.push(finalKey);

                        if (receiver === user) {
                            this.say(this.channel, `🎁 @${receiver.name} opened a Trail Box and unlocked: [${trailDef.rarity.toUpperCase()}] ${trailDef.name}!`);
                        } else {
                            this.say(this.channel, `🎁 @${user.name} gifted a Trail Box to @${receiver.name}! They unlocked: [${trailDef.rarity.toUpperCase()}] ${trailDef.name}!`);
                        }
                    }
                }
                // Special "Global" items
                else if (def.isSpecial && def.stat === "ALL") {
                    ["RUN", "SWIM", "CLIMB", "JUMP", "GLIDE"].forEach(s => receiver.buffs[s] = (receiver.buffs[s] || 0) + 1);
                    if (isExternal) receiver.buffs._externalBuffs = (receiver.buffs._externalBuffs || 0) + 1;
                }
                // Standard Items
                else {
                    receiver.buffs[def.stat] = (receiver.buffs[def.stat] || 0) + def.amount;
                    if (def.stat2) receiver.buffs[def.stat2] = (receiver.buffs[def.stat2] || 0) + def.amount2;

                    if (isExternal) receiver.buffs._externalBuffs = (receiver.buffs._externalBuffs || 0) + 1;
                }

                // DEDUCT from SENDER (Using activeInventory reference)
                activeInventory[currentItemKey]--;
                if (activeInventory[currentItemKey] <= 0) delete activeInventory[currentItemKey];

                itemsProcessed++;

                // Only increment usage count (and trigger feedback) if NOT a trail box
                if (def.stat !== 'TRAIL_GIFT') {
                    user.buffs._itemsUsed = (user.buffs._itemsUsed || 0) + 1;
                    actualApplied++;
                    usedItemKeys.push(currentItemKey);
                }
            }

            this.db.save();

            // 7. Feedback
            if (actualApplied > 0) {
                const usedNow = user.buffs._itemsUsed;
                const msgSuffix = `[${usedNow}/${MAX}]`;

                if (isRandom) {
                    // Condensed Random Feedback
                    const counts = {};
                    usedItemKeys.forEach(k => counts[k] = (counts[k] || 0) + 1);
                    const summary = Object.entries(counts).map(([k, c]) => {
                        const d = ITEMS[k];
                        const statStr = this.getItemStatsStr(d);
                        return `${d.name} (x${c}) ${statStr}`.trim();
                    }).join(', ');
                    let msg = `🎲 @${username} used random items: ${summary}`;
                    if (validTargetUser) msg += ` on @${validTargetUser.name}`;
                    this.say(this.channel, `${msg}! ${msgSuffix}`);
                } else {
                    // Specific Item Feedback (Detailed Stats)
                    const def = ITEMS[specificItemKey];
                    const statStr = this.getItemStatsStr(def);
                    let actionMsg = `${def.name} (x${actualApplied}) ${statStr}`.trim();
                    if (validTargetUser && validTargetUser !== user) actionMsg += ` on @${validTargetUser.name}`;
                    this.say(this.channel, `✨ @${username} used: ${actionMsg}! ${msgSuffix}`);
                }

                // Update UI SENDER
                const pSender = this.game.players.find(pl => pl.name.toLowerCase() === username.toLowerCase());
                if (pSender) {
                    // Sync the inventory that was actually modified
                    if (this.game.isGrandPrix) {
                        // If using a Trail Box in Gauntlet, we modified MAIN inventory.
                        // However, the UI is likely showing GP inventory.
                        // We update the GP pointer just in case, but Trail Box removal won't show in GP inventory UI (correctly).
                        // If standard item, activeInventory IS gpInventory, so UI updates.
                        pSender.gpInventory = user.gpInventory;
                    } else {
                        pSender.inventory = user.inventory;
                    }

                    // Recalculate Buffs (Source of Truth)
                    this.game.recalculatePlayerBuffs(pSender);
                }

                // Resolve Target Player Instance
                const pTarget = validTargetUser ?
                    this.game.players.find(pl => pl.name.toLowerCase() === validTargetUser.name.toLowerCase()) :
                    pSender;

                if (pTarget) {
                    // If target is different from sender, ensure their stats are recalculated too
                    if (pTarget !== pSender) {
                        this.game.recalculatePlayerBuffs(pTarget);
                    }

                    // Visuals (For both self and other)
                    const lastKey = usedItemKeys.length > 0 ? usedItemKeys[usedItemKeys.length - 1] : specificItemKey;
                    const lastDef = ITEMS[lastKey] || { name: 'ITEM', isTargeted: false };

                    if (lastDef.isTargeted) pTarget.showFloatingText("HIT!", "#ef4444", "💥");
                    else pTarget.showFloatingText("BUFF!", "#4ade80", "✨");
                }

                this.game.updateUI();
            } else {
                // Check totalProcessed to avoid "no usable items" error if we successfully opened a Trail Box
                if (isRandom && itemsProcessed === 0) this.say(this.channel, `@${username}, no usable random items found!`);

                // If only trail box was processed, ensure UI updates for inventory (since loop doesn't trigger UI update block above)
                if (itemsProcessed > 0) {
                    const pSender = this.game.players.find(pl => pl.name.toLowerCase() === username.toLowerCase());
                    if (pSender) {
                        if (this.game.isGrandPrix) pSender.gpInventory = user.gpInventory;
                        else pSender.inventory = user.inventory;
                        this.game.updateUI();
                    }
                }
            }
        }

        // --- HELP COMMAND (Universal) ---
        if (['!racecommands', '!help'].includes(command)) {
            const query = args.slice(1).join(' ').trim().toLowerCase();

            // MODERATOR: Open Modal with Filter (or close it)
            if (isMod) {
                if (query === 'close') {
                    this.game.closeCommandsModal();
                } else {
                    this.game.openCommandsModal(query);
                }
                return;
            }

            // VIEWER: Chat Response
            if (!query) {
                this.say(this.channel, `@${username}, use !help <search> to find commands (e.g. !help coin).`);
                return;
            }

            // Search Data
            const allData = this.game.getHelpData();
            let match = null;

            // Find first matching item
            for (const cat of allData) {
                for (const item of cat.items) {
                    if (item.cmd.toLowerCase().includes(query) ||
                        item.aliases.some(a => a.includes(query)) ||
                        item.desc.toLowerCase().includes(query)) {
                        match = item;
                        break;
                    }
                }
                if (match) break;
            }

            if (match) {
                this.say(this.channel, `💡 COMMAND: ${match.cmd} | DESC: ${match.desc} | EX: ${match.example}`);
            } else {
                this.say(this.channel, `@${username}, no commands found for "${query}".`);
            }
            return;
        }

        // --- ADMIN COMMANDS ---
        if (isMod) {
            if (['!closehelp', '!hidehelp'].includes(command)) {
                this.game.closeCommandsModal();
            }

            if (command === '!startrace' || command === '!racestart' || command === '!start' || command === '!forcestart') {
                // Auto-close any open settings/command modals
                this.game.closeCommandsModal();
                const settings = document.getElementById('settingsModal');
                if (settings) settings.classList.add('hidden');

                if (this.game.state === 'LOBBY') this.game.startCountdown();
            }
            if (command === '!addbot') {
                if (this.game.state === 'LOBBY') {
                    this.game.addBot();
                } else {
                    this.say(this.channel, `🤖 You can only add bots when the lobby is open!`);
                }
            }
            if (command === '!kick' && args[1]) {
                if (this.game.state === 'LOBBY') {
                    this.game.removePlayer(args[1].replace('@', ''));
                } else {
                    this.say(this.channel, `👢 You can only kick players when the lobby is open!`);
                }
            }

            if (command === '!openwheel' || command === '!showwheel') {
                if (['RACING', 'BETTING', 'COUNTDOWN'].includes(this.game.state)) {
                    this.say(this.channel, `🎡 You cannot open the wheel while a race is active or starting!`);
                } else {
                    window.safeViewTransition(() => document.getElementById('chanceWheelModal').classList.remove('hidden'));
                }
            }
            if (['!closewheel', '!hidewheel'].includes(command)) {
                const modal = document.getElementById('chanceWheelModal');
                if (modal && !modal.classList.contains('hidden')) {
                    this.game.closeWheel();
                }
            }
            if (command === '!spinnow' || command === '!triggerwheel') {
                const modal = document.getElementById('chanceWheelModal');
                if (modal && !modal.classList.contains('hidden')) {
                    this.game.processSpinQueue();
                }
            }

            if (command === '!raceopen' || command === '!solorace') {
                this.game.openLobby();
            }

            // --- NEW DEBUG COMMAND ---
            if (command === '!forcecrown') {
                // Apply 'Winner' status to self immediately to test visuals
                const p = this.game.players.find(pl => pl.name.toLowerCase() === userKey);
                if (p) {
                    p.lastResult = 'winner';
                    p.updateDOMVisuals();
                    this.say(this.channel, `👑 Force applied crown to @${p.name}`);
                }
            }

            if (command === '!raceclear' || command === '!clearrace') {
                this.game.returnToLobby();
                this.announce("🗑️ Lobby Cleared & Reset!");
            }

            if (command === '!teamrace') { this.game.startTeamRace(); }
            if (command === '!relayrace') { this.game.startRelayRace(); }
            if (command === '!party' || command === '!partymode') { this.game.togglePartyMode(); }
            if (command === '!elim' || command === '!elimination') { this.game.toggleEliminationMode(); }
            if (command === '!gauntlet') { this.game.toggleGrandPrixMode(); }
            if (command === '!endgauntlet') { this.game.forceEndGrandPrix(); }
            if (command === '!skipwait' || command === '!nextrace' || command === '!forcenext') {
                if (this.game.isGrandPrix && this.game.gpSeriesActive) {
                    this.game.skipGPWait();
                }
            }
            // NEW: Manual Refund Command
            if (command === '!refund' && args[1]) {
                const target = args[1].replace('@', '');
                // Find by case-insensitive name key
                const targetKey = Object.keys(this.game.currentBets).find(k => k.toLowerCase() === target.toLowerCase());

                if (targetKey) {
                    const bet = this.game.currentBets[targetKey];
                    // UPDATE: Use bet.userId for robust refunding
                    const { user } = this.db.getOrCreateUser(targetKey, bet.userId || null);
                    user.coins = (user.coins || 0) + bet.amount;
                    this.db.save();

                    delete this.game.currentBets[targetKey];
                    this.db.saveActiveBets(this.game.currentBets);

                    this.say(this.channel, `🔄 Manually refunded ${bet.amount} coins to @${targetKey}.`);
                    this.game.updateBettingUI();
                } else {
                    this.say(this.channel, `@${username}, no active bet found for ${target}.`);
                }
            }
            if (command === '!resetracer') {
                const isBroadcaster = (tags.username.toLowerCase() === this.channel.toLowerCase()) || (tags.badges && tags.badges.broadcaster);
                if (!isBroadcaster || !args[1]) return;
                const targetName = args[1].replace('@', '');
                const targetKey = targetName.toLowerCase();

                if (this.game.players.some(p => p.name.toLowerCase() === targetKey)) {
                    this.say(this.channel, `🛑 Cannot reset @${targetName} while they are in the lobby!`);
                    return;
                }

                // Updated for ID System: Search by key OR by name property
                let foundKey = null;
                if (this.db.players[targetKey]) {
                    foundKey = targetKey;
                } else {
                    foundKey = Object.keys(this.db.players).find(k => this.db.players[k].name && this.db.players[k].name.toLowerCase() === targetKey);
                }

                if (foundKey) {
                    delete this.db.players[foundKey];
                    this.db.save();
                    this.say(this.channel, `🚫 FULL RESET: Wiped all stats for @${targetName}.`);
                } else {
                    this.say(this.channel, `@${targetName} not found in database.`);
                }
            }

            if (['!calm', '!normal', '!chaos'].includes(command)) {
                const freq = command.substring(1);
                this.db.config.partyFrequency = freq;
                this.db.saveConfig();

                this.say(this.channel, `🎉 Party Frequency set to: ${freq.toUpperCase()}`);

                // Refresh Settings UI if open
                if (!document.getElementById('settingsModal').classList.contains('hidden')) {
                    this.game.openSettings();
                }
            }
        }
    }
}

const ITEM_KEYS = Object.keys(ITEMS);

class ParticleManager {
    constructor() {
        this.particles = [];
        this.pool = [];
        // Pre-allocate large pool to prevent GC spikes during showers
        for (let i = 0; i < 3000; i++) {
            this.pool.push({
                x: 0, y: 0, vx: 0, vy: 0,
                life: 0, decay: 0,
                color: '#fff', size: 1, type: 'spark',
                active: false,
                angle: 0, spin: 0
            });
        }
    }

    emitConfettiShower(cameraX, width, height) {
        // Vibrant neon palette
        const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#06b6d4', '#ffffff'];
        const count = 500; // Heavy shower

        for (let i = 0; i < count; i++) {
            if (this.pool.length === 0) return;

            const p = this.pool.pop();
            p.active = true;
            // Spawn widely across the camera view
            p.x = (cameraX - 200) + Math.random() * (width + 400);
            // Start well above the screen to rain down
            p.y = -Math.random() * height * 1.5;

            p.color = colors[Math.floor(Math.random() * colors.length)];
            p.type = 'confetti_fall';

            p.vx = (Math.random() - 0.5) * 3; // Horizontal sway
            p.vy = 4 + Math.random() * 5;     // Fast fall speed

            p.life = 1.2; // Longer life to ensure they reach bottom
            p.decay = 0.001 + Math.random() * 0.003;
            p.size = 6 + Math.random() * 5;
            p.angle = Math.random() * Math.PI * 2;
            p.spin = (Math.random() - 0.5) * 0.3;

            this.particles.push(p);
        }
    }

    emit(x, y, type, color, count = 1) {
        for (let i = 0; i < count; i++) {
            if (this.pool.length === 0) return;

            const p = this.pool.pop();
            p.active = true;
            p.x = x;
            p.y = y;
            p.type = type;
            p.angle = Math.random() * Math.PI * 2;
            p.spin = (Math.random() - 0.5) * 0.5;

            // Auto-vibrance: If white/grey is requested for sparks/boosts, use randomized neon colors
            let finalColor = color;
            if ((type === 'spark' || type === 'boost' || type === 'confetti') &&
                (!color || color === '#fff' || color === '#ffffff' || color === '#ccc')) {
                finalColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 65%)`;
            }
            p.color = finalColor;

            if (type === 'spark') {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 2; // Faster expansion
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
                p.life = 1.0;
                p.decay = 0.03 + Math.random() * 0.04;
                p.size = Math.random() * 4 + 2; // Bigger sparks
            }
            else if (type === 'smoke') {
                const angle = Math.random() * Math.PI * 2;
                p.vx = Math.cos(angle) * 0.5;
                p.vy = -Math.random() * 2 - 1; // Faster rising
                p.life = 0.8;
                p.decay = 0.02;
                p.size = Math.random() * 6 + 4;
            }
            else if (type === 'boost') {
                // Intense trail
                p.vx = (Math.random() - 0.5) * 4;
                p.vy = (Math.random() - 0.5) * 4;
                p.life = 0.6;
                p.decay = 0.06;
                p.size = Math.random() * 5 + 3;
            }
            else if (type === 'confetti') {
                // Explosion confetti (Finish line burst)
                p.vx = (Math.random() - 0.5) * 10;
                p.vy = (Math.random() - 0.5) * 10 - 2;
                p.life = 1.0;
                p.decay = 0.015;
                p.size = 5;
            }

            this.particles.push(p);
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.type === 'smoke') {
                p.size += 0.2;
                p.vx *= 0.95;
            }
            else if (p.type === 'confetti_fall') {
                p.angle += p.spin;
                // Swaying motion
                p.x += Math.sin(p.life * 10) * 1.5;
            }
            else if (p.type === 'confetti') {
                p.angle += p.spin;
                p.vy += 0.25; // Heavy gravity
                p.vx *= 0.95; // Air drag
            }
            else if (p.type === 'spark' || p.type === 'boost') {
                p.vx *= 0.9;
                p.vy *= 0.9;
            }

            if (p.life <= 0) {
                p.active = false;
                this.pool.push(p); // Recycle
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx, cameraX) {
        const screenW = ctx.canvas.width;

        // --- PASS 1: SOLID PARTICLES (Smoke, Confetti) ---
        ctx.save();
        for (const p of this.particles) {
            if (p.life <= 0) continue;
            // Culling
            if (p.x < cameraX - 100 || p.x > cameraX + screenW + 100) continue;

            // Separate pass for glow
            if (p.type === 'spark' || p.type === 'boost') continue;

            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;

            if (p.type.includes('confetti')) {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();

        // --- PASS 2: GLOWING PARTICLES (Additive Blending) ---
        ctx.save();
        ctx.globalCompositeOperation = 'lighter'; // This makes them glow

        for (const p of this.particles) {
            if (p.life <= 0) continue;
            if (p.x < cameraX - 100 || p.x > cameraX + screenW + 100) continue;

            if (p.type !== 'spark' && p.type !== 'boost') continue;

            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

class Projectile {
    constructor(owner, target, item) {
        this.owner = owner;
        this.target = target;
        this.item = item;
        // Line duration: 45 frames (0.75s)
        this.lifeTimer = 45;
        this.active = true;
    }

    update(dt) {
        if (!this.active) return;
        this.lifeTimer--;
        if (this.lifeTimer <= 0) {
            this.hit(this.target);
        }
    }

    hit(victim) {
        this.active = false;
        if (victim.finished) return;

        if (victim.partyStatus.shield > 0) {
            victim.showFloatingText("BLOCKED!", "#f97316", "🔥");
            if (window.game && window.game.particles) {
                window.game.particles.emit(victim.x, victim.y - 20, 'spark', '#60a5fa', 5);
            }
            victim.partyStatus.shield = 0;
            return;
        }

        // Visual Effects
        if (window.game && window.game.particles) {
            if (this.item.id === 'VIRUS') window.game.particles.emit(victim.x, victim.y - 20, 'smoke', '#4ade80', 8);
            else if (this.item.id === 'DDOS') window.game.particles.emit(victim.x, victim.y - 20, 'spark', '#000000', 10);
            else if (this.item.id === 'REMOTE_TRANSFER') window.game.particles.emit(victim.x, victim.y - 20, 'spark', '#22d3ee', 10);
            else window.game.particles.emit(victim.x, victim.y - 20, 'spark', '#ef4444', 8);
        }

        if (this.item.id === 'DDOS') {
            victim.showFloatingText("SYSTEM FAILURE", "#000000", "💀");
            victim.partyStatus.stunned = 180;
            victim.partyStatus.blackout = 180;
            victim.x -= 50;
        }
        else if (this.item.id === 'PACKET_LOSS') {
            victim.showFloatingText("PACKET LOSS!", "#eab308", "📉");
            victim.x -= 300;
            victim.partyStatus.stunned = 30;
        }
        else if (this.item.id === 'VIRUS') {
            victim.showFloatingText("INFECTED!", "#4ade80", "🦠");
            victim.partyStatus.slowed = 240;
        }
        else if (this.item.id === 'REMOTE_TRANSFER') {
            // SWAP POSITIONS
            const myX = this.owner.x;
            this.owner.x = victim.x;
            victim.x = myX;

            // Visuals
            this.owner.showFloatingText("WARPED!", "#22d3ee", "🔄");
            victim.showFloatingText("SWAPPED!", "#ef4444", "🔄");

            // Reset trails so they don't draw a massive line across the screen
            this.owner.trailHistory = [];
            victim.trailHistory = [];
        }
        else {
            // Ping Spike
            victim.showFloatingText("LAG SPIKE!", "#ef4444", "📡");
            victim.partyStatus.stunned = 90;
        }
    }
}

class Trap {
    constructor(owner, x, y, item) {
        this.owner = owner;
        this.x = x;
        this.y = y;
        this.item = item;
        this.active = true;
    }

    checkCollision(player, game) {
        if (!this.active || player.finished) return false;

        // 1. Owner Immunity
        if (player === this.owner) return false;

        // 2. Friendly Fire Check
        if ((game.isTeamRace || game.isRelayRace) &&
            player.team && this.owner.team &&
            player.team.id === this.owner.team.id) {
            return false;
        }

        // 3. Stealth Immunity (VPN / Ghost)
        if (player.partyStatus.stealthed > 0) return false;

        if (Math.abs(player.x - this.x) < 40) {
            this.trigger(player, game);
            return true;
        }
        return false;
    }

    trigger(victim, game) {
        this.active = false;

        if (victim.partyStatus.shield > 0) {
            victim.showFloatingText("DELETED!", "#f97316", "🔥");
            if (game.particles) game.particles.emit(victim.x, victim.y - 20, 'spark', '#60a5fa', 5);
            victim.partyStatus.shield = 0;
            return;
        }

        // Explosion Effect
        if (game.particles) {
            game.particles.emit(this.x, this.y, 'confetti', '#fbbf24', 8);
            game.particles.emit(this.x, this.y, 'smoke', '#555', 5);
        }

        if (this.item.id === 'BSOD') {
            victim.showFloatingText("FATAL ERROR", "#3b82f6", "🟦");
            victim.partyStatus.stunned = 240;
        }
        else if (this.item.id === 'ZIP_BOMB') {
            victim.showFloatingText("DECOMPRESSING...", "#fbbf24", "💥");
            victim.partyStatus.slowed = 180;

            if (game) {
                game.players.forEach(p => {
                    // SPLASH DAMAGE LOGIC
                    if (p !== victim && !p.finished && Math.abs(p.x - this.x) < 200) {
                        if (p === this.owner) return;
                        if ((game.isTeamRace || game.isRelayRace) && p.team && this.owner.team && p.team.id === this.owner.team.id) return;

                        if (p.partyStatus.stealthed <= 0) {
                            p.showFloatingText("SPLASH!", "#fbbf24", "💥");
                            p.partyStatus.slowed = 120;
                            if (game.particles) game.particles.emit(p.x, p.y - 20, 'smoke', '#fbbf24', 3);
                        }
                    }
                });
            }
        }
        else {
            victim.showFloatingText("SPAMMED!", "#fbbf24", "📧");
            victim.partyStatus.slowed = 180;
        }
    }
}


const TEAMS = [
    { id: 'red', name: 'RED TEAM', color: '#fb7185', class: 'team-card-red', icon: '⚔️', motto: "Speed & Fury", aliases: ['sword', 'swords', 'blade'] },
    { id: 'blue', name: 'BLUE TEAM', color: '#3b82f6', class: 'team-card-blue', icon: '🛡️', motto: "Cool & Calculated", aliases: ['shield', 'shields', 'guard'] },
    { id: 'orange', name: 'ORANGE TEAM', color: '#fbbf24', class: 'team-card-orange', icon: '🔥', motto: "Chaos & Fire", aliases: ['fire', 'flame', 'burn'] },
    { id: 'purple', name: 'PURPLE TEAM', color: '#a855f7', class: 'team-card-purple', icon: '🔮', motto: "Royalty & Void", aliases: ['orb', 'crystal', 'magic', 'void'] },
    { id: 'green', name: 'GREEN TEAM', color: '#22c55e', class: 'team-card-green', icon: '🌿', motto: "Growth & Power", aliases: ['leaf', 'nature', 'plant'] }
];

const THEMES = {
    RUN: [
        { name: 'Grasslands', bg: ['#2d4a22', '#3e6b2f'], accent: '#598c46', decor: 'grass' },
        { name: 'Mars', bg: ['#612818', '#8a3a25'], accent: '#b55338', decor: 'crater' },
        { name: 'Neon Grid', bg: ['#1a1a2e', '#16213e'], accent: '#e94560', decor: 'grid' },
        { name: 'Volcano', bg: ['#450a0a', '#7f1d1d'], accent: '#ef4444', decor: 'lava' },
        { name: 'Space Station', bg: ['#27272a', '#52525b'], accent: '#22d3ee', decor: 'station' },
        { name: 'Graveyard', bg: ['#0f172a', '#020617'], accent: '#94a3b8', decor: 'tombstone' }
    ],
    SWIM: [
        { name: 'Ocean', bg: ['#1e3a8a', '#2563eb'], accent: '#60a5fa', decor: 'bubble' },
        { name: 'Blood River', bg: ['#450a0a', '#7f1d1d'], accent: '#991b1b', decor: 'bubble_red' },
        { name: 'Toxic Sludge', bg: ['#14532d', '#166534'], accent: '#4ade80', decor: 'bubble_green' },
        { name: 'Underwater City', bg: ['#020617', '#1e1b4b'], accent: '#f59e0b', decor: 'coral_city' },
        { name: 'Styx River', bg: ['#020617', '#172554'], accent: '#6366f1', decor: 'soul' }
    ],
    CLIMB: [
        { name: 'Granite Wall', bg: ['#292524', '#44403c'], accent: '#57534e', decor: 'rock' },
        { name: 'Ice Cliff', bg: ['#083344', '#164e63'], accent: '#22d3ee', decor: 'ice' },
        { name: 'Obsidian Spire', bg: ['#0f0f0f', '#1f1f1f'], accent: '#7f1d1d', decor: 'shard' },
        { name: 'Forbidden Library', bg: ['#1a0f0a', '#2d1b14'], accent: '#f59e0b', decor: 'library' },
        { name: 'Haunted Spire', bg: ['#2e1065', '#4c1d95'], accent: '#a855f7', decor: 'gargoyle' }
    ],
    JUMP: [
        { name: 'Forest Logs', bg: ['#2d4a22', '#3f6212'], accent: '#84cc16', obs: 'log' },
        { name: 'Space Crates', bg: ['#020617', '#1e1b4b'], accent: '#a855f7', obs: 'crate' },
        { name: 'Void Pits', bg: ['#000000', '#2e1065'], accent: '#f43f5e', decor: 'void_nebula', obs: 'neon_pit' },
        { name: 'Crystal Cave', bg: ['#2e1065', '#4c1d95'], accent: '#e879f9', obs: 'crystal_spike', decor: 'crystal_cave_bg' },
        { name: 'Catacombs', bg: ['#1c1917', '#000000'], accent: '#78350f', obs: 'bone_pile', decor: 'crypt' }
    ],
    GLIDE: [
        { name: 'Sky Chasm', bg: ['#4c1d95', '#5b21b6'], accent: '#a78bfa', decor: 'cloud' },
        { name: 'Star Fall', bg: ['#1e1b4b', '#312e81'], accent: '#c7d2fe', decor: 'star' },
        { name: 'Cyber City', bg: ['#0f172a', '#1e293b'], accent: '#38bdf8', decor: 'building' },
        { name: 'Aurora Sky', bg: ['#020617', '#172554'], accent: '#4ade80', decor: 'aurora' },
        { name: 'Phantom Sky', bg: ['#0f172a', '#312e81'], accent: '#94a3b8', decor: 'phantom' }
    ]
};

// NEW: Hazard Definitions
const HAZARDS = {
    RUN: { name: 'EARTHQUAKE', icon: '🌋', desc: 'Ground tremors slow you down!', effect: 'shake', color: '#ef4444' },
    SWIM: { name: 'TSUNAMI', icon: '🌊', desc: 'Huge waves crash against racers!', effect: 'wave', color: '#3b82f6' },
    CLIMB: { name: 'ROCKSLIDE', icon: '🪨', desc: 'Falling boulders!', effect: 'rock', color: '#78350f' },
    JUMP: { name: 'GRAVITY WELL', icon: '🌌', desc: 'Heavy gravity pulls you down!', effect: 'gravity', color: '#a855f7' },
    GLIDE: { name: 'SOLAR FLARE', icon: '☀️', desc: 'Blinding light and heat!', effect: 'flash', color: '#f59e0b' }
};

const BOOSTS = {
    RUN: { name: 'SMOOTH GROUND', icon: '✨', desc: 'Perfect surface for speed!', effect: 'speed', color: '#4ade80' },
    SWIM: { name: 'RAPID CURRENT', icon: '🌊', desc: 'Fast flowing water!', effect: 'flow', color: '#60a5fa' },
    CLIMB: { name: 'EASY GRIP', icon: '🪜', desc: 'Perfect handholds!', effect: 'grip', color: '#c084fc' },
    JUMP: { name: 'LOW GRAVITY', icon: '🌑', desc: 'Jump higher and further!', effect: 'float', color: '#facc15' },
    GLIDE: { name: 'SLIPSTREAM', icon: '💨', desc: 'Wind at your back!', effect: 'stream', color: '#f472b6' }
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};
const seededRand = (x, min, max) => { const n = Math.sin(x * 12.9898 + 78.233) * 43758.5453; const r = n - Math.floor(n); return Math.floor(r * (max - min + 1)) + min; };
const log = (msg) => { const c = document.getElementById('consoleLog'); if (c) { c.innerHTML = `<div>> ${msg}</div>` + c.innerHTML; if (c.children.length > 20) c.lastChild.remove(); } };

// Removed generateInitialStats: Now using unified GameLogic.generateStats

class Player {
    constructor(name, avatarInput, isBot = false, gameInstance, id = null) {
        this.name = name;
        this.id = id; // Store Twitch ID
        this.isBot = isBot;

        this.avatar = null;
        this.avatarImgUrl = null;
        this.el = null;

        // NEW: Track personal result state
        this.lastResult = null; // 'winner' | 'loser' | null

        // NEW: Season Stats Container
        this.season = {
            wins: 0, wins2: 0, wins3: 0,
            tWins: 0, tWins2: 0, tWins3: 0,
            rWins: 0, rWins2: 0, rWins3: 0,
            totalRaces: 0,
            tTotalRaces: 0,
            rTotalRaces: 0
        };

        this.partyStatus = {
            nextRollTime: 3 + Math.random() * 5,
            holdingItem: null, useTimer: 0, isRolling: false,
            shield: 0, boost: 0, stunned: 0, slowed: 0, virus: 0,
            blackout: 0, stealthed: 0
        };
        this.lastPartyRoll = 0;

        // Handle Avatar Input
        if (avatarInput) {
            this.setAvatar(avatarInput);
        } else {
            this.setAvatar(randItem(CONFIG.avatars));
        }

        this.raceVariance = { RUN: 0, SWIM: 0, CLIMB: 0, JUMP: 0, GLIDE: 0 };
        this.varianceApplied = false;

        this.trailHistory = [];
        this.activeTrail = 'default';

        if (isBot) {
            const botRoll = Math.random();
            const botClass = (botRoll < 0.33) ? "specialist" : ((botRoll < 0.66) ? "dualist" : "balanced");
            this.stats = GameLogic.generateStats(botClass);
            this.class = botClass;
            this.applyBotVariance();
        }
        else {
            this.stats = { RUN: 1, SWIM: 1, CLIMB: 1, JUMP: 1, GLIDE: 1 };
        }

        this.tempBuffs = { RUN: 0, SWIM: 0, CLIMB: 0, JUMP: 0, GLIDE: 0 };
        this.chanceTickets = 0; // NEW: Chance Wheel Tickets
        this.wins = 0; this.wins2 = 0; this.wins3 = 0;
        this.tWins = 0; this.tWins2 = 0; this.tWins3 = 0;
        this.rWins = 0; this.rWins2 = 0; this.rWins3 = 0;
        this.totalRaces = 0;
        this.tTotalRaces = 0;
        this.rTotalRaces = 0;
        this.inventory = {};

        this.isLoading = false;

        this.x = 0; this.y = 0; this.finished = false; this.finishTime = 0; this.didEvolve = false;
        this.lobbyX = 0; this.lobbyY = 0;
        this.lobbyTargetX = 0; this.lobbyTargetY = 0;
        this.lobbySpeed = 0;
        this.animOffset = 0;

        this.ability = null;
        this.abilityUsed = false;
        this.abilityActive = false;
        this.abilityTimer = 0;
        this.relayLeg = 0;
        this.relayWaiting = false;
        this.abilityTarget = null;

        if (!this.isBot) {
            if (Math.random() < 0.5) {
                const abKey = randItem(ABILITY_KEYS);
                this.ability = { key: abKey, ...ABILITIES[abKey] };
            }
        }

        this.createDOMElement();
    }

    applyBotVariance() {
        const roll = Math.random();
        const stats = ['RUN', 'SWIM', 'CLIMB', 'JUMP', 'GLIDE'];
        const target = randItem(stats);

        if (roll < 0.05) {
            this.raceVariance[target] = -1;
            log(`🤖 ${this.name} is having a BAD DAY! (-1 ${target})`);
        }
        else if (roll < 0.25) {
            this.raceVariance[target] = 1;
            log(`🤖 ${this.name} is having a GOOD DAY! (+1 ${target})`);
        }
    }

    createDOMElement() {
        const div = document.createElement('div');
        div.className = 'racer-avatar';
        document.getElementById('avatarLayer').appendChild(div);
        this.el = div;
        this.updateDOMVisuals();
    }

    setAvatar(val, onLoadCallback) {
        // 1. Check if it's a URL
        if (val && val.startsWith('http')) {
            const img = new Image();
            img.src = val;
            img.onload = () => {
                this.avatar = val;
                this.avatarImgUrl = val;
                this.updateDOMVisuals();
                if (onLoadCallback) onLoadCallback();

                // FIX: Force Main UI Update so Roster sees the new image
                if (window.game && window.game.updateUI) window.game.updateUI();
            };
        }
        // 2. Check if it's a known 7TV Emote
        else if (window.game && window.game.sevenTVEmotes && window.game.sevenTVEmotes[val]) {
            const url = window.game.sevenTVEmotes[val];
            const img = new Image();
            img.src = url;
            img.onload = () => {
                this.avatar = val;
                this.avatarImgUrl = url;
                this.updateDOMVisuals();
                if (onLoadCallback) onLoadCallback();

                // FIX: Force Main UI Update
                if (window.game && window.game.updateUI) window.game.updateUI();
            };
        }
        // 3. Fallback to Emoji/Text
        else {
            this.avatar = val;
            this.avatarImgUrl = null;
            this.updateDOMVisuals();
            if (onLoadCallback) onLoadCallback();
            // FIX: Update UI immediately for text changes too
            if (window.game && window.game.updateUI) window.game.updateUI();
        }
    }

    updateDOMVisuals() {
        if (!this.el) return;

        // SAFETY: Force container to allow items outside its box
        this.el.style.overflow = 'visible';

        const existingFloats = Array.from(this.el.querySelectorAll('.floating-text'));

        let res = this.lastResult ? this.lastResult.toLowerCase() : '';
        let isWinner = (res === 'winner');
        let isLoser = (res === 'loser');

        let content = '';

        // --- FIX: Adjusted Position Back Down ---
        // top: -20px (Closer to head)
        // font-size: 20px (Standard size)
        if (isWinner) {
            content += `<div style="position:absolute; top:-20px; left:33%; transform:translateX(-50%); font-size:20px; z-index:100; text-shadow:0 2px 2px rgba(0,0,0,0.8); animation: bounce 1s infinite;">👑</div>`;
        }
        if (isLoser) {
            content += `<div style="position:absolute; top:-20px; left:33%; transform:translateX(-50%); font-size:20px; z-index:100; text-shadow:0 2px 2px rgba(0,0,0,0.8); animation: wobble 2s infinite;">💩</div>`;
        }

        if (this.avatarImgUrl) {
            content += `<img src="${this.avatarImgUrl}" class="racer-img">`;
        } else {
            // FIX: If avatar string is a URL but image isn't loaded yet, show placeholder instead of raw URL text
            const displayChar = (this.avatar && this.avatar.startsWith('http')) ? '👤' : (this.avatar || '👤');
            content += `<div class="racer-emoji">${displayChar}</div>`;
        }

        let textColor = (this.color || 'white');
        let tagStyle = `color:${textColor};`;

        if (this.team) {
            tagStyle += `border: 2px solid ${this.team.color}; background: rgba(0,0,0,0.7); padding: 2px 6px;`;
        } else if (this.color) {
            tagStyle += `border: 2px solid ${this.color}; background: rgba(0,0,0,0.7); padding: 2px 6px;`;
        }

        const teamIcon = this.team ? `<span style="margin-right:4px">${this.team.icon}</span>` : '';
        content += `<div class="racer-tag" style="${tagStyle}">${teamIcon}${this.name}</div>`;

        this.el.innerHTML = content;
        existingFloats.forEach(f => this.el.appendChild(f));
    }

    // NEW: Optimized Elimination Handler
    onEliminated(game, time) {
        this.eliminated = true;
        this.finishTime = time;

        // RESTORED: Floating Text feedback
        this.showFloatingText("CONSUMED", "#ef4444", "☠️");

        // CRITICAL OPTIMIZATION: Clear heavy arrays immediately
        // This prevents the GC from having to sweep thousands of coordinate points later
        this.trailHistory = [];

        // --- NEW: Party Mode Cleanup ---
        // Stop effects so they don't persist visually or logically
        if (this.partyStatus) {
            this.partyStatus.holdingItem = null;
            this.partyStatus.isRolling = false;
            this.partyStatus.shield = 0;
            this.partyStatus.boost = 0;
            this.partyStatus.virus = 0;
            this.partyStatus.stunned = 0;
            this.partyStatus.slowed = 0;
            this.partyStatus.stealthed = 0;
        }

        // --- NEW: Hazard Cleanup ---
        this.hazardDebuffTimer = 0;
        this.lastHazardSegment = null;

        // Update Visuals immediately so main loop doesn't have to poll DOM styles
        if (this.el) {
            this.el.style.filter = "grayscale(100%) opacity(0.5)";
            this.el.style.zIndex = "0"; // Move behind others

            // Remove Party Visuals
            this.el.classList.remove('party-glow');
            const box = this.el.querySelector('.item-box');
            if (box) box.remove();
        }

        // Visual FX
        if (game && game.particles) {
            game.particles.emit(this.x, this.y - 20, 'smoke', '#ef4444', 8);
        }

        console.log(`💀 ${this.name} eliminated by the glitch!`);
    }

    updatePartyLogic(timeSeconds, rank, totalPlayers, game, timeScale) {
        if (this.finished) {
            // Cleanup
            this.partyStatus.shield = 0;
            this.partyStatus.boost = 0;
            this.partyStatus.virus = 0;
            if (this.el) {
                this.el.classList.remove('party-glow');
                const box = this.el.querySelector('.item-box');
                if (box) box.remove();
            }
            return;
        }

        // A. Start Delay
        if (timeSeconds < 3) return;

        // B. Roll Logic (Randomized timing)
        if (!this.partyStatus.holdingItem && !this.partyStatus.isRolling && timeSeconds > this.partyStatus.nextRollTime) {

            // NEW: Frequency Config Logic for Failure Retry
            let freqConfig = 'normal';
            if (game && game.twitch && game.twitch.db && game.twitch.db.config) {
                freqConfig = game.twitch.db.config.partyFrequency || 'normal';
            }

            // Default Failure Retry: 2.0s to 4.0s
            let retryMin = 2.0;
            let retryMax = 4.0;

            if (freqConfig === 'chaos') {
                // Chaos: Try again very quickly (0.5s - 2s)
                retryMin = 0.5;
                retryMax = 2.0;
            }
            if (freqConfig === 'calm') {
                // Calm: Wait much longer (10s - 20s) to significantly reduce spam
                retryMin = 10.0;
                retryMax = 20.0;
            }

            // FAILURE COOLDOWN: If the roll fails (RNG), this determines when we try again.
            // If the roll SUCCEEDS, the 'usePartyItem' logic will set the long cooldown.
            this.partyStatus.nextRollTime = timeSeconds + retryMin + (Math.random() * (retryMax - retryMin));

            // Attempt the roll
            this.rollForPartyItem(rank, totalPlayers, game);
        }

        // C. Usage Logic
        if (this.partyStatus.holdingItem && this.partyStatus.useTimer > 0) {
            this.partyStatus.useTimer -= 0.016;
            if (this.partyStatus.useTimer <= 0) {
                this.usePartyItem(game, rank, timeSeconds);
            }
        }

        // D. Visual Effects & Timers
        // Decrease Boost (Overclock)
        if (this.partyStatus.boost > 0) {
            this.partyStatus.boost -= (1 * timeScale);
            if (this.el) this.el.classList.add('party-glow');
        } else {
            if (this.el) this.el.classList.remove('party-glow');
        }

        // Decrease Shield (Firewall)
        if (this.partyStatus.shield > 0) this.partyStatus.shield -= (1 * timeScale);

        // Decrease Stun (Ping Spike / DDOS)
        if (this.partyStatus.stunned > 0) this.partyStatus.stunned -= (1 * timeScale);

        // Decrease Slow (Spam Bot / System Update)
        if (this.partyStatus.slowed > 0) this.partyStatus.slowed -= (1 * timeScale);

        // Decrease Virus
        if (this.partyStatus.virus > 0) this.partyStatus.virus -= (1 * timeScale);

        // Decrease Blackout
        if (this.partyStatus.blackout > 0) this.partyStatus.blackout -= (1 * timeScale);

        // Decrease Stealth (VPN)
        if (this.partyStatus.stealthed > 0) this.partyStatus.stealthed -= (1 * timeScale);
    }

    rollForPartyItem(rank, totalPlayers, game) {
        const d6 = Math.floor(Math.random() * 6) + 1;
        let success = false;

        // Mario Kart Logic (Catch-up mechanics)
        if (rank === 1) { if (d6 >= 6) success = true; }
        else if (rank >= totalPlayers - 2) { if (d6 >= 2) success = true; }
        else { if (d6 >= 4) success = true; }

        if (success) {
            this.partyStatus.isRolling = true;

            const roll = Math.random();
            let selectedItem;

            const isFrontRunner = rank <= Math.max(1, totalPlayers / 2);
            let pool = [];

            // Helper to add weighted items
            const add = (id, weight = 1) => {
                const item = PARTY_ITEMS.find(i => i.id === id);
                if (item) {
                    for (let k = 0; k < weight; k++) pool.push(item);
                }
            };

            if (rank === 1) {
                // 1st Place: Defensive, Traps, Minor Boosts
                add('SPAM_BOT', 2);
                add('BSOD', 1);
                add('ZIP_BOMB', 1);
                add('FIREWALL', 2);
                add('VPN', 2);
                add('CACHE', 2);
            } else if (isFrontRunner) {
                // Top 50% (but not 1st)
                PARTY_ITEMS.forEach(i => {
                    if (['RAM', 'OVERCLOCK', 'DDOS', 'REMOTE_TRANSFER'].includes(i.id)) {
                        // Very low chance for strong catch-up/attacks
                        add(i.id, 1);
                    } else if (i.type === 'trap_behind' || i.type === 'self') {
                        // High chance for traps and defensives to hold position
                        add(i.id, 3);
                    } else {
                        // Normal chance for everything else
                        add(i.id, 2);
                    }
                });
            } else {
                // Bottom 50%
                PARTY_ITEMS.forEach(i => {
                    if (['CACHE', 'FIREWALL', 'VPN'].includes(i.id)) {
                        // Low chance for minor defensives/boosts
                        add(i.id, 1);
                    } else if (['RAM', 'OVERCLOCK', 'DDOS', 'REMOTE_TRANSFER'].includes(i.id)) {
                        // High chance for strong catch-up items
                        add(i.id, 3);
                    } else {
                        // Normal chance for everything else
                        add(i.id, 2);
                    }
                });
            }

            // Universal rule: Restrict "Remote Transfer" to rank 4 and below
            if (rank <= 3) {
                pool = pool.filter(i => i.id !== 'REMOTE_TRANSFER');
            }

            // Universal rule: Items that drop BEHIND should only be rollable if someone is ACTUALLY behind you.
            // We check both:
            //   (a) rank-based: dead-last among active runners (rank >= totalPlayers), AND
            //   (b) position-based: nobody with a smaller x value is still active (catches the 1-frame
            //       lag where a just-eliminated player hasn't been removed from rankSorted yet, and
            //       also catches elimination-race scenarios where the storm has wiped out everyone
            //       behind the current racer between roll-time and the moment this code runs).
            const hasActiveBehind = game
                ? game.players.some(other =>
                    other !== this &&
                    !other.eliminated &&
                    !other.finished &&
                    !(game.isRelayRace && other.relayWaiting) &&
                    other.x < this.x
                )
                : (rank < totalPlayers); // fallback if game ref unavailable
            if (rank >= totalPlayers || !hasActiveBehind) {
                pool = pool.filter(i => i.type !== 'trap_behind');
            }

            // Fallback just in case pool is somehow emptied
            if (pool.length === 0) {
                pool = PARTY_ITEMS.filter(i => i.type === 'self' || i.type === 'attack_ahead');
                if (pool.length === 0) pool = [PARTY_ITEMS[0]];
            }

            selectedItem = pool[Math.floor(Math.random() * pool.length)];

            this.visualizeRoulette(selectedItem);
        }
    }

    visualizeRoulette(finalItem) {
        if (!this.el) return;

        // Create Box
        const box = document.createElement('div');
        box.className = 'item-box';
        box.style.animation = "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        this.el.appendChild(box);

        let frames = 0;
        const totalFrames = 20; // How many swaps before locking

        const interval = setInterval(() => {
            // Swap Icons
            const randomItem = randItem(PARTY_ITEMS);
            box.innerText = randomItem.icon;
            frames++;

            if (frames >= totalFrames) {
                clearInterval(interval);
                // LOCK IN
                box.innerText = finalItem.icon;
                box.style.background = "#fff"; // Flash white to indicate lock
                box.style.border = "3px solid #ec4899"; // Pink border

                // Wait 1.5 seconds showing the locked item, then "Equip" it
                setTimeout(() => {
                    if (box.parentNode) box.remove();
                    this.partyStatus.holdingItem = finalItem;
                    this.partyStatus.isRolling = false;

                    // Random usage delay (0.5s to 2.5s)
                    this.partyStatus.useTimer = 0.5 + Math.random() * 2.0;
                }, 1500);
            }
        }, 100); // Change icon every 100ms
    }

    usePartyItem(game, myRank, currentTime) {
        const item = this.partyStatus.holdingItem;
        if (!item) return;

        this.partyStatus.holdingItem = null;

        // NEW: Frequency Config Logic for Cooldown
        let freqConfig = 'normal';
        if (game && game.twitch && game.twitch.db && game.twitch.db.config) {
            freqConfig = game.twitch.db.config.partyFrequency || 'normal';
        }

        let multiplier = 1.0;
        if (freqConfig === 'calm') multiplier = 2.0;   // Slower (2x wait)
        if (freqConfig === 'chaos') multiplier = 0.5;  // Faster (0.5x wait)

        // Base Cooldown: 6-18 seconds
        // Chaos: 3-9s. Calm: 12-36s.
        const baseCooldown = 6 + (Math.random() * 12);
        this.partyStatus.nextRollTime = currentTime + (baseCooldown * multiplier);

        game.showAbilityPopup(this.name, `${item.icon} ${item.name}`);

        // --- SELF ITEMS ---
        if (item.type === 'self') {
            if (item.effect === 'shield') {
                this.partyStatus.shield = item.duration;
                this.showFloatingText("FIREWALL", "#f97316", "🔥");
            }
            else if (item.effect === 'stealth') {
                this.partyStatus.stealthed = item.duration;
                this.showFloatingText("VPN ENABLED", "#6366f1", "👻");
            }
            else if (item.effect === 'boost') {
                this.partyStatus.boost = item.duration;

                // CLEANSING LOGIC: Remove all debuffs if using Overclock/Cache
                if (item.id === 'CACHE' || item.id === 'OVERCLOCK') {
                    if (this.partyStatus.slowed > 0 || this.partyStatus.virus > 0 || this.partyStatus.stunned > 0 || this.partyStatus.blackout > 0) {
                        this.partyStatus.slowed = 0;
                        this.partyStatus.virus = 0;
                        this.partyStatus.stunned = 0;
                        this.partyStatus.blackout = 0;
                        this.showFloatingText("CLEANSED!", "#fff", "✨");
                    }
                }

                if (item.id === 'CACHE') {
                    this.showFloatingText("CACHED!", "#4ade80", "🔋");
                } else {
                    this.showFloatingText("OVERCLOCK!", "#22d3ee", "⚡");
                }
            }
            else if (item.effect === 'teleport') {
                this.x += item.amount;
                this.showFloatingText("DOWNLOAD COMPLETE", "#4ade80", "💾");
            }
        }

        // --- REMOTE TRANSFER (SWAP) ---
        else if (item.id === 'REMOTE_TRANSFER') {
            const validTargets = game.players.filter(p => {
                // 1. Basic Validity
                if (p.finished || p.eliminated) return false;
                if (p === this) return false;

                // 2. MUST BE AHEAD (This prevents 1st place from targeting backwards)
                if (p.x <= this.x) return false;

                // 3. Relay: Must be an ACTIVE runner
                if (game.isRelayRace && p.team && (!game.isEliminationRace ? p.relayLeg > p.team.activeLeg : p.relayWaiting)) return false;

                // 4. Team: Don't swap with teammates
                if ((game.isTeamRace || game.isRelayRace) && p.team && this.team && p.team.id === this.team.id) return false;

                // 5. Stealth: VPN protects against swap
                if (p.partyStatus.stealthed > 0) return false;

                return true;
            });

            // Sort by position (Furthest ahead first)
            const sortedLeaders = validTargets.sort((a, b) => b.x - a.x);

            // Pick from the Top 3 valid leaders ahead of you
            const top3 = sortedLeaders.slice(0, 3);

            if (top3.length > 0) {
                const target = randItem(top3);

                // FIRE PROJECTILE (Visual Line) instead of instant swap
                game.projectiles.push(new Projectile(this, target, item));

                this.showFloatingText("TARGET ACQUIRED", "#22d3ee", "📡");
            } else {
                this.showFloatingText("NO TARGETS AHEAD", "#555", "🚫");
            }
        }

        // --- VIRUS (MULTI-TARGET) ---
        else if (item.id === 'VIRUS') {
            const activePlayers = game.players.filter(p => !p.finished && !p.eliminated && p !== this && p.partyStatus.stealthed <= 0);

            // Filter out teammates AND inactive relay runners
            const validTargets = activePlayers.filter(p => {
                // FIX: Relay Check - Ignore players waiting for the baton
                if (game.isRelayRace && p.team && (!game.isEliminationRace ? p.relayLeg > p.team.activeLeg : p.relayWaiting)) return false;

                // Team Check - Ignore teammates
                if ((game.isTeamRace || game.isRelayRace) && p.team && this.team && p.team.id === this.team.id) return false;

                return true;
            });

            if (validTargets.length > 0) {
                // Calculate target count
                const targetCount = Math.ceil(game.players.length / 4);

                const shuffled = validTargets.sort(() => 0.5 - Math.random());
                const victims = shuffled.slice(0, targetCount);

                victims.forEach(v => {
                    game.projectiles.push(new Projectile(this, v, item));
                });
                this.showFloatingText(`UPLOADING (${victims.length})...`, "#4ade80", "🦠");
            } else {
                this.showFloatingText("NO HOSTS FOUND", "#555", "🚫");
            }
        }

        // --- TARGETING ATTACKS (Ping Spike, Packet Loss, DDOS) ---
        else if (['PING_SPIKE', 'DDOS', 'PACKET_LOSS'].includes(item.id)) {
            const activePlayers = game.players.filter(p => {
                if (p.finished || p.eliminated) return false;
                if (game.isRelayRace && p.team && (!game.isEliminationRace ? p.relayLeg > p.team.activeLeg : p.relayWaiting)) return false;
                if (p.partyStatus.stealthed > 0) return false;

                // Team Check
                if ((game.isTeamRace || game.isRelayRace) && p.team && this.team && p.team.id === this.team.id) return false;
                return true;
            });

            const sorted = activePlayers.sort((a, b) => b.x - a.x);
            let victim = sorted[0];

            if (victim === this) {
                if (item.id === 'DDOS') {
                    victim = null;
                    this.showFloatingText("NO TARGET", "#555", "🚫");
                } else {
                    if (sorted.length > 1) victim = sorted[1];
                }
            }

            if (victim && victim !== this) {
                game.projectiles.push(new Projectile(this, victim, item));
            } else if (!victim && item.id !== 'DDOS') {
                this.showFloatingText("NO TARGET", "#555", "👻");
            }
        }

        // --- GLOBAL (SYSTEM UPDATE) ---
        else if (item.type === 'global_all') {
            game.players.forEach(p => {
                if (p === this) return;
                if (p.finished || p.eliminated) return;
                if (game.isRelayRace && p.team && (!game.isEliminationRace ? p.relayLeg > p.team.activeLeg : p.relayWaiting)) return;
                if (p.partyStatus.stealthed > 0) return;

                // Team Check
                if ((game.isTeamRace || game.isRelayRace) && p.team && this.team && p.team.id === this.team.id) return;

                p.showFloatingText("UPDATING...", "#9ca3af", "⏳");
                p.partyStatus.slowed = item.duration;
            });
        }
        // --- TRAPS ---
        else if (item.type === 'trap_behind') {
            // Safety check: only drop the trap if someone is actually behind us right now.
            // Between the roll and the use-timer firing (up to 2.5s), the player(s) behind
            // may have been eliminated by the storm — dropping a trap on nobody wastes the
            // item and feels terrible from the player's perspective.
            const anyBehind = game.players.some(other =>
                other !== this &&
                !other.eliminated &&
                !other.finished &&
                !(game.isRelayRace && other.relayWaiting) &&
                other.x < this.x
            );

            if (anyBehind) {
                game.traps.push(new Trap(this, this.x, this.y, item));
                const txt = item.id === 'ZIP_BOMB' ? "ZIP BOMB" : (item.id === 'BSOD' ? "BSOD DROPPED" : "SPAM SENT");
                this.showFloatingText(txt, "#fbbf24", item.icon);
            } else {
                // Nobody behind — convert to a small speed boost so the item isn't wasted.
                const cacheItem = PARTY_ITEMS.find(i => i.id === 'CACHE');
                if (cacheItem) {
                    this.partyStatus.boost = cacheItem.duration;
                    this.showFloatingText("CACHE BOOST!", "#4ade80", "🔋");
                }
            }
        }
    }

    showFloatingText(text, color, icon) {
        if (!this.el) return;

        const existing = this.el.getElementsByClassName('floating-text');

        // FIX: Cap at 2 messages max to prevent infinite towers of text
        while (existing.length >= 2) {
            existing[0].remove();
        }

        // Re-stack remaining items to ensure they sit at the bottom
        // This prevents gaps when the oldest item is removed
        Array.from(existing).forEach((el, index) => {
            const stackOffset = index * 24;
            el.style.bottom = stackOffset > 0 ? `calc(100% + ${stackOffset}px)` : '100%';
        });

        const offset = existing.length * 24;

        const floatEl = document.createElement('div');
        floatEl.className = 'floating-text';
        floatEl.style.color = color;

        if (offset > 0) {
            floatEl.style.bottom = `calc(100% + ${offset}px)`;
        }

        floatEl.innerHTML = `<span>${icon}</span> ${text}`;
        this.el.appendChild(floatEl);

        // Slightly faster cleanup (3s) to keep the stack fresh
        setTimeout(() => { if (floatEl && floatEl.parentNode) floatEl.remove(); }, 3000);
    }

    updateLobbyPosition(boundW, boundH, time, timeScale) {
        // 1. Calculate Sidebar Width (Dynamic based on screen height)
        const s = Math.max(1, boundH / 1080);
        const sidebarWidth = 800 * s;

        // 2. Define Safe Zone (Right of sidebar, Inside screen edges)
        const minX = sidebarWidth + 50;
        const maxX = boundW - 50;
        const minY = 100;
        const maxY = boundH - 100;

        // Safety: If screen is somehow too small, fallback to full width
        const safeMinX = (minX < maxX) ? minX : 50;

        // 3. Initialize Random Position (If new)
        if (this.lobbyX === 0 && this.lobbyY === 0) {
            this.lobbyX = safeMinX + Math.random() * (maxX - safeMinX);
            this.lobbyY = minY + Math.random() * (maxY - minY);
            this.lobbyTargetX = this.lobbyX;
            this.lobbyTargetY = this.lobbyY;
        }

        // 4. Pick New Target
        const distToTarget = Math.hypot(this.lobbyTargetX - this.lobbyX, this.lobbyTargetY - this.lobbyY);
        if (distToTarget < 10) {
            if (this.lobbyIdleTimer === undefined) this.lobbyIdleTimer = 1 + Math.random() * 2;
            this.lobbyIdleTimer -= timeScale * 0.016;

            if (this.lobbyIdleTimer <= 0) {
                this.lobbyTargetX = safeMinX + Math.random() * (maxX - safeMinX);
                this.lobbyTargetY = minY + Math.random() * (maxY - minY);
                this.lobbySpeed = (Math.random() < 0.2) ? 1.5 : (0.3 + Math.random() * 0.5); // Occasional sprint
                this.lobbyIdleTimer = undefined;
            }
        } else {
            // 5. Move
            const dx = this.lobbyTargetX - this.lobbyX;
            const dy = this.lobbyTargetY - this.lobbyY;
            const angle = Math.atan2(dy, dx);

            this.lobbyX += Math.cos(angle) * this.lobbySpeed * timeScale;
            this.lobbyY += Math.sin(angle) * this.lobbySpeed * timeScale;
        }

        this.animOffset = Math.sin(time * 3) * 4;

        // 6. Hard Clamp (Prevent drifting behind panel)
        if (this.lobbyX < safeMinX) this.lobbyX = safeMinX;
        if (this.lobbyX > maxX) this.lobbyX = maxX;
        if (this.lobbyY < minY) this.lobbyY = minY;
        if (this.lobbyY > maxY) this.lobbyY = maxY;
    }

    save(gameInstance, raceTime = 0) {
        if (this.isBot) return;

        // Pass all stats explicitly to match Game.savePlayerStats signature
        // Updated to include eWins and eTotalRaces
        gameInstance.savePlayerStats(
            this.name,
            this.stats,
            // Solo
            this.wins, this.wins2, this.wins3,
            // Team
            this.tWins, this.tWins2, this.tWins3,
            // Relay
            this.rWins, this.rWins2, this.rWins3,
            // Meta
            this.avatar,
            this.inventory,
            raceTime,
            this.totalRaces,
            this.tTotalRaces,
            this.rTotalRaces,
            // NEW: Elimination Stats
            this.eWins, this.eTotalRaces,
            // Extras
            0, // earnedCoins (0 for manual saves)
            this.lastResult,
            this.season,
            this.gpInventory, // NEW: Pass Gauntlet Inventory
            this.id // NEW: Pass ID
        );
    }

    destroy() {
        if (this.el) this.el.remove();
    }
}

class ConfettiOverlay {
    constructor() {
        this.canvas = document.getElementById('confettiCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.particles = [];
        this.isRunning = false;
        this.animationFrameId = null;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Reset particles on resize to prevent stretching/jumping artifacts
        if (this.isRunning) this.particles = [];
    }

    start() {
        if (!this.canvas) return;

        // FIX: If already running (e.g. triggered by resize -> showResults), 
        // just reset the particles. Do NOT start a new loop, as one is already active.
        // This prevents the "speed up" bug where multiple loops run in parallel.
        if (this.isRunning) {
            this.particles = [];
            return;
        }

        this.isRunning = true;
        this.particles = [];
        this.loop();
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    loop() {
        if (!this.isRunning || !this.ctx) return;

        // Spawn rate
        if (this.particles.length < 150) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -20,
                vx: (Math.random() - 0.5) * 4,
                vy: 0.5 + Math.random() * 5,
                size: 4 + Math.random() * 6,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                rotation: Math.random() * 360,
                spin: (Math.random() - 0.5) * 10
            });
        }

        // Clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update & Draw
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.spin;

            // Oscillate x
            p.x += Math.sin(p.y * 0.05) * 0.5;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);

            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

            this.ctx.restore();

            if (p.y > this.canvas.height + 20) {
                this.particles.splice(i, 1);
            }
        }

        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }
}



const rarityOrder = { 'common': 1, 'rare': 2, 'epic': 3, 'legendary': 4, 'special': 5 };

const itemList = [];
itemList.push({
    cmd: '🎟️ Spin Ticket',
    aliases: ['SPECIAL'],
    desc: 'Currency for the Chance Wheel. Earned by winning races or special events.',
    example: '!spin'
});

Object.entries(ITEMS).forEach(([key, i]) => {
    let desc = '';
    if (i.stat === 'THORNS') desc = 'Shields user + Dmg attacker';
    else if (i.stat === 'SHIELD') desc = 'Blocks 1 Hazard/Attack';
    else if (i.stat === 'ALL') desc = '+1 All Stats';
    else if (i.stat === 'DEBUFF') desc = 'Reduces random stat';
    else if (i.stat === 'TRAIL_GIFT') desc = 'Unlocks a random trail';
    else {
        desc = i.stat + ' ' + (i.amount > 0 ? '+' : '') + i.amount;
        if (i.stat2) desc += ', ' + i.stat2 + ' ' + (i.amount2 > 0 ? '+' : '') + i.amount2;
        if (i.rarity === 'rare' && (i.amount2 < 0)) desc += ' (Cursed)';
    }

    itemList.push({
        cmd: i.icon + ' ' + i.name,
        aliases: [i.rarity ? i.rarity.toUpperCase() : 'COMMON'],
        desc: desc,
        example: '!use ' + key
    });
});

itemList.sort((a, b) => {
    const rA = a.aliases[0] ? a.aliases[0].toLowerCase() : 'common';
    const rB = b.aliases[0] ? b.aliases[0].toLowerCase() : 'common';
    return (rarityOrder[rA] || 9) - (rarityOrder[rB] || 9);
});

const trailList = [];
Object.entries(TRAILS).forEach(([key, t]) => {
    if (key === 'default') return;
    let cost = 'Box';
    const r = t.rarity || 'common';
    if (r === 'common') cost = '20c Box';
    else if (r === 'rare') cost = '44c Box';
    else if (r === 'epic') cost = '70c Box';
    else if (r === 'legendary') cost = '150c Box';
    else if (r === 'novelty') cost = '100c Direct';
    else if (r === 'special') cost = 'Event/Special';

    trailList.push({
        cmd: t.name,
        aliases: [r.toUpperCase()],
        desc: 'Style: ' + (t.type || 'Standard') + '. Cost: ' + cost,
        example: r === 'novelty' ? '!buy trail ' + key : '!settrail ' + key,
        image: 'assets/trails/' + key + '.gif'
    });
});

trailList.sort((a, b) => {
    const rA = a.aliases[0] ? a.aliases[0].toLowerCase() : 'common';
    const rB = b.aliases[0] ? b.aliases[0].toLowerCase() : 'common';
    return (rarityOrder[rA] || 9) - (rarityOrder[rB] || 9);
});

const partyList = [];
PARTY_ITEMS.forEach(p => {
    partyList.push({
        cmd: p.icon + ' ' + p.name,
        aliases: [p.type.toUpperCase().replace('_', ' ')],
        desc: p.desc,
        example: '(Random Drop)',
        image: 'assets/party/' + p.id.toLowerCase() + '.gif'
    });
});

const teamList = [];
TEAMS.forEach(t => {
    teamList.push({
        cmd: t.icon + ' ' + t.name,
        aliases: t.aliases.map(a => a.toUpperCase()),
        desc: 'Color: ' + t.id.toUpperCase() + '. Motto: "' + t.motto + '"',
        example: '!rb 100 ' + t.aliases[0]
    });
});

// We dump this directly to JSON
const output = { itemList, trailList, partyList, teamList };
fs.writeFileSync('C:/Users/flipp/Downloads/StreamRacers-Docs/js/extracted.json', JSON.stringify(output, null, 2));
console.log("Done extracting JSON arrays.");
