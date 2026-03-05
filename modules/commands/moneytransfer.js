module.exports.config = {
    name: "moneytransfer",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Transfer money to another user.",
    commandCategory: "Money",
    usages: "chuyentien [amount] @tag",
    cooldowns: 0
};

module.exports.run = async function({ Currencies, api, event, args, Users }) {
    const { threadID, senderID, mentions, messageID } = event;  
    const mention = Object.keys(mentions)[0];

    if (!mention) 
        return api.sendMessage("❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗮𝗴 𝘁𝗵𝗲 𝘂𝘀𝗲𝗿 𝘆𝗼𝘂 𝘄𝗮𝗻𝘁 𝘁𝗼 𝘀𝗲𝗻𝗱 𝗺𝗼𝗻𝗲𝘆 𝘁𝗼!", threadID, messageID);

    const moneyy = parseInt(args[0]);
    if (isNaN(moneyy) || moneyy <= 0) 
        return api.sendMessage("❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗮𝗺𝗼𝘂𝗻𝘁!", threadID, messageID);

    const balance = (await Currencies.getData(senderID)).money;
    if (moneyy > balance) 
        return api.sendMessage("❌ 𝗬𝗼𝘂𝗿 𝗯𝗮𝗹𝗮𝗻𝗰𝗲 𝗶𝘀 𝗻𝗼𝘁 𝗲𝗻𝗼𝘂𝗴𝗵 𝘁𝗼 𝗰𝗼𝗺𝗽𝗹𝗲𝘁𝗲 𝘁𝗵𝗶𝘀 𝘁𝗿𝗮𝗻𝘀𝗳𝗲𝗿!", threadID, messageID);

    const name = await Users.getNameUser(mention);
    const senderName = await Users.getNameUser(senderID);  

    await Currencies.decreaseMoney(senderID, moneyy);
    await Currencies.increaseMoney(mention, moneyy);  

    return api.sendMessage({
        body: `💸 𝗧𝗿𝗮𝗻𝘀𝗳𝗲𝗿 𝗦𝘂𝗰𝗰𝗲𝘀𝘀!\n\n${senderName} ➝ ${name}\n𝗔𝗺𝗼𝘂𝗻𝘁: ${moneyy}$`,
        mentions: [{
            tag: name,
            id: mention
        }]
    }, threadID, messageID);
};