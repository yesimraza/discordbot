module.exports.config = {
  name: "delbox",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Used to disband group members",
  commandCategory: "Admin",
  usages: "delbox",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, Threads }) {
  const threadID = event.threadID;
  const botID = api.getCurrentUserID();
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const botIsAdmin = threadInfo.adminIDs.some(e => e.id == botID);
    if (!botIsAdmin) 
      return api.sendMessage("❌ **Bot must be an admin to disband the group!**", threadID);

    const memberIDs = threadInfo.participantIDs.filter(id => {
      return id != botID && !threadInfo.adminIDs.some(admin => admin.id == id);
    });

    for (const userID of memberIDs) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      api.removeUserFromGroup(userID, threadID);
    }

    api.sendMessage("👋 **Goodbye Group!!**", threadID);
  } catch (error) {
    api.sendMessage("⚠️ **Error occurred while trying to remove members!**", threadID);
  }
};