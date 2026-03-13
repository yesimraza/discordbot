const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "say",
  version: "1.2",
  hasPermssion: 0,
  credits: "Modified by Kashif Raza",
  description: "Text ko Urdu voice mein convert kare (TTS)",
  commandCategory: "media",
  usages: "say [text] ya kisi message ko reply karke say",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  let text = args.join(" ").trim();

  // Reply kiye message ka text le lo agar args khali hain
  if (!text && messageReply && messageReply.body) {
    text = messageReply.body.trim();
  }

  if (!text) {
    return api.sendMessage(
      "⚠️ Text likho ya kisi message ko reply karke 'say' use karo!\n\nMisal: say Assalam o Alaikum",
      threadID, messageID
    );
  }

  if (text.length > 500) {
    return api.sendMessage("Text zyada lamba hai! Maximum 500 characters allowed.", threadID, messageID);
  }

  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);
  const fileName = `tts_${Date.now()}.mp3`;
  const audioPath = path.join(cacheDir, fileName);

  try {
    // Primary: Google Translate TTS (Urdu)
    const encoded = encodeURIComponent(text);
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ur&q=${encoded}`;

    const res = await axios.get(googleUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });

    fs.writeFileSync(audioPath, Buffer.from(res.data));

  } catch (err) {
    console.log("[TTS] Google failed → fallback", err.message);

    // Fallback: VoiceRSS
    try {
      const encoded = encodeURIComponent(text);
      const key = "30e7c6148e01490c91d5b93e4d39c65b"; // public sample key (limit ho to apna bana lo)
      const vrsUrl = `https://api.voicerss.org/?key=\( {key}&hl=ur-pk&src= \){encoded}&c=MP3`;

      const res = await axios.get(vrsUrl, {
        responseType: 'arraybuffer',
        timeout: 15000
      });

      fs.writeFileSync(audioPath, Buffer.from(res.data));

    } catch (fallbackErr) {
      return api.sendMessage(
        "❌ Voice generate nahi ho payi: " + fallbackErr.message + "\nThodi der baad try karo.",
        threadID, messageID
      );
    }
  }

  // Audio send karo
  try {
    await api.sendMessage({
      body: `🎤 \( {text.substring(0, 120)} \){text.length > 120 ? '...' : ''}`,
      attachment: fs.createReadStream(audioPath)
    }, threadID, () => {
      // File delete after sending
      setTimeout(() => {
        fs.unlink(audioPath, (err) => {
          if (err) console.log("File delete fail:", err);
        });
      }, 10000);
    }, messageID);

  } catch (sendErr) {
    api.sendMessage("Audio send karne mein issue: " + sendErr.message, threadID, messageID);
  }
};
