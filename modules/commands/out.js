module.exports.config = {
  name: "out",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Leave group",
  commandCategory: "Admin",
  usages: "[tid]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const id = parseInt(args[0]) || event.threadID;
  return api.sendMessage(
    "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗢𝗿𝗱𝗲𝗿 𝘁𝗼 𝗹𝗲𝗮𝘃𝗲 𝗴𝗿𝗼𝘂𝗽 𝗿𝗲𝗰𝗲𝗶𝘃𝗲𝗱 𝗳𝗿𝗼𝗺 𝗔𝗱𝗺𝗶𝗻!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺",
    id,
    () => api.removeUserFromGroup(api.getCurrentUserID(), id)
  );
};