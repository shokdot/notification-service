import { FastifyInstance } from "fastify";
import { internal } from '@schemas/index.js'
import {
	createNotifcationHandler,
	broadcastNotificationHandler,
	notifyFriendsStatusChangeHandler
} from '@controllers/internal/index.js';

export default async function internalRoutes(app: FastifyInstance): Promise<void> {
	app.post('/', internal.createNotification, createNotifcationHandler);
	app.post('/broadcast', internal.broadcastNotification, broadcastNotificationHandler);
	app.post('/status/notify-friends', internal.notifyFriendsStatusChange, notifyFriendsStatusChangeHandler);
}
