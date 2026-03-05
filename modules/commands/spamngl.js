const axios = require('axios');

module.exports.config = {
  name: "spamngl",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Send anonymous messages to NGL users",
  usePrefix: true,
  commandCategory: "Members",
  usages: "username | message | times",
};

module.exports.run = async ({ api, event, args }) => {
  const input = args.join(' ');
  const inputParts = input.split('|').map(part => part.trim());

  if (inputParts.length !== 3) {
    return api.sendMessage("⚠️ Usage: username | message | times", event.threadID);
  }

  const nglusername = inputParts[0];
  const message = inputParts[1];
  const amount = parseInt(inputParts[2]);

  if (!nglusername || !message || isNaN(amount)) {
    return api.sendMessage("⚠️ Usage: username | message | times", event.threadID);
  }

  try {
    const headers = {
      'referer': `https://ngl.link/${nglusername}`,
      'accept-language': 'en-US,en;q=0.9',
    };

    const data = {
      'username': nglusername,
      'question': message,
      'deviceId': 'ea356443-ab18-4a49-b590-bd8f96b994ee',
      'gameSlug': '',
      'referrer': '',
    };

    let successCount = 0;
    for (let i = 0; i < amount; i++) {
      const response = await axios.post('https://ngl.link/api/submit', data, {
        headers,
      });

      if (response.status === 200) {
        successCount += 1;
      }
    }

    const formattedMessage = `
⚝──⭒─⭑─⭒──⚝

✅ Successfully sent ${amount} times to ${nglusername}  
📩 Message: ${message}

⚝──⭒─⭑─⭒──⚝
    `;
    api.sendMessage(formattedMessage, event.threadID);
  } catch (error) {
    console.error(error);
    api.sendMessage(`⚠️ An error occurred while sending the message: ${error.message}`, event.threadID);
  }
};