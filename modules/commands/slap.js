const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "slap",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Slap the person you tag",
  commandCategory: "Member",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event, Threads, global }) => {
  var link = [    
    "https://i.postimg.cc/9QLrR9G4/12334wrwd534wrdf-3.gif",
    "https://i.postimg.cc/pTFT6138/12334wrwd534wrdf-8.gif",
    "https://i.postimg.cc/L5VHddDq/slap-anime.gif",
    "https://i.postimg.cc/K8jmWHMz/VW0cOyL.gif",
  ];
  
  var mention = Object.keys(event.mentions);
  let tag = event.mentions[mention].replace("@", "");
  
  if (!mention) 
    return api.sendMessage("❎ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐚𝐠 𝟏 𝐩𝐞𝐫𝐬𝐨𝐧!", event.threadID, event.messageID);
  
  var callback = () => api.sendMessage({
    body: `👋 ${tag} 𝐠𝐨𝐭 𝐬𝐥𝐚𝐩𝐩𝐞𝐝 𝐡𝐚𝐫𝐝 😏`, 
    mentions: [{tag: tag, id: Object.keys(event.mentions)[0]}],
    attachment: fs.createReadStream(__dirname + "/cache/tatslap.gif")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/tatslap.gif"));  
  
  return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/tatslap.gif")).on("close",() => callback());
}