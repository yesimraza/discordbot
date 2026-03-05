const axios = require("axios");

module.exports.config = {
  name: "ocr",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raza",
  description: "Read text from image (OCR)",
  commandCategory: "Tools",
  usages: "reply to an image with ocr",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, type, messageReply } = event;

  if (type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length == 0 || messageReply.attachments[0].type !== "photo") {
    return api.sendMessage("❌ Please reply to an image with 'ocr'", threadID, messageID);
  }

  try {
    api.sendMessage("🔍 Reading text from image...", threadID, messageID);

    const imageUrl = messageReply.attachments[0].url;
    const res = await axios.get(`https://api.kraza.qzz.io/tools/ocr?url=${encodeURIComponent(imageUrl)}`);

    if (!res.data.status || !res.data.result) return api.sendMessage("❌ Failed to read text from image.", threadID, messageID);

    return api.sendMessage(`📝 **OCR Result:**\n\n${res.data.result}`, threadID, messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ An error occurred.", threadID, messageID);
  }
};
