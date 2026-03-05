const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "pair",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Pairing with random user and love-themed GIF",
  commandCategory: "Love",
  usages: "pair",
  cooldowns: 10,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, messageID, senderID, participantIDs } = event;

  // Pairing logic
  var tle = Math.floor(Math.random() * 101);
  var namee = (await Users.getData(senderID)).name;
  const botID = api.getCurrentUserID();
  const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
  var id = listUserID[Math.floor(Math.random() * listUserID.length)];
  var name = (await Users.getData(id)).name;
  var arraytag = [];

  const gifCute = [
    "https://i.ibb.co/DPCPZ5d6/BWji8Em.gif",
    "https://i.ibb.co/rK5XRF3Q/ubJ31Mz.gif",
    "https://i.ibb.co/twWtcqMy/9550619d3659.gif",
    "https://i.ibb.co/ymQqT9Hw/5768d6a10231.gif",
    "https://i.ibb.co/kYJ6DWV/3181f3185353.gif",
    "https://i.ibb.co/LXwRQ32h/ac4482d35848.gif",
    "https://i.ibb.co/m5YBmLsY/9ed7726de7fc.gif",
    "https://i.ibb.co/nNqK6Q6Q/fcf1672a9d4f.gif"
  ];

  arraytag.push({ id: senderID, tag: namee });
  arraytag.push({ id: id, tag: name });

  let Avatar = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));

  let gifLove = (await axios.get(gifCute[Math.floor(Math.random() * gifCute.length)], { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8"));

  let Avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

  let imglove = [];
  imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
  imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
  imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));

  var msg = {
    body: `≿━━━━༺❀༻━━━━≾

💕✨ 𝐏𝐞𝐫𝐟𝐞𝐜𝐭 𝐌𝐚𝐭𝐜𝐡 𝐅𝐨𝐮𝐧𝐝 ✨💕

🌸 ${namee} 💖 ${name} 🌸

"Two hearts beating as one,  
Two souls dancing in harmony"

━━━━━━━━━━━━━━━━━━━━━━━
💫 Love Compatibility: ${tle}% 💫
━━━━━━━━━━━━━━━━━━━━━━━

🌹 "True love is not about finding someone perfect,  
but seeing an imperfect person perfectly." 🌹

✨ May your love story be as beautiful as a fairytale ✨

💝 By: 𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀 💝

≿━━━━༺❀༻━━━━≾`,
    mentions: arraytag,
    attachment: imglove
  };

  return api.sendMessage(msg, threadID, messageID);
};