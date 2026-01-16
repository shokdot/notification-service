import { FastifyInstance } from "fastify";
import { basic } from '@schemas/index.js'
import {
	getNotificationsHandler,
	markReadHandler,
	markAllReadHandler,
	deleteNotificationHandler,
} from '@controllers/external/index.js';

export default async function notifyRoutes(app: FastifyInstance): Promise<void> {
	app.get('/', basic.getNotifications, getNotificationsHandler);
	app.patch('/:id/read', basic.markRead, markReadHandler);
	app.patch('/read-all', basic.markAllRead, markAllReadHandler);
	app.delete('/:id', basic.deleteNotification, deleteNotificationHandler);
}
