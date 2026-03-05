module.exports.config = {
  name: "gcadmin",
  version: "2.7.1",
  hasPermssion: 1,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Add or remove group administrators",
  commandCategory: "Admin",
  usages: "[add|del] [tag/reply]",
  cooldowns: 1,
};

module.exports.run = async ({ api, event, args, Threads }) => {
  const threadID = event.threadID;
  const command = args[0];
  let threadInfo = await api.getThreadInfo(threadID);
  const botIsAdmin = threadInfo.adminIDs.some(el => el.id === api.getCurrentUserID());

  if (!botIsAdmin) {
    return api.sendMessage(
      "≿━━━━༺❀༻━━━━≾\n\n❌ The bot needs Administrator rights in the group to perform this command!\n\n≿━━━━༺❀༻━━━━≾",
      threadID,
      event.messageID
    );
  }

  let usersToManage = [];
  if (Object.keys(event.mentions).length > 0) {
    usersToManage = Object.keys(event.mentions);
  } else if (event.messageReply) {
    usersToManage.push(event.messageReply.senderID);
  } else if (args.length > 1) {
    usersToManage = args.slice(1);
  }

  if (usersToManage.length === 0) {
    return api.sendMessage(
      "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ Usage: /admin [add|del] @tag or reply to the message of the person you want to add/remove as an admin!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺",
      threadID,
      event.messageID
    );
  }

  for (let userID of usersToManage) {
    if (command === "add") {
      const userIsAlreadyAdmin = threadInfo.adminIDs.some(el => el.id === userID);
      if (!userIsAlreadyAdmin) {
        await api.changeAdminStatus(threadID, userID, true);
      }
    } else if (command === "del") {
      const userIsAdmin = threadInfo.adminIDs.some(el => el.id === userID);
      if (userIsAdmin) {
        await api.changeAdminStatus(threadID, userID, false);
      }
    } else {
      return api.sendMessage(
        "⚝──⭒─⭑─⭒──⚝\n\n❌ Invalid command!\n📌 Use 'add' to add an administrator or 'del' to remove one.\n\n⚝──⭒─⭑─⭒──⚝",
        threadID,
        event.messageID
      );
    }
  }

  async function refreshAdminList() {
    threadInfo = await api.getThreadInfo(threadID);
    let threadName = threadInfo.threadName;
    let qtv = threadInfo.adminIDs.length;
    await Threads.setData(threadID, { threadInfo });
    global.data.threadInfo.set(threadID, threadInfo);
    return { threadName, qtv };
  }

  let { threadName, qtv } = await refreshAdminList();
  if (command === "add") {
    return api.sendMessage(
      `≿━━━━༺❀༻━━━━≾\n\n✅ Administrator added successfully!\n\n👨‍💻 Group: ${threadName}\n🔎 ID: ${threadID}\n📌 Updated: ${qtv} administrators in this group.\n\n≿━━━━༺❀༻━━━━≾`,
      threadID,
      event.messageID
    );
  } else if (command === "del") {
    return api.sendMessage(
      `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n✅ Administrator removed successfully!\n\n👨‍💻 Group: ${threadName}\n🔎 ID: ${threadID}\n📌 Updated: ${qtv} administrators in this group.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
      threadID,
      event.messageID
    );
  }
};