const fs = require('fs');

const content = fs.readFileSync("c:/Users/flipp/Downloads/StreamRacers-Standalone/src/js/game.js", 'utf8');
const scriptRaw = content.substring(0, content.indexOf("class Game {"));

const dummy = `
const document = { getElementById: () => ({ addEventListener: () => {} }) };
const window = {};
const CONFIG = {};
`;

const runner = `
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
        example: r === 'novelty' ? '!buy trail ' + key : '!settrail ' + key
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
        example: '(Random Drop)'
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
`;

fs.writeFileSync("C:/Users/flipp/Downloads/StreamRacers-Docs/run_extract.js", dummy + "\n" + scriptRaw + "\n" + runner);
