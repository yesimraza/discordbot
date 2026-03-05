module.exports.config = {
  name: "setmoney",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Adjust user balance information",
  commandCategory: "Admin",
  usages: "[add/set/clean/reset] [Amount] [Tag user]",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    invalidAmount: '༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ 𝐓𝐡𝐞 𝐚𝐦𝐨𝐮𝐧𝐭 𝐦𝐮𝐬𝐭 𝐛𝐞 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺',
    addSuccess: '⚝──⭒─⭑─⭒──⚝\n\n✅ 𝐀𝐝𝐝𝐞𝐝 %1$ 𝐭𝐨 %2 𝐮𝐬𝐞𝐫(𝐬).\n\n⚝──⭒─⭑─⭒──⚝',
    addFailure: '≿━━━━༺❀༻━━━━≾\n\n❎ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐚𝐝𝐝 𝐦𝐨𝐧𝐞𝐲 𝐭𝐨 %1 𝐮𝐬𝐞𝐫(𝐬).\n\n≿━━━━༺❀༻━━━━≾',
    setSuccess: '༻﹡﹡﹡﹡﹡﹡﹡༺\n\n✅ 𝐒𝐞𝐭 %1$ 𝐟𝐨𝐫 %2 𝐮𝐬𝐞𝐫(𝐬) 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺',
    setFailure: '⚝──⭒─⭑─⭒──⚝\n\n❎ 𝐂𝐚𝐧𝐧𝐨𝐭 𝐬𝐞𝐭 𝐦𝐨𝐧𝐞𝐲 𝐟𝐨𝐫 %1 𝐮𝐬𝐞𝐫(𝐬).\n\n⚝──⭒─⭑─⭒──⚝',
    cleanSuccess: '≿━━━━༺❀༻━━━━≾\n\n✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐝𝐞𝐥𝐞𝐭𝐞𝐝 𝐦𝐨𝐧𝐞𝐲 𝐟𝐨𝐫 %1 𝐮𝐬𝐞𝐫(𝐬).\n\n≿━━━━༺❀༻━━━━≾',
    cleanFailure: '༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ 𝐂𝐚𝐧𝐧𝐨𝐭 𝐝𝐞𝐥𝐞𝐭𝐞 𝐦𝐨𝐧𝐞𝐲 𝐟𝐨𝐫 %1 𝐮𝐬𝐞𝐫(𝐬).\n\n༻﹡﹡﹡﹡﹡﹡﹡༺',
    resetSuccess: '⚝──⭒─⭑─⭒──⚝\n\n✅ 𝐀𝐥𝐥 𝐦𝐨𝐧𝐞𝐲 𝐝𝐚𝐭𝐚 𝐫𝐞𝐬𝐞𝐭 𝐟𝐨𝐫 %1 𝐮𝐬𝐞𝐫(𝐬).\n\n⚝──⭒─⭑─⭒──⚝',
    resetFailure: '≿━━━━༺❀༻━━━━≾\n\n❎ 𝐂𝐚𝐧𝐧𝐨𝐭 𝐫𝐞𝐬𝐞𝐭 𝐦𝐨𝐧𝐞𝐲 𝐝𝐚𝐭𝐚 𝐟𝐨𝐫 %1 𝐮𝐬𝐞𝐫(𝐬).\n\n≿━━━━༺❀༻━━━━≾',
    unknownCommand: '༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺'
  }
};

