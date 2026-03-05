
module.exports.config = {
    name: 'busy',
    version: '1.0.0',
    hasPermssion: 2,
    credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
    description: 'Track mentions when bot admin is busy',
    commandCategory: 'Admin',
    usages: 'busy',
    cooldowns: 3
};

const fs = require('fs-extra');
const path = require('path');

module.exports.handleEvent = async function({ api, event, getText }) {
    const { threadID, messageID, senderID, mentions, body } = event;
    const busyDataPath = path.join(__dirname, 'cache/data/busy.json');
    
    try {
        let busyData = {};
        if (fs.existsSync(busyDataPath)) {
            busyData = JSON.parse(fs.readFileSync(busyDataPath, 'utf8'));
        }

        // Check if any admin is in busy mode in this thread
        const threadBusyData = busyData[threadID];
        if (!threadBusyData) return;

        const adminIDs = global.config.ADMINBOT;
        let busyAdmin = null;
        
        for (let adminID of adminIDs) {
            if (threadBusyData[adminID] && threadBusyData[adminID].isBusy) {
                busyAdmin = adminID;
                break;
            }
        }

        if (!busyAdmin) return;

        // Check if admin sent a message (coming back online)
        if (senderID === busyAdmin) {
            const adminData = threadBusyData[busyAdmin];
            if (adminData.mentions && adminData.mentions.length > 0) {
                let reportMsg = "⚝──⭒─⭑─⭒──⚝\n📬 𝐁𝐮𝐬𝐲 𝐑𝐞𝐩𝐨𝐫𝐭:\n\n";
                reportMsg += `💬 𝐘𝐨𝐮 𝐰𝐞𝐫𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 ${adminData.mentions.length} 𝐭𝐢𝐦𝐞(𝐬):\n\n`;
                
                adminData.mentions.forEach((mention, index) => {
                    reportMsg += `${index + 1}. 👤 ${mention.senderName}\n📝 ${mention.message.slice(0, 100)}${mention.message.length > 100 ? '...' : ''}\n⏰ ${mention.time}\n\n`;
                });
                
                reportMsg += "≿━━━━༺❀༻━━━━≾";
                
                await api.sendMessage(reportMsg, threadID, messageID);
            }
            
            // Turn off busy mode silently
            delete threadBusyData[busyAdmin];
            if (Object.keys(threadBusyData).length === 0) {
                delete busyData[threadID];
            }
            fs.writeFileSync(busyDataPath, JSON.stringify(busyData, null, 2));
            return;
        }

        // Check if admin was mentioned
        if (mentions && mentions[busyAdmin]) {
            const senderName = global.data.userName.get(senderID) || 'Unknown User';
            const currentTime = new Date().toLocaleString();
            
            if (!threadBusyData[busyAdmin].mentions) {
                threadBusyData[busyAdmin].mentions = [];
            }
            
            threadBusyData[busyAdmin].mentions.push({
                senderID: senderID,
                senderName: senderName,
                message: body,
                time: currentTime,
                messageID: messageID
            });
            
            fs.writeFileSync(busyDataPath, JSON.stringify(busyData, null, 2));
        }
        
    } catch (error) {
        console.error('Error in busy handleEvent:', error);
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const busyDataPath = path.join(__dirname, 'cache/data/busy.json');
    
    try {
        let busyData = {};
        if (fs.existsSync(busyDataPath)) {
            busyData = JSON.parse(fs.readFileSync(busyDataPath, 'utf8'));
        }
        
        if (!busyData[threadID]) {
            busyData[threadID] = {};
        }
        
        if (!busyData[threadID][senderID]) {
            busyData[threadID][senderID] = { isBusy: false, mentions: [] };
        }
        
        const currentStatus = busyData[threadID][senderID].isBusy;
        const command = args[0] ? args[0].toLowerCase() : '';
        
        if (command === 'on') {
            if (currentStatus) {
                return api.sendMessage("⚠️ 𝐁𝐮𝐬𝐲 𝐦𝐨𝐝𝐞 𝐢𝐬 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐚𝐜𝐭𝐢𝐯𝐞!", threadID, messageID);
            }
            
            busyData[threadID][senderID] = {
                isBusy: true,
                mentions: [],
                startTime: new Date().toLocaleString()
            };
            
            fs.writeFileSync(busyDataPath, JSON.stringify(busyData, null, 2));
            
            return api.sendMessage("⚝──⭒─⭑─⭒──⚝\n🔕 𝐁𝐮𝐬𝐲 𝐌𝐨𝐝𝐞 𝐀𝐜𝐭𝐢𝐯𝐚𝐭𝐞𝐝\n\n📝 I will track all mentions while you're away.\n💬 Send any message to get your mention report.\n\n≿━━━━༺❀༻━━━━≾", threadID, messageID);
            
        } else if (command === 'off') {
            if (!currentStatus) {
                return api.sendMessage("⚠️ 𝐁𝐮𝐬𝐲 𝐦𝐨𝐝𝐞 𝐢𝐬 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐨𝐟𝐟!", threadID, messageID);
            }
            
            const adminData = busyData[threadID][senderID];
            let reportMsg = "";
            
            if (adminData.mentions && adminData.mentions.length > 0) {
                reportMsg = "⚝──⭒─⭑─⭒──⚝\n📬 𝐁𝐮𝐬𝐲 𝐑𝐞𝐩𝐨𝐫𝐭:\n\n";
                reportMsg += `💬 𝐘𝐨𝐮 𝐰𝐞𝐫𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 ${adminData.mentions.length} 𝐭𝐢𝐦𝐞(𝐬):\n\n`;
                
                adminData.mentions.forEach((mention, index) => {
                    reportMsg += `${index + 1}. 👤 ${mention.senderName}\n📝 ${mention.message.slice(0, 100)}${mention.message.length > 100 ? '...' : ''}\n⏰ ${mention.time}\n\n`;
                });
                
                reportMsg += "≿━━━━༺❀༻━━━━≾\n\n";
            }
            
            delete busyData[threadID][senderID];
            if (Object.keys(busyData[threadID]).length === 0) {
                delete busyData[threadID];
            }
            fs.writeFileSync(busyDataPath, JSON.stringify(busyData, null, 2));
            
            reportMsg += "⚝──⭒─⭑─⭒──⚝\n🔔 𝐁𝐮𝐬𝐲 𝐌𝐨𝐝𝐞 𝐃𝐞𝐚𝐜𝐭𝐢𝐯𝐚𝐭𝐞𝐝\n\n≿━━━━༺❀༻━━━━≾";
            
            return api.sendMessage(reportMsg, threadID, messageID);
            
        } else {
            // Default behavior - toggle busy mode
            if (!currentStatus) {
                // Turn on busy mode
                busyData[threadID][senderID] = {
                    isBusy: true,
                    mentions: [],
                    startTime: new Date().toLocaleString()
                };
                
                fs.writeFileSync(busyDataPath, JSON.stringify(busyData, null, 2));
                
                return api.sendMessage("⚝──⭒─⭑─⭒──⚝\n🔕 𝐁𝐮𝐬𝐲 𝐌𝐨𝐝𝐞 𝐀𝐜𝐭𝐢𝐯𝐚𝐭𝐞𝐝\n\n📝 I will track all mentions while you're away.\n💬 Send any message to get your mention report.\n📋 𝐔𝐬𝐞: .busy on/off to control manually\n\n≿━━━━༺❀༻━━━━≾", threadID, messageID);
            } else {
                return api.sendMessage("⚠️ 𝐁𝐮𝐬𝐲 𝐦𝐨𝐝𝐞 𝐢𝐬 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐚𝐜𝐭𝐢𝐯𝐞! 𝐔𝐬𝐞 .busy off 𝐭𝐨 𝐝𝐞𝐚𝐜𝐭𝐢𝐯𝐚𝐭𝐞.", threadID, messageID);
            }
        }
        
    } catch (error) {
        console.error('Error in busy command:', error);
        return api.sendMessage("❌ 𝐄𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐬𝐞𝐭𝐭𝐢𝐧𝐠 𝐛𝐮𝐬𝐲 𝐦𝐨𝐝𝐞.", threadID, messageID);
    }
};
