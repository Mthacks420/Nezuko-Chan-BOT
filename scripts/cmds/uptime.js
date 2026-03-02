module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt", "up"],
    version: "2.0.0",
    author: "TawHid_Bbz",
    role: 0,
    category: "system",
    guide: {
      en: "Use {p}uptime to see how long the King has been active."
    }
  },

  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const uptime = process.uptime();

      const days = Math.floor(uptime / (60 * 60 * 24));
      const hours = Math.floor((uptime % (60 * 60 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      const msg = `👑 [ 𝗕𝗼𝘁 𝗦𝘁𝗮𝘁𝘂𝘀 𝗔𝗹𝗲𝗿𝘁 ] 👑\n━━━━━━━━━━━━━━━━━━\n🚀 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeString}\n👥 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀: ${allUsers.length.toLocaleString()}\n🏘️ 𝗧𝗼𝘁𝗮𝗹 𝗚𝗿𝗼𝘂𝗽𝘀: ${allThreads.length.toLocaleString()}\n✨ 𝗦𝘁𝗮𝘁𝘂𝘀: Running Smoothly\n━━━━━━━━━━━━━━━━━━\n👤 𝗢𝘄𝗻𝗲𝗿: 𝗧𝗮𝘄𝗵𝗶𝗱 𝗔𝗵𝗺𝗲𝗱\n🎀 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: 𝗡𝗲𝘇𝘂𝗸𝗼 𝗖𝗵𝗮𝗻`;

      // একটা রিয়্যাকশন দিয়ে মেসেজটা পাঠানো
      api.setMessageReaction("⚡", event.messageID, () => {}, true);
      return api.sendMessage(msg, event.threadID, event.messageID);
      
    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ আপটাইম চেক করতে গিয়ে হোঁচট খেলাম সোনা!", event.threadID, event.messageID);
    }
  }
};
