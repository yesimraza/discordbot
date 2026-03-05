const axios = require("axios");

module.exports.config = {
  name: "tempmail",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raza",
  description: "Generate and check temporary emails",
  commandCategory: "Tools",
  usages: "tempmail gen | tempmail inbox [email] | tempmail msg [email] [id]",
  cooldowns: 2
};

const apikey = "prince";

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const type = args[0]?.toLowerCase();

  if (type === "gen" || type === "generate") {
    try {
      const res = await axios.get(`https://api.princetechn.com/api/tempmail/generate?apikey=${apikey}`);
      if (res.data.success) {
        const { email, message } = res.data.result;
        return api.sendMessage(`📧 **Email:** ${email}\n\n📝 ${message}`, threadID, messageID);
      }
    } catch (e) {
      return api.sendMessage("❌ Error generating email.", threadID, messageID);
    }
  }

  if (type === "inbox" || type === "check") {
    const email = args[1];
    if (!email) return api.sendMessage("❓ Please provide an email address.", threadID, messageID);
    try {
      const res = await axios.get(`https://api.princetechn.com/api/tempmail/inbox?apikey=${apikey}&email=${encodeURIComponent(email)}`);
      if (res.data.success) {
        if (typeof res.data.result === 'string' || !res.data.result || res.data.result.length === 0) {
           return api.sendMessage(res.data.message || "📭 Inbox is empty.", threadID, messageID);
        }
        
        for (const m of res.data.result) {
          const msgRes = await axios.get(`https://api.princetechn.com/api/tempmail/message?apikey=${apikey}&email=${encodeURIComponent(email)}&messageid=${m.id}`);
          let body = "No content";
          if (msgRes.data.success && msgRes.data.result && msgRes.data.result.data) {
            body = msgRes.data.result.data.html.replace(/<[^>]*>?/gm, '');
          }
          
          const fullMsg = `📧 **From:** ${m.senderName} (${m.from})\n📝 **Subject:** ${m.subject || "No Subject"}\n\n━━━━━━━━━━━━━━━\n\n${body}`;
          await api.sendMessage(fullMsg, threadID);
        }
        return;
      }
    } catch (e) {
      return api.sendMessage("❌ Error checking inbox.", threadID, messageID);
    }
  }

  if (type === "msg" || type === "message" || type === "read") {
    const email = args[1];
    const msgId = args[2];
    if (!email || !msgId) return api.sendMessage("❓ Usage: .tempmail msg [email] [id]", threadID, messageID);
    try {
      const res = await axios.get(`https://api.princetechn.com/api/tempmail/message?apikey=${apikey}&email=${encodeURIComponent(email)}&messageid=${msgId}`);
      if (res.data.success && res.data.result && res.data.result.data) {
        const body = res.data.result.data.html.replace(/<[^>]*>?/gm, '');
        return api.sendMessage(`📧 **Message Content:**\n\n${body}`, threadID, messageID);
      }
    } catch (e) {
      return api.sendMessage("❌ Error reading message.", threadID, messageID);
    }
  }

  return api.sendMessage("❓ Usage:\n.tempmail gen\n.tempmail inbox [email]\n.tempmail msg [email] [id]", threadID, messageID);
};
