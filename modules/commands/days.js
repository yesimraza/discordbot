module.exports.config = {
  name: "days",
  version: "1.0.0",
  hasPermission: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Count days until Lunar New Year, New Year and Christmas",
  commandCategory: "Utilities",
  usages: "Count days until Lunar New Year, New Year and Christmas",
  cooldowns: 5
};

module.exports.run = ({ event, api }) => {
  const { threadID, messageID } = event;
  const currentDate = new Date();
  const formatDate = currentDate.toISOString().split('T')[0];

  const holidays = [
    {
      name: 'New Year',
      date: `${currentDate.getFullYear()}-01-01`,
      congrats: '≿━━━━༺❀༻━━━━≾\n\n𝐇𝐚𝐩𝐩𝐲 𝐍𝐞𝐰 𝐘𝐞𝐚𝐫! 𝐌𝐚𝐲 𝐭𝐡𝐢𝐬 𝐲𝐞𝐚𝐫 𝐛𝐞 𝐟𝐮𝐥𝐥 𝐨𝐟 𝐬𝐮𝐜𝐜𝐞𝐬𝐬 𝐚𝐧𝐝 𝐡𝐚𝐩𝐩𝐢𝐧𝐞𝐬𝐬.\n\n≿━━━━༺❀༻━━━━≾'
    },
    {
      name: 'Christmas',
      date: `${currentDate.getFullYear()}-12-25`,
      congrats: '⚝──⭒─⭑─⭒──⚝\n\n𝐌𝐞𝐫𝐫𝐲 𝐂𝐡𝐫𝐢𝐬𝐭𝐦𝐚𝐬! 𝐖𝐢𝐬𝐡𝐢𝐧𝐠 𝐲𝐨𝐮 𝐚 𝐰𝐚𝐫𝐦, 𝐣𝐨𝐲𝐟𝐮𝐥 𝐚𝐧𝐝 𝐟𝐮𝐥𝐟𝐢𝐥𝐥𝐞𝐝 𝐬𝐞𝐚𝐬𝐨𝐧.\n\n⚝──⭒─⭑─⭒──⚝'
    },
    {
      name: 'Normal Day',
      date: `${currentDate.getFullYear()}-12-21`,
      congrats: '༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝐍𝐨𝐭𝐡𝐢𝐧𝐠 𝐬𝐩𝐞𝐜𝐢𝐚𝐥 𝐭𝐨𝐝𝐚𝐲!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺'
    }
  ];

  const calculateDaysLeft = (eventDate) => {
    const diffTime = new Date(eventDate) - currentDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  let message = '';
  holidays.forEach(holiday => {
    if (formatDate === holiday.date) {
      message += `${holiday.congrats}\n`;
    } else {
      const daysLeft = calculateDaysLeft(holiday.date);
      if (daysLeft > 0) {
        message += `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝐎𝐧𝐥𝐲 ${daysLeft} 𝐝𝐚𝐲𝐬 𝐥𝐞𝐟𝐭 𝐮𝐧𝐭𝐢𝐥 ${holiday.name}.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺\n`;
      }
    }
  });

  if (message) {
    api.sendMessage(message.trim(), threadID, messageID);
  }
};