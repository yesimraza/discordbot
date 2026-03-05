const request = require("request");
const fs = require("fs");

module.exports.config = {
  name: "angry",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Express anger with a tagged user",
  commandCategory: "Member",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async({ api, event }) => {
  const link = [
    "https://i.imgur.com/kljyQPh.gif"   
  ];
  if (!event.mentions || Object.keys(event.mentions).length === 0) {
    return api.sendMessage(
      "⚝──⭒─⭑─⭒──⚝\n\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐚𝐠 𝐚 𝐮𝐬𝐞𝐫\n\n⚝──⭒─⭑─⭒──⚝",
      event.threadID,
      event.messageID
    );
  }
  
  const mention = Object.keys(event.mentions)[0];
  const tag = event.mentions[mention].replace("@", "");
  const chosenLink = link[Math.floor(Math.random() * link.length)];
  const extension = chosenLink.split('.').pop();
  const filePath = __dirname + `/cache/angry.${extension}`;
  
  const callback = () => {
    api.sendMessage({
      body: `≿━━━━༺❀༻━━━━≾\n\n𝐀𝐧𝐠𝐫𝐲 𝐚𝐭 ${tag} 😤\n\n≿━━━━༺❀༻━━━━≾`,
      mentions: [{ tag: tag, id: mention }],
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath));
  };
  
  return request(encodeURI(chosenLink))
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => callback());
};