module.exports.config = {
	name: "quiz",
	version: "2.0.0",
	credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
	hasPermssion: 0,
	description: "Answer quiz questions",
	commandCategory: "Game",
	cooldowns: 5,
	dependencies: {
		"axios": ""
	}
};

module.exports.handleReaction = ({ api, event, handleReaction }) => {
	if (!event.userID == handleReaction.author) return;
	let response = "";
	if (event.reaction != "👍" && event.reaction != "😢") return;
	if (event.reaction == "👍") response = "True"
	else if (event.reaction == "😢") response = "False";

	if (response == handleReaction.answer) {
		api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n✅ 𝐘𝐨𝐮 𝐚𝐧𝐬𝐰𝐞𝐫𝐞𝐝 𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐥𝐲!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID, () => {
			setTimeout(function () { api.unsendMessage(handleReaction.messageID); }, 5000);
		});
	} else {
		api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n❌ 𝐘𝐨𝐮𝐫 𝐚𝐧𝐬𝐰𝐞𝐫 𝐢𝐬 𝐢𝐧𝐜𝐨𝐫𝐫𝐞𝐜𝐭!\n\n⚝──⭒─⭑─⭒──⚝", event.threadID);
	}

	const indexOfHandle = client.handleReaction.findIndex(e => e.messageID == handleReaction.messageID);
	global.client.handleReaction.splice(indexOfHandle, 1);
	handleReaction.answerYet = 1;
	return global.client.handleReaction.push(handleReaction);
};

module.exports.run = async ({ api, event, args }) => {
	const axios = global.nodemodule["axios"];
	const request = global.nodemodule["request"];	
	let difficulties = ["easy", "medium", "hard"];
	let difficulty = args[0];
	(difficulties.some(item => difficulty == item)) ? "" : difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
	let fetch = await axios(`https://opentdb.com/api.php?amount=1&encode=url3986&type=boolean&difficulty=${difficulty}`);
	if (!fetch.data) return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n⚠️ 𝐒𝐞𝐫𝐯𝐞𝐫 𝐢𝐬 𝐛𝐮𝐬𝐲, 𝐜𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐚 𝐪𝐮𝐞𝐬𝐭𝐢𝐨𝐧.\n\n≿━━━━༺❀༻━━━━≾", event.threadID, event.messageID);
	let decode = decodeURIComponent(fetch.data.results[0].question);

	return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${decode}`), (err, response, body) => {
		if (err) return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID, event.messageID);
		var retrieve = JSON.parse(body);
		var text = '';
		retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
		var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];

		return api.sendMessage(
			`≿━━━━༺❀༻━━━━≾\n\n📖 𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐪𝐮𝐞𝐬𝐭𝐢𝐨𝐧:\n\n- ${text}\n\n👍 = True   😢 = False\n\n≿━━━━༺❀༻━━━━≾`,
			event.threadID,
			async (err, info) => {
				global.client.handleReaction.push({
					name: "quiz",
					messageID: info.messageID,
					author: event.senderID,
					answer: fetch.data.results[0].correct_answer,
					answerYet: 0
				});
				await new Promise(resolve => setTimeout(resolve, 20 * 1000));
				const indexOfHandle = global.client.handleReaction.findIndex(e => e.messageID == info.messageID);
				let data = global.client.handleReaction[indexOfHandle];
				if (data.answerYet !== 1) {
					api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n⏰ 𝐓𝐢𝐦𝐞 𝐮𝐩! 𝐓𝐡𝐞 𝐜𝐨𝐫𝐫𝐞𝐜𝐭 𝐚𝐧𝐬𝐰𝐞𝐫 𝐰𝐚𝐬: ${fetch.data.results[0].correct_answer}\n\n⚝──⭒─⭑─⭒──⚝`, event.threadID, info.messageID);
					return global.client.handleReaction.splice(indexOfHandle, 1);
				} else return;
			}
		);
	});
};