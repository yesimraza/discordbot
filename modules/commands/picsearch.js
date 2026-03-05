const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "picsearch",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raza",
  description: "Search for images on Google",
  commandCategory: "Search",
  usages: "picsearch [query]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ");
  if (!query) return api.sendMessage("❌ Please provide a search query.", event.threadID, event.messageID);

  try {
    api.sendMessage(`🔍 Searching for ${query}...`, event.threadID, event.messageID);

    const res = await axios.get(`https://api.princetechn.com/api/search/googleimage?apikey=prince&query=${encodeURIComponent(query)}`);

    if (!res.data.success || !res.data.results || res.data.results.length === 0) 
      return api.sendMessage("❌ No results found.", event.threadID, event.messageID);

    const results = res.data.results.slice(0, 10);
    const attachments = [];
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const paths = [];
    for (let i = 0; i < results.length; i++) {
      try {
        const imgRes = await axios.get(results[i], { responseType: 'arraybuffer', timeout: 5000 });
        const imgPath = path.join(cacheDir, `picsearch_${Date.now()}_${i}.jpg`);
        fs.writeFileSync(imgPath, Buffer.from(imgRes.data));
        paths.push(imgPath);
        attachments.push(fs.createReadStream(imgPath));
      } catch (e) {
        console.log(`Failed to download image ${i}: ${e.message}`);
      }
    }

    if (attachments.length === 0) return api.sendMessage("❌ Failed to download any images.", event.threadID, event.messageID);

    return api.sendMessage({
      body: `📸 Image Search Results for: ${query}`,
      attachment: attachments
    }, event.threadID, () => {
      setTimeout(() => {
        paths.forEach(p => { if (fs.existsSync(p)) fs.unlinkSync(p); });
      }, 5000);
    }, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ An error occurred.", event.threadID, event.messageID);
  }
};
