const fs = require('fs-extra');
const path = require('path');
const ratingsFilePath = path.resolve(__dirname, 'ratings.json');
const usersFilePath = path.resolve(__dirname, 'users.json');

module.exports.config = {
    name: "rating",
    version: "1.0.6",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Rate bot quality and check scores.",
    commandCategory: "Members",
    usages: "[add|check]",
    cooldowns: 5
};

// Read ratings from file
async function getRatings() {
    try {
        const data = await fs.readFile(ratingsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save ratings to file
async function saveRatings(ratings) {
    await fs.writeFile(ratingsFilePath, JSON.stringify(ratings, null, 2));
}

// Read users info from file
async function getUsers() {
    try {
        const data = await fs.readFile(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Save users info to file
async function saveUsers(users) {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

module.exports.run = async function({ api, event, args }) {
    const { threadID, senderID } = event;
    const command = args[0] ? args[0].toLowerCase() : '';
    const ratings = await getRatings();
    const users = await getUsers();

    if (command === 'add') {
        if (users[senderID]) {
            return api.sendMessage("❌ **You already rated. You can only rate once.**", threadID);
        }

        // Ask user to provide stars and feedback
        return api.sendMessage({
            body: "✨ **Please reply to this message with a star rating from 1⭐ to 10⭐ and your feedback about the bot.**\n\nExample: `5 - Awesome bot!`",
        }, threadID, (err, info) => {
            if (err) return console.error(err);

            global.client.handleReply.push({
                type: 'rating',
                name: this.config.name,
                messageID: info.messageID,
                author: senderID
            });
        });
    }

    if (command === 'check') {
        // Check ratings and calculate average
        const ratings = await getRatings();
        const totalRatings = ratings.length;
        const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
        const averageRating = totalRatings > 0 ? totalStars / totalRatings : 0;

        const result = `📊 **Total Ratings:** ${totalRatings}\n` +
                       `⭐ **Total Stars:** ${totalStars}\n` +
                       `📈 **Average Score:** ${averageRating.toFixed(2)}\n\n` +
                       `📝 **Feedback:**\n${totalRatings > 0 ? ratings.map(r => `⭐ ${r.stars} Stars - ${r.feedback}`).join('\n') : 'No ratings yet.'}`;

        return api.sendMessage(result, threadID);
    }

    return api.sendMessage("❌ **Invalid command. Usage:** `rating [add|check]`", threadID);
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { body, threadID, senderID, messageID } = event;

    if (senderID !== handleReply.author) return;

    // Parse stars and feedback
    const [stars, ...feedbackParts] = body.split('-').map(part => part.trim());
    const parsedStars = parseInt(stars);
    const feedback = feedbackParts.join('-').trim();

    if (isNaN(parsedStars) || parsedStars < 1 || parsedStars > 10) {
        return api.sendMessage(`❌ **Invalid star rating. Please choose between 1 and 10.**`, threadID, messageID);
    }

    // Save rating
    const ratings = await getRatings();
    ratings.push({ stars: parsedStars, feedback: feedback });
    await saveRatings(ratings);

    // Mark user as rated
    const users = await getUsers();
    users[senderID] = true;
    await saveUsers(users);

    return api.sendMessage("✅ **Thank you for your feedback! Your rating has been recorded.**", threadID, () => {
        api.deleteMessage(handleReply.messageID);
        api.deleteMessage(messageID);
    });
};