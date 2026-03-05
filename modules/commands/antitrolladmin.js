module.exports.config = {
  name: "chuiadmin",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Users insulting admin will be auto-banned from the system",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 0,
  dependencies: {}
};

module.exports.handleReply = async function ({ api, args, Users, event, handleReply }) {
  const { threadID, messageID } = event;
  var name = await Users.getNameUser(event.senderID);

  var arg = event.body.split(" ");
  var uidUser = handleReply.author;
  var nameU = handleReply.nameU;

  switch (handleReply.type) {
    case "reply": {
      var idad = global.config.ADMINBOT;
      for (let ad of idad) {
        api.sendMessage({
          body: "━━━━━━━━━━━━━━\n⚠️ Response from offender: " + name + ":\n" + event.body + "\n━━━━━━━━━━━━━━",
          mentions: [{ id: event.senderID, tag: name }]
        }, ad, (e, data) => global.client.handleReply.push({
          name: this.config.name,
          messageID: data.messageID,
          messID: event.messageID,
          author: event.senderID,
          id: event.threadID,
          nameU: name,
          type: "banU"
        }))
      }
      break;
    }

    case "banU": {
      if (arg[0].toLowerCase() === "unban") {
        let data = (await Users.getData(uidUser)).data || {};
        data.banned = 0;
        data.reason = null;
        data.dateAdded = null;
        await Users.setData(uidUser, { data });
        global.data.userBanned.delete(uidUser, 1);

        api.sendMessage(`━━━━━━━━━━━━━━\n✅ Admin ${name}\n${nameU}, you have been unbanned.\n⚠️ Next time you will be permanently banned.\n━━━━━━━━━━━━━━`, uidUser, () =>
          api.sendMessage(`Unban successful ✅\nUser: ${nameU}\nUID: ${uidUser}`, threadID));
      } else {
        api.sendMessage({
          body: `━━━━━━━━━━━━━━\n⚠️ Admin replied to you:\n${event.body}\n━━━━━━━━━━━━━━\nReply this message to apologize.`,
          mentions: [{ tag: name, id: event.senderID }]
        }, handleReply.id, (e, data) => global.client.handleReply.push({
          name: this.config.name,
          author: event.senderID,
          messageID: data.messageID,
          type: "reply"
        }), handleReply.messID);
      }
      break;
    }

    case "chuibot": {
      api.sendMessage({
        body: `━━━━━━━━━━━━━━\n⚠️ Admin replied:\n${event.body}\n━━━━━━━━━━━━━━\nReply this message to continue.`,
        mentions: [{ tag: name, id: event.senderID }]
      }, handleReply.id, (e, data) => global.client.handleReply.push({
        name: this.config.name,
        author: event.senderID,
        messageID: data.messageID,
        type: "reply"
      }), handleReply.messID);
      break;
    }
  }
};

module.exports.handleEvent = async ({ event, api, Users, Threads }) => {
  var { threadID, messageID, body, senderID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Karachi").format("HH:mm:ss D/MM/YYYY");

  const thread = global.data.threadData.get(threadID) || {};
  if (typeof thread["fixspam"] !== "undefined" && thread["fixspam"] == false) return;

  if (senderID == global.data.botID) return;
  let name = await Users.getNameUser(event.senderID);
  var idbox = event.threadID;
  var threadInfo = (await Threads.getData(threadID)).threadInfo;

  const { ADMINBOT } = global.config;
  if (ADMINBOT.includes(senderID)) return;

  var msg = {
    body: `━━━━━━━━━━━━━━\n⛔ ${name}, you insulted Admin and are now permanently banned.\nContact Admin if you want to appeal.\n━━━━━━━━━━━━━━`
  }

  const arr = [
    "fuck admin", "admin idiot", "admin stupid", "admin dumb", "admin dog", "admin bastard",
    "shit admin", "admin bitch", "admin asshole", "admin loser", "admin clown", "admin sucker",
    "admin garbage", "admin trash", "admin useless", "admin dickhead", "admin pussy",
    "admin cunt", "admin motherfucker", "admin fag", "admin gay", "admin noob"
  ];

  arr.forEach(async i => {
    let str = i[0].toUpperCase() + i.slice(1);
    if (body.toLowerCase() === i || body === str) {
      const uidUser = event.senderID;
      let data = await Users.getData(uidUser).data || {};
      data.banned = 1;
      data.reason = i || null;
      data.dateAdded = time;
      await Users.setData(uidUser, { data });
      global.data.userBanned.set(uidUser, { reason: data.reason, dateAdded: data.dateAdded });

      api.sendMessage(msg, threadID, () => {
        var listAdmin = global.config.ADMINBOT;
        for (var idad of listAdmin) {
          let namethread = threadInfo.threadName;
          api.sendMessage(
            `━━━━━━━━━━━━━━\n⚠️ User insult detected!\n➝ Name: ${name}\n➝ UID: ${uidUser}\n➝ Box: ${namethread}\n➝ Insult: ${i}\n━━━━━━━━━━━━━━`,
            idad,
            (error, info) =>
              global.client.handleReply.push({
                name: this.config.name,
                author: senderID,
                messageID: info.messageID,
                messID: messageID,
                id: idbox,
                type: "chuibot"
              })
          );
        }
      });
    }
  });
};

module.exports.languages = {
  "en": { "on": "Enable", "off": "Disable", "successText": "Autoban enabled successfully!" }
}

module.exports.run = async function ({ api, event, Users, Threads, getText }) {
  const { threadID, messageID, senderID } = event;
  const threadSetting = global.data.threadData.get(threadID) || {};
  const userData = await Users.getData(senderID);
  if (userData && userData.data && userData.data.banned) {
    return api.sendMessage(`━━━━━━━━━━━━━━\n⛔ You are banned for insulting Admin.\nReason: ${userData.data.reason}\n━━━━━━━━━━━━━━`, threadID);
  }
  let data = (await Threads.getData(threadID)).data;
  if (typeof data["autoban"] == "undefined" || data["autoban"] == true) data["autoban"] = false;
  else data["autoban"] = true;
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`${(data["autoban"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
}