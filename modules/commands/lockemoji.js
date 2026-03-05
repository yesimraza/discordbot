const fs = require("fs-extra");
const path = "./modules/commands/cache/data/lockStatus.json";

module.exports.config = {
    name: "lockemoji",
    version: "1.0.3",
    hasPermssion: 1,
    credits: "Kashif Raza",
    description: "Lock group emoji",
    commandCategory: "Group",
    usages: "[on/off]",
    cooldowns: 5
};

module.exports.onLoad = function () {
    if (!fs.existsSync("./modules/commands/cache/data")) fs.ensureDirSync("./modules/commands/cache/data");
    if (!fs.existsSync(path)) fs.writeJsonSync(path, {});
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, logMessageType, author, logMessageData, type } = event;
    const emojiEvents = ["log:thread-icon", "log:thread-emoji", "log:thread-icon-emoji", "change_thread_icon"];
    
    // Debug log to see events
    if (logMessageType || type === "change_thread_icon") {
        console.log(`[ DEBUG ] lockemoji event: type=${type}, logMessageType=${logMessageType}, author=${author}, logMessageData=${JSON.stringify(logMessageData)}`);
    }

    const isEmojiChange = emojiEvents.includes(logMessageType) || 
                         type === "change_thread_icon" || 
                         event.type === "change_thread_icon" ||
                         logMessageType === "log:thread-color" || 
                         logMessageType === "log:thread-theme";

    if (!isEmojiChange) return;

    try {
        const lockStatus = fs.readJsonSync(path);
        if (lockStatus[threadID] && lockStatus[threadID].emoji === true) {
            const botID = api.getCurrentUserID();
            if (String(author) === String(botID)) return;

            const savedEmoji = lockStatus[threadID].emojiValue;
            if (savedEmoji) {
                // If it's a theme change that also changes emoji, we might need a small delay or check
                console.log(`[ LOCK EMOJI ] Reverting emoji change in thread ${threadID} to ${savedEmoji}`);
                // Ensure the function exists and use it
                if (typeof api.changeThreadEmoji === "function") {
                    await api.changeThreadEmoji(savedEmoji, threadID);
                } else {
                    console.error("[ LOCK EMOJI ] api.changeThreadEmoji is not a function!");
                }
            }
        }
    } catch (e) {
        console.log("Error in lockemoji handleEvent:", e);
    }
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
            const emoji = threadInfo.emoji || "👍";
            lockStatus[threadID].emoji = true;
            lockStatus[threadID].emojiValue = emoji;
            fs.writeJsonSync(path, lockStatus);
            
            return api.sendMessage(`『 𝗥𝗮𝘇𝗮 』→ Lock emoji enabled! Current emoji: ${lockStatus[threadID].emojiValue}`, threadID, messageID);
        } catch (e) {
            return api.sendMessage(`『 𝗥𝗮𝘇𝗮 』→ Error getting group info: ${e.message}`, threadID, messageID);
        }
    } else if (status === "off") {
        lockStatus[threadID].emoji = false;
        fs.writeJsonSync(path, lockStatus);
        return api.sendMessage("『 𝗥𝗮𝘇𝗮 』→ Lock emoji disabled!", threadID, messageID);
    } else {
        return api.sendMessage("Usage: lockemoji [on/off]", threadID, messageID);
    }
};
