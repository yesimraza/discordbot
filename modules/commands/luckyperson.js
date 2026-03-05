module.exports.config = {
	name: "luckyperson",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
	description: "Randomly select a member in the group",
	commandCategory: "Members",
	cooldowns: 0
};

module.exports.run = async ({ api, event, args, Users, Currencies }) => {
	try { 
		const { threadID, messageID, participantIDs, isGroup } = event;
		const num = parseInt(args[0]) || 1;

		if (isGroup == false) {
			return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ This command can only be used in groups.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", threadID, messageID);
		}

		const random = participantIDs.sort(function() {
			return 0.5 - Math.random();
		});

		let data = (await Currencies.getData(event.senderID)).data || {};
		const members = [];

		for (let i = 0; i <= num - 1; i++) {
			var name = (await Users.getData(random[i])).name;
			members.push(name);
		}

		return api.sendMessage(
			`≿━━━━༺❀༻━━━━≾\n\n🎉 𝗧𝗵𝗲 𝗹𝘂𝗰𝗸𝘆 𝗺𝗲𝗺𝗯𝗲𝗿 𝗰𝗵𝗼𝘀𝗲𝗻 𝗶𝘀: ${members.join(', ')}\n\n≿━━━━༺❀༻━━━━≾`,
			threadID,
			messageID
		);

	} catch (e) {
		console.log(e);
	}
};