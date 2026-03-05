module.exports.config = {
    name: "sendnoti",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Mirai Team",
    description: "Send notification to all groups",
    commandCategory: "System",
    usages: "[message]",
    cooldowns: 5,
    dependencies: {}
};

module.exports.run = async function({ api, event, args }) {
    if (args.length == 0) {
        return api.sendMessage("Please provide a message to send", event.threadID, event.messageID);
    }

    const message = args.join(" ");
    const allThreads = global.data.allThreadID || [];
    let sentCount = 0;

    try {
        for (const threadID of allThreads) {
            try {
                await api.sendMessage(`📢 NOTIFICATION 📢\n\n${message}`, threadID);
                sentCount++;
            } catch (error) {
                // Skip threads where bot doesn't have permission
            }
        }

        return api.sendMessage(`Notification sent to ${sentCount} groups`, event.threadID, event.messageID);
    } catch (error) {
        return api.sendMessage("Error sending notifications", event.threadID, event.messageID);
    }
};