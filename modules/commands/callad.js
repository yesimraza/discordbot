
module.exports.config = {
    name: "callad",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Admin", 
    description: "Contact admin",
    commandCategory: "system",
    usages: "[message]",
    cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, senderID, messageID } = event;
    
    if (!args[0]) {
        return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n⚠️ Please provide your message to send to admin!\n༻﹡﹡﹡﹡﹡﹡﹡༺", threadID, messageID);
    }
    
    const message = args.join(" ");
    const adminID = global.config.ADMINBOT[0];
    const userName = (await api.getUserInfo(senderID))[senderID].name;
    
    const adminMessage = `📩 New message from user:\n\n👤 Name: ${userName}\n🆔 ID: ${senderID}\n📍 Thread: ${threadID}\n💬 Message: ${message}`;
    
    api.sendMessage(adminMessage, adminID);
    
    return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n✅ Your message has been sent to admin successfully!\n༻﹡﹡﹡﹡﹡﹡﹡༺", threadID, messageID);
};
