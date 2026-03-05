module.exports.config = {
	name: "birthday",
	version: "1.0",
	hasPermssion: 0,
	credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
	description: "Countdown timer",
	commandCategory: "Member",
	cooldowns: 5
}

module.exports.run = async ({ event, api, args })  => {
	const { commands } = global.client;
	const { threadID, messageID, body } = event;
    const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
if (!args[0] || args[0].length > 8 || args[0].length < 7) {
			api.sendMessage(`⚝──⭒─⭑─⭒──⚝

𝗚𝘂𝗶𝗱𝗲 𝘁𝗼 𝘂𝘀𝗲
→ ${prefix}${this.config.name} birthday [years-months-days]
→ ${prefix}${this.config.name} lovetime [years-months-days]
→ ${prefix}${this.config.name} timegap [years-months-days] [years-months-days]

⚝──⭒─⭑─⭒──⚝`, event.threadID, event.messageID);
		}
		else {
	if (args[0] == 'birthday') {
		if (!args[1] || args[1].length > 10 ) {
		return api.sendMessage(`≿━━━━༺❀༻━━━━≾

𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗶𝗻 𝗰𝗼𝗿𝗿𝗲𝗰𝘁 𝗳𝗼𝗿𝗺𝗮𝘁:
${prefix}${this.config.name} ${args[0]} [years-months-days]

≿━━━━༺❀༻━━━━≾`, event.threadID, event.messageID);	
		}
		else {
			const ngay = args[1];
    		const t = Date.parse(ngay) - Date.parse(new Date()) ;
    		const seconds = Math.floor( (t/1000) % 60 );
    		const minutes = Math.floor( (t/1000/60) % 60 );
    		const hours = Math.floor( (t/(1000*60*60)) % 24 );
    		const days = Math.floor( t/(1000*60*60*24) );
    		return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺

𝗧𝗶𝗺𝗲 𝗹𝗲𝗳𝘁 𝘂𝗻𝘁𝗶𝗹 𝘆𝗼𝘂𝗿 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆:
${days} 𝗱𝗮𝘆𝘀 ${hours} 𝗵𝗼𝘂𝗿𝘀 ${minutes} 𝗺𝗶𝗻𝘂𝘁𝗲𝘀 ${seconds} 𝘀𝗲𝗰𝗼𝗻𝗱𝘀

༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
}
}
		else {
	if (args[0] == 'timegap') {
		if (!args[1] || args[1].length > 10 ) {
		return api.sendMessage(`≿━━━━༺❀༻━━━━≾

𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗶𝗻 𝗰𝗼𝗿𝗿𝗲𝗰𝘁 𝗳𝗼𝗿𝗺𝗮𝘁:
${prefix}${this.config.name} ${args[0]} [years-months-days] [years-months-days]

≿━━━━༺❀༻━━━━≾`, event.threadID, event.messageID);	
		}
		else {
			const timestart = args[1];
		if (!args[2] || args[2].length > 10 ) {
		return api.sendMessage(`≿━━━━༺❀༻━━━━≾

𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗶𝗻 𝗰𝗼𝗿𝗿𝗲𝗰𝘁 𝗳𝗼𝗿𝗺𝗮𝘁:
${prefix}${this.config.name} ${args[0]} [years-months-days] [years-months-days]

≿━━━━༺❀༻━━━━≾`, event.threadID, event.messageID);	
		}
		else {	
			const timeend = args[2];
    		const t = Date.parse(timeend) - Date.parse(timestart)
    		const seconds = Math.floor( (t/1000) % 60 );
    		const minutes = Math.floor( (t/1000/60) % 60 );
    		const hours = Math.floor( (t/(1000*60*60)) % 24 );
    		const days = Math.floor( t/(1000*60*60*24) );
    		return api.sendMessage(`⚝──⭒─⭑─⭒──⚝

𝗖𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗲𝗱 𝘁𝗶𝗺𝗲 𝗴𝗮𝗽 𝗶𝘀: ${days} 𝗱𝗮𝘆𝘀

⚝──⭒─⭑─⭒──⚝`, event.threadID, event.messageID);
}
}
}
		else {
			if (args[0] == 'lovetime') {
			if (!args[1] || args[1].length > 10 ) {
			return api.sendMessage(`≿━━━━༺❀༻━━━━≾

𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗶𝗻 𝗰𝗼𝗿𝗿𝗲𝗰𝘁 𝗳𝗼𝗿𝗺𝗮𝘁:
${prefix}${this.config.name} ${args[0]} [years-months-days]

≿━━━━༺❀༻━━━━≾`, event.threadID, event.messageID);	
		}
		else {
			const ngay = args[1];
    		const t = Date.parse(new Date()) - Date.parse(ngay)
    		const seconds = Math.floor( (t/1000) % 60 );
    		const minutes = Math.floor( (t/1000/60) % 60 );
    		const hours = Math.floor( (t/(1000*60*60)) % 24 );
    		const days = Math.floor( t/(1000*60*60*24) );
    		return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺

𝗧𝗼𝘁𝗮𝗹 𝘁𝗶𝗺𝗲 𝘆𝗼𝘂 𝗵𝗮𝘃𝗲 𝗯𝗲𝗲𝗻 𝗶𝗻 𝗹𝗼𝘃𝗲:
${days} 𝗱𝗮𝘆𝘀 ${hours} 𝗵𝗼𝘂𝗿𝘀 ${minutes} 𝗺𝗶𝗻𝘂𝘁𝗲𝘀 ${seconds} 𝘀𝗲𝗰𝗼𝗻𝗱𝘀

༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
			}
		}
		}
		}
	}
}