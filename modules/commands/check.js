module.exports.config = {
  name: "check",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Check interactions by day, week, or all time",
  commandCategory: "Member",
  usages: "[all/week/day]",
  cooldowns: 0,
  dependencies: {
    "fs-extra": "",
    "moment-timezone": ""
  }
};

const path = __dirname + '/checktt/';
const moment = require('moment-timezone');

module.exports.onLoad = () => {
  const fs = require('fs-extra');
  if (!fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
    fs.mkdirSync(path, { recursive: true });
  }
  setInterval(() => {
    const today = moment.tz("Asia/Karachi").day();
    const checkttData = fs.readdirSync(path);
    checkttData.forEach(file => {
      try { var fileData = JSON.parse(fs.readFileSync(path + file)) } catch { return fs.unlinkSync(path + file) };
      if (fileData.time != today) {
        setTimeout(() => {
          fileData = JSON.parse(fs.readFileSync(path + file));
          if (fileData.time != today) {
            fileData.time = today;
            fs.writeFileSync(path + file, JSON.stringify(fileData, null, 4));
          }
        }, 60 * 1000);
      }
    });
  }, 60 * 1000);
};

module.exports.handleEvent = async ({ api, event }) => {
  const fs = require('fs-extra');
  const { threadID, senderID } = event;
  if (!fs.existsSync(path + threadID + '.json')) {
    const newObj = {
      time: moment.tz("Asia/Karachi").day(),
      day: {}
    };
    fs.writeFileSync(path + threadID + '.json', JSON.stringify(newObj, null, 4));
  }
  const threadData = JSON.parse(fs.readFileSync(path + threadID + '.json'));
  if (!threadData.day[senderID]) {
    threadData.day[senderID] = {
      count: 0,
      week: 0,
      all: 0
    };
  }
  threadData.day[senderID].count++;
  threadData.day[senderID].week++;
  threadData.day[senderID].all++;
  fs.writeFileSync(path + threadID + '.json', JSON.stringify(threadData, null, 4));
};

module.exports.run = async ({ api, event, args, Users }) => {
  const fs = require('fs-extra');
  const { threadID, messageID } = event;
  if (!fs.existsSync(path + threadID + '.json')) {
    return api.sendMessage("⚠️ No interaction data found for this group.", threadID, messageID);
  }
  const threadData = JSON.parse(fs.readFileSync(path + threadID + '.json'));
  const data = threadData.day;
  let arr = [];
  for (let id in data) {
    const name = await Users.getNameUser(id) || "Unknown User";
    arr.push({
      name,
      id,
      count: data[id].count,
      week: data[id].week,
      all: data[id].all
    });
  }
  arr.sort((a, b) => b.count - a.count);
  let msg = "📊 Interaction Rankings 📊\n";
  if (args[0] === "day") {
    arr.sort((a, b) => b.count - a.count);
    msg += "━━━◆ 𝗧𝗼𝗱𝗮𝘆 ◆━━━\n";
    arr.forEach((user, i) => {
      msg += `${i + 1}. ${user.name} → ${user.count} messages\n`;
    });
  } else if (args[0] === "week") {
    arr.sort((a, b) => b.week - a.week);
    msg += "━━━◆ 𝗧𝗵𝗶𝘀 𝗪𝗲𝗲𝗸 ◆━━━\n";
    arr.forEach((user, i) => {
      msg += `${i + 1}. ${user.name} → ${user.week} messages\n`;
    });
  } else {
    arr.sort((a, b) => b.all - a.all);
    msg += "━━━◆ 𝗔𝗹𝗹 𝗧𝗶𝗺𝗲 ◆━━━\n";
    arr.forEach((user, i) => {
      msg += `${i + 1}. ${user.name} → ${user.all} messages\n`;
    });
  }
  return api.sendMessage(msg, threadID, messageID);
};