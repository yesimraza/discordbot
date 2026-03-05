const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const pidusage = require("pidusage");

module.exports.config = {
  name: "uptime",
  version: "2.3.1",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Show bot uptime with decorated image + info",
  commandCategory: "System",
  usages: "",
  cooldowns: 5
};

// Format uptime
function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}H ${m}M ${s}S`;
}

module.exports.run = async function ({ api, event }) {
  try {
    const { threadID, messageID } = event;

    // Uptime stats
    const uptime = process.uptime();
    const time = formatUptime(uptime);

    const totalUsers = global.data.allUserID.length;
    const totalGroups = global.data.allThreadID.length;
    const nameBot = global.config.BOTNAME || "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀'𝐒 𝐁𝐎𝐓";
    const owner = global.config.ADMINBOT ? global.config.ADMINBOT[0] : "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀";

    const stats = await pidusage(process.pid);
    const cpu = stats.cpu.toFixed(1);
    const ram = (stats.memory / 1024 / 1024).toFixed(0);
    const ping = Date.now() - event.timestamp;

    // Background image
    const bgUrl = "https://i.ibb.co/xttJtn3T/9325b1b91c9a.jpg"; 
    const bg = await loadImage(bgUrl);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // 🟢 Draw only UPTIME time (golden color, moved down more)
    ctx.font = "bold 55px Consolas";
    ctx.fillStyle = "#FFD700"; // Golden color
    ctx.textAlign = "center";
    ctx.shadowColor = "#FFD700"; // Golden shadow
    ctx.shadowBlur = 30;
    ctx.fillText(time, canvas.width / 2.8, canvas.height / 1.15); // Moved down 2 more lines

    // Save image
    const pathImg = __dirname + "/cache/uptime.png";
    fs.writeFileSync(pathImg, canvas.toBuffer("image/png"));

    // Decorated message
    const msg = 
`≿━━━━༺❀༻━━━━≾
   🖤𝗞𝗔𝗦𝗛𝗜𝗙 𝗥𝗔𝗭𝗔'𝗦 𝗕𝗢𝗧🖤                                          
        💝𝗦𝗧𝗔𝗧𝗨𝗦💝
≿━━━━༺❀༻━━━━≾

⏱  Uptime: ${time}
👤  Owner: ${owner}
🤖  Bot Name: ${nameBot}
👥  Users: ${totalUsers}
💬  Groups: ${totalGroups}
🖥  CPU: ${cpu}%
📦  RAM: ${ram} MB
📶  Ping: ${ping}ms

━━━━━━━━━━━━━━━
Made by 𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀
━━━━━━━━━━━━━━━`;

    return api.sendMessage(
      { body: msg, attachment: fs.createReadStream(pathImg) },
      threadID,
      () => fs.unlinkSync(pathImg),
      messageID
    );
  } catch (err) {
    console.error("❌ Uptime command error:", err);
    return api.sendMessage("⚠️ Error while generating uptime.", event.threadID, event.messageID);
  }
};