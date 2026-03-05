
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermission: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Check bot prefix",
  commandCategory: "Member",
  usages: "[]",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event, client }) {
  const { threadID, body, messageID } = event;
  const { PREFIX } = global.config;
  const gio = moment.tz("Asia/Karachi").format("HH:mm:ss || DD/MM/YYYY");

  let threadSetting = global.data.threadData.get(threadID) || {};
  let prefix = threadSetting.PREFIX || PREFIX;

  if (
    body &&
    (
      body.toLowerCase() === "prefix" ||
      body.toLowerCase() === "prefix bot là gì" ||
      body.toLowerCase() === "quên prefix r" ||
      body.toLowerCase() === "qlam" ||
      body.toLowerCase() === "how to use bot" ||
      body.toLowerCase() === "bot help" ||
      body.toLowerCase() === "bot usage"
    )
  ) {
    const msg = `====『 𝗣𝗥𝗘𝗙𝗜𝗫 』====\n━━━━━━━━━━━━━━━━\n[➽]→ The box's prefix is: ${prefix}\n[➽]→ The system prefix is: ${global.config.PREFIX}\n[➽]→ Currently the bot has ${client.commands.size} usable commands\n[➽] Total bot users: ${global.data.allUserID.length}\n[➽] Total Groups: ${global.data.allThreadID.length}\n[➽] Now: ${gio}\n[➽]→ React with "❤" to this message to view command list`;

    try {
      const picture = (await axios.get(`https://i.imgur.com/m4ruygS.jpg`, { responseType: "stream" })).data;
      
      return api.sendMessage(
        {
          body: msg,
          attachment: picture
        },
        threadID,
        (err, info) => {
          if (!err) {
            global.client.handleReaction.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
            });
          }
        },
        messageID
      );
    } catch (error) {
      // Fallback without image if API fails
      return api.sendMessage(
        msg,
        threadID,
        (err, info) => {
          if (!err) {
            global.client.handleReaction.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
            });
          }
        },
        messageID
      );
    }
  }
};

module.exports.run = async function () {};

module.exports.handleReaction = async ({ event, api, handleReaction, client }) => {
  const { threadID, userID, reaction } = event;
  
  if (userID != handleReaction.author) return;
  if (reaction != "❤") return;
  
  api.unsendMessage(handleReaction.messageID);
  
  const time = process.uptime();
  const h = Math.floor(time / (60 * 60));
  const p = Math.floor((time % (60 * 60)) / 60);
  const s = Math.floor(time % 60);
  
  const msg = `🪐 === [ 𝗠𝗨𝗟𝗧𝗜𝗣𝗟𝗘 𝗨𝗦𝗘𝗗 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ] === 🪐
━━━━━━━━━━━━━━━━━━
🪐 Popular commands are used 🪐
🪐 === [ Group or Box ] === 🪐
━━━━━━━━━━━━━━━━━━
🫂 ${global.config.PREFIX}Help: If you want to see all commands the bot has
💞 ${global.config.PREFIX}CheckTT: To see the number of messages you have received
👤 ${global.config.PREFIX}Info: View information 
🌷 ${global.config.PREFIX}Check: If you want to see the commands about check
💕 ${global.config.PREFIX}Box: To view information about bot
☠️ ${global.config.PREFIX}Locate: Filter out the members who don't work
💝 ${global.config.PREFIX}SetName + Name: Set your name in the group
━━━━━━━━━━━━━━━━━━
💜 === [ Games & Entertainment ] === 💜
━━━━━━━━━━━━━━━━━━
💍 ${global.config.PREFIX}Pair: Canvas Version 
🕊️ ${global.config.PREFIX}Pair: Also the compound is the other version
😻 ${global.config.PREFIX}Pair: pair The Reply Version 
━━━━━━━━━━━━━━━━━━
🎵 === [ Video or Music ] === 🎵
━━━━━━━━━━━━━━━━━━
💓 ${global.config.PREFIX}YouTube: Download clips on YT
🎥 ${global.config.PREFIX}TikTok: Tiktok video use command for details
🎼 ${global.config.PREFIX}Sing: play Songs
📺 ${global.config.PREFIX}AutoDown: Auto download video when url is detected
━━━━━━━━━━━━━━━━━━
💜 === [ UTILITIES ] === 💜
━━━━━━━━━━━━━━━━━━
🔗 ${global.config.PREFIX}Imgur + Reply Pic & GIF 
💗 ${global.config.PREFIX}Ntn & Reply 
🌹 ${global.config.PREFIX}Avt: Admin 
💞 ${global.config.PREFIX}QR + Reply Text
📆 ${global.config.PREFIX}Age + used Command See Details 
━━━━━━━━━━━━━━━━━━
💜 === [ BOT INFO ] === 💜
━━━━━━━━━━━━━━━━━━
💜 Bot Name: ${global.config.BOTNAME}
⏰ Uptime: ${h}h ${p}m ${s}s
🔧 Commands: ${client.commands.size}
📊 Events: ${client.events.size}
👥 Users: ${global.data.allUserID.length}
🏘️ Groups: ${global.data.allThreadID.length}
💓 Prefix: ${global.config.PREFIX}`;

  try {
    const picture = (await axios.get(`https://i.imgur.com/m4ruygS.jpg`, { responseType: "stream" })).data;
    return api.sendMessage({
      body: msg,
      attachment: picture
    }, threadID);
  } catch (error) {
    // Fallback without image if API fails
    return api.sendMessage(msg, threadID);
  }
};
