const fs = require("fs-extra");
module.exports.config = {
    name: "warnkick",
    version: "1.0.0",
    hasPermssion: 1, 
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Warn and kick users from the group",
    commandCategory: "Admin",
    usages: "[usage]",
    cooldowns: 0
};

module.exports.run = async function({ api, event, args, Users, permssion }) {
    let path = __dirname + "/cache/data/canhbao.json";
    if (!fs.existsSync(__dirname + "/data")) fs.mkdirSync(__dirname + "/data");
    var data = {};
    try {
        data = JSON.parse(fs.readFileSync(path));
    } catch (err) {
        fs.writeFileSync(path, JSON.stringify(data));
    }

    if (args[0] == "list") {
        let threadID = event.threadID;
        let list = [];
        for (let id in data) {
            if (data[id].threadID == threadID) {
                let name = (await Users.getData(id)).name;
                let warns = data[id].warns;
                let reason = data[id].reason.join(", "); 
                let time = data[id].time;
                let info = `👤 **${name} has violated ${warns} times**\n📝 **Reason:** ${reason}\n⏰ **Time:** ${time}`;
                list.push(info);
            }
        }

        if (list.length == 0) {
            return api.sendMessage(
              `⚝──⭒─⭑─⭒──⚝\n\n❎ **No one has been warned in this group!**\n\n⚝──⭒─⭑─⭒──⚝`,
              event.threadID,
              event.messageID
            );
        } else {
            let msg = "≿━━━━༺❀༻━━━━≾\n\n**Warning list in the group:**\n\n";
            for (let i = 0; i < list.length; i++) {
                msg += `**${i + 1}. ${list[i]}**\n\n`;
            }
            msg += "≿━━━━༺❀༻━━━━≾";
            return api.sendMessage(msg, event.threadID, event.messageID);
        }
    }

    else if (args[0] == "reset") {
        if (permssion !== 2 && !global.config.ADMINBOT.includes(event.senderID)) 
            return api.sendMessage(
              `⚝──⭒─⭑─⭒──⚝\n\n⚠️ **You don't have permission to use this command!**\n\n⚝──⭒─⭑─⭒──⚝`,
              event.threadID,
              event.messageID
            );

        let threadID = event.threadID;
        if (args[1] == "all") {
            for (let id in data) {
                if (data[id].threadID == threadID) {
                    data[id].warns = 0;
                    delete data[id];
                }
            }
            fs.writeFileSync(path, JSON.stringify(data));
            return api.sendMessage(
              `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n✅ **All members' warnings have been reset in this group!**\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
              event.threadID,
              event.messageID
            );
        } else {
            let mention = Object.keys(event.mentions)[0];
            if (!mention) {
                if (event.type != "message_reply") 
                    return api.sendMessage(
                      `≿━━━━༺❀༻━━━━≾\n\n❎ **Please tag or reply to the user whose warnings you want to reset!**\n\n≿━━━━༺❀༻━━━━≾`,
                      event.threadID,
                      event.messageID
                    );
                else mention = event.messageReply.senderID;
            }
            let name = (await Users.getData(mention)).name;
            if (data[mention]) {
                data[mention].warns = 0;
                delete data[mention];
                fs.writeFileSync(path, JSON.stringify(data));
                return api.sendMessage(
                  `⚝──⭒─⭑─⭒──⚝\n\n✅ **Warnings of ${name} have been reset!**\n\n⚝──⭒─⭑─⭒──⚝`,
                  event.threadID,
                  event.messageID
                );
            } else {
                return api.sendMessage(
                  `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ **${name} has no warnings yet!**\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
                  event.threadID,
                  event.messageID
                );
            }
        }
    }

    else {
        let mention = Object.keys(event.mentions)[0];
        let reason = args.slice(1).join(" ");
        if (!mention) {
            if (event.type != "message_reply") 
                return api.sendMessage(
                  `≿━━━━༺❀༻━━━━≾\n\n❎ **Please tag or reply to the user you want to warn!**\n\n≿━━━━༺❀༻━━━━≾`,
                  event.threadID,
                  event.messageID
                );
            else {
                mention = event.messageReply.senderID;
                reason = args.join(" ");
            }
        }

        let name = (await Users.getData(mention)).name;
        if (!data[mention]) data[mention] = { "warns": 0, "reason": [] };
        data[mention].warns++;
        data[mention].threadID = event.threadID;
        data[mention].reason.push(reason || "No reason given");
        data[mention].time = `${new Date().toLocaleTimeString()} - ${new Date().toLocaleDateString()}`;
        fs.writeFileSync(path, JSON.stringify(data));

        let maxWarn = 3;
        if (data[mention].warns >= maxWarn) {
            api.removeUserFromGroup(mention, event.threadID);
            api.sendMessage(
              `⚝──⭒─⭑─⭒──⚝\n\n✅ **${name} has been removed from the group for reaching ${maxWarn} warnings!**\n\n⚝──⭒─⭑─⭒──⚝`,
              event.threadID,
              event.messageID
            );
            delete data[mention];
            fs.writeFileSync(path, JSON.stringify(data));
        } else {
            api.sendMessage(
              `≿━━━━༺❀༻━━━━≾\n\n⛔ **${name} has been warned ${data[mention].warns} time(s).**\n⚠️ **${maxWarn - data[mention].warns} warnings left before being removed from the group!**${reason ? `\n📝 **Reason:** ${reason}` : ""}\n\n≿━━━━༺❀༻━━━━≾`,
              event.threadID,
              event.messageID
            );
        }
    }
};