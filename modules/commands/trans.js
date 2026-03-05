const langNames = {
  "en": "English",
  "ko": "Korean",
  "de": "German",
  "fr": "French",
  "ja": "Japanese",
  "vi": "Vietnamese"
};

module.exports.config = {
  name: "trans",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Translate text to English, Korean, Japanese, Vietnamese, German, French",
  commandCategory: "Utilities",
  usages: "[en/ko/ja/vi/fr/de] [Text]",
  cooldowns: 5,
  dependencies: {
      "request": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const request = global.nodemodule["request"];
  const supportedLangs = ["en", "ko", "ja", "vi", "fr", "de"];

  if (event.type !== "message_reply") {
      if (args.length < 2) {
          return api.sendMessage(
`≿━━━━༺❀༻━━━━≾

𝗨𝘀𝗮𝗴𝗲: ${global.config.PREFIX}trans [en/ko/ja/vi/fr/de] [Text or Reply a message to translate]

Available Languages:
1. en - English 🇬🇧
2. ko - Korean 🇰🇷
3. ja - Japanese 🇯🇵
4. vi - Vietnamese 🇻🇳
5. de - German 🇩🇪
6. fr - French 🇫🇷

≿━━━━༺❀༻━━━━≾`, event.threadID, event.messageID);
      }
      const lang = args[0];
      const content = args.slice(1).join(" ");

      if (!supportedLangs.includes(lang)) {
          return api.sendMessage(
`⚝──⭒─⭑─⭒──⚝

❌ Language ${lang} is not supported!

⚝──⭒─⭑─⭒──⚝`, event.threadID, event.messageID);
      }

      request.get(encodeURI(`https://api.popcat.xyz/translate?to=${lang}&text=${content}`), (err, response, body) => {
          if (err) {
              return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ An error occurred while translating!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID, event.messageID);
          }

          try {
              const data = JSON.parse(body);
              const translatedText = data.translated || "No translation result found.";
              api.sendMessage(
`≿━━━━༺❀༻━━━━≾

✅ Successfully translated your content into ${langNames[lang]}:
  
${translatedText}

≿━━━━༺❀༻━━━━≾`, event.threadID, event.messageID);
          } catch (error) {
              console.error("❌ Error parsing translation API response:", error);
              api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ An error occurred while processing translation result!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID, event.messageID);
          }
      });
  } else {
      const repliedMessage = event.messageReply.body;
      const lang = args[0];

      if (!supportedLangs.includes(lang)) {
          return api.sendMessage(
`⚝──⭒─⭑─⭒──⚝

❌ Language ${lang} is not supported!

⚝──⭒─⭑─⭒──⚝`, event.threadID, event.messageID);
      }

      request.get(encodeURI(`https://api.popcat.xyz/translate?to=${lang}&text=${repliedMessage}`), (err, response, body) => {
          if (err) {
              return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ An error occurred while translating!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID, event.messageID);
          }

          try {
              const data = JSON.parse(body);
              const translatedText = data.translated || "No translation result found.";
              api.sendMessage(
`≿━━━━༺❀༻━━━━≾

✅ Successfully translated your content into ${langNames[lang]}:
  
${translatedText}

≿━━━━༺❀༻━━━━≾`, event.threadID, event.messageID);
          } catch (error) {
              console.error("❌ Error parsing translation API response:", error);
              api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ An error occurred while processing translation result!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID, event.messageID);
          }
      });
  }
};