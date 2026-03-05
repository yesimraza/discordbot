module.exports.config = {
    name: "pakdb",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Raza + Fix",
    description: "Get Pakistani number details",
    commandCategory: "Utility",
    usages: "[number/cnic]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const axios = require("axios");
    const { threadID, messageID } = event;
    const input = args[0];

    if (!input) {
        return api.sendMessage(
            "⚠️ Please provide a CNIC or number!\nExample: /pakdb 4520890260257",
            threadID,
            messageID
        );
    }

    api.sendMessage("🔍 Fetching details...", threadID, messageID);

    try {
        const res = await axios.get(
            `https://app.findpakjobs.pk/api.php?username=wduser1&password=112233&number=${input}`
        );

        const data = res.data;

        if (!data || !data.names || data.names.length === 0) {
            return api.sendMessage(
                "❌ No details found for this input.",
                threadID,
                messageID
            );
        }

        let msg = "👤 **Record Details** 👤\n\n";

        msg += `👤 Name: ${data.names[0] || "N/A"}\n`;
        msg += `🆔 CNIC: ${data.cnics[0] || "N/A"}\n\n`;

        msg += "📞 Numbers:\n";
        if (data.numbers && data.numbers.length > 0) {
            data.numbers.forEach((num, index) => {
                msg += `${index + 1}. ${num}\n`;
            });
        } else {
            msg += "No numbers found\n";
        }

        msg += "\n🏠 Address:\n";
        msg += data.addresses && data.addresses[0]
            ? data.addresses[0]
            : "No address found";

        api.sendMessage(msg, threadID, messageID);

    } catch (err) {
        console.error("API Error:", err.message);
        api.sendMessage(
            "❌ Error fetching data. API may be down or invalid input.",
            threadID,
            messageID
        );
    }
};