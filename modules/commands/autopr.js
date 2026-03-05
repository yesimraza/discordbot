module.exports.config = {
    name: "autopr",
    version: "1.0.0",
    hasPermssion: 2, 
    credits: "**Kashif Raza**",
    description: "Automatically detect Pastebin and RunMocky links and send them to the admin",
    commandCategory: "Admin",
    usages: "",
    cooldowns: 5
};

module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const dirCache = __dirname + `/cache/`;
    const dirNoprefix = __dirname + `/noprefix/`;
    if (!fs.existsSync(dirCache)) fs.mkdirSync(dirCache, { recursive: true });
    if (!fs.existsSync(dirNoprefix)) fs.mkdirSync(dirNoprefix, { recursive: true });
    if (!fs.existsSync(dirCache + "pbin.jpeg")) 
        request("https://i.imgur.com/a6d5GXX.jpeg").pipe(fs.createWriteStream(dirCache + "pbin.jpeg"));
    if (!fs.existsSync(dirNoprefix + "vantoan.jpeg")) 
        request("https://i.imgur.com/acdiyiE.jpeg").pipe(fs.createWriteStream(dirNoprefix + "vantoan.jpeg"));
};

module.exports.run = async function({ api, event, args }) {
    console.log('Auto-detection for Pastebin and RunMocky is active...');
};

module.exports.handleEvent = async function({ api, event, Users }) {
    const { body, senderID, threadID } = event;
    const moment = require("moment-timezone");
    const timestamp = moment.tz("Asia/Karachi").format("DD/MM/YYYY || HH:mm:ss");
    try {
        if (!body || senderID == api.getCurrentUserID()) return;
        const isPastebinLink = body.includes('pastebin.com');
        const isRunMockyLink = body.includes('run.mocky.io');
        if (!isPastebinLink && !isRunMockyLink) return;
        const adminBotIDs = [100001854531633];
        if (adminBotIDs.includes(senderID)) return;
        const { threadName } = await api.getThreadInfo(threadID);
        const linkType = isPastebinLink ? "Pastebin" : "RunMocky";
        api.sendMessage(
            `⚝──⭒─⭑─⭒──⚝\n**⏰ Time: ${timestamp}\n🌍 Group: ${threadName}\n💬 ${linkType} Link detected by **Kashif Raza**: ${body}**\n⚝──⭒─⭑─⭒──⚝`, 
            '100001854531633'
        );
    } catch (e) {
        api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**An error occurred: ${e.message}**\n⚝──⭒─⭑─⭒──⚝`, '100001854531633');
    }
};