module.exports.config = {
    name: "cmd",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Manage and control all bot modules",
    commandCategory: "Admin",
    usages: "[load/unload/loadAll/unloadAll/info] [module name]",
    cooldowns: 2,
    dependencies: {
        "fs-extra": "",
        "child_process": "",
        "path": ""
    }
};

const loadCommand = function ({ moduleList, threadID, messageID }) {

    const { execSync } = require('child_process');
    const { writeFileSync, unlinkSync, readFileSync } = global.nodemodule['fs-extra'];
    const { join } = global.nodemodule['path'];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + '/utils/log');

    var errorList = [];
    const actualConfigPath = configPath || join(process.cwd(), "config.json");
    delete require['resolve'][require['resolve'](actualConfigPath)];
    var configValue = require(actualConfigPath);
    writeFileSync(actualConfigPath + '.temp', JSON.stringify(configValue, null, 2), 'utf8');
    for (const nameModule of moduleList) {
        try {
            const dirModule = __dirname + '/' + nameModule + '.js';
            delete require['cache'][require['resolve'](dirModule)];
            const command = require(dirModule);
            global.client.commands.delete(nameModule);
            if (!command.config || !command.run || !command.config.commandCategory) 
                throw new Error('[ 𝗖𝗠𝗗 ] - 𝗠𝗼𝗱𝘂𝗹𝗲 𝗳𝗼𝗿𝗺𝗮𝘁 𝗶𝘀 𝗶𝗻𝘃𝗮𝗹𝗶𝗱!');
            global.client['eventRegistered'] = global.client['eventRegistered']['filter'](info => info != command.config.name);
            if (command.config.dependencies && typeof command.config.dependencies == 'object') {
                const listPackage = JSON.parse(readFileSync('./package.json')).dependencies,
                    listbuiltinModules = require('module')['builtinModules'];
                for (const packageName in command.config.dependencies) {
                    var tryLoadCount = 0,
                        loadSuccess = ![],
                        error;
                    const moduleDir = join(global.client.mainPath, 'nodemodules', 'node_modules', packageName);
                    try {
                        if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);
                        else global.nodemodule[packageName] = require(moduleDir);
                    } catch {
                        logger.loader('[ 𝗖𝗠𝗗 ] - 𝗣𝗮𝗰𝗸𝗮𝗴𝗲 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱: ' + packageName + ' → installing...', 'warn');
                        const insPack = {};
                        insPack.stdio = 'inherit';
                        insPack.env = process.env ;
                        insPack.shell = !![];
                        insPack.cwd = join(global.client.mainPath,'nodemodules')
                        execSync('npm --package-lock false --save install ' + packageName + (command.config.dependencies[packageName] == '*' || command.config.dependencies[packageName] == '' ? '' : '@' + command.config.dependencies[packageName]), insPack);
                        for (tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                            require['cache'] = {};
                            try {
                                if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);
                                else global.nodemodule[packageName] = require(moduleDir);
                                loadSuccess = !![];
                                break;
                            } catch (erorr) {
                                error = erorr;
                            }
                            if (loadSuccess || !error) break;
                        }
                        if (!loadSuccess || error) throw 'Unable to load package ' + packageName + ' for command ' + command.config.name + ', error: ' + error + ' ' + error['stack'];
                    }
                }
                logger.loader('[ 𝗖𝗠𝗗 ] - 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗹𝗼𝗮𝗱𝗲𝗱 𝗮𝗹𝗹 𝗽𝗮𝗰𝗸𝗮𝗴𝗲𝘀 𝗳𝗼𝗿 ' + command.config.name);
            }
            if (command.config.envConfig && typeof command.config.envConfig == 'Object') try {
                for (const [key, value] of Object['entries'](command.config.envConfig)) {
                    if (typeof global.configModule[command.config.name] == undefined) 
                        global.configModule[command.config.name] = {};
                    if (typeof configValue[command.config.name] == undefined) 
                        configValue[command.config.name] = {};
                    if (typeof configValue[command.config.name][key] !== undefined) 
                        global.configModule[command.config.name][key] = configValue[command.config.name][key];
                    else global.configModule[command.config.name][key] = value || '';
                    if (typeof configValue[command.config.name][key] == undefined) 
                        configValue[command.config.name][key] = value || '';
                }
                logger.loader('Loaded config for ' + command.config.name);
            } catch (error) {
                throw new Error('[ 𝗖𝗠𝗗 ] » 𝗖𝗮𝗻𝗻𝗼𝘁 𝗹𝗼𝗮𝗱 𝗰𝗼𝗻𝗳𝗶𝗴 𝗺𝗼𝗱𝘂𝗹𝗲, 𝗲𝗿𝗿𝗼𝗿: ' + JSON.stringify(error));
            }
            if (command['onLoad']) try {
                const onLoads = {};
                onLoads['configValue'] = configValue;
                command['onLoad'](onLoads);
            } catch (error) {
                throw new Error('[ 𝗖𝗠𝗗 ] » 𝗖𝗮𝗻𝗻𝗼𝘁 𝗼𝗻𝗟𝗼𝗮𝗱 𝗺𝗼𝗱𝘂𝗹𝗲, 𝗲𝗿𝗿𝗼𝗿: ' + JSON.stringify(error), 'error');
            }
            if (command.handleEvent) global.client.eventRegistered.push(command.config.name);
            (global.config.commandDisabled.includes(nameModule + '.js') || configValue.commandDisabled.includes(nameModule + '.js')) 
            && (configValue.commandDisabled.splice(configValue.commandDisabled.indexOf(nameModule + '.js'), 1),
            global.config.commandDisabled.splice(global.config.commandDisabled.indexOf(nameModule + '.js'), 1))
            global.client.commands.set(command.config.name, command)
            logger.loader('Loaded command ' + command.config.name + '!');
        } catch (error) {
            errorList.push('- ' + nameModule + ' reason:' + error + ' at ' + error['stack']);
        };
    }
    if (errorList.length != 0) api.sendMessage('[ 𝗖𝗠𝗗 ] » 𝗦𝗼𝗺𝗲 𝗲𝗿𝗿𝗼𝗿𝘀 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗹𝗼𝗮𝗱𝗶𝗻𝗴: ' + errorList.join(' '), threadID, messageID);
    api.sendMessage('✅️ ' + (moduleList.length - errorList.length) +' 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗹𝗼𝗮𝗱𝗲𝗱!\n✏️ 𝗠𝗼𝗱𝘂𝗹𝗲𝘀 ('+moduleList.join(', ') + '.js)', threadID, messageID) 
    writeFileSync(actualConfigPath, JSON.stringify(configValue, null, 4), 'utf8')
    unlinkSync(actualConfigPath + '.temp');
    return;
}

