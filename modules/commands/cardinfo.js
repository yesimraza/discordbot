module.exports.config = {
    name: "cardinfo",
    version: "0.0.1",
    hasPermssion: 0,
    credits: "Kashif Raza",
    description: "Generate user info card with various background styles",
    commandCategory: "Members",
    cooldowns: 5
};

module.exports.circle = async (image) => {
    const jimp = global.nodemodule["jimp"];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
};

module.exports.run = async ({ event, api, args, Currencies, Users }) => {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");

    const { threadID, messageID, senderID } = event;
    var tpk = [
        "https://i.imgur.com/dZ3BoHv.png",
    ];
    let image = [];
    for (let i = 0; i < 1; i++) {
        const stream = (await axios.get(tpk[i], {
            responseType: "stream"
        })).data;
        image.push(stream);
    }
    const msg = {
        body: `⚝──⭒─⭑─⭒──⚝
1. Cardinfo with cute anime background 😻
2. Cardinfo with black background 🖤
3. Cardinfo with white-green user background 💙
4. Official white-pink background 💖
5. Official purple-pink background 💜
6. Card information with anime theme 💓
7. Official green-yellow background 💚
8. Cardinfo with outdoor background 🌍
9. Cardinfo with starry background 🌟
10. Cardinfo with Tet yellow-red background 🧧
11. Cardinfo with war background 🔫
12. Cardinfo with white-pink background 🤍
13. Cardinfo with mechanical background 🔧
14. Cardinfo with Facebook white-green background 🌐
15. Cardinfo user info V3 🌸
⚠️ Reply to this message with the number of the style you want to create
💝 There are currently 15 cardinfo styles, feel free to choose one by Kashif Raza
⚝──⭒─⭑─⭒──⚝`,
        attachment: image
    };
    return api.sendMessage(msg, event.threadID, (error, info) => {
        global.client.handleReply.push({
            type: "choosee",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
        });
    });
};

