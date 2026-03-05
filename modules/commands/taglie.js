module.exports.config = {
    name: "taglie",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Continuously tag the mentioned person for a set number of times.\nAlso known as 'soul summoning'",
    commandCategory: "War",
    usages: "taglientuc @tag [number of times] [delay] or stop all",
    cooldowns: 5,
    timezone: "Asia/Karachi",
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event }) {
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const { mentions, threadID, messageID } = event;
  function reply(body) {
    api.sendMessage(body, threadID, messageID);
  }
  if (!global.client.modulesTaglientuc) global.client.modulesTaglientuc = [];
  const dataTaglientuc = global.client.modulesTaglientuc;
  if (!dataTaglientuc.some(item => item.threadID == threadID)) dataTaglientuc.push({ threadID, targetID: []});
  const thisTaglientuc = dataTaglientuc.find(item => item.threadID == threadID);

  if (args[0] == "stop") {
    if (args[1] == "all") {
      thisTaglientuc.targetID = [];
      return reply("⚝──⭒─⭑─⭒──⚝\n\n✅ Continuous tagging has been stopped for all users.\n\n⚝──⭒─⭑─⭒──⚝");
    } else {
      if (Object.keys(mentions).length == 0) 
        return reply("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ Please tag the user you want to stop tagging.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺");

      let msg = "";
      for (let id in mentions) {
        const userName = mentions[id].replace("@", "");
        if (!thisTaglientuc.targetID.includes(id)) {
          msg += `\n❎ ${userName} is currently not being tagged.`;
        } else {
          thisTaglientuc.targetID.splice(thisTaglientuc.targetID.findIndex(item => item == id, 1));
          msg += `\n✅ Stopped continuous tagging for: ${userName}`;
        }
      }
      return reply(msg);
    }
  } else {
    let solantag = args[args.length - 2];
    let time = args[args.length - 1];

    // Check syntax
    if (Object.keys(mentions) == 0) 
      return reply("≿━━━━༺❀༻━━━━≾\n\n❎ Please tag the user you want to summon.\n\n≿━━━━༺❀༻━━━━≾");
    if (!solantag || !time) 
      return global.utils.throwError(this.config.name, threadID, messageID);
    if (isNaN(solantag)) 
      return reply("❎ Number of tags must be a valid number.");
    if (isNaN(time)) 
      return reply("❎ The delay between tags must be a valid number.");

    time = time * 1000;
    const target = Object.keys(mentions)[0];
    if (thisTaglientuc.targetID.includes(target)) 
      return reply("❎ This user is already being continuously tagged.");

    thisTaglientuc.targetID.push(target);
    reply(`✅ Added ${mentions[target].replace("@", "")} to continuous tagging list.\n🔄 Number of tags: ${solantag}\n⏰ Delay between each tag: ${time / 1000} seconds`);

    const noidungtag = args.slice(0, args.length - 2).join(" ").replace("@", "");
    let i = 0;

    while (true) {
      await delay(time);
      if (i == solantag) {
        thisTaglientuc.targetID.splice(thisTaglientuc.targetID.findIndex(item => item == target, 1));
        break;
      }
      if (!global.client.modulesTaglientuc.find(item => item.threadID == threadID).targetID.includes(target)) break;
      await api.sendMessage({
        body: noidungtag,
        mentions: [{ id: target, tag: noidungtag }]
      }, threadID);
      i++;
    }
  }
};