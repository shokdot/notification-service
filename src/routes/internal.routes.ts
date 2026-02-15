import { FastifyInstance } from "fastify";
import { internal } from '@schemas/index.js'
import {
	createNotifcationHandler,
	broadcastNotificationHandler,
	notifyFriendsStatusChangeHandler,
	sendToUserHandler,
	deleteUserHandler
} from '@controllers/internal/index.js';

export default async function internalRoutes(app: FastifyInstance): Promise<void> {
	app.post('/', internal.createNotification, createNotifcationHandler);
	app.post('/broadcast', internal.broadcastNotification, broadcastNotificationHandler);
	app.post('/send', internal.sendToUser, sendToUserHandler as any);
	app.post('/status/notify-friends', internal.notifyFriendsStatusChange, notifyFriendsStatusChangeHandler);
	app.delete('/:userId', deleteUserHandler as any);
}
