const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "kick1",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Kick the tagged friend",
  commandCategory: "Member",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, Threads, global }) => {
  var link = [    
    "https://i.postimg.cc/65TSxJYD/2ce5a017f6556ff103bce87b273b89b7.gif",
    "https://i.postimg.cc/65SP9jPT/Anime-083428-6224795.gif",
    "https://i.postimg.cc/RFXP2XfS/jXOwoHx.gif",
    "https://i.postimg.cc/jSPMRsNk/tumblr-nyc5ygy2a-Z1uz35lto1-540.gif",
  ];

  var mention = Object.keys(event.mentions);
  let tag = event.mentions[mention]?.replace("@", "");

  if (!mention || mention.length === 0) 
    return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗮𝗴 𝗼𝗻𝗲 𝗽𝗲𝗿𝘀𝗼𝗻 𝘁𝗼 𝗸𝗶𝗰𝗸 👟\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID, event.messageID);

  var callback = () => api.sendMessage(
    {
      body: `≿━━━━༺❀༻━━━━≾\n\n${tag}, 𝘆𝗼𝘂 𝗷𝘂𝘀𝘁 𝗴𝗼𝘁 𝗸𝗶𝗰𝗸𝗲𝗱 👊😆\n\n≿━━━━༺❀༻━━━━≾`,
      mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
      attachment: fs.createReadStream(__dirname + "/cache/kick.gif")
    },
    event.threadID,
    () => fs.unlinkSync(__dirname + "/cache/kick.gif")
  );

  return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/kick.gif"))
    .on("close", () => callback());
};