
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "logo",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 ☠ 𝐑𝐀𝐙𝐀",
  description: "Generate logos using multiple Ephoto360 APIs",
  commandCategory: "logo",
  usages: ".logo <number> <text>\nExample: .logo 1 Kashif Raza",
  cooldowns: 5
};

// 28 effects — EXACTLY the links you provided (none missing)
const EFFECTS = {
  1:  { name: "Glossy Silver",    url: "https://api.princetechn.com/api/ephoto360/glossysilver?apikey=prince&text=" },
  2:  { name: "Write Text",       url: "https://api.princetechn.com/api/ephoto360/writetext?apikey=prince&text=" },
  3:  { name: "Blackpink Logo",   url: "https://api.princetechn.com/api/ephoto360/blackpinklogo?apikey=prince&text=" },
  4:  { name: "Glitch Text",      url: "https://api.princetechn.com/api/ephoto360/glitchtext?apikey=prince&text=" },
  5:  { name: "Advanced Glow",    url: "https://api.princetechn.com/api/ephoto360/advancedglow?apikey=prince&text=" },
  6:  { name: "Typography Text",  url: "https://api.princetechn.com/api/ephoto360/typographytext?apikey=prince&text=" },
  7:  { name: "Pixel Glitch",     url: "https://api.princetechn.com/api/ephoto360/pixelglitch?apikey=prince&text=" },
  8:  { name: "Neon Glitch",      url: "https://api.princetechn.com/api/ephoto360/neonglitch?apikey=prince&text=" },
  9:  { name: "Nigerian Flag",    url: "https://api.princetechn.com/api/ephoto360/nigerianflag?apikey=prince&text=" },
  10: { name: "American Flag",    url: "https://api.princetechn.com/api/ephoto360/americanflag?apikey=prince&text=" },
  11: { name: "Deleting Text",    url: "https://api.princetechn.com/api/ephoto360/deletingtext?apikey=prince&text=" },
  12: { name: "Blackpink Style",  url: "https://api.princetechn.com/api/ephoto360/blackpinkstyle?apikey=prince&text=" },
  13: { name: "Glowing Text",     url: "https://api.princetechn.com/api/ephoto360/glowingtext?apikey=prince&text=" },
  14: { name: "Underwater",       url: "https://api.princetechn.com/api/ephoto360/underwater?apikey=prince&text=" },
  15: { name: "Logo Maker",       url: "https://api.princetechn.com/api/ephoto360/logomaker?apikey=prince&text=" },
  16: { name: "Cartoon Style",    url: "https://api.princetechn.com/api/ephoto360/cartoonstyle?apikey=prince&text=" },
  17: { name: "Paper Cut",        url: "https://api.princetechn.com/api/ephoto360/papercut?apikey=prince&text=" },
  18: { name: "Effect Clouds",    url: "https://api.princetechn.com/api/ephoto360/effectclouds?apikey=prince&text=" },
  19: { name: "Gradient Text",    url: "https://api.princetechn.com/api/ephoto360/gradienttext?apikey=prince&text=" },
  20: { name: "Summer Beach",     url: "https://api.princetechn.com/api/ephoto360/summerbeach?apikey=prince&text=" },
  21: { name: "Sand Summer",      url: "https://api.princetechn.com/api/ephoto360/sandsummer?apikey=prince&text=" },
  22: { name: "Luxury Gold",      url: "https://api.princetechn.com/api/ephoto360/luxurygold?apikey=prince&text=" },
  23: { name: "Galaxy",           url: "https://api.princetechn.com/api/ephoto360/galaxy?apikey=prince&text=" },
  24: { name: "1917",             url: "https://api.princetechn.com/api/ephoto360/1917?apikey=prince&text=" },
  25: { name: "Making Neon",      url: "https://api.princetechn.com/api/ephoto360/makingneon?apikey=prince&text=" },
  26: { name: "Text Effect",      url: "https://api.princetechn.com/api/ephoto360/texteffect?apikey=prince&text=" },
  27: { name: "Galaxy Style",     url: "https://api.princetechn.com/api/ephoto360/galaxystyle?apikey=prince&text=" },
  28: { name: "Light Effect",     url: "https://api.princetechn.com/api/ephoto360/lighteffect?apikey=prince&text=" }
};

function ensureCacheDir() {
  const dir = path.join(__dirname, "cache");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

module.exports.run = async function ({ api, event, args }) {
  try {
    // help / wrong usage
    if (args.length < 2 || args[0].toLowerCase() === "help") {
      let list =
        Object.entries(EFFECTS)
          .map(([k, v]) => `${k}. ${v.name}`)
          .join("\n");
      return api.sendMessage(
        `⚠️ Usage: ${global.config.PREFIX}logo <number> <text>\nExample: ${global.config.PREFIX}logo 1 Kashif Raza\n\nAvailable (1–28):\n${list}`,
        event.threadID,
        event.messageID
      );
    }

    const number = parseInt(args[0], 10);
    if (!EFFECTS[number]) {
      return api.sendMessage("❌ This number is not available (try 1–28).", event.threadID, event.messageID);
    }

    const text = args.slice(1).join(" ");
    const apiURL = EFFECTS[number].url + encodeURIComponent(text);

    api.sendMessage(`⏳ Creating ${EFFECTS[number].name}...`, event.threadID, event.messageID);

    // fetch JSON (expects { result: { image_url } })
    const res = await axios.get(apiURL, { timeout: 60000 });
    const imgUrl =
      res?.data?.result?.image_url ||
      res?.data?.result?.image ||
      res?.data?.image_url ||
      res?.data?.result; // fallback if API ever returns direct URL

    if (!imgUrl || typeof imgUrl !== "string") {
      return api.sendMessage("❌ API did not return a valid image URL.", event.threadID, event.messageID);
    }

    // download image
    ensureCacheDir();
    const filePath = path.join(__dirname, "cache", `logo${number}_${Date.now()}.jpg`);
    const imgRes = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 120000 });
    fs.writeFileSync(filePath, Buffer.from(imgRes.data));

    // send
    api.sendMessage(
      {
        body: `✨ ${EFFECTS[number].name}\nText: ${text}`,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );
  } catch (err) {
    console.error("Logo Error:", err?.response?.data || err.message);
    api.sendMessage("⚠️ Error: " + (err?.response?.data?.message || err.message), event.threadID, event.messageID);
  }
};
