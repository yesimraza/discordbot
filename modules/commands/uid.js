module.exports.config = {
    name: "uid",
    version: "1.0.0",
    hasPermssion: 0,
    Rent: 1,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Check UID of a Facebook account",
    commandCategory: "Member",
    usages: "uid [reply/mention/link]",
    cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID, mentions, type, messageReply } = event;
    const uid = type === "message_reply" && messageReply 
        ? messageReply.senderID 
        : (mentions && Object.keys(mentions).length > 0) 
            ? Object.keys(mentions)[0] 
            : event.senderID;

    api.sendMessage(`✅ 𝐔𝐬𝐞𝐫 𝐔𝐈𝐃: ${uid}`, threadID, messageID);
};