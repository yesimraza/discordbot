
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "prefixinfo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Show bot prefix and details when user types 'prefix'",
  commandCategory: "System",
  usages: "prefix",
  cooldowns: 3,
  usePrefix: false
};

module.exports.handleEvent = async function ({ api, event, client }) {
  const { threadID, body, messageID } = event;
  
  if (!body) return;
  
  const { PREFIX } = global.config;
  const gio = moment.tz("Asia/Karachi").format("HH:mm:ss A || DD/MM/YYYY");

  let threadSetting = global.data.threadData.get(threadID) || {};
  let prefix = threadSetting.PREFIX || PREFIX;

  const content = body.toLowerCase().trim();
  
  // Check if message is exactly "prefix" (case-insensitive)
  if (content !== "prefix") return;

  try {
    // Using a more reliable image source
    const picture = (await axios.get(`https://i.ibb.co/2qXyG7H/muskan-prefix.jpg`, { responseType: "stream"})).data;
    
    const time = process.uptime();
    const h = Math.floor(time / (60 * 60));
    const m = Math.floor((time % (60 * 60)) / 60);
    const s = Math.floor(time % 60);
    
    return api.sendMessage(
      {
        body: `❥❥════💙════❥❥\n🌌 ${global.config.BOTNAME} Hello!\n❥❥════💙════❥❥\n[➽]→ 𝐓𝐡𝐢𝐬 𝐛𝐨𝐱'𝐬 𝐩𝐫𝐞𝐟𝐢𝐱: ${prefix}\n[➽]→ 𝐒𝐲𝐬𝐭𝐞𝐦 𝐩𝐫𝐞𝐟𝐢𝐱: ${global.config.PREFIX}\n[➽]→ 𝐁𝐨𝐭 𝐧𝐚𝐦𝐞: ${global.config.BOTNAME}\n[➽]→ 𝐓𝐨𝐭𝐚𝐥 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${client.commands.size}\n[➽]→ 𝐓𝐨𝐭𝐚𝐥 𝐮𝐬𝐞𝐫𝐬: ${global.data.allUserID.length}\n[➽]→ 𝐓𝐨𝐭𝐚𝐥 𝐠𝐫𝐨𝐮𝐩𝐬: ${global.data.allThreadID.length}\n❥❥════💙════❥❥\n🎶 𝐔𝐩𝐭𝐢𝐦𝐞: ${h}:${m}:${s}\n❥❥════💙════❥❥\n⏰ 𝐓𝐢𝐦𝐞: ${gio}\n❥❥════💙════❥❥\n💡 Type "${prefix}help" to see all commands`,
        attachment: picture
      },
      threadID,
      messageID
    );
  } catch (error) {
    console.error("Prefixinfo error:", error);
    // Fallback without image if API fails
    const time = process.uptime();
    const h = Math.floor(time / (60 * 60));
    const m = Math.floor((time % (60 * 60)) / 60);
    const s = Math.floor(time % 60);
    
    return api.sendMessage(
      `❥❥════💙════❥❥\n🌌 ${global.config.BOTNAME} Hello!\n❥❥════💙════❥❥\n[➽]→ 𝐓𝐡𝐢𝐬 𝐛𝐨𝐱'𝐬 𝐩𝐫𝐞𝐟𝐢𝐱: ${prefix}\n[➽]→ 𝐒𝐲𝐬𝐭𝐞𝐦 𝐩𝐫𝐞𝐟𝐢𝐱: ${global.config.PREFIX}\n[➽]→ 𝐁𝐨𝐭 𝐧𝐚𝐦𝐞: ${global.config.BOTNAME}\n[➽]→ 𝐓𝐨𝐭𝐚𝐥 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${client.commands.size}\n[➽]→ 𝐓𝐨𝐭𝐚𝐥 𝐮𝐬𝐞𝐫𝐬: ${global.data.allUserID.length}\n[➽]→ 𝐓𝐨𝐭𝐚𝐥 𝐠𝐫𝐨𝐮𝐩𝐬: ${global.data.allThreadID.length}\n❥❥════💙════❥❥\n🎶 𝐔𝐩𝐭𝐢𝐦𝐞: ${h}:${m}:${s}\n❥❥════💙════❥❥\n⏰ 𝐓𝐢𝐦𝐞: ${gio}\n❥❥════💙════❥❥\n💡 Type "${prefix}help" to see all commands`,
      threadID,
      messageID
    );
  }
};

module.exports.run = async function () {};
