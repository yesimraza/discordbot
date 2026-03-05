module.exports.config = {
	name: "setprefix",
	version: "2.0.7",
	hasPermssion: 1,
	credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
	description: "Change group prefix",
	commandCategory: "Groups",
	usages: "[prefix/reset]",
	cooldowns: 5
};

const uid = global.config.UIDBOT;
global.prefixTO = {}; // Initialize global variable

module.exports.handleEvent = async ({ api, event, Threads }) => {
	if (!event.body) return;
	var { threadID, messageID } = event;
	if (event.body.toLowerCase() == "prefix") {
		const prefix = global.prefixTO[threadID] || (await Threads.getData(String(threadID))).data?.PREFIX || global.config.PREFIX;
		api.sendMessage({
			body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n⚙️ 𝐒𝐲𝐬𝐭𝐞𝐦 𝐏𝐫𝐞𝐟𝐢𝐱: ${global.config.PREFIX}\n💬 𝐆𝐫𝐨𝐮𝐩 𝐏𝐫𝐞𝐟𝐢𝐱: ${prefix}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`
		}, threadID, messageID);
	}
}

module.exports.handleReaction = async function ({ api, event, Threads, handleReaction }) {
	try {
		if (event.userID != handleReaction.author) return;
		const { threadID, messageID } = event;
		const newPrefix = handleReaction.PREFIX;
		var data = (await Threads.getData(String(threadID))).data || {};
		data["PREFIX"] = newPrefix;
		await Threads.setData(threadID, { data });
		prefixTO[threadID] = newPrefix;
		api.unsendMessage(handleReaction.messageID);
		api.changeNickname(`[ ${newPrefix} ] • ${global.config.BOTNAME}`, threadID, api.getCurrentUserID());
		return api.sendMessage(
			`⚝──⭒─⭑─⭒──⚝\n\n✅ 𝐆𝐫𝐨𝐮𝐩 𝐩𝐫𝐞𝐟𝐢𝐱 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐜𝐡𝐚𝐧𝐠𝐞𝐝 𝐭𝐨: ${newPrefix}\n\n⚝──⭒─⭑─⭒──⚝`,
			threadID, messageID
		);
	} catch (e) { return console.log(e); }
}

module.exports.run = async ({ api, event, args, Threads }) => {
	let prefix = args[0]?.trim();
	if (!prefix) return api.sendMessage(
		`≿━━━━༺❀༻━━━━≾\n\n❎ 𝐏𝐫𝐞𝐟𝐢𝐱 𝐟𝐢𝐞𝐥𝐝 𝐜𝐚𝐧𝐧𝐨𝐭 𝐛𝐞 𝐞𝐦𝐩𝐭𝐲.\n\n≿━━━━༺❀༻━━━━≾`,
		event.threadID, event.messageID
	);

	if (prefix === "reset") {
		var data = (await Threads.getData(event.threadID)).data || {};
		data["PREFIX"] = global.config.PREFIX;
		await Threads.setData(event.threadID, { data });
		await global.data.threadData.set(String(event.threadID), data);
		global.prefixTO[event.threadID] = global.config.PREFIX;
		for (const i of uid) {
			api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME}`, event.threadID, i);
		}
		return api.sendMessage(
			`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n🔄 𝐏𝐫𝐞𝐟𝐢𝐱 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐫𝐞𝐬𝐞𝐭 𝐭𝐨: ${global.config.PREFIX}\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
			event.threadID, event.messageID
		);
	} else {
		return api.sendMessage(
			`≿━━━━༺❀༻━━━━≾\n\n📌 𝐘𝐨𝐮 𝐰𝐚𝐧𝐭 𝐭𝐨 𝐜𝐡𝐚𝐧𝐠𝐞 𝐩𝐫𝐞𝐟𝐢𝐱 𝐭𝐨: ${prefix}\n👉 𝐑𝐞𝐚𝐜𝐭 𝐭𝐨 𝐜𝐨𝐧𝐟𝐢𝐫𝐦.\n\n≿━━━━༺❀༻━━━━≾`,
			event.threadID, (error, info) => {
				global.client.handleReaction.push({
					name: "setprefix",
					messageID: info.messageID,
					author: event.senderID,
					PREFIX: prefix
				});
			}
		);
	}
}