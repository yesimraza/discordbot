const fs = require("fs-extra");
const axios = require("axios");
const path = "./modules/commands/cache/data/lockStatus.json";

module.exports.config = {
    name: "lockdp",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "Kashif Raza",
    description: "Lock group DP",
    commandCategory: "Group",
    usages: "[on/off]",
    cooldowns: 5
};

module.exports.onLoad = function () {
    if (!fs.existsSync("./modules/commands/cache/data")) fs.ensureDirSync("./modules/commands/cache/data");
    if (!fs.existsSync(path)) fs.writeJsonSync(path, {});
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    if (!fs.existsSync(path)) fs.writeJsonSync(path, {});
    const lockStatus = fs.readJsonSync(path);
    if (!lockStatus[threadID]) lockStatus[threadID] = {};
    
    const status = args[0]?.toLowerCase();
    if (status === "on") {
        try {
            const threadInfo = await api.getThreadInfo(threadID);
            lockStatus[threadID].dp = true;
            lockStatus[threadID].imageSrc = threadInfo.imageSrc;
            fs.writeJsonSync(path, lockStatus);
            return api.sendMessage("『 𝗥𝗮𝘇𝗮 』→ Lock DP enabled! I will prevent changes.", threadID, messageID);
        } catch (e) {
            return api.sendMessage("『 𝗥𝗮𝘇𝗮 』→ Error enabling Lock DP: " + e.message, threadID, messageID);
        }
    } else if (status === "off") {
        lockStatus[threadID].dp = false;
        fs.writeJsonSync(path, lockStatus);
        return api.sendMessage("『 𝗥𝗮𝘇𝗮 』→ Lock DP disabled!", threadID, messageID);
    } else {
        return api.sendMessage("Usage: lockdp [on/off]", threadID, messageID);
    }
};
