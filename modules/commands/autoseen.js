const fs = require('fs-extra');
const pathFile = __dirname + '/cache/autosen.txt';
if (!fs.existsSync(pathFile))
  fs.writeFileSync(pathFile, 'true');

module.exports.config = {
  name: "autoseen",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "**Kashif Raza**",
  description: "Enable/disable auto-seen for new messages",
  commandCategory: "Admin",
  usages: "on/off",
  cooldowns: 5
};

module.exports.handleEvent = async ({ api, event, args }) => {
  const isEnable = fs.readFileSync(pathFile, 'utf-8');
  if (isEnable == "true")
    api.markAsReadAll(() => {});
};

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args[0] == 'on') {
      fs.writeFileSync(pathFile, 'true');
      api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**Auto-seen mode enabled for new messages by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
    }
    else if (args[0] == 'off') {
      fs.writeFileSync(pathFile, 'false');
      api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**Auto-seen mode disabled for new messages by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
    }
    else {
      api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**Incorrect syntax**\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
    }
  }
  catch(e) {
    console.log(e);
  }
};