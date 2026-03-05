const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "suno",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Raza Engineering",
  description: "Generate AI Song from Lyrics using Suno AI with API Rotation",
  commandCategory: "AI Music",
  usages: "suno [prompt] | [style] | [title]",
  cooldowns: 20
};

const API_KEYS = [
  'Koja-64118e456c1d20ec4b75a9914ec70f6a',
  'Koja-3ce2fd6170ea41e13acf3e7e347a5719',
  'Koja-096a3b8e8046783b1b59643a548ae35d',
  'Koja-3b4890c331f417fa032e5cb742536388',
  'Koja-d9f9832a9b1807464b1c29aa85d33884',
  'Koja-bb2fc781169ad50d3280bf439172a791',
  'Koja-de9c2119108b41d707c5373d17743775',
  'Koja-9a6e21a46b350a2db52e6153f949c5d3',
  'Koja-ef5212fc41c708ef3f9ff64c59c64a15',
  'Koja-efa906b944d62eff99ac2865b99d852c',
  'Koja-16ce4852551ef858de2e5ae9892d7740',
  'Koja-f3d5f82f027dddb837f6a3af343eb732',
  'Koja-a66bb0884f9877fd0fffec8774d40c05'
];

const BASE_URL = 'https://kojaxd-api.vercel.app/ai/sunoai';

async function createTask(prompt, style, title, apiKey) {
  const url = `${BASE_URL}?apikey=${apiKey}&action=create&prompt=${encodeURIComponent(prompt)}&style=${encodeURIComponent(style)}&title=${encodeURIComponent(title)}`;
  const response = await axios.get(url);
  if (response.data.status) {
    return response.data.task_id;
  }
  throw new Error(response.data.message || 'Failed to create task');
}

async function checkTaskStatus(taskId, apiKey) {
  const url = `${BASE_URL}?apikey=${apiKey}&action=status&task_id=${taskId}`;
  const response = await axios.get(url);
  if (response.data.status) {
    return response.data.result;
  }
  throw new Error('Failed to get task status');
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const content = args.join(" ").split("|");
  
  const prompt = content[0]?.trim();
  const style = content[1]?.trim() || "Rock";
  const title = content[2]?.trim() || "Untitled Song";

  if (!prompt) {
    return api.sendMessage("❌ Lyrics or Prompt is required!\nUsage: suno [lyrics] | [style] | [title]", threadID, messageID);
  }

  const apiKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
  
  try {
    api.sendMessage("🎼 Your AI masterpiece is being generated...\nPlease wait about 30-60 seconds. 🎧", threadID, messageID);

    const taskId = await createTask(prompt, style, title, apiKey);
    let audioUrl = null;
    let attempts = 0;
    const maxAttempts = 12; // 2 minutes max

    while (!audioUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      attempts++;
      
      const result = await checkTaskStatus(taskId, apiKey);
      if (result && Array.isArray(result) && result.length > 0) {
         const data = result[0].data?.data?.[0] || result[0];
         if (data && data.audioUrl) {
            audioUrl = data.audioUrl;
         }
      } else if (result && typeof result === 'object') {
         // Handle case where result is not an array but an object directly
         const data = result.data?.data?.[0] || result;
         if (data && data.audioUrl) {
            audioUrl = data.audioUrl;
         }
      }
    }

    if (!audioUrl) {
      return api.sendMessage("❌ Timeout: Generation took too long or failed. Try again.", threadID, messageID);
    }

    const filePath = path.join(__dirname, "cache", `suno_${Date.now()}.mp3`);
    const response = await axios({
      method: 'get',
      url: audioUrl,
      responseType: 'arraybuffer'
    });

    await fs.writeFile(filePath, Buffer.from(response.data));

    return api.sendMessage({
      body: `🎶 *Suno AI Generated Song*\n━━━━━━━━━━━━━━━━━━━━━\n📝 **Lyrics/Prompt:** ${prompt}\n🎭 **Style:** ${style}\n🏷️ **Title:** ${title}\n━━━━━━━━━━━━━━━━━━━━━`,
      attachment: fs.createReadStream(filePath)
    }, threadID, () => fs.unlinkSync(filePath), messageID);

  } catch (error) {
    console.error("Suno Command Error:", error);
    api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
  }
};