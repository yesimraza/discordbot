module.exports.config = {
	name: "shell",
	version: "7.3.1",
	hasPermssion: 3,
	credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
	description: "Run shell commands",
	commandCategory: "Admin",
	usages: "[shell]",
	cooldowns: 0,
	dependencies: {
		"child_process": ""
	}
};

module.exports.run = async function({ api, event, args }) {    
	const { exec } = require("child_process");
	const permission = global.config.NDH[0];
	if (!permission.includes(event.senderID))  
		return api.sendMessage( 
`༻﹡﹡﹡﹡﹡﹡﹡༺

𝗬𝗼𝘂 𝗮𝗿𝗲 𝗻𝗼𝘁 𝗮𝗹𝗹𝗼𝘄𝗲𝗱 𝘁𝗼 𝘂𝘀𝗲 𝘁𝗵𝗶𝘀 𝗰𝗼𝗺𝗺𝗮𝗻𝗱. 𝗔𝗱𝗺𝗶𝗻 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗻𝗼𝘁𝗶𝗳𝗶𝗲𝗱.

༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);

	let text = args.join(" ");
	exec(`${text}`, (error, stdout, stderr) => {
		if (error) {
			return api.sendMessage(
`⚝──⭒─⭑─⭒──⚝

𝗘𝗿𝗿𝗼𝗿:  
${error.message}

⚝──⭒─⭑─⭒──⚝`, event.threadID, event.messageID);
		}
		if (stderr) {
			return api.sendMessage(
`≿━━━━༺❀༻━━━━≾

𝘀𝘁𝗱𝗲𝗿𝗿:  
${stderr}

≿━━━━༺❀༻━━━━≾`, event.threadID, event.messageID);
		}
		return api.sendMessage(
`༻﹡﹡﹡﹡﹡﹡﹡༺

𝘀𝘁𝗱𝗼𝘂𝘁:  
${stdout}

༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
	});
};