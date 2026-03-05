const axios = require('axios');
const fetch = require('node-fetch');

module.exports.config = {
    name: "catbox",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Upload images/videos/GIFs to Catbox.moe & get permanent links",
    commandCategory: "Utility",
    usages: "[reply to image/video/gif]",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID } = event;

    try {
        // Check if replied to a message with attachment
        if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
            return api.sendMessage(
                `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞, 𝐯𝐢𝐝𝐞𝐨 𝐨𝐫 𝐆𝐈𝐅!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
                threadID,
                messageID
            );
        }

        api.sendMessage("⏳ 𝐔𝐩𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐭𝐨 𝐂𝐚𝐭𝐛𝐨𝐱.𝐦𝐨𝐞...\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭 ⌛", threadID, messageID);

        const uploadedUrls = [];

        for (const attach of event.messageReply.attachments) {
            try {
                const fileUrl = encodeURIComponent(attach.url);
                const res = await axios.get(`https://catbox-mnib.onrender.com/upload?url=${fileUrl}`);

                if (res.data && res.data.url) {
                    uploadedUrls.push(res.data.url);
                } else {
                    uploadedUrls.push(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝 (no URL returned)`);
                }
            } catch (err) {
                console.error('Catbox upload error:', err.message);
                uploadedUrls.push(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐮𝐩𝐥𝐨𝐚𝐝`);
            }
        }

        // Final message
        let message = '⚡ 𝐂𝐚𝐭𝐛𝐨𝐱 𝐏𝐞𝐫𝐦𝐚𝐧𝐞𝐧𝐭 𝐋𝐢𝐧𝐤𝐬 ⚡\n\n';
        uploadedUrls.forEach((url, i) => {
            message += `👉 ${i + 1}. ${url}\n`;
        });

        return api.sendMessage(
            `≿━━━━༺❀༻━━━━≾\n\n${message}\n≿━━━━༺❀༻━━━━≾`,
            threadID,
            messageID
        );

    } catch (error) {
        console.error('Catbox command error:', error);
        return api.sendMessage(
            `⚝──⭒─⭑─⭒──⚝\n\n❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝!\n🔁 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.\n\n⚝──⭒─⭑─⭒──⚝`,
            threadID,
            messageID
        );
    }
};