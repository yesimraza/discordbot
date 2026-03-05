module.exports.config = {

  name: "rs",

  version: "2.0.2",

  hasPermssion: 3,

  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",

  description: "Restart bot",

  commandCategory: "Admin",

  usages: "rs",

  cooldowns: 5,

  dependencies: {}

}

module.exports.run = async function({ api, args, Users, event }) {

  const { threadID, messageID } = event;

  const moment = require("moment-timezone");

  var gio = moment.tz("Asia/Karachi").format("HH");

  var phut = moment.tz("Asia/Karachi").format("mm");

  var giay = moment.tz("Asia/Karachi").format("ss");

  let name = await Users.getNameUser(event.senderID);

  if (args.length == 0) api.sendMessage(

`≿━━━━༺❀༻━━━━≾

𝐁𝐨𝐭 𝐢𝐬 𝐫𝐞𝐬𝐭𝐚𝐫𝐭𝐢𝐧𝐠...  

𝐈𝐭 𝐰𝐢𝐥𝐥 𝐛𝐞 𝐛𝐚𝐜𝐤 𝐨𝐧𝐥𝐢𝐧𝐞 𝐢𝐧 𝟓 𝐬𝐞𝐜𝐨𝐧𝐝𝐬.

≿━━━━༺❀༻━━━━≾`, threadID, () => process.exit(1));

}