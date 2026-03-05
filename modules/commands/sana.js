const axios = require("axios");

module.exports.config = {
  name: "sana",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raza",
  description: "Chat with Sana AI (Urdu/Karachi style)",
  commandCategory: "AI",
  usages: "sana [message] or sana on/off",
  cooldowns: 2
};

const sanaStatus = new Map();

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const content = args.join(" ");

  if (content.toLowerCase() === "on") {
    sanaStatus.set(threadID, true);
    return api.sendMessage("✅ Sana AI is now ON in this group.", threadID, messageID);
  }
  if (content.toLowerCase() === "off") {
    sanaStatus.set(threadID, false);
    return api.sendMessage("❌ Sana AI is now OFF in this group.", threadID, messageID);
  }

  if (!content) return api.sendMessage("❓ Please say something to Sana.", threadID, messageID);

  return chatWithSana(api, event, content);
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID, type, messageReply } = event;
  if (!body) return;

  const isEnabled = sanaStatus.get(threadID) || false;
  const botID = api.getCurrentUserID();

  // Trigger if Sana is enabled and message starts with 'sana' or is a reply to the bot
  if (isEnabled) {
    if (body.toLowerCase().startsWith("sana ") || (type === "message_reply" && messageReply.senderID === botID)) {
      const query = body.toLowerCase().startsWith("sana ") ? body.slice(5) : body;
      return chatWithSana(api, event, query);
    }
  }
};

async function chatWithSana(api, event, query) {
  const systemPrompt = "Tumhara naam Sana hai. Tum Karachi, Pakistan se ho. Tum ek Muslim ladki ho. Tum hamesha Roman Urdu mein baat karti ho. Tum Karachi ki slang thodi si use karti ho (jaise 'abey', 'kar rha hai', etc.). Tumhare jawab hamesha short aur crispy hote hain. Kabhi lambay jawab mat dena.";
  
  try {
    const res = await axios.get(`https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(query)}&systemPrompt=${encodeURIComponent(systemPrompt)}`);
    if (res.data.status && res.data.response) {
      return api.sendMessage(res.data.response, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error(error);
  }
}
