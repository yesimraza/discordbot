module.exports.config = {
  name: "girl",	
  version: "4.0.0", 
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Send random girl images", 
  commandCategory: "Image",
  usages: "gái",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args, Threads }) => {
  const request = require("request");
  const fs = require("fs");
  const tdungs = [
    require("./../../includes/datajson/gaivip.json"),
    require("./../../includes/datajson/gaivip.json"),
    require("./../../includes/datajson/gaivip.json"),
    require("./../../includes/datajson/gaivip.json"),
    require("./../../includes/datajson/gaivip.json"),
    require("./../../includes/datajson/gaivip.json"),
    require("./../../includes/datajson/gaivip.json"),
    require("./../../includes/datajson/gaivip.json"),
    require("./../../includes/datajson/gaivip.json")
  ];

  function downloadImage(image, fileName, callback) {
    request(image)
      .pipe(fs.createWriteStream(__dirname + `/${fileName}`))
      .on("close", callback);
  }

  const numImages = Math.floor(Math.random() * 15) + 1;
  let imagesDownloaded = 0;
  let attachments = [];

  for (let i = 0; i < numImages; i++) {
    const randomTdung = tdungs[Math.floor(Math.random() * tdungs.length)];
    let image = randomTdung[Math.floor(Math.random() * randomTdung.length)].trim();
    let imgFileName = `image_${i}.png`;
    downloadImage(image, imgFileName, () => {
      imagesDownloaded++;
      attachments.push(fs.createReadStream(__dirname + `/${imgFileName}`));
      if (imagesDownloaded === numImages) {
        api.sendMessage(
          {
            body: `༻﹡﹡﹡﹡﹡﹡﹡༺  

𝗘𝗻𝗷𝗼𝘆 𝘁𝗵𝗲 𝗿𝗮𝗻𝗱𝗼𝗺 𝗴𝗶𝗿𝗹 𝗶𝗺𝗮𝗴𝗲𝘀! 💖  

༻﹡﹡﹡﹡﹡﹡﹡༺`,
            attachment: attachments
          },
          event.threadID,
          () => {
            for (let img of attachments) {
              fs.unlinkSync(img.path);
            }
          },
          event.messageID
        );
      }
    });
  }
};