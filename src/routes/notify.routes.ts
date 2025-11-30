import { FastifyInstance } from "fastify";
import { basic } from '@schemas/index.js'
import {
	createNotifcationHandler,
	getNotificationsHandler,
	markReadHandler,
	markAllReadHandler,
	deleteNotificationHandler
} from '@controllers/index.js';

export default async function notifyRoutes(app: FastifyInstance): Promise<void> {
	app.get('/', basic.getNotifications, getNotificationsHandler);
	app.post('/', basic.createNotification, createNotifcationHandler);
	app.patch('/:id/read', basic.markRead, markReadHandler);
	app.patch('/read-all', basic.markAllRead, markAllReadHandler);
	app.delete('/:id', basic.deleteNotification, deleteNotificationHandler);
}
