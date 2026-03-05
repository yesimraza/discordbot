module.exports.config = {
    name: "spamcmt",
    version: "1.1.1",
    hasPermssion: 2,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Spam comments utility",
    commandCategory: "Utilities",
    usages: "[]",
    cooldowns: 0,
};

let botID; 
const moment = require("moment-timezone");
const fs = require("fs-extra");
const path = __dirname + "cache/spamcmt.json";

function getGUID() {
    var sectionLength = Date.now();
    var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.floor((sectionLength + Math.random() * 16) % 16);
        sectionLength = Math.floor(sectionLength / 16);
        var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
        return _guid;
    });
    return id;
}

module.exports.run = async function ({ api, event, args }) {
    const op = args[0] ? args[0].toLowerCase() : '';

    if (op === "settoken") {
        const nhapArr = args.slice(1).join(" ").split(",").map(item => item.trim());

        if (nhapArr.every(item => item !== "")) {
            updateData("live", nhapArr);
            api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝐓𝐨𝐤𝐞𝐧𝐬 𝐬𝐚𝐯𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 ✅\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID);
        } else {
            api.sendMessage("⚠️ 𝐄𝐫𝐫𝐨𝐫: 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐭𝐨𝐤𝐞𝐧 𝐢𝐧𝐩𝐮𝐭!", event.threadID);
        }
    } else if (op === "nd") {
        const nhapArr = args.slice(1).join(" ").split(",").map(item => item.trim());

        if (nhapArr.every(item => item !== "")) {
            updateData("text", nhapArr);
            api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n𝐂𝐨𝐧𝐭𝐞𝐧𝐭 𝐬𝐚𝐯𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 ✅\n\n⚝──⭒─⭑─⭒──⚝", event.threadID);
        } else {
            api.sendMessage("⚠️ 𝐄𝐫𝐫𝐨𝐫: 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐨𝐧𝐭𝐞𝐧𝐭!", event.threadID);
        }
    } else if (op.includes("on")) {
        const spamcmtData = loadData();

        if (spamcmtData.spamcmt.ID.length > 0) {
            updateData("on", true);
            api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n𝐒𝐩𝐚𝐦 𝐟𝐮𝐧𝐜𝐭𝐢𝐨𝐧 𝐞𝐧𝐚𝐛𝐥𝐞𝐝 ✅\n\n≿━━━━༺❀༻━━━━≾", event.threadID);
        } else {
            api.sendMessage("⚠️ 𝐂𝐚𝐧𝐧𝐨𝐭 𝐞𝐧𝐚𝐛𝐥𝐞 𝐬𝐩𝐚𝐦: 𝐧𝐨 𝐈𝐃 𝐬𝐞𝐭!", event.threadID);
        }
    } else if (op.includes("off")) {
        updateData("on", false);
        api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n𝐒𝐩𝐚𝐦 𝐟𝐮𝐧𝐜𝐭𝐢𝐨𝐧 𝐝𝐢𝐬𝐚𝐛𝐥𝐞𝐝 ❌\n\n≿━━━━༺❀༻━━━━≾", event.threadID);
    } else if (op === "start") {
        const nhapArr = args.slice(1).join(" ").split(",").map(item => item.trim());

        if (nhapArr.length === 0) {
            api.sendMessage("⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐆𝐫𝐨𝐮𝐩 𝐈𝐃!", event.threadID);
        } else if (nhapArr.some(item => isNaN(item))) {
            api.sendMessage("⚠️ 𝐆𝐫𝐨𝐮𝐩 𝐈𝐃 𝐦𝐮𝐬𝐭 𝐛𝐞 𝐧𝐮𝐦𝐞𝐫𝐢𝐜!", event.threadID);
        } else {
            const arrayLink = await getAllFeedGroup(nhapArr);
            updateData("ID", nhapArr);
            console.log(arrayLink)

            api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n𝐒𝐩𝐚𝐦 𝐬𝐭𝐚𝐫𝐭𝐞𝐝 🚀\n\n⚝──⭒─⭑─⭒──⚝", event.threadID);
        }
    } else if (op === "check") {
        const spamcmtData = loadData();

        const liveLength = spamcmtData.spamcmt.live.length;
        const dieLength = spamcmtData.spamcmt.die.length;
        const textLength = spamcmtData.spamcmt.text.length;
        const onStatus = spamcmtData.spamcmt.on ? "Enabled ✅" : "Disabled ❌";

        const message = `≿━━━━༺❀༻━━━━≾

𝐒𝐩𝐚𝐦 𝐂𝐡𝐞𝐜𝐤 𝐒𝐭𝐚𝐭𝐮𝐬:

• 𝐓𝐨𝐤𝐞𝐧𝐬 (𝐋𝐢𝐯𝐞): ${liveLength}
• 𝐓𝐨𝐤𝐞𝐧𝐬 (𝐃𝐢𝐞): ${dieLength}
• 𝐓𝐞𝐱𝐭 𝐄𝐧𝐭𝐫𝐢𝐞𝐬: ${textLength}
• 𝐒𝐭𝐚𝐭𝐮𝐬: ${onStatus}

≿━━━━༺❀༻━━━━≾`;

        api.sendMessage(message, event.threadID);
    } else if (op === "list") {
        const spamcmtData = loadData();
        const nhapArr = args.slice(1).join(" ").toLowerCase();

        let message = "";

        if (nhapArr === "live" || nhapArr === "die" || nhapArr === "txt" || nhapArr === "token") {
            const dataKey = nhapArr === "token" ? "live" : nhapArr;
            const dataList = spamcmtData.spamcmt[dataKey];

            if (dataList.length > 0) {
                message = `⚝──⭒─⭑─⭒──⚝\n\n𝐋𝐢𝐬𝐭 ${nhapArr}:\n${dataList.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n⚝──⭒─⭑─⭒──⚝`;
            } else {
                message = `⚠️ 𝐍𝐨 𝐝𝐚𝐭𝐚 𝐟𝐨𝐮𝐧𝐝 𝐟𝐨𝐫 ${nhapArr}.`;
            }
        } else {
            message = "⚠️ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐡𝐨𝐢𝐜𝐞! 𝐔𝐬𝐞 'live', 'die', 'txt', 𝐨𝐫 'token'.";
        }

        api.sendMessage(message, event.threadID);
    } else {
        api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝐆𝐮𝐢𝐝𝐞:\n\n• settoken + token → 𝐚𝐝𝐝 𝐭𝐨𝐤𝐞𝐧\n• nd + text → 𝐚𝐝𝐝 𝐜𝐨𝐧𝐭𝐞𝐧𝐭\n• on → 𝐞𝐧𝐚𝐛𝐥𝐞\n• off → 𝐝𝐢𝐬𝐚𝐛𝐥𝐞\n• start + ID → 𝐬𝐭𝐚𝐫𝐭\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID);
    }

    function loadData() {
        let spamcmtData;
        try {
            spamcmtData = JSON.parse(fs.readFileSync(path, "utf-8"));
        } catch (error) {
            console.log("Creating new spamcmt.json...");
            spamcmtData = {
                spamcmt: {
                    live: [],
                    die: [],
                    ID: [],
                    on: false,
                    text: []
                }
            };
        }
        return spamcmtData;
    }

    function updateData(key, value) {
        const spamcmtData = loadData();

        if (spamcmtData.spamcmt.hasOwnProperty(key)) {
            if (Array.isArray(spamcmtData.spamcmt[key])) {
                value.forEach(item => {
                    if (!spamcmtData.spamcmt[key].includes(item)) {
                        spamcmtData.spamcmt[key].push(item);
                    }
                });
            } else {
                spamcmtData.spamcmt[key] = value;
            }
        }

        fs.writeFileSync(path, JSON.stringify(spamcmtData, null, 4));
    }
};

