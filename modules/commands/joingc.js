const chalk = require('chalk');

module.exports.config = {
    name: "join",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Join the bot groups",
    commandCategory: "System",
    usages: "",
    cooldowns: 5
};

module.exports.onLoad = () => {
  console.log(chalk.bold.hex("#00c300").bold("============ SUCCESFULLY LOADED THE JOIN COMMAND ============"));
};

module.exports.handleReply = async function({ api, event, handleReply, Threads }) {
  var { threadID, messageID, senderID, body } = event;
  var { ID } = handleReply;

  if (!body || !parseInt(body)) {
    return api.sendMessage(
`⚝──⭒─⭑─⭒──⚝

𝐘𝐨𝐮𝐫 𝐬𝐞𝐥𝐞𝐜𝐭𝐢𝐨𝐧 𝐦𝐮𝐬𝐭 𝐛𝐞 𝐚 𝐧𝐮𝐦𝐛𝐞𝐫.

⚝──⭒─⭑─⭒──⚝`, threadID, messageID);
  }

  if ((parseInt(body) - 1) > ID.length) {
    return api.sendMessage(
`≿━━━━༺❀༻━━━━≾

𝐘𝐨𝐮𝐫 𝐩𝐢𝐜𝐤 𝐢𝐬 𝐧𝐨𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐥𝐢𝐬𝐭.

≿━━━━༺❀༻━━━━≾`, threadID, messageID);
  }

  try {
    var threadInfo = await Threads.getInfo(ID[body - 1]);
    var { participantIDs, approvalMode, adminIDs } = threadInfo;

    if (participantIDs.includes(senderID)) {
      return api.sendMessage(
`༻﹡﹡﹡﹡﹡﹡﹡༺

𝐘𝐨𝐮 𝐚𝐫𝐞 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐢𝐧 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩.

༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, messageID);
    }

    api.addUserToGroup(senderID, ID[body - 1]);

    if (approvalMode == true && !adminIDs.some(item => item.id) == api.getCurrentUserID()) {
      return api.sendMessage(
`⚝──⭒─⭑─⭒──⚝

𝐘𝐨𝐮 𝐰𝐞𝐫𝐞 𝐚𝐝𝐝𝐞𝐝 𝐭𝐨 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩’𝐬 𝐚𝐩𝐩𝐫𝐨𝐯𝐚𝐥 𝐥𝐢𝐬𝐭.  
𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤 𝐲𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐬𝐞𝐜𝐭𝐢𝐨𝐧.

⚝──⭒─⭑─⭒──⚝`, threadID, messageID);
    } else {
      return api.sendMessage(
`≿━━━━༺❀༻━━━━≾

𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐛𝐞𝐞𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐚𝐝𝐝𝐞𝐝 𝐭𝐨 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩: ${threadInfo.threadName}.  
𝐈𝐟 𝐲𝐨𝐮 𝐝𝐨𝐧’𝐭 𝐬𝐞𝐞 𝐢𝐭, 𝐜𝐡𝐞𝐜𝐤 𝐲𝐨𝐮𝐫 𝐬𝐩𝐚𝐦/𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐟𝐨𝐥𝐝𝐞𝐫.

≿━━━━༺❀༻━━━━≾`, threadID, messageID);
    }
  } catch (error) {
    return api.sendMessage(
`༻﹡﹡﹡﹡﹡﹡﹡༺

𝐄𝐫𝐫𝐨𝐫: 𝐔𝐧𝐚𝐛𝐥𝐞 𝐭𝐨 𝐚𝐝𝐝 𝐲𝐨𝐮 𝐭𝐨 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩.  
${error}

༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, messageID);
  }
};

module.exports.run = async function({ api, event, Threads }) {
  var { threadID, messageID, senderID } = event;
  var msg = `≿━━━━༺❀༻━━━━≾

𝐁𝐎𝐗 𝐋𝐈𝐒𝐓:

`, number = 0, ID = [];
  var allThreads = await Threads.getAll();

  for (var i of allThreads) {
    try {
      var threadInfo = await api.getThreadInfo(i.threadID);
      if (threadInfo && threadInfo.participantIDs && threadInfo.participantIDs.includes(api.getCurrentUserID())) {
        number++;
        msg += `\n${number}. ${i.threadInfo.threadName}`;
        ID.push(i.threadID);
      }
    } catch (e) {
      continue;
    }
  }

  msg += `\n\n⚝──⭒─⭑─⭒──⚝

𝐑𝐞𝐩𝐥𝐲 𝐭𝐡𝐢𝐬 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐧𝐮𝐦𝐛𝐞𝐫 𝐨𝐟 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩 𝐲𝐨𝐮 𝐰𝐚𝐧𝐭 𝐭𝐨 𝐣𝐨𝐢𝐧.

⚝──⭒─⭑─⭒──⚝`;

  return api.sendMessage(msg, threadID, (error, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      author: senderID,
      messageID: info.messageID,
      ID: ID      
    });
  }, messageID);
};