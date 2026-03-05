
module.exports.config = {
  name: "approve",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "ALIBABA",
  description: "Manage group bot rentals",
  commandCategory: "Admin",
  usages: "[add/remove/list/check/extend] [threadID] [days]",
  cooldowns: 5,
  dependencies: {
      "moment": "",
      "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args, Threads }) {
  const { threadID, messageID } = event;
  const fs = require("fs-extra");
  const moment = require("moment-timezone");
  const path = require("path");

  const dataPath = path.resolve(__dirname, 'cache', 'data', 'approve.json');

  if (!fs.existsSync(path.dirname(dataPath))) {
      fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  }

  let rentals = [];
  if (fs.existsSync(dataPath)) {
      try {
          rentals = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      } catch (err) {
          rentals = [];
      }
  }

  const action = args[0]?.toLowerCase();

  if (!action) {
      return api.sendMessage(
`🤖 𝗕𝗢𝗧 𝗥𝗘𝗡𝗧𝗔𝗟 𝗠𝗔𝗡𝗔𝗚𝗘𝗠𝗘𝗡𝗧
━━━━━━━━━━━━━━━━━
📌 ${global.config.PREFIX}approve add [threadID] [days] - Add or renew rental
📌 ${global.config.PREFIX}approve remove [threadID] - Remove rental
📌 ${global.config.PREFIX}approve list - Show all rented groups
📌 ${global.config.PREFIX}approve check [threadID] - Check group rental
📌 ${global.config.PREFIX}approve extend [threadID] [days] - Extend rental period`, threadID, messageID);
  }

  const form_mm_dd_yyyy = (input = "", split = input.split("/")) =>
    `${split[1]}/${split[0]}/${split[2]}`;

  switch (action) {
      case "add": {
          const targetID = args[1] || threadID;
          const days = parseInt(args[2]) || 30;

          if (!targetID || isNaN(days)) {
              return api.sendMessage("❌ Incorrect format! Use: approve add [threadID] [days]", threadID, messageID);
          }

          let threadInfo;
          try {
              threadInfo = await api.getThreadInfo(targetID);
              // If FCA returns an error or a minimal object without a name, trigger fallback
              if (!threadInfo || threadInfo.err || !threadInfo.threadName || threadInfo.threadName === "Unnamed Group") {
                throw new Error("Thread info not found or incomplete");
              }
          } catch (e) {
              console.log("Approve command: Fallback for ID", targetID);
              try {
                  const threads = await Threads.getAll();
                  const threadData = threads.find(t => String(t.threadID) === String(targetID));
                  if (threadData && threadData.threadInfo && threadData.threadInfo.threadName) {
                      threadInfo = { threadName: threadData.threadInfo.threadName };
                  } else if (threadData && threadData.data && threadData.data.threadName) {
                      threadInfo = { threadName: threadData.data.threadName };
                  } else {
                      throw new Error("Thread info not in database");
                  }
              } catch {
                  threadInfo = { threadName: "Thread " + targetID };
              }
          }

          const endDate = moment().add(days, "days").format("DD/MM/YYYY");
          const index = rentals.findIndex(item => item.t_id === targetID);
          const threadName = threadInfo.threadName || "Unnamed Group";

          if (index !== -1) {
              rentals[index].time_end = endDate;
              rentals[index].day_add = days;
              rentals[index].name_box = threadName;
          } else {
              rentals.push({
                  t_id: targetID,
                  time_end: endDate,
                  day_add: days,
                  name_box: threadName
              });
          }

          fs.writeFileSync(dataPath, JSON.stringify(rentals, null, 4));

          return api.sendMessage(`✅ Successfully ${index !== -1 ? "updated" : "added"} bot rental:
━━━━━━━━━━━━━━━━━
📌 Group: ${threadName}
🆔 Thread ID: ${targetID}
📅 Expires: ${endDate}
⏳ Duration: ${days} day(s)`, threadID, messageID);
      }

      case "remove": {
          const targetID = args[1] || threadID;
          const index = rentals.findIndex(item => item.t_id === targetID);

          if (index === -1) {
              return api.sendMessage("❌ This group is not in the rental list.", threadID, messageID);
          }

          const removed = rentals.splice(index, 1)[0];
          fs.writeFileSync(dataPath, JSON.stringify(rentals, null, 4));

          return api.sendMessage(`✅ Removed rental for group:
━━━━━━━━━━━━━━━━━
📌 Group: ${removed.name_box}
🆔 Thread ID: ${targetID}`, threadID, messageID);
      }

      case "list": {
          if (!rentals.length) {
              return api.sendMessage("📭 No groups have rented the bot yet.", threadID, messageID);
          }

          let msg = `📋 𝗥𝗘𝗡𝗧𝗘𝗗 𝗚𝗥𝗢𝗨𝗣𝗦 (${rentals.length})
━━━━━━━━━━━━━━━━━`;

          for (let [i, item] of rentals.entries()) {
              const endTime = new Date(form_mm_dd_yyyy(item.time_end)).getTime();
              const currentTime = Date.now() + 25200000; // Vietnam timezone offset
              const remaining = Math.ceil((endTime - currentTime) / (1000 * 60 * 60 * 24));
              const status = remaining > 0 ? `🟢 ${remaining} day(s) left` : "🔴 Expired";

              msg += `\n${i + 1}. ${item.name_box || "Unnamed"}
🆔 ID: ${item.t_id}
📅 Expires: ${item.time_end} (${status})\n`;
          }

          return api.sendMessage(msg, threadID, messageID);
      }

      case "check": {
          const targetID = args[1] || threadID;
          const found = rentals.find(item => item.t_id === targetID);

          if (!found) return api.sendMessage("❌ This group hasn't rented the bot.", threadID, messageID);

          const endTime = new Date(form_mm_dd_yyyy(found.time_end)).getTime();
          const currentTime = Date.now() + 25200000; // Vietnam timezone offset
          const remaining = Math.ceil((endTime - currentTime) / (1000 * 60 * 60 * 24));
          const status = remaining > 0 ? `🟢 ${remaining} day(s) left` : "🔴 Expired";

          return api.sendMessage(`📄 𝗥𝗘𝗡𝗧𝗔𝗟 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━━━
📌 Group: ${found.name_box}
🆔 Thread ID: ${found.t_id}
📅 Expires: ${found.time_end}
⏳ Status: ${status}`, threadID, messageID);
      }

      case "extend": {
          const targetID = args[1] || threadID;
          const additional = parseInt(args[2]) || 30;

          if (!targetID || isNaN(additional)) {
              return api.sendMessage("❌ Format error. Use: approve extend [threadID] [days]", threadID, messageID);
          }

          const index = rentals.findIndex(item => item.t_id === targetID);

          if (index === -1) {
              return api.sendMessage("❌ This group hasn't rented yet. Use 'add' instead.", threadID, messageID);
          }

          const current = moment(rentals[index].time_end, "DD/MM/YYYY");
          const newDate = current.add(additional, "days").format("DD/MM/YYYY");

          rentals[index].time_end = newDate;
          rentals[index].day_add += additional;

          fs.writeFileSync(dataPath, JSON.stringify(rentals, null, 4));

          return api.sendMessage(`✅ Rental extended successfully!
━━━━━━━━━━━━━━━━━
📌 Group: ${rentals[index].name_box}
🆔 Thread ID: ${targetID}
📅 New Expiry: ${newDate}
➕ Added: ${additional} day(s)`, threadID, messageID);
      }

      default:
          return api.sendMessage("❌ Invalid action. Use one of: add, remove, list, check, extend", threadID, messageID);
  }
};
