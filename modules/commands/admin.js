var request = require("request");
const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream } = require("fs-extra");

module.exports.config = {
  name: "admin",
  version: "1.0.5",
  hasPermssion: 3,
  credits: "Kashif Raza",
  description: "Configure admin settings for the bot",
  commandCategory: "Administration",
  usages: "[list | add | del | addntb | delntb | qtvonly | ntbonly | only | ibonly]",
  cooldowns: 2,
  dependencies: {
    "fs-extra": ""
  }
};

module.exports.languages = {
  "en": {
    "listAdmin": `===「 BOT ADMINS 」===\n━━━━━━━━━━━━━━━\n%1\n\n===「 BOT SUPPORTERS 」===\n━━━━━━━━━━━━━━━\n%2`,
    "notHavePermssion": '**You do not have permission to use "%1", Kashif Raza!**',
    "addedNewAdmin": '**Successfully added %1 user(s) as Bot Admin, Kashif Raza!**\n\n%2',
    "addedNewNDH": '**Successfully added %1 user(s) as Bot Supporter, Kashif Raza!**\n\n%2',
    "removedAdmin": '**Successfully removed Admin role from %1 user(s), Kashif Raza!**\n\n%2',
    "removedNDH": '**Successfully removed Supporter role from %1 user(s), Kashif Raza!**\n\n%2'
  }
};

