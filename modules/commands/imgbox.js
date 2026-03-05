module.exports.config = {
    name: "imgbox",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Create an image of all members in the box",
    commandCategory: "Members",
    usages: "family <size> [#color-code] or family <size>\nEnter the desired avatar size of members and hex color code for the text (default black) using syntax:\n$family <size> <color-code> <title>\nWhere:\n•size: Size of each member's avatar\n•color-code: hex format color code\n•title: image title, default is group name\nExample: $family 200 #ffffff Brothers United\nIf size = 0, auto size will be applied, if no title is given then the title will be the box name",
    cooldowns: 5,
    dependencies: {
      "fs-extra": "", 
      "axios":"", 
      "canvas": "", 
      "jimp": "", 
      "node-superfetch": "",
      "chalk": ""
    }
};
module.exports.run = async ({ event, api, args }) => {
module.exports.circle = async (image) => {
    const jimp = global.nodemodule["jimp"];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
  }
  const jimp = global.nodemodule["jimp"];
  const Canvas = global.nodemodule["canvas"];
  const superfetch=global.nodemodule["node-superfetch"];
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const img = new Canvas.Image();
  function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };
  const { threadID, messageID } = event;
  var live = [], admin = [], i = 0;
  if(args[0] == 'help' || args[0] == '0' || args[0] == '-h') return api.sendMessage('≿━━━━༺❀༻━━━━≾\n\n𝑯𝑬𝑳𝑷 𝑪𝑹𝑬𝑨𝑻𝑬 𝑰𝑴𝑨𝑮𝑬 𝑩𝑶𝑿\n━━━━━━━━━━━━━━━━\n⚜ Usage: '+ this.config.name + ' [avatar size]' + ' [color-code]' + ' [group name (title)] || leave empty for auto info\n\n≿━━━━༺❀༻━━━━≾', threadID, messageID)
  /*============DOWNLOAD FONTS=============*/
  if(!fs.existsSync(__dirname+`/cache/data/TUVBenchmark.ttf`)) { 
      let downFonts = (await axios.get(`https://drive.google.com/u/0/uc?id=1NIoSu00tStE8bIpVgFjWt2in9hkiIzYz&export=download`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname+`/cache/data/TUVBenchmark.ttf`, Buffer.from(downFonts, "utf-8"));
    };
  /*===========BACKGROUND & AVATAR FRAMES==========*/
  var bg = ['https://i.imgur.com/P3QrAgh.jpg', 'https://i.imgur.com/RueGAGI.jpg', 'https://i.imgur.com/bwMjOdp.jpg', 'https://i.imgur.com/trR9fNf.jpg']
  var background = await Canvas.loadImage(bg[Math.floor(Math.random() * bg.length)]);
  var bgX = background.width;
  var bgY = background.height;
  var khungAvt = await Canvas.loadImage("https://i.imgur.com/gYxZFzx.png")
  const imgCanvas = Canvas.createCanvas(bgX, bgY);
  const ctx = imgCanvas.getContext('2d');
  ctx.drawImage(background, 0, 0, imgCanvas.width, imgCanvas.height);
  /*===============GET INFO GROUP CHAT==============*/
  var { participantIDs, adminIDs, name, userInfo } = await api.getThreadInfo(threadID)
  for(let idAD of adminIDs) { admin.push(idAD.id) };
  /*=====================REMOVE DEAD ID===================*/
  for(let idUser of userInfo) {
    if (idUser.gender != undefined) { live.push(idUser) }
  }
  /*======================CUSTOM====================*/
  let size, color, title
  var image = bgX*(bgY-200);
  var sizeParti = Math.floor(image/live.length);
  var sizeAuto = Math.floor(Math.sqrt(sizeParti));
  if(!args[0]) { size = sizeAuto; color = '#FFFFFF' ; title = encodeURIComponent(name) }
  else { size = parseInt(args[0]); color = args[1] || '#FFFFFF' ; title = args.slice(2).join(" ") || name; }
  /*===========DISTANCE============*/
  var l = parseInt(size/15), x = parseInt(l), y = parseInt(200), xcrop = parseInt(live.length*size), ycrop = parseInt(200+size);
  size = size-l*2;
  /*================CREATE PATH AVATAR===============*/
  api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n𝑪𝑹𝑬𝑨𝑻𝑰𝑵𝑮 𝑰𝑴𝑨𝑮𝑬...\n━━━━━━━━━━━━━━━━\n🍗 Estimated Members: ${participantIDs.length}\n🍠 Background Size: ${bgX} x ${bgY}\n🥑 Avatar Size: ${size}\n🥪 Color: ${color}\n\n⚝──⭒─⭑─⭒──⚝`,threadID, messageID);
  var pathAVT = (__dirname+`/cache/${Date.now()+10000}.png`)
  /*=================DRAW AVATAR MEMBERS==============*/
    for(let idUser of live) {
      console.log("Drawing: " + idUser.id);
      try { var avtUser = await superfetch.get(`https://graph.facebook.com/${idUser.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`) } 
      catch(e) { continue }
      if(x+size > bgX) { xcrop = x; x += (-x)+l; y += size+l; ycrop += size+l };
      if(ycrop > bgY) { ycrop += (-size); break };
      avtUser = avtUser.body;
      var avatar = await this.circle(avtUser);
      var avatarload = await Canvas.loadImage(avatar);
      img.src = avatarload;
      ctx.drawImage(avatarload, x, y, size, size);
      if(admin.includes(idUser.id)) { ctx.drawImage(khungAvt, x, y, size, size) };
      i++
      console.log("Done: " + idUser.id);
      x += parseInt(size+l);
    }
    /*==================DRAW TITLE==================*/
    Canvas.registerFont(__dirname+`/cache/data/TUVBenchmark.ttf`, { family: "TUVBenchmark"});
    ctx.font = "100px TUVBenchmark";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(decodeURIComponent(title), xcrop/2, 133);
    /*===================CUT IMAGE===================*/
    console.log(`Successfully drew ${i} avatars`)
    console.log(`Filtered ${participantIDs.length-i} inactive facebook users`)
    const cutImage = await jimp.read(imgCanvas.toBuffer());
    cutImage.crop(0, 0, xcrop, ycrop+l-30).writeAsync(pathAVT);
    await delay(300);
    /*====================SEND IMAGE==================*/ 
    return api.sendMessage({body: `≿━━━━༺❀༻━━━━≾\n\n𝑺𝑬𝑵𝑫𝑰𝑵𝑮 𝑰𝑴𝑨𝑮𝑬\n━━━━━━━━━━━━━━━━\n🍗 Total Members: ${i}\n🥪 Background Size: ${bgX} x ${bgY}\n🍠 Filtered ${participantIDs.length-i} inactive users\n\n≿━━━━༺❀༻━━━━≾`, attachment: fs.createReadStream(pathAVT)}, threadID, (error, info) =>{
      if (error) return api.sendMessage(`⚠️ An error occurred: ${error}`, threadID, () => fs.unlinkSync(pathAVT), messageID)
      console.log('Image sent successfully'); 
      fs.unlinkSync(pathAVT) }, messageID); 
}