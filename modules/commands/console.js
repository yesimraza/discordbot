const chalk = require('chalk');
const moment = require("moment-timezone");
const SPAM_THRESHOLD = 10; // Number of messages to detect spam
const SPAM_TIMEFRAME = 3000; // Timeframe in ms to check spam (3 seconds)
const LOG_COOLDOWN = 20000; // Cooldown time for logs (20 seconds)
let messageCounts = {};
let isSpamming = false;
let cooldownTimer;

module.exports.config = {
  name: "console",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Console message logger with anti-spam",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const thinh = require('./../../includes/datajson/poem.json');
  var poem = thinh[Math.floor(Math.random() * thinh.length)].trim();
  const { threadID, senderID } = event;
  if (senderID === global.data.botID || global.data.threadData.get(threadID)?.console === true) return;

  if (!messageCounts[threadID]) {
    messageCounts[threadID] = { count: 0, lastMessageTime: Date.now() };
  }
  const now = Date.now();
  let threadMessageCount = messageCounts[threadID];
  if (now - threadMessageCount.lastMessageTime <= SPAM_TIMEFRAME) {
    threadMessageCount.count++;
    if (threadMessageCount.count > SPAM_THRESHOLD) {
      if (!isSpamming) {
        console.log(chalk.red('⚠️ 𝐖𝐚𝐫𝐧𝐢𝐧𝐠: 𝐒𝐩𝐚𝐦 𝐝𝐞𝐭𝐞𝐜𝐭𝐞𝐝, 𝐜𝐨𝐧𝐬𝐨𝐥𝐞 𝐥𝐨𝐠𝐬 𝐭𝐞𝐦𝐩𝐨𝐫𝐚𝐫𝐢𝐥𝐲 𝐬𝐭𝐨𝐩𝐩𝐞𝐝.'));
        isSpamming = true;
        if (cooldownTimer) clearTimeout(cooldownTimer);
        cooldownTimer = setTimeout(() => {
          console.log(chalk.green('✅ 𝐂𝐨𝐧𝐬𝐨𝐥𝐞 𝐥𝐨𝐠𝐬 𝐫𝐞𝐬𝐮𝐦𝐞𝐝.'));
          isSpamming = false;
        }, LOG_COOLDOWN);
      }
      threadMessageCount.lastMessageTime = now;
      return;
    }
  } else {
    threadMessageCount.count = 1;
    threadMessageCount.lastMessageTime = now;
    console.log(`[ ${poem} ]`)
  }
  if (!isSpamming) {
    const threadName = global.data.threadInfo.get(threadID)?.threadName || "𝐔𝐧𝐤𝐧𝐨𝐰𝐧 𝐆𝐫𝐨𝐮𝐩 𝐍𝐚𝐦𝐞";
    const userName = await Users.getNameUser(senderID);
    const messageContent = event.body || "📷/🎥 𝐈𝐦𝐚𝐠𝐞/𝐕𝐢𝐝𝐞𝐨 𝐨𝐫 𝐬𝐩𝐞𝐜𝐢𝐚𝐥 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫𝐬";
    console.log(
      chalk.hex("#DEADED")(`\n╭──────────────────────────⭓\n├─ 𝐆𝐫𝐨𝐮𝐩: ${threadName}`) + "\n" +
      chalk.hex("#C0FFEE")(`├─ 𝐔𝐬𝐞𝐫: ${userName}`) + "\n" +
      chalk.hex("#FFC0CB")(`├─ 𝐌𝐞𝐬𝐬𝐚𝐠𝐞: ${messageContent}`) + "\n" +
      chalk.hex("#FFFF00")(`├─ 𝐓𝐢𝐦𝐞: ${moment.tz("Asia/Karachi").format("LLLL")}\n╰──────────────────────────⭓\n`)
    );
  }
};

module.exports.run = async function ({ api, args, Users, event, Threads, utils, client }) {};