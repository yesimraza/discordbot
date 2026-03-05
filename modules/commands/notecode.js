module.exports.config = {
  name: "notecode",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Apply code from buildtooldev, pastebin and github",
  commandCategory: "Admin",
  usages: "Members are not allowed to use this command",
  cooldowns: 0,
  dependencies: {
    "pastebin-api": "",
    cheerio: "",
    request: "",
  },
};

module.exports.run = async function ({ api, event, args }) {
  const moment = require("moment-timezone");
  var gio = moment.tz("Asia/Karachi").format("HH:mm:ss || D/MM/YYYY");
  const lon = process.uptime();
  var hieu = Math.floor(lon / (60 * 60));
  var simp = Math.floor((lon % (60 * 60)) / 60);
  var rin = Math.floor(lon % 60);

  const permission = ["100001854531633"];
  if (!permission.includes(event.senderID))
    api.sendMessage(
      "⚝──⭒─⭑─⭒──⚝\n\n𝗥𝗲𝗽𝗼𝗿𝘁𝗲𝗱 𝘁𝗼 𝗔𝗱𝗺𝗶𝗻 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗳𝗼𝗿𝗯𝗶𝗱𝗱𝗲𝗻 𝗰𝗼𝗺𝗺𝗮𝗻𝗱\n\n⚝──⭒─⭑─⭒──⚝",
      event.threadID,
      event.messageID,
    );

  var idad = "100001854531633";
  const permissions = ["100001854531633"];
  var name = global.data.userName.get(event.senderID);
  var threadInfo = await api.getThreadInfo(event.threadID);
  var nameBox = threadInfo.threadName;
  var time = require("moment-timezone")
    .tz("Asia/Karachi")
    .format("HH:mm:ss (D/MM/YYYY) (dddd)");

  if (!permissions.includes(event.senderID))
    return api.sendMessage(
      `≿━━━━༺❀༻━━━━≾\n\n𝗕𝗼𝘅: ${nameBox}\n𝗨𝘀𝗲𝗿: ${name}\n𝗖𝗼𝗺𝗺𝗮𝗻𝗱: ${this.config.name}\n𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://www.facebook.com/profile.php?id=${event.senderID}\n𝗧𝗶𝗺𝗲: ${time}\n\n≿━━━━༺❀༻━━━━≾`,
      idad,
    );

  const axios = require("axios");
  const fs = require("fs");
  const request = require("request");
  const cheerio = require("cheerio");
  const { join, resolve } = require("path");
  const { senderID, threadID, messageID, messageReply, type } = event;
  var name = args[0];
  if (type == "message_reply") {
    var text = messageReply.body;
  }
  if (!text && !name)
    return api.sendMessage(
      {
        body: `༻﹡﹡﹡﹡﹡﹡﹡༺

𝗠𝗘𝗡𝗨

→ 𝟭. 𝗔𝗱𝗰 + 𝗽𝗮𝘀𝘁𝗲𝗯𝗶𝗻 𝗹𝗶𝗻𝗸 𝘁𝗼 𝘂𝗽𝗹𝗼𝗮𝗱 𝗺𝗼𝗱𝘂𝗹𝗲
→ 𝟮. 𝗔𝗱𝗰 + 𝗺𝗼𝗱𝘂𝗹𝗲 𝗻𝗮𝗺𝗲 𝘁𝗼 𝘂𝗽𝗰𝗼𝗱𝗲 𝗼𝗻 𝗽𝗮𝘀𝘁𝗲𝗯𝗶𝗻

𝐁𝐨𝐭 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐨𝐧𝐥𝐢𝐧𝐞 𝐟𝐨𝐫 ${hieu} 𝐡𝐨𝐮𝐫𝐬 ${simp} 𝐦𝐢𝐧𝐮𝐭𝐞𝐬 ${rin} 𝐬𝐞𝐜𝐨𝐧𝐝𝐬
[ ${moment().tz("Asia/Karachi").format("HH:mm:ss || DD/MM/YYYY")} ]

༻﹡﹡﹡﹡﹡﹡﹡༺`,
        attachment: (
          await global.nodemodule["axios"]({
            url: (
              await global.nodemodule["axios"](
                "https://api-images.duytrollgame.repl.co/rin.php",
              )
            ).data.data,
            method: "GET",
            responseType: "stream",
          })
        ).data,
      },
      event.threadID,
      event.messageID,
    );

  if (!text && name) {
    var data = fs.readFile(
      `${__dirname}/${args[0]}.js`,
      "utf-8",
      async (err, data) => {
        if (err)
          return api.sendMessage(
            `≿━━━━༺❀༻━━━━≾\n\n𝗖𝗼𝗺𝗺𝗮𝗻𝗱 ${args[0]} 𝗱𝗼𝗲𝘀 𝗻𝗼𝘁 𝗲𝘅𝗶𝘀𝘁!\n\n≿━━━━༺❀༻━━━━≾`,
            threadID,
            messageID,
          );
        const { PasteClient } = require("pastebin-api");
        const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");
        async function pastepin(name) {
          const url = await client.createPaste({
            code: data,
            expireDate: "N",
            format: "javascript",
            name: name,
            publicity: 1,
          });
          var id = url.split("/")[3];
          return "https://pastebin.com/raw/" + id;
        }
        var link = await pastepin(args[1] || "noname");
        return api.sendMessage(link, threadID, messageID);
      },
    );
    return;
  }

  var urlR =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  var url = text.match(urlR);

  if (
    url[0].indexOf("pastebin") !== -1 ||
    url[0].indexOf("github") !== -1 ||
    url[0].indexOf("phamvandien") !== -1
  ) {
    axios.get(url[0]).then((i) => {
      var data = i.data;
      fs.writeFile(
        `${__dirname}/${args[0]}.js`,
        data,
        "utf-8",
        function (err) {
          if (err)
            return api.sendMessage(
              `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗮𝗽𝗽𝗹𝘆𝗶𝗻𝗴 𝗰𝗼𝗱𝗲 𝘁𝗼 ${args[0]}.𝗷𝘀\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
              threadID,
              messageID,
            );
          api.sendMessage(
            `⚝──⭒─⭑─⭒──⚝\n\n𝗖𝗼𝗱𝗲 𝗮𝗽𝗽𝗹𝗶𝗲𝗱 𝘁𝗼 ${args[0]}.𝗷𝘀, 𝘂𝘀𝗲 "𝗹𝗼𝗮𝗱" 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝘁𝗼 𝗮𝗰𝘁𝗶𝘃𝗮𝘁𝗲\n\n⚝──⭒─⭑─⭒──⚝`,
            threadID,
            messageID,
          );
        },
      );
    });
  }

  if (
    url[0].indexOf("buildtool") !== -1 ||
    url[0].indexOf("tinyurl.com") !== -1
  ) {
    const options = {
      method: "GET",
      url: messageReply.body,
    };
    request(options, function (error, response, body) {
      if (error)
        return api.sendMessage(
          "≿━━━━༺❀༻━━━━≾\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝗼𝗻𝗹𝘆 𝗿𝗲𝗽𝗹𝘆 𝗹𝗶𝗻𝗸 (𝗻𝗼 𝗲𝘅𝘁𝗿𝗮 𝘁𝗲𝘅𝘁)\n\n≿━━━━༺❀༻━━━━≾",
          threadID,
          messageID,
        );
      const load = cheerio.load(body);
      load(".language-js").each((index, el) => {
        if (index !== 0) return;
        var code = el.children[0].data;
        fs.writeFile(
          `${__dirname}/${args[0]}.js`,
          code,
          "utf-8",
          function (err) {
            if (err)
              return api.sendMessage(
                `⚝──⭒─⭑─⭒──⚝\n\n𝗘𝗿𝗿𝗼𝗿 𝗮𝗽𝗽𝗹𝘆𝗶𝗻𝗴 𝗻𝗲𝘄 𝗰𝗼𝗱𝗲 𝘁𝗼 "${args[0]}.𝗷𝘀"\n\n⚝──⭒─⭑─⭒──⚝`,
                threadID,
                messageID,
              );
            return api.sendMessage(
              `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗔𝗱𝗱𝗲𝗱 𝗰𝗼𝗱𝗲 𝘁𝗼 "${args[0]}.𝗷𝘀", 𝘂𝘀𝗲 "𝗹𝗼𝗮𝗱" 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝘁𝗼 𝗮𝗰𝘁𝗶𝘃𝗮𝘁𝗲\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
              threadID,
              messageID,
            );
          },
        );
      });
    });
    return;
  }

  if (url[0].indexOf("drive.google") !== -1) {
    var id = url[0].match(/[-\w]{25,}/);
    const path = resolve(__dirname, `${args[0]}.js`);
    try {
      await utils.downloadFile(
        `https://drive.google.com/u/0/uc?id=${id}&export=download`,
        path,
      );
      return api.sendMessage(
        `⚝──⭒─⭑─⭒──⚝\n\n𝗔𝗱𝗱𝗲𝗱 𝗰𝗼𝗱𝗲 𝘁𝗼 "${args[0]}.𝗷𝘀". 𝗜𝗳 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝘀, 𝗰𝗼𝗻𝘃𝗲𝗿𝘁 𝗗𝗿𝗶𝘃𝗲 𝗳𝗶𝗹𝗲 𝘁𝗼 𝘁𝘅𝘁.\n\n⚝──⭒─⭑─⭒──⚝`,
        threadID,
        messageID,
      );
    } catch (e) {
      return api.sendMessage(
        `≿━━━━༺❀༻━━━━≾\n\n𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝗮𝗽𝗽𝗹𝘆𝗶𝗻𝗴 𝗰𝗼𝗱𝗲 𝘁𝗼 "${args[0]}.𝗷𝘀".\n\n≿━━━━༺❀༻━━━━≾`,
        threadID,
        messageID,
      );
    }
  }
};