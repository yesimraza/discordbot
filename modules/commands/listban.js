module.exports.config = {
    name: "listban",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Mirai Team",
    description: "List banned users",
    commandCategory: "System",
    usages: "",
    cooldowns: 5,
    dependencies: {}
};

module.exports.run = async function({ api, event, Users, Threads }) {
    try {
        const bannedUsers = global.data.userBanned || new Map();
        const bannedThreads = global.data.threadBanned || new Map();

        let msg = "=== BANNED LIST ===\n\n";

        if (bannedUsers.size > 0) {
            msg += "👤 Banned Users:\n";
            for (let [userID, data] of bannedUsers) {
                const userName = await Users.getNameUser(userID) || "Unknown";
                const reason = data.reason || "No reason provided";
                const date = data.dateAdded || "Unknown date";
                msg += `• ${userName} (${userID})\nReason: ${reason}\nTime: ${date}\n\n`;
            }
        }

        if (bannedThreads.size > 0) {
            msg += "💬 Banned Threads:\n";
            for (let [threadID, data] of bannedThreads) {
                const threadInfo = await Threads.getInfo(threadID);
                const threadName = threadInfo?.threadName || "Unknown";
                const reason = data.reason || "No reason provided";
                const date = data.dateAdded || "Unknown date";
                msg += `• ${threadName} (${threadID})\nReason: ${reason}\nTime: ${date}\n\n`;
            }
        }

        if (bannedUsers.size == 0 && bannedThreads.size == 0) {
            msg += "No banned users or threads found.";
        }

        return api.sendMessage(msg, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage("Error retrieving ban list", event.threadID, event.messageID);
    }
};