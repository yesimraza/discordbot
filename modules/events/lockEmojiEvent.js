module.exports.config = {
    name: "lockEmojiEvent",
    eventType: ["log:thread-icon", "change_thread_icon", "log:thread-emoji", "log:thread-icon-emoji"],
    version: "1.0.3",
    credits: "Kashif Raza",
    description: "Revert emoji change"
};

const fs = require("fs-extra");
const path = "./modules/commands/cache/data/lockStatus.json";

module.exports.run = async function ({ api, event }) {
    const { threadID, author, logMessageType, type } = event;
    const botID = api.getCurrentUserID();
    if (String(author) === String(botID)) return;
    
    if (!fs.existsSync(path)) return;
    const lockStatus = fs.readJsonSync(path);
    const settings = lockStatus[threadID];
    
    const emojiEvents = ["log:thread-icon", "log:thread-emoji", "log:thread-icon-emoji", "change_thread_icon"];
    
    if (settings && settings.emoji === true && (emojiEvents.includes(logMessageType) || type === "change_thread_icon" || event.type === "change_thread_icon")) {
        const savedEmoji = settings.emojiValue;
        if (savedEmoji) {
            console.log(`[ LOCK EMOJI EVENT ] Reverting emoji change in thread ${threadID} to ${savedEmoji}`);
            if (typeof api.changeThreadEmoji === "function") {
                api.changeThreadEmoji(savedEmoji, threadID, (err) => {
                    if (err) console.error(`[ LOCK EMOJI ] Error:`, err);
                });
            }
        }
    }
};