module.exports.handleReply = async function ({
    args,
    event,
    Users,
    api,
    handleReply,
    Currencies,
    __GLOBAL
}) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");
    const nameUser = (await Users.getData(event.senderID)).name || (await Users.getInfo(event.senderID)).name;
    let data = (await Currencies.getData(event.senderID)).ghepTime;

    let uid = event.senderID; // Default UID to senderID

    switch (handleReply.type) {
        case "choosee": {
            switch (event.body) {
                case "1": {
                    const fonts = "/cache/Play-Bold.ttf";
                    const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
                    const fontsLink = 20;
                    const fontsInfo = 28;
                    const colorName = "#00FF00";
                    let { senderID, threadID, messageID } = event;
                    const { loadImage, createCanvas } = require("canvas");
                    const fs = global.nodemodule["fs-extra"];
                    const axios = global.nodemodule["axios"];
                    const Canvas = global.nodemodule["canvas"];
                    let pathImg = __dirname + `/cache/${senderID}123${threadID}.png`;
                    let pathAvata = __dirname + `/cache/avtuserrd.png`;

                    const res = await api.getUserInfoV2(event.senderID);
                    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
                    let bg = (
                        await axios.get(encodeURI(`https://imgur.com/kSfS1wX.png`), {
                            responseType: "arraybuffer",
                        })
                    ).data;
                    fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
                    avataruser = await this.circle(pathAvata);
                    fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

                    if (!fs.existsSync(__dirname + `${fonts}`)) {
                        let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
                        fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
                    }

                    let baseImage = await loadImage(pathImg);
                    let baseAvata = await loadImage(avataruser);
                    let canvas = createCanvas(baseImage.width, baseImage.height);
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(baseAvata, 50, 130, 270, 270);
                    if (!res.location || res.location === "Không công khai") res.location = "Not public";
                    if (!res.birthday || res.birthday === "Không công khai") res.birthday = "Not public";
                    if (!res.relationship_status || res.relationship_status === "Không công khai") res.relationship_status = "Not public";
                    if (!res.follow || res.follow === "Không công khai") res.follow = "Not public";
                    var gender = res.gender == 'male' ? "Male" : res.gender == 'female' ? "Female" : "Not public";
                    var birthday = res.birthday ? `${res.birthday}` : "Not public";
                    var love = res.relationship_status ? `${res.relationship_status}` : "Not public";
                    var location = res.location ? `${res.location}` : "Not public";
                    var hometown = res.hometown.name ? `${res.hometown.name}` : "Hidden";
                    Canvas.registerFont(__dirname + `${fonts}`, {
                        family: "Play-Bold"
                    });
                    ctx.font = `${fontsInfo}px Play-Bold`;
                    ctx.fillStyle = "#D3D3D3";
                    ctx.textAlign = "start";
                    fontSize = 22;
                    ctx.fillText(`Full Name: ${res.name}`, 410, 172);
                    ctx.fillStyle = "#99CCFF";
                    ctx.textAlign = "start";
                    fontSize = 22;
                    ctx.fillText(`Gender: ${gender}`, 410, 208);
                    ctx.fillStyle = "#FFFFE0";
                    ctx.textAlign = "start";
                    fontSize = 22;
                    ctx.fillText(`Followers: ${res.follow} followers`, 410, 244);
                    ctx.fillStyle = "#FFE4E1";
                    ctx.textAlign = "start";
                    fontSize = 22;
                    ctx.fillText(`Relationship: ${love}`, 410, 281);
                    ctx.fillStyle = "#9AFF9A";
                    ctx.textAlign = "start";
                    fontSize = 22;
                    ctx.fillText(`Birthday: ${birthday}`, 410, 320);
                    ctx.fillStyle = "#FF6A6A";
                    ctx.textAlign = "start";
                    fontSize = 22;
                    ctx.fillText(`Location: ${hometown}`, 410, 357);
                    ctx.fillStyle = "#EEC591";
                    ctx.textAlign = "start";
                    fontSize = 22;
                    ctx.fillText(`Facebook UID: ${uid}`, 410, 397);
                    ctx.font = `${fontsLink}px Play-Bold`;
                    ctx.fillStyle = "#FFBBFF";
                    ctx.textAlign = "start";
                    fontSize = 23;
                    ctx.fillText(`Facebook Link: ${res.link}`, 30, 450);
                    ctx.beginPath();
                    const imageBuffer = canvas.toBuffer();
                    fs.writeFileSync(pathImg, imageBuffer);
                    fs.removeSync(pathAvata);
                    var tpk = `⚝──⭒─⭑─⭒──⚝
😻=== CARDINFO CUTE ===😻
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${res.name}
🎎 Gender: ${gender}
🔰 Followers: ${res.follow}
💖 Relationship: ${love}
🎂 Birthday: ${birthday}
🌍 Location: ${hometown}
🔗 Facebook UID: ${uid}
🌐 Facebook Link: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Successfully created cardinfo for you, try other styles by Kashif Raza
⚝──⭒─⭑─⭒──⚝`;
                    return api.sendMessage({ body: tpk, attachment: fs.createReadStream(pathImg) },
                        threadID,
                        () => fs.unlinkSync(pathImg),
                        messageID
                    );
                }
                case "2": {
                    const sendWaiting = false;
                    const textWaiting = "Creating image, please wait a moment";
                    const fonts = "/cache/Play-Bold.ttf";
                    const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
                    const fontsLink = 28;
                    const fontsInfo = 35;
                    const colorName = "#00FFFF";
                    let { senderID, threadID, messageID } = event;
                    const { loadImage, createCanvas } = require("canvas");
                    const fs = global.nodemodule["fs-extra"];
                    const axios = global.nodemodule["axios"];
                    const Canvas = global.nodemodule["canvas"];
                    let pathImg = __dirname + `/cache/1.png`;
                    let pathAvata = __dirname + `/cache/2.png`;

                    const res = await api.getUserInfoV2(event.senderID);
                    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
                    let bg = (
                        await axios.get(encodeURI(`https://i.imgur.com/rqbC4ES.jpg`), {
                            responseType: "arraybuffer",
                        })
                    ).data;
                    fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
                    avataruser = await this.circle(pathAvata);
                    fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

                    if (!fs.existsSync(__dirname + `${fonts}`)) {
                        let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
                        fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
                    }

                    let baseImage = await loadImage(pathImg);
                    let baseAvata = await loadImage(avataruser);
                    let canvas = createCanvas(baseImage.width, baseImage.height);
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(baseAvata, 910, 465, 229, 229);
                    var gender = res.gender == 'male' ? "Male" : res.gender == 'female' ? "Female" : "Not public";
                    var birthday = res.birthday ? `${res.birthday}` : "Hidden";
                    var love = res.relationship_status ? `${res.relationship_status}` : "Hidden";
                    var location = res.location.name ? `${res.location.name}` : "Hidden";
                    var hometown = res.hometown.name ? `${res.hometown.name}` : "Hidden";
                    Canvas.registerFont(__dirname + `${fonts}`, {
                        family: "Play-Bold"
                    });
                    ctx.font = `${fontsInfo}px Play-Bold`;
                    ctx.fillStyle = "#00FFFF";
                    ctx.textAlign = "start";
                    fontSize = 60;
                    ctx.fillText(`Name: ${res.name}`, 340, 560);
                    ctx.fillText(`Gender: ${gender}`, 1245, 448);
                    ctx.fillText(`Followers: ${res.follow}`, 1245, 505);
                    ctx.fillText(`Relationship: ${love}`, 1245, 559);
                    ctx.fillText(`Birthday: ${birthday}`, 1245, 616);
                    ctx.fillText(`Location: ${location}`, 1245, 668);
                    ctx.fillText(`Hometown: ${hometown}`, 1245, 723);
                    ctx.font = `${fontsLink}px Play-Bold`;
                    ctx.fillStyle = "#FFCC33";
                    ctx.textAlign = "start";
                    fontSize = 60;
                    ctx.fillText(`UID: ${uid}`, 840, 728);
                    ctx.beginPath();
                    ctx.font = `${fontsLink}px TUVBenchmark`;
                    ctx.fillStyle = "#00FF00";
                    ctx.textAlign = "start";
                    fontSize = 60;
                    ctx.fillText(`» Profile: ${res.link}`, 41, 720);
                    ctx.beginPath();
                    const imageBuffer = canvas.toBuffer();
                    fs.writeFileSync(pathImg, imageBuffer);
                    fs.removeSync(pathAvata);
                    var tpk = `⚝──⭒─⭑─⭒──⚝
🌸=== INFO CARD ===🌸
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${res.name}
🎎 Gender: ${gender}
🔰 Followers: ${res.follow}
💖 Relationship: ${love}
🎂 Birthday: ${birthday}
🌍 Location: ${hometown}
🔗 Facebook UID: ${uid}
🌐 Facebook Link: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Successfully created cardinfo for you, try other styles by Kashif Raza
⚝──⭒─⭑─⭒──⚝`;
                    return api.sendMessage({ body: tpk, attachment: fs.createReadStream(pathImg) },
                        threadID,
                        () => fs.unlinkSync(pathImg),
                        messageID
                    );
                }
                case "3": {
                    const sendWaiting = false;
                    const textWaiting = "Creating image, please wait a moment";
                    const fonts = "/cache/Play-Bold.ttf";
                    const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
                    const fontsLink = 40;
                    const fontsInfo = 28;
                    const colorName = "#000000";
                    let { senderID, threadID, messageID } = event;
                    const { loadImage, createCanvas } = require("canvas");
                    const fs = global.nodemodule["fs-extra"];
                    const axios = global.nodemodule["axios"];
                    const Canvas = global.nodemodule["canvas"];
                    let pathImg = __dirname + `/cache/1.png`;
                    let pathAvata = __dirname + `/cache/2.png`;

                    const res = await api.getUserInfoV2(event.senderID);
                    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
                    let bg = (
                        await axios.get(encodeURI(`https://i.imgur.com/zET6S0F.png`), {
                            responseType: "arraybuffer",
                        })
                    ).data;
                    fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
                    avataruser = await this.circle(pathAvata);
                    fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

                    if (!fs.existsSync(__dirname + `${fonts}`)) {
                        let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
                        fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
                    }

                    let baseImage = await loadImage(pathImg);
                    let baseAvata = await loadImage(avataruser);
                    let canvas = createCanvas(baseImage.width, baseImage.height);
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(baseAvata, 71, 65, 300, 300);
                    var gender = res.gender == 'male' ? "Male" : res.gender == 'female' ? "Female" : "Not public";
                    var birthday = res.birthday ? `${res.birthday}` : "Not public";
                    var love = res.relationship_status ? `${res.relationship_status}` : "Not public";
                    var location = res.location.name ? `${res.location.name}` : "Not public";
                    var hometown = res.hometown.name ? `${res.hometown.name}` : "Not public";
                    Canvas.registerFont(__dirname + `${fonts}`, {
                        family: "Play-Bold"
                    });
                    ctx.font = `${fontsInfo}px Play-Bold`;
                    ctx.fillStyle = "#000000";
                    ctx.textAlign = "start";
                    fontSize = 20;
                    ctx.fillText(`${gender}`, 555, 208);
                    ctx.fillText(`${res.follow}`, 555, 244);
                    ctx.fillText(`${love}`, 555, 281);
                    ctx.fillText(`${birthday}`, 555, 320);
                    ctx.fillText(`${location}`, 555, 357);
                    ctx.fillText(`${uid}`, 555, 397);
                    ctx.fillText(`${res.link}`, 180, 468);
                    ctx.font = `${fontsLink}px Play-Bold`;
                    ctx.fillStyle = "#000000";
                    ctx.textAlign = "start";
                    fontSize = 20;
                    ctx.fillText(`${res.name}`, 650, 150);
                    ctx.beginPath();
                    const imageBuffer = canvas.toBuffer();
                    fs.writeFileSync(pathImg, imageBuffer);
                    fs.removeSync(pathAvata);
                    var tpk = `⚝──⭒─⭑─⭒──⚝
🧸=== CARDINFO USER ===🧸
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${res.name}
🎎 Gender: ${gender}
🔰 Followers: ${res.follow}
💖 Relationship: ${love}
🎂 Birthday: ${birthday}
🌍 Location: ${location}
🔗 Facebook UID: ${uid}
🌐 Facebook Link: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Successfully created cardinfo for you, try other styles by Kashif Raza
⚝──⭒─⭑─⭒──⚝`;
                    return api.sendMessage({ body: tpk, attachment: fs.createReadStream(pathImg) },
                        threadID,
                        () => fs.unlinkSync(pathImg),
                        messageID
                    );
                }
                case "4": {
                    const fonts = "/cache/Play-Bold.ttf";
                    const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
                    const fontsLink = 20;
                    const fontsInfo = 28;
                    const colorName = "#000000";
                    let { senderID, threadID, messageID } = event;
                    const { loadImage, createCanvas } = require("canvas");
                    const fs = global.nodemodule["fs-extra"];
                    const axios = global.nodemodule["axios"];
                    const Canvas = global.nodemodule["canvas"];
                    let pathImg = __dirname + `/cache/${senderID}123${threadID}.png`;
                    let pathAvata = __dirname + `/cache/avtuserrd.png`;

                    if (event.type == "message_reply") { uid = event.messageReply.senderID; }
                    else uid = event.senderID;
                    const res = await api.getUserInfoV2(event.senderID);
                    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
                    let bg = (
                        await axios.get(encodeURI(`https://i.imgur.com/C8yIgMZ.png`), {
                            responseType: "arraybuffer",
                        })
                    ).data;
                    fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
                    avataruser = await this.circle(pathAvata);
                    fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

                    if (!fs.existsSync(__dirname + `${fonts}`)) {
                        let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
                        fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
                    }

                    let baseImage = await loadImage(pathImg);
                    let baseAvata = await loadImage(avataruser);
                    let canvas = createCanvas(baseImage.width, baseImage.height);
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(baseAvata, 610, 83, 255, 255);
                    if (!res.location || res.location === "Không Có Dữ Liệu") res.location = "Not public";
                    if (!res.birthday || res.birthday === "Không Có Dữ Liệu") res.birthday = "Not public";
                    if (!res.relationship_status || res.relationship_status === "Không Có Dữ Liệu") res.relationship_status = "Not public";
                    if (!res.follow || res.follow === "Không Có Dữ Liệu") res.follow = "Not public";
                    var gender = res.gender == 'male' ? "Male" : res.gender == 'female' ? "Female" : "Not public";
                    var birthday = res.birthday ? `${res.birthday}` : "Not public";
                    var love = res.relationship_status ? `${res.relationship_status}` : "Not public";
                    var location = res.location ? `${res.location}` : "Not public";
                    var hometown = res.hometown.name ? `${res.hometown.name}` : "Hidden";
                    Canvas.registerFont(__dirname + `${fonts}`, {
                        family: "Play-Bold"
                    });
                    ctx.font = `${fontsInfo}px Play-Bold`;
                    ctx.fillStyle = "#000000";
                    ctx.textAlign = "start";
                    fontSize = 29;
                    ctx.fillText(`${res.name}`, 111, 160);
                    ctx.fillText(`${gender}`, 111, 320);
                    ctx.fillText(`${res.follow}`, 111, 240);
                    ctx.fillText(`${love}`, 111, 200);
                    ctx.fillText(`${birthday}`, 111, 280);
                    ctx.fillText(`${hometown}`, 111, 360);
                    ctx.fillText(`${uid}`, 1010, 460);
                    ctx.font = `${fontsLink}px Play-Bold`;
                    ctx.fillStyle = "#000000";
                    ctx.textAlign = "start";
                    fontSize = 20;
                    ctx.fillText(`${res.link}`, 145, 470);
                    ctx.beginPath();
                    const imageBuffer = canvas.toBuffer();
                    fs.writeFileSync(pathImg, imageBuffer);
                    fs.removeSync(pathAvata);
                    var tpk = `⚝──⭒─⭑─⭒──⚝
2️⃣=== CARDINFO USERV2 ===2️⃣
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${res.name}
🎎 Gender: ${gender}
🔰 Followers: ${res.follow}
💖 Relationship: ${love}
🎂 Birthday: ${birthday}
🌍 Location: ${hometown}
🔗 Facebook UID: ${uid}
🌐 Facebook Link: ${res.link}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Successfully created cardinfo for you, try other styles by Kashif Raza
⚝──⭒─⭑─⭒──⚝`;
                    return api.sendMessage({ body: tpk, attachment: fs.createReadStream(pathImg) },
                        threadID,
                        () => fs.unlinkSync(pathImg),
                        messageID
                    );
                }
            }
        }
    }
};