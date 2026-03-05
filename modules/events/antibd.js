const fs = require('fs-extra');
const path = require('path');
const pathData = path.join(__dirname, '../commands/cache/antibd.json');

module.exports.config = {
    name: "antibd",
    eventType: ["log:user-nickname"],
    version: "1.0.1",
    credits: "",
    description: "Prevent changing nicknames in the group",
};

module.exports.run = async function ({ event, api, Threads }) {
    const { threadID, logMessageData } = event;
    const botID = api.getCurrentUserID(); 
    try {
        let antiData = await fs.readJSON(pathData);
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (!threadEntry) {
            return;
        }
        const originalNicknames = threadEntry.data;
        const changedUserID = logMessageData.participant_id;
        const oldNickname = originalNicknames[changedUserID];
        const newNickname = logMessageData.nickname;
        if (changedUserID === botID) {
            return;
        }
        if (newNickname !== oldNickname) {
            api.changeNickname(oldNickname || "", threadID, changedUserID, (err) => {
                if (err) {
                    api.sendMessage("⚠️ An error occurred while restoring the nickname", threadID);
                } else {
                    api.sendMessage(`✅ The antibd command is enabled, restoring the nickname of the user who just changed it!`, threadID);
                }
            });
        }
    } catch (error) {
        console.error("Error while processing the nickname change event:", error);
    }
};