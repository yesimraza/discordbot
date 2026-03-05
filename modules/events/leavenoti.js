module.exports.config = {
    name: "leavenoti",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Notify when bot or user leaves group + shareContact",
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

const checkttPath = __dirname + '/../commands/_checktt/';

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "leaveGif");
    if (existsSync(path)) mkdirSync(path, { recursive: true });

    const path2 = join(__dirname, "cache", "leaveGif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}

module.exports.run = async function ({ api, event, Users, Threads }) {
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
    const { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Karachi").format("hh:mm:ss A - DD/MM/YYYY");
    const hours = moment.tz("Asia/Karachi").format("hh");
    var thu = moment.tz('Asia/Karachi').format('dddd');
    if (thu == 'Sunday') thu = 'Sunday';
    if (thu == 'Monday') thu = 'Monday';
    if (thu == 'Tuesday') thu = 'Tuesday';
    if (thu == 'Wednesday') thu = 'Wednesday';
    if (thu == 'Thursday') thu = 'Thursday';
    if (thu == 'Friday') thu = 'Friday';
    if (thu == 'Saturday') thu = 'Saturday';
    const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
    const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
    const uid = (event.logMessageData.leftParticipantFbId);
    const type = (event.author == event.logMessageData.leftParticipantFbId) ? "𝗟𝗲𝗳𝘁 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽 𝘃𝗼𝗹𝘂𝗻𝘁𝗮𝗿𝗶𝗹𝘆." : "𝗪𝗮𝘀 𝗿𝗲𝗺𝗼𝘃𝗲𝗱 𝗳𝗿𝗼𝗺 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽 𝗯𝘆 𝗮𝗻 𝗔𝗱𝗺𝗶𝗻𝗶𝘀𝘁𝗿𝗮𝘁𝗼𝗿.";
    const path = join(__dirname, "cache", "leaveGif");
    const gifPath = join(path, `bye.gif`);
    var msg, formPush;

    if (existsSync(checkttPath + threadID + '.json')) {
        const threadData = JSON.parse(readFileSync(checkttPath + threadID + '.json'));
        const userData_week_index = threadData.week.findIndex(e => e.id == event.logMessageData.leftParticipantFbId);
        const userData_day_index = threadData.day.findIndex(e => e.id == event.logMessageData.leftParticipantFbId);
        const userData_total_index = threadData.total.findIndex(e => e.id == event.logMessageData.leftParticipantFbId);
        if (userData_total_index != -1) {
            threadData.total.splice(userData_total_index, 1);
        }
        if (userData_week_index != -1) {
            threadData.week.splice(userData_week_index, 1);
        }
        if (userData_day_index != -1) {
            threadData.day.splice(userData_day_index, 1);
        }

        writeFileSync(checkttPath + threadID + '.json', JSON.stringify(threadData, null, 4));
    }
    if (existsSync(path)) mkdirSync(path, { recursive: true });

    const sadPoetry = [
        "Jane wale ko kaun rok sakta hai,\nBas dil hi hai jo thora ro sakta hai. 💔",
        "Kuch log ate hain chale jane ke liye,\nEk yaad chor jate hain rulane ke liye. 🥀",
        "Safar-e-zindagi mein hum-safar chut jate hain,\nDil ke rishte kabhi kabhi toot jate hain. 🕯️",
        "Laut kar ab wo purane din nahi ayenge,\nAap ki kami hum hamesha mehsoos karenge. 📉",
        "Wida kehne ka waqt bhi ajib hota hai,\nInsan kitna hi kyu na ho wo karib hota hai. 🌧️",
        "Jane ka faisla toh aap ka tha,\nMagar ye dil ab bhi aapka tha. 🖤"
    ];
    const randomSadPoetry = sadPoetry[Math.floor(Math.random() * sadPoetry.length)];

    (typeof data.customLeave == "undefined") 
        ? msg = "‎━━━━━━━━━━━━━━━━━━━━━━━━━\n       🥀 𝗠𝗘𝗠𝗕𝗘𝗥 𝗟𝗘𝗙𝗧 𝗚𝗥𝗢𝗨𝗣 🥀\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📜 *{poetry}*\n\n👤 **Member:** {name}\n📌 **Reason:** {type}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n📆 **Left on:** {thu}\n⏰ **Time:** {time}\n━━━━━━━━━━━━━━━━━━━━━━━━━" 
        : msg = data.customLeave;

    msg = msg.replace(/\{poetry}/g, randomSadPoetry).replace(/\{name}/g, name).replace(/\{type}/g, type).replace(/\{time}/g, time).replace(/\{uid}/g, uid).replace(/\{thu}/g, thu);
    
    const allGif = readdirSync(path);
    if (allGif.length > 0) {
        const randomGif = allGif[Math.floor(Math.random() * allGif.length)];
        return api.sendMessage({ body: msg, attachment: createReadStream(join(path, randomGif)) }, threadID);
    }
    return api.sendMessage(msg, threadID);
}