
module.exports.config = {
    name: "editcmd",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Kashif Raza",
    description: "Edit existing command",
    commandCategory: "Admin",
    usages: "[command name]",
    cooldowns: 5
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const fs = require("fs-extra");
    const { threadID, messageID, senderID, body } = event;

    if (senderID != handleReply.author) return;

    const cmdPath = `${__dirname}/${handleReply.cmdName}.js`;
    const newCode = body;

    try {
        fs.writeFileSync(cmdPath, newCode, "utf-8");
        
        delete require.cache[require.resolve(`./${handleReply.cmdName}.js`)];
        const command = require(`./${handleReply.cmdName}.js`);
        
        global.client.commands.delete(handleReply.cmdName);
        global.client.commands.set(handleReply.cmdName, command);

        return api.sendMessage(
            `━━━━━━━━━━━━━━━━━━\n✅ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗨𝗣𝗗𝗔𝗧𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n\n📌 Command: ${handleReply.cmdName}\n✨ Status: Successfully updated\n🔄 Changes applied\n\n━━━━━━━━━━━━━━━━━━`,
            threadID,
            messageID
        );
    } catch (error) {
        return api.sendMessage(
            `❌ Error while updating command:\n\n${error.message}`,
            threadID,
            messageID
        );
    }
};

module.exports.run = async function({ api, event, args, Users }) {
    const fs = require("fs-extra");
    const { threadID, messageID, senderID } = event;

    if (!args[0]) {
        return api.sendMessage(
            `⚠️ Please specify command name!\n\n📝 Usage: editcmd <command name>`,
            threadID,
            messageID
        );
    }

    const cmdName = args[0].toLowerCase();
    const cmdPath = `${__dirname}/${cmdName}.js`;

    if (!fs.existsSync(cmdPath)) {
        return api.sendMessage(
            `⚠️ Command "${cmdName}" not found!`,
            threadID,
            messageID
        );
    }

    const currentCode = fs.readFileSync(cmdPath, "utf-8");
    const name = await Users.getNameUser(senderID);

    return api.sendMessage(
        `━━━━━━━━━━━━━━━━━━\n📝 𝗘𝗗𝗜𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗\n━━━━━━━━━━━━━━━━━━\n\n👤 Admin: ${name}\n📌 Command: ${cmdName}\n\n📄 Current code:\n\n${currentCode}\n\n━━━━━━━━━━━━━━━━━━\n\n✏️ Reply with updated code to save changes.`,
        threadID,
        (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                cmdName: cmdName
            });
        },
        messageID
    );
};
