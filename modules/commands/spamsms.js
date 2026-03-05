module.exports.config = {
  name: "spamsms",
  version: "1.0.5",
  hasPermssion: 2,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Spam SMS or call",
  commandCategory: "Utility",
  usages: "spam phone_number | number_of_times | time_delay",
  cooldowns: 5,
  timezone: "Asia/Karachi"
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
  if (this.config.credits !== "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀")
    return api.sendMessage(
      "⚝──⭒─⭑─⭒──⚝\n\n𝐃𝐨 𝐧𝐨𝐭 𝐜𝐡𝐚𝐧𝐠𝐞 𝐭𝐡𝐞 𝐜𝐫𝐞𝐝𝐢𝐭𝐬, 𝐬𝐞𝐭 𝐢𝐭 𝐛𝐚𝐜𝐤 𝐭𝐨 𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀 𝐨𝐭𝐡𝐞𝐫𝐰𝐢𝐬𝐞 𝐭𝐡𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐰𝐢𝐥𝐥 𝐧𝐨𝐭 𝐰𝐨𝐫𝐤.\n\n⚝──⭒─⭑─⭒──⚝",
      event.threadID,
      event.messageID
    );

  var data = await Currencies.getData(event.senderID);
  const axios = require("axios");
  var list_id = [];

  const sdt = args
    .join(" ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(\s+\|)/g, "|")
    .replace(/\|\s+/g, "|")
    .split("|")[0];

  const solan = args
    .join(" ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(\s+\|)/g, "|")
    .replace(/\|\s+/g, "|")
    .split("|")[1];

  const delay = args
    .join(" ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(\s+\|)/g, "|")
    .replace(/\|\s+/g, "|")
    .split("|")[2];

  if (!sdt)
    return api.sendMessage(
      "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n⚠️ Missing phone number\n📝 Please enter in format:\n.spamsms phone_number | number_of_times | time_delay\n\n༻﹡﹡﹡﹡﹡﹡﹡༺",
      event.threadID,
      event.messageID
    );

  if (!solan)
    return api.sendMessage(
      "≿━━━━༺❀༻━━━━≾\n\n⚠️ Missing number of times\n📝 Please enter in format:\n.spamsms phone_number | number_of_times | time_delay\n\n≿━━━━༺❀༻━━━━≾",
      event.threadID,
      event.messageID
    );

  if (!delay)
    return api.sendMessage(
      "⚝──⭒─⭑─⭒──⚝\n\n⚠️ Missing time delay\n📝 Please enter in format:\n.spamsms phone_number | number_of_times | time_delay\n\n⚝──⭒─⭑─⭒──⚝",
      event.threadID,
      event.messageID
    );

  if (solan > 100 || solan == 101)
    return api.sendMessage(
      "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n⚠️ Number of times cannot exceed 100\n\n༻﹡﹡﹡﹡﹡﹡﹡༺",
      event.threadID
    );

  if (sdt == "0966852850")
    return api.sendMessage(
      "≿━━━━༺❀༻━━━━≾\n\n⚠️ This number cannot be spammed because it belongs to the admin\n\n≿━━━━༺❀༻━━━━≾",
      event.threadID
    );

  api.sendMessage(
    `⚝──⭒─⭑─⭒──⚝\n\n🔄 Processing spam\n📱 Phone Number: ${sdt}\n🔢 Number of Times: ${solan}\n⏰ Time Delay: ${delay}\n👤 Executed By: ${(await Users.getData(event.senderID)).name}\n\n⚝──⭒─⭑─⭒──⚝`,
    event.threadID
  );

  var data = await global.utils.getContent(
    `https://spam.dungkon.me/spam?sdt=${sdt}&luot=${solan}&delay=${delay}&apikey=niiozic`
  );
  console.log(data);
  if (data == null) return;

  let noti = data.data.message;
  let tong = data.data.totalCallApi;
  let thanhcong = data.data.success;
  let thatbai = data.data.fail;
  let soluot = data.data.soluot;

  return api.sendMessage(
    `≿━━━━༺❀༻━━━━≾\n\n📝 Status: ${noti}\n✏️ Total: ${tong}\n✅ Success: ${thanhcong}\n❎ Failed: ${thatbai}\n🔢 Attempts: ${soluot}\n⏰ Time Delay: ${delay}\n\n≿━━━━༺❀༻━━━━≾`,
    event.threadID
  );
};