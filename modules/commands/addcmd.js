
module.exports.config = {
    name: "addcmd",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Kashif Raza",
    description: "Add new command to bot",
    commandCategory: "Admin",
    usages: "[reply to set name then reply with code]",
    cooldowns: 5
};

module.exports.handleReply = async function({ api, event, handleReply, Users }) {
    const fs = require("fs-extra");
    const { threadID, messageID, senderID, body } = event;

    if (senderID != handleReply.author) return;

    switch (handleReply.type) {
        case "setName": {
            const cmdName = body.trim().toLowerCase();
            
            if (!cmdName || cmdName.includes(" ")) {
                return api.sendMessage("⚠️ Invalid command name! Use a single word without spaces.", threadID, messageID);
            }

            const cmdPath = `${__dirname}/${cmdName}.js`;
            
            if (fs.existsSync(cmdPath)) {
                return api.sendMessage(`⚠️ Command "${cmdName}" already exists! Use editcmd to modify it.`, threadID, messageID);
            }

            return api.sendMessage(
                `✅ Command name set to: ${cmdName}\n\n📝 Now reply with the complete command code.`,
                threadID,
                (err, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "setCode",
                        cmdName: cmdName
                    });
                },
                messageID
            );
        }

        case "setCode": {
            const code = body;
            const cmdPath = `${__dirname}/${handleReply.cmdName}.js`;

            try {
                fs.writeFileSync(cmdPath, code, "utf-8");
                
                delete require.cache[require.resolve(`./${handleReply.cmdName}.js`)];
                const command = require(`./${handleReply.cmdName}.js`);
                
                global.client.commands.delete(handleReply.cmdName);
                global.client.commands.set(handleReply.cmdName, command);

                return api.sendMessage(
                    `━━━━━━━━━━━━━━━━━━\n✅ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗔𝗗𝗗𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n\n📌 Command: ${handleReply.cmdName}\n✨ Status: Successfully loaded\n🔄 Ready to use\n\n━━━━━━━━━━━━━━━━━━`,
                    threadID,
                    messageID
                );
            } catch (error) {
                return api.sendMessage(
                    `❌ Error while adding command:\n\n${error.message}`,
                    threadID,
                    messageID
                );
            }
        }
    }
};

module.exports.run = async function({ api, event, Users }) {
    const { threadID, messageID, senderID } = event;
    const name = await Users.getNameUser(senderID);

    return api.sendMessage(
        `━━━━━━━━━━━━━━━━━━\n📝 𝗔𝗗𝗗 𝗖𝗢𝗠𝗠𝗔𝗡𝗗\n━━━━━━━━━━━━━━━━━━\n\n👤 Admin: ${name}\n\n📌 Step 1: Reply with command name\n📌 Step 2: Reply with command code\n\n━━━━━━━━━━━━━━━━━━`,
        threadID,
        (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "setName"
            });
        },
        messageID
    );
};
