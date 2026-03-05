module.exports.config = {
    name: "time",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Check the time of different countries",
    commandCategory: "Search",
    cooldowns: 2,
};
  
module.exports.run = async ({ api, event }) => {
    const moment = require("moment-timezone");
    const day = moment.tz("Asia/Karachi").format("DD/MM/YYYY");
    var thu = moment.tz("Asia/Karachi").format("dddd");

    // Translate weekday to English Bold Unicode
    if (thu == "Sunday") thu = "𝐒𝐮𝐧𝐝𝐚𝐲";
    if (thu == "Monday") thu = "𝐌𝐨𝐧𝐝𝐚𝐲";
    if (thu == "Tuesday") thu = "𝐓𝐮𝐞𝐬𝐝𝐚𝐲";
    if (thu == "Wednesday") thu = "𝐖𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲";
    if (thu == "Thursday") thu = "𝐓𝐡𝐮𝐫𝐬𝐝𝐚𝐲";
    if (thu == "Friday") thu = "𝐅𝐫𝐢𝐝𝐚𝐲";
    if (thu == "Saturday") thu = "𝐒𝐚𝐭𝐮𝐫𝐝𝐚𝐲";

    const gio = moment.tz("Asia/Karachi").format("h:mm:ss - A");
    const gio2 = moment.tz("Europe/London").format("h:mm:ss - A");
    const gio1 = moment.tz("America/Brasilia").format("h:mm:ss - A");
    const gio3 = moment.tz("Asia/Seoul").format("h:mm:ss - A");
    const gio4 = moment.tz("Asia/Tokyo").format("h:mm:ss - A");
    const gio5 = moment.tz("America/New_York").format("h:mm:ss - A");
    const gio6 = moment.tz("Asia/Kuala_Lumpur").format("h:mm:ss - A");
    const gio7 = moment.tz("Europe/Paris").format("h:mm:ss - A");
    const gio8 = moment.tz("Asia/Manila").format("h:mm:ss - A");
    const gio9 = moment.tz("Asia/Bangkok").format("h:mm:ss - A");
    const gio10 = moment.tz("Asia/Kolkata").format("h:mm:ss - A");
    const gio11 = moment.tz("Asia/Hong_Kong").format("h:mm:ss - A");
    const gio12 = moment.tz("America/Mexico_City").format("h:mm:ss - A");

    const message = 
`≿━━━━༺❀༻━━━━≾

📆 𝐃𝐚𝐭𝐞: ${day} (${thu})

🇵🇰 𝐏𝐚𝐤𝐢𝐬𝐭𝐚𝐧: ${gio}
🇻🇳 𝐕𝐢𝐞𝐭𝐧𝐚𝐦: ${moment.tz("Asia/Karachi").format("h:mm:ss - A")}
🇵🇭 𝐏𝐡𝐢𝐥𝐢𝐩𝐩𝐢𝐧𝐞𝐬: ${gio8}
🇬🇧 𝐋𝐨𝐧𝐝𝐨𝐧: ${gio2}
🇺🇸 𝐍𝐞𝐰 𝐘𝐨𝐫𝐤: ${gio5}
🇰🇷 𝐒𝐞𝐨𝐮𝐥: ${gio3}
🇯🇵 𝐓𝐨𝐤𝐲𝐨: ${gio4}
🇧🇷 𝐁𝐫𝐚𝐬𝐢𝐥𝐢𝐚: ${gio1}
🇲🇾 𝐊𝐮𝐚𝐥𝐚 𝐋𝐮𝐦𝐩𝐮𝐫: ${gio6}
🇫🇷 𝐏𝐚𝐫𝐢𝐬: ${gio7}
🇹🇭 𝐓𝐡𝐚𝐢𝐥𝐚𝐧𝐝: ${gio9}
🇮🇳 𝐈𝐧𝐝𝐢𝐚: ${gio10}
🇭🇰 𝐇𝐨𝐧𝐠 𝐊𝐨𝐧𝐠: ${gio11}
🇲🇽 𝐌𝐞𝐱𝐢𝐜𝐨 𝐂𝐢𝐭𝐲: ${gio12}

≿━━━━༺❀༻━━━━≾`;

    api.sendMessage(message, event.threadID);
};