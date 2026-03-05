module.exports.config = {
    name: "lockNameEvent",
    eventType: ["log:thread-name"],
    version: "1.0.0",
    credits: "Kashif Raza",
    description: "Revert name change"
};

const fs = require("fs-extra");
const path = "./modules/commands/cache/data/lockStatus.json";

module.exports.run = async function ({ api, event }) {
    const { threadID, logMessageType, author } = event;
    if (author == api.getCurrentUserID()) return;
    if (!fs.existsSync(path)) return;
    const lockStatus = fs.readJsonSync(path);
    const settings = lockStatus[threadID];
    if (settings && settings.name && (logMessageType === "log:thread-name" || event.type === "change_thread_name" || event.logMessageType === "log:thread-name" || event.logMessageType === "change_thread_name")) {
        api.setTitle(settings.nameValue, threadID);
    }
};
