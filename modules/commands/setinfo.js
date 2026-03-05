const configCmd = {
    name: 'setinfo',
    version: '1.1.1',
    hasPermssion: 0,
    credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
    description: 'Set your personal information.',
    commandCategory: 'Member',
    usages: '[...|setup|del|avatar]',
    cooldowns: 3
},
fse = require('fs-extra'),
axios = require('axios'),
pathS = __dirname+'/cache/savedInfo.json',
streamURL = async url => (await axios.get(url, {
    responseType: 'stream'
})).data,
formInfo = {
    info: [['name'],
        ['birthday'],
        ['nickname'],
        ['location'],
        ['hobbies'],
        ['notes']]};


function swapInArray(a, x, y) {
    b = a[x]
    a[x] = a[y]
    a[y] = b;
    return a;
};

function upperFirstLetter(content) {
    return content.split(' ').map(el=> {
        el = el.split('')
        el[0] = el[0].toUpperCase()
        return el.join('');
    }).join(' ')
};

function loadCmd() {
    if (!fse.existsSync(pathS)) fse.writeFileSync(pathS, '{"user":{}}');
};

async function runCmd(arg) {
    const {
        senderID: sid,
        threadID: tid,
        type,
        messageReply,
        mentions
    } = arg.event,
    id = type == 'message_reply'?messageReply.senderID: (tags = Object.keys(mentions), tags != 0)?tags[0]: sid,
    prefix = arg.event.args[0][0],
    out = (a, b, c, d) => arg.api.sendMessage(a, b?b: tid, c?c: null, d?d: arg.event.messageID),
    dataInfo = JSON.parse(fse.readFileSync(pathS))

    if (/^setup/.test(arg.args[0])) {
        if (!dataInfo.user[sid]) {
            dataInfo.user[sid] = formInfo;
            fse.writeFileSync(pathS, JSON.stringify(dataInfo, 0, 4))
        }
        return out(`${dataInfo.user[sid].info.map((el, idx)=>`${idx+1}. ${el[0]}: ${!!el[1]?el.pop(): 'No Data Yet.'}`).join('\n')}\n━━━━━━━━━━━━━━━━━━\n${upperFirstLetter('➜ [reply] + [No.]\n➜ [reply] + [No.] + [text]\n➜ [reply] + [No.] + [text]: [text]\n➜ [reply] + [No.] -> [No.]')}`, '', (err, dataMsg) => global.client.handleReply.push({
            name: configCmd.name, messageID: dataMsg.messageID, author: sid, chooses: 'setup'
        }));
    };

    if (!dataInfo.user[id]) return out(sid != id?'This user has no saved information.': `You don’t have any information yet, use "${prefix}${configCmd.name} setup" to add.`);

    if (/^(avatar|avt)/.test(arg.args[0])) {
        if (!/^https:\/\/[a-zA-Z0-9\.\/\-\_\#]+\.(png|jpg|jpge|JPGE|gif)$/.test(arg.args[1])) return out(`➜ Only image links are accepted (jpg, jpge, png, gif).`);
        dataInfo.user[sid].avatar = arg.args[1];
        fse.writeFileSync(pathS, JSON.stringify(dataInfo, 0, 4));
        return out(`≿━━━━༺❀༻━━━━≾\n\n𝐀𝐯𝐚𝐭𝐚𝐫 𝐬𝐞𝐭 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 ✅\n\n≿━━━━༺❀༻━━━━≾`);
    };

    if (/^(del|reset)/.test(arg.args[0])) {
        delete dataInfo.user[sid];
        fse.writeFileSync(pathS, JSON.stringify(dataInfo, 0, 4));
        return out(`≿━━━━༺❀༻━━━━≾\n\n𝐘𝐨𝐮𝐫 𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐝𝐞𝐥𝐞𝐭𝐞𝐝 ❌\n\n≿━━━━༺❀༻━━━━≾`);
    };

    const msg = {};

    if ((avt = dataInfo.user[sid].avatar), !!avt) msg.attachment = await streamURL(avt);
    msg.body = dataInfo.user[id].info.map(el => `- ${upperFirstLetter(el[0])}: ${!!el[1]?el.pop(): 'No Data Yet!'}`).join('\n');
    out(msg);
};

function reply(arg) {
    const {
        senderID: sid,
        threadID: tid,
        body
    } = arg.event,
    _ = arg.handleReply,
    prefix = arg.event.args[0][0],
    out = (a, b, c, d) => arg.api.sendMessage(a, b?b: tid, c?c: null, d?d: arg.event.messageID),
    dataInfo = JSON.parse(fse.readFileSync(pathS))

    if (sid != _.author)return;
    if (/^setup/.test(_.chooses)) {
        var txt = '',
        input = /\n/.test(body)? body.split('\n'): [body];
        for (const el of input) {
            if (/[0-9] \-> [0-9]/.test(el)) {
                const a = el.split(' -> '),
                x = a[0],
                y = a[1]
                swapInArray(dataInfo.user[sid].info, x-1, y-1);
                txt += `➜ Moved item "${x}" to "${y}".`;
            } else if (isNaN(el)) {
                const edit = el.split(' '),
                index = edit.shift()-1;

                if (/:$/.test(edit[0])) {
                    if (!dataInfo.user[sid].info[index]) dataInfo.user[sid].info[index] = [];
                    const newI = edit[0].replace(':', '');
                    dataInfo.user[sid].info[index][0] = newI;
                    txt += `\n➜ Updated field name to "${newI}".`
                    edit.shift();
                }
                const content = edit.join(' ')
                dataInfo.user[sid].info[index].push(content);
                txt += `\n➜ Information updated successfully ✅`
            } else if (isFinite(el)) {
                const del = dataInfo.user[sid].info.splice(el-1, 1);
                txt += `\n➜ Removed information "${del[0]}: ${del.pop()}"`
            }
        };
        dataInfo.user[sid].info = dataInfo.user[sid].info.filter(el=>!!el);
        fse.writeFileSync(pathS, JSON.stringify(dataInfo, 0, 4))
        out(`⚝──⭒─⭑─⭒──⚝\n\n${txt}\n\n⚝──⭒─⭑─⭒──⚝`)
    };
};

module.exports = {
    config: configCmd,
    onLoad: loadCmd,
    run: runCmd,
    handleReply: reply
}