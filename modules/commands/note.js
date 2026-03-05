const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: 'note',
    version: '0.0.1',
    hasPermssion: 3,
    credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
    description: 'Upload or replace bot files using external note API',
    commandCategory: 'Admin',
    usages: '[]',
    images: [],
    cooldowns: 3,
  },

  run: async function(o) {
    const name = module.exports.config.name;
    const url = o.event?.messageReply?.args?.[0] || o.args[1];
    let path = `${__dirname}/${o.args[0]}`;
    const send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res), o.event.messageID));

    try {
      if (/^https:\/\//.test(url)) {
        return send(`≿━━━━༺❀༻━━━━≾\n\n🔗 𝐅𝐢𝐥𝐞: ${path}\n\n𝐑𝐞𝐚𝐜𝐭 𝐭𝐨 𝐜𝐨𝐧𝐟𝐢𝐫𝐦 𝐫𝐞𝐩𝐥𝐚𝐜𝐞 𝐟𝐢𝐥𝐞 𝐜𝐨𝐧𝐭𝐞𝐧𝐭.\n\n≿━━━━༺❀༻━━━━≾`).then(res => {
          res = {
            ...res,
            name,
            path,
            o,
            url,
            action: 'confirm_replace_content',
          };
          global.client.handleReaction.push(res);
        });
      } else {
        if (!fs.existsSync(path)) return send(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ 𝐅𝐢𝐥𝐞 𝐩𝐚𝐭𝐡 𝐝𝐨𝐞𝐬 𝐧𝐨𝐭 𝐞𝐱𝐢𝐬𝐭 𝐟𝐨𝐫 𝐞𝐱𝐩𝐨𝐫𝐭.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`);
        const uuid_raw = require('uuid').v4();
        const url_raw = new URL(`https://api.dungkon.id.vn/note/${uuid_raw}`);
        const url_redirect = new URL(`https://api.dungkon.id.vn/note/${require('uuid').v4()}`);
        await axios.put(url_raw.href, fs.readFileSync(path, 'utf8'));
        url_redirect.searchParams.append('raw', uuid_raw);
        await axios.put(url_redirect.href);
        url_redirect.searchParams.delete('raw');
        return send(`⚝──⭒─⭑─⭒──⚝\n\n📝 𝐑𝐚𝐰: ${url_redirect.href}\n\n✏️ 𝐄𝐝𝐢𝐭: ${url_raw.href}\n────────────────\n• 𝐅𝐢𝐥𝐞: ${path}\n\n📌 𝐑𝐞𝐚𝐜𝐭 𝐭𝐨 𝐮𝐩𝐥𝐨𝐚𝐝 𝐜𝐨𝐝𝐞.\n\n⚝──⭒─⭑─⭒──⚝`).then(res => {
          res = {
            ...res,
            name,
            path,
            o,
            url: url_redirect.href,
            action: 'confirm_replace_content',
          };
          global.client.handleReaction.push(res);
        });
      }
    } catch (e) {
      console.error(e);
      send(e.toString());
    }
  },

  handleReaction: async function(o) {
    const _ = o.handleReaction;
    const send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res), o.event.messageID));

    try {
      if (o.event.userID != _.o.event.senderID) return;

      switch (_.action) {
        case 'confirm_replace_content': {
          const content = (await axios.get(_.url, {
            responseType: 'text',
          })).data;

          fs.writeFileSync(_.path, content);
          send(`≿━━━━༺❀༻━━━━≾\n\n✅ 𝐅𝐢𝐥𝐞 𝐮𝐩𝐥𝐨𝐚𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲\n\n🔗 𝐅𝐢𝐥𝐞: ${_.path}\n\n≿━━━━༺❀༻━━━━≾`).then(res => {
            res = {
              ..._,
              ...res,
            };
            global.client.handleReaction.push(res);
          });
        };
          break;
        default:
          break;
      }
    } catch (e) {
      console.error(e);
      send(e.toString());
    }
  }
}