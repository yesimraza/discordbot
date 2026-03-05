const imgur = require("imgur");
const axios = require("axios");
const fs = require("fs");
const { downloadFile } = require("./../../utils/index");

module.exports.config = {
  name: "imgscan",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Analyze images and return descriptions",
  commandCategory: "Utility",
  usages: "[reply with image]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, type, messageReply, messageID } = event;
  const ClientID = "c76eb7edd1459f3";  
  const analysisAPI = "https://deku-rest-api.gleeze.com/gemini?prompt=describe%20this%20photo&url=";
  const translateAPI = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=en&dt=t&q=";

  if (type !== "message_reply" || messageReply.attachments.length == 0 || messageReply.attachments[0].type !== 'photo') {
    return api.sendMessage(
      "⚝──⭒─⭑─⭒──⚝\n\n𝐘𝐨𝐮 𝐦𝐮𝐬𝐭 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐩𝐡𝐨𝐭𝐨 𝐭𝐨 𝐚𝐧𝐚𝐥𝐲𝐳𝐞.\n\n⚝──⭒─⭑─⭒──⚝",
      threadID,
      messageID
    );
  }

  imgur.setClientId(ClientID);
  const attachmentSend = [];

  async function getAttachments(attachments) {
    let startFile = 0;
    for (const data of attachments) {
      const ext = "jpg";
      const pathSave = __dirname + `/cache/${startFile}.${ext}`;
      ++startFile;
      const url = data.url;
      await downloadFile(url, pathSave);
      attachmentSend.push(pathSave);
    }
  }

  await getAttachments(messageReply.attachments);

  let msg = "", Error = [];

  for (const getImage of attachmentSend) {
    try {
      const getLink = await imgur.uploadFile(getImage);
      const imgurLink = getLink.link;
      const analysisResponse = await axios.get(`${analysisAPI}${imgurLink}`);
      const analysisData = analysisResponse.data.gemini;
      const translatedResponse = await axios.get(`${translateAPI}${encodeURIComponent(analysisData)}`);
      const translatedText = translatedResponse.data[0][0][0];  
      msg += `≿━━━━༺❀༻━━━━≾\n\n📝 𝐈𝐦𝐚𝐠𝐞 𝐀𝐧𝐚𝐥𝐲𝐬𝐢𝐬:\n\n${translatedText}\n\n≿━━━━༺❀༻━━━━≾\n`;
      fs.unlinkSync(getImage);
    } catch (err) {
      console.error(err);
      Error.push(getImage);
      fs.unlinkSync(getImage);
    }
  }

  if (Error.length > 0) {
    return api.sendMessage(
      "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐬𝐨𝐦𝐞 𝐢𝐦𝐚𝐠𝐞𝐬.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺",
      threadID,
      messageID
    );
  }
  
  return api.sendMessage(
    msg || "⚝──⭒─⭑─⭒──⚝\n\n𝐍𝐨 𝐝𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧 𝐰𝐚𝐬 𝐫𝐞𝐭𝐮𝐫𝐧𝐞𝐝 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐀𝐏𝐈.\n\n⚝──⭒─⭑─⭒──⚝",
    threadID,
    messageID
  );
};