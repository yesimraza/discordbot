
module.exports.config = {
    name: "nano",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Edit images using NanoBanana AI",
    commandCategory: "Media",
    usages: "[prompt] - Reply to an image",
    prefix: false,
    cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
    const axios = require("axios");
    const fs = require("fs");
    const path = require("path");

    const { threadID, messageID, messageReply, type } = event;

    // Check if replying to a message
    if (type !== "message_reply" || !messageReply) {
        return api.sendMessage(
            "⚠️ Please reply to an image with your edit prompt!\n\n📝 Usage: nano [edit prompt]\n\nExample: nano make the cat blue and add sunglasses",
            threadID,
            messageID
        );
    }

    // Check if the replied message has attachments
    if (!messageReply.attachments || messageReply.attachments.length === 0) {
        return api.sendMessage(
            "❌ The message you replied to doesn't contain any image!\n\nPlease reply to a message with an image.",
            threadID,
            messageID
        );
    }

    // Check if attachment is an image
    const attachment = messageReply.attachments[0];
    if (attachment.type !== "photo") {
        return api.sendMessage(
            "❌ Please reply to an image, not a " + attachment.type + "!",
            threadID,
            messageID
        );
    }

    // Get the prompt
    const prompt = args.join(" ");
    if (!prompt) {
        return api.sendMessage(
            "❌ Please provide an edit prompt!\n\n📝 Usage: nano [edit prompt]\n\nExample: nano make the cat blue and add sunglasses",
            threadID,
            messageID
        );
    }

    const imageUrl = attachment.url;

    // Send processing message
    const processingMsg = await api.sendMessage(
        "🎨 Processing your image edit request...\n⏳ This may take a few moments...",
        threadID
    );

    try {
        // Prepare cache directory
        const cacheDir = path.resolve(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        // Google cookie for the API
        const cookie = "AEC=AVh_V2iyBHpOrwnn7CeXoAiedfWn9aarNoKT20Br2UX9Td9K-RAeS_o7Sg; HSID=Ao0szVfkYnMchTVfk; SSID=AGahZP8H4ni4UpnFV; APISID=SD-Q2DJLGdmZcxlA/AS8N0Gkp_b9sJC84f; SAPISID=9BY2tOwgEz4dK4dY/Acpw5_--fM7PV-aw4; __Secure-1PAPISID=9BY2tOwgEz4dK4dY/Acpw5_--fM7PV-aw4; __Secure-3PAPISID=9BY2tOwgEz4dK4dY/Acpw5_--fM7PV-aw4; SEARCH_SAMESITE=CgQI354B; SID=g.a0002wiVPDeqp9Z41WGZdsMDSNVWFaxa7cmenLYb7jwJzpe0kW3bZzx09pPfc201wUcRVKfh-wACgYKAXUSARMSFQHGX2MiU_dnPuMOs-717cJlLCeWOBoVAUF8yKpYTllPAbVgYQ0Mr_GyeXxV0076; __Secure-1PSID=g.a0002wiVPDeqp9Z41WGZdsMDSNVWFaxa7cmenLYb7jwJzpe0kW3b_Pt9L1eqcIAVeh7ZdRBOXgACgYKAYESARMSFQHGX2MicAK_Acu_-NCkzEz2wjCHmxoVAUF8yKp9xk8gQ82f-Ob76ysTXojB0076; __Secure-3PSID=g.a0002wiVPDeqp9Z41WGZdsMDSNVWFaxa7cmenLYb7jwJzpe0kW3bUudZTunPKtKbLRSoGKl1dAACgYKAYISARMSFQHGX2MimdzCEq63UmiyGU-3eyZx9RoVAUF8yKrc4ycLY7LGaJUyDXk_7u7M0076";
        
        // Build API URL
        const apiUrl = `https://anabot.my.id/api/ai/geminiOption?prompt=${encodeURIComponent(prompt)}&type=NanoBanana&imageUrl=${encodeURIComponent(imageUrl)}&cookie=${encodeURIComponent(cookie)}&apikey=freeApikey`;

        // Make API request
        const response = await axios.get(apiUrl, {
            headers: { 'Accept': 'application/json' }
        });

        // Check if API request was successful
        if (!response.data || !response.data.success) {
            throw new Error("API request failed or returned no data");
        }

        const resultUrl = response.data.data.result.url;
        if (!resultUrl) {
            throw new Error("No edited image URL returned from API");
        }

        // Download the edited image
        const fileName = `nano_${Date.now()}.png`;
        const filePath = path.resolve(cacheDir, fileName);
        
        const imageResponse = await axios({
            url: resultUrl,
            method: "GET",
            responseType: "stream"
        });

        const writer = fs.createWriteStream(filePath);
        imageResponse.data.pipe(writer);

        writer.on("finish", () => {
            // Remove processing message
            api.unsendMessage(processingMsg.messageID);

            // Send the edited image
            api.sendMessage(
                {
                    body: `✨ Image edited successfully!\n\n📝 Prompt: ${prompt}\n\n🎨 Powered by NanoBanana AI`,
                    attachment: fs.createReadStream(filePath)
                },
                threadID,
                () => {
                    // Delete the file after sending
                    fs.unlinkSync(filePath);
                },
                messageID
            );
        });

        writer.on("error", (err) => {
            console.error("Error downloading edited image:", err);
            api.unsendMessage(processingMsg.messageID);
            api.sendMessage(
                "❌ Failed to download the edited image. Please try again.",
                threadID,
                messageID
            );
        });

    } catch (error) {
        console.error("Error in nano command:", error);
        api.unsendMessage(processingMsg.messageID);
        
        let errorMessage = "❌ An error occurred while editing the image.";
        
        if (error.response) {
            errorMessage += `\n\n📌 API Error: ${error.response.status}`;
        } else if (error.message) {
            errorMessage += `\n\n📌 Error: ${error.message}`;
        }
        
        errorMessage += "\n\n💡 Please try again or contact the admin if the issue persists.";
        
        api.sendMessage(errorMessage, threadID, messageID);
    }
};
