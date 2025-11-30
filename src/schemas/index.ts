import '@fastify/swagger';
import getNotificationsSchema from './get.schema.js';
import createNotificationSchema from './create.schema.js';
import markReadSchema from './markRead.schema.js';
import markAllReadSchema from './markAll.schema.js';
import deleteNotificationSchema from './delete.schema.js';

export const basic = {
	getNotifications: getNotificationsSchema,
	createNotification: createNotificationSchema,
	markRead: markReadSchema,
	markAllRead: markAllReadSchema,
	deleteNotification: deleteNotificationSchema
};
