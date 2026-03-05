const fs = require('fs-extra');
const axios = global.nodemodule["axios"];
const path = require("path");
const dataPath = path.resolve(__dirname, 'data', 'setlove.json');
const imagesPath = path.resolve(__dirname, 'data', 'setlove');

module.exports.config = {
    name: "setlove",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "",
    description: "Set love",
    commandCategory: "Love",
    usages: "setlove + |set @tag|check|del|edit|display",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onLoad = async () => {
    if (!await fs.pathExists(dataPath)) {
        await fs.ensureFile(dataPath);
        await fs.writeFile(dataPath, JSON.stringify([]));
    }
    if (!await fs.pathExists(imagesPath)) {
        await fs.mkdir(imagesPath);
    }
};

module.exports.run = async function ({ event, api, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const now = Date.now();
    const userImagesPath = path.resolve(imagesPath, senderID.toString());
    const doesExist = await fs.pathExists(userImagesPath);
    if (!doesExist) {
        await fs.mkdir(userImagesPath);
    }
    let loveData = [];
    try {
        loveData = JSON.parse(await fs.readFile(dataPath));
    } catch (error) {
        console.error("Error reading or parsing setlove.json:", error);
        loveData = [];
    }
    const command = args[0];
    if (command === "set") {
        if (Object.keys(mentions).length === 0) {
            return api.sendMessage("❎ Please tag someone to set love.", threadID, messageID);
        }
        const taggedUserID = Object.keys(mentions)[0];
        const taggedUserName = mentions[taggedUserID];
        const existingRelationship = loveData.find(relationship =>
            relationship.person1 === senderID || relationship.person2 === senderID ||
            relationship.person1 === taggedUserID || relationship.person2 === taggedUserID
        );
        if (existingRelationship) {
            const existingPartnerID = existingRelationship.person1 === senderID ? existingRelationship.person2 : existingRelationship.person1;
            const existingPartnerInfo = await api.getUserInfo(existingPartnerID);
            const existingPartnerName = existingPartnerInfo[existingPartnerID].name;

            if (existingRelationship.person1 === senderID || existingRelationship.person2 === senderID) {
                return api.sendMessage(`❎ You cannot cheat on your partner.`, threadID, messageID);
            } else {
                return api.sendMessage(`❎ You cannot steal ${existingPartnerName}'s partner.`, threadID, messageID);
            }
        }
        api.sendMessage({
            body: `${taggedUserName}, do you accept the love request from ${senderID}?\nBoth of you react to this message to accept!`,
            mentions: [{ tag: taggedUserName, id: taggedUserID }]
        }, threadID, (error, info) => {
            global.client.handleReaction.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                taggedUserID: taggedUserID,
                taggedUserName: taggedUserName,
                hasSenderReacted: false,
                hasTaggedUserReacted: false,
                type: "awaitReaction"
            });
        }, messageID);
    } else if (command === "check") {
        const relationship = loveData.find(rel =>
            rel.person1 === senderID || rel.person2 === senderID
        );
        if (relationship) {
            const partnerID = relationship.person1 === senderID ? relationship.person2 : relationship.person1;
            const partnerInfo = await api.getUserInfo(partnerID);
            const partnerName = partnerInfo[partnerID].name;
            const setloveDate = new Date(relationship.date);
            const duration = Math.floor((now - setloveDate.getTime()) / (1000 * 60));
            const months = Math.floor(duration / (60 * 24 * 30));
            const days = Math.floor((duration % (60 * 24 * 30)) / (60 * 24));
            const hours = Math.floor((duration % (60 * 24)) / 60);
            const minutes = duration % 60;
            const selectedImages = relationship.selectedImages || [];
            const images = await fs.readdir(userImagesPath);
            const attachments = selectedImages
                .filter(img => images.includes(img)) 
                .map(img => fs.createReadStream(path.resolve(userImagesPath, img)));
            return api.sendMessage({
                body: `💖 Your love with ${partnerName} has lasted ${months} months, ${days} days, ${hours} hours, ${minutes} minutes.`,
                attachment: attachments
            }, threadID, messageID);
        } else {
            return api.sendMessage("❎ You don't have a partner yet.", threadID, messageID);
        }        
    } else if (command === "del") {
        const relationship = loveData.find(rel =>
            rel.person1 === senderID || rel.person2 === senderID
        );
        if (!relationship) {
            return api.sendMessage("❎ You don't have a partner to cancel.", threadID, messageID);
        }
        const partnerID = relationship.person1 === senderID ? relationship.person2 : relationship.person1;
        const partnerName = (await api.getUserInfo(partnerID))[partnerID].name;
        api.sendMessage({
            body: `${partnerName}, do you agree to cancel the love set?\nReact to this message to agree.`,
            mentions: [{
                tag: partnerName,
                id: partnerID
            }]
        }, threadID, (error, info) => {
            global.client.handleReaction.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                partnerID: partnerID,
                partnerName: partnerName,
                type: "cancel"
            });
        }, messageID);
        setTimeout(async () => {
            let loveData = [];
            try {
                loveData = JSON.parse(await fs.readFile(dataPath));
            } catch (error) {
                console.error("Error reading or parsing setlove.json:", error);
            }
            loveData = loveData.filter(rel =>
                !(rel.person1 === senderID && rel.person2 === partnerID) &&
                !(rel.person1 === partnerID && rel.person2 === senderID)
            );
            const user1ImagesPath = path.resolve(imagesPath, senderID.toString());
            const user2ImagesPath = path.resolve(imagesPath, partnerID.toString());
            try {
                if (await fs.pathExists(user1ImagesPath)) {
                    await fs.remove(user1ImagesPath); 
                }
                if (await fs.pathExists(user2ImagesPath)) {
                    await fs.remove(user2ImagesPath); 
                }
            } catch (error) {
                console.error("Error deleting user album directories:", error);
            }
            await fs.writeFile(dataPath, JSON.stringify(loveData));
            api.sendMessage("🔄 Deleting the entire album...", threadID, messageID);
        }, 60 * 1000); 
    } else if (command === "album") {
        if (!await fs.pathExists(userImagesPath)) {
            return api.sendMessage("❎ You don't have any photos in the album.", threadID, messageID);
        }
        const images = await fs.readdir(userImagesPath);
        const attachments = images.map(file => fs.createReadStream(path.resolve(userImagesPath, file)));
        api.sendMessage({
            body: "Here is your photo album:",
            attachment: attachments
        }, threadID, messageID);
    } else if (command === "edit") {
        const relationship = loveData.find(rel =>
            rel.person1 === senderID || rel.person2 === senderID
        );
        if (!relationship) {
            return api.sendMessage("❎ You don't have a partner to edit the album.", threadID, messageID);
        }
        api.sendMessage("Please choose an option:\n1. Add photo\n2. Delete photo\n3. Replace photo", threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "editAlbum"
            });
        }, messageID);   
    } else if (command === "display") {
        const relationship = loveData.find(rel =>
            rel.person1 === senderID || rel.person2 === senderID
        );
        if (!relationship) {
            return api.sendMessage("❎ You don't have a partner yet.", threadID, messageID);
        }
        const images = await fs.readdir(userImagesPath);
        if (images.length === 0) {
            return api.sendMessage("❎ Your album is empty.", threadID, messageID);
        }
        const selectedImages = relationship.selectedImages || [];
        const imageList = images.map((img, index) => {
            const isSelected = selectedImages.includes(img);
            return `${index + 1}. ${img} - ${isSelected ? 'Selected ✅' : 'Not Selected ❌'}`;
        }).join("\n");
        const bodyMessage = `Choose the number corresponding to the photo you want to display:\n${imageList}`;
        const attachments = images.map(img => fs.createReadStream(path.resolve(userImagesPath, img)));
        api.sendMessage({
            body: bodyMessage,
            attachment: attachments
        }, threadID, messageID);
    } else {
        api.sendMessage("[ SET LOVE ]\n\n- setlove set @tag to set love\n- setlove check to check days together\n- setlove del to cancel love set\n- setlove album to view photo album.\n- setlove edit to add, remove or replace album.\n- setlove display to select photos to display.", threadID, messageID);
    }
};

