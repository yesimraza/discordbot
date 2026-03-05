module.exports.config = {
    name: 'timejoin',
    version: '10.02',
    hasPermssion: 0,
    credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
    description: 'Save and check the time you joined the group',
    commandCategory: 'Utilities',
    usages: '{...reply || tags}\n{all || list}',
    cooldowns: 3,
};

const {
    readFileSync,
    writeFileSync,
    mkdirSync,
    existsSync
} = require('fs-extra'); // npm install fs-extra

const destD = __dirname + '/noprefix/timejoinbox';
const newUser = a => ({
    id: a, timestamp: Date.now()
});
const checkNum = a => Math.floor(a) < 10 ? '0' + Math.floor(a) : Math.floor(a);
const etnTime = a => `${checkNum(a / (60 * 60 * 1000) % 24)}:${checkNum(a / (60 * 1000) % 60)}:${checkNum(a / (1000) % 60)} | ${checkNum(a / (24 * 60 * 60 * 1000) % 30)}/${checkNum(a / (30 * 24 * 60 * 60 * 1000) % 12)}/${checkNum(a / (12 * 30 * 24 * 60 * 60 * 1000))}`;
const sortCompare = k => (a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0);
const name = a => global.data.userName.get(a);

module.exports.onLoad = function () {
    if (!existsSync(destD)) mkdirSync(destD);
};

module.exports.run = function ({ api, event, args }) {
    const out = (a, b, c, d) => api.sendMessage(`${a}`, b ? b : event.threadID, c ? c : null, d ? d : event.messageID);

    if (!event.isGroup) 
        return out(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ 𝐓𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐰𝐨𝐫𝐤𝐬 𝐨𝐧𝐥𝐲 𝐢𝐧 𝐠𝐫𝐨𝐮𝐩𝐬!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`);

    const destF = destD + '/' + event.threadID + '.json';
    const dataF = JSON.parse(readFileSync(destF, 'utf-8'));
    dataF.user.sort(sortCompare('timestamp'));

    if (/all|list/.test(args[0])) {
        return out(
            dataF.user.map((d, idx) =>
                `≿━━━━༺❀༻━━━━≾\n\n${idx + 1}. 𝐍𝐚𝐦𝐞: ${name(d.id)}\n📅 𝐉𝐨𝐢𝐧𝐞𝐝 𝐎𝐧: ${(x = JSON.stringify(new Date(d.timestamp)).split(/\.|T/), `${x[1]} | ${x[0].replace(/"/, '')}`)}\n\n≿━━━━༺❀༻━━━━≾`
            ).join('\n\n')
        );
    }

    const id = event.type == 'message_reply'
        ? event.messageReply.senderID
        : (x0 = Object.keys(event.mentions), x0 != 0) ? x0[0] : event.senderID;

    const findID = dataF.user.find(i => i.id == id);

    out(
`⚝──⭒─⭑─⭒──⚝  

🍒 𝐍𝐚𝐦𝐞: ${name(findID.id)}  
📅 𝐉𝐨𝐢𝐧𝐞𝐝 𝐎𝐧: ${(x = JSON.stringify(new Date(findID.timestamp)).split(/\.|T/), `${x[1]} | ${x[0].replace(/"/, '')}`)}  

⚝──⭒─⭑─⭒──⚝`
    );
};

module.exports.handleEvent = function ({ api, event }) {
    if (!event.isGroup) return;
    const destF = destD + '/' + event.threadID + '.json';
    if (!existsSync(destF)) writeFileSync(destF, '{"user": []}');
    const dataF = JSON.parse(readFileSync(destF, 'utf-8'));
    const allID = event.participantIDs;

    if (dataF.user.length != allID.length) {
        allID.forEach(i => {
            if (!dataF.user.find(j => j.id == i)) dataF.user.push(newUser(i));
        });
        dataF.user = dataF.user.filter(i => allID.includes(i.id));
    }

    writeFileSync(destF, JSON.stringify(dataF, 0, 0), 'utf-8');
};