module.exports.config = {
    name: "topbox",
    version: "1.1.1",
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    hasPermssion: 0,
    description: "View top money, level in box or server",
    usages: "[boxmoney|boxlevel|svmoney|svlevel] + list length (default 10)",
    commandCategory: "Members",
    cooldowns: 5
};
module.exports.run = async function({
    api: a,
    event: e,
    args: g,
    Currencies,
    Users
}) {
    const {
        threadID: t,
        messageID: m,
        senderID: s,
        participantIDs: pI
    } = e
    var arr = [],
        newArr = [],
        msg = "",
        type = g[0],
        leng = parseInt(g[1]) - 1
    const allType = ["boxmoney", "boxlevel", "svmoney", "svlevel"]
    if (!allType.includes(type)) return a.sendMessage(
`⚝──⭒─⭑─⭒──⚝

𝗧𝗢𝗣 𝗠𝗘𝗡𝗨
━━━━━━━━━━━━━━━━
Enter the 𝗧𝗢𝗣 you want to view:
→ boxmoney: Top richest in the group
→ boxlevel: Top interaction level in the group
→ svmoney: Top 10 richest users in the bot system
→ svlevel: Top 10 highest level users in the bot system
━━━━━━━━━━━━━━━━
Example: /top svmoney

⚝──⭒─⭑─⭒──⚝`, t, m)
    if (isNaN(leng) && leng) return a.sendMessage("≿━━━━༺❀༻━━━━≾\n\n𝗟𝗶𝘀𝘁 𝗹𝗲𝗻𝗴𝘁𝗵 𝗺𝘂𝘀𝘁 𝗯𝗲 𝗮 𝗻𝘂𝗺𝗯𝗲𝗿\n\n≿━━━━༺❀༻━━━━≾", t, m)
    switch (type) {
        case "boxmoney": {
            for (const id of pI) {
                let money = (await Currencies.getData(id)).money || 0
                arr.push({ id: id, money: money })
            }
            arr.sort(S("money"))
            for (const i in arr) {
                newArr.push({ stt: i, id: arr[i].id, money: arr[i].money })
            }
            msg = "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗧𝗢𝗣 𝟭𝟬 𝗚𝗥𝗢𝗨𝗣 𝗥𝗜𝗖𝗛𝗘𝗦𝗧\n━━━━━━━━━━━━━━━━━━\n"
            for (const i in newArr) {
                let name = (await Users.getData(newArr[i].id)).name || ""
                msg += `${i < 4 ? ICON(i) : `${i}.`} ${name}\n→ Money: ${CC(newArr[i].money)}$\n\n`
                if (i == leng && i < newArr.length || i == 10) break
            }
            let find = newArr.find(i => i.id == s)
            msg += TX("money", find.stt, find.money) + "\n༻﹡﹡﹡﹡﹡﹡﹡༺"
            a.sendMessage(msg, t, m)
        }
        break
    case "boxlevel": {
        for (const id of pI) {
            let exp = (await Currencies.getData(id)).exp || 0
            arr.push({ id: id, exp: exp })
        }
        arr.sort(S("exp"))
        for (const i in arr) {
            newArr.push({ stt: i, id: arr[i].id, exp: arr[i].exp })
        }
        msg = "⚝──⭒─⭑─⭒──⚝\n\n𝗧𝗢𝗣 𝟭𝟬 𝗚𝗥𝗢𝗨𝗣 𝗟𝗘𝗩𝗘𝗟𝗦\n━━━━━━━━━━━━━━━━━━\n"
        for (const i in newArr) {
            let name = (await Users.getData(newArr[i].id)).name || ""
            msg += `${i < 4 ? ICON(i) : `${i}.`} ${name}\n→ Level: ${LV(newArr[i].exp)}\n\n`
            if (i == leng && i < newArr.length || i == 10) break
        }
        let find = newArr.find(i => i.id == s)
        msg += TX("level", find.stt, find.exp) + "\n⚝──⭒─⭑─⭒──⚝"
        a.sendMessage(msg, t, m)
    }
    break
    case "svlevel": {
        let get = await Currencies.getAll(['userID', 'exp'])
        get.sort(S("exp"))
        for (const i in get) {
            arr.push({ stt: i, id: get[i].userID, exp: get[i].exp })
        }
        msg = "≿━━━━༺❀༻━━━━≾\n\n𝗧𝗢𝗣 𝟭𝟬 𝗦𝗘𝗥𝗩𝗘𝗥 𝗟𝗘𝗩𝗘𝗟𝗦\n━━━━━━━━━━━━━━━━━━\n"
        for (const i in arr) {
            let name = (await Users.getData(arr[i].id)).name || ""
            msg += `${i < 4 ? ICON(i) : `${i}.`} ${name}\n→ Level: ${LV(arr[i].exp)}\n\n`
            if (i == leng && i < arr.length || i == 10) break
        }
        let find = arr.find(i => i.id == s)
        msg += TX("level", find.stt, find.exp) + "\n≿━━━━༺❀༻━━━━≾"
        a.sendMessage(msg, t, m)
    }
    break
    case "svmoney": {
        let get = await Currencies.getAll(['userID', 'money'])
        get.sort(S("money"))
        for (const i in get) {
            arr.push({ stt: i, id: get[i].userID, money: get[i].money })
        }
        msg = "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗧𝗢𝗣 𝟭𝟬 𝗦𝗘𝗥𝗩𝗘𝗥 𝗥𝗜𝗖𝗛𝗘𝗦𝗧\n━━━━━━━━━━━━━━━━━━\n"
        for (const i in arr) {
            let name = (await Users.getData(arr[i].id)).name || ""
            msg += `${i < 4 ? ICON(i) : `${i}.`} ${name}\n→ Money: ${CC(arr[i].money)}$\n\n`
            if (i == leng && i < arr.length || i == 10) break
        }
        let find = arr.find(i => i.id == s)
        msg += TX("money", find.stt, find.money) + "\n༻﹡﹡﹡﹡﹡﹡﹡༺"
        a.sendMessage(msg, t, m)
    }
    break
    }
}

function LV(x) {
    return Math.floor((Math.sqrt(1 + (4 * x) / 3) + 1) / 2)
}

function CC(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2 })
}

function ICON(i) {
    return i == 0 ? "🏆" : i == 1 ? "🥇" : i == 2 ? "🥈" : i == 3 ? "🥉" : ""
}

function S(k) {
    return function(a, b) {
        let i = 0;
        if (a[k] > b[k]) { i = 1 }
        else if (a[k] < b[k]) { i = -1 }
        return i * -1
    }
}

function TX(tx, i, x) {
  return `━━━━━━━━━━━━━━━━━━\n${i >= 11 ? `→ Your rank: ${i}\n→ ${tx == "money" ? `Money: ${CC(x)}$` : `Level: ${LV(x)}`}` : i >= 1 && i <= 4 ? "→ You are currently in the 𝗧𝗢𝗣 " : i == 0 ? "→ You are currently at the 𝗧𝗢𝗣" : "→ You are in the 𝗧𝗢𝗣 10"}`
}