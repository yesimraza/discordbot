const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "aipic",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raza",
  description: "Generate an image from text",
  commandCategory: "AI",
  usages: "aipic [prompt]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ");
  if (!prompt) return api.sendMessage("❌ Please provide a prompt.", event.threadID, event.messageID);

  try {
    api.sendMessage(`🎨 Generating image for: ${prompt}...`, event.threadID, event.messageID);

    const res = await axios.get(`https://api.kraza.qzz.io/imagecreator/text2img?q=${encodeURIComponent(prompt)}`, { responseType: 'arraybuffer' });
    
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const outputPath = path.join(cacheDir, `aipic_${Date.now()}.png`);
    
    fs.writeFileSync(outputPath, Buffer.from(res.data));

    return api.sendMessage({
      body: `✨ Generated image for: ${prompt}`,
      attachment: fs.createReadStream(outputPath)
    }, event.threadID, () => {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ Failed to generate image.", event.threadID, event.messageID);
  }
};
