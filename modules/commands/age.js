module.exports.config = {
  name: "age",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kashif Raza",
  description: "Calculate age based on birth date",
  commandCategory: "Utility",
  usages: "[day/month/year]",
  cooldowns: 0
};

module.exports.run = async function ({ event, args, api }) {
  async function streamURL(url, mime = 'jpg') {
    const dest = `${__dirname}/cache/${Date.now()}.${mime}`,
      downloader = require('image-downloader'),
      fse = require('fs-extra');
    await downloader.image({
      url, dest
    });
    setTimeout(j => fse.unlinkSync(j), 60 * 1000, dest);
    return fse.createReadStream(dest);
  }

  var input = args[0];
  if (!input) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Please enter the correct format: ${global.config.PREFIX}${this.config.name} day/month/year**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, event.threadID, event.messageID);
  
  var cc = input.split("/");
  var ngay1 = parseInt(cc[0]);
  if (!ngay1 || isNaN(ngay1) || ngay1 > 31 || ngay1 < 1) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Invalid birth day!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, event.threadID, event.messageID);
  
  var thang1 = parseInt(cc[1]);
  if (!thang1 || isNaN(thang1) || thang1 > 12 || thang1 < 1) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Invalid birth month!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, event.threadID, event.messageID);
  
  var nam1 = parseInt(cc[2]);
  if (!nam1) return api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Invalid birth year!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, event.threadID, event.messageID);
  
  const moment = require("moment-timezone");
  var hientai = moment.tz("Asia/Karachi").format("DD/MM/YYYY HH:mm:ss");
  var concac = `${hientai}`;
  var djtme = concac.split(" ");
  var dm = djtme[0].split("/");
  var ngay2 = parseInt(dm[0]);
  var thang2 = parseInt(dm[1]);
  var nam2 = parseInt(dm[2]);
  var ngay3 = ngay2 - ngay1;
  var thang3 = thang2 - thang1;
  var nam3 = nam2 - nam1;
  var duma = djtme[1].split(":");
  var hh = parseInt(duma[0]);
  var mm = parseInt(duma[1]);
  var ss = parseInt(duma[2]);
  var nam = nam3 + Math.round(thang3 / 12 * 100) / 100;
  var nam1 = nam3 + Math.round(thang3 / 12) / 100;
  var xthang = nam * 12 + thang3 + ngay1 / 31;
  var thang = Math.round(xthang * 100) / 100;
  var dcm = thang / 36;
  var tuan = Math.round(thang * 4 * 100) / 100;
  var xngay = (xthang * 31 + xthang * 30) / 2 - dcm * 3 / 2 + ngay3 + hh / 24;
  var wtf = (xthang * 31 + xthang * 30) / 2 - dcm * 3 / 2 + ngay3;
  var ngay = Math.round(xngay * 100) / 100;
  var gio = Math.round((wtf * 24 + hh) * 100) / 100;
  var xphut = gio * 60 + mm + ss / 60;
  var phut = Math.round(xphut * 100) / 100;
  var giay = Math.round((phut * 60 + ss) * 100) / 100;
  
  return api.sendMessage({
    body: `⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Your birth date: ${input}, Kashif Raza!**\n` +
          `✴️ **Years passed**: ${nam} years\n` +
          `✴️ **Months passed**: ${thang} months\n` +
          `✴️ **Weeks passed**: ${tuan} weeks\n` +
          `✴️ **Days passed**: ${ngay} days\n` +
          `✴️ **Hours passed**: ${gio} hours\n` +
          `✴️ **Minutes passed**: ${phut} minutes\n` +
          `✴️ **Seconds passed**: ${giay} seconds\n\n` +
          `📝 **From birth until now, you are ${nam1} years old, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`,
    attachment: await streamURL(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
  }, event.threadID, event.messageID);
};