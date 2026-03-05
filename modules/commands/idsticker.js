module.exports.config = {
  name: "idsticker",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Save sticker ID",
  commandCategory: "Utility",
  usages: "[reply]",
  cooldowns: 5   
}

module.exports.run = async function ({ api, event, args }) {
  if (event.type == "message_reply") {
    if (event.messageReply.attachments[0].type == "sticker") {
      return api.sendMessage({
        body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n🆔 Sticker ID: ${event.messageReply.attachments[0].ID}\n📝 Caption: ${event.messageReply.attachments[0].description}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`
      }, event.threadID)
    }
    else return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n❌ Please reply to a sticker!\n\n≿━━━━༺❀༻━━━━≾", event.threadID);
  }
  else if (args[0]) {
    return api.sendMessage({
      body: "⚝──⭒─⭑─⭒──⚝\n\n✅ Here is your sticker:\n\n⚝──⭒─⭑─⭒──⚝", 
      sticker: args[0]
    }, event.threadID);
  }
  else return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ Please reply to a sticker!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID);
}