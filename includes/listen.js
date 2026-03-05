module.exports = function ({ api, models }) {
  setInterval(function () {
    if (global.config.NOTIFICATION) {
      require("./handle/handleNotification.js")({ api });
    }
  }, 1000 * 60);
  const fs = require("fs");
  const Users = require("./controllers/users.js")({ models, api }),
    Threads = require("./controllers/threads.js")({ models, api }),
    Currencies = require("./controllers/currencies.js")({ models });
  const logger = require("../utils/log.js");
  const moment = require("moment-timezone");
  const axios = require("axios");
  var day = moment.tz("Asia/Karachi").day();
  (async function () {
    try {
      logger(global.getText("listen", "startLoadEnvironment"), "DATA");
      let threads = await Threads.getAll(),
        users = await Users.getAll(["userID", "name", "data"]),
        currencies = await Currencies.getAll(["userID"]);
      for (const data of threads) {
        const idThread = String(data.threadID);
        global.data.allThreadID.push(idThread),
          global.data.threadData.set(idThread, data["data"] || {}),
          global.data.threadInfo.set(idThread, data.threadInfo || {});
        if (data["data"] && data["data"]["banned"] == !![])
          global.data.threadBanned.set(idThread, {
            reason: data["data"]["reason"] || "",
            dateAdded: data["data"]["dateAdded"] || "",
          });
        if (
          data["data"] &&
          data["data"]["commandBanned"] &&
          data["data"]["commandBanned"]["length"] != 0
        )
          global["data"]["commandBanned"]["set"](
            idThread,
            data["data"]["commandBanned"],
          );
        if (data["data"] && data["data"]["NSFW"])
          global["data"]["threadAllowNSFW"]["push"](idThread);
      }
      logger(global.getText("listen", "loadedEnvironmentThread"));
      for (const dataU of users) {
        const idUsers = String(dataU["userID"]);
        global.data["allUserID"]["push"](idUsers);
        if (dataU.name && dataU.name["length"] != 0)
          global.data.userName["set"](idUsers, dataU.name);
        if (dataU.data && dataU.data.banned == 1)
          global.data["userBanned"]["set"](idUsers, {
            reason: dataU["data"]["reason"] || "",
            dateAdded: dataU["data"]["dateAdded"] || "",
          });
        if (
          dataU["data"] &&
          dataU.data["commandBanned"] &&
          dataU["data"]["commandBanned"]["length"] != 0
        )
          global["data"]["commandBanned"]["set"](
            idUsers,
            dataU["data"]["commandBanned"],
          );
      }
      for (const dataC of currencies)
        global.data.allCurrenciesID.push(String(dataC["userID"]));
    } catch (error) {
      return logger.loader(
        global.getText("listen", "failLoadEnvironment", error),
        "error",
      );
    }
  })();

  const admin = config.ADMINBOT;
  const userId = api.getCurrentUserID();
  const user = api.getUserInfo([userId]);
  const userName = user[userId]?.name || null;
  logger.loader("┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
  for (let i = 0; i <= admin.length - 1; i++) {
    dem = i + 1;
    logger.loader(` ADMIN ID ${dem}: ${!admin[i] ? "Empty" : admin[i]}`);
  }
  logger.loader(` BOT ID: ${userId} - ${userName}`);
  logger.loader(` PREFIX: ${global.config.PREFIX}`);
  logger.loader(
    ` BOT NAME: ${!global.config.BOTNAME ? "This bot was made by Khôi" : global.config.BOTNAME}`,
  );
  logger.loader("┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛");

  //////dọn cache khi onbot!////////////////////////////////////////////////////////////
  const { exec } = require("child_process");
  exec("rm -fr modules/commands/cache/*.m4a");
  exec("rm -fr modules/commands/cache/*.mp4 ");
  exec("rm -fr modules/commands/cache/*.png");
  exec("rm -fr modules/commands/cache/*.jpg");
  exec("rm -fr modules/commands/cache/*.gif");
  exec("rm -fr modules/commands/cache/*.mp3");
  const adminID = "100004370672067"; // thay id bạn vào đây
  api.sendMessage(`[💌]File usage request:\n[💫] Name: ${global.config.AMDIN_NAME} (${global.config.ADMINBOT[0]})\n[🥨] Facebook Link: ${global.config.FACEBOOK_ADMIN}\n[🎃] Commitment: Hello Raza, I am ${global.config.AMDIN_NAME}'s bot, I commit to you to use the file culturally, not to modify it randomly leading to errors, nor to change credits! Thank you`, adminID);
  //////dọn cache khi onbot!////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////
  //========= Require all handle need =========//
  //////////////////////////////////////////////

  const handleCommand = require("./handle/handleCommand.js")({
    api,
    models,
    Users,
    Threads,
    Currencies,
  });
  const handleCommandEvent = require("./handle/handleCommandEvent.js")({
    api,
    models,
    Users,
    Threads,
    Currencies,
  });
  const handleReply = require("./handle/handleReply.js")({
    api,
    models,
    Users,
    Threads,
    Currencies,
  });
  const handleReaction = require("./handle/handleReaction.js")({
    api,
    models,
    Users,
    Threads,
    Currencies,
  });
  const handleEvent = require("./handle/handleEvent.js")({
    api,
    models,
    Users,
    Threads,
    Currencies,
  });
  const handleRefresh = require("./handle/handleRefresh.js")({
    api,
    models,
    Users,
    Threads,
    Currencies,
  });
  const handleCreateDatabase = require("./handle/handleCreateDatabase.js")({
    api,
    Threads,
    Users,
    Currencies,
    models,
  });
  //logger hiện console
  logger.loader(
    `Ping loaded all commands and events • ${Date.now() - global.client.timeStart}ms •`,
  );
  //DEFINE DATLICH PATH
  const datlichPath = __dirname + "/../modules/commands/cache/datlich.json";

  //FUNCTION HOẠT ĐỘNG NHƯ CÁI TÊN CỦA NÓ, CRE: DUNGUWU
  const monthToMSObj = {
    1: 31 * 24 * 60 * 60 * 1000,
    2: 28 * 24 * 60 * 60 * 1000,
    3: 31 * 24 * 60 * 60 * 1000,
    4: 30 * 24 * 60 * 60 * 1000,
    5: 31 * 24 * 60 * 60 * 1000,
    6: 30 * 24 * 60 * 60 * 1000,
    7: 31 * 24 * 60 * 60 * 1000,
    8: 31 * 24 * 60 * 60 * 1000,
    9: 30 * 24 * 60 * 60 * 1000,
    10: 31 * 24 * 60 * 60 * 1000,
    11: 30 * 24 * 60 * 60 * 1000,
    12: 31 * 24 * 60 * 60 * 1000,
  };
  const checkTime = (time) =>
    new Promise((resolve) => {
      time.forEach((e, i) => (time[i] = parseInt(String(e).trim())));
      const getDayFromMonth = (month) =>
        month == 0
          ? 0
          : month == 2
            ? time[2] % 4 == 0
              ? 29
              : 28
            : [1, 3, 5, 7, 8, 10, 12].includes(month)
              ? 31
              : 30;
      if (time[1] > 12 || time[1] < 1)
        resolve("Your month seems invalid");
      if (time[0] > getDayFromMonth(time[1]) || time[0] < 1)
        resolve("Your day seems invalid");
      if (time[2] < 2022) resolve("What era are you living in?");
      if (time[3] > 23 || time[3] < 0)
        resolve("Your hour seems invalid");
      if (time[4] > 59 || time[3] < 0)
        resolve("Your minute seems invalid");
      if (time[5] > 59 || time[3] < 0)
        resolve("Your second seems invalid");
      yr = time[2] - 1970;
      yearToMS = yr * 365 * 24 * 60 * 60 * 1000;
      yearToMS += ((yr - 2) / 4).toFixed(0) * 24 * 60 * 60 * 1000;
      monthToMS = 0;
      for (let i = 1; i < time[1]; i++) monthToMS += monthToMSObj[i];
      if (time[2] % 4 == 0) monthToMS += 24 * 60 * 60 * 1000;
      dayToMS = time[0] * 24 * 60 * 60 * 1000;
      hourToMS = time[3] * 60 * 60 * 1000;
      minuteToMS = time[4] * 60 * 1000;
      secondToMS = time[5] * 1000;
      oneDayToMS = 24 * 60 * 60 * 1000;
      timeMs =
        yearToMS +
        monthToMS +
        dayToMS +
        hourToMS +
        minuteToMS +
        secondToMS -
        oneDayToMS;
      resolve(timeMs);
    });
  const tenMinutes = 10 * 60 * 1000;

  const checkAndExecuteEvent = async () => {
    if (!fs.existsSync(datlichPath))
      fs.writeFileSync(datlichPath, JSON.stringify({}, null, 4));
    var data = JSON.parse(fs.readFileSync(datlichPath));
    var timePK = moment().tz("Asia/Karachi").format("DD/MM/YYYY_HH:mm:ss");
    timePK = timePK.split("_");
    timePK = [...timePK[0].split("/"), ...timePK[1].split(":")];
    let temp = [];
    let pkMS = await checkTime(timePK);
    const compareTime = (e) =>
      new Promise(async (resolve) => {
        let getTimeMS = await checkTime(e.split("_"));
        if (getTimeMS < pkMS) {
          if (pkMS - getTimeMS < tenMinutes) {
            data[boxID][e]["TID"] = boxID;
            temp.push(data[boxID][e]);
            delete data[boxID][e];
          } else delete data[boxID][e];
          fs.writeFileSync(datlichPath, JSON.stringify(data, null, 4));
        }
        resolve();
      });
    await new Promise(async (resolve) => {
      for (boxID in data) {
        for (e of Object.keys(data[boxID])) await compareTime(e);
      }
      resolve();
    });
    for (el of temp) {
      try {
        var all = (await Threads.getInfo(el["TID"])).participantIDs;
        all.splice(all.indexOf(api.getCurrentUserID()), 1);
        var body = el.REASON || "Everyone",
          mentions = [],
          index = 0;

        for (let i = 0; i < all.length; i++) {
          if (i == body.length) body += " ‍ ";
          mentions.push({
            tag: body[i],
            id: all[i],
            fromIndex: i - 1,
          });
        }
      } catch (e) {
        return console.log(e);
      }
      var out = {
        body,
        mentions,
      };
      if ("ATTACHMENT" in el) {
        out.attachment = [];
        for (a of el.ATTACHMENT) {
          let getAttachment = (
            await axios.get(encodeURI(a.url), { responseType: "arraybuffer" })
          ).data;
          fs.writeFileSync(
            __dirname + `/../modules/commands/cache/${a.fileName}`,
            Buffer.from(getAttachment, "utf-8"),
          );
          out.attachment.push(
            fs.createReadStream(
              __dirname + `/../modules/commands/cache/${a.fileName}`,
            ),
          );
        }
      }
      console.log(out);
      if ("BOX" in el) await api.setTitle(el["BOX"], el["TID"]);
      api.sendMessage(out, el["TID"], (err) =>
        "ATTACHMENT" in el
          ? el.ATTACHMENT.forEach((a) =>
              fs.unlinkSync(
                __dirname + `/../modules/commands/cache/${a.fileName}`,
              ),
            )
          : "",
      );
    }
  };
  setInterval(checkAndExecuteEvent, tenMinutes / 10);
  return async (event) => {
    let form_mm_dd_yyyy = (input = "", split = input.split("/")) =>
      `${split[1]}/${split[0]}/${split[2]}`;
    let prefix =
      (global.data.threadData.get(event.threadID) || {}).PREFIX ||
      global.config.PREFIX;

    // Check admin-only mode first
    let adminOnly;
    try {
      adminOnly = JSON.parse(
        require("fs").readFileSync(
          process.cwd() + "/modules/commands/cache/qtvonly.json",
        ),
      );
    } catch {
      adminOnly = { qtvbox: {} };
    }

    const isAdminOnlyEnabled = adminOnly.qtvbox[event.threadID] === true;
    const isUserAdmin = global.config.ADMINBOT.includes(event.senderID);
    const isBotAdmin = event.senderID == api.getCurrentUserID();

    // Get thread info to check if user is group admin
    let isGroupAdmin = false;
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      isGroupAdmin = threadInfo.adminIDs.some(admin => admin.id === event.senderID);
    } catch (e) {
      console.log("Error getting thread info:", e);
    }

    // If admin-only mode is enabled and user is not admin, block command
    if (
      (event.body || "").startsWith(prefix) &&
      isAdminOnlyEnabled &&
      !isBotAdmin &&
      !isUserAdmin &&
      !isGroupAdmin
    ) {
      return api.sendMessage(
        "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ Admin-only mode is enabled. Only group admins and bot admins can use commands.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺",
        event.threadID
      );
    }

    if (
      (event.body || "").startsWith(prefix) &&
      event.senderID != api.getCurrentUserID() &&
      !global.config.ADMINBOT.includes(event.senderID)
    ) {
      // Rental system removed - bot now works in all groups without approval
    }
    const checkttDataPath = __dirname + "/../modules/commands/checktt/";
    setInterval(async () => {
      const day_now = moment.tz("Asia/Karachi").day();
      if (day != day_now) {
        day = day_now;
        const checkttData = fs.readdirSync(checkttDataPath);
        console.log("--> CHECKTT: New Day");
        checkttData.forEach(async (checkttFile) => {
          const checktt = JSON.parse(
            fs.readFileSync(checkttDataPath + checkttFile),
          );
          let storage = [],
            count = 1;
          for (const item of checktt.day) {
            const userName =
              (await Users.getNameUser(item.id)) || "Facebook User";
            const itemToPush = item;
            itemToPush.name = userName;
            storage.push(itemToPush);
          }
          storage.sort((a, b) => {
            if (a.count > b.count) {
              return -1;
            } else if (a.count < b.count) {
              return 1;
            } else {
              return a.name.localeCompare(b.name);
            }
          });
          let checkttBody = "[ Top 20 Daily Interactions ]\n─────────────────\n";
          checkttBody += storage
            .slice(0, 20)
            .map((item) => {
              return `${count++}. ${item.name} - ${item.count} msg.`;
            })
            .join("\n");
          api.sendMessage(
            `${checkttBody}\n─────────────────\nTotal messages today: ${storage.reduce((a, b) => a + b.count, 0)} msg\n⚡ Others try to interact if you want to be on top :3`,
            checkttFile.replace(".json", ""),
            (err) => (err ? logger(err) : ""),
          );
          checktt.last.day = JSON.parse(JSON.stringify(checktt.day));
          checktt.day.forEach((e) => {
            e.count = 0;
          });
          checktt.time = day_now;

          fs.writeFileSync(
            checkttDataPath + checkttFile,
            JSON.stringify(checktt, null, 4),
          );
        });
        if (day_now == 1) {
          console.log("--> CHECKTT: New Week");
          checkttData.forEach(async (checkttFile) => {
            const checktt = JSON.parse(
              fs.readFileSync(checkttDataPath + checkttFile),
            );
            if (!checktt.last)
              checktt.last = {
                time: day_now,
                day: [],
                week: [],
              };
            let storage = [],
              count = 1;
            for (const item of checktt.week) {
              const userName =
                (await Users.getNameUser(item.id)) || "Facebook User";
              const itemToPush = item;
              itemToPush.name = userName;
              storage.push(itemToPush);
            }
            storage.sort((a, b) => {
              if (a.count > b.count) {
                return -1;
              } else if (a.count < b.count) {
                return 1;
              } else {
                return a.name.localeCompare(b.name);
              }
            });
            let checkttBody = "[ Top 20 Weekly Interactions ]\n─────────────────\n";
            checkttBody += storage
              .slice(0, 10)
              .map((item) => {
                return `${count++}. ${item.name} - ${item.count} msg.`;
              })
              .join("\n");
            api.sendMessage(
              `${checkttBody}\n─────────────────\nTotal messages this week: ${storage.reduce((a, b) => a + b.count, 0)} msg.\n⚡ Others try to interact if you want to be on top :>`,
              checkttFile.replace(".json", ""),
              (err) => (err ? logger(err) : ""),
            );
            checktt.last.week = JSON.parse(JSON.stringify(checktt.week));
            checktt.week.forEach((e) => {
              e.count = 0;
            });

            fs.writeFileSync(
              checkttDataPath + checkttFile,
              JSON.stringify(checktt, null, 4),
            );
          });
        }
        global.client.sending_top = false;
      }
    }, 1000 * 10);

    switch (event.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        handleCreateDatabase({ event });
        handleCommand({ event });
        handleReply({ event });
        handleCommandEvent({ event });
        break;
      case "change_thread_image":
        // Handle lockdp
        (async () => {
          try {
            const fs = require("fs-extra");
            const axios = require("axios");
            const lockPath = "./modules/commands/cache/data/lockStatus.json";
            if (fs.existsSync(lockPath)) {
                const lockStatus = fs.readJsonSync(lockPath);
                if (lockStatus[event.threadID] && lockStatus[event.threadID].dp === true) {
                    if (String(event.author) !== String(api.getCurrentUserID())) {
                        const savedImg = lockStatus[event.threadID].imageSrc;
                        if (savedImg) {
                            api.sendMessage("『 𝗥𝗮𝘇𝗮 』→ Group DP is locked. Reverting change...", event.threadID);
                            const response = await axios.get(savedImg, { responseType: "stream" });
                            if (typeof api.setThreadImage === "function") {
                                return api.setThreadImage(response.data, event.threadID);
                            } else if (typeof api.changeGroupImage === "function") {
                                return api.changeGroupImage(response.data, event.threadID);
                            }
                        }
                    }
                }
            }
          } catch (e) { console.log("[ LOCK DP ERROR ]", e) }
        })();
        api.sendMessage(`${event.snippet}`, event.threadID);
        break;
      case "event":
        handleEvent({ event });
        handleRefresh({ event });
        break;
        
        // Handle antinamebox event specifically for thread name changes
        if (event.logMessageType === "log:thread-name") {
          try {
            const antiNameBoxEvent = require("../modules/events/antinamebox.js");
            if (antiNameBoxEvent && antiNameBoxEvent.run) {
              console.log("Antinamebox: Detected thread name change event");
              await antiNameBoxEvent.run({ event, api, Threads });
            }
          } catch (err) {
            console.error("Error handling antinamebox event:", err);
          }
        }
        
        if (global.config.notiGroup) {
          var msg = "";
          msg += event.logMessageBody;
          if (event.author == api.getCurrentUserID()) {
            msg = msg.replace("Bạn", global.config.BOTNAME);
          }
          return api.sendMessage(
            {
              body: `${msg}`,
            },
            event.threadID,
          );
        }
        break;
      case "message_reaction":
        var { iconUnsend } = global.config;
        if (
          iconUnsend.status &&
          event.senderID == api.getCurrentUserID() &&
          event.reaction == iconUnsend.icon
        ) {
          api.unsendMessage(event.messageID);
        }
        handleReaction({ event });
        break;
      default:
        break;
    }
  };
};