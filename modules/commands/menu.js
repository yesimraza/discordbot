this.config = {
    name: "menu",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "View command list and info",
    commandCategory: "Groups",
    usages: "[command name/all]",
    cooldowns: 0
};

this.languages = {
    "en": {},
    "en": {}
};

this.run = async function({ api, event, args }) {
    const { threadID: tid, messageID: mid, senderID: sid } = event;
    var type = !args[0] ? "" : args[0].toLowerCase();
    var msg = "";
    const cmds = global.client.commands;
    const TIDdata = global.data.threadData.get(tid) || {};
    const moment = require("moment-timezone");

    // Set timezone to Asia/Karachi
    var day = moment.tz('Asia/Karachi').format('dddd');
    const time = moment.tz("Asia/Karachi").format("hh:mm:ss A | DD/MM/YYYY");
    const hours = moment.tz("Asia/Karachi").format("hh A");

    const admin = config.ADMINBOT;
    const NameBot = config.BOTNAME;
    const version = config.version;
    var prefix = TIDdata.PREFIX || global.config.PREFIX;

    if (type == "all") {
        const commandsList = Array.from(cmds.values()).map((cmd, index) => {
            return `${index + 1}. ${cmd.config.name}\n📝 Description: ${cmd.config.description}\n\n`;
        }).join('');
        return api.sendMessage(commandsList, tid, mid);
    }

    if (type) {
        let command = Array.from(cmds.values()).find(cmd => cmd.config.name.toLowerCase() === type);
        if (!command) {
            const stringSimilarity = require('string-similarity');
            const commandName = args.shift().toLowerCase() || "";
            const commandValues = cmds['keys']();
            const checker = stringSimilarity.findBestMatch(commandName, commandValues);
            if (checker.bestMatch.rating >= 0.5) command = client.commands.get(checker.bestMatch.target);
            msg = `⚠️ Command '${type}' not found.\n📌 Closest match found: '${checker.bestMatch.target}'`;
            return api.sendMessage(msg, tid, mid);
        }
        const cmd = command.config;
        msg = `≿━━━━༺❀༻━━━━≾

📜 Command: ${cmd.name}  
🕹️ Version: ${cmd.version}  
🔑 Permission: ${TextPr(cmd.hasPermssion)}  
📝 Description: ${cmd.description}  
🏘️ Category: ${cmd.commandCategory}  
📌 Usage: ${cmd.usages}  
⏳ Cooldowns: ${cmd.cooldowns}s  

≿━━━━༺❀༻━━━━≾`;
        return api.sendMessage(msg, tid, mid);
    } else {
        const commandsArray = Array.from(cmds.values()).map(cmd => cmd.config);
        const array = [];
        commandsArray.forEach(cmd => {
            const { commandCategory, name: nameModule } = cmd;
            const find = array.find(i => i.cmdCategory == commandCategory);
            if (!find) {
                array.push({
                    cmdCategory: commandCategory,
                    nameModule: [nameModule]
                });
            } else {
                find.nameModule.push(nameModule);
            }
        });
        array.sort(S("nameModule"));
        array.forEach(cmd => {
            if (['ADMIN','NO PREFIX'].includes(cmd.cmdCategory.toUpperCase()) && !global.config.ADMINBOT.includes(sid)) return;
            msg += `⚝──⭒─⭑─⭒──⚝  

[ ${cmd.cmdCategory.toUpperCase()} ]  
📝 Total Commands: ${cmd.nameModule.length}  
${cmd.nameModule.join(", ")}  

`;
        });

        msg += `⚝──⭒─⭑─⭒──⚝  

📝 Total Commands: ${cmds.size}  
👤 Total Bot Admins: ${admin.length}  
👾 Bot Name: ${NameBot}  
🕹️ Version: ${version}  
📅 Today is: ${day}  
⏱️ Time: ${time}  

Use: ${prefix}help + command name for details  
Use: ${prefix}help all to view all commands  

⚝──⭒─⭑─⭒──⚝`;

        return api.sendMessage(msg, tid, mid);
    }
};

function S(k) {
    return function(a, b) {
        let i = 0;
        if (a[k].length > b[k].length) {
            i = 1;
        } else if (a[k].length < b[k].length) {
            i = -1;
        }
        return i * -1;
    }
}

function TextPr(permission) {
    p = permission;
    return p == 0 ? "Member" : p == 1 ? "Group Admin" : p == 2 ? "Bot Admin" : "Full Permission";
}