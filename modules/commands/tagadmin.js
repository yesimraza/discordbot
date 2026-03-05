module.exports.config = {
  name: "tagadmin",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Notify when admin is tagged",
  commandCategory: "Admin",
  usages: "tagadmin",
  cooldowns: 1,
  timezone: "Asia/Karachi"
};

module.exports.handleEvent = function ({ api, event }) {
  if (!event.senderID || !event.mentions) return;
  if (event.senderID !== "61582493356125") { // Replaced with required Admin UID
    const adminID = "61582493356125";
    if (Object.keys(event.mentions).includes(adminID)) {
      const msg = "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n⚠️ Use the command \"/callad\" to send a message to Admin!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺";
      return api.sendMessage({ body: msg }, event.threadID, event.messageID);
    }
  }
};

module.exports.run = async function ({}) {};