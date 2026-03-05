
const axios = require("axios");

module.exports.config = {
  name: "bomber",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Fun SMS bomber (50 messages limit per request)",
  commandCategory: "😂 Fun",
  usages: "bomber <number>",
  cooldowns: 10,
};

module.exports.run = async function ({ api, event, args }) {
  const number = args[0];
  if (!number) {
    return api.sendMessage("📱 Enter a mobile number!\n\nExample: bomber 03453XXXXXX", event.threadID, event.messageID);
  }

  // Convert number format (to 92)
  const target = number.startsWith("92") ? number : number.replace(/^0/, "92");

  try {
    let success = 0;

    for (let i = 0; i < 5; i++) { // ✅ 50 bar limit
      const res = await axios.get(`https://shadowscriptz.xyz/public_apis/smsbomberapi.php?num=${target}`);
      if (res.data) success++;
    }

    return api.sendMessage(
      `💣 SMS Bomber Started!\n\n📱 Number: ${number}\n📊 Messages Sent: ${success}/50\n⚠️ Limit: 50 per request`,
      event.threadID,
      event.messageID
    );
  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ Error sending SMS. Try again later!", event.threadID, event.messageID);
  }
};
