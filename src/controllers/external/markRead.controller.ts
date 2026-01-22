import { FastifyReply } from "fastify";
import { sendError, AuthRequest, AppError } from "@core/index.js";
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

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default markReadHandler;
