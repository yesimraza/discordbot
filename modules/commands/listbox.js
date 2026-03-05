module.exports.config = {
    "name": "listbox",
    "version": "1.0.0",
    "credits": "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    "hasPermssion": 3,
    "description": "[Ban/Unban/Remove] List of groups the bot has joined",
    "commandCategory": "Admin",
    "usages": "[page number/all]",
    "cooldowns": 5
};

module.exports.handleReply = async function({ api, event, args, Threads, handleReply }) {
    const { threadID, messageID } = event;
    if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Karachi").format("HH:MM:ss L");
    var arg = event.body.split(" ");

    switch (handleReply.type) {
        case "reply":
            {
                if (arg[0] == "ban" || arg[0] == "Ban") {
                    var arrnum = event.body.split(" ");
                    var msg = "";
                    var modules = "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗘𝘅𝗲𝗰𝘂𝘁𝗶𝗻𝗴 𝗕𝗮𝗻\n\n༻﹡﹡﹡﹡﹡﹡﹡༺\n"
                    var nums = arrnum.map(n => parseInt(n));
                    nums.shift();
                    for (let num of nums) {
                        var idgr = handleReply.groupid[num - 1];
                        var groupName = handleReply.groupName[num - 1];

                        const data = (await Threads.getData(idgr)).data || {};
                        data.banned = true;
                        data.dateAdded = time;
                        var typef = await Threads.setData(idgr, { data });
                        global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
                        msg += typef + ' ' + groupName + '\n𝗧𝗜𝗗: ' + idgr + "\n";
                        console.log(modules, msg)
                    }
                    api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n𝗔𝗱𝗺𝗶𝗻 𝗡𝗼𝘁𝗶𝗰𝗲\n\n𝗧𝗵𝗲 𝗴𝗿𝗼𝘂𝗽 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗕𝗔𝗡𝗡𝗘𝗗 𝗳𝗿𝗼𝗺 𝘂𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗯𝗼𝘁.\n\n⚝──⭒─⭑─⭒──⚝`, idgr, () =>
                        api.sendMessage(`${global.data.botID}`, () =>
                            api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗕𝗮𝗻 𝗘𝘅𝗲𝗰𝘂𝘁𝗲𝗱 (true/false)\n\n${msg}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, () =>
                                api.unsendMessage(handleReply.messageID))));
                    break;
                }

                if (arg[0] == "unban" || arg[0] == "Unban" || arg[0] == "ub" || arg[0] == "Ub") {
                    var arrnum = event.body.split(" ");
                    var msg = "";
                    var modules = "≿━━━━༺❀༻━━━━≾\n\n𝗘𝘅𝗲𝗰𝘂𝘁𝗶𝗻𝗴 𝗨𝗻𝗯𝗮𝗻\n\n≿━━━━༺❀༻━━━━≾\n"
                    var nums = arrnum.map(n => parseInt(n));
                    nums.shift();
                    for (let num of nums) {
                        var idgr = handleReply.groupid[num - 1];
                        var groupName = handleReply.groupName[num - 1];

                        const data = (await Threads.getData(idgr)).data || {};
                        data.banned = false;
                        data.dateAdded = null;
                        var typef = await Threads.setData(idgr, { data });
                        global.data.threadBanned.delete(idgr, 1);
                        msg += typef + ' ' + groupName + '\n𝗧𝗜𝗗: ' + idgr + "\n";
                        console.log(modules, msg)
                    }
                    api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n𝗔𝗱𝗺𝗶𝗻 𝗡𝗼𝘁𝗶𝗰𝗲\n\n𝗬𝗼𝘂𝗿 𝗚𝗿𝗼𝘂𝗽 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗨𝗡𝗕𝗔𝗡𝗡𝗘𝗗.\n\n⚝──⭒─⭑─⭒──⚝`, idgr, () =>
                        api.sendMessage(`${global.data.botID}`, () =>
                            api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗨𝗻𝗯𝗮𝗻 𝗘𝘅𝗲𝗰𝘂𝘁𝗲𝗱 (true/false)\n\n${msg}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, () =>
                                api.unsendMessage(handleReply.messageID))));
                    break;
                }

                if (arg[0] == "out" || arg[0] == "Out") {
                    var arrnum = event.body.split(" ");
                    var msg = "";
                    var modules = "≿━━━━༺❀༻━━━━≾\n\n𝗘𝘅𝗲𝗰𝘂𝘁𝗶𝗻𝗴 𝗢𝘂𝘁\n\n≿━━━━༺❀༻━━━━≾\n"
                    var nums = arrnum.map(n => parseInt(n));
                    nums.shift();
                    for (let num of nums) {
                        var idgr = handleReply.groupid[num - 1];
                        var groupName = handleReply.groupName[num - 1];
                        var typef = api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr);
                        msg += typef + ' ' + groupName + '\n𝗧𝗜𝗗: ' + idgr + "\n";
                        console.log(modules, msg)
                    }
                    api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n𝗔𝗱𝗺𝗶𝗻 𝗡𝗼𝘁𝗶𝗰𝗲\n\n𝗧𝗵𝗲 𝗯𝗼𝘁 𝗵𝗮𝘀 𝗹𝗲𝗳𝘁 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽.\n\n⚝──⭒─⭑─⭒──⚝`, idgr, () =>
                        api.sendMessage(`${global.data.botID}`, () =>
                            api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗢𝘂𝘁 𝗘𝘅𝗲𝗰𝘂𝘁𝗲𝗱 (true/false)\n\n${msg}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, () =>
                                api.unsendMessage(handleReply.messageID))));
                    break;
                }
            }
    }
};

module.exports.run = async function({ api, event, args }) {
    switch (args[0]) {
        case "all":
            {
                var inbox = await api.getThreadList(100, null, ['INBOX']);
                let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
                var listthread = [];
                var listbox = [];

                for (var groupInfo of list) {
                    listthread.push({
                        id: groupInfo.threadID,
                        name: groupInfo.name || "No Name Set",
                        participants: groupInfo.participants.length
                    });
                }

                var listbox = listthread.sort((a, b) => {
                    if (a.participants > b.participants) return -1;
                    if (a.participants < b.participants) return 1;
                });

                var groupid = [];
                var groupName = [];
                var page = 1;
                page = parseInt(args[0]) || 1;
                page < -1 ? page = 1 : "";
                var limit = 100000;
                var msg = "≿━━━━༺❀༻━━━━≾\n\n𝗟𝗶𝘀𝘁 𝗼𝗳 𝗚𝗿𝗼𝘂𝗽𝘀 𝗝𝗼𝗶𝗻𝗲𝗱\n\n≿━━━━༺❀༻━━━━≾\n\n";
                var numPage = Math.ceil(listbox.length / limit);

                for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
                    if (i >= listbox.length) break;
                    let group = listbox[i];
                    msg += `${i + 1}. ${group.name}\n🔰 𝗧𝗜𝗗: ${group.id}\n👤 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${group.participants}\n\n`;
                    groupid.push(group.id);
                    groupName.push(group.name);
                }
                msg += `\n--𝗣𝗮𝗴𝗲 ${page}/${numPage}--\nUse ${global.config.PREFIX}listbox all + page number\n\n`

                api.sendMessage(msg + '🎭 Reply with Out, Ban, Unban + index number (multiple allowed, separated by spaces).', event.threadID, (e, data) =>
                    global.client.handleReply.push({
                        name: this.config.name,
                        author: event.senderID,
                        messageID: data.messageID,
                        groupid,
                        groupName,
                        type: 'reply'
                    })
                )
            }
            break;

        default:
            try {
                var inbox = await api.getThreadList(100, null, ['INBOX']);
                let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
                var listthread = [];

                for (var groupInfo of list) {
                    listthread.push({
                        id: groupInfo.threadID,
                        name: groupInfo.name || "No Name Set",
                        participants: groupInfo.participants.length
                    });
                }

                var listbox = listthread.sort((a, b) => {
                    if (a.participants > b.participants) return -1;
                    if (a.participants < b.participants) return 1;
                });

                var groupid = [];
                var groupName = [];
                var page = 1;
                page = parseInt(args[0]) || 1;
                page < -1 ? page = 1 : "";
                var limit = 100;
                var msg = "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗟𝗶𝘀𝘁 𝗼𝗳 𝗚𝗿𝗼𝘂𝗽𝘀 𝗝𝗼𝗶𝗻𝗲𝗱\n\n༻﹡﹡﹡﹡﹡﹡﹡༺\n\n";
                var numPage = Math.ceil(listbox.length / limit);

                for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
                    if (i >= listbox.length) break;
                    let group = listbox[i];
                    msg += `${i + 1}. ${group.name}\n🔰 𝗧𝗜𝗗: ${group.id}\n👤 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${group.participants}\n\n`;
                    groupid.push(group.id);
                    groupName.push(group.name);
                }
                msg += `--𝗣𝗮𝗴𝗲 ${page}/${numPage}--\nUse ${global.config.PREFIX}listbox + page number/all\n\n`

                api.sendMessage(msg + '🎭 Reply with Out, Ban, Unban + index number (multiple allowed, separated by spaces).', event.threadID, (e, data) =>
                    global.client.handleReply.push({
                        name: this.config.name,
                        author: event.senderID,
                        messageID: data.messageID,
                        groupid,
                        groupName,
                        type: 'reply'
                    })
                )
            } catch (e) {
                return console.log(e)
            }
    }
};