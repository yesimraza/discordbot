module.exports.config = {
  name: "ping",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Tag all members in the group",
  commandCategory: "Admin",
  usages: "[Text]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
  try {
    const botID = api.getCurrentUserID();
    const senderID = event.senderID;
    const listUserID = event.participantIDs.filter(ID => ID != botID && ID != senderID);
    const senderName = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
    
    var body = (args.length != 0) 
      ? args.join(" ") 
      : "{name} has tagged all group members.";
      
    body = body.replace("{name}", senderName);

    var mentions = [], index = 0;
    for (const idUser of listUserID) {
      mentions.push({ id: idUser, tag: "‎", fromIndex: index - 1 });
      index -= 1;
    }

    return api.sendMessage(
      {
        body: `⚝──⭒─⭑─⭒──⚝\n\n𝐌𝐞𝐬𝐬𝐚𝐠𝐞: ${body}\n\n⚝──⭒─⭑─⭒──⚝`,
        mentions
      },
      event.threadID,
      event.messageID
    );
  } catch (e) {
    return console.log(e);
  }
};