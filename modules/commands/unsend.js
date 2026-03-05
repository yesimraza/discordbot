module.exports.config = {
  name: "uns",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Unsend bot's messages",
  commandCategory: "Member", 
  usages: "unsend", 
  cooldowns: 0,
  dependencies: [] 
};

module.exports.run = async function({ api, event, args, Users }) {
  if (event.type != "message_reply") {
    return api.sendMessage(
      `༻﹡﹡﹡﹡﹡﹡﹡༺  

𝗬𝗼𝘂 𝗺𝘂𝘀𝘁 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗿𝗲𝗺𝗼𝘃𝗲 𝗶𝘁.  

༻﹡﹡﹡﹡﹡﹡﹡༺`,
      event.threadID,
      event.messageID
    );
  }

  if (event.messageReply.senderID != api.getCurrentUserID()) {
    return api.sendMessage(
      `⚝──⭒─⭑─⭒──⚝  

𝗬𝗼𝘂 𝗰𝗮𝗻 𝗼𝗻𝗹𝘆 𝗿𝗲𝗺𝗼𝘃𝗲 𝗯𝗼𝘁'𝘀 𝗼𝘄𝗻 𝗺𝗲𝘀𝘀𝗮𝗴𝗲𝘀.  

⚝──⭒─⭑─⭒──⚝`,
      event.threadID,
      event.messageID
    );
  }

  return api.unsendMessage(
    event.messageReply.messageID,
    (err) => {
      if (err) {
        api.sendMessage(
          `≿━━━━༺❀༻━━━━≾  

𝗘𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝘂𝗻𝘀𝗲𝗻𝗱𝗶𝗻𝗴.  

≿━━━━༺❀༻━━━━≾`,
          event.threadID,
          event.messageID
        );
      }
    }
  );
};