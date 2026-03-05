const { join } = require("path");
const { existsSync, writeFileSync, readFileSync } = require("fs-extra");

module.exports.config = {
    name: "autosetname",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "**Kashif Raza**",
    description: "Automatically set nickname for new members",
    commandCategory: "Admin",
    usages: "[add <name> /remove]",
    cooldowns: 0
};

module.exports.onLoad = () => {
    const pathData = join(__dirname, 'cache/data/autosetname.json');
    if (!existsSync(pathData)) {
        writeFileSync(pathData, "[]", "utf-8");
        console.log("**✅ Created new autosetname.json file.**");
    }
};

module.exports.run = async function ({ event, api, args, Users }) {
    const { threadID, messageID, senderID } = event;
    const pathData = join(__dirname, 'cache/data/autosetname.json');
    let dataJson;

    try {
        dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    } catch (error) {
        console.error("Error reading autosetname data:", error);
        return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n**⚠️ Unable to read autosetname data!**\n≿━━━━༺❀༻━━━━≾`, threadID);
    }

    const content = args.slice(1).join(" ");
    const thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };

    switch (args[0]) {
        case "add": {
            if (!content) return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n**⚠️ The new member name configuration cannot be empty!**\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);
            if (thisThread.nameUser.length > 0) return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n**⚠️ Please delete the old name configuration before setting a new one!**\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);
            thisThread.nameUser.push(content);

            api.sendMessage(`≿━━━━༺❀༻━━━━≾\n**✅ Successfully set new member name configuration by **Kashif Raza**\n📝 Preview: ${
                content.replace(/{name}/g, global.data.userName.get(senderID))
                .replace(/{time}/g, require('moment-timezone')().tz('Asia/Karachi').format('HH:mm:ss | DD/MM/YYYY'))
            }**\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);
            break;
        }
        case "del":
        case "remove":
        case "delete": {
            if (thisThread.nameUser.length === 0) return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n**❎ Your group has not set a new member name configuration!**\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);
            thisThread.nameUser = [];
            api.sendMessage(`≿━━━━༺❀༻━━━━≾\n**✅ Successfully deleted new member name configuration by **Kashif Raza****\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);
            break;
        }
        default: {
            return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n**📝 Use: autosetname add [desired name] {name} {time} to configure nickname for new members\n✏️ Use: autosetname del to delete the nickname configuration\n\nWhere:\n - {name}: Member name\n - {time}: Time of joining the group**\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);
        }
    }

    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
};