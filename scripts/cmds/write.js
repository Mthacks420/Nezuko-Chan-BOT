const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const mahmhd = async () => {
    try {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
    } catch (e) {
        return null;
    }
};

module.exports = {
    config: {
        name: "write",
        aliases: ["wr", "লিখুন"],
        version: "1.7",
        author: "TawHid_Bbz",
        countDown: 5,
        role: 0,
        description: {
            bn: "ছবির ওপর রঙিন টেক্সট লিখুন",
            en: "Write colored text on a replied image"
        },
        category: "image",
        guide: {
            bn: '{pn} <color_code> - <text>: ছবির রিপ্লাইয়ে লিখুন'
                + '\n{pn} list: কালার কোডগুলোর লিস্ট দেখুন'
                + '\nউদাহরণ: {pn} r - Hello Baby',
            en: '{pn} <color_code> - <text>: Reply to an image'
                + '\n{pn} list: See available color codes'
                + '\nExample: {pn} r - Hello Baby'
        }
    },

    langs: {
        bn: {
            colorList: "🎨 সহজ কালার কোডসমূহ:\n%1\n\nডিফল্ট 'white' হবে।",
            noReply: "× বেবি, ছবিতে রিপ্লাই দিয়ে কমান্ডটি দাও!",
            noText: "× ছবিতে কি লিখবো? (যেমন: r - text)",
            apiError: "⚠️ | এপিআই এই মুহূর্তে বন্ধ আছে।",
            error: "× সমস্যা হয়েছে: %1। TawHid_Bbz এর সাথে যোগাযোগ করো।"
        },
        en: {
            colorList: "🎨 Short codes:\n%1\n\nDefault is white.",
            noReply: "× Baby, reply to an image first!",
            noText: "× Provide text! (Example: r - text)",
            apiError: "⚠️ | API unavailable.",
            error: "× Failed: %1. Contact Author."
        }
    },

    onStart: async function ({ api, event, args, message, getLang }) {
        // এখানে আগে বাড়তি একটি } ছিল যা আমি সরিয়ে দিয়েছি
        const colorMap = {
            b: "black", w: "white", r: "red", bl: "blue",
            g: "green", y: "yellow", o: "orange", p: "purple", pk: "pink"
        };

        if (args[0]?.toLowerCase() === "list") {
            const list = Object.entries(colorMap).map(([s, f]) => `${s} → ${f}`).join("\n");
            return message.reply(getLang("colorList", list));
        }

        if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments[0].type !== "photo") {
            return message.reply(getLang("noReply"));
        }

        let input = args.join(" ").trim();
        let color = "white";
        let text = input;

        if (input.includes(" - ")) {
            const parts = input.split(" - ");
            color = colorMap[parts[0].trim().toLowerCase()] || parts[0].trim();
            text = parts.slice(1).join(" - ").trim();
        }

        if (!text) return message.reply(getLang("noText"));

        const imageUrl = event.messageReply.attachments[0].url;
        const cacheDir = path.join(__dirname, "cache");
        const tempPath = path.join(cacheDir, `write_${Date.now()}.png`);

        try {
            await fs.ensureDir(cacheDir);
            const baseApi = await mahmhd();
            if (!baseApi) return message.reply(getLang("apiError"));

            const apiUrl = `${baseApi}/api/write?imageUrl=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(text)}&color=${encodeURIComponent(color)}`;
            const response = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 20000 });

            await fs.writeFile(tempPath, Buffer.from(response.data));

            return message.reply({
                attachment: fs.createReadStream(tempPath)
            }, () => {
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            });

        } catch (err) {
            console.error("Write error:", err);
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            return message.reply(getLang("error", err.message));
        }
    }
};
