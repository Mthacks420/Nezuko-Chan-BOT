const { getTime } = global.utils;

module.exports = {
	config: {
		name: "warn",
		version: "2.5",
		author: "Tawhid Ahmed", // তোমার নাম এখানে
		countDown: 5,
		role: 1, // শুধু এডমিনরা ওয়ার্ন দিতে পারবে
		description: {
			en: "Warn members with a Sigma style! 3 warns = Ban."
		},
		category: "System",
		guide: {
			en: "{pn} @tag <reason> / reply to warn a member"
		}
	},

	langs: {
		en: {
			list: "📋 [ 𝗪𝗮𝗿𝗻𝗲𝗱 𝗟𝗶𝘀𝘁 ] 📋\n━━━━━━━━━━━━━━━━━━\n%1\n\n💡 Use \"%2warn info @tag\" to see details.",
			listBan: "🚫 [ 𝗕𝗮𝗻𝗻𝗲𝗱 𝗟𝗶𝘀𝘁 ] 🚫\n━━━━━━━━━━━━━━━━━━\n%1",
			listEmpty: "✨ গ্রুপে এখন পর্যন্ত কোনো অপরাধী পাওয়া যায়নি সোনা!",
			listBanEmpty: "✨ ব্যান লিস্ট একদম ফাঁকা!",
			invalidUid: "⚠️ কার তথ্য দেখতে চাও সোনা? ঠিকমতো আইডি বা ট্যাগ দাও।",
			noData: "✅ এই ইউজারের কোনো অপরাধের রেকর্ড নেই।",
			noPermission: "❌ এই পাওয়ার শুধু Tawhid Ahmed আর তার এডমিনদের আছে!",
			invalidUid2: "⚠️ কার ব্যান সরাবো? আইডি ঠিকমতো দাও সোনা।",
			notBanned: "⚠️ ইউজার %1 তো ব্যান লিস্টেই নেই!",
			unbanSuccess: "✅ ইউজার [%1 | %2]-কে মাফ করে দেওয়া হলো। এবার ভালো হয়ে যেও!",
			noPermission2: "❌ ওয়ার্নিং সরানোর ক্ষমতা তোমার নেই বেবি!",
			invalidUid3: "⚠️ কাকে মাফ করতে চাও? ট্যাগ বা আইডি দাও।",
			noData2: "⚠️ এই ইউজারের কোনো ওয়ার্নিং ডাটা নেই।",
			notEnoughWarn: "❌ এই ইউজারের মাত্র %2 বার ওয়ার্নিং আছে।",
			unwarnSuccess: "✅ ইউজারের %1 নম্বর ওয়ার্নিং তুলে নেওয়া হলো।",
			noPermission3: "❌ সব ডাটা রিসেট করার ক্ষমতা শুধু বস Tawhid Ahmed-এর আছে!",
			resetWarnSuccess: "✅ সব ওয়ার্নিং ডাটা ডাস্টবিনে ফেলে দিয়েছি সোনা!",
			noPermission4: "❌ কাউকে ওয়ার্ন করার আগে এডমিন হয়ে আসো!",
			invalidUid4: "⚠️ যাকে শাসন করতে চাও তাকে ট্যাগ করো বা তার মেসেজে রিপ্লাই দাও।",
			warnSuccess: "🔥 [ 𝗠𝗢𝗦𝗧 𝗪𝗔𝗡𝗧𝗘𝗗 ] 🔥\n━━━━━━━━━━━━━━━━━━\n⚠️ ইউজার %1-কে %2 বার ওয়ার্ন করা হয়েছে!\n🕵️ 𝗥𝗲𝗮𝘀𝗼𝗻: %4\n📅 𝗗𝗮𝘁𝗲: %5\n\n🚫 ৩ বার ওয়ার্ন হওয়ায় একে লাথি মেরে গ্রুপ থেকে বের করে দেওয়া হলো!",
			noPermission5: "⚠️ বস, আমাকে এডমিন করো না হলে তো আমি লাথি মারতে পারবো না!",
			warnSuccess2: "⚠️ [ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 𝗔𝗟𝗘𝗥𝗧 ] ⚠️\n━━━━━━━━━━━━━━━━━━\n👤 𝗨𝘀𝗲𝗿: %1\n🔢 𝗪𝗮𝗿𝗻 𝗖𝗼𝘂𝗻𝘁: %2/3\n🕵️ 𝗥𝗲𝗮𝘀𝗼𝗻: %4\n\n💡 সোনা %1, আর মাত্র %6 বার ভুল করলে তোমাকে সোজা চাঁদে পাঠিয়ে দিবো! 🚀",
			hasBanned: "⚠️ এই ইউজার আগে থেকেই ব্যান করা আছে:\n%1",
			failedKick: "⚠️ একে লাথি মারতে গিয়ে আমার পা ব্যথা হয়ে গেছে (Error):\n%1",
			userNotInGroup: "⚠️ ইউজার \"%1\" তো পালিয়েছে!"
		}
	},

	onStart: async function ({ message, api, event, args, threadsData, usersData, prefix, role, getLang }) {
		if (!args[0]) return message.reply(`💡 ব্যবহার নিয়ম:\n1. ${prefix}warn @tag <reason>\n2. ${prefix}warn list\n3. ${prefix}warn info @tag\n4. ${prefix}warn unban <id>`);
		const { threadID, senderID } = event;
		const warnList = await threadsData.get(threadID, "data.warn", []);

		switch (args[0]) {
			case "list": {
				const msg = await Promise.all(warnList.map(async user => {
					const { uid, list } = user;
					const name = await usersData.getName(uid);
					return `👤 ${name}: ${list.length} বার`;
				}));
				message.reply(msg.length ? getLang("list", msg.join("\n"), prefix) : getLang("listEmpty"));
				break;
			}
			case "listban": {
				const result = (await Promise.all(warnList.map(async user => {
					const { uid, list } = user;
					if (list.length >= 3) {
						const name = await usersData.getName(uid);
						return `🚫 ${name} (${uid})`;
					}
				}))).filter(item => item);
				message.reply(result.length ? getLang("listBan", result.join("\n")) : getLang("listBanEmpty"));
				break;
			}
			case "info": {
				let uids, msg = "🔍 [ 𝗪𝗮𝗿𝗻 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 ] 🔍\n━━━━━━━━━━━━━━━━━━\n";
				if (Object.keys(event.mentions).length) uids = Object.keys(event.mentions);
				else if (event.messageReply?.senderID) uids = [event.messageReply.senderID];
				else if (args.slice(1).length) uids = args.slice(1);
				else uids = [senderID];

				msg += (await Promise.all(uids.map(async uid => {
					if (isNaN(uid)) return null;
					const dataWarnOfUser = warnList.find(user => user.uid == uid);
					const userName = await usersData.getName(uid);
					let txt = `👤 User: ${userName}\n🆔 ID: ${uid}`;

					if (!dataWarnOfUser || dataWarnOfUser.list.length == 0) txt += `\n✨ ${getLang("noData")}`;
					else {
						txt += `\n📉 Total Warns: ${dataWarnOfUser.list.length}` + dataWarnOfUser.list.reduce((acc, warn, index) => {
							return acc + `\n  ${index + 1}. Reason: ${warn.reason}\n     Time: ${warn.dateTime}`;
						}, "");
					}
					return txt;
				}))).filter(msg => msg).join("\n\n");
				message.reply(msg + `\n\n👤 𝗢𝘄𝗻𝗲𝗿: 𝗧𝗮𝘄𝗵𝗶𝗱 𝗔𝗵𝗺𝗲𝗱\n🎀 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: 𝗡𝗲𝘇𝘂𝗸𝗼 𝗖𝗵𝗮𝗻`);
				break;
			}
			case "unban": {
				if (role < 1) return message.reply(getLang("noPermission"));
				let uidUnban = Object.keys(event.mentions)[0] || event.messageReply?.senderID || args[1];
				if (!uidUnban || isNaN(uidUnban)) return message.reply(getLang("invalidUid2"));
				const index = warnList.findIndex(user => user.uid == uidUnban && user.list.length >= 3);
				if (index === -1) return message.reply(getLang("notBanned", uidUnban));
				warnList.splice(index, 1);
				await threadsData.set(threadID, warnList, "data.warn");
				const userName = await usersData.getName(uidUnban);
				message.reply(getLang("unbanSuccess", uidUnban, userName));
				break;
			}
			case "reset": {
				if (role < 1) return message.reply(getLang("noPermission3"));
				await threadsData.set(threadID, [], "data.warn");
				message.reply(getLang("resetWarnSuccess"));
				break;
			}
			default: {
				if (role < 1) return message.reply(getLang("noPermission4"));
				let reason, uid;
				if (event.messageReply) {
					uid = event.messageReply.senderID;
					reason = args.join(" ").trim();
				} else if (Object.keys(event.mentions)[0]) {
					uid = Object.keys(event.mentions)[0];
					reason = args.join(" ").replace(event.mentions[uid], "").trim();
				} else return message.reply(getLang("invalidUid4"));
				
				if (!reason) reason = "No reason (সিগমা রুলস লঙ্ঘন)";
				const dataWarnOfUser = warnList.find(item => item.uid == uid);
				const dateTime = getTime("DD/MM/YYYY hh:mm:ss");
				if (!dataWarnOfUser) warnList.push({ uid, list: [{ reason, dateTime, warnBy: senderID }] });
				else dataWarnOfUser.list.push({ reason, dateTime, warnBy: senderID });

				await threadsData.set(threadID, warnList, "data.warn");
				const times = dataWarnOfUser?.list.length ?? 1;
				const userName = await usersData.getName(uid);

				if (times >= 3) {
					message.reply(getLang("warnSuccess", userName, times, uid, reason, dateTime, prefix), () => {
						api.removeUserFromGroup(uid, threadID);
					});
				} else {
					message.reply(getLang("warnSuccess2", userName, times, uid, reason, dateTime, 3 - times));
				}
			}
		}
	}
};
