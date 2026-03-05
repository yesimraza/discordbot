const u = ["https://imgur.com/WoD5OoQ.png","https://imgur.com/x0QrTlQ.png","https://i.imgur.com/PPzdY41.png"]
const f = ["https://imgur.com/28aiYVA.png","https://imgur.com/vCO8LPL.png","https://imgur.com/OGxx1I4.png","https://imgur.com/S9igFa6.png"]
const g = ["https://imgur.com/R1Nc9Lz.png","https://imgur.com/yd0svOU.png","https://imgur.com/0MXw7eG.png","https://imgur.com/HYeoGia.png","https://imgur.com/KlLrw0y.png","https://imgur.com/B42txfi.png","https://imgur.com/JkunRCG.png","https://imgur.com/yHueKan.png","https://imgur.com/z2RpozR.png"]
const h = ["https://imgur.com/WspyTeK.png","https://imgur.com/2sGb8UV.png","https://imgur.com/YvuMkJ0.png","https://imgur.com/NF8nB3U.png","https://imgur.com/388n5TF.png","https://imgur.com/WcWC8z8.png","https://imgur.com/2sCe8GO.png","https://imgur.com/eDYbG9F.png","https://imgur.com/4n8FlLJ.png","https://imgur.com/rGV8aYs.png"]
const s = ["https://imgur.com/Dkco1Xz.png","https://imgur.com/Tmpw6me.png","https://imgur.com/C2HKEHu.png","https://imgur.com/BAEKMdK.png","https://imgur.com/LIH4YYl.png","https://imgur.com/vWE3V9T.png","https://imgur.com/nJ2qpiY.png","https://imgur.com/duis8N4.png","https://imgur.com/i3QC0eV.png","https://imgur.com/V7ji4IG.png","https://imgur.com/lAXMleJ.png","https://imgur.com/jYBBTuf.png","https://imgur.com/s0oBwea.png","https://imgur.com/nwJbpwR.png","https://imgur.com/jwVRzrk.png","https://imgur.com/tr5JHav.png","https://imgur.com/pSxLPtt.png","https://imgur.com/hsZ8GHY.png","https://imgur.com/Jb8lxQn.png","https://imgur.com/SLr5fGm.png","https://imgur.com/RqjgA57.png"]
const w = ["https://imgur.com/ky7Iu2t.png","https://imgur.com/1zZcchN.png","https://imgur.com/EidGfcr.png","https://imgur.com/Kmt9Hiz.png","https://imgur.com/wYimMMU.png","https://imgur.com/kKBLKIg.png","https://imgur.com/BSoFwWi.png","https://imgur.com/0eOJSp7.png","https://imgur.com/UlUnVdU.png","https://imgur.com/PQRrAOt.png","https://imgur.com/GhUBZnz.png"]

module.exports.config = {
  name: "lienquan",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Create Liên Quân avatar",
  commandCategory: "Member",
  usages: "+ reply image",
  cooldowns: 5
};

module.exports.run = async function({ api, args, event, permssion }) {
  const axios = require('axios');
  var i = args.join(" ");

  if (!i && event.type == 'message_reply') {
        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0)
            return api.sendMessage('༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝐘𝐨𝐮 𝐦𝐮𝐬𝐭 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐩𝐢𝐜𝐭𝐮𝐫𝐞 🌸\n\n༻﹡﹡﹡﹡﹡﹡﹡༺', event.threadID);
        if (event.messageReply.attachments.length > 1)  
            return api.sendMessage('⚝──⭒─⭑─⭒──⚝\n\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐨𝐧𝐥𝐲 𝐨𝐧𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞!\n\n⚝──⭒─⭑─⭒──⚝', event.threadID, eventmessageID);
        if (event.messageReply.attachments[0].type != 'photo')
            return api.sendMessage('≿━━━━༺❀༻━━━━≾\n\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐚 𝐩𝐡𝐨𝐭𝐨 🌸\n\n≿━━━━༺❀༻━━━━≾', event.threadID, event.messageID);

        i = event.messageReply.attachments[0].url;
    } else if (!i) {
        i = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    } else {
        if (i.indexOf('http') == -1) {
            i = 'https://' + i;
        }
    }
    return api.sendMessage('⚝──⭒─⭑─⭒──⚝\n\n𝐑𝐞𝐩𝐥𝐲 𝐭𝐨 𝐭𝐡𝐢𝐬 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐚𝐧𝐝 𝐞𝐧𝐭𝐞𝐫 𝐲𝐨𝐮𝐫 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫 𝐧𝐚𝐦𝐞 🌸\n\n⚝──⭒─⭑─⭒──⚝', event.threadID, (err, info) => {
        global.client.handleReply.push({
            step: 1,
            name: this.config.name,
            messageID: info.messageID,
            anh: i ,
            author: event.senderID
        })
    }, event.messageID);
}