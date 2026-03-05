const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "cache/points.json");

module.exports.config = {
  name: "point",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Check your points, other members' points, or all group members' points",
  commandCategory: "Earn Money",
  usages: "point | point all",
  cooldowns: 0,
  usePrefix: false,
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, senderID, mentions, type, messageReply, body } = event;
  let targetID = senderID;

  // Read points data from JSON file
  let pointsData;
  try {
    pointsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    return api.sendMessage(
      "⚠️ Unable to read points data. Please check the file.",
      threadID
    );
  }

  // Check points of all group members
  if (body.toLowerCase().includes("all")) {
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const allMembers = threadInfo.participantIDs;
      let message = `≿━━━━༺❀༻━━━━≾\n\n📊 Points of all group members:\n\n`;

      // Collect points info for all members
      let membersPoints = [];
      for (const memberID of allMembers) {
        const name = await Users.getNameUser(memberID);
        const points = pointsData[memberID] || 0;
        membersPoints.push({ name, points });
      }

      // Sort descending by points
      membersPoints.sort((a, b) => b.points - a.points);

      // Create message
      for (const member of membersPoints) {
        message += `➡ ${member.name}: ${member.points} points\n`;
      }

      message += `\n≿━━━━༺❀༻━━━━≾`;

      return api.sendMessage(message, threadID);
    } catch (e) {
      console.log(`Error while fetching points of all members:`, e);
      return api.sendMessage(
        "❎ An error occurred while retrieving group info. Please try again later.",
        threadID
      );
    }
  }

  // Check points of one person (reply or tag)
  if (type === "message_reply" && messageReply.senderID) {
    targetID = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  }

  const name = await Users.getNameUser(targetID);
  try {
    const points = pointsData[targetID] || 0;
    return api.sendMessage(
      `⚝──⭒─⭑─⭒──⚝\n\n➡ ${name} has ${points} points\n\n⚝──⭒─⭑─⭒──⚝`,
      threadID
    );
  } catch (e) {
    console.log(`Error while fetching points of user ${targetID}:`, e);
    return api.sendMessage(
      "❎ An error occurred. Please try again later.",
      threadID
    );
  }
};