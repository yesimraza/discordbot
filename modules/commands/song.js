
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");

module.exports.config = {
  name: "song",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Download song/audio/video from YouTube",
  commandCategory: "media",
  usages: ".song despacito [optional: video]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");
  if (!query) return api.sendMessage("❌ Please provide a song name.", threadID, messageID);

  const wantVideo = query.toLowerCase().endsWith(" video");
  const searchTerm = wantVideo ? query.replace(/ video$/i, "").trim() : query.trim();
  const format = wantVideo ? "video" : "audio";
  const frames = [
    "🩵▰▱▱▱▱▱▱▱▱▱ 10%",
    "💙▰▰▱▱▱▱▱▱▱▱ 25%",
    "💜▰▰▰▰▱▱▱▱▱▱ 45%",
    "💖▰▰▰▰▰▰▱▱▱▱ 70%",
    "💗▰▰▰▰▰▰▰▰▰▰ 100% 😍"
  ];

  const loadingMsg = await api.sendMessage(`🔍 Searching for **${searchTerm}**...\n${frames[0]}`, threadID);

  try {
    // Search using yt-search
    const searchResults = await yts(searchTerm);
    const videos = searchResults.videos;

    if (!videos || videos.length === 0) {
      api.unsendMessage(loadingMsg.messageID);
      return api.sendMessage("❌ No results found.", threadID, messageID);
    }

    const first = videos[0];
    const title = first.title;
    const videoUrl = first.url;
    const thumbnail = first.thumbnail;
    const author = first.author.name;

    await api.editMessage(`🎬 Found: ${title}\n\n${frames[1]}`, loadingMsg.messageID, threadID);

    await api.editMessage(`📥 Downloading ${format}...\n\n${frames[2]}`, loadingMsg.messageID, threadID);

    // Fetch download URL using new API
    let fetchRes;
    try {
      const apiUrl = `https://api.kraza.qzz.io/download/ytdl?url=${encodeURIComponent(videoUrl)}`;
      
      fetchRes = await axios.get(apiUrl, {
        headers: {
          'Accept': 'application/json'
        },
        timeout: 60000
      });
    } catch (fetchError) {
      api.unsendMessage(loadingMsg.messageID);
      return api.sendMessage(`❌ Failed to fetch download link: ${fetchError.message}`, threadID, messageID);
    }

    if (!fetchRes.data.status || !fetchRes.data.result) {
      api.unsendMessage(loadingMsg.messageID);
      return api.sendMessage("❌ Failed to get download URL", threadID, messageID);
    }

    const downloadUrl = wantVideo ? fetchRes.data.result.mp4 : fetchRes.data.result.mp3;
    if (!downloadUrl) {
      api.unsendMessage(loadingMsg.messageID);
      return api.sendMessage(`❌ Failed to get ${format} download URL`, threadID, messageID);
    }

    await api.editMessage(`🎵 Processing...\n\n${frames[3]}`, loadingMsg.messageID, threadID);

    // Download the file
    let downloadRes;
    try {
      downloadRes = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
        timeout: 180000
      });
    } catch (downloadError) {
      api.unsendMessage(loadingMsg.messageID);
      return api.sendMessage(`❌ Download failed: ${downloadError.message}\n\nPlease try again later.`, threadID, messageID);
    }

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const tempPath = path.join(cacheDir, `${Date.now()}_temp.${wantVideo ? "mp4" : "mpeg"}`);
    const filePath = path.join(cacheDir, `${Date.now()}.${wantVideo ? "mp4" : "mp3"}`);
    fs.writeFileSync(tempPath, downloadRes.data);
    fs.renameSync(tempPath, filePath);

    setTimeout(() => {
      api.editMessage(`${frames[4]}\n✅ Complete! Sending file...`, loadingMsg.messageID, threadID);
    }, 500);

    await api.sendMessage({
      body: `🎶 ${title}\n📺 ${author}\n🔗 ${videoUrl}`,
      attachment: fs.createReadStream(filePath)
    }, threadID);

    setTimeout(async () => {
      try {
        await fs.unlink(filePath);
        api.unsendMessage(loadingMsg.messageID);
      } catch (err) {
        console.log("Cleanup error:", err);
      }
    }, 10000);

  } catch (err) {
    console.error("SONG CMD ERR:", err.message);
    api.unsendMessage(loadingMsg.messageID);
    api.sendMessage(`❌ Error: ${err.message}`, threadID, messageID);
  }
};
