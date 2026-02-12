import prisma from "src/utils/prismaClient.js";

const DEFAULTS = {
	gameInvites: true,
	friendRequests: true,
	matchResults: true,
	systemUpdates: false,
	sounds: true,
};

const getPreferences = async (userId: string) => {
	const prefs = await prisma.notificationPreference.findUnique({
		where: { userId },
		select: {
			gameInvites: true,
			friendRequests: true,
			matchResults: true,
			systemUpdates: true,
			sounds: true,
		},
	});

	return prefs ?? DEFAULTS;
};

export default getPreferences;
