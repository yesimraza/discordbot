const path = require('path');
const fs = require('fs');

module.exports.config = {
  name: 'flirt',
  version: '1.0.0',
  hasPermission: 0,
  credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
  description: 'Send a random flirt line',
  commandCategory: 'Search',
  usages: '[]',
  cooldowns: 3,
  images: [],
};

const loadFlirt = () => {
  const filePath = path.resolve(__dirname, '../../includes/datajson/thinh.json');
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('❎ 𝐅𝐢𝐥𝐞 thinh.json 𝐝𝐨𝐞𝐬 𝐧𝐨𝐭 𝐞𝐱𝐢𝐬𝐭.');
    }

    let data = fs.readFileSync(filePath, 'utf8');
    if (data.charCodeAt(0) === 0xFEFF) {
      data = data.slice(1);
    }

    const parsedData = JSON.parse(data);
    if (!Array.isArray(parsedData.thinh)) {
      throw new Error('❎ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐝𝐚𝐭𝐚 𝐟𝐨𝐫𝐦𝐚𝐭 𝐢𝐧 𝐭𝐡𝐢𝐧𝐡.𝐣𝐬𝐨𝐧.');
    }

    return parsedData.thinh;
  } catch (error) {
    console.error('⚠️ 𝐄𝐫𝐫𝐨𝐫 𝐰𝐡𝐢𝐥𝐞 𝐫𝐞𝐚𝐝𝐢𝐧𝐠 thinh.json:', error.message);
    return [];
  }
};

module.exports.run = async function({ api, event }) {
  const flirts = loadFlirt();
  if (flirts.length === 0) {
    return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ 𝐍𝐨 𝐝𝐚𝐭𝐚 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 thinh.json.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID);
  }

  const randomFlirt = flirts[Math.floor(Math.random() * flirts.length)];
  return api.sendMessage(`≿━━━━༺❀༻━━━━≾\n\n${randomFlirt}\n\n≿━━━━༺❀༻━━━━≾`, event.threadID);
};