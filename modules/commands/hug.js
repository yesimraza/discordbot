const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "hug",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Hug the tagged friend",
  commandCategory: "Love",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, Threads, global }) => {
  var link = [    
    "https://i.postimg.cc/CLVYFKnW/anime-hug-38.gif",
    "https://i.postimg.cc/rFCTzLSz/anime-hug-cry-gif-4.gif",
    "https://i.postimg.cc/ZnzkKfnr/g-DEE1-QGHMm-MAOJRb4-Q-ehq-F7ckhc-VAUyzog-C6-VP5v-LTa-MUavlk-FTEj-Yp-SFl-BPX1c-SJXC7qzk-D4s-Huogbit.gif",
    "https://i.postimg.cc/sDyFk0tz/r9aU2xv.gif",
  ];

  var mention = Object.keys(event.mentions);
  let tag = event.mentions[mention].replace("@", "");
  
  if (!mention || mention.length === 0) 
    return api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗮𝗴 𝗼𝗻𝗲 𝗽𝗲𝗿𝘀𝗼𝗻 𝘁𝗼 𝗵𝘂𝗴 💓\n\n⚝──⭒─⭑─⭒──⚝", event.threadID, event.messageID);

  var callback = () => api.sendMessage(
    {
      body: `≿━━━━༺❀༻━━━━≾\n\n${tag} 𝗵𝗲𝗿𝗲’𝘀 𝗮 𝘀𝗽𝗲𝗰𝗶𝗮𝗹 𝗵𝘂𝗴 🤗💓\n\n≿━━━━༺❀༻━━━━≾`,
      mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
      attachment: fs.createReadStream(__dirname + "/cache/hug.gif")
    },
    event.threadID,
    () => fs.unlinkSync(__dirname + "/cache/hug.gif")
  );

  return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/hug.gif"))
    .on("close", () => callback());
};