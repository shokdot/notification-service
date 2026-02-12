import prisma from "src/utils/prismaClient.js";
import { notificationSockets } from "src/wsManager/socketInstances.js";

const TYPE_TO_PREF: Record<string, keyof Pick<
	import("@prisma/client").NotificationPreference,
	'gameInvites' | 'friendRequests' | 'matchResults' | 'systemUpdates'
>> = {
	game_invite: 'gameInvites',
	GAME_INVITE: 'gameInvites',
	friend_request: 'friendRequests',
	match_result: 'matchResults',
	system: 'systemUpdates',
};

const isPreferenceEnabled = async (userId: string, type: string): Promise<boolean> => {
	const prefKey = TYPE_TO_PREF[type];
	if (!prefKey) return true; // unknown types are always allowed

	const prefs = await prisma.notificationPreference.findUnique({
		where: { userId },
		select: { [prefKey]: true },
	});

	// No row means defaults apply; all defaults are true except systemUpdates
	if (!prefs) return prefKey !== 'systemUpdates';

	return (prefs as Record<string, boolean>)[prefKey];
};

const createNotification = async (userId: string, type: string, message: string) => {

	if (!(await isPreferenceEnabled(userId, type))) return;

	const notification = await prisma.notification.create({
		data: {
			userId,
			type,
			message
		},
		select: {
			id: true,
			type: true,
			message: true,
			isRead: true,
			createdAt: true,
		},
	});

	notificationSockets.send(userId, {
		id: notification.id,
		type: notification.type,
		message: notification.message,
		createdAt: notification.createdAt,
	});

};

export default createNotification;
