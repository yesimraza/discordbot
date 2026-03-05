module.exports.config = {
    name: "lockDPEvent",
    eventType: ["log:thread-image", "change_thread_image"],
    version: "1.0.0",
    credits: "Kashif Raza",
    description: "Revert DP change"
};

const fs = require("fs-extra");
const axios = require("axios");
const path = "./modules/commands/cache/data/lockStatus.json";

module.exports.run = async function ({ api, event }) {
    const { threadID, author, type } = event;
    if (author == api.getCurrentUserID()) return;
    
    if (!fs.existsSync(path)) return;
    const lockStatus = fs.readJsonSync(path);
    const settings = lockStatus[threadID];

    if (settings && settings.dp && (event.logMessageType === "log:thread-image" || type === "change_thread_image" || event.type === "change_thread_image")) {
        console.log(`[ LOCK DP ] Reverting DP change in thread ${threadID}`);
        if (settings.imageSrc) {
            const imagePath = `./modules/commands/cache/data/lock_dp_${threadID}.png`;
            try {
                const response = await axios.get(settings.imageSrc, { responseType: "arraybuffer" });
                fs.writeFileSync(imagePath, Buffer.from(response.data, "utf-8"));
                api.changeGroupImage(fs.createReadStream(imagePath), threadID, (err) => {
                    if (err) console.error(`[ LOCK DP ] Error changing group image:`, err);
                    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
                });
            } catch (e) {
                console.error("[ LOCK DP ] Error reverting DP:", e);
            }
        }
    }
};
