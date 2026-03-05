module.exports.config = {
    name: "slot",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Betting game using fruit style!",
    commandCategory: "Games",
    usages: "slot [amount of coins to bet]",
    cooldowns: 5,
};

module.exports.languages = {
    "en": {
        "missingInput": "⚠️ The bet amount cannot be empty or negative!",
        "moneyBetNotEnough": "⚠️ Your bet is higher than your current balance!",
        "limitBet": "⚠️ The minimum bet is 500$!",
        "returnWin": "≿━━━━༺❀༻━━━━≾\n\n🎰 %1 | %2 | %3 🎰\n\n𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬! 𝐘𝐨𝐮 𝐰𝐨𝐧: +%4$\n\n≿━━━━༺❀༻━━━━≾",
        "returnLose": "≿━━━━༺❀༻━━━━≾\n\n🎰 %1 | %2 | %3 🎰\n\n𝐒𝐨𝐫𝐫𝐲! 𝐘𝐨𝐮 𝐥𝐨𝐬𝐭: -%4$\n\n≿━━━━༺❀༻━━━━≾"
    }
}

async function getIMG(item1, item2, item3){
  try{
    if(item1 == "🍇") item1 = "https://imgur.com/jWmzlgG.png";
    if(item1 == "🍉") item1 = "https://imgur.com/FmWC4eK.png";
    if(item1 == "🍊") item1 = "https://imgur.com/gaUbeiY.png";
    if(item1 == "🍏") item1 = "https://imgur.com/gyztTV3.png";
    if(item1 == "7⃣") item1 = "https://imgur.com/IqU7tlM.png";
    if(item1 == "🍓") item1 = "https://imgur.com/gQtvMRq.png";
    if(item1 == "🍒") item1 = "https://imgur.com/Q0PZJGq.png";
    if(item1 == "🍌") item1 = "https://imgur.com/kH7VSr3.png";
    if(item1 == "🥝") item1 = "https://imgur.com/1qo4T8o.png";
    if(item1 == "🥑") item1 = "https://imgur.com/HcExpOY.png";
    if(item1 == "🌽") item1 = "https://imgur.com/mjlUTQJ.png";
    
    if(item2 == "🍇") item2 = "https://imgur.com/jWmzlgG.png";
    if(item2 == "🍉") item2 = "https://imgur.com/FmWC4eK.png";
    if(item2 == "🍊") item2 = "https://imgur.com/gaUbeiY.png";
    if(item2 == "🍏") item2 = "https://imgur.com/gyztTV3.png";
    if(item2 == "7⃣") item2 = "https://imgur.com/IqU7tlM.png";
    if(item2 == "🍓") item2 = "https://imgur.com/gQtvMRq.png";
    if(item2 == "🍒") item2 = "https://imgur.com/Q0PZJGq.png";
    if(item2 == "🍌") item2 = "https://imgur.com/kH7VSr3.png";
    if(item2 == "🥝") item2 = "https://imgur.com/1qo4T8o.png";
    if(item2 == "🥑") item2 = "https://imgur.com/HcExpOY.png";
    if(item2 == "🌽") item2 = "https://imgur.com/mjlUTQJ.png";
    
    if(item3 == "🍇") item3 = "https://imgur.com/jWmzlgG.png";
    if(item3 == "🍉") item3 = "https://imgur.com/FmWC4eK.png";
    if(item3 == "🍊") item3 = "https://imgur.com/gaUbeiY.png";
    if(item3 == "🍏") item3 = "https://imgur.com/gyztTV3.png";
    if(item3 == "7⃣") item3 = "https://imgur.com/IqU7tlM.png";
    if(item3 == "🍓") item3 = "https://imgur.com/gQtvMRq.png";
    if(item3 == "🍒") item3 = "https://imgur.com/Q0PZJGq.png";
    if(item3 == "🍌") item3 = "https://imgur.com/kH7VSr3.png";
    if(item3 == "🥝") item3 = "https://imgur.com/1qo4T8o.png";
    if(item3 == "🥑") item3 = "https://imgur.com/HcExpOY.png";
    if(item3 == "🌽") item3 = "https://imgur.com/mjlUTQJ.png";
    
    return [item1, item2, item3];
  }
  catch(e){
    return e;
  }
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID } = event;
    const { getData, increaseMoney, decreaseMoney } = Currencies;
    const slotItems = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
    const moneyUser = (await getData(senderID)).money;
    var img = []
    var moneyBet = parseInt(args[0]);
    
    if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage(getText("missingInput"), threadID, messageID);
	if (moneyBet > moneyUser) return api.sendMessage(getText("moneyBetNotEnough"), threadID, messageID);
	if (moneyBet < 500) return api.sendMessage(getText("limitBet"), threadID, messageID);
    
    var number = [], win = false;
    for (i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);
    var img1 = await getIMG(slotItems[number[0]], slotItems[number[1]], slotItems[number[2]]);
    
    for (i = 0; i < 3; i++) {
      const t = (await require('axios').get(`${img1[i]}`, {
                    responseType: "stream"
                }))
                .data;
            img.push(t)
    }
    
   if(slotItems[number[0]] == "7⃣" && slotItems[number[1]] == "7⃣" && slotItems[number[2]] == "7⃣"){
    moneyBet *= 12;
    win = true;
  }
  else if (slotItems[number[0]] == slotItems[number[1]] && slotItems[number[1]] == slotItems[number[2]]) {
        moneyBet *= 9;
        win = true;
    }
    else if (slotItems[number[0]] == slotItems[number[1]] || slotItems[number[0]] == slotItems[number[2]] || slotItems[number[1]] == slotItems[number[2]]) {
        moneyBet *= 2;
        win = true;
    }

    switch (win) {
        case true: {
          api.sendMessage({
            body: `≿━━━━༺❀༻━━━━≾\n\n🎰 ${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\n𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐬! 𝐘𝐨𝐮 𝐰𝐨𝐧: +${moneyBet}$\n\n≿━━━━༺❀༻━━━━≾`, 
            attachment: img
          }, threadID, messageID)
            await increaseMoney(senderID, moneyBet);
            break;
        }
        case false: {
           api.sendMessage({
            body: `≿━━━━༺❀༻━━━━≾\n\n🎰 ${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\n𝐒𝐨𝐫𝐫𝐲! 𝐘𝐨𝐮 𝐥𝐨𝐬𝐭: -${moneyBet}$\n\n≿━━━━༺❀༻━━━━≾`, 
            attachment: img
          }, threadID, messageID)
            await decreaseMoney(senderID, moneyBet);
            break;
        }
    }
}