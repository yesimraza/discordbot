module.exports.config = {
  name: "challenge",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "A fun challenge randomizer game",
  commandCategory: "Game",
  cooldowns: 1
};

module.exports.run = async ({ api, event, args, Users, Currencies }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const request = require("request");

  const nameUser = (await Users.getData(event.senderID)).name || (await Users.getInfo(event.senderID)).name;
  let data = (await Currencies.getData(event.senderID)).ghepTime;

  var challenges = [
    "Send your crush 'I love you 3000 ❤️'",
    "Follow a trending challenge with a friend",
    "Skip turn",
    "Set a couple avatar with a stranger",
    "Send a love message to anyone",
    "Confess to your crush or a random person",
    "Tell a truth about yourself",
    "Show a picture of your most beautiful friend",
    "Tease someone in the group",
    "Expose someone in the group",
    "Kiss someone in the group using /kiss [tag them]",
    "Say the saddest sentence you ever heard",
    "Say what you want the most right now",
    "Talk bad about one of your friends 😂",
    "Tell us something surprising you once did",
    "Say what makes you happiest",
    "Tell us about a time you acted foolishly 😏",
    "Say who you think is the prettiest in this group",
    "Say which subject you are best at",
    "Make a love poem for the whole group 💁‍♂️",
    "Use the subject you’re best at to confess love to the group"
  ];

  var randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

  api.sendMessage(
    `≿━━━━༺❀༻━━━━≾\n\n` +
    `🎯 𝐓𝐡𝐢𝐬 𝐢𝐬 𝐚 𝐜𝐡𝐚𝐥𝐥𝐞𝐧𝐠𝐞 𝐟𝐨𝐫: ${nameUser}\n\n` +
    `👉 ${randomChallenge}\n\n` +
    `⚠️ 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞 𝐭𝐡𝐞 𝐜𝐡𝐚𝐥𝐥𝐞𝐧𝐠𝐞 𝐛𝐞𝐟𝐨𝐫𝐞 𝐩𝐢𝐜𝐤𝐢𝐧𝐠 𝐚𝐧𝐨𝐭𝐡𝐞𝐫!\n` +
    `📩 𝐘𝐨𝐮 𝐜𝐚𝐧 𝐬𝐮𝐠𝐠𝐞𝐬𝐭 𝐧𝐞𝐰 𝐜𝐡𝐚𝐥𝐥𝐞𝐧𝐠𝐞𝐬 𝐭𝐡𝐫𝐨𝐮𝐠𝐡 '/callad'\n\n` +
    `≿━━━━༺❀༻━━━━≾`,
    event.threadID,
    event.messageID
  );
};