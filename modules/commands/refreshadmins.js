module.exports.config = {
    name: "refreshadmins",
    version: "1.0",
    hasPermssion: 1,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Refresh the list of administrators",
    commandCategory: "Admin",
    usages: "leave blank/threadID",
    cooldowns: 5,
};

module.exports.run = async function ({ event, args, api, Threads }) { 
    const { threadID } = event;
    const targetID = args[0] || event.threadID;
    var threadInfo = await api.getThreadInfo(targetID);
    let threadName = threadInfo.threadName;
    let qtv = threadInfo.adminIDs.length;
    await Threads.setData(targetID , { threadInfo });
    global.data.threadInfo.set(targetID , threadInfo);

    return api.sendMessage(
`≿━━━━༺❀༻━━━━≾

✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐫𝐞𝐟𝐫𝐞𝐬𝐡𝐞𝐝 𝐭𝐡𝐞 𝐚𝐝𝐦𝐢𝐧 𝐥𝐢𝐬𝐭!

👨‍💻 𝐆𝐫𝐨𝐮𝐩: ${threadName}  
🔎 𝐈𝐃: ${targetID}  

📌 𝐔𝐩𝐝𝐚𝐭𝐞𝐝 ${qtv} 𝐠𝐫𝐨𝐮𝐩 𝐚𝐝𝐦𝐢𝐧𝐬 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!

≿━━━━༺❀༻━━━━≾`,
    threadID);
}