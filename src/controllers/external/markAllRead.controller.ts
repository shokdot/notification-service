import { FastifyReply } from "fastify";
import { markAllRead } from '@services/notification/index.js'
import { sendError, AuthRequest, AppError } from "@core/index.js";

const markReadHandler = async (request: AuthRequest, reply: FastifyReply) => {
	try {
		const { userId } = request;

		await markAllRead(userId);

		return reply.status(200).send({
			status: 'success',
			message: 'All notifications marked as read.',
		});

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default markReadHandler;
