
module.exports.config = {
  name: "rankup",
  eventType: ["message"],
  version: "1.0.2",
  credits: "Kashif Raza",
  description: "Announcement rankup random gif for each group user"
};

module.exports.run = async function({ api, event, Currencies, Users }) {
  const { createReadStream, existsSync, mkdirSync } = require("fs-extra");
  const request = require("request");
  
  var { threadID, senderID } = event;
  threadID = String(threadID);
  senderID = String(senderID);

  const thread = global.data.threadData.get(threadID) || {};

  let exp = (await Currencies.getData(senderID)).exp;
  exp = exp += 1;

  if (isNaN(exp)) return;

  if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false) {
    await Currencies.setData(senderID, { exp });
    return;
  }

  const curLevel = Math.floor((Math.sqrt(1 + (3 * exp / 3) + 1) / 2));
  const level = Math.floor((Math.sqrt(1 + (3 * (exp + 1) / 3) + 1) / 2));

  if (level > curLevel && level != 1) {
    const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
    const dirMaterial = __dirname + `/cache/rankup/`;
    
    // Create directory if it doesn't exist
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    
    // Download gifs if they don't exist
    if (!existsSync(dirMaterial + "rankup1.gif")) {
      request("https://i.imgur.com/o2CmSZc.gif").pipe(require("fs-extra").createWriteStream(dirMaterial + "rankup1.gif"));
    }
    if (!existsSync(dirMaterial + "rankup2.gif")) {
      request("https://i.imgur.com/Uppc0gg.gif").pipe(require("fs-extra").createWriteStream(dirMaterial + "rankup2.gif"));
    }
    if (!existsSync(dirMaterial + "rankup3.gif")) {
      request("https://i.imgur.com/YcpPIbV.gif").pipe(require("fs-extra").createWriteStream(dirMaterial + "rankup3.gif"));
    }
    
    var messsage = (typeof thread.customRankup == "undefined") 
      ? `{name}, (⓿_⓿)凸❯❯❯\n\n 𝐘𝐨𝐮𝐫 𝐊𝐞𝐲𝐛𝐨𝐚𝐫𝐝 𝐇𝐚𝐬 𝐑𝐞𝐚𝐜𝐡𝐞𝐝\n 𝐋𝐞𝐯𝐞𝐥 {level}` 
      : thread.customRankup;
    
    messsage = messsage
      .replace(/\{name}/g, name)
      .replace(/\{level}/g, level);
    
    let random = Math.floor(Math.random() * 3) + 1;
    let arrayContent;
    
    if (existsSync(dirMaterial + `rankup${random}.gif`)) {
      arrayContent = { 
        body: messsage, 
        attachment: createReadStream(dirMaterial + `rankup${random}.gif`), 
        mentions: [{ tag: name, id: senderID }] 
      };
    } else {
      arrayContent = { 
        body: messsage, 
        mentions: [{ tag: name, id: senderID }] 
      };
    }
    
    api.sendMessage(arrayContent, threadID);
  }

  await Currencies.setData(senderID, { exp });
  return;
};
