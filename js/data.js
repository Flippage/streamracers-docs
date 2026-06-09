const COMMANDS_DATA = [
    {
        "category": "🏁 BASICS",
        "color": "text-white",
        "items": [
            {
                "cmd": "!racejoin",
                "aliases": [
                    "!joinrace",
                    "!rj",
                    "!jr",
                    "!race"
                ],
                "desc": "Joins the current race lobby.",
                "example": "!racejoin"
            },
            {
                "cmd": "!raceleave",
                "aliases": [
                    "!leaverace",
                    "!rl",
                    "!lr"
                ],
                "desc": "Leaves the lobby (before race starts).",
                "example": "!rl"
            }
        ]
    },
    {
        "category": "🛡️ TEAMS & SYMBOLS",
        "color": "text-indigo-400",
        "items": [
            {
                "cmd": "⚔️ RED TEAM",
                "aliases": [
                    "SWORD",
                    "SWORDS",
                    "BLADE"
                ],
                "desc": "Color: RED. Motto: \"Speed & Fury\"",
                "example": "!rb 100 sword"
            },
            {
                "cmd": "🛡️ BLUE TEAM",
                "aliases": [
                    "SHIELD",
                    "SHIELDS",
                    "GUARD"
                ],
                "desc": "Color: BLUE. Motto: \"Cool & Calculated\"",
                "example": "!rb 100 shield"
            },
            {
                "cmd": "🔥 ORANGE TEAM",
                "aliases": [
                    "FIRE",
                    "FLAME",
                    "BURN"
                ],
                "desc": "Color: ORANGE. Motto: \"Chaos & Fire\"",
                "example": "!rb 100 fire"
            },
            {
                "cmd": "🔮 PURPLE TEAM",
                "aliases": [
                    "ORB",
                    "CRYSTAL",
                    "MAGIC",
                    "VOID"
                ],
                "desc": "Color: PURPLE. Motto: \"Royalty & Void\"",
                "example": "!rb 100 orb"
            },
            {
                "cmd": "🌿 GREEN TEAM",
                "aliases": [
                    "LEAF",
                    "NATURE",
                    "PLANT"
                ],
                "desc": "Color: GREEN. Motto: \"Growth & Power\"",
                "example": "!rb 100 leaf"
            }
        ]
    },
    {
        "category": "💰 ECONOMY & BETTING",
        "color": "text-yellow-400",
        "items": [
            {
                "cmd": "!racebet <amount> <target>",
                "aliases": [
                    "!rb"
                ],
                "desc": "Bet coins on a racer or team. You can use 'all' for amount.",
                "example": "!rb 100 @username"
            },
            {
                "cmd": "!racecancelbet",
                "aliases": [
                    "!rcb"
                ],
                "desc": "Cancels your active bet and refunds coins.",
                "example": "!rcb"
            },
            {
                "cmd": "!racecoins",
                "aliases": [
                    "!rc"
                ],
                "desc": "Check your coin balance.",
                "example": "!rc"
            },
            {
                "cmd": "!racetrade <item> <amount>",
                "aliases": [
                    "!sell"
                ],
                "desc": "Sell items back to the shop for 10% value.",
                "example": "!sell boots 2"
            }
        ]
    },
    {
        "category": "🎒 ITEMS & SHOP",
        "color": "text-blue-400",
        "items": [
            {
                "cmd": "!spin [amount]",
                "aliases": [
                    "!racewheel"
                ],
                "desc": "Spend Spin Tickets to win prizes!",
                "example": "!spin 5"
            },
            {
                "cmd": "!tickets",
                "aliases": [
                    "!ticket"
                ],
                "desc": "Check your Spin Ticket balance.",
                "example": "!tickets"
            },
            {
                "cmd": "!racebuy <type> <rarity>",
                "aliases": [
                    "!buy"
                ],
                "desc": "Buy a random Item or Trail box. Types: 'item' or 'trail'. Rarities: common, rare, epic, legendary, novelty.",
                "example": "!buy item rare"
            },
            {
                "cmd": "!raceitem <item> <target>",
                "aliases": [
                    "!use"
                ],
                "desc": "Use an item from your bag. Targeting another racer is optional for buffs. Can specify amount/all.",
                "example": "!use boots"
            },
            {
                "cmd": "!racebag",
                "aliases": [
                    "!bag"
                ],
                "desc": "View your current inventory items.",
                "example": "!bag"
            }
        ]
    },
    {
        "category": "📦 ITEM DEX",
        "color": "text-blue-300",
        "items": [
            {
                "cmd": "🥾 Climbing Boots",
                "aliases": [
                    "COMMON"
                ],
                "desc": "CLIMB +1",
                "example": "!use boots_common"
            },
            {
                "cmd": "🤿 Swim Fins",
                "aliases": [
                    "COMMON"
                ],
                "desc": "SWIM +1",
                "example": "!use fins_common"
            },
            {
                "cmd": "👟 Running Shoes",
                "aliases": [
                    "COMMON"
                ],
                "desc": "RUN +1",
                "example": "!use shoes_common"
            },
            {
                "cmd": "🪁 Glider Wings",
                "aliases": [
                    "COMMON"
                ],
                "desc": "GLIDE +1",
                "example": "!use glider_common"
            },
            {
                "cmd": "🔩 Jump Springs",
                "aliases": [
                    "COMMON"
                ],
                "desc": "JUMP +1",
                "example": "!use springs_common"
            },
            {
                "cmd": "🧗 Spiked Boots",
                "aliases": [
                    "RARE"
                ],
                "desc": "CLIMB +2",
                "example": "!use boots_rare"
            },
            {
                "cmd": "🦈 Shark Fin",
                "aliases": [
                    "RARE"
                ],
                "desc": "SWIM +2",
                "example": "!use fins_rare"
            },
            {
                "cmd": "⚡ Turbo Sneakers",
                "aliases": [
                    "RARE"
                ],
                "desc": "RUN +2",
                "example": "!use shoes_rare"
            },
            {
                "cmd": "🦅 Eagle Wings",
                "aliases": [
                    "RARE"
                ],
                "desc": "GLIDE +2",
                "example": "!use glider_rare"
            },
            {
                "cmd": "🦘 Pogo Stick",
                "aliases": [
                    "RARE"
                ],
                "desc": "JUMP +2",
                "example": "!use springs_rare"
            },
            {
                "cmd": "🦆 Duck Suit",
                "aliases": [
                    "RARE"
                ],
                "desc": "SWIM +1, GLIDE +1",
                "example": "!use duck_suit"
            },
            {
                "cmd": "🐸 Frog Legs",
                "aliases": [
                    "RARE"
                ],
                "desc": "SWIM +1, JUMP +1",
                "example": "!use frog_legs"
            },
            {
                "cmd": "🕷️ Spider Gloves",
                "aliases": [
                    "RARE"
                ],
                "desc": "CLIMB +1, RUN +1",
                "example": "!use spider_gloves"
            },
            {
                "cmd": "🌑 Moon Boots",
                "aliases": [
                    "RARE"
                ],
                "desc": "JUMP +1, GLIDE +1",
                "example": "!use moon_boots"
            },
            {
                "cmd": "🥷 Ninja Tabi",
                "aliases": [
                    "RARE"
                ],
                "desc": "RUN +1, CLIMB +1",
                "example": "!use ninja_tabi"
            },
            {
                "cmd": "🚤 Scuba Jet",
                "aliases": [
                    "RARE"
                ],
                "desc": "SWIM +1, GLIDE +1",
                "example": "!use scuba_jet"
            },
            {
                "cmd": "🐒 Monkey Tail",
                "aliases": [
                    "RARE"
                ],
                "desc": "CLIMB +1, JUMP +1",
                "example": "!use monkey_tail"
            },
            {
                "cmd": "🛹 Hoverboard",
                "aliases": [
                    "RARE"
                ],
                "desc": "RUN +1, GLIDE +1",
                "example": "!use hoverboard"
            },
            {
                "cmd": "🚀 Rocket Skates",
                "aliases": [
                    "RARE"
                ],
                "desc": "RUN +1, JUMP +1",
                "example": "!use rocket_skates"
            },
            {
                "cmd": "🪂 Pickaxe Parachute",
                "aliases": [
                    "RARE"
                ],
                "desc": "CLIMB +1, GLIDE +1",
                "example": "!use pickaxe_para"
            },
            {
                "cmd": "⚓ Anchor Boots (Cursed)",
                "aliases": [
                    "RARE"
                ],
                "desc": "CLIMB +2, RUN -1 (Cursed)",
                "example": "!use anchor_boots"
            },
            {
                "cmd": "🏋️ Lead Belt (Cursed)",
                "aliases": [
                    "RARE"
                ],
                "desc": "SWIM +2, JUMP -1 (Cursed)",
                "example": "!use lead_belt"
            },
            {
                "cmd": "🧨 Unstable Rocket (Cursed)",
                "aliases": [
                    "RARE"
                ],
                "desc": "GLIDE +2, CLIMB -1 (Cursed)",
                "example": "!use rocket_pack"
            },
            {
                "cmd": "😵 Springy Pogo (Cursed)",
                "aliases": [
                    "RARE"
                ],
                "desc": "JUMP +2, GLIDE -1 (Cursed)",
                "example": "!use springy_pogo"
            },
            {
                "cmd": "🔥 Nitrous (Cursed)",
                "aliases": [
                    "RARE"
                ],
                "desc": "RUN +2, SWIM -1 (Cursed)",
                "example": "!use nitrous"
            },
            {
                "cmd": "🛡️ Heavy Plate (Cursed)",
                "aliases": [
                    "RARE"
                ],
                "desc": "CLIMB +2, GLIDE -1 (Cursed)",
                "example": "!use plate_armor"
            },
            {
                "cmd": "🌊 Hydro Thrusters (Cursed)",
                "aliases": [
                    "RARE"
                ],
                "desc": "SWIM +2, RUN -1 (Cursed)",
                "example": "!use hydro_thrust"
            },
            {
                "cmd": "🧛 Heavy Cape (Cursed)",
                "aliases": [
                    "RARE"
                ],
                "desc": "GLIDE +2, JUMP -1 (Cursed)",
                "example": "!use heavy_cape"
            },
            {
                "cmd": "🥊 Kang-Shoes (Cursed)",
                "aliases": [
                    "RARE"
                ],
                "desc": "JUMP +2, CLIMB -1 (Cursed)",
                "example": "!use kang_shoes"
            },
            {
                "cmd": "🦔 Sonic Sneakers (Cursed)",
                "aliases": [
                    "RARE"
                ],
                "desc": "RUN +2, GLIDE -1 (Cursed)",
                "example": "!use sonic_sneak"
            },
            {
                "cmd": "🌌 Gravity Boots",
                "aliases": [
                    "EPIC"
                ],
                "desc": "CLIMB +3",
                "example": "!use boots_epic"
            },
            {
                "cmd": "🔱 Poseidons Trident",
                "aliases": [
                    "EPIC"
                ],
                "desc": "SWIM +3",
                "example": "!use fins_epic"
            },
            {
                "cmd": "💨 Sonic Boots",
                "aliases": [
                    "EPIC"
                ],
                "desc": "RUN +3",
                "example": "!use shoes_epic"
            },
            {
                "cmd": "🎒 Jetpack",
                "aliases": [
                    "EPIC"
                ],
                "desc": "GLIDE +3",
                "example": "!use glider_epic"
            },
            {
                "cmd": "🦾 Bionic Legs",
                "aliases": [
                    "EPIC"
                ],
                "desc": "JUMP +3",
                "example": "!use springs_epic"
            },
            {
                "cmd": "🎁 Trail Box",
                "aliases": [
                    "EPIC"
                ],
                "desc": "Unlocks a random trail",
                "example": "!use trail_box"
            },
            {
                "cmd": "👑 Golden Boots",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "CLIMB +5",
                "example": "!use boots_leg"
            },
            {
                "cmd": "👑 Golden Fins",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "SWIM +5",
                "example": "!use fins_leg"
            },
            {
                "cmd": "👑 Golden Shoes",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "RUN +5",
                "example": "!use shoes_leg"
            },
            {
                "cmd": "👑 Golden Glider",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "GLIDE +5",
                "example": "!use glider_leg"
            },
            {
                "cmd": "👑 Golden Springs",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "JUMP +5",
                "example": "!use springs_leg"
            },
            {
                "cmd": "🛡️ Hazard Shield",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "Blocks 1 Hazard/Attack",
                "example": "!use shield_item"
            },
            {
                "cmd": "🦸 Super Lemming",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "+1 All Stats",
                "example": "!use super_lemming"
            },
            {
                "cmd": "🌵 Thorns",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "Reduces random stat",
                "example": "!use thorns_item"
            },
            {
                "cmd": "🎟️ Spin Ticket",
                "aliases": [
                    "SPECIAL"
                ],
                "desc": "Currency for the Chance Wheel. Earned by winning races or special events.",
                "example": "!spin"
            }
        ]
    },
    {
        "category": "🎨 CUSTOMIZATION",
        "color": "text-pink-400",
        "items": [
            {
                "cmd": "!icon <emote/emoji>",
                "aliases": [
                    "!raceicon"
                ],
                "desc": "Change your racer avatar.",
                "example": "!icon PogChamp"
            },
            {
                "cmd": "!settrail <name>",
                "aliases": [
                    "!racetrail"
                ],
                "desc": "Equip an unlocked trail.",
                "example": "!settrail fire"
            },
            {
                "cmd": "!trails",
                "aliases": [],
                "desc": "List all trails you own.",
                "example": "!trails"
            },
            {
                "cmd": "!rollracer <class>",
                "aliases": [
                    "!reroll"
                ],
                "desc": "Reroll your stats (balanced, specialist, dualist, unstable).",
                "example": "!reroll specialist"
            },
            {
                "cmd": "!racestats <user>",
                "aliases": [
                    "!racerstats"
                ],
                "desc": "View win/loss records and current stats.",
                "example": "!racestats @username"
            },
            {
                "cmd": "!racecoinleaderboard",
                "aliases": [
                    "!rich"
                ],
                "desc": "View the wealthiest players.",
                "example": "!rich"
            },
            {
                "cmd": "!topsolo [all]",
                "aliases": [],
                "desc": "Top 5 Solo Winners (Season). Add 'all' for All-Time.",
                "example": "!topsolo"
            },
            {
                "cmd": "!topteam [all]",
                "aliases": [],
                "desc": "Top 5 Team Winners (Season). Add 'all' for All-Time.",
                "example": "!topteam"
            },
            {
                "cmd": "!toprelay [all]",
                "aliases": [],
                "desc": "Top 5 Relay Winners (Season). Add 'all' for All-Time.",
                "example": "!toprelay"
            },
            {
                "cmd": "!topelim [all]",
                "aliases": [],
                "desc": "Top 5 Elimination Survivors.",
                "example": "!topelim"
            },
            {
                "cmd": "!topgauntlet [all]",
                "aliases": [],
                "desc": "Top 5 Gauntlet Series Champions.",
                "example": "!topgauntlet"
            }
        ]
    },
    {
        "category": "🌈 TRAIL GALLERY",
        "color": "text-pink-300",
        "items": [
            {
                "cmd": "Smoke",
                "aliases": [
                    "COMMON"
                ],
                "desc": "Style: ribbon. Cost: 20c Box",
                "example": "!settrail smoke"
            },
            {
                "cmd": "Earth",
                "aliases": [
                    "COMMON"
                ],
                "desc": "Style: ribbon. Cost: 20c Box",
                "example": "!settrail earth"
            },
            {
                "cmd": "Water",
                "aliases": [
                    "COMMON"
                ],
                "desc": "Style: ribbon. Cost: 20c Box",
                "example": "!settrail water"
            },
            {
                "cmd": "Love",
                "aliases": [
                    "COMMON"
                ],
                "desc": "Style: ribbon. Cost: 20c Box",
                "example": "!settrail love"
            },
            {
                "cmd": "Tech",
                "aliases": [
                    "COMMON"
                ],
                "desc": "Style: ribbon. Cost: 20c Box",
                "example": "!settrail tech"
            },
            {
                "cmd": "Bubblegum",
                "aliases": [
                    "COMMON"
                ],
                "desc": "Style: ribbon. Cost: 20c Box",
                "example": "!settrail bubble"
            },
            {
                "cmd": "Toxic",
                "aliases": [
                    "RARE"
                ],
                "desc": "Style: ribbon. Cost: 44c Box",
                "example": "!settrail toxic"
            },
            {
                "cmd": "Oceanic",
                "aliases": [
                    "RARE"
                ],
                "desc": "Style: ribbon. Cost: 44c Box",
                "example": "!settrail oceanic"
            },
            {
                "cmd": "Plasma",
                "aliases": [
                    "RARE"
                ],
                "desc": "Style: ribbon. Cost: 44c Box",
                "example": "!settrail plasma"
            },
            {
                "cmd": "Hot Rod",
                "aliases": [
                    "RARE"
                ],
                "desc": "Style: ribbon. Cost: 44c Box",
                "example": "!settrail hotrod"
            },
            {
                "cmd": "Royalty",
                "aliases": [
                    "RARE"
                ],
                "desc": "Style: ribbon. Cost: 44c Box",
                "example": "!settrail royalty"
            },
            {
                "cmd": "High Voltage",
                "aliases": [
                    "RARE"
                ],
                "desc": "Style: ribbon. Cost: 44c Box",
                "example": "!settrail voltage"
            },
            {
                "cmd": "Permafrost",
                "aliases": [
                    "EPIC"
                ],
                "desc": "Style: ribbon. Cost: 70c Box",
                "example": "!settrail frost"
            },
            {
                "cmd": "Sunset Drive",
                "aliases": [
                    "EPIC"
                ],
                "desc": "Style: ribbon. Cost: 70c Box",
                "example": "!settrail sunset"
            },
            {
                "cmd": "Emerald City",
                "aliases": [
                    "EPIC"
                ],
                "desc": "Style: ribbon. Cost: 70c Box",
                "example": "!settrail emerald"
            },
            {
                "cmd": "The Void",
                "aliases": [
                    "EPIC"
                ],
                "desc": "Style: ribbon. Cost: 70c Box",
                "example": "!settrail void"
            },
            {
                "cmd": "Crimson Guard",
                "aliases": [
                    "EPIC"
                ],
                "desc": "Style: ribbon. Cost: 70c Box",
                "example": "!settrail crimson"
            },
            {
                "cmd": "Absolute Zero",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "Style: ribbon. Cost: 150c Box",
                "example": "!settrail absolute_zero"
            },
            {
                "cmd": "Inferno",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "Style: ribbon. Cost: 150c Box",
                "example": "!settrail inferno"
            },
            {
                "cmd": "The Matrix",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "Style: ribbon. Cost: 150c Box",
                "example": "!settrail matrix"
            },
            {
                "cmd": "Rainbow Road",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "Style: ribbon. Cost: 150c Box",
                "example": "!settrail rainbow"
            },
            {
                "cmd": "Nebula",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "Style: ribbon. Cost: 150c Box",
                "example": "!settrail nebula"
            },
            {
                "cmd": "Neon Blue",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "Style: ribbon. Cost: 150c Box",
                "example": "!settrail neon"
            },
            {
                "cmd": "Quantum Realm",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "Style: ribbon. Cost: 150c Box",
                "example": "!settrail quantum"
            },
            {
                "cmd": "Redacted",
                "aliases": [
                    "LEGENDARY"
                ],
                "desc": "Style: ribbon. Cost: 150c Box",
                "example": "!settrail redacted"
            },
            {
                "cmd": "High Roller",
                "aliases": [
                    "SPECIAL"
                ],
                "desc": "Style: novelty. Cost: Event/Special",
                "example": "!settrail money"
            },
            {
                "cmd": "ALPHA GLITCH",
                "aliases": [
                    "SPECIAL"
                ],
                "desc": "Style: ribbon. Cost: Event/Special",
                "example": "!settrail glitch"
            },
            {
                "cmd": "Music Notes",
                "aliases": [
                    "NOVELTY"
                ],
                "desc": "Style: novelty. Cost: 100c Direct",
                "example": "!buy trail notes"
            },
            {
                "cmd": "Poop",
                "aliases": [
                    "NOVELTY"
                ],
                "desc": "Style: novelty. Cost: 100c Direct",
                "example": "!buy trail poop"
            },
            {
                "cmd": "Soap Bubbles",
                "aliases": [
                    "NOVELTY"
                ],
                "desc": "Style: novelty. Cost: 100c Direct",
                "example": "!buy trail real_bubbles"
            },
            {
                "cmd": "Paw Prints",
                "aliases": [
                    "NOVELTY"
                ],
                "desc": "Style: novelty. Cost: 100c Direct",
                "example": "!buy trail paws"
            },
            {
                "cmd": "Cum",
                "aliases": [
                    "NOVELTY"
                ],
                "desc": "Style: novelty. Cost: 100c Direct",
                "example": "!buy trail cum"
            },
            {
                "cmd": "Train Tracks",
                "aliases": [
                    "NOVELTY"
                ],
                "desc": "Style: ribbon. Cost: 100c Direct",
                "example": "!buy trail tracks"
            },
            {
                "cmd": "The Entity",
                "aliases": [
                    "NOVELTY"
                ],
                "desc": "Style: novelty. Cost: 100c Direct",
                "example": "!buy trail scratch_marks"
            },
            {
                "cmd": "Barbed Wire",
                "aliases": [
                    "NOVELTY"
                ],
                "desc": "Style: novelty. Cost: 100c Direct",
                "example": "!buy trail barbed_wire"
            },
            {
                "cmd": "Blood Trail",
                "aliases": [
                    "NOVELTY"
                ],
                "desc": "Style: novelty. Cost: 100c Direct",
                "example": "!buy trail blood"
            }
        ]
    },
    {
        "category": "🎉 PARTY EFFECTS",
        "color": "text-purple-300",
        "items": [
            {
                "cmd": "📡 Ping Spike",
                "aliases": [
                    "ATTACK AHEAD"
                ],
                "desc": "Freezes target for 1.5s",
                "example": "(Random Drop)"
            },
            {
                "cmd": "💀 DDOS Attack",
                "aliases": [
                    "GLOBAL LEADER"
                ],
                "desc": "Stuns leader for 3s",
                "example": "(Random Drop)"
            },
            {
                "cmd": "📉 Packet Loss",
                "aliases": [
                    "ATTACK AHEAD"
                ],
                "desc": "Rewinds target position",
                "example": "(Random Drop)"
            },
            {
                "cmd": "🦠 Virus Upload",
                "aliases": [
                    "MULTI TARGET"
                ],
                "desc": "Slows random opponents",
                "example": "(Random Drop)"
            },
            {
                "cmd": "🔄 Remote Transfer",
                "aliases": [
                    "SWAP"
                ],
                "desc": "Swap places with a leader!",
                "example": "(Random Drop)"
            },
            {
                "cmd": "📧 Spam Bot",
                "aliases": [
                    "TRAP BEHIND"
                ],
                "desc": "Slows anyone who touches it",
                "example": "(Random Drop)"
            },
            {
                "cmd": "🟦 B.S.O.D.",
                "aliases": [
                    "TRAP BEHIND"
                ],
                "desc": "Fatal Error (4s Stun)",
                "example": "(Random Drop)"
            },
            {
                "cmd": "📦 Zip Bomb",
                "aliases": [
                    "TRAP BEHIND"
                ],
                "desc": "Explosive Area Slow",
                "example": "(Random Drop)"
            },
            {
                "cmd": "🔥 Firewall",
                "aliases": [
                    "SELF"
                ],
                "desc": "Blocks hits for 10s",
                "example": "(Random Drop)"
            },
            {
                "cmd": "👻 VPN Tunnel",
                "aliases": [
                    "SELF"
                ],
                "desc": "Untargetable for 10s",
                "example": "(Random Drop)"
            },
            {
                "cmd": "⚡ Overclock",
                "aliases": [
                    "SELF"
                ],
                "desc": "150% Speed + Terrain Ignore",
                "example": "(Random Drop)"
            },
            {
                "cmd": "💾 Download RAM",
                "aliases": [
                    "SELF"
                ],
                "desc": "Teleport forward",
                "example": "(Random Drop)"
            },
            {
                "cmd": "🔋 Clear Cache",
                "aliases": [
                    "SELF"
                ],
                "desc": "Short Speed Boost",
                "example": "(Random Drop)"
            },
            {
                "cmd": "⏳ System Update",
                "aliases": [
                    "GLOBAL ALL"
                ],
                "desc": "Slows everyone else",
                "example": "(Random Drop)"
            }
        ]
    },
    {
        "category": "🛡️ MODERATOR COMMANDS",
        "color": "text-orange-500",
        "items": [
            {
                "cmd": "!startrace",
                "aliases": [
                    "!start"
                ],
                "desc": "Start the race from the current lobby.",
                "example": "!start"
            },
            {
                "cmd": "!raceopen",
                "aliases": [
                    "!solorace"
                ],
                "desc": "Open a standard Solo Lobby.",
                "example": "!solorace"
            },
            {
                "cmd": "!teamrace",
                "aliases": [],
                "desc": "Open a Team Race Lobby.",
                "example": "!teamrace"
            },
            {
                "cmd": "!relayrace",
                "aliases": [],
                "desc": "Open a Relay Race Lobby.",
                "example": "!relayrace"
            },
            {
                "cmd": "!partymode",
                "aliases": [
                    "!party"
                ],
                "desc": "Toggle Party Mode (Items/Chaos).",
                "example": "!party"
            },
            {
                "cmd": "!elimination",
                "aliases": [
                    "!elim"
                ],
                "desc": "Toggle Elimination Mode (The Storm).",
                "example": "!elim"
            },
            {
                "cmd": "!gauntlet",
                "aliases": [],
                "desc": "Toggle Gauntlet Mode.",
                "example": "!gauntlet"
            },
            {
                "cmd": "!endgauntlet",
                "aliases": [],
                "desc": "Force end the current Gauntlet.",
                "example": "!endgauntlet"
            },
            {
                "cmd": "!skipwait",
                "aliases": [
                    "!nextrace"
                ],
                "desc": "Skip the intermission timer.",
                "example": "!skipwait"
            },
            {
                "cmd": "!raceclear",
                "aliases": [
                    "!clearrace"
                ],
                "desc": "Resets the lobby entirely.",
                "example": "!clearrace"
            },
            {
                "cmd": "!addbot",
                "aliases": [],
                "desc": "Add a computer racer.",
                "example": "!addbot"
            },
            {
                "cmd": "!kick <user>",
                "aliases": [],
                "desc": "Remove a player from the lobby.",
                "example": "!kick @username"
            },
            {
                "cmd": "!openwheel",
                "aliases": [
                    "!showwheel"
                ],
                "desc": "Opens the Chance Wheel.",
                "example": "!openwheel"
            },
            {
                "cmd": "!closewheel",
                "aliases": [
                    "!hidewheel"
                ],
                "desc": "Closes the Chance Wheel.",
                "example": "!closewheel"
            },
            {
                "cmd": "!spinnow",
                "aliases": [
                    "!triggerwheel"
                ],
                "desc": "Triggers the next spin.",
                "example": "!spinnow"
            },
            {
                "cmd": "!calm / !normal / !chaos",
                "aliases": [],
                "desc": "Set Party Mode frequency.",
                "example": "!chaos"
            }
        ]
    },
    {
        "category": "📡 BROADCASTER COMMANDS",
        "color": "text-purple-500",
        "items": [
            {
                "cmd": "!giveticket <user> <amount>",
                "aliases": [],
                "desc": "Give Spin Tickets to a player.",
                "example": "!giveticket @username 1"
            },
            {
                "cmd": "!givecoins <user> <amount>",
                "aliases": [],
                "desc": "Add coins to a user's wallet.",
                "example": "!givecoins @username 1000"
            },
            {
                "cmd": "!giveitem <user> <amount> <item>",
                "aliases": [],
                "desc": "Gift items to a player.",
                "example": "!giveitem @username 5 boots"
            },
            {
                "cmd": "!givetrail <user> <trail_id>",
                "aliases": [],
                "desc": "Unlock a specific trail for a user.",
                "example": "!givetrail @username fire"
            },
            {
                "cmd": "!resetracer <user>",
                "aliases": [],
                "desc": "⚠️ FULL RESET: Wipes a user's stats, inventory, and coins.",
                "example": "!resetracer @username"
            }
        ]
    }
];