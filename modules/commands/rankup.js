module.exports.config = {
  name: "rankup",
  version: "1.0.2",
  hasPermssion: 1,
  credits: "ALI BABA",
  description: "Announcement rankup random gif for each group user",
  commandCategory: "system",
  dependencies: {
          "fs-extra": ""
  },
  cooldowns: 0,
  envConfig: {
          autoUnsend: false,
          unsendMessageAfter: 5
  }
};
module.exports.onLoad = () => {
const fs = require("fs-extra");
const request = require("request");
const dirMaterial = __dirname + `/cache/rankup/`;
if (!fs.existsSync(dirMaterial + "cache")) fs.mkdirSync(dirMaterial, { recursive: true });
if (!fs.existsSync(dirMaterial + "rankgif1.gif")) request 
("https://i.imgur.com/o2CmSZc.gif").pipe(fs.createWriteStream(dirMaterial + "rankup1.gif")); 
if (!fs.existsSync(dirMaterial + "rankup2.gif")) request  
("https://i.imgur.com/Uppc0gg.gif").pipe(fs.createWriteStream(dirMaterial + "rankup2.gif")); 
if (!fs.existsSync(dirMaterial + "rankup3.gif")) request 
("https://i.imgur.com/YcpPIbV.gif").pipe(fs.createWriteStream(dirMaterial + "rankup3.gif")); 
}
// Có sẵn hàm dowload cho gif
module.exports.handleEvent = async function({ api, event, Currencies, Users, getText }) {
  var {threadID, senderID } = event;
  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];

  threadID = String(threadID);
  senderID = String(senderID);

  const thread = global.data.threadData.get(threadID) || {};

  let exp = (await Currencies.getData(senderID)).exp;
  exp = exp += 1;

  if (isNaN(exp)) return;

  if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false) {
          await Currencies.setData(senderID, { exp });
          return;
  };

  const curLevel = Math.floor((Math.sqrt(1 + (3 * exp / 3) + 1) / 2));
  const level = Math.floor((Math.sqrt(1 + (3 * (exp + 1) / 3) + 1) / 2));

  if (level > curLevel && level != 1) {
          const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
          var messsage = (typeof thread.customRankup == "undefined") ? msg = getText("levelup") : msg = thread.customRankup,
                  arrayContent;

          messsage = messsage
                  .replace(/\{name}/g, name)
                  .replace(/\{level}/g, level);
let random = Math.floor(Math.random() * 3) + 1;//random gif , có bao nhiêu thay sau dấu * bấy nhiêu . Thêm gif và đổi tên thành rankup1/2/3.gif
          if (existsSync(__dirname + "/cache/rankup/")) mkdirSync(__dirname + "/cache/rankup/", { recursive: true });
          if (existsSync(__dirname + `/cache/rankup/rankup${random}.gif`)) arrayContent = { body: messsage, attachment: createReadStream(__dirname + `/cache/rankup/rankup${random}.gif`), mentions: [{ tag: name, id: senderID }] };
          else arrayContent = { body: messsage, mentions: [{ tag: name, id: senderID }] };
          const moduleName = this.config.name;
          api.sendMessage(arrayContent, threadID, async function (error, info){
                  if (error) return console.log("Error sending message:", error);
                  if (!info || !info.messageID) return console.log("No messageID received");
                  if (global.configModule[moduleName] && global.configModule[moduleName].autoUnsend) {
                          await new Promise(resolve => setTimeout(resolve, global.configModule[moduleName].unsendMessageAfter * 1000));
                          return api.unsendMessage(info.messageID);
                  } else return;
          });
  }

  await Currencies.setData(senderID, { exp });
  return;
}

module.exports.languages = {
  "vi": {
          "off": "tắt",
          "on": "bật",
          "successText": "thành công thông báo rankup!",
          "levelup": "Trình độ của {name} đã đạt tới level {level}"
  },
  "en": {
          "on": "on",
          "off": "off",
          "successText": "success notification rankup!",
          "levelup": "{name}, (⓿_⓿)凸❯❯❯\n\n 𝐘𝐨𝐮𝐫 𝐊𝐞𝐲𝐛𝐨𝐚𝐫𝐝 𝐇𝐚𝐬 𝐑𝐞𝐚𝐜𝐡𝐞𝐝\n 𝐋𝐞𝐯𝐞𝐥 {level}",
  }
}

module.exports.run = async function({ api, event, Threads, getText }) {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;

  if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
  else data["rankup"] = false;

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`${(data["rankup"] == true) ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
}