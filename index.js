const { spawn, exec } = require("child_process");
const logger = require("./utils/log");
const fs = require("fs-extra");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.static("public"));

let child = null;
let manuallyStopped = false;
let mainPid = null;
let logs = [];
const MAX_LOGS = 100;

function getBotStatus() {
    return child !== null && !child.killed;
}

function addToLogs(data, type = "info") {
    const timestamp = new Date().toLocaleTimeString();
    logs.push({ timestamp, message: data.toString().trim(), type });
    if (logs.length > MAX_LOGS) logs.shift();
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get('/api/config', async (req, res) => {
    try {
        const config = await fs.readJson("./config.json");
        let appState = null;
        if (await fs.pathExists("./appstate.json")) {
            try {
                appState = await fs.readJson("./appstate.json");
            } catch(e) {
                console.error("Error reading appstate.json:", e);
            }
        }
        res.json({ config, appState, isRunning: getBotStatus() });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/logs', (req, res) => {
    res.json({ logs });
});

app.post('/api/update', async (req, res) => {
    try {
        const { BOTNAME, PREFIX, ADMINBOT, icon, appState, ADMIN_NAME } = req.body;
        const config = await fs.readJson("./config.json");
        
        config.BOTNAME = BOTNAME || config.BOTNAME;
        config.PREFIX = PREFIX || config.PREFIX;
        config.ADMINBOT = Array.isArray(ADMINBOT) ? ADMINBOT : (ADMINBOT ? [ADMINBOT] : config.ADMINBOT);
        config.NDH = Array.isArray(ADMINBOT) ? ADMINBOT : (ADMINBOT ? [ADMINBOT] : config.NDH);
        config.ADMIN_NAME = ADMIN_NAME || config.ADMIN_NAME;
        if (config.iconUnsend) config.iconUnsend.icon = icon;
        
        await fs.writeJson("./config.json", config, { spaces: 4 });
        
        if (appState) {
            try {
                const parsed = typeof appState === 'string' ? JSON.parse(appState) : appState;
                await fs.writeJson("./appstate.json", parsed, { spaces: 4 });
            } catch(e) {
                console.error("Appstate parse error:", e);
            }
        }
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/update-cookies', async (req, res) => {
    try {
        const { cookies } = req.body;
        
        if (!cookies) {
            return res.status(400).json({ error: "Cookies are required" });
        }
        
        const cookieData = {
            cookies: cookies,
            lastUpdated: new Date().toISOString(),
            userId: cookies.match(/c_user=([^;]+)/)?.[1] || null
        };
        
        await fs.writeJson("./cookies.json", cookieData, { spaces: 4 });
        
        res.json({ success: true, message: "Cookies updated successfully!" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/cookies-status', async (req, res) => {
    try {
        if (await fs.pathExists("./cookies.json")) {
            const cookieData = await fs.readJson("./cookies.json");
            res.json({ 
                hasCookies: true, 
                lastUpdated: cookieData.lastUpdated,
                userId: cookieData.userId
            });
        } else {
            res.json({ hasCookies: false });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/start', (req, res) => {
    if (!getBotStatus()) {
        manuallyStopped = false;
        startBot("Bot started from Web Dashboard");
        res.json({ success: true, message: "Bot starting..." });
    } else {
        res.json({ success: true, message: "Bot is already running" });
    }
});

function killProcessTree(pid) {
    return new Promise((resolve) => {
        if (!pid) {
            resolve();
            return;
        }
        
        exec(`pkill -P ${pid}`, (err) => {
            setTimeout(() => {
                try {
                    process.kill(pid, 'SIGTERM');
                } catch(e) {}
                setTimeout(() => {
                    try {
                        process.kill(pid, 'SIGKILL');
                    } catch(e) {}
                    resolve();
                }, 1000);
            }, 500);
        });
    });
}

app.post('/api/stop', async (req, res) => {
    if (getBotStatus()) {
        manuallyStopped = true;
        
        if (child && child.pid) {
            await killProcessTree(child.pid);
        }
        
        child = null;
        mainPid = null;
        logger("Bot stopped from Web Dashboard", "BOT STOPPED");
        addToLogs("Bot stopped from Web Dashboard", "warn");
        res.json({ success: true });
    } else {
        manuallyStopped = true;
        res.json({ success: true, message: "Bot is not running" });
    }
});

app.post('/api/delete-appstate', async (req, res) => {
    try {
        manuallyStopped = true;
        if (getBotStatus() && child && child.pid) {
            await killProcessTree(child.pid);
            child = null;
            mainPid = null;
            logger("Bot stopped for session clearing", "BOT STOPPED");
            addToLogs("Bot stopped for session clearing", "warn");
        }
        await fs.remove("./appstate.json");
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ SERVER ] -> Dashboard active on port: ${PORT}`);
});

function startBot(message) {
    if (message) {
        logger(message, "BOT STARTING");
        addToLogs(message, "info");
    }

    manuallyStopped = false;

    child = spawn("node", ["--trace-warnings", "--async-stack-traces", "main.js"], {
        cwd: __dirname,
        stdio: ["inherit", "pipe", "pipe"],
        shell: false
    });

    mainPid = child.pid;

    child.stdout.on("data", (data) => {
        process.stdout.write(data);
        addToLogs(data, "info");
    });

    child.stderr.on("data", (data) => {
        process.stderr.write(data);
        addToLogs(data, "error");
    });

    child.on("close", (codeExit) => {
        const wasManuallyStopped = manuallyStopped;
        
        if (wasManuallyStopped) {
            manuallyStopped = false;
            child = null;
            mainPid = null;
            addToLogs("Bot stopped manually.", "info");
            return;
        }
        
        if (codeExit !== 0 && codeExit !== null) {
            const lastLog = logs.length > 0 ? logs[logs.length - 1].message : "";
            if (lastLog.includes("AppState") || lastLog.includes("appstate") || lastLog.includes("missing")) {
                addToLogs("AppState missing - not auto-restarting. Please upload via dashboard.", "warn");
                child = null;
                mainPid = null;
                return;
            }
            addToLogs(`Bot exited with code ${codeExit}. Restarting...`, "warn");
            startBot("Restarting Bot due to crash...");
        } else {
            child = null;
            mainPid = null;
            addToLogs("Bot process closed normally.", "info");
        }
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
        addToLogs("Process error: " + error.message, "error");
        child = null;
        mainPid = null;
    });
};

async function checkAndStartBot() {
    try {
        const appStateExists = await fs.pathExists("./appstate.json");
        if (!appStateExists) {
            logger("AppState not found. Bot will not auto-start. Please upload via dashboard.", "warn");
            addToLogs("AppState missing - waiting for upload via dashboard", "warn");
            return;
        }
        startBot("Auto-starting bot...");
    } catch (e) {
        logger("Error checking appstate: " + e.message, "error");
    }
}

checkAndStartBot();