module.exports.onLoad = async ({ api }) => {
    botID = global.client.api.getCurrentUserID();

    if (!fs.existsSync(path) || fs.statSync(path).isDirectory()) {
        fs.writeFileSync(
            path,
            JSON.stringify(
                {
                    spamcmt: {
                        data: {
                            live: [],
                            die: [],
                            ID: []
                        },
                        on: false,
                        text: []
                    }
                },
                null,
                4
            )
        );
    }
};

async function getAllFeedGroup() {
    return new Promise((resolve, reject) => {
        var listLinkFeed = [];
        var form = {
            av: botID,
            fb_api_caller_class: "RelayModern",
            fb_api_req_friendly_name: "GroupsCometFeedRegularStoriesPaginationQuery",
            variables: JSON.stringify({
                UFI2CommentsProvider_commentsKey: "CometGroupDiscussionRootSuccessQuery",
                count: 3,
                feedLocation: "GROUP",
                feedType: "DISCUSSION",
                renderLocation: "group",
                scale: 1.5,
                stream_initial_count: 9,
                id: nhapArr,
                __relay_internal__pv__IsWorkUserrelayprovider: false,
                __relay_internal__pv__IsMergQAPollsrelayprovider: false,
                __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
                __relay_internal__pv__CometUFIIsRTAEnabledrelayprovider: true,
                __relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider: true,
                __relay_internal__pv__StoriesRingrelayprovider: false,
            }),
            server_timestamps: "true",
            doc_id: "6576509869144318",
        };
        global.client.api.httpPost("https://www.facebook.com/api/graphql/", form, (e, info) => {
            if (e) {
                console.log(e);
                reject(e);
            }
            const rawData = info;
            const regexPattern = /\},"metadata":([\s\S]*?),"title":{"__typename":"Com/g;
            const matches = [...rawData.matchAll(regexPattern)];
            const metadataList = matches.map((match) => match[1]);
            const parsedMetadataList = metadataList.map((metadata) => {
                try {
                    const tt = JSON.parse(metadata);
                    for (const i of tt) {
                        if (i.__typename == "CometFeedStoryMinimizedTimestampStrategy") {
                            if (i.story.url) {
                                const find = listLinkFeed.find((item) => item === i.story.url);
                                if (!find) {
                                    listLinkFeed.push(i.story.url);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("⚠️ Cannot get group feed.");
                    return false;
                }
            });

            resolve(listLinkFeed);
        });
    });
}