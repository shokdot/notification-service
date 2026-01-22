import { FastifyReply } from "fastify";
import { sendError, AuthRequest } from "@core/index.js";
import { markRead } from '@services/notification/index.js';
import notificationByIdDTO from "src/dto/notification-by-id.dto.js";

const markReadHandler = async (request: AuthRequest<undefined, undefined, notificationByIdDTO>, reply: FastifyReply) => {
	try {
		const { userId } = request;
		const { id } = request.params;

		await markRead(id, userId);

		return reply.status(200).send({
			status: 'success',
			message: 'Notification marked as read successfully.',
		});

	} catch (error) {
		switch (error.code) {
			case 'NOT_FOUND':
				return sendError(reply, 404, error.code, 'The requested notification does not exist.');
			default:
				return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
		}
	}
};

export default markReadHandler;
