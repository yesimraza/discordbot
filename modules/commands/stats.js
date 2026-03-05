const fs = require("fs");
const os = require("os");

module.exports.config = {
  name: "stats",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Showing The Status of Bot",
  commandCategory: "System",
  usages: "stats",
  cooldowns: 9
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  const threadID = event.threadID;
  const messageID = event.messageID;
  const botID = api.getCurrentUserID();
  const startTime = Date.now();

  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  const uptime = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;

  const osDetails = `${os.type()} ${os.release()} (${os.arch()})`;

  const latencyMessage = await api.sendMessage("📊 Loading Data.......", threadID, messageID);
  const latency = Date.now() - startTime;

  const totalUsers = global.data.allUserID ? global.data.allUserID.length : 0;
  const totalThreads = global.data.allThreadID ? global.data.allThreadID.length : 0;

  const line = "━━━━━━━━━━━━━━━━━━━━";
  
  const data = `👥 Users: ${totalUsers}\n💬 Threads: ${totalThreads}\n⏰ Uptime: ${uptime}\n💻 OS: ${osDetails}\n⚡ Latency: ${latency}ms`;

  api.editMessage(`📊 BOT STATUS\n${line}\n${data}`, latencyMessage.messageID, threadID);
};
