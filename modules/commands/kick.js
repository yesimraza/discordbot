module.exports.config = {
    name: "kick",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Remove a user from the group by tag, reply, or all",
    commandCategory: "Admin",
    usages: "[tag/reply/all]",
    cooldowns: 0
};

module.exports.run = async function ({ args, api, event, Threads }) {
    var { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
    const botID = api.getCurrentUserID();
    try {
        if (args.join().indexOf('@') !== -1) {
            var mention = Object.keys(event.mentions);
            for (let o in mention) {
                setTimeout(() => {
                    return api.removeUserFromGroup(mention[o], event.threadID)
                }, 1000)
            }
        } else {
            if (event.type == "message_reply") {
                uid = event.messageReply.senderID;
                return api.removeUserFromGroup(uid, event.threadID);
            } else {
                if (!args[0]) 
                    return api.sendMessage(
                        "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗮𝗴 𝗼𝗿 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝗺𝗲𝗺𝗯𝗲𝗿 𝘆𝗼𝘂 𝘄𝗮𝗻𝘁 𝘁𝗼 𝗸𝗶𝗰𝗸.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", 
                        event.threadID, event.messageID
                    );
                else {
                    if (args[0] == "all") {
                        const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
                        for (let idUser of listUserID) {
                            setTimeout(() => {
                                return api.removeUserFromGroup(idUser, event.threadID)
                            }, 1000)
                        }
                    }
                }
            }
        }
    } catch {
        return api.sendMessage(
            "≿━━━━༺❀༻━━━━≾\n\n❌ 𝗧𝗵𝗲 𝗯𝗼𝘁 𝗻𝗲𝗲𝗱𝘀 𝗮𝗱𝗺𝗶𝗻 𝗽𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻𝘀 𝘁𝗼 𝗸𝗶𝗰𝗸 𝗺𝗲𝗺𝗯𝗲𝗿𝘀.\n\n≿━━━━༺❀༻━━━━≾",
            event.threadID,
            event.messageID
        );
    }
}