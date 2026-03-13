module.exports.config = {
    name: "cmd",
    version: "1.1.0",
    hasPermssion: 2,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀 (fixed version)",
    description: "Manage bot commands (owner only)",
    commandCategory: "Admin",
    usages: "cmd [load | unload | loadAll | unloadAll | count | info] [moduleName]",
    cooldowns: 3
};

const fs = require("fs-extra");
const path = require("path");

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    const allowedUIDs = ["100004370672067", "61588112703542"];

    if (!allowedUIDs.includes(senderID)) {
        return api.sendMessage("→ Access Denied\nSirf specific owners hi use kar sakte hain.", threadID, messageID);
    }

    if (args.length === 0) {
        return api.sendMessage(
            "╭─────────────⭓\n" +
            "│ CMD Commands:\n" +
            "├─────⭓\n" +
            "│ • cmd count\n" +
            "│ • cmd load <name>\n" +
            "│ • cmd unload <name>\n" +
            "│ • cmd loadAll\n" +
            "│ • cmd unloadAll\n" +
            "│ • cmd info <name>\n" +
            "╰─────────────⭓",
            threadID, messageID
        );
    }

    const cmd = args[0].toLowerCase();
    let modules = args.slice(1);

    // Helper to send message
    const send = (msg) => api.sendMessage(msg, threadID, messageID);

    switch (cmd) {
        case "count": {
            send(`Total loaded commands: ${global.client.commands.size}`);
            break;
        }

        case "load": {
            if (modules.length === 0) return send("Module name likho → cmd load example");

            try {
                let loadedCount = 0;
                let errors = [];

                for (let mod of modules) {
                    const filePath = path.join(__dirname, mod + ".js");
                    if (!fs.existsSync(filePath)) {
                        errors.push(`${mod}.js not found`);
                        continue;
                    }

                    // Clear cache
                    delete require.cache[require.resolve(filePath)];

                    try {
                        const command = require(filePath);
                        if (!command.config || !command.config.name || !command.run) {
                            errors.push(`${mod} → invalid format`);
                            continue;
                        }

                        global.client.commands.set(command.config.name, command);
                        if (command.handleEvent) {
                            global.client.eventRegistered.push(command.config.name);
                        }

                        loadedCount++;
                    } catch (err) {
                        errors.push(`${mod} → ${err.message}`);
                    }
                }

                let reply = `Loaded \( {loadedCount}/ \){modules.length} modules successfully.`;
                if (errors.length > 0) {
                    reply += "\n\nErrors:\n" + errors.map(e => "→ " + e).join("\n");
                }
                send(reply);
            } catch (e) {
                send("Load error: " + e.message);
            }
            break;
        }

        case "unload": {
            if (modules.length === 0) return send("Module name likho → cmd unload example");

            let unloaded = 0;
            let notFound = [];

            for (let mod of modules) {
                const cmdName = mod; // usually same as file without .js
                if (global.client.commands.has(cmdName)) {
                    global.client.commands.delete(cmdName);
                    global.client.eventRegistered = global.client.eventRegistered.filter(n => n !== cmdName);
                    // Optional: add to disabled list if you have that system
                    unloaded++;
                } else {
                    notFound.push(mod);
                }
            }

            let reply = `Unloaded ${unloaded} module(s).`;
            if (notFound.length > 0) {
                reply += `\nNot found: ${notFound.join(", ")}`;
            }
            send(reply);
            break;
        }

        case "loadall": {
            const files = fs.readdirSync(__dirname)
                .filter(file => file.endsWith(".js") && file !== "cmd.js" && !file.includes("example"));

            let loaded = 0;
            let errors = [];

            for (let file of files) {
                const mod = file.replace(".js", "");
                const filePath = path.join(__dirname, file);

                delete require.cache[require.resolve(filePath)];

                try {
                    const command = require(filePath);
                    if (command.config && command.config.name && command.run) {
                        global.client.commands.set(command.config.name, command);
                        if (command.handleEvent) global.client.eventRegistered.push(command.config.name);
                        loaded++;
                    }
                } catch (err) {
                    errors.push(`${mod} → ${err.message}`);
                }
            }

            let reply = `Loaded ${loaded} commands from folder.`;
            if (errors.length > 0) reply += "\nErrors:\n" + errors.map(e => "→ " + e).join("\n");
            send(reply);
            break;
        }

        case "unloadall": {
            const countBefore = global.client.commands.size;
            global.client.commands.clear();
            global.client.eventRegistered = [];
            send(`Unloaded all ${countBefore} commands. (except cmd itself)`);
            break;
        }

        case "info": {
            if (modules.length === 0) return send("Command name likho → cmd info rank");

            const name = modules[0];
            const cmdInfo = global.client.commands.get(name);

            if (!cmdInfo) return send(`Command "${name}" not found or not loaded.`);

            const cfg = cmdInfo.config;
            send(
                `╭── Info: ${name.toUpperCase()} ──⭓\n` +
                `│ Name     : ${cfg.name}\n` +
                `│ Version  : ${cfg.version || "unknown"}\n` +
                `│ Credit   : ${cfg.credits || "unknown"}\n` +
                `│ Category : ${cfg.commandCategory || "unknown"}\n` +
                `│ Permission: ${cfg.hasPermssion == 0 ? "Everyone" : cfg.hasPermssion == 1 ? "Group Admin" : "Bot Admin"}\n` +
                `│ Cooldown : ${cfg.cooldowns || 0}s\n` +
                `╰───────────────⭓`
            );
            break;
        }

        default:
            send("Invalid sub-command. Use: count, load, unload, loadAll, unloadAll, info");
    }
};
