module.exports.config = {
  name: "reminder",
  version: "0.0.1-beta",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Remind you about something after a set amount of time",
  commandCategory: "Members",
  usages: "[Time] [Text] ",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
  const time = args[0];
  const text = args.join(" ").replace(time, "");
  
  if (isNaN(time)) 
    return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝐓𝐡𝐞 𝐭𝐢𝐦𝐞 𝐲𝐨𝐮 𝐞𝐧𝐭𝐞𝐫𝐞𝐝 𝐢𝐬 𝐧𝐨𝐭 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);

  const display = time > 59 ? `${time / 60} minutes` : `${time} seconds`;
  api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n𝐈 𝐰𝐢𝐥𝐥 𝐫𝐞𝐦𝐢𝐧𝐝 𝐲𝐨𝐮 𝐚𝐟𝐭𝐞𝐫: ${display}\n\n⚝──⭒─⭑─⭒──⚝`, event.threadID, event.messageID);

  await new Promise(resolve => setTimeout(resolve, time * 1000));

  var value = await api.getThreadInfo(event.threadID);
  if (!(value.nicknames)[event.userID]) 
    value = (await Users.getData(event.senderID)).name;
  else 
    value = (value.nicknames)[event.senderID]; 

  return api.sendMessage({
    body: (text) 
      ? `≿━━━━༺❀༻━━━━≾\n\n${value}, 𝐲𝐨𝐮 𝐥𝐞𝐟𝐭 𝐭𝐡𝐢𝐬 𝐦𝐞𝐬𝐬𝐚𝐠𝐞: ${text}\n\n≿━━━━༺❀༻━━━━≾`
      : `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n${value}, 𝐢𝐭 𝐬𝐞𝐞𝐦𝐬 𝐲𝐨𝐮 𝐚𝐬𝐤𝐞𝐝 𝐦𝐞 𝐭𝐨 𝐫𝐞𝐦𝐢𝐧𝐝 𝐲𝐨𝐮 𝐨𝐟 𝐬𝐨𝐦𝐞𝐭𝐡𝐢𝐧𝐠!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
    mentions: [{
      tag: value,
      id: event.senderID
    }]
  }, event.threadID, event.messageID);
};