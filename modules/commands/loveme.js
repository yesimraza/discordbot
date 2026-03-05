const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const Canvas = require('canvas');
const moment = require('moment');

const DATA_PATH = path.join(__dirname, 'data', 'love_data.json');
const IMAGES_PATH = path.join(__dirname, 'data', 'love_images');

// Ensure folders
module.exports.onLoad = async () => {
    await fs.ensureFile(DATA_PATH);
    await fs.ensureDir(IMAGES_PATH);
    if (!(await fs.readJson(DATA_PATH, { throws: false }))) {
        await fs.writeJson(DATA_PATH, { couples: [], gifts: {} }, { spaces: 2 });
    }
};

module.exports.config = {
    name: "loveme",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Grok xAI",
    description: "Advanced Love System with Leaderboard & Gifts",
    commandCategory: "Love",
    usages: "loveme | set @tag | check | gift | top | profile | break",
    cooldowns: 5
};

const getLoveData = async () => {
    return await fs.readJson(DATA_PATH);
};

const saveLoveData = async (data) => {
    await fs.writeJson(DATA_PATH, data, { spaces: 2 });
};

const drawProfileCard = async (couple) => {
    const canvas = Canvas.createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 400);
    gradient.addColorStop(0, "#ff9a9e");
    gradient.addColorStop(1, "#fad0c4");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 400);

    // Heart border
    ctx.strokeStyle = "#ff4757";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(400, 100);
    ctx.bezierCurveTo(350, 50, 280, 50, 250, 100);
    ctx.bezierCurveTo(220, 150, 250, 200, 300, 250);
    ctx.bezierCurveTo(350, 300, 450, 300, 500, 250);
    ctx.bezierCurveTo(550, 200, 580, 150, 550, 100);
    ctx.bezierCurveTo(520, 50, 450, 50, 400, 100);
    ctx.closePath();
    ctx.stroke();

    // Names
    ctx.font = 'bold 36px Sans';
    ctx.fillStyle = '#2f3542';
    ctx.textAlign = 'center';
    ctx.fillText(couple.name1, 250, 180);
    ctx.fillText(couple.name2, 550, 180);

    // Love Points
    ctx.font = 'bold 28px Sans';
    ctx.fillStyle = '#e84393';
    ctx.fillText(`❤️ ${couple.points} LP`, 400, 240);

    // Time Together
    const days = Math.floor((Date.now() - new Date(couple.since)) / 86400000);
    ctx.font = '24px Sans';
    ctx.fillStyle = '#57606f';
    ctx.fillText(`${days} days together`, 400, 280);

    // Milestone
    if (days >= 365) ctx.fillText("1 Year Milestone!", 400, 320);
    else if (days >= 100) ctx.fillText("100 Days Strong!", 400, 320);

    return canvas.toBuffer();
};

