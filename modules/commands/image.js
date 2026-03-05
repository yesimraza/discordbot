module.exports.config = {
    name: "image",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Send image by keyword",
    commandCategory: "Media",
    usages: "[keyword]",
    prefix: false,
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const axios = require("axios");
    const fs = require("fs");
    const path = require("path");

    const { threadID, messageID, mentions, type, messageReply } = event;
    const uid =
        type === "message_reply" && messageReply
            ? messageReply.senderID
            : mentions && Object.keys(mentions).length > 0
            ? Object.keys(mentions)[0]
            : event.senderID;

    // API URLs
    const API_URL1 = "https://imgs-api.vercel.app/"; 
    const API_URL2 = "https://api.sumiproject.net/images/"; 
    const API_KEY = "mk001"; 

    // Keywords only for API_URL2
    const api2Keywords = ["anime", "6pack"];

    // Keywords list
    const keywords = {
        "anime": "Anime pictures",
        "6pack": "Six pack pictures",
        "girl": "Beautiful girls",
        "boobs": "Boobs pictures",
        "ass": "Ass pictures",
        "couple": "Couple pictures",
        "japangirl": "Japanese girls",
        "hana": "Hana pictures",
        "ausand": "Ausand pictures",
        "jimmy": "Jimmy pictures",
        "jack": "Jack pictures",
        "khanhuyen": "Khan Huyen pictures",
        "lebong": "Le Bong pictures",
        "linhngocdam": "Linh Ngoc Dam pictures",
        "ngoctrinh": "Ngoc Trinh pictures",
        "naughty": "Naughty pictures",
        "japcosplay": "Japanese cosplay",
        "loli": "Loli pictures",
        "caidloli": "Caid loli pictures",
        "tw": "Chinese girls",
        "nsfw": "NSFW pictures",
        "aqua": "Aqua pictures",
        "chitanda": "Chitanda pictures",
        "kana": "Kana pictures",
        "kurumi": "Kurumi pictures",
        "lucy": "Lucy pictures",
        "mirai": "Mirai pictures",
        "rem": "Rem pictures",
        "sagiri": "Sagiri pictures",
        "umaru": "Umaru pictures",
        "rushia": "Rushia pictures"
    };

    // If no keyword, show menu
    if (!args[0]) {
        let menu = "≿━━━━༺❀༻━━━━≾\n\n";
        menu += "✨ 𝗜𝗠𝗔𝗚𝗘 𝗠𝗘𝗡𝗨 ✨\n";
        menu += "⚝──⭒─⭑─⭒──⚝\n";
        menu += "📜 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗞𝗘𝗬𝗪𝗢𝗥𝗗𝗦 📜\n";
        menu += "━━━━━━━━━━━━━━━━━\n";
        for (const [key, description] of Object.entries(keywords)) {
            menu += `➢ ${key.toUpperCase()}: ${description}\n`;
        }
        menu += "━━━━━━━━━━━━━━━━━\n";
        menu += "📌 𝗨𝗦𝗔𝗚𝗘: /image [𝗸𝗲𝘆𝘄𝗼𝗿𝗱]\n\n";
        menu += "≿━━━━༺❀༻━━━━≾";

        return api.sendMessage(menu, threadID, messageID);
    }

    // Get keyword
    const keyword = args[0];

    // Check valid keyword
    if (!keywords[keyword]) {
        return api.sendMessage(
            "⚝──⭒─⭑─⭒──⚝\n\n❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗸𝗲𝘆𝘄𝗼𝗿𝗱. 𝗨𝘀𝗲 `/image` 𝘁𝗼 𝘀𝗲𝗲 𝘁𝗵𝗲 𝗹𝗶𝘀𝘁!\n\n⚝──⭒─⭑─⭒──⚝",
            threadID,
            messageID
        );
    }

    try {
        // Check cache folder
        const cacheDir = path.resolve(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        // API selection
        const isAPI2 = api2Keywords.includes(keyword);
        const imageURL = isAPI2 ? `${API_URL2}${keyword}` : `${API_URL1}${keyword}?apikey=${API_KEY}`;

        // Fetch image
        const response = await axios.get(imageURL);
        if (!response.data || !response.data.url) {
            return api.sendMessage(
                "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ 𝗡𝗼 𝗶𝗺𝗮𝗴𝗲 𝗳𝗼𝘂𝗻𝗱. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺",
                threadID,
                messageID
            );
        }

        const { url, author } = response.data;
        const ext = path.extname(url);
        const filePath = path.resolve(cacheDir, `${keyword}${ext}`);

        // Download image
        const writer = fs.createWriteStream(filePath);
        const imageStream = await axios({
            url: url,
            method: "GET",
            responseType: "stream"
        });
        imageStream.data.pipe(writer);

        writer.on("finish", () => {
            let messageBody = `≿━━━━༺❀༻━━━━≾\n\n🖼️ 𝗜𝗠𝗔𝗚𝗘 𝗙𝗢𝗥 𝗞𝗘𝗬𝗪𝗢𝗥𝗗: ${keyword.toUpperCase()}\n`;
            if (!isAPI2 && author) messageBody += `📌 𝗔𝘂𝘁𝗵𝗼𝗿: ${author}\n\n`;
            messageBody += "≿━━━━༺❀༻━━━━≾";

            api.sendMessage(
                {
                    body: messageBody,
                    attachment: fs.createReadStream(filePath)
                },
                threadID,
                () => {
                    fs.unlinkSync(filePath);
                },
                messageID
            );
        });

        writer.on("error", (err) => {
            console.error("Error downloading image:", err);
        });

    } catch (error) {
        console.error("Error:", error);
        api.shareContact(
            "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗼𝗿 𝗰𝗼𝗻𝘁𝗮𝗰𝘁 𝗮𝗱𝗺𝗶𝗻!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺",
            `100001854531633`,
            threadID,
            messageID
        );
    }
};