const unloadModule = function ({ moduleList, threadID, messageID }) {
    const { writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule['path'];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + "/utils/log").loader;

    const actualConfigPath = configPath || join(process.cwd(), "config.json");
    delete require.cache[require.resolve(actualConfigPath)];
    var configValue = require(actualConfigPath);
    writeFileSync(actualConfigPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        global.client.commands.delete(nameModule);
        global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);
        configValue["commandDisabled"].push(`${nameModule}.js`);
        global.config["commandDisabled"].push(`${nameModule}.js`);
        logger(`Unloaded command ${nameModule}!`);
    }

    writeFileSync(actualConfigPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(actualConfigPath + ".temp");

    return api.sendMessage(`[ 𝗖𝗠𝗗 ] » 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝘂𝗻𝗹𝗼𝗮𝗱𝗲𝗱 ${moduleList.length} 𝗰𝗼𝗺𝗺𝗮𝗻𝗱(𝘀) ✨`, threadID, messageID);
}

module.exports.run = function ({ event, args, api }) {

    if (event.senderID != global.config.NDH[0]) return api.sendMessage(`[ 𝗖𝗠𝗗 ] » 𝗔𝗰𝗰𝗲𝘀𝘀 𝗗𝗲𝗻𝗶𝗲𝗱 😏`, event.threadID, event.messageID)

    const { readdirSync } = global.nodemodule["fs-extra"];
    const { threadID, messageID } = event;

    var moduleList = args.splice(1, args.length);

    switch (args[0]) {
      case "count": {
      let commands = client.commands.values();
          let infoCommand = "";
            api.sendMessage("[ 𝗖𝗠𝗗 ] - 𝗧𝗵𝗲𝗿𝗲 𝗮𝗿𝗲 " + client.commands.size + " 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 💌"+ infoCommand, event.threadID, event.messageID);
      break;
        }
        case "load": {
            if (moduleList.length == 0) return api.sendMessage("[ 𝗖𝗠𝗗 ] » 𝗠𝗼𝗱𝘂𝗹𝗲 𝗻𝗮𝗺𝗲 𝗰𝗮𝗻𝗻𝗼𝘁 𝗯𝗲 𝗲𝗺𝗽𝘁𝘆 ⚠️", threadID, messageID);
            else return loadCommand({ moduleList, threadID, messageID });
        }
        case "unload": {
            if (moduleList.length == 0) return api.sendMessage("[ 𝗖𝗠𝗗 ] » 𝗠𝗼𝗱𝘂𝗹𝗲 𝗻𝗮𝗺𝗲 𝗰𝗮𝗻𝗻𝗼𝘁 𝗯𝗲 𝗲𝗺𝗽𝘁𝘆 ⚠️", threadID, messageID);
            else return unloadModule({ moduleList, threadID, messageID });
        }
        case "loadAll": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example'));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return loadCommand({ moduleList, threadID, messageID });
        }
        case "unloadAll": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example') && !file.includes("command"));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return unloadModule({ moduleList, threadID, messageID });
        }
        case "info": {
            const command = global.client.commands.get(moduleList.join("") || "");

            if (!command) return api.sendMessage("[ 𝗖𝗠𝗗 ] » 𝗧𝗵𝗶𝘀 𝗺𝗼𝗱𝘂𝗹𝗲 𝗱𝗼𝗲𝘀 𝗻𝗼𝘁 𝗲𝘅𝗶𝘀𝘁 ⚠️", threadID, messageID);

            const { name, version, hasPermssion, credits, cooldowns, dependencies } = command.config;

            return api.sendMessage(
                "====== " + name.toUpperCase() + " ======\n" +
                "- 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗯𝘆: " + credits + "\n" +
                "- 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: " + version + "\n" +
                "- 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝗥𝗲𝗾𝘂𝗶𝗿𝗲𝗱: " + ((hasPermssion == 0) ? "𝗨𝘀𝗲𝗿" : (hasPermssion == 1) ? "𝗔𝗱𝗺𝗶𝗻" : "𝗦𝘂𝗽𝗽𝗼𝗿𝘁") + "\n" +
                "- 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: " + cooldowns + " second(s)\n" +
                `- 𝗣𝗮𝗰𝗸𝗮𝗴𝗲 𝗗𝗲𝗽𝗲𝗻𝗱𝗲𝗻𝗰𝗶𝗲𝘀: ${(Object.keys(dependencies || {})).join(", ") || "𝗡𝗼𝗻𝗲"}`,
                threadID, messageID
            );
        }
        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
}