const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autodownloader",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Raza",
  description: "Auto download videos from links",
  commandCategory: "Events",
  usages: "send a link",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const capcutRegex = /https?:\/\/(www\.)?capcut\.com\/template-detail\/\d+/;
  const fbRegex = /https?:\/\/(www\.)?(facebook\.com|fb\.watch|facebook\.com\/reel)\//;
  const instaRegex = /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv|stories)\//;
  const pinRegex = /https?:\/\/(pin\.it\/|www\.pinterest\.com\/pin\/)/;
  const tiktokRegex = /https?:\/\/(vm\.tiktok\.com\/|www\.tiktok\.com\/|vt\.tiktok\.com\/)/;
  const ytRegex = /https?:\/\/(youtu\.be\/|www\.youtube\.com\/watch\?v=|www\.youtube\.com\/shorts\/)/;

  let apiUrl = "";
  let downloadFunc = null;

  const urlMatch = body.match(/(https?:\/\/[^\s]+)/);
  if (!urlMatch) return;
  const url = urlMatch[0];

  if (capcutRegex.test(url)) {
    apiUrl = `https://api.kraza.qzz.io/download/capcut?url=${encodeURIComponent(url)}`;
    downloadFunc = async (res) => res.data.status ? res.data.result.videoUrl : null;
  } else if (fbRegex.test(url)) {
    apiUrl = `https://api.kraza.qzz.io/download/facebook?url=${encodeURIComponent(url)}`;
    downloadFunc = async (res) => res.data.status ? (res.data.result.media.video_hd || res.data.result.media.video_sd) : null;
  } else if (instaRegex.test(url)) {
    apiUrl = `https://api.princetechn.com/api/download/instadl?apikey=prince&url=${encodeURIComponent(url)}`;
    downloadFunc = async (res) => res.data.success ? res.data.result.download_url : null;
  } else if (pinRegex.test(url)) {
    apiUrl = `https://api.princetechn.com/api/download/pinterestdl?apikey=prince&url=${encodeURIComponent(url)}`;
    downloadFunc = async (res) => {
        if (!res.data.success) return null;
        const media = res.data.result.media;
        const video = media.find(m => m.format === "MP4" && m.type.includes("720p")) || media.find(m => m.format === "MP4");
        return video ? video.download_url : null;
    };
  } else if (tiktokRegex.test(url)) {
    apiUrl = `https://api.kraza.qzz.io/download/tiktok?url=${encodeURIComponent(url)}`;
    downloadFunc = async (res) => res.data.status ? res.data.result.video_nowm : null;
  } else if (ytRegex.test(url)) {
    apiUrl = `https://api.kraza.qzz.io/download/ytdl?url=${encodeURIComponent(url)}`;
    downloadFunc = async (res) => res.data.status ? res.data.result.mp4 : null;
  }

  if (apiUrl && downloadFunc) {
    try {
      const res = await axios.get(apiUrl);
      const downloadUrl = await downloadFunc(res);
      if (downloadUrl) {
        api.sendMessage("📥 Auto-downloading video... please wait.", threadID, messageID);
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
        const outputPath = path.join(cacheDir, `auto_${Date.now()}.mp4`);
        const videoRes = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(outputPath, Buffer.from(videoRes.data));
        api.sendMessage({
          attachment: fs.createReadStream(outputPath)
        }, threadID, () => {
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        }, messageID);
      }
    } catch (e) {
      console.error("AutoDownloader Error:", e.message);
    }
  }
};

module.exports.run = async function ({ api, event }) {
    return api.sendMessage("🤖 Auto-Downloader is active. Send a supported link (Tiktok, FB, Insta, Capcut, Pinterest, YT) to download.", event.threadID);
};
