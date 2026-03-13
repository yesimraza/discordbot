const axios = require("axios");

module.exports.config = {
  name: "mona",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza - Mona Edition",
  description: "Mona AI - special mode for selected users",
  commandCategory: "AI",
  usages: "mona [message] or mona on/off",
  cooldowns: 2
};

const monaStatus = new Map();

// Ye 3 UIDs special Mona API use karengi (naughty + romantic + pyar wali)
const SPECIAL_UIDS = [
  "61588112703542",
  "61588026682797",
  "61583671234541"
];

const SPECIAL_API_URL = "https://api.kraza.qzz.io/ai/customai";
const DEFAULT_API_URL = "https://apiabuse-kz4b.vercel.app/api/chat";

const SYSTEM_PROMPT = "Tumhara naam Mona hai. Tum thori naughty aur romantic ho, pyar se baat karti ho, sexy style mein. Sirf Roman Urdu + English mix mein baat karo. Tum Karachi se ho aur tumhari age 22 years hai.";

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const content = args.join(" ").trim();

  if (content.toLowerCase() === "on") {
    monaStatus.set(threadID, true);
    return api.sendMessage("✅ Mona aa gayi hai jaan! Ab maza aayega 😘", threadID, messageID);
  }

  if (content.toLowerCase() === "off") {
    monaStatus.set(threadID, false);
    return api.sendMessage("😏 Mona chali gayi... miss me baby", threadID, messageID);
  }

  if (!content) {
    return api.sendMessage(
      SPECIAL_UIDS.includes(senderID)
        ? "Jaan bol na... kya chhupa rahi ho? 😘"
        : "Abey kuch bol na harami... kya dekh raha hai?",
      threadID, messageID
    );
  }

  return chatWithMona(api, event, content);
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body, type, messageReply, senderID } = event;
  if (!body) return;

  const isEnabled = monaStatus.get(threadID) || false;
  const botID = api.getCurrentUserID();

  if (!isEnabled) return;

  const lowerBody = body.toLowerCase().trim();
  if (lowerBody.startsWith("mona ") || (type === "message_reply" && messageReply?.senderID === botID)) {
    const query = lowerBody.startsWith("mona ") ? body.slice(5).trim() : body.trim();
    if (!query) {
      return api.sendMessage(
        SPECIAL_UIDS.includes(senderID)
          ? "Baby kuch to type kar... dil taras raha hai tere message ka 😏❤️"
          : "Kuch bol na madarchod... ya bas dekhega?",
        threadID
      );
    }
    return chatWithMona(api, event, query);
  }
};

async function chatWithMona(api, event, query) {
  const senderID = event.senderID;
  const isSpecialUser = SPECIAL_UIDS.includes(senderID);
  const apiUrl = isSpecialUser ? SPECIAL_API_URL : DEFAULT_API_URL;

  try {
    let response;

    if (isSpecialUser) {
      // Special API (Mona personality wali)
      const fullQuery = `${SYSTEM_PROMPT}\nUser: ${query}`;
      response = await axios.get(apiUrl, {
        params: { q: fullQuery }
      });
      
      const reply = response.data.response || "Baby thodi der... aa rahi hoon 😘";
      return api.sendMessage(reply, event.threadID, event.messageID);
    } 
    else {
      // Default abusive API
      response = await axios.post(apiUrl, {
        message: query,
        isAdmin: false
      });

      const reply = response.data.reply || "Kuch gadbad ho gayi...";
      return api.sendMessage(reply, event.threadID, event.messageID);
    }

  } catch (error) {
    console.error("Mona API error:", error.message);

    const errorMsg = isSpecialUser
      ? "Arre jaan... thodi der lag rahi hai, miss you already 😣❤️"
      : "API down hai behenchod! Teri wajah se sharaminda ho raha 😂";

    return api.sendMessage(errorMsg, event.threadID, event.messageID);
  }
        }
