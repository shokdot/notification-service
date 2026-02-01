import { FastifyReply, FastifyRequest } from 'fastify';
import { sendToUser } from '@services/internal/index.js';
import { SendToUserBody } from 'src/dto/send-to-user.dto.js';
import { sendError, AppError } from '@core/index.js';

const sendToUserHandler = async (request: FastifyRequest<{ Body: SendToUserBody }>, reply: FastifyReply) => {
	try {
		const { userId, type, message } = request.body;
		sendToUser(userId, type, message);
		return reply.status(200).send({
			status: 'success',
			message: 'Notification sent to user.'
		});
	} catch (error: unknown) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default sendToUserHandler;
