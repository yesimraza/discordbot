const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "waifu",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raza",
  description: "Get a random waifu image",
  commandCategory: "Anime",
  usages: "waifu",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  try {
    const res = await axios.get("https://api.kraza.qzz.io/random/waifu", { responseType: 'arraybuffer' });
    
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const outputPath = path.join(cacheDir, `waifu_${Date.now()}.png`);
    
    fs.writeFileSync(outputPath, Buffer.from(res.data));

    return api.sendMessage({
      body: "🌸 Here is your waifu!",
      attachment: fs.createReadStream(outputPath)
    }, event.threadID, () => {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ Failed to get waifu image.", event.threadID, event.messageID);
  }
};
