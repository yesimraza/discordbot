module.exports.config = {
  name: "pay",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Transfer your money to someone else",
  commandCategory: "Currency",
  usages: "tag/reply",
  cooldowns: 5,
};

module.exports.run = async ({ event, api, Currencies, args, Users }) => {
  try {
    let { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions)[0];
    const balance = (await Currencies.getData(senderID)).money;

    if (!mention && event.messageReply) {
      const coins = args[0] === 'all' ? balance : !isNaN(args[0]) ? BigInt(args[0]) : args[0];
      if (isNaN(String(coins))) 
        return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n❌ 𝗧𝗵𝗲 𝗮𝗺𝗼𝘂𝗻𝘁 𝘆𝗼𝘂 𝗲𝗻𝘁𝗲𝗿𝗲𝗱 𝗶𝘀 𝗻𝗼𝘁 𝘃𝗮𝗹𝗶𝗱.\n\n⚝──⭒─⭑─⭒──⚝`, threadID, messageID);

      const namePay = await Users.getNameUser(event.messageReply.senderID);
      if (coins > balance || coins < 1n) 
        return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n\n❌ 𝗬𝗼𝘂 𝗱𝗼 𝗻𝗼𝘁 𝗵𝗮𝘃𝗲 𝗲𝗻𝗼𝘂𝗴𝗵 𝗺𝗼𝗻𝗲𝘆 𝘁𝗼 𝘁𝗿𝗮𝗻𝘀𝗳𝗲𝗿.\n\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);

      return api.sendMessage({ 
        body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n✅ 𝗧𝗿𝗮𝗻𝘀𝗳𝗲𝗿𝗿𝗲𝗱 ${formatNumber(coins)}$ 𝘁𝗼 ${namePay}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺` 
      }, threadID, async () => {
        await Currencies.increaseMoney(event.messageReply.senderID, String(coins));
        Currencies.decreaseMoney(senderID, String(coins));
      }, messageID);
    }

    if (!mention) 
      return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗮𝗴 𝗮 𝘂𝘀𝗲𝗿 𝘁𝗼 𝘁𝗿𝗮𝗻𝘀𝗳𝗲𝗿 𝗺𝗼𝗻𝗲𝘆.\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: ${global.config.PREFIX}${this.config.name} 100 @User\n\n⚝──⭒─⭑─⭒──⚝`, threadID, messageID);
    else {
      const coins = args[0] == 'all' ? balance : !isNaN(args[0]) ? BigInt(args[0]) : args[0];
      if (!isNaN(String(coins))) {
        let balance = (await Currencies.getData(senderID)).money;
        if (coins <= 0) 
          return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n\n❌ 𝗧𝗵𝗲 𝗮𝗺𝗼𝘂𝗻𝘁 𝘆𝗼𝘂 𝗲𝗻𝘁𝗲𝗿𝗲𝗱 𝗶𝘀 𝗻𝗼𝘁 𝘃𝗮𝗹𝗶𝗱.\n\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);

        if (coins > balance) 
          return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ 𝗬𝗼𝘂 𝗱𝗼 𝗻𝗼𝘁 𝗵𝗮𝘃𝗲 𝗲𝗻𝗼𝘂𝗴𝗵 𝗯𝗮𝗹𝗮𝗻𝗰𝗲 𝘁𝗼 𝘁𝗿𝗮𝗻𝘀𝗳𝗲𝗿.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID, messageID);
        else {
          return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n✅ 𝗧𝗿𝗮𝗻𝘀𝗳𝗲𝗿𝗿𝗲𝗱 ${formatNumber(coins)}$ 𝘁𝗼 ${event.mentions[mention].replace(/@/g, "")}\n\n⚝──⭒─⭑─⭒──⚝`, threadID, async () => {
            await Currencies.increaseMoney(mention, String(coins));
            Currencies.decreaseMoney(senderID, String(coins));
          }, messageID);
        }
      } else return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n\n❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝗻𝘂𝗺𝗯𝗲𝗿 𝗮𝘀 𝘁𝗵𝗲 𝗮𝗺𝗼𝘂𝗻𝘁 𝘁𝗼 𝘁𝗿𝗮𝗻𝘀𝗳𝗲𝗿.\n\n≿━━━━༺❀༻━━━━≾`, threadID, messageID);
    }
  } catch (e) {
    console.log(e);
  }
}

function formatNumber(number) {
  return number.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}