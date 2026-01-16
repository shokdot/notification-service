import { FastifyReply, FastifyRequest } from "fastify";
import { broadcastNotification } from "@services/internal/index.js";
import { BroadcastBody } from "src/dto/broadcast-body.dto.js";
import { sendError } from "@core/index.js";

const broadcastNotificationHandler = async (request: FastifyRequest<{ Body: BroadcastBody }>, reply: FastifyReply) => {
    try {
        const { type, message } = request.body;

        broadcastNotification(type, message);

        return reply.status(200).send({
            status: 'success',
            message: 'Notification broadcasted successfully.',
        });

    } catch (error) {
        return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
    }
}

export default broadcastNotificationHandler;
