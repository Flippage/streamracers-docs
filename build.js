
const fs = require('fs');

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



function generateFullData() {
    const rarityOrder = { 'common': 1, 'rare': 2, 'epic': 3, 'legendary': 4, 'special': 5 };

    const itemList = [];
    itemList.push({
        cmd: "🎟️ Spin Ticket",
        aliases: ["SPECIAL"],
        desc: "Currency for the Chance Wheel. Earned by winning races or special events.",
        example: "!spin"
    });

    Object.entries(ITEMS).forEach(([key, i]) => {
        let desc = "";
        if (i.stat === 'THORNS') desc = "Shields user + Dmg attacker";
        else if (i.stat === 'SHIELD') desc = "Blocks 1 Hazard/Attack";
        else if (i.stat === 'ALL') desc = "+1 All Stats";
        else if (i.stat === 'DEBUFF') desc = "Reduces random stat";
        else if (i.stat === 'TRAIL_GIFT') desc = "Unlocks a random trail";
        else {
            desc = `${i.stat} ${i.amount > 0 ? '+' : ''}${i.amount}`;
            if (i.stat2) desc += `, ${i.stat2} ${i.amount2 > 0 ? '+' : ''}${i.amount2}`;
            if (i.rarity === 'rare' && (i.amount2 < 0)) desc += " (Cursed)";
        }

        itemList.push({
            cmd: `${i.icon} ${i.name}`,
            aliases: [i.rarity ? i.rarity.toUpperCase() : 'COMMON'],
            desc: desc,
            example: `!use ${key}`
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
        let cost = "Box";
        const r = t.rarity || 'common';
        if (r === 'common') cost = "20c Box";
        else if (r === 'rare') cost = "44c Box";
        else if (r === 'epic') cost = "70c Box";
        else if (r === 'legendary') cost = "150c Box";
        else if (r === 'novelty') cost = "100c Direct";
        else if (r === 'special') cost = "Event/Special";

        const imgPath = 'assets/trails/' + key + '.gif';
        const obj = {
            cmd: t.name,
            aliases: [r.toUpperCase()],
            desc: `Style: ${t.type || 'Standard'}. Cost: ${cost}`,
            example: r === 'novelty' ? `!buy trail ${key}` : `!settrail ${key}`
        };
        if (fs.existsSync('c:/Users/flipp/Downloads/StreamRacers-Docs/' + imgPath)) {
            obj.image = imgPath;
        }
        trailList.push(obj);
    });

    trailList.sort((a, b) => {
        const rA = a.aliases[0] ? a.aliases[0].toLowerCase() : 'common';
        const rB = b.aliases[0] ? b.aliases[0].toLowerCase() : 'common';
        return (rarityOrder[rA] || 9) - (rarityOrder[rB] || 9);
    });

    const partyList = [];
    PARTY_ITEMS.forEach(p => {
        partyList.push({
            cmd: `${p.icon} ${p.name}`,
            aliases: [p.type.toUpperCase().replace('_', ' ')],
            desc: p.desc,
            example: "(Random Drop)"
        });
    });

    const teamList = [];
    TEAMS.forEach(t => {
        teamList.push({
            cmd: `${t.icon} ${t.name}`,
            aliases: t.aliases.map(a => a.toUpperCase()),
            desc: `Color: ${t.id.toUpperCase()}. Motto: "${t.motto}"`,
            example: `!rb 100 ${t.aliases[0]}`
        });
    });

    const helpData = [
            {
                category: "🏁 BASICS",
                color: "text-white",
                items: [
                    {
                        cmd: "!racejoin",
                        aliases: ["!joinrace", "!rj", "!jr", "!race"],
                        desc: "Joins the current race lobby.",
                        example: "!racejoin"
                    },
                    {
                        cmd: "!raceleave",
                        aliases: ["!leaverace", "!rl", "!lr"],
                        desc: "Leaves the lobby (before race starts).",
                        example: "!rl"
                    }
                ]
            },
            {
                category: "🛡️ TEAMS & SYMBOLS",
                color: "text-indigo-400",
                borderColor: "border-indigo-900/30",
                items: teamList
            },
            {
                category: "💰 ECONOMY & BETTING",
                color: "text-yellow-400",
                items: [
                    {
                        cmd: "!racebet <amount> <target>",
                        aliases: ["!rb"],
                        desc: "Bet coins on a racer or team. You can use 'all' for amount.",
                        example: "!rb 100 @username  OR  !rb all sword"
                    },
                    {
                        cmd: "!racecancelbet",
                        aliases: ["!rcb"],
                        desc: "Cancels your active bet and refunds coins.",
                        example: "!rcb"
                    },
                    {
                        cmd: "!racecoins",
                        aliases: ["!racebalance", "!racewallet", "!rc"],
                        desc: "Check your coin balance.",
                        example: "!rc"
                    },
                    {
                        cmd: "!racetrade <item> <amount>",
                        aliases: ["!trade", "!sell"],
                        desc: "Sell items back to the shop for 10% value. Use 'all' to sell stack.",
                        example: "!sell boots 2  OR  !sell all"
                    }
                ]
            },
            {
                category: "🎒 ITEMS & SHOP",
                color: "text-blue-400",
                items: [
                    {
                        cmd: "!spin [amount]",
                        aliases: ["!racewheel"],
                        desc: "Spend Spin Tickets to win prizes! Supports bulk spins (e.g. 'all').",
                        example: "!spin  OR  !spin 5  OR  !spin all"
                    },
                    {
                        cmd: "!tickets",
                        aliases: ["!ticket"],
                        desc: "Check your Spin Ticket balance.",
                        example: "!tickets"
                    },
                    {
                        cmd: "!racebuy <type> <rarity>",
                        aliases: ["!buy"],
                        desc: "Buy a random Item or Trail box. Types: 'item' or 'trail'. Rarities: common, rare, epic, legendary, novelty.",
                        example: "!buy item rare  OR  !buy trail legendary"
                    },
                    {
                        cmd: "!raceitem <item> <target>",
                        aliases: ["!useitem", "!use", "!ri"],
                        desc: "Use an item from your bag. Targeting another racer is optional for buffs. Can specify amount/all.",
                        example: "!use itemname  OR  !use itemname @username  OR  !use itemname all"
                    },
                    {
                        cmd: "!racetrade <item> <amount>",
                        aliases: ["!trade", "!sell"],
                        desc: "Sell items for 10% value. Use 'all' for quantity, or '!sell all' to liquidate everything.",
                        example: "!sell boots 2  OR  !sell boots all  OR  !sell all"
                    },
                    {
                        cmd: "!racebag",
                        aliases: ["!inventory", "!inv", "!bag"],
                        desc: "View your current inventory items.",
                        example: "!bag"
                    }
                ]
            },
            // --- DYNAMIC SECTIONS INSERTED HERE ---
            {
                category: "📦 ITEM DEX",
                color: "text-blue-300",
                borderColor: "border-blue-900/30",
                items: itemList
            },
            {
                category: "🎨 CUSTOMIZATION",
                color: "text-pink-400",
                items: [
                    {
                        cmd: "!icon <emote/emoji>",
                        aliases: ["!raceicon"],
                        desc: "Change your racer avatar. Supports Twitch/7TV emotes or standard emojis.",
                        example: "!icon PogChamp  OR  !icon 🚗"
                    },
                    {
                        cmd: "!settrail <name>",
                        aliases: ["!racetrail"],
                        desc: "Equip an unlocked trail.",
                        example: "!settrail fire"
                    },
                    {
                        cmd: "!trails",
                        aliases: [],
                        desc: "List all trails you own.",
                        example: "!trails"
                    },
                    {
                        cmd: "!rollracer <class>",
                        aliases: ["!reroll"],
                        desc: "Reroll your stats. Optional classes: balanced, specialist, dualist, unstable. <b>Unstable</b> rolls new stats every race.",
                        example: "!reroll specialist"
                    },
                    {
                        cmd: "!racestats <user>",
                        aliases: ["!racerstats"],
                        desc: "View win/loss records and current stats for yourself or others.",
                        example: "!racestats @username"
                    },
                    {
                        cmd: "!racecoinleaderboard",
                        aliases: ["!rich", "!wealth", "!rcl"],
                        desc: "View the wealthiest players.",
                        example: "!wealth"
                    },
                    {
                        cmd: "!topsolo [all]",
                        aliases: [],
                        desc: "Top 5 Solo Winners (Season). Add 'all' for All-Time.",
                        example: "!topsolo  OR  !topsolo all"
                    },
                    {
                        cmd: "!topteam [all]",
                        aliases: [],
                        desc: "Top 5 Team Winners (Season). Add 'all' for All-Time.",
                        example: "!topteam all"
                    },
                    {
                        cmd: "!toprelay [all]",
                        aliases: [],
                        desc: "Top 5 Relay Winners (Season). Add 'all' for All-Time.",
                        example: "!toprelay"
                    },
                    {
                        cmd: "!topelim [all]",
                        aliases: [],
                        desc: "Top 5 Elimination Survivors (Season). Add 'all' for All-Time.",
                        example: "!topelim"
                    },
                    {
                        cmd: "!topgauntlet [all]",
                        aliases: [],
                        desc: "Top 5 Gauntlet Series Champions (Season).",
                        example: "!topgauntlet"
                    }
                ]
            },
            {
                category: "🌈 TRAIL GALLERY",
                color: "text-pink-300",
                borderColor: "border-pink-900/30",
                items: trailList
            },
            {
                category: "🎉 PARTY EFFECTS",
                color: "text-purple-300",
                borderColor: "border-purple-900/30",
                items: partyList
            },
            {
                category: "🛡️ MODERATOR COMMANDS",
                color: "text-orange-500",
                borderColor: "border-orange-900/50",
                items: [
                    {
                        cmd: "!startrace",
                        aliases: ["!racestart", "!start", "!forcestart"],
                        desc: "Start the race from the current lobby.",
                        example: "!start"
                    },
                    {
                        cmd: "!raceopen",
                        aliases: ["!solorace"],
                        desc: "Open a standard Solo Lobby.",
                        example: "!solorace"
                    },
                    {
                        cmd: "!teamrace",
                        aliases: [],
                        desc: "Open a Team Race Lobby.",
                        example: "!teamrace"
                    },
                    {
                        cmd: "!relayrace",
                        aliases: [],
                        desc: "Open a Relay Race Lobby.",
                        example: "!relayrace"
                    },
                    {
                        cmd: "!partymode",
                        aliases: ["!party"],
                        desc: "Toggle Party Mode (Items/Chaos).",
                        example: "!party"
                    },
                    {
                        cmd: "!elimination",
                        aliases: ["!elim"],
                        desc: "Toggle Elimination Mode (The Storm).",
                        example: "!elim"
                    },
                    {
                        cmd: "!gauntlet",
                        aliases: [],
                        desc: "Toggle Gauntlet Mode (Multi-race Series).",
                        example: "!gauntlet"
                    },
                    {
                        cmd: "!endgauntlet",
                        aliases: [],
                        desc: "Force end the current Gauntlet Series early.",
                        example: "!endgauntlet"
                    },
                    {
                        cmd: "!skipwait",
                        aliases: ["!nextrace"],
                        desc: "Skip the intermission timer during a Gauntlet.",
                        example: "!skipwait"
                    },
                    {
                        cmd: "!raceclear",
                        aliases: ["!clearrace"],
                        desc: "Resets the lobby entirely.",
                        example: "!clearrace"
                    },
                    {
                        cmd: "!addbot",
                        aliases: [],
                        desc: "Add a computer racer.",
                        example: "!addbot"
                    },
                    {
                        cmd: "!kick <user>",
                        aliases: [],
                        desc: "Remove a player from the lobby.",
                        example: "!kick @username"
                    },
                    {
                        cmd: "!openwheel",
                        aliases: ["!showwheel"],
                        desc: "Opens the Chance Wheel modal.",
                        example: "!openwheel"
                    },
                    {
                        cmd: "!closewheel",
                        aliases: ["!hidewheel"],
                        desc: "Closes the Chance Wheel modal.",
                        example: "!closewheel"
                    },
                    {
                        cmd: "!spinnow",
                        aliases: ["!triggerwheel"],
                        desc: "Triggers the next spin in the queue.",
                        example: "!spinnow"
                    },
                    {
                        cmd: "!calm / !normal / !chaos",
                        aliases: [],
                        desc: "Set Party Mode frequency.",
                        example: "!chaos"
                    },
                    {
                        cmd: "!racecommands",
                        aliases: ["!help"],
                        desc: "Opens this command menu. Add text to search (e.g. !help coin).",
                        example: "!help coin"
                    }
                ]
            },
            {
                category: "📡 BROADCASTER COMMANDS",
                color: "text-purple-500",
                borderColor: "border-purple-900/50",
                items: [
                    {
                        cmd: "!giveticket <user> <amount>",
                        aliases: [],
                        desc: "Give Spin Tickets to a player.",
                        example: "!giveticket @username 1"
                    },
                    {
                        cmd: "!givecoins <user> <amount>",
                        aliases: [],
                        desc: "Add coins to a user's wallet.",
                        example: "!givecoins @username 1000"
                    },
                    {
                        cmd: "!giveitem <user> <amount> <item>",
                        aliases: [],
                        desc: "Gift items to a player.",
                        example: "!giveitem @username 5 boots"
                    },
                    {
                        cmd: "!givetrail <user> <trail_id>",
                        aliases: [],
                        desc: "Unlock a specific trail for a user.",
                        example: "!givetrail @username fire"
                    },
                    {
                        cmd: "!resetracer <user>",
                        aliases: [],
                        desc: "⚠️ FULL RESET: Wipes a user's stats, inventory, and coins.",
                        example: "!resetracer @username"
                    }
                ]
            }
        ];

    // Inject dynamic lists into the correct sections
    const findCat = (catName) => helpData.find(c => c.category.includes(catName));
    if (findCat("TEAMS & SYMBOLS")) findCat("TEAMS & SYMBOLS").items = teamList;
    if (findCat("ITEM DEX")) findCat("ITEM DEX").items = itemList;
    if (findCat("TRAIL GALLERY")) findCat("TRAIL GALLERY").items = trailList;
    if (findCat("PARTY EFFECTS")) findCat("PARTY EFFECTS").items = partyList;

    return helpData;
}

const finalData = generateFullData();
fs.writeFileSync('js/data.js', 'const COMMANDS_DATA = ' + JSON.stringify(finalData, null, 4) + ';');
console.log("Successfully extracted complete data.js");
