
module.exports.config = {
    name: "info",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Kashif Raza",
    description: "Display bot information",
    commandCategory: "System",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event, Users, Threads }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const path = require("path");
    const { threadID, messageID } = event;
    const { commands } = global.client;
    const { ADMINBOT, BOTNAME, PREFIX } = global.config;

    try {
        // Get bot stats
        const threadList = await api.getThreadList(100, null, ["INBOX"]);
        const totalThreads = threadList.filter(thread => thread.isGroup).length;
        
        // Count users
        let totalUsers = 0;
        for (let thread of threadList) {
            if (thread.isGroup) {
                totalUsers += thread.participantIDs.length;
            }
        }

        // Get admin names
        let adminNames = [];
        for (let adminID of ADMINBOT) {
            try {
                const name = await Users.getNameUser(adminID);
                adminNames.push(name);
            } catch (e) {
                adminNames.push("Unknown");
            }
        }

        // Calculate uptime
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        // Get current thread info
        const threadInfo = await api.getThreadInfo(threadID);
        const botInGroup = threadInfo.participantIDs.includes(api.getCurrentUserID());

        // Download image
        const imgPath = path.join(__dirname, "cache", "info_pic.jpg");
        const imgResponse = await axios.get("https://i.ibb.co/Z6KkmGhZ/aee6d7a8d0d8.jpg", {
            responseType: "arraybuffer"
        });
        fs.writeFileSync(imgPath, Buffer.from(imgResponse.data));

        const message = `━━━━━━━━━━━━━━━━━━━━━━━━
    𝗕𝗢𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
━━━━━━━━━━━━━━━━━━━━━━━━

🤖 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: ${BOTNAME}
👑 𝐀𝐝𝐦𝐢𝐧: ${adminNames.join(", ")}
⚙️ 𝐏𝐫𝐞𝐟𝐢𝐱: ${PREFIX}
📝 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${commands.size}

━━━━━━━━━━━━━━━━━━━━━━━━
    𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦
━━━━━━━━━━━━━━━━━━━━━━━━

👥 𝐓𝐨𝐭𝐚𝐥 𝐔𝐬𝐞𝐫𝐬: ${totalUsers}
💬 𝐓𝐨𝐭𝐚𝐥 𝐆𝐫𝐨𝐮𝐩𝐬: ${totalThreads}
✅ 𝐁𝐨𝐭 𝐈𝐧 𝐆𝐫𝐨𝐮𝐩: ${botInGroup ? "Yes" : "No"}
⏰ 𝐔𝐩𝐭𝐢𝐦𝐞: ${hours}h ${minutes}m ${seconds}s

━━━━━━━━━━━━━━━━━━━━━━━━
    𝗦𝗬𝗦𝗧𝗘𝗠 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
━━━━━━━━━━━━━━━━━━━━━━━━

💾 𝐏𝐥𝐚𝐭𝐟𝐨𝐫𝐦: ${process.platform}
🔧 𝐍𝐨𝐝𝐞 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: ${process.version}
🎯 𝐏𝐈𝐃: ${process.pid}
📊 𝐌𝐞𝐦𝐨𝐫𝐲: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB

━━━━━━━━━━━━━━━━━━━━━━━━

💎 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐁𝐨𝐭 𝐛𝐲 𝐊𝐚𝐬𝐡𝐢𝐟 𝐑𝐚𝐳𝐚`;

        await api.sendMessage(
            {
                body: message,
                attachment: fs.createReadStream(imgPath)
            },
            threadID,
            () => fs.unlinkSync(imgPath),
            messageID
        );

    } catch (error) {
        return api.sendMessage(
            `❌ Error getting bot info:\n${error.message}`,
            threadID,
            messageID
        );
    }
};
