module.exports.config = {
  name: "match",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Random couple match",
  commandCategory: "Love", 
  usages: "match", 
  cooldowns: 10
};

module.exports.run = async function({ api, event, Threads, Users }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  var { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
  var tle = Math.floor(Math.random() * 101);

  let wishes = [
    "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗪𝗶𝘀𝗵𝗶𝗻𝗴 𝘆𝗼𝘂 𝗮 𝗹𝗶𝗳𝗲𝘁𝗶𝗺𝗲 𝗼𝗳 𝗵𝗮𝗽𝗽𝗶𝗻𝗲𝘀𝘀 𝘁𝗼𝗴𝗲𝘁𝗵𝗲𝗿 ❤️",
    "⚝──⭒─⭑─⭒──⚝\n\n𝗠𝗮𝘆 𝘆𝗼𝘂 𝗯𝘂𝗶𝗹𝗱 𝗮 𝗵𝗮𝗽𝗽𝘆 𝗵𝗼𝗺𝗲 𝘁𝗼𝗴𝗲𝘁𝗵𝗲𝗿 🏡",
    "≿━━━━༺❀༻━━━━≾\n\n𝗦𝘁𝗮𝘆 𝘁𝗼𝗴𝗲𝘁𝗵𝗲𝗿 𝗳𝗼𝗿𝗲𝘃𝗲𝗿 𝗮𝗻𝗱 𝗹𝗼𝘃𝗲 𝗲𝗮𝗰𝗵 𝗼𝘁𝗵𝗲𝗿 💕",
    "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗪𝗶𝘀𝗵𝗶𝗻𝗴 𝘆𝗼𝘂 𝗯𝗼𝘁𝗵 𝗵𝗮𝗽𝗽𝗶𝗻𝗲𝘀𝘀 ✨",
    "⚝──⭒─⭑─⭒──⚝\n\n𝗟𝗼𝘃𝗲 𝗶𝘀 𝗱𝗲𝘀𝘁𝗶𝗻𝘆... 💫",
    "≿━━━━༺❀༻━━━━≾\n\n𝗔 𝗹𝗼𝘄 𝗿𝗮𝘁𝗲, 𝗯𝘂𝘁 𝗸𝗲𝗲𝗽 𝘁𝗿𝘆𝗶𝗻𝗴 💪",
    "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝟯 𝗽𝗮𝗿𝘁𝘀 𝗱𝗲𝘀𝘁𝗶𝗻𝘆, 𝟳 𝗽𝗮𝗿𝘁𝘀 𝗲𝗳𝗳𝗼𝗿𝘁 🌟",
    "⚝──⭒─⭑─⭒──⚝\n\n𝗧𝗵𝗲 𝗰𝗵𝗮𝗻𝗰𝗲 𝗶𝘀 𝘀𝗺𝗮𝗹𝗹, 𝗯𝘂𝘁 𝘆𝗼𝘂 𝗰𝗮𝗻 𝗺𝗮𝗸𝗲 𝗶𝘁 𝘄𝗼𝗿𝗸 💖",
    "≿━━━━༺❀༻━━━━≾\n\n𝗗𝗮𝘁𝗲 𝗲𝗮𝗰𝗵 𝗼𝘁𝗵𝗲𝗿 𝗮𝗻𝗱 𝗴𝗼 𝗳𝘂𝗿𝘁𝗵𝗲𝗿 💌",
    "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗬𝗼𝘂 𝗮𝗿𝗲 𝗮 𝗴𝗼𝗼𝗱 𝗺𝗮𝘁𝗰𝗵, 𝗰𝗮𝗿𝗲 𝗺𝗼𝗿𝗲 💕",
    "⚝──⭒─⭑─⭒──⚝\n\n𝗧𝗿𝘂𝘀𝘁 𝗱𝗲𝘀𝘁𝗶𝗻𝘆 ✨",
    "≿━━━━༺❀༻━━━━≾\n\n𝗣𝗲𝗿𝗳𝗲𝗰𝘁 𝗺𝗮𝘁𝗰𝗵! 𝗧𝗮𝗸𝗲 𝗰𝗮𝗿𝗲 💖",
    "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗦𝗮𝘃𝗲 𝗲𝗮𝗰𝗵 𝗼𝘁𝗵𝗲𝗿’𝘀 𝗻𝘂𝗺𝗯𝗲𝗿, 𝗮𝗻𝗱 𝗰𝗮𝗹𝗹 𝗳𝗼𝗿 𝘁𝗵𝗲 𝘄𝗲𝗱𝗱𝗶𝗻𝗴 💍",
    "⚝──⭒─⭑─⭒──⚝\n\n𝗚𝗼 𝗮𝗵𝗲𝗮𝗱 𝗮𝗻𝗱 𝗴𝗲𝘁 𝗺𝗮𝗿𝗿𝗶𝗲𝗱 💒"
  ];

  let wish = wishes[Math.floor(Math.random() * wishes.length)];
  var namee = (await Users.getData(event.senderID)).name;
  const botID = api.getCurrentUserID();
  const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
  var id = listUserID[Math.floor(Math.random() * listUserID.length)];
  var name = (await Users.getData(id)).name;

  var arraytag = [];
  arraytag.push({ id: event.senderID, tag: namee });
  arraytag.push({ id: id, tag: name });

  let Avatar = (await axios.get(
    `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
    { responseType: "arraybuffer" }
  )).data; 
  fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));

  let gifLove = (await axios.get(
    `https://i.ibb.co/wC2JJBb/trai-tim-lap-lanh.gif`,
    { responseType: "arraybuffer" }
  )).data; 
  fs.writeFileSync(__dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8"));

  let Avatar2 = (await axios.get(
    `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
    { responseType: "arraybuffer" }
  )).data;
  fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

  var imglove = [];
  imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
  imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
  imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));

  var msg = {
    body: `≿━━━━༺❀༻━━━━≾

[🥰]→ 𝗠𝗮𝘁𝗰𝗵𝗺𝗮𝗸𝗶𝗻𝗴 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹!  
[❤️]→ 𝗪𝗶𝘀𝗵:  
${wish}  
[💕]→ 𝗖𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗶𝗹𝗶𝘁𝘆 𝗿𝗮𝘁𝗲: ${tle}%  
${namee} 💓 ${name}

≿━━━━༺❀༻━━━━≾`,
    mentions: arraytag,
    attachment: imglove
  };

  return api.sendMessage(msg, event.threadID, event.messageID);
}