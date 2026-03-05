const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "kiss",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Kiss the tagged person",
  commandCategory: "Love",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, Threads, global }) => {
  var link = [    
    "https://i.postimg.cc/yxDKkJyH/02d4453f3eb0a76a87148433395b3ec3.gif",
    "https://i.postimg.cc/nLTf2Kdx/1483589602-6b6484adddd5d3e70b9eaaaccdf6867e.gif",
    "https://i.postimg.cc/Wpyjxnsb/574fcc797b21e-1533876813029926506824.gif",
    "https://i.postimg.cc/xdsT8SVL/kiss-anime.gif",
  ];

  var mention = Object.keys(event.mentions);
  if (!mention || mention.length === 0) 
    return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗮𝗴 𝗼𝗻𝗲 𝗽𝗲𝗿𝘀𝗼𝗻 ❗\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID, event.messageID);

  let tag = event.mentions[mention].replace("@", "");
  
  var callback = () => api.sendMessage({
    body: `⚝──⭒─⭑─⭒──⚝\n\n${tag}, 𝐁𝐚𝐞 𝐠𝐢𝐯𝐞 𝐦𝐞 𝐚 𝐬𝐰𝐞𝐞𝐭 𝐤𝐢𝐬𝐬 💞\n\n⚝──⭒─⭑─⭒──⚝`,
    mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
    attachment: fs.createReadStream(__dirname + "/cache/honkiss.gif")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/honkiss.gif"));  

  return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/honkiss.gif"))
    .on("close", () => callback());
};