const fs = require('fs');

const code = fs.readFileSync('c:/Users/flipp/Downloads/StreamRacers-Standalone/src/js/game.js', 'utf8');

function extractBlock(start, stop) {
    const s = code.indexOf(start);
    const e = code.indexOf(stop, s);
    return code.substring(s, e);
}

const itemsCode = extractBlock('const ITEMS = {', 'const ITEM_ALIASES');
const trailsCode = extractBlock('const TRAILS = {', 'CONFIG.partyModeEnabled');
const partyCode = extractBlock('const PARTY_ITEMS = [', 'const WHEEL_PRIZES = [');
const teamsCode = extractBlock('const TEAMS = [', 'class Game {');

// The getHelpData function contains the static array
// Let's just extract the raw return array from getHelpData()
const helpStart = code.indexOf('return [', code.indexOf('getHelpData() {'));
let helpCode = '';
if (helpStart !== -1) {
    // We want the whole return array. It ends with "];"
    const startIdx = helpStart + 'return '.length;
    // We will find the closing bracket of the return array.
    // Since it's well-formatted, let's just find the closing bracket that matches the opening.
    let depth = 0;
    let endIdx = -1;
    for (let i = startIdx; i < code.length; i++) {
        if (code[i] === '[') depth++;
        if (code[i] === ']') {
            depth--;
            if (depth === 0) {
                endIdx = i + 1;
                break;
            }
        }
    }
    helpCode = code.substring(startIdx, endIdx);
}

// Now we build a standalone script that evaluates these variables and runs the getHelpData logic
const script = `
const fs = require('fs');

${itemsCode}
${trailsCode}
${partyCode}
${teamsCode}

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
            desc = \`\${i.stat} \${i.amount > 0 ? '+' : ''}\${i.amount}\`;
            if (i.stat2) desc += \`, \${i.stat2} \${i.amount2 > 0 ? '+' : ''}\${i.amount2}\`;
            if (i.rarity === 'rare' && (i.amount2 < 0)) desc += " (Cursed)";
        }

        itemList.push({
            cmd: \`\${i.icon} \${i.name}\`,
            aliases: [i.rarity ? i.rarity.toUpperCase() : 'COMMON'],
            desc: desc,
            example: \`!use \${key}\`
        });
    });

    itemList.sort((a, b) => {
        const rA = a.aliases[0] ? a.aliases[0].toLowerCase() : 'common';
        const rB = b.aliases[0] ? b.aliases[0].toLowerCase() : 'common';
        return (rarityOrder[rA] || 9) - (rarityOrder[rB] || 9);
    });

    let trailList = [];
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
            desc: \`Style: \${t.type || 'Standard'}. Cost: \${cost}\`,
            example: r === 'novelty' ? \`!buy trail \${key}\` : \`!settrail \${key}\`
        };
        if (fs.existsSync('c:/Users/flipp/Downloads/StreamRacers-Docs/' + imgPath)) {
            obj.image = imgPath;
        }
        trailList.push(obj);
    });

    const order = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'NOVELTY', 'SPECIAL'];
    const grouped = {};
    order.forEach(r => grouped[r] = []);
    
    trailList.forEach(t => {
        let rarity = t.aliases && t.aliases.length > 0 ? t.aliases[0] : 'COMMON';
        if (!grouped[rarity]) grouped[rarity] = [];
        grouped[rarity].push(t);
    });
    
    const newTrailList = [];
    order.forEach(r => {
        if (grouped[r] && grouped[r].length > 0) {
            newTrailList.push({
                isSubHeader: true,
                title: r + ' TRAILS',
                cmd: '',
                desc: '',
                example: '',
                aliases: []
            });
            newTrailList.push(...grouped[r]);
        }
    });
    Object.keys(grouped).forEach(r => {
        if (!order.includes(r) && grouped[r].length > 0) {
            newTrailList.push({
                isSubHeader: true,
                title: r + ' TRAILS',
                cmd: '',
                desc: '',
                example: '',
                aliases: []
            });
            newTrailList.push(...grouped[r]);
        }
    });
    trailList = newTrailList;

    const partyList = [];
    PARTY_ITEMS.forEach(p => {
        partyList.push({
            cmd: \`\${p.icon} \${p.name}\`,
            aliases: [p.type.toUpperCase().replace('_', ' ')],
            desc: p.desc,
            example: "(Random Drop)"
        });
    });

    const teamList = [];
    TEAMS.forEach(t => {
        teamList.push({
            cmd: \`\${t.icon} \${t.name}\`,
            aliases: t.aliases.map(a => a.toUpperCase()),
            desc: \`Color: \${t.id.toUpperCase()}. Motto: "\${t.motto}"\`,
            example: \`!rb 100 \${t.aliases[0]}\`
        });
    });

    const helpData = ${helpCode};

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
`;

fs.writeFileSync('build.js', script);
