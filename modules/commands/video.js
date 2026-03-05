
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const yts = require('yt-search');

module.exports.config = {
    name: "video",
    version: "3.0.0",
    permission: 0,
    prefix: true,
    premium: false,
    category: "media",
    credits: "Kashif Raza",
    description: "Download video from YouTube",
    commandCategory: "media",
    usages: ".video [video name]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const query = args.join(" ");
    
    if (!query) {
        return api.sendMessage("❌ Please provide a video name", event.threadID, event.messageID);
    }

    const frames = [
        "🩵▰▱▱▱▱▱▱▱▱▱ 10%",
        "💙▰▰▱▱▱▱▱▱▱▱ 25%",
        "💜▰▰▰▰▱▱▱▱▱▱ 45%",
        "💖▰▰▰▰▰▰▱▱▱▱ 70%",
        "💗▰▰▰▰▰▰▰▰▰▰ 100% 😍"
    ];

    const searchMsg = await api.sendMessage(`🔍 Searching...\n\n${frames[0]}`, event.threadID);

    try {
        // Search using yt-search
        const searchResults = await yts(query);
        const videos = searchResults.videos;
        
        if (!videos || videos.length === 0) {
            api.unsendMessage(searchMsg.messageID);
            return api.sendMessage("❌ No results found", event.threadID, event.messageID);
        }

        const firstResult = videos[0];
        const videoUrl = firstResult.url;
        const title = firstResult.title;
        const author = firstResult.author.name;

        await api.editMessage(`🎬 Video found!\n\n${frames[1]}`, searchMsg.messageID, event.threadID);

        await api.editMessage(`🎬 Downloading...\n\n${frames[2]}`, searchMsg.messageID, event.threadID);

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
            api.unsendMessage(searchMsg.messageID);
            return api.sendMessage(`❌ Failed to fetch download link: ${fetchError.message}`, event.threadID, event.messageID);
        }

        if (!fetchRes.data.status || !fetchRes.data.result || !fetchRes.data.result.mp4) {
            api.unsendMessage(searchMsg.messageID);
            return api.sendMessage("❌ Failed to get video download URL", event.threadID, event.messageID);
        }

        const downloadUrl = fetchRes.data.result.mp4;

        await api.editMessage(`🎬 Processing...\n\n${frames[3]}`, searchMsg.messageID, event.threadID);

        // Download the video file
        let videoRes;
        try {
            videoRes = await axios.get(downloadUrl, {
                responseType: 'arraybuffer',
                timeout: 180000
            });
        } catch (downloadError) {
            api.unsendMessage(searchMsg.messageID);
            return api.sendMessage(`❌ Download failed: ${downloadError.message}\n\nPlease try again later.`, event.threadID, event.messageID);
        }

        const cacheDir = path.join(__dirname, "cache");
        await fs.ensureDir(cacheDir);

        const videoPath = path.join(cacheDir, `${Date.now()}_video.mp4`);
        fs.writeFileSync(videoPath, videoRes.data);

        setTimeout(() => {
            api.editMessage(`🎬 Complete!\n\n${frames[4]}`, searchMsg.messageID, event.threadID);
        }, 500);

        await api.sendMessage(
            {
                body: `🎬 ${title}\n📺 ${author}`,
                attachment: fs.createReadStream(videoPath)
            },
            event.threadID
        );

        setTimeout(() => {
            try {
                if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                api.unsendMessage(searchMsg.messageID);
            } catch (err) {
                console.log("Cleanup error:", err);
            }
        }, 10000);

    } catch (error) {
        console.error("Video command error:", error.message);
        api.unsendMessage(searchMsg.messageID);
        return api.sendMessage("❌ An error occurred while processing your request", event.threadID, event.messageID);
    }
};