module.exports.run = async function ({ api, event, args, Users }) {
    const { threadID, messageID, senderID, mentions } = event;
    const data = await getLoveData();
    const couple = data.couples.find(c => c.user1 === senderID || c.user2 === senderID);

    const cmd = args[0]?.toLowerCase();

    // SET LOVE
    if (cmd === "set" || !cmd) {
        if (couple) return api.sendMessage("❌ You're already in a relationship!", threadID, messageID);
        if (!mentions || Object.keys(mentions).length === 0) {
            return api.sendMessage("⚠️ Tag someone: `loveme set @tag`", threadID, messageID);
        }

        const targetID = Object.keys(mentions)[0];
        if (targetID === senderID) return api.sendMessage("😂 You can't love yourself!", threadID, messageID);

        const targetName = await Users.getName(targetID);
        const senderName = await Users.getName(senderID);

        if (data.couples.find(c => c.user1 === targetID || c.user2 === targetID)) {
            return api.sendMessage("❌ This person is already taken!", threadID, messageID);
        }

        api.sendMessage({
            body: `${targetName}, do you accept ${senderName}'s love proposal?\n\n❤️ React with ❤️ to accept!`,
            mentions: [{ tag: targetName, id: targetID }]
        }, threadID, (err, info) => {
            global.client.handleReaction.push({
                name: "loveme",
                messageID: info.messageID,
                author: senderID,
                target: targetID,
                type: "proposal"
            });
        }, messageID);

    // CHECK LOVE
    } else if (cmd === "check") {
        if (!couple) return api.sendMessage("💔 You're single. Use `loveme set @tag`", threadID, messageID);

        const partnerID = couple.user1 === senderID ? couple.user2 : couple.user1;
        const partnerName = await Users.getName(partnerID);
        const days = Math.floor((Date.now() - new Date(couple.since)) / 86400000);

        const msg = `
❤️ *Love Status* ❤️
👫 Partner: ${partnerName}
📅 Together: ${days} days
💎 Love Points: ${couple.points}
🎁 Gifts Sent: ${couple.gifts || 0}
        `.trim();

        api.sendMessage(msg, threadID, messageID);

    // SEND GIFT
    } else if (cmd === "gift") {
        if (!couple) return api.sendMessage("❌ No partner to gift!", threadID, messageID);

        const today = moment().format('YYYY-MM-DD');
        if (data.gifts[senderID] === today) {
            return api.sendMessage("⏳ You already sent a gift today!", threadID, messageID);
        }

        couple.points += 10;
        couple.gifts = (couple.gifts || 0) + 1;
        data.gifts[senderID] = today;

        await saveLoveData(data);

        const gifts = ["🌹 Rose", "💍 Ring", "🍫 Chocolate", "🎁 Gift Box", "🧸 Teddy"];
        const gift = gifts[Math.floor(Math.random() * gifts.length)];

        api.sendMessage(`🎉 You sent *${gift}* to your partner!\n+10 Love Points ❤️`, threadID, messageID);

    // LEADERBOARD
    } else if (cmd === "top") {
        if (data.couples.length === 0) return api.sendMessage("📭 No couples yet!", threadID, messageID);

        const sorted = data.couples
            .sort((a, b) => b.points - a.points)
            .slice(0, 10);

        let msg = "🏆 *Love Leaderboard* 🏆\n\n";
        for (let i = 0; i < sorted.length; i++) {
            const c = sorted[i];
            const name1 = await Users.getName(c.user1);
            const name2 = await Users.getName(c.user2);
            msg += `${i + 1}. ❤️ ${name1} × ${name2} → ${c.points} LP\n`;
        }

        api.sendMessage(msg, threadID, messageID);

    // PROFILE CARD
    } else if (cmd === "profile") {
        if (!couple) return api.sendMessage("💔 You're single!", threadID, messageID);

        const name1 = await Users.getName(couple.user1);
        const name2 = await Users.getName(couple.user2);
        couple.name1 = name1;
        couple.name2 = name2;

        const buffer = await drawProfileCard(couple);
        api.sendMessage({
            body: "💞 Your Love Profile Card",
            attachment: buffer
        }, threadID, messageID);

    // BREAK UP
    } else if (cmd === "break") {
        if (!couple) return api.sendMessage("❌ You're not in a relationship!", threadID, messageID);

        const partnerID = couple.user1 === senderID ? couple.user2 : couple.user1;
        const partnerName = await Users.getName(partnerID);

        api.sendMessage({
            body: `${partnerName}, do you agree to break up?\n💔 React with 💔 to confirm.`,
            mentions: [{ tag: partnerName, id: partnerID }]
        }, threadID, (err, info) => {
            global.client.handleReaction.push({
                name: "loveme",
                messageID: info.messageID,
                author: senderID,
                partner: partnerID,
                type: "breakup"
            });
        }, messageID);

    // HELP
    } else {
        api.sendMessage(`
💖 *LoveMe Commands* 💖

• loveme set @tag → Propose love
• loveme check → View relationship
• loveme gift → Send daily gift (+10 LP)
• loveme top → Global leaderboard
• loveme profile → Love card
• loveme break → End relationship
        `.trim(), threadID, messageID);
    }
};

// REACTIONS
module.exports.handleReaction = async ({ api, event, handleReaction, Users }) => {
    const { userID, messageID } = event;
    const data = await getLoveData();

    if (handleReaction.type === "proposal") {
        if (userID !== handleReaction.target || event.reaction !== "❤️") return;

        const name1 = await Users.getName(handleReaction.author);
        const name2 = await Users.getName(userID);

        data.couples.push({
            user1: handleReaction.author,
            user2: userID,
            since: new Date().toISOString(),
            points: 50,
            gifts: 0
        });

        await saveLoveData(data);
        api.sendMessage(`🎉 *${name1} × ${name2}* are now officially in love! ❤️\n+50 Starting Love Points!`, event.threadID);

    } else if (handleReaction.type === "breakup") {
        if (userID !== handleReaction.partner || event.reaction !== "💔") return;

        data.couples = data.couples.filter(c =>
            !(c.user1 === handleReaction.author && c.user2 === handleReaction.partner) &&
            !(c.user1 === handleReaction.partner && c.user2 === handleReaction.author)
        );

        await saveLoveData(data);
        api.sendMessage("💔 Relationship ended. Stay strong.", event.threadID);
    }
};