//////////////////////////////////////////////////////
//========= Require all variable need use =========//
/////////////////////////////////////////////////////
const moment = require("moment-timezone");
const fs = require("fs-extra");
const fsNative = require("fs");
const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = fs;
const { join, resolve } = require("path");
const chalk = require('chalk');
const figlet = require('figlet');
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
// const login = require("fca-horizon-remastered"); 
const login = require("./includes/fca");
// const login = require("@dongdev/fca-unofficial");
const axios = require("axios");
const cookieHandler = require("./includes/cookieHandler.js");

let appState = null;
let isRefreshing = false;
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules;
const connect = require("./includes/ConnectApi.js");

global.client = new Object({
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    eventRegistered: new Array(),
    handleSchedule: new Array(),
    handleReaction: new Array(),
    handleReply: new Array(),
    mainPath: process.cwd(),
    configPath: new String(),
  getTime: function (option) {
        switch (option) {
            case "seconds":
                return `${moment.tz("Asia/Karachi").format("ss")}`;
            case "minutes":
                return `${moment.tz("Asia/Karachi").format("mm")}`;
            case "hours":
                return `${moment.tz("Asia/Karachi").format("hh A")}`;
            case "date": 
                return `${moment.tz("Asia/Karachi").format("DD")}`;
            case "month":
                return `${moment.tz("Asia/Karachi").format("MM")}`;
            case "year":
                return `${moment.tz("Asia/Karachi").format("YYYY")}`;
            case "fullHour":
                return `${moment.tz("Asia/Karachi").format("hh:mm:ss A")}`;
            case "fullYear":
                return `${moment.tz("Asia/Karachi").format("DD/MM/YYYY")}`;
            case "fullTime":
                return `${moment.tz("Asia/Karachi").format("hh:mm:ss A DD/MM/YYYY")}`;
        }
  }
});

global.data = new Object({
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: new Array(),
    allUserID: new Array(),
    allCurrenciesID: new Array(),
    allThreadID: new Array()
});

global.utils = require("./utils");

global.nodemodule = new Object();

global.config = new Object();

global.configModule = new Object();

global.moduleData = new Array();

global.language = new Object();

//////////////////////////////////////////////////////////
//========= Find and get variable from Config =========//
/////////////////////////////////////////////////////////

var configValue;
try {
    global.client.configPath = join(global.client.mainPath, "config.json");
    configValue = require(global.client.configPath);
    
    // Watch for config changes
    fsNative.watchFile(global.client.configPath, (curr, prev) => {
        try {
            const newData = JSON.parse(readFileSync(global.client.configPath, 'utf8'));
            for (const key in newData) {
                global.config[key] = newData[key];
            }
            logger.loader("Config updated in real-time", "info");
        } catch (e) {
            logger.loader("Error updating config in real-time: " + e.message, "error");
        }
    });
}
catch {
    if (existsSync(global.client.configPath.replace(/\.json/g,"") + ".temp")) {
        configValue = readFileSync(global.client.configPath.replace(/\.json/g,"") + ".temp");
        configValue = JSON.parse(configValue);
        logger.loader(`Found: ${global.client.configPath.replace(/\.json/g,"") + ".temp"}`);
    }

}

try {
    for (const key in configValue) global.config[key] = configValue[key];
    //connect.send()
}
catch { return logger.loader("Can't load file config!", "error") }

const { Sequelize, sequelize } = require("./includes/database");

writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), 'utf8');

/////////////////////////////////////////
//========= Load language use =========//
/////////////////////////////////////////

const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1, item.length);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (typeof global.language[head] == "undefined") global.language[head] = new Object();
    global.language[head][key] = value;
}

global.getText = function (...args) {
    const langText = global.language;    
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Main language not found: ${args[0]}`;
    var text = langText[args[0]][args[1]];
    for (var i = args.length - 1; i > 0; i--) {
        const regEx = RegExp(`%${i}`, 'g');
        text = text.replace(regEx, args[i + 1]);
    }
    return text;
}

async function loadAppState() {
    const appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
    
    try {
        const cookieData = await cookieHandler.getCookies();
        if (!cookieData || !cookieData.cookies) {
            logger.loader("No cookies found. Please add cookies via dashboard.", "warn");
            global.client.appStateMissing = true;
            return null;
        }

        if (!existsSync(appStateFile)) {
            logger.loader("Appstate not found. Generating from cookies...", "info");
            appState = await cookieHandler.refreshAppState();
            logger.loader("Appstate generated from cookies successfully!", "success");
            return appState;
        }

        try {
            const existingAppState = require(appStateFile);
            const c_user = existingAppState.find(c => c.key === 'c_user');
            const xs = existingAppState.find(c => c.key === 'xs');
            
            if (!c_user || !xs) {
                logger.loader("Appstate invalid. Regenerating from cookies...", "warn");
                appState = await cookieHandler.refreshAppState();
                return appState;
            }

            const cookieUserMatch = cookieData.cookies.match(/c_user=([^;]+)/);
            if (cookieUserMatch && c_user.value !== cookieUserMatch[1]) {
                logger.loader("User mismatch in appstate. Updating from cookies...", "warn");
                appState = await cookieHandler.refreshAppState();
                return appState;
            }

            logger.loader("Using existing appstate", "success");
            return existingAppState;
        } catch (loadError) {
            logger.loader("Error loading appstate: " + loadError.message + ". Generating from cookies...", "warn");
            appState = await cookieHandler.refreshAppState();
            return appState;
        }
    } catch (error) {
        logger.loader("Cookie handler error: " + error.message, "error");
        global.client.appStateMissing = true;
        return null;
    }
}

let appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
if (!existsSync(appStateFile)) {
    logger.loader("Appstate not found. Will generate from cookies on startup.", "warn");
}

////////////////////////////////////////////////////////////
//========= Login account and start Listen Event =========//
////////////////////////////////////////////////////////////


async function onBot({ models: botModel }) {
    console.log(chalk.yellow(figlet.textSync('THE END', { horizontalLayout: 'full' })));
    
    try {
        const currentAppState = await loadAppState();
        
        if (!currentAppState || global.client.appStateMissing) {
            logger.loader("AppState is missing. Please add cookies via web dashboard.", "warn");
            return;
        }
        
        const loginData = { appState: currentAppState };
        
        login(loginData, async(loginError, loginApiData) => {
            if (loginError) {
                const errorStr = JSON.stringify(loginError);
                logger("Login error: " + errorStr, "ERROR");
                
                if (errorStr.includes("session") || errorStr.includes("login") || errorStr.includes("auth") || errorStr.includes("logged") || errorStr.includes("invalid") || errorStr.includes("cookies") || errorStr.includes("Account") || errorStr.includes("checkpoint")) {
                    logger.loader("Session expired! Refreshing appstate from cookies...", "warn");
                    try {
                        const newAppState = await cookieHandler.refreshAppState();
                        logger.loader("Appstate refreshed! Retrying login...", "info");
                        
                        setTimeout(() => {
                            const retryLoginData = { appState: newAppState };
                            login(retryLoginData, async(retryError, retryApiData) => {
                                if (retryError) {
                                    logger("Retry login failed: " + JSON.stringify(retryError), "ERROR");
                                    logger.loader("Please update cookies in dashboard. Bot will retry in 5 minutes...", "error");
                                    setTimeout(() => onBot({ models: botModel }), 5 * 60 * 1000);
                                    return;
                                }
                                
                                writeFileSync(appStateFile, JSON.stringify(retryApiData.getAppState(), null, '\x09'))
                                global.client.api = retryApiData
                                global.config.version = '2.7.12'
                                global.client.timeStart = new Date().getTime()
                                startBotLogic(retryApiData, botModel);
                            });
                        }, 3000);
                        return;
                    } catch (refreshError) {
                        logger.loader("Failed to refresh appstate: " + refreshError.message, "error");
                        setTimeout(() => onBot({ models: botModel }), 5 * 60 * 1000);
                        return;
                    }
                }
                return;
            }
            
            loginApiData.setOptions(global.config.FCAOption)
            writeFileSync(appStateFile, JSON.stringify(loginApiData.getAppState(), null, '\x09'))
            global.client.api = loginApiData
            {
                const listCommand = readdirSync(global.client.mainPath + '/modules/commands').filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
                for (const command of listCommand) {
                    try {
                        var module = require(global.client.mainPath + '/modules/commands/' + command);
                        if (!module.config || !module.run || !module.config.commandCategory) throw new Error(global.getText('mirai', 'errorFormat'));
                        if (global.client.commands.has(module.config.name || '')) throw new Error(global.getText('mirai', 'nameExist'));

                        if (module.config.dependencies && typeof module.config.dependencies == 'object') {
                            for (const reqDependencies in module.config.dependencies) {
                                const reqDependenciesPath = join(__dirname, 'nodemodules', 'node_modules', reqDependencies);
                                try {
                                    if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                                        if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global.nodemodule[reqDependencies] = require(reqDependencies);
                                        else global.nodemodule[reqDependencies] = require(reqDependenciesPath);
                                    } else '';
                                } catch {
                                    var check = false;
                                    var isError;
                                    logger.loader(global.getText('mirai', 'notFoundPackage', reqDependencies, module.config.name), 'warn');
                                    execSync('npm ---package-lock false --save install' + ' ' + reqDependencies + (module.config.dependencies[reqDependencies] == '*' || module.config.dependencies[reqDependencies] == '' ? '' : '@' + module.config.dependencies[reqDependencies]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                    for (let i = 1; i <= 3; i++) {
                                        try {
                                            require['cache'] = {};
                                            if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global['nodemodule'][reqDependencies] = require(reqDependencies);
                                            else global['nodemodule'][reqDependencies] = require(reqDependenciesPath);
                                            check = true;
                                            break;
                                        } catch (error) { isError = error; }
                                        if (check || !isError) break;
                                    }
                                    if (!check || isError) throw global.getText('mirai', 'cantInstallPackage', reqDependencies, module.config.name, isError);
                                }
                            }

                        }
                        if (module.config.envConfig) try {
                            for (const envConfig in module.config.envConfig) {
                                if (typeof global.configModule[module.config.name] == 'undefined') global.configModule[module.config.name] = {};
                                if (typeof global.config[module.config.name] == 'undefined') global.config[module.config.name] = {};
                                if (typeof global.config[module.config.name][envConfig] !== 'undefined') global['configModule'][module.config.name][envConfig] = global.config[module.config.name][envConfig];
                                else global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                                if (typeof global.config[module.config.name][envConfig] == 'undefined') global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                            }

                        } catch (error) {
                        }
                        if (module.onLoad) {
                            try {
                                const moduleData = {};
                                moduleData.api = loginApiData;
                                moduleData.models = botModel;
                                module.onLoad(moduleData);
                            } catch (_0x20fd5f) {
                                throw new Error(global.getText('mirai', 'cantOnload', module.config.name, JSON.stringify(_0x20fd5f)), 'error');
                            };
                        }
                        if (module.handleEvent) global.client.eventRegistered.push(module.config.name);
                        global.client.commands.set(module.config.name, module);
                        logger.loader(`Loaded command: ${module.config.name}`, 'success');

                    } catch (error) {
                        logger.loader(`Failed to load command ${command}: ${error.message}`, 'error');
                        console.log(error);
                    };
                }
            };
            
            {
                const events = readdirSync(global.client.mainPath + '/modules/events').filter(event => event.endsWith('.js') && !global.config.eventDisabled.includes(event));
                for (const ev of events) {
                    try {
                        var event = require(global.client.mainPath + '/modules/events/' + ev);
                        if (!event.config || !event.run) throw new Error(global.getText('mirai', 'errorFormat'));
                        if (global.client.events.has(event.config.name) || '') throw new Error(global.getText('mirai', 'nameExist'));
                        if (event.config.dependencies && typeof event.config.dependencies == 'object') {
                            for (const dependency in event.config.dependencies) {
                                const _0x21abed = join(__dirname, 'nodemodules', 'node_modules', dependency);
                                try {
                                    if (!global.nodemodule.hasOwnProperty(dependency)) {
                                        if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                        else global.nodemodule[dependency] = require(_0x21abed);
                                    } else '';
                                } catch {
                                    let check = false;
                                    let isError;
                                    logger.loader(global.getText('mirai', 'notFoundPackage', dependency, event.config.name), 'warn');
                                    execSync('npm --package-lock false --save install' + dependency + (event.config.dependencies[dependency] == '*' || event.config.dependencies[dependency] == '' ? '' : '@' + event.config.dependencies[dependency]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                    for (let i = 1; i <= 3; i++) {
                                        try {
                                            require['cache'] = {};
                                            if (global.nodemodule.includes(dependency)) break;
                                            if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                            else global.nodemodule[dependency] = require(_0x21abed);
                                            check = true;
                                            break;
                                        } catch (error) { isError = error; }
                                        if (check || !isError) break;
                                    }
                                    if (!check || isError) throw global.getText('mirai', 'cantInstallPackage', dependency, event.config.name);
                                }
                            }

                        }
                        if (event.config.envConfig) try {
                            for (const _0x5beea0 in event.config.envConfig) {
                                if (typeof global.configModule[event.config.name] == 'undefined') global.configModule[event.config.name] = {};
                                if (typeof global.config[event.config.name] == 'undefined') global.config[event.config.name] = {};
                                if (typeof global.config[event.config.name][_0x5beea0] !== 'undefined') global.configModule[event.config.name][_0x5beea0] = global.config[event.config.name][_0x5beea0];
                                else global.configModule[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                                if (typeof global.config[event.config.name][_0x5beea0] == 'undefined') global.config[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                            }

                        } catch (error) {

                        }
                        if (event.onLoad) try {
                            const eventData = {};
                            eventData.api = loginApiData, eventData.models = botModel;
                            event.onLoad(eventData);
                        } catch (error) {
                            throw new Error(global.getText('mirai', 'cantOnload', event.config.name, JSON.stringify(error)), 'error');
                        }
                        global.client.events.set(event.config.name, event);

                    } catch (error) {
                    }
                }
            }
        
        
        logger.loader(global.getText('mirai', 'finishLoadModule', global.client.commands.size, global.client.events.size)) 
        logger.loader(`Startup time: ${((Date.now() - global.client.timeStart) / 1000).toFixed()}s`)   
        logger.loader('===== [ ' + (Date.now() - global.client.timeStart) + 'ms ] =====')
        
        // Initialize notification handler
        try {
            const notificationHandler = require('./includes/handle/handleNotification');
            notificationHandler({ api: loginApiData });
            logger.loader('Notification handler initialized successfully');
        } catch (error) {
            logger.loader('Failed to initialize notification handler: ' + error, 'error');
        }
        
        writeFileSync(global.client['configPath'], JSON['stringify'](global.config, null, 4), 'utf8') 
        unlinkSync(global['client']['configPath'] + '.temp');        
        const listenerData = {};
        listenerData.api = loginApiData; 
        listenerData.models = botModel;
        const listener = require('./includes/listen')(listenerData);
        function listenerCallback(error, event) {
            if (error) {
              if (JSON.stringify(error).includes("601051028565049")) {
                const form = {
                  av: loginApiData.getCurrentUserID(),
                  fb_api_caller_class: "RelayModern",
                  fb_api_req_friendly_name: "FBScrapingWarningMutation",
                  variables: "{}",
                  server_timestamps: "true",
                  doc_id: "6339492849481770",
                };
                loginApiData.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
                  if (i) {
                    try {
                        const res = JSON.parse(i);
                        if (e || res.errors) return logger("Lỗi không thể xóa cảnh cáo của facebook.", "error");
                        if (res.data && res.data.fb_scraping_warning_clear && res.data.fb_scraping_warning_clear.success) {
                            logger("Đã vượt cảnh cáo facebook thành công.", "[ SUCCESS ] >");
                            global.handleListen = loginApiData.listenMqtt(listenerCallback);
                        }
                    } catch(err) {
                        logger("Error parsing facebook warning response", "error");
                    }
                  }
                });
              } else {
                return logger(global.getText("mirai", "handleListenError", JSON.stringify(error)), "error");
              }
            }
            if (!event || ["presence", "typ", "read_receipt"].some((data) => data === event?.type)) return;
            if (global.config.DeveloperMode) console.log(event);
            return typeof listener === "function" ? listener(event) : null;
          }
        // function listenerCallback(error, message) {
        //     if (error) return logger(global.getText('mirai', 'handleListenError', JSON.stringify(error)), 'error');
        //     if (['presence', 'typ', 'read_receipt'].some(data => data == message.type)) return;
        //     if (global.config.DeveloperMode == !![]) console.log(message);
        //     return listener(message);
        // };
        global.handleListen = loginApiData.listenMqtt(listenerCallback);
        try {
        } catch (error) {
            return 
        };

    });

    } catch (error) {
        logger.loader("Error in onBot: " + error.message, "error");
        setTimeout(() => onBot({ models: botModel }), 30000);
    }
}
//////////////////////////////////////////////
//========= Connecting to Database =========//
//////////////////////////////////////////////

(async () => {
    try {
        try {
            global.client.loggedMongoose = true;
            const { Model, DataTypes, Sequelize } = require("sequelize");
            const sequelize2 = new Sequelize({
                dialect: "sqlite",
                host: __dirname + '/ItsRaza/datasqlite/antists.sqlite',
                logging: false
            });
            class dataModel extends Model { }
            dataModel.init({
                threadID: {
                    type: DataTypes.STRING,
                    primaryKey: true
                },
                data: {
                    type: DataTypes.JSON,
                    defaultValue: {}
                }
            }, {
                sequelize: sequelize2,
                modelName: "antists"
            });

            // connect to database
            dataModel.findOneAndUpdate = async function (filter, update) {
                const doc = await this.findOne({
          where: filter  
        });
                if (!doc)
                    return null;
                Object.keys(update).forEach(key => doc[key] = update[key]);
                await doc.save();
                return doc;
            }
            global.modelAntiSt = dataModel;
            await sequelize2.sync({ force: false });
        }
        catch (error) {
            global.client.loggedMongoose = false;
            logger.loader('Unable to connect to ANTI SETTING database', '[ CONNECT ]');
            console.log(error);
        }

        await sequelize.authenticate();
        const authentication = {};
        authentication.Sequelize = Sequelize;
        authentication.sequelize = sequelize;
        const models = require('./includes/database/model')(authentication);
        const botData = {};
        botData.models = models
        onBot(botData);
    } catch (error) { logger(global.getText('mirai', 'successConnectDatabase', JSON.stringify(error)), '[ DATABASE ]'); }
})();
process.on('unhandledRejection', (err, p) => {
    // Silent errors fix
});
process.on('uncaughtException', (err, origin) => {
    // console.error('Uncaught Exception:', err);
});
