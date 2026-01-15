import { FastifyReply, FastifyRequest } from "fastify";
import { notificationSockets } from "src/wsManager/socketInstances.js";
import { sendError } from "@core/index.js";
import { BroadcastBody } from "src/dto/broadcast-body.dto.js";

const broadcastNotificationHandler = async (request: FastifyRequest<{ Body: BroadcastBody }>, reply: FastifyReply) => {
    try {
        const { type, message } = request.body;

        notificationSockets.broadcast({
            type,
            message,
            createdAt: new Date(),
        });

        return reply.status(200).send({
            status: 'success',
            message: 'Notification broadcasted successfully.',
        });

    } catch (error) {
        return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
    }
}

export default broadcastNotificationHandler;