module.exports.handleReaction = async ({ api, event, handleReaction }) => {
    const { threadID, messageID, userID } = event;
    if (handleReaction.type === "awaitReaction") {
        if (userID === handleReaction.author) {
            handleReaction.hasSenderReacted = true;
        }
        if (userID === handleReaction.taggedUserID) {
            handleReaction.hasTaggedUserReacted = true;
        }
        if (handleReaction.hasSenderReacted && handleReaction.hasTaggedUserReacted) {
            let loveData = [];
            try {
                loveData = JSON.parse(await fs.readFile(dataPath));
            } catch (error) {
                console.error("Error reading or parsing setlove.json:", error);
                loveData = [];
            }
            loveData.push({
                person1: handleReaction.author,
                person2: handleReaction.taggedUserID,
                date: new Date().toISOString()
            });
            await fs.writeFile(dataPath, JSON.stringify(loveData));
            api.sendMessage({
                body: `✅ Congratulations ${handleReaction.taggedUserName} and you are now in a relationship.`,
                mentions: [{ tag: handleReaction.taggedUserName, id: handleReaction.taggedUserID }]
            }, threadID, messageID);
        }
    } else if (handleReaction.type === "cancel") {
        const { author, partnerID } = handleReaction;
        if (userID !== author && userID !== partnerID) {
            return;
        }
        let loveData = [];
        try {
            loveData = JSON.parse(await fs.readFile(dataPath));
        } catch (error) {
            console.error("Error reading or parsing setlove.json:", error);
            loveData = [];
        }
        loveData = loveData.filter(rel =>
            !(rel.person1 === author && rel.person2 === partnerID) &&
            !(rel.person1 === partnerID && rel.person2 === author)
        );
        await fs.writeFile(dataPath, JSON.stringify(loveData));
        api.sendMessage("✅ Love set cancelled successfully.", threadID, messageID);
    }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body, attachments } = event;
    const userImagesPath = path.resolve(imagesPath, senderID.toString());
    let images = await fs.readdir(userImagesPath);
    switch (handleReply.type) {
        case "selectImage":
            const selectedIndex = parseInt(body) - 1;
            const selectedImage = handleReply.images[selectedIndex];
            if (!selectedImage) return api.sendMessage("Invalid photo number.", threadID, messageID);
            let loveData = [];
            try {
                loveData = JSON.parse(await fs.readFile(dataPath));
            } catch (error) {
                console.error("Error reading or parsing setlove.json:", error);
                loveData = [];
            }
            const relationship = loveData.find(rel =>
                rel.person1 === senderID || rel.person2 === senderID
            );
            if (relationship) {
                relationship.selectedImages = relationship.selectedImages || [];
                relationship.selectedImages.push(selectedImage);
                await fs.writeFile(dataPath, JSON.stringify(loveData));
            }
            api.sendMessage({
                body: `💖 Your love with ${partnerName} has lasted ${months} months, ${days} days, ${hours} hours, ${minutes} minutes.`,
                attachment: fs.createReadStream(path.resolve(userImagesPath, selectedImage))
            }, threadID, messageID);
            break;
        case "editAlbum":
            const choice = body.trim();
            if (choice === "1") {
                api.sendMessage("Please send a photo to add to the album.", threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "addImage"
                    });
                }, messageID);
            } else if (choice === "2") {
                if (images.length === 0) return api.sendMessage("Your album is empty, no photos to delete.", threadID, messageID);
                const imageList = images.map((img, index) => `${index + 1}. ${img}`).join("\n");
                api.sendMessage(`Choose the number corresponding to the photo to delete:\n${imageList}`, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "removeImage",
                        images: images
                    });
                }, messageID);
            } else if (choice === "3") {
                if (images.length === 0) return api.sendMessage("Your album is empty, no photos to replace.", threadID, messageID);
                const imageList = images.map((img, index) => `${index + 1}. ${img}`).join("\n");
                api.sendMessage(`Choose the number corresponding to the photo to replace:\n${imageList}`, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "replaceImage",
                        images: images
                    });
                }, messageID);
            } else {
                api.sendMessage("Invalid choice.", threadID, messageID);
            }
            break;
        case "addImage":
            if (attachments.length === 0 || attachments[0].type !== 'photo') {
                return api.sendMessage("Please send an image.", threadID, messageID);
            }
            const imageURL = attachments[0].url;
            const imageName = `image_${Date.now()}.png`; 
            const imagePath = path.resolve(userImagesPath, imageName);
            const downloadImage = (url, filepath) => {
                return new Promise((resolve, reject) => {
                    axios({
                        url,
                        responseType: 'stream'
                    }).then(response => {
                        const writer = fs.createWriteStream(filepath);
                        response.data.pipe(writer);
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    }).catch(reject);
                });
            };
            try {
                await downloadImage(imageURL, imagePath);
                api.sendMessage("✅ Photo added successfully!", threadID, messageID);
            } catch (error) {
                console.error("Error saving image:", error);
                api.sendMessage("❎ An error occurred while adding the photo. Please try again.", threadID, messageID);
            }            
            break;
        case "removeImage":
            const imageToRemove = handleReply.images[parseInt(body) - 1];
            if (!imageToRemove) return api.sendMessage("Invalid photo number.", threadID, messageID);
            await fs.unlink(path.resolve(userImagesPath, imageToRemove));
            api.sendMessage("✅ Photo deleted successfully.", threadID, messageID);
            break;
        case "replaceImage":
            const imageToReplace = handleReply.images[parseInt(body) - 1];
            if (!imageToReplace) return api.sendMessage("Invalid photo number.", threadID, messageID);
            api.sendMessage("Please send a new photo to replace.", threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "replaceWithNew",
                    imageToReplace: imageToReplace
                });
            }, messageID);
            break;
        case "replaceWithNew":
            if (attachments.length === 0 || attachments[0].type !== 'photo') {
                return api.sendMessage("Please send an image.", threadID, messageID);
            }
            const newImageURL = attachments[0].url;
            const oldImagePath = path.resolve(userImagesPath, handleReply.imageToReplace);
            const newImagePath = path.resolve(userImagesPath, `image_${Date.now()}.png`);
            await fs.unlink(oldImagePath); 
            const newImageStream = await axios.get(newImageURL, { responseType: 'stream' });
            const newWriter = fs.createWriteStream(newImagePath);
            newImageStream.data.pipe(newWriter);
            newWriter.on('finish', async () => {
                api.sendMessage("✅ Photo replaced successfully!", threadID, messageID);
            });
            newWriter.on('error', error => {
                console.error("Error replacing image:", error);
                api.sendMessage("❎ An error occurred while replacing the photo. Please try again.", threadID, messageID);
            });
            break;
    }
};