module.exports.config = {
  name: "listbb",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "View your friends list / Remove friends by replying",
  commandCategory: "Admin",
  usages: "listbb",
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, args, Users, handleReply, event, Threads }) {
  const { threadID, messageID } = event;
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  switch (handleReply.type) {
    case "reply": {
        var msg ="" , name, urlUser, uidUser;
        var arrnum = event.body.split(" ");
        var nums = arrnum.map(n => parseInt(n));
        for (let num of nums) {
          name = handleReply.nameUser[num - 1];
          urlUser = handleReply.urlUser[num - 1];
          uidUser = handleReply.uidUser[num - 1];

          api.unfriend(uidUser);
          msg += `- ${name}\n🌐ProfileUrl: ${urlUser}\n`;
        }

        api.sendMessage(
`༻﹡﹡﹡﹡﹡﹡﹡༺

**💢 Executed unfriend 💢**

${msg}

༻﹡﹡﹡﹡﹡﹡﹡༺`, 
          threadID, () => api.unsendMessage(handleReply.messageID));
      }
      break;
  }
};

module.exports.run = async function ({ event, api, args }) {
  const { threadID, messageID, senderID } = event;
  try {
    var listFriend = [];
    var dataFriend = await api.getFriendsList();
    var countFr = dataFriend.length;

    for (var friends of dataFriend) {
      listFriend.push({
        name: friends.fullName || "No name set",
        uid: friends.userID,
        gender: friends.gender,
        vanity: friends.vanity,
        profileUrl: friends.profileUrl
      });
    }
    var nameUser = [], urlUser = [], uidUser = [];
    var page = 1;
    page = parseInt(args[0]) || 1;
    page < -1 ? page = 1 : "";
    var limit = 10;
    var msg = `≿━━━━༺❀༻━━━━≾\n\n**🎭 FRIEND LIST INCLUDES ${countFr} FRIENDS 🎭**\n\n`;
    var numPage = Math.ceil(listFriend.length / limit);

    for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
      if (i >= listFriend.length) break;
      let infoFriend = listFriend[i];
      msg += `${i + 1}. ${infoFriend.name}\n🙇‍♂️ID: ${infoFriend.uid}\n🧏‍♂️Gender: ${infoFriend.gender}\n❄️Vanity: ${infoFriend.vanity}\n🌐Profile Url: ${infoFriend.profileUrl}\n\n`;
      nameUser.push(infoFriend.name);
      urlUser.push(infoFriend.profileUrl);
      uidUser.push(infoFriend.uid);
    }

    msg += `✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n--> **Page ${page}/${numPage}** <--\nUse **.friend + page number/all**\n\n`;

    return api.sendMessage(
`${msg}⚝──⭒─⭑─⭒──⚝

**🎭 Reply with the serial number(s) (from 1→10), you can reply multiple numbers separated by spaces to unfriend them.**

⚝──⭒─⭑─⭒──⚝`, 
      event.threadID, (e, data) =>
        global.client.handleReply.push({
          name: this.config.name,
          author: event.senderID,
          messageID: data.messageID,
          nameUser,
          urlUser,
          uidUser,
          type: 'reply'
        })
    )
  }
  catch (e) {
    return console.log(e)
  }
}