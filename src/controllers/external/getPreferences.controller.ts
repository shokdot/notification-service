import { FastifyReply } from "fastify";
import { getPreferences } from '@services/notification/index.js'
import { sendError, AuthRequest, AppError } from "@core/index.js";

const getPreferencesHandler = async (request: AuthRequest, reply: FastifyReply) => {
	try {
		const { userId } = request;
		const data = await getPreferences(userId);

		return reply.status(200).send({
			status: 'success',
			data,
		});

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default getPreferencesHandler;
