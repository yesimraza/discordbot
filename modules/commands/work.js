// Work list
let works = {
    '😠': {
        name: 'Fishing',
        img: 'https://i.imgur.com/DoB5Cw8.gif',
        done: [
            ['{name} just caught a lanternfish and sold it for {money}$', 'https://i.imgur.com/BXng765.jpeg'],
            ['{name} just caught a shark and sold it for {money}$', 'https://i.imgur.com/dyLyvOA.jpeg'],
            ['{name} just caught a mantis shrimp and sold it for {money}$', 'https://i.imgur.com/YJiCTWH.jpeg'],
            ['{name} just caught a tuna and sold it for {money}$', 'https://i.imgur.com/eshOIiJ.jpeg'],
            ['{name} just caught a mackerel and sold it for {money}$', 'https://i.imgur.com/YAS5iGM.jpeg'],
            ['{name} just caught a koi fish and sold it for {money}$', 'https://i.imgur.com/BXwB4xZ.png'],
            ['{name} just caught a catfish and sold it for {money}$', 'https://i.imgur.com/IE6LQU3.png'],
            ['{name} just caught a crayfish and sold it for {money}$', 'https://i.imgur.com/XbSWNha.png'],
            ['{name} just caught a swordfish and sold it for {money}$', 'https://i.imgur.com/nLndbMc.png'],
            ['{name} just caught a parrotfish and sold it for {money}$', 'https://i.imgur.com/7H5XwLb.png'],
            ['{name} just caught a clownfish and sold it for {money}$', 'https://i.imgur.com/cLvJZlM.png'],
            ['{name} just caught a finned fish and sold it for {money}$', 'https://i.imgur.com/jw5bqu7.png'],
            ['{name} just caught a carp and sold it for {money}$', 'https://i.imgur.com/7hVzeDJ.png'],
            ['{name} just caught a great white shark and sold it for {money}$', 'https://i.imgur.com/TuMhGBS.png'],
            ['{name} just caught a hammerhead shark and sold it for {money}$', 'https://i.imgur.com/JDVZ3J7.jpeg'],
            ['{name} just caught a salmon and sold it for {money}$', 'https://i.imgur.com/wKijFF0.png'],
            ['{name} just caught an emperor dinosaur fish and sold it for {money}$', 'https://i.imgur.com/w42NHef.png'],
            ['{name} just caught a red snapper and sold it for {money}$', 'https://i.imgur.com/UjdnHhE.png'],
            ['{name} just caught a wide-mouthed perch and sold it for {money}$', 'https://i.imgur.com/Cw0qh57.png'],
            ['{name} just caught a betta fish and sold it for {money}$', 'https://i.imgur.com/d33003f.png'],
            ['{name} just caught a tilapia and sold it for {money}$', 'https://i.imgur.com/sqBRoDe.png'],
            ['{name} just caught an ocean tuna and sold it for {money}$', 'https://i.imgur.com/A1qXwXV.png'],
            ['{name} just caught a whale shark and sold it for {money}$', 'https://i.imgur.com/K7Qy4mI.png'],
            ['{name} just caught a golden pecca and sold it for {money}$', 'https://i.imgur.com/S9Qqr3D.png'],
            ['{name} just caught a spotted lanternfish and sold it for {money}$', 'https://i.imgur.com/A5XeYbS.png'],
        ]
    },
    '❤': {
        name: 'Hunting Wild Animals',
        img: 'https://i.imgur.com/jc2j4ps.gif',
        done: [
            ['{name} hunted a snake and sold it for {money}$', 'https://i.imgur.com/Q7vv6mG.jpg'],
            ['{name} hunted a Komodo dragon and sold it for {money}$', 'https://i.imgur.com/Y8mfwPN.jpeg'],
            ['{name} hunted a kingfisher and sold it for {money}$', 'https://i.imgur.com/XAM9Ne6.jpeg'],
            ['{name} hunted a brown bear and sold it for {money}$', 'https://i.imgur.com/A3OxqoB.jpeg'],
            ['{name} hunted an anaconda and sold it for {money}$', 'https://i.imgur.com/4z6kr8V.jpeg'],
            ['{name} hunted a deer and sold it for {money}$', 'https://i.imgur.com/lHQKacE.jpg'],
            ['{name} hunted a wild boar and sold it for {money}$', 'https://i.imgur.com/eQQUR3s.jpg'],
            ['{name} hunted a lion and sold it for {money}$', 'https://i.imgur.com/ThGSaPn.jpg'],
        ]
    },
    '😢': { 
        name: 'Mining',
        img: 'https://i.imgur.com/zBWwXzN.gif', 
        done: [ 
            ['{name} mined a diamond and sold it for {money}$', 'https://i.imgur.com/9cHq8nN.png'],
            ['{name} mined gold and sold it for {money}$', 'https://i.imgur.com/HB0Bmqo.jpg'],
            ['{name} mined iron ore and sold it for {money}$', 'https://i.imgur.com/wD0VEZ8.png'],
            ['{name} mined an emerald and sold it for {money}$', 'https://i.imgur.com/NyYurEd.jpg'],
            ['{name} mined an amethyst and sold it for {money}$', 'https://i.imgur.com/8kc5m2L.jpg'],
            ['{name} mined coal and sold it for {money}$', 'https://i.imgur.com/CY3lCqx.jpg'],
            ['{name} mined a rare ruby and sold it for {money}$', 'https://i.imgur.com/OoP1Smk.jpg'],
        ]
    },
    '👍': {
        name: 'Bird Hunting',
        img: 'https://i.imgur.com/4DctekU.gif',
        done: [
            ['{name} hunted a black bird and sold it for {money}$', 'https://i.imgur.com/IPeNm8n.jpeg'],
            ['{name} hunted an eagle and sold it for {money}$', 'https://i.imgur.com/EklUNah.jpeg'],
            ['{name} hunted a swallow and sold it for {money}$', 'https://i.imgur.com/kUhS155.jpeg'],
            ['{name} hunted a warbler and sold it for {money}$', 'https://i.imgur.com/DErkrnd.jpeg'],
            ['{name} hunted a long-tailed bird and sold it for {money}$', 'https://i.imgur.com/PMaurmG.jpeg'],
            ['{name} hunted a magpie and sold it for {money}$', 'https://i.imgur.com/muJCa5P.jpeg'],
            ['{name} hunted a parrot and sold it for {money}$', 'https://i.imgur.com/2nN01CY.jpeg'],
            ['{name} hunted a nightingale and sold it for {money}$', 'https://i.imgur.com/88Cq2Hf.jpeg'],
            ['{name} hunted a bulbul and sold it for {money}$', 'https://i.imgur.com/9R8BrMF.jpeg'],
            ['{name} hunted a sparrow and sold it for {money}$', 'https://i.imgur.com/yZcWTT6.jpeg'],
            ['{name} hunted a golden oriole and sold it for {money}$', 'https://i.imgur.com/bk9a6e4.jpeg'],
            ['{name} hunted a wagtail and sold it for {money}$', 'https://i.imgur.com/SxhsgX2.jpeg'],
            ['{name} hunted a dove and sold it for {money}$', 'https://i.imgur.com/ZdFZQ1N.jpeg'],
            ['{name} hunted a budgerigar and sold it for {money}$', 'https://i.imgur.com/FG61Y7R.jpeg'],
            ['{name} hunted a skylark and sold it for {money}$', 'https://i.imgur.com/XZSGXkL.jpeg'],
        ]
    }
};

exports.config = {
    name: 'work',
    version: '0.0.1',
    hasPermssion: 0,
    credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
    description: 'Work command to earn money',
    commandCategory: 'Earning Money',
    usages: '[]',
    cooldowns: 3
};

let stream_url = url=>require('axios').get(url, {
    responseType: 'stream',
}).then(res=>res.data);
let _0 = x=>x < 10?'0'+x: x;
let random = (min, max)=>Math.random()*(max-min+1)+min<<0;

exports.run = o=>o.api.sendMessage({
        body: `⚝──⭒─⭑─⭒──⚝\n\n𝗪𝗼𝗿𝗸 𝗟𝗶𝘀𝘁\n${Object.entries(works).map(($, i)=>`[${i+1} / ${$[0]}] ${$[1].name}`).join('\n')}\n\n→ React with an icon to do the corresponding job or reply with the number.\n\n⚝──⭒─⭑─⭒──⚝`,
    }, o.event.threadID, (err, res)=>(res.name = exports.config.name, res.event = o.event, global.client.handleReaction.push(res), global.client.handleReply.push(res)), o.event.messageID); 

exports.handleReaction = async o=>{
    let _ = o.handleReaction;
    let uid = o.event.userID;
    let user = await o.Users.getData(uid);if (!user)return send(`≿━━━━༺❀༻━━━━≾\n\n𝗘𝗿𝗿𝗼𝗿\n\n≿━━━━༺❀༻━━━━≾`);
    let data = user.data;
    let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    
    if  (!data)user.data = {};
    if (uid != _.event.senderID)return;
    if (typeof data.work != undefined && data.work>= Date.now())return (x=>send(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗼𝗿𝗸 𝗮𝗴𝗮𝗶𝗻 𝗮𝗳𝘁𝗲𝗿: ${_0(x/1000/60<<0)} minutes ${_0(x/1000%60<<0)} seconds\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`))(data.work-Date.now());

    let work = works[o.event.reaction];
    let msg = {};

    if (!work)return send(`≿━━━━༺❀༻━━━━≾\n\n𝗝𝗼𝗯 𝗻𝗼𝘁 𝗶𝗻 𝘁𝗵𝗲 𝗹𝗶𝘀𝘁\n\n≿━━━━༺❀༻━━━━≾`);

    data.work = Date.now()+(1000*60*60*24);
    o.Users.setData(uid, user);
    let wgm = await new Promise(async resolve=>send({
        body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗗𝗼??𝗻𝗴 ${work.name}...\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
    }, (err, res)=>resolve(res || {})));
    await new Promise(out=>setTimeout(out, 1000*3.5));
    let done = work.done[Math.random()*work.done.length<<0];
    let $ = random(200000, 1000000);
    msg.body = `⚝──⭒─⭑─⭒──⚝\n\n${done[0].replace(/{name}/g, user.name).replace(/{money}/g, $)}\n\n⚝──⭒─⭑─⭒──⚝`;
    send(msg, ()=>o.api.unsendMessage(wgm.messageID));
    o.Currencies.increaseMoney(uid, $);
};

exports.handleReply = async o=>{
    let _ = o.handleReply;
    let uid = o.event.senderID;
    let user = await o.Users.getData(uid);if (!user)return send(`≿━━━━༺❀༻━━━━≾\n\n𝗘𝗿𝗿𝗼𝗿\n\n≿━━━━༺❀༻━━━━≾`);
    let data = user.data;
    let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    
    if  (!data)user.data = {};
    if (uid != _.event.senderID)return;
    if (typeof data.work != undefined && data.work>= Date.now())return (x=>send(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗼𝗿𝗸 𝗮𝗴𝗮𝗶𝗻 𝗮𝗳𝘁𝗲𝗿: ${_0(x/1000/60<<0)} minutes ${_0(x/1000%60<<0)} seconds\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`))(data.work-Date.now());

    let work = Object.values(works)[o.event.body-1];
    let msg = {};

    if (!work)return send(`≿━━━━༺❀༻━━━━≾\n\n𝗝𝗼𝗯 𝗻𝗼𝘁 𝗶𝗻 𝘁𝗵𝗲 𝗹𝗶𝘀𝘁\n\n≿━━━━༺❀༻━━━━≾`);

    data.work = Date.now()+(1000*60*60*24);
    o.Users.setData(uid, user);
    let wgm = await new Promise(async resolve=>send({
        body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗗𝗼𝗶𝗻𝗴 ${work.name}...\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
    }, (err, res)=>resolve(res || {})));
    await new Promise(out=>setTimeout(out, 1000*3.5));
    let done = work.done[Math.random()*work.done.length<<0];
    let $ = random(200000, 1000000);
    msg.body = `⚝──⭒─⭑─⭒──⚝\n\n${done[0].replace(/{name}/g, user.name).replace(/{money}/g, $)}\n\n⚝──⭒─⭑─⭒──⚝`;
    send(msg, ()=>o.api.unsendMessage(wgm.messageID));
    o.Currencies.increaseMoney(uid, $);
};