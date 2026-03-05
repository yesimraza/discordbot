module.exports.config = {
	name: "bancommand",
	version: "1.0.5",
	hasPermssion: 1,
	credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
	description: "Ban specific commands in group",
	commandCategory: "Admin",
	usages: "add <command>, del <command>, add all (ban all), del all (unban all)",
	cooldowns: 5,
	dependencies: {
		"moment-timezone": ""
	}
};

module.exports.languages = {
  "en": {
		"allCommand": "all commands",
		"commandList": "commands",
		"banCommandSuccess": "━━━━━━━━━━━━━━━━━━\n✅ Command ban request has been processed successfully.\n━━━━━━━━━━━━━━━━━━",
		"unbanCommandSuccess": "━━━━━━━━━━━━━━━━━━\n✅ Command unban request for %1 has been processed successfully.\n━━━━━━━━━━━━━━━━━━",
		"missingCommandInput": "━━━━━━━━━━━━━━━━━━\n❌ %1 Please enter the command you want to ban in the group!\n━━━━━━━━━━━━━━━━━━",
		"notExistBanCommand": "━━━━━━━━━━━━━━━━━━\n❌ Your group has never had any banned commands.\n━━━━━━━━━━━━━━━━━━",
		"returnBanCommand": "━━━━━━━━━━━━━━━━━━\n🔄 You have requested to ban commands in this group.\n- Commands to ban: %2\n\n< React to this message to confirm >\n━━━━━━━━━━━━━━━━━━",
		"returnUnbanCommand": "━━━━━━━━━━━━━━━━━━\n🔄 You have requested to unban commands in this group.\n- Commands to unban: %2\n\n< React to this message to confirm >\n━━━━━━━━━━━━━━━━━━"
  }
}
	
module.exports.handleReaction = async ({ event, api, Threads, handleReaction, getText }) => {
  if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
	const moment = require("moment-timezone");
	const { threadID } = event;
	const { messageID, type, targetID, reason, commandNeedBan } = handleReaction;
	
	const time = moment.tz("Asia/Karachi").format("HH:MM:ss L");
	global.client.handleReaction.splice(global.client.handleReaction.findIndex(item => item.messageID == messageID), 1);
  switch (type) {
  case "banCommand": {
			try {	
				let data = (await Threads.getData(targetID)).data || {};
				data.commandBanned = [...data.commandBanned || [], ...commandNeedBan];
				await Threads.setData(targetID, { data });
				global.data.commandBanned.set(targetID, data.commandBanned);
				return api.sendMessage(getText("banCommandSuccess", targetID), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch (e) { return api.sendMessage(getText("errorReponse", "[ NOTICE ]", targetID), threadID) };
		}
    case "unbanCommand": {
			try {
				let data = (await Threads.getData(targetID)).data || {};
				data.commandBanned = [...data.commandBanned.filter(item => !commandNeedBan.includes(item))];
				await Threads.setData(targetID, { data });
				global.data.commandBanned.set(targetID, data.commandBanned);
				if(data.commandBanned.length == 0) global.data.commandBanned.delete(targetID)
				return api.sendMessage(getText("unbanCommandSuccess", ((data.commandBanned.length == 0) ? getText("allCommand") : `${getText("commandList")}: ${commandNeedBan.join(", ")}`), targetID), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch (e) { return api.sendMessage(getText("errorReponse", "[ NOTICE ]", targetID), threadID) };
		}
		default:
			break;
	}
}
module.exports.run = async ({ event, api, args, Threads, getText }) => { 
	const { threadID, messageID } = event;
	var targetID = String(args[1]);
	var reason = (args.slice(2, args.length)).join(" ") || null;

	if (isNaN(targetID)) {
		targetID = String(event.threadID);
		reason = (args.slice(1, args.length)).join(" ") || null;
	}
  switch (args[0]) {
		case "add": {
			if (!global.data.allThreadID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ NOTICE ]"), threadID, messageID);
			if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", '[ NOTICE ]'), threadID, messageID);
			if (reason == "all") {
				var allCommandName = [];
				const commandValues = global.client.commands.keys();
				for (const cmd of commandValues) allCommandName.push(cmd);
				reason = allCommandName.join(" ");
			}
			const commandNeedBan = reason.split(" ");
			return api.sendMessage(getText("returnBanCommand", targetID, ((commandNeedBan.length == global.client.commands.size) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "banCommand",
					targetID,
					commandNeedBan,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
				});
			}, messageID);
		}

		case "unban":
		case "del": {
			if (!global.data.allThreadID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ NOTICE ]"), threadID, messageID);
			if (!global.data.commandBanned.has(targetID)) return api.sendMessage(getText("notExistBanCommand"), threadID, messageID);
			if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ NOTICE ]"), threadID, messageID);
			if (reason == "all") {
				reason = (global.data.commandBanned.get(targetID)).join(" ");
			}
			const commandNeedBan = reason.split(" ");
			return api.sendMessage(getText("returnUnbanCommand", targetID, ((commandNeedBan.length == global.data.commandBanned.get(targetID).length) ? "all commands" : commandNeedBan.join(", "))), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "unbanCommand",
					targetID,
					commandNeedBan,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
				});
			}, messageID);
		}
  }
}