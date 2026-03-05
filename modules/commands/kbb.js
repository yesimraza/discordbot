const { get: p } = require('axios'), 
i = url => p(url, { responseType: 'stream' }).then(r => r.data),
{ tz: t } = require("moment-timezone"), 
tm = t("Asia/Karachi").format('HH:mm:ss || DD/MM/YYYY'),
a = [
  'https://i.imgur.com/4Hfduoe.png',
  'https://i.imgur.com/EHsr9RL.png',
  'https://i.imgur.com/Xuw6yG8.png'
],
b = [
  'https://i.imgur.com/YPhfjfU.png',
  'https://i.imgur.com/mahn5lm.png',
  'https://i.imgur.com/cEivriJ.png'
];

module.exports.config = {
  name: "kbb",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Rock Paper Scissors betting game",
  commandCategory: "Game",
  usages: "[rock/paper/scissors] [bet]",
  cooldowns: 0
};

module.exports.run = async function ({ api: ap, event: e, args: ar, Currencies: C, Users: U }) {
  const { threadID: $, senderID: sd } = e, 
  { sendMessage: s } = ap, 
  { increaseMoney: $$, getData: g } = C, 
  { getNameUser: nm } = U;

  var kbb = ['scissors', 'rock', 'paper'], 
  rd = kbb[Math.floor(Math.random() * kbb.length)], 
  data = (await g(sd)).data || {};

  ra = ar[0] == 'scissors' ? 0 : ar[0] == 'rock' ? 1 : 2;
  rb = rd == 'scissors' ? 0 : rd == 'rock' ? 1 : 2;

  let w = 'https://i.imgur.com/tYFcqjH.png', 
  l = 'https://i.imgur.com/4QBP4bC.png', 
  d = 'https://i.imgur.com/AYhzVjZ.png',
  M = (await g(sd)).money, 
  m = ar[1] == 'all' ? M : parseFloat(ar[1]), 
  wn = 1000 + M + m, 
  ls = 1000 + M - m, 
  dr = M + 1000, 
  n = await nm(sd);

  if (!ar[0] || (!parseFloat(ar[1]) && ar[1] != 'all')) { 
    return s("⚝──⭒─⭑─⭒──⚝\n\n⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗼𝗼𝘀𝗲 𝗿𝗼𝗰𝗸/𝗽𝗮𝗽𝗲𝗿/𝘀𝗰𝗶𝘀𝘀𝗼𝗿𝘀 𝗮𝗻𝗱 𝗲𝗻𝘁𝗲𝗿 𝘆𝗼𝘂𝗿 𝗯𝗲𝘁.\n\n⚝──⭒─⭑─⭒──⚝", $) 
  }

  switch (ar[0]) {
    case 'scissors': {
      var _ = rd == 'paper' ? 'win' : rd == 'rock' ? 'lose' : 'draw',
      dn = _ == 'win' ? `𝗬𝗼𝘂 𝗴𝗮𝗶𝗻𝗲𝗱: ${m}$\n> 𝗡𝗼𝘄 𝘆𝗼𝘂 𝗵𝗮𝘃𝗲: ${wn}$` : _ == 'lose' ? `𝗬𝗼𝘂 𝗹𝗼𝘀𝘁: ${m}$\n> 𝗡𝗼𝘄 𝘆𝗼𝘂 𝗵𝗮𝘃𝗲: ${ls}$` : `𝗬𝗼𝘂 𝗸𝗲𝗲𝗽: ${m}$\n> 𝗡𝗼𝘄 𝘆𝗼𝘂 𝗵𝗮𝘃𝗲: ${dr}$`,
      at = [await i(a[ra]), await i(_ == 'win' ? w : _ == 'lose' ? l : d), await i(b[rb])];
      await $$(sd, parseFloat(_ == 'win' ? m : _ == 'lose' ? -m : 0));
      return s({ body: `≿━━━━༺❀༻━━━━≾\n\n👤 𝗣𝗹𝗮𝘆𝗲𝗿: ${n}\n⏰ 𝗧𝗶𝗺𝗲: ${tm}\n🎯 𝗥𝗲𝘀𝘂𝗹𝘁: ${_}\n🪙 𝗬𝗼𝘂𝗿 𝗰𝗵𝗼𝗶𝗰𝗲: ${ar[0]}\n🤖 𝗕𝗼𝘁 𝗰𝗵𝗼𝗶𝗰𝗲: ${rd}\n💰 ${dn}\n\n≿━━━━༺❀༻━━━━≾`, attachment: at }, $)
    }

    case 'rock': {
      var _ = rd == 'scissors' ? 'win' : rd == 'paper' ? 'lose' : 'draw',
      dn = _ == 'win' ? `𝗬𝗼𝘂 𝗴𝗮𝗶𝗻𝗲𝗱: ${m}$\n> 𝗡𝗼𝘄 𝘆𝗼𝘂 𝗵𝗮𝘃𝗲: ${wn}$` : _ == 'lose' ? `𝗬𝗼𝘂 𝗹𝗼𝘀𝘁: ${m}$\n> 𝗡𝗼𝘄 𝘆𝗼𝘂 𝗵𝗮𝘃𝗲: ${ls}$` : `𝗬𝗼𝘂 𝗸𝗲𝗲𝗽: ${m}$\n> 𝗡𝗼𝘄 𝘆𝗼𝘂 𝗵𝗮𝘃𝗲: ${dr}$`,
      at = [await i(a[ra]), await i(_ == 'win' ? w : _ == 'lose' ? l : d), await i(b[rb])];
      await $$(sd, parseFloat(_ == 'win' ? m : _ == 'lose' ? -m : 0));
      return s({ body: `⚝──⭒─⭑─⭒──⚝\n\n👤 𝗣𝗹𝗮𝘆𝗲𝗿: ${n}\n⏰ 𝗧𝗶𝗺𝗲: ${tm}\n🎯 𝗥𝗲𝘀𝘂𝗹𝘁: ${_}\n🪙 𝗬𝗼𝘂𝗿 𝗰𝗵𝗼𝗶𝗰𝗲: ${ar[0]}\n🤖 𝗕𝗼𝘁 𝗰𝗵𝗼𝗶𝗰𝗲: ${rd}\n💰 ${dn}\n\n⚝──⭒─⭑─⭒──⚝`, attachment: at }, $)
    }

    case 'paper': {
      var _ = rd == 'rock' ? 'win' : rd == 'scissors' ? 'lose' : 'draw',
      dn = _ == 'win' ? `𝗬𝗼𝘂 𝗴𝗮𝗶𝗻𝗲𝗱: ${m}$\n> 𝗡𝗼𝘄 𝘆𝗼𝘂 𝗵𝗮𝘃𝗲: ${wn}$` : _ == 'lose' ? `𝗬𝗼𝘂 𝗹𝗼𝘀𝘁: ${m}$\n> 𝗡𝗼𝘄 𝘆𝗼𝘂 𝗵𝗮𝘃𝗲: ${ls}$` : `𝗬𝗼𝘂 𝗸𝗲𝗲𝗽: ${m}$\n> 𝗡𝗼𝘄 𝘆𝗼𝘂 𝗵𝗮𝘃𝗲: ${dr}$`,
      at = [await i(a[ra]), await i(_ == 'win' ? w : _ == 'lose' ? l : d), await i(b[rb])];
      await $$(sd, parseFloat(_ == 'win' ? m : _ == 'lose' ? -m : 0));
      return s({ body: `≿━━━━༺❀༻━━━━≾\n\n👤 𝗣𝗹𝗮𝘆𝗲𝗿: ${n}\n⏰ 𝗧𝗶𝗺𝗲: ${tm}\n🎯 𝗥𝗲𝘀𝘂𝗹𝘁: ${_}\n🪙 𝗬𝗼𝘂𝗿 𝗰𝗵𝗼𝗶𝗰𝗲: ${ar[0]}\n🤖 𝗕𝗼𝘁 𝗰𝗵𝗼𝗶𝗰𝗲: ${rd}\n💰 ${dn}\n\n≿━━━━༺❀༻━━━━≾`, attachment: at }, $)
    }
  }
}