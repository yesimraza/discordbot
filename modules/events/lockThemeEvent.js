module.exports.config = {
    name: "lockThemeEvent",
    eventType: ["log:thread-color", "change_thread_color", "log:thread-theme-id", "log:thread-theme", "log:thread-theme-color"],
    version: "1.0.3",
    credits: "Kashif Raza",
    description: "Revert theme change"
};

const fs = require("fs-extra");
const path = "./modules/commands/cache/data/lockStatus.json";

module.exports.run = async function ({ api, event }) {
    const { threadID, author, logMessageType, type } = event;
    const botID = api.getCurrentUserID();
    if (String(author) === String(botID)) return;
    
    if (!fs.existsSync(path)) return;
    const lockStatus = fs.readJsonSync(path);
    const settings = lockStatus[threadID];
    
    const themeEvents = ["log:thread-color", "log:thread-theme-id", "log:thread-theme", "log:thread-theme-color", "change_thread_color"];
    
    if (settings && settings.theme === true && (themeEvents.includes(logMessageType) || type === "change_thread_color" || event.type === "change_thread_color")) {
        const savedTheme = settings.themeValue;
        if (savedTheme) {
            console.log(`[ LOCK THEME EVENT ] Reverting theme change in thread ${threadID} to ${savedTheme}`);
            if (typeof api.changeThreadColor === "function") {
                api.changeThreadColor(savedTheme, threadID, (err) => {
                    if (err) console.error(`[ LOCK THEME ] Error:`, err);
                });
            }
        }
    }
};
