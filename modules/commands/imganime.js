const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');

module.exports.config = {
    name: "imganime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Convert image into anime style",
    commandCategory: "Utility",
    usages: "[Reply to an image]",
    cooldowns: 5,
};

let streamURL = (url, ext = 'jpg') => require('axios').get(url, {
    responseType: 'stream',
}).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);

async function processDiffusecraftImage(imageFilePath) {
    function generateSessionHash() {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return Array(11).fill().map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    }

    const sessionHash = generateSessionHash();

    try {
        const uploadForm = new FormData();
        uploadForm.append('files', await fs.readFile(imageFilePath), {
            filename: 'image.jpg',
            contentType: 'image/jpeg',
        });

        const uploadHeaders = {
            ...uploadForm.getHeaders(),
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Origin': 'https://taoanhdep.com',
            'Sec-Ch-Ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
            'Sec-Ch-Ua-Mobile': '?1',
            'Sec-Ch-Ua-Platform': '"Android"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0'
        };

        const uploadResponse = await axios.post('https://tuan2308-diffusecraft.hf.space/upload', uploadForm, { headers: uploadHeaders });
        const uploadedImageUrl = uploadResponse.data[0];

        const optionsHeaders = {
            'Accept': '*/*',
            'Access-Control-Request-Headers': 'content-type',
            'Access-Control-Request-Method': 'POST',
            'Origin': 'https://taoanhdep.com',
            'User-Agent': 'Mozilla/5.0'
        };

        await axios({
            method: 'OPTIONS',
            url: 'https://tuan2308-diffusecraft.hf.space/queue/join?__theme=light',
            headers: optionsHeaders
        });
        const processHeaders = {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Origin': 'https://taoanhdep.com',
            'User-Agent': 'Mozilla/5.0'
        };

        const processPayload = {
            "data": [
                "anime",
                "nsfw, strange color, blurred , ugly...",
                1, 28, 7.5, true, -1, "loras/3DMM_V12.safetensors", 0.5, null, 0.33, null, 0.33, null, 0.33, null, 0.33, "Euler a", 1024, 1024, "eienmojiki/Anything-XL", null, "img2img",
                {
                    "path": uploadedImageUrl,
                    "url": uploadedImageUrl,
                    "orig_name": "uploaded_image.jpg",
                    "size": 186332,
                    "mime_type": "image/jpeg",
                    "meta": {"_type": "gradio.FileData"}
                },
                "Canny", 512, 1024, [], null, null, 0.59, 100, 200, 0.1, 0.1, 1, 0, 1, false, "Compel", null, 1.4, 100, 10, 30, 0.55, "Use same sampler", "", "", false, true, 1, true, false, true, true, false, "./images", false, false, false, true, 1, 0.55, false, true, false, true, false, "Use same sampler", false, "", "", 0.35, true, true, false, 4, 4, 32, false, "", "", 0.35, true, true, false, 4, 4, 32, false, null, null, "plus_face", "original", 0.7, null, null, "base", "style", 0.7
            ],
            "event_data": null,
            "fn_index": 11,
            "trigger_id": 14,
            "session_hash": sessionHash
        };

        await axios.post('https://tuan2308-diffusecraft.hf.space/queue/join?__theme=light', processPayload, { headers: processHeaders });
        const streamHeaders = {
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Origin': 'https://taoanhdep.com',
            'User-Agent': 'Mozilla/5.0'
        };

        const streamResponse = await axios.get(`https://tuan2308-diffusecraft.hf.space/queue/data?session_hash=${sessionHash}`, {
            headers: streamHeaders,
            responseType: 'stream'
        });

        return new Promise((resolve, reject) => {
            let data = '';
            let resultInfo = {
                processedImageUrl: null,
                seeds: null
            };

            streamResponse.data.on('data', (chunk) => {
                data += chunk.toString();
                const lines = chunk.toString().split('\n');
                lines.forEach(line => {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonData = JSON.parse(line.slice(6));
                            if (jsonData.msg === 'process_completed') {
                                resultInfo.processedImageUrl = jsonData.output.data[0][0].image.url;
                                const seedsMatch = jsonData.output.data[1].match(/Seeds: \[(.*?)\]/);
                                if (seedsMatch) {
                                    resultInfo.seeds = seedsMatch[1].split(',').map(Number);
                                }
                            }
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    }
                });

                if (data.includes('"msg":"process_completed"')) {
                    resolve(resultInfo);
                }
            });

            streamResponse.data.on('end', () => {
                resolve(resultInfo);
            });

            streamResponse.data.on('error', (error) => {
                reject(error);
            });
        });

    } catch (error) {
        throw error;
    }
}

module.exports.run = async function ({ api, event }) {
    const messageID = event.messageID;
    const threadID = event.threadID;
    if (event.type !== "message_reply" || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝘁𝗼 𝗰𝗼𝗻𝘃𝗲𝗿𝘁 𝗶𝗻𝘁𝗼 𝗮𝗻𝗶𝗺𝗲\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", threadID, messageID);
    }

    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "photo") {
        return api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 (𝗻𝗼𝘁 𝘃𝗶𝗱𝗲𝗼 𝗼𝗿 𝗼𝘁𝗵𝗲𝗿 𝗳𝗶𝗹𝗲𝘀)\n\n⚝──⭒─⭑─⭒──⚝", threadID, messageID);
    }

    const tempDir = path.join(__dirname, 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    const tempInputPath = path.join(tempDir, `input_${Date.now()}.jpg`);

    try {
        const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
        await fs.writeFile(tempInputPath, response.data);

        api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...\n\n≿━━━━༺❀༻━━━━≾", threadID, messageID);
        const result = await processDiffusecraftImage(tempInputPath);

        if (!result.processedImageUrl) {
            throw new Error("Unable to process image");
        }
        const processedAttachment = await streamURL(result.processedImageUrl);
        if (!processedAttachment) {
            throw new Error("Unable to load processed image");
        }
        await api.sendMessage(
            {
                body: "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n🖼️ 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘆𝗼𝘂𝗿 𝗮𝗻𝗶𝗺𝗲 𝗶𝗺𝗮𝗴𝗲:\n\n༻﹡﹡﹡﹡﹡﹡﹡༺",
                attachment: processedAttachment
            },
            threadID,
            messageID
        );
        await fs.unlink(tempInputPath);

    } catch (error) {
        api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗶𝗺𝗮𝗴𝗲. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻.\n\n⚝──⭒─⭑─⭒──⚝", threadID, messageID);
    }
};