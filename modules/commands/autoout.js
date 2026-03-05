module.exports.config = {
    name: 'autoout',
    version: '1.1.1',
    hasPermssion: 3,
    credits: '**Kashif Raza**',
    description: 'Automatically leave groups',
    commandCategory: 'Admin',
    usages: 'number of members + message',
    cooldowns: 2
};

async function onLoad() {
    const { existsSync, writeFileSync } = require('fs-extra')
    const { join } = require('path');
    const pathData = join(__dirname, "cache", "data", "autoout.json");
    if (!existsSync(pathData)) writeFileSync(pathData, "[]", "utf-8");
}
onLoad()

module.exports.handleEvent = function({
    api,
    event
}) {
    const auto = global.cmds_autoout || {};
    if (!event.isGroup) return;
    if (!auto.status) return;
    if (event.participantIDs.length < auto.num) return api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**Bot will automatically leave when the group has fewer than ${auto.num} members**\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, async function() {
        await api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    });
};

module.exports.run = function({
    api,
    event
}) {
    if (!global.cmds_autoout) global.cmds_autoout = {};
    const auto = global.cmds_autoout || {};
    if (isNaN(event.args[1])) return;
    const status = !auto.status ? true : false;
    global.cmds_autoout = {
        status,
        num: +event.args[1]
    }
    api.sendMessage(`༻﹡﹡﹡﹡﹡﹡﹡༺\n**${status ? 'Enabled' : 'Disabled'} auto leave for groups with fewer than ${event.args[1]} members by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`, event.threadID, event.messageID);
};