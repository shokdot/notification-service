import { notificationSockets } from 'src/wsManager/socketInstances.js';

const sendToUser = (userId: string, type: string, message: unknown) => {
	notificationSockets.send(userId, {
		type,
		message,
		createdAt: new Date()
	});
};

export default sendToUser;
