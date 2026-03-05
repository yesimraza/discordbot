module.exports.config = {
	name: "setname",
	version: "2.0.0",
	hasPermssion: 1,
	credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
	description: "Change nickname in group for yourself or tagged user",
	commandCategory: "Admin",
	usages: "empty/tag/check/all/del/call + name",
	cooldowns: 5
}

module.exports.run = async ({ api, event, args, Users }) => {
	let { threadID, messageReply, senderID, mentions, type, participantIDs } = event;
	switch(args[0]){
        case 'call':
        case 'Call': {
            const dataNickName = (await api.getThreadInfo(threadID)).nicknames;
            const objKeys = Object.keys(dataNickName);
            const notFoundIds = participantIDs.filter(id => !objKeys.includes(id));
            const mentions = [];
            
            let tag = '';
            for (let i = 0; i < notFoundIds.length; i++) {
                const id = notFoundIds[i];
                const name = await Users.getNameUser(id);
                mentions.push({ tag: name, id });
                
                tag += `${i + 1}. @${name}\n`;
            }
        
            const bd = '≿━━━━༺❀༻━━━━≾\n\n📣 𝐏𝐥𝐞𝐚𝐬𝐞 𝐬𝐞𝐭 𝐲𝐨𝐮𝐫 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞 𝐬𝐨 𝐨𝐭𝐡𝐞𝐫𝐬 𝐜𝐚𝐧 𝐫𝐞𝐜𝐨𝐠𝐧𝐢𝐳𝐞 𝐲𝐨𝐮 𝐞𝐚𝐬𝐢𝐥𝐲.\n\n≿━━━━༺❀༻━━━━≾';
            
            const message = {
                body: `${bd}\n\n${tag}`,
                mentions: mentions
            };
            api.sendMessage(message, threadID);
            return;
        }                          
        
		case 'del':
		case 'Del': {
			const threadInfo = await api.getThreadInfo(threadID);
			if (!threadInfo.adminIDs.some(admin => admin.id === senderID)) {
				return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n⚠️ 𝐎𝐧𝐥𝐲 𝐚𝐝𝐦𝐢𝐧𝐬 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID);
			}
			const dataNickName = threadInfo.nicknames
			const objKeys = Object.keys(dataNickName);
			const notFoundIds = participantIDs.filter(id => !objKeys.includes(id));
			await notFoundIds.map(async (id)=> {
				try{
					api.removeUserFromGroup(id, threadID)
				}catch(e){
					console.log(e)
				}
			});
			return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐫𝐞𝐦𝐨𝐯𝐞𝐝 𝐦𝐞𝐦𝐛𝐞𝐫𝐬 𝐰𝐢𝐭𝐡𝐨𝐮𝐭 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞.\n\n⚝──⭒─⭑─⭒──⚝`,threadID)
		}
		case 'check':
		case 'Check': {
			const dataNickName = (await api.getThreadInfo(threadID)).nicknames
			const objKeys = Object.keys(dataNickName);
			const notFoundIds = participantIDs.filter(id => !objKeys.includes(id));
			let msg = '📝 𝐋𝐢𝐬𝐭 𝐨𝐟 𝐮𝐬𝐞𝐫𝐬 𝐰𝐢𝐭𝐡𝐨𝐮𝐭 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞:\n',
				num = 1;
			await notFoundIds.map(async (id)=> {
				const name = await Users.getNameUser(id)
				msg += `\n${num++}. ${name}`
			});
            msg += `\n\n📌 𝐑𝐞𝐚𝐜𝐭 𝐭𝐨 𝐭𝐡𝐢𝐬 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐭𝐨 𝐤𝐢𝐜𝐤 𝐭𝐡𝐞𝐦 𝐨𝐮𝐭.`
			return api.sendMessage(msg,threadID,(error, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    abc: notFoundIds
                })
            })
		}
		break;
		case 'help':
            return api.sendMessage(
                `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n` +
                `1. "setname + name" -> 𝐂𝐡𝐚𝐧𝐠𝐞 𝐲𝐨𝐮𝐫 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞\n` +
                `2. "setname @tag + name" -> 𝐂𝐡𝐚𝐧𝐠𝐞 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞 𝐨𝐟 𝐭𝐚𝐠𝐠𝐞𝐝 𝐮𝐬𝐞𝐫\n` +
                `3. "setname all + name" -> 𝐂𝐡𝐚𝐧𝐠𝐞 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞 𝐟𝐨𝐫 𝐚𝐥𝐥 𝐦𝐞𝐦𝐛𝐞𝐫𝐬\n` +
                `4. "setname check" -> 𝐒𝐡𝐨𝐰 𝐮𝐬𝐞𝐫𝐬 𝐰𝐢𝐭𝐡𝐨𝐮𝐭 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞\n` +
                `5. "setname del" -> 𝐃𝐞𝐥𝐞𝐭𝐞 𝐮𝐬𝐞𝐫𝐬 𝐰𝐢𝐭𝐡𝐨𝐮𝐭 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞 (𝐚𝐝𝐦𝐢𝐧𝐬 𝐨𝐧𝐥𝐲)\n` +
                `6. "setname call" -> 𝐑𝐞𝐪𝐮𝐞𝐬𝐭 𝐮𝐬𝐞𝐫𝐬 𝐭𝐨 𝐬𝐞𝐭 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞\n\n` +
                `༻﹡﹡﹡﹡﹡﹡﹡༺`, threadID);

		case 'all':
		case 'All': {
			try{
				const name = (event.body).split('all')[1]
				for(const i of participantIDs){
					try{
						api.changeNickname(name, threadID, i)
					}catch(e){
						console.log(e)
					}
				}
				return api.sendMessage(`✅ 𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞 𝐜𝐡𝐚𝐧𝐠𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐟𝐨𝐫 𝐚𝐥𝐥 𝐦𝐞𝐦𝐛𝐞𝐫𝐬.`,threadID)
			}catch(e) {
				return console.log(e,threadID)
			}
		}
		break;
	}
	const delayUnsend = 60;
    if (type === "message_reply") {
        const name = args.join(' ');
        const name2 = await Users.getNameUser(messageReply.senderID);

        api.changeNickname(name, threadID, messageReply.senderID, (err) => {
            if (!err) {
                api.sendMessage(`✅ 𝐂𝐡𝐚𝐧𝐠𝐞𝐝 𝐧𝐚𝐦𝐞 𝐨𝐟 ${name2} 𝐭𝐨 ${name || "original name"}`, threadID, (error, info) => {
                    if (!error) {
                        setTimeout(() => {
                            api.unsendMessage(info.messageID);
                        }, delayUnsend * 1000);
                    }
                });
            } else {
                api.sendMessage(`❎ 𝐆𝐫𝐨𝐮𝐩𝐬 𝐢𝐧𝐯𝐢𝐭𝐞 𝐥𝐢𝐧𝐤 𝐧𝐨𝐭 𝐝𝐢𝐬𝐚𝐛𝐥𝐞𝐝!!`, threadID);
            }
        });
    } else {
        const mention = Object.keys(mentions)[0];
        const name2 = await Users.getNameUser(mention || senderID);

        if (args.join().indexOf('@') !== -1) {
            const name = args.join(' ').replace(mentions[mention], '');

            api.changeNickname(name, threadID, mention, (err) => {
                if (!err) {
                    api.sendMessage(`✅ 𝐂𝐡𝐚𝐧𝐠𝐞𝐝 𝐧𝐚𝐦𝐞 𝐨𝐟 ${name2} 𝐭𝐨 ${name || "original name"}`, threadID, (error, info) => {
                        if (!error) {
                            setTimeout(() => {
                                api.unsendMessage(info.messageID);
                            }, delayUnsend * 1000);
                        }
                    });
                } else {
                    api.sendMessage(`❎ 𝐆𝐫𝐨𝐮𝐩𝐬 𝐢𝐧𝐯𝐢𝐭𝐞 𝐥𝐢𝐧𝐤 𝐧𝐨𝐭 𝐝𝐢𝐬𝐚𝐛𝐥𝐞𝐝!!`, threadID);
                }
            });
        } else {
            const name = args.join(" ");

            api.changeNickname(name, threadID, senderID, (err) => {
                if (!err) {
                    api.sendMessage(`✅ 𝐂𝐡𝐚𝐧𝐠𝐞𝐝 𝐲𝐨𝐮𝐫 𝐧𝐚𝐦𝐞 𝐭𝐨 ${name || "original name"}`, threadID, (error, info) => {
                        if (!error) {
                            setTimeout(() => {
                                api.unsendMessage(info.messageID);
                            }, delayUnsend * 1000);
                        }
                    });
                } else {
                    api.sendMessage(`❎ 𝐆𝐫𝐨𝐮𝐩𝐬 𝐢𝐧𝐯𝐢𝐭𝐞 𝐥𝐢𝐧𝐤 𝐧𝐨𝐭 𝐝𝐢𝐬𝐚𝐛𝐥𝐞𝐝!!`, threadID);
                }
            });
        }
    }
}

module.exports.handleReaction = async function({ api, event, handleReaction }) {
    if (event.userID != handleReaction.author) return;
    if (Array.isArray(handleReaction.abc) && handleReaction.abc.length > 0) {
        let errorMessage = '';
        let successMessage = `✅ 𝐑𝐞𝐦𝐨𝐯𝐞𝐝 ${handleReaction.abc.length} 𝐦𝐞𝐦𝐛𝐞𝐫𝐬 𝐰𝐢𝐭𝐡𝐨𝐮𝐭 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞.`;
        let errorOccurred = false;

        for (let i = 0; i < handleReaction.abc.length; i++) {
            const userID = handleReaction.abc[i];
            try {
                await api.removeUserFromGroup(userID, event.threadID);
            } catch (error) {
                errorOccurred = true;
                errorMessage += `⚠️ 𝐄𝐫𝐫𝐨𝐫 𝐰𝐡𝐢𝐥𝐞 𝐫𝐞𝐦𝐨𝐯𝐢𝐧𝐠 ${userID} 𝐟𝐫𝐨𝐦 𝐠𝐫𝐨𝐮𝐩.\n`;
            }
        }
        api.sendMessage(errorOccurred ? errorMessage : successMessage, event.threadID);
    } else {
        api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ 𝐍𝐨 𝐮𝐬𝐞𝐫𝐬 𝐟𝐨𝐮𝐧𝐝!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID);
    }
}