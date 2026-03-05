module.exports.config = {
  name: "money",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Check your money, others' money, or all group members' money",
  commandCategory: "Earning Money",
  usages: "money | money all",
  cooldowns: 0,
  usePrefix: false,
};

module.exports.run = async function ({ Currencies, api, event, Users }) {
  const { threadID, senderID, mentions, type, messageReply, body } = event;
  let targetID = senderID;

  if (body.toLowerCase().includes("all")) {
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const allMembers = threadInfo.participantIDs;
      let message = `≿━━━━༺❀༻━━━━≾  

💰 Money of group members:  

`;

      let membersMoney = [];
      for (const memberID of allMembers) {
        const name = await Users.getNameUser(memberID);
        const userData = await Currencies.getData(memberID);
        const money = (userData && typeof userData.money !== 'undefined') ? userData.money : 0;
        membersMoney.push({ name, money });
      }

      membersMoney.sort((a, b) => b.money - a.money);

      for (const member of membersMoney) {
        if (member.money === Infinity) {
          message += `- ${member.name} has ♾️ Unlimited money\n`;
        } else {
          message += `- ${member.name} has ${member.money} VND\n`;
        }
      }

      message += `\n≿━━━━༺❀༻━━━━≾`;

      return api.sendMessage(message, threadID);
    } catch (e) {
      console.log(`Error while fetching money of all members:`, e);
      return api.sendMessage(
        `⚝──⭒─⭑─⭒──⚝  

❌ An error occurred while fetching group info. Please try again later.  

⚝──⭒─⭑─⭒──⚝`,
        threadID
      );
    }
  }

  if (type === 'message_reply' && messageReply.senderID) {
    targetID = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  }

  const name = await Users.getNameUser(targetID);

  try {
    const userData = await Currencies.getData(targetID);
    if (!userData || typeof userData.money === 'undefined') {
      return api.sendMessage(
        `༻﹡﹡﹡﹡﹡﹡﹡༺  

- ${name} has 0 VND  

༻﹡﹡﹡﹡﹡﹡﹡༺`,
        threadID
      );
    }

    const money = userData.money;
    if (money === Infinity) {
      return api.sendMessage(
        `༻﹡﹡﹡﹡﹡﹡﹡༺  

- ${name} has ♾️ Unlimited money  

༻﹡﹡﹡﹡﹡﹡﹡༺`,
        threadID
      );
    }

    return api.sendMessage(
      `༻﹡﹡﹡﹡﹡﹡﹡༺  

- ${name} has ${money} VND  

༻﹡﹡﹡﹡﹡﹡﹡༺`,
      threadID
    );
  } catch (e) {
    console.log(`Error while fetching money of user ${targetID}:`, e);
    return api.sendMessage(
      `≿━━━━༺❀༻━━━━≾  

❌ An error occurred. Please try again later.  

≿━━━━༺❀༻━━━━≾`,
      threadID
    );
  }
};