module.exports.config = {
  name: "nlock",
  version: "1.0.1",
  hasPermssion: 1,
  credits: "Kashif Raza",
  description: "Lock/Unlock nicknames for users or all members",
  commandCategory: "Group",
  usages: "[lock/unlock] [@tag / all]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const nickLock = require("../events/nicknamelock.js");
  return nickLock.lock({ api, event, args });
};