module.exports.onLoad = function () {
  const { writeFileSync, existsSync } = require('fs-extra');
  const { resolve } = require("path");
  const path = resolve(__dirname, 'cache', 'data.json');
  if (!existsSync(path)) {
    const obj = {
      adminbox: {}
    };
    writeFileSync(path, JSON.stringify(obj, null, 4));
  } else {
    const data = require(path);
    if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
    writeFileSync(path, JSON.stringify(data, null, 4));
  }
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {
  const content = args.slice(1, args.length);
  if (args.length == 0) return api.sendMessage({
    body: `⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**==== [ ADMIN SETTINGS ] ====**\n━━━━━━━━━━━━━━━\n- admin list: View admin list\n- admin add: Add new admin\n- admin del: Remove admin role\n- admin addntb: Add new bot supporter\n- admin delntb: Remove supporter role\n- admin qtvonly: Enable/Disable group admin-only mode\n- admin ntbonly: Enable/Disable supporter-only mode\n- admin only: Enable/Disable admin-only mode\n- admin ibonly: Enable/Disable admin-only private messaging\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`
  }, event.threadID, event.messageID);
  
  const { threadID, messageID, mentions } = event;
  const { configPath } = global.client;
  const { ADMINBOT } = global.config;
  const { NDH } = global.config;
  const { userName } = global.data;
  const { writeFileSync } = global.nodemodule["fs-extra"];
  const mention = Object.keys(mentions);

  delete require.cache[require.resolve(configPath)];
  var config = require(configPath);
  
  switch (args[0]) {
    case "list":
    case "all":
    case "-a": {
      listAdmin = ADMINBOT || config.ADMINBOT || [];
      var msg = [];
      for (const idAdmin of listAdmin) {
        if (parseInt(idAdmin)) {
          const name = (await Users.getData(idAdmin)).name;
          msg.push(`Name: ${name}\n» FB: https://www.facebook.com/${idAdmin}`);
        }
      }
      listNDH = NDH || config.NDH || [];
      var msg1 = [];
      for (const idNDH of listNDH) {
        if (parseInt(idNDH)) {
          const name1 = (await Users.getData(idNDH)).name;
          msg1.push(`Name: ${name1}\n» FB: https://www.facebook.com/${idNDH}`);
        }
      }
      return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("listAdmin", msg.join("\n\n"), msg1.join("\n\n"))}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
    }

    case "add": {
      if (event.senderID != "61582493356125") return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**You are not the main Admin, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, event.threadID, event.messageID);
      if (permssion != 3) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("notHavePermssion", "add")}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      if (event.type == "message_reply") { content[0] = event.messageReply.senderID; }
      if (mention.length != 0 && isNaN(content[0])) {
        var listAdd = [];
        for (const id of mention) {
          ADMINBOT.push(id);
          config.ADMINBOT.push(id);
          listAdd.push(`${id} - ${event.mentions[id]}`);
        }
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, ""))}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      else if (content.length != 0 && !isNaN(content[0])) {
        ADMINBOT.push(content[0]);
        config.ADMINBOT.push(content[0]);
        const name = (await Users.getData(content[0])).name;
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("addedNewAdmin", 1, `Admin - ${name}`)}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      else return global.utils.throwError(this.config.name, threadID, messageID);
    }

    case "addntb": {
      if (event.senderID != "61582493356125") return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**You are not the main Admin, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, event.threadID, event.messageID);
      if (permssion != 3) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("notHavePermssion", "addntb")}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      if (event.type == "message_reply") { content[0] = event.messageReply.senderID; }
      if (mention.length != 0 && isNaN(content[0])) {
        var listAdd = [];
        for (const id of mention) {
          NDH.push(id);
          config.NDH.push(id);
          listAdd.push(`${id} - ${event.mentions[id]}`);
        }
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("addedNewNDH", mention.length, listAdd.join("\n").replace(/\@/g, ""))}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      else if (content.length != 0 && !isNaN(content[0])) {
        NDH.push(content[0]);
        config.NDH.push(content[0]);
        const name = (await Users.getData(content[0])).name;
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("addedNewNDH", 1, `Supporter - ${name}`)}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      else return global.utils.throwError(this.config.name, threadID, messageID);
    }

    case "remove":
    case "rm":
    case "del": {
      if (event.senderID != "61582493356125") return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**You are not the main Admin, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, event.threadID, event.messageID);
      if (permssion != 3) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("notHavePermssion", "del")}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      if (event.type == "message_reply") { content[0] = event.messageReply.senderID; }
      if (mentions.length != 0 && isNaN(content[0])) {
        const mention = Object.keys(mentions);
        var listAdd = [];
        for (const id of mention) {
          const index = config.ADMINBOT.findIndex(item => item == id);
          ADMINBOT.splice(index, 1);
          config.ADMINBOT.splice(index, 1);
          listAdd.push(`${id} - ${event.mentions[id]}`);
        }
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, ""))}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      else if (content.length != 0 && !isNaN(content[0])) {
        const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
        ADMINBOT.splice(index, 1);
        config.ADMINBOT.splice(index, 1);
        const name = (await Users.getData(content[0])).name;
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("removedAdmin", 1, `${content[0]} - ${name}`)}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      else global.utils.throwError(this.config.name, threadID, messageID);
    }

    case "removentb":
    case "delntb": {
      if (event.senderID != "61582493356125") return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**You are not the main Admin, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, event.threadID, event.messageID);
      if (permssion != 3) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("notHavePermssion", "delntb")}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      if (event.type == "message_reply") { content[0] = event.messageReply.senderID; }
      if (mentions.length != 0 && isNaN(content[0])) {
        const mention = Object.keys(mentions);
        var listAdd = [];
        for (const id of mention) {
          const index = config.NDH.findIndex(item => item == id);
          NDH.splice(index, 1);
          config.NDH.splice(index, 1);
          listAdd.push(`${id} - ${event.mentions[id]}`);
        }
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("removedNDH", mention.length, listAdd.join("\n").replace(/\@/g, ""))}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      else if (content.length != 0 && !isNaN(content[0])) {
        const index = config.NDH.findIndex(item => item.toString() == content[0]);
        NDH.splice(index, 1);
        config.NDH.splice(index, 1);
        const name = (await Users.getData(content[0])).name;
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n${getText("removedNDH", 1, `${content[0]} - ${name}`)}\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      else global.utils.throwError(this.config.name, threadID, messageID);
    }

    case 'qtvonly': {
      const { resolve } = require("path");
      const pathData = resolve(__dirname, 'cache', 'data.json');
      const database = require(pathData);
      const { adminbox } = database;
      if (permssion < 1) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**You are not a Bot Admin, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      if (adminbox[threadID] == true) {
        adminbox[threadID] = false;
        api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully disabled group admin-only mode, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      } else {
        adminbox[threadID] = true;
        api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully enabled group admin-only mode, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      writeFileSync(pathData, JSON.stringify(database, null, 4));
      break;
    }

    case 'ntbonly':
    case '-ndh': {
      if (permssion < 2) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**You are not a Bot Supporter, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      if (config.ndhOnly == false) {
        config.ndhOnly = true;
        api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully enabled supporter-only mode, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      } else {
        config.ndhOnly = false;
        api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully disabled supporter-only mode, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
      break;
    }

    case 'ibonly': {
      if (permssion != 3) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**You are not a Bot Admin, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      if (config.adminPaOnly == false) {
        config.adminPaOnly = true;
        api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully enabled admin-only private messaging, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      } else {
        config.adminPaOnly = false;
        api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully disabled admin-only private messaging, Kashif Raza! Everyone can now message the bot privately.**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
      break;
    }

    case 'only':
    case '-o': {
      if (permssion != 3) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**You are not a Bot Admin, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      if (config.adminOnly == false) {
        config.adminOnly = true;
        api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully enabled admin-only mode, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      } else {
        config.adminOnly = false;
        api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully disabled admin-only mode, Kashif Raza! Everyone can now use the bot.**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID, messageID);
      }
      writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
      break;
    }

    default: {
      return global.utils.throwError(this.config.name, threadID, messageID);
    }
  }
};