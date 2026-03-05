module.exports.config = {
	name: "findlove",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
	description: "Scan all users and groups the bot has joined to find a partner",
	commandCategory: "Love",
	usages: "findlove [male/female]",
	cooldowns: 1
};

const axios = require('axios');

module.exports.run = async ({ api, event, args }) => {
	if (args.length === 0) {
		return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ Please enter the command in this format: /findlove [male/female]\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID, event.messageID);
	}

	const genderInput = (args[0] || '').toLowerCase();
	const genderTarget = ["male", "boy"].includes(genderInput) ? 'MALE' :
		["female", "girl", "woman"].includes(genderInput) ? 'FEMALE' : null;

	if (!genderTarget) {
		return api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n⚠️ Invalid gender. Please type 'male' or 'female'.\n\n⚝──⭒─⭑─⭒──⚝", event.threadID, event.messageID);
	}

	let targetID = global.data.allUserID[Math.floor(Math.random() * global.data.allUserID.length)];
	let data = await getInfo(api, targetID);
	let countLoop = 0;

	while (genderTarget !== data.gender && countLoop < 10) {
		countLoop++;
		targetID = global.data.allUserID[Math.floor(Math.random() * global.data.allUserID.length)];
		data = await getInfo(api, targetID);
	}
	
	if (countLoop === 10) {
		return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n❎ Sorry, no suitable user found for you.\n\n≿━━━━༺❀༻━━━━≾", event.threadID, event.messageID);
	}

	const {
		name,
		gender,
		id,
		url,
		username,
		shortname,
		friend,
		cv,
		mess,
		chucvu,
		block
	} = data;

	const msg = `≿━━━━༺❀༻━━━━≾

💖 [ FIND LOVE ]

👤 Name: ${name}
📛 Short Name: ${shortname}
🔗 Username: ${username ? username : "Not set"}
🚻 Gender: ${gender === "MALE" ? "Male" : "Female"}
🆔 UID: ${id}
👥 Friend: ${friend ? "Already friends with bot" : "Not friends with bot"}
💬 Status: ${mess ? "Has messaged bot" : "No messages with bot"}
🚫 Message Block: ${block ? "Blocked messages from bot" : "Not blocked"}
💼 Work: ${cv ? cv : "Not available"}
🎖 Role: ${chucvu ? chucvu : "None"}
🌐 Facebook: ${url}

≿━━━━༺❀༻━━━━≾`;

	try {
		const avatarResponse = await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "stream" });
		const avatar = avatarResponse.data;
		avatar.path = 'avatar.png';
		return api.sendMessage({ body: msg, attachment: avatar }, event.threadID, event.messageID);
	} catch (error) {
		return api.sendMessage("⚠️ Unable to load avatar or another error occurred.", event.threadID, event.messageID);
	}
};

async function getInfo(api, userID) {
	try {
		const cc = await api.getUserInfoV5(userID);
		const user = cc[0].o0.data.messaging_actors[0];
		return {
			name: user.name,
			gender: user.gender,
			id: user.id,
			url: user.url,
			username: user.username,
			shortname: user.short_name,
			friend: user.is_viewer_friend,
			cv: user.work_info,
			mess: user.is_messenger_user,
			chucvu: user.is_employee,
			block: user.is_message_blocked_biewer
		};
	} catch (error) {
		console.error("⚠️ Error while fetching user info:", error);
		return {};
	}
}