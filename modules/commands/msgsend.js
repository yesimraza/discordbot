const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "msgsend",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Send a message to a user by Facebook ID",
  commandCategory: "Members",
  usages: "[userID] [content]\nYou can also reply with an image you want to send",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const [id, ...contentArgs] = args;
  const content = (contentArgs.length !== 0) ? contentArgs.join(" ") : "𝐇𝐞𝐥𝐥𝐨! 𝐓𝐡𝐢𝐬 𝐢𝐬 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐟𝐫𝐨𝐦 𝐛𝐨𝐭.";

  if (!id) {
    return api.sendMessage(
      `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐭𝐡𝐞 𝐔𝐬𝐞𝐫 𝐈𝐃 𝐨𝐟 𝐭𝐡𝐞 𝐩𝐞𝐫𝐬𝐨𝐧 𝐲𝐨𝐮 𝐰𝐚𝐧𝐭 𝐭𝐡𝐞 𝐛𝐨𝐭 𝐭𝐨 𝐬𝐞𝐧𝐝 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐭𝐨!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
      threadID,
      messageID
    );
  }

  if (event.type == "message_reply" && event.messageReply.attachments.length > 0) {
    const attachmentURL = event.messageReply.attachments[0].url;

    const cachePath = path.join(__dirname, 'cache');
    const fileName = `attachment_${Date.now()}.jpg`;

    const response = await axios.get(attachmentURL, { responseType: 'arraybuffer' });
    fs.writeFileSync(path.join(cachePath, fileName), Buffer.from(response.data));

    api.sendMessage(
      { attachment: fs.createReadStream(path.join(cachePath, fileName)), body: content },
      id
    );

  } else {
    api.sendMessage(
      `⚝──⭒─⭑─⭒──⚝\n\n${content}\n\n⚝──⭒─⭑─⭒──⚝`,
      id
    );
  }
};