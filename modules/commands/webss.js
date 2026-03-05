const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "webss",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raza",
  description: "Take a screenshot of a website",
  commandCategory: "Tools",
  usages: "webss [url]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const url = args[0];
  if (!url) return api.sendMessage("❌ Please provide a URL.", event.threadID, event.messageID);

  try {
    api.sendMessage(`📸 Capturing screenshot of ${url}...`, event.threadID, event.messageID);

    const res = await axios.get(`https://api.kraza.qzz.io/tools/ssweb-v2?url=${encodeURIComponent(url)}`, { responseType: 'arraybuffer' });
    
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const outputPath = path.join(cacheDir, `webss_${Date.now()}.png`);
    
    fs.writeFileSync(outputPath, Buffer.from(res.data));

    return api.sendMessage({
      attachment: fs.createReadStream(outputPath)
    }, event.threadID, () => {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ Failed to capture screenshot.", event.threadID, event.messageID);
  }
};
