module.exports.config = {
    name: "fast",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Check internet speed",
    commandCategory: "Admin",
    cooldowns: 15,
    dependencies: {
		"fast-speedtest-api": ""
	}
};

module.exports.run = async function({ api, event }) {
	try {
		const fast = global.nodemodule["fast-speedtest-api"];
		const speedTest = new fast({
			token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
			verbose: false,
			timeout: 10000,
			https: true,
			urlCount: 5,
			bufferSize: 8,
			unit: fast.UNITS.Mbps
		});
		const resault = await speedTest.getSpeed();
		return api.sendMessage(
			"༻﹡﹡﹡﹡﹡﹡﹡༺\n\n**⚡ Internet Speed Test Result ⚡**\n**Speed:** " + resault + " Mbps\n\n༻﹡﹡﹡﹡﹡﹡﹡༺",
			event.threadID, event.messageID
		);
	}
	catch {
		return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n**Unable to perform Speedtest right now, please try again later!**\n\n≿━━━━༺❀༻━━━━≾", event.threadID, event.messageID);
	}
}