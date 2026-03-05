module.exports.config = {
    name: "joinnoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "Mirai Team",
    description: "Notify when bot or user joins group + shareContact",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};

let _0 = x => x < 10 ? '0' + x : x;
let time_str = time => (d => `${_0(d.getHours())}:${_0(d.getMinutes())}:${_0(d.getSeconds())} - ${_0(d.getDate())}/${_0(d.getMonth() + 1)}/${d.getFullYear()} (${d.getDay() == 0 ? 'Sunday' : 'Day ' + d.getDay() + 1})`)(new Date(time));

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "joinGif");
    if (existsSync(path)) mkdirSync(path, { recursive: true });

    const path2 = join(__dirname, "cache", "joinGif", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}

module.exports.run = async function ({ api, event, Users, Threads }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    const thread = global.data.threadData.get(threadID) || {};
    if (typeof thread["joinNoti"] != "undefined" && thread["joinNoti"] == false) return;

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "Made by Raza" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
        const fs = require("fs");
        var mlg = "✅ Bot successfully connected to the group!\n🔥 All commands are now available for everyone to use.\n📝 Type 'help' to see all available commands.\n─────────────────\n🌐 Facebook: https://www.facebook.com/100001854531633";
        return api.sendMessage(mlg, threadID);
    } else {
        try {
            let thread_data = await Threads.getData(threadID);

            if (!!thread_data) {
                let send = msg => api.sendMessage(msg, threadID);
                let asnn = thread_data && thread_data.data ? thread_data.data.auto_set_nickname : null;

                if (!!asnn && !!asnn.all) {
                    let time_join = time_str(Date.now() + 25200000);
                    for (let {
                        fullName,
                        firstName,
                        userFbId: id,
                    } of event.logMessageData.addedParticipants) try {
                        let name_set = asnn.all.replace(/\${full_name}/g, fullName).replace(/\${short_name}/g, firstName).replace(/\${time_join}/g, time_join);
                        await new Promise(resolve => api.changeNickname(name_set, threadID, id, (err, res) => resolve()));
                    } catch { };

                    send(`Nickname set for new member`);
                }
            }

            const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);
            const moment = require("moment-timezone");
            const time = moment.tz("Asia/Karachi").format(" hh:mm:ss A - DD/MM/YYYY");
            const hours = moment.tz("Asia/Karachi").format("hh");
            var thu = moment.tz('Asia/Karachi').format('dddd');
            if (thu == 'Sunday') thu = 'Sunday';
            if (thu == 'Monday') thu = 'Monday';
            if (thu == 'Tuesday') thu = 'Tuesday';
            if (thu == 'Wednesday') thu = 'Wednesday';
            if (thu == 'Thursday') thu = 'Thursday';
            if (thu == 'Friday') thu = 'Friday';
            if (thu == 'Saturday') thu = 'Saturday';
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};

            var mentions = [], nameArray = [], memLength = [], iduser = [], i = 0;

            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                iduser.push(event.logMessageData.addedParticipants[id].userFbId.toString());
                nameArray.push(userName);
                mentions.push({ tag: userName, id: event.senderID });
                memLength.push(participantIDs.length - i++);
                console.log(userName);
            }
            memLength.sort((a, b) => a - b);

            const poetry = [
                "Khush amdeed kehte hain hum dil ki gehraiyon se,\nAap ke aane se rounaq barh gayi is mehfil ki fizayon se. ✨",
                "Phoolon ki mehak aur taron ki chamak aap ke naam,\nIs group mein aapka swagat hai subha-o-shaam. 🌸",
                "Naye chehre, nayi umeedain, naya ek sath,\nAap ke aane se hui hai ek khoobsurat shuruat. 🤝",
                "Dil ki dehleez par rakha hai aap ne kadam,\nAap ka ana hamare liye hai khushiyon ka mausam. 🌈",
                "Mehfil-e-Raza mein aapka dil se khair-muqadam,\nAap ke sath se har lamha ban jaye ga pur-dum. 💎",
                "Sitare asman se zameen par utar aaye,\nAap aye toh laga group mein bahaar aaye. 🎭"
            ];
            const randomPoetry = poetry[Math.floor(Math.random() * poetry.length)];

            let msg = (typeof threadData.customJoin == "undefined") ? "‎━━━━━━━━━━━━━━━━━━━━━━━━━\n       ✨ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐓𝐇𝐄 𝐆𝐑𝐎𝐔𝐏 ✨\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📜 *{poetry}*\n\n🎀 **Welcome {name}** to {threadName}\n👤 You are the **{soThanhVien}th** member here\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n👤 **Added by:** {author}\n⏰ **Time:** {time}\n📆 **Day:** {thu}\n🌤️ **Session:** {session}\n━━━━━━━━━━━━━━━━━━━━━━━━━" : threadData.customJoin;
            var getData = await Users.getData(event.author);
            var nameAuthor = typeof getData.name == "undefined" ? "User joined voluntarily" : getData.name;
            msg = msg
                .replace(/\{poetry}/g, randomPoetry)
                .replace(/\{iduser}/g, iduser.join(', '))
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{type}/g, (memLength.length > 1) ? 'Members' : 'Member')
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{author}/g, nameAuthor)
                .replace(/\{idauthor}/g, event.author)
                .replace(/\{threadName}/g, threadName)
                .replace(/\{thu}/g, thu)
                .replace(/\{session}/g, hours <= 10 ? "morning" :
                    hours > 10 && hours <= 12 ? "noon" :
                    hours > 12 && hours <= 18 ? "afternoon" : "evening")
                .replace(/\{time}/g, time);

            const pathGif = join(__dirname, "cache", "joinGif", "randomgif");
            const allGif = existsSync(pathGif) ? readdirSync(pathGif) : [];
            if (allGif.length > 0) {
                const randomGif = allGif[Math.floor(Math.random() * allGif.length)];
                return api.sendMessage({ body: msg, attachment: createReadStream(join(pathGif, randomGif)) }, threadID);
            }
            return api.sendMessage(msg, threadID);
        } catch (e) { return console.log(e); }
    }
}