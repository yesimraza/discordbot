module.exports.config = { 	
  name: "outall", 	
  version: "1.0.0", 	
  hasPermssion: 3, 	
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀", 	
  description: "Leave all groups", 	
  commandCategory: "Admin", 	
  usages: "sendnoti [Text]", 	
  cooldowns: 5, 	
};

module.exports.run = async ({ api, event, args }) => { 	
  return api.getThreadList(100, null, ["INBOX"], (err, list) => { 		
    if (err) throw err; 		
    list.forEach(item => (item.isGroup == true && item.threadID != event.threadID) ? 
      api.removeUserFromGroup(api.getCurrentUserID(), item.threadID) : ''); 		
    api.sendMessage(
      "≿━━━━༺❀༻━━━━≾\n\n𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗹𝗲𝗳𝘁 𝗮𝗹𝗹 𝗴𝗿𝗼𝘂𝗽𝘀!\n\n≿━━━━༺❀༻━━━━≾",
      event.threadID
    ); 	
  }); 
};