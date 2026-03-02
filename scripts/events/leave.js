const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "leave",
		version: "1.6",
		author: "Tawhid Ahmed",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			leaveType1: "tự rời",
			leaveType2: "bị kick",
			defaultLeaveMessage: "{userName} đã {type} khỏi nhóm"
		},
		en: {
			session1: "Morning ☀️",
			session2: "Noon 🌤️",
			session3: "Afternoon ⛅",
			session4: "Evening 🌙",
			leaveType1: "নিজে থেকেই বিদায় নিয়েছে। 🚶",
			leaveType2: "গ্রুপ থেকে রিমুভ করা হয়েছে। 🚪",
			defaultLeaveMessage: "╔═══════════════════╗\n   🚫 LEAVE NOTIFICATION 🗿\n╚═══════════════════╝\n\nইউজার: {userName}\nস্ট্যাটাস: {type}\n\nসময়: {session}\n\n© Powered by Tawhid Ahmed"
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType == "log:unsubscribe") {
			const { threadID } = event;
			const threadData = await threadsData.get(threadID);
			if (!threadData.settings.sendLeaveMessage)
				return;
			const { leftParticipantFbId } = event.logMessageData;
			if (leftParticipantFbId == api.getCurrentUserID())
				return;
			const hours = getTime("HH");

			const threadName = threadData.threadName;
			const userName = await usersData.getName(leftParticipantFbId);

			let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;
			
			const mentions = leaveMessage.match(/\{userNameTag\}/g) ? [{
				tag: userName,
				id: leftParticipantFbId
			}] : null;

			leaveMessage = leaveMessage
				.replace(/\{userName\}|\{userNameTag\}/g, userName)
				.replace(/\{type\}/g, leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2"))
				.replace(/\{threadName\}|\{boxName\}/g, threadName)
				.replace(/\{time\}/g, hours)
				.replace(/\{session\}/g, 
					hours <= 10 ? getLang("session1") : 
					hours <= 12 ? getLang("session2") : 
					hours <= 18 ? getLang("session3") : getLang("session4")
				);

			const form = {
				body: leaveMessage,
				mentions: mentions
			};

			if (threadData.data.leaveAttachment) {
				const files = threadData.data.leaveAttachment;
				const attachments = files.reduce((acc, file) => {
					acc.push(drive.getFile(file, "stream"));
					return acc;
				}, []);
				form.attachment = (await Promise.allSettled(attachments))
					.filter(({ status }) => status == "fulfilled")
					.map(({ value }) => value);
			}
			message.send(form);
		}
	}
};
