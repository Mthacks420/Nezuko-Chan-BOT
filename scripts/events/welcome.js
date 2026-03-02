const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.7",
		author: "Tawhid Ahmed",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "🌸 Nezuko Chan has arrived!\nPrefix bot: %1\nType %1help to see commands.",
			multiple1: "bạn",
			multiple2: "các bạn",
			defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
		},
		en: {
			session1: "Morning ☀️",
			session2: "Noon 🌤️",
			session3: "Afternoon ⛅",
			session4: "Evening 🌙",
			welcomeMessage: "╔═══════════════════╗\n   🌸 NEZUKO CHAN ONLINE ✨\n╚═══════════════════╝\n\nThank you for inviting me! ❤️\n⚙️ Bot Prefix: %1\n📖 Type %1help for commands.\n\nEnjoy your stay! 🎀",
			multiple1: "new member",
			multiple2: "new members",
			defaultWelcomeMessage: "╔═══════════════════╗\n   WELCOME TO OUR GROUP ✨\n╚═══════════════════╝\n\nHello {userName}! 👋\n\nWelcome {multiple} to {boxName} 🎀\nHave a wonderful {session}! 😊\n\n© Powered by Tawhid Ahmed"
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe") {
			const hours = getTime("HH");
			const { threadID } = event;
			const { nickNameBot } = global.GoatBot.config;
			const prefix = global.utils.getPrefix(threadID);
			const dataAddedParticipants = event.logMessageData.addedParticipants;

			// if new member is bot
			if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
				if (nickNameBot)
					api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
				return message.send(getLang("welcomeMessage", prefix));
			}

			// if new member:
			if (!global.temp.welcomeEvent[threadID])
				global.temp.welcomeEvent[threadID] = {
					joinTimeout: null,
					dataAddedParticipants: []
				};

			global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
			clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

			global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
				const threadData = await threadsData.get(threadID);
				if (threadData.settings.sendWelcomeMessage == false)
					return;
				const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
				const dataBanned = threadData.data.banned_ban || [];
				const threadName = threadData.threadName;
				const userName = [],
					mentions = [];
				let multiple = dataAddedParticipants.length > 1;

				for (const user of dataAddedParticipants) {
					if (dataBanned.some((item) => item.id == user.userFbId))
						continue;
					userName.push(user.fullName);
					mentions.push({
						tag: user.fullName,
						id: user.userFbId
					});
				}

				if (userName.length == 0) return;
				let { welcomeMessage = getLang("defaultWelcomeMessage") } =
					threadData.data;
				const form = {
					mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
				};
				welcomeMessage = welcomeMessage
					.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
					.replace(/\{boxName\}|\{threadName\}/g, threadName)
					.replace(
						/\{multiple\}/g,
						multiple ? getLang("multiple2") : getLang("multiple1")
					)
					.replace(
						/\{session\}/g,
						hours <= 10
							? getLang("session1")
							: hours <= 12
								? getLang("session2")
								: hours <= 18
									? getLang("session3")
									: getLang("session4")
					);

				form.body = welcomeMessage;

				if (threadData.data.welcomeAttachment) {
					const files = threadData.data.welcomeAttachment;
					const attachments = files.reduce((acc, file) => {
						acc.push(drive.getFile(file, "stream"));
						return acc;
					}, []);
					form.attachment = (await Promise.allSettled(attachments))
						.filter(({ status }) => status == "fulfilled")
						.map(({ value }) => value);
				}
				message.send(form);
				delete global.temp.welcomeEvent[threadID];
			}, 1500);
		}
	}
};
