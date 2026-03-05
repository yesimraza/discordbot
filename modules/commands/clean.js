const fs = require('fs');

module.exports.config = {
    name: "clean",
    version: "0.0.2",
    hasPermssion: 3,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Clean bot cache files",
    commandCategory: "Admin",
    usages: "Y/N",
    cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
    api.sendMessage("🗑️ 𝗗𝗼 𝘆𝗼𝘂 𝘄𝗮𝗻𝘁 𝘁𝗼 𝗰𝗹𝗲𝗮𝗻 𝗰𝗮𝗰𝗵𝗲 𝗯𝘆 𝗔𝗜 (𝗔𝗹𝗹) 𝗼𝗿 𝗰𝗵𝗼𝗼𝘀𝗲 𝗺𝗮𝗻𝘂𝗮𝗹𝗹𝘆? 𝗬/𝗡", event.threadID, (e, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
        });
    });
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    if (handleReply.type === 'n') {
        var a = [], success = [], txt = event.body.split(' ');
        for (const type of txt) {
            a.push(type);
            const fileb = fs.readdirSync(__dirname + `/cache`).filter((file) => file.endsWith(`.` + type));
            for (const filec of fileb) {
                try {
                    fs.unlinkSync(__dirname + `/cache/` + filec);
                    success.push(filec);
                } catch {
                    api.sendMessage("⚠️ 𝗘𝗿𝗿𝗼𝗿 𝗰𝗹𝗲𝗮𝗿𝗶𝗻𝗴: " + filec, event.threadID);
                }
            }
        }
        if (success.length === 0) {
            return api.sendMessage("❎ 𝗖𝗮𝗰𝗵𝗲 𝗶𝘀 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗰𝗹𝗲𝗮𝗻.", event.threadID);
        }
        return api.sendMessage("✅ 𝗖𝗮𝗰𝗵𝗲 𝗰𝗹𝗲𝗮𝗿𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!", event.threadID);
    }

    switch (event.args[0]) {
        case 'y':
        case 'Y': {
            const a = [], success = [], txt = ["png", "jpg", "mp4", "jpeg", "gif", "m4a", "txt", "mp3", "wav"];
            for (const type of txt) {
                a.push(type);
                const fileb = fs.readdirSync(__dirname + `/cache`).filter((file) => file.endsWith(`.` + type));
                for (const filec of fileb) {
                    try {
                        fs.unlinkSync(__dirname + `/cache/` + filec);
                        success.push(filec);
                    } catch {
                        api.sendMessage("⚠️ 𝗘𝗿𝗿𝗼𝗿 𝗰𝗹𝗲𝗮𝗿𝗶𝗻𝗴: " + filec, event.threadID);
                    }
                }
            }
            if (success.length === 0) {
                return api.sendMessage("❎ 𝗖𝗮𝗰𝗵𝗲 𝗶𝘀 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗰𝗹𝗲𝗮𝗻.", event.threadID);
            }
            return api.sendMessage("✅ 𝗖𝗮𝗰𝗵𝗲 𝗰𝗹𝗲𝗮𝗿𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!", event.threadID);
        }
        case 'n':
        case 'N': {
            api.sendMessage("📌 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝘁𝗵𝗲 𝗳𝗶𝗹𝗲 𝗲𝘅𝘁𝗲𝗻𝘀𝗶𝗼𝗻𝘀 𝘆𝗼𝘂 𝘄𝗮𝗻𝘁 𝘁𝗼 𝗱𝗲𝗹𝗲𝘁𝗲.\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: mp3 mp4", event.threadID, (e, info) => {
                global.client.handleReply.push({
                    type: 'n',
                    name: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID
                });
            });
        }
    }
};