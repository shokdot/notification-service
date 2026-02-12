import { FastifyReply } from "fastify";
import { updatePreferences } from '@services/notification/index.js';
import { sendError, AuthRequest, AppError } from "@core/index.js";
import UpdatePreferencesDTO from "src/dto/preferences.dto.js";

const updatePreferencesHandler = async (request: AuthRequest<UpdatePreferencesDTO>, reply: FastifyReply) => {
	try {
		const { userId } = request;
		await updatePreferences(userId, request.body);

		return reply.status(200).send({
			status: 'success',
			message: 'Notification preferences updated successfully.',
		});

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default updatePreferencesHandler;
