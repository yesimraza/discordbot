const { join } = require("path");
const { existsSync, writeFileSync, readFileSync } = require("fs-extra");

module.exports.config = {
    name: "autotrans",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "**Kashif Raza**",
    description: "Automatically translate between Vietnamese, English, and Japanese",
    commandCategory: "Utilities",
    usages: "",
    cooldowns: 5,
    dependencies: {
        "request": ""
    }
};

let autoTranslateEnabled = true;
let autoTranslateThreads = new Map();

module.exports.run = async ({ api, event }) => {
    const threadID = event.threadID;
    if (autoTranslateThreads.has(threadID)) {
        autoTranslateThreads.delete(threadID);
        api.setMessageReaction("✅", event.messageID, () => { }, true);
        api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Auto translate has been disabled by **Kashif Raza****\n⚝──⭒─⭑─⭒──⚝`, threadID, event.messageID);
    } else {
        autoTranslateThreads.set(threadID, null);
        api.setMessageReaction("✅", event.messageID, () => { }, true);
        api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Select auto translate mode:\n1. Vietnamese - English\n2. Japanese <-> Vietnamese by **Kashif Raza****\n⚝──⭒─⭑─⭒──⚝`, threadID, (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                threadID: threadID
            });
        });
    }
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
    if (event.senderID !== handleReply.author) return;
    const threadID = handleReply.threadID;
    const choice = event.body.toLowerCase();
    if (choice === '1') {
        autoTranslateThreads.set(threadID, "vi-en");
        api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Auto translate between Vietnamese and English has been enabled by **Kashif Raza****\n⚝──⭒─⭑─⭒──⚝`, threadID);
    } else if (choice === '2') {
        autoTranslateThreads.set(threadID, "ja-vi");
        api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Auto translate between Japanese and Vietnamese has been enabled by **Kashif Raza****\n⚝──⭒─⭑─⭒──⚝`, threadID);
    } else {
        api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Please select 1 or 2.**\n⚝──⭒─⭑─⭒──⚝`, threadID);
    }
    global.client.handleReply = global.client.handleReply.filter(item => item.messageID !== handleReply.messageID);
};

module.exports.handleEvent = async ({ api, event }) => {
    const threadID = event.threadID;
    if (!autoTranslateEnabled || !autoTranslateThreads.has(threadID) || event.type !== "message" || event.body.startsWith(global.config.PREFIX)) return;
    if (event.body.toLowerCase() === "trans off") {
        autoTranslateThreads.delete(threadID);
        api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Auto translate has been disabled by **Kashif Raza****\n⚝──⭒─⭑─⭒──⚝`, threadID);
        return;
    }
    const languagePair = autoTranslateThreads.get(threadID);
    if (!languagePair) return;
    const message = event.body;
    if (!/[a-zA-Z\u3040-\u30FF]/.test(message)) return;
    const request = global.nodemodule["request"];
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${encodeURIComponent(message)}`;

    request(apiUrl, (err, response, body) => {
        if (err) return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**An error occurred while detecting the language!**\n⚝──⭒─⭑─⭒──⚝`, threadID, event.messageID);
        const retrieve = JSON.parse(body);
        const detectedLang = retrieve[2];
        let targetLang;
        if (languagePair === "vi-en") {
            targetLang = detectedLang === 'en' ? 'vi' : 'en';
        } else if (languagePair === "ja-vi") {
            targetLang = detectedLang === 'ja' ? 'vi' : 'ja';
        }
        if (!targetLang) return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**Language not supported!**\n⚝──⭒─⭑─⭒──⚝`, threadID, event.messageID);
        const translateApiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${detectedLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(message)}`;
        request(translateApiUrl, (err, response, body) => {
            if (err) return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n**An error occurred while translating the text!**\n⚝──⭒─⭑─⭒──⚝`, threadID, event.messageID);
            const translation = JSON.parse(body);
            let translatedText = '';
            translation[0].forEach(item => (item[0]) ? translatedText += item[0] : '');
            api.setMessageReaction("✅", event.messageID, () => { }, true);
            api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n${translatedText}\n⚝──⭒─⭑─⭒──⚝`, threadID, event.messageID);
        });
    });
};