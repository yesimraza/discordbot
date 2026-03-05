module.exports = function ({api ,models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
        const moment = require("moment-timezone");
    return function ({ event }) {
        const timeStart = Date.now()
        const time = moment.tz("Asia/Karachi").format("hh:mm:ss A L");
        const { userBanned, threadBanned } = global.data;
        const { events } = global.client;
        const { allowInbox, DeveloperMode } = global.config;
        var { senderID, threadID } = event;
        senderID = String(senderID);
        threadID = String(threadID);
        if (userBanned.has(senderID)|| threadBanned.has(threadID) || allowInbox == ![] && senderID == threadID) return;
        
        for (const [key, value] of global.client.commands.entries()) {
            if (value.handleEvent) {
                try {
                    const Obj = {
                        api,
                        event,
                        models,
                        Users,
                        Threads,
                        Currencies
                    };
                    value.handleEvent(Obj);
                } catch (err) {
                    // console.log(`Error in handleEvent for command ${key}:`, err);
                }
            }
        }

        const eventsMap = global.client.events;
        for (const [key, value] of eventsMap.entries()) {
            // Check if the module has a handleEvent function
            const eventRun = eventsMap.get(key);
            if (eventRun && eventRun.handleEvent) {
                try {
                    const Obj = {
                        api,
                        event,
                        models,
                        Users,
                        Threads,
                        Currencies
                    };
                    eventRun.handleEvent(Obj);
                } catch (err) {
                    // console.log(`Error in handleEvent for event ${key}:`, err);
                }
            }

            // Skip entries without valid eventType
            if (!value?.config?.eventType || !event.logMessageType) {
                if (event.logMessageType === "log:user-nickname") {
                    // Force trigger nicknamelock if it's not registered correctly
                    if (value.config.name === "nicknamelock") {
                         try {
                            const Obj = { api, event, models, Users, Threads, Currencies };
                            eventRun.run(Obj);
                        } catch (e) {}
                    }
                }
                continue;
            }
            
            if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
                try {
                    const Obj = {
                        api,
                        event,
                        models,
                        Users,
                        Threads,
                        Currencies
                    };
                    eventRun.run(Obj);
                    if (DeveloperMode == !![]) 
                        logger(global.getText('handleEvent', 'executeEvent', time, eventRun.config.name, threadID, Date.now() - timeStart), '[ Event ]');
                } catch (error) {
                    logger(global.getText('handleEvent', 'eventError', eventRun.config.name, JSON.stringify(error)), "error");
                }
            }
        }
        return;
    };
}
