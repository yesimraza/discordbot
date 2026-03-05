module.exports.config = {
    name: "pending",
    version: "1.0.6",
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    hasPermssion: 3,
    description: "Manage bot pending messages",
    commandCategory: "Administration",
    usages: "[u] [t] [a]",
    cooldowns: 5
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const axios = require("axios");
    const fs = require('fs-extra');
    const request = require('request');
    if (String(event.senderID) !== String(handleReply.author)) return;
    const { body, threadID, messageID } = event;
    var count = 0;

    if (body.toLowerCase() === "all") {
        for (const singleIndex in handleReply.pending) {
            api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "✅" : global.config.BOTNAME}`, handleReply.pending[singleIndex].threadID, api.getCurrentUserID());
            api.sendMessage("", event.threadID, () => api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❯ 𝗬𝗼𝘂 𝗵𝗮𝘃𝗲 𝗯𝗲𝗲𝗻 𝗮𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗯𝘆 𝗔𝗱𝗺𝗶𝗻.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, handleReply.pending[singleIndex].threadID));
            count += 1;
        }
        return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n[ 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 ] - 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗮𝗹𝗹 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆.\n\n⚝──⭒─⭑─⭒──⚝`, threadID, messageID);
    } else if (isNaN(body) && (body.indexOf("c") == 0 || body.indexOf("cancel") == 0)) {
        const index = (body.slice(1, body.length)).split(/\s+/);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n\n→ ${singleIndex} 𝗶𝘀 𝗻𝗼𝘁 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗻𝘂𝗺𝗯𝗲𝗿.\n\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);
        }
        return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n[ 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 ] - 𝗥𝗲𝗷𝗲𝗰𝘁𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, messageID);
    } else {
        const index = body.split(/\s+/);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n→ ${singleIndex} 𝗶𝘀 𝗻𝗼𝘁 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗻𝘂𝗺𝗯𝗲𝗿.\n\n⚝──⭒─⭑─⭒──⚝`, threadID, messageID);
            
            api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "🟩" : global.config.BOTNAME}`, handleReply.pending[singleIndex - 1].threadID, api.getCurrentUserID());
            api.sendMessage("", event.threadID, () => api.sendMessage(`≿━━━━༺❀༻━━━━≾\n\n❯ 𝗔𝗱𝗺𝗶𝗻 𝗵𝗮𝘀 𝗮𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝘆𝗼𝘂.\n\n≿━━━━༺❀༻━━━━≾`, handleReply.pending[singleIndex - 1].threadID));
            count += 1;
        }
        return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n[ 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 ] - 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, messageID);
    }
}

module.exports.run = async function({ api, event, args }) {
    if (args.join() == "") {
        return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n❯ 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 𝘂𝘀𝗲𝗿: 𝗨𝘀𝗲𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁𝘀\n❯ 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 𝘁𝗵𝗿𝗲𝗮𝗱: 𝗚𝗿𝗼𝘂𝗽 𝗿𝗲𝗾𝘂𝗲𝘀𝘁𝘀\n❯ 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 𝗮𝗹𝗹: 𝗔𝗹𝗹 𝗽𝗲𝗻𝗱𝗶𝗻𝗴 𝗰𝗵𝗮𝘁𝘀\n\n⚝──⭒─⭑─⭒──⚝`, event.threadID, event.messageID);
    }
    const content = args.slice(1, args.length);
    switch (args[0]) {
        case "user":
        case "u":
        case "-u":
        case "User": {
            const { threadID, messageID } = event;
            const commandName = this.config.name;
            var msg = "", index = 1;

            try {
                var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
                var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
            } catch (e) {
                return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n\n[ 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 ] - 𝗖𝗮𝗻𝗻𝗼𝘁 𝗳𝗲𝘁𝗰𝗵 𝗽𝗲𝗻𝗱𝗶𝗻𝗴 𝗹𝗶𝘀𝘁.\n\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);
            }

            const list = [...spam, ...pending].filter(group => group.isGroup == false);

            for (const single of list) msg += `${index++}. ${single.name}\n${single.threadID}\n`;

            if (list.length != 0) {
                return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n→ 𝗧𝗼𝘁𝗮𝗹 𝘂𝘀𝗲𝗿𝘀 𝗽𝗲𝗻𝗱𝗶𝗻𝗴: ${list.length}\n${msg}\n𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗻𝘂𝗺𝗯𝗲𝗿 𝘁𝗼 𝗮𝗽𝗽𝗿𝗼𝘃𝗲.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: commandName,
                        messageID: info.messageID,
                        author: event.senderID,
                        pending: list
                    });
                }, messageID);
            } else {
                return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n[ 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 ] - 𝗡𝗼 𝘂𝘀𝗲𝗿𝘀 𝗶𝗻 𝗽𝗲𝗻𝗱𝗶𝗻𝗴 𝗹𝗶𝘀𝘁.\n\n⚝──⭒─⭑─⭒──⚝`, threadID, messageID);
            }
        }
        case "thread":
        case "-t":
        case "t":
        case "Thread": {
            const { threadID, messageID } = event;
            const commandName = this.config.name;
            var msg = "", index = 1;

            try {
                var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
                var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
            } catch (e) {
                return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n\n[ 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 ] - 𝗖𝗮𝗻𝗻𝗼𝘁 𝗳𝗲𝘁𝗰𝗵 𝗽𝗲𝗻𝗱𝗶𝗻𝗴 𝗹𝗶𝘀𝘁.\n\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);
            }

            const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

            for (const single of list) msg += `${index++}. ${single.name}\n${single.threadID}\n`;

            if (list.length != 0) {
                return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n→ 𝗧𝗼𝘁𝗮𝗹 𝗴𝗿𝗼𝘂𝗽𝘀 𝗽𝗲𝗻𝗱𝗶𝗻𝗴: ${list.length}\n${msg}\n𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗻𝘂𝗺𝗯𝗲𝗿 𝘁𝗼 𝗮𝗽𝗽𝗿𝗼𝘃𝗲.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: commandName,
                        messageID: info.messageID,
                        author: event.senderID,
                        pending: list
                    });
                }, messageID);
            } else {
                return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n[ 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 ] - 𝗡𝗼 𝗴𝗿𝗼𝘂𝗽𝘀 𝗶𝗻 𝗽𝗲𝗻𝗱𝗶𝗻𝗴 𝗹𝗶𝘀𝘁.\n\n⚝──⭒─⭑─⭒──⚝`, threadID, messageID);
            }
        }
        case "all":
        case "a":
        case "-a":
        case "al": {
            const { threadID, messageID } = event;
            const commandName = this.config.name;
            var msg = "", index = 1;

            try {
                var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
                var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
            } catch (e) {
                return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n\n[ 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 ] - 𝗖𝗮𝗻𝗻𝗼𝘁 𝗳𝗲𝘁𝗰𝗵 𝗽𝗲𝗻𝗱𝗶𝗻𝗴 𝗹𝗶𝘀𝘁.\n\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);
            }

            const listThread = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);
            const listUser = [...spam, ...pending].filter(group => group.isGroup == false);
            const list = [...spam, ...pending].filter(group => group.isSubscribed);

            for (const single of list) msg += `${index++}. ${single.name}\n${single.threadID}\n`;

            if (list.length != 0) {
                return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n→ 𝗧𝗼𝘁𝗮𝗹 𝗽𝗲𝗻𝗱𝗶𝗻𝗴: ${list.length} 𝗨𝘀𝗲𝗿𝘀 & 𝗚𝗿𝗼𝘂𝗽𝘀\n${msg}\n𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗻𝘂𝗺𝗯𝗲𝗿 𝗼𝗿 '𝗮𝗹𝗹' 𝘁𝗼 𝗮𝗽𝗽𝗿𝗼𝘃𝗲 𝗮𝗹𝗹.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: commandName,
                        messageID: info.messageID,
                        author: event.senderID,
                        pending: list
                    });
                }, messageID);
            } else {
                return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n[ 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 ] - 𝗡𝗼 𝗽𝗲𝗻𝗱𝗶𝗻𝗴 𝗰𝗵𝗮𝘁𝘀.\n\n⚝──⭒─⭑─⭒──⚝`, threadID, messageID);
            }
        }
    }
}