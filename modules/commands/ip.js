module.exports.config = {
	name: "ip",	
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
	description: "Check information of your IP or another IP", 
	commandCategory: "Search",
	usages: "",
	cooldowns: 0,
	dependencies: "",
	timezone: "Asia/Karachi"
};

module.exports.run = async function({ api, args, event, __GLOBAL }) {
  const timeStart = Date.now();
  const axios = require("axios");

  if (!args[0]) {
    api.sendMessage(
      "⚝──⭒─⭑─⭒──⚝\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮𝗻 𝗜𝗣 𝗮𝗱𝗱𝗿𝗲𝘀𝘀 𝘁𝗼 𝗰𝗵𝗲𝗰𝗸\n\n⚝──⭒─⭑─⭒──⚝",
      event.threadID, 
      event.messageID
    );
  } else {
    var infoip = (await axios.get(`http://ip-api.com/json/${args.join(' ')}?fields=66846719`)).data;
    if (infoip.status == 'fail') {
      api.sendMessage(
        `≿━━━━༺❀༻━━━━≾\n\n⚠️ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${infoip.message}\n\n≿━━━━༺❀༻━━━━≾`, 
        event.threadID, 
        event.messageID
      );
    } else {
      api.sendMessage({
        body: `༻﹡﹡﹡﹡﹡﹡﹡༺

🗺️ 𝗖𝗼𝗻𝘁𝗶𝗻𝗲𝗻𝘁: ${infoip.continent}
🏳️ 𝗖𝗼𝘂𝗻𝘁𝗿𝘆: ${infoip.country}
🎊 𝗖𝗼𝘂𝗻𝘁𝗿𝘆 𝗖𝗼𝗱𝗲: ${infoip.countryCode}
🕋 𝗥𝗲𝗴𝗶𝗼𝗻: ${infoip.region}
⛱️ 𝗦𝘁𝗮𝘁𝗲/𝗣𝗿𝗼𝘃𝗶𝗻𝗰𝗲: ${infoip.regionName}
🏙️ 𝗖𝗶𝘁𝘆: ${infoip.city}
🛣️ 𝗗𝗶𝘀𝘁𝗿𝗶𝗰𝘁: ${infoip.district}
📮 𝗣𝗼𝘀𝘁𝗮𝗹 𝗖𝗼𝗱𝗲: ${infoip.zip}
🧭 𝗟𝗮𝘁𝗶𝘁𝘂𝗱𝗲: ${infoip.lat}
🧭 𝗟𝗼𝗻𝗴𝗶𝘁𝘂𝗱𝗲: ${infoip.lon}
⏱️ 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: ${infoip.timezone}
👨‍✈️ 𝗢𝗿𝗴𝗮𝗻𝗶𝘇𝗮𝘁𝗶𝗼𝗻: ${infoip.org}
💵 𝗖𝘂𝗿𝗿𝗲𝗻𝗰𝘆: ${infoip.currency}

༻﹡﹡﹡﹡﹡﹡﹡༺`,
        location: {
          latitude: infoip.lat,
          longitude: infoip.lon,
          current: true
        }
      }, event.threadID, event.messageID);
    }
  }
}