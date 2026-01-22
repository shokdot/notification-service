import { FastifyReply } from "fastify";
import { createNotification } from '@services/internal/index.js'
import { sendError, AuthRequest } from "@core/index.js";
import createNotificationDTO from "src/dto/create-notification.dto.js";

const createNotifcationHandler = async (request: AuthRequest<createNotificationDTO>, reply: FastifyReply) => {
	try {
		const { userId, type, message } = request.body;

		await createNotification(userId, type, message);

		return reply.status(200).send({
			status: 'success',
			message: 'Notification successfuly created.',
		});

	} catch (error) {
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
}

export default createNotifcationHandler;
