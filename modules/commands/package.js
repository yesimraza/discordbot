module.exports.config = {
 name: "package",
 version: "1.0.1",
 hasPermssion: 3,
 credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
 description: "Check package information",
 commandCategory: "Admin",
 usages: "pack + package name",
 images: [],
 cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
 const axios = require('axios');
 const moment = require('moment-timezone');
 const npmRegistryURL = 'https://registry.npmjs.org/';

 var packageName = args.join(" ");

 if (!packageName) {
   api.sendMessage(
     "⚝──⭒─⭑─⭒──⚝\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝗽𝗮𝗰𝗸𝗮𝗴𝗲 𝗻𝗮𝗺𝗲 𝘁𝗼 𝗰𝗵𝗲𝗰𝗸 𝗶𝗻𝗳𝗼!\n\n⚝──⭒─⭑─⭒──⚝",
     event.threadID,
     event.messageID
   );
   return;
 }

 async function getPackageInfo(packageName) {
   try {
     const response = await axios.get(`${npmRegistryURL}${packageName}`);
     const packageData = response.data;

     if (packageData.error) {
       api.sendMessage(
         `≿━━━━༺❀༻━━━━≾\n\n❌ 𝗣𝗮𝗰𝗸𝗮𝗴𝗲 "${packageName}" 𝗱𝗼𝗲𝘀 𝗻𝗼𝘁 𝗲𝘅𝗶𝘀𝘁 𝗼𝗻 𝗻𝗽𝗺.\n\n≿━━━━༺❀༻━━━━≾`,
         event.threadID
       );
       return;
     }

     const latestVersion = packageData['dist-tags'].latest;
     const versionData = packageData.versions[latestVersion];
     const publisher = versionData.maintainers[0];
     const filesize = versionData.dist.unpackedSize;
     const fileSizeInMB = (filesize / (1024 * 1024)).toFixed(2);
     const inputTimepub = packageData.time[packageData['dist-tags'].latest];
     const inputTimepubl = packageData.time[latestVersion];
     const outputTimeZone = 'Asia/Karachi';
     const timepub = moment(inputTimepub).tz(outputTimeZone);
     const timepubl = moment(inputTimepubl).tz(outputTimeZone);
 
     api.sendMessage(
       `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n` +
       `✅ 𝗣𝗮𝗰𝗸𝗮𝗴𝗲: ${packageName}\n` +
       `📦 𝗡𝗮𝗺𝗲: ${packageData.name}\n` +
       `🔖 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${latestVersion}\n` +
       `⏰ 𝗣𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱: ${timepub.format('HH:mm:ss - DD/MM/YYYY')}\n` +
       `👤 𝗣𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝗯𝘆: ${publisher.name}\n` +
       `📧 𝗘𝗺𝗮𝗶𝗹: ${packageData.maintainers[0].email}\n` +
       `────────────────────\n` +
       `🔗 𝗦𝗼𝘂𝗿𝗰𝗲: ${packageData.bugs.url}\n` +
       `🌍 𝗛𝗼𝗺𝗲𝗽𝗮𝗴𝗲: ${packageData.homepage}\n` +
       `🔑 𝗞𝗲𝘆𝘄𝗼𝗿𝗱𝘀: ${packageData.keywords}\n` +
       `────────────────────\n` +
       `📂 𝗦𝗶𝘇𝗲: ${fileSizeInMB} MB\n` +
       `📑 𝗧𝗼𝘁𝗮𝗹 𝗙𝗶𝗹𝗲𝘀: ${versionData.dist.fileCount}\n` +
       `🕒 𝗟𝗮𝘀𝘁 𝗣𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱: ${timepubl.format('HH:mm:ss - DD/MM/YYYY')}\n` +
       `────────────────────\n` +
       `📥 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱: ${packageData.repository.url}\n` +
       `💻 𝗜𝗻𝘀𝘁𝗮𝗹𝗹: npm i ${packageName}\n\n` +
       `༻﹡﹡﹡﹡﹡﹡﹡༺`,
       event.threadID,
       event.messageID
     );

   } catch (error) {
     api.sendMessage(
       `≿━━━━༺❀༻━━━━≾\n\n❌ 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗽𝗮𝗰𝗸𝗮𝗴𝗲 ${packageName}\n\n${error.message}\n\n≿━━━━༺❀༻━━━━≾`,
       event.threadID
     );
   }
 }
 getPackageInfo(packageName);
};