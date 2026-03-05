module.exports.config = {
  name: "daily",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Receive 1,000,000 VND daily!",
  commandCategory: "Make Money",
  cooldowns: 5,
  envConfig: {
    cooldownTime: 86400000,
    rewardCoin: 1000000
  }
};

module.exports.languages = {
  "en": {
    "cooldown": "⏳ You already claimed your daily reward.\nPlease try again after: %1 hours %2 minutes %3 seconds!",
    "rewarded": "✅ You received %1 VND! Come back again after 12 hours to claim more."
  }
};

module.exports.run = async ({ event, api, Currencies, getText }) => {
  const { daily } = global.configModule,
    cooldownTime = daily.cooldownTime,
    rewardCoin = daily.rewardCoin;

  var { senderID, threadID } = event;

  let data = (await Currencies.getData(senderID)).data || {};
  if (typeof data !== "undefined" && cooldownTime - (Date.now() - (data.dailyCoolDown || 0)) > 0) {
    var time = cooldownTime - (Date.now() - data.dailyCoolDown),
      seconds = Math.floor((time / 1000) % 60),
      minutes = Math.floor((time / 1000 / 60) % 60),
      hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    return api.sendMessage(getText("cooldown", hours, minutes, (seconds < 10 ? "0" : "") + seconds), threadID);
  }

  else return api.sendMessage(getText("rewarded", rewardCoin), threadID, async () => {
    await Currencies.increaseMoney(senderID, rewardCoin);
    data.dailyCoolDown = Date.now();
    await Currencies.setData(senderID, { data });
    return;
  });
}