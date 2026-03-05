module.exports.config = {
  name: "ttt",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Play Tic-Tac-Toe with AI",
  commandCategory: "Game",
  usages: "[x/o/delete/continue]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "canvas": ""
  }
};

const fs = require("fs-extra");
const { loadImage, createCanvas } = require("canvas");

function startBoard({ isX, data }) {
  data.board = new Array(3);
  data.isX = isX;
  data.gameOn = true;
  data.gameOver = false;
  data.available = [];
  for (let i = 0; i < 3; i++) data.board[i] = new Array(3).fill(0);
  return data;
}

async function displayBoard(data) {
  const path = __dirname + "/cache/ttt.png";
  let canvas = createCanvas(1200, 1200);
  let cc = canvas.getContext("2d");
  try {
    let background = await loadImage("https://i.postimg.cc/nhDWmj1h/background.png");
    cc.drawImage(background, 0, 0, 1200, 1200);

    let quanO = await loadImage("https://i.postimg.cc/rFP6xLXQ/O.png");
    let quanX = await loadImage("https://i.postimg.cc/HLbFqcJh/X.png");

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let temp = data.board[i][j].toString();
        let x = 54 + 366 * j;
        let y = 54 + 366 * i;

        if (temp == "1") {
          if (data.isX) cc.drawImage(quanO, x, y, 360, 360);
          else cc.drawImage(quanX, x, y, 360, 360);
        }

        if (temp == "2") {
          if (data.isX) cc.drawImage(quanX, x, y, 360, 360);
          else cc.drawImage(quanO, x, y, 360, 360);
        }
      }
    }

    fs.writeFileSync(path, canvas.toBuffer("image/png"));
    return [fs.createReadStream(path)];
  } catch (error) {
    console.error("Error in displayBoard:", error);
    throw new Error("Failed to generate game board image.");
  }
}

// --- Winner checks ---
function checkAIWon(data) {
  if (data.board[0][0] == data.board[1][1] && data.board[0][0] == data.board[2][2] && data.board[0][0] == 1) return true;
  if (data.board[0][2] == data.board[1][1] && data.board[0][2] == data.board[2][0] && data.board[0][2] == 1) return true;
  for (let i = 0; i < 3; ++i) {
    if (data.board[i][0] == data.board[i][1] && data.board[i][0] == data.board[i][2] && data.board[i][0] == 1) return true;
    if (data.board[0][i] == data.board[1][i] && data.board[0][i] == data.board[2][i] && data.board[0][i] == 1) return true;
  }
  return false;
}

function checkPlayerWon(data) {
  if (data.board[0][0] == data.board[1][1] && data.board[0][0] == data.board[2][2] && data.board[0][0] == 2) return true;
  if (data.board[0][2] == data.board[1][1] && data.board[0][2] == data.board[2][0] && data.board[0][2] == 2) return true;
  for (let i = 0; i < 3; ++i) {
    if (data.board[i][0] == data.board[i][1] && data.board[i][0] == data.board[i][2] && data.board[i][0] == 2) return true;
    if (data.board[0][i] == data.board[1][i] && data.board[0][i] == data.board[2][i] && data.board[0][i] == 2) return true;
  }
  return false;
}

// --- AI Solver ---
function solveAIMove({ depth, turn, data }) {
  if (checkAIWon(data)) return +1;
  if (checkPlayerWon(data)) return -1;

  let availablePoint = getAvailable(data);
  if (availablePoint.length == 0) return 0;

  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;

  for (let i = 0, length = availablePoint.length; i < length; i++) {
    let point = availablePoint[i];

    if (turn == 1) {
      placeMove({ point, player: 1, data });
      let currentScore = solveAIMove({ depth: depth + 1, turn: 2, data });
      max = Math.max(currentScore, max);
      if (currentScore >= 0 && depth == 0) AIMove = point;
      if (currentScore == 1) {
        data.board[point[0]][point[1]] = 0;
        break;
      }
      if (i == availablePoint.length - 1 && max < 0 && depth == 0) AIMove = point;
    } else if (turn == 2) {
      placeMove({ point, player: 2, data });
      let currentScore = solveAIMove({ depth: depth + 1, turn: 1, data });
      min = Math.min(currentScore, min);
      if (min == -1) {
        data.board[point[0]][point[1]] = 0;
        break;
      }
    }
    data.board[point[0]][point[1]] = 0;
  }
  return turn == 1 ? max : min;
}

function placeMove({ point, player, data }) {
  return (data.board[point[0]][point[1]] = player);
}

function getAvailable(data) {
  let availableMove = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (data.board[i][j] == 0) availableMove.push([i, j]);
    }
  }
  return availableMove;
}

function checkAvailableSpot(point, pointArray) {
  return pointArray.some((element) => element.toString() == point.toString());
}

function move(x, y, data) {
  let availablePoint = getAvailable(data);
  let playerMove = [x, y];
  if (!checkAvailableSpot(playerMove, availablePoint)) return "❌ 𝗧𝗵𝗶𝘀 𝗯𝗼𝘅 𝗶𝘀 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗰𝗵𝗲𝗰𝗸𝗲𝗱!";
  placeMove({ point: playerMove, player: 2, data });
  solveAIMove({ depth: 0, turn: 1, data });
  placeMove({ point: AIMove, player: 1, data });
}

function checkGameOver(data) {
  return getAvailable(data).length == 0 || checkAIWon(data) || checkPlayerWon(data);
}

function AIStart(data) {
  let point = [Math.round(Math.random()) * 2, Math.round(Math.random()) * 2];
  placeMove({ point, player: 1, data });
}

// --- Handle Reply ---
module.exports.handleReply = async function ({ api, event, handleReply }) {
  let { body, threadID, messageID, senderID } = event;
  if (!global.moduleData.tictactoe) global.moduleData.tictactoe = new Map();
  let data = global.moduleData.tictactoe.get(threadID);

  if (!data || data.gameOn == false || data.player != senderID) {
    return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n❌ 𝗡𝗼 𝗮𝗰𝘁𝗶𝘃𝗲 𝗴𝗮𝗺𝗲 𝗼𝗿 𝘆𝗼𝘂'𝗿𝗲 𝗻𝗼𝘁 𝘁𝗵𝗲 𝗽𝗹𝗮𝘆𝗲𝗿!\n\n≿━━━━༺❀༻━━━━≾", threadID, messageID);
  }

  let number = parseInt(body);
  if (isNaN(number) || number < 1 || number > 9) {
    return api.sendMessage("⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗰𝗲𝗹𝗹 𝗻𝘂𝗺𝗯𝗲𝗿! 𝗖𝗵𝗼𝗼𝘀𝗲 𝗯𝗲𝘁𝘄𝗲𝗲𝗻 𝟭-𝟵.", threadID, messageID);
  }

  let row = number < 4 ? 0 : number < 7 ? 1 : 2;
  let col = number % 3 == 0 ? 2 : (number % 3) - 1;

  let temp = move(row, col, data);
  let msg = "";

  if (checkGameOver(data)) {
    let gayban = ["😎 𝗬𝗼𝘂 𝘀𝗵𝗼𝘂𝗹𝗱 𝗾𝘂𝗶𝘁!", "😂 𝗡𝗼𝗼𝗯 𝗺𝗼𝘃𝗲!", "😈 𝗧𝗼𝗼 𝗲𝗮𝘀𝘆!", "😭 𝗪𝗵𝗮𝘁 𝗮 𝗹𝗼𝘀𝘀!"];
    if (checkAIWon(data)) msg = `❌ 𝗬𝗼𝘂 𝗹𝗼𝘀𝗲! ${gayban[Math.floor(Math.random() * gayban.length)]}`;
    else if (checkPlayerWon(data)) msg = "✅ 𝗬𝗼𝘂 𝘄𝗶𝗻! 🎉";
    else msg = "🤝 𝗜𝘁'𝘀 𝗮 𝘁𝗶𝗲!";
    global.moduleData.tictactoe.delete(threadID);
  }

  msg = msg || (temp == undefined ? "👉 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗮 𝗰𝗲𝗹𝗹 𝗻𝘂𝗺𝗯𝗲𝗿 (𝟭-𝟵)." : temp);

  try {
    api.sendMessage(
      { body: msg, attachment: await displayBoard(data) },
      threadID,
      (error, info) => {
        if (!error) {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
          });
        }
      },
      messageID
    );
  } catch (error) {
    api.sendMessage("⚠️ 𝗘𝗿𝗿𝗼𝗿 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗴𝗮𝗺𝗲 𝗯𝗼𝗮𝗿𝗱. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻.", threadID, messageID);
  }
};

// --- Run Command ---
module.exports.run = async function ({ api, event, args }) {
  let { threadID, messageID, senderID } = event;
  if (!global.moduleData.tictactoe) global.moduleData.tictactoe = new Map();
  let data = global.moduleData.tictactoe.get(threadID) || { gameOn: false, player: "" };

  let prefix = (global.data.threadData.get(threadID) || {}).PREFIX || global.config.PREFIX;
  let concak = `${prefix}${this.config.name}`;

  if (args.length == 0) {
    return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n📌 𝗣𝗹𝗲𝗮𝘀𝗲 𝘂𝘀𝗲: ${concak} [x/o/delete/continue]\n\n⚝──⭒─⭑─⭒──⚝`, threadID, messageID);
  }

  let command = args[0].toLowerCase();

  if (command == "delete") {
    global.moduleData.tictactoe.delete(threadID);
    return api.sendMessage("🗑 𝗧𝗶𝗰-𝗧𝗮𝗰-𝗧𝗼𝗲 𝗯𝗼𝗮𝗿𝗱 𝗿𝗲𝗺𝗼𝘃𝗲𝗱!", threadID, messageID);
  }

  if (command == "continue") {
    if (!data.gameOn || data.player != senderID) {
      return api.sendMessage(`❌ 𝗡𝗼 𝗮𝗰𝘁𝗶𝘃𝗲 𝗴𝗮𝗺𝗲! 𝗨𝘀𝗲 ${concak} [x/o] 𝘁𝗼 𝘀𝘁𝗮𝗿𝘁 𝗮 𝗻𝗲𝘄 𝗴𝗮𝗺𝗲.`, threadID, messageID);
    }
    try {
      api.sendMessage(
        { body: "👉 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗮 𝗰𝗲𝗹𝗹 𝗻𝘂𝗺𝗯𝗲𝗿 (𝟭-𝟵).", attachment: await displayBoard(data) },
        threadID,
        (error, info) => {
          if (!error) {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: senderID,
            });
          }
        },
        messageID
      );
    } catch (error) {
      api.sendMessage("⚠️ 𝗘𝗿𝗿𝗼𝗿 𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗴𝗮𝗺𝗲 𝗯𝗼𝗮𝗿𝗱. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻.", threadID, messageID);
    }
    return;
  }

  if (data.gameOn) {
    return api.sendMessage(`⚠️ 𝗔 𝗴𝗮𝗺𝗲 𝗶𝘀 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗮𝗰𝘁𝗶𝘃𝗲!\n\n▶️ ${concak} continue → 𝗖𝗼𝗻𝘁𝗶𝗻𝘂𝗲 𝗴𝗮𝗺𝗲\n▶️ ${concak} delete → 𝗘𝗿𝗮𝘀𝗲 𝗴𝗮𝗺𝗲`, threadID, messageID);
  }

  if (command != "x" && command != "o") {
    return api.sendMessage(`⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗹𝗲𝗰𝘁: ${concak} [x/o]`, threadID, messageID);
  }

  let newData = startBoard({ isX: command == "x", data });
  newData.player = senderID;
  global.moduleData.tictactoe.set(threadID, newData);

  let msg = command == "o" ? "✅ 𝗬𝗼𝘂 𝗴𝗼 𝗳𝗶𝗿𝘀𝘁!\n👉 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗮 𝗰𝗲𝗹𝗹 𝗻𝘂𝗺𝗯𝗲𝗿 (𝟭-𝟵)." : "🤖 𝗜 𝗴𝗼 𝗳𝗶𝗿𝘀𝘁!\n👉 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗮 𝗰𝗲𝗹𝗹 𝗻𝘂𝗺𝗯𝗲𝗿 (𝟭-𝟵).";

  if (command == "x") AIStart(newData);

  try {
    api.sendMessage(
      { body: msg, attachment: await displayBoard(newData) },
      threadID,
      (error, info) => {
        if (!error) {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
          });
        }
      },
      messageID
    );
  } catch (error) {
    api.sendMessage("⚠️ 𝗘𝗿𝗿𝗼𝗿 𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗴𝗮𝗺𝗲. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻.", threadID, messageID);
  }
};