import { FastifyInstance } from "fastify";
import { internal } from '@schemas/index.js'
import {
    createNotifcationHandler,
    broadcastNotificationHandler
} from '@controllers/internal/index.js';

export default async function internalRoutes(app: FastifyInstance): Promise<void> {
    app.post('/', internal.createNotification, createNotifcationHandler);
    app.post('/broadcast', internal.broadcastNotification, broadcastNotificationHandler);
}
