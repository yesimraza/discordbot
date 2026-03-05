module.exports.config = {
    name: "tarot",
    version: "0.0.1",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Tarot Card Reading",
    commandCategory: "Games",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const axios = require("axios");
    const c = (await axios.get('https://raw.githubusercontent.com/ThanhAli-Official/tarot/main/data.json')).data;

    if (args[0] > c.length) 
        return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n⚠️ 𝐂𝐚𝐧𝐧𝐨𝐭 𝐞𝐱𝐜𝐞𝐞𝐝 𝐭𝐡𝐞 𝐭𝐨𝐭𝐚𝐥 𝐜𝐚𝐫𝐝𝐬 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐢𝐧 𝐭𝐡𝐞 𝐬𝐲𝐬𝐭𝐞𝐦\n\n≿━━━━༺❀༻━━━━≾", event.threadID);

    let k;
    if (!args[0]) {
        k = Math.floor(Math.random() * c.length);
    } else {
        k = args[0];
    }

    const x = c[k];
    const t = (await axios.get(`${x.image}`, { responseType: "stream" })).data;

    const msg = {
        body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n🎴 𝐓𝐀𝐑𝐎𝐓 𝐂𝐀𝐑𝐃 𝐑𝐄𝐀𝐃𝐈𝐍𝐆 🎴\n\n📝 𝐂𝐚𝐫𝐝 𝐍𝐚𝐦𝐞: ${x.name}\n✏️ 𝐒𝐮𝐢𝐭: ${x.suite}\n✴️ 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${x.vi.description}\n🏷️ 𝐈𝐧𝐭𝐞𝐫𝐩𝐫𝐞𝐭𝐚𝐭𝐢𝐨𝐧: ${x.vi.interpretation}\n📜 𝐑𝐞𝐯𝐞𝐫𝐬𝐞𝐝: ${x.vi.reversed}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
        attachment: t
    };

    return api.sendMessage(msg, event.threadID, event.messageID);
};