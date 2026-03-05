module.exports.config = {
    name: "setdatabox",
    version: "1.0",
    hasPermssion: 3,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Set new data of groups into database",
    commandCategory: "Admin",
    usages: "setdatabox",
    cooldowns: 5,
    
};

module.exports.run = async function ({ event, args, api, Threads }) { 
    const { threadID } = event;
    const { setData, getData } = Threads;
    var inbox = await api.getThreadList(100, null, ['INBOX']);
    let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
    const lengthGroup = list.length;
    
    for (var groupInfo of list) {
        console.log(`Data updated for group ID: ${groupInfo.threadID}`)
        var threadInfo = await api.getThreadInfo(groupInfo.threadID);
        threadInfo.threadName;
        await Threads.setData(groupInfo.threadID, { threadInfo });
    }
    
    console.log(`Data updated for ${lengthGroup} groups`);
    
    return api.sendMessage(
`≿━━━━༺❀༻━━━━≾

𝐃𝐚𝐭𝐚 𝐮𝐩𝐝𝐚𝐭𝐞𝐝 𝐟𝐨𝐫 ${lengthGroup} 𝐠𝐫𝐨𝐮𝐩𝐬 ✅

≿━━━━༺❀༻━━━━≾`, 
    threadID);
}