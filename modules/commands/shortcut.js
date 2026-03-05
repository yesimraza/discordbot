module.exports.config = {
    name: "shortcut",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Create quick replies that trigger when someone uses a tag or keyword",
    commandCategory: "Member",
    usages: "[all/delete/empty/tag]",
    cooldowns: 0,
    images: [],
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

let format_attachment = type => ({
    photo: 'png', video: 'mp4', audio: 'mp3', animated_image: 'gif',
})[type] || 'bin';

module.exports.onLoad = function () {
    const { existsSync, writeFileSync, mkdirSync, readFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, '..', 'events', "shortcut", "shortcutdata.json");
    const pathGif = resolve(__dirname, '..', 'events', "shortcut", "shortcut");
    if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
    if (!existsSync(path)) writeFileSync(path, JSON.stringify([]), "utf-8");
    if (!existsSync(pathGif)) mkdirSync(pathGif, { recursive: true });
    const data = JSON.parse(readFileSync(path, "utf-8"));
    for (const threadData of data) global.moduleData.shortcut.set(threadData.threadID, threadData.shortcuts);
    return;
}

module.exports.handleEvent = async function ({ event, api, Users }) {
    const { threadID, messageID, body, senderID, mentions: Mentions = {} } = event;
    if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
    if (!global.moduleData.shortcut.has(threadID)) return;
    let mentions = Object.keys(Mentions);
    const data = global.moduleData.shortcut.get(threadID);
    if (!body) return;
    if ((dataThread = mentions.length > 0 ? data.find(item => typeof item.tag_id == 'string' && mentions.includes(item.tag_id)) : false) || (dataThread = data.find(item => (item.input || '').toLowerCase() == body.toLowerCase()))) {
        const { resolve } = global.nodemodule["path"];
        const { existsSync, createReadStream } = global.nodemodule["fs-extra"];
        var object, output;
        var moment = require("moment-timezone");
        var time = moment.tz("Asia/Karachi").format('HH:mm:ss | DD/MM/YYYY');
        var output = dataThread.output;
        if (/\{name}/g.test(output)) {
            const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
            output = output.replace(/\{name}/g, name).replace(/\{time}/g, time);
        }
        if (dataThread.uri) object = { body: output, attachment: (await require('axios').get(dataThread.uri, { responseType: 'stream' }).catch(e => ({ data: void 0 }))).data }
        else object = { body: output };
        return api.sendMessage(object, threadID, messageID);
    }
}

module.exports.handleReply = async function ({ event = {}, api, handleReply }) {
    if (handleReply.author != event.senderID) return;
    const { readFileSync, writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
    const axios = require('axios');
    try {
        const { resolve } = global.nodemodule["path"];
        const { threadID, messageID, senderID, body } = event;
        const name = this.config.name;
        const path = resolve(__dirname, '..', 'events', "shortcut", "shortcutdata.json");

        switch (handleReply.type) {
            case "requireInput": {
                if (body.length == 0) return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗧𝗵𝗲 𝗶𝗻𝗽𝘂𝘁 𝗰𝗮𝗻𝗻𝗼𝘁 𝗯𝗲 𝗲𝗺𝗽𝘁𝘆.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", threadID, messageID);
                const data = global.moduleData.shortcut.get(threadID) || [];
                if (data.some(item => item.input == body)) return api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n𝗧𝗵𝗶𝘀 𝗶𝗻𝗽𝘂𝘁 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗲𝘅𝗶𝘀𝘁𝘀.\n\n⚝──⭒─⭑─⭒──⚝", threadID, messageID);
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘄𝗶𝘁𝗵 𝘁𝗵𝗲 𝗮𝗻𝘀𝘄𝗲𝗿 𝗳𝗼𝗿 𝘁𝗵𝗶𝘀 𝗸𝗲𝘆𝘄𝗼𝗿𝗱.\n\n≿━━━━༺❀༻━━━━≾", threadID, function (error, info) {
                    return global.client.handleReply.push({
                        type: "requireOutput",
                        name,
                        author: senderID,
                        messageID: info.messageID,
                        input: body
                    });
                }, messageID);
            }
            case "requireOutput": {
                if (body.length == 0) return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗧𝗵𝗲 𝗮𝗻𝘀𝘄𝗲𝗿 𝗰𝗮𝗻𝗻𝗼𝘁 𝗯𝗲 𝗲𝗺𝗽𝘁𝘆.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", threadID, messageID);
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗮 𝘃𝗶𝗱𝗲𝗼/𝗶𝗺𝗮𝗴𝗲/𝗺𝗽𝟯/𝗴𝗶𝗳, 𝗼𝗿 𝘀𝗲𝗻𝗱 's' 𝗶𝗳 𝗻𝗼 𝗮𝘁𝘁𝗮𝗰𝗵𝗺𝗲𝗻𝘁 𝗶𝘀 𝗻𝗲𝗲𝗱𝗲𝗱.\n\n⚝──⭒─⭑─⭒──⚝", threadID, function (error, info) {
                    return global.client.handleReply.push({
                        type: "requireGif",
                        name,
                        author: senderID,
                        messageID: info.messageID,
                        input: handleReply.input,
                        output: body,
                        input_type: handleReply.input_type,
                        tag_id: handleReply.tag_id,
                    });
                }, messageID);
            }
            case "requireGif": {
                let id = global.utils.randomString(10);
                let uri;
                if ((event.attachments || []).length > 0) {
                    try {
                        const atm_0 = event.attachments[0];
                        id = id + '.' + format_attachment(atm_0.type);
                        const pathGif = resolve(__dirname, '..', 'events', "shortcut", "shortcut", id);
                        const res = await imgurUpload(atm_0.url);
                        uri = res.link;
                    } catch (e) {
                        console.log(e);
                        return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n⚠️ 𝗨𝗻𝗮𝗯𝗹𝗲 𝘁𝗼 𝗹𝗼𝗮𝗱 𝗳𝗶𝗹𝗲. 𝗘𝗶𝘁𝗵𝗲𝗿 𝘁𝗵𝗲 𝗨𝗥𝗟 𝗱𝗼𝗲𝘀 𝗻𝗼𝘁 𝗲𝘅𝗶𝘀𝘁 𝗼𝗿 𝘁𝗵𝗲 𝗯𝗼𝘁 𝗵𝗮𝗱 𝗮 𝗻𝗲𝘁𝘄𝗼𝗿𝗸 𝗲𝗿𝗿𝗼𝗿.\n\n≿━━━━༺❀༻━━━━≾", threadID, messageID);
                    }
                }
                const readData = readFileSync(path, "utf-8");
                var data = JSON.parse(readData);
                var dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
                var dataGlobal = global.moduleData.shortcut.get(threadID) || [];
                const object = { id, input: handleReply.input, output: handleReply.output, uri, input_type: handleReply.input_type, tag_id: handleReply.tag_id };
                dataThread.shortcuts.push(object);
                dataGlobal.push(object);
                if (!data.some(item => item.threadID == threadID)) {
                    data.push(dataThread);
                } else {
                    const index = data.indexOf(data.find(item => item.threadID == threadID));
                    data[index] = dataThread;
                }
                global.moduleData.shortcut.set(threadID, dataGlobal);
                writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n📝 𝗡𝗲𝘄 𝘀𝗵𝗼𝗿𝘁𝗰𝘂𝘁 𝗮𝗱𝗱𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆:\n\n- 𝗜𝗗: ${id}\n- 𝗜𝗻𝗽𝘂𝘁: ${handleReply.input}\n- 𝗧𝘆𝗽𝗲: ${handleReply.input_type || 'text'}\n- 𝗢𝘂𝘁𝗽𝘂𝘁: ${handleReply.output}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, messageID);
            }
        }
    } catch (e) {
        console.log(e)
    }
}
const imgur = require("imgur");
const imgurUpload = async (url) => {
    const axios = require('axios');
    const fs = require('fs-extra');
    const path = require('path');
    
    const ClientID = "c76eb7edd1459f3";
    imgur.setClientId(ClientID);
    
    const tempPath = path.join(__dirname, 'cache', `temp_${Date.now()}.jpg`);
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(tempPath, Buffer.from(response.data));
    
    const result = await imgur.uploadFile(tempPath);
    fs.unlinkSync(tempPath);
    
    return result;
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const { resolve } = global.nodemodule["path"];
    const { readFileSync } = global.nodemodule["fs-extra"];
    const path = resolve(__dirname, '..', 'events', "shortcut", "shortcutdata.json");
    
    if (args[0] == "all") {
        const data = JSON.parse(readFileSync(path, "utf-8"));
        const threadData = data.find(item => item.threadID == threadID);
        if (!threadData || threadData.shortcuts.length == 0) {
            return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n📝 𝗡𝗼 𝘀𝗵𝗼𝗿𝘁𝗰𝘂𝘁𝘀 𝗳𝗼𝘂𝗻𝗱.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", threadID, messageID);
        }
        
        let msg = "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n📝 𝗔𝗹𝗹 𝗦𝗵𝗼𝗿𝘁𝗰𝘂𝘁𝘀:\n\n";
        threadData.shortcuts.forEach((item, index) => {
            msg += `${index + 1}. ${item.input} → ${item.output.substring(0, 30)}...\n`;
        });
        msg += "\n༻﹡﹡﹡﹡﹡﹡﹡༺";
        return api.sendMessage(msg, threadID, messageID);
    }
    
    return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘄𝗶𝘁𝗵 𝘁𝗵𝗲 𝗸𝗲𝘆𝘄𝗼𝗿𝗱 𝗳𝗼𝗿 𝘁𝗵𝗲 𝗻𝗲𝘄 𝘀𝗵𝗼𝗿𝘁𝗰𝘂𝘁.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", threadID, function (error, info) {
        return global.client.handleReply.push({
            type: "requireInput",
            name: "shortcut",
            author: senderID,
            messageID: info.messageID
        });
    }, messageID);
};
