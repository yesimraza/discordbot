const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "wasted",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raza",
  description: "Add a 'Wasted' effect to an image",
  commandCategory: "Image",
  usages: "reply to an image with wasted",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, type, messageReply } = event;

  if (type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length == 0 || messageReply.attachments[0].type !== "photo") {
    return api.sendMessage("❌ Please reply to an image with 'wasted'", threadID, messageID);
  }

  try {
    api.sendMessage("⌛ Applying 'Wasted' effect...", threadID, messageID);

    const imageUrl = messageReply.attachments[0].url;
    const res = await axios.get(`https://api.kraza.qzz.io/imagecreator/wasted?url=${encodeURIComponent(imageUrl)}`);

    if (!res.data.status || !res.data.result) return api.sendMessage("❌ Failed to apply effect.", threadID, messageID);

    const resultUrl = res.data.result;
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const outputPath = path.join(cacheDir, `wasted_${Date.now()}.png`);

    const imageRes = await axios.get(resultUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(outputPath, Buffer.from(imageRes.data));

    return api.sendMessage({
      attachment: fs.createReadStream(outputPath)
    }, threadID, () => {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }, messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ An error occurred.", threadID, messageID);
  }
};
