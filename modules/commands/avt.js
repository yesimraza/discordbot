module.exports.config = {
    name: "avt",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "**Kashif Raza**",
    description: "Get user avatar by ID",
    commandCategory: "Members",
    cooldowns: 0
};

module.exports.run = async function({ api, event, args, Threads }) {
    const request = require("request");
    const fs = require("fs");
    const axios = require("axios");
    const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
    const mn = this.config.name;
    
    if (!args[0]) return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**${prefix}${mn} box -> Get group avatar\n${prefix}${mn} id + id -> Get avatar by user ID\n${prefix}${mn} user -> Leave blank to get your own avatar\n${prefix}${mn} user + @tag -> Get avatar of tagged user by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);

    if (args[0] == "box") {
        if (args[1]) {
            let threadInfo = await api.getThreadInfo(args[1]);
            let imgg = threadInfo.imageSrc;
            if (!imgg) api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**Avatar of group ${threadInfo.threadName} by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
            else {
                var callback = () => api.sendMessage({ body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n**Avatar of group ${threadInfo.threadName} by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`, attachment: fs.createReadStream(__dirname + "/cache/1.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
                return request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
            }
        }    
        let threadInfo = await api.getThreadInfo(event.threadID);
        let img = threadInfo.imageSrc;
        if (!img) api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**✅ Avatar of group ${threadInfo.threadName} by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
        else {
            var callback = () => api.sendMessage({ body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n**✅ Avatar of group ${threadInfo.threadName} by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`, attachment: fs.createReadStream(__dirname + "/cache/1.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
            return request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
        }
    }
    else if (args[0] == "id") {
        try {
            var id = args[1];
            if (!id) return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**❎ Please enter the ID to get the avatar**\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
            var callback = () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/1.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
            return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
        } catch (e) {
            api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**⚠️ Unable to retrieve user avatar**\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
        }
    }
    else if (args[0] == "link") {
        var link = args[1];
        if (!link) return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**❎ Please enter the link to get the avatar**\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
        var tool = require("fb-tools");
        try {
            var id = await tool.findUid(args[1] || event.messageReply.body);
            var callback = () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/1.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
            return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
        } catch (e) {
            api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**⚠️ User does not exist**\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
        }
    }
    else if (args[0] == "user") {
        if (!args[1]) {
            var id = event.senderID;
            var callback = () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/1.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
            return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
        }
        else if (args.join().indexOf('@') !== -1) {
            var mentions = Object.keys(event.mentions);
            var callback = () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/1.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
            return request(encodeURI(`https://graph.facebook.com/${mentions}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
        }
        else {
            api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**❎ Incorrect command usage. Type ${prefix}${mn} to view module commands**\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
        }
    }
    else {
        api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**❎ Incorrect command usage. Type ${prefix}${mn} to view module commands**\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
    }
}