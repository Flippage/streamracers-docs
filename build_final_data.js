const fs = require('fs');

const extracted = JSON.parse(fs.readFileSync('C:/Users/flipp/Downloads/StreamRacers-Docs/js/extracted.json', 'utf8'));

const COMMANDS_DATA = [
    {
        category: "🏁 BASICS",
        color: "text-white",
        items: [
            { cmd: "!racejoin", aliases: ["!joinrace", "!rj", "!jr", "!race"], desc: "Joins the current race lobby.", example: "!racejoin" },
            { cmd: "!raceleave", aliases: ["!leaverace", "!rl", "!lr"], desc: "Leaves the lobby (before race starts).", example: "!rl" }
        ]
    },
    {
        category: "🛡️ TEAMS & SYMBOLS",
        color: "text-indigo-400",
        items: extracted.teamList
    },
    {
        category: "💰 ECONOMY & BETTING",
        color: "text-yellow-400",
        items: [
            { cmd: "!racebet <amount> <target>", aliases: ["!rb"], desc: "Bet coins on a racer or team. You can use 'all' for amount.", example: "!rb 100 @username" },
            { cmd: "!racecancelbet", aliases: ["!rcb"], desc: "Cancels your active bet and refunds coins.", example: "!rcb" },
            { cmd: "!racecoins", aliases: ["!rc"], desc: "Check your coin balance.", example: "!rc" },
            { cmd: "!racetrade <item> <amount>", aliases: ["!sell"], desc: "Sell items back to the shop for 10% value.", example: "!sell boots 2" }
        ]
    },
    {
        category: "🎒 ITEMS & SHOP",
        color: "text-blue-400",
        items: [
            { cmd: "!spin [amount]", aliases: ["!racewheel"], desc: "Spend Spin Tickets to win prizes!", example: "!spin 5" },
            { cmd: "!tickets", aliases: ["!ticket"], desc: "Check your Spin Ticket balance.", example: "!tickets" },
            { cmd: "!racebuy <type> <rarity>", aliases: ["!buy"], desc: "Buy a random Item or Trail box. Types: 'item' or 'trail'. Rarities: common, rare, epic, legendary, novelty.", example: "!buy item rare" },
            { cmd: "!raceitem <item> <target>", aliases: ["!use"], desc: "Use an item from your bag. Targeting another racer is optional for buffs. Can specify amount/all.", example: "!use boots" },
            { cmd: "!racebag", aliases: ["!bag"], desc: "View your current inventory items.", example: "!bag" }
        ]
    },
    {
        category: "📦 ITEM DEX",
        color: "text-blue-300",
        items: extracted.itemList
    },
    {
        category: "🎨 CUSTOMIZATION",
        color: "text-pink-400",
        items: [
            { cmd: "!icon <emote/emoji>", aliases: ["!raceicon"], desc: "Change your racer avatar.", example: "!icon PogChamp" },
            { cmd: "!settrail <name>", aliases: ["!racetrail"], desc: "Equip an unlocked trail.", example: "!settrail fire" },
            { cmd: "!trails", aliases: [], desc: "List all trails you own.", example: "!trails" },
            { cmd: "!rollracer <class>", aliases: ["!reroll"], desc: "Reroll your stats (balanced, specialist, dualist, unstable).", example: "!reroll specialist" },
            { cmd: "!racestats <user>", aliases: ["!racerstats"], desc: "View win/loss records and current stats.", example: "!racestats @username" },
            { cmd: "!racecoinleaderboard", aliases: ["!rich"], desc: "View the wealthiest players.", example: "!rich" },
            { cmd: "!topsolo [all]", aliases: [], desc: "Top 5 Solo Winners (Season). Add 'all' for All-Time.", example: "!topsolo" },
            { cmd: "!topteam [all]", aliases: [], desc: "Top 5 Team Winners (Season). Add 'all' for All-Time.", example: "!topteam" },
            { cmd: "!toprelay [all]", aliases: [], desc: "Top 5 Relay Winners (Season). Add 'all' for All-Time.", example: "!toprelay" },
            { cmd: "!topelim [all]", aliases: [], desc: "Top 5 Elimination Survivors.", example: "!topelim" },
            { cmd: "!topgauntlet [all]", aliases: [], desc: "Top 5 Gauntlet Series Champions.", example: "!topgauntlet" }
        ]
    },
    {
        category: "🌈 TRAIL GALLERY",
        color: "text-pink-300",
        items: extracted.trailList
    },
    {
        category: "🎉 PARTY EFFECTS",
        color: "text-purple-300",
        items: extracted.partyList
    },
    {
        category: "🛡️ MODERATOR COMMANDS",
        color: "text-orange-500",
        items: [
            { cmd: "!startrace", aliases: ["!start"], desc: "Start the race from the current lobby.", example: "!start" },
            { cmd: "!raceopen", aliases: ["!solorace"], desc: "Open a standard Solo Lobby.", example: "!solorace" },
            { cmd: "!teamrace", aliases: [], desc: "Open a Team Race Lobby.", example: "!teamrace" },
            { cmd: "!relayrace", aliases: [], desc: "Open a Relay Race Lobby.", example: "!relayrace" },
            { cmd: "!partymode", aliases: ["!party"], desc: "Toggle Party Mode (Items/Chaos).", example: "!party" },
            { cmd: "!elimination", aliases: ["!elim"], desc: "Toggle Elimination Mode (The Storm).", example: "!elim" },
            { cmd: "!gauntlet", aliases: [], desc: "Toggle Gauntlet Mode.", example: "!gauntlet" },
            { cmd: "!endgauntlet", aliases: [], desc: "Force end the current Gauntlet.", example: "!endgauntlet" },
            { cmd: "!skipwait", aliases: ["!nextrace"], desc: "Skip the intermission timer.", example: "!skipwait" },
            { cmd: "!raceclear", aliases: ["!clearrace"], desc: "Resets the lobby entirely.", example: "!clearrace" },
            { cmd: "!addbot", aliases: [], desc: "Add a computer racer.", example: "!addbot" },
            { cmd: "!kick <user>", aliases: [], desc: "Remove a player from the lobby.", example: "!kick @username" },
            { cmd: "!openwheel", aliases: ["!showwheel"], desc: "Opens the Chance Wheel.", example: "!openwheel" },
            { cmd: "!closewheel", aliases: ["!hidewheel"], desc: "Closes the Chance Wheel.", example: "!closewheel" },
            { cmd: "!spinnow", aliases: ["!triggerwheel"], desc: "Triggers the next spin.", example: "!spinnow" },
            { cmd: "!calm / !normal / !chaos", aliases: [], desc: "Set Party Mode frequency.", example: "!chaos" }
        ]
    },
    {
        category: "📡 BROADCASTER COMMANDS",
        color: "text-purple-500",
        items: [
            { cmd: "!giveticket <user> <amount>", aliases: [], desc: "Give Spin Tickets to a player.", example: "!giveticket @username 1" },
            { cmd: "!givecoins <user> <amount>", aliases: [], desc: "Add coins to a user's wallet.", example: "!givecoins @username 1000" },
            { cmd: "!giveitem <user> <amount> <item>", aliases: [], desc: "Gift items to a player.", example: "!giveitem @username 5 boots" },
            { cmd: "!givetrail <user> <trail_id>", aliases: [], desc: "Unlock a specific trail for a user.", example: "!givetrail @username fire" },
            { cmd: "!resetracer <user>", aliases: [], desc: "⚠️ FULL RESET: Wipes a user's stats, inventory, and coins.", example: "!resetracer @username" }
        ]
    }
];

fs.writeFileSync('C:/Users/flipp/Downloads/StreamRacers-Docs/js/data.js', 'const COMMANDS_DATA = ' + JSON.stringify(COMMANDS_DATA, null, 4) + ';');
