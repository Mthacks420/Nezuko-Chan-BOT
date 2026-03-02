module.exports = {
  config: {
    name: "ts",
    version: "2.0.0",
    author: "TawHid_Bbz",
    role: 0,
    description: "Unsend bot's message by replying with 'ts'",
    category: "system",
    usePrefix: false // এটি প্রিফিক্স ছাড়া কাজ করতে সাহায্য করবে
  },

  onStart: async function ({ api, event, message }) {
    const { messageReply, senderID } = event;

    // যদি কোনো মেসেজে রিপ্লাই দেওয়া না হয়
    if (!messageReply) {
      return message.reply("বেবি, বটের যে মেসেজটি কাটতে চাও সেটিতে রিপ্লাই দিয়ে 'ts' লেখো! 🧛🏻‍♀️");
    }

    // চেক করবে মেসেজটি বটের কি না
    if (messageReply.senderID != api.getCurrentUserID()) {
      return message.reply("আমি শুধু নিজের মেসেজই আনসেন্ট করতে পারি বেবি! অন্যের মনের খবর আমি জানি না। 😉");
    }

    // আনসেন্ট করার আসল কাজ
    return api.unsendMessage(messageReply.messageID, (err) => {
      if (err) return message.reply("মেসেজটি আনসেন্ট করতে পারছি না বেবি! 🌸");
      
      // আনসেন্ট হওয়ার পর একটি ছোট্ট টেক্সট (ঐচ্ছিক)
      console.log("Message unsent successfully by TawHid_Bbz");
    });
  }
};
