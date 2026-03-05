const activeThreads = new Set();
module.exports.config = {
    name: "dizz",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Diss the person you tag (slang for war talk)",
    commandCategory: "War",
    usages: "dizz @mention",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event }) {
    if (args.length > 0 && args[0] === "stop") {
        if (activeThreads.has(event.threadID)) {
            activeThreads.delete(event.threadID);
            return api.sendMessage("⚠️ Dizz command has been stopped in this group.", event.threadID);
        } else {
            return api.sendMessage("❌ Dizz command is not active in this group.", event.threadID);
        }
    }
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("❌ You must tag someone to dizz.", event.threadID);
    const name = event.mentions[mention];
    const arraytag = [{ id: mention, tag: name }];
    activeThreads.add(event.threadID);

    const messages = [
        "You act big but you're nothing!",
        "Trying to be a phoenix when you're just a crow.",
        "Cheap vibes with fake confidence.",
        "Ugly outside, empty inside.",
        "Nothing real, all fake display.",
        "Small mind with loud noise.",
        "Acting classy but still trashy.",
        "Clown trying to act royal.",
        "No respect earned, only pity gained.",
        "Weak like paper but loud like thunder.",
        "Living fake dreams with zero reality.",
        "Cheap imitation of greatness.",
        "Not even close to competition.",
        "Better stay quiet than show nonsense.",
        "Fake pride won’t make you real.",
        "Talking trash won’t make you rise.",
        "Always playing dumb like it’s talent.",
        "Too basic to shine.",
        "Your noise is louder than your worth.",
        "Empty talker with no power."
    ];

    const sendMessages = () => {
        for (let i = 0; i < messages.length; i++) {
            setTimeout(() => {
                if (activeThreads.has(event.threadID)) {
                    api.sendMessage({ body: messages[i] + " " + name, mentions: arraytag }, event.threadID);
                }
            }, i * 5000);
        }
    };

    sendMessages();
};