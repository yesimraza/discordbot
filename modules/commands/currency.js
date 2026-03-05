const axios = require("axios");

module.exports.config = {
  name: "currency",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Convert currencies using online API",
  commandCategory: "Utility",
  cooldowns: 5,
  usages: "[amount] [fromCurrency] [toCurrency]",
};

module.exports.run = async function ({ api, event, args }) {
  const amount = parseFloat(args[0]);
  const fromCurrency = args[1];
  const toCurrency = args[2];

  if (isNaN(amount) || !fromCurrency || !toCurrency) {
    api.sendMessage(
      `≿━━━━༺❀༻━━━━≾\n\n` +
      `❎ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭, 𝐟𝐫𝐨𝐦-𝐜𝐮𝐫𝐫𝐞𝐧𝐜𝐲 𝐚𝐧𝐝 𝐭𝐨-𝐜𝐮𝐫𝐫𝐞𝐧𝐜𝐲!\n\n` +
      `≿━━━━༺❀༻━━━━≾`,
      event.threadID
    );
    return;
  }

  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const exchangeRates = response.data.rates;

    if (toCurrency in exchangeRates) {
      const convertedAmount = (amount * exchangeRates[toCurrency]).toFixed(2);
      api.sendMessage(
        `⚝──⭒─⭑─⭒──⚝\n\n` +
        `✅ ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}\n\n` +
        `⚝──⭒─⭑─⭒──⚝`,
        event.threadID
      );
    } else {
      api.sendMessage(
        `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n` +
        `⚠️ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐮𝐫𝐫𝐞𝐧𝐜𝐲 𝐜𝐨𝐝𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞𝐝!\n\n` +
        `༻﹡﹡﹡﹡﹡﹡﹡༺`,
        event.threadID
      );
    }
  } catch (error) {
    console.error("⚠️ Error fetching exchange rates:", error);
    api.sendMessage(
      `≿━━━━༺❀༻━━━━≾\n\n` +
      `⚠️ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐟𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐞𝐱𝐜𝐡𝐚𝐧𝐠𝐞 𝐫𝐚𝐭𝐞𝐬.\n\n` +
      `≿━━━━༺❀༻━━━━≾`,
      event.threadID
    );
  }
};