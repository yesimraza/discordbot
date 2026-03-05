const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "cache/points.json");

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({}));
}

module.exports.config = {
  name: "setpoint",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Set points.",
  commandCategory: "Earn Money",
  usages: "setpoint",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args, Users, permssion }) {
  const { threadID, senderID, mentions, type, messageReply } = event;
  let targetID = senderID;
  let pointsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (type == 'message_reply') {
    targetID = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  }

  const name = await Users.getNameUser(targetID);
  const currentPoints = pointsData[targetID] || 0;
  const changePoints = parseInt(args[1]);

  try {
    switch (args[0]) {
      case "+":
        if (permssion < 2) return api.sendMessage("⚠ 𝐘𝐨𝐮 𝐝𝐨 𝐧𝐨𝐭 𝐡𝐚𝐯𝐞 𝐞𝐧𝐨𝐮𝐠𝐡 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧𝐬.", threadID);
        pointsData[targetID] = currentPoints + changePoints;
        api.sendMessage({
          body: `≿━━━━༺❀༻━━━━≾\n\n✅ 𝐀𝐝𝐝𝐞𝐝 ${changePoints} 𝐩𝐨𝐢𝐧𝐭𝐬 𝐭𝐨 ${name}.\n📌 𝐓𝐨𝐭𝐚𝐥 𝐏𝐨𝐢𝐧𝐭𝐬: ${pointsData[targetID]}\n\n≿━━━━༺❀༻━━━━≾`
        }, threadID);
        break;

      case "-":
        if (permssion < 2) return api.sendMessage("⚠ 𝐘𝐨𝐮 𝐝𝐨 𝐧𝐨𝐭 𝐡𝐚𝐯𝐞 𝐞𝐧𝐨𝐮𝐠𝐡 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧𝐬.", threadID);
        pointsData[targetID] = currentPoints - changePoints;
        api.sendMessage({
          body: `⚝──⭒─⭑─⭒──⚝\n\n❎ 𝐒𝐮𝐛𝐭𝐫𝐚𝐜𝐭𝐞𝐝 ${changePoints} 𝐩𝐨𝐢𝐧𝐭𝐬 𝐟𝐫𝐨𝐦 ${name}.\n📌 𝐓𝐨𝐭𝐚𝐥 𝐏𝐨𝐢𝐧𝐭𝐬: ${pointsData[targetID]}\n\n⚝──⭒─⭑─⭒──⚝`
        }, threadID);
        break;

      case "reset":
        if (permssion < 2) return api.sendMessage("⚠ 𝐘𝐨𝐮 𝐝𝐨 𝐧𝐨𝐭 𝐡𝐚𝐯𝐞 𝐞𝐧𝐨𝐮𝐠𝐡 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧𝐬.", threadID);
        pointsData[targetID] = 0;
        api.sendMessage({
          body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n🔄 𝐏𝐨𝐢𝐧𝐭𝐬 𝐨𝐟 ${name} 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐫𝐞𝐬𝐞𝐭 𝐭𝐨 𝟎.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`
        }, threadID);
        break;

      default:
        return api.sendMessage(
          `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n📖 𝐒𝐞𝐭𝐩𝐨𝐢𝐧𝐭 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐔𝐬𝐚𝐠𝐞:\n\n1️⃣ /setpoint + [points] → 𝐀𝐝𝐝 𝐩𝐨𝐢𝐧𝐭𝐬\n2️⃣ /setpoint - [points] → 𝐑𝐞𝐦𝐨𝐯𝐞 𝐩𝐨𝐢𝐧𝐭𝐬\n3️⃣ /setpoint reset → 𝐑𝐞𝐬𝐞𝐭 𝐭𝐨 𝟎\n⚠ 𝐓𝐨 𝐬𝐞𝐭 𝐩𝐨𝐢𝐧𝐭𝐬 𝐟𝐨𝐫 𝐬𝐨𝐦𝐞𝐨𝐧𝐞 𝐞𝐥𝐬𝐞, 𝐚𝐝𝐝 @𝐭𝐚𝐠 𝐚𝐭 𝐭𝐡𝐞 𝐞𝐧𝐝.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
          threadID
        );
    }
    fs.writeFileSync(filePath, JSON.stringify(pointsData, null, 2));
  } catch (e) {
    console.log(e);
  }
};