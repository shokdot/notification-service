import { FastifyReply } from "fastify";
import { deleteNotification } from '@services/notification/index.js';
import { sendError, AuthRequest, AppError } from "@core/index.js";
import notificationByIdDTO from "src/dto/notification-by-id.dto.js";

const deleteNotificationHandler = async (request: AuthRequest<undefined, undefined, notificationByIdDTO>, reply: FastifyReply) => {
	try {
		const { id } = request.params;
		const { userId } = request;

		await deleteNotification(id, userId);

		return reply.status(200).send({
			status: 'success',
			message: 'Notification successfuly deleted.',
		});

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default deleteNotificationHandler;
