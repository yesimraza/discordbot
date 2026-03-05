module.exports.config = {
    name: "autosetname",
    eventType: ["log:subscribe"],
    version: "1.0.3",
    credits: "D-Jukie",
    description: "Automatically set nicknames for new members"
};

module.exports.run = async function ({ api, event, Users }) {
    const { threadID } = event;
    const memJoin = event.logMessageData.addedParticipants;

    const { readFileSync, existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const moment = require('moment-timezone');
    const pathData = join(__dirname, '../commands/cache/data/autosetname.json');

    if (!existsSync(pathData)) {
        writeFileSync(pathData, "[]", "utf-8");
        console.log("✅ Created new autosetname.json file.");
    }

    let dataJson;
    try {
        dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    } catch (error) {
        console.error("Error reading autosetname data:", error);
        return api.sendMessage("⚠️ Unable to read autosetname data!", threadID);
    }

    const thisThread = dataJson.find(item => item.threadID == threadID);
    if (!thisThread || thisThread.nameUser.length === 0) return;

    const setNameTemplate = thisThread.nameUser[0];

    for (const { userFbId: idUser, fullName } of memJoin) {
        const nickname = setNameTemplate
            .replace(/{name}/g, fullName)
            .replace(/{time}/g, moment().tz('Asia/Karachi').format('HH:mm:ss | DD/MM/YYYY'));

        await new Promise(resolve => setTimeout(resolve, 1000));
        api.changeNickname(nickname, threadID, idUser);
    }

    return api.sendMessage("🔄 Automatically setting nicknames for new members...", threadID, event.messageID);
};