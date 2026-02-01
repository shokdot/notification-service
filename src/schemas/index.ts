import '@fastify/swagger';
import getNotificationsSchema from './get.schema.js';
import createNotificationSchema from './create.schema.js';
import markReadSchema from './markRead.schema.js';
import markAllReadSchema from './markAll.schema.js';
import deleteNotificationSchema from './delete.schema.js';
import broadcastNotificationSchema from './broadcast.schema.js';
import notifyFriendsStatusChangeSchema from './notifyFriendsStatusChange.schema.js';
import sendToUserSchema from './sendToUser.schema.js';

export const basic = {
	getNotifications: getNotificationsSchema,
	markRead: markReadSchema,
	markAllRead: markAllReadSchema,
	deleteNotification: deleteNotificationSchema
};

export const internal = {
	createNotification: createNotificationSchema,
	broadcastNotification: broadcastNotificationSchema,
	notifyFriendsStatusChange: notifyFriendsStatusChangeSchema,
	sendToUser: sendToUserSchema
}
