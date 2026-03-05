const fs = require("fs-extra");
const path = require("path");

const activeThreads = new Map();

module.exports.config = {
    name: "convo2",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐑𝐚𝐳𝐚",
    description: "Send messages from 2.txt with custom interval",
    commandCategory: "War",
    usages: "convo2 on |seconds| @mention or convo2 off",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.run = async function({ api, args, event }) {
    const { threadID, messageID, mentions } = event;

    if (args[0] === "off") {
        if (activeThreads.has(threadID)) {
            const timeoutId = activeThreads.get(threadID);
            clearTimeout(timeoutId);
            activeThreads.delete(threadID);
            return api.sendMessage("✅ convo2 has been turned off.", threadID, messageID);
        } else {
            return api.sendMessage("❌ convo2 is not active in this thread.", threadID, messageID);
        }
    }

    if (args[0] === "on") {
        let seconds = parseInt(args[1]);
        if (isNaN(seconds)) {
            // Check if the user used |5| format
            const match = args[1].match(/\|(\d+)\|/);
            if (match) {
                seconds = parseInt(match[1]);
            }
        }

        if (isNaN(seconds) || seconds <= 0) {
            return api.sendMessage("❌ Please provide valid seconds. Usage: convo2 on 5 @mention", threadID, messageID);
        }

        const filePath = path.join(__dirname, "convo", "2.txt");
        if (!fs.existsSync(filePath)) {
            return api.sendMessage("❌ File 2.txt not found in modules/commands/convo/", threadID, messageID);
        }

        const content = fs.readFileSync(filePath, "utf-8").split("\n").filter(line => line.trim() !== "");
        if (content.length === 0) {
            return api.sendMessage("❌ 2.txt is empty.", threadID, messageID);
        }

        const mentionID = Object.keys(mentions)[0];
        const mentionName = mentionID ? mentions[mentionID].replace("@", "") : "";

        if (activeThreads.has(threadID)) {
            clearTimeout(activeThreads.get(threadID));
        }

        api.sendMessage(`✅ convo2 started with ${seconds}s interval.`, threadID);

        let index = 0;
        const sendMsg = () => {
            let message = content[index];
            if (mentionID) {
                const body = `${mentions[mentionID]} ${message}`;
                api.sendMessage({
                    body: body,
                    mentions: [{ tag: mentions[mentionID], id: mentionID }]
                }, threadID);
            } else {
                api.sendMessage(message, threadID);
            }

            index = (index + 1) % content.length;
            const timeoutId = setTimeout(sendMsg, seconds * 1000);
            activeThreads.set(threadID, timeoutId);
        };

        sendMsg();
    } else {
        return api.sendMessage("Usage: convo2 on |seconds| @mention or convo2 off", threadID, messageID);
    }
};