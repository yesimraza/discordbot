const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "alexa",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raza",
  description: "Chat with Alexa AI (Voice output)",
  commandCategory: "AI",
  usages: "alexa [message] or alexa on/off",
  cooldowns: 2
};

const alexaStatus = new Map();

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const content = args.join(" ");

  if (content.toLowerCase() === "on") {
    alexaStatus.set(threadID, true);
    return api.sendMessage("✅ Alexa AI is now ON in this group.", threadID, messageID);
  }
  if (content.toLowerCase() === "off") {
    alexaStatus.set(threadID, false);
    return api.sendMessage("❌ Alexa AI is now OFF in this group.", threadID, messageID);
  }

  if (!content) return api.sendMessage("❓ Please say something to Alexa.", threadID, messageID);

  return chatWithAlexa(api, event, content);
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, type, messageReply } = event;
  if (!body) return;

  const isEnabled = alexaStatus.get(threadID) || false;
  const botID = api.getCurrentUserID();

  if (isEnabled) {
    if (body.toLowerCase().startsWith("alexa ") || (type === "message_reply" && messageReply.senderID === botID)) {
      const query = body.toLowerCase().startsWith("alexa ") ? body.slice(6) : body;
      return chatWithAlexa(api, event, query);
    }
  }
};

async function chatWithAlexa(api, event, query) {
  const { threadID, messageID } = event;
  const systemPrompt = "Tumhara naam Alexa hai. Tum Karachi, Pakistan se ho. Tum ek Muslim ladki ho. Tum hamesha Roman Urdu mein baat karti ho. Tum Karachi ki slang thodi si use karti ho. Tumhare jawab hamesha short aur crispy hote hain. Kabhi lambay jawab mat dena.";
  
  try {
    // Check if API is reachable
    const aiRes = await axios.get(`https://api.kraza.qzz.io/ai/customai?q=${encodeURIComponent(query)}&systemPrompt=${encodeURIComponent(systemPrompt)}`, { timeout: 15000 });
    
    if (aiRes.data.status && aiRes.data.response) {
      const aiText = aiRes.data.response;
      
      // Convert text to speech
      const ttsRes = await axios.get(`https://api.kraza.qzz.io/tools/text-to-speech?text=${encodeURIComponent(aiText)}`, { timeout: 15000 });
      
      if (ttsRes.data.status && ttsRes.data.result) {
        // Find a female voice (Ana or Nahida)
        const voice = ttsRes.data.result.find(v => v.voice_name === "Ana(Female)") || ttsRes.data.result.find(v => v.voice_name === "Nahida (Exclusive)") || ttsRes.data.result[1];
        const audioUrl = voice.ana || voice.nahida || Object.values(voice).find(val => typeof val === 'string' && val.startsWith('http'));

        if (audioUrl) {
          const cacheDir = path.join(__dirname, "cache");
          if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
          const fileName = `alexa_${Date.now()}.mp3`;
          const audioPath = path.join(cacheDir, fileName);
          
          const audioDownload = await axios.get(audioUrl, { responseType: 'arraybuffer' });
          await fs.writeFile(audioPath, Buffer.from(audioDownload.data));
          
          // Verify file and extension before sending
          if (fs.existsSync(audioPath)) {
            return api.sendMessage({
              body: aiText,
              attachment: fs.createReadStream(audioPath)
            }, threadID, (err) => {
              if (err) console.error("Error sending Alexa voice:", err);
              setTimeout(() => {
                if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
              }, 5000);
            }, messageID);
          }
        }
      }
      
      return api.sendMessage(aiText, threadID, messageID);
    }
  } catch (error) {
    console.error("Alexa AI Error:", error.message);
    if (error.code === 'EAI_AGAIN') {
       return api.sendMessage("⚠️ API Server is temporarily unavailable. Please try again in a few seconds.", threadID, messageID);
    }
  }
}