module.exports.run = async function({ event, api, Currencies, args }) {
  const { threadID, messageID, senderID } = event;
  const { languages } = module.exports;
  const mentionID = Object.keys(event.mentions);
  const money = Number(args[1]);

  var message = [];
  var error = [];

  const getText = (key, ...values) => {
    const lang = languages.en;
    let text = lang[key] || languages.en.unknownCommand;
    values.forEach((value, index) => {
      text = text.replace(`%${index + 1}`, value);
    });
    return text;
  };

  try {
    switch (args[0]) {
      case "add": {
        if (mentionID.length != 0) {
          for (const singleID of mentionID) {
            if (isNaN(money) || money <= 0) return api.sendMessage(getText('invalidAmount'), threadID, messageID);
            try {
              await Currencies.increaseMoney(singleID, money);
              message.push(singleID);
            } catch (e) {
              error.push(e);
              console.log(e);
            }
          }
          return api.sendMessage(getText('addSuccess', formatNumber(money), message.length), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('addFailure', error.length), threadID);
          }, messageID);
        } else {
          if (isNaN(money) || money <= 0) return api.sendMessage(getText('invalidAmount'), threadID, messageID);
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID;
            } else if (args.length === 3) {
              uid = args[2];
            }
            await Currencies.increaseMoney(uid, money);
            message.push(uid);
          } catch (e) {
            error.push(e);
            console.log(e);
          }
          return api.sendMessage(getText('addSuccess', formatNumber(money), uid !== senderID ? '1 user' : 'yourself'), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('addFailure', '1 user'), threadID);
          }, messageID);
        }
      }
      case 'all': {
        const allUserID = event.participantIDs;
        for (const singleUser of allUserID) {
          await Currencies.increaseMoney(singleUser, money);
        }
        api.sendMessage(getText('addSuccess', formatNumber(money), allUserID.length), threadID);
        break;
      }
      case "set": {
        if (mentionID.length != 0) {
          for (const singleID of mentionID) {
            if (isNaN(money) || money < 0) return api.sendMessage(getText('invalidAmount'), threadID, messageID);
            try {
              await Currencies.setData(singleID, { money });
              message.push(singleID);
            } catch (e) {
              error.push(e);
              console.log(e);
            }
          }
          return api.sendMessage(getText('setSuccess', formatNumber(money), message.length), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('setFailure', error.length), threadID);
          }, messageID);
        } else {
          if (isNaN(money) || money < 0) return api.sendMessage(getText('invalidAmount'), threadID, messageID);
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID;
            }
            await Currencies.setData(uid, { money });
            message.push(uid);
          } catch (e) {
            error.push(e);
            console.log(e);
          }
          return api.sendMessage(getText('setSuccess', formatNumber(money), uid !== senderID ? '1 user' : 'yourself'), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('setFailure', uid !== senderID ? '1 user' : 'yourself'), threadID);
          }, messageID);
        }
      }
      case "clean": {
        if (args[1] === 'all') {
          const data = event.participantIDs;
          for (const userID of data) {
            const datas = (await Currencies.getData(userID)).data;
            if (datas !== undefined) {
              datas.money = '0';
              await Currencies.setData(userID, datas);
            }
          }
          return api.sendMessage(getText('cleanSuccess', data.length), threadID);
        }
        if (mentionID.length != 0) {
          for (const singleID of mentionID) {
            try {
              await Currencies.setData(singleID, { money: 0 });
              message.push(singleID);
            } catch (e) {
              error.push(e);
              console.log(e);
            }
          }
          return api.sendMessage(getText('cleanSuccess', message.length), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('cleanFailure', error.length), threadID);
          }, messageID);
        } else {
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID;
            }
            await Currencies.setData(uid, { money: 0 });
            message.push(uid);
          } catch (e) {
            error.push(e);
            console.log(e);
          }
          return api.sendMessage(getText('cleanSuccess', uid !== senderID ? '1 user' : 'yourself'), threadID, function() {
            if (error.length != 0) return api.sendMessage(getText('cleanFailure', uid !== senderID ? '1 user' : 'yourself'), threadID);
          }, messageID);
        }
      }
      case "reset": {
        const allUserData = await Currencies.getAll(['userID']);
        for (const userData of allUserData) {
          const userID = userData.userID;
          try {
            await Currencies.setData(userID, { money: 0 });
            message.push(userID);
          } catch (e) {
            error.push(e);
            console.log(e);
          }
        }
        return api.sendMessage(getText('resetSuccess', message.length), threadID, function() {
          if (error.length != 0) return api.sendMessage(getText('resetFailure', error.length), threadID);
        }, messageID);
      }
      default: {
        return api.sendMessage(getText('unknownCommand'), threadID, messageID);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}