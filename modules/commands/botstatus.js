
module.exports.config = {
    name: "botstatus",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Check bot availability status",
    commandCategory: "System",
    usages: "botstatus",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    
    return api.sendMessage(
        "≿━━━━༺❀༻━━━━≾\n\n" +
        "🤖 **BOT STATUS**\n" +
        "━━━━━━━━━━━━━━━\n" +
        "✅ **Status**: Fully Active\n" +
        "🆓 **Access**: Free for all groups\n" +
        "🚫 **Approval**: Not required\n" +
        "💰 **Rental**: Removed\n" +
        "📝 **Commands**: All available\n" +
        "\n" +
        "Type 'help' to see all commands!\n" +
        "\n≿━━━━༺❀༻━━━━≾",
        threadID,
        messageID
    );
};
