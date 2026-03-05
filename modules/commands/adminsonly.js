module.exports.config = {
    name: "adminsonly",
    version: "1.0.0",
    hasPermssion: 1, 
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Manage bot admin mode",
    commandCategory: "Admin",
    usages: "qtvonly",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onLoad = async function({ api }) {
    const { writeFileSync, existsSync } = require('fs-extra');
    const { resolve } = require("path");
    const path = resolve(__dirname, 'cache', 'qtvonly.json');
    if (!existsSync(path)) {
        const obj = {
            qtvbox: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    }
    const data = require(path);
    if (!data.hasOwnProperty('qtvbox')) data.qtvbox = {};
    writeFileSync(path, JSON.stringify(data, null, 4));
    for (const threadID in data.qtvbox) {
        if (data.qtvbox[threadID] === true) {
            api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n𝐁𝐨𝐭 𝐡𝐚𝐬 𝐫𝐞𝐬𝐭𝐚𝐫𝐭𝐞𝐝, 𝐞𝐧𝐚𝐛𝐥𝐞𝐝 𝐚𝐝𝐦𝐢𝐧-𝐨𝐧𝐥𝐲 𝐦𝐨𝐝𝐞.\n\n≿━━━━༺❀༻━━━━≾", threadID);
        }
    }
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    const { writeFileSync } = require('fs-extra');
    const { resolve } = require("path");
    const pathData = resolve(__dirname, 'cache', 'qtvonly.json');
    const database = require(pathData);
    const { qtvbox } = database;
    qtvbox[threadID] = !qtvbox[threadID];
    writeFileSync(pathData, JSON.stringify(database, null, 4));
    if (qtvbox[threadID]) {
        api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n✅ 𝐀𝐝𝐦𝐢𝐧-𝐨𝐧𝐥𝐲 𝐦𝐨𝐝𝐞 𝐞𝐧𝐚𝐛𝐥𝐞𝐝 (𝐎𝐧𝐥𝐲 𝐛𝐨𝐱 𝐚𝐝𝐦𝐢𝐧𝐬 𝐚𝐧𝐝 𝐛𝐨𝐭 𝐚𝐝𝐦𝐢𝐧𝐬 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐭𝐡𝐞 𝐛𝐨𝐭).\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", threadID, messageID);
    } else {
        api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n❌ 𝐀𝐝𝐦𝐢𝐧-𝐨𝐧𝐥𝐲 𝐦𝐨𝐝𝐞 𝐝𝐢𝐬𝐚𝐛𝐥𝐞𝐝 (𝐀𝐥𝐥 𝐦𝐞𝐦𝐛𝐞𝐫𝐬 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐭𝐡𝐞 𝐛𝐨𝐭).\n\n⚝──⭒─⭑─⭒──⚝", threadID, messageID);
    }
};