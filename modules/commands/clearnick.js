module.exports.config = {
    name: "clearnick",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "Kashif Raza",
    description: "Clear all nicknames in the group",
    commandCategory: "Admin",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, participantIDs } = event;
    const fs = require("fs-extra");
    const { join } = require("path");
    const path = join(__dirname, "../../includes/datajson/nicknameLock.json");

    api.sendMessage("⏳ Clearing all nicknames and removing locks...", threadID);

    // Remove from lock database if exists
    if (fs.existsSync(path)) {
        let data = fs.readJsonSync(path);
        if (data[threadID]) {
            delete data[threadID];
            fs.writeJsonSync(path, data);
        }
    }

    for (const userID of participantIDs) {
        try {
            await api.changeNickname("", threadID, userID);
        } catch (e) {
            console.log(`Failed to clear nickname for ${userID}`);
        }
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    return api.sendMessage("✅ All nicknames have been cleared and locks removed.", threadID, messageID);
};