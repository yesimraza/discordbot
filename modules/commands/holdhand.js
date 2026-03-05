const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "holdhand",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Hold hands with the person you tag",
  commandCategory: "Love",
  usages: "@tag",
  cooldowns: 5,
  dependencies: { "request": "", "fs": "", "axios": "" }
};

module.exports.run = async ({ api, event }) => {
  const request = require("request");
  const fs = require("fs");
  
  var mention = Object.keys(event.mentions)[0];
  if (!mention) return api.sendMessage("━━━━━━━━━━━━━━━━━━\n❌ Please tag someone to hold hands with!\n━━━━━━━━━━━━━━━━━━", event.threadID, event.messageID);

  let tag = event.mentions[mention].replace("@", "");
  var link = [
    "https://i.pinimg.com/originals/96/f3/0d/96f30d638b316a39465d45236ce931c3.gif"
  ];

  var callback = () => api.sendMessage({
    body: `━━━━━━━━━━━━━━━━━━\n${tag}, give me your hand 🤝\n[⚜️]→ Forever together 💘\n━━━━━━━━━━━━━━━━━━`,
    mentions: [{
      tag: tag,
      id: mention
    }],
    attachment: fs.createReadStream(__dirname + "/cache/holdhand.gif")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/holdhand.gif"));

  return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/holdhand.gif"))
    .on("close", () => callback());
};