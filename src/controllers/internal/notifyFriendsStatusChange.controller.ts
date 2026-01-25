import { FastifyReply, FastifyRequest } from "fastify";
import { notifyFriendsStatusChange } from '@services/internal/index.js';
import { sendError, AppError } from "@core/index.js";
import { NotifyStatusChangeDTO } from "src/dto/notify-status-change.dto.js";

const notifyFriendsStatusChangeHandler = async (
	request: FastifyRequest<{ Body: NotifyStatusChangeDTO }>,
	reply: FastifyReply
) => {
	try {
		const { userId, status } = request.body;

		if (!userId || !status) {
			return sendError(reply, 400, 'INVALID_REQUEST', 'userId and status are required');
		}

		await notifyFriendsStatusChange(userId, status);

		reply.status(200).send({
			status: 'success',
			message: 'Friends notified successfully'
		});

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default notifyFriendsStatusChangeHandler